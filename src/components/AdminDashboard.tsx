import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  FileCheck, 
  Cloud, 
  AlertOctagon, 
  KeyRound, 
  Activity, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { User, CloudProvider, FileItem, EncryptionKey, ThreatAlert, SecurityTelemetryEvent } from '../types';

interface AdminDashboardProps {
  users: User[];
  cloudProviders: CloudProvider[];
  files: FileItem[];
  keys: EncryptionKey[];
  threats: ThreatAlert[];
  telemetry: SecurityTelemetryEvent[];
  securityScore: number;
  onNavigateTab: (tab: any) => void;
  onMitigateThreat: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  cloudProviders,
  files,
  keys,
  threats,
  telemetry,
  securityScore,
  onNavigateTab,
  onMitigateThreat
}) => {

  // Recharts Mock Datasets
  const threatTimelineData = [
    { time: '00:00', attacks: 12, mitigated: 12, risk: 15 },
    { time: '04:00', attacks: 8, mitigated: 8, risk: 10 },
    { time: '08:00', attacks: 24, mitigated: 22, risk: 28 },
    { time: '12:00', attacks: 45, mitigated: 44, risk: 35 },
    { time: '16:00', attacks: 30, mitigated: 30, risk: 20 },
    { time: '20:00', attacks: 18, mitigated: 17, risk: 12 }
  ];

  const cloudRiskData = cloudProviders.map(c => ({
    name: c.name,
    compliance: c.complianceScore,
    riskScore: c.riskScore,
    resources: c.connectedResources
  }));

  const classificationData = [
    { name: 'Public', value: files.filter(f => f.classification === 'Public').length + 2, color: '#3b82f6' },
    { name: 'Internal', value: files.filter(f => f.classification === 'Internal').length + 5, color: '#10b981' },
    { name: 'Confidential', value: files.filter(f => f.classification === 'Confidential').length + 8, color: '#f59e0b' },
    { name: 'Highly Confidential', value: files.filter(f => f.classification === 'Highly Confidential').length + 12, color: '#f43f5e' }
  ];

  const encryptionAlgoData = [
    { algo: 'AES-256-GCM', files: 45, keyType: 'Symmetric' },
    { algo: 'RSA-4096 Hybrid', files: 28, keyType: 'Asymmetric' },
    { algo: 'ECC-P384', files: 19, keyType: 'Elliptic Curve' },
    { algo: 'SHA-512 Signed', files: 34, keyType: 'Digest' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Summary Cards Row - High Density Glass Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Encrypted Files */}
        <div className="glass p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Total Encrypted Files</span>
            <span className="text-blue-500 font-bold text-xs">↑</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">{files.length > 0 ? files.length + 1402910 : '1,402,912'}</div>
          <div className="stat-bar mt-3"><div className="stat-fill-blue" style={{ width: '85%' }}></div></div>
        </div>

        {/* Active JIT Keys */}
        <div className="glass p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Active JIT Keys</span>
            <span className="text-emerald-500 text-xs">●</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">{keys.length > 0 ? keys.length * 142 : '842'}</div>
          <div className="stat-bar mt-3"><div className="stat-fill-green" style={{ width: '89%' }}></div></div>
        </div>

        {/* Policy Violations / Threats */}
        <div className="glass p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Active Policy Alerts</span>
            <span className="text-rose-500 text-xs">⚠️</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">0{threats.filter(t => t.status === 'Active').length || 2}</div>
          <div className="stat-bar mt-3"><div className="stat-fill-red" style={{ width: '18%' }}></div></div>
        </div>

        {/* Global Health Index */}
        <div className="glass p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter font-mono">Global Security Index</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">{securityScore}%</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">Optimal</div>
          <div className="flex gap-1 mt-3">
            <div className="h-1 flex-1 bg-emerald-500 rounded-sm"></div>
            <div className="h-1 flex-1 bg-emerald-500 rounded-sm"></div>
            <div className="h-1 flex-1 bg-emerald-500 rounded-sm"></div>
            <div className="h-1 bg-slate-700 w-8 rounded-sm"></div>
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threat Attack Volume Timeline */}
        <div className="lg:col-span-2 glass rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Threat Attack Volume & Automated Containment (24h)
              </h3>
              <p className="text-[11px] text-slate-500">Real-time telemetry event stream across multi-cloud mesh</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/50">
              LIVE TELEMETRY
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatTimelineData}>
                <defs>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }} 
                  itemStyle={{ color: '#f8fafc', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="attacks" stroke="#ef4444" fillOpacity={1} fill="url(#colorAttacks)" name="Threat Events" />
                <Area type="monotone" dataKey="mitigated" stroke="#10b981" fillOpacity={1} fill="url(#colorMitigated)" name="Auto-Mitigated" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Classification Pie Chart */}
        <div className="glass rounded-xl p-5 shadow-xl">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Data Classification Spread
            </h3>
            <p className="text-[11px] text-slate-500">Asset distribution by clearance tier</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }} 
                />
                <Legend formatter={(value) => <span className="text-[11px] text-slate-400 font-mono">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Secondary Grid: Multi-Cloud Risk & Active Threat Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Multi-Cloud Compliance & Risk Bar Chart */}
        <div className="glass rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-400" />
                Multi-Cloud Provider Compliance Index
              </h3>
              <p className="text-[11px] text-slate-500">SOC2, HIPAA & ISO27001 posture</p>
            </div>
            <button 
              onClick={() => onNavigateTab('policy-engine')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono font-bold"
            >
              Policy Engine →
            </button>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cloudRiskData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1117', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }} 
                />
                <Bar dataKey="compliance" fill="#3b82f6" name="Compliance %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="riskScore" fill="#ef4444" name="Risk Exposure %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Threat Ticker & Quick Containment */}
        <div className="glass rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Threat Radar & Incident Response
              </h3>
              <p className="text-[11px] text-slate-500">Live security events requiring review or containment</p>
            </div>
            <button 
              onClick={() => onNavigateTab('threats')}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-mono font-bold"
            >
              All Threat Logs →
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-60 pr-1 flex-1">
            {threats.map((threat) => (
              <div 
                key={threat.id} 
                className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs transition-all ${
                  threat.status === 'Active' 
                    ? 'bg-rose-950/30 border-rose-500/30 text-rose-200' 
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      threat.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {threat.severity}
                    </span>
                    <span className="font-semibold text-white">{threat.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{threat.affectedTarget}</p>
                  <p className="text-[10px] font-mono text-blue-400">Action: {threat.recommendedAction}</p>
                </div>

                <div>
                  {threat.status === 'Active' ? (
                    <button
                      onClick={() => onMitigateThreat(threat.id)}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] font-mono transition-all shadow"
                    >
                      Contain Now
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {threat.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Quick Action Operations Bar - High Density Glass Styling */}
      <div className="glass p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-900/30 border border-blue-500/30 text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero-Trust Command Operations</h4>
            <p className="text-[11px] text-slate-500">Execute immediate cryptographic emergency containment or policy sync</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onNavigateTab('kms-jit')}
            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Request JIT Key
          </button>
          <button 
            onClick={() => onNavigateTab('abac')}
            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            ABAC Simulator
          </button>
          <button 
            onClick={() => onNavigateTab('file-vault')}
            className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow"
          >
            <Lock className="w-3.5 h-3.5" />
            Upload File to Encrypt
          </button>
        </div>
      </div>

    </div>
  );
};
