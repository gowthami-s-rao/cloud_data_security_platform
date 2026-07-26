import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_USERS, 
  INITIAL_CLOUD_PROVIDERS, 
  INITIAL_POLICIES, 
  INITIAL_FILES, 
  INITIAL_KEYS, 
  INITIAL_JIT_REQUESTS, 
  INITIAL_TELEMETRY, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_THREATS, 
  INITIAL_REPORTS 
} from './src/data/initialData';
import { 
  detectAndRedactPII, 
  encryptAES256, 
  decryptAES256, 
  generateSHA256, 
  generateDigitalSignature, 
  generateWatermark 
} from './src/utils/crypto';
import { User, FileItem, JITKeyRequest, AuditLog, SecurityTelemetryEvent, PolicyRule } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory persistent database store for the prototype session
  let users: User[] = [...INITIAL_USERS];
  let cloudProviders = [...INITIAL_CLOUD_PROVIDERS];
  let policies: PolicyRule[] = [...INITIAL_POLICIES];
  let files: FileItem[] = [...INITIAL_FILES];
  let encryptionKeys = [...INITIAL_KEYS];
  let jitRequests: JITKeyRequest[] = [...INITIAL_JIT_REQUESTS];
  let telemetry: SecurityTelemetryEvent[] = [...INITIAL_TELEMETRY];
  let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  let threats = [...INITIAL_THREATS];
  let reports = [...INITIAL_REPORTS];

  // Helper log function
  const addAuditLog = (actor: string, role: any, action: string, resource: string, policyDecision: 'PERMIT' | 'DENY', ip: string, location: string) => {
    const log: AuditLog = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      resource,
      policyDecision,
      ipAddress: ip,
      location,
      cryptoFingerprint: `FINGERPRINT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };
    auditLogs.unshift(log);
  };

  const addTelemetry = (source: any, severity: any, eventType: string, userEmail: string, ip: string, location: string, details: string) => {
    const event: SecurityTelemetryEvent = {
      id: `tel-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      source,
      severity,
      eventType,
      userEmail,
      ipAddress: ip,
      location,
      details,
      status: 'Logged'
    };
    telemetry.unshift(event);
  };

  // ----------------------------------------------------
  // REST API ROUTES
  // ----------------------------------------------------

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'Cloud Data Security Platform v2.4' });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      addTelemetry('Auth Engine', 'Warning', 'Failed Login Attempt', email, '198.51.100.99', 'Unknown', 'User not found in user directory.');
      return res.status(401).json({ success: false, message: 'Invalid credentials or user account does not exist.' });
    }

    if (user.status === 'Locked') {
      addTelemetry('Auth Engine', 'Critical', 'Locked Account Login Attempt', email, user.ipAddress, user.location, 'Attempted login to locked account.');
      return res.status(403).json({ success: false, message: 'Account is locked due to multiple security violations. Contact Security Administrator.' });
    }

    // Success login flow
    addTelemetry('Auth Engine', 'Info', 'Successful Login', user.email, user.ipAddress, user.location, `User ${user.name} authenticated successfully with JWT.`);
    addAuditLog(user.name, user.role, 'JWT_AUTHENTICATION_SUCCESS', 'Auth Service', 'PERMIT', user.ipAddress, user.location);

    res.json({
      success: true,
      token: `jwt-token-securesaas-${Date.now()}-${user.id}`,
      user: {
        ...user,
        role: role || user.role, // Allow switching role for live demo testing
        mfaVerified: user.mfaEnabled ? false : true
      }
    });
  });

  // Auth: Verify MFA OTP
  app.post('/api/auth/verify-mfa', (req, res) => {
    const { userId, otp } = req.body;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // OTP "123456" or any 6-digit code for prototype
    if (otp && otp.length === 6) {
      user.mfaVerified = true;
      addTelemetry('Auth Engine', 'Info', 'MFA OTP Verified', user.email, user.ipAddress, user.location, '2FA Authenticator token verified.');
      addAuditLog(user.name, user.role, 'MFA_CHALLENGE_SUCCESS', 'MFA Provider', 'PERMIT', user.ipAddress, user.location);
      return res.json({ success: true, message: 'MFA verified successfully', user });
    }

    res.status(400).json({ success: false, message: 'Invalid 6-digit verification code' });
  });

  // Auth: Users List
  app.get('/api/auth/users', (req, res) => {
    res.json(users);
  });

  // Cloud Providers
  app.get('/api/cloud/providers', (req, res) => {
    res.json(cloudProviders);
  });

  // Policies: Get & Create
  app.get('/api/policies', (req, res) => {
    res.json(policies);
  });

  app.post('/api/policies', (req, res) => {
    const newPolicy: PolicyRule = {
      id: `pol-${Date.now().toString().slice(-4)}`,
      name: req.body.name || 'New Custom Policy',
      version: 'v1.0',
      cloudProvider: req.body.cloudProvider || 'AWS',
      action: req.body.action || 'ALLOW',
      subjectRole: req.body.subjectRole || ['Administrator'],
      resourceType: req.body.resourceType || 'All Resources',
      conditions: req.body.conditions || {},
      enabled: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    policies.unshift(newPolicy);
    addTelemetry('Policy Engine', 'Info', 'Policy Created', 'admin@securesaas.io', '127.0.0.1', 'Local', `New policy rule created: ${newPolicy.name}`);
    res.json({ success: true, policy: newPolicy });
  });

  // Dynamic ABAC Decision Engine Endpoint
  app.post('/api/abac/evaluate', (req, res) => {
    const { 
      role, 
      department, 
      location, 
      deviceType, 
      time, 
      securityClearance, 
      dataClassification, 
      resourceName 
    } = req.body;

    let permit = true;
    const rulesEvaluated: string[] = [];
    const denyReasons: string[] = [];

    // Rule 1: Clearance vs Data Classification Check
    const clearanceLevel = { 'Unclassified': 0, 'Confidential': 1, 'Secret': 2, 'Top Secret': 3 }[securityClearance as string] || 0;
    const requiredLevel = { 'Public': 0, 'Internal': 1, 'Confidential': 2, 'Highly Confidential': 3 }[dataClassification as string] || 0;

    rulesEvaluated.push(`Security Clearance Mismatch Check: User (${securityClearance}) vs Resource (${dataClassification})`);
    if (clearanceLevel < requiredLevel) {
      permit = false;
      denyReasons.push(`Insufficient Security Clearance: User clearance '${securityClearance}' is lower than required resource classification '${dataClassification}'.`);
    }

    // Rule 2: Device Trust Policy
    rulesEvaluated.push(`Device Trust Check: (${deviceType})`);
    if (dataClassification === 'Highly Confidential' && deviceType === 'Personal Device') {
      permit = false;
      denyReasons.push(`Device Policy Violation: 'Highly Confidential' data cannot be accessed from a 'Personal Device'. Company Laptop required.`);
    }

    // Rule 3: Geofence / Location Policy
    rulesEvaluated.push(`Geofence Location Verification: (${location})`);
    const restrictedLocations = ['Unknown Country', 'Anonymized VPN'];
    if (restrictedLocations.includes(location)) {
      permit = false;
      denyReasons.push(`Geofence Policy Violation: Request originated from untrusted or VPN IP (${location}).`);
    }

    // Rule 4: Guest Role Restrictions
    if (role === 'Guest User' && (dataClassification === 'Confidential' || dataClassification === 'Highly Confidential')) {
      permit = false;
      denyReasons.push(`Role Restriction: Guest User role is prohibited from accessing Confidential or Highly Confidential records.`);
    }

    const decision = permit ? 'PERMIT' : 'DENY';

    // Log decision
    addAuditLog(
      `Evaluator (${role})`,
      role,
      'ABAC_EVALUATION',
      resourceName || 'Resource',
      decision,
      '103.21.124.50',
      location || 'Unknown'
    );

    res.json({
      decision,
      permit,
      rulesEvaluated,
      denyReasons,
      timestamp: new Date().toISOString(),
      evaluationContext: {
        role,
        department,
        location,
        deviceType,
        time,
        securityClearance,
        dataClassification
      }
    });
  });

  // Files: Get, Upload & Inline Encryption Pipeline
  app.get('/api/files', (req, res) => {
    res.json(files);
  });

  app.post('/api/files/upload', (req, res) => {
    const { name, content, rawClassification, ownerName, userRole, ipAddress, location } = req.body;

    const textContent = content || 'Sample document content for automated scanning and classification.';
    
    // 1. PII Detection & Auto Redaction
    const piiResult = detectAndRedactPII(textContent);

    // 2. Data Classification
    let classification: any = rawClassification || 'Internal';
    if (piiResult.hasPII) {
      classification = 'Highly Confidential';
    }

    // 3. AES-256 Encryption
    const encResult = encryptAES256(piiResult.redactedText, 'MASTER-VAULT-KEY');

    // 4. Digital Signature & SHA-256 Digest
    const sha256Hash = generateSHA256(textContent);
    const digitalSig = generateDigitalSignature(textContent, 'key-kms-9901');

    const newFile: FileItem = {
      id: `file-${Date.now().toString().slice(-4)}`,
      name: name || 'Untitled_Document.pdf',
      size: textContent.length * 1024,
      fileType: 'text/plain',
      classification,
      ownerId: 'usr-101',
      ownerName: ownerName || 'Alexander Wright',
      encryptionAlgorithm: 'AES-256-GCM',
      keyId: 'key-kms-9901',
      digitalSignature: digitalSig,
      sha256Hash,
      isRedacted: piiResult.hasPII,
      piiDetected: piiResult.detectedTypes,
      watermarked: true,
      uploadedAt: new Date().toISOString(),
      versionHistory: [
        { version: 'v1.0', date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'Uploaded, Scanned, PII Masked & Encrypted', author: ownerName || 'System' }
      ],
      accessCount: 1,
      status: 'Encrypted'
    };

    files.unshift(newFile);

    addAuditLog(ownerName || 'User', userRole || 'Administrator', 'FILE_INLINE_ENCRYPT_UPLOAD', newFile.name, 'PERMIT', ipAddress || '103.21.124.50', location || 'Bangalore, IN');
    addTelemetry('File Pipeline', 'Info', 'Inline File Encryption', ownerName || 'User', ipAddress || '103.21.124.50', location || 'Bangalore, IN', `File ${newFile.name} processed: ${piiResult.maskedCount} PII elements redacted, AES-256 encrypted.`);

    res.json({
      success: true,
      file: newFile,
      pipelineReport: {
        piiDetected: piiResult.detectedTypes,
        maskedCount: piiResult.maskedCount,
        cipherDigest: encResult.ciphertext.substring(0, 45) + '...',
        sha256Hash,
        digitalSignature: digitalSig
      }
    });
  });

  // Files: Decrypt & Download with Watermark
  app.post('/api/files/download', (req, res) => {
    const { fileId, userEmail, userRole, ipAddress, location } = req.body;
    const file = files.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    file.accessCount += 1;

    const watermark = generateWatermark(userEmail || 'user@securesaas.io', ipAddress || '127.0.0.1');

    addAuditLog(userEmail || 'User', userRole || 'Administrator', 'FILE_DECRYPT_DOWNLOAD', file.name, 'PERMIT', ipAddress || '127.0.0.1', location || 'Local');

    res.json({
      success: true,
      file,
      watermark,
      decryptedPreviewText: `[DECRYPTED CONTENT VIA AES-256-GCM KEY ${file.keyId}]\n------------------------------------------------\n${watermark}\n------------------------------------------------\nCONFIDENTIAL DOCUMENT: ${file.name}\nSTATUS: Integrity Verified (${file.sha256Hash.substring(0, 20)}...)\nDIGITAL SIGNATURE: ${file.digitalSignature}`
    });
  });

  // KMS: Encryption Keys
  app.get('/api/kms/keys', (req, res) => {
    res.json(encryptionKeys);
  });

  app.post('/api/kms/keys/rotate', (req, res) => {
    const { keyId } = req.body;
    const key = encryptionKeys.find(k => k.id === keyId);
    if (key) {
      key.createdAt = new Date().toISOString();
      key.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      key.usageCount = 0;
      addTelemetry('Encryption KMS', 'Info', 'Key Rotation Executed', 'admin@securesaas.io', '127.0.0.1', 'Local', `Key ${key.keyAlias} rotated in HSM ring.`);
      return res.json({ success: true, key });
    }
    res.status(404).json({ success: false, message: 'Key not found' });
  });

  // JIT Key Requests
  app.get('/api/kms/jit/requests', (req, res) => {
    res.json(jitRequests);
  });

  app.post('/api/kms/jit/request', (req, res) => {
    const { userId, userName, userRole, reason, targetResource, durationMinutes, ipAddress, location } = req.body;

    const riskScore = userRole === 'Administrator' ? 10 : userRole === 'Developer' ? 25 : 65;
    const decision = riskScore < 40 ? 'PASS' : 'REVIEW';

    const newRequest: JITKeyRequest = {
      id: `jit-req-${Date.now().toString().slice(-4)}`,
      userId: userId || 'usr-104',
      userName: userName || 'Priya Sharma',
      userRole: userRole || 'Developer',
      reason: reason || 'Urgent hotfix access',
      targetResource: targetResource || 'AWS RDS Cluster',
      requestedDurationMinutes: durationMinutes || 60,
      status: decision === 'PASS' ? 'Approved' : 'Pending',
      requestedAt: new Date().toISOString(),
      expiresAt: decision === 'PASS' ? new Date(Date.now() + (durationMinutes || 60) * 60000).toISOString() : undefined,
      assignedKeyId: decision === 'PASS' ? `key-jit-${Date.now().toString().slice(-4)}` : undefined,
      riskEvaluation: {
        score: riskScore,
        decision,
        flags: decision === 'PASS' ? ['Role Access Validated', 'Low Context Risk'] : ['Escalation Required', 'Unusual Target Resource']
      }
    };

    if (decision === 'PASS') {
      const ephemeralKey = {
        id: newRequest.assignedKeyId!,
        keyAlias: `JIT-Ephemeral-${userName.replace(/\s+/g, '')}`,
        type: 'Temporary JIT Key' as const,
        algorithm: 'AES-256' as const,
        status: 'Active' as const,
        createdAt: new Date().toISOString(),
        expiresAt: newRequest.expiresAt!,
        usageCount: 1,
        requestedBy: `${userName} (${userRole})`,
        approvedBy: 'Auto JIT Policy Engine',
        jitDurationMinutes: durationMinutes || 60,
        hsmModule: 'HashiCorp Vault JIT Engine',
        rotationScheduleDays: 0
      };
      encryptionKeys.unshift(ephemeralKey);
    }

    jitRequests.unshift(newRequest);

    addAuditLog(userName || 'User', userRole || 'Developer', 'JIT_KEY_REQUESTED', targetResource || 'Resource', decision === 'PASS' ? 'PERMIT' : 'DENY', ipAddress || '103.21.124.50', location || 'Bangalore, IN');

    res.json({ success: true, request: newRequest });
  });

  app.post('/api/kms/jit/approve', (req, res) => {
    const { requestId, approverName } = req.body;
    const reqItem = jitRequests.find(r => r.id === requestId);

    if (reqItem) {
      reqItem.status = 'Approved';
      reqItem.approvedAt = new Date().toISOString();
      reqItem.expiresAt = new Date(Date.now() + reqItem.requestedDurationMinutes * 60000).toISOString();
      reqItem.assignedKeyId = `key-jit-${Date.now().toString().slice(-4)}`;

      const ephemeralKey = {
        id: reqItem.assignedKeyId,
        keyAlias: `JIT-Ephemeral-${reqItem.userName.replace(/\s+/g, '')}`,
        type: 'Temporary JIT Key' as const,
        algorithm: 'AES-256' as const,
        status: 'Active' as const,
        createdAt: new Date().toISOString(),
        expiresAt: reqItem.expiresAt,
        usageCount: 1,
        requestedBy: `${reqItem.userName} (${reqItem.userRole})`,
        approvedBy: approverName || 'Alexander Wright',
        jitDurationMinutes: reqItem.requestedDurationMinutes,
        hsmModule: 'HashiCorp Vault JIT Engine',
        rotationScheduleDays: 0
      };
      encryptionKeys.unshift(ephemeralKey);

      addAuditLog(approverName || 'Admin', 'Administrator', 'JIT_KEY_APPROVED', reqItem.targetResource, 'PERMIT', '103.21.124.50', 'Bangalore, IN');

      return res.json({ success: true, request: reqItem, key: ephemeralKey });
    }

    res.status(404).json({ success: false, message: 'Request not found' });
  });

  // Telemetry
  app.get('/api/telemetry', (req, res) => {
    res.json(telemetry);
  });

  // Audit Logs
  app.get('/api/audit', (req, res) => {
    res.json(auditLogs);
  });

  // Threats
  app.get('/api/threats', (req, res) => {
    res.json(threats);
  });

  app.post('/api/threats/mitigate', (req, res) => {
    const { threatId } = req.body;
    const threat = threats.find(t => t.id === threatId);
    if (threat) {
      threat.status = 'Resolved';
      addTelemetry('Threat Radar', 'Info', 'Threat Mitigated', 'admin@securesaas.io', '127.0.0.1', 'Local', `Threat ${threat.title} auto-contained by Security Officer.`);
      return res.json({ success: true, threat });
    }
    res.status(404).json({ success: false, message: 'Threat not found' });
  });

  // Reports
  app.get('/api/reports', (req, res) => {
    res.json(reports);
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE SETUP
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔒 Cloud Security Platform Server running on http://localhost:${PORT}`);
  });
}

startServer();
