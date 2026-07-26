import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  User, 
  Key, 
  Lock, 
  ChevronDown, 
  Activity, 
  Zap, 
  LogOut, 
  Sliders, 
  Globe 
} from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  unreadAlertsCount: number;
  securityScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onOpenAuth,
  onOpenNotifications,
  unreadAlertsCount,
  securityScore
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: UserRole[] = [
    'Administrator',
    'Security Officer',
    'Cloud Manager',
    'Developer',
    'Employee',
    'Auditor',
    'Guest'
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Administrator': return 'bg-purple-950 text-purple-300 border-purple-700/50';
      case 'Security Officer': return 'bg-rose-950 text-rose-300 border-rose-700/50';
      case 'Cloud Manager': return 'bg-cyan-950 text-cyan-300 border-cyan-700/50';
      case 'Developer': return 'bg-blue-950 text-blue-300 border-blue-700/50';
      case 'Employee': return 'bg-slate-800 text-slate-300 border-slate-600/50';
      case 'Auditor': return 'bg-emerald-950 text-emerald-300 border-emerald-700/50';
      case 'Guest': return 'bg-amber-950 text-amber-300 border-amber-700/50';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <header className="h-14 sticky top-0 z-40 bg-[#0D1117] border-b border-white/5 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* Brand & Live Telemetry Marquee */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  AEGIS<span className="text-blue-500">VAULT</span> PRO
                </span>
                <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-[10px] font-bold rounded border border-blue-500/30 uppercase tracking-wide">
                  Enterprise v4.2
                </span>
              </div>
            </div>
          </div>

          {/* Security Score Ticker */}
          <div className="hidden lg:flex items-center gap-6 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Security Score</p>
              <p className="text-sm font-mono text-emerald-400 font-bold">{securityScore}.2%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Active Threats</p>
              <p className="text-sm font-mono text-rose-400 font-bold">{unreadAlertsCount < 10 ? `0${unreadAlertsCount}` : unreadAlertsCount}</p>
            </div>
            <div className="text-right hidden xl:block">
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">KMS Crypt Engine</p>
              <p className="text-xs font-mono text-blue-400 font-bold">FIPS 140-2 L3</p>
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400 hidden md:inline text-[11px] font-mono">ROLE:</span>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0D1117] border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">
                  Switch User Persona
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      currentUser.role === r ? 'bg-white/10 text-blue-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{r}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRoleBadgeColor(r)}`}>
                      {r === currentUser.role ? 'Current' : 'Select'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Security Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

          {/* User Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-blue-400 text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-white font-semibold text-xs leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">{currentUser.email}</div>
            </div>
            <LogOut className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

        </div>

      </div>
    </header>
  );
};
