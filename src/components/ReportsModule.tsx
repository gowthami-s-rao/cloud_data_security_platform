import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Download, 
  FileCheck, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { SecurityReport } from '../types';

interface ReportsModuleProps {
  reports: SecurityReport[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ reports }) => {
  const [reportList, setReportList] = useState<SecurityReport[]>(reports);

  const handleGenerateReport = (type: string) => {
    const newRep: SecurityReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title: `${type} Comprehensive Audit Report`,
      type: type as any,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      generatedBy: 'System Auto-Generator',
      summary: `Automated ${type} evaluation generated with 100% data integrity validation. Zero critical policy bypasses detected.`,
      status: 'Ready'
    };
    setReportList([newRep, ...reportList]);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Compliance & Security Report Center
          </h2>
          <p className="text-xs text-slate-400">
            Generate printable PDF, CSV, and Excel executive audit reports for SOC2, HIPAA, ISO27001, and GDPR
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleGenerateReport('Multi-Cloud Compliance')}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Compliance Report
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportList.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {report.type}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{report.generatedAt}</span>
            </div>

            <h3 className="font-bold text-slate-100 text-sm">{report.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{report.summary}</p>
            <p className="text-[10px] text-slate-400 font-mono">By: {report.generatedBy}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {report.status}
              </span>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1"
              >
                <Printer className="w-3 h-3" /> Print / Export
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
