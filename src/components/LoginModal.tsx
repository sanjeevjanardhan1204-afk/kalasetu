import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, ArrowRight, X, Check, Landmark, AlertCircle, RefreshCw } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { playSyntheticChime } from '../data';

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
  const [email, setEmail] = useState<string>('admin@tantulink.demo');
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
      // Offline fallback for demo accounts
      const normEmail = targetEmail.toLowerCase();
      if (normEmail === 'admin@tantulink.demo') {
        if (targetPass && targetPass !== 'Admin@123') {
          setErrorMessage('Invalid password. Password for admin@tantulink.demo is Admin@123');
          setIsLoading(false);
          return;
        }
        playSyntheticChime('success');
        onLoginSuccess({
          id: 'admin-1',
          name: 'TantuLink Administrator',
          email: 'admin@tantulink.demo',
          role: 'admin',
          region: 'National Handloom Registry Center, New Delhi'
        });
        onClose();
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
      setEmail('admin@tantulink.demo');
      setPassword('Admin@123');
      handleLogin('admin@tantulink.demo', 'Admin@123');
    } else if (demoRole === 'weaver') {
      setEmail('weaver@tantulink.demo');
      setPassword('Weaver@123');
      handleLogin('weaver@tantulink.demo', 'Weaver@123');
    } else {
      setEmail('buyer@tantulink.demo');
      setPassword('Buyer@123');
      handleLogin('buyer@tantulink.demo', 'Buyer@123');
    }
  };

  return (
    <div 
      id="login-modal-backdrop"
      className="fixed inset-0 z-60 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div 
        id="login-modal-content"
        className="bg-white border-2 border-charcoal rounded-3xl p-6 text-left max-w-md w-full shadow-2xl space-y-5 my-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-cream-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Sign In to TantuLink
              </h3>
              <p className="text-xs text-gray-500">
                Access Admin Dashboard, Weaver Portal, or Buyer Mode
              </p>
            </div>
          </div>

          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-cream hover:bg-cream-dark text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-600 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tantulink.demo"
                className="w-full pl-9 pr-3 py-2.5 bg-cream/30 border border-cream-border rounded-xl focus:outline-none focus:border-terracotta font-medium text-charcoal"
              />
            </div>
          </div>

          <div className="space-y-1">
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
        <div className="border-t border-cream-border pt-4 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider text-center">
            One-Click Demo Credentials
          </span>

          <div className="grid grid-cols-1 gap-2">
            {/* Admin Demo Button */}
            <button
              id="quick-login-admin-btn"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 bg-charcoal text-cream hover:bg-black rounded-xl text-left border border-charcoal transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Admin / Verifier (admin@tantulink.demo)</p>
                  <p className="text-[10px] text-gray-300">Password: Admin@123 • Opens Admin Dashboard</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-terracotta text-white px-2 py-0.5 rounded-md">
                Admin Role →
              </span>
            </button>

            {/* Weaver Demo Button */}
            <button
              id="quick-login-weaver-btn"
              onClick={() => handleQuickLogin('weaver')}
              className="p-2 bg-cream/60 hover:bg-cream-dark text-charcoal rounded-xl text-left border border-cream-border transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-custom/20 text-indigo-custom flex items-center justify-center font-bold text-xs">
                  W
                </div>
                <div>
                  <p className="font-bold text-xs">Weaver (Annaiah Devanga)</p>
                  <p className="text-[10px] text-gray-500">Opens Existing Weaver Dashboard</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold group-hover:text-charcoal">
                Weaver →
              </span>
            </button>

            {/* Buyer Demo Button */}
            <button
              id="quick-login-buyer-btn"
              onClick={() => handleQuickLogin('buyer')}
              className="p-2 bg-cream/60 hover:bg-cream-dark text-charcoal rounded-xl text-left border border-cream-border transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-terracotta/20 text-terracotta flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <p className="font-bold text-xs">Buyer (Jagadish B.)</p>
                  <p className="text-[10px] text-gray-500">Opens Existing Buyer Experience</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold group-hover:text-charcoal">
                Buyer →
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
