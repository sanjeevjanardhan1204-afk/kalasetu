import React, { useState, useEffect } from 'react';
import { 
  Plus, Camera, Mic, Keyboard, Check, AlertCircle, Play, 
  Trash2, Landmark, Clock, CheckCircle2, ChevronRight, 
  ChevronLeft, ArrowLeft, RefreshCw, Upload, ShieldCheck,
  BarChart3, Award, ShieldAlert, Sparkles, FileText
} from 'lucide-react';
import { Product, Order, Language, Translation, Dimensions, GiInfo } from '../types';
import { 
  SAMPLE_PRODUCT_IMAGES, QA_QUESTIONS, TRANSLATIONS, 
  SIMULATED_VOICE_SPEECHES, playSyntheticChime 
} from '../data';
import { speakText, stopSpeaking, triggerSubtitleSpeak, triggerSubtitleStop } from './VoiceHelper';
import { WeaverSuccessTips } from './WeaverSuccessTips';
import { OrderTrackingProgressBar } from './OrderTrackingProgressBar';
import { GiModal } from './GiModal';
import { PaymentProtectionTracker } from './PaymentProtectionTracker';
import { DisputeModal } from './DisputeModal';
import { AiDynamicPricingModal } from './AiDynamicPricingModal';
import { motion, AnimatePresence } from 'motion/react';

interface WeaverViewProps {
  language: Language;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  profile: any;
  startListening?: (callback: (text: string) => void) => void;
  dataSaver: boolean;
}

