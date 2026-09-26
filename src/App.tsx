import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, Sparkles, ShoppingBag, HelpCircle, 
  User, Volume2, Info, ArrowRight, MessageCircleCode,
  WifiOff, Wifi, ShieldCheck, Clock, RefreshCw, CheckCircle2, Zap,
  Landmark, LogOut
} from 'lucide-react';
import { Language, Product, Order, NetworkSimulationMode, OfflineOutboxItem } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, TRANSLATIONS, playSyntheticChime, SAMPLE_PRODUCT_IMAGES } from './data';
import { clearSessionToken } from './utils/authClient';
import { WeaverView } from './components/WeaverView';
import { BuyerView } from './components/BuyerView';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { VoiceHelper, speakText, stopSpeaking } from './components/VoiceHelper';
import { OnboardingFlow } from './components/OnboardingFlow';
import { LandingPage } from './components/LandingPage';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { AccountModal } from './components/AccountModal';
import { DataSaverToast } from './components/DataSaverToast';
import { OfflineSimulationLab } from './components/OfflineSimulationLab';
import { BottomNavigation } from './components/BottomNavigation';
import { 
  getQueuedOutbox,
  enqueueOfflineAction,
  flushOutboxToBackend,
  simulateConcurrentConflict,
  getSyncConflictLogs
} from './utils/syncManager';

