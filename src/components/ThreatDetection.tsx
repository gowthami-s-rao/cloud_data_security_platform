import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  AlertOctagon, 
  Activity, 
  Lock 
} from 'lucide-react';
import { ThreatAlert } from '../types';

interface ThreatDetectionProps {
  threats: ThreatAlert[];
  onMitigateThreat: (id: string) => void;
}

export const ThreatDetection: React.FC<ThreatDetectionProps> = ({ threats, onMitigateThreat }) => {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Automated Threat Detection & Anomaly Radar
        </h2>
        <p className="text-xs text-slate-400">
          Machine intelligence scanner detecting Brute Force, Impossible Travel, Privilege Escalation, and Data Exfiltration
        </p>
      </div>

      {/* Threats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {threats.map((threat) => (
          <div
            key={threat.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              threat.status === 'Active'
                ? 'bg-rose-950/30 border-rose-800/80 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  threat.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {threat.severity}
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {threat.category}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{threat.detectedAt}</span>
            </div>

            <h3 className="font-bold text-slate-100 text-sm">{threat.title}</h3>
            <p className="text-xs text-slate-300">Target: <strong className="text-slate-100">{threat.affectedTarget}</strong></p>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
              💡 Recommended Containment: {threat.recommendedAction}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
              <span className="text-slate-400">Risk Severity Score: <strong className="text-rose-400 font-mono">{threat.riskScore}/100</strong></span>
              
              {threat.status === 'Active' ? (
                <button
                  onClick={() => onMitigateThreat(threat.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Execute Containment
                </button>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {threat.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
