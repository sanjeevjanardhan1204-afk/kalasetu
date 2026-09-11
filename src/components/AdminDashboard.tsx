import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, AlertTriangle, CheckCircle2, Clock, 
  ArrowRight, RefreshCw, IndianRupee, FileText, Check, X, 
  Search, ExternalLink, HelpCircle, User, ArrowLeft, LogOut,
  Layers, ShoppingBag, Landmark, ChevronRight, Eye, ShieldAlert
} from 'lucide-react';
import { Product, Order, Language, TransactionHistoryEntry } from '../types';
import { playSyntheticChime } from '../data';

interface AdminDashboardProps {
  language: Language;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onSwitchMode: (mode: 'weaver' | 'buyer') => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  products,
  setProducts,
  orders,
  setOrders,
  onSwitchMode,
  onLogout
}) => {
  // Navigation Tabs: 'gi' | 'disputes' | 'transactions'
  const [activeTab, setActiveTab] = useState<'gi' | 'disputes' | 'transactions'>('gi');
  
  // GI Verification states
  const [giFilter, setGiFilter] = useState<'pending' | 'all'>('pending');
  const [processingGiId, setProcessingGiId] = useState<string | null>(null);
  const [rejectModalProduct, setRejectModalProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Dispute resolution states
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [partialRefundOrder, setPartialRefundOrder] = useState<Order | null>(null);
  const [partialRefundAmount, setPartialRefundAmount] = useState<string>('');
  const [requestInfoOrder, setRequestInfoOrder] = useState<Order | null>(null);
  const [requestInfoNotes, setRequestInfoNotes] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Transactions state
  const [transactions, setTransactions] = useState<TransactionHistoryEntry[]>([]);
  const [isLoadingTxns, setIsLoadingTxns] = useState<boolean>(false);

  // Pending GI products list
  const pendingGiProducts = products.filter(p => p.giInfo && p.giInfo.status === 'PENDING');
  const displayedGiProducts = giFilter === 'pending' 
    ? pendingGiProducts 
    : products.filter(p => p.giInfo);

  // Open/Active disputes list
  const activeDisputes = orders.filter(o => o.dispute && (o.dispute.status === 'OPEN' || o.dispute.status === 'UNDER REVIEW'));
  const allDisputes = orders.filter(o => o.dispute);

  // Fetch transactions on mount or tab change
  const fetchTransactions = async () => {
    setIsLoadingTxns(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      }
    } catch (e) {
      console.warn('Fallback: synthesizing transaction history from orders', e);
      // Synthesize from orders
      const list: TransactionHistoryEntry[] = [];
      orders.forEach(o => {
        if (o.transactionHistory) {
          list.push(...o.transactionHistory);
        }
      });
      setTransactions(list);
    } finally {
      setIsLoadingTxns(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [orders]);

  // Flash message helper
  const showSuccessBanner = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Handle GI Verify
  const handleVerifyGi = async (product: Product) => {
    setProcessingGiId(product.id);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/products/${product.id}/gi/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'VERIFIED',
          verificationSource: 'Geographical Indications Registry of India, Govt. of India',
          verificationDate: new Date().toISOString().split('T')[0],
          verifiedBy: 'TantuLink Administrative Cell (admin@tantulink.demo)',
          notes: 'Verified against national GI registry database standards.'
        })
      });

      const data = await res.json();
      if (data.success && data.product) {
        const updated = {
          ...product,
          ...data.product,
          id: product.id,
          giInfo: data.product.giInfo || {
            ...(product.giInfo!),
            status: 'VERIFIED' as const,
            verificationDate: new Date().toISOString().split('T')[0],
            verificationSource: 'Geographical Indications Registry of India, Govt. of India',
            verifiedBy: 'TantuLink Administrative Cell (admin@tantulink.demo)'
          }
        };
        setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
        playSyntheticChime('success');
        showSuccessBanner(`✓ Successfully verified GI status for "${product.title}". Buyer view will now display the 🟢 GI VERIFIED ✓ badge.`);
      } else {
        throw new Error(data.error || 'Failed to verify');
      }
    } catch (err: any) {
      console.warn('GI verification fallback local update', err);
      const updatedGi = {
        ...(product.giInfo!),
        status: 'VERIFIED' as const,
        verificationDate: new Date().toISOString().split('T')[0],
        verificationSource: 'Geographical Indications Registry of India, Govt. of India',
        verifiedBy: 'TantuLink Administrative Cell (admin@tantulink.demo)'
      };
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, giInfo: updatedGi } : p));
      playSyntheticChime('success');
      showSuccessBanner(`✓ Successfully verified GI status for "${product.title}". Buyer view will now display the 🟢 GI VERIFIED ✓ badge.`);
    } finally {
      setProcessingGiId(null);
    }
  };

  // Handle GI Reject
  const handleConfirmRejectGi = async () => {
    if (!rejectModalProduct) return;
    const product = rejectModalProduct;
    setProcessingGiId(product.id);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/products/${product.id}/gi/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          notes: rejectionReason || 'Documentation could not be validated against the active GI repository.'
        })
      });

      const data = await res.json();
      if (data.success && data.product) {
        const updated = {
          ...product,
          ...data.product,
          id: product.id,
          giInfo: data.product.giInfo || {
            ...(product.giInfo!),
            status: 'REJECTED' as const,
            notes: rejectionReason || 'Documentation could not be validated against the active GI repository.'
          }
        };
        setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
        playSyntheticChime('success');
        showSuccessBanner(`GI application for "${product.title}" has been rejected.`);
      } else {
        throw new Error(data.error || 'Failed to reject');
      }
    } catch (err) {
      const updatedGi = {
        ...(product.giInfo!),
        status: 'REJECTED' as const,
        notes: rejectionReason || 'Documentation could not be validated against the active GI repository.'
      };
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, giInfo: updatedGi } : p));
      playSyntheticChime('success');
      showSuccessBanner(`GI application for "${product.title}" has been rejected.`);
    } finally {
      setProcessingGiId(null);
      setRejectModalProduct(null);
      setRejectionReason('');
    }
  };

  // Handle Dispute Resolution Actions
  const handleResolveDispute = async (
    orderId: string, 
    action: 'RELEASE PAYMENT' | 'REFUND BUYER' | 'PARTIAL REFUND' | 'REQUEST MORE INFORMATION',
    amount?: number,
    notes?: string
  ) => {
    setProcessingOrderId(orderId);
    playSyntheticChime('click');

    try {
      const res = await fetch(`/api/orders/${orderId}/disputes/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount, notes })
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        playSyntheticChime('success');
        showSuccessBanner(`✓ Dispute resolution applied: ${action} for Order #${orderId}.`);
        fetchTransactions();
      } else {
        throw new Error(data.error || 'Failed to resolve dispute');
      }
    } catch (err: any) {
      console.warn('Dispute resolve local fallback', err);
      // Local fallback
      setOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString();
        const updatedDispute = {
          ...(o.dispute!),
          status: action === 'REQUEST MORE INFORMATION' ? ('UNDER REVIEW' as const) : ('RESOLVED' as const),
          updatedAt: now,
          resolution: action !== 'REQUEST MORE INFORMATION' ? {
            action,
            amount,
            resolvedAt: now,
            notes: notes || `Admin applied ${action}`
          } : undefined
        };
        return { ...o, dispute: updatedDispute };
      }));
      playSyntheticChime('success');
      showSuccessBanner(`✓ Dispute resolution applied: ${action}.`);
    } finally {
      setProcessingOrderId(null);
      setPartialRefundOrder(null);
      setPartialRefundAmount('');
      setRequestInfoOrder(null);
      setRequestInfoNotes('');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6 text-charcoal font-sans" id="admin-dashboard-container">
      
      {/* Top Admin Identification Banner */}
      <div className="bg-charcoal text-cream rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-terracotta/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
                ADMIN DASHBOARD
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full">
                ADMINISTRATOR
              </span>
            </div>
            <p className="text-xs text-cream/70 mt-0.5">
              Logged in as: <strong className="text-amber-300 font-mono">admin@tantulink.demo</strong> • Geographical Indication & Trust Verifier
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switchers */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-cream/10">
          <button
            id="admin-switch-weaver-btn"
            onClick={() => {
              playSyntheticChime('click');
              onSwitchMode('weaver');
            }}
            className="px-3 py-2 bg-cream/10 hover:bg-cream/20 text-cream rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-cream/20"
            title="Switch to Weaver Dashboard"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>Weaver View</span>
          </button>

          <button
            id="admin-switch-buyer-btn"
            onClick={() => {
              playSyntheticChime('click');
              onSwitchMode('buyer');
            }}
            className="px-3 py-2 bg-cream/10 hover:bg-cream/20 text-cream rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-cream/20"
            title="Switch to Buyer View to see verified badges"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
            <span>Buyer View</span>
          </button>

          <button
            id="admin-logout-btn"
            onClick={() => {
              playSyntheticChime('click');
              onLogout();
            }}
            className="px-3 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Log out from Admin account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert Banner */}
      {actionSuccessMsg && (
        <div 
          id="admin-action-success-banner"
          className="bg-emerald-50 border-2 border-emerald-500 text-emerald-950 p-4 rounded-2xl flex items-center gap-3 shadow-md animate-fadeIn"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold">{actionSuccessMsg}</p>
        </div>
      )}

      {/* Main Admin Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-cream-border flex gap-1 shadow-xs" id="admin-main-tabs">
        
        {/* 1. GI Verification Tab */}
        <button
          id="admin-tab-gi-verification"
          onClick={() => {
            playSyntheticChime('click');
            setActiveTab('gi');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${
            activeTab === 'gi'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-gray-600 hover:text-charcoal hover:bg-cream/40'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>GI VERIFICATION</span>
          {pendingGiProducts.length > 0 && (
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-extrabold ${
              activeTab === 'gi' ? 'bg-white text-terracotta' : 'bg-terracotta text-white'
            }`}>
              {pendingGiProducts.length} PENDING
            </span>
          )}
        </button>

        {/* 2. Disputes Tab */}
        <button
          id="admin-tab-disputes"
          onClick={() => {
            playSyntheticChime('click');
            setActiveTab('disputes');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${
            activeTab === 'disputes'
              ? 'bg-charcoal text-white shadow-sm'
              : 'text-gray-600 hover:text-charcoal hover:bg-cream/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>DISPUTES</span>
          {activeDisputes.length > 0 && (
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-extrabold ${
              activeTab === 'disputes' ? 'bg-amber-400 text-charcoal' : 'bg-amber-500 text-white'
            }`}>
              {activeDisputes.length} ACTIVE
            </span>
          )}
        </button>

        {/* 3. Transactions Tab */}
        <button
          id="admin-tab-transactions"
          onClick={() => {
            playSyntheticChime('click');
            setActiveTab('transactions');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-indigo-custom text-white shadow-sm'
              : 'text-gray-600 hover:text-charcoal hover:bg-cream/40'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>TRANSACTIONS</span>
          <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-extrabold ${
            activeTab === 'transactions' ? 'bg-white text-indigo-custom' : 'bg-gray-200 text-charcoal'
          }`}>
            {transactions.length}
          </span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* SECTION 1: GI VERIFICATION */}
      {/* ========================================================= */}
      {activeTab === 'gi' && (
        <div className="space-y-4 animate-fadeIn" id="admin-gi-verification-section">
          
          {/* Subheader & filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-cream-border">
            <div>
              <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
                <Award className="w-5 h-5 text-terracotta" />
                Geographical Indication (GI) Submissions
              </h2>
              <p className="text-xs text-gray-500">
                Review submitted GI proof documents and certify authentic regional handlooms.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-cream/40 p-1 rounded-xl border border-cream-border shrink-0">
              <button
                id="filter-gi-pending-btn"
                onClick={() => setGiFilter('pending')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  giFilter === 'pending'
                    ? 'bg-terracotta text-white shadow-2xs'
                    : 'text-gray-600 hover:text-charcoal'
                }`}
              >
                Pending Submissions ({pendingGiProducts.length})
              </button>
              <button
                id="filter-gi-all-btn"
                onClick={() => setGiFilter('all')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  giFilter === 'all'
                    ? 'bg-charcoal text-white shadow-2xs'
                    : 'text-gray-600 hover:text-charcoal'
                }`}
              >
                All Products ({products.filter(p => p.giInfo).length})
              </button>
            </div>
          </div>

          {/* Submissions List */}
          {displayedGiProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-cream-border p-8 text-center space-y-3">
              <Award className="w-12 h-12 mx-auto text-gray-300" />
              <h3 className="font-serif font-bold text-base text-charcoal">
                {giFilter === 'pending' ? 'No Pending GI Submissions' : 'No GI Tagged Products Found'}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {giFilter === 'pending' 
                  ? 'All pending submissions have been reviewed. When a weaver submits GI info during product creation, it appears here for admin verification.'
                  : 'Products with GI tags will appear here.'}
              </p>
              {giFilter === 'pending' && (
                <button
                  onClick={() => setGiFilter('all')}
                  className="text-xs text-terracotta font-bold hover:underline"
                >
                  View all certified products →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3" id="admin-pending-gi-list">
              {displayedGiProducts.map((product) => {
                const gi = product.giInfo!;
                const isPending = gi.status === 'PENDING';
                const isVerified = gi.status === 'VERIFIED';
                const isRejected = gi.status === 'REJECTED';
                const isProcessing = processingGiId === product.id;

                return (
                  <div
                    key={product.id}
                    id={`admin-gi-card-${product.id}`}
                    className={`bg-white rounded-3xl border-2 p-5 shadow-xs transition hover:border-terracotta/40 space-y-4 ${
                      isPending ? 'border-amber-300 bg-amber-50/20' : isVerified ? 'border-emerald-200' : 'border-rose-200'
                    }`}
                  >
                    {/* Top Row: Product Info & Status */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      <div className="flex items-start gap-4">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-cream-border shrink-0 shadow-2xs"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-cream-dark flex items-center justify-center text-gray-400 shrink-0">
                            <Award className="w-8 h-8" />
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isVerified
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isPending
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {isVerified && <Check className="w-3 h-3 text-emerald-700" />}
                              {isPending && <Clock className="w-3 h-3 text-amber-700" />}
                              {isRejected && <X className="w-3 h-3 text-rose-700" />}
                              <span>GI {gi.status}</span>
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">ID: {product.id}</span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-charcoal leading-snug">
                            {product.title}
                          </h3>

                          <p className="text-xs text-gray-500">
                            Artisan: <strong className="text-charcoal font-semibold">{product.weaverName}</strong> • {product.weaverRegion}
                          </p>

                          <p className="text-sm font-extrabold text-terracotta font-serif">
                            ₹{(product?.price ?? 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Verification Action Buttons */}
                      <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                        {isPending ? (
                          <>
                            <button
                              id={`admin-verify-btn-${product.id}`}
                              disabled={isProcessing}
                              onClick={() => handleVerifyGi(product)}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isProcessing ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                              <span>[VERIFY]</span>
                            </button>

                            <button
                              id={`admin-reject-btn-${product.id}`}
                              disabled={isProcessing}
                              onClick={() => {
                                playSyntheticChime('click');
                                setRejectModalProduct(product);
                              }}
                              className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>[REJECT]</span>
                            </button>
                          </>
                        ) : isVerified ? (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-center">
                            <span className="text-xs font-black block">🟢 GI VERIFIED ✓</span>
                            <span className="text-[10px] text-emerald-700 block mt-0.5">Visible to all buyers</span>
                            <button
                              onClick={() => {
                                playSyntheticChime('click');
                                setRejectModalProduct(product);
                              }}
                              className="text-[10px] text-rose-600 font-bold hover:underline mt-1.5 block mx-auto"
                            >
                              Revoke / Reject
                            </button>
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-center">
                            <span className="text-xs font-black block">REJECTED</span>
                            <button
                              onClick={() => handleVerifyGi(product)}
                              className="text-[10px] text-emerald-700 font-bold hover:underline mt-1 block"
                            >
                              Re-verify
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* GI Submission Details Grid */}
                    <div className="bg-cream/40 rounded-2xl p-4 border border-cream-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                          GI Registration No.
                        </span>
                        <span className="font-mono font-bold text-terracotta text-sm">
                          {gi.registrationNumber || 'Pending Assignment'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                          Certified Craft Name
                        </span>
                        <span className="font-bold text-charcoal">
                          {gi.productName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                          Origin & Region
                        </span>
                        <span className="font-medium text-charcoal">
                          {gi.origin}, {gi.stateRegion}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                          Registered Category
                        </span>
                        <span className="font-medium text-charcoal">
                          {gi.category || 'Textiles & Handlooms'}
                        </span>
                      </div>
                    </div>

                    {/* Verification Source / Notes */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 px-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span>Source: {gi.verificationSource || 'Self-attested with weaver guild certificate'}</span>
                      </div>
                      {gi.verificationDate && (
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>Certified on: {gi.verificationDate}</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: DISPUTES */}
      {/* ========================================================= */}
      {activeTab === 'disputes' && (
        <div className="space-y-4 animate-fadeIn" id="admin-disputes-section">
          
          <div className="bg-white p-4 rounded-2xl border border-cream-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                Customer & Artisan Disputes
              </h2>
              <p className="text-xs text-gray-500">
                Arbitrate escrow dispute cases with direct milestone release, buyer refunds, or information requests.
              </p>
            </div>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-xl">
              {activeDisputes.length} Active Disputes
            </span>
          </div>

          {allDisputes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-cream-border p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
              <h3 className="font-serif font-bold text-base text-charcoal">
                No Disputes Currently Logged
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                All order transactions are protected under standard milestone escrow. When a buyer raises a dispute from their order tracking page, it will appear here for admin resolution.
              </p>
            </div>
          ) : (
            <div className="space-y-4" id="admin-disputes-list">
              {allDisputes.map((order) => {
                const dispute = order.dispute!;
                const isProcessing = processingOrderId === order.id;
                const isResolved = dispute.status === 'RESOLVED' || dispute.status === 'REFUNDED' || dispute.status === 'PAYMENT RELEASED';
                const protection = order.paymentProtection;

                return (
                  <div
                    key={order.id}
                    id={`admin-dispute-card-${order.id}`}
                    className={`bg-white rounded-3xl border-2 p-5 shadow-xs transition space-y-4 ${
                      isResolved ? 'border-gray-200' : 'border-amber-400 bg-amber-50/15'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-border pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          dispute.status === 'OPEN'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                            : dispute.status === 'UNDER REVIEW'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          STATUS: {dispute.status}
                        </span>
                        <span className="font-mono text-xs font-bold text-gray-400">Order #{order.id}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">Buyer: <strong className="text-charcoal">{order.buyerName}</strong></span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Order Value</span>
                        <span className="text-base font-extrabold text-terracotta font-serif">
                          ₹{(order.product?.price ?? 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Dispute Info & Artisan Response */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Buyer Claim */}
                      <div className="bg-rose-50/60 rounded-2xl p-3.5 border border-rose-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 uppercase text-[10px] tracking-wider">
                            Buyer's Dispute Claim
                          </span>
                          <span className="text-[10px] font-mono text-rose-700">Reason: {dispute.reason}</span>
                        </div>
                        <p className="text-charcoal leading-relaxed font-medium">
                          "{dispute.description}"
                        </p>
                      </div>

                      {/* Artisan Response / Status */}
                      <div className="bg-indigo-50/60 rounded-2xl p-3.5 border border-indigo-200 space-y-1.5 text-xs">
                        <span className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider block">
                          Artisan Response ({order.product?.weaverName || 'Artisan'})
                        </span>
                        {dispute.artisanResponse ? (
                          <p className="text-charcoal leading-relaxed font-medium">
                            "{dispute.artisanResponse}"
                          </p>
                        ) : (
                          <p className="text-gray-400 italic">
                            No response submitted yet by artisan. Admin can arbitrate or request more information.
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Escrow Status info */}
                    {protection && (
                      <div className="bg-cream/40 rounded-2xl p-3 border border-cream-border flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase font-bold block">Secured Escrow</span>
                            <span className="font-bold text-charcoal">₹{(protection.paymentSecured ?? protection.orderTotal ?? 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase font-bold block">Released</span>
                            <span className="font-bold text-emerald-700">₹{(protection.releasedAmount ?? 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase font-bold block">Pending / Paused</span>
                            <span className="font-bold text-amber-700">₹{(protection.pendingAmount ?? 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {dispute.requestedInfo && (
                          <div className="text-[11px] text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-300">
                            <strong>Requested Info:</strong> {dispute.requestedInfo}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resolution Action Buttons */}
                    {!isResolved ? (
                      <div className="space-y-2 pt-1 border-t border-cream-border">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          Administrative Action Buttons
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          
                          {/* 1. RELEASE PAYMENT */}
                          <button
                            id={`admin-dispute-release-btn-${order.id}`}
                            disabled={isProcessing}
                            onClick={() => handleResolveDispute(order.id, 'RELEASE PAYMENT', undefined, 'Dispute arbitrated: Funds released to artisan.')}
                            className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 cursor-pointer text-center"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>[RELEASE PAYMENT]</span>
                          </button>

                          {/* 2. REFUND BUYER */}
                          <button
                            id={`admin-dispute-refund-btn-${order.id}`}
                            disabled={isProcessing}
                            onClick={() => handleResolveDispute(order.id, 'REFUND BUYER', undefined, 'Dispute arbitrated: 100% full refund returned to buyer.')}
                            className="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 cursor-pointer text-center"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>[REFUND BUYER]</span>
                          </button>

                          {/* 3. PARTIAL REFUND */}
                          <button
                            id={`admin-dispute-partial-btn-${order.id}`}
                            disabled={isProcessing}
                            onClick={() => {
                              playSyntheticChime('click');
                              setPartialRefundOrder(order);
                              setPartialRefundAmount(Math.round(order.product.price * 0.4).toString());
                            }}
                            className="py-2.5 px-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 cursor-pointer text-center"
                          >
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>[PARTIAL REFUND]</span>
                          </button>

                          {/* 4. REQUEST MORE INFORMATION */}
                          <button
                            id={`admin-dispute-reqinfo-btn-${order.id}`}
                            disabled={isProcessing}
                            onClick={() => {
                              playSyntheticChime('click');
                              setRequestInfoOrder(order);
                              setRequestInfoNotes('Please provide high-resolution photo evidence of selvedge defect and measurements.');
                            }}
                            className="py-2.5 px-2 bg-charcoal hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 cursor-pointer text-center"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>[REQUEST MORE INFO]</span>
                          </button>

                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded-2xl text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Dispute Resolved:</strong> {dispute.resolution?.action || 'Settled'}
                            {dispute.resolution?.notes && ` — ${dispute.resolution.notes}`}
                          </span>
                        </div>
                        {dispute.resolution?.resolvedAt && (
                          <span className="font-mono text-[10px] text-gray-500">
                            {new Date(dispute.resolution.resolvedAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: TRANSACTIONS */}
      {/* ========================================================= */}
      {activeTab === 'transactions' && (
        <div className="space-y-4 animate-fadeIn" id="admin-transactions-section">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-cream-border">
            <div>
              <h2 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-custom" />
                TantuLink Milestone Escrow Ledger
              </h2>
              <p className="text-xs text-gray-500">
                Demo payment and milestone tracking log maintaining tamper-proof ledger entries.
              </p>
            </div>

            <button
              id="refresh-transactions-btn"
              onClick={() => {
                playSyntheticChime('click');
                fetchTransactions();
              }}
              className="px-3 py-1.5 bg-cream hover:bg-cream-dark text-charcoal text-xs font-bold rounded-xl border border-cream-border transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTxns ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
          </div>

          {/* Transactions Table / Cards */}
          {transactions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-cream-border p-8 text-center space-y-2">
              <Landmark className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs text-gray-500">No transaction entries found in sandbox ledger.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-cream-border overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/60 border-b border-cream-border text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      <th className="p-3.5">Txn ID</th>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Type & Milestone</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-cream/20 transition">
                        <td className="p-3.5 font-mono text-[11px] font-bold text-charcoal">
                          {txn.id}
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-gray-500">
                          #{txn.orderId}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            txn.type === 'PAYMENT_SECURED'
                              ? 'bg-blue-100 text-blue-800'
                              : txn.type === 'MILESTONE_RELEASE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {txn.type.replace('_', ' ')}
                          </span>
                          {txn.milestoneName && (
                            <span className="block text-[9px] text-gray-400 font-medium mt-0.5">
                              {txn.milestoneName}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-serif font-extrabold text-charcoal">
                          ₹{(txn?.amount ?? 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ✓ {txn.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[10px] font-mono text-gray-500 whitespace-nowrap">
                          {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-3.5 text-gray-600 text-[11px] max-w-xs">
                          {txn.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REJECT GI SUBMISSION */}
      {/* ========================================================= */}
      {rejectModalProduct && (
        <div 
          id="admin-reject-gi-modal"
          className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
        >
          <div className="bg-cream border-2 border-rose-500 rounded-3xl p-6 text-left max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-base text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Reject GI Submission
              </h3>
              <button
                onClick={() => setRejectModalProduct(null)}
                className="p-1 rounded-full bg-white hover:bg-cream-dark text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-charcoal">
              You are about to reject the Geographical Indication application for:
              <strong className="block mt-1 text-sm font-serif">{rejectModalProduct.title}</strong>
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-600 block">Reason for Rejection / Missing Documentation</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Registered GI certificate number not found in Ministry registry database, or craft cluster boundary mismatch."
                rows={3}
                className="w-full bg-white p-3 rounded-xl border border-cream-border focus:outline-none focus:border-rose-500 text-xs text-charcoal"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="confirm-reject-gi-btn"
                onClick={handleConfirmRejectGi}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setRejectModalProduct(null)}
                className="flex-1 bg-white hover:bg-cream-dark text-charcoal border border-cream-border font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PARTIAL REFUND */}
      {/* ========================================================= */}
      {partialRefundOrder && (
        <div 
          id="admin-partial-refund-modal"
          className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
        >
          <div className="bg-cream border-2 border-amber-500 rounded-3xl p-6 text-left max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-600" />
                Issue Partial Refund
              </h3>
              <button
                onClick={() => setPartialRefundOrder(null)}
                className="p-1 rounded-full bg-white hover:bg-cream-dark text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Enter the partial refund amount to return to the buyer (Order #{partialRefundOrder.id} • Total: ₹{(partialRefundOrder.product?.price ?? 0).toLocaleString('en-IN')}). The remaining balance will be released to the artisan.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-600 block">Partial Refund Amount (₹)</label>
              <input
                type="number"
                value={partialRefundAmount}
                onChange={(e) => setPartialRefundAmount(e.target.value)}
                min={1}
                max={partialRefundOrder.product.price}
                className="w-full bg-white p-3 rounded-xl border border-cream-border focus:outline-none focus:border-amber-500 text-sm font-bold font-serif text-charcoal"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="confirm-partial-refund-btn"
                onClick={() => {
                  const amt = parseInt(partialRefundAmount, 10);
                  if (amt > 0) {
                    handleResolveDispute(partialRefundOrder.id, 'PARTIAL REFUND', amt, `Mutually agreed partial refund of ₹${amt}.`);
                  }
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Apply Partial Refund
              </button>
              <button
                onClick={() => setPartialRefundOrder(null)}
                className="flex-1 bg-white hover:bg-cream-dark text-charcoal border border-cream-border font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REQUEST MORE INFORMATION */}
      {/* ========================================================= */}
      {requestInfoOrder && (
        <div 
          id="admin-request-info-modal"
          className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
        >
          <div className="bg-cream border-2 border-charcoal rounded-3xl p-6 text-left max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-cream-border pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-custom" />
                Request More Information
              </h3>
              <button
                onClick={() => setRequestInfoOrder(null)}
                className="p-1 rounded-full bg-white hover:bg-cream-dark text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Specify what additional evidence or documentation is needed from the buyer or artisan (Order #{requestInfoOrder.id}).
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-600 block">Requested Details / Instructions</label>
              <textarea
                value={requestInfoNotes}
                onChange={(e) => setRequestInfoNotes(e.target.value)}
                rows={3}
                className="w-full bg-white p-3 rounded-xl border border-cream-border focus:outline-none focus:border-indigo-custom text-xs text-charcoal"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="confirm-request-info-btn"
                onClick={() => {
                  handleResolveDispute(requestInfoOrder.id, 'REQUEST MORE INFORMATION', undefined, requestInfoNotes);
                }}
                className="flex-1 bg-charcoal hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Send Request
              </button>
              <button
                onClick={() => setRequestInfoOrder(null)}
                className="flex-1 bg-white hover:bg-cream-dark text-charcoal border border-cream-border font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
