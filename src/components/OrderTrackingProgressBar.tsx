import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Clock, 
  ShieldCheck, 
  Package, 
  Truck, 
  Home, 
  Coins, 
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Order, Language } from '../types';

interface OrderTrackingProgressBarProps {
  order: Order;
  language: Language;
  variant?: 'full' | 'compact' | 'horizontal-only';
  onAdvanceStatus?: () => void;
  showSimulateTrigger?: boolean;
}

interface StepMeta {
  key: Order['status'];
  en: string;
  kn: string;
  hi: string;
  icon: React.ElementType;
  defaultDescEn: string;
  defaultDescKn: string;
  defaultDescHi: string;
  stageTag: string;
}

const ORDER_STEPS: StepMeta[] = [
  {
    key: 'Order Received',
    en: 'Order Received',
    kn: 'ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    hi: 'ऑर्डर प्राप्त हुआ',
    icon: ShoppingBag,
    defaultDescEn: 'Order confirmed and registered directly with the rural master weaver.',
    defaultDescKn: 'ಗ್ರಾಮೀಣ ನೇಕಾರರ ಬಳಿ ಆರ್ಡರ್ ನೇರವಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.',
    defaultDescHi: 'कारीगर के पास सीधे ऑर्डर दर्ज किया गया है।',
    stageTag: 'Loom Direct'
  },
  {
    key: 'Accepted',
    en: 'Weaver Accepted',
    kn: 'ನೇಕಾರರಿಂದ ಸ್ವೀಕೃತಿ',
    hi: 'बुनकर ने स्वीकार किया',
    icon: Clock,
    defaultDescEn: 'Weaver acknowledged order and initiated final handloom preparation.',
    defaultDescKn: 'ನೇಕಾರರು ಸೀರೆಯ ಅಂತಿಮ ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧತೆ ಆರಂಭಿಸಿದ್ದಾರೆ.',
    defaultDescHi: 'बुनकर ने तैयारी शुरू कर दी है।',
    stageTag: 'Preparation'
  },
  {
    key: 'Quality Checked',
    en: 'Weaver Quality Checked',
    kn: 'ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ (QC)',
    hi: 'गुणवत्ता परीक्षण (QC)',
    icon: ShieldCheck,
    defaultDescEn: 'Pre-dispatch QC verified: loose threads trimmed, zari inspected & photograph locked.',
    defaultDescKn: 'ಕೈಮಗ್ಗದ ಎಳೆಗಳನ್ನು ಕತ್ತರಿಸಿ, ಜರಿ ಗುಣಮಟ್ಟ ಹಾಗೂ ಅಳತೆಗಳನ್ನು ನಿಖರವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
    defaultDescHi: 'धागों की छंटाई और जरी की जांच पूर्ण, गुणवत्ता प्रमाणित।',
    stageTag: 'QC Certified'
  },
  {
    key: 'Pickup Arranged',
    en: 'Pickup Arranged',
    kn: 'ಪಿಕಪ್ ನಿಯೋಜಿಸಲಾಗಿದೆ',
    hi: 'पिकअप निर्धारित',
    icon: Package,
    defaultDescEn: 'TantuLink Rural Logistics box packaged for direct artisan doorstep collection.',
    defaultDescKn: 'ನೇಕಾರರ ಮನೆಯಿಂದ ಪಾರ್ಸೆಲ್ ಸಂಗ್ರಹಿಸಲು ಬಾಕ್ಸ್ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.',
    defaultDescHi: 'बुनकर के घर से सुरक्षित पार्सल पिकअप तय किया गया।',
    stageTag: 'Packaging'
  },
  {
    key: 'Shipped',
    en: 'Dispatched & Shipped',
    kn: 'ರವಾನಿಸಲಾಗಿದೆ',
    hi: 'डिस्पैच / रवाना',
    icon: Truck,
    defaultDescEn: 'In transit via direct Speed Network with real-time rural post tracking.',
    defaultDescKn: 'ಸ್ಪೀಡ್ ಪೋಸ್ಟ್ / ಕೊರಿಯರ್ ಮೂಲಕ ನಿಮ್ಮ ವಿಳಾಸಕ್ಕೆ ಹೊರಟಿದೆ.',
    defaultDescHi: 'सुरक्षित कूरियर से आपके पते के लिए रवाना हो चुका है।',
    stageTag: 'In Transit'
  },
  {
    key: 'Delivered',
    en: 'Delivered to Buyer',
    kn: 'ತಲುಪಿಸಲಾಗಿದೆ',
    hi: 'डिलीवर हुआ',
    icon: Home,
    defaultDescEn: 'Delivered to doorstep. 24-hour verification window active for artisan settlement.',
    defaultDescKn: 'ಗ್ರಾಹಕರ ಮನೆಗೆ ತಲುಪಿಸಲಾಗಿದೆ. ೨೪ ಗಂಟೆಗಳ ಪರಿಶೀಲನಾ ಅವಧಿ ಚಾಲ್ತಿಯಲ್ಲಿದೆ.',
    defaultDescHi: 'सफलतापूर्वक सुपुर्दगी। 24 घंटे का सत्यापन समय सक्रिय है।',
    stageTag: 'Doorstep'
  },
  {
    key: 'Payment Settled',
    en: 'Weaver Payout Settled',
    kn: 'ನೇಕಾರರಿಗೆ ಹಣ ಸಂದಾಯ',
    hi: 'बुनकर को भुगतान',
    icon: Coins,
    defaultDescEn: 'Full 100% fair-share amount credited directly to weaver bank account!',
    defaultDescKn: 'ಪೂರ್ಣ ಮೊತ್ತ ನೇರವಾಗಿ ನೇಕಾರರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಆಗಿದೆ!',
    defaultDescHi: 'पूरी राशि सीधे बुनकर के बैंक खाते में स्थानांतरित की गई!',
    stageTag: 'Fair Share Done'
  }
];

