import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Cpu, 
  Trash2, 
  Key, 
  Zap, 
  UserCheck, 
  Activity 
} from 'lucide-react';
import { EncryptionKey, JITKeyRequest, UserRole } from '../types';

interface JITKeyManagementProps {
  keys: EncryptionKey[];
  jitRequests: JITKeyRequest[];
  currentUserRole: UserRole;
  currentUserName: string;
  onRequestJITKey: (data: any) => Promise<any>;
  onApproveJITKey: (requestId: string) => Promise<any>;
  onRotateKey: (keyId: string) => Promise<any>;
}

export const JITKeyManagement: React.FC<JITKeyManagementProps> = ({
  keys,
  jitRequests,
  currentUserRole,
  currentUserName,
  onRequestJITKey,
  onApproveJITKey,
  onRotateKey
}) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Request Form
  const [targetResource, setTargetResource] = useState('AWS RDS Production DB Cluster');
  const [reason, setReason] = useState('Urgent production hotfix and schema patch.');
  const [duration, setDuration] = useState(60);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onRequestJITKey({
      userId: 'usr-104',
      userName: currentUserName,
      userRole: currentUserRole,
      targetResource,
      reason,
      durationMinutes: duration
    });
    setSubmitting(false);
    setShowRequestModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            Just-In-Time (JIT) Key Management System (HashiCorp Vault / KMS)
          </h2>
          <p className="text-[11px] text-slate-400">
            Ephemeral key generation, HSM ring lifecycle, automated revocation, and JIT access requests
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Request Ephemeral JIT Key
        </button>
      </div>

      {/* HSM Hardware Status Widget Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded bg-amber-900/30 border border-amber-500/30 text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HSM Ring Status</div>
            <div className="text-xs font-bold text-white">FIPS 140-2 Level 3 Cluster</div>
            <div className="text-[10px] text-emerald-400 font-mono">100% Operational & Verified</div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-900/30 border border-blue-500/30 text-blue-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Keys</div>
            <div className="text-xs font-bold text-white">{keys.length} Master / JIT Keys</div>
            <div className="text-[10px] text-blue-400 font-mono">AES-256 / RSA-4096 / ECC</div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded bg-purple-900/30 border border-purple-500/30 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">JIT Auto-Revocation</div>
            <div className="text-xs font-bold text-white">{jitRequests.filter(r => r.status === 'Approved').length} Active Ephemeral Keys</div>
            <div className="text-[10px] text-purple-300 font-mono">Countdown Revocation Active</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active JIT Requests Workflow & KMS Keys List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* JIT Workflow Access Requests Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                JIT Key Request Pipeline
              </h3>
              <p className="text-xs text-slate-400">Policy & risk evaluated ephemeral requests</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {jitRequests.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {jitRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{req.userName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    req.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    req.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">Target: <strong className="text-slate-100">{req.targetResource}</strong></p>
                <p className="text-[10px] text-slate-400 italic">"{req.reason}"</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Risk Score: <strong className="text-amber-400">{req.riskEvaluation.score}/100</strong></span>
                  {req.status === 'Pending' && currentUserRole === 'Administrator' && (
                    <button
                      onClick={() => onApproveJITKey(req.id)}
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      Approve & Issue Key
                    </button>
                  )}
                  {req.status === 'Approved' && (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" /> Ephemeral ({req.requestedDurationMinutes}m)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KMS Keys Explorer Column */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Cryptographic Key Registry & Rotation Log
              </h3>
              <p className="text-xs text-slate-400">Managed keys across cloud provider HSM clusters</p>
            </div>
          </div>

          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{key.keyAlias}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                      {key.algorithm}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      key.type === 'Temporary JIT Key' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {key.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    HSM Ring: {key.hsmModule} | Usage Count: <strong className="text-slate-200 font-mono">{key.usageCount}</strong>
                  </p>

                  <p className="text-[10px] font-mono text-slate-400">
                    Created: {key.createdAt.slice(0, 10)} | Expires: {key.expiresAt.slice(0, 10)}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onRotateKey(key.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Rotate Key
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* JIT Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Submit Just-In-Time (JIT) Key Request
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Target Cloud Resource</label>
                <input
                  type="text"
                  value={targetResource}
                  onChange={(e) => setTargetResource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Justification Reason</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Duration (Minutes until auto-expiry)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-amber-500"
                >
                  <option value={15}>15 Minutes (Emergency Patch)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (Standard Maintenance)</option>
                  <option value={120}>120 Minutes (Extended Ops)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  Submit for Risk Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
