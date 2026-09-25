import React, { useState, useEffect } from 'react';
import { 
  Search, Mic, CheckSquare, Sparkles, User, Info, ArrowLeft, 
  MapPin, Check, ShieldCheck, HelpCircle, Truck, Heart, AlertTriangle, 
  ChevronRight, Play, CheckCircle2, MessageSquare, AlertCircle, RefreshCw,
  Clock, X, Award, ShieldAlert, FileText, ShoppingBag, Plus, Minus, Flag, Send, Star
} from 'lucide-react';
import { Product, Order, Language, Translation, SearchFilters, IssueReport, ReturnReason, ReturnResolutionType, ReturnStatus, ProductReview, ChatMessage } from '../types';
import { TRANSLATIONS, parseConversationalSearch, playSyntheticChime } from '../data';
import { speakText, triggerSubtitleSpeak, triggerSubtitleStop } from './VoiceHelper';
import { OrderTrackingProgressBar } from './OrderTrackingProgressBar';
import { GiModal } from './GiModal';
import { PaymentProtectionTracker } from './PaymentProtectionTracker';
import { DisputeModal } from './DisputeModal';
import { BackButton } from './BackButton';

interface BuyerViewProps {
  language: Language;
  products: Product[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  profile: any;
  startListening?: (callback: (text: string) => void) => void;
  dataSaver: boolean;
  openOrdersSignal?: number;
}

export const BuyerView: React.FC<BuyerViewProps> = ({
  language,
  products,
  orders,
  setOrders,
  profile,
  startListening,
  dataSaver,
  openOrdersSignal = 0
}) => {
  // Merge with English so any newer key not yet translated for `language` still renders text
  // instead of `undefined`, consistent with the pickLang() fallback pattern used elsewhere.
  const t = { ...TRANSLATIONS.en, ...TRANSLATIONS[language] };

  // Data saver synchronization states
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Sync loop based on connection settings
  useEffect(() => {
    const intervalTime = dataSaver ? 45000 : 15000;
    
    const interval = setInterval(() => {
      setSyncStatus('syncing');
      
      // Sync processing animation delay
      const delay = dataSaver ? 100 : 2000;
      const timer = setTimeout(() => {
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        
        // Return to idle after a brief showing of 'synced'
        const idleDelay = dataSaver ? 100 : 3000;
        const idleTimer = setTimeout(() => {
          setSyncStatus('idle');
        }, idleDelay);
        
        return () => clearTimeout(idleTimer);
      }, delay);
      
      return () => clearTimeout(timer);
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [dataSaver]);

  const lastSyncText = lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Tab states
  const [activeTab, setActiveTab] = useState<'browse' | 'product-detail' | 'checkout' | 'orders' | 'cart' | 'cart-checkout'>('browse');

  useEffect(() => {
    if (openOrdersSignal > 0) setActiveTab('orders');
  }, [openOrdersSignal]);
  
  // Selected Product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [isTypingSearch, setIsTypingSearch] = useState(false);
  const [isListeningSearch, setIsListeningSearch] = useState(false);

  // Saved Products State with LocalStorage Persistence
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tantulink_saved_products');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('tantulink_saved_products', JSON.stringify(savedProductIds));
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  }, [savedProductIds]);

  // Toggle favorite helper
  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Multi-item, multi-artisan Cart State with LocalStorage Persistence
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('kalasetu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  }, [cartItems]);

  const addToCart = (productId: string) => {
    playSyntheticChime('success');
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId, quantity: 1 }];
    });
    setAddedToCartId(productId);
    setTimeout(() => setAddedToCartId(null), 1800);
  };

  const removeFromCart = (productId: string) => {
    playSyntheticChime('click');
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  // Resolve cart line items against the live catalog, dropping any that no longer exist (e.g. sold)
  type CartLine = { item: { productId: string; quantity: number }; product: Product };
  const cartLines: CartLine[] = cartItems
    .map(item => ({ item, product: products.find(p => p.id === item.productId) }))
    .filter((line): line is CartLine => !!line.product);

  const cartByArtisan = cartLines.reduce<Record<string, CartLine[]>>((groups, line) => {
    const key = line.product.weaverName;
    groups[key] = groups[key] ? [...groups[key], line] : [line];
    return groups;
  }, {});

  const cartArtisanCount = Object.keys(cartByArtisan).length;
  const cartGrandTotal = cartLines.reduce((sum, line) => sum + line.product.price * line.item.quantity, 0);
  const cartItemCount = cartLines.reduce((sum, line) => sum + line.item.quantity, 0);

  // Recently Viewed State with LocalStorage Persistence
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tantulink_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      const updated = [productId, ...filtered].slice(0, 4); // Keep last 4 products
      try {
        localStorage.setItem('tantulink_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage sync error", e);
      }
      return updated;
    });
  };

  const recentlyViewedProducts = recentlyViewedIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  const buyerOrders = profile?.name
    ? orders.filter(order => order.buyerName === profile.name)
    : orders;

  const craftFamilies: Record<string, string[]> = {
    textiles: ['saree', 'sari', 'mundu', 'textile', 'handloom', 'ikat', 'cotton', 'silk', 'fabric', 'shawl', 'dhoti', 'veshti', 'weave'],
    pottery: ['pottery', 'ceramic', 'clay', 'terracotta'],
    metalcraft: ['metalcraft', 'metal', 'brass', 'copper', 'iron', 'bell metal'],
    jewellery: ['jewellery', 'jewelry', 'necklace', 'earring', 'bangle', 'ornament'],
    woodcraft: ['woodcraft', 'wooden', 'wood carving', 'carved wood'],
    bamboo: ['bamboo', 'cane', 'basket'],
    painting: ['painting', 'folk art', 'madhubani', 'pattachitra', 'warli'],
    embroidery: ['embroidery', 'kasuti', 'needlework', 'stitched', 'phulkari', 'kantha', 'chikankari'],
    leathercraft: ['leathercraft', 'leather', 'kolhapuri'],
    handicrafts: ['handicraft', 'folk toy', 'palm leaf', 'paper mache'],
    homeDecor: ['home decor', 'home décor', 'cushion', 'lamp', 'candle holder', 'table runner', 'wall basket'],
    otherTraditionalCrafts: ['traditional craft', 'traditional toy', 'hand fan', 'stone carved', 'lacquered']
  };

  const getCraftFamily = (product: Product | string) => {
    if (typeof product !== 'string' && product.category) {
      if (product.category === 'Sarees & Textiles') return 'textiles';
      if (product.category === 'Pottery & Ceramics') return 'pottery';
      if (product.category === 'Jewellery') return 'jewellery';
      if (product.category === 'Woodcraft') return 'woodcraft';
      if (product.category === 'Bamboo & Cane') return 'bamboo';
      if (product.category === 'Embroidery') return 'embroidery';
      if (product.category === 'Metalcraft') return 'metalcraft';
      if (product.category === 'Paintings & Folk Art') return 'painting';
      if (product.category === 'Leathercraft') return 'leathercraft';
      if (product.category === 'Handicrafts') return 'handicrafts';
      if (product.category === 'Home Décor') return 'homeDecor';
      if (product.category === 'Other Traditional Crafts') return 'otherTraditionalCrafts';
    }
    const text = typeof product === 'string'
      ? product
      : [product.title, product.material, product.description, product.giInfo?.category || ''].join(' ');
    const normalized = text.toLowerCase();
    return Object.entries(craftFamilies).find(([, terms]) => terms.some(term => normalized.includes(term)))?.[0] || null;
  };

  const recommendedProducts = selectedProduct
    ? products.filter(product => product.id !== selectedProduct.id && product.status !== 'Sold' && getCraftFamily(product) === getCraftFamily(selectedProduct)).slice(0, 4)
    : [];

  // Search History State with LocalStorage Persistence
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const history = localStorage.getItem('tantulink_search_history');
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  });

  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    setSearchHistory(prev => {
      // Remove query if already exists, and prepend to keep latest at front
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 3); // limit to 3 queries
      try {
        localStorage.setItem('tantulink_search_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Buy Right Checkbox
  const [reviewedSpecs, setReviewedSpecs] = useState(false);

  // Story narration state
  const [storySpeakingId, setStorySpeakingId] = useState<string | null>(null);

  // Checkout State
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [upiProcessing, setUpiProcessing] = useState(false);

  // Flow 3: Post-delivery Issue Reporting
  const [selectedOrderForIssue, setSelectedOrderForIssue] = useState<Order | null>(null);
  const [issueType, setIssueType] = useState<'Damaged' | 'Wrong Item' | 'Wrong Size' | 'Not as Described'>('Damaged');
  const [issueNote, setIssueNote] = useState('');
  const [issuePhoto, setIssuePhoto] = useState<boolean>(false);
  const [showIssueResolution, setShowIssueResolution] = useState(false);
  const [resolvedMessage, setResolvedMessage] = useState('');

  // Distinct Returns/Replacement/Refund flow (separate from disputes and the legacy issue report;
  // shares the same order-level evidence surface but carries its own tracked status)
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<ReturnReason>('Wrong item');
  const [returnResolution, setReturnResolution] = useState<ReturnResolutionType>('REFUND');
  const [returnNoteText, setReturnNoteText] = useState('');

  // Buyer-artisan chat per order, with lightweight off-platform-payment keyword detection
  const [chatDraft, setChatDraft] = useState('');
  const OFF_PLATFORM_PATTERN = /\b(whatsapp|telegram|call me|cash on|pay (me )?directly|outside (the )?app|my number is)\b|\b\d{10}\b/i;

  // 4 New Features: Modal States
  const [selectedGiProduct, setSelectedGiProduct] = useState<Product | null>(null);
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<Order | null>(null);
  const [disputeInitialMode, setDisputeInitialMode] = useState<'raise' | 'view' | 'admin-resolve'>('view');

  // Custom & Bulk Order Builder Modal States
  const [showCustomOrderModal, setShowCustomOrderModal] = useState<boolean>(false);
  const [customQty, setCustomQty] = useState<number>(5);
  const [customSpecs, setCustomSpecs] = useState<string>('Custom border weaving with natural vegetable indigo dye, gold zari pallu accent');
  const [customTimelineDays, setCustomTimelineDays] = useState<number>(30);
  const [customOrderSuccess, setCustomOrderSuccess] = useState<boolean>(false);

  // Sample Queries to autofill/demonstrate Natural Language Search
  const SAMPLE_QUERIES = [
    {
      label: "Green saree under ₹5,000 for wedding",
      query: "I want a lightweight traditional saree for a summer wedding, preferably green, under ₹5,000"
    },
    {
      label: "White cotton Mundu under ₹2,000",
      query: "Lightweight traditional white cotton mundu set under ₹2,000 for festival"
    },
    {
      label: "Silk saree under ₹10,000",
      query: "Banarasi pure silk saree with gold zari under ₹12,000"
    }
  ];

  // Runs search parser whenever searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const parsed = parseConversationalSearch(searchQuery);
      setActiveFilters(parsed);
    } else {
      setActiveFilters({});
    }
  }, [searchQuery]);

  // Handle suggestion chip click for search or voice input
  const handleQuerySuggestion = (q: string) => {
    if (!q || !q.trim()) return;
    const cleanQuery = q.trim();
    playSyntheticChime('click');
    saveSearchQuery(cleanQuery);
    setSearchQuery(cleanQuery);
    setIsTypingSearch(false);
    playSyntheticChime('success');
  };

  // Trigger real Web Speech API voice search or fallback to simulator
  const handleVoiceSearchClick = () => {
    if (startListening) {
      startListening((text) => {
        handleQuerySuggestion(text);
      });
    } else {
      triggerVoiceSearchSim();
    }
  };

  // Simulate Search Voice Recognition
  const triggerVoiceSearchSim = () => {
    setIsListeningSearch(true);
    playSyntheticChime('record');
    
    setTimeout(() => {
      setIsListeningSearch(false);
      const randomQuery = SAMPLE_QUERIES[Math.floor(Math.random() * SAMPLE_QUERIES.length)].query;
      handleQuerySuggestion(randomQuery);
    }, 2000);
  };

  // Speaks the artisan's story aloud using SpeechSynthesis
  const handleHearWeaverStory = (product: Product) => {
    if (storySpeakingId === product.id) {
      setStorySpeakingId(null);
      return;
    }
    
    setStorySpeakingId(product.id);
    const storyText = language === 'kn'
      ? `ನಮಸ್ಕಾರ, ನಾನು ${product.weaverName}. ನಾನು ${product.weaverRegion} ನೇಕಾರ. ನನ್ನ ಕುಟುಂಬವು ತಲೆಮಾರುಗಳಿಂದ ಕೈಮಗ್ಗ ನೆಯ್ದು ಜೀವನ ಸಾಗಿಸುತ್ತಿದೆ. ಈ ಸೀರೆಯನ್ನು ತಯಾರಿಸಲು ನನಗೆ ಸುಮಾರು ಐದು ದಿನಗಳ ಕಠಿಣ ಶ್ರಮ ಬೇಕಾಯಿತು. ದಯವಿಟ್ಟು ಗ್ರಾಮೀಣ ಸೃಜನಶೀಲತೆಯನ್ನು ಪ್ರೋತ್ಸಾಹಿಸಿ.`
      : language === 'hi'
      ? `नमस्ते, मैं ${product.weaverName} हूँ। मैं ${product.weaverRegion} से हूँ। हमारा परिवार पीढ़ियों से हथकरघा बुनाई का काम कर रहा है। इस कपड़े को तैयार करने में मेरी ५ दिनों की मेहनत लगी है। अपना समर्थन दें।`
      : `Hello, I am ${product.weaverName}, crafting directly from ${product.weaverRegion}. This beautiful product was handmade over five days. Thank you for connecting with artisans directly.`;

    triggerSubtitleSpeak(storyText);
    speakText(storyText, language, undefined, () => {
      setStorySpeakingId(null);
      triggerSubtitleStop();
    });
  };

  // Filters product catalog based on parsed search tags
  const filteredProducts = products.filter(product => {
    if (product.status === 'Sold') return false;
    
    // Filter by Favorites Only
    if (showFavoritesOnly && !savedProductIds.includes(product.id)) return false;
    
    // Filter by color
    if (activeFilters.color) {
      const matchColor = product.title.toLowerCase().includes(activeFilters.color.toLowerCase()) || 
                         product.description.toLowerCase().includes(activeFilters.color.toLowerCase());
      if (!matchColor) return false;
    }

    // Filter by maximum budget
    if (activeFilters.maxBudget) {
      if (product.price > activeFilters.maxBudget) return false;
    }

    // Filter by material
    if (activeFilters.material) {
      const matchMaterial = product.material.toLowerCase().includes(activeFilters.material.toLowerCase());
      if (!matchMaterial) return false;
    }

    // Filter by occasion
    if (activeFilters.occasion) {
      const matchOccasion = product.description.toLowerCase().includes(activeFilters.occasion.toLowerCase()) || 
                           product.title.toLowerCase().includes(activeFilters.occasion.toLowerCase());
      if (!matchOccasion) return false;
    }

    return true;
  });

  // Calculate checkout price components
  const getPriceBreakdown = (price: number) => {
    const logistics = 220; // flat courier from rural artisan
    const platformFee = Math.round(price * 0.03); // 3% TantuLink tech platform fee
    const weaverDirect = price - logistics - platformFee;
    return {
      total: price,
      logistics,
      platformFee,
      weaverDirect,
      weaverPercentage: Math.round((weaverDirect / price) * 100)
    };
  };

  // Initiates Checkout Process
  const handleBuyNowTrigger = () => {
    if (!selectedProduct || !reviewedSpecs) return;
    playSyntheticChime('click');
    setActiveTab('checkout');
  };

  // Completes UPI Payment simulation
  const handleUpiPayComplete = () => {
    if (!selectedProduct) return;
    playSyntheticChime('click');
    setUpiProcessing(true);

    setTimeout(() => {
      setUpiProcessing(false);
      playSyntheticChime('success');

      // Create new active order with 3-stage milestone payment protection
      const prodPrice = selectedProduct.price;
      const m1Amt = Math.round(prodPrice * 0.20);
      const m2Amt = Math.round(prodPrice * 0.40);
      const m3Amt = prodPrice - m1Amt - m2Amt;

      const newOrder: Order = {
        id: 'o-' + Math.floor(1000 + Math.random() * 9000),
        product: selectedProduct,
        buyerName: profile?.name || 'Jagadish B.',
        buyerAddress: profile?.shippingAddress || 'Indiranagar, Bengaluru, Karnataka - 560038',
        orderDate: new Date().toISOString(),
        status: 'Order Received',
        shippingAddress: {
          street: profile?.shippingAddress || 'Indiranagar, Bengaluru, Karnataka - 560038',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          phone: profile?.phone || '+91 98765 43210'
        },
        paymentProtection: {
          isDemo: true,
          label: 'DEMO / SANDBOX',
          orderTotal: prodPrice,
          paymentSecured: prodPrice,
          releasedAmount: 0,
          pendingAmount: prodPrice,
          refundedAmount: 0,
          milestones: [
            {
              id: `m-${Date.now()}-1`,
              name: 'ORDER CONFIRMED',
              percentage: 20,
              amount: m1Amt,
              status: 'PENDING'
            },
            {
              id: `m-${Date.now()}-2`,
              name: 'CRAFTING / MAKING',
              percentage: 40,
              amount: m2Amt,
              status: 'PENDING'
            },
            {
              id: `m-${Date.now()}-3`,
              name: 'DELIVERED',
              percentage: 40,
              amount: m3Amt,
              status: 'PENDING'
            }
          ]
        },
        trackingHistory: [
          {
            status: 'Order Received',
            timestamp: new Date().toISOString(),
            description: 'Direct-to-Artisan Order placed successfully! Verified payment of ₹' + selectedProduct.price
          }
        ]
      };

      setOrders(prev => [newOrder, ...prev]);
      setActiveOrder(newOrder);
      setActiveTab('orders');
      
      // Prompt success
      const succText = language === 'kn' 
        ? 'ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ನೇಕಾರರ ನೇರ ಆದಾಯವನ್ನು ಖಾತರಿಪಡಿಸಲಾಗಿದೆ.' 
        : language === 'hi' 
        ? 'ऑर्डर सफल रहा! बुनकर की सीधी कमाई सुनिश्चित की गई।' 
        : 'Order confirmed successfully! Artisan direct payment processed.';
      triggerSubtitleSpeak(succText);
      speakText(succText, language, undefined, () => triggerSubtitleStop());
    }, 2000);
  };

  // Completes checkout for a multi-item, possibly multi-artisan cart. The buyer sees one order
  // reference (cartGroupId) and one confirmation, but behind the scenes we create a separate
  // Order per line item so each artisan's escrow, fulfillment and payout tracking stays
  // independent - reusing the exact same per-order milestone structure as a single-item buy.
  const handleCartCheckoutComplete = () => {
    if (cartLines.length === 0) return;
    playSyntheticChime('click');
    setUpiProcessing(true);

    setTimeout(() => {
      setUpiProcessing(false);
      playSyntheticChime('success');

      const cartGroupId = 'grp-' + Date.now();
      const newOrders: Order[] = cartLines.map((line, index) => {
        const lineTotal = line.product.price * line.item.quantity;
        const m1Amt = Math.round(lineTotal * 0.20);
        const m2Amt = Math.round(lineTotal * 0.40);
        const m3Amt = lineTotal - m1Amt - m2Amt;
        const now = Date.now() + index; // keep ids/timestamps distinct across same-tick orders

        return {
          id: 'o-' + Math.floor(1000 + Math.random() * 9000) + '-' + index,
          product: line.product,
          quantity: line.item.quantity,
          cartGroupId,
          buyerName: profile?.name || 'Jagadish B.',
          buyerAddress: profile?.shippingAddress || 'Indiranagar, Bengaluru, Karnataka - 560038',
          orderDate: new Date().toISOString(),
          status: 'Order Received',
          shippingAddress: {
            street: profile?.shippingAddress || 'Indiranagar, Bengaluru, Karnataka - 560038',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            phone: profile?.phone || '+91 98765 43210'
          },
          paymentProtection: {
            isDemo: true,
            label: 'DEMO / SANDBOX',
            orderTotal: lineTotal,
            paymentSecured: lineTotal,
            releasedAmount: 0,
            pendingAmount: lineTotal,
            refundedAmount: 0,
            milestones: [
              { id: `m-${now}-1`, name: 'ORDER CONFIRMED', percentage: 20, amount: m1Amt, status: 'PENDING' },
              { id: `m-${now}-2`, name: 'CRAFTING / MAKING', percentage: 40, amount: m2Amt, status: 'PENDING' },
              { id: `m-${now}-3`, name: 'DELIVERED', percentage: 40, amount: m3Amt, status: 'PENDING' }
            ]
          },
          trackingHistory: [
            {
              status: 'Order Received',
              timestamp: new Date().toISOString(),
              description: `Direct-to-Artisan Order placed successfully! Verified payment of ₹${lineTotal}` + (cartArtisanCount > 1 ? ` (part of order ${cartGroupId})` : '')
            }
          ]
        };
      });

      setOrders(prev => [...newOrders, ...prev]);
      setActiveOrder(newOrders[0]);
      setCartItems([]);
      setActiveTab('orders');

      const succText = language === 'kn'
        ? `ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ${cartArtisanCount > 1 ? cartArtisanCount + ' ಕುಶಲಕರ್ಮಿಗಳಿಂದ ಪ್ರತ್ಯೇಕ ಸಾಗಣೆಗಳು.' : 'ನೇಕಾರರ ನೇರ ಆದಾಯವನ್ನು ಖಾತರಿಪಡಿಸಲಾಗಿದೆ.'}`
        : language === 'hi'
        ? `ऑर्डर सफल रहा! ${cartArtisanCount > 1 ? cartArtisanCount + ' अलग-अलग कारीगरों से शिपमेंट।' : 'बुनकर की सीधी कमाई सुनिश्चित की गई।'}`
        : `Order confirmed successfully! ${cartArtisanCount > 1 ? cartArtisanCount + ' separate shipments from different artisans.' : 'Artisan direct payment processed.'}`;
      triggerSubtitleSpeak(succText);
      speakText(succText, language, undefined, () => triggerSubtitleStop());
    }, 2000);
  };

  // Advance Order Lifecycle for Demo Pitching! (Crucial Hackathon trigger!)
  const handleAdvanceLifecycle = (orderId: string) => {
    playSyntheticChime('click');
    setOrders(prevOrders => 
      prevOrders.map(o => {
        if (o.id === orderId) {
          let nextStatus: Order['status'] = o.status;
          let desc = '';
          
          if (o.status === 'Order Received') {
            nextStatus = 'Accepted';
            desc = 'Artisan acknowledged receipt and started final handcraft polishing.';
          } else if (o.status === 'Accepted') {
            nextStatus = 'Quality Checked';
            desc = 'Pre-dispatch QC checklists successfully passed with photographs.';
          } else if (o.status === 'Quality Checked') {
            nextStatus = 'Pickup Arranged';
            desc = 'TantuLink Rural Courier team coordinated packaging box pickup.';
          } else if (o.status === 'Pickup Arranged') {
            nextStatus = 'Shipped';
            desc = 'Package is in transit via India Post Rural Speed Network.';
          } else if (o.status === 'Shipped') {
            nextStatus = 'Delivered';
            desc = 'Successfully delivered. 24-hour verification hold is now active.';
          } else if (o.status === 'Delivered') {
            nextStatus = 'Payment Settled';
            desc = 'Artisan payout completed directly into Sharanappa Devanga’s bank account! Verified.';
          }

          // Advance milestone releases if not disputed
          let updatedProtection = o.paymentProtection ? { ...o.paymentProtection } : undefined;
          const isDisputed = o.dispute && (o.dispute.status === 'OPEN' || o.dispute.status === 'UNDER REVIEW');

          if (updatedProtection && !isDisputed) {
            const now = new Date().toISOString();
            const milestones = [...updatedProtection.milestones];

            if (nextStatus === 'Accepted' && milestones[0] && milestones[0].status === 'PENDING') {
              milestones[0] = { ...milestones[0], status: 'RELEASED', releasedAt: now, transactionId: `TXN-DEMO-${Date.now()}-1` };
            }
            if ((nextStatus === 'Quality Checked' || nextStatus === 'Shipped') && milestones[1] && milestones[1].status === 'PENDING') {
              milestones[1] = { ...milestones[1], status: 'RELEASED', releasedAt: now, transactionId: `TXN-DEMO-${Date.now()}-2` };
            }
            if ((nextStatus === 'Delivered' || nextStatus === 'Payment Settled') && milestones[2] && milestones[2].status === 'PENDING') {
              milestones[2] = { ...milestones[2], status: 'RELEASED', releasedAt: now, transactionId: `TXN-DEMO-${Date.now()}-3` };
            }

            const releasedAmt = milestones.reduce((sum, m) => m.status === 'RELEASED' ? sum + m.amount : sum, 0);
            const pendingAmt = Math.max(0, updatedProtection.paymentSecured - releasedAmt - updatedProtection.refundedAmount);

            updatedProtection = {
              ...updatedProtection,
              milestones,
              releasedAmount: releasedAmt,
              pendingAmount: pendingAmt
            };
          }

          return {
            ...o,
            status: nextStatus,
            paymentProtection: updatedProtection,
            trackingHistory: [
              ...o.trackingHistory,
              {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                description: desc
              }
            ]
          };
        }
        return o;
      })
    );

    // Refresh active order representation
    setTimeout(() => {
      const updated = orders.find(o => o.id === orderId);
      if (updated) setActiveOrder(updated);
    }, 100);
  };

  // Flow 3: Post-delivery issue submit responsibility logic
  const handleIssueSubmit = () => {
    if (!selectedOrderForIssue) return;
    playSyntheticChime('click');

    let resolutionText = '';
    if (issueType === 'Damaged' || issueType === 'Wrong Item' || issueType === 'Wrong Size') {
      resolutionText = `Under TantuLink direct rules, the weaver passed strict quality audits prior to dispatch. However, since the item is ${issueType.toLowerCase()}, we will coordinate a pickup and process a 100% full refund to you, while subsidizing the rural artisan's materials.`;
    } else {
      // Change of mind returns rejection to protect manual labor
      resolutionText = `This product is an authentic handloomed creation and matched the exact measurements of length ${selectedOrderForIssue.product.dimensions.length} and width ${selectedOrderForIssue.product.dimensions.width} specified in the listing. To protect the weaver's intensive manual handloom labour (which takes up to 40 hours per piece), this item is not eligible for a change-of-mind return.`;
    }

    setResolvedMessage(resolutionText);
    setShowIssueResolution(true);

    // Update order state with issue details
    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderForIssue.id) {
        return {
          ...o,
          issueReport: {
            issueType,
            note: issueNote,
            reportedAt: new Date().toISOString(),
            resolved: true,
            resolutionMsg: resolutionText
          }
        };
      }
      return o;
    }));
  };

  // Distinct Returns/Replacement/Refund flow - separate from disputes (which are for
  // buyer-vs-artisan conflicting claims) and the legacy instant issue report above.
  // Every step is recorded in statusHistory with a plain-language note.
  const handleSubmitReturnRequest = () => {
    if (!selectedReturnOrder) return;
    playSyntheticChime('click');
    const now = new Date().toISOString();
    const request = {
      id: 'ret-' + Date.now(),
      reason: returnReason,
      resolutionRequested: returnResolution,
      note: returnNoteText,
      status: 'REQUESTED' as ReturnStatus,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: 'REQUESTED' as ReturnStatus, timestamp: now, note: 'Request received - we are reviewing it.' }]
    };
    setOrders(prev => prev.map(o => o.id === selectedReturnOrder.id ? { ...o, returnRequest: request } : o));
    setActiveOrder(prev => prev && prev.id === selectedReturnOrder.id ? { ...prev, returnRequest: request } : prev);
    setSelectedReturnOrder(null);
    setReturnNoteText('');
    playSyntheticChime('success');
  };

  // Demo-only progression trigger (same convention as the order-lifecycle "simulate" button
  // elsewhere in this app, since there is no real backend to advance it automatically).
  const handleAdvanceReturnStatus = (orderId: string) => {
    playSyntheticChime('click');
    const nextStatus: Record<ReturnStatus, { status: ReturnStatus; note: string } | null> = {
      REQUESTED: { status: 'APPROVED', note: 'Approved - please pack the item; pickup/shipping instructions are on the way.' },
      APPROVED: { status: 'IN_TRANSIT', note: 'Your returned item is on its way back to the artisan.' },
      IN_TRANSIT: { status: 'COMPLETED', note: 'Received and inspected - your refund/replacement has been processed.' },
      REJECTED: null,
      COMPLETED: null
    };
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId || !o.returnRequest) return o;
      const advance = nextStatus[o.returnRequest.status];
      if (!advance) return o;
      const now = new Date().toISOString();
      const updatedRequest = {
        ...o.returnRequest,
        status: advance.status,
        updatedAt: now,
        statusHistory: [...o.returnRequest.statusHistory, { status: advance.status, timestamp: now, note: advance.note }]
      };
      const updated = { ...o, returnRequest: updatedRequest };
      setActiveOrder(prevActive => prevActive && prevActive.id === orderId ? updated : prevActive);
      return updated;
    }));
  };

  // Verified-purchase review: only orders marked Delivered may leave a review, and it is tied to
  // that order id as proof of purchase.
  const handleSubmitReview = (order: Order, rating: 1 | 2 | 3 | 4 | 5, text: string) => {
    if (order.status !== 'Delivered') return;
    playSyntheticChime('success');
    const review: ProductReview = {
      id: 'rev-' + Date.now(),
      orderId: order.id,
      productId: order.product.id,
      buyerName: profile?.name || 'Verified Buyer',
      rating,
      text,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, reviews: [...(o.reviews || []), review] } : o));
  };

  const handleReportReview = (orderId: string, reviewId: string) => {
    playSyntheticChime('click');
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return { ...o, reviews: (o.reviews || []).map(r => r.id === reviewId ? { ...r, flagged: true } : r) };
    }));
  };

  // Buyer-artisan chat with a non-blocking off-platform-payment/contact warning and a report path
  const handleSendChatMessage = (order: Order) => {
    const text = chatDraft.trim();
    if (!text) return;
    playSyntheticChime('click');
    const offPlatform = OFF_PLATFORM_PATTERN.test(text);
    const message: ChatMessage = {
      id: 'msg-' + Date.now(),
      orderId: order.id,
      sender: 'buyer',
      text,
      timestamp: new Date().toISOString(),
      offPlatformWarning: offPlatform
    };
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, chatMessages: [...(o.chatMessages || []), message] } : o));
    setActiveOrder(prev => prev && prev.id === order.id ? { ...prev, chatMessages: [...(prev.chatMessages || []), message] } : prev);
    setChatDraft('');
  };

  const handleReportChatMessage = (orderId: string, messageId: string) => {
    playSyntheticChime('click');
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return { ...o, chatMessages: (o.chatMessages || []).map(m => m.id === messageId ? { ...m, flagged: true } : m) };
    }));
  };

  return (
    <div className="max-w-7xl mx-auto bg-cream pb-24 min-h-[85vh] relative px-4 sm:px-6 lg:px-8" id="buyer-view-container">
      
      {/* 1. BROWSE SCREEN */}
      {activeTab === 'browse' && (
        <div className="px-4 py-5 space-y-5">

          {/* Connection status card optimized for limited connectivity */}
          <div className="bg-white rounded-2xl border border-cream-border p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                dataSaver 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              } ${dataSaver ? '' : 'animate-ping'}`}></span>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold leading-none">
                  {dataSaver ? 'Rural Connection Mode' : 'Live Connection'}
                </p>
                <p className="text-[11px] text-charcoal font-semibold mt-0.5">
                  {syncStatus === 'syncing' 
                    ? 'Syncing ledger with artisans...'
                    : `Last checked: ${lastSyncText}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {syncStatus === 'syncing' && (
                <RefreshCw className={`w-3.5 h-3.5 text-terracotta ${dataSaver ? '' : 'animate-spin'}`} />
              )}
              <span className="text-[9px] font-bold text-gray-400 bg-cream-dark px-2 py-0.5 rounded-full font-mono uppercase">
                {dataSaver ? 'Once / 45s' : 'Once / 15s'}
              </span>
            </div>
          </div>
          
          {/* Header search controls */}
          <div className="space-y-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">{t.searchTitle}</h2>
              <p className="text-xs text-gray-500">Search handlooms conversational-style with instant tag filters.</p>
            </div>

            {/* Voice and NLP search bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                disabled={isTypingSearch}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearchQuery(searchQuery);
                  }
                }}
                placeholder={t.buyerSearchPlaceholder}
                className="w-full bg-white border-2 border-indigo-custom/15 text-charcoal rounded-2xl py-3.5 pl-11 pr-12 text-xs focus:outline-none focus:border-terracotta shadow-xs font-semibold"
              />
              <button
                id="search-submit-icon-button"
                onClick={() => saveSearchQuery(searchQuery)}
                className="absolute left-4 text-gray-400 hover:text-indigo-custom transition cursor-pointer"
                title="Search and Save History"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                id="voice-search-trigger"
                onClick={handleVoiceSearchClick}
                className={`absolute right-3.5 p-1.5 rounded-full text-cream transition ${isListeningSearch ? (dataSaver ? 'bg-red-600' : 'bg-red-600 animate-ping') : 'bg-terracotta hover:bg-terracotta-dark'}`}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search History / Recent Searches */}
            {searchHistory.length > 0 && (
              <div className="bg-white/50 border border-cream-border/40 p-2.5 rounded-xl space-y-1.5" id="recent-searches-box">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Recent Searches
                  </span>
                  <button
                    id="clear-all-search-history"
                    onClick={() => {
                      playSyntheticChime('click');
                      setSearchHistory([]);
                      localStorage.removeItem('tantulink_search_history');
                    }}
                    className="text-[9px] text-terracotta hover:underline font-bold tracking-widest lowercase hover:scale-105 transition cursor-pointer"
                  >
                    clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" id="search-history-chips">
                  {searchHistory.map((query, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center bg-white hover:bg-cream-dark text-charcoal rounded-full pl-3 pr-1.5 py-1 border border-gray-200 transition text-[11px] font-semibold hover:border-indigo-custom"
                    >
                      <button
                        id={`recent-search-${idx}`}
                        onClick={() => {
                          setSearchQuery(query);
                          saveSearchQuery(query); // bump to top
                        }}
                        className="hover:text-terracotta transition text-left mr-1.5 truncate max-w-[150px] cursor-pointer"
                        title={query}
                      >
                        {query}
                      </button>
                      <button
                        id={`delete-recent-search-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          playSyntheticChime('click');
                          setSearchHistory(prev => {
                            const updated = prev.filter((_, i) => i !== idx);
                            localStorage.setItem('tantulink_search_history', JSON.stringify(updated));
                            return updated;
                          });
                        }}
                        className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-charcoal transition cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated NLP queries chips */}
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-mustard" />
                Try Judge-Demo Queries (NLP Parsing):
              </p>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    id={`nlp-demo-query-${idx}`}
                    onClick={() => handleQuerySuggestion(item.query)}
                    className="text-left bg-white hover:bg-cream-dark text-[11px] text-charcoal py-2 px-3 rounded-lg border border-gray-200 transition line-clamp-1 font-semibold hover:border-terracotta"
                  >
                    "{item.label}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter tags parsed from NLP query */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="bg-indigo-custom/5 p-3 rounded-xl border border-indigo-custom/10 space-y-1.5" id="nlp-parsed-chips-panel">
              <span className="text-[10px] text-indigo-custom font-extrabold uppercase tracking-wider block">
                Direct NLP Filters Extracted:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeFilters.color && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Color: {activeFilters.color}
                  </span>
                )}
                {activeFilters.maxBudget && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Budget: Under ₹{activeFilters.maxBudget}
                  </span>
                )}
                {activeFilters.material && (
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Yarn: {activeFilters.material}
                  </span>
                )}
                {activeFilters.occasion && (
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Event: {activeFilters.occasion}
                  </span>
                )}
                {activeFilters.style && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Style: {activeFilters.style}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Catalog Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Available Loom Crafts</h3>
                <p className="text-[11px] text-gray-500">Connecting you directly with rural artisan families</p>
              </div>
              
              {/* Quick Filter Tabs for Saved Items */}
              <div className="flex items-center gap-2">
                <button
                  id="buyer-orders-desktop-btn"
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 bg-terracotta text-white shadow-xs"
                >
                  {language === 'kn' ? 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು' : language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}
                </button>
                <button
                  id="open-cart-btn"
                  type="button"
                  onClick={() => { playSyntheticChime('click'); setActiveTab('cart'); }}
                  className="relative px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 bg-indigo-custom text-white shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {t.cart}
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-mustard text-charcoal text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <button
                  id="filter-all-crafts"
                  onClick={() => {
                    playSyntheticChime('click');
                    setShowFavoritesOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    !showFavoritesOnly 
                      ? 'bg-indigo-custom text-cream shadow-xs' 
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  All Crafts ({products.filter(p => p.status !== 'Sold').length})
                </button>
                <button
                  id="filter-saved-crafts"
                  onClick={() => {
                    playSyntheticChime('click');
                    setShowFavoritesOnly(true);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    showFavoritesOnly 
                      ? 'bg-terracotta text-cream shadow-xs' 
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-cream text-cream' : 'text-terracotta'}`} />
                  {t.wishlist} ({savedProductIds.length})
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3">
                {showFavoritesOnly ? (
                  <>
                    <Heart className="w-10 h-10 text-gray-300 mx-auto fill-gray-100" />
                    <p className="text-sm font-semibold text-gray-700">{t.wishlistEmpty}</p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">{t.wishlistEmptyHint}</p>
                    <button
                      id="clear-favorites-filter"
                      onClick={() => {
                        playSyntheticChime('click');
                        setShowFavoritesOnly(false);
                      }}
                      className="text-xs text-terracotta hover:underline font-bold mt-2 inline-block bg-cream px-4 py-1.5 rounded-full border border-terracotta/20"
                    >
                      Browse All Crafts
                    </button>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-10 h-10 text-mustard mx-auto" />
                    <p className="text-sm font-semibold text-gray-700">{t.searchNothingFound}</p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">{t.searchNothingFoundHint}</p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveFilters({}); }}
                      className="text-xs text-terracotta hover:underline font-bold mt-2 inline-block bg-cream px-4 py-1.5 rounded-full border border-terracotta/20"
                    >
                      Clear search filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="buyer-products-grid">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    id={`product-card-${product.id}`}
                    onClick={() => {
                      playSyntheticChime('click');
                      setSelectedProduct(product);
                      addToRecentlyViewed(product.id);
                      setReviewedSpecs(false); // Reset review spec checkbox on click
                      setActiveTab('product-detail');
                    }}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs cursor-pointer hover:shadow-md transition transform hover:-translate-y-0.5 flex flex-col justify-between relative group"
                  >
                    <div className="h-32 relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 bg-charcoal/90 text-cream text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                        ₹{product.price}
                      </span>
                      
                      {/* GI Badge */}
                      {product.giInfo && (
                        <button
                          id={`gi-badge-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            playSyntheticChime('click');
                            setSelectedGiProduct(product);
                          }}
                          className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm transition hover:scale-105 z-10 ${
                            product.giInfo.status === 'VERIFIED'
                              ? 'bg-emerald-600/95 hover:bg-emerald-700 text-white'
                              : product.giInfo.status === 'PENDING'
                              ? 'bg-amber-500/95 hover:bg-amber-600 text-white'
                              : 'bg-rose-500/95 hover:bg-rose-600 text-white'
                          }`}
                          title={`GI ${product.giInfo.status}: ${product.giInfo.productName} (#${product.giInfo.registrationNumber})`}
                        >
                          <Award className="w-3 h-3" />
                          <span>{product.giInfo.status === 'VERIFIED' ? 'GI VERIFIED' : 'GI PENDING'}</span>
                        </button>
                      )}

                      {/* Floating Heart Toggle */}
                      <button
                        id={`favorite-toggle-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          playSyntheticChime('click');
                          toggleSaveProduct(product.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-terracotta transition shadow-sm hover:scale-110 z-10"
                        title={savedProductIds.includes(product.id) ? "Remove from Saved" : "Save Item"}
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 transition-all ${
                            savedProductIds.includes(product.id) 
                              ? 'fill-terracotta text-terracotta' 
                              : 'text-gray-400 hover:text-terracotta'
                          }`} 
                        />
                      </button>
                    </div>

                    <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-xs font-bold text-charcoal leading-snug line-clamp-2">
                          {product.title}
                        </h4>
                        <p className="text-[9px] text-gray-500 mt-1 font-semibold flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-terracotta" />
                          {product.weaverRegion.split(',').slice(-2).join(',').trim()}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-indigo-custom uppercase">
                        <span>Direct Artisan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Viewed Products */}
          {recentlyViewedProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 mt-6" id="recently-viewed-panel">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-custom animate-pulse" />
                  <h4 className="font-serif text-sm font-bold text-charcoal">Recently Viewed Pieces</h4>
                </div>
                <button
                  id="clear-recently-viewed"
                  onClick={() => {
                    playSyntheticChime('click');
                    setRecentlyViewedIds([]);
                    localStorage.removeItem('tantulink_recently_viewed');
                  }}
                  className="text-[10px] text-terracotta hover:underline font-bold"
                >
                  Clear History
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recentlyViewedProducts.map(product => (
                  <div
                    key={`recent-view-${product.id}`}
                    id={`recent-view-card-${product.id}`}
                    onClick={() => {
                      playSyntheticChime('click');
                      setSelectedProduct(product);
                      addToRecentlyViewed(product.id);
                      setReviewedSpecs(false);
                      setActiveTab('product-detail');
                    }}
                    className="bg-cream/45 border border-cream-border/30 rounded-xl p-2 flex gap-2 items-center cursor-pointer hover:border-indigo-custom/30 hover:bg-cream/70 transition shadow-2xs group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-charcoal truncate group-hover:text-indigo-custom transition">
                        {product.title}
                      </p>
                      <p className="text-[9px] font-extrabold text-terracotta">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. PRODUCT DETAIL SCREEN */}
      {activeTab === 'product-detail' && selectedProduct && (
        <div className="space-y-5" id="product-detail-screen">
          <BackButton language={language} onBack={() => setActiveTab('browse')} />
          
          {/* Header Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 flex items-center justify-between">
            <button
              onClick={() => {
                playSyntheticChime('click');
                setActiveTab('browse');
              }}
              className="text-gray-600 hover:text-black p-1 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-charcoal text-base">Direct Loom Details</h3>
            <button
              id={`detail-favorite-toggle-${selectedProduct.id}`}
              onClick={() => {
                playSyntheticChime('click');
                toggleSaveProduct(selectedProduct.id);
              }}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-terracotta transition flex items-center justify-center"
              title={savedProductIds.includes(selectedProduct.id) ? "Remove from Saved" : "Save Item"}
            >
              <Heart 
                className={`w-4 h-4 ${savedProductIds.includes(selectedProduct.id) ? 'fill-terracotta text-terracotta' : 'text-gray-400'}`} 
              />
            </button>
          </div>

          <div className="px-4 space-y-5">
            {/* Product Image Carousel block */}
            <div className="rounded-3xl overflow-hidden aspect-video relative shadow-sm border border-gray-200">
              <img 
                src={selectedProduct.images[0]} 
                alt="" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 bg-terracotta text-cream text-base font-bold px-3 py-1 rounded-full">
                ₹{(selectedProduct?.price ?? 0).toLocaleString()}
              </span>
            </div>

            {/* Title and region */}
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold text-charcoal leading-tight">
                {selectedProduct.title}
              </h2>
              <p className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <MapPin className="w-4 h-4 text-terracotta" />
                Woven in: {selectedProduct.weaverRegion}
              </p>
            </div>

            {/* Geographical Indication (GI) Verification Status & Details */}
            {selectedProduct.giInfo && (
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                selectedProduct.giInfo.status === 'VERIFIED'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : selectedProduct.giInfo.status === 'PENDING'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedProduct.giInfo.status === 'VERIFIED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      Geographical Indication
                    </span>
                    <span className="font-serif font-bold text-xs">
                      {selectedProduct.giInfo.status === 'VERIFIED'
                        ? `GI Certified: ${selectedProduct.giInfo.productName}`
                        : `GI Pending: ${selectedProduct.giInfo.productName}`}
                    </span>
                  </div>
                </div>

                <button
                  id="view-gi-cert-btn"
                  onClick={() => {
                    playSyntheticChime('click');
                    setSelectedGiProduct(selectedProduct);
                  }}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-gray-300 shadow-2xs hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Artisan Story Section */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-charcoal flex items-center gap-1.5">
                <User className="w-4 h-4 text-terracotta" />
                {t.weaverStory}
              </h3>
              
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-300">
                  <img src={selectedProduct.weaverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-indigo-custom">{selectedProduct.weaverName}</h4>
                  <p className="text-gray-500 leading-normal italic font-serif">"{selectedProduct.weaverBio}"</p>
                </div>
              </div>

              <button
                id="hear-story-button"
                onClick={() => handleHearWeaverStory(selectedProduct)}
                className={`w-full text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition border ${
                  storySpeakingId === selectedProduct.id 
                    ? 'bg-indigo-custom text-cream border-indigo-custom animate-pulse'
                    : 'bg-cream text-terracotta border-terracotta/30 hover:bg-cream-dark'
                }`}
              >
                <Play className={`w-4 h-4 ${storySpeakingId === selectedProduct.id ? 'fill-cream text-cream' : ''}`} />
                <span>{storySpeakingId === selectedProduct.id ? 'Speaking Story...' : t.hearWeaverStory}</span>
              </button>
            </div>

            {/* BUY RIGHT PANEL: Handloom exact specs */}
            <div className="bg-gradient-to-br from-indigo-custom/5 to-indigo-custom/10 rounded-2xl p-4 border-2 border-indigo-custom/10 space-y-4" id="buy-right-specs-panel">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-custom text-cream p-1.5 rounded-lg shrink-0">
                  <CheckSquare className="w-4 h-4 text-mustard" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-indigo-custom">{t.buyRightPanel}</h3>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Exact handloom measurements (No returns for size)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Exact Length:</span>
                  <p className="font-serif font-bold text-charcoal">{selectedProduct.dimensions.length}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Exact Width:</span>
                  <p className="font-serif font-bold text-charcoal">{selectedProduct.dimensions.width}</p>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-2.5 mt-1.5">
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Yarn Material:</span>
                  <p className="font-semibold text-charcoal">{selectedProduct.material}</p>
                </div>
              </div>

              <div className="bg-cream p-3 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2 leading-relaxed">
                <p className="flex gap-1.5 items-start text-[11px]">
                  <Info className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{t.variationDisclaimer}</span>
                </p>
                <div className="border-t border-gray-200/60 pt-2 mt-1">
                  <p className="font-bold text-charcoal text-[10px] uppercase">Care Instructions:</p>
                  <p className="text-[11px] mt-0.5 text-gray-500 italic">{selectedProduct.careInstructions}</p>
                </div>
              </div>

              {/* Strict specification check verification */}
              <label 
                id="buy-right-checkbox-label"
                className="flex items-start gap-2.5 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={reviewedSpecs}
                  onChange={(e) => {
                    playSyntheticChime('click');
                    setReviewedSpecs(e.target.checked);
                  }}
                  className="w-5 h-5 text-terracotta rounded border-indigo-custom focus:ring-terracotta shrink-0 mt-0.5"
                />
                <span className="text-xs font-bold text-indigo-custom leading-normal">
                  {t.reviewCheckbox}
                </span>
              </label>
            </div>

            {/* Producer Capacity Info Badge */}
            <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold block">Producer Capacity:</span>
                  <span className="text-[11px] text-amber-800">
                    Available for solo/single-piece orders • Bulk capacity: up to {selectedProduct.capacityPerMonth || 12} units/month
                  </span>
                </div>
              </div>
            </div>

            {/* Main Buy Button & Custom Order Trigger */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="buy-now-submit-btn"
                disabled={!reviewedSpecs}
                onClick={handleBuyNowTrigger}
                className={`w-full font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition transform ${
                  reviewedSpecs 
                    ? 'bg-terracotta hover:bg-terracotta-dark text-cream active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-mustard" />
                <span>{t.buyNow}</span>
              </button>

              <button
                id="add-to-cart-btn"
                onClick={() => addToCart(selectedProduct.id)}
                className="w-full font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 bg-white border-2 border-indigo-custom text-indigo-custom hover:bg-indigo-custom/5"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{addedToCartId === selectedProduct.id ? t.addedToCart : t.addToCart}</span>
              </button>

              <button
                id="custom-bulk-order-btn"
                onClick={() => {
                  playSyntheticChime('click');
                  setShowCustomOrderModal(true);
                  setCustomOrderSuccess(false);
                }}
                className="w-full font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 bg-indigo-custom hover:bg-indigo-light text-white shadow-md transition active:scale-95"
              >
                <Sparkles className="w-5 h-5 text-mustard" />
                <span>Custom / Bulk Order Builder</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3 shadow-xs" id="craft-recommendations-panel">
              <h3 className="font-serif text-sm font-bold text-charcoal">{t.recommendationsTitle}</h3>
              {recommendedProducts.length > 0 && (
                <p className="text-[10px] text-gray-400 -mt-2">{t.recommendationsWhy}</p>
              )}
              {recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {recommendedProducts.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(product);
                        addToRecentlyViewed(product.id);
                        setReviewedSpecs(false);
                      }}
                      className="text-left bg-cream rounded-xl overflow-hidden border border-cream-border hover:border-terracotta transition"
                    >
                      <img src={product.images[0]} alt={product.title} className="w-full h-20 object-cover" referrerPolicy="no-referrer" />
                      <span className="block p-2 text-[11px] font-bold text-charcoal line-clamp-2">{product.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">{t.recommendationsEmpty}</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 3. TRANSPARENT CHECKOUT SCREEN */}
      {activeTab === 'checkout' && selectedProduct && (
        <div className="space-y-5" id="checkout-screen">
          <BackButton language={language} onBack={() => setActiveTab('product-detail')} />
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 flex items-center gap-3">
            <button
              onClick={() => {
                playSyntheticChime('click');
                setActiveTab('product-detail');
              }}
              className="text-gray-600 hover:text-black p-1 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-charcoal text-base">{t.checkoutTitle}</h3>
          </div>

          <div className="px-4 space-y-6">
            
            {/* Product recap */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 flex gap-3 shadow-xs">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-xs">
                <h4 className="font-serif font-bold text-charcoal">{selectedProduct.title}</h4>
                <p className="text-gray-500 mt-0.5">Artisan: {selectedProduct.weaverName}</p>
                <p className="font-extrabold text-terracotta mt-1 text-sm">₹{selectedProduct.price}</p>
              </div>
            </div>

            {/* TRANSPARENT PRICING BREAKDOWN (The heart of TantuLink's pitch!) */}
            <div className="bg-white rounded-2xl border-2 border-indigo-custom/10 overflow-hidden shadow-xs" id="transparent-pricing-table">
              <div className="bg-indigo-custom text-cream p-3.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-mustard" />
                <span className="font-serif text-xs font-bold uppercase tracking-wider">{t.priceBreakdown}</span>
              </div>

              <div className="p-4 space-y-3 text-xs font-medium text-gray-700">
                
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500">{t.customerPrice}</span>
                  <span className="font-bold text-charcoal">₹{selectedProduct.price}</span>
                </div>

                {/* Sub components */}
                {(() => {
                  const breakdown = getPriceBreakdown(selectedProduct.price);
                  return (
                    <>
                      <div className="flex justify-between items-start text-[11px] leading-snug">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-gray-400" />
                          {t.logisticsCost}
                        </span>
                        <span className="text-gray-600">-₹{breakdown.logistics}</span>
                      </div>

                      <div className="flex justify-between items-start text-[11px] leading-snug">
                        <span className="text-gray-500 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                          {t.platformFee}
                        </span>
                        <span className="text-gray-600">-₹{breakdown.platformFee}</span>
                      </div>

                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-xs mt-3">
                        <span className="text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                          {t.weaverEarnings}
                        </span>
                        <span className="text-emerald-900 font-serif font-extrabold text-base">
                          ₹{breakdown.weaverDirect} ({breakdown.weaverPercentage}%)
                        </span>
                      </div>
                    </>
                  );
                })()}

              </div>
            </div>

            {/* Payment triggers */}
            <div className="space-y-3" id="upi-payment-panel">
              <button
                id="pay-instant-upi-btn"
                onClick={handleUpiPayComplete}
                disabled={upiProcessing}
                className="w-full bg-gradient-to-r from-[#5f259f] to-[#7b32cd] hover:opacity-90 text-cream font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition transform active:scale-95"
              >
                {upiProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing Secure UPI...</span>
                  </>
                ) : (
                  <>
                    <span>{t.payWithUpi}</span>
                  </>
                )}
              </button>

              <div className="flex justify-center items-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
                <span>256-Bit Bank Encryption</span>
                <span>•</span>
                <span>UPI / RuPay verified</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* CART SCREEN - multi-item, grouped by artisan */}
      {activeTab === 'cart' && (
        <div className="space-y-5" id="cart-screen">
          <BackButton language={language} onBack={() => setActiveTab('browse')} />

          <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 flex items-center gap-3">
            <button
              onClick={() => { playSyntheticChime('click'); setActiveTab('browse'); }}
              className="text-gray-600 hover:text-black p-1 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-charcoal text-base">{t.cart}</h3>
          </div>

          <div className="px-4 space-y-5">
            {cartLines.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">{t.cartEmpty}</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">{t.cartEmptyHint}</p>
                <button
                  onClick={() => { playSyntheticChime('click'); setActiveTab('browse'); }}
                  className="text-xs text-terracotta hover:underline font-bold mt-2 inline-block bg-cream px-4 py-1.5 rounded-full border border-terracotta/20"
                >
                  Browse All Crafts
                </button>
              </div>
            ) : (
              <>
                {cartArtisanCount > 1 && (
                  <div className="bg-indigo-custom/5 border border-indigo-custom/20 rounded-2xl p-3.5 flex gap-2.5 items-start text-xs text-indigo-custom">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{(t.cartOrderSplitNotice || '').replace('{n}', String(cartArtisanCount))}</span>
                  </div>
                )}

                {Object.entries(cartByArtisan).map(([artisanName, lines]) => (
                  <div key={artisanName} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                    <div className="bg-cream px-4 py-2.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      {t.cartFromArtisan} {artisanName}
                    </div>
                    <div className="divide-y divide-gray-100">
                      {lines.map(({ item, product }) => (
                        <div key={product.id} className="p-3.5 flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-charcoal truncate">{product.title}</p>
                            <p className="text-xs font-extrabold text-terracotta mt-0.5">₹{product.price}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateCartQuantity(product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-[10px] font-bold text-gray-400 hover:text-rose-600 shrink-0 ml-1"
                          >
                            {t.cartRemove}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.cartGrandTotal}</span>
                  <span className="font-serif font-extrabold text-charcoal text-lg">₹{cartGrandTotal}</span>
                </div>

                <button
                  id="cart-proceed-checkout-btn"
                  onClick={() => { playSyntheticChime('click'); setActiveTab('cart-checkout'); }}
                  className="w-full font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-cream shadow-md transition active:scale-95"
                >
                  <ShieldCheck className="w-5 h-5 text-mustard" />
                  <span>{t.cartProceedToCheckout}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CART CHECKOUT SCREEN - one payment, split per artisan behind the scenes */}
      {activeTab === 'cart-checkout' && cartLines.length > 0 && (
        <div className="space-y-5" id="cart-checkout-screen">
          <BackButton language={language} onBack={() => setActiveTab('cart')} />

          <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 flex items-center gap-3">
            <button
              onClick={() => { playSyntheticChime('click'); setActiveTab('cart'); }}
              className="text-gray-600 hover:text-black p-1 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-charcoal text-base">{t.checkoutTitle}</h3>
          </div>

          <div className="px-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-xs">
              {cartLines.map(({ item, product }) => (
                <div key={product.id} className="p-3.5 flex gap-3 items-center text-xs">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-charcoal truncate">{product.title} {item.quantity > 1 ? `× ${item.quantity}` : ''}</p>
                    <p className="text-gray-500">{t.cartFromArtisan} {product.weaverName}</p>
                  </div>
                  <span className="font-extrabold text-terracotta">₹{product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {cartArtisanCount > 1 && (
              <div className="bg-indigo-custom/5 border border-indigo-custom/20 rounded-2xl p-3.5 flex gap-2.5 items-start text-xs text-indigo-custom">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{(t.cartOrderSplitNotice || '').replace('{n}', String(cartArtisanCount))}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between shadow-xs">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.cartGrandTotal}</span>
              <span className="font-serif font-extrabold text-charcoal text-lg">₹{cartGrandTotal}</span>
            </div>

            <div className="space-y-3" id="cart-upi-payment-panel">
              <button
                id="cart-pay-instant-upi-btn"
                onClick={handleCartCheckoutComplete}
                disabled={upiProcessing}
                className="w-full bg-gradient-to-r from-[#5f259f] to-[#7b32cd] hover:opacity-90 text-cream font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition transform active:scale-95"
              >
                {upiProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing Secure UPI...</span>
                  </>
                ) : (
                  <span>{t.payWithUpi}</span>
                )}
              </button>

              <div className="flex justify-center items-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
                <span>256-Bit Bank Encryption</span>
                <span>•</span>
                <span>UPI / RuPay verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS STATUS TRACKER SCREEN */}
      {activeTab === 'orders' && (
        <div className="px-4 py-5 space-y-6" id="order-tracker-screen">
          <BackButton language={language} onBack={() => setActiveTab('browse')} />
          
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">{t.orderConfirmed}</h2>
            <p className="text-xs text-gray-500">Track your order's direct loom dispatch lifecycle progress below.</p>
          </div>

          {buyerOrders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3" id="buyer-orders-list">
              <h3 className="font-serif text-base font-bold text-charcoal">
                {language === 'kn' ? 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು' : language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}
              </h3>
              <div className="grid gap-2">
                {buyerOrders.map(order => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setActiveOrder(order)}
                    className={`w-full text-left rounded-xl border p-3 transition ${
                      (activeOrder?.id || orders[0]?.id) === order.id
                        ? 'border-terracotta bg-cream'
                        : 'border-gray-200 hover:border-terracotta/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-xs text-charcoal truncate">{order.product.title}</span>
                      <span className="text-[10px] font-mono text-gray-500 shrink-0">#{order.id}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-500">
                      <span>₹{order.product.price.toLocaleString('en-IN')}</span>
                      <span>{order.status}</span>
                      <span>{new Date(order.orderDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {buyerOrders.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200 space-y-3">
              <p className="text-sm font-semibold text-gray-500">
                {language === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : language === 'hi' ? 'अभी कोई ऑर्डर नहीं मिला।' : 'No placed orders found yet.'}
              </p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಬ್ರೌಸ್ ಮಾಡಿ ಮತ್ತು ಮೊದಲ ಆರ್ಡರ್ ಮಾಡಿ.' : language === 'hi' ? 'बाज़ार देखें और अपना पहला ऑर्डर करें।' : 'Browse the marketplace and place your first order.'}
              </p>
              <button
                onClick={() => { playSyntheticChime('click'); setActiveTab('browse'); }}
                className="text-xs text-terracotta hover:underline font-bold mt-1 inline-block bg-cream px-4 py-1.5 rounded-full border border-terracotta/20"
              >
                Browse All Crafts
              </button>
            </div>
          ) : (
            (() => {
              const currentOrder = activeOrder || buyerOrders[0];
              const steps = [
                'Order Received',
                'Accepted',
                'Quality Checked',
                'Pickup Arranged',
                'Shipped',
                'Delivered',
                'Payment Settled'
              ];
              const currentStepIndex = steps.indexOf(currentOrder.status);

              return (
                <div className="space-y-5" key={currentOrder.id}>
                  
                  {/* Order summary card */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 flex gap-3 shadow-xs">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={currentOrder.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-xs">
                      <h4 className="font-serif font-bold text-indigo-custom">{currentOrder.product.title}</h4>
                      <p className="text-gray-500 mt-0.5">Order ID: #{currentOrder.id} • Value: ₹{currentOrder.product.price}</p>
                      <p className="text-terracotta font-semibold mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-terracotta animate-ping"></span>
                        Status: {currentOrder.status}
                      </p>
                    </div>
                  </div>

                  {/* Shared reference when this order was part of a multi-artisan cart checkout */}
                  {currentOrder.cartGroupId && (() => {
                    const siblings = orders.filter(o => o.cartGroupId === currentOrder.cartGroupId);
                    if (siblings.length <= 1) return null;
                    return (
                      <div className="bg-indigo-custom/5 border border-indigo-custom/20 rounded-2xl p-3.5 text-xs text-indigo-custom space-y-2">
                        <p className="font-bold">{t.orderReference}: {currentOrder.cartGroupId}</p>
                        <p>{siblings.length} {t.shipmentsFromArtisans}:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {siblings.map(s => (
                            <button
                              key={s.id}
                              onClick={() => setActiveOrder(s)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                                s.id === currentOrder.id ? 'bg-indigo-custom text-white border-indigo-custom' : 'bg-white border-indigo-custom/30 hover:border-indigo-custom'
                              }`}
                            >
                              {s.product.weaverName} • {s.status}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Animated Order Tracking Progress Bar (with QC & Dispatch State Transitions) */}
                  <OrderTrackingProgressBar
                    order={currentOrder}
                    language={language}
                    variant="full"
                    onAdvanceStatus={() => handleAdvanceLifecycle(currentOrder.id)}
                    showSimulateTrigger={true}
                  />

                  {/* Feature 2: TantuLink Payment Protection (Milestone Escrow Tracker) */}
                  <PaymentProtectionTracker
                    order={currentOrder}
                    onUpdateOrder={(updated) => {
                      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
                      if (activeOrder?.id === updated.id) setActiveOrder(updated);
                    }}
                    userRole="buyer"
                      language={language}
                  />

                  {/* Feature 3: Dispute & Escrow Refund Flow */}
                  <div className="bg-white rounded-2xl p-4 border border-cream-border space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span className="font-serif font-bold text-xs text-charcoal">
                          Dispute & Escrow Resolution
                        </span>
                      </div>
                      {currentOrder.dispute && (
                        <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full uppercase">
                          {currentOrder.dispute.status}
                        </span>
                      )}
                    </div>

                    {currentOrder.dispute ? (
                      <div className="space-y-2 text-xs">
                        <p className="text-gray-600 text-[11px]">
                          Active dispute registered: <span className="font-bold text-charcoal">{currentOrder.dispute.reason}</span>. Escrow releases are paused.
                        </p>
                        <button
                          id={`view-dispute-btn-${currentOrder.id}`}
                          onClick={() => {
                            playSyntheticChime('click');
                            setSelectedDisputeOrder(currentOrder);
                            setDisputeInitialMode('view');
                          }}
                          className="w-full bg-cream hover:bg-cream-dark border border-gray-300 font-bold py-2.5 px-3 rounded-xl text-xs text-charcoal flex items-center justify-center gap-1.5 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-custom" />
                          <span>View Dispute & Resolution Details</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <p className="text-[11px] text-gray-500">
                          Handloom not matching weave specifications or damaged in transit?
                        </p>
                        <button
                          id={`open-raise-dispute-btn-${currentOrder.id}`}
                          onClick={() => {
                            playSyntheticChime('click');
                            setSelectedDisputeOrder(currentOrder);
                            setDisputeInitialMode('raise');
                          }}
                          className="w-full sm:w-auto shrink-0 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Raise Dispute / Refund</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Flow 3: Post-delivery Issue Reporting Trigger */}
                  {currentOrder.status === 'Delivered' && !currentOrder.issueReport && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-3" id="post-delivery-returns-box">
                      <div className="flex justify-center text-rose-600">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-sm text-charcoal">Report an Issue / Ask Return</h4>
                        <p className="text-xs text-gray-500">Need resolution? Register any physical defect under TantuLink rules.</p>
                      </div>
                      <button
                        id="open-issue-reporting-btn"
                        onClick={() => {
                          playSyntheticChime('click');
                          setSelectedOrderForIssue(currentOrder);
                          setShowIssueResolution(false);
                          setIssueNote('');
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-cream font-bold py-3 px-4 rounded-xl text-xs shadow-xs transition"
                      >
                        Report Issue / Return Request
                      </button>
                    </div>
                  )}

                  {/* Post-delivery Issue resolution feedback */}
                  {currentOrder.issueReport && (
                    <div className="bg-indigo-custom/5 border border-indigo-custom/10 p-4 rounded-2xl space-y-3" id="reported-issue-box">
                      <div className="flex items-center gap-2 text-indigo-custom">
                        <MessageSquare className="w-5 h-5 text-mustard" />
                        <h4 className="font-serif font-bold text-sm">Issue Resolution Registered</h4>
                      </div>
                      <div className="space-y-2 text-xs leading-relaxed text-gray-700">
                        <p><span className="font-bold">Reported Category:</span> {currentOrder.issueReport.issueType}</p>
                        <p><span className="font-bold">Your Note:</span> "{currentOrder.issueReport.note || 'No description provided'}"</p>
                        <div className="bg-white p-3 rounded-xl border border-indigo-custom/10 space-y-1">
                          <span className="text-[10px] font-bold text-terracotta uppercase block">TantuLink Resolution Logic:</span>
                          <p className="text-charcoal italic font-serif">"{currentOrder.issueReport.resolutionMsg}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Distinct Returns/Replacement/Refund flow - separate from disputes above */}
                  {currentOrder.status === 'Delivered' && !currentOrder.returnRequest && (
                    <button
                      id="open-return-request-btn"
                      onClick={() => {
                        playSyntheticChime('click');
                        setSelectedReturnOrder(currentOrder);
                        setReturnReason('Wrong item');
                        setReturnResolution('REFUND');
                        setReturnNoteText('');
                      }}
                      className="w-full bg-white hover:bg-cream border-2 border-indigo-custom/30 text-indigo-custom font-bold py-3 px-4 rounded-2xl text-xs shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t.returnOrReplace}
                    </button>
                  )}
                  {currentOrder.status !== 'Delivered' && (
                    <p className="text-[11px] text-gray-400 text-center">{t.returnNotAvailable}</p>
                  )}

                  {currentOrder.returnRequest && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3" id="return-status-card">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-charcoal">{t.returnStatus}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-custom/10 text-indigo-custom">
                          {currentOrder.returnRequest.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {currentOrder.returnRequest.statusHistory.map((entry, i) => (
                          <div key={i} className="flex gap-2 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-charcoal font-semibold">{entry.note}</p>
                              <p className="text-[10px] text-gray-400">{new Date(entry.timestamp).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(currentOrder.returnRequest.status === 'REQUESTED' || currentOrder.returnRequest.status === 'APPROVED' || currentOrder.returnRequest.status === 'IN_TRANSIT') && (
                        <button
                          onClick={() => handleAdvanceReturnStatus(currentOrder.id)}
                          className="text-[10px] font-bold text-terracotta hover:underline"
                        >
                          Simulate next update (demo)
                        </button>
                      )}
                    </div>
                  )}

                  {/* Verified-purchase reviews */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3" id="order-reviews-panel">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-mustard fill-mustard" />
                      <h4 className="font-serif font-bold text-sm text-charcoal">{t.reviews}</h4>
                    </div>
                    {currentOrder.status === 'Delivered' ? (
                      <ReviewComposer
                        alreadyReviewed={(currentOrder.reviews || []).length > 0}
                        onSubmit={(rating, text) => handleSubmitReview(currentOrder, rating, text)}
                        t={t}
                      />
                    ) : (
                      <p className="text-xs text-gray-500">{t.reviewNeedsPurchase}</p>
                    )}
                    {(currentOrder.reviews || []).map(review => (
                      <div key={review.id} className="border-t border-gray-100 pt-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map(n => (
                              <Star key={n} className={`w-3 h-3 ${n <= review.rating ? 'fill-mustard text-mustard' : 'text-gray-200'}`} />
                            ))}
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> {t.verifiedPurchase}
                            </span>
                          </div>
                          {!review.flagged ? (
                            <button onClick={() => handleReportReview(currentOrder.id, review.id)} className="text-[10px] text-gray-400 hover:text-rose-600 flex items-center gap-0.5">
                              <Flag className="w-3 h-3" /> {t.reportReview}
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">{t.reviewReportedThanks}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700">{review.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Buyer-artisan chat, with off-platform-payment warning and reporting */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3" id="order-chat-panel">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-custom" />
                      <h4 className="font-serif font-bold text-sm text-charcoal">{t.chatWithArtisan}</h4>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(currentOrder.chatMessages || []).length === 0 ? (
                        <p className="text-xs text-gray-500">{t.chatEmpty}</p>
                      ) : (
                        (currentOrder.chatMessages || []).map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${msg.sender === 'buyer' ? 'bg-indigo-custom text-white' : 'bg-cream text-charcoal'}`}>
                              <p>{msg.text}</p>
                              {msg.offPlatformWarning && (
                                <p className="mt-1 text-[10px] text-amber-200 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> {t.chatOffPlatformWarning}
                                </p>
                              )}
                              {!msg.flagged ? (
                                <button onClick={() => handleReportChatMessage(currentOrder.id, msg.id)} className="mt-1 text-[9px] underline opacity-70">
                                  {t.chatReportMessage}
                                </button>
                              ) : (
                                <p className="mt-1 text-[9px] italic opacity-70">{t.chatReportedThanks}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatDraft}
                        onChange={(e) => setChatDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(currentOrder); }}
                        placeholder={t.chatPlaceholder}
                        className="flex-1 bg-cream border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-terracotta"
                      />
                      <button
                        onClick={() => handleSendChatMessage(currentOrder)}
                        className="bg-indigo-custom hover:bg-indigo-light text-white px-3 py-2 rounded-xl shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()
          )}

        </div>
      )}

      {/* Distinct Return/Replace Request Modal (separate from the dispute modal and legacy issue modal) */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border-2 border-indigo-custom rounded-3xl p-5 sm:p-6 text-left max-w-md w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-charcoal text-base">{t.returnOrReplace}</h3>
              <button onClick={() => setSelectedReturnOrder(null)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">{t.returnReasonLabel}</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value as ReturnReason)}
                className="w-full bg-cream border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-terracotta"
              >
                {(['Wrong item', 'Damaged', 'Defective', 'Materially different', 'Change of mind'] as ReturnReason[]).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">{t.returnOrReplace}</label>
              <div className="flex gap-2">
                {(['REFUND', 'REPLACEMENT'] as ReturnResolutionType[]).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setReturnResolution(opt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${returnResolution === opt ? 'bg-indigo-custom text-white border-indigo-custom' : 'bg-white border-gray-200 text-gray-600'}`}
                  >
                    {opt === 'REFUND' ? 'Refund' : 'Replacement'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">{t.returnNote}</label>
              <textarea
                value={returnNoteText}
                onChange={(e) => setReturnNoteText(e.target.value)}
                rows={3}
                className="w-full bg-cream border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-terracotta resize-none"
              />
            </div>

            <button
              onClick={handleSubmitReturnRequest}
              className="w-full bg-indigo-custom hover:bg-indigo-light text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
            >
              {t.returnSubmit}
            </button>
          </div>
        </div>
      )}

      {/* Post-Delivery Issue Reporting Modal Dialogue */}
      {selectedOrderForIssue && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-cream border-2 border-terracotta rounded-3xl p-5 text-left max-w-sm w-full shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Report Post-Delivery Issue</h3>
                <p className="text-xs text-gray-500">Select issue category to resolve based on verified specs.</p>
              </div>
              <button
                onClick={() => setSelectedOrderForIssue(null)}
                className="text-gray-400 hover:text-black font-extrabold text-lg p-1 bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Issue Selector checkboxes */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-indigo-custom uppercase tracking-wider block">Issue Category:</label>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'Damaged', label: 'Damaged' },
                  { key: 'Wrong Item', label: 'Wrong Item' },
                  { key: 'Wrong Size', label: 'Wrong Size' },
                  { key: 'Not as Described', label: 'Changed Mind' }
                ].map((item) => (
                  <button
                    key={item.key}
                    id={`issue-type-button-${item.key}`}
                    onClick={() => {
                      playSyntheticChime('click');
                      setIssueType(item.key as any);
                    }}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-left transition ${
                      issueType === item.key 
                        ? 'bg-indigo-custom border-indigo-custom text-cream' 
                        : 'bg-white border-gray-200 text-charcoal hover:border-gray-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Photo upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-custom uppercase tracking-wider block">Defect Photo (Proof):</label>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                {issuePhoto ? (
                  <div className="relative">
                    <img src={selectedOrderForIssue.product.images[0]} alt="" className="h-24 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => setIssuePhoto(false)}
                      className="absolute top-1 right-1 bg-red-600 text-cream p-1 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    id="issue-simulate-photo-btn"
                    onClick={() => {
                      playSyntheticChime('click');
                      setIssuePhoto(true);
                      playSyntheticChime('success');
                    }}
                    className="text-xs font-bold text-terracotta flex items-center justify-center gap-1 mx-auto"
                  >
                    Snaps defect picture
                  </button>
                )}
              </div>
            </div>

            {/* Text description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-indigo-custom uppercase tracking-wider block">Details note:</label>
              <textarea
                value={issueNote}
                onChange={(e) => setIssueNote(e.target.value)}
                placeholder="Briefly state the issue with threads, size, or dye..."
                className="w-full bg-white p-3 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-terracotta min-h-[60px]"
              />
            </div>

            {/* Bottom action controls */}
            <div className="space-y-3 pt-1">
              <button
                id="submit-issue-btn"
                onClick={handleIssueSubmit}
                className="w-full bg-rose-600 hover:bg-rose-700 text-cream font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                Submit Resolution Request
              </button>
            </div>

            {/* Resolution overlay drawer */}
            {showIssueResolution && (
              <div className="bg-indigo-custom text-cream p-4 rounded-2xl space-y-3 border-2 border-mustard" id="issue-resolution-drawer">
                <div className="flex gap-2 items-center text-mustard font-bold text-xs">
                  <ShieldCheck className="w-5 h-5 text-mustard" />
                  <span>Verified TantuLink Resolution Policy:</span>
                </div>
                <p className="text-xs leading-relaxed italic font-serif">
                  "{resolvedMessage}"
                </p>
                <button
                  id="dismiss-resolution-modal-btn"
                  onClick={() => {
                    playSyntheticChime('success');
                    setSelectedOrderForIssue(null);
                    setShowIssueResolution(false);
                    // Navigate to refresh active order tracker tab automatically
                    setActiveTab('orders');
                  }}
                  className="w-full bg-cream text-charcoal font-bold py-2 px-3 rounded-lg text-xs"
                >
                  I Understand, Return to Tracker
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Feature 1: Geographical Indication (GI) Details & Verification Modal */}
      {selectedGiProduct && (
        <GiModal
          product={selectedGiProduct}
          onClose={() => setSelectedGiProduct(null)}
          onUpdateProductGi={(updated) => {
            if (selectedProduct?.id === updated.id) setSelectedProduct(updated);
            setSelectedGiProduct(updated);
          }}
        />
      )}

      {/* Feature 3: Dispute & Refund Modal */}
      {selectedDisputeOrder && (
        <DisputeModal
          order={selectedDisputeOrder}
          onClose={() => setSelectedDisputeOrder(null)}
          initialMode={disputeInitialMode}
          onUpdateOrder={(updated) => {
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
            if (activeOrder?.id === updated.id) setActiveOrder(updated);
            setSelectedDisputeOrder(updated);
          }}
        />
      )}

      {/* Feature 4: Custom & Bulk Order Builder Modal */}
      {showCustomOrderModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-cream border-2 border-terracotta rounded-3xl p-5 text-left max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 my-auto relative">
            <div className="flex justify-between items-start border-b border-cream-dark pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Custom & Bulk Order Builder</h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Direct artisan specification request
                </p>
              </div>
              <button
                onClick={() => {
                  playSyntheticChime('click');
                  setShowCustomOrderModal(false);
                }}
                className="text-gray-400 hover:text-black font-extrabold text-sm p-1.5 bg-white rounded-full border border-cream-border shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {customOrderSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-emerald-950">Spec Request Submitted!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your custom order specifications have been dispatched to master artisan <span className="font-bold">{selectedProduct.weaverName}</span>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-left text-xs text-gray-700 space-y-1">
                  <p>✓ Quantity: <span className="font-bold">{customQty} units</span></p>
                  <p>✓ Desired Timeline: <span className="font-bold">{customTimelineDays} days</span></p>
                  <p>✓ Confirmed orders plug directly into Escrow Milestone Payments.</p>
                </div>
                <button
                  onClick={() => {
                    playSyntheticChime('click');
                    setShowCustomOrderModal(false);
                  }}
                  className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Return to Product
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-cream-border">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Selected Handloom Base</p>
                  <p className="font-serif font-bold text-sm text-charcoal">{selectedProduct.title}</p>
                  <p className="text-[10px] text-indigo-custom font-semibold">Artisan: {selectedProduct.weaverName}</p>
                </div>

                {/* Stated Producer Capacity Indicator */}
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex justify-between items-center text-amber-900 font-bold text-[11px]">
                    <span>Stated Artisan Capacity Limit:</span>
                    <span className="font-mono bg-amber-200/80 px-1.5 py-0.5 rounded text-[10px]">
                      {selectedProduct.capacityPerMonth || 12} units / month
                    </span>
                  </div>
                  {customQty > (selectedProduct.capacityPerMonth || 12) && (
                    <div className="bg-amber-100/90 border border-amber-300 p-2 rounded-lg text-amber-950 text-[10px] leading-tight flex items-start gap-1.5 mt-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Capacity Warning:</span>
                        Requested {customQty} units exceeds stated capacity ({selectedProduct.capacityPerMonth || 12} units/month).
                        We recommend splitting into a staged delivery schedule or flagging for artisan manual feasibility review.
                      </div>
                    </div>
                  )}
                </div>

                {/* Spec Form */}
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-charcoal block mb-1">Required Quantity (Units)</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      value={customQty}
                      onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white p-2.5 rounded-xl border border-cream-dark focus:outline-none focus:border-terracotta text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-charcoal block mb-1">Desired Completion Timeline (Days)</label>
                    <input
                      type="number"
                      min={7}
                      max={180}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      value={customTimelineDays}
                      onChange={(e) => setCustomTimelineDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white p-2.5 rounded-xl border border-cream-dark focus:outline-none focus:border-terracotta text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-charcoal block mb-1">Custom Specifications & Notes</label>
                    <textarea
                      rows={3}
                      value={customSpecs}
                      onChange={(e) => setCustomSpecs(e.target.value)}
                      placeholder="Specify custom colors, embroidery patterns, border designs, packaging requirements..."
                      className="w-full bg-white p-2.5 rounded-xl border border-cream-dark focus:outline-none focus:border-terracotta text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      playSyntheticChime('success');
                      const requestObj = {
                        id: 'cbr-' + Date.now(),
                        buyerName: profile?.name || 'Patron Buyer',
                        buyerContact: profile?.phone || '+91 98112 33445',
                        buyerId: profile?.buyerId || 'BYR-4012',
                        producerId: selectedProduct.weaverName,
                        productTitle: `${selectedProduct.title} (Custom Spec)`,
                        productId: selectedProduct.id,
                        quantity: customQty,
                        specifications: customSpecs,
                        desiredTimelineDays: customTimelineDays,
                        status: 'PENDING_QUOTE' as const,
                        createdAt: new Date().toISOString(),
                        capacityWarningExceeded: customQty > (selectedProduct.capacityPerMonth || 12),
                        stagedScheduleSuggested: customQty > (selectedProduct.capacityPerMonth || 12)
                      };

                      // Dispatch event for WeaverView to receive
                      window.dispatchEvent(new CustomEvent('taana_new_custom_request', { detail: requestObj }));

                      // Save to localStorage
                      try {
                        const existing = JSON.parse(localStorage.getItem('taana_custom_requests') || '[]');
                        localStorage.setItem('taana_custom_requests', JSON.stringify([requestObj, ...existing]));
                      } catch (e) {}

                      setCustomOrderSuccess(true);
                    }}
                    className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4 text-mustard" />
                    <span>Submit Custom Spec Request to Artisan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// Small inline star-rating + text composer for verified-purchase reviews. Kept outside the main
// component since it needs no access to BuyerView's wider state, only its own local draft.
const ReviewComposer: React.FC<{ alreadyReviewed: boolean; onSubmit: (rating: 1 | 2 | 3 | 4 | 5, text: string) => void; t: Translation }> = ({ alreadyReviewed, onSubmit, t }) => {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [text, setText] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (justSubmitted) {
    return <p className="text-xs text-emerald-700 font-semibold">{t.reviewSubmitted}</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => setRating(n as 1 | 2 | 3 | 4 | 5)}>
            <Star className={`w-5 h-5 ${n <= rating ? 'fill-mustard text-mustard' : 'text-gray-200'}`} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.writeReview}
        rows={2}
        className="w-full bg-cream border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-terracotta resize-none"
      />
      <button
        type="button"
        disabled={!text.trim()}
        onClick={() => { onSubmit(rating, text.trim()); setJustSubmitted(true); }}
        className={`text-xs font-bold px-3 py-1.5 rounded-full ${text.trim() ? 'bg-terracotta text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {t.writeReview}
      </button>
      {alreadyReviewed && <p className="text-[10px] text-gray-400">You can leave another review too.</p>}
    </div>
  );
};
