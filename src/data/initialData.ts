import { 
  User, 
  CloudProvider, 
  PolicyRule, 
  FileItem, 
  EncryptionKey, 
  JITKeyRequest, 
  SecurityTelemetryEvent, 
  AuditLog, 
  ThreatAlert, 
  SecurityReport 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-101',
    name: 'Alexander Wright',
    email: 'a.wright@securesaas.io',
    role: 'Administrator',
    department: 'Cyber Security Operations',
    location: 'Bangalore, IN',
    securityClearance: 'Top Secret',
    deviceType: 'Company Laptop',
    mfaEnabled: true,
    mfaVerified: true,
    ipAddress: '103.21.124.50',
    riskScore: 12,
    lastLogin: '2026-07-22T21:45:00Z',
    status: 'Active'
  },
  {
    id: 'usr-102',
    name: 'Elena Rostova',
    email: 'e.rostova@securesaas.io',
    role: 'Security Officer',
    department: 'Compliance & Governance',
    location: 'London, UK',
    securityClearance: 'Top Secret',
    deviceType: 'Company Laptop',
    mfaEnabled: true,
    mfaVerified: true,
    ipAddress: '82.165.197.1',
    riskScore: 8,
    lastLogin: '2026-07-22T20:30:00Z',
    status: 'Active'
  },
  {
    id: 'usr-103',
    name: 'Devon Vance',
    email: 'd.vance@securesaas.io',
    role: 'Cloud Manager',
    department: 'Cloud Infrastructure',
    location: 'San Francisco, US',
    securityClearance: 'Secret',
    deviceType: 'Company Laptop',
    mfaEnabled: true,
    mfaVerified: true,
    ipAddress: '192.0.2.14',
    riskScore: 15,
    lastLogin: '2026-07-22T19:12:00Z',
    status: 'Active'
  },
  {
    id: 'usr-104',
    name: 'Priya Sharma',
    email: 'p.sharma@securesaas.io',
    role: 'Developer',
    department: 'Engineering Services',
    location: 'Bangalore, IN',
    securityClearance: 'Secret',
    deviceType: 'Company Laptop',
    mfaEnabled: true,
    mfaVerified: true,
    ipAddress: '103.21.124.88',
    riskScore: 22,
    lastLogin: '2026-07-22T21:10:00Z',
    status: 'Active'
  },
  {
    id: 'usr-105',
    name: 'Marcus Brody',
    email: 'm.brody@securesaas.io',
    role: 'Employee',
    department: 'Global Finance',
    location: 'New York, US',
    securityClearance: 'Confidential',
    deviceType: 'Personal Device',
    mfaEnabled: true,
    mfaVerified: false,
    ipAddress: '198.51.100.22',
    riskScore: 45,
    lastLogin: '2026-07-22T18:05:00Z',
    status: 'Active'
  },
  {
    id: 'usr-106',
    name: 'Sarah Connor',
    email: 's.connor@securesaas.io',
    role: 'Auditor',
    department: 'External Audit Firm',
    location: 'Zurich, CH',
    securityClearance: 'Confidential',
    deviceType: 'Company Laptop',
    mfaEnabled: true,
    mfaVerified: true,
    ipAddress: '193.134.254.10',
    riskScore: 5,
    lastLogin: '2026-07-22T15:20:00Z',
    status: 'Active'
  },
  {
    id: 'usr-107',
    name: 'Guest Consultant',
    email: 'guest.vendor@external.com',
    role: 'Guest User',
    department: 'Contractors',
    location: 'Singapore, SG',
    securityClearance: 'Unclassified',
    deviceType: 'Personal Device',
    mfaEnabled: false,
    ipAddress: '203.0.113.195',
    riskScore: 78,
    lastLogin: '2026-07-22T12:00:00Z',
    status: 'Pending MFA'
  }
];

