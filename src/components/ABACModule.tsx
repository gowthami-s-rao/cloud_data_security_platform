import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Laptop, 
  Clock, 
  UserCheck, 
  FileLock, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { UserRole, DataClassification } from '../types';

export const ABACModule: React.FC = () => {
  // ABAC Context Form State
  const [role, setRole] = useState<UserRole>('Employee');
  const [department, setDepartment] = useState('Global Finance');
  const [location, setLocation] = useState('Bangalore, IN');
  const [deviceType, setDeviceType] = useState<'Company Laptop' | 'Personal Device' | 'Mobile'>('Company Laptop');
  const [time, setTime] = useState('14:30 (Office Hours)');
  const [securityClearance, setSecurityClearance] = useState<'Top Secret' | 'Secret' | 'Confidential' | 'Unclassified'>('Confidential');
  const [dataClassification, setDataClassification] = useState<DataClassification>('Confidential');
  const [resourceName, setResourceName] = useState('Q3_Financial_Audit_Report.pdf');

  // Evaluation state
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/abac/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          department,
          location,
          deviceType,
          time,
          securityClearance,
          dataClassification,
          resourceName
        })
      });
      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  // Preset scenarios matching user request examples
  const loadScenario = (type: string) => {
    if (type === 'finance_manager') {
      setRole('Employee');
      setDepartment('Global Finance');
      setLocation('Bangalore, IN');
      setDeviceType('Company Laptop');
      setTime('14:30 (Office Hours)');
      setSecurityClearance('Confidential');
      setDataClassification('Confidential');
      setResourceName('Q3_Financial_Audit_Report.pdf');
    } else if (type === 'guest_untrusted') {
      setRole('Guest User');
      setDepartment('Contractors');
      setLocation('Unknown Country (Anonymized VPN)');
      setDeviceType('Personal Device');
      setTime('23:15 (Off Hours)');
      setSecurityClearance('Unclassified');
      setDataClassification('Highly Confidential');
      setResourceName('AWS_Production_KMS_Secret_Manifest.json');
    } else if (type === 'developer_jit') {
      setRole('Developer');
      setDepartment('Engineering Services');
      setLocation('Bangalore, IN');
      setDeviceType('Company Laptop');
      setTime('10:00 (Office Hours)');
      setSecurityClearance('Secret');
      setDataClassification('Highly Confidential');
      setResourceName('AWS RDS Production Database');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            Dynamic Attribute-Based Access Control (ABAC) Engine
          </h2>
          <p className="text-xs text-slate-400">
            Real-time context evaluation factoring Role, Department, Location, Device Trust, Time, Clearance, and Data Classification
          </p>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Scenarios:</span>
          <button
            onClick={() => loadScenario('finance_manager')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium transition-all"
          >
            Finance Mgr (Bangalore)
          </button>
          <button
            onClick={() => loadScenario('guest_untrusted')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-medium transition-all"
          >
            Guest (Untrusted Device)
          </button>
          <button
            onClick={() => loadScenario('developer_jit')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-medium transition-all"
          >
            Developer (Prod DB Access)
          </button>
        </div>
      </div>

      {/* Main ABAC Grid: Form & Decision Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Requester Context Builder */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Requester Context Attributes
            </h3>
            <span className="text-xs text-cyan-400 font-mono">XACML 3.0 Compatible</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* User Role */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">User Role (Subject)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
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

            {/* Department */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Location & IP */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Origin Location / Geofence</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 pl-7 text-slate-100 outline-none focus:border-cyan-500"
                />
                <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2 top-2.5" />
              </div>
            </div>

            {/* Device Type */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Device Type & Health</label>
              <div className="relative">
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 pl-7 text-slate-100 outline-none focus:border-cyan-500"
                >
                  <option value="Company Laptop">Company Laptop (Managed)</option>
                  <option value="Personal Device">Personal Device (BYOD)</option>
                  <option value="Mobile">Mobile Node</option>
                </select>
                <Laptop className="w-3.5 h-3.5 text-cyan-400 absolute left-2 top-2.5" />
              </div>
            </div>

            {/* Time Window */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Time Window Context</label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 pl-7 text-slate-100 outline-none focus:border-cyan-500"
                />
                <Clock className="w-3.5 h-3.5 text-cyan-400 absolute left-2 top-2.5" />
              </div>
            </div>

            {/* Security Clearance */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">User Security Clearance</label>
              <select
                value={securityClearance}
                onChange={(e) => setSecurityClearance(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="Top Secret">Top Secret Level</option>
                <option value="Secret">Secret Level</option>
                <option value="Confidential">Confidential Level</option>
                <option value="Unclassified">Unclassified</option>
              </select>
            </div>

            {/* Target Data Classification */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Asset Classification</label>
              <select
                value={dataClassification}
                onChange={(e) => setDataClassification(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="Public">Public Asset</option>
                <option value="Internal">Internal Asset</option>
                <option value="Confidential">Confidential Asset</option>
                <option value="Highly Confidential">Highly Confidential Asset</option>
              </select>
            </div>

            {/* Target Resource Name */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Resource</label>
              <div className="relative">
                <input
                  type="text"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 pl-7 text-slate-100 outline-none focus:border-cyan-500"
                />
                <FileLock className="w-3.5 h-3.5 text-cyan-400 absolute left-2 top-2.5" />
              </div>
            </div>

          </div>

          <button
            onClick={handleEvaluate}
            disabled={evaluating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {evaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Evaluate Access Decision Engine
          </button>
        </div>

        {/* Real-time Decision Output & Matrix Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ABAC Decision Output Matrix
            </h3>
            <span className="text-xs text-slate-400">PDP Evaluation Engine</span>
          </div>

          {evalResult ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Decision Badge Card */}
              <div className={`p-4 rounded-xl border text-center space-y-2 ${
                evalResult.permit 
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                  : 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {evalResult.permit ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-400 animate-bounce" />
                  )}
                  <span className={`text-2xl font-extrabold font-mono ${
                    evalResult.permit ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {evalResult.decision} ACCESS
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Request for <strong className="text-slate-100">{resourceName}</strong> evaluated in <span className="font-mono text-cyan-400">2.1ms</span>
                </p>
              </div>

              {/* Rules Evaluation List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluated Policy Rules</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  {evalResult.rulesEvaluated.map((r: string, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800/80 text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deny Reasons if any */}
              {evalResult.denyReasons && evalResult.denyReasons.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/80 space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Policy Violations Triggered:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                    {evalResult.denyReasons.map((reason: string, idx: number) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[10px] text-slate-400 font-mono text-right">
                Logged to Audit Trail ID: aud-{Date.now().toString().slice(-6)}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 border-2 border-dashed border-slate-800 rounded-xl">
              <SlidersHorizontal className="w-10 h-10 text-slate-600 animate-pulse" />
              <div>
                <h4 className="text-sm font-semibold text-slate-300">Awaiting Evaluation Test</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Adjust requester attributes on the left and click "Evaluate Access Decision Engine" or pick a scenario above.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
