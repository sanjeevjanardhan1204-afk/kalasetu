import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, IndianRupee, AlertCircle, ArrowRight, Lock, ExternalLink, Zap } from 'lucide-react';
import { Order, PaymentProtection, OrderMilestone } from '../types';
import { playSyntheticChime } from '../data';

interface PaymentProtectionTrackerProps {
  order: Order;
  onUpdateOrder?: (updatedOrder: Order) => void;
  userRole?: 'artisan' | 'buyer' | 'admin';
}

export const PaymentProtectionTracker: React.FC<PaymentProtectionTrackerProps> = ({
  order,
  onUpdateOrder,
  userRole = 'buyer'
}) => {
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
      setErrorMessage('Cannot release funds: This order has an active dispute. All payouts are paused.');
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
        setErrorMessage(data.error || 'Failed to release milestone');
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
              TantuLink Payment Protection
            </h4>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              Smart Milestone Escrow Protocol
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
            Order Total
          </span>
          <p className="font-serif font-bold text-charcoal text-sm mt-0.5">
            ₹{(protection?.orderTotal ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
          <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider block">
            Released to Weaver
          </span>
          <p className="font-serif font-bold text-emerald-800 text-sm mt-0.5">
            ₹{(protection?.releasedAmount ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
          <span className="text-[9px] text-indigo-700 font-bold uppercase tracking-wider block">
            Held in Escrow
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
              Escrow Payouts Locked
            </span>
            <p className="text-[11px] text-rose-800 mt-0.5">
              Active dispute on this order. All milestone releases are frozen until admin resolution.
            </p>
          </div>
        </div>
      )}

      {/* Milestone Breakdown List */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
          3-Stage Milestone Payout Schedule:
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
                      {idx === 0 ? 'Released upon order confirmation' : idx === 1 ? 'Released when making begins & QC passes' : 'Released upon final verified delivery'}
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
                    <span>{isReleasing ? 'Releasing...' : 'Release'}</span>
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
        <span className="font-bold text-charcoal block">Artisan & Buyer Protection Guarantee:</span>
        Funds are held in neutral escrow. 20% advances materials to the weaver upfront, 40% releases on craft completion, and 40% releases on verified handloom delivery.
      </div>

    </div>
  );
};
