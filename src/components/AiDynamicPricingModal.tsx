import React, { useState } from 'react';
import { Sparkles, IndianRupee, HelpCircle, ArrowRight, Check, X, RefreshCw, BarChart2, ShieldCheck, Info } from 'lucide-react';
import { PricingRecommendation } from '../types';
import { playSyntheticChime } from '../data';

interface AiDynamicPricingModalProps {
  currentPrice: number;
  initialMaterialCost?: number;
  initialLabourHours?: number;
  initialComplexity?: 'Standard' | 'Medium' | 'Masterpiece';
  category?: string;
  craftType?: string;
  onApplyPrice: (newPrice: number, recommendation?: PricingRecommendation) => void;
  onClose: () => void;
}

export const AiDynamicPricingModal: React.FC<AiDynamicPricingModalProps> = ({
  currentPrice,
  initialMaterialCost = 2500,
  initialLabourHours = 40,
  initialComplexity = 'Medium',
  category = 'Sarees',
  craftType = 'Pit-loom Weaving',
  onApplyPrice,
  onClose
}) => {
  // Input parameters
  const [materialCost, setMaterialCost] = useState<number>(initialMaterialCost);
  const [labourHours, setLabourHours] = useState<number>(initialLabourHours);
  const [craftComplexity, setCraftComplexity] = useState<'Standard' | 'Medium' | 'Masterpiece'>(initialComplexity);
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
          craftComplexity,
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
      // Fallback deterministic calculation
      const hourlyBenchmark = craftComplexity === 'Masterpiece' ? 85 : craftComplexity === 'Medium' ? 65 : 50;
      const complexityMultiplier = craftComplexity === 'Masterpiece' ? 1.35 : craftComplexity === 'Medium' ? 1.20 : 1.10;
      const directCost = Number(materialCost) + (Number(labourHours) * hourlyBenchmark);
      const calculatedFairPrice = Math.round((directCost * complexityMultiplier) / 50) * 50;
      
      const rangeMin = Math.round((calculatedFairPrice * 0.92) / 50) * 50;
      const rangeMax = Math.round((calculatedFairPrice * 1.08) / 50) * 50;
      const platformFee = Math.round(calculatedFairPrice * 0.03);
      const otherCosts = Math.round(calculatedFairPrice * 0.05);
      const estimatedArtisanEarnings = calculatedFairPrice - platformFee - otherCosts;

      const explanation = `Fair-price benchmark for ${craftComplexity.toLowerCase()} ${craftType}: Includes ₹${materialCost.toLocaleString()} raw materials + ${labourHours} artisan hours at ₹${hourlyBenchmark}/hr master labor rate. With a ${Math.round((complexityMultiplier - 1) * 100)}% heritage skill premium, fair direct market valuation ranges from ₹${rangeMin.toLocaleString()} to ₹${rangeMax.toLocaleString()}.`;

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
        craftComplexity,
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
    <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-cream border-2 border-terracotta rounded-3xl p-5 sm:p-6 text-left max-w-lg w-full shadow-2xl space-y-5 my-8">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-cream-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <span>AI Dynamic Fair-Pricing</span>
              </h3>
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                Cost-Plus Heritage Valuation Engine
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              DEMO / SANDBOX
            </span>
            <button
              id="close-pricing-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-cream-dark text-charcoal transition border border-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Parameters Section */}
        <div className="bg-white p-4 rounded-2xl border border-cream-border space-y-3.5 text-xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            Craft Costing Inputs:
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Raw Material Cost (₹):
              </label>
              <input
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(Math.max(0, Number(e.target.value)))}
                className="w-full bg-cream border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-terracotta"
              />
              <span className="text-[9px] text-gray-400 mt-0.5 block">Zari, silk/cotton yarns, dyes</span>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Artisan Labor Hours:
              </label>
              <input
                type="number"
                value={labourHours}
                onChange={(e) => setLabourHours(Math.max(1, Number(e.target.value)))}
                className="w-full bg-cream border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-terracotta"
              />
              <span className="text-[9px] text-gray-400 mt-0.5 block">Total loom hours dedicated</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Craft Complexity:
              </label>
              <select
                value={craftComplexity}
                onChange={(e) => setCraftComplexity(e.target.value as any)}
                className="w-full bg-cream border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-terracotta"
              >
                <option value="Standard">Standard (Plain weave)</option>
                <option value="Medium">Medium (Jacquard / Zari)</option>
                <option value="Masterpiece">Masterpiece (Intricate Brocade)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Current / Draft Price:
              </label>
              <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-700">
                ₹{(currentPrice ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          <button
            id="calculate-ai-pricing-btn"
            disabled={isLoading}
            onClick={handleGenerateRecommendation}
            className="w-full bg-indigo-custom hover:bg-indigo-light text-cream font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-mustard" />
                <span>Analyzing Handloom Cost Benchmarks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-mustard" />
                <span>Calculate Fair Price Recommendation</span>
              </>
            )}
          </button>
        </div>

        {/* Recommendation Output Display */}
        {recommendation && (
          <div className="bg-white p-4 rounded-2xl border-2 border-terracotta/40 space-y-4 shadow-sm animate-fade-in text-xs">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-terracotta font-black uppercase tracking-wider block">
                  Recommended Fair Valuation:
                </span>
                <p className="text-2xl font-serif font-bold text-charcoal mt-0.5">
                  ₹{(recommendation.recommendedPrice ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Fair Market Range:
                </span>
                <p className="text-xs font-mono font-bold text-indigo-custom mt-0.5">
                  ₹{(recommendation.rangeMin ?? 0).toLocaleString()} – ₹{(recommendation.rangeMax ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Direct Earnings Breakdown:
              </span>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider block">
                    Weaver Net (92%)
                  </span>
                  <p className="font-serif font-bold text-emerald-900 text-sm mt-0.5">
                    ₹{(recommendation.estimatedArtisanEarnings ?? 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                    Platform Fee (3%)
                  </span>
                  <p className="font-serif font-semibold text-gray-700 text-sm mt-0.5">
                    ₹{(recommendation.platformFee ?? 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                    Packaging / Logistics (5%)
                  </span>
                  <p className="font-serif font-semibold text-gray-700 text-sm mt-0.5">
                    ₹{(recommendation.otherCosts ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Plain Language Cost-Plus Rationale */}
            <div className="bg-cream/60 p-3 rounded-xl border border-cream-border text-[11px] text-charcoal leading-relaxed font-serif">
              <span className="font-bold text-indigo-custom block font-sans text-[10px] uppercase tracking-wider mb-1">
                Economic Logic & Wage Benchmark:
              </span>
              "{recommendation.explanation}"
            </div>

            {/* Notice regarding explicit acceptance */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 italic">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>
                Recommendation does not change the price automatically. Tap below to accept or keep your original price.
              </span>
            </div>

            {/* Apply Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                id="apply-recommended-price-btn"
                type="button"
                onClick={handleApply}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-cream font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Apply ₹{(recommendation.recommendedPrice ?? 0).toLocaleString()} to Product</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-cream-dark text-gray-600 border border-gray-300 font-bold py-3 px-4 rounded-xl text-xs transition"
              >
                Keep ₹{(currentPrice ?? 0).toLocaleString()}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