export const INITIAL_CLOUD_PROVIDERS: CloudProvider[] = [
  {
    id: 'cld-aws',
    name: 'AWS',
    code: 'aws-us-east-1',
    status: 'Healthy',
    connectedResources: 412,
    activePolicies: 64,
    complianceScore: 98,
    encryptionStatus: 'AES-256 Hardware',
    firewallStatus: 'Active Shield',
    riskScore: 6,
    region: 'us-east-1 (N. Virginia)',
    lastAudit: '12 mins ago'
  },
  {
    id: 'cld-azure',
    name: 'Azure',
    code: 'az-westeurope',
    status: 'Healthy',
    connectedResources: 289,
    activePolicies: 48,
    complianceScore: 96,
    encryptionStatus: 'KMS Managed',
    firewallStatus: 'Active Shield',
    riskScore: 9,
    region: 'westeurope (Amsterdam)',
    lastAudit: '25 mins ago'
  },
  {
    id: 'cld-gcp',
    name: 'Google Cloud',
    code: 'gcp-asia-south1',
    status: 'Healthy',
    connectedResources: 350,
    activePolicies: 52,
    complianceScore: 99,
    encryptionStatus: 'Hybrid ECC',
    firewallStatus: 'Active Shield',
    riskScore: 4,
    region: 'asia-south1 (Mumbai)',
    lastAudit: '5 mins ago'
  },
  {
    id: 'cld-oci',
    name: 'Oracle Cloud',
    code: 'oci-us-phoenix-1',
    status: 'Warning',
    connectedResources: 94,
    activePolicies: 18,
    complianceScore: 89,
    encryptionStatus: 'AES-256 Hardware',
    firewallStatus: 'Degraded',
    riskScore: 28,
    region: 'us-phoenix-1',
    lastAudit: '2 hours ago'
  },
  {
    id: 'cld-ibm',
    name: 'IBM Cloud',
    code: 'ibm-eu-de',
    status: 'Healthy',
    connectedResources: 78,
    activePolicies: 15,
    complianceScore: 94,
    encryptionStatus: 'KMS Managed',
    firewallStatus: 'Active Shield',
    riskScore: 12,
    region: 'eu-de (Frankfurt)',
    lastAudit: '45 mins ago'
  },
  {
    id: 'cld-do',
    name: 'Digital Ocean',
    code: 'do-sgp1',
    status: 'Healthy',
    connectedResources: 42,
    activePolicies: 10,
    complianceScore: 92,
    encryptionStatus: 'AES-256 Hardware',
    firewallStatus: 'Active Shield',
    riskScore: 15,
    region: 'sgp1 (Singapore)',
    lastAudit: '1 hour ago'
  }
];

