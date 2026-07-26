import React, { useState } from 'react';
import { 
  Cloud, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Plus, 
  Play, 
  FileCode, 
  Layers, 
  Settings, 
  RefreshCw 
} from 'lucide-react';
import { CloudProvider, PolicyRule, UserRole } from '../types';

interface MultiCloudPolicyEngineProps {
  cloudProviders: CloudProvider[];
  policies: PolicyRule[];
  onCreatePolicy: (policy: Partial<PolicyRule>) => void;
}

export const MultiCloudPolicyEngine: React.FC<MultiCloudPolicyEngineProps> = ({
  cloudProviders,
  policies,
  onCreatePolicy
}) => {
  const [selectedCloud, setSelectedCloud] = useState<string>('AWS');
  const [showBuilder, setShowBuilder] = useState(false);
  
  // Policy Builder Form State
  const [policyName, setPolicyName] = useState('');
  const [providerChoice, setProviderChoice] = useState('Google Cloud');
  const [actionChoice, setActionChoice] = useState<'ALLOW' | 'DENY' | 'REQUIRE_JIT'>('ALLOW');
  const [resourceChoice, setResourceChoice] = useState('Confidential Financial Database');
  const [rolesChoice, setRolesChoice] = useState<UserRole[]>(['Administrator', 'Security Officer']);

  // Simulation test state
  const [simRole, setSimRole] = useState<UserRole>('Developer');
  const [simLocation, setSimLocation] = useState('Bangalore, IN');
  const [simResult, setSimResult] = useState<any>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName) return;

    onCreatePolicy({
      name: policyName,
      cloudProvider: providerChoice,
      action: actionChoice,
      resourceType: resourceChoice,
      subjectRole: rolesChoice,
      conditions: {
        allowedLocations: [simLocation],
        maxRiskScore: 30
      }
    });

    setPolicyName('');
    setShowBuilder(false);
  };

  const handleRunSimulation = () => {
    // Local simulation logic matching policy rules
    const matchingPolicy = policies.find(p => p.cloudProvider === selectedCloud || p.subjectRole.includes(simRole));
    
    if (matchingPolicy) {
      setSimResult({
        decision: matchingPolicy.action === 'ALLOW' ? 'PERMITTED' : matchingPolicy.action === 'REQUIRE_JIT' ? 'JIT_REQUIRED' : 'DENIED',
        policyMatched: matchingPolicy.name,
        version: matchingPolicy.version,
        timestamp: new Date().toLocaleTimeString(),
        reason: `Matched active rule [${matchingPolicy.name}] for role '${simRole}' on ${selectedCloud}.`
      });
    } else {
      setSimResult({
        decision: 'DENIED',
        policyMatched: 'Default Fallback Zero-Trust Deny',
        version: 'v1.0',
        timestamp: new Date().toLocaleTimeString(),
        reason: `No explicit ALLOW rule found for '${simRole}' in ${selectedCloud}. Default Zero-Trust stance enforced.`
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyan-400" />
            Multi-Cloud Policy Engine & Mesh Federation
          </h2>
          <p className="text-xs text-slate-400">
            Unified policy enforcement across AWS, Azure, GCP, Oracle Cloud, IBM, and Digital Ocean
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showBuilder ? 'Close Builder' : 'Create New Policy Rule'}
        </button>
      </div>

      {/* Cloud Mesh Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cloudProviders.map((cloud) => (
          <div
            key={cloud.id}
            onClick={() => setSelectedCloud(cloud.name)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              selectedCloud === cloud.name
                ? 'bg-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-cyan-400 text-xs">
                  {cloud.name.substring(0, 3)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{cloud.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{cloud.region}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                cloud.status === 'Healthy' 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}>
                {cloud.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Compliance:</span>
                <span className="font-mono font-bold text-emerald-400">{cloud.complianceScore}% SOC2</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Active Rules:</span>
                <span className="font-mono font-bold text-cyan-400">{cloud.activePolicies} Policies</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Encryption: <strong className="text-slate-200">{cloud.encryptionStatus}</strong></span>
              <span className="text-[10px] font-mono text-cyan-400">Risk: {cloud.riskScore}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Builder Drawer Modal if opened */}
      {showBuilder && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Policy Definition Studio & Version Control
            </h3>
            <span className="text-xs text-cyan-400 font-mono">v3.2 Policy Syntax</span>
          </div>

          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Policy Title / Identifier</label>
              <input
                type="text"
                placeholder="e.g. Zero-Trust Geofence for Confidential Code"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Cloud Provider</label>
              <select
                value={providerChoice}
                onChange={(e) => setProviderChoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:border-cyan-500 outline-none"
              >
                {cloudProviders.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Policy Action</label>
              <select
                value={actionChoice}
                onChange={(e) => setActionChoice(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:border-cyan-500 outline-none"
              >
                <option value="ALLOW">ALLOW Access</option>
                <option value="DENY">DENY Access</option>
                <option value="REQUIRE_JIT">REQUIRE JIT Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Protected Resource Type</label>
              <input
                type="text"
                value={resourceChoice}
                onChange={(e) => setResourceChoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg"
              >
                Deploy Policy to Cloud Mesh
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Policy Active Rules & Simulation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Rules List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Active Multi-Cloud Policy Rules ({selectedCloud})
              </h3>
              <p className="text-xs text-slate-400">Declarative ABAC rules deployed to cloud gateways</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {policies.length} Total Deployed
            </span>
          </div>

          <div className="space-y-3">
            {policies.map((p) => (
              <div 
                key={p.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {p.version}
                    </span>
                    <span className="font-bold text-slate-100">{p.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.action === 'ALLOW' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      p.action === 'REQUIRE_JIT' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {p.action}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Applies to: <strong className="text-slate-200">{p.resourceType}</strong> | Roles: {p.subjectRole.join(', ')}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    Conditions: Clearance ≥ {p.conditions.minClearance || 'Confidential'} | Max Risk: {p.conditions.maxRiskScore || 50}%
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3" /> Enforced
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Sandbox & Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              Policy Sandbox Simulator
            </h3>
            <p className="text-xs text-slate-400">Test policy evaluation logic before production sync</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Simulated Requester Role</label>
              <select
                value={simRole}
                onChange={(e) => setSimRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
              >
                <option value="Administrator">Administrator</option>
                <option value="Security Officer">Security Officer</option>
                <option value="Cloud Manager">Cloud Manager</option>
                <option value="Developer">Developer</option>
                <option value="Employee">Employee</option>
                <option value="Auditor">Auditor</option>
                <option value="Guest User">Guest User</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Origin Location / Geofence</label>
              <input
                type="text"
                value={simLocation}
                onChange={(e) => setSimLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              Run Policy Simulation
            </button>

            {simResult && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Decision Outcome:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                    simResult.decision === 'PERMITTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    simResult.decision === 'JIT_REQUIRED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {simResult.decision}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{simResult.reason}</p>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Rule: {simResult.policyMatched}</span>
                  <span>{simResult.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
