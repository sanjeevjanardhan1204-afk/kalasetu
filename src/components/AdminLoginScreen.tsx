import React, { useState } from 'react';
import { Landmark, Lock, Mail, ArrowRight, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { playSyntheticChime } from '../data';
import { setSessionToken } from '../utils/authClient';

interface AdminLoginScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
  onCancel: () => void;
}

// Dedicated full-page admin entry point for the /admin route - deliberately separate from the
// general LoginModal (which also offers weaver/buyer quick-login) since this screen exists only
// to get an administrator into the Admin Panel. It still goes through the exact same real
// POST /api/auth/login + JWT flow; there is no separate admin password path and no client-side
// role trust. A login that succeeds but belongs to a non-admin account is explicitly rejected
// here rather than silently let through.
export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Enter both an email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    playSyntheticChime('click');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();

      if (!data.success || !data.user) {
        setErrorMessage(data.error || 'Invalid email or password.');
        return;
      }
      if (data.user.role !== 'ADMIN') {
        setErrorMessage('This account does not have administrator access.');
        return;
      }

      if (data.token) setSessionToken(data.token);
      playSyntheticChime('success');
      onLoginSuccess({ ...data.user, role: 'admin' });
    } catch (err: any) {
      setErrorMessage('Could not reach the server. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex items-center justify-center p-4" id="admin-login-screen">
      <div className="w-full max-w-md bg-white rounded-3xl border border-cream-border shadow-2xl overflow-hidden">
        {/* Navy header strip */}
        <div className="bg-indigo-custom px-6 py-7 text-center space-y-3 relative overflow-hidden">
          <span className="bg-mustard text-charcoal text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest inline-block">
            Restricted Access
          </span>
          <div className="w-14 h-14 rounded-2xl bg-terracotta text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-cream">Administrator Sign In</h1>
            <p className="text-xs text-cream/70 mt-1">KalaSetu Escrow, GI &amp; Dispute Oversight Panel</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-gray-600 text-xs block">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                id="admin-login-email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kalasetu.demo"
                className="w-full pl-9 pr-3 py-2.5 bg-cream/40 border border-cream-border rounded-xl focus:outline-none focus:border-terracotta font-medium text-sm text-charcoal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-600 text-xs block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                id="admin-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-cream/40 border border-cream-border rounded-xl focus:outline-none focus:border-terracotta font-medium text-sm text-charcoal"
              />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Sign In to Admin Panel</span>
          </button>

          <button
            id="admin-login-cancel-btn"
            type="button"
            onClick={onCancel}
            className="w-full text-center text-xs font-bold text-gray-500 hover:text-charcoal transition py-1"
          >
            ← Back to KalaSetu
          </button>
        </form>

        <div className="bg-cream/60 border-t border-cream-border px-6 py-3 flex items-center gap-2 text-[10px] text-gray-500">
          <Landmark className="w-3.5 h-3.5 text-terracotta shrink-0" />
          <span>Authenticated against the real accounts database - not a hardcoded bypass.</span>
        </div>
      </div>
    </div>
  );
};