export const WeaverView: React.FC<WeaverViewProps> = ({
  language,
  products,
  setProducts,
  orders,
  setOrders,
  profile,
  startListening,
  dataSaver
}) => {
  const t = TRANSLATIONS[language];

  // Data saver synchronization states
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Sync loop based on connection settings
  useEffect(() => {
    const intervalTime = dataSaver ? 45000 : 15000;
    
    const interval = setInterval(() => {
      setSyncStatus('syncing');
      
      // Sync processing animation delay
      const delay = dataSaver ? 100 : 2000;
      const timer = setTimeout(() => {
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        
        // Return to idle after a brief showing of 'synced'
        const idleDelay = dataSaver ? 100 : 3000;
        const idleTimer = setTimeout(() => {
          setSyncStatus('idle');
        }, idleDelay);
        
        return () => clearTimeout(idleTimer);
      }, delay);
      
      return () => clearTimeout(timer);
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [dataSaver]);

  const lastSyncText = lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'list-wizard'>('dashboard');

  // Dashboard Stats
  const [earnings, setEarnings] = useState({
    available: 9600,
    pending: 3200,
    completedCount: 3
  });

  // Flow 1 - Product Listing Wizard States
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: Photo, 2: Guided Q&A, 3: Listen/Read Review
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  
  // Q&A Question Index
  const [qaIndex, setQaIndex] = useState<number>(0);
  const [qaAnswers, setQaAnswers] = useState<Record<string, string>>({
    title: '',
    material: '',
    specialFeatures: '',
    price: '',
  });
  const [dimensions, setDimensions] = useState<Dimensions>({ length: '5.5 meters', width: '1.1 meters' });
  
  // Input Modes (voice vs keyboard)
  const [typingMode, setTypingMode] = useState<boolean>(false);
  const [currentInputText, setCurrentInputText] = useState<string>('');
  
  // Microphones / Speaking Visual States
  const [weaverListening, setWeaverListening] = useState<boolean>(false);
  const [isReviewSpeaking, setIsReviewSpeaking] = useState<boolean>(false);

  // Confidence check simulator
  const [showConfidenceCheck, setShowConfidenceCheck] = useState<boolean>(false);
  const [confidenceCheckText, setConfidenceCheckText] = useState<string>('');

  // Pre-Dispatch QC Modal States
  const [selectedOrderForQc, setSelectedOrderForQc] = useState<Order | null>(null);
  const [qcChecks, setQcChecks] = useState({
    noDamage: false,
    threadsTrimmed: false,
    stitchingOk: false,
    photoUploaded: false
  });
  const [qcPhoto, setQcPhoto] = useState<string | null>(null);

  // 4 Safe Integration Features: States
  const [selectedPricingProduct, setSelectedPricingProduct] = useState<Product | null>(null);
  const [showWizardPricingModal, setShowWizardPricingModal] = useState<boolean>(false);
  const [selectedGiProduct, setSelectedGiProduct] = useState<Product | null>(null);
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<Order | null>(null);
  const [disputeInitialMode, setDisputeInitialMode] = useState<'artisan-respond' | 'view' | 'admin-resolve'>('artisan-respond');

  // Wizard Draft GI State
  const [draftGiRegistered, setDraftGiRegistered] = useState<boolean>(false);
  const [draftGiRegNumber, setDraftGiRegNumber] = useState<string>('GI-APP-' + Math.floor(100 + Math.random() * 900));
  const [draftGiOrigin, setDraftGiOrigin] = useState<string>(profile?.region || 'Gudikal Cluster, Bagalkot');
  const [draftGiState, setDraftGiState] = useState<string>('Karnataka');

  // Read Earnings Aloud function
  const handleReadEarnings = () => {
    let text = '';
    if (language === 'kn') {
      text = `ನಿಮ್ಮ ಒಟ್ಟು ಗಳಿಕೆಯ ವಿವರಗಳು ಇಲ್ಲಿವೆ. ಹಿಂಪಡೆಯಲು ಒಂಬತ್ತು ಸಾವಿರದ ಆರುನೂರು ರೂಪಾಯಿಗಳು ಲಭ್ಯವಿವೆ. ಮೂರು ಸಾವಿರದ ಇನ್ನೂರು ರೂಪಾಯಿಗಳು ಬಾಕಿ ಉಳಿದಿವೆ. ಒಟ್ಟು ಮೂರು ಆರ್ಡರ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.`;
    } else if (language === 'hi') {
      text = `आपकी कमाई का विवरण इस प्रकार है। निकासी के लिए उपलब्ध राशि नौ हजार छह सौ रुपये है। तीन हजार दो सौ रुपये होल्ड पर हैं। कुल तीन ऑर्डर पूरे हो चुके हैं।`;
    } else {
      text = `Here is your earnings summary. You have nine thousand six hundred rupees available to withdraw. Three thousand two hundred rupees are pending in hold. You have completed three orders.`;
    }
    triggerSubtitleSpeak(text);
    speakText(text, language, undefined, () => triggerSubtitleStop());
  };

  // Speaks the guided question to the artisan on load
  const speakCurrentQuestion = (index: number) => {
    const question = QA_QUESTIONS[index];
    const qText = question.label[language];
    triggerSubtitleSpeak(qText);
    speakText(qText, language, undefined, () => triggerSubtitleStop());
  };

  useEffect(() => {
    if (activeSubTab === 'list-wizard' && wizardStep === 2) {
      speakCurrentQuestion(qaIndex);
    } else {
      stopSpeaking();
      triggerSubtitleStop();
    }
  }, [activeSubTab, wizardStep, qaIndex, language]);

  // Handle voice transcript in Guided Q&A
  const handleVoiceInput = (text: string) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    playSyntheticChime('success');
    saveQaAnswer(cleanText);
  };

  const saveQaAnswer = (text: string) => {
    const key = QA_QUESTIONS[qaIndex].key;
    setQaAnswers(prev => ({ ...prev, [key]: text }));
    setCurrentInputText('');
    
    // Auto transition to next or handle measurements specially
    if (qaIndex < QA_QUESTIONS.length - 1) {
      setQaIndex(qaIndex + 1);
    } else {
      setWizardStep(3); // review step
    }
  };

  // Trigger real Web Speech API microphone or fall back to simulation
  const handleMicClick = () => {
    if (startListening) {
      startListening((text) => {
        handleVoiceInput(text);
      });
    } else {
      triggerSimulatedRecording();
    }
  };

  // Simulate a manual voice recording capture (useful if Web Speech is blocked)
  const triggerSimulatedRecording = () => {
    setWeaverListening(true);
    playSyntheticChime('record');
    
    setTimeout(() => {
      setWeaverListening(false);
      const key = QA_QUESTIONS[qaIndex].key as keyof typeof SIMULATED_VOICE_SPEECHES;
      const samples = SIMULATED_VOICE_SPEECHES[key] || ["Beautiful hand-made craft"];
      const selectedSpeech = samples[Math.floor(Math.random() * samples.length)];
      handleVoiceInput(selectedSpeech);
    }, 2000);
  };

  // Confirmation screen review audio playback
  const handleReadReviewSummary = () => {
    setIsReviewSpeaking(true);
    let summaryText = '';
    
    if (language === 'kn') {
      summaryText = `ದಯವಿಟ್ಟು ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಪಟ್ಟಿಯನ್ನು ಖಚಿತಪಡಿಸಿ. ಉತ್ಪನ್ನದ ಹೆಸರು: ${qaAnswers.title || 'ಕೈಮಗ್ಗ ಉತ್ಪನ್ನ'}. ಬಳಸಿದ ಬಟ್ಟೆ: ${qaAnswers.material || 'ಶುದ್ಧ ಹತ್ತಿ'}. ಉದ್ದ: ${dimensions.length}, ಅಗಲ: ${dimensions.width}. ವಿಶೇಷತೆ: ${qaAnswers.specialFeatures || 'ಸಾಂಪ್ರದಾಯಿಕ ಕೈಮಗ್ಗ ನೇಯ್ಗೆ'}. ನಿಗದಿಪಡಿಸಿದ ಬೆಲೆ: ${qaAnswers.price || 'ಮೂರು ಸಾವಿರ'} ರೂಪಾಯಿಗಳು.`;
    } else if (language === 'hi') {
      summaryText = `कृपया अपने उत्पाद विवरण की पुष्टि करें। उत्पाद का नाम: ${qaAnswers.title || 'हथकरघा साड़ी'}. सामग्री: ${qaAnswers.material || 'शुद्ध सूत'}. लंबाई: ${dimensions.length}, चौड़ाई: ${dimensions.width}. विशेषता: ${qaAnswers.specialFeatures || 'पारंपरिक बुनाई'}. कीमत: ${qaAnswers.price || 'चार हजार'} रुपये।`;
    } else {
      summaryText = `Please review your listing. Product name is ${qaAnswers.title || 'Handloom item'}. Made of ${qaAnswers.material || 'pure cotton'}. Measurements are length ${dimensions.length} and width ${dimensions.width}. Special features: ${qaAnswers.specialFeatures || 'Traditional weave'}. Listed price is ${qaAnswers.price || 'three thousand'} rupees.`;
    }

    triggerSubtitleSpeak(summaryText);
    speakText(summaryText, language, undefined, () => {
      setIsReviewSpeaking(false);
      triggerSubtitleStop();
    });
  };

  // Submit and Publish new Product
  const handlePublishListing = () => {
    playSyntheticChime('success');
    const newProduct: Product = {
      id: 'p-' + Date.now(),
      title: qaAnswers.title || 'Authentic Village Handloom Product',
      weaverName: profile?.name || 'Annaiah Devanga',
      weaverBio: `A certified master artisan with ${profile?.experience || '15'}+ years of experience, specializing in handmade creations. Proud member of ${profile?.cooperative || 'Gudikal Co-operative'}.`,
      weaverRegion: profile?.region || 'Gudikal, Bagalkot, Karnataka',
      weaverImage: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300',
      material: qaAnswers.material || 'Pure Khadi Cotton',
      price: parseInt(qaAnswers.price) || 3500,
      dimensions: dimensions,
      specialFeatures: qaAnswers.specialFeatures || 'Woven using natural vegetable dyes and custom heritage borders.',
      description: `A stunning handloom creation featuring organic textures. Crafted with care over multiple days of precise manual tension on wooden frames.`,
      images: [selectedPhoto || SAMPLE_PRODUCT_IMAGES[0], SAMPLE_PRODUCT_IMAGES[1]],
      careInstructions: 'Gentle hand wash separate in cold water. Do not twist. Hang to dry in a shady breeze.',
      dateAdded: new Date().toISOString(),
      status: 'Listed',
      languageCreated: language,
      giInfo: draftGiRegistered ? {
        productName: qaAnswers.title || 'Authentic Village Handloom Product',
        registrationNumber: draftGiRegNumber,
        origin: draftGiOrigin,
        stateRegion: draftGiState,
        category: 'Handicrafts / Textiles',
        status: 'PENDING'
      } : undefined
    };

    setProducts(prev => [newProduct, ...prev]);
    
    // Clear and return to Dashboard
    setSelectedPhoto(null);
    setQaAnswers({ title: '', material: '', specialFeatures: '', price: '' });
    setDraftGiRegistered(false);
    setQaIndex(0);
    setWizardStep(1);
    setActiveSubTab('dashboard');

    // Speech success notification
    const successMsg = language === 'kn' 
      ? 'ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' 
      : language === 'hi' 
      ? 'आपका उत्पाद सफलतापूर्वक प्रकाशित हो गया है!' 
      : 'Your handloom product has been successfully published to Taana!';
    triggerSubtitleSpeak(successMsg);
    speakText(successMsg, language, undefined, () => triggerSubtitleStop());
  };

  // Handles Pre-dispatch quality check completion
  const handleQcSubmit = () => {
    if (!selectedOrderForQc) return;
    playSyntheticChime('success');

    // Update order status in the state
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === selectedOrderForQc.id) {
          return {
            ...order,
            status: 'Quality Checked',
            qualityCheck: {
              checkedForDamage: qcChecks.noDamage,
              looseThreadsRemoved: qcChecks.threadsTrimmed,
              stitchingVerified: qcChecks.stitchingOk,
              photoUrl: qcPhoto || undefined
            },
            trackingHistory: [
              ...order.trackingHistory,
              {
                status: 'Quality Checked',
                timestamp: new Date().toISOString(),
                description: 'Pre-dispatch Quality Check passed! Artisan verified the product and its structural integrity.'
              }
            ]
          };
        }
        return order;
      })
    );

    // Increment artisan earnings instantly as demo encouragement!
    setEarnings(prev => ({
      ...prev,
      pending: prev.pending + Math.round(selectedOrderForQc.product.price * 0.91)
    }));

    // Reset QC states
    setSelectedOrderForQc(null);
    setQcChecks({ noDamage: false, threadsTrimmed: false, stitchingOk: false, photoUploaded: false });
    setQcPhoto(null);
  };

  return (
    <div className="max-w-7xl mx-auto bg-cream pb-24 min-h-[85vh] relative px-4 sm:px-6 lg:px-8" id="weaver-view-container">
      
      {activeSubTab === 'dashboard' ? (
        <div className="px-4 py-5 space-y-6">
          
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">{t.weaverDashboard}</h2>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full bg-emerald-500 ${dataSaver ? '' : 'animate-pulse'}`}></span>
                Artisan ID: #{profile?.weaverId || 'WEV-8809'}
              </p>
            </div>
            
            {/* Quick Listing Trigger */}
            <button
              id="add-new-product-btn"
              onClick={() => {
                playSyntheticChime('click');
                setActiveSubTab('list-wizard');
              }}
              className="bg-terracotta hover:bg-terracotta-dark text-cream font-bold py-3 px-4 rounded-xl flex items-center gap-2 shadow-md transition transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{t.addNewProduct}</span>
            </button>
          </div>

          {/* Connection status card optimized for limited connectivity */}
          <div className="bg-white rounded-2xl border border-cream-border p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                dataSaver 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              } ${dataSaver ? '' : 'animate-ping'}`}></span>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold leading-none">
                  {dataSaver ? 'Rural Connection Mode' : 'Live Connection'}
                </p>
                <p className="text-[11px] text-charcoal font-semibold mt-0.5">
                  {syncStatus === 'syncing' 
                    ? 'Checking listing ledgers with Taana...' 
                    : `Last synced: ${lastSyncText}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {syncStatus === 'syncing' && (
                <RefreshCw className={`w-3.5 h-3.5 text-terracotta ${dataSaver ? '' : 'animate-spin'}`} />
              )}
              <span className="text-[9px] font-bold text-gray-400 bg-cream-dark px-2 py-0.5 rounded-full font-mono uppercase">
                {dataSaver ? 'Once / 45s' : 'Once / 15s'}
              </span>
            </div>
          </div>

          {/* Earnings card */}
          <div className="bg-gradient-to-br from-indigo-custom to-indigo-light text-cream rounded-2xl p-5 shadow-lg relative overflow-hidden" id="weaver-earnings-card">
            {/* Soft decorative circular background weave */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full border-4 border-cream/10 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-cream/80 font-medium flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-mustard" />
                {t.earningsSummary}
              </span>
              <span className="bg-mustard text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Direct-To-Bank
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-cream/70 font-semibold">{t.availableEarnings}</p>
                <p className="text-3xl font-serif font-bold text-mustard">₹{(earnings?.available ?? 0).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-cream/10 pt-3">
                <div>
                  <p className="text-[10px] text-cream/70 uppercase font-semibold">{t.pendingPayments}</p>
                  <p className="text-sm font-semibold">₹{(earnings?.pending ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-cream/70 uppercase font-semibold">{t.completedOrders}</p>
                  <p className="text-sm font-semibold">{earnings.completedCount} Shipped</p>
                </div>
              </div>

              <button
                id="read-earnings-aloud-btn"
                onClick={handleReadEarnings}
                className="w-full bg-cream/10 hover:bg-cream/20 text-cream text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 border border-cream/20 transition"
              >
                {t.readEarningsAloud}
              </button>
            </div>
          </div>

          {/* Summary Dashboard: Sales & Earnings Performance */}
          <div className="bg-white rounded-2xl border border-cream-border p-5 shadow-xs space-y-5 animate-fade-in" id="weaver-summary-dashboard">
            <div className="flex items-center justify-between border-b border-cream-dark pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-custom/5 rounded-lg text-indigo-custom">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-charcoal">
                    {language === 'kn' ? 'ಮಾರಾಟ ಮತ್ತು ಗಳಿಕೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : language === 'hi' ? 'बिक्री और कमाई डैशबोर्ड' : 'Sales & Earnings Dashboard'}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                    {language === 'kn' ? 'ವ್ಯವಹಾರ ಪ್ರಗತಿ ವರದಿ' : language === 'hi' ? 'व्यापार प्रगति रिपोर्ट' : 'Business Growth Metrics'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-indigo-custom bg-indigo-custom/5 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                  {language === 'kn' ? 'ಲೈವ್ ವಿಶ್ಲೇಷಣೆ' : language === 'hi' ? 'लाइव विश्लेषण' : 'Live Analytics'}
                </span>
              </div>
            </div>

            {/* Total Earnings Breakdown & Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs font-bold text-charcoal">
                <span>
                  {language === 'kn' ? 'ಒಟ್ಟು ಗಳಿಕೆಯ ವಿಭಜನೆ' : language === 'hi' ? 'कुल कमाई का विवरण' : 'Total Earnings Breakdown'}
                </span>
                <span className="text-sm font-serif text-terracotta">
                  ₹{((earnings?.available ?? 0) + (earnings?.pending ?? 0)).toLocaleString()}
                </span>
              </div>
              
              {/* Proportional horizontal bar */}
              <div className="w-full h-3.5 bg-cream-dark rounded-full overflow-hidden flex" title="Available to Withdraw vs Pending">
                <div 
                  className="bg-terracotta h-full transition-all duration-500" 
                  style={{ width: `${((earnings?.available ?? 0) / Math.max(1, ((earnings?.available ?? 0) + (earnings?.pending ?? 0)))) * 100}%` }}
                />
                <div 
                  className="bg-mustard h-full transition-all duration-500" 
                  style={{ width: `${((earnings?.pending ?? 0) / Math.max(1, ((earnings?.available ?? 0) + (earnings?.pending ?? 0)))) * 100}%` }}
                />
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 gap-4 text-[11px] font-semibold text-gray-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-terracotta"></span>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider leading-none">
                      {language === 'kn' ? 'ಹಿಂಪಡೆಯಲು ಲಭ್ಯ' : language === 'hi' ? 'निकासी के लिए उपलब्ध' : 'Available'}
                    </p>
                    <p className="text-xs font-bold text-charcoal mt-0.5">
                      ₹{(earnings?.available ?? 0).toLocaleString()} ({Math.round(((earnings?.available ?? 0) / Math.max(1, ((earnings?.available ?? 0) + (earnings?.pending ?? 0)))) * 100)}%)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-l border-cream-dark pl-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-mustard"></span>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider leading-none">
                      {language === 'kn' ? 'ಬಾಕಿ ಇದೆ' : language === 'hi' ? 'होल्ड पर' : 'Pending Hold'}
                    </p>
                    <p className="text-xs font-bold text-charcoal mt-0.5">
                      ₹{(earnings?.pending ?? 0).toLocaleString()} ({Math.round(((earnings?.pending ?? 0) / Math.max(1, ((earnings?.available ?? 0) + (earnings?.pending ?? 0)))) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Sales Performance Bar Chart */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-charcoal">
                {language === 'kn' ? 'ಮಾಸಿಕ ಕೈಮಗ್ಗ ಮಾರಾಟದ ವರದಿ' : language === 'hi' ? 'मासिक हथकरघा बिक्री रिपोर्ट' : 'Monthly Handloom Sales Performance'}
              </p>

              {/* CSS-based bar chart */}
              <div className="bg-cream/40 border border-cream-border/30 rounded-xl p-3 space-y-4">
                <div className="h-28 flex items-end justify-between gap-2.5 px-1 relative">
                  {/* Back Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-gray-400 font-mono font-bold">
                    <div className="border-b border-dashed border-gray-200/60 w-full pb-0.5">₹15k</div>
                    <div className="border-b border-dashed border-gray-200/60 w-full pb-0.5">₹10k</div>
                    <div className="border-b border-dashed border-gray-200/60 w-full pb-0.5">₹5k</div>
                    <div className="w-full border-b border-gray-200"></div>
                  </div>

                  {/* Render Monthly Bars */}
                  {[
                    { month: language === 'kn' ? 'ಫೆಬ್ರ' : language === 'hi' ? 'फर' : 'Feb', sales: 2, revenue: 6400 },
                    { month: language === 'kn' ? 'ಮಾರ್ಚ್' : language === 'hi' ? 'मार्च' : 'Mar', sales: 3, revenue: 9600 },
                    { month: language === 'kn' ? 'ಏಪ್ರಿ' : language === 'hi' ? 'अप्रै' : 'Apr', sales: 1, revenue: 3200 },
                    { month: language === 'kn' ? 'ಮೇ' : language === 'hi' ? 'मई' : 'May', sales: 4, revenue: 12800 },
                    { month: language === 'kn' ? 'ಜೂನ್' : language === 'hi' ? 'जून' : 'Jun', sales: 2, revenue: 6400 },
                    { 
                      month: language === 'kn' ? 'ಜುಲೈ' : language === 'hi' ? 'जुला' : 'Jul', 
                      sales: earnings.completedCount, 
                      revenue: earnings.available + earnings.pending,
                      isCurrent: true 
                    }
                  ].map((item, idx) => {
                    const maxRevenue = 15000;
                    const heightPercent = Math.min(100, Math.max(10, (item.revenue / maxRevenue) * 100));
                    
                    return (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center group relative z-10"
                        title={`${item.sales} ${language === 'kn' ? 'ಸೀರೆಗಳು' : language === 'hi' ? 'साड़ियाँ' : 'sarees'} - ₹${(item?.revenue ?? 0).toLocaleString()}`}
                      >
                        {/* Value indicator tooltip/bubble visible on hover */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition duration-200 bg-charcoal text-cream text-[9px] font-bold py-1 px-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-xs z-20">
                          ₹{(item?.revenue ?? 0).toLocaleString()}
                        </div>

                        {/* Animated Bar with CSS transition */}
                        <div className="w-full flex justify-center">
                          <div 
                            className={`w-4 sm:w-6 rounded-t-sm transition-all duration-500 ease-out hover:brightness-110 shadow-3xs ${
                              item.isCurrent 
                                ? 'bg-gradient-to-t from-terracotta to-terracotta-dark' 
                                : 'bg-gradient-to-t from-indigo-custom to-indigo-light'
                            }`}
                            style={{ height: `${heightPercent}px` }}
                          />
                        </div>

                        {/* Month Label */}
                        <span className="text-[10px] text-gray-500 font-bold mt-1.5 truncate max-w-full">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Info and help text below the chart */}
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase pt-1 border-t border-cream-dark/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-custom"></span>
                    <span>
                      {language === 'kn' ? 'ಹಿಂದಿನ ಅವಧಿ' : language === 'hi' ? 'पिछली अवधि' : 'Previous Period'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-terracotta"></span>
                    <span>
                      {language === 'kn' ? 'ಪ್ರಸ್ತುತ ತಿಂಗಳು' : language === 'hi' ? 'चालू माह' : 'Current Month'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artisan Success Tips: Actionable ways to boost product visibility */}
          <WeaverSuccessTips 
            language={language}
            onApplyTip={() => {
              setActiveSubTab('list-wizard');
              setWizardStep(1);
            }}
          />

          {/* Active Incoming Orders */}
          <div className="space-y-3" id="active-incoming-orders">
            <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
              <Clock className="w-5 h-5 text-terracotta" />
              {t.incomingOrders}
              <span className="bg-terracotta text-cream text-xs px-2 py-0.5 rounded-full font-sans">
                {orders.filter(o => o.status === 'Order Received' || o.status === 'Accepted').length}
              </span>
            </h3>

            {orders.filter(o => o.status === 'Order Received' || o.status === 'Accepted').length === 0 ? (
              <div className="bg-cream-dark/50 border border-gray-200 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">All orders dispatched securely!</p>
                <p className="text-xs text-gray-500 mt-1">Excellent job keeping rural artisans active.</p>
              </div>
            ) : (
              orders
                .filter(o => o.status === 'Order Received' || o.status === 'Accepted')
                .map(order => (
                  <div 
                    key={order.id} 
                    className="bg-white border-2 border-indigo-custom/10 rounded-xl p-4 shadow-xs space-y-3 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-bold text-base text-indigo-custom">{order.product.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Order ID: #{order.id} • Buyer: {order.buyerName}</p>
                      </div>
                      <span className="bg-terracotta/10 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                        Pending QC
                      </span>
                    </div>

                    <div className="bg-cream/50 p-2.5 rounded-lg text-xs space-y-1 border border-cream-dark">
                      <p className="font-semibold text-gray-700">Shipping To:</p>
                      <p className="text-gray-600 leading-snug">{order.buyerAddress}</p>
                    </div>

                    {/* Order Tracking Horizontal Progress Bar */}
                    <OrderTrackingProgressBar
                      order={order}
                      language={language}
                      variant="horizontal-only"
                    />

                    {/* Feature 2: TantuLink Payment Protection Escrow Tracker */}
                    <PaymentProtectionTracker
                      order={order}
                      onUpdateOrder={(updated) => setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))}
                      userRole="artisan"
                      language={language}
                    />

                    {/* Feature 3: Dispute Notification & Response for Artisan */}
                    {order.dispute && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Buyer Dispute Registered</span>
                          </div>
                          <span className="text-[10px] font-mono text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full font-bold uppercase">
                            {order.dispute.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-700">
                          <span className="font-semibold">Reason:</span> {order.dispute.reason} — "{order.dispute.buyerNotes}"
                        </p>
                        {order.dispute.artisanResponse ? (
                          <div className="bg-white p-2.5 rounded-lg border border-rose-100 text-[11px] space-y-0.5">
                            <span className="font-bold text-gray-700 block">Your Submitted Response:</span>
                            <p className="text-gray-600 italic">"{order.dispute.artisanResponse}"</p>
                          </div>
                        ) : (
                          <button
                            id={`artisan-respond-dispute-btn-${order.id}`}
                            onClick={() => {
                              playSyntheticChime('click');
                              setSelectedDisputeOrder(order);
                              setDisputeInitialMode('artisan-respond');
                            }}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Respond to Dispute / Provide Explanation</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Pre-Dispatch QC button */}
                    <button
                      id={`mark-ready-btn-${order.id}`}
                      onClick={() => {
                        playSyntheticChime('click');
                        setSelectedOrderForQc(order);
                      }}
                      className="w-full bg-mustard hover:bg-mustard-light text-charcoal font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition transform active:scale-95"
                    >
                      <ShieldCheck className="w-5 h-5 text-indigo-custom" />
                      <span>{t.markReady}</span>
                    </button>
                  </div>
                ))
            )}
          </div>

          {/* List of current listings */}
          <div className="space-y-3" id="weaver-listings-section">
            <h3 className="font-serif text-lg font-bold text-charcoal">{t.myListedProducts}</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl border border-cream-border overflow-hidden shadow-xs flex flex-col">
                  <div className="h-28 relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 bg-charcoal/80 text-cream text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      ₹{product.price}
                    </span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-serif text-xs font-bold text-charcoal line-clamp-2 leading-tight">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {product.status === 'Listed' ? 'Active Direct' : product.status}
                      </p>
                    </div>

                    {/* GI Status Badge / Trigger */}
                    {product.giInfo ? (
                      <button
                        onClick={() => {
                          playSyntheticChime('click');
                          setSelectedGiProduct(product);
                        }}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit transition ${
                          product.giInfo.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-300'
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        <span>GI {product.giInfo.status}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playSyntheticChime('click');
                          setSelectedGiProduct(product);
                        }}
                        className="text-[9px] font-bold text-indigo-custom bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit transition"
                      >
                        <Award className="w-3 h-3" />
                        <span>+ Register GI</span>
                      </button>
                    )}

                    {/* AI Dynamic Pricing Benchmark Trigger */}
                    <button
                      onClick={() => {
                        playSyntheticChime('click');
                        setSelectedPricingProduct(product);
                      }}
                      className="text-[10px] font-bold text-terracotta hover:text-terracotta-dark bg-terracotta/5 hover:bg-terracotta/10 border border-terracotta/20 px-2 py-1 rounded-lg flex items-center gap-1 w-full justify-center transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI Dynamic Pricing</span>
                    </button>

                    <button
                      onClick={() => {
                        playSyntheticChime('stop');
                        setProducts(prev => prev.filter(p => p.id !== product.id));
                      }}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase flex items-center gap-1 pt-1.5 border-t border-cream-border self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Flow 1: Add New Product conversational wizard */
        <div className="bg-cream min-h-screen">
          
          {/* Stepper Header */}
          <div className="bg-white border-b border-cream-border px-4 py-4 sticky top-0 z-30 flex items-center gap-3">
            <button
              onClick={() => {
                playSyntheticChime('click');
                if (wizardStep > 1) {
                  setWizardStep(wizardStep - 1);
                } else {
                  setActiveSubTab('dashboard');
                }
              }}
              className="text-gray-600 hover:text-black p-1 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <span className="text-xs text-mustard font-bold uppercase tracking-wider block">
                {t.qaTitle}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-charcoal">
                  Step {wizardStep} of 3
                </span>
                <span className="text-xs text-gray-500">
                  ({wizardStep === 1 ? 'Photo Capture' : wizardStep === 2 ? 'Conversational Q&A' : 'Review & Confirm'})
                </span>
              </div>
            </div>
            {/* Visual progress bar dots */}
            <div className="flex gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${wizardStep >= 1 ? 'bg-terracotta' : 'bg-gray-200'}`}></div>
              <div className={`w-2.5 h-2.5 rounded-full ${wizardStep >= 2 ? 'bg-terracotta' : 'bg-gray-200'}`}></div>
              <div className={`w-2.5 h-2.5 rounded-full ${wizardStep >= 3 ? 'bg-terracotta' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {/* Step 1: Photo Capture Simulation */}
          {wizardStep === 1 && (
            <div className="px-4 py-6 space-y-6" id="photo-step-container">
              <div className="text-center space-y-2">
                <h3 className="font-serif text-xl font-bold text-charcoal">Take or Pick Product Photo</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Snap a photo of the completed handloom masterpiece on your loom or flat surface.
                </p>
              </div>

              {/* Main Photo Sandbox Box */}
              <div className="aspect-square w-full max-w-sm mx-auto bg-white border-4 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                {selectedPhoto ? (
                  <>
                    <img 
                      src={selectedPhoto} 
                      alt="Product Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute top-4 right-4 bg-red-600 text-cream p-2.5 rounded-full shadow-lg hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="bg-cream-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto text-terracotta shadow-md">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">Simulate Camera Shot</p>
                      <p className="text-xs text-gray-500 mt-1">Tap a template saree photo below</p>
                    </div>
                  </div>
                )}
                
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-cream/80 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-terracotta animate-spin" />
                    <p className="text-xs font-bold text-charcoal uppercase tracking-wider">Processing image threads...</p>
                  </div>
                )}
              </div>

              {/* Weaver Saree Photo Templates */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-custom uppercase tracking-wider block text-center">
                  Select a template handloom texture for the demo:
                </label>
                <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
                  {SAMPLE_PRODUCT_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      id={`template-photo-${i}`}
                      onClick={() => {
                        playSyntheticChime('click');
                        setIsUploadingPhoto(true);
                        setTimeout(() => {
                          setSelectedPhoto(img);
                          setIsUploadingPhoto(false);
                          playSyntheticChime('success');
                        }, 1000);
                      }}
                      className={`h-16 rounded-xl overflow-hidden border-3 transition duration-200 transform hover:scale-105 ${selectedPhoto === img ? 'border-terracotta scale-95 shadow-md' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Next button */}
              <div className="pt-4 max-w-sm mx-auto">
                <button
                  id="photo-step-next-btn"
                  disabled={!selectedPhoto}
                  onClick={() => {
                    playSyntheticChime('click');
                    setWizardStep(2);
                    setQaIndex(0);
                  }}
                  className={`w-full font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md transition ${selectedPhoto ? 'bg-terracotta hover:bg-terracotta-dark text-cream transform active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <span>{t.next}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Guided Conversational Q&A */}
          {wizardStep === 2 && (
            <div className="px-4 py-6 space-y-6 flex flex-col justify-between" id="qa-step-container">
              
              {/* Question bubble */}
              <div className="space-y-4">
                <div className="bg-white border-2 border-indigo-custom/15 rounded-2xl p-5 shadow-xs space-y-2 relative">
                  {/* Decorative quote mark */}
                  <div className="absolute right-4 top-2 text-6xl text-gray-100 font-serif leading-none pointer-events-none">“</div>
                  <span className="text-[10px] text-terracotta font-bold uppercase tracking-wider block">
                    Question {qaIndex + 1} of {QA_QUESTIONS.length}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-charcoal leading-tight">
                    {QA_QUESTIONS[qaIndex].label[language]}
                  </h4>
                  <p className="text-xs text-gray-500 italic">
                    {QA_QUESTIONS[qaIndex].hint[language]}
                  </p>
                </div>

                {/* Sub-inputs if dimensions or price */}
                {QA_QUESTIONS[qaIndex].isMeasurements && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 gap-3" id="dimensions-input-panel">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Length (ಉದ್ದ/लंबाई)</label>
                      <input 
                        type="text" 
                        value={dimensions.length}
                        onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                        className="w-full bg-cream p-2.5 rounded-lg text-sm border border-gray-300 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Width (ಅಗಲ/चौड़ाई)</label>
                      <input 
                        type="text" 
                        value={dimensions.width}
                        onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                        className="w-full bg-cream p-2.5 rounded-lg text-sm border border-gray-300 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>
                )}

                {/* Suggested Chips / Autocomplete suggestions for quick click-and-add (Low literacy focus!) */}
                {QA_QUESTIONS[qaIndex].examples && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-indigo-custom font-bold uppercase tracking-wider">
                      Tap suggestion to speak/fill instantly:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QA_QUESTIONS[qaIndex].examples?.[language].map((exText: string, i: number) => (
                        <button
                          key={i}
                          id={`qa-suggestion-chip-${i}`}
                          onClick={() => {
                            playSyntheticChime('click');
                            handleVoiceInput(exText);
                          }}
                          className="bg-white hover:bg-cream-dark text-charcoal border border-gray-300 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-xs transition active:scale-95"
                        >
                          {exText}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feature 4: AI Dynamic Pricing Benchmark Assistant for Price Question */}
                {QA_QUESTIONS[qaIndex].key === 'price' && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-terracotta shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-terracotta tracking-wider block">
                          AI Fair-Wage Pricing Assistant (DEMO)
                        </span>
                        <p className="text-xs text-charcoal font-medium">
                          Calculate fair valuation based on raw yarns, weaving days & motif complexity.
                        </p>
                      </div>
                    </div>
                    <button
                      id="open-wizard-pricing-btn"
                      type="button"
                      onClick={() => {
                        playSyntheticChime('click');
                        setShowWizardPricingModal(true);
                      }}
                      className="bg-terracotta hover:bg-terracotta-dark text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 shadow-xs cursor-pointer transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Pricing</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Main Interactive Speaking / Typing Field */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-inner space-y-4">
                {!typingMode ? (
                  /* Voice Input Controls */
                  <div className="text-center space-y-4 py-2">
                    <div className="relative inline-block">
                      {weaverListening && (
                        <div className="absolute inset-0 bg-terracotta/20 rounded-full animate-ping"></div>
                      )}
                      <button
                        id="mic-pulse-button"
                        onClick={handleMicClick}
                        className={`p-6 rounded-full shadow-lg text-cream transition transform active:scale-90 ${weaverListening ? 'bg-red-600 animate-pulse' : 'bg-terracotta hover:bg-terracotta-dark'}`}
                      >
                        <Mic className="w-10 h-10" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-charcoal">{t.microphoneTap}</p>
                      <p className="text-xs text-gray-500">
                        {weaverListening ? 'Recording handloom words...' : 'Tap mic and state specs clearly'}
                      </p>
                    </div>

                    <button
                      id="switch-to-type-btn"
                      onClick={() => {
                        playSyntheticChime('click');
                        setTypingMode(true);
                      }}
                      className="text-xs font-bold text-indigo-custom hover:underline flex items-center gap-1.5 mx-auto"
                    >
                      <Keyboard className="w-4 h-4" />
                      <span>{t.typeFallback}</span>
                    </button>
                  </div>
                ) : (
                  /* Keyboard Typing fallback */
                  <div className="space-y-3" id="typing-fallback-panel">
                    <textarea
                      value={currentInputText}
                      onChange={(e) => setCurrentInputText(e.target.value)}
                      placeholder="Type details in your comfortable language..."
                      className="w-full bg-cream p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-terracotta min-h-[100px]"
                    />
                    
                    <div className="flex justify-between items-center">
                      <button
                        id="switch-to-voice-btn"
                        onClick={() => {
                          playSyntheticChime('click');
                          setTypingMode(false);
                        }}
                        className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
                      >
                        <Mic className="w-4 h-4" />
                        <span>{t.speakInstead}</span>
                      </button>

                      <button
                        id="save-typed-answer-btn"
                        disabled={!currentInputText.trim() && !QA_QUESTIONS[qaIndex].isMeasurements}
                        onClick={() => {
                          playSyntheticChime('click');
                          const textToSave = QA_QUESTIONS[qaIndex].isMeasurements
                            ? `Length ${dimensions.length}, Width ${dimensions.width}`
                            : currentInputText;
                          saveQaAnswer(textToSave);
                        }}
                        className={`font-bold py-2 px-4 rounded-xl text-xs transition ${
                          currentInputText.trim() || QA_QUESTIONS[qaIndex].isMeasurements
                            ? 'bg-indigo-custom hover:bg-indigo-light text-cream'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Confirm Text
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Back / Skip / Navigation Panel */}
              <div className="flex justify-between items-center pt-4">
                <button
                  id="qa-back-btn"
                  onClick={() => {
                    playSyntheticChime('click');
                    if (qaIndex > 0) {
                      setQaIndex(qaIndex - 1);
                    } else {
                      setWizardStep(1);
                    }
                  }}
                  className="flex items-center gap-1 text-gray-600 hover:text-black text-sm font-bold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>{t.back}</span>
                </button>

                <button
                  id="qa-skip-next-btn"
                  onClick={() => {
                    playSyntheticChime('click');
                    // Automatically prefill mock if skipping or continuing empty
                    const key = QA_QUESTIONS[qaIndex].key;
                    const prefilledText = qaAnswers[key] || (QA_QUESTIONS[qaIndex].isMeasurements ? `Length: ${dimensions.length}, Width: ${dimensions.width}` : `Standard rural craft details`);
                    setQaAnswers(prev => ({ ...prev, [key]: prefilledText }));
                    
                    if (qaIndex < QA_QUESTIONS.length - 1) {
                      setQaIndex(qaIndex + 1);
                    } else {
                      setWizardStep(3);
                    }
                  }}
                  className="flex items-center gap-1 text-terracotta hover:text-terracotta-dark text-sm font-bold"
                >
                  <span>Skip/Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Low Confidence Fallback Popup Modal */}
              {showConfidenceCheck && (
                <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl p-6 text-center max-w-xs w-full shadow-2xl space-y-4">
                    <div className="w-12 h-12 rounded-full bg-mustard/20 text-mustard flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase font-bold text-gray-400">Did we hear correctly?</p>
                      <h4 className="font-serif font-bold text-lg text-charcoal">
                        "{confidenceCheckText}"
                      </h4>
                    </div>
                    <div className="flex gap-3">
                      <button
                        id="confidence-no-btn"
                        onClick={() => {
                          playSyntheticChime('stop');
                          setShowConfidenceCheck(false);
                          setTypingMode(true); // fallbacks to keyboard typing directly
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-charcoal font-bold py-2.5 px-3 rounded-xl text-xs"
                      >
                        ✕ No, re-type
                      </button>
                      <button
                        id="confidence-yes-btn"
                        onClick={() => {
                          playSyntheticChime('success');
                          setShowConfidenceCheck(false);
                          saveQaAnswer(confidenceCheckText);
                        }}
                        className="flex-1 bg-terracotta hover:bg-terracotta-dark text-cream font-bold py-2.5 px-3 rounded-xl text-xs"
                      >
                        ✓ Yes, correct
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Step 3: Listen-or-Read Confirmation screen */}
          {wizardStep === 3 && (
            <div className="px-4 py-6 space-y-6" id="review-step-container">
              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-bold text-charcoal">{t.confirmListing}</h3>
                <p className="text-xs text-gray-500">Listen to our narration summary or read to confirm details before publishing.</p>
              </div>

              {/* Visual Audio Waveform during TTS review */}
              <div className="bg-gradient-to-r from-terracotta/10 to-mustard/10 rounded-2xl p-5 border border-terracotta/20 flex flex-col items-center justify-center space-y-4 shadow-sm">
                <button
                  id="play-review-narration-btn"
                  onClick={handleReadReviewSummary}
                  className={`p-4 rounded-full shadow-md text-cream transition ${isReviewSpeaking ? 'bg-indigo-custom animate-pulse scale-95' : 'bg-terracotta hover:bg-terracotta-dark'}`}
                >
                  <Play className={`w-6 h-6 ${isReviewSpeaking ? 'fill-cream' : ''}`} />
                </button>
                <span className="text-xs font-bold text-indigo-custom uppercase tracking-wider block">
                  {isReviewSpeaking ? 'Narrating product listing aloud...' : t.playAudio}
                </span>

                {isReviewSpeaking && (
                  <div className="flex items-end gap-1 h-6">
                    <div className="w-1.5 bg-terracotta rounded-full wave-bar" style={{ height: '4px' }}></div>
                    <div className="w-1.5 bg-mustard rounded-full wave-bar" style={{ height: '18px' }}></div>
                    <div className="w-1.5 bg-indigo-custom rounded-full wave-bar" style={{ height: '10px' }}></div>
                    <div className="w-1.5 bg-terracotta rounded-full wave-bar" style={{ height: '22px' }}></div>
                    <div className="w-1.5 bg-mustard rounded-full wave-bar" style={{ height: '6px' }}></div>
                  </div>
                )}
              </div>

              {/* Review Card Details */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-5 space-y-4">
                <div className="flex gap-3 pb-3 border-b border-gray-100">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={selectedPhoto || SAMPLE_PRODUCT_IMAGES[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="bg-mustard/20 text-mustard text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      New Listing
                    </span>
                    <h4 className="font-serif font-bold text-sm text-charcoal mt-1">{qaAnswers.title || 'Village Handloom Saree'}</h4>
                    <p className="text-lg font-serif font-extrabold text-terracotta mt-1">₹{qaAnswers.price || '3,500'}</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-gray-400 uppercase font-semibold block text-[10px] tracking-wider">Yarn Material:</span>
                    <p className="font-semibold text-charcoal">{qaAnswers.material || 'Organic Loom Yarn'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 uppercase font-semibold block text-[10px] tracking-wider">Exact Length:</span>
                      <p className="font-semibold text-charcoal">{dimensions.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-semibold block text-[10px] tracking-wider">Exact Width:</span>
                      <p className="font-semibold text-charcoal">{dimensions.width}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-semibold block text-[10px] tracking-wider">What Makes It Special:</span>
                    <p className="font-semibold text-charcoal italic leading-relaxed font-serif">
                      "{qaAnswers.specialFeatures || 'Woven carefully on a wooden frame loom with local artisan threads.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4: AI Dynamic Pricing Pre-Publish Optimizer */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-terracotta">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-serif font-bold text-xs">AI Fair-Wage Pricing Review</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Listed Price: <span className="font-bold text-charcoal">₹{qaAnswers.price || '3500'}</span>. Benchmark fair valuation before publishing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSyntheticChime('click');
                    setShowWizardPricingModal(true);
                  }}
                  className="bg-terracotta hover:bg-terracotta-dark text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1 shrink-0 transition cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Review AI Price</span>
                </button>
              </div>

              {/* Feature 1: Geographical Indication (GI) Submission Panel */}
              <div className="bg-white border-2 border-dashed border-indigo-custom/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-custom" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-charcoal">Geographical Indication (GI) Certification</h4>
                      <p className="text-[10px] text-gray-500">Government of India GI registry linkage (Sets status to PENDING)</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftGiRegistered}
                      onChange={(e) => setDraftGiRegistered(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {draftGiRegistered && (
                  <div className="bg-cream/60 p-3 rounded-xl border border-cream-border space-y-2.5 text-xs animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-cream-border">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Submission Status:</span>
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full uppercase font-mono">
                        PENDING VERIFICATION
                      </span>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block mb-0.5">GI Registration / Application Number</label>
                      <input
                        type="text"
                        value={draftGiRegNumber}
                        onChange={(e) => setDraftGiRegNumber(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono font-bold text-charcoal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Artisan Cluster Origin</label>
                        <input
                          type="text"
                          value={draftGiOrigin}
                          onChange={(e) => setDraftGiOrigin(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-charcoal"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 block mb-0.5">State / Region</label>
                        <input
                          type="text"
                          value={draftGiState}
                          onChange={(e) => setDraftGiState(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-charcoal"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      ℹ️ Your GI badge will show "PENDING" upon submission and can be verified by the admin portal.
                    </p>
                  </div>
                )}
              </div>

              {/* Double Confirm Buttons */}
              <div className="space-y-3">
                <button
                  id="confirm-and-publish-listing-btn"
                  onClick={handlePublishListing}
                  className="w-full bg-indigo-custom hover:bg-indigo-light text-cream font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md transition transform active:scale-95"
                >
                  <Check className="w-5 h-5 text-mustard stroke-[3]" />
                  <span>{t.confirmAndPublish}</span>
                </button>

                <button
                  id="edit-listing-details-btn"
                  onClick={() => {
                    playSyntheticChime('click');
                    setWizardStep(2);
                    setQaIndex(0);
                  }}
                  className="w-full bg-white hover:bg-cream-dark text-gray-600 border border-gray-300 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition"
                >
                  <span>{t.editDetails}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Pre-Dispatch Quality Check Popup Modal */}
      {selectedOrderForQc && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-cream border-2 border-terracotta rounded-3xl p-5 text-left max-w-sm w-full shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">{t.qcChecklistTitle}</h3>
                <p className="text-xs text-gray-500">Ensure absolute rural loom transparency before pickup dispatch.</p>
              </div>
              <button
                onClick={() => setSelectedOrderForQc(null)}
                className="text-gray-400 hover:text-black font-extrabold text-lg p-1 bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs flex gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <img src={selectedOrderForQc.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-charcoal">{selectedOrderForQc.product.title}</h4>
                <p className="text-gray-500 mt-0.5">Order Value: ₹{selectedOrderForQc.product.price}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-gray-500">
                  <span>QC Readiness:</span>
                  <span className="text-terracotta font-mono font-black">
                    {Math.round((((qcChecks.noDamage ? 1 : 0) + (qcChecks.threadsTrimmed ? 1 : 0) + (qcChecks.stitchingOk ? 1 : 0) + (qcChecks.photoUploaded ? 1 : 0)) / 4) * 100)}%
                  </span>
                </div>
                {/* Smooth Animated QC progress track */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1 border border-gray-200">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-terracotta to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(((qcChecks.noDamage ? 1 : 0) + (qcChecks.threadsTrimmed ? 1 : 0) + (qcChecks.stitchingOk ? 1 : 0) + (qcChecks.photoUploaded ? 1 : 0)) / 4) * 100}%` 
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-4">
              <label 
                id="damage-qc-check"
                className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-cream-dark/40 transition"
              >
                <input 
                  type="checkbox" 
                  checked={qcChecks.noDamage}
                  onChange={(e) => setQcChecks(prev => ({ ...prev, noDamage: e.target.checked }))}
                  className="w-5 h-5 text-terracotta rounded border-gray-300 focus:ring-terracotta shrink-0 mt-0.5"
                />
                <span className="text-xs font-semibold text-charcoal leading-relaxed">{t.damageCheck}</span>
              </label>

              <label 
                id="threads-qc-check"
                className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-cream-dark/40 transition"
              >
                <input 
                  type="checkbox" 
                  checked={qcChecks.threadsTrimmed}
                  onChange={(e) => setQcChecks(prev => ({ ...prev, threadsTrimmed: e.target.checked }))}
                  className="w-5 h-5 text-terracotta rounded border-gray-300 focus:ring-terracotta shrink-0 mt-0.5"
                />
                <span className="text-xs font-semibold text-charcoal leading-relaxed">{t.threadsCheck}</span>
              </label>

              <label 
                id="stitching-qc-check"
                className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-cream-dark/40 transition"
              >
                <input 
                  type="checkbox" 
                  checked={qcChecks.stitchingOk}
                  onChange={(e) => setQcChecks(prev => ({ ...prev, stitchingOk: e.target.checked }))}
                  className="w-5 h-5 text-terracotta rounded border-gray-300 focus:ring-terracotta shrink-0 mt-0.5"
                />
                <span className="text-xs font-semibold text-charcoal leading-relaxed">{t.stitchingCheck}</span>
              </label>

              {/* Photo Upload Simulator */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                {qcPhoto ? (
                  <div className="relative">
                    <img src={qcPhoto} alt="QC Packed Bundle" className="h-32 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => {
                        setQcPhoto(null);
                        setQcChecks(prev => ({ ...prev, photoUploaded: false }));
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-cream p-1.5 rounded-full shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    id="qc-simulate-photo-btn"
                    onClick={() => {
                      playSyntheticChime('click');
                      // Simulate camera snap of boxed bundle
                      setQcPhoto(SAMPLE_PRODUCT_IMAGES[1]);
                      setQcChecks(prev => ({ ...prev, photoUploaded: true }));
                      playSyntheticChime('success');
                    }}
                    className="flex flex-col items-center justify-center gap-1 text-gray-500 py-2 w-full"
                  >
                    <Upload className="w-6 h-6 text-terracotta mb-1" />
                    <span className="text-xs font-bold text-charcoal">{t.qcPhotoUpload}</span>
                    <span className="text-[10px] text-gray-400">Snaps an image of finished woven box</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-2">
              <button
                id="qc-cancel-btn"
                onClick={() => setSelectedOrderForQc(null)}
                className="flex-1 bg-white hover:bg-cream-dark text-gray-600 border border-gray-300 font-bold py-3 px-4 rounded-xl text-xs text-center transition"
              >
                {t.cancel}
              </button>
              <button
                id="qc-submit-btn"
                disabled={!(qcChecks.noDamage && qcChecks.threadsTrimmed && qcChecks.stitchingOk)}
                onClick={handleQcSubmit}
                className={`flex-1 font-bold py-3 px-4 rounded-xl text-xs text-center transition ${
                  (qcChecks.noDamage && qcChecks.threadsTrimmed && qcChecks.stitchingOk)
                    ? 'bg-terracotta hover:bg-terracotta-dark text-cream shadow-md active:scale-95 transform'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t.submitQc}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: GI Details & Verification Modal */}
      {selectedGiProduct && (
        <GiModal
          product={selectedGiProduct}
          onClose={() => setSelectedGiProduct(null)}
          onUpdateProductGi={(updated) => {
            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
            setSelectedGiProduct(updated);
          }}
        />
      )}

      {/* Feature 4: AI Dynamic Pricing for Existing Product */}
      {selectedPricingProduct && (
        <AiDynamicPricingModal
          product={selectedPricingProduct}
          language={language}
          onClose={() => setSelectedPricingProduct(null)}
          onApplyPrice={(newPrice, rec) => {
            setProducts(prev => prev.map(p => p.id === selectedPricingProduct.id ? { ...p, price: newPrice, pricingRecommendation: rec } : p));
            setSelectedPricingProduct(null);
          }}
        />
      )}

      {/* Feature 4: AI Dynamic Pricing for Wizard Draft */}
      {showWizardPricingModal && (
        <AiDynamicPricingModal
          language={language}
          product={{
            id: "wizard-draft",
            title: qaAnswers.title || "Village Handloom Saree",
            weaverName: profile?.name || "Annaiah Devanga",
            weaverBio: "",
            weaverRegion: profile?.region || "Karnataka",
            weaverImage: "",
            material: qaAnswers.material || "Khadi Silk Cotton",
            price: parseInt(qaAnswers.price) || 3500,
            dimensions: dimensions,
            specialFeatures: qaAnswers.specialFeatures || "",
            description: "",
            images: [selectedPhoto || SAMPLE_PRODUCT_IMAGES[0]],
            careInstructions: "",
            dateAdded: new Date().toISOString(),
            status: "Listed",
            languageCreated: language
          }}
          onClose={() => setShowWizardPricingModal(false)}
          onApplyPrice={(newPrice) => {
            setQaAnswers(prev => ({ ...prev, price: String(newPrice) }));
            setShowWizardPricingModal(false);
          }}
        />
      )}

      {/* Feature 3: Dispute Resolution Modal (Weaver Response Flow) */}
      {selectedDisputeOrder && (
        <DisputeModal
          order={selectedDisputeOrder}
          onClose={() => setSelectedDisputeOrder(null)}
          initialMode={disputeInitialMode}
          onUpdateOrder={(updated) => {
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
            setSelectedDisputeOrder(updated);
          }}
        />
      )}

    </div>
  );
};