export const OrderTrackingProgressBar: React.FC<OrderTrackingProgressBarProps> = ({
  order,
  language,
  variant = 'full',
  onAdvanceStatus,
  showSimulateTrigger = false
}) => {
  const currentStepIndex = Math.max(
    0,
    ORDER_STEPS.findIndex(s => s.key === order.status)
  );

  const totalSteps = ORDER_STEPS.length;
  // Calculate continuous percentage from 0 to 100
  const progressPercent = Math.round((currentStepIndex / (totalSteps - 1)) * 100);

  const currentStepMeta = ORDER_STEPS[currentStepIndex] || ORDER_STEPS[0];
  const activeLabel = currentStepMeta[language] || currentStepMeta.en;

  // Find latest recorded description or fallback
  const latestHistory = order.trackingHistory && order.trackingHistory.length > 0
    ? order.trackingHistory[order.trackingHistory.length - 1]
    : null;

  const currentDesc = latestHistory?.description || currentStepMeta[`defaultDesc${language === 'kn' ? 'Kn' : language === 'hi' ? 'Hi' : 'En'}`];

  return (
    <div 
      id={`order-tracking-progress-container-${order.id}`}
      className="space-y-4"
    >
      {/* 1. HORIZONTAL PROGRESS BAR WITH SMOOTH ANIMATION */}
      <div 
        id={`order-horizontal-bar-card-${order.id}`}
        className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-border shadow-xs space-y-3.5 relative overflow-hidden"
      >
        {/* Top summary row: Current Status & Percentage Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-600 block">
              {language === 'kn' ? 'ಪ್ರಸ್ತುತ ಹಂತ' : language === 'hi' ? 'वर्तमान स्थिति' : 'Current Stage'}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={order.status}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center gap-1.5"
              >
                <div className="w-2 h-2 rounded-full bg-terracotta animate-ping"></div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal flex items-center gap-2">
                  {activeLabel}
                </h4>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-indigo-custom/10 text-indigo-custom text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              {currentStepMeta.stageTag}
            </span>
            
            {/* Animated percentage pill */}
            <motion.div 
              className="bg-terracotta text-cream px-2.5 py-1 rounded-xl text-xs font-black font-mono shadow-3xs flex items-center gap-1"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="w-3 h-3 text-mustard shrink-0" />
              <span>{progressPercent}%</span>
            </motion.div>
          </div>
        </div>

        {/* The Animated Progress Track */}
        <div className="relative pt-1 pb-1">
          {/* Background Track */}
          <div className="h-2.5 sm:h-3 w-full bg-cream-dark rounded-full overflow-hidden relative border border-cream-border/60">
            {/* Smooth Fill Bar */}
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-custom via-terracotta to-mustard relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ 
                type: 'spring', 
                stiffness: 70, 
                damping: 15,
                mass: 0.8
              }}
            >
              {/* Shimmer light effect moving on the bar */}
              <div className="absolute inset-0 bg-white/20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </motion.div>
          </div>

          {/* Stepper Dots overlaid along the track */}
          <div className="flex justify-between items-center -mt-2 sm:-mt-2.5 px-0.5 relative z-10 pointer-events-none">
            {ORDER_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isUpcoming = idx > currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <motion.div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors shadow-3xs ${
                      isPast
                        ? 'bg-indigo-custom border-indigo-custom text-white'
                        : isCurrent
                        ? 'bg-terracotta border-white text-white ring-2 ring-terracotta/40'
                        : 'bg-white border-gray-300 text-gray-300'
                    }`}
                    animate={{
                      scale: isCurrent ? 1.25 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {isPast ? (
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                    ) : isCurrent ? (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    ) : (
                      <span className="text-[8px] font-bold font-mono">{idx + 1}</span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Milestone Description Callout with Smooth Entrance */}
        <AnimatePresence mode="wait">
          <motion.div
            key={order.status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-cream/70 rounded-xl p-3 border border-cream-border flex items-start gap-2.5 text-xs text-charcoal"
          >
            <div className="p-1 rounded-lg bg-mustard/30 text-terracotta shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5 flex-1">
              <span className="font-bold text-[11px] text-indigo-custom block">
                {language === 'kn' ? 'ಇತ್ತೀಚಿನ ನವೀಕರಣ:' : language === 'hi' ? 'नवीनतम अपडेट:' : 'Latest Milestone:'}
              </span>
              <p className="text-[11px] text-gray-700 leading-relaxed font-serif italic">
                "{currentDesc}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Optional Interactive Simulation Button for Demonstrating Progress */}
        {showSimulateTrigger && onAdvanceStatus && (
          <div className="pt-2 border-t border-cream-border/70 flex items-center justify-between gap-3">
            <span className="text-[10px] text-gray-500 font-medium">
              {language === 'kn' ? 'ಸ್ಥಿತಿಯನ್ನು ಮುಂದಿನ ಹಂತಕ್ಕೆ ನವೀಕರಿಸಿ' : language === 'hi' ? 'अगले चरण पर जाएं' : 'Advance to next lifecycle step'}
            </span>
            <button
              id={`advance-status-btn-${order.id}`}
              onClick={onAdvanceStatus}
              className="px-3 py-1.5 rounded-xl bg-charcoal hover:bg-black text-cream text-xs font-bold flex items-center gap-1.5 transition shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-mustard" />
              <span>
                {currentStepIndex >= totalSteps - 1
                  ? (language === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : language === 'hi' ? 'रीसेट करें' : 'Reset Flow')
                  : (language === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : language === 'hi' ? 'अगला चरण' : 'Simulate Next Step')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 2. DETAILED VERTICAL MILESTONE TIMELINE (Full Variant) */}
      {variant === 'full' && (
        <div 
          id={`order-vertical-milestones-${order.id}`}
          className="bg-white rounded-2xl p-5 border border-cream-border space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-cream-border pb-3">
            <h3 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta" />
              <span>{language === 'kn' ? 'ಹಂತ-ಹಂತದ ಟ್ರ್ಯಾಕಿಂಗ್ ವಿವರ' : language === 'hi' ? 'चरण-दर-चरण ट्रैकिंग विवरण' : 'Detailed Dispatch & QC Milestones'}</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-gray-400">
              {currentStepIndex + 1} of {totalSteps} Completed
            </span>
          </div>

          <div className="relative pl-7 space-y-6 pt-1">
            {/* Continuous background vertical track */}
            <div className="absolute left-[13px] top-3 bottom-4 w-0.5 bg-gray-200">
              {/* Filled active vertical track */}
              <motion.div
                className="w-full bg-gradient-to-b from-indigo-custom via-terracotta to-mustard origin-top"
                initial={{ height: '0%' }}
                animate={{ 
                  height: `${Math.min(100, Math.max(0, (currentStepIndex / (totalSteps - 1)) * 100))}%` 
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            {ORDER_STEPS.map((stepMeta, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isUpcoming = idx > currentStepIndex;

              const IconComponent = stepMeta.icon;
              const title = stepMeta[language] || stepMeta.en;
              
              // Look up recorded timestamp & description from order history if available
              const recordedEntry = order.trackingHistory?.find(h => h.status === stepMeta.key);
              const stepDescription = recordedEntry?.description || stepMeta[`defaultDesc${language === 'kn' ? 'Kn' : language === 'hi' ? 'Hi' : 'En'}`];
              const stepTime = recordedEntry?.timestamp;

              return (
                <motion.div
                  key={stepMeta.key}
                  className="relative flex items-start gap-3.5 text-xs group"
                  initial={false}
                  animate={{ opacity: isUpcoming ? 0.45 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Step node icon circle */}
                  <motion.div
                    className={`absolute -left-7 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition shadow-3xs ${
                      isPast
                        ? 'bg-indigo-custom border-indigo-custom text-white'
                        : isCurrent
                        ? 'bg-terracotta border-white text-white ring-4 ring-terracotta/20 ring-offset-1 ring-offset-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    animate={{
                      scale: isCurrent ? [1, 1.15, 1] : 1
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut'
                    }}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <IconComponent className="w-3 h-3" />
                    )}
                  </motion.div>

                  {/* Content for this milestone */}
                  <div className={`space-y-1 flex-1 transition-all ${isCurrent ? 'bg-cream/40 p-3 rounded-xl border border-mustard/30 -mt-1.5' : ''}`}>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                          isCurrent 
                            ? 'text-terracotta font-extrabold text-xs' 
                            : isPast 
                            ? 'text-charcoal font-bold' 
                            : 'text-gray-400'
                        }`}>
                          {title}
                        </h4>
                        {isCurrent && (
                          <span className="bg-terracotta text-cream text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-widest animate-pulse">
                            Active
                          </span>
                        )}
                      </div>

                      {stepTime && (
                        <span className="text-[9px] font-mono text-gray-600 font-semibold">
                          {new Date(stepTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] leading-relaxed ${
                      isCurrent 
                        ? 'text-charcoal font-serif font-medium' 
                        : isPast 
                        ? 'text-gray-600' 
                        : 'text-gray-400'
                    }`}>
                      {stepDescription}
                    </p>

                    {/* Special QC inspection badge when viewing Quality Checked step */}
                    {stepMeta.key === 'Quality Checked' && (isPast || isCurrent) && order.qualityCheck && (
                      <div className="mt-2 bg-white/90 border border-emerald-300 rounded-lg p-2 text-[10px] text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Weaver Verified Checklist:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[9px] text-emerald-700">
                          {order.qualityCheck.looseThreadsRemoved && <li>Loose warp/weft threads trimmed</li>}
                          {order.qualityCheck.stitchingVerified && <li>Pallu & border zari integrity checked</li>}
                          {order.qualityCheck.checkedForDamage && <li>Zero stain/tear physical inspection passed</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
