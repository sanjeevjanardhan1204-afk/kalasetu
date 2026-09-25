// Full target language set (Master Spec Section 10). 'en' is the base/fallback language:
// every UI string must resolve to English when a translation is missing for any other code,
// so no screen is ever left half-translated or blank.
export type Language =
  | 'en' | 'as' | 'bn' | 'brx' | 'doi' | 'gu' | 'hi' | 'kn' | 'ks' | 'kok'
  | 'mai' | 'ml' | 'mni' | 'mr' | 'ne' | 'or' | 'pa' | 'sa' | 'sat' | 'sd'
  | 'ta' | 'te';

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
  capacityPerWeek?: number;
  capacityPerMonth?: number;
}

export type BottomNavTab = 'weaver' | 'buyer' | 'offline-lab' | 'voice-ai' | 'account' | 'admin';

export interface Dimensions {
  length: string; // e.g., "5.5 meters" or "40 inches"
  width: string;  // e.g., "1.1 meters" or "28 inches"
  customText?: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  agency: string;
  description: string;
  benefitSummary: string;
  eligibilityCrafts: string[];
  applicableStates?: string[];
  linkUrl: string;
  category: 'Subsidy' | 'Export' | 'Credit' | 'Infrastructure' | 'GI & Heritage';
}

export interface CustomBulkOrderRequest {
  id: string;
  buyerName: string;
  buyerContact?: string;
  buyerId?: string;
  producerId?: string;
  productTitle: string;
  productId?: string;
  quantity: number;
  specifications: string;
  desiredTimelineDays: number;
  status: 'PENDING_QUOTE' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED_TO_ORDER';
  quotedPrice?: number;
  quotedTimelineDays?: number;
  createdAt: string;
  capacityWarningExceeded?: boolean;
  stagedScheduleSuggested?: boolean;
}

export interface Product {
  id: string;
  title: string;
  category?: string;
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
  capacityPerWeek?: number;
  capacityPerMonth?: number;
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
  quantity?: number;
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
  // When a checkout includes products from multiple artisans, every resulting Order shares this
  // id so the buyer sees one order reference while fulfillment/payout/tracking stay per-artisan.
  cartGroupId?: string;
  returnRequest?: ReturnRequest;
  reviews?: ProductReview[];
  chatMessages?: ChatMessage[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type ReturnReason = 'Wrong item' | 'Damaged' | 'Defective' | 'Materially different' | 'Change of mind';
export type ReturnResolutionType = 'REFUND' | 'REPLACEMENT';
export type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED';

export interface ReturnRequest {
  id: string;
  reason: ReturnReason;
  resolutionRequested: ReturnResolutionType;
  note: string;
  photoUrl?: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: ReturnStatus; timestamp: string; note: string }[];
}

export interface ProductReview {
  id: string;
  orderId: string; // proof of a verified purchase - a review always traces back to a delivered order
  productId: string;
  buyerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
  flagged?: boolean;
  flagReason?: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  sender: 'buyer' | 'artisan';
  text: string;
  timestamp: string;
  flagged?: boolean;
  flagReason?: string;
  offPlatformWarning?: boolean;
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
  recommendationsWhy?: string;
  searchNothingFound?: string;
  searchNothingFoundHint?: string;

  // Cart
  addToCart?: string;
  addedToCart?: string;
  cart?: string;
  cartEmpty?: string;
  cartEmptyHint?: string;
  cartFromArtisan?: string;
  cartGrandTotal?: string;
  cartProceedToCheckout?: string;
  cartRemove?: string;
  cartOrderSplitNotice?: string;
  orderReference?: string;
  shipmentsFromArtisans?: string;

  // Wishlist
  wishlist?: string;
  wishlistEmpty?: string;
  wishlistEmptyHint?: string;
  addToWishlist?: string;
  removeFromWishlist?: string;

  // Reviews
  reviews?: string;
  writeReview?: string;
  verifiedPurchase?: string;
  reviewNeedsPurchase?: string;
  reviewSubmitted?: string;
  reportReview?: string;
  reviewReportedThanks?: string;
  noReviewsYet?: string;
  noReviewsYetHint?: string;

  // Returns
  returnOrReplace?: string;
  returnStatus?: string;
  returnReasonLabel?: string;
  returnNote?: string;
  returnSubmit?: string;
  returnSubmitted?: string;
  returnNotAvailable?: string;

  // Chat
  chatWithArtisan?: string;
  chatEmpty?: string;
  chatPlaceholder?: string;
  chatSend?: string;
  chatReportMessage?: string;
  chatReportedThanks?: string;
  chatOffPlatformWarning?: string;

  // Generic empty/error states
  genericErrorTitle?: string;
  genericErrorHint?: string;
  retry?: string;
}
