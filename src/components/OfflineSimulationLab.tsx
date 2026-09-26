import React, { useState } from 'react';
import { 
  Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, ShieldCheck, Database, Zap, Sparkles, X, 
  Clock, Package, ShoppingBag, ArrowUpRight, Play, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, NetworkSimulationMode, OfflineOutboxItem } from '../types';
import { playSyntheticChime } from '../data';
import { BackButton } from './BackButton';

interface OfflineSimulationLabProps {
  language: Language;
  networkMode: NetworkSimulationMode;
  setNetworkMode: (mode: NetworkSimulationMode) => void;
  outbox: OfflineOutboxItem[];
  onTriggerSync: () => void;
  isSyncing: boolean;
  lastSyncTimestamp: string;
  isOpen: boolean;
  onClose: () => void;
  onSimulateOfflineAction: (actionType: 'NEW_PRODUCT' | 'QC_SUBMIT' | 'NEW_ORDER') => void;
  onTestVoiceOffline?: () => void;
  onSimulateConflict?: () => void;
}

export const OfflineSimulationLab: React.FC<OfflineSimulationLabProps> = ({
  language,
  networkMode,
  setNetworkMode,
  outbox,
  onTriggerSync,
  isSyncing,
  lastSyncTimestamp,
  isOpen,
  onClose,
  onSimulateOfflineAction,
  onTestVoiceOffline,
  onSimulateConflict
}) => {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'outbox' | 'lww-conflicts' | 'diagnostics'>('walkthrough');
  const [demoStep, setDemoStep] = useState<number>(1);
  const [conflictLogs, setConflictLogs] = useState<any[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('taana_sync_conflicts_v3');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  if (!isOpen) return null;

  const handleModeChange = (mode: NetworkSimulationMode) => {
    playSyntheticChime('click');
    setNetworkMode(mode);
    if (mode === 'online') {
      playSyntheticChime('success');
    }
  };

  const handleStepClick = (step: number) => {
    playSyntheticChime('click');
    setDemoStep(step);
    if (step === 1) {
      setNetworkMode('offline');
    } else if (step === 4) {
      setNetworkMode('online');
      onTriggerSync();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-cream border border-cream-border rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-6">

        {/* Header */}
        <div className="bg-indigo-custom text-cream p-5 sm:p-6 flex items-start justify-between relative overflow-hidden">
          <BackButton language={language} onBack={onClose} className="text-cream hover:text-mustard relative z-10" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-charcoal text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                Rural Resilience Lab
              </span>
              <span className="text-indigo-200 text-xs font-mono">PWA • Cache-First</span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-cream flex items-center gap-2">
              <span>Offline Mode Trial & Demonstration</span>
            </h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Test how KalaSetu empowers weavers and buyers in rural handloom sheds with 0 kbps connectivity.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream transition shrink-0 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative background glow */}
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-mustard/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Network Connection Mode Selector Switch */}
        <div className="p-5 sm:p-6 bg-white border-b border-cream-border">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <span>Live Network Simulator:</span>
            </label>
            <span className="text-[11px] font-mono font-bold text-gray-500">
              {networkMode === 'online' ? '🟢 4G / High-Speed' : networkMode === 'offline' ? '🔴 0 kbps / Loom Shed Offline' : '🟡 2G / EDGE Rural Mode'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Mode 1: Online */}
            <button
              id="sim-mode-online-btn"
              onClick={() => handleModeChange('online')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                networkMode === 'online'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-cream-dark/40 border-gray-200 text-gray-600 hover:bg-cream-dark'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Wifi className={`w-4 h-4 ${networkMode === 'online' ? 'text-emerald-600' : 'text-gray-400'}`} />
                {networkMode === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </div>
              <div>
                <p className="text-xs font-bold">Online</p>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Direct 4G/WiFi sync</p>
              </div>
            </button>

            {/* Mode 2: Simulated Offline */}
            <button
              id="sim-mode-offline-btn"
              onClick={() => handleModeChange('offline')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                networkMode === 'offline'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-cream-dark/40 border-gray-200 text-gray-600 hover:bg-cream-dark'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <WifiOff className={`w-4 h-4 ${networkMode === 'offline' ? 'text-amber-600' : 'text-gray-400'}`} />
                {networkMode === 'offline' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
              </div>
              <div>
                <p className="text-xs font-bold">Loom Shed (0 kbps)</p>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">100% offline local queue</p>
              </div>
            </button>

            {/* Mode 3: 2G Data Saver */}
            <button
              id="sim-mode-datasaver-btn"
              onClick={() => handleModeChange('data-saver')}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                networkMode === 'data-saver'
                  ? 'bg-indigo-50 border-indigo-custom text-indigo-custom ring-2 ring-indigo-custom/20 shadow-xs'
                  : 'bg-cream-dark/40 border-gray-200 text-gray-600 hover:bg-cream-dark'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Zap className={`w-4 h-4 ${networkMode === 'data-saver' ? 'text-indigo-custom' : 'text-gray-400'}`} />
                {networkMode === 'data-saver' && <span className="w-2 h-2 rounded-full bg-indigo-custom"></span>}
              </div>
              <div>
                <p className="text-xs font-bold">Rural 2G EDGE</p>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Low-data 45s polling</p>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-cream/40 px-4 sm:px-5">
          <button
            onClick={() => setActiveTab('walkthrough')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'walkthrough'
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-gray-500 hover:text-charcoal'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Trial</span>
          </button>
          
          <button
            onClick={() => setActiveTab('outbox')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'outbox'
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-gray-500 hover:text-charcoal'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Offline Outbox ({outbox.length})</span>
            {outbox.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('lww-conflicts')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'lww-conflicts'
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-gray-500 hover:text-charcoal'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LWW Conflict Policy</span>
            {conflictLogs.length > 0 && (
              <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {conflictLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-gray-500 hover:text-charcoal'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Cache Diagnostics</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 max-h-[380px] overflow-y-auto space-y-4">
          
          {/* TAB 1: INTERACTIVE WALKTHROUGH */}
          {activeTab === 'walkthrough' && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>How to demonstrate KalaSetu's offline resilience:</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Follow these 4 interactive steps to show how local IndexedDB/localStorage outbox queues capture listings and QC checks without internet!
                </p>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div 
                  onClick={() => handleStepClick(1)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    demoStep === 1
                      ? 'bg-white border-terracotta shadow-md ring-2 ring-terracotta/20'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        networkMode === 'offline' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        1
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-charcoal">Step 1: Simulate Rural Signal Drop</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Cut connectivity to 0 kbps. The app activates Service Worker cache-first asset delivery.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModeChange('offline');
                        setDemoStep(2);
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg shrink-0"
                    >
                      {networkMode === 'offline' ? '✓ Offline Active' : 'Cut Signal'}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div 
                  onClick={() => handleStepClick(2)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    demoStep === 2
                      ? 'bg-white border-terracotta shadow-md ring-2 ring-terracotta/20'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        outbox.length > 0 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        2
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-charcoal">Step 2: Create Action Offline</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Simulate an artisan voice-listing a saree or submitting a pre-dispatch QC check.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSimulateOfflineAction('NEW_PRODUCT');
                          setDemoStep(3);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-custom rounded-lg border border-indigo-200"
                      >
                        + Add Saree
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSimulateOfflineAction('QC_SUBMIT');
                          setDemoStep(3);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200"
                      >
                        + QC Check
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div 
                  onClick={() => handleStepClick(3)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    demoStep === 3
                      ? 'bg-white border-terracotta shadow-md ring-2 ring-terracotta/20'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                        3
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-charcoal">Step 3: Inspect Local Outbox Queue</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {outbox.length > 0 
                            ? `${outbox.length} actions safely stored locally with cryptographic timestamps.`
                            : 'No pending items yet. Tap Step 2 to add an offline action!'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('outbox');
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-cream-dark hover:bg-cream-border text-charcoal rounded-lg border shrink-0"
                    >
                      View Outbox ({outbox.length})
                    </button>
                  </div>
                </div>

                {/* Step 4 */}
                <div 
                  onClick={() => handleStepClick(4)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    demoStep === 4
                      ? 'bg-white border-terracotta shadow-md ring-2 ring-terracotta/20'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        networkMode === 'online' && outbox.length === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        4
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-charcoal">Step 4: Reconnect & Automatic Burst Sync</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Switch to Online mode and watch the background worker flush the queue and sync payouts.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModeChange('online');
                        onTriggerSync();
                      }}
                      disabled={isSyncing}
                      className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs shrink-0 flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync & Reconnect'}</span>
                    </button>
                  </div>
                </div>

                {/* Special Step: Test Offline Voice Assistant */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                        ⚡ 100% Offline Voice Mode
                      </span>
                      <span className="text-[11px] font-bold text-amber-900">
                        {language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಧ್ವನಿ ಪ್ರಯೋಗ' : language === 'hi' ? 'ऑफ़लाइन आवाज़ ट्रायल' : language === 'ta' ? 'ஆஃப்லைன் குரல் சோதனை' : 'Offline Voice Trial'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    {language === 'kn'
                      ? 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲದಿದ್ದರೂ (0 kbps), ಕಲಾಸೇತು ಆನ್‌-ಡಿವೈಸ್ ವೆಬ್ ಸ್ಪೀಚ್ ಎಂಜಿನ್ ಮತ್ತು ಲೋಕಲ್ ಧ್ವನಿ ತರಂಗಗಳ ಮೂಲಕ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.'
                      : language === 'hi'
                      ? 'इंटरनेट कनेक्शन न होने पर भी (0 kbps), ताना ऑन-डिवाइस वेब स्पीच और लोकल ऑडियो तरंगों द्वारा तुरंत काम करता है।'
                      : language === 'ta'
                      ? 'இணைய இணைப்பு முற்றிலும் இல்லாத போதும் (0 kbps), KalaSetu சாதனத்திலேயே பேச்சு உருவாக்கம், உள்ளூர் ஒலி அலை கண்டறிதல் மற்றும் உடனடி கைத்தறி பேச்சு பதிவை செய்கிறது!'
                      : 'Even when completely offline (0 kbps), KalaSetu executes speech synthesis, local acoustic wave detection, and instant handloom speech capture directly on the device!'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {onTestVoiceOffline && (
                      <button
                        onClick={() => {
                          playSyntheticChime('speech');
                          onTestVoiceOffline();
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>
                          {language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಧ್ವನಿ ಪರೀಕ್ಷಿಸಿ' : language === 'hi' ? 'ऑफ़लाइन आवाज़ टेस्ट करें' : language === 'ta' ? 'ஆஃப்லைன் குரல் வழிகாட்டியைக் கேளுங்கள்' : 'Hear Offline Voice Guide'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OUTBOX QUEUE */}
          {activeTab === 'outbox' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Local Queue Outbox ({outbox.length} pending items)
                </span>
                {outbox.length > 0 && (
                  <button
                    onClick={() => {
                      handleModeChange('online');
                      onTriggerSync();
                    }}
                    className="text-[11px] font-bold text-terracotta hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Flush & Push to Cloud</span>
                  </button>
                )}
              </div>

              {outbox.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="text-xs font-bold text-charcoal">Outbox is Clean & Fully Synced!</h4>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                    All artisan listings, quality checks, and buyer orders are synchronized with the cloud.
                  </p>
                  <button
                    onClick={() => {
                      setNetworkMode('offline');
                      onSimulateOfflineAction('NEW_PRODUCT');
                    }}
                    className="mt-2 text-[11px] font-bold bg-mustard hover:bg-mustard-light text-charcoal px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    + Generate Mock Offline Action
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {outbox.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white border border-amber-200 rounded-2xl p-3.5 shadow-2xs space-y-2 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.type === 'NEW_PRODUCT'
                              ? 'bg-indigo-50 text-indigo-custom'
                              : item.type === 'QC_SUBMIT'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-900'
                          }`}>
                            {item.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          Pending Cloud Sync
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-charcoal">{item.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono bg-cream/60 p-2 rounded-lg border border-cream-border truncate">
                        ID: {item.id} • Payload: {JSON.stringify(item.payload)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LAST-WRITE-WINS CONFLICT RESOLUTION POLICY */}
          {activeTab === 'lww-conflicts' && (
            <div className="space-y-3.5 text-xs">
              <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-300 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-charcoal flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Conflict Resolution Policy: Last-Write-Wins (LWW)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    Deterministic OCC
                  </span>
                </div>
                <p className="text-[11px] text-gray-700 leading-relaxed">
                  When offline outbox mutations are flushed to the cloud, KalaSetu compares the client local timestamp (<code className="font-mono text-terracotta bg-white px-1 py-0.5 rounded">T_client</code>) against the existing server record timestamp (<code className="font-mono text-indigo-custom bg-white px-1 py-0.5 rounded">T_server</code>).
                </p>
                <div className="bg-white/80 p-2.5 rounded-xl border border-gray-200 font-mono text-[10px] space-y-1">
                  <div className="text-emerald-700 font-bold">✓ IF T_client ≥ T_server: Client mutation applied (Version incremented)</div>
                  <div className="text-amber-800 font-bold">⚠ IF T_client &lt; T_server: Server state preserved (Conflict logged to audit trail)</div>
                </div>
              </div>

              {/* Action trigger to test a live conflict */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-charcoal text-xs">Simulate Concurrent Conflict</h4>
                  {onSimulateConflict && (
                    <button
                      onClick={() => {
                        playSyntheticChime('click');
                        onSimulateConflict();
                        // Refresh conflict logs from storage
                        setTimeout(() => {
                          const raw = localStorage.getItem('taana_sync_conflicts_v3');
                          if (raw) setConflictLogs(JSON.parse(raw));
                        }, 200);
                      }}
                      className="bg-terracotta hover:bg-terracotta-dark text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Trigger Conflict Test</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Simulates a concurrent edge case where an artisan in a 0 kbps loom shed modifies an order while an urban buyer concurrently tracks it online.
                </p>
              </div>

              {/* Conflict Log History */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal flex items-center justify-between">
                  <span>Conflict Audit Logs ({conflictLogs.length})</span>
                  {conflictLogs.length > 0 && (
                    <button
                      onClick={() => {
                        localStorage.removeItem('taana_sync_conflicts_v3');
                        setConflictLogs([]);
                      }}
                      className="text-[10px] text-gray-400 hover:text-rose-600"
                    >
                      Clear Logs
                    </button>
                  )}
                </h4>

                {conflictLogs.length === 0 ? (
                  <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-4 text-center text-gray-400 text-[11px]">
                    No sync conflicts recorded yet. Tap "Trigger Conflict Test" to see LWW arbitration in action!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conflictLogs.map((log: any) => (
                      <div key={log.id} className="bg-white border border-gray-200 rounded-xl p-3 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-charcoal">{log.itemTitle}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            log.resolution === 'client-wins' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.resolution}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between">
                          <span>Δt: {log.timestampDiffMs}ms</span>
                          <span>Resolved at: {log.resolvedAt}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 bg-cream/70 p-1.5 rounded border border-cream-border">
                          {log.appliedPayloadSummary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DIAGNOSTICS & CACHE HEALTH */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-3 text-xs">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
                  Storage & PWA Engine Status:
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Service Worker Strategy:</span>
                    <span className="font-mono font-bold text-emerald-600">Cache-First + Network Fallback</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Cache Version:</span>
                    <span className="font-mono font-bold text-indigo-custom">taana-cache-v2</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Speech Synthesis:</span>
                    <span className="font-mono font-bold text-emerald-600">Local Web Speech API (Offline)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Synthetic Chime Engine:</span>
                    <span className="font-mono font-bold text-emerald-600">Web Audio Oscillators (Offline)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">IndexedDB Persistence:</span>
                    <span className="font-mono font-bold text-emerald-600">Active (Zero Data Loss)</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 space-y-1 text-indigo-950">
                <p className="font-bold">Why Offline Resilience Matters in Handloom Hubs:</p>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Weavers in remote Karnataka & UP villages operate looms inside stone or tin sheds where cellular signals drop. KalaSetu's local outbox guarantees that listings and QC checklists never fail due to dropped connections.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="bg-cream-dark/60 border-t border-cream-border p-4 sm:p-5 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 font-mono">
            Status: <strong className={networkMode === 'offline' ? 'text-amber-700' : 'text-emerald-700'}>{networkMode.toUpperCase()}</strong> • Outbox: {outbox.length} items
          </div>
          <button
            onClick={onClose}
            className="bg-indigo-custom hover:bg-indigo-custom/90 text-cream font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
          >
            Close Lab
          </button>
        </div>

      </div>
    </div>
  );
};