export const INITIAL_POLICIES: PolicyRule[] = [
  {
    id: 'pol-001',
    name: 'Zero-Trust Financial Data Access',
    version: 'v2.1',
    cloudProvider: 'Google Cloud',
    action: 'ALLOW',
    subjectRole: ['Administrator', 'Security Officer', 'Employee'],
    resourceType: 'Confidential Financial Reports',
    conditions: {
      minClearance: 'Confidential',
      allowedLocations: ['Bangalore, IN', 'New York, US', 'London, UK'],
      allowedDevices: ['Company Laptop'],
      allowedTimeRange: '08:00-20:00',
      maxRiskScore: 30
    },
    enabled: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-07-15'
  },
  {
    id: 'pol-002',
    name: 'JIT Escalation for Production DB Keys',
    version: 'v3.0',
    cloudProvider: 'AWS',
    action: 'REQUIRE_JIT',
    subjectRole: ['Developer', 'Cloud Manager'],
    resourceType: 'AWS KMS Master DB Key',
    conditions: {
      minClearance: 'Secret',
      allowedDevices: ['Company Laptop'],
      maxRiskScore: 25
    },
    enabled: true,
    createdAt: '2026-03-01',
    updatedAt: '2026-06-20'
  },
  {
    id: 'pol-003',
    name: 'Block Untrusted Device & Geofenced Exfiltration',
    version: 'v1.4',
    cloudProvider: 'Azure',
    action: 'DENY',
    subjectRole: ['Guest User', 'Employee'],
    resourceType: 'Highly Confidential Source Code & Customer PII',
    conditions: {
      allowedDevices: ['Company Laptop'],
      maxRiskScore: 50
    },
    enabled: true,
    createdAt: '2026-02-14',
    updatedAt: '2026-07-01'
  }
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file-001',
    name: 'Q3_Financial_Audit_Report.pdf',
    size: 4250000,
    fileType: 'application/pdf',
    classification: 'Highly Confidential',
    ownerId: 'usr-101',
    ownerName: 'Alexander Wright',
    encryptionAlgorithm: 'AES-256-GCM',
    keyId: 'key-kms-9901',
    digitalSignature: 'SIG-RSA4096-7F8A22910BC',
    sha256Hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a389',
    isRedacted: true,
    piiDetected: ['Social Security Number (SSN)', 'Credit Card Number (PCI)'],
    watermarked: true,
    uploadedAt: '2026-07-22T18:30:00Z',
    versionHistory: [
      { version: 'v1.0', date: '2026-07-22 18:30', action: 'Uploaded & Encrypted', author: 'Alexander Wright' }
    ],
    accessCount: 14,
    status: 'Encrypted'
  },
  {
    id: 'file-002',
    name: 'AWS_Production_KMS_Secret_Manifest.json',
    size: 124000,
    fileType: 'application/json',
    classification: 'Confidential',
    ownerId: 'usr-103',
    ownerName: 'Devon Vance',
    encryptionAlgorithm: 'RSA-4096 Hybrid',
    keyId: 'key-kms-4412',
    digitalSignature: 'SIG-RSA4096-9B3C11458FA',
    sha256Hash: 'sha256:8f4b1d9c0e2a3f5b7d9e1f2a3c4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    isRedacted: true,
    piiDetected: ['AWS / API Secret Key'],
    watermarked: true,
    uploadedAt: '2026-07-21T14:15:00Z',
    versionHistory: [
      { version: 'v1.0', date: '2026-07-21 14:15', action: 'Uploaded & Tokenized', author: 'Devon Vance' }
    ],
    accessCount: 8,
    status: 'Encrypted'
  },
  {
    id: 'file-003',
    name: 'Global_Security_Policy_Manual_2026.docx',
    size: 1850000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    classification: 'Internal',
    ownerId: 'usr-102',
    ownerName: 'Elena Rostova',
    encryptionAlgorithm: 'AES-256-GCM',
    keyId: 'key-kms-1002',
    digitalSignature: 'SIG-RSA4096-3A1D88741EE',
    sha256Hash: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    isRedacted: false,
    piiDetected: [],
    watermarked: false,
    uploadedAt: '2026-07-20T09:40:00Z',
    versionHistory: [
      { version: 'v1.0', date: '2026-07-20 09:40', action: 'Uploaded & Published', author: 'Elena Rostova' }
    ],
    accessCount: 42,
    status: 'Encrypted'
  },
  {
    id: 'file-004',
    name: 'Employee_Payroll_2026_Q2.xlsx',
    size: 3100000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    classification: 'Highly Confidential',
    ownerId: 'usr-105',
    ownerName: 'Marcus Brody',
    encryptionAlgorithm: 'ECC-P384',
    keyId: 'key-kms-8831',
    digitalSignature: 'SIG-ECC384-55C2A0918D3',
    sha256Hash: 'sha256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    isRedacted: true,
    piiDetected: ['Social Security Number (SSN)', 'Personal Email Address'],
    watermarked: true,
    uploadedAt: '2026-07-19T11:00:00Z',
    versionHistory: [
      { version: 'v1.0', date: '2026-07-19 11:00', action: 'Uploaded & PII Masked', author: 'Marcus Brody' }
    ],
    accessCount: 6,
    status: 'Encrypted'
  }
];

export const INITIAL_KEYS: EncryptionKey[] = [
  {
    id: 'key-kms-9901',
    keyAlias: 'Master-AES256-Root-Vault',
    type: 'Master Key',
    algorithm: 'AES-256',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00Z',
    expiresAt: '2027-01-01T00:00:00Z',
    usageCount: 1420,
    hsmModule: 'FIPS 140-2 Level 3 HSM Cluster',
    rotationScheduleDays: 90
  },
  {
    id: 'key-kms-4412',
    keyAlias: 'RSA4096-Cloud-Signing-Pair',
    type: 'HSM Key',
    algorithm: 'RSA-4096',
    status: 'Active',
    createdAt: '2026-02-15T00:00:00Z',
    expiresAt: '2027-02-15T00:00:00Z',
    usageCount: 890,
    hsmModule: 'Azure Managed HSM Module #4',
    rotationScheduleDays: 180
  },
  {
    id: 'key-jit-7011',
    keyAlias: 'JIT-Ephemeral-DBAccess-Priya',
    type: 'Temporary JIT Key',
    algorithm: 'AES-256',
    status: 'Active',
    createdAt: '2026-07-22T21:30:00Z',
    expiresAt: '2026-07-22T22:30:00Z',
    usageCount: 3,
    requestedBy: 'Priya Sharma (Developer)',
    approvedBy: 'Alexander Wright (Administrator)',
    jitDurationMinutes: 60,
    hsmModule: 'HashiCorp Vault JIT Engine',
    rotationScheduleDays: 0
  },
  {
    id: 'key-kms-8831',
    keyAlias: 'ECC-P384-Payroll-Encryption-Key',
    type: 'Session Key',
    algorithm: 'ECC-P384',
    status: 'Active',
    createdAt: '2026-05-10T00:00:00Z',
    expiresAt: '2026-11-10T00:00:00Z',
    usageCount: 312,
    hsmModule: 'Google Cloud KMS HSM Ring',
    rotationScheduleDays: 60
  }
];

