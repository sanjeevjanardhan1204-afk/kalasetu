import React, { useState } from 'react';
import { ShieldCheck, Award, MapPin, Calendar, FileText, CheckCircle2, Clock, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { GiInfo, Product } from '../types';
import { playSyntheticChime } from '../data';
import { authHeaders } from '../utils/authClient';
import { BackButton } from './BackButton';

interface GiModalProps {
  product: Product;
  onClose: () => void;
  onUpdateProductGi?: (updatedProduct: Product) => void;
  // Only a verified admin session (real JWT, checked server-side on the verify/reject call
  // itself) sees the Admin Review Tool tab at all - no more public "Admin Review Tool" tab.
  isAdmin?: boolean;
}

export const GiModal: React.FC<GiModalProps> = ({
  product,
  onClose,
  onUpdateProductGi,
  isAdmin = false
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'admin'>('details');

  const gi = product.giInfo;

  const handleAdminVerify = async (newStatus: 'VERIFIED' | 'REJECTED') => {
    setIsVerifying(true);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/products/${product.id}/gi/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          status: newStatus,
          verificationSource: newStatus === 'VERIFIED' ? 'Geographical Indications Registry of India (Govt. of India)' : undefined,
          verificationDate: newStatus === 'VERIFIED' ? new Date().toISOString().split('T')[0] : undefined,
          notes: adminNotes || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.product) {
        if (onUpdateProductGi) {
          onUpdateProductGi(data.product);
        }
        playSyntheticChime('success');
      }
    } catch (e) {
      console.error('GI verification request error', e);
      // Fallback local update for offline resiliency
      if (gi && onUpdateProductGi) {
        const updated: Product = {
          ...product,
          giInfo: {
            ...gi,
            status: newStatus,
            verificationDate: newStatus === 'VERIFIED' ? new Date().toISOString().split('T')[0] : undefined,
            verificationSource: newStatus === 'VERIFIED' ? 'Geographical Indications Registry of India (Govt. of India)' : undefined,
            notes: adminNotes || undefined
          }
        };
        onUpdateProductGi(updated);
        playSyntheticChime('success');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (!gi) {
    return (
      <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 overflow-y-auto">
        <div className="bg-white border border-cream-border rounded-3xl p-6 sm:p-7 text-left max-w-md w-full shadow-2xl space-y-5">
          <div className="flex justify-between items-start pb-4 border-b border-cream-border">
            <BackButton onBack={onClose} />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Geographical Indication (GI)
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-cream-dark text-charcoal transition border border-cream-border"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 bg-cream/40 border border-cream-border rounded-2xl p-4">
            This product has not yet submitted Geographical Indication (GI) verification documents.
          </p>
        </div>
      </div>
    );
  }

  const isVerified = gi.status === 'VERIFIED';
  const isPending = gi.status === 'PENDING';
  const isRejected = gi.status === 'REJECTED';

  return (
    <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 overflow-y-auto">
      <div className="bg-white border border-cream-border rounded-3xl p-6 sm:p-8 text-left max-w-lg w-full shadow-2xl my-8">

        {/* Modal Header */}
        <div className="flex justify-between items-start pb-5 mb-6 border-b border-cream-border">
          <BackButton onBack={onClose} />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-charcoal">
                Geographical Indication Details
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Intellectual Property & Heritage Protection
              </p>
            </div>
          </div>
          <button
            id="close-gi-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-cream-dark text-charcoal transition border border-cream-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">

        {/* Status Banner */}
        <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${
          isVerified 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : isPending 
            ? 'bg-amber-50 border-amber-200 text-amber-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {isVerified ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : isPending ? (
              <Clock className="w-6 h-6 text-amber-600 shrink-0 animate-pulse" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block">
                Verification Status
              </span>
              <p className="font-serif font-bold text-sm">
                {isVerified ? 'GI VERIFIED' : isPending ? 'VERIFICATION PENDING' : 'GI SUBMISSION REJECTED'}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isVerified 
              ? 'bg-emerald-600 text-white' 
              : isPending 
              ? 'bg-amber-600 text-white' 
              : 'bg-rose-600 text-white'
          }`}>
            {gi.status}
          </span>
        </div>

        {/* Tabs for Details vs Admin Verification Flow - Admin Review Tool only renders for a
            verified admin session; the actual verify/reject call is also checked server-side. */}
        <div className="flex gap-1.5 bg-cream/50 border border-cream-border rounded-full p-1.5">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'details'
                ? 'bg-indigo-custom text-white'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            Certificate & Specs
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-terracotta text-white'
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <span>Admin Review Tool</span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">Demo</span>
            </button>
          )}
        </div>

        {activeTab === 'details' || !isAdmin ? (
          /* Specification Grid */
          <div className="bg-white border border-cream-border rounded-2xl shadow-xs p-5 space-y-4 text-xs">
            <h4 className="font-serif font-bold text-charcoal text-sm">Registered Specification</h4>
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-cream-border">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  1. Product Name
                </span>
                <p className="font-bold text-charcoal text-sm mt-1">{gi.productName}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  2. Registration Number
                </span>
                <p className="font-mono font-bold text-indigo-custom text-sm mt-1">{gi.registrationNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-cream-border">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  3. Origin
                </span>
                <p className="font-bold text-charcoal mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  {gi.origin}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  4. State / Region
                </span>
                <p className="font-bold text-charcoal mt-1">{gi.stateRegion}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-cream-border">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  5. Category
                </span>
                <p className="font-semibold text-charcoal mt-1">{gi.category}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  6. Verification Date
                </span>
                <p className="font-semibold text-charcoal mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {gi.verificationDate || 'Under evaluation'}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                7. Verification Source
              </span>
              <p className="font-semibold text-gray-700 mt-1 italic">
                {gi.verificationSource || 'Pending government registry audit'}
              </p>
            </div>

            {gi.verifiedBy && (
              <div className="pt-3 border-t border-cream-border">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  8. Verified By
                </span>
                <p className="font-semibold text-emerald-800 mt-1">
                  {gi.verifiedBy}
                </p>
              </div>
            )}

            {gi.notes && (
              <div className="bg-cream/40 p-3 rounded-xl border border-cream-border text-[11px] text-gray-600">
                <span className="font-bold text-charcoal block">Registry Notes:</span>
                {gi.notes}
              </div>
            )}
          </div>
        ) : (
          /* Admin / Demo Review Panel */
          <div className="bg-white border border-cream-border rounded-2xl shadow-xs p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-charcoal text-sm">
                Authority Action (Registry Simulation)
              </h4>
              <span className="text-[10px] text-terracotta bg-cream px-2 py-0.5 rounded-full font-bold">
                Admin Flow
              </span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              In production, artisans submit GI registration documents which enter the queue with status <span className="font-bold text-amber-700">PENDING</span>. Regulators and platform admins review credentials against the official Geographical Indications Registry before approving.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Verification Notes (Optional)
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g., Verified against GI Registry Application #382."
                className="w-full bg-cream/40 border border-cream-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-terracotta"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                id="admin-verify-gi-btn"
                disabled={isVerifying || isVerified}
                onClick={() => handleAdminVerify('VERIFIED')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  isVerified
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-600/90 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify GI Badge</span>
              </button>
              <button
                id="admin-reject-gi-btn"
                disabled={isVerifying || isRejected}
                onClick={() => handleAdminVerify('REJECTED')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  isRejected
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-[11px] text-gray-500 text-center font-medium pt-1">
          Protected under Geographical Indications of Goods (Registration and Protection) Act, 1999
        </div>

        </div>
      </div>
    </div>
  );
};
