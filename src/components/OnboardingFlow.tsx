import React, { useState } from 'react';
import { Sparkles, User, ArrowRight, ShieldCheck, Check, Info, ShoppingBag, Layers, Landmark, Lock, Mail } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { playSyntheticChime } from '../data';
import { speakText } from './VoiceHelper';
import { LoginModal } from './LoginModal';

interface OnboardingFlowProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onComplete: (profile: any) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  language,
  setLanguage,
  onComplete
}) => {
  const [step, setStep] = useState(1); // 1: Language, 2: Role, 3: Profile Details
  const [role, setRole] = useState<'weaver' | 'buyer' | 'admin'>('weaver');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  
  // Profile Form States
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [experience, setExperience] = useState('10');
  const [cooperative, setCooperative] = useState('');
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Admin credentials state
  const [adminEmail, setAdminEmail] = useState('admin@tantulink.demo');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Translations for Onboarding Screen
  const onboardingTranslations = {
    en: {
      welcome: "Welcome to TantuLink",
      tagline: "Connecting authentic rural weavers directly with global buyers with voice-guided transparency.",
      chooseLang: "Choose your comfortable language",
      selectRole: "Who are you?",
      weaverTitle: "I am a Handloom Weaver",
      weaverDesc: "I weave pure sarees, mundus, and traditional fabrics on manual looms.",
      buyerTitle: "I am an Appreciative Buyer",
      buyerDesc: "I want to purchase verified authentic handloom textiles directly from creators.",
      detailsTitle: "Set Up Your Digital Identity",
      detailsDesc: "This creates your verified TantuLink profile card used to secure payments and trace loom-origins.",
      weaverName: "Your Full Name",
      weaverRegion: "Loom Location (Village, State)",
      weaverExp: "Years of Weaving Experience",
      weaverCoop: "Co-operative Society (Optional)",
      buyerName: "Your Full Name",
      buyerAddress: "Default Shipping Address",
      buyerPhone: "Mobile Number for Delivery",
      letsBegin: "Create My Digital Account",
      next: "Continue",
      back: "Go Back",
      stepIndicator: "Step"
    },
    kn: {
      welcome: "ತಂತುಲಿಂಕ್ ಗೆ ಸುಸ್ವಾಗತ",
      tagline: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನದ ಮೂಲಕ ಗ್ರಾಮೀಣ ನೇಕಾರರನ್ನು ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಜೋಡಿಸುವುದು.",
      chooseLang: "ನಿಮ್ಮ ಆರಾಮದಾಯಕ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
      selectRole: "ನೀವು ಯಾರು?",
      weaverTitle: "ನಾನು ಕೈಮಗ್ಗ ನೇಕಾರ",
      weaverDesc: "ನಾನು ಹ್ಯಾಂಡ್ಲೂಮ್ ಮೂಲಕ ಶುದ್ಧ ಸೀರೆಗಳು, ಮುಂಡುಗಳು ಮತ್ತು ಇತರ ಸಾಂಪ್ರದಾಯಿಕ ಬಟ್ಟೆಗಳನ್ನು ನೇಯುತ್ತೇನೆ.",
      buyerTitle: "ನಾನು ಖರೀದಿದಾರ",
      buyerDesc: "ನಾನು ನೇರವಾಗಿ ನೇಕಾರರಿಂದ ಧೃಡೀಕೃತ ಕೈಮಗ್ಗ ಬಟ್ಟೆಗಳನ್ನು ಖರೀದಿಸಲು ಬಯಸುತ್ತೇನೆ.",
      detailsTitle: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಗುರುತನ್ನು ನಿರ್ಮಿಸಿ",
      detailsDesc: "ಇದು ನಿಮ್ಮ ಧೃಡೀಕೃತ ತಂತುಲಿಂಕ್ ಪ್ರೊಫೈಲ್ ಕಾರ್ಡ್ ಅನ್ನು ರಚಿಸುತ್ತದೆ, ಇದನ್ನು ಪಾವತಿಗಳನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.",
      weaverName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು",
      weaverRegion: "ನೇಯ್ಗೆ ಸ್ಥಳ (ಗ್ರಾಮ, ರಾಜ್ಯ)",
      weaverExp: "ನೇಯ್ಗೆ ಅನುಭವ (ವರ್ಷಗಳು)",
      weaverCoop: "ಸಹಕಾರ ಸಂಘದ ಹೆಸರು (ಐಚ್ಛಿಕ)",
      buyerName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು",
      buyerAddress: "ನಿಮ್ಮ ವಿಳಾಸ (ಡೆಲಿವರಿಗಾಗಿ)",
      buyerPhone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      letsBegin: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
      next: "ಮುಂದೆ",
      back: "ಹಿಂದೆ",
      stepIndicator: "ಹಂತ"
    },
    hi: {
      welcome: "तंतुलिंक में आपका स्वागत है",
      tagline: "ग्रामीण बुनकरों को सीधे खरीदारों से जोड़ने वाला वॉयस-गाइडेड डायरेक्ट मार्केटप्लेस।",
      chooseLang: "अपनी आरामदायक भाषा चुनें",
      selectRole: "आप कौन हैं?",
      weaverTitle: "मैं एक हथकरघा बुनकर हूँ",
      weaverDesc: "मैं पारंपरिक करघे पर शुद्ध साड़ियां, मुंडू और कपड़े बुनता हूँ।",
      buyerTitle: "मैं एक खरीदार हूँ",
      buyerDesc: "मैं सीधे बुनकरों से प्रामाणिक हस्तनिर्मित कपड़े खरीदना चाहता हूँ।",
      detailsTitle: "अपनी डिजिटल पहचान बनाएं",
      detailsDesc: "यह आपका सत्यापित तंतुलिंक प्रोफ़ाइल कार्ड बनाता है जो भुगतान सुरक्षा और ट्रेसबिलिटी सुनिश्चित करता है।",
      weaverName: "आपका पूरा नाम",
      weaverRegion: "करघा क्षेत्र (गांव, राज्य)",
      weaverExp: "बुनाई का अनुभव (वर्ष)",
      weaverCoop: "सहकारी समिति का नाम (वैकल्पिक)",
      buyerName: "आपका पूरा नाम",
      buyerAddress: "आपका पता (वितरण के लिए)",
      buyerPhone: "मोबाइल नंबर",
      letsBegin: "खाता बनाएँ",
      next: "आगे",
      back: "पीछे",
      stepIndicator: "चरण"
    }
  };

  const ot = onboardingTranslations[language] || onboardingTranslations.en;

  const handleNextStep = () => {
    playSyntheticChime('click');
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (role === 'admin') {
        if (adminPassword !== 'Admin@123') {
          setAdminError('Invalid password. Demo admin password is: Admin@123');
          return;
        }
        const adminProfile = {
          name: 'TantuLink Administrator',
          role: 'admin',
          email: adminEmail.trim() || 'admin@tantulink.demo',
          language,
          region: 'National Handloom Registry Center, New Delhi',
          experience: '15',
          cooperative: 'Office of the Development Commissioner for Handlooms, Govt. of India',
          shippingAddress: 'Udyog Bhawan, New Delhi - 110011',
          phone: '+91 11 2306 1234',
          weaverId: 'ADM-1001',
          buyerId: 'ADM-1001'
        };
        speakText('Welcome Administrator. Opening TantuLink Admin Dashboard.', language);
        onComplete(adminProfile);
        return;
      }

      const finalProfile = {
        name: name.trim() || (role === 'weaver' ? 'Annaiah Devanga' : 'Jagadish B.'),
        role,
        language,
        region: region.trim() || 'Gudikal, Bagalkot, Karnataka',
        experience,
        cooperative: cooperative.trim() || 'Gudikal Weaver Co-op Society',
        shippingAddress: shippingAddress.trim() || 'Indiranagar, Bengaluru, Karnataka - 560038',
        phone: phone.trim() || '+91 98765 43210',
        weaverId: 'WEV-' + Math.floor(1000 + Math.random() * 9000),
        buyerId: 'BYR-' + Math.floor(1000 + Math.random() * 9000)
      };

      // Sound welcome announcement using text to speech
      let welcomeSpeech = '';
      if (language === 'kn') {
        welcomeSpeech = `ಧನ್ಯವಾದಗಳು ${finalProfile.name}. ನಿಮ್ಮ ತಂತುಲಿಂಕ್ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಪತ್ರ ಸಿದ್ಧವಾಗಿದೆ.`;
      } else if (language === 'hi') {
        welcomeSpeech = `धन्यवाद ${finalProfile.name}। आपका तंतुलिंक डिजिटल पहचान पत्र तैयार है।`;
      } else {
        welcomeSpeech = `Thank you ${finalProfile.name}. Your verified TantuLink profile identity is now ready.`;
      }
      speakText(welcomeSpeech, language);

      onComplete(finalProfile);
    }
  };

  const handlePrevStep = () => {
    playSyntheticChime('click');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDF8F1] flex flex-col items-center justify-center p-3 sm:p-4 overflow-y-auto">
      
      {/* Container with responsive split-screen layout */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border-4 border-[#2D2926] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[600px] max-h-[95vh] md:max-h-[90vh] relative my-auto">
        
        {/* Desktop Decorative Sidebar */}
        <div className="hidden md:flex md:w-5/12 bg-[#2E4057] text-[#FDF8F1] p-8 flex-col justify-between relative overflow-hidden shrink-0 border-r border-[#2D2926]">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%), radial-gradient(circle, #fff 10%, transparent 11%)`,
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px'
          }}></div>
          
          <div className="space-y-4 relative z-10">
            <span className="bg-[#E9B44C] text-[#2D2926] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Direct Link
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#E9B44C] leading-tight">TantuLink Network</h3>
            <p className="text-xs text-[#FDF8F1]/80 leading-relaxed font-medium">
              Empowering local master weavers across India with voice-driven cataloging and secure direct payments. Zero middleman fees.
            </p>
          </div>

          <div className="space-y-4 relative z-10 border-t border-[#FDF8F1]/10 pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-emerald-400">✓</span>
              <span>Voice-to-Text Multi-lingual Catalog</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-emerald-400">✓</span>
              <span>Weaver Pre-Dispatch Quality Check</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-emerald-400">✓</span>
              <span>100% Protected Escrow Trust</span>
            </div>
          </div>
          
          <p className="text-[10px] text-[#FDF8F1]/50 font-mono tracking-widest">v1.0 CO-OP ALLIANCE</p>
        </div>

        {/* Right Form side */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Progress header bar */}
          <div className="bg-[#2D2926] px-6 py-3 flex justify-between items-center text-white text-[10px] uppercase font-mono tracking-wider shrink-0">
            <div className="flex items-center gap-2">
              <span>{ot.stepIndicator} {step} of 3</span>
              <div className="flex gap-1.5 ml-2">
                <div className={`w-5 h-1 rounded-full transition ${step >= 1 ? 'bg-[#C25E44]' : 'bg-gray-600'}`}></div>
                <div className={`w-5 h-1 rounded-full transition ${step >= 2 ? 'bg-[#C25E44]' : 'bg-gray-600'}`}></div>
                <div className={`w-5 h-1 rounded-full transition ${step >= 3 ? 'bg-[#C25E44]' : 'bg-gray-600'}`}></div>
              </div>
            </div>

            {/* Quick Sign In / Admin Login Trigger */}
            <button
              id="onboarding-open-login-btn"
              onClick={() => {
                playSyntheticChime('click');
                setShowLoginModal(true);
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-amber-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border border-white/15"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>Sign In / Admin</span>
            </button>
          </div>

          {/* Form Body scrollable area */}
          <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto flex flex-col justify-between">
            
            {/* STEP 1: Language Selection */}
            {step === 1 && (
              <div className="space-y-6 my-auto">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-[#C25E44] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
                    T
                  </div>
                  <h1 className="font-serif text-3xl font-black text-[#C25E44] tracking-tight">{ot.welcome}</h1>
                  <p className="text-sm text-[#5A524A] font-medium px-4 leading-relaxed">
                    {ot.tagline}
                  </p>
                </div>

                <div className="space-y-3.5 pt-4">
                  <label className="text-xs font-bold text-[#2E4057] uppercase tracking-wider block text-center">
                    {ot.chooseLang}
                  </label>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { code: 'en', label: 'English (Standard)', sub: 'Voice & text instruction' },
                      { code: 'kn', label: 'ಕನ್ನಡ (ಮೂಲ)', sub: 'ಧ್ವನಿ ಮತ್ತು ನೇರ ಕನ್ನಡ ಬಳಕೆ' },
                      { code: 'hi', label: 'हिन्दी (सरल)', sub: 'आवाज़ और सरल हिंदी मार्गदर्शन' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          playSyntheticChime('click');
                          setLanguage(item.code as Language);
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition duration-200 flex justify-between items-center ${
                          language === item.code 
                            ? 'border-[#C25E44] bg-[#FDF8F1] shadow-sm' 
                            : 'border-[#E5E1DA] hover:border-[#8C8379] bg-white'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-[#2D2926]">{item.label}</p>
                          <p className="text-[10px] text-[#8C8379] mt-0.5">{item.sub}</p>
                        </div>
                        {language === item.code && (
                          <div className="w-5 h-5 rounded-full bg-[#C25E44] flex items-center justify-center text-white">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Role Selection */}
            {step === 2 && (
              <div className="space-y-5 my-auto">
                <div className="text-center space-y-1.5">
                  <span className="text-[10px] text-[#C25E44] font-extrabold uppercase tracking-widest">Digital Entry</span>
                  <h2 className="font-serif text-2xl font-bold text-[#2D2926]">{ot.selectRole}</h2>
                </div>

                <div className="space-y-3">
                  {/* Weaver Card */}
                  <button
                    onClick={() => {
                      playSyntheticChime('click');
                      setRole('weaver');
                    }}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition duration-200 flex gap-4 items-start ${
                      role === 'weaver' 
                        ? 'border-[#2E4057] bg-[#FDF8F1] shadow-md' 
                        : 'border-[#E5E1DA] hover:border-[#8C8379] bg-white'
                    }`}
                  >
                    <div className="p-3 bg-[#2E4057] text-white rounded-xl shrink-0">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h3 className="font-bold text-sm text-[#2D2926] flex items-center gap-1.5">
                        {ot.weaverTitle}
                      </h3>
                      <p className="text-[#5A524A] leading-relaxed font-medium">
                        {ot.weaverDesc}
                      </p>
                    </div>
                  </button>

                  {/* Buyer Card */}
                  <button
                    onClick={() => {
                      playSyntheticChime('click');
                      setRole('buyer');
                    }}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition duration-200 flex gap-4 items-start ${
                      role === 'buyer' 
                        ? 'border-[#C25E44] bg-[#FDF8F1] shadow-md' 
                        : 'border-[#E5E1DA] hover:border-[#8C8379] bg-white'
                    }`}
                  >
                    <div className="p-3 bg-[#C25E44] text-white rounded-xl shrink-0">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h3 className="font-bold text-sm text-[#2D2926] flex items-center gap-1.5">
                        {ot.buyerTitle}
                      </h3>
                      <p className="text-[#5A524A] leading-relaxed font-medium">
                        {ot.buyerDesc}
                      </p>
                    </div>
                  </button>

                  {/* ADMIN ACCESS option section below the Weaver and Buyer roles */}
                  <div className="pt-3 mt-1 border-t border-[#E5E1DA] space-y-1.5 text-center" id="admin-verifier-portal-section">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C8379] block">
                      ADMIN ACCESS
                    </span>
                    <button
                      type="button"
                      id="onboarding-admin-verifier-login-btn"
                      onClick={() => {
                        playSyntheticChime('click');
                        setShowLoginModal(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl border border-[#E5E1DA] hover:border-[#2D2926] bg-[#FDF8F1] hover:bg-[#F4EDE4] transition duration-200 flex items-center justify-center gap-2 text-xs font-bold text-[#2D2926] shadow-2xs cursor-pointer min-h-[44px]"
                    >
                      <span>🔐 Admin / Verifier Login →</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#2E4057]/5 border border-[#2E4057]/10 p-3.5 rounded-xl text-[11px] text-[#2E4057] font-medium leading-relaxed flex gap-2">
                  <Info className="w-4 h-4 text-[#C25E44] shrink-0 mt-0.5" />
                  <span>
                    {language === 'kn' 
                      ? 'ಚಿಂತಿಸಬೇಡಿ, ನೀವು ಅಪ್ಲಿಕೇಶನ್‌ನ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ವೀವರ್ ಮತ್ತು ಬೈಯರ್ ನಡುವೆ ಬದಲಾಯಿಸಬಹುದು.' 
                      : language === 'hi' 
                      ? 'चिंता न करें, आप ऐप के शीर्ष पर किसी भी समय बुनकर और खरीदार के बीच स्विच कर सकते हैं।' 
                      : 'Do not worry, you can easily switch between Weaver and Buyer modes at any time in the app header.'}
                  </span>
                </div>
              </div>
            )}

            {/* STEP 3: Form Inputs */}
            {step === 3 && (
              <div className="space-y-5 my-auto">
                <div className="text-center space-y-1">
                  <h2 className="font-serif text-xl font-bold text-[#2D2926]">{ot.detailsTitle}</h2>
                  <p className="text-[11px] text-[#8C8379] font-medium leading-relaxed px-2">
                    {ot.detailsDesc}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E1DA] p-4 space-y-3.5 text-xs">
                  {role === 'weaver' ? (
                    <>
                      {/* Weaver fields */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">{ot.weaverName}</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Annaiah Devanga"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">{ot.weaverRegion}</label>
                        <input
                          type="text"
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          placeholder="e.g. Gudikal, Bagalkot, Karnataka"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-[#5A524A] block">{ot.weaverExp}</label>
                          <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44] text-xs font-semibold"
                          >
                            <option value="5">5+ Years</option>
                            <option value="10">10+ Years</option>
                            <option value="20">20+ Years</option>
                            <option value="30">30+ Master Weaver</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-[#5A524A] block">Loom Type</label>
                          <select
                            className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44] text-xs font-semibold"
                          >
                            <option>Traditional Pit Loom</option>
                            <option>Frame Handloom</option>
                            <option>Pedal Jacquard Loom</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">{ot.weaverCoop}</label>
                        <input
                          type="text"
                          value={cooperative}
                          onChange={(e) => setCooperative(e.target.value)}
                          placeholder="e.g. Gudikal Weaver Co-op Society"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44]"
                        />
                      </div>
                    </>
                  ) : role === 'admin' ? (
                    <>
                      {/* Admin fields */}
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-xs">
                        <div className="font-bold flex items-center gap-1.5 text-amber-950">
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Administrative & GI Registry Credentials</span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-1">
                          Log in with pre-authorized government verifier credentials or proceed with default demo credentials.
                        </p>
                      </div>

                      {adminError && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs font-semibold">
                          {adminError}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">Admin Email Address</label>
                        <input
                          id="onboarding-admin-email-input"
                          type="email"
                          value={adminEmail}
                          onChange={(e) => {
                            setAdminEmail(e.target.value);
                            setAdminError(null);
                          }}
                          placeholder="admin@tantulink.demo"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-charcoal font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">Admin Password</label>
                        <input
                          id="onboarding-admin-password-input"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => {
                            setAdminPassword(e.target.value);
                            setAdminError(null);
                          }}
                          placeholder="Admin@123"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-charcoal font-mono text-xs"
                        />
                        <p className="text-[10px] text-gray-500 font-mono">Demo Password: Admin@123</p>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">Registry Department</label>
                        <input
                          type="text"
                          disabled
                          value="National GI Registry & Cooperative Verification Cell"
                          className="w-full bg-cream-dark/60 p-3 rounded-xl border border-[#E5E1DA] text-[#5A524A] text-xs font-medium cursor-not-allowed"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Buyer fields */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">{ot.buyerName}</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Jagadish B."
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">{ot.buyerAddress}</label>
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="e.g. Indiranagar, Bengaluru, Karnataka - 560038"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44] h-20 resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#5A524A] block">{ot.buyerPhone}</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-[#FDF8F1] p-3 rounded-xl border border-[#E5E1DA] focus:outline-none focus:border-[#C25E44]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#F4EDE4] mt-auto">
              {step > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="flex-1 border border-[#E5E1DA] hover:bg-[#FDF8F1] text-[#8C8379] font-bold py-3.5 px-4 rounded-2xl text-xs transition"
                >
                  {ot.back}
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="flex-[2] bg-[#C25E44] hover:bg-[#A3432C] text-white font-bold py-3.5 px-4 rounded-2xl text-xs shadow-lg shadow-[#C25E44]/20 flex items-center justify-center gap-1.5 transition transform active:scale-95"
              >
                <span>{step === 3 ? (role === 'admin' ? 'Open Admin Dashboard' : ot.letsBegin) : ot.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Login / Auth Modal overlay */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        language={language}
        onLoginSuccess={(profile) => {
          setShowLoginModal(false);
          onComplete(profile);
        }}
      />
    </div>
  );
};
