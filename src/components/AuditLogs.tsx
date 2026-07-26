import React, { useState } from 'react';
import { 
  FileSearch, 
  Search, 
  Download, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsProps {
  auditLogs: AuditLog[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log => 
    log.actor.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.resource.toLowerCase().includes(search.toLowerCase()) ||
    log.ipAddress.includes(search)
  );

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Timestamp,Actor,Role,Action,Resource,Decision,IP,Location,Fingerprint"].join(",") + "\n"
      + filtered.map(l => `${l.id},${l.timestamp},"${l.actor}",${l.role},${l.action},"${l.resource}",${l.policyDecision},${l.ipAddress},"${l.location}",${l.cryptoFingerprint}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Security_Audit_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="glass rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-blue-400" />
            Audit Log Explorer & Forensics Trail
          </h2>
          <p className="text-[11px] text-slate-400">
            Immutable cryptographic audit logs for compliance verification (SOC2, HIPAA, ISO27001)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 flex items-center gap-2 transition-all font-mono"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-2 transition-all font-mono"
          >
            <FileText className="w-3.5 h-3.5" /> Export PDF Summary
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass rounded-xl p-3.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search audit trail by actor name, action type, resource, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A0C10] border border-white/10 rounded py-1.5 pl-9 pr-3 text-slate-200 text-xs font-mono outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2" />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161B22] border-b border-white/10 text-slate-400 uppercase font-mono text-[10px] font-bold">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Action Executed</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Origin Location</th>
                <th className="p-3">Crypto Fingerprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-slate-400">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                  <td className="p-3">
                    <span className="font-bold text-white">{log.actor}</span>
                    <span className="block text-[10px] text-blue-400">{log.role}</span>
                  </td>
                  <td className="p-3 font-bold text-slate-200">{log.action}</td>
                  <td className="p-3 text-slate-300">{log.resource}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.policyDecision === 'PERMIT' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {log.policyDecision}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{log.location} ({log.ipAddress})</td>
                  <td className="p-3 text-blue-400 text-[10px]">{log.cryptoFingerprint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
