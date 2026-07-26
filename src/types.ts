export type UserRole = 
  | 'Administrator' 
  | 'Security Officer' 
  | 'Cloud Manager' 
  | 'Developer' 
  | 'Employee' 
  | 'Auditor' 
  | 'Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
  securityClearance: 'Secret' | 'Top Secret' | 'Confidential' | 'Unclassified';
  deviceType: 'Company Laptop' | 'Personal Device' | 'Mobile' | 'Server Node';
  mfaEnabled: boolean;
  mfaVerified?: boolean;
  avatarUrl?: string;
  ipAddress: string;
  riskScore: number;
  lastLogin: string;
  status: 'Active' | 'Locked' | 'Pending MFA';
}

export interface CloudProvider {
  id: string;
  name: 'AWS' | 'Azure' | 'Google Cloud' | 'Oracle Cloud' | 'IBM Cloud' | 'Digital Ocean';
  code: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Syncing';
  connectedResources: number;
  activePolicies: number;
  complianceScore: number; // e.g. 98%
  encryptionStatus: 'AES-256 Hardware' | 'KMS Managed' | 'Hybrid ECC';
  firewallStatus: 'Active Shield' | 'Degraded' | 'Configuring';
  riskScore: number;
  region: string;
  lastAudit: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  version: string;
  cloudProvider: string;
  action: 'ALLOW' | 'DENY' | 'FLAG_FOR_REVIEW' | 'REQUIRE_JIT';
  subjectRole: UserRole[];
  resourceType: string;
  conditions: {
    minClearance?: string;
    allowedLocations?: string[];
    allowedDevices?: string[];
    allowedTimeRange?: string; // e.g. '08:00-18:00'
    maxRiskScore?: number;
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DataClassification = 'Public' | 'Internal' | 'Confidential' | 'Highly Confidential';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  fileType: string;
  classification: DataClassification;
  ownerId: string;
  ownerName: string;
  encryptionAlgorithm: 'AES-256-GCM' | 'RSA-4096 Hybrid' | 'ECC-P384';
  keyId: string;
  digitalSignature: string;
  sha256Hash: string;
  isRedacted: boolean;
  piiDetected: string[];
  watermarked: boolean;
  uploadedAt: string;
  versionHistory: { version: string; date: string; action: string; author: string }[];
  accessCount: number;
  status: 'Encrypted' | 'Archived' | 'Quarantined';
}

export interface EncryptionKey {
  id: string;
  keyAlias: string;
  type: 'Master Key' | 'Session Key' | 'Temporary JIT Key' | 'HSM Key';
  algorithm: 'AES-256' | 'RSA-4096' | 'ECC-P384';
  status: 'Active' | 'Expired' | 'Revoked' | 'Pending Approval';
  createdAt: string;
  expiresAt: string;
  usageCount: number;
  requestedBy?: string;
  approvedBy?: string;
  jitDurationMinutes?: number;
  hsmModule: string;
  rotationScheduleDays: number;
}

export interface JITKeyRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  reason: string;
  targetResource: string;
  requestedDurationMinutes: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired' | 'Revoked';
  requestedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  assignedKeyId?: string;
  riskEvaluation: {
    score: number;
    decision: 'PASS' | 'REVIEW' | 'FAIL';
    flags: string[];
  };
}

export interface SecurityTelemetryEvent {
  id: string;
  timestamp: string;
  source: 'Auth Engine' | 'Policy Engine' | 'Cloud Shield' | 'Encryption KMS' | 'File Pipeline' | 'Threat Radar';
  severity: 'Info' | 'Warning' | 'Critical' | 'Alert';
  eventType: string;
  userEmail?: string;
  ipAddress: string;
  location: string;
  details: string;
  status: 'Logged' | 'Investigating' | 'Mitigated' | 'Blocked';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  resource: string;
  policyDecision: 'PERMIT' | 'DENY' | 'BYPASS';
  ipAddress: string;
  location: string;
  keyUsed?: string;
  cryptoFingerprint: string;
}

export interface ThreatAlert {
  id: string;
  title: string;
  category: 'Brute Force' | 'Impossible Travel' | 'Privilege Escalation' | 'Unusual Exfiltration' | 'Malware Signature';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectedAt: string;
  affectedTarget: string;
  riskScore: number;
  status: 'Active' | 'Investigating' | 'Resolved' | 'Auto-Mitigated';
  recommendedAction: string;
}

export interface SecurityReport {
  id: string;
  title: string;
  type: 'Executive Security' | 'ABAC Audit' | 'Encryption & KMS' | 'Multi-Cloud Compliance' | 'Threat Intelligence';
  generatedAt: string;
  generatedBy: string;
  summary: string;
  status: 'Ready' | 'Processing';
}
