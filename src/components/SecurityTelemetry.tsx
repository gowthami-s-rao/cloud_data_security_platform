import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Terminal, 
  Play, 
  Pause, 
  Download 
} from 'lucide-react';
import { SecurityTelemetryEvent } from '../types';

interface SecurityTelemetryProps {
  telemetry: SecurityTelemetryEvent[];
}

export const SecurityTelemetry: React.FC<SecurityTelemetryProps> = ({ telemetry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const filtered = telemetry.filter(t => {
    const matchesSearch = 
      t.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ipAddress.includes(searchTerm) ||
      (t.userEmail && t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = selectedSeverity === 'ALL' || t.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="glass rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Consolidated Security Telemetry Stream
          </h2>
          <p className="text-[11px] text-slate-400">
            Real-time unified log stream across Authentication, Policy Engine, KMS, Cloud Mesh, and Threat Radar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1 rounded text-xs font-bold font-mono flex items-center gap-2 transition-all ${
              isLiveStreaming 
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' 
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLiveStreaming ? 'Live Streaming' : 'Stream Paused'}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search telemetry by event type, IP address, user email, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0C10] border border-white/10 rounded py-1.5 pl-9 pr-3 text-slate-200 text-xs font-mono outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#0A0C10] border border-white/10 rounded p-1.5 text-slate-200 text-xs font-mono outline-none focus:border-blue-500 w-full"
          >
            <option value="ALL">All Severities</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Telemetry Stream Console Output */}
      <div className="glass rounded-xl p-4 shadow-2xl font-mono text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-slate-400 text-[11px]">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            TELEMETRY_REALTIME_BUS_STDOUT
          </span>
          <span className="text-[10px] text-blue-400 font-bold">
            Showing {filtered.length} Events
          </span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded bg-[#0A0C10]/90 border border-white/5 hover:border-white/15 transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    evt.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    evt.severity === 'Warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {evt.severity}
                  </span>
                  <span className="text-slate-100 font-bold">{evt.eventType}</span>
                  <span className="text-slate-500 text-[10px]">[{evt.source}]</span>
                </div>
                <span className="text-slate-500 text-[10px]">{evt.timestamp}</span>
              </div>

              <p className="text-slate-300 text-xs font-mono">{evt.details}</p>

              <div className="flex items-center gap-4 text-[10px] text-slate-500 border-t border-white/5 pt-1">
                <span>User: <strong className="text-slate-300">{evt.userEmail || 'System'}</strong></span>
                <span>IP: <strong className="text-blue-400">{evt.ipAddress}</strong></span>
                <span>Location: <strong className="text-slate-300">{evt.location}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
