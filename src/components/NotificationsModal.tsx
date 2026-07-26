import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Slack, 
  Mail, 
  Smartphone, 
  Webhook 
} from 'lucide-react';
import { ThreatAlert } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  threats: ThreatAlert[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  threats
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Security Incident Alerts & Webhooks</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Alert Channels */}
        <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-center">
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-400">
            <Mail className="w-4 h-4 mx-auto mb-1" />
            <span>Email Alert</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
            <Smartphone className="w-4 h-4 mx-auto mb-1" />
            <span>SMS Active</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-purple-400">
            <Slack className="w-4 h-4 mx-auto mb-1" />
            <span>Slack Sync</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-400">
            <Webhook className="w-4 h-4 mx-auto mb-1" />
            <span>Webhook API</span>
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {threats.map((t) => (
            <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">{t.title}</span>
                <span className="text-[10px] font-mono text-rose-400">{t.severity}</span>
              </div>
              <p className="text-[11px] text-slate-400">{t.affectedTarget}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold">
            Dismiss Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
