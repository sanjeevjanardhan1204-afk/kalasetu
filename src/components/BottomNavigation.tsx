/**
 * KalaSetu Mobile Bottom Navigation System
 * Provides mobile-first ergonomics with haptic audio feedback,
 * active view tracking, offline outbox badge indicators, and prominent voice triggers.
 */

import React from 'react';
import { Sparkles, ShoppingBag, Mic, Zap, User, RefreshCw, ClipboardList } from 'lucide-react';
import { Language, NetworkSimulationMode } from '../types';
import { playSyntheticChime } from '../data';

export interface BottomNavigationProps {
  activeRole?: 'weaver' | 'buyer' | 'admin' | string;
  setActiveRole?: (role: 'weaver' | 'buyer' | 'admin') => void;
  setRole?: (role: 'weaver' | 'buyer' | 'admin') => void;
  onRoleChange?: (role: 'weaver' | 'buyer' | 'admin') => void;
  onChangeRole?: (role: 'weaver' | 'buyer' | 'admin') => void;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  onTabChange?: (tab: any) => void;
  language?: Language;
  onOpenVoiceModal?: () => void;
  onOpenVoice?: () => void;
  openVoiceModal?: () => void;
  onOpenOfflineLab?: () => void;
  onOpenSyncLab?: () => void;
  openOfflineLab?: () => void;
  onOpenAccountModal?: () => void;
  onOpenAccount?: () => void;
  onAccountClick?: () => void;
  openAccountModal?: () => void;
  openAccount?: () => void;
  onOpenOrders?: () => void;
  outboxCount?: number;
  networkMode?: NetworkSimulationMode;
  isSyncing?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeRole = 'weaver',
  setActiveRole,
  setRole,
  onRoleChange,
  onChangeRole,
  activeTab,
  setActiveTab,
  onTabChange,
  language = 'en',
  onOpenVoiceModal,
  onOpenVoice,
  openVoiceModal,
  onOpenOfflineLab,
  onOpenSyncLab,
  openOfflineLab,
  onOpenAccountModal,
  onOpenAccount,
  onAccountClick,
  openAccountModal,
  openAccount,
  onOpenOrders,
  outboxCount = 0,
  networkMode = 'online',
  isSyncing = false
}) => {
  const currentTab = activeRole || activeTab || 'weaver';

  const handleRoleChange = (role: 'weaver' | 'buyer' | 'admin') => {
    try {
      if (typeof setActiveRole === 'function') setActiveRole(role);
      if (typeof setRole === 'function') setRole(role);
      if (typeof onRoleChange === 'function') onRoleChange(role);
      if (typeof onChangeRole === 'function') onChangeRole(role);
      if (typeof setActiveTab === 'function') setActiveTab(role);
      if (typeof onTabChange === 'function') onTabChange(role);
    } catch (e) {
      console.warn('[BottomNavigation] Role change handler error:', e);
    }
  };

  const handleOpenVoice = () => {
    try {
      if (typeof onOpenVoiceModal === 'function') onOpenVoiceModal();
      else if (typeof onOpenVoice === 'function') onOpenVoice();
      else if (typeof openVoiceModal === 'function') openVoiceModal();
    } catch (e) {
      console.warn('[BottomNavigation] Voice modal handler error:', e);
    }
  };

  const handleOpenOfflineLab = () => {
    try {
      if (typeof onOpenOfflineLab === 'function') onOpenOfflineLab();
      else if (typeof onOpenSyncLab === 'function') onOpenSyncLab();
      else if (typeof openOfflineLab === 'function') openOfflineLab();
    } catch (e) {
      console.warn('[BottomNavigation] Offline lab handler error:', e);
    }
  };

  const handleOpenAccount = () => {
    try {
      if (typeof onOpenAccountModal === 'function') onOpenAccountModal();
      else if (typeof onOpenAccount === 'function') onOpenAccount();
      else if (typeof onAccountClick === 'function') onAccountClick();
      else if (typeof openAccountModal === 'function') openAccountModal();
      else if (typeof openAccount === 'function') openAccount();
    } catch (e) {
      console.warn('[BottomNavigation] Account modal handler error:', e);
    }
  };

  const handleOpenOrders = () => {
    if (typeof onOpenOrders === 'function') onOpenOrders();
  };

  return (
    <nav
      id="taana-pwa-bottom-navigation"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-t border-cream-border shadow-[0_-4px_20px_rgba(45,41,38,0.08)] pb-safe md:hidden"
    >
      <div className="max-w-md mx-auto px-2 py-2 flex items-center justify-around">

        {activeRole === 'buyer' && (
          <button
            id="bottom-nav-orders-btn"
            onClick={() => {
              playSyntheticChime('click');
              handleOpenOrders();
            }}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-xl transition-all text-gray-500 hover:text-terracotta hover:bg-terracotta/5 active:scale-95 cursor-pointer"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
              {language === 'kn' ? 'ಆರ್ಡರ್‌ಗಳು' : language === 'hi' ? 'ऑर्डर' : 'Orders'}
            </span>
          </button>
        )}
        
        {/* Center Prominent Voice AI Sahayak Button */}
        <div className="flex-1 flex justify-center -mt-4">
          <button
            id="bottom-nav-voice-btn"
            onClick={() => {
              playSyntheticChime('speech');
              handleOpenVoice();
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-terracotta-dark to-terracotta text-white shadow-lg border-2 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative group cursor-pointer"
            title="Open Multilingual Voice Assistant (Works 100% Offline)"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-mustard border border-white"></span>
          </button>
        </div>

        {/* 4. Offline Lab & Outbox Tab */}
        <button
          id="bottom-nav-offline-lab-btn"
          onClick={() => {
            playSyntheticChime('click');
            handleOpenOfflineLab();
          }}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-xl transition-all relative text-gray-500 hover:text-terracotta hover:bg-terracotta/5 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            {isSyncing ? (
              <RefreshCw className="w-5 h-5 text-mustard animate-spin" />
            ) : (
              <Zap className={`w-5 h-5 ${networkMode === 'offline' ? 'text-mustard animate-pulse' : ''}`} />
            )}
            {outboxCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-mustard text-charcoal text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono shadow-xs animate-bounce">
                {outboxCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
            {networkMode === 'offline' ? 'Offline Lab' : 'Sync / Lab'}
          </span>
        </button>

        {/* 5. Account & Settings Tab */}
        <button
          id="bottom-nav-account-btn"
          onClick={() => {
            playSyntheticChime('click');
            handleOpenAccount();
          }}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-xl transition-all text-gray-500 hover:text-terracotta hover:bg-terracotta/5 active:scale-95 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
            {language === 'kn' ? 'ಖಾತೆ' : language === 'hi' ? 'खाता' : 'Account'}
          </span>
        </button>

      </div>
    </nav>
  );
};
