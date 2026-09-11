import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, IndianRupee, AlertCircle, ArrowRight, Lock, ExternalLink, Zap } from 'lucide-react';
import { Language, Order, PaymentProtection, OrderMilestone } from '../types';
import { playSyntheticChime } from '../data';

interface PaymentProtectionTrackerProps {
  order: Order;
  onUpdateOrder?: (updatedOrder: Order) => void;
  userRole?: 'artisan' | 'buyer' | 'admin';
  language?: Language;
}

export const PaymentProtectionTracker: React.FC<PaymentProtectionTrackerProps> = ({
  order,
  onUpdateOrder,
  userRole = 'buyer',
  language = 'en'
}) => {
  const copy = {
    en: { title: 'TantuLink Payment Protection', subtitle: 'Smart Milestone Escrow Protocol', total: 'Order Total', released: 'Released to Artisan', held: 'Held in Escrow', locked: 'Escrow Payouts Locked', lockedText: 'Active dispute on this order. All milestone releases are frozen until admin resolution.', schedule: '3-Stage Milestone Payout Schedule:', confirmed: 'Released upon order confirmation', making: 'Released when making begins & QC passes', delivered: 'Released upon final verified delivery', release: 'Release', releasing: 'Releasing...', guarantee: 'Artisan & Buyer Protection Guarantee:', guaranteeText: 'Funds are held in neutral escrow. 20% advances materials to the artisan upfront, 40% releases on craft completion, and 40% releases on verified delivery.', blocked: 'Cannot release funds: This order has an active dispute. All payouts are paused.', failed: 'Failed to release milestone' },
    kn: { title: 'ತಂತುಲಿಂಕ್ ಪಾವತಿ ರಕ್ಷಣೆ', subtitle: 'ಸ್ಮಾರ್ಟ್ ಹಂತದ ಎಸ್ಕ್ರೋ ವ್ಯವಸ್ಥೆ', total: 'ಆರ್ಡರ್ ಒಟ್ಟು', released: 'ಕುಶಲಕರ್ಮಿಗೆ ಬಿಡುಗಡೆ', held: 'ಎಸ್ಕ್ರೋದಲ್ಲಿ ಹಿಡಿದಿರುವುದು', locked: 'ಎಸ್ಕ್ರೋ ಪಾವತಿಗಳು ಲಾಕ್ ಆಗಿವೆ', lockedText: 'ಈ ಆರ್ಡರ್‌ನಲ್ಲಿ ಸಕ್ರಿಯ ವಿವಾದವಿದೆ. ನಿರ್ವಾಹಕರ ಪರಿಹಾರವಾಗುವವರೆಗೆ ಎಲ್ಲಾ ಹಂತದ ಬಿಡುಗಡೆಗಳು ನಿಲ್ಲುತ್ತವೆ.', schedule: '೩ ಹಂತದ ಪಾವತಿ ವೇಳಾಪಟ್ಟಿ:', confirmed: 'ಆರ್ಡರ್ ದೃಢೀಕರಣದ ನಂತರ ಬಿಡುಗಡೆ', making: 'ತಯಾರಿಕೆ ಮತ್ತು ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆಯ ನಂತರ ಬಿಡುಗಡೆ', delivered: 'ಅಂತಿಮ ಪರಿಶೀಲಿತ ವಿತರಣೆಯ ನಂತರ ಬಿಡುಗಡೆ', release: 'ಬಿಡುಗಡೆ', releasing: 'ಬಿಡುಗಡೆಯಾಗುತ್ತಿದೆ...', guarantee: 'ಕುಶಲಕರ್ಮಿ ಮತ್ತು ಖರೀದಿದಾರರ ರಕ್ಷಣೆ:', guaranteeText: 'ಹಣವನ್ನು ತಟಸ್ಥ ಎಸ್ಕ್ರೋದಲ್ಲಿ ಇರಿಸಲಾಗುತ್ತದೆ. ೨೦% ಸಾಮಗ್ರಿಗಳಿಗೆ ಮುಂಗಡ, ೪೦% ಕರಕುಶಲ ಪೂರ್ಣಗೊಂಡಾಗ ಮತ್ತು ೪೦% ಪರಿಶೀಲಿತ ವಿತರಣೆಯ ನಂತರ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.', blocked: 'ಹಣ ಬಿಡುಗಡೆ ಸಾಧ್ಯವಿಲ್ಲ: ಈ ಆರ್ಡರ್‌ನಲ್ಲಿ ಸಕ್ರಿಯ ವಿವಾದವಿದೆ. ಎಲ್ಲಾ ಪಾವತಿಗಳನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ.', failed: 'ಹಂತ ಬಿಡುಗಡೆ ವಿಫಲವಾಗಿದೆ' },
    hi: { title: 'तंतुलिंक भुगतान सुरक्षा', subtitle: 'स्मार्ट चरणबद्ध एस्क्रो व्यवस्था', total: 'ऑर्डर कुल', released: 'कारीगर को जारी', held: 'एस्क्रो में सुरक्षित', locked: 'एस्क्रो भुगतान लॉक है', lockedText: 'इस ऑर्डर पर सक्रिय विवाद है। व्यवस्थापक के समाधान तक सभी चरणों का भुगतान रुका है।', schedule: '3 चरणों की भुगतान योजना:', confirmed: 'ऑर्डर की पुष्टि पर जारी', making: 'निर्माण और गुणवत्ता जांच पर जारी', delivered: 'अंतिम सत्यापित डिलीवरी पर जारी', release: 'जारी करें', releasing: 'जारी हो रहा है...', guarantee: 'कारीगर और खरीदार सुरक्षा गारंटी:', guaranteeText: 'धन सुरक्षित एस्क्रो में रखा जाता है। 20% सामग्री के लिए अग्रिम, 40% शिल्प पूरा होने पर और 40% सत्यापित डिलीवरी पर जारी होता है।', blocked: 'धन जारी नहीं किया जा सकता: इस ऑर्डर पर सक्रिय विवाद है। सभी भुगतान रुके हैं।', failed: 'चरण भुगतान जारी नहीं हो सका' }
  }[language];
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const protection: PaymentProtection = order.paymentProtection || {
    isDemo: true,
    label: 'DEMO / SANDBOX',
    orderTotal: order.product.price,
    paymentSecured: order.product.price,
    releasedAmount: 0,
    pendingAmount: order.product.price,
    refundedAmount: 0,
    milestones: [
      {
        id: `m-${order.id}-1`,
        name: 'ORDER CONFIRMED',
        percentage: 20,
        amount: Math.round(order.product.price * 0.20),
        status: 'PENDING'
      },
      {
        id: `m-${order.id}-2`,
        name: 'CRAFTING / MAKING',
        percentage: 40,
        amount: Math.round(order.product.price * 0.40),
        status: 'PENDING'
      },
      {
        id: `m-${order.id}-3`,
        name: 'DELIVERED',
        percentage: 40,
        amount: order.product.price - Math.round(order.product.price * 0.20) - Math.round(order.product.price * 0.40),
        status: 'PENDING'
      }
    ]
  };

  const hasActiveDispute = order.dispute && (order.dispute.status === 'OPEN' || order.dispute.status === 'UNDER REVIEW');

  const handleReleaseMilestone = async (milestone: OrderMilestone) => {
    if (milestone.status === 'RELEASED') return;

    if (hasActiveDispute) {
      setErrorMessage(copy.blocked);
      playSyntheticChime('stop');
      return;
    }

    setErrorMessage(null);
    setReleasingId(milestone.id);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/orders/${order.id}/milestones/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id })
      });

      const data = await res.json();
      if (data.success && data.order) {
        if (onUpdateOrder) {
          onUpdateOrder(data.order);
        }
        playSyntheticChime('success');
      } else {
        setErrorMessage(data.error || copy.failed);
        playSyntheticChime('stop');
      }
    } catch (e) {
      console.error('Milestone release error', e);
      // Fallback local update for offline testing
      const now = new Date().toISOString();
      const updatedMilestones = protection.milestones.map(m => 
        m.id === milestone.id 
          ? { ...m, status: 'RELEASED' as const, releasedAt: now, transactionId: `TXN-LOC-${Date.now()}` }
          : m
      );

      const newReleased = protection.releasedAmount + milestone.amount;
      const newPending = Math.max(0, protection.paymentSecured - newReleased - protection.refundedAmount);

      const updatedOrder: Order = {
        ...order,
        paymentProtection: {
          ...protection,
          releasedAmount: newReleased,
          pendingAmount: newPending,
          milestones: updatedMilestones
        }
      };

      if (onUpdateOrder) {
        onUpdateOrder(updatedOrder);
      }
      playSyntheticChime('success');
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-custom/15 p-4 shadow-xs space-y-4" id={`payment-protection-box-${order.id}`}>
      
      {/* Header with Title & DEMO Badge */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-custom/10 text-indigo-custom rounded-xl">
            <ShieldCheck className="w-5 h-5 text-indigo-custom" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-charcoal flex items-center gap-1.5">
              {copy.title}
            </h4>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              {copy.subtitle}
            </p>
          </div>
        </div>

        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
          {protection.label || 'DEMO / SANDBOX'}
        </span>
      </div>

      {/* Escrow Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-cream p-2.5 rounded-xl border border-cream-border">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
            {copy.total}
          </span>
          <p className="font-serif font-bold text-charcoal text-sm mt-0.5">
            ₹{(protection?.orderTotal ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
          <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider block">
            {copy.released}
          </span>
          <p className="font-serif font-bold text-emerald-800 text-sm mt-0.5">
            ₹{(protection?.releasedAmount ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
          <span className="text-[9px] text-indigo-700 font-bold uppercase tracking-wider block">
            {copy.held}
          </span>
          <p className="font-serif font-bold text-indigo-900 text-sm mt-0.5">
            ₹{(protection?.pendingAmount ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Active Dispute Paused Notice */}
      {hasActiveDispute && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
          <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-[11px] uppercase tracking-wider">
              {copy.locked}
            </span>
            <p className="text-[11px] text-rose-800 mt-0.5">
              {copy.lockedText}
            </p>
          </div>
        </div>
      )}

      {/* Milestone Breakdown List */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
          {copy.schedule}
        </span>

        {protection.milestones.map((m, idx) => {
          const isReleased = m.status === 'RELEASED';
          const isReleasing = releasingId === m.id;

          return (
            <div 
              key={m.id || idx}
              className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                isReleased
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isReleased 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                }`}>
                  {isReleased ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-charcoal">
                      Stage {idx + 1}: {m.name} ({m.percentage}%)
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                      isReleased 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  {isReleased ? (
                    <div className="text-[10px] text-gray-500 mt-0.5 font-mono flex flex-wrap gap-x-2">
                      <span>Txn: {m.transactionId || 'TXN-SETTLED'}</span>
                      {m.releasedAt && <span>• {new Date(m.releasedAt).toLocaleDateString()}</span>}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {idx === 0 ? copy.confirmed : idx === 1 ? copy.making : copy.delivered}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span className="font-serif font-bold text-sm text-charcoal">
                  ₹{(m?.amount ?? 0).toLocaleString()}
                </span>

                {/* Simulated Release Button (for demonstration and testing) */}
                {!isReleased && (
                  <button
                    id={`release-milestone-btn-${m.id}`}
                    disabled={isReleasing || hasActiveDispute}
                    onClick={() => handleReleaseMilestone(m)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition ${
                      hasActiveDispute
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-terracotta hover:bg-terracotta-dark text-white shadow-2xs cursor-pointer'
                    }`}
                    title="Release this milestone in demo sandbox"
                  >
                    <Zap className="w-3 h-3 text-mustard" />
                    <span>{isReleasing ? copy.releasing : copy.release}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Explanatory Safety Seal */}
      <div className="bg-cream/60 rounded-xl p-2.5 border border-cream-border text-[10px] text-gray-500 leading-relaxed">
        <span className="font-bold text-charcoal block">{copy.guarantee}</span>
        {copy.guaranteeText}
      </div>

    </div>
  );
};
