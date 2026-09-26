import React, { useState } from 'react';
import { Sparkles, IndianRupee, HelpCircle, ArrowRight, Check, X, RefreshCw, BarChart2, ShieldCheck, Info } from 'lucide-react';
import { Language, PricingRecommendation } from '../types';
import { playSyntheticChime, pickLang } from '../data';
import { BackButton } from './BackButton';

interface AiDynamicPricingModalProps {
  currentPrice: number;
  initialMaterialCost?: number;
  initialLabourHours?: number;
  initialHourlyWageRate?: number;
  category?: string;
  craftType?: string;
  language?: Language;
  onApplyPrice: (newPrice: number, recommendation?: PricingRecommendation) => void;
  onClose: () => void;
}

export const AiDynamicPricingModal: React.FC<AiDynamicPricingModalProps> = ({
  currentPrice,
  initialMaterialCost = 2500,
  initialLabourHours = 40,
  initialHourlyWageRate = 65,
  category = 'Sarees',
  craftType = 'Pit-loom Weaving',
  language = 'en',
  onApplyPrice,
  onClose
}) => {
  const copy = pickLang({
    en: { title: 'AI Dynamic Fair-Pricing', subtitle: 'Cost-Plus Heritage Valuation Engine', inputs: 'Craft Costing Inputs:', material: 'Raw Material Cost (₹):', labour: 'Artisan Labor Hours:', complexity: 'Hourly Wage Rate (₹):', current: 'Current / Draft Price:', calculate: 'Calculate Fair Price Recommendation', loading: 'Analyzing Craft Cost Benchmarks...', recommendation: 'Recommended Fair Valuation:', range: 'Fair Market Range:', earnings: 'Artisan Net (92%)', logic: 'Economic Logic & Wage Benchmark:', apply: 'Apply', keep: 'Keep', notice: 'Recommendation does not change the price automatically. Tap below to accept or keep your original price.' },
    kn: { title: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯ ನ್ಯಾಯಯುತ ಬೆಲೆ', subtitle: 'ವೆಚ್ಚ ಮತ್ತು ಪರಂಪರೆ ಮೌಲ್ಯಮಾಪನ', inputs: 'ಕರಕುಶಲ ವೆಚ್ಚದ ವಿವರಗಳು:', material: 'ಕಚ್ಚಾ ವಸ್ತು ವೆಚ್ಚ (₹):', labour: 'ಕುಶಲಕರ್ಮಿಯ ಕೆಲಸದ ಗಂಟೆಗಳು:', complexity: 'ಗಂಟೆಗೆ ಕೂಲಿ ದರ (₹):', current: 'ಪ್ರಸ್ತುತ / ಕರಡು ಬೆಲೆ:', calculate: 'ನ್ಯಾಯಯುತ ಬೆಲೆ ಶಿಫಾರಸು ಲೆಕ್ಕಿಸಿ', loading: 'ಕರಕುಶಲ ವೆಚ್ಚದ ಮಾನದಂಡಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...', recommendation: 'ಶಿಫಾರಸು ಮಾಡಿದ ನ್ಯಾಯಯುತ ಮೌಲ್ಯ:', range: 'ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ವ್ಯಾಪ್ತಿ:', earnings: 'ಕುಶಲಕರ್ಮಿಯ ನಿವ್ವಳ ಆದಾಯ (೯೨%)', logic: 'ಆರ್ಥಿಕ ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ವೇತನ ಮಾನದಂಡ:', apply: 'ಉತ್ಪನ್ನಕ್ಕೆ ಅನ್ವಯಿಸಿ', keep: 'ಉಳಿಸಿ', notice: 'ಶಿಫಾರಸು ಬೆಲೆಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಬದಲಾಯಿಸುವುದಿಲ್ಲ. ಕೆಳಗಿನ ಆಯ್ಕೆಯಿಂದ ಒಪ್ಪಿಕೊಳ್ಳಿ ಅಥವಾ ಮೂಲ ಬೆಲೆ ಉಳಿಸಿ.' },
    hi: { title: 'एआई उचित मूल्य निर्धारण', subtitle: 'लागत और विरासत मूल्यांकन इंजन', inputs: 'शिल्प लागत विवरण:', material: 'कच्ची सामग्री लागत (₹):', labour: 'कारीगर के श्रम घंटे:', complexity: 'प्रति घंटा मजदूरी दर (₹):', current: 'वर्तमान / ड्राफ्ट मूल्य:', calculate: 'उचित मूल्य सुझाव की गणना करें', loading: 'शिल्प लागत मानकों का विश्लेषण हो रहा है...', recommendation: 'सुझाया गया उचित मूल्य:', range: 'उचित बाजार सीमा:', earnings: 'कारीगर की शुद्ध कमाई (92%)', logic: 'आर्थिक गणना और मजदूरी मानक:', apply: 'उत्पाद पर लागू करें', keep: 'रखें', notice: 'सुझाव से मूल्य अपने आप नहीं बदलेगा। नीचे स्वीकार करें या मूल मूल्य रखें।' },
    ta: { title: 'AI நியாயமான விலை நிர்ணயம்', subtitle: 'செலவு + பாரம்பரிய மதிப்பீட்டு இயந்திரம்', inputs: 'கைவினை செலவு உள்ளீடுகள்:', material: 'மூலப்பொருள் செலவு (₹):', labour: 'கைவினைஞர் உழைப்பு நேரம்:', complexity: 'மணிநேர கூலி விகிதம் (₹):', current: 'தற்போதைய / வரைவு விலை:', calculate: 'நியாயமான விலை பரிந்துரையைக் கணக்கிடவும்', loading: 'கைவினை செலவு அளவுகோல்களை பகுப்பாய்வு செய்கிறது...', recommendation: 'பரிந்துரைக்கப்பட்ட நியாயமான மதிப்பு:', range: 'நியாயமான சந்தை வரம்பு:', earnings: 'கைவினைஞர் நிகர வருமானம் (92%)', logic: 'பொருளாதார தர்க்கம் & ஊதிய அளவுகோல்:', apply: 'பயன்படுத்து', keep: 'வைத்திரு', notice: 'பரிந்துரை விலையை தானாக மாற்றாது. கீழே ஏற்கவும் அல்லது அசல் விலையை வைத்திருக்கவும்.' }
  }, language);
  // Input parameters
  const [materialCost, setMaterialCost] = useState<number>(initialMaterialCost);
  const [labourHours, setLabourHours] = useState<number>(initialLabourHours);
  const [hourlyWageRate, setHourlyWageRate] = useState<number>(initialHourlyWageRate);
  const [productionDays, setProductionDays] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<PricingRecommendation | null>(null);

  // Calculate recommendation either via API or deterministic fallback
  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    playSyntheticChime('click');

    try {
      const res = await fetch('/api/pricing/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialCost,
          labourHours,
          hourlyWageRate,
          category,
          craftType,
          productionDays,
          currentPrice
        })
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
        playSyntheticChime('success');
      } else {
        throw new Error(data.error || 'Server calculation failed');
      }
    } catch (e) {
      console.warn('Using client-side pricing fallback', e);
      // Fair Price = Raw Material Cost + (Artisan Work Hours x Hourly Wage Rate)
      const calculatedFairPrice = Math.round((Number(materialCost) + (Number(labourHours) * Number(hourlyWageRate))) / 50) * 50;

      const rangeMin = Math.round((calculatedFairPrice * 0.92) / 50) * 50;
      const rangeMax = Math.round((calculatedFairPrice * 1.08) / 50) * 50;
      const platformFee = Math.round(calculatedFairPrice * 0.03);
      const otherCosts = Math.round(calculatedFairPrice * 0.05);
      const estimatedArtisanEarnings = calculatedFairPrice - platformFee - otherCosts;

      const explanation = `Fair price for this ${craftType}: ₹${materialCost.toLocaleString()} raw materials + ${labourHours} artisan hours at ₹${hourlyWageRate}/hr = ₹${calculatedFairPrice.toLocaleString()}.`;

      const fallbackRec: PricingRecommendation = {
        currentPrice,
        recommendedPrice: calculatedFairPrice,
        rangeMin,
        rangeMax,
        estimatedArtisanEarnings,
        platformFee,
        otherCosts,
        estimatedNetEarnings: estimatedArtisanEarnings,
        explanation,
        materialCost: Number(materialCost),
        labourHours: Number(labourHours),
        hourlyWageRate: Number(hourlyWageRate),
        category,
        craftType,
        productionDays,
        isDemo: true,
        generatedAt: new Date().toISOString()
      };

      setRecommendation(fallbackRec);
      playSyntheticChime('success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!recommendation) return;
    playSyntheticChime('success');
    // Notice: The price changes ONLY after explicit artisan click!
    onApplyPrice(recommendation.recommendedPrice, recommendation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 overflow-y-auto">
      <div className="bg-white border border-cream-border rounded-3xl p-6 sm:p-8 text-left max-w-lg w-full shadow-2xl my-8">

        {/* Modal Header */}
        <div className="flex justify-between items-start pb-5 mb-6 border-b border-cream-border">
          <BackButton language={language} onBack={onClose} />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-charcoal">
                {copy.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {copy.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-mustard/15 text-amber-900 border border-mustard/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              DEMO / SANDBOX
            </span>
            <button
              id="close-pricing-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-cream-dark text-charcoal transition border border-cream-border"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5">

        {/* Input Parameters Section */}
        <div className="bg-white border border-cream-border rounded-2xl shadow-xs p-5 space-y-4 text-xs">
          <h4 className="font-serif font-bold text-charcoal text-sm">
            {copy.inputs}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                {copy.material}
              </label>
              <input
                type="number"
                min={0}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                value={materialCost}
                onChange={(e) => setMaterialCost(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-cream/40 border border-cream-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-terracotta"
              />
              <span className="text-[9px] text-gray-400 mt-1 block">{language === 'kn' ? 'ಜರಿ, ರೇಷ್ಮೆ/ಹತ್ತಿ ದಾರ, ಬಣ್ಣಗಳು' : language === 'hi' ? 'जरी, रेशम/कपास के धागे, रंग' : 'Zari, silk/cotton yarns, dyes'}</span>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                {copy.labour}
              </label>
              <input
                type="number"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                value={labourHours}
                onChange={(e) => setLabourHours(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-cream/40 border border-cream-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-terracotta"
              />
              <span className="text-[9px] text-gray-400 mt-1 block">{language === 'kn' ? 'ಒಟ್ಟು ಕೆಲಸದ ಗಂಟೆಗಳು' : language === 'hi' ? 'कुल श्रम घंटे' : 'Total craft hours dedicated'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                {copy.complexity}
              </label>
              <input
                type="number"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                value={hourlyWageRate}
                onChange={(e) => setHourlyWageRate(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-cream/40 border border-cream-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                {copy.current}
              </label>
              <div className="w-full bg-cream-dark/40 border border-cream-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-700">
                ₹{(currentPrice ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          <button
            id="calculate-ai-pricing-btn"
            disabled={isLoading}
            onClick={handleGenerateRecommendation}
            className="w-full bg-indigo-custom hover:bg-indigo-custom/90 text-cream font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-mustard" />
                <span>{copy.loading}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-mustard" />
                <span>{copy.calculate}</span>
              </>
            )}
          </button>
        </div>

        {/* Recommendation Output Display */}
        {recommendation && (
          <div className="bg-white p-5 rounded-2xl border-2 border-terracotta/40 space-y-4 shadow-xs animate-fade-in text-xs">

            <div className="flex items-center justify-between border-b border-cream-border pb-4">
              <div>
                <span className="text-[10px] text-terracotta font-black uppercase tracking-wider block">
                  {copy.recommendation}
                </span>
                <p className="text-2xl font-serif font-bold text-charcoal mt-1">
                  ₹{(recommendation.recommendedPrice ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  {copy.range}
                </span>
                <p className="text-xs font-mono font-bold text-indigo-custom mt-1">
                  ₹{(recommendation.rangeMin ?? 0).toLocaleString()} – ₹{(recommendation.rangeMax ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Direct Earnings Breakdown
              </span>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider block">
                    {copy.earnings}
                  </span>
                  <p className="font-serif font-bold text-emerald-900 text-sm mt-1">
                    ₹{(recommendation.estimatedArtisanEarnings ?? 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-cream/40 p-3 rounded-xl border border-cream-border">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                    Platform Fee (3%)
                  </span>
                  <p className="font-serif font-semibold text-gray-700 text-sm mt-1">
                    ₹{(recommendation.platformFee ?? 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-cream/40 p-3 rounded-xl border border-cream-border">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                    Packaging / Logistics (5%)
                  </span>
                  <p className="font-serif font-semibold text-gray-700 text-sm mt-1">
                    ₹{(recommendation.otherCosts ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Plain Language Cost-Plus Rationale */}
            <div className="bg-cream/60 p-4 rounded-xl border border-cream-border text-[11px] text-charcoal leading-relaxed font-serif">
              <span className="font-bold text-indigo-custom block font-sans text-[10px] uppercase tracking-wider mb-1.5">
                {copy.logic}
              </span>
              "{recommendation.explanation}"
            </div>

            {/* Notice regarding explicit acceptance */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 italic">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>
                {copy.notice}
              </span>
            </div>

            {/* Apply Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                id="apply-recommended-price-btn"
                type="button"
                onClick={handleApply}
                className="flex-1 bg-emerald-600 hover:bg-emerald-600/90 text-cream font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{copy.apply} ₹{(recommendation.recommendedPrice ?? 0).toLocaleString()}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-cream-dark text-charcoal border-2 border-charcoal font-bold py-3 px-4 rounded-xl text-xs transition"
              >
                {copy.keep} ₹{(currentPrice ?? 0).toLocaleString()}
              </button>
            </div>

          </div>
        )}

        </div>
      </div>
    </div>
  );
};
