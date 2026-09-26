import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, ArrowRight, X, Check, Landmark, AlertCircle, RefreshCw } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { playSyntheticChime } from '../data';
import { setSessionToken } from '../utils/authClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  language: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language
}) => {
  const [email, setEmail] = useState<string>('admin@kalasetu.demo');
  const [password, setPassword] = useState<string>('Admin@123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (overrideEmail?: string, overridePass?: string) => {
    const targetEmail = (overrideEmail || email).trim();
    const targetPass = overridePass !== undefined ? overridePass : password;

    if (!targetEmail) {
      setErrorMessage('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    playSyntheticChime('click');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPass })
      });

      const data = await res.json();
      if (data.success && data.user) {
        playSyntheticChime('success');
        const role = data.user.role === 'ADMIN' ? 'admin' : data.user.role.toLowerCase();
        if (data.token) setSessionToken(data.token);
        onLoginSuccess({
          ...data.user,
          role
        });
        onClose();
      } else {
        setErrorMessage(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      console.warn('Network error during login, applying local fallback', err);
      // Offline fallback for non-privileged demo accounts only. Admin is deliberately excluded
      // here: a verified admin session can only ever come from the server actually checking the
      // password against the database and issuing a signed JWT (see the try block above) - it
      // must never be grantable purely client-side, offline or not.
      const normEmail = targetEmail.toLowerCase();
      if (normEmail === 'admin@kalasetu.demo') {
        setErrorMessage('Admin sign-in needs a network connection to verify your session - please reconnect and try again.');
        setIsLoading(false);
        return;
      } else if (normEmail.includes('weaver')) {
        playSyntheticChime('success');
        onLoginSuccess({
          id: 'wev-1',
          name: 'Annaiah Devanga',
          email: targetEmail,
          role: 'weaver',
          region: 'Gudikal, Bagalkot, Karnataka'
        });
        onClose();
      } else {
        playSyntheticChime('success');
        onLoginSuccess({
          id: 'byr-1',
          name: 'Jagadish B.',
          email: targetEmail,
          role: 'buyer',
          shippingAddress: 'Indiranagar, Bengaluru, Karnataka - 560038'
        });
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoRole: 'admin' | 'weaver' | 'buyer') => {
    if (demoRole === 'admin') {
      setEmail('admin@kalasetu.demo');
      setPassword('Admin@123');
      handleLogin('admin@kalasetu.demo', 'Admin@123');
    } else if (demoRole === 'weaver') {
      setEmail('weaver@kalasetu.demo');
      setPassword('Weaver@123');
      handleLogin('weaver@kalasetu.demo', 'Weaver@123');
    } else {
      setEmail('buyer@kalasetu.demo');
      setPassword('Buyer@123');
      handleLogin('buyer@kalasetu.demo', 'Buyer@123');
    }
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 z-60 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="login-modal-content"
        className="bg-white border border-cream-border rounded-3xl max-w-md w-full shadow-2xl my-auto overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 sm:px-7 pt-7 pb-5 bg-cream/60 border-b border-cream-border">
          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white hover:bg-cream-dark border border-cream-border text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-xs mb-3">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-charcoal">
            Sign In to KalaSetu
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Access Admin Dashboard, Weaver Portal, or Buyer Mode
          </p>
        </div>

        <div className="px-6 sm:px-7 py-6 sm:py-7 space-y-6 sm:space-y-7">
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Inputs */}
          <div className="bg-white border border-cream-border rounded-2xl shadow-xs p-4 sm:p-5 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-gray-600 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kalasetu.demo"
                  className="w-full pl-9 pr-3 py-2.5 bg-cream/30 border border-cream-border rounded-xl focus:outline-none focus:border-terracotta font-medium text-charcoal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-600 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin@123"
                  className="w-full pl-9 pr-3 py-2.5 bg-cream/30 border border-cream-border rounded-xl focus:outline-none focus:border-terracotta font-medium text-charcoal"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              disabled={isLoading}
              onClick={() => handleLogin()}
              className="w-full bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>Sign In to Account</span>
            </button>
          </div>

          {/* Quick Demo Access Buttons */}
          <div className="bg-cream/40 border border-cream-border rounded-2xl p-4 sm:p-5 space-y-3.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider text-center">
              One-Click Demo Credentials
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Admin Demo Button */}
              <button
                id="quick-login-admin-btn"
                onClick={() => handleQuickLogin('admin')}
                className="p-3 bg-charcoal text-cream hover:bg-black rounded-2xl text-left border border-charcoal transition flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-mustard/20 text-mustard flex items-center justify-center font-bold text-xs shrink-0">
                    A
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Admin / Verifier (admin@kalasetu.demo)</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Password: Admin@123 • Opens Admin Dashboard</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-terracotta text-white px-2 py-0.5 rounded-lg shrink-0 ml-2">
                  Admin →
                </span>
              </button>

              {/* Weaver Demo Button */}
              <button
                id="quick-login-weaver-btn"
                onClick={() => handleQuickLogin('weaver')}
                className="p-3 bg-white hover:bg-cream/60 text-charcoal rounded-2xl text-left border border-cream-border transition flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-custom/10 text-indigo-custom flex items-center justify-center font-bold text-xs shrink-0">
                    W
                  </div>
                  <div>
                    <p className="font-bold text-xs">Weaver (Annaiah Devanga)</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Opens Existing Weaver Dashboard</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-bold group-hover:text-charcoal shrink-0 ml-2">
                  Weaver →
                </span>
              </button>

              {/* Buyer Demo Button */}
              <button
                id="quick-login-buyer-btn"
                onClick={() => handleQuickLogin('buyer')}
                className="p-3 bg-white hover:bg-cream/60 text-charcoal rounded-2xl text-left border border-cream-border transition flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs shrink-0">
                    B
                  </div>
                  <div>
                    <p className="font-bold text-xs">Buyer (Jagadish B.)</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Opens Existing Buyer Experience</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-bold group-hover:text-charcoal shrink-0 ml-2">
                  Buyer →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
