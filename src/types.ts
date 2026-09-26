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
  payoutMethod?: 'bank' | 'upi';
  payoutBankAccountLast4?: string;
  payoutIfsc?: string;
  payoutUpiId?: string;
  minPayoutThreshold?: number;
  whatsappNumber?: string;
  whatsappAlertsEnabled?: boolean;
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
  // Localized overrides for the 4 active UI languages (English lives in the base fields above
  // and is the fallback when a language has no entry here).
  translations?: Partial<Record<'hi' | 'kn' | 'ta', {
    title: string;
    agency: string;
    description: string;
    benefitSummary: string;
  }>>;
}

// Raw-material cluster/bulk-buying: a shared bulk-purchase request other artisans in the same
// craft/region/cooperative can see and join, extending the existing cluster/cooperative support
// rather than introducing a separate subsystem.
export interface MaterialClusterRequest {
  id: string;
  materialName: string;
  craft: string;
  region: string;
  targetQuantity: string;
  pricePerUnitEstimate: string;
  organizerName: string;
  deadline: string;
  joinedArtisanIds: string[];
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

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  material?: string;
  priceDelta: number; // added to/subtracted from the base product price
  stock?: number;
}

export interface BulkPricingTier {
  minQty: number;
  pricePerUnit: number;
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
  // AI Camera: original uploads are always kept alongside enhanced versions; enhancement never
  // touches images[] in place, so "original" is never lost even after enhancement is applied.
  enhancedImages?: string[];
  aiEnhanced?: boolean;
  videoUrl?: string;
  careInstructions: string;
  dateAdded: string;
  status: 'Pending Approval' | 'Listed' | 'Sold' | 'Draft' | 'Unpublished' | 'Archived';
  languageCreated?: Language;
  updatedAt?: number;
  version?: number;
  giInfo?: GiInfo;
  pricingRecommendation?: PricingRecommendation;
  capacityPerWeek?: number;
  capacityPerMonth?: number;
  variants?: ProductVariant[];
  discountPercent?: number;
  saleEndsAt?: string;
  bulkPricingTiers?: BulkPricingTier[];
  // Design/IP-theft protection: a hash of title+description+images+timestamp taken the moment a
  // product is first listed, recorded once and never recomputed, as a verifiable first-authorship
  // record independent of any later edits to the listing.
  provenanceHash?: string;
  provenanceTimestamp?: string;
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

  // Product management
  editProduct?: string;
  duplicateProduct?: string;
  saveAsDraft?: string;
  publishProduct?: string;
  unpublishProduct?: string;
  archiveProduct?: string;
  statusDraft?: string;
  statusUnpublished?: string;
  statusArchived?: string;
  confirmArchive?: string;

  // Variants
  variants?: string;
  addVariant?: string;
  variantSize?: string;
  variantColor?: string;
  variantMaterial?: string;
  variantExtraPrice?: string;
  variantStock?: string;
  removeVariant?: string;

  // Business growth
  discountsAndOffers?: string;
  discountPercentLabel?: string;
  saleEndsOn?: string;
  bulkPricingTiers?: string;
  addBulkTier?: string;
  bulkMinQty?: string;
  bulkPricePerUnit?: string;

  // Payout
  payoutSettings?: string;
  payoutMethodLabel?: string;
  bankAccountOption?: string;
  upiOption?: string;
  payoutSchedule?: string;
  payoutScheduleText?: string;
  minPayoutThresholdLabel?: string;

  // IP / provenance
  provenanceRecord?: string;
  provenanceRecordedOn?: string;
  provenanceExplain?: string;

  // Raw material cluster
  materialCluster?: string;
  materialClusterHint?: string;
  joinClusterRequest?: string;
  joinedClusterRequest?: string;
  clusterDeadlineLabel?: string;
  clusterTargetLabel?: string;

  // WhatsApp
  whatsappIntegration?: string;
  whatsappNumberLabel?: string;
  whatsappEnableAlerts?: string;
  whatsappComingSoonNote?: string;

  // Video
  attachProcessVideo?: string;
  videoAttachedLabel?: string;

  // AI Camera
  aiCameraTitle?: string;
  aiEnhancedBadge?: string;
  viewOriginalPhoto?: string;
  viewEnhancedPhoto?: string;
  photoBlurWarning?: string;
  photoDarkWarning?: string;
  retakePhotoLabel?: string;
  useThisPhotoLabel?: string;
  enhancePhotoLabel?: string;

  // Invoice
  downloadInvoice?: string;
  invoiceTitleLabel?: string;

  // Public landing page
  landingNavShop?: string;
  landingNavSell?: string;
  landingNavSignIn?: string;
  landingNavGetStarted?: string;
  landingHeroTitleLine1?: string;
  landingHeroTitleAccent?: string;
  landingHeroSubtitle?: string;
  landingHeroCtaPrimary?: string;
  landingHeroCtaSecondary?: string;
  landingStatProducts?: string;
  landingStatOrders?: string;
  landingStatRegions?: string;
  landingCategoriesTitle?: string;
  landingCategoriesSubtitle?: string;
  landingCategoryCount?: string;
  landingFeaturedTitle?: string;
  landingFeaturedSubtitle?: string;
  landingFeaturedCta?: string;
  landingFeaturedEmpty?: string;
  landingHowTitle?: string;
  landingHowSubtitle?: string;
  landingHowStep1Title?: string;
  landingHowStep1Desc?: string;
  landingHowStep2Title?: string;
  landingHowStep2Desc?: string;
  landingHowStep3Title?: string;
  landingHowStep3Desc?: string;
  landingHowCta?: string;
  landingTrustTitle?: string;
  landingTrustSubtitle?: string;
  landingTrust1Title?: string;
  landingTrust1Desc?: string;
  landingTrust2Title?: string;
  landingTrust2Desc?: string;
  landingTrust3Title?: string;
  landingTrust3Desc?: string;
  landingTrust4Title?: string;
  landingTrust4Desc?: string;
  landingArtisansTitle?: string;
  landingArtisansSubtitle?: string;
  landingArtisansEmpty?: string;
  landingGrowTitle?: string;
  landingGrowSubtitle?: string;
  landingGrow1Title?: string;
  landingGrow1Desc?: string;
  landingGrow2Title?: string;
  landingGrow2Desc?: string;
  landingGrow3Title?: string;
  landingGrow3Desc?: string;
  landingFaqTitle?: string;
  landingFaq1Q?: string;
  landingFaq1A?: string;
  landingFaq2Q?: string;
  landingFaq2A?: string;
  landingFaq3Q?: string;
  landingFaq3A?: string;
  landingFaq4Q?: string;
  landingFaq4A?: string;
  landingFooterTagline?: string;
  landingFooterRights?: string;
}
