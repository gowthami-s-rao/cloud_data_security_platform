import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Lock, 
  Eye, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Trash2, 
  History, 
  FileSearch, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';
import { FileItem, UserRole } from '../types';

interface InlineDataPipelineProps {
  files: FileItem[];
  currentUserRole: UserRole;
  currentUserName: string;
  onUploadFile: (formData: any) => Promise<any>;
  onDecryptFile: (fileId: string) => Promise<any>;
}

export const InlineDataPipeline: React.FC<InlineDataPipelineProps> = ({
  files,
  currentUserRole,
  currentUserName,
  onUploadFile,
  onDecryptFile
}) => {
  const [uploadName, setUploadName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadClassification, setUploadClassification] = useState('Confidential');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineReport, setPipelineReport] = useState<any>(null);

  // Decryption preview modal
  const [activeFileDecrypt, setActiveFileDecrypt] = useState<any>(null);
  const [decryptModalOpen, setDecryptModalOpen] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadContent(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleSampleText = () => {
    setUploadName('Q3_Payroll_Audit_Secrets.txt');
    setUploadContent(
      `CONFIDENTIAL PAYROLL & INFRASTRUCTURE MANIFEST 2026\n\n` +
      `Director SSN: 241-88-9012\n` +
      `Corporate Credit Card: 4532-8910-1122-3344\n` +
      `AWS Secret Access Key: sk-live-9900112233445566778899a\n` +
      `Contact Email: alexander.wright@securesaas.io\n\n` +
      `Notes: Urgent financial audit clearance required for Bangalore team.`
    );
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadContent) return;

    setIsProcessing(true);
    setPipelineReport(null);

    const report = await onUploadFile({
      name: uploadName || 'Uploaded_Document.txt',
      content: uploadContent,
      rawClassification: uploadClassification,
      ownerName: currentUserName,
      userRole: currentUserRole
    });

    setIsProcessing(false);
    setPipelineReport(report?.pipelineReport);
    setUploadName('');
    setUploadContent('');
  };

  const handleDecryptClick = async (file: FileItem) => {
    const res = await onDecryptFile(file.id);
    if (res?.success) {
      setActiveFileDecrypt({
        ...file,
        previewText: res.decryptedPreviewText,
        watermark: res.watermark
      });
      setDecryptModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Inline Data Manipulation & Encryption Vault
        </h2>
        <p className="text-xs text-slate-400">
          Automated classification, real-time PII redaction, AES-256 GCM encryption, RSA-4096 digital signing, and watermark tagging
        </p>
      </div>

      {/* Main Grid: Upload Pipeline & File Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload & Inline Processing Engine */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              Upload & Inline Protection Pipeline
            </h3>
            <button
              onClick={handleSampleText}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" /> Load PII Sample
            </button>
          </div>

          <form onSubmit={handleSubmitUpload} className="space-y-3 text-xs">
            
            {/* File Name */}
            <div>
              <label className="block text-slate-300 mb-1">Document Name</label>
              <input
                type="text"
                placeholder="e.g. Q3_Financial_Audit.pdf"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Target Classification */}
            <div>
              <label className="block text-slate-300 mb-1">Data Classification</label>
              <select
                value={uploadClassification}
                onChange={(e) => setUploadClassification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="Internal">Internal Document</option>
                <option value="Confidential">Confidential Document</option>
                <option value="Highly Confidential">Highly Confidential Asset</option>
                <option value="Public">Public Document</option>
              </select>
            </div>

            {/* Drag and Drop Zone / Content Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 bg-slate-950/60 transition-all text-center space-y-2"
            >
              <textarea
                rows={5}
                placeholder="Paste raw text or drop document file here to scan for PII, SSN, Credit Cards, and API keys..."
                value={uploadContent}
                onChange={(e) => setUploadContent(e.target.value)}
                className="w-full bg-transparent text-slate-200 text-xs font-mono outline-none resize-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Drag & drop files or type sensitive content above
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !uploadContent}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Execute Inline Pipeline & Encrypt
            </button>
          </form>

          {/* Pipeline Report Output */}
          {pipelineReport && (
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-1.5">
                <span>Pipeline Processing Complete</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                <p>PII Detected: <strong className="text-amber-400">{pipelineReport.piiDetected.length} Categories</strong></p>
                <p>Items Masked: <span className="text-emerald-400">{pipelineReport.maskedCount} Elements</span></p>
                <p>SHA-256 Digest: <span className="text-slate-400 text-[10px]">{pipelineReport.sha256Hash.substring(0, 22)}...</span></p>
                <p>Digital Signature: <span className="text-cyan-400 text-[10px]">{pipelineReport.digitalSignature}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Encrypted Vault File Explorer */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Protected Data Vault ({files.length} Assets)
              </h3>
              <p className="text-xs text-slate-400">All assets protected with AES-256 Hardware KMS and RSA-4096 Signatures</p>
            </div>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{file.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      file.classification === 'Highly Confidential' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      file.classification === 'Confidential' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {file.classification}
                    </span>
                    {file.isRedacted && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                        PII Redacted
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Owner: {file.ownerName} | Key ID: <span className="font-mono text-cyan-400">{file.keyId}</span>
                  </p>

                  <p className="text-[10px] font-mono text-slate-400">
                    Sig: {file.digitalSignature} | Hash: {file.sha256Hash.substring(0, 20)}...
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDecryptClick(file)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Decrypt & View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Decrypted File Preview Modal */}
      {decryptModalOpen && activeFileDecrypt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Decrypted Asset: {activeFileDecrypt.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  AES-256-GCM Key: {activeFileDecrypt.keyId}
                </p>
              </div>
              <button
                onClick={() => setDecryptModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-[10px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-800/40">
                ⚠️ DIGITAL WATERMARK INJECTED: Access logged to Audit Trail with Requester Fingerprint
              </div>
              <pre className="whitespace-pre-wrap text-slate-200 text-xs leading-relaxed max-h-72 overflow-y-auto">
                {activeFileDecrypt.previewText}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDecryptModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg"
              >
                Close Secure Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
