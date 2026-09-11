export type Language = 'en' | 'kn' | 'hi';

export type UserRole = 'weaver' | 'buyer' | 'admin' | 'ADMIN';

export interface UserProfile {
  id?: string;
  name: string;
  role: 'weaver' | 'buyer' | 'admin' | 'ADMIN';
  email?: string;
  region?: string;
  experience?: string;
  cooperative?: string;
  shippingAddress?: string;
  phone?: string;
  weaverId?: string;
  buyerId?: string;
  avatar?: string;
  userType?: 'producer' | 'buyer';
  producerType?: 'individual_artisan' | 'cooperative_society' | 'shg_ngo';
  buyerType?: 'individual_consumer' | 'boutique_retailer' | 'institutional_corporate' | 'wholesale_exporter';
  accountType?: string;
  artisanId?: string;
  onboardingData?: Record<string, string>;
}

export type BottomNavTab = 'weaver' | 'buyer' | 'offline-lab' | 'voice-ai' | 'account' | 'admin';

export interface Dimensions {
  length: string; // e.g., "5.5 meters" or "40 inches"
  width: string;  // e.g., "1.1 meters" or "28 inches"
  customText?: string;
}

export interface Product {
  id: string;
  title: string;
  weaverName: string;
  weaverBio: string;
  weaverRegion: string;
  weaverImage: string;
  material: string;
  price: number;
  dimensions: Dimensions;
  specialFeatures: string;
  description: string;
  images: string[];
  careInstructions: string;
  dateAdded: string;
  status: 'Pending Approval' | 'Listed' | 'Sold';
  languageCreated?: Language;
  updatedAt?: number;
  version?: number;
  giInfo?: GiInfo;
  pricingRecommendation?: PricingRecommendation;
}

export type GiStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface GiInfo {
  status: GiStatus;
  productName: string;
  registrationNumber: string;
  origin: string;
  stateRegion: string;
  category: string;
  verificationDate?: string;
  verificationSource?: string;
  verifiedBy?: string;
  submittedAt?: string;
  notes?: string;
}

export interface PricingRecommendation {
  currentPrice: number;
  recommendedPrice: number;
  rangeMin: number;
  rangeMax: number;
  estimatedArtisanEarnings: number;
  platformFee: number;
  otherCosts: number;
  estimatedNetEarnings: number;
  explanation: string;
  materialCost: number;
  labourHours: number;
  craftComplexity: 'Standard' | 'Medium' | 'Masterpiece';
  category: string;
  craftType: string;
  productionDays: number;
  isDemo: true;
  generatedAt: string;
}

export type MilestoneName = 'ORDER CONFIRMED' | 'CRAFTING / MAKING' | 'DELIVERED';
export type MilestoneStatus = 'PENDING' | 'RELEASED';

export interface OrderMilestone {
  id: string;
  name: MilestoneName;
  percentage: number; // 20, 40, 40
  amount: number;
  status: MilestoneStatus;
  releasedAt?: string;
  transactionId?: string;
}

export interface PaymentProtection {
  isDemo: true;
  label: 'DEMO / SANDBOX';
  orderTotal: number;
  paymentSecured: number;
  releasedAmount: number;
  pendingAmount: number;
  refundedAmount: number;
  milestones: OrderMilestone[];
}

export type DisputeStatus = 'OPEN' | 'UNDER REVIEW' | 'RESOLVED' | 'REFUNDED' | 'PAYMENT RELEASED';

export type DisputeReason = 
  | 'Product not as described'
  | 'Quality issue'
  | 'Wrong product'
  | 'Damaged product'
  | 'Delivery issue'
  | 'GI/authenticity concern'
  | 'Other';

export interface OrderDispute {
  id: string;
  status: DisputeStatus;
  reason: DisputeReason;
  description: string;
  evidenceUrl?: string;
  createdAt: string;
  updatedAt: string;
  buyerId?: string;
  buyerName: string;
  artisanResponse?: {
    message: string;
    respondedAt: string;
  };
  adminNotes?: string[];
  requestedInfo?: string;
  resolution?: {
    action: 'RELEASE PAYMENT' | 'REFUND BUYER' | 'PARTIAL REFUND' | 'REQUEST MORE INFORMATION';
    amount?: number;
    resolvedAt: string;
    notes: string;
  };
}

