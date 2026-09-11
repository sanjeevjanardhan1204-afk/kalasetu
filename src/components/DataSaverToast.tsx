import React, { useState } from 'react';
import { WifiOff, ChevronDown, ChevronUp, CheckCircle, Info, FlameKindling, ZapOff } from 'lucide-react';
import { Language } from '../types';
import { playSyntheticChime } from '../data';

interface DataSaverToastProps {
  language: Language;
  dataSaver: boolean;
  onDisable: () => void;
}

export const DataSaverToast: React.FC<DataSaverToastProps> = ({
  language,
  dataSaver,
  onDisable
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!dataSaver) return null;

  const translations = {
    en: {
      active: "Low Bandwidth Mode Enabled",
      subText: "Optimized for rural handloom co-operatives.",
      disable: "Switch to Live",
      whyTitle: "Rural Optimization Active:",
      whyInterval: "Sync polling slowed down to 45s (reduces data use by 66%)",
      whyAnim: "Live typing & pulse wave animations disabled",
      whyVoice: "Local speech assistance active without cloud dependency",
      collapse: "Show Details",
      hide: "Hide"
    },
    kn: {
      active: "ಕಡಿಮೆ ಬ್ಯಾಂಡ್‌ವಿಡ್ತ್ ಮೋಡ್",
      subText: "ಗ್ರಾಮೀಣ ನೆಟ್‌ವರ್ಕ್ ಸಿಗ್ನಲ್‌ಗಾಗಿ ಆಪ್ಟಿಮೈಸ್ ಮಾಡಲಾಗಿದೆ.",
      disable: "ಲೈವ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      whyTitle: "ಆಪ್ಟಿಮೈಸೇಶನ್ ವಿವರಗಳು:",
      whyInterval: "ಹಿನ್ನೆಲೆ ಸಿಂಕ್ 45 ಸೆಕೆಂಡುಗಳಿಗೆ ವಿಸ್ತರಿಸಲಾಗಿದೆ (66% ಡೇಟಾ ಉಳಿತಾಯ)",
      whyAnim: "ಲೈವ್ ಟೈಪಿಂಗ್ ಮತ್ತು ಮಿಂಚುವ ಅನಿಮೇಷನ್‌ಗಳನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ",
      whyVoice: "ಕ್ಲೌಡ್ ಅವಲಂಬನೆಯಿಲ್ಲದೆ ಸ್ಥಳೀಯ ಧ್ವನಿ ಸಹಾಯಕ ಲಭ್ಯವಿದೆ",
      collapse: "ವಿವರಗಳನ್ನು ನೋಡಿ",
      hide: "ಮರೆಮಾಡಿ"
    },
    hi: {
      active: "कम बैंडविड्थ मोड सक्रिय",
      subText: "ग्रामीण नेटवर्क सिग्नल के लिए अनुकूलित।",
      disable: "लाइव मोड चालू करें",
      whyTitle: "अनुकूलन विवरण:",
      whyInterval: "बैकग्राउंड सिंक को 45 सेकंड तक बढ़ाया गया है (66% डेटा बचत)",
      whyAnim: "लाइव टाइपिंग और ब्लिंकिंग एनिमेशन बंद कर दिए गए हैं",
      whyVoice: "क्लाउड निर्भरता के बिना स्थानीय वॉयस असिस्टेंट चालू है",
      collapse: "विवरण देखें",
      hide: "छिपाएं"
    }
  };

  const t = translations[language] || translations.en;

  const handleToggleExpand = () => {
    playSyntheticChime('click');
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      id="data-saver-toast-container"
      className="bg-[#FEF3C7] border-b-2 border-amber-300 text-amber-900 px-4 py-2.5 transition-all relative z-40"
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
          <div>
            <p className="font-extrabold flex items-center gap-1.5 leading-none">
              <span>{t.active}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </p>
            <p className="text-[10px] text-amber-800 font-medium mt-0.5 leading-tight">
              {t.subText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleExpand}
            className="text-[10px] font-bold text-amber-800 bg-amber-200/50 hover:bg-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
          >
            <span>{isExpanded ? t.hide : t.collapse}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          <button
            onClick={() => {
              playSyntheticChime('success');
              onDisable();
            }}
            className="text-[10px] font-black text-white bg-amber-700 hover:bg-amber-800 px-2.5 py-1 rounded-lg transition"
          >
            {t.disable}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-amber-200 text-[10px] text-amber-800 space-y-1.5 font-medium leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-amber-900 text-[9px] flex items-center gap-1">
            <ZapOff className="w-3 h-3 text-amber-700" />
            <span>{t.whyTitle}</span>
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>{t.whyInterval}</li>
            <li>{t.whyAnim}</li>
            <li>{t.whyVoice}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