export const INITIAL_JIT_REQUESTS: JITKeyRequest[] = [
  {
    id: 'jit-req-001',
    userId: 'usr-104',
    userName: 'Priya Sharma',
    userRole: 'Developer',
    reason: 'Emergency patch on AWS Production RDS database cluster due to API crash.',
    targetResource: 'AWS RDS Prod DB Key (us-east-1)',
    requestedDurationMinutes: 60,
    status: 'Approved',
    requestedAt: '2026-07-22T21:28:00Z',
    approvedAt: '2026-07-22T21:30:00Z',
    expiresAt: '2026-07-22T22:30:00Z',
    assignedKeyId: 'key-jit-7011',
    riskEvaluation: {
      score: 18,
      decision: 'PASS',
      flags: ['Valid Clearance (Secret)', 'Company Laptop Verified', 'Normal Office Hours']
    }
  },
  {
    id: 'jit-req-002',
    userId: 'usr-105',
    userName: 'Marcus Brody',
    userRole: 'Employee',
    reason: 'Export all raw payroll DB backups for quarterly report audit.',
    targetResource: 'Azure Key Vault Root Ledger',
    requestedDurationMinutes: 120,
    status: 'Pending',
    requestedAt: '2026-07-22T21:50:00Z',
    riskEvaluation: {
      score: 62,
      decision: 'REVIEW',
      flags: ['Personal Device Detected', 'Role Clearance Mismatch', 'High Volume Data Request']
    }
  }
];

export const INITIAL_TELEMETRY: SecurityTelemetryEvent[] = [
  {
    id: 'tel-1001',
    timestamp: '2026-07-22T21:58:12Z',
    source: 'Auth Engine',
    severity: 'Info',
    eventType: 'JWT Session Refresh',
    userEmail: 'a.wright@securesaas.io',
    ipAddress: '103.21.124.50',
    location: 'Bangalore, IN',
    details: 'User Alexander Wright refreshed auth token via MFA challenge.',
    status: 'Logged'
  },
  {
    id: 'tel-1002',
    timestamp: '2026-07-22T21:55:04Z',
    source: 'Encryption KMS',
    severity: 'Info',
    eventType: 'AES-256 Inline Encryption',
    userEmail: 'a.wright@securesaas.io',
    ipAddress: '103.21.124.50',
    location: 'Bangalore, IN',
    details: 'File Q3_Financial_Audit_Report.pdf encrypted with key key-kms-9901.',
    status: 'Logged'
  },
  {
    id: 'tel-1003',
    timestamp: '2026-07-22T21:48:30Z',
    source: 'Threat Radar',
    severity: 'Critical',
    eventType: 'Brute Force Alert',
    userEmail: 'guest.vendor@external.com',
    ipAddress: '203.0.113.195',
    location: 'Singapore, SG',
    details: '5 failed login attempts detected in 30 seconds. Account locked automatically.',
    status: 'Mitigated'
  },
  {
    id: 'tel-1004',
    timestamp: '2026-07-22T21:30:00Z',
    source: 'Policy Engine',
    severity: 'Warning',
    eventType: 'ABAC JIT Approval Trigger',
    userEmail: 'p.sharma@securesaas.io',
    ipAddress: '103.21.124.88',
    location: 'Bangalore, IN',
    details: 'JIT Key requested for AWS RDS Prod DB Key. Approved for 60 minutes.',
    status: 'Investigating'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-9001',
    timestamp: '2026-07-22T21:58:12Z',
    actor: 'Alexander Wright',
    role: 'Administrator',
    action: 'POLICY_ENFORCEMENT_EVAL',
    resource: 'Google Cloud Financial Bucket',
    policyDecision: 'PERMIT',
    ipAddress: '103.21.124.50',
    location: 'Bangalore, IN',
    keyUsed: 'key-kms-9901',
    cryptoFingerprint: '4F91-B88C-3291-E001'
  },
  {
    id: 'aud-9002',
    timestamp: '2026-07-22T21:50:00Z',
    actor: 'Marcus Brody',
    role: 'Employee',
    action: 'JIT_KEY_REQUEST',
    resource: 'Azure Key Vault Root Ledger',
    policyDecision: 'DENY',
    ipAddress: '198.51.100.22',
    location: 'New York, US',
    cryptoFingerprint: '9B2C-7F11-8820-A311'
  },
  {
    id: 'aud-9003',
    timestamp: '2026-07-22T21:30:00Z',
    actor: 'Priya Sharma',
    role: 'Developer',
    action: 'JIT_KEY_ISSUED',
    resource: 'AWS RDS Prod DB Key',
    policyDecision: 'PERMIT',
    ipAddress: '103.21.124.88',
    location: 'Bangalore, IN',
    keyUsed: 'key-jit-7011',
    cryptoFingerprint: '11C3-44E9-0012-B992'
  }
];