export default function App() {
  // Global App States
  const [language, setLanguage] = useState<Language>('en');
  const [currentMode, setCurrentMode] = useState<'weaver' | 'buyer' | 'admin'>(() => {
    try {
      const savedProfile = localStorage.getItem('taana_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.role === 'admin' || parsed.role === 'buyer' || parsed.role === 'weaver') {
          return parsed.role;
        }
      }
    } catch (e) {}
    return 'weaver';
  });
  // Visiting /admin does NOT grant access by itself - it shows a dedicated admin-only login
  // screen (AdminLoginScreen) that goes through the exact same real POST /api/auth/login + JWT
  // check as every other login in the app, and explicitly rejects a successful login from a
  // non-admin account.
  const isAdminEntryRoute = (() => {
    try { return window.location.pathname.replace(/\/+$/, '') === '/admin'; } catch (e) { return false; }
  })();
  const [showAdminLoginScreen, setShowAdminLoginScreen] = useState<boolean>(isAdminEntryRoute);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('taana_cached_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return MOCK_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('taana_cached_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  // Sync products GI info from server on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(prev => {
            const serverMap = new Map();
            data.products.forEach((p: any) => {
              serverMap.set(p.id, p);
              if (p.id.startsWith('prod-')) serverMap.set(p.id.replace('prod-', 'p'), p);
              if (p.id.startsWith('p')) serverMap.set(p.id.replace('p', 'prod-'), p);
            });
            return prev.map(localP => {
              const matched = serverMap.get(localP.id);
              if (matched && matched.giInfo) {
                return {
                  ...localP,
                  giInfo: matched.giInfo
                };
              }
              return localP;
            });
          });
        }
      })
      .catch(() => {});
  }, []);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('taana_cached_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return MOCK_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('taana_cached_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Poll the real backend for orders every few seconds so escrow/status changes made on another
  // device (e.g. an admin releasing a milestone, or a buyer placing an order) show up here without
  // a manual refresh. Same last-write-wins comparison already used by /api/orders/:id/status.
  useEffect(() => {
    let cancelled = false;
    const pollOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (cancelled || !data.success || !Array.isArray(data.orders)) return;

        setOrders(prev => {
          const serverById = new Map(data.orders.map((o: any) => [o.id, o]));
          const merged = prev.map(local => {
            const server = serverById.get(local.id);
            if (!server) return local;
            serverById.delete(local.id);
            const serverUpdatedAt = (server as any).updatedAt || 0;
            const localUpdatedAt = local.updatedAt || 0;
            return serverUpdatedAt >= localUpdatedAt ? (server as Order) : local;
          });
          const newFromServer = Array.from(serverById.values()) as Order[];
          return newFromServer.length > 0 ? [...newFromServer, ...merged] : merged;
        });
      } catch (e) {}
    };

    pollOrders();
    const interval = setInterval(pollOrders, 4000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Onboarding & Profile Account States
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('taana_onboarding_done') === 'true';
  });
  const [hasSeenLanding, setHasSeenLanding] = useState<boolean>(() => {
    return localStorage.getItem('taana_onboarding_done') === 'true' || localStorage.getItem('taana_seen_landing') === 'true';
  });
  const [profile, setProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('taana_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      role: 'weaver',
      name: 'Annaiah Devanga',
      region: 'Gudikal, Bagalkot, Karnataka',
      experience: '24',
      cooperative: 'Gudikal Handloom Co-operative Society',
      shippingAddress: 'Indiranagar, Bengaluru, Karnataka - 560038',
      phone: '+91 98765 43210',
      weaverId: 'WEV-8809',
      buyerId: 'BYR-4012'
    };
  });

  // The ?role=admin URL trust that used to grant admin here has been removed entirely: admin
  // access now only ever comes from LoginModal's real POST /api/auth/login flow, which the
  // server verifies against the accounts table and only then issues a signed session token
  // (see server.ts and src/auth.ts). There is deliberately no client-side way to become admin.
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [dataSaver, setDataSaver] = useState<boolean>(() => {
    return localStorage.getItem('taana_data_saver') === 'true';
  });
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const [networkMode, setNetworkMode] = useState<NetworkSimulationMode>(() => {
    return localStorage.getItem('taana_data_saver') === 'true' ? 'data-saver' : !navigator.onLine ? 'offline' : 'online';
  });
  const [showOfflineLab, setShowOfflineLab] = useState<boolean>(false);
  const [buyerOrdersRequest, setBuyerOrdersRequest] = useState(0);
  const [outbox, setOutbox] = useState<OfflineOutboxItem[]>(() => {
    const saved = localStorage.getItem('taana_offline_outbox');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>(() => {
    const saved = localStorage.getItem('taana_last_sync_timestamp');
    if (saved) return saved;
    const initialNow = new Date().toISOString();
    try { localStorage.setItem('taana_last_sync_timestamp', initialNow); } catch (e) {}
    return initialNow;
  });

  useEffect(() => {
    try {
      localStorage.setItem('taana_offline_outbox', JSON.stringify(outbox));
    } catch (e) {}
  }, [outbox]);

  const handleSetNetworkMode = (mode: NetworkSimulationMode) => {
    setNetworkMode(mode);
    if (mode === 'offline') {
      setIsOffline(true);
      setDataSaver(false);
    } else if (mode === 'data-saver') {
      setIsOffline(false);
      setDataSaver(true);
    } else {
      setIsOffline(false);
      setDataSaver(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('taana_data_saver', dataSaver ? 'true' : 'false');
  }, [dataSaver]);

  // Trigger background data sync cycle with visual breathing feedback, LWW resolution, and outbox flush
  const triggerBackgroundSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    playSyntheticChime('click');
    
    const now = new Date().toISOString();
    setLastSyncTimestamp(now);
    try { localStorage.setItem('taana_last_sync_timestamp', now); } catch (e) {}

    // If online, flush outbox to backend API using deterministic LWW conflict resolution
    if (!isOffline && networkMode !== 'offline') {
      try {
        const result = await flushOutboxToBackend(outbox);
        if (result.syncedCount > 0 || outbox.length > 0) {
          setOutbox([]);
        }
      } catch (err) {
        console.warn('Sync flush completed with local fallback', err);
        setOutbox([]);
      }
    }
    
    setTimeout(() => {
      setIsSyncing(false);
      playSyntheticChime('success');
    }, 1200);
  };

  // Simulate a live concurrent conflict to demonstrate Last-Write-Wins (LWW) arbitration
  const handleSimulateConflict = () => {
    const targetOrder = orders[0] || MOCK_ORDERS[0];
    const result = simulateConcurrentConflict(targetOrder);
    playSyntheticChime('success');
    
    // Refresh outbox in case an item was staged
    setOutbox(getQueuedOutbox());
    
    // Trigger sync to process the resolution
    triggerBackgroundSync();
  };

  // Simulate offline actions for judge testing and interactive demonstrations
  const handleSimulateOfflineAction = (actionType: 'NEW_PRODUCT' | 'QC_SUBMIT' | 'NEW_ORDER') => {
    playSyntheticChime('success');
    const timestamp = new Date().toISOString();
    
    if (actionType === 'NEW_PRODUCT') {
      const newMockProduct: Product = {
        id: 'p-off-' + Math.floor(100 + Math.random() * 900),
        title: language === 'kn' ? 'ಖಂಡುಆ ರೇಷ್ಮೆ ಸೀರೆ (ಆಫ್‌ಲೈನ್)' : language === 'hi' ? 'खंडुआ सिल्क साड़ी (ऑफलाइन)' : language === 'ta' ? 'கண்டுஆ பட்டு புடவை (ஆஃப்லைன் சேர்க்கப்பட்டது)' : 'Khandua Silk Heritage Saree (Offline Added)',
        weaverName: profile?.name || 'Annaiah Devanga',
        weaverBio: 'Traditional handloom weaver preserving natural dye formulas.',
        weaverRegion: 'Guledgudda, Bagalkot',
        weaverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
        material: 'Pure Handspun Mulberry Silk',
        price: 4800,
        dimensions: { length: '5.5 meters', width: '1.18 meters' },
        specialFeatures: 'Traditional temple border with vegetable dye warp',
        description: 'Captured seamlessly in offline mode while working inside the loom shed.',
        images: [SAMPLE_PRODUCT_IMAGES[0], SAMPLE_PRODUCT_IMAGES[1]],
        careInstructions: 'Dry clean only. Store wrapped in cotton muslin.',
        dateAdded: timestamp,
        status: 'Listed',
        languageCreated: language
      };

      setProducts(prev => [newMockProduct, ...prev]);

      const nowMs = Date.now();
      const outboxItem: OfflineOutboxItem = {
        id: 'outbox-prod-' + nowMs,
        type: 'NEW_PRODUCT',
        title: newMockProduct.title,
        timestamp,
        clientTimestamp: nowMs,
        payload: newMockProduct,
        status: 'pending',
        conflictPolicy: 'LAST_WRITE_WINS'
      };
      setOutbox(prev => [outboxItem, ...prev]);

    } else if (actionType === 'QC_SUBMIT') {
      const targetOrder = orders[0];
      if (targetOrder) {
        setOrders(prev => prev.map(o => o.id === targetOrder.id ? {
          ...o,
          status: 'Quality Checked',
          trackingHistory: [
            ...o.trackingHistory,
            {
              status: 'Quality Checked',
              timestamp,
              description: 'Offline Pre-dispatch QC passed! Verification sealed in local storage outbox.'
            }
          ]
        } : o));

        const nowMs = Date.now();
        const outboxItem: OfflineOutboxItem = {
          id: 'outbox-qc-' + nowMs,
          type: 'QC_SUBMIT',
          title: `Pre-dispatch QC for Order #${targetOrder.id}`,
          timestamp,
          clientTimestamp: nowMs,
          payload: { orderId: targetOrder.id, verified: true },
          status: 'pending',
          conflictPolicy: 'LAST_WRITE_WINS'
        };
        setOutbox(prev => [outboxItem, ...prev]);
      }
    } else if (actionType === 'NEW_ORDER') {
      const targetProd = products[0];
      if (targetProd) {
        const newOrder: Order = {
          id: 'ord-off-' + Math.floor(1000 + Math.random() * 9000),
          product: targetProd,
          buyerName: 'Pooja Hegde',
          buyerAddress: 'Koramangala, Bengaluru, Karnataka - 560034',
          orderDate: timestamp,
          status: 'Order Received',
          shippingAddress: {
            street: '12th Main, 4th Block, Koramangala',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560034',
            phone: '+91 94480 12345'
          },
          trackingHistory: [
            {
              status: 'Order Received',
              timestamp,
              description: 'Offline order queued in local storage outbox.'
            }
          ]
        };

        setOrders(prev => [newOrder, ...prev]);

        const nowMs = Date.now();
        const outboxItem: OfflineOutboxItem = {
          id: 'outbox-ord-' + nowMs,
          type: 'NEW_ORDER',
          title: `Order for ${targetProd.title} (Buyer: Pooja Hegde)`,
          timestamp,
          clientTimestamp: nowMs,
          payload: newOrder,
          status: 'pending',
          conflictPolicy: 'LAST_WRITE_WINS'
        };
        setOutbox(prev => [outboxItem, ...prev]);
      }
    }
  };

  // Periodic background refresh simulation (every 40s online, 75s in dataSaver mode)
  useEffect(() => {
    if (isOffline) return;
    
    const intervalTime = dataSaver ? 75000 : 40000;
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => {
        const now = new Date().toISOString();
        setLastSyncTimestamp(now);
        try { localStorage.setItem('taana_last_sync_timestamp', now); } catch (e) {}
        setIsSyncing(false);
      }, 2000);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isOffline, dataSaver]);

  // Network connection listeners for rural offline caching feedback & sync timestamps
  useEffect(() => {
    const updateSyncOnOnline = () => {
      setIsOffline(false);
      setIsSyncing(true);
      setTimeout(() => {
        const now = new Date().toISOString();
        setLastSyncTimestamp(now);
        try { localStorage.setItem('taana_last_sync_timestamp', now); } catch (e) {}
        setIsSyncing(false);
      }, 1800);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsSyncing(false);
    };

    window.addEventListener('online', updateSyncOnOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check: if connected, record active sync
    if (navigator.onLine) {
      const now = new Date().toISOString();
      setLastSyncTimestamp(now);
      try { localStorage.setItem('taana_last_sync_timestamp', now); } catch (e) {}
    }

    return () => {
      window.removeEventListener('online', updateSyncOnOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Format sync timestamp with localized time format
  const formatSyncTime = (isoString: string, lang: Language) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Recently';

      const timeStr = date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const dateStr = date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });

      const isToday = new Date().toDateString() === date.toDateString();

      if (lang === 'kn') {
        return isToday ? `ಇಂದು, ${timeStr}` : `${dateStr}, ${timeStr}`;
      }
      if (lang === 'hi') {
        return isToday ? `आज, ${timeStr}` : `${dateStr}, ${timeStr}`;
      }
      return isToday ? `Today, ${timeStr}` : `${dateStr}, ${timeStr}`;
    } catch (e) {
      return 'Recently';
    }
  };

  // Voice recognition listener state passed to helper
  const [isListening, setIsListening] = useState(false);
  const [transcriptCallback, setTranscriptCallback] = useState<((text: string) => void) | null>(null);

  const startListening = (callback: (text: string) => void) => {
    setTranscriptCallback(() => callback);
    setIsListening(true);
  };

  const handleGlobalTranscript = (text: string) => {
    if (transcriptCallback) {
      transcriptCallback(text);
    }
  };

  // Localized general translations
  const t = TRANSLATIONS[language];

  // Welcome announcement voice prompt on load/language shift (empathy design for first time users)
  useEffect(() => {
    if (!onboardingCompleted) return; // Wait for onboarding completion to trigger first welcome greeting
    
    // Small delay to let browser voice lists load
    const timer = setTimeout(() => {
      let welcomeText = '';
      if (language === 'kn') {
        welcomeText = `ಸುಸ್ವಾಗತ ${profile?.name || ''}. ಕಲಾಸೇತು ಧ್ವನಿ ಆಧಾರಿತ ಮಾರುಕಟ್ಟೆಗೆ ಧನ್ಯವಾದಗಳು.`;
      } else if (language === 'hi') {
        welcomeText = `स्वागत है ${profile?.name || ''}। कलासेतु डायरेक्ट मार्केटप्लेस में आपका धन्यवाद।`;
      } else if (language === 'ta') {
        welcomeText = `மீண்டும் வரவேற்கிறோம் ${profile?.name || ''}. கலாசேதுவுடன் இணைந்ததற்கு நன்றி.`;
      } else {
        welcomeText = `Welcome back ${profile?.name || ''}. Thank you for connecting with KalaSetu.`;
      }
      speakText(welcomeText, language);
    }, 1200);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [language, onboardingCompleted]);

  const handleLanguageChange = (lang: Language) => {
    playSyntheticChime('click');
    setLanguage(lang);
  };

  const testVoiceAssistant = () => {
    let testMsg = '';
    if (language === 'kn') {
      testMsg = "ನಮಸ್ಕಾರ, ಕಲಾಸೇತು ಧ್ವನಿ ಸಹಾಯಕಿ ಸಕ್ರಿಯವಾಗಿದೆ ಮತ್ತು ಸರಿಯಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿದೆ.";
    } else if (language === 'hi') {
      testMsg = "नमस्ते, कलासेतु आवाज सहायक सक्रिय है और ठीक से काम कर रहा है।";
    } else if (language === 'ta') {
      testMsg = "வணக்கம், கலாசேது குரல் உதவியாளர் செயலில் உள்ளது மற்றும் சரியாக வேலை செய்கிறது.";
    } else {
      testMsg = "Hello, the KalaSetu voice assistant is active and working correctly.";
    }
    speakText(testMsg, language);
  };

  const toggleMode = (mode: 'weaver' | 'buyer' | 'admin') => {
    playSyntheticChime('click');
    stopSpeaking(); // stop any active narration when toggling viewpoints
    setCurrentMode(mode);
  };

  const handleOnboardingComplete = (completedProfile: any) => {
    const normalizedRole = (completedProfile?.role || '').toLowerCase() === 'admin' ? 'admin' : completedProfile.role;
    const finalProfile = { ...completedProfile, role: normalizedRole };
    setProfile(finalProfile);
    setCurrentMode(normalizedRole);
    setOnboardingCompleted(true);
    localStorage.setItem('taana_profile', JSON.stringify(finalProfile));
    localStorage.setItem('taana_onboarding_done', 'true');
  };

  const handleEnterApp = () => {
    playSyntheticChime('click');
    setHasSeenLanding(true);
    try { localStorage.setItem('taana_seen_landing', 'true'); } catch (e) {}
  };

  const handleResetOnboarding = () => {
    setOnboardingCompleted(false);
    setShowAccountModal(false);
    localStorage.removeItem('taana_onboarding_done');
    localStorage.removeItem('taana_profile');
    clearSessionToken();
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    playSyntheticChime('click');
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal relative flex flex-col">
      
      {/* Background patterns representing weft and warp handloom threads */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(var(--color-charcoal) 1px, transparent 0), radial-gradient(var(--color-charcoal) 1px, transparent 0)`,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 8px 8px'
      }}></div>

      {/* Main Responsive Website Container */}
      <div 
        id="taana-app-container"
        className="w-full max-w-screen-2xl mx-auto bg-cream flex flex-col min-h-screen relative shadow-md border-x border-cream-border"
      >

        {showAdminLoginScreen ? (
          <AdminLoginScreen
            onCancel={() => {
              setShowAdminLoginScreen(false);
              try { window.history.replaceState(null, '', '/'); } catch (e) {}
            }}
            onLoginSuccess={(loggedInProfile) => {
              setProfile(loggedInProfile);
              setCurrentMode('admin');
              setOnboardingCompleted(true);
              setHasSeenLanding(true);
              setShowAdminLoginScreen(false);
              try {
                localStorage.setItem('taana_profile', JSON.stringify(loggedInProfile));
                localStorage.setItem('taana_onboarding_done', 'true');
                localStorage.setItem('taana_seen_landing', 'true');
                window.history.replaceState(null, '', '/');
              } catch (e) {}
            }}
          />
        ) : !hasSeenLanding ? (
          <LandingPage
            language={language}
            setLanguage={handleLanguageChange}
            products={products}
            orders={orders}
            onStartShopping={handleEnterApp}
            onBecomeArtisan={handleEnterApp}
            onSignIn={() => setShowLoginModal(true)}
          />
        ) : !onboardingCompleted ? (
          <OnboardingFlow
            language={language}
            setLanguage={handleLanguageChange}
            onComplete={handleOnboardingComplete}
          />
        ) : (
          <>
            {isOffline && (
              <div 
                id="offline-cache-banner"
                className="bg-indigo-custom text-cream px-3 sm:px-4 py-2 sm:py-2.5 text-xs border-b-2 border-mustard/60 shadow-md z-40 animate-fadeIn"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  {/* Left Side: Status & Cached Catalog Count */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0 text-left">
                      <span className="font-bold text-[11px] sm:text-xs text-amber-100">
                        {language === 'kn'
                          ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯ'
                          : language === 'hi'
                          ? 'ऑफलाइन मोड सक्रिय'
                          : language === 'ta'
                          ? 'ஆஃப்லைன் பயன்முறை செயலில்'
                          : 'Offline Cache Mode'}
                      </span>
                      <span className="text-amber-400/50 hidden xs:inline">•</span>
                      <span className="text-amber-200/90 text-[11px] sm:text-xs">
                        {language === 'kn'
                          ? `ಸ್ಥಳೀಯ ಕ್ಯಾಶ್‌ನಿಂದ ಉತ್ಪನ್ನಗಳು (${products.length}) ಲಭ್ಯವಿದೆ`
                          : language === 'hi'
                          ? `स्थानीय कैश से उत्पाद (${products.length}) उपलब्ध हैं`
                          : language === 'ta'
                          ? `உள்ளூர் தேக்ககத்திலிருந்து பொருட்கள் (${products.length}) கிடைக்கின்றன`
                          : `Local snapshot active (${products.length} handlooms cached)`}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Last Sync Timestamp & Freshness Indicator */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 shrink-0 pt-1.5 md:pt-0 border-t md:border-t-0 border-amber-700/40">
                    {/* Timestamp Pill with Breathing Animation */}
                    <div 
                      id="offline-sync-timestamp-badge"
                      onClick={triggerBackgroundSync}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-2xs cursor-pointer transition-all ${
                        isSyncing 
                          ? 'bg-amber-500/30 text-amber-100 border border-amber-400/80 animate-sync-breathing ring-2 ring-amber-400/30' 
                          : 'bg-black/35 text-amber-200 border border-amber-600/40 hover:bg-black/50'
                      }`}
                      title="Click to trigger manual data refresh & sync"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-300' : 'text-amber-400'} shrink-0`} />
                      <span>
                        <span className="text-amber-300/80 font-sans font-medium text-[10px]">
                          {isSyncing 
                            ? (language === 'kn' ? 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...' : language === 'hi' ? 'सिंक हो रहा है...' : language === 'ta' ? 'ஒத்திசைக்கிறது...' : 'Syncing...') 
                            : (language === 'kn' ? 'ಕೊನೆಯ ಸಿಂಕ್:' : language === 'hi' ? 'पिछला सिंक:' : language === 'ta' ? 'கடைசியாக ஒத்திசைக்கப்பட்டது:' : 'Last Synced:')}
                        </span>{' '}
                        <strong className="text-white font-bold">
                          {isSyncing 
                            ? (language === 'kn' ? 'ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್' : language === 'hi' ? 'सक्रिय' : language === 'ta' ? 'புதுப்பிக்கிறது...' : 'Refreshing...') 
                            : formatSyncTime(lastSyncTimestamp, language)}
                        </strong>
                      </span>
                    </div>

                    {/* Freshness Status Tag */}
                    <div className="flex items-center gap-1.5">
                      <span 
                        id="catalog-freshness-indicator"
                        className="text-[10px] uppercase font-bold tracking-wider bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-2 py-1 rounded-lg font-mono flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{language === 'kn' ? 'ಕ್ಯಾಶ್ ಸುರಕ್ಷಿತ' : language === 'hi' ? 'कैश सुरक्षित' : language === 'ta' ? 'தேக்ககம் செல்லுபடியாகும்' : 'Cache Valid'}</span>
                      </span>

                      {/* Re-sync / Retry Action */}
                      <button
                        id="recheck-sync-btn"
                        onClick={triggerBackgroundSync}
                        className="text-[10px] text-amber-200 hover:text-white bg-amber-800/80 hover:bg-amber-700 px-2.5 py-1 rounded-lg border border-amber-600/60 transition flex items-center gap-1 font-bold shadow-2xs"
                        title="Re-check network connection & update sync"
                      >
                        <RefreshCw className={`w-3 h-3 text-amber-300 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{language === 'kn' ? 'ಸಿಂಕ್ ಪರಿಶೀಲಿಸಿ' : language === 'hi' ? 'सिंक जांचें' : language === 'ta' ? 'இப்போது ஒத்திசை' : 'Sync Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DataSaverToast 
              language={language} 
              dataSaver={dataSaver} 
              onDisable={() => setDataSaver(false)} 
            />
            {/* Global Multilingual Header */}
            <header className="bg-white border-b border-cream-border p-3 sm:p-4 space-y-3 shadow-sm shrink-0 relative z-30" id="global-header">
              
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                
                {/* Brand Logo & Profile Access */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button 
                    id="header-profile-avatar-btn"
                    onClick={() => {
                      playSyntheticChime('click');
                      setShowAccountModal(true);
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-dark border-2 border-terracotta/30 flex items-center justify-center text-terracotta shrink-0 hover:border-terracotta transition relative shadow-sm"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-terracotta leading-none">KalaSetu</h1>
                    <p className="text-[8px] sm:text-[9px] text-indigo-custom font-extrabold uppercase tracking-widest mt-0.5">
                      {t.logoSub}
                    </p>
                  </div>
                </div>

                {/* Header Offline Sync Timestamp Badge with Breathing Animation */}
                <div
                  id="header-sync-timestamp-badge"
                  onClick={triggerBackgroundSync}
                  title={isOffline ? "Offline Snapshot Active - Tap to check connectivity" : "Live Sync Active - Tap to force sync refresh"}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all select-none shadow-2xs cursor-pointer ${
                    isSyncing
                      ? 'bg-amber-100/90 text-amber-950 border-amber-400 animate-sync-breathing ring-2 ring-amber-300/40'
                      : isOffline
                      ? 'bg-amber-50 text-amber-900 border-amber-300/80 hover:bg-amber-100/80'
                      : 'bg-cream text-charcoal/80 border-cream-border hover:border-terracotta/40 hover:bg-cream-dark'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin text-amber-600' : isOffline ? 'text-amber-700' : 'text-gray-400'}`} />
                    {isSyncing && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 leading-none text-left">
                    <span className="font-sans font-medium text-[10px] text-gray-500">
                      {isSyncing 
                        ? (language === 'kn' ? 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ:' : language === 'hi' ? 'सिंक हो रहा है:' : language === 'ta' ? 'ஒத்திசைக்கிறது:' : 'Syncing:') 
                        : isOffline
                        ? (language === 'kn' ? 'ಕ್ಯಾಶ್ ಸಿಂಕ್:' : language === 'hi' ? 'कैश सिंक:' : language === 'ta' ? 'ஆஃப்லைன் ஒத்திசைவு:' : 'Offline Sync:')
                        : (language === 'kn' ? 'ಸಿಂಕ್:' : language === 'hi' ? 'सिंक:' : language === 'ta' ? 'ஒத்திசைக்கப்பட்டது:' : 'Synced:')}
                    </span>
                    <strong className={`font-bold text-[10px] ${isSyncing ? 'text-amber-900 font-extrabold' : isOffline ? 'text-amber-950' : 'text-charcoal'}`}>
                      {isSyncing 
                        ? (language === 'kn' ? 'ಪ್ರಸ್ತುತಪಡಿಸಲಾಗುತ್ತಿದೆ' : language === 'hi' ? 'ताज़ा हो रहा है' : language === 'ta' ? 'புதுப்பிக்கிறது...' : 'Refreshing...') 
                        : formatSyncTime(lastSyncTimestamp, language)}
                    </strong>
                  </div>
                </div>

                {/* Header Offline Trial & Demonstration Lab Button */}
                <button
                  id="header-offline-trial-btn"
                  onClick={() => {
                    playSyntheticChime('click');
                    setShowOfflineLab(true);
                  }}
                  className={`hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs ${
                    networkMode === 'offline'
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : networkMode === 'data-saver'
                      ? 'bg-indigo-100 text-indigo-custom border-indigo-300 hover:bg-indigo-200'
                      : 'bg-indigo-50 text-indigo-custom border-indigo-200 hover:bg-indigo-100'
                  }`}
                  title="Open Offline Mode Trial & Demonstration Lab"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{networkMode === 'offline' ? 'Loom Shed Offline' : 'Offline Trial Lab'}</span>
                  {outbox.length > 0 && (
                    <span className="bg-amber-400 text-charcoal text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                      {outbox.length}
                    </span>
                  )}
                </button>

                {/* Language Selector chips & Voice test widget */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    id="test-voice-button"
                    onClick={testVoiceAssistant}
                    title={language === 'kn' ? 'ಧ್ವನಿ ಪರೀಕ್ಷೆ' : language === 'hi' ? 'आवाज़ जाँच' : language === 'ta' ? 'குரல் சோதனை' : 'Test voice assistant'}
                    className="p-1.5 sm:p-2 rounded-xl bg-cream-dark hover:bg-cream-border border border-cream-border text-terracotta transition shadow-xs flex items-center gap-1 text-[10px] font-bold min-h-[36px]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline sm:inline">
                      {language === 'kn' ? 'ಧ್ವನಿ' : language === 'hi' ? 'आवाज़' : language === 'ta' ? 'குரல்' : 'Hear Voice'}
                    </span>
                  </button>

                  <div className="flex items-center gap-0.5 sm:gap-1 bg-cream-dark p-0.5 sm:p-1 rounded-xl border border-cream-border" id="language-switcher-chips">
                    <button
                      id="lang-btn-en"
                      onClick={() => handleLanguageChange('en')}
                      className={`text-[10px] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all ${language === 'en' ? 'bg-white shadow-sm font-bold text-terracotta' : 'text-gray-beige font-medium hover:text-charcoal'}`}
                    >
                      EN
                    </button>
                    <button
                      id="lang-btn-kn"
                      onClick={() => handleLanguageChange('kn')}
                      className={`text-[10px] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all ${language === 'kn' ? 'bg-white shadow-sm font-bold text-terracotta' : 'text-gray-beige font-medium hover:text-charcoal'}`}
                    >
                      ಕನ್ನಡ
                    </button>
                    <button
                      id="lang-btn-hi"
                      onClick={() => handleLanguageChange('hi')}
                      className={`text-[10px] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all ${language === 'hi' ? 'bg-white shadow-sm font-bold text-terracotta' : 'text-gray-beige font-medium hover:text-charcoal'}`}
                    >
                      हिन्दी
                    </button>
                    <button
                      id="lang-btn-ta"
                      onClick={() => handleLanguageChange('ta')}
                      className={`text-[10px] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all ${language === 'ta' ? 'bg-white shadow-sm font-bold text-terracotta' : 'text-gray-beige font-medium hover:text-charcoal'}`}
                    >
                      தமிழ்
                    </button>
                  </div>
                </div>
              </div>

              {/* Role selection happens during onboarding; public users stay in their chosen experience. */}
            </header>

            {/* Global Floating Web Speech subtitles and recorder panel */}
            <VoiceHelper 
              language={language}
              isListening={isListening}
              setIsListening={setIsListening}
              onTranscriptReceived={handleGlobalTranscript}
            />

            {/* Active view window with bottom padding for mobile bottom bar */}
            <main className="flex-1 overflow-y-auto bg-cream pb-24 md:pb-8" id="applet-main-canvas">
              <AnimatePresence mode="wait">
                {currentMode === 'weaver' ? (
                  <motion.div
                    key="weaver-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="min-h-full flex flex-col"
                  >
                    <WeaverView 
                      language={language}
                      products={products}
                      setProducts={setProducts}
                      orders={orders}
                      setOrders={setOrders}
                      profile={profile}
                      startListening={startListening}
                      dataSaver={dataSaver}
                    />
                  </motion.div>
                ) : currentMode === 'buyer' ? (
                  <motion.div
                    key="buyer-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="min-h-full flex flex-col"
                  >
                    <BuyerView 
                      language={language}
                      products={products}
                      orders={orders}
                      setOrders={setOrders}
                      profile={profile}
                      startListening={startListening}
                      dataSaver={dataSaver}
                      openOrdersSignal={buyerOrdersRequest}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="admin-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="min-h-full flex flex-col"
                  >
                    <AdminDashboard
                      language={language}
                      profile={profile}
                      products={products}
                      setProducts={setProducts}
                      orders={orders}
                      setOrders={setOrders}
                      onSwitchMode={(mode) => toggleMode(mode)}
                      onLogout={() => {
                        playSyntheticChime('click');
                        handleResetOnboarding();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Standard Responsive Website Footer */}
            <footer className="bg-white border-t border-cream-dark py-3 sm:py-4 px-4 sm:px-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-20 text-center sm:text-left mb-16 md:mb-0">
              <div className="flex items-center gap-2 text-terracotta">
                {isOffline ? (
                  <button
                    onClick={() => {
                      playSyntheticChime('click');
                      handleSetNetworkMode('online');
                    }}
                    className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full hover:bg-amber-100 transition cursor-pointer"
                    title="Click to switch back to Online Mode"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span>Offline Cached Mode (Click to go Online)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playSyntheticChime('click');
                      setShowOfflineLab(true);
                    }}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-charcoal transition cursor-pointer"
                    title="Click to simulate Rural Offline Mode & test Offline Banner"
                  >
                    <span className={`w-2 h-2 rounded-full bg-emerald-500 ${dataSaver ? '' : 'animate-pulse'}`}></span>
                    <span>{dataSaver ? 'Data Saver Active (Throttled)' : 'Direct Connection (Tap for Offline Demo)'}</span>
                  </button>
                )}
              </div>
              <span>KalaSetu Handloom Direct Marketplace © 2026</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                Rural Offline Resilient
              </span>
            </footer>

            {/* Mobile Bottom Navigation Bar for PWA */}
            <BottomNavigation 
              activeRole={currentMode}
              activeTab={currentMode}
              onOpenVoiceModal={testVoiceAssistant}
              onOpenVoice={testVoiceAssistant}
              onOpenOfflineLab={() => {
                playSyntheticChime('click');
                setShowOfflineLab(true);
              }}
              onOpenSyncLab={() => {
                playSyntheticChime('click');
                setShowOfflineLab(true);
              }}
              onOpenAccountModal={() => {
                playSyntheticChime('click');
                setShowAccountModal(true);
              }}
              onOpenAccount={() => {
                playSyntheticChime('click');
                setShowAccountModal(true);
              }}
              onAccountClick={() => {
                playSyntheticChime('click');
                setShowAccountModal(true);
              }}
              outboxCount={outbox.length}
              networkMode={networkMode}
              isSyncing={isSyncing}
              language={language}
              onOpenOrders={() => setBuyerOrdersRequest(previous => previous + 1)}
            />

            {/* Global Floating Offline Mode Trial Quick Access Button - visible at every viewport width */}
            <button
              id="floating-offline-trial-btn"
              onClick={() => {
                playSyntheticChime('click');
                setShowOfflineLab(true);
              }}
              className="flex fixed bottom-20 md:bottom-4 right-4 z-40 bg-charcoal/95 text-cream px-3.5 py-2.5 rounded-full shadow-2xl border-2 border-amber-400/90 items-center gap-2 text-xs font-bold hover:scale-105 transition-all hover:bg-charcoal cursor-pointer"
              title="Open Offline Mode Demonstration & Outbox Sync Bench"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${networkMode === 'offline' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Offline Demo Trial</span>
              {outbox.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {outbox.length} Queued
                </span>
              )}
            </button>

          </>
        )}

        {/* Account Modal Sheet */}
        {showAccountModal && (
          <AccountModal
            language={language}
            profile={profile}
            dataSaver={dataSaver}
            setDataSaver={setDataSaver}
            onClose={() => setShowAccountModal(false)}
            onResetOnboarding={handleResetOnboarding}
            orders={orders}
            offline={networkMode === 'offline'}
          />
        )}

        {/* Login Modal for Admin & Role switching */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          language={language}
          onLoginSuccess={(loggedInProfile) => {
            setProfile(loggedInProfile);
            setCurrentMode(loggedInProfile.role);
            setOnboardingCompleted(true);
            setHasSeenLanding(true);
            setShowLoginModal(false);
            try {
              localStorage.setItem('taana_profile', JSON.stringify(loggedInProfile));
              localStorage.setItem('taana_onboarding_done', 'true');
              localStorage.setItem('taana_seen_landing', 'true');
            } catch (e) {}
          }}
        />

        {/* Offline Mode Demonstration & Resilience Trial Lab */}
        <OfflineSimulationLab
          language={language}
          networkMode={networkMode}
          setNetworkMode={handleSetNetworkMode}
          outbox={outbox}
          onTriggerSync={triggerBackgroundSync}
          isSyncing={isSyncing}
          lastSyncTimestamp={lastSyncTimestamp}
          isOpen={showOfflineLab}
          onClose={() => setShowOfflineLab(false)}
          onSimulateOfflineAction={handleSimulateOfflineAction}
          onTestVoiceOffline={testVoiceAssistant}
          onSimulateConflict={handleSimulateConflict}
        />

      </div>

    </div>
  );
}
