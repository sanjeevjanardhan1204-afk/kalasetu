import React, { useState } from 'react';
import { 
  Lightbulb, TrendingUp, Volume2, ArrowRight, 
  ChevronRight, ChevronLeft, Sparkles, VolumeX,
  CheckCircle2, Eye, ShieldCheck, Camera, FileText
} from 'lucide-react';
import { Language } from '../types';
import { playSyntheticChime } from '../data';
import { speakText, stopSpeaking } from './VoiceHelper';

interface TipData {
  id: string;
  category: 'description' | 'photography' | 'heritage' | 'dimensions' | 'care';
  icon: 'file' | 'camera' | 'heritage' | 'measure' | 'care';
  impactPercent: number;
  en: {
    title: string;
    description: string;
    impactLabel: string;
    actionLabel: string;
  };
  kn: {
    title: string;
    description: string;
    impactLabel: string;
    actionLabel: string;
  };
  hi: {
    title: string;
    description: string;
    impactLabel: string;
    actionLabel: string;
  };
}

const WEAVER_TIPS: TipData[] = [
  {
    id: 'tip-fabric-details',
    category: 'description',
    icon: 'file',
    impactPercent: 25,
    en: {
      title: 'Detailed Fabric & Thread Count',
      description: 'Try adding a more detailed fabric description (e.g. "80s count pure mulberry warp with pure zari") for 25% more buyer views.',
      impactLabel: '+25% More Views',
      actionLabel: 'Add to Listing'
    },
    kn: {
      title: 'ವಸ್ತ್ರ ಮತ್ತು ನೂಲಿನ ನಿಖರ ವಿವರಣೆ',
      description: 'ಬಟ್ಟೆಯ ಗುಣಮಟ್ಟ ಮತ್ತು ನೂಲಿನ ವಿವರಗಳನ್ನು (ಉದಾ: ೮೦s ಕೌಂಟ್ ಶುದ್ಧ ರೇಷ್ಮೆ) ಸೇರಿಸಿದರೆ ಶೇ. ೨೫% ರಷ್ಟು ಹೆಚ್ಚು ಗ್ರಾಹಕರ ಗಮನ ಸೆಳೆಯಬಹುದು.',
      impactLabel: '+೨೫% ಹೆಚ್ಚಿನ ವೀಕ್ಷಣೆಗಳು',
      actionLabel: 'ವಿವರ ಸೇರಿಸಿ'
    },
    hi: {
      title: 'विस्तृत फैब्रिक और धागा विवरण',
      description: 'सटीक फैब्रिक विवरण जोड़ें (जैसे "80s काउंट शुद्ध शहतूत रेशम जरी के साथ") जिससे 25% अधिक खरीदार आपके उत्पाद देखेंगे।',
      impactLabel: '+25% अधिक व्यूज',
      actionLabel: 'विवरण जोड़ें'
    }
  },
  {
    id: 'tip-natural-lighting',
    category: 'photography',
    icon: 'camera',
    impactPercent: 30,
    en: {
      title: 'Natural Daylight Zari Close-up',
      description: 'Take close-up photos of your pallu and border in soft morning daylight to increase buyer trust and purchase inquiries by 30%.',
      impactLabel: '+30% Buyer Inquiries',
      actionLabel: 'Upload Photo'
    },
    kn: {
      title: 'ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಜರಿ ಫೋಟೋ',
      description: 'ಬೆಳಗಿನ ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಪಲ್ಲು ಮತ್ತು ಬಾರ್ಡರ್‌ನ ಹತ್ತಿರದ ಫೋಟೋ ತೆಗೆದು ಹಾಕಿದರೆ ಗ್ರಾಹಕರ ವಿಶ್ವಾಸ ಶೇ. ೩೦% ರಷ್ಟು ಹೆಚ್ಚಾಗುತ್ತದೆ.',
      impactLabel: '+೩೦% ಗ್ರಾಹಕರ ವಿಚಾರಣೆ',
      actionLabel: 'ಫೋಟೋ ಹಾಕಿ'
    },
    hi: {
      title: 'प्राकृतिक रोशनी में जरी की तस्वीर',
      description: 'सुबह की प्राकृतिक धूप में पल्लू और बॉर्डर की क्लोज-अप तस्वीर अपलोड करें, इससे खरीदारों का विश्वास 30% बढ़ता है।',
      impactLabel: '+30% खरीदार रुचि',
      actionLabel: 'फोटो अपलोड करें'
    }
  },
  {
    id: 'tip-loom-heritage',
    category: 'heritage',
    icon: 'heritage',
    impactPercent: 20,
    en: {
      title: 'Highlight GI Tag & District Heritage',
      description: 'Mention your district heritage and GI craft lineage (e.g. Bagalkot Traditional Loom) for a 20% higher premium appreciation.',
      impactLabel: '+20% Artisan Value',
      actionLabel: 'Add Heritage'
    },
    kn: {
      title: 'ಜಿಐ ಟ್ಯಾಗ್ ಮತ್ತು ಪಾರಂಪರಿಕ ಕಲೆ',
      description: 'ನಿಮ್ಮ ಕೈಮಗ್ಗದ ಭೌಗೋಳಿಕ ಪರಂಪರೆ ಮತ್ತು ಜಿಲ್ಲೆಯ ಕರಕುಶಲತೆಯನ್ನು ಹೆಸರಿಸಿದರೆ ಶೇ. ೨೦% ರಷ್ಟು ಉತ್ತಮ ಗೌರವ ಬೆಲೆ ಸಿಗುತ್ತದೆ.',
      impactLabel: '+೨೦% ಮೌಲ್ಯ ವೃದ್ಧಿ',
      actionLabel: 'ಪರಂಪರೆ ಸೇರಿಸಿ'
    },
    hi: {
      title: 'जीआई टैग और पारंपरिक पहचान',
      description: 'अपने जिले की पारंपरिक हथकरघा विरासत और जीआई पहचान का उल्लेख करें, इससे 20% बेहतर मूल्य प्राप्त होता है।',
      impactLabel: '+20% प्रीमियम मूल्य',
      actionLabel: 'विरासत जोड़ें'
    }
  },
  {
    id: 'tip-blouse-dimensions',
    category: 'dimensions',
    icon: 'measure',
    impactPercent: 35,
    en: {
      title: 'Exact Dimensions & Blouse Piece Clarity',
      description: 'Clearly indicate whether an unstitched blouse piece is included (e.g. 5.5m saree + 0.8m blouse) to reduce purchase hesitation by 35%.',
      impactLabel: '+35% Faster Orders',
      actionLabel: 'Update Sizing'
    },
    kn: {
      title: 'ನಿಖರ ಅಳತೆ ಮತ್ತು ಬ್ಲೌಸ್ ಪೀಸ್ ವಿವರ',
      description: 'ರವಿಕೆ ಬಟ್ಟೆ ಒಳಗೊಂಡಿದೆಯೇ ಎಂದು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿದರೆ (೫.೫ ಮೀ ಸೀರೆ + ೦.೮ ಮೀ ಬ್ಲೌಸ್) ಗ್ರಾಹಕರು ಶೇ. ೩೫% ವೇಗವಾಗಿ ಆರ್ಡರ್ ಮಾಡುತ್ತಾರೆ.',
      impactLabel: '+೩೫% ವೇಗದ ಆರ್ಡರ್‌ಗಳು',
      actionLabel: 'ಅಳತೆ ನಮೂದಿಸಿ'
    },
    hi: {
      title: 'सटीक माप और ब्लाउज पीस का विवरण',
      description: 'स्पष्ट बताएं कि बिना सिला ब्लाउज पीस शामिल है या नहीं (5.5 मी साड़ी + 0.8 मी ब्लाउज), इससे बिक्री में 35% तेजी आती है।',
      impactLabel: '+35% त्वरित ऑर्डर',
      actionLabel: 'माप दर्ज करें'
    }
  }
];

