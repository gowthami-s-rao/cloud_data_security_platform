import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Mail, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'mfa' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('a.wright@securesaas.io');
  const [password, setPassword] = useState('SuperSecretPass2026!');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>('Administrator');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tempUserId, setTempUserId] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.mfaEnabled) {
          setTempUserId(data.user.id);
          setMode('mfa');
        } else {
          onLoginSuccess(data.user);
          onClose();
        }
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      setErrorMsg('Network error communicating with Auth API');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tempUserId, otp })
      });
      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setErrorMsg('MFA verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {mode === 'login' ? 'Zero-Trust Secure Login' :
                 mode === 'mfa' ? '2FA Multi-Factor Auth' :
                 mode === 'signup' ? 'Create Security Account' : 'Password Reset'}
              </h3>
              <p className="text-[11px] text-slate-400">JWT & bcrypt Enforced</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Password (Encrypted via bcrypt)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Persona Role for Prototype Session</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="Administrator">Administrator</option>
                <option value="Security Officer">Security Officer</option>
                <option value="Cloud Manager">Cloud Manager</option>
                <option value="Developer">Developer</option>
                <option value="Employee">Employee</option>
                <option value="Auditor">Auditor</option>
                <option value="Guest User">Guest User</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Authenticate & Generate JWT
            </button>
          </form>
        )}

        {mode === 'mfa' && (
          <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs">
              🔒 Enter the 6-digit verification code sent to your Authenticator App or SMS (e.g., <strong>123456</strong>).
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium text-center">6-Digit OTP Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500 rounded-xl p-3 text-center text-xl font-mono tracking-widest text-cyan-300 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              Verify MFA Challenge
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
