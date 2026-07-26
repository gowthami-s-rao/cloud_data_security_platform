import React from 'react';
import { 
  ShieldAlert, 
  Cloud, 
  KeyRound, 
  FileText, 
  Activity, 
  AlertTriangle, 
  FileSearch, 
  BarChart3, 
  BookOpen, 
  Sliders, 
  Key, 
  SlidersHorizontal 
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'dashboard' 
  | 'policy-engine' 
  | 'abac' 
  | 'file-vault' 
  | 'kms-jit' 
  | 'telemetry' 
  | 'threats' 
  | 'audit-logs' 
  | 'reports';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  threatsCount: number;
  jitPendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  threatsCount,
  jitPendingCount
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Admin Command Center', icon: BarChart3, badge: 'Live' },
    { id: 'policy-engine' as ActiveTab, label: 'Multi-Cloud Policy Engine', icon: Cloud },
    { id: 'abac' as ActiveTab, label: 'Dynamic ABAC Engine', icon: SlidersHorizontal },
    { id: 'file-vault' as ActiveTab, label: 'Inline Data Vault & PII', icon: FileText },
    { id: 'kms-jit' as ActiveTab, label: 'JIT Key Management (KMS)', icon: KeyRound, count: jitPendingCount, countColor: 'bg-amber-500' },
    { id: 'telemetry' as ActiveTab, label: 'Security Telemetry', icon: Activity },
    { id: 'threats' as ActiveTab, label: 'Threat Radar & Detection', icon: AlertTriangle, count: threatsCount, countColor: 'bg-rose-500' },
    { id: 'audit-logs' as ActiveTab, label: 'Audit Logs & Forensics', icon: FileSearch },
    { id: 'reports' as ActiveTab, label: 'Compliance Reports', icon: ShieldAlert },
    { id: 'overview' as ActiveTab, label: 'Platform Architecture', icon: BookOpen }
  ];

  return (
    <aside className="w-56 bg-[#0D1117] border-r border-white/5 flex flex-col shrink-0 overflow-y-auto">
      <div className="pt-4 flex-1">
        <div className="px-4 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Main Console
        </div>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'active-nav text-blue-400 font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-900/40 text-blue-400 border border-blue-500/30 font-mono font-bold">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded text-slate-950 font-bold font-mono ${item.countColor}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cloud & Connectivity Status Widget */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">API Connectivity</p>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 leading-tight">
          <span>Latency: 12ms</span>
          <span>Region: us-east-1</span>
        </div>
      </div>
    </aside>
  );
};
