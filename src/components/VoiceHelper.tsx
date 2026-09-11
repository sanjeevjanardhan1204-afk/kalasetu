import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Square, Sparkles, Languages, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { playSyntheticChime } from '../data';

interface VoiceHelperProps {
  language: Language;
  onTranscriptReceived?: (transcript: string) => void;
  isListening?: boolean;
  setIsListening?: (listening: boolean) => void;
}

// Global speech player and voice helper state
let currentAudio: HTMLAudioElement | null = null;

function getBestVoice(shortLang: string): { voice: SpeechSynthesisVoice | null, lang: string } {
  if (typeof window === 'undefined' || !window.speechSynthesis) return { voice: null, lang: 'en-US' };
  
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return { voice: null, lang: shortLang === 'kn' ? 'kn-IN' : shortLang === 'hi' ? 'hi-IN' : 'en-IN' };
  }

  // 1. Try to find an exact language match (case-insensitive) for India locale
  let match = voices.find(v => v.lang.toLowerCase() === `${shortLang}-in`);
  if (match) return { voice: match, lang: match.lang };

  // 2. Try to find any voice starting with the short language prefix
  match = voices.find(v => v.lang.toLowerCase().startsWith(shortLang));
  if (match) return { voice: match, lang: match.lang };

  // 3. Try to find any voice containing the short language prefix
  match = voices.find(v => v.lang.toLowerCase().includes(shortLang));
  if (match) return { voice: match, lang: match.lang };

  // 4. Fall back to standard English if available
  const englishVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
  if (englishVoice) return { voice: englishVoice, lang: englishVoice.lang };

  // 5. Fall back to the default voice of the system
  const defaultVoice = voices.find(v => v.default) || voices[0];
  if (defaultVoice) return { voice: defaultVoice, lang: defaultVoice.lang };

  return { voice: null, lang: 'en-US' };
}

export function speakText(text: string, lang: Language, onStart?: () => void, onEnd?: () => void) {
  // Cancel any ongoing audio first
  stopSpeaking();

  // Play a guaranteed lightweight Web Audio API indicator to activate audio context
  playSyntheticChime('speech');

  // Determine standard locale code and short language prefix for Google Translate
  let shortLang = 'en';
  if (lang === 'kn') {
    shortLang = 'kn';
  }
  if (lang === 'hi') {
    shortLang = 'hi';
  }

  // Define clean fallback to standard Web Speech API (runs 100% on-device and offline!)
  let hasFallenBack = false;
  const fallbackToWebSpeech = () => {
    if (hasFallenBack) return;
    hasFallenBack = true;

    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 2000);
      return;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select best available voice, preventing Chrome from falling completely silent
      const voiceInfo = getBestVoice(shortLang);
      if (voiceInfo.voice) {
        utterance.voice = voiceInfo.voice;
      }
      utterance.lang = voiceInfo.lang;
      
      utterance.volume = 1.0;
      utterance.rate = 0.85; // Slower, legible cadence for rural users
      utterance.pitch = 1.0;
      
      if (onStart) utterance.onstart = onStart;
      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      // Chromium fix: Wait 120ms to allow asynchronous queue-cancellation to complete
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (innerErr) {
          console.error("Delayed speak failed:", innerErr);
          if (onEnd) onEnd();
        }
      }, 120);

    } catch (err) {
      console.error("Robust speak trigger failed:", err);
      if (onStart) onStart();
      if (onEnd) onEnd();
    }
  };

  // If offline or dataSaver mode, immediately use on-device local Web Speech API (0 kbps data)
  const isCurrentlyOffline = (typeof navigator !== 'undefined' && !navigator.onLine) || 
    (typeof localStorage !== 'undefined' && (localStorage.getItem('taana_offline_mode') === 'true' || localStorage.getItem('taana_network_mode') === 'offline'));

  if (isCurrentlyOffline) {
    fallbackToWebSpeech();
    return;
  }

  // Try high-quality Google Translate TTS first for beautiful Hindi, Kannada, and English pronunciation
  try {
    const cleanText = text.trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const ttsUrl = `/api/tts?lang=${shortLang}&text=${encodeURIComponent(cleanText)}`;
    const audio = new Audio(ttsUrl);
    currentAudio = audio;
    audio.volume = 1.0;

    if (onStart) {
      audio.onplay = () => onStart();
    }
    
    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      if (onEnd) onEnd();
    };

    audio.onerror = (err) => {
      console.warn("Google Translate TTS failed or offline. Seamlessly falling back to on-device Web Speech API...", err);
      if (currentAudio === audio) {
        currentAudio = null;
      }
      fallbackToWebSpeech();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((playErr) => {
        console.warn("Audio play promise rejected. Falling back to on-device Web Speech API...", playErr);
        fallbackToWebSpeech();
      });
    }
  } catch (e) {
    console.warn("Google Translate TTS constructor failed. Falling back to on-device Web Speech API...", e);
    fallbackToWebSpeech();
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio = null;
    } catch (e) {
      console.warn("Failed to pause fallback audio:", e);
    }
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  triggerSubtitleStop();
}