export interface TransactionHistoryEntry {
  id: string;
  orderId: string;
  type: 'PAYMENT_SECURED' | 'MILESTONE_RELEASE' | 'REFUND' | 'PARTIAL_REFUND';
  amount: number;
  milestoneName?: string;
  status: 'SUCCESS';
  timestamp: string;
  description: string;
  isDemo: true;
}

export interface QualityCheck {
  checkedForDamage: boolean;
  looseThreadsRemoved: boolean;
  stitchingVerified: boolean;
  photoUrl?: string;
}

export interface IssueReport {
  issueType: 'Damaged' | 'Wrong Item' | 'Wrong Size' | 'Not as Described';
  photoUrl?: string;
  note: string;
  reportedAt: string;
  resolved: boolean;
  resolutionMsg: string;
}

export interface Order {
  id: string;
  product: Product;
  buyerName: string;
  buyerAddress: string;
  orderDate: string;
  status: 'Order Received' | 'Accepted' | 'Quality Checked' | 'Pickup Arranged' | 'Shipped' | 'Delivered' | 'Payment Settled';
  qualityCheck?: QualityCheck;
  issueReport?: IssueReport;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  trackingHistory: {
    status: string;
    timestamp: string;
    description: string;
  }[];
  paymentProtection?: PaymentProtection;
  dispute?: OrderDispute;
  transactionHistory?: TransactionHistoryEntry[];
  updatedAt?: number;
  version?: number;
}

export interface SearchFilters {
  occasion?: string;
  color?: string;
  maxBudget?: number;
  style?: string;
  material?: string;
}

export type NetworkSimulationMode = 'online' | 'offline' | 'data-saver';

export interface OfflineOutboxItem {
  id: string;
  type: 'NEW_PRODUCT' | 'QC_SUBMIT' | 'NEW_ORDER' | 'ORDER_STATUS_UPDATE';
  title: string;
  timestamp: string;
  clientTimestamp: number;
  payload: any;
  status: 'pending' | 'syncing' | 'synced' | 'conflict_resolved';
  conflictPolicy?: 'LAST_WRITE_WINS';
}

export interface SyncConflictLog {
  id: string;
  entityType: 'product' | 'order';
  entityId: string;
  itemTitle: string;
  clientTimestamp: number;
  serverTimestamp: number;
  resolution: 'client-wins' | 'server-wins';
  timestampDiffMs: number;
  appliedPayloadSummary: string;
  resolvedAt: string;
}

export interface Translation {
  // Common
  weaverView: string;
  buyerView: string;
  languageName: string;
  logoSub: string;

  // Weaver
  weaverDashboard: string;
  addNewProduct: string;
  earningsSummary: string;
  availableEarnings: string;
  pendingPayments: string;
  completedOrders: string;
  readEarningsAloud: string;
  myListedProducts: string;
  incomingOrders: string;
  markReady: string;
  qcChecklistTitle: string;
  damageCheck: string;
  threadsCheck: string;
  stitchingCheck: string;
  qcPhotoUpload: string;
  cancel: string;
  submitQc: string;

  // Weaver Q&A
  qaTitle: string;
  microphoneTap: string;
  typeFallback: string;
  speakInstead: string;
  back: string;
  next: string;
  confirmListing: string;
  playAudio: string;
  confirmAndPublish: string;
  editDetails: string;

  // Buyer
  buyerSearchPlaceholder: string;
  searchTitle: string;
  weaverStory: string;
  hearWeaverStory: string;
  buyRightPanel: string;
  variationDisclaimer: string;
  reviewCheckbox: string;
  buyNow: string;
  checkoutTitle: string;
  priceBreakdown: string;
  customerPrice: string;
  logisticsCost: string;
  platformFee: string;
  weaverEarnings: string;
  payWithUpi: string;
  orderConfirmed: string;
  trackStatus: string;
  recommendationsTitle: string;
  recommendationsEmpty: string;
}
