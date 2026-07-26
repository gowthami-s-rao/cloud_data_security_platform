import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cloud, 
  KeyRound, 
  SlidersHorizontal, 
  Zap, 
  CheckCircle2, 
  Server, 
  ArrowRight, 
  Award, 
  Globe 
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 border border-slate-800 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Enterprise Cryptography Foundation Architecture
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Cloud Data Security Platform with <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Inline Encryption & Dynamic ABAC</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Engineered for high-security multi-cloud environments across AWS, Azure, Google Cloud, and Oracle. Featuring Just-In-Time (JIT) Key Management, FIPS 140-2 Level 3 HSM simulation, real-time PII redaction, and unified telemetry.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onLaunchDashboard}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all"
            >
              Launch Admin Command Center <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Objectives Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-slate-100">Multi-Cloud Policy Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Federated policy enforcement for AWS, Azure, GCP, and Oracle with live policy versioning and evaluation sandbox.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-slate-100">Dynamic ABAC & Geofencing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Contextual decision engine calculating role, department, location, device trust, clearance level, and data sensitivity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-slate-100">Just-In-Time (JIT) Key Vault</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ephemeral key generation with HashiCorp Vault style approval workflows and automated countdown revocation.
          </p>
        </div>
      </div>

      {/* System Architecture Diagram Component */}
      <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-100">Enterprise System Architecture Model</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Zero-Trust API Gateway routing requests through ABAC evaluation, KMS JIT Key issuance, and Hardware AES-256 pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">1. User & Device</span>
            <span className="text-slate-400 text-[10px]">JWT / MFA / ABAC Context</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-800 space-y-1">
            <span className="text-cyan-400 font-bold block">2. API Gateway</span>
            <span className="text-slate-400 text-[10px]">Policy Engine Evaluation</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-purple-800 space-y-1">
            <span className="text-purple-400 font-bold block">3. ABAC & KMS Vault</span>
            <span className="text-slate-400 text-[10px]">JIT Ephemeral Key</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-800 space-y-1">
            <span className="text-emerald-400 font-bold block">4. Inline Crypto</span>
            <span className="text-slate-400 text-[10px]">AES-256 + PII Redaction</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold block">5. Multi-Cloud Mesh</span>
            <span className="text-slate-400 text-[10px]">AWS / Azure / GCP</span>
          </div>
        </div>
      </div>

    </div>
  );
};