export const INITIAL_THREATS: ThreatAlert[] = [
  {
    id: 'tht-501',
    title: 'Multiple Failed Authentication Attempts',
    category: 'Brute Force',
    severity: 'Critical',
    detectedAt: '12 mins ago',
    affectedTarget: 'guest.vendor@external.com (203.0.113.195)',
    riskScore: 88,
    status: 'Auto-Mitigated',
    recommendedAction: 'Enforce IP range ban and force password reset with WebAuthn MFA.'
  },
  {
    id: 'tht-502',
    title: 'Impossible Travel Signature Detected',
    category: 'Impossible Travel',
    severity: 'High',
    detectedAt: '35 mins ago',
    affectedTarget: 'm.brody@securesaas.io (New York -> Tokyo in 10 min)',
    riskScore: 74,
    status: 'Investigating',
    recommendedAction: 'Terminate active session JWT and trigger immediate MFA re-verification.'
  },
  {
    id: 'tht-503',
    title: 'Unusual Bulk PII Exfiltration Attempt',
    category: 'Unusual Exfiltration',
    severity: 'High',
    detectedAt: '1 hour ago',
    affectedTarget: 'Employee_Payroll_2026_Q2.xlsx',
    riskScore: 68,
    status: 'Active',
    recommendedAction: 'Apply automated PII redaction & enforce digital watermarking.'
  }
];

export const INITIAL_REPORTS: SecurityReport[] = [
  {
    id: 'rep-001',
    title: 'Q3 Enterprise Multi-Cloud Security Audit',
    type: 'Executive Security',
    generatedAt: '2026-07-22 20:00',
    generatedBy: 'Elena Rostova (Security Officer)',
    summary: 'Comprehensive audit across AWS, Azure, GCP, OCI, and IBM Cloud. Overall compliance score is 96.8%. Zero active data breaches.',
    status: 'Ready'
  },
  {
    id: 'rep-002',
    title: 'ABAC Access Policy Evaluation & Violation Log',
    type: 'ABAC Audit',
    generatedAt: '2026-07-21 18:00',
    generatedBy: 'Alexander Wright (Administrator)',
    summary: 'Analysis of 14,200 evaluation queries. 99.4% passed. 0.6% blocked due to untrusted device or geofence rules.',
    status: 'Ready'
  },
  {
    id: 'rep-003',
    title: 'Cryptographic Key Lifecycle & HSM Health',
    type: 'Encryption & KMS',
    generatedAt: '2026-07-20 12:00',
    generatedBy: 'Devon Vance (Cloud Manager)',
    summary: 'All master keys passed 90-day automated rotation. HSM modules operating at 100% capacity with FIPS 140-2 Level 3 certification.',
    status: 'Ready'
  }
];