interface WeaverSuccessTipsProps {
  language: Language;
  onApplyTip?: () => void;
}

export const WeaverSuccessTips: React.FC<WeaverSuccessTipsProps> = ({
  language,
  onApplyTip
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentTip = WEAVER_TIPS[currentTipIndex];
  const tipContent = currentTip[language] || currentTip.en;

  const handleNextTip = () => {
    playSyntheticChime('click');
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentTipIndex((prev) => (prev + 1) % WEAVER_TIPS.length);
  };

  const handlePrevTip = () => {
    playSyntheticChime('click');
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentTipIndex((prev) => (prev - 1 + WEAVER_TIPS.length) % WEAVER_TIPS.length);
  };

  const handleReadTipAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    playSyntheticChime('click');
    setIsSpeaking(true);

    const speechText = `${tipContent.title}. ${tipContent.description}`;
    speakText(speechText, language);

    // Auto reset speaking state after approximate read duration
    setTimeout(() => {
      setIsSpeaking(false);
    }, 6000);
  };

  const headerTitle = {
    en: 'Weaver Success Tip',
    kn: 'ನೇಕಾರರ ಯಶಸ್ಸಿನ ಸಲಹೆ',
    hi: 'बुनकर सफलता सुझाव'
  }[language] || 'Weaver Success Tip';

  const subtitle = {
    en: 'Actionable insight to boost your product visibility',
    kn: 'ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳ ಮಾರಾಟ ಮತ್ತು ನೋಟವನ್ನು ಹೆಚ್ಚಿಸುವ ಉಪಯುಕ್ತ ಸಲಹೆ',
    hi: 'अपने उत्पादों की दृश्यता और बिक्री बढ़ाने के लिए उपयोगी सुझाव'
  }[language] || 'Actionable insight to boost your product visibility';

  return (
    <div 
      id="weaver-success-tips-card"
      className="bg-linear-to-br from-[#FFF9F2] to-[#FFF3E3] border-2 border-mustard/40 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden space-y-3.5 transition-all duration-300"
    >
      {/* Subtle decorative background watermark */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-mustard/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-mustard/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-mustard/25 text-charcoal flex items-center justify-center shrink-0 border border-mustard/40 shadow-3xs">
            <Lightbulb className="w-4 h-4 text-terracotta" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif text-sm font-bold text-charcoal">{headerTitle}</h4>
              <span className="bg-terracotta/10 text-terracotta text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full font-mono">
                {tipContent.impactLabel}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 font-medium line-clamp-1">{subtitle}</p>
          </div>
        </div>

        {/* Carousel pagination controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            id="prev-weaver-tip-btn"
            onClick={handlePrevTip}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-charcoal border border-mustard/30 transition shadow-3xs"
            title="Previous Tip"
            aria-label="Previous Tip"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-gray-500 px-1">
            {currentTipIndex + 1}/{WEAVER_TIPS.length}
          </span>
          <button
            id="next-weaver-tip-btn"
            onClick={handleNextTip}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-charcoal border border-mustard/30 transition shadow-3xs"
            title="Next Tip"
            aria-label="Next Tip"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tip Body */}
      <div className="space-y-2">
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-terracotta shrink-0 mt-1.5 animate-pulse"></div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-charcoal font-serif flex items-center gap-1.5">
              {tipContent.title}
            </h5>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              "{tipContent.description}"
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Listen Aloud Button (Empathy design for rural artisans) */}
        <button
          id="listen-weaver-tip-btn"
          onClick={handleReadTipAloud}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
            isSpeaking 
              ? 'bg-amber-600 text-white border-amber-700 animate-pulse shadow-xs' 
              : 'bg-white hover:bg-cream text-charcoal border-mustard/40 shadow-3xs'
          }`}
          title="Listen to tip spoken aloud"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-amber-100" />
              <span>{language === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : language === 'hi' ? 'रोकें' : 'Stop Audio'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-terracotta" />
              <span>{language === 'kn' ? 'ಸಲಹೆ ಆಲಿಸಿ' : language === 'hi' ? 'सुझाव सुनें' : 'Listen Tip'}</span>
            </>
          )}
        </button>

        {/* Action Button */}
        {onApplyTip && (
          <button
            id="apply-weaver-tip-btn"
            onClick={() => {
              playSyntheticChime('success');
              onApplyTip();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-charcoal hover:bg-black text-cream text-xs font-bold flex items-center gap-1.5 transition shadow-xs group"
          >
            <Sparkles className="w-3.5 h-3.5 text-mustard group-hover:rotate-12 transition-transform" />
            <span>{tipContent.actionLabel}</span>
            <ArrowRight className="w-3 h-3 text-cream/70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
