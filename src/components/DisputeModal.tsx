import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, 
  RotateCcw, ArrowRight, MessageSquare, IndianRupee, 
  X, HelpCircle, FileText, Send 
} from 'lucide-react';
import { Order, OrderDispute, DisputeStatus } from '../types';
import { playSyntheticChime } from '../data';
import { BackButton } from './BackButton';

interface DisputeModalProps {
  order: Order;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  initialMode?: 'raise' | 'view' | 'artisan-respond' | 'admin-resolve';
}

const DISPUTE_REASONS = [
  'Product not as described',
  'Defective / Damaged weave',
  'Wrong dimensions / measurements',
  'Authenticity / GI concern',
  'Delivery issue / Delayed package',
  'Other craft dispute'
];

export const DisputeModal: React.FC<DisputeModalProps> = ({
  order,
  onClose,
  onUpdateOrder,
  initialMode = 'view'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'artisan-respond' | 'admin-resolve'>(
    order.dispute ? (initialMode === 'admin-resolve' ? 'admin-resolve' : initialMode === 'artisan-respond' ? 'artisan-respond' : 'details') : 'details'
  );

  // Form for raising dispute
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form for artisan response
  const [artisanMessage, setArtisanMessage] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  // Form for admin resolution
  const [adminAction, setAdminAction] = useState<'RELEASE PAYMENT' | 'REFUND BUYER' | 'PARTIAL REFUND' | 'REQUEST MORE INFORMATION'>('RELEASE PAYMENT');
  const [partialRefundAmount, setPartialRefundAmount] = useState<number>(
    Math.round((order.paymentProtection?.pendingAmount || order.product.price) * 0.5)
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const dispute = order.dispute;

  // 1. Buyer: Raise Dispute
  const handleRaiseDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please provide a detailed description of the issue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/orders/${order.id}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          description,
          evidenceUrl: evidenceUrl || undefined,
          buyerName: order.buyerName
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        onUpdateOrder(data.order);
        playSyntheticChime('success');
      } else {
        setErrorMsg(data.error || 'Failed to register dispute');
      }
    } catch (e) {
      console.error('Raise dispute error', e);
      // Fallback local update
      const now = new Date().toISOString();
      const newDispute: OrderDispute = {
        id: `disp-${Date.now()}`,
        status: 'OPEN',
        reason,
        description,
        evidenceUrl: evidenceUrl || undefined,
        createdAt: now,
        updatedAt: now,
        buyerName: order.buyerName
      };

      const updated: Order = {
        ...order,
        dispute: newDispute
      };
      onUpdateOrder(updated);
      playSyntheticChime('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Artisan: Respond to Dispute
  const handleArtisanRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisanMessage.trim()) {
      setErrorMsg('Please enter a response message.');
      return;
    }

    setIsResponding(true);
    setErrorMsg(null);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/orders/${order.id}/disputes/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: artisanMessage })
      });

      const data = await res.json();
      if (data.success && data.order) {
        onUpdateOrder(data.order);
        playSyntheticChime('success');
        setActiveTab('details');
      } else {
        setErrorMsg(data.error || 'Failed to submit artisan response');
      }
    } catch (e) {
      console.error('Artisan response error', e);
      if (dispute) {
        const now = new Date().toISOString();
        const updated: Order = {
          ...order,
          dispute: {
            ...dispute,
            status: 'UNDER REVIEW',
            artisanResponse: {
              message: artisanMessage,
              respondedAt: now
            },
            updatedAt: now
          }
        };
        onUpdateOrder(updated);
        playSyntheticChime('success');
        setActiveTab('details');
      }
    } finally {
      setIsResponding(false);
    }
  };

  // 3. Admin: Resolve Dispute
  const handleAdminResolve = async () => {
    setIsResolving(true);
    setErrorMsg(null);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/orders/${order.id}/disputes/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: adminAction,
          amount: adminAction === 'PARTIAL REFUND' ? partialRefundAmount : undefined,
          notes: adminNotes || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        onUpdateOrder(data.order);
        playSyntheticChime('success');
        setActiveTab('details');
      } else {
        setErrorMsg(data.error || 'Failed to resolve dispute');
      }
    } catch (e) {
      console.error('Admin resolve error', e);
      if (dispute) {
        const now = new Date().toISOString();
        let nextStatus: DisputeStatus = 'RESOLVED';
        if (adminAction === 'RELEASE PAYMENT') nextStatus = 'PAYMENT RELEASED';
        else if (adminAction === 'REFUND BUYER') nextStatus = 'REFUNDED';
        else if (adminAction === 'REQUEST MORE INFORMATION') nextStatus = 'UNDER REVIEW';

        const updatedDispute: OrderDispute = {
          ...dispute,
          status: nextStatus,
          resolution: {
            action: adminAction,
            amount: adminAction === 'PARTIAL REFUND' ? partialRefundAmount : undefined,
            resolvedAt: now,
            notes: adminNotes || `Resolution: ${adminAction}`
          },
          updatedAt: now
        };

        const updated: Order = {
          ...order,
          dispute: updatedDispute
        };
        onUpdateOrder(updated);
        playSyntheticChime('success');
        setActiveTab('details');
      }
    } finally {
      setIsResolving(false);
    }
  };

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">OPEN</span>;
      case 'UNDER REVIEW':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">UNDER REVIEW</span>;
      case 'RESOLVED':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">RESOLVED</span>;
      case 'REFUNDED':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">REFUNDED</span>;
      case 'PAYMENT RELEASED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">PAYMENT RELEASED</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-cream border-2 border-terracotta rounded-3xl p-5 sm:p-6 text-left max-w-lg w-full shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-cream-border/60 pb-3">
          <BackButton onBack={onClose} />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Dispute & Refund Resolution
              </h3>
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                Order #{order.id} • Value: ₹{order.product.price}
              </p>
            </div>
          </div>
          <button
            id="close-dispute-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-cream-dark text-charcoal transition border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If no dispute exists, show the Raise Dispute form */}
        {!dispute ? (
          <form onSubmit={handleRaiseDispute} className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-cream-border space-y-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Select Dispute Reason:
              </span>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-cream border border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-charcoal focus:outline-none focus:border-terracotta"
              >
                {DISPUTE_REASONS.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Detailed Description:
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the defect, measurement mismatch, or issue with the handloom piece..."
                  rows={3}
                  className="w-full bg-cream border border-gray-300 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Evidence URL / Photo Notes (Optional):
                </span>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://... or photo reference description"
                  className="w-full bg-cream border border-gray-300 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMsg}
              </p>
            )}

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
              <span className="font-bold block">Important Protection Rule:</span>
              Submitting a dispute sets status to <span className="font-bold">OPEN</span> and immediately freezes all pending milestone releases from escrow until investigation concludes.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Dispute...' : 'Submit Formal Dispute'}</span>
            </button>
          </form>
        ) : (
          /* Dispute Already Active: View Details / Artisan Response / Admin Resolve Tabs */
          <div className="space-y-4">
            
            {/* Nav Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-cream-border/60 pb-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'details' ? 'bg-indigo-custom text-white' : 'text-gray-600 hover:bg-cream-dark'
                }`}
              >
                Dispute Overview
              </button>
              <button
                onClick={() => setActiveTab('artisan-respond')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTab === 'artisan-respond' ? 'bg-terracotta text-white' : 'text-gray-600 hover:bg-cream-dark'
                }`}
              >
                <span>Weaver Response</span>
                {dispute.artisanResponse && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
              <button
                onClick={() => setActiveTab('admin-resolve')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTab === 'admin-resolve' ? 'bg-purple-700 text-white' : 'text-gray-600 hover:bg-cream-dark'
                }`}
              >
                <span>Admin Resolution</span>
                <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded-md font-mono">4 Actions</span>
              </button>
            </div>

            {/* TAB 1: Details */}
            {activeTab === 'details' && (
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-cream-border text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Dispute ID & Date
                    </span>
                    <span className="font-mono font-bold text-charcoal">{dispute.id}</span>
                  </div>
                  <div>{getStatusBadge(dispute.status)}</div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Reason
                  </span>
                  <p className="font-bold text-rose-700 text-sm mt-0.5">{dispute.reason}</p>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Buyer Statement ({dispute.buyerName || 'Buyer'})
                  </span>
                  <p className="text-gray-700 mt-0.5 bg-cream p-2.5 rounded-xl border border-cream-border font-serif italic">
                    "{dispute.description}"
                  </p>
                </div>

                {dispute.artisanResponse && (
                  <div>
                    <span className="text-[10px] text-indigo-custom font-bold uppercase tracking-wider block">
                      Weaver Explanation ({order.product.weaverName})
                    </span>
                    <p className="text-indigo-950 mt-0.5 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 font-serif italic">
                      "{dispute.artisanResponse.message}"
                    </p>
                  </div>
                )}

                {dispute.resolution && (
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                      Official Admin Resolution ({dispute.resolution.action})
                    </span>
                    <p className="text-emerald-950 text-xs font-semibold">
                      {dispute.resolution.notes}
                    </p>
                    {dispute.resolution.amount !== undefined && (
                      <p className="text-emerald-900 font-mono font-bold text-[11px]">
                        Amount: ₹{(dispute.resolution.amount ?? 0).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Weaver Response Flow */}
            {activeTab === 'artisan-respond' && (
              <form onSubmit={handleArtisanRespond} className="bg-white p-4 rounded-2xl border border-cream-border space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Artisan Response Channel</h4>
                  <p className="text-[11px] text-gray-500">
                    Artisans can explain their weaving technique, yarn details, or acknowledge mistakes. Submitting updates status to <span className="font-bold text-amber-700">UNDER REVIEW</span>.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Artisan Statement:
                  </label>
                  <textarea
                    value={artisanMessage}
                    onChange={(e) => setArtisanMessage(e.target.value)}
                    placeholder="Describe how the craft was prepared, yarn purity certification, or offer replacement..."
                    rows={3}
                    className="w-full bg-cream border border-gray-300 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResponding || !artisanMessage.trim()}
                  className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isResponding ? 'Sending Response...' : 'Submit Weaver Explanation'}</span>
                </button>
              </form>
            )}

            {/* TAB 3: Admin Resolution Tool (Simulates the 4 specified actions) */}
            {activeTab === 'admin-resolve' && (
              <div className="bg-white p-4 rounded-2xl border border-cream-border space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Admin Resolution Workbench</h4>
                  <p className="text-[11px] text-gray-500">
                    Choose one of the 4 standard resolution outcomes to conclude this dispute.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Resolution Action:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'RELEASE PAYMENT', label: 'Release Payment', desc: 'Disburse escrow to weaver' },
                      { id: 'REFUND BUYER', label: 'Refund Buyer', desc: 'Full refund to buyer' },
                      { id: 'PARTIAL REFUND', label: 'Partial Refund', desc: 'Split / Compromise amount' },
                      { id: 'REQUEST MORE INFORMATION', label: 'Request More Info', desc: 'Keep Under Review' }
                    ].map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => setAdminAction(act.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          adminAction === act.id
                            ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-[11px] font-bold leading-tight">{act.label}</span>
                        <span className="block text-[9px] text-gray-400 font-normal mt-0.5">{act.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {adminAction === 'PARTIAL REFUND' && (
                  <div className="space-y-1 bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <label className="text-[10px] text-purple-900 font-bold uppercase tracking-wider block">
                      Partial Refund Amount (₹):
                    </label>
                    <input
                      type="number"
                      value={partialRefundAmount}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      onChange={(e) => setPartialRefundAmount(Math.max(1, Number(e.target.value) || 1))}
                      max={order.paymentProtection?.pendingAmount || order.product.price}
                      min={1}
                      className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-purple-700 block">
                      Max available in escrow: ₹{((order.paymentProtection?.pendingAmount || order.product?.price) ?? 0).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Admin Resolution Finding / Notes:
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g., Photos verified; weave density consistent with master specifications."
                    className="w-full bg-cream border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>

                <button
                  type="button"
                  disabled={isResolving}
                  onClick={handleAdminResolve}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isResolving ? 'Executing Resolution...' : `Apply Resolution: ${adminAction}`}</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