export const VoiceHelper: React.FC<VoiceHelperProps> = ({
  language,
  onTranscriptReceived,
  isListening = false,
  setIsListening
}) => {
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  
  // Advanced robustness states
  const [micPermissionStatus, setMicPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [recognitionError, setRecognitionError] = useState<'permission-blocked' | 'no-speech' | 'network' | 'no-match' | string | null>(null);
  
  // Offline Voice Engine State (0 kbps local acoustics & on-device speech processing)
  const [isOfflineVoiceActive, setIsOfflineVoiceActive] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('taana_offline_mode') === 'true' || localStorage.getItem('taana_network_mode') === 'offline';
    }
    return false;
  });

  // Track offline status dynamically
  useEffect(() => {
    const handleNetworkChange = () => {
      const isOff = (typeof navigator !== 'undefined' && !navigator.onLine) ||
        (typeof localStorage !== 'undefined' && (localStorage.getItem('taana_offline_mode') === 'true' || localStorage.getItem('taana_network_mode') === 'offline'));
      setIsOfflineVoiceActive(isOff);
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    window.addEventListener('taana_network_mode_changed', handleNetworkChange);
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      window.removeEventListener('taana_network_mode_changed', handleNetworkChange);
    };
  }, []);
  
  // Live diagnostic permission logging states
  const [permissionLogs, setPermissionLogs] = useState<string[]>([]);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  const subtitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const retryCountRef = useRef<number>(0);
  const consecutiveErrorsRef = useRef<number>(0);
  const hasDispatchedTranscriptRef = useRef<boolean>(false);
  const isMobileRef = useRef<boolean>(typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));

  // Sync state values to Refs to prevent stale closures and infinite re-triggering of useEffect
  const isListeningRef = useRef(isListening);
  const languageRef = useRef(language);
  const onTranscriptReceivedRef = useRef(onTranscriptReceived);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setPermissionLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
    console.log(`[VoiceHelper Diagnostic] ${msg}`);
  };

  const [useSimulatorFallback, setUseSimulatorFallback] = useState<boolean>(false);
  const [isManuallyEditing, setIsManuallyEditing] = useState<boolean>(false);
  
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const [micVolume, setMicVolume] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulatorSessionRef = useRef<boolean>(false);

  const detectContextAndTranslate = (lang: Language): string => {
    // Check if we are in Weaver Mode Q&A
    const qaStepContainer = document.getElementById('qa-step-container');
    if (qaStepContainer) {
      const questionText = qaStepContainer.querySelector('h4')?.textContent || '';
      
      const isTitle = questionText.includes('What have you made') || 
                      questionText.includes('ನೀವು ಏನು ತಯಾರಿಸಿದ್ದೀರಿ') || 
                      questionText.includes('आपने क्या बनाया है') ||
                      questionText.includes('Question 1') ||
                      questionText.includes('1');
                      
      const isMaterial = questionText.includes('material') || 
                         questionText.includes('ಬಟ್ಟೆ') || 
                         questionText.includes('सामग्री') ||
                         questionText.includes('Question 2') ||
                         questionText.includes('2');
                         
      const isDimensions = questionText.includes('length') || 
                           questionText.includes('ಉದ್ದ') || 
                           questionText.includes('लंबाई') ||
                           questionText.includes('Question 3') ||
                           questionText.includes('3');
                           
      const isSpecial = questionText.includes('special') || 
                        questionText.includes('ವಿಶೇಷತೆ') || 
                        questionText.includes('विशेष') ||
                        questionText.includes('Question 4') ||
                        questionText.includes('4');
                        
      const isPrice = questionText.includes('price') || 
                      questionText.includes('ಬೆಲೆ') || 
                      questionText.includes('कीमत') ||
                      questionText.includes('Question 5') ||
                      questionText.includes('5');

      if (isTitle) {
        if (lang === 'kn') return "ಇದು ಸುಂದರವಾದ ಇಳಕಲ್ ಸಾಂಪ್ರದಾಯಿಕ ರೇಷ್ಮೆ ಸೀರೆ";
        if (lang === 'hi') return "यह एक सुंदर पारंपरिक इल्कल रेशमी साड़ी है";
        return "This is a beautiful traditional Ilkal silk saree with pure Kasuti embroidery";
      }
      if (isMaterial) {
        if (lang === 'kn') return "ಇದನ್ನು ಶುದ್ಧ ಮಲ್ಬರಿ ರೇಷ್ಮೆ ಮತ್ತು ಜರಿ ದಾರಗಳಿಂದ ನೇಯಲಾಗಿದೆ";
        if (lang === 'hi') return "यह शुद्ध शहतूत रेशम और सोने की सुंदर जरी से बना है";
        return "It is made of pure high-grade mulberry silk yarn with fine gold zari borders";
      }
      if (isDimensions) {
        if (lang === 'kn') return "ಇದರ ಉದ್ದ ಐದುವರೆ ಮೀಟರ್ ಮತ್ತು ಅಗಲ ಒಂದುವರೆ ಮೀಟರ್";
        if (lang === 'hi') return "इसकी लंबाई साढ़े पांच मीटर और चौड़ाई सवा मीटर है";
        return "The length is five point five meters and width is one point one meters";
      }
      if (isSpecial) {
        if (lang === 'kn') return "ನಮ್ಮ ಗ್ರಾಮದ ಮಹಿಳೆಯರು ಇದರ ಸೆರಗಿನಲ್ಲಿ ಕೈಯಿಂದ ಕಸೂತಿ ಕಲೆ ಮಾಡಿದ್ದಾರೆ";
        if (lang === 'hi') return "इसके पल्लू पर हमारे गांव की महिलाओं द्वारा सुंदर हाथ की कढ़ाई की गई है";
        return "Woven with double-ikat geometric precision using organic vegetable indigo dyes";
      }
      if (isPrice) {
        return "4500";
      }
    }

    // Check if we are in Buyer Mode search
    const buyerSearchContainer = document.getElementById('buyer-view-container');
    if (buyerSearchContainer) {
      const searchQueries = {
        en: [
          "I want a green silk saree under ₹5,000 for a wedding",
          "Show me traditional cotton mundu from Kerala under ₹2,000",
          "Banarasi pure silk saree with gold zari under ₹12,000"
        ],
        kn: [
          "ಮದುವೆಗಾಗಿ ₹೫೦೦೦ ಒಳಗಿನ ಹಸಿರು ರೇಷ್ಮೆ ಸೀರೆ ತೋರಿಸಿ",
          "₹೨೦೦೦ ಒಳಗಿನ ಸಾಂಪ್ರದಾಯಿಕ ಕೇರಳ ಹತ್ತಿ ಮುಂಡು ಬೇಕು",
          "ಚಿನ್ನದ ಜರಿ ಹೊಂದಿರುವ ಬನಾರಸಿ ರೇಷ್ಮೆ ಸೀರೆ ತೋರಿಸಿ"
        ],
        hi: [
          "मुझे शादी के लिए ₹5000 के अंदर हरी रेशमी साड़ी दिखाएं",
          "केरल की पारंपरिक सूती धोती ₹2000 के अंदर दिखाइए",
          "सोने की जरी वाली बनारसी रेशमी साड़ी दिखाइए"
        ]
      };
      const queries = searchQueries[lang] || searchQueries.en;
      return queries[Math.floor(Math.random() * queries.length)];
    }

    if (lang === 'kn') return "ಕೈಮಗ್ಗ ಉತ್ಪನ್ನ";
    if (lang === 'hi') return "हथकरघा उत्पाद";
    return "Fine village handloom craft product";
  };

  const getSuggestionsForCurrentContext = (): string[] => {
    const qaStepContainer = document.getElementById('qa-step-container');
    if (qaStepContainer) {
      const questionText = qaStepContainer.querySelector('h4')?.textContent || '';
      
      const isTitle = questionText.includes('What have you made') || 
                      questionText.includes('ನೀವು ಏನು ತಯಾರಿಸಿದ್ದೀರಿ') || 
                      questionText.includes('आपने क्या बनाया है') ||
                      questionText.includes('Question 1') ||
                      questionText.includes('1');
                      
      const isMaterial = questionText.includes('material') || 
                         questionText.includes('ಬಟ್ಟೆ') || 
                         questionText.includes('सामग्री') ||
                         questionText.includes('Question 2') ||
                         questionText.includes('2');
                          
      const isDimensions = questionText.includes('length') || 
                            questionText.includes('ಉದ್ದ') || 
                            questionText.includes('लंबाई') ||
                            questionText.includes('Question 3') ||
                            questionText.includes('3');
                            
      const isSpecial = questionText.includes('special') || 
                        questionText.includes('ವಿಶೇಷತೆ') || 
                        questionText.includes('विशेष') ||
                        questionText.includes('Question 4') ||
                        questionText.includes('4');
                        
      const isPrice = questionText.includes('price') || 
                      questionText.includes('ಬೆಲೆ') || 
                      questionText.includes('कीमत') ||
                      questionText.includes('Question 5') ||
                      questionText.includes('5');

      if (isTitle) {
        if (language === 'kn') return [
          "ಇದು ಸುಂದರವಾದ ಇಳಕಲ್ ಸಾಂಪ್ರದಾಯಿಕ ರೇಷ್ಮೆ ಸೀರೆ",
          "ಶುದ್ಧ ಕೈಮಗ್ಗ ಹತ್ತಿ ಸೀರೆ ಉಡುಪು",
          "ಸಾಂಪ್ರದಾಯಿಕ ಕಸೂತಿ ರೇಷ್ಮೆ ಸೀರೆ"
        ];
        if (language === 'hi') return [
          "यह एक सुंदर पारंपरिक इल्कल रेशमी साड़ी है",
          "शुद्ध हथकरघा सूती साड़ी परिधान",
          "पारंपरिक कढ़ाई रेशमी साड़ी"
        ];
        return [
          "Beautiful traditional Ilkal silk saree with pure Kasuti embroidery",
          "Pure handloom fine cotton daily wear saree",
          "Premium hand-woven wedding Banarasi silk saree"
        ];
      }
      if (isMaterial) {
        if (language === 'kn') return [
          "ಇದನ್ನು ಶುದ್ಧ ಮಲ್ಬರಿ ರೇಷ್ಮೆ ಮತ್ತು ಜರಿ ದಾರಗಳಿಂದ ನೇಯಲಾಗಿದೆ",
          "೧೦೦% ನೈಸರ್ಗಿಕ ಶುದ್ಧ ಸಾವಯವ ಹತ್ತಿ ಬಟ್ಟೆ",
          "ಶುದ್ಧ ಉಣ್ಣೆ ಮತ್ತು ತಾಸರ್ ಸಿಲ್ಕ್ ಮಿಶ್ರಣ"
        ];
        if (language === 'hi') return [
          "यह शुद्ध शहतूत रेशम और सोने की सुंदर जरी से बना है",
          "100% प्राकृतिक शुद्ध जैविक सूती धागा",
          "शुद्ध ऊन और टसर रेशम मिश्रण"
        ];
        return [
          "Made of pure high-grade mulberry silk yarn with fine gold zari borders",
          "Woven with 100% natural organic cotton and eco-friendly dyes",
          "Crafted from premium quality linen and wild tussar silk"
        ];
      }
      if (isDimensions) {
        if (language === 'kn') return [
          "ಇದರ ಉದ್ದ ಐದುವರೆ ಮೀಟರ್ ಮತ್ತು ಅಗಲ ಒಂದುವರೆ ಮೀಟರ್",
          "ಉದ್ದ ೬.೨ ಮೀಟರ್ ಬ್ಲೌಸ್ ಪೀಸ್ ಸೇರಿ",
          "ಉದ್ದ ೪ ಮೀಟರ್ ಧೋತಿ ಮತ್ತು ಅಂಚಿನ ಕೆಲಸ"
        ];
        if (language === 'hi') return [
          "इसकी लंबाई साढ़े पांच मीटर और चौड़ाई सवा मीटर है",
          "लंबाई 6.2 मीटर ब्लाउज पीस के साथ",
          "लंबाई 4 मीटर पारंपरिक धोती"
        ];
        return [
          "The length is 5.5 meters and width is 1.1 meters",
          "Standard length 6.2 meters including running blouse piece",
          "Traditional double mundu with length of 4 meters"
        ];
      }
      if (isSpecial) {
        if (language === 'kn') return [
          "ನಮ್ಮ ಗ್ರಾಮದ ಮಹಿಳೆಯರು ಇದರ ಸೆರಗಿನಲ್ಲಿ ಕೈಯಿಂದ ಕಸೂತಿ ಕಲೆ ಮಾಡಿದ್ದಾರೆ",
          "ಗಿಡಮೂಲಿಕೆ ಬಣ್ಣಗಳನ್ನು ಬಳಸಿ ಜ್ಯಾಮಿತೀಯ ನಕ್ಷೆ ನೇಯಲಾಗಿದೆ",
          "ಮೂರನೇ ತಲೆಮಾರಿನ ನುರಿತ ನೇಯ್ಗೆ ಕರಕುಶಲ ಕಲೆ"
        ];
        if (language === 'hi') return [
          "इसके पल्लू पर हमारे गांव की महिलाओं द्वारा सुंदर हाथ की कढ़ाई की गई है",
          "प्राकृतिक वानस्पतिक रंगों और जटिल ज्यामितीय बुनाई का काम",
          "पीढ़ियों से संजोई हुई पारंपरिक हथकरघा विरासत"
        ];
        return [
          "Woven with double-ikat geometric precision using organic vegetable indigo dyes",
          "Features authentic hand-done Kasuti embroidery on the pallu by rural women",
          "Woven using historical pitloom techniques passed down for generations"
        ];
      }
      if (isPrice) {
        if (language === 'kn') return ["೪೫೦೦", "೨೮೦೦", "೧೨೦೦೦"];
        if (language === 'hi') return ["4500", "2800", "12000"];
        return ["4500", "2800", "12000"];
      }
    }

    const buyerSearchContainer = document.getElementById('buyer-view-container');
    if (buyerSearchContainer) {
      if (language === 'kn') return [
        "ಮದುವೆಗಾಗಿ ₹೫೦೦೦ ಒಳಗಿನ ಹಸಿರು ರೇಷ್ಮೆ ಸೀರೆ ತೋರಿಸಿ",
        "₹೨೦೦೦ ಒಳಗಿನ ಸಾಂಪ್ರದಾಯಿಕ ಕೇರಳ ಹತ್ತಿ ಮುಂಡು ಬೇಕು",
        "ಚಿನ್ನದ ಜರಿ ಹೊಂದಿರುವ ಬನಾರಸಿ ರೇಷ್ಮೆ ಸೀರೆ ತೋರಿಸಿ"
      ];
      if (language === 'hi') return [
        "मुझे शादी के लिए ₹5000 के अंदर हरी रेशमी साड़ी दिखाएं",
        "केरल की पारंपरिक सूती धोती ₹2000 के अंदर दिखाइए",
        "सोने की जरी वाली बनारसी रेशमी साड़ी दिखाइए"
      ];
      return [
        "I want a green silk saree under ₹5,000 for a wedding",
        "Show me traditional cotton mundu from Kerala under ₹2,000",
        "Banarasi pure silk saree with gold zari under ₹12,000"
      ];
    }

    if (language === 'kn') return ["ನೈಸರ್ಗಿಕ ಸಾವಯವ ಹತ್ತಿ ವಸ್ತ್ರ", "ಕೈಮಗ್ಗ ಕುರ್ತಾ ಉತ್ಪನ್ನ"];
    if (language === 'hi') return ["प्राकृतिक जैविक सूती वस्त्र", "हथकरघा कुर्ता उत्पाद"];
    return ["Fine village handloom craft product", "Authentic hand-woven traditional apparel"];
  };

  const startMicVolumeTracker = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addLog("MediaDevices or getUserMedia not available for simulator visualizer.");
      return;
    }
    try {
      addLog("Requesting audio stream via getUserMedia...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      addLog("SUCCESS: getUserMedia connection acquired successfully!");
      setMicPermissionStatus('granted');
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateVolume = () => {
          if (!audioStreamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setMicVolume(average);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      }
    } catch (e: any) {
      addLog(`ERROR: getUserMedia failed: ${e.name || 'PermissionDenied'}`);
      console.warn("Could not start real mic tracker for simulator visualizer:", e);
      setMicPermissionStatus('denied');
    }
  };

  const stopMicVolumeTracker = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      addLog("Releasing audio tracks...");
      audioStreamRef.current.getTracks().forEach(track => {
        track.stop();
        addLog(`Released track: ${track.label}`);
      });
      audioStreamRef.current = null;
    }
    setMicVolume(0);
  };

  const getWaveHeight = (index: number) => {
    if (isListening && micVolume > 2) {
      const dispersion = Math.sin(index * 1.1) * 8;
      const calculatedHeight = Math.max(6, Math.min(38, (micVolume * 0.35) + dispersion));
      return `${calculatedHeight}px`;
    }
    return undefined;
  };

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    onTranscriptReceivedRef.current = onTranscriptReceived;
  }, [onTranscriptReceived]);

  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interimTranscriptRef = useRef(interimTranscript);

  // Sync ref for interimTranscript & auto-reset 5s pause timer on any text changes
  useEffect(() => {
    interimTranscriptRef.current = interimTranscript;
    
    if (isListening && interimTranscript.trim() && !isManuallyEditing) {
      resetPauseTimer();
    }
  }, [interimTranscript, isListening, isManuallyEditing]);

  // Clean up silence timer and reset editing state when listening state changes
  useEffect(() => {
    if (!isListening) {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
    } else {
      setIsManuallyEditing(false);
    }
  }, [isListening]);

  const deliverTranscript = (text: string) => {
    const clean = (text || '').trim();
    if (!clean) return;
    if (hasDispatchedTranscriptRef.current) return;
    hasDispatchedTranscriptRef.current = true;

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    addLog(`[VoiceHelper] Delivering single final transcript: "${clean}"`);
    if (onTranscriptReceivedRef.current) {
      onTranscriptReceivedRef.current(clean);
    }
    
    if (setIsListening) setIsListening(false);
    setInterimTranscript('');
    stopMicVolumeTracker();
    playSyntheticChime('success');
  };

  const handleFinalizeAndSubmit = () => {
    const textToSubmit = interimTranscriptRef.current || interimTranscript;
    addLog(`Auto-finalizing spoken transcript: "${textToSubmit}"`);
    deliverTranscript(textToSubmit);
  };

  const resetPauseTimer = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    if (isListeningRef.current) {
      // Auto-submit after 1.4s of silence once words have been captured
      pauseTimerRef.current = setTimeout(() => {
        if (interimTranscriptRef.current.trim() && !hasDispatchedTranscriptRef.current) {
          addLog("Silence detected: Auto-submitting captured speech...");
          deliverTranscript(interimTranscriptRef.current);
        }
      }, 1400);
    }
  };

  const handleSubmitManual = () => {
    const textToSubmit = interimTranscriptRef.current || interimTranscript;
    addLog(`User clicked Manual Submit: "${textToSubmit}"`);
    deliverTranscript(textToSubmit);
  };

  // Query / Detect browser support and initial mic permission
  useEffect(() => {
    addLog("VoiceHelper mounted. Performing startup checks...");

    const SpeechRecognitionClass = (window as any).SpeechRecognition || 
                                   (window as any).webkitSpeechRecognition || 
                                   (window as any).mozSpeechRecognition || 
                                   (window as any).msSpeechRecognition;
    
    if (SpeechRecognitionClass) {
      const apiType = (window as any).SpeechRecognition ? "Standard SpeechRecognition" : "webkitSpeechRecognition fallback";
      addLog(`SUCCESS: Browser speech recognition engine detected (${apiType}).`);
      setBrowserSupportsSpeech(true);
    } else {
      addLog("WARNING: Speech recognition APIs are NOT supported in this browser. Please use Chrome, Safari, or Edge.");
      setBrowserSupportsSpeech(false);
    }

    addLog(`User Agent: ${navigator.userAgent}`);

    // Detect secure context since browsers block getUserMedia/SpeechRecognition on non-HTTPS
    const isSecure = window.isSecureContext;
    addLog(`Secure context verified: ${isSecure ? "YES (HTTPS)" : "NO (HTTP) - Note: Browsers block microphone requests over insecure HTTP!"}`);

    // Attempt to query existing permission status if supported
    if (navigator.permissions && navigator.permissions.query) {
      addLog("Querying navigator.permissions.query for 'microphone'...");
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          addLog(`Microphone permission state: ${permissionStatus.state.toUpperCase()}`);
          setMicPermissionStatus(permissionStatus.state as any);
          permissionStatus.onchange = () => {
            addLog(`LIVE: Microphone permission changed to: ${permissionStatus.state.toUpperCase()}`);
            setMicPermissionStatus(permissionStatus.state as any);
          };
        })
        .catch((err) => {
          addLog(`Permissions API returned error: ${err.message || err}`);
          setMicPermissionStatus('unknown');
        });
    } else {
      addLog("Permissions API query is not supported in this browser. Will fall back to getUserMedia checks.");
      setMicPermissionStatus('unknown');
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      addLog("MediaDevices API is available.");
    } else {
      addLog("WARNING: navigator.mediaDevices.getUserMedia is not available on this device/connection.");
    }

    // Set up custom events so other files can trigger global subtitle display
    const handleSpeakStart = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSubtitle(customEvent.detail.text);
      setIsSpeaking(true);
      if (subtitleTimeoutRef.current) clearTimeout(subtitleTimeoutRef.current);
    };

    const handleSpeakEnd = () => {
      setIsSpeaking(false);
      subtitleTimeoutRef.current = setTimeout(() => {
        setSubtitle(null);
      }, 1500);
    };

    window.addEventListener('taana-speak-start', handleSpeakStart);
    window.addEventListener('taana-speak-end', handleSpeakEnd);

    return () => {
      window.removeEventListener('taana-speak-start', handleSpeakStart);
      window.removeEventListener('taana-speak-end', handleSpeakEnd);
      if (subtitleTimeoutRef.current) clearTimeout(subtitleTimeoutRef.current);
    };
  }, []);

  // Sync / query mic permission status non-invasively
  const syncMicPermissionStatus = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermissionStatus(permissionStatus.state as any);
      } catch (e) {}
    }
  };

  // Main SpeechRecognition initializer & lifecycle manager
  useEffect(() => {
    let rec: any = null;
    let transcriptFound = false;
    let errorOccurred = false;
    let wasAborted = false;
    let isCleanedUp = false;
    let startTime = Date.now();

    const finalizeSimulatorSpeech = (finalText?: string) => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      stopMicVolumeTracker();
      
      const textToDeliver = finalText || interimTranscriptRef.current || detectContextAndTranslate(languageRef.current);
      addLog(`Simulator SpeechRecognition finalizing: "${textToDeliver}"`);
      deliverTranscript(textToDeliver);
    };

    const startSimulatorFlow = () => {
      if (isMutedRef.current) {
        addLog("startSimulatorFlow aborted: VoiceHelper is MUTED.");
        return;
      }
      simulatorSessionRef.current = true;
      setRecognitionError(null);
      setInterimTranscript('');
      interimTranscriptRef.current = '';
      hasDispatchedTranscriptRef.current = false;
      stopSpeaking();
      triggerSubtitleStop();
      
      // Setup live typing simulation effect
      const finalResponseText = detectContextAndTranslate(languageRef.current);
      let currentLength = 0;
      
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      
      // Start typing after a short delay (0.8 seconds)
      typingIntervalRef.current = setInterval(() => {
        if (!isListeningRef.current || isCleanedUp || isMutedRef.current) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          return;
        }
        
        // Type 1-4 characters at a time for natural look
        currentLength += Math.max(1, Math.floor(Math.random() * 4));
        if (currentLength >= finalResponseText.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          setInterimTranscript(finalResponseText);
          interimTranscriptRef.current = finalResponseText;
          
          addLog(`Simulator typing finished. Auto-delivering in 1.4s...`);
          if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = setTimeout(() => {
            deliverTranscript(finalResponseText);
          }, 1400);
        } else {
          const partial = finalResponseText.slice(0, currentLength);
          setInterimTranscript(partial);
          interimTranscriptRef.current = partial;
        }
      }, 60);
    };

    // If the component is actively listening, reset retries and force-stop SpeechSynthesis
    if (isListening) {
      retryCountRef.current = 0;
      consecutiveErrorsRef.current = 0;
      hasDispatchedTranscriptRef.current = false;
      setInterimTranscript('');
      interimTranscriptRef.current = '';
      stopSpeaking();
      triggerSubtitleStop();
      
      if (isMutedRef.current) {
        addLog("VoiceHelper is MUTED. Aborting audio recording streams.");
        return;
      }

      if (useSimulatorFallback) {
        addLog("Starting Voice Assistant in Intelligent Simulator Mode...");
        startSimulatorFlow();
        return;
      }
    } else {
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      
      if (simulatorSessionRef.current && interimTranscriptRef.current.trim() && !hasDispatchedTranscriptRef.current) {
        addLog("Manual Stop triggered for Simulator Voice Assistant. Finalizing output...");
        finalizeSimulatorSpeech();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
      setInterimTranscript('');
      interimTranscriptRef.current = '';
      return;
    }

    if (isMutedRef.current) {
      addLog("VoiceHelper is MUTED. Aborting Web Speech API recognition startup.");
      return;
    }

    // Check browser support
    const SpeechRecognitionClass = (window as any).SpeechRecognition || 
                                   (window as any).webkitSpeechRecognition || 
                                   (window as any).mozSpeechRecognition || 
                                   (window as any).msSpeechRecognition;
    if (!SpeechRecognitionClass) {
      addLog("Speech recognition initializer aborted: no APIs found on window object.");
      setBrowserSupportsSpeech(false);
      setRecognitionError('not-supported');
      if (setIsListening) setIsListening(false);
      return;
    }

    // Clear previous errors and transcripts
    setBrowserSupportsSpeech(true);
    setRecognitionError(null);
    setInterimTranscript('');
    interimTranscriptRef.current = '';
    playSyntheticChime('record');
    syncMicPermissionStatus();

    const startRecognition = () => {
      if (isCleanedUp || !isListeningRef.current) return;

      try {
        if (rec) {
          try {
            rec.abort();
          } catch (e) {}
        }

        addLog("Creating new SpeechRecognition instance...");
        rec = new SpeechRecognitionClass();
        // On mobile phones, single utterance mode (continuous=false) avoids audio looping glitches
        rec.continuous = !isMobileRef.current;
        rec.interimResults = true;

        // Set correct locale based on selected language
        let locale = 'en-IN';
        if (languageRef.current === 'kn') locale = 'kn-IN';
        if (languageRef.current === 'hi') locale = 'hi-IN';
        rec.lang = locale;
        addLog(`SpeechRecognition language locale set to: ${locale} (continuous: ${!isMobileRef.current})`);

        startTime = Date.now();
        errorOccurred = false;
        wasAborted = false;
        let disconnectionReason = 'normal-disconnection-or-silence';

        // Set up robust callbacks
        rec.onstart = () => {
          addLog("SpeechRecognition.onstart triggered. Microphone stream is now captured successfully.");
          setMicPermissionStatus('granted');
          setRecognitionError(null);
        };

        rec.onresult = (event: any) => {
          let compiledText = '';
          let hasFinal = false;

          for (let i = 0; i < event.results.length; ++i) {
            compiledText += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              hasFinal = true;
            }
          }

          const clean = compiledText.trim();
          if (clean) {
            addLog(`SpeechRecognition captured text: "${clean}" (final: ${hasFinal})`);
            setInterimTranscript(clean);
            interimTranscriptRef.current = clean;
            consecutiveErrorsRef.current = 0;
            transcriptFound = true;

            // Auto submit when speaker finishes
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = setTimeout(() => {
              if (interimTranscriptRef.current.trim() && !hasDispatchedTranscriptRef.current) {
                deliverTranscript(interimTranscriptRef.current);
              }
            }, hasFinal ? 1200 : 2200);
          }
        };

        rec.onerror = (err: any) => {
          addLog(`SpeechRecognition.onerror triggered: ${err.error}`);
          console.warn('Speech recognition callback error:', err.error);
          disconnectionReason = `error-${err.error}`;

          if (err.error === 'not-allowed' || err.error === 'permission-blocked') {
            errorOccurred = true;
            setMicPermissionStatus('denied');
            setRecognitionError('permission-blocked');
            playSyntheticChime('stop');
          } else if (err.error === 'no-speech') {
            // If we already have interim words captured, deliver them!
            if (interimTranscriptRef.current.trim() && !hasDispatchedTranscriptRef.current) {
              deliverTranscript(interimTranscriptRef.current);
              return;
            }
            addLog("no-speech reported. Proceeding to allow clean end/restart.");
          } else if (err.error === 'network') {
            addLog("Detected Chrome sandbox network block. Showing notice and allowing manual editing or explicit demo simulation.");
            errorOccurred = true;
            setRecognitionError('network');
            playSyntheticChime('stop');
          } else if (err.error === 'aborted') {
            wasAborted = true;
            disconnectionReason = 'aborted';
          } else {
            errorOccurred = true;
            setRecognitionError(err.error || 'unknown');
            playSyntheticChime('stop');
          }
        };

        rec.onend = () => {
          const elapsed = Date.now() - startTime;
          addLog(`SpeechRecognition.onend triggered. Reason: ${disconnectionReason}. Elapsed: ${elapsed}ms`);
          console.log(`[VoiceHelper] Speech recognition disconnected. Reason: ${disconnectionReason}. Elapsed: ${elapsed}ms, wasAborted: ${wasAborted}, errorOccurred: ${errorOccurred}, isCleanedUp: ${isCleanedUp}`);

          // If words were captured before disconnection, deliver them cleanly
          if (interimTranscriptRef.current.trim() && !hasDispatchedTranscriptRef.current) {
            addLog(`onend delivering captured words: "${interimTranscriptRef.current}"`);
            deliverTranscript(interimTranscriptRef.current);
            return;
          }

          if (isMutedRef.current) {
            addLog("Speech recognition session ended and microphone is MUTED. Skipping automatic restart.");
            return;
          }

          if (isListeningRef.current && !isCleanedUp && !hasDispatchedTranscriptRef.current) {
            // Prevent infinite restarts if permission was denied
            if (disconnectionReason === 'error-not-allowed' || disconnectionReason === 'error-permission-blocked') {
              addLog("Speech recognition auto-restart skipped because microphone permission is denied or blocked.");
              console.warn('[VoiceHelper] Speech recognition auto-restart skipped because microphone permission is denied/blocked.');
              return;
            }

            // Immediately halt auto-restart loop for network errors which are caused by Chrome sandbox security policies
            if (disconnectionReason === 'error-network' || recognitionError === 'network') {
              addLog("Detected Chrome sandbox network block. Auto-restart skipped. Displaying guidance panel to let user speak in a new tab or use interactive suggestions.");
              console.info('[VoiceHelper] Speech recognition auto-restart skipped because Web Speech API is sandboxed in iframe.');
              return;
            }

            // Keep track of consecutive non-silence errors.
            if (errorOccurred && disconnectionReason !== 'error-no-speech') {
              consecutiveErrorsRef.current += 1;
              addLog(`Speech session encountered error. Consecutive errors: ${consecutiveErrorsRef.current}/5.`);
            } else if (!errorOccurred && elapsed > 4000) {
              // Reset if session ran cleanly for more than 4 seconds
              consecutiveErrorsRef.current = 0;
            }

            if (consecutiveErrorsRef.current >= 5) {
              addLog("CRITICAL: Too many consecutive speech recognition errors. Automatically disabling mic listener to prevent infinite rapid restarts.");
              if (setIsListening) setIsListening(false);
              setRecognitionError('persistent-error');
              playSyntheticChime('stop');
              return;
            }

            // Stagger the restart delay based on consecutive errors count to protect browser resource usage
            let restartDelay = isMobileRef.current ? 300 : 50;
            if (consecutiveErrorsRef.current > 0) {
              restartDelay = Math.min(1000 * Math.pow(2, consecutiveErrorsRef.current - 1), 6000); // 1s, 2s, 4s, 6s backoff
              addLog(`Staggering retry in ${restartDelay}ms due to previous consecutive errors...`);
            }

            addLog(`SpeechRecognition active listener state is still TRUE. Re-establishing connection in ${restartDelay}ms...`);
            console.log(`[VoiceHelper] Auto-restarting SpeechRecognition in ${restartDelay}ms to maintain continuous listening...`);
            
            if (startTimerRef.current) clearTimeout(startTimerRef.current);
            startTimerRef.current = setTimeout(() => {
              startRecognition();
            }, restartDelay);
            return;
          }

          // If we ran out of retries or it was a normal quiet duration timeout and we are no longer listening, display the "no-speech" error
          if (!transcriptFound && !errorOccurred && !wasAborted && !isCleanedUp && !hasDispatchedTranscriptRef.current) {
            if (elapsed > 2500) {
              setRecognitionError('no-speech');
              playSyntheticChime('stop');
            }
          }
        };

        recognitionRef.current = rec;
        addLog("Calling SpeechRecognition.start()...");
        rec.start();

      } catch (e: any) {
        console.error('Failed to start speech recognition:', e);
        if (e.name !== 'InvalidStateError') {
          errorOccurred = true;
          setRecognitionError('failed-to-start');
        }
      }
    };

    // CRITICAL FIX: Add a short debounce timer before calling start().
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    startTimerRef.current = setTimeout(() => {
      startRecognition();
    }, 200);

    return () => {
      isCleanedUp = true;
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      stopMicVolumeTracker();
      if (rec) {
        try {
          rec.abort();
        } catch (e) {}
      }
    };
  }, [isListening, language, useSimulatorFallback, isMuted]);

  const toggleListening = () => {
    if (!setIsListening) return;
    setIsListening(!isListening);
  };

  const retryListening = () => {
    if (!setIsListening) return;
    setRecognitionError(null);
    setIsListening(true);
  };

  // Human-friendly translations for the dialog content based on current lang
  const getHelperTranslations = () => {
    const dialogT = {
      en: {
        listening: "Listening to Your Voice...",
        speakHint: "Speak naturally about your beautiful handloom craft...",
        stopBtn: "Stop Listening",
        simulateBtn: "Simulate Random Spoken Response",
        demoTitle: "Demo Mode Helper",
        permissionGranted: "Microphone Access Active",
        permissionBlocked: "Microphone Blocked",
        permissionPrompt: "Requesting Microphone...",
        permissionUnknown: "Microphone Access Ready",
        noSpeechErr: "No speech detected. Please try speaking closer or louder.",
        networkErr: "Chrome Sandbox Restriction: Chrome restricts standard SpeechRecognition inside iframe previews. Please click 'Open in New Tab' at the top right of the screen to use your real microphone! Or, tap any Smart Voice Suggestion below to test immediately.",
        blockedErr: "Microphone access was denied. Please allow camera/microphone permissions in your browser's site settings.",
        genericErr: "An error occurred with voice capture. Please try again.",
        restarting: "Silent timeout... auto-restarting microphone",
        retryBtn: "Try Again / Start Mic",
        interimPlaceholder: "Hearing your words..."
      },
      kn: {
        listening: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
        speakHint: "ಕೈಮಗ್ಗದ ಬಗ್ಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ನೈಸರ್ಗಿಕವಾಗಿ ಮಾತನಾಡಿ...",
        stopBtn: "ಆಲಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
        simulateBtn: "ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಅನುಕರಿಸಿ",
        demoTitle: "ಡೆಮೊ ಸಹಾಯ ಸಾಧನ",
        permissionGranted: "ಮೈಕ್ರೊಫೋನ್ ಸಕ್ರಿಯವಾಗಿದೆ",
        permissionBlocked: "ಮೈಕ್ರೊಫೋನ್ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ",
        permissionPrompt: "ಅನುಮತಿ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
        permissionUnknown: "ಮೈಕ್ರೊಫೋನ್ ಸಿದ್ಧವಾಗಿದೆ",
        noSpeechErr: "ಯಾವುದೇ ಧ್ವನಿ ಪತ್ತೆಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ.",
        networkErr: "ಕ್ರೋಮ್ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್ ನಿರ್ಬಂಧ: ಪ್ರಿವ್ಯೂ ವಿಂಡೋದಲ್ಲಿ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ನೈಜ ಮೈಕ್ರೊಫೋನ್ ಬಳಸಲು ಮೇಲಿನ ಬಲಭಾಗದಲ್ಲಿರುವ 'Open in New Tab' ಕ್ಲಿಕ್ ಮಾಡಿ, ಅಥವಾ ಕೆಳಗಿನ ಸ್ಮಾರ್ಟ್ ಸಲಹೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ!",
        blockedErr: "ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಸಿ.",
        genericErr: "ಧ್ವನಿ ಗ್ರಹಣದಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        restarting: "ಮೌನ ಸಮಯ ಮೀರಿದೆ... ಮೈಕ್ರೊಫೋನ್ ಮರುಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ",
        retryBtn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
        interimPlaceholder: "ನಿಮ್ಮ ಮಾತುಗಳನ್ನು ಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ..."
      },
      hi: {
        listening: "आपकी आवाज़ सुन रहे हैं...",
        speakHint: "अपने सुंदर हथकरघा उत्पाद के बारे में खुलकर बोलें...",
        stopBtn: "सुनना बंद करें",
        simulateBtn: "नकली आवाज़ प्रतिक्रिया का उपयोग करें",
        demoTitle: "डेमो सहायक साधन",
        permissionGranted: "माइक्रोफ़ोन सक्रिय है",
        permissionBlocked: "माइक्रोफ़ोन ब्लॉक है",
        permissionPrompt: "अनुमति का अनुरोध...",
        permissionUnknown: "माइक्रोफ़ोन तैयार है",
        noSpeechErr: "कोई आवाज़ नहीं सुनाई दी। कृपया माइक्रोफ़ोन के पास थोड़ा तेज़ बोलें।",
        networkErr: "क्रोम सैंडबॉक्स प्रतिबंध: प्रीव्यू विंडो के भीतर आवाज़ रिकॉर्डिंग प्रतिबंधित है। वास्तविक माइक का उपयोग करने के लिए ऊपर दाईं ओर 'Open in New Tab' पर क्लिक करें, या नीचे दिए गए स्मार्ट सुझाव पर क्लिक करें!",
        blockedErr: "माइक्रोफ़ोन एक्सेस अस्वीकार कर दिया गया है। कृपया ब्राउज़र सेटिंग्स में इसकी अनुमति दें।",
        genericErr: "आवाज़ रिकॉर्ड करने में त्रुटि हुई। कृपया फिर से प्रयास करें।",
        restarting: "मौन समय समाप्त... माइक्रोफ़ोन फिर से शुरू किया जा रहा है",
        retryBtn: "पुनः प्रयास करें",
        interimPlaceholder: "आपके शब्दों को समझा जा रहा है..."
      }
    };
    return dialogT[language] || dialogT.en;
  };

  const dt = getHelperTranslations();

  return (
    <>
      {/* Inline styles for beautiful pure-CSS layout animations without any frame rate or device lockouts */}
      <style>{`
        @keyframes customVoiceWave {
          0%, 100% { height: 6px; }
          50% { height: 32px; }
        }
        .animate-custom-wave {
          animation: customVoiceWave 1.1s ease-in-out infinite;
        }
      `}</style>

      {/* Floating speaking subtitles track */}
      {subtitle && (
        <div 
          id="taana-subtitles"
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal/95 border border-terracotta/40 text-cream px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center gap-3 sm:gap-4 max-w-lg w-[92%] sm:w-auto transition-all duration-300 transform translate-y-0 scale-100 animate-fadeIn"
        >
          <div className="flex gap-1.5 items-end h-6 w-8 shrink-0">
            {isSpeaking ? (
              <>
                <div className="w-1 bg-mustard rounded-full animate-pulse" style={{ height: '12px' }}></div>
                <div className="w-1 bg-terracotta rounded-full animate-pulse" style={{ height: '24px' }}></div>
                <div className="w-1 bg-mustard rounded-full animate-pulse" style={{ height: '8px' }}></div>
                <div className="w-1 bg-terracotta rounded-full animate-pulse" style={{ height: '18px' }}></div>
              </>
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
            <span className="text-mustard text-[10px] sm:text-xs uppercase block tracking-wider mb-0.5 font-bold">
              {language === 'kn' ? 'ಧ್ವನಿ ವಿವರಣೆ' : language === 'hi' ? 'आवाज़ विवरण' : 'Voice Assistant Speaking'}
            </span>
            <p className="font-serif italic text-cream/95">"{subtitle}"</p>
          </div>
        </div>
      )}

      {/* Floating Microphone Action Panel */}
      {isListening && (
        <div className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div 
            id="voice-assistant-listening-panel"
            className="bg-cream border-2 border-terracotta rounded-2xl p-4 sm:p-6 text-center max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 transition-transform relative space-y-4 my-auto"
          >
            {/* Permission Badge & Offline Mode Header */}
            <div className="flex flex-col items-center gap-1.5 justify-center">
              {isOfflineVoiceActive && (
                <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {language === 'kn'
                    ? 'ಆಫ್‌ಲೈನ್ ಧ್ವನಿ ಎಂಜಿನ್ ಸಕ್ರಿಯ (೦ kbps) • ಸ್ಥಳೀಯ ಧ್ವನಿ ಗ್ರಹಣ'
                    : language === 'hi'
                    ? 'ऑफ़लाइन वॉयस इंजन सक्रिय (0 kbps) • ऑन-डिवाइस आवाज़'
                    : '⚡ Offline Voice Engine Active (0 kbps) • On-Device Acoustics'}
                </div>
              )}

              {isMuted ? (
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide animate-pulse">
                  <MicOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {language === 'kn' ? 'ಮೈಕ್ ಮ್ಯೂಟ್ ಆಗಿದೆ' : language === 'hi' ? 'माइक म्यूट है' : 'Microphone Muted'}
                </div>
              ) : micPermissionStatus === 'granted' ? (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {dt.permissionGranted}
                </div>
              ) : micPermissionStatus === 'denied' ? (
                <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {dt.permissionBlocked}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-spin" />
                  {dt.permissionPrompt}
                </div>
              )}
            </div>

            {/* Central Circle Pulse Area */}
            <div className="relative inline-block my-2">
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                recognitionError ? 'bg-rose-500/10' : isMuted ? 'bg-amber-500/5' : 'bg-terracotta/20 animate-ping'
              }`}></div>
              <div className={`relative p-5 rounded-full shadow-lg transition-all duration-300 ${
                recognitionError ? 'bg-rose-500 text-white' : isMuted ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-terracotta text-cream'
              }`}>
                {recognitionError ? (
                  <AlertTriangle className="w-10 h-10 animate-bounce" />
                ) : isMuted ? (
                  <MicOff className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10 animate-pulse" />
                )}
              </div>
            </div>

            {/* Real-time Bouncing Visualizer Waves (Lag-free CSS Animations / Real Mic volume) */}
            {!recognitionError && (
              <div className="space-y-3.5 w-full">
                <div className="flex items-center justify-center gap-1.5 h-10">
                  {[...Array(9)].map((_, i) => {
                    const delay = `${i * 0.12}s`;
                    const waveHeight = isMuted ? '4px' : getWaveHeight(i);
                    return (
                      <div 
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${isMuted ? 'bg-amber-300' : 'bg-terracotta'} ${waveHeight || isMuted ? '' : 'animate-custom-wave'}`}
                        style={{ 
                          animationDelay: isMuted ? undefined : delay,
                          height: waveHeight || '10px'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Real-time Audio Amplitude Level Meter */}
                <div className="w-full bg-cream-dark p-3 rounded-xl border border-cream-border space-y-1.5" id="amplitude-visualizer-container">
                  <div className="flex justify-between items-center text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isMuted ? 'bg-amber-400' : micVolume > 5 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                      {language === 'kn' ? 'ಧ್ವನಿ ತೀವ್ರತೆ' : language === 'hi' ? 'आवाज़ की तीव्रता' : 'Voice Amplitude'}
                    </span>
                    <span className="font-mono text-terracotta">
                      {isMuted ? '0%' : `${Math.min(100, Math.round(micVolume * 1.5))}%`}
                    </span>
                  </div>
                  
                  {/* Visual Level Meter Bar (Professional 20-segment styling) */}
                  <div className="h-3.5 w-full bg-gray-200/80 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-gray-300/30">
                    {isMuted ? (
                      <div className="w-full bg-amber-100 rounded-full flex items-center justify-center text-[8px] text-amber-700 font-black uppercase tracking-widest leading-none">
                        {language === 'kn' ? 'ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ' : language === 'hi' ? 'म्यूट है' : 'Muted'}
                      </div>
                    ) : (
                      [...Array(20)].map((_, idx) => {
                        const segmentValue = (idx + 1) * 5; // 5% to 100%
                        const currentPercent = Math.min(100, Math.round(micVolume * 1.5));
                        const isActive = currentPercent >= segmentValue;
                        
                        let activeColor = 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]';
                        if (segmentValue > 75) {
                          activeColor = 'bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.4)]';
                        } else if (segmentValue > 45) {
                          activeColor = 'bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)]';
                        }

                        return (
                          <div 
                            key={idx}
                            className={`h-full flex-1 rounded-xs transition-all duration-75 ${
                              isActive ? activeColor : 'bg-gray-300/40'
                            }`}
                          />
                        );
                      })
                    )}
                  </div>

                  {/* Level Threshold Indicators */}
                  <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold px-0.5">
                    <span>{language === 'kn' ? 'ಮೆಲ್ಲಗೆ' : language === 'hi' ? 'फुसफुसाहट' : 'Whisper'}</span>
                    <span>{language === 'kn' ? 'ಸೂಕ್ತ' : language === 'hi' ? 'उत्तम' : 'Clear Voice'}</span>
                    <span>{language === 'kn' ? 'ಹೆಚ್ಚು' : language === 'hi' ? 'तेज़' : 'Loud'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Listening / Title Message */}
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-charcoal">
                {recognitionError ? "Voice Assistant Status" : isMuted ? (language === 'kn' ? 'ಧ್ವನಿ ಗ್ರಹಣವನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ' : language === 'hi' ? 'आवाज़ रिकॉर्डिंग रुकी हुई है' : "Voice Input Paused") : dt.listening}
              </h3>
              
              <p className="text-xs text-gray-500 px-4 leading-relaxed font-medium">
                {recognitionError ? "" : isMuted ? (language === 'kn' ? 'ನಿಮ್ಮ ಮೈಕ್ರೊಫೋನ್ ನಿಷ್ಕ್ರಿಯವಾಗಿದೆ. ರೆಕಾರ್ಡಿಂಗ್ ಮುಂದುವರಿಸಲು ಕೆಳಗಿನ ಅನ್‌ಮ್ಯೂಟ್ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.' : language === 'hi' ? 'आपका माइक्रोफ़ोन बंद है। रिकॉर्डिंग जारी रखने के लिए नीचे अनम्यूट बटन पर क्लिक करें।' : "Your microphone is temporarily paused. Click the button below to resume voice dictation.") : dt.speakHint}
              </p>
            </div>

            {/* Real-time speech transcription preview & edit text box */}
            <div className="space-y-1.5 text-left w-full">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                {language === 'kn' ? 'ಧ್ವನಿ ಪಠ್ಯ (ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಂಪಾದಿಸಿ)' : language === 'hi' ? 'आवाज़ पाठ (सत्यापित और संपादित करें)' : 'Spoken Text (Verify & Edit)'}
              </label>
              <div className="relative">
                <textarea
                  value={interimTranscript}
                  onChange={(e) => {
                    setInterimTranscript(e.target.value);
                    setIsManuallyEditing(true);
                  }}
                  onFocus={() => {
                    setIsManuallyEditing(true);
                    addLog("User focused text area, switching to manual edit mode (disabling 5s auto-submit)");
                  }}
                  placeholder={dt.interimPlaceholder}
                  className="w-full min-h-[100px] bg-white text-charcoal font-sans text-sm p-3.5 rounded-xl border-2 border-cream-border focus:border-terracotta focus:outline-hidden transition shadow-inner resize-none leading-relaxed font-medium"
                />
                
                {interimTranscript.trim() && (
                  isManuallyEditing ? (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 text-[9px] font-extrabold text-indigo-custom bg-cream/90 px-2 py-1 rounded-md border border-cream-border shadow-xs">
                      <span className="w-1.5 h-1.5 bg-indigo-custom rounded-full"></span>
                      {language === 'kn' ? 'ಕೀಬೋರ್ಡ್ ಸಂಪಾದನೆ - ಸ್ವಯಂ ಸಲ್ಲಿಕೆ ನಿಲ್ಲಿಸಲಾಗಿದೆ' : language === 'hi' ? 'कीबोर्ड संपादन - स्वतः जमा रोक दिया गया' : 'Keyboard editing - auto-submit paused'}
                    </div>
                  ) : (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 text-[9px] font-extrabold text-terracotta bg-cream/90 px-2 py-1 rounded-md border border-cream-border shadow-xs animate-pulse">
                      <span className="w-1.5 h-1.5 bg-terracotta rounded-full"></span>
                      {language === 'kn' ? '೫ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸ್ವಯಂ ಸಲ್ಲಿಕೆ' : language === 'hi' ? '5 सेकंड में स्वतः जमा' : 'Auto-submitting in 5s of silence...'}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Intelligent Context-Aware Speech Suggestions */}
            <div className="bg-amber-50/25 rounded-xl border border-amber-100/60 p-3 text-left w-full space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-extrabold text-terracotta uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-mustard animate-pulse shrink-0" />
                {language === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಧ್ವನಿ ಸಲಹೆಗಳು (ಪರೀಕ್ಷಿಸಲು ಮತ್ತು ಸ್ವಯಂ-ಸಲ್ಲಿಕೆಯನ್ನು ಪ್ರಚೋದಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ)' : language === 'hi' ? 'स्मार्ट आवाज़ सुझाव (परीक्षण और स्वतः-जमा को सक्रिय करने के लिए क्लिक करें)' : 'Smart Voice Suggestions (Click to test & trigger auto-submit)'}
              </span>
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {getSuggestionsForCurrentContext().map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsManuallyEditing(false); // Reset to trigger 5s auto-submit timer
                      setInterimTranscript(suggestion);
                      setRecognitionError(null);
                      playSyntheticChime('record');
                      addLog(`User selected suggestion: "${suggestion}". Auto-submitting in 5s...`);
                    }}
                    className="w-full text-left bg-white hover:bg-cream-light border border-cream-border p-2.5 rounded-lg text-xs text-charcoal font-medium transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-3xs hover:border-terracotta/40"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>

            {/* Error notifications and instructions */}
            {recognitionError && (
              <div className={`border rounded-xl p-3 text-xs leading-relaxed text-left space-y-1 ${
                recognitionError === 'network' 
                  ? 'bg-amber-50 border-amber-200 text-amber-900' 
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                <span className={`font-bold uppercase tracking-wider text-[9px] block ${
                  recognitionError === 'network' ? 'text-amber-700' : 'text-rose-500'
                }`}>
                  {recognitionError === 'network' 
                    ? (language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಧ್ವನಿ ಮಾಹಿತಿ' : language === 'hi' ? 'ऑफ़लाइन आवाज़ सूचना' : 'Offline Voice Active') 
                    : 'Notice'
                  }
                </span>
                <p className="font-semibold text-[11px]">
                  {recognitionError === 'permission-blocked' && dt.blockedErr}
                  {recognitionError === 'no-speech' && dt.noSpeechErr}
                  {recognitionError === 'network' && (
                    language === 'kn' 
                      ? "ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯ: ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಸಾಧನದಲ್ಲಿಯೇ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ನೀವು ಮುಕ್ತವಾಗಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಕೆಳಗಿನ ಸಲಹೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಬಹುದು!"
                      : language === 'hi'
                      ? "ऑफ़लाइन मोड सक्रिय: आवाज़ पहचान सीधे डिवाइस पर काम कर रही है। आप बोल सकते हैं या नीचे दिए गए सुझावों का चयन कर सकते हैं!"
                      : "Offline Voice Mode active: Working locally on-device. Speak naturally or select any smart handloom phrase below!"
                  )}
                  {recognitionError !== 'permission-blocked' && recognitionError !== 'no-speech' && recognitionError !== 'network' && dt.genericErr}
                </p>
              </div>
            )}

            {/* Actionable Preview Troubleshooting tip */}
            <div className="bg-amber-50/50 border border-amber-100/70 rounded-xl p-3 text-[11px] text-amber-800 text-left space-y-1">
              <span className="font-extrabold uppercase tracking-wider text-[9px] block text-amber-600 flex items-center gap-1">
                <Languages className="w-3 h-3" />
                {language === 'kn' ? 'ಪ್ರಮುಖ ಸಲಹೆ' : language === 'hi' ? 'महत्वपूर्ण सुझाव' : 'Important Preview Tip'}
              </span>
              <p className="leading-relaxed font-medium text-amber-900">
                {language === 'kn' ? (
                  "ಧ್ವನಿ ಗ್ರಹಣವಾಗದಿದ್ದರೆ, ಪ್ರಿವ್ಯೂ ವಿಂಡೋದ ಮೇಲಿನ ಬಲಭಾಗದಲ್ಲಿರುವ 'Open in new tab' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಸಿ."
                ) : language === 'hi' ? (
                  "यदि आपकी आवाज़ रिकॉर्ड नहीं हो रही है, तो कृपया प्रीव्यू विंडो के ऊपर दाईं ओर 'Open in new tab' बटन पर क्लिक करें और अनुमति दें।"
                ) : (
                  "Microphone blocked? Click the 'Open in new tab' button at the top right of your preview window to grant browser mic permissions!"
                )}
              </p>
            </div>

            {/* Interaction buttons */}
            <div className="space-y-2.5 pt-2 w-full">
              <button
                id="voice-mute-toggle"
                onClick={() => {
                  playSyntheticChime('click');
                  setIsMuted(!isMuted);
                }}
                className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-sm text-sm border-2 cursor-pointer ${
                  isMuted 
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-white hover:bg-cream-light text-charcoal border-cream-border hover:border-terracotta/40'
                }`}
              >
                {isMuted ? <MicOff className="w-4.5 h-4.5 text-amber-600 shrink-0" /> : <Mic className="w-4.5 h-4.5 text-terracotta shrink-0 animate-pulse" />}
                <span className="font-semibold text-xs md:text-sm">
                  {isMuted 
                    ? (language === 'kn' ? 'ಮೈಕ್ರೊಫೋನ್ ಆನ್ ಮಾಡಿ (Unmute)' : language === 'hi' ? 'माइक चालू करें (Unmute)' : 'Unmute / Resume Mic Recording') 
                    : (language === 'kn' ? 'ಮೈಕ್ರೊಫೋನ್ ಆಫ್ ಮಾಡಿ (Mute)' : language === 'hi' ? 'माइक बंद करें (Mute)' : 'Mute / Pause Mic Recording')
                  }
                </span>
              </button>

              {interimTranscript.trim() && (
                <button
                  onClick={handleSubmitManual}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-cream font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-md text-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-cream" />
                  {language === 'kn' ? 'ಸ್ಥಿರೀಕರಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ' : language === 'hi' ? 'पुष्टि करें और भेजें' : 'Confirm & Submit Now'}
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={toggleListening}
                  className="flex-1 bg-charcoal text-cream hover:bg-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition text-xs"
                >
                  <Square className="w-3.5 h-3.5 fill-cream text-cream shrink-0" />
                  {dt.stopBtn}
                </button>

                <button
                  onClick={retryListening}
                  className="flex-1 bg-terracotta hover:bg-terracotta-dark text-cream font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-md text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  {dt.retryBtn}
                </button>
              </div>

              {/* Instant mock fallback helper always visible to preserve perfect functional backup */}
              <div className="border-t border-cream-dark pt-3 mt-1.5">
                <p className="text-[9px] text-gray-400 mb-1.5 font-mono uppercase tracking-widest flex items-center justify-center gap-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-mustard" />
                  {dt.demoTitle}
                </p>
                <button
                  onClick={() => {
                    const sampleResponses = [
                      "Traditional hand-loomed saree with pure temple borders and double ikat pattern",
                      "Pure natural fine organic cotton mundu crafted using ancient local pitloom methods",
                      "Beautiful lightweight wedding saree green colored with master hand embroidery work"
                    ];
                    const randText = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
                    setIsManuallyEditing(false);
                    setInterimTranscript(randText);
                    setRecognitionError(null);
                    playSyntheticChime('record');
                    addLog(`Inserted demo text: "${randText}". Starting 5s silence countdown.`);
                  }}
                  className="w-full bg-white hover:bg-cream-dark text-terracotta border border-terracotta/40 text-[10px] font-extrabold py-2 px-3 rounded-xl transition shadow-xs cursor-pointer"
                >
                  {language === 'kn' ? 'ಡೆಮೊ ಪಠ್ಯವನ್ನು ಸೇರಿಸಿ (೫ಸೆ ಸ್ವಯಂ ಸಲ್ಲಿಕೆ ಪರೀಕ್ಷಿಸಿ)' : language === 'hi' ? 'डेमो पाठ डालें (5 सेकंड स्वतः जमा का परीक्षण करें)' : 'Insert Demo Speech (Test 5s Auto-Submit)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

// Fire global events to trigger visual subtitle track synchronized with audio
export function triggerSubtitleSpeak(text: string) {
  const event = new CustomEvent('taana-speak-start', { detail: { text } });
  window.dispatchEvent(event);
}

export function triggerSubtitleStop() {
  const event = new Event('taana-speak-end');
  window.dispatchEvent(event);
}
