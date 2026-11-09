import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { MultiCloudPolicyEngine } from './components/MultiCloudPolicyEngine';
import { ABACModule } from './components/ABACModule';
import { InlineDataPipeline } from './components/InlineDataPipeline';
import { JITKeyManagement } from './components/JITKeyManagement';
import { SecurityTelemetry } from './components/SecurityTelemetry';
import { ThreatDetection } from './components/ThreatDetection';
import { AuditLogs } from './components/AuditLogs';
import { ReportsModule } from './components/ReportsModule';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import matplotlib.pyplot as plt
import { 
  User, 
  UserRole, 
  CloudProvider, 
  PolicyRule, 
  FileItem, 
  EncryptionKey, 
  JITKeyRequest, 
  SecurityTelemetryEvent, 
  AuditLog, 
  ThreatAlert, 
  SecurityReport 
} from './types';

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
} from './data/initialData';

export default function App() {
  // Current active user persona
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  
  // Navigation View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  // App Datasets (Initialized with rich mock data + live REST API synchronization)
  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>(INITIAL_CLOUD_PROVIDERS);
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [keys, setKeys] = useState<EncryptionKey[]>(INITIAL_KEYS);
  const [jitRequests, setJitRequests] = useState<JITKeyRequest[]>(INITIAL_JIT_REQUESTS);
  const [telemetry, setTelemetry] = useState<SecurityTelemetryEvent[]>(INITIAL_TELEMETRY);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [threats, setThreats] = useState<ThreatAlert[]>(INITIAL_THREATS);
  const [reports, setReports] = useState<SecurityReport[]>(INITIAL_REPORTS);

  // Computed Security Index
  const activeThreatsCount = threats.filter(t => t.status === 'Active').length;
  const securityScore = Math.max(70, 98 - (activeThreatsCount * 4));

  // Sync state from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cloudRes, polRes, fileRes, keyRes, jitRes, telRes, audRes, thtRes] = await Promise.all([
          fetch('/api/cloud/providers').then(r => r.json()).catch(() => null),
          fetch('/api/policies').then(r => r.json()).catch(() => null),
          fetch('/api/files').then(r => r.json()).catch(() => null),
          fetch('/api/kms/keys').then(r => r.json()).catch(() => null),
          fetch('/api/kms/jit/requests').then(r => r.json()).catch(() => null),
          fetch('/api/telemetry').then(r => r.json()).catch(() => null),
          fetch('/api/audit').then(r => r.json()).catch(() => null),
          fetch('/api/threats').then(r => r.json()).catch(() => null)
        ]);

        if (cloudRes) setCloudProviders(cloudRes);
        if (polRes) setPolicies(polRes);
        if (fileRes) setFiles(fileRes);
        if (keyRes) setKeys(keyRes);
        if (jitRes) setJitRequests(jitRes);
        if (telRes) setTelemetry(telRes);
        if (audRes) setAuditLogs(audRes);
        if (thtRes) setThreats(thtRes);
      } catch (err) {
        console.log('API Sync initialization completed.');
      }
    };
    fetchData();
  }, []);

  // Handle Role Persona Switching
  const handleRoleChange = (newRole: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === newRole) || {
      ...currentUser,
      role: newRole
    };
    setCurrentUser(targetUser as User);

    // Add telemetry log for persona switch
    const newEvt: SecurityTelemetryEvent = {
      id: `tel-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      source: 'Auth Engine',
      severity: 'Info',
      eventType: 'Role Persona Switched',
      userEmail: targetUser.email,
      ipAddress: targetUser.ipAddress,
      location: targetUser.location,
      details: `Active prototype role switched to ${newRole}. Clearance: ${targetUser.securityClearance}`,
      status: 'Logged'
    };
    setTelemetry(prev => [newEvt, ...prev]);
  };

  // API Handler: Create Policy
  const handleCreatePolicy = async (policyData: Partial<PolicyRule>) => {
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });
      const data = await res.json();
      if (data.success) {
        setPolicies(prev => [data.policy, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // API Handler: Upload & Inline Encrypt File
  const handleUploadFile = async (formData: any) => {
    try {
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ipAddress: currentUser.ipAddress,
          location: currentUser.location
        })
      });
      const data = await res.json();
      if (data.success) {
        setFiles(prev => [data.file, ...prev]);
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // API Handler: Decrypt File
  const handleDecryptFile = async (fileId: string) => {
    try {
      const res = await fetch('/api/files/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId,
          userEmail: currentUser.email,
          userRole: currentUser.role,
          ipAddress: currentUser.ipAddress,
          location: currentUser.location
        })
      });
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  // API Handler: Request JIT Key
  const handleRequestJITKey = async (data: any) => {
    try {
      const res = await fetch('/api/kms/jit/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ipAddress: currentUser.ipAddress,
          location: currentUser.location
        })
      });
      const result = await res.json();
      if (result.success) {
        setJitRequests(prev => [result.request, ...prev]);
        // Re-fetch keys if ephemeral key was auto-generated
        const keyRes = await fetch('/api/kms/keys').then(r => r.json());
        if (keyRes) setKeys(keyRes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // API Handler: Approve JIT Key
  const handleApproveJITKey = async (requestId: string) => {
    try {
      const res = await fetch('/api/kms/jit/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          approverName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setJitRequests(prev => prev.map(r => r.id === requestId ? data.request : r));
        setKeys(prev => [data.key, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // API Handler: Rotate Key
  const handleRotateKey = async (keyId: string) => {
    try {
      const res = await fetch('/api/kms/keys/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId })
      });
      const data = await res.json();
      if (data.success) {
        setKeys(prev => prev.map(k => k.id === keyId ? data.key : k));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // API Handler: Mitigate Threat
  const handleMitigateThreat = async (threatId: string) => {
    try {
      const res = await fetch('/api/threats/mitigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatId })
      });
      const data = await res.json();
      if (data.success) {
        setThreats(prev => prev.map(t => t.id === threatId ? data.threat : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0A0C10] text-[#E2E8F0] font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Top Navigation Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        unreadAlertsCount={activeThreatsCount}
        securityScore={securityScore}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden w-full">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          threatsCount={activeThreatsCount}
          jitPendingCount={jitRequests.filter(r => r.status === 'Pending').length}
        />

        {/* View Content Display */}
        <main className="flex-1 p-5 md:p-6 overflow-y-auto bg-[#0A0C10]">
          
          {activeTab === 'overview' && (
            <LandingPage onLaunchDashboard={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'dashboard' && (
            <AdminDashboard
              users={INITIAL_USERS}
              cloudProviders={cloudProviders}
              files={files}
              keys={keys}
              threats={threats}
              telemetry={telemetry}
              securityScore={securityScore}
              onNavigateTab={setActiveTab}
              onMitigateThreat={handleMitigateThreat}
            />
          )}

          {activeTab === 'policy-engine' && (
            <MultiCloudPolicyEngine
              cloudProviders={cloudProviders}
              policies={policies}
              onCreatePolicy={handleCreatePolicy}
            />
          )}

          {activeTab === 'abac' && (
            <ABACModule />
          )}

          {activeTab === 'file-vault' && (
            <InlineDataPipeline
              files={files}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
              onUploadFile={handleUploadFile}
              onDecryptFile={handleDecryptFile}
            />
          )}

          {activeTab === 'kms-jit' && (
            <JITKeyManagement
              keys={keys}
              jitRequests={jitRequests}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
              onRequestJITKey={handleRequestJITKey}
              onApproveJITKey={handleApproveJITKey}
              onRotateKey={handleRotateKey}
            />
          )}

          {activeTab === 'telemetry' && (
            <SecurityTelemetry telemetry={telemetry} />
          )}

          {activeTab === 'threats' && (
            <ThreatDetection
              threats={threats}
              onMitigateThreat={handleMitigateThreat}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogs auditLogs={auditLogs} />
          )}

          {activeTab === 'reports' && (
            <ReportsModule reports={reports} />
          )}

        </main>
      </div>

      {/* Enterprise Status Footer */}
      <footer className="h-8 bg-[#0D1117] border-t border-white/5 px-6 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Node: US-EAST-B</span>
          <span>●</span>
          <span>Session: f92k-228l-00ps-91xz</span>
          <span>●</span>
          <span className="text-blue-400">AES-256 KMS Hardware Active</span>
        </div>
        <div className="flex items-center gap-4 uppercase">
          <span className="text-slate-400">FIPS 140-2 Level 3 Validated</span>
          <span className="text-slate-600 tracking-tighter">© 2026 AegisShield Security Systems</span>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        threats={threats}
      />

    </div>
  );
}
