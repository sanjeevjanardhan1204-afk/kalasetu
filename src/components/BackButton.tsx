import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface BackButtonProps {
  language?: Language;
  onBack: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ language = 'en', onBack, className = '' }) => (
  <button
    type="button"
    onClick={onBack}
    className={`inline-flex items-center gap-1.5 text-xs font-bold text-charcoal hover:text-terracotta transition ${className}`}
    aria-label={language === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : language === 'hi' ? 'पीछे जाएं' : 'Back'}
  >
    <ArrowLeft className="w-4 h-4" />
    <span>{language === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : language === 'hi' ? 'पीछे जाएं' : 'Back'}</span>
  </button>
);
