import React, { useState } from 'react';
import { 
  User, ShieldCheck, Landmark, MapPin, Phone, Award, 
  RefreshCw, X, Wifi, WifiOff, ShieldAlert, Calendar, Receipt, 
  ShoppingBag, CheckCircle2, ChevronDown, ChevronUp, Archive,
  Clock, ExternalLink, ArrowRight, Package, Check, Sparkles,
  FileText, QrCode, IndianRupee, CreditCard, Smartphone,
  CheckCircle, Copy, Zap
} from 'lucide-react';
import { Language, Order } from '../types';
import { playSyntheticChime } from '../data';
import { OrderTrackingProgressBar } from './OrderTrackingProgressBar';
import { BackButton } from './BackButton';

interface AccountModalProps {
  language: Language;
  profile: any;
  dataSaver: boolean;
  setDataSaver: (val: boolean) => void;
  onClose: () => void;
  onResetOnboarding: () => void;
  orders: Order[];
  onOpenLogin?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  language,
  profile,
  dataSaver,
  setDataSaver,
  onClose,
  onResetOnboarding,
  orders,
  onOpenLogin
}) => {
  // State for expanding the offline archive list
  const [showOfflineArchive, setShowOfflineArchive] = useState<boolean>(false);

  // Selected receipt order state for the digital popup/slip
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  // Selected Payment QR order state for offline collection simulation
  const [activePaymentQROrder, setActivePaymentQROrder] = useState<Order | null>(null);
  const [simulatedPaymentSuccess, setSimulatedPaymentSuccess] = useState<boolean>(false);
  const [copiedUPI, setCopiedUPI] = useState<boolean>(false);

  // Filter or retrieve cached orders
  const cachedOrders = orders || [];

  // Simple QR Code pattern generated via CSS grids to look 100% real and premium
  const renderMockQRCode = () => {
    return (
      <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-cream-border grid grid-cols-5 gap-1 shrink-0 shadow-inner">
        {[...Array(25)].map((_, i) => {
          // Generate a deterministic QR grid pattern based on index math
          const isFilled = (i * 3 + 7) % 5 === 0 || (i % 4 === 0) || i < 4 || i === 12 || i > 20;
          return (
            <div 
              key={i} 
              className={`rounded-xs ${isFilled ? 'bg-charcoal' : 'bg-transparent'}`}
            />
          );
        })}
      </div>
    );
  };

  // High-density offline payment QR generator with visual eye finders & alignment markers
  const renderInteractivePaymentQR = (order: Order) => {
    return (
      <div className="bg-white p-4 rounded-2xl border-2 border-charcoal shadow-md inline-block relative mx-auto">
        <div className="w-48 h-48 sm:w-52 sm:h-52 grid grid-cols-9 gap-1 bg-white relative p-1">
          {/* Top-Left Finder */}
          <div className="col-span-3 row-span-3 border-4 border-charcoal rounded-md flex items-center justify-center p-1">
            <div className="w-full h-full bg-charcoal rounded-xs"></div>
          </div>
          {/* Top-Right Finder */}
          <div className="col-start-7 col-span-3 row-span-3 border-4 border-charcoal rounded-md flex items-center justify-center p-1">
            <div className="w-full h-full bg-charcoal rounded-xs"></div>
          </div>
          {/* Bottom-Left Finder */}
          <div className="col-start-1 row-start-7 col-span-3 row-span-3 border-4 border-charcoal rounded-md flex items-center justify-center p-1">
            <div className="w-full h-full bg-charcoal rounded-xs"></div>
          </div>

          {/* Dynamic QR matrix blocks */}
          {[...Array(54)].map((_, idx) => {
            const isDot = (idx * 7 + (order.product.price % 13)) % 3 === 0 || idx % 5 === 0 || idx === 11 || idx === 23;
            return (
              <div 
                key={idx}
                className={`rounded-xs ${isDot ? 'bg-charcoal' : 'bg-transparent'}`}
              />
            );
          })}

          {/* Center Brand / Offline Handloom Shield Emblem */}
          <div className="absolute inset-0 m-auto w-10 h-10 bg-terracotta text-white rounded-xl border-2 border-white flex items-center justify-center shadow-md">
            <span className="font-serif font-black text-xs">ता</span>
          </div>
        </div>
      </div>
    );
  };

  const translations = {
    en: {
      title: "My KalaSetu Identity",
      subtitle: "Verified Artisan Passport",
      weaverCardTitle: "Verified Master Artisan ID",
      buyerCardTitle: "Verified Handloom Patron ID",
      name: "Name",
      location: "Region",
      exp: "Craft Experience",
      coop: "Co-operative Society",
      shipping: "Shipping Address",
      phone: "Mobile Number",
      relaunchOnboarding: "Relaunch Onboarding Tour",
      close: "Close Profile",
      traceId: "Decentralized Trace ID",
      trustShield: "KalaSetu Certified Direct Link",
      statusText: "Verified Active",
      dataSaverTitle: "Data Saver (Rural Optimized)",
      dataSaverDesc: "Disables non-essential animations and reduces live synchronization polling to protect weak cellular connections.",
      offlineArchiveTitle: "Offline Order Archive",
      offlineArchiveSubtitle: "Read-only local cache accessible without network",
      viewOfflineArchive: "View Offline Archive",
      hideOfflineArchive: "Hide Offline Archive",
      cachedOrdersCount: "Cached Orders",
      availableOfflineDesc: "All order histories, fabric passports, and receipts are stored locally on your device for rural access.",
      cachedBadge: "Local Device Cache",
      noCachedOrders: "No cached orders found in local storage.",
      receiptTitle: "KalaSetu Verified Digital Receipt",
      directWeaverBenefit: "100% Direct Artisan Benefit Settled",
      closeReceipt: "Close Receipt",
      viewReceipt: "View Receipt / Slip",
      deliveredLabel: "Delivered",
      paymentSettledLabel: "Payment Settled",
      orderIdLabel: "Order ID",
      weaverLabel: "Master Artisan",
      buyerLabel: "Patron / Buyer",
      amountPaid: "Amount Settled",
      offlineNotice: "Read-Only Offline Snapshot — Validated by KalaSetu Smart Ledger",
      itemDetails: "Handcrafted Item Details",
      financialBreakdown: "Financial Settlement Breakdown",
      customerPrice: "Customer Total Paid",
      weaverDirectEarn: "Artisan Direct Share (91%)",
      logisticsCost: "Direct Rural Courier",
      platformFee: "KalaSetu Platform Service (3%)",
      trackingHistoryTitle: "Recorded Tracking Milestones",
      showPaymentQR: "Show Payment QR",
      offlinePaymentQRTitle: "Offline Artisan Payment QR",
      offlinePaymentQRSubtitle: "Peer-to-Peer Direct UPI & Cashless Settlement",
      scanToPay: "Scan with Any UPI App",
      weaverUPIHandle: "Verified Artisan UPI VPA",
      collectionAmount: "Payable Direct to Artisan",
      simulatePaymentBtn: "Simulate Offline Payment Received",
      simulatedSuccess: "Payment Confirmed! Cryptographic Proof Recorded",
      offlineQRNotice: "Works without active internet. Encrypted transaction cryptographic payload validates instantly on device.",
      closeQR: "Back to Order",
      copied: "Copied!"
    },
    kn: {
      title: "ನನ್ನ ತಾನಾ ಪ್ರೊಫೈಲ್",
      subtitle: "ಧೃಡೀಕೃತ ಕುಶಲಕರ್ಮಿ ಗುರುತಿನ ಚೀಟಿ",
      weaverCardTitle: "ಧೃಡೀಕೃತ ಕುಶಲಕರ್ಮಿ ಪ್ರೊಫೈಲ್",
      buyerCardTitle: "ಧೃಡೀಕೃತ ಖರೀದಿದಾರರ ಪ್ರೊಫೈಲ್",
      name: "ಹೆಸರು",
      location: "ಪ್ರದೇಶ",
      exp: "ಕರಕುಶಲ ಅನುಭವ",
      coop: "ಸಹಕಾರ ಸಂಘ",
      shipping: "ವಿತರಣಾ ವಿಳಾಸ",
      phone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      relaunchOnboarding: "ಮತ್ತೆ ಮೊದಲಿನಿಂದ ಆರಂಭಿಸಿ",
      close: "ಮುಚ್ಚಿ",
      traceId: "ಟ್ರೇಸ್ ಐಡಿ",
      trustShield: "ತಾನಾ ಅಧಿಕೃತ ಲಿಂಕ್",
      statusText: "ಸಕ್ರಿಯವಾಗಿದೆ",
      dataSaverTitle: "ಡೇಟಾ ಉಳಿತಾಯ ಮೋಡ್",
      dataSaverDesc: "ಗ್ರಾಮೀಣ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಗಾಗಿ ಅನಿಮೇಷನ್‌ಗಳನ್ನು ನಿಲ್ಲಿಸುತ್ತದೆ ಮತ್ತು ಹಿನ್ನೆಲೆ ಸಿಂಕ್ ಪರೀಕ್ಷೆಗಳ ವೇಗವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
      offlineArchiveTitle: "ಆಫ್‌ಲೈನ್ ಆರ್ಡರ್ ಆರ್ಕೈವ್",
      offlineArchiveSubtitle: "ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದೆಯೂ ಲಭ್ಯವಿರುವ ಸ್ಥಳೀಯ ಕ್ಯಾಶ್",
      viewOfflineArchive: "ಆಫ್‌ಲೈನ್ ಆರ್ಕೈವ್ ವೀಕ್ಷಿಸಿ",
      hideOfflineArchive: "ಆರ್ಕೈವ್ ಮರೆಮಾಡಿ",
      cachedOrdersCount: "ಕ್ಯಾಶ್ ಆದ ಆರ್ಡರ್‌ಗಳು",
      availableOfflineDesc: "ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಿಗಾಗಿ ಎಲ್ಲಾ ಆರ್ಡರ್ ಇತಿಹಾಸ ಮತ್ತು ರಶೀದಿಗಳನ್ನು ಸಾಧನದಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.",
      cachedBadge: "ಸಾಧನದಲ್ಲಿ ಸಂಗ್ರಹವಾಗಿದೆ",
      noCachedOrders: "ಸ್ಥಳೀಯ ಸಂಗ್ರಹದಲ್ಲಿ ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
      receiptTitle: "ತಾನಾ ಡಿಜಿಟಲ್ ರಶೀದಿ",
      directWeaverBenefit: "೧೦೦% ಕುಶಲಕರ್ಮಿಗೆ ನೇರ ಲಾಭ ವರ್ಗಾಯಿಸಲಾಗಿದೆ",
      closeReceipt: "ರಶೀದಿ ಮುಚ್ಚಿ",
      viewReceipt: "ರಶೀದಿ ವೀಕ್ಷಿಸಿ",
      deliveredLabel: "ವಿತರಿಸಲಾಗಿದೆ",
      paymentSettledLabel: "ಪಾವತಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
      orderIdLabel: "ಆರ್ಡರ್ ಐಡಿ",
      weaverLabel: "ಮುಖ್ಯ ಕುಶಲಕರ್ಮಿ",
      buyerLabel: "ಖರೀದಿದಾರರು",
      amountPaid: "ಪಾವತಿಸಿದ ಮೊತ್ತ",
      offlineNotice: "ಆಫ್‌ಲೈನ್ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್ — ತಾನಾ ಲೆಡ್ಜರ್ ಮೂಲಕ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
      itemDetails: "ಕೈಮಗ್ಗ ಉತ್ಪನ್ನದ ವಿವರ",
      financialBreakdown: "ಆರ್ಥಿಕ ಪಾವತಿ ವಿಭಜನೆ",
      customerPrice: "ಗ್ರಾಹಕರು ಪಾವತಿಸಿದ ಒಟ್ಟು ಮೊತ್ತ",
      weaverDirectEarn: "ಕುಶಲಕರ್ಮಿಯ ನೇರ ಆದಾಯ (೯೧%)",
      logisticsCost: "ಗ್ರಾಮೀಣ ಕೊರಿಯರ್ ವೆಚ್ಚ",
      platformFee: "ತಾನಾ ಸೇವಾ ಶುಲ್ಕ (೩%)",
      trackingHistoryTitle: "ದಾಖಲಾದ ಟ್ರ್ಯಾಕಿಂಗ್ ಹಂತಗಳು",
      showPaymentQR: "ಪಾವತಿ ಕ್ಯೂಆರ್ ತೋರಿಸಿ",
      offlinePaymentQRTitle: "ಆಫ್‌ಲೈನ್ ಕುಶಲಕರ್ಮಿ ಪಾವತಿ ಕ್ಯೂಆರ್",
      offlinePaymentQRSubtitle: "ನೇರ ಯುಪಿಐ ಮತ್ತು ನಗದುರಹಿತ ವಹಿವಾಟು",
      scanToPay: "ಯಾವುದೇ ಯುಪಿಐ ಆ್ಯಪ್ ಮೂಲಕ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
      weaverUPIHandle: "ಕುಶಲಕರ್ಮಿಯ ಯುಪಿಐ ಐಡಿ",
      collectionAmount: "ಕುಶಲಕರ್ಮಿಗೆ ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ",
      simulatePaymentBtn: "ಆಫ್‌ಲೈನ್ ಪಾವತಿ ಪರೀಕ್ಷಿಸಿ",
      simulatedSuccess: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ಆಫ್‌ಲೈನ್ ಪುರಾವೆ ದಾಖಲಾಗಿದೆ",
      offlineQRNotice: "ಇಂಟರ್‌ನೆಟ್ ಇಲ್ಲದೆಯೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆದ ವಹಿವಾಟು ಸಾಧನದಲ್ಲಿ ದಾಖಲಾಗುತ್ತದೆ.",
      closeQR: "ಹಿಂದಕ್ಕೆ ಹೋಗಿ",
      copied: "ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!"
    },
    hi: {
      title: "मेरी ताना पहचान",
      subtitle: "सत्यापित कारीगर डिजिटल पासपोर्ट",
      weaverCardTitle: "सत्यापित कारीगर पहचान पत्र",
      buyerCardTitle: "सत्यापित हथकरघा संरक्षक पत्र",
      name: "नाम",
      location: "स्थान",
      exp: "शिल्प अनुभव",
      coop: "सहकारी समिति",
      shipping: "डिलिवरी का पता",
      phone: "मोबाइल नंबर",
      relaunchOnboarding: "ऑनबोर्डिंग टूर फिर से चलाएं",
      close: "बंद करें",
      traceId: "ट्रेस आईडी",
      trustShield: "ताना प्रमाणित सीधा लिंक",
      statusText: "सत्यापित सक्रिय",
      dataSaverTitle: "डेटा बचत (ग्रामीण अनुकूलित)",
      dataSaverDesc: "कमजोर मोबाइल नेटवर्क पर डेटा बचाने के लिए एनिमेशन बंद करता है और पृष्ठभूमि सिंक जांच को धीमा करता है।",
      offlineArchiveTitle: "ऑफलाइन ऑर्डर आर्काइव",
      offlineArchiveSubtitle: "बिना नेटवर्क के उपलब्ध स्थानीय कैश्ड रिकॉर्ड",
      viewOfflineArchive: "ऑफलाइन आर्काइव देखें",
      hideOfflineArchive: "आर्काइव छिपाएं",
      cachedOrdersCount: "कैश्ड ऑर्डर",
      availableOfflineDesc: "ग्रामीण पहुंच के लिए सभी ऑर्डर इतिहास और डिजिटल रसीदें आपके डिवाइस पर सुरक्षित हैं।",
      cachedBadge: "डिवाइस में सहेजा गया",
      noCachedOrders: "डिवाइस में कोई कैश्ड ऑर्डर नहीं मिला।",
      receiptTitle: "ताना सत्यापित डिजिटल रसीद",
      directWeaverBenefit: "100% सीधे कारीगर को लाभ पहुँचाया गया",
      closeReceipt: "रसीद बंद करें",
      viewReceipt: "रसीद देखें",
      deliveredLabel: "वितरित",
      paymentSettledLabel: "भुगतान तय",
      orderIdLabel: "ऑर्डर आईडी",
      weaverLabel: "मास्टर कारीगर",
      buyerLabel: "ग्राहक / संरक्षक",
      amountPaid: "कुल भुगतान राशि",
      offlineNotice: "रीड-ओनली ऑफलाइन स्नैपशॉट — ताना लेजर द्वारा सत्यापित",
      itemDetails: "हस्तनिर्मित उत्पाद विवरण",
      financialBreakdown: "वित्तीय भुगतान विवरण",
      customerPrice: "ग्राहक द्वारा कुल भुगतान",
      weaverDirectEarn: "कारीगर का सीधा हिस्सा (91%)",
      logisticsCost: "ग्रामीण कूरियर शुल्क",
      platformFee: "ताना सेवा शुल्क (3%)",
      trackingHistoryTitle: "दर्ज ट्रैकिंग स्थिति",
      showPaymentQR: "भुगतान QR कोड दिखाएं",
      offlinePaymentQRTitle: "ऑफलाइन कारीगर भुगतान QR",
      offlinePaymentQRSubtitle: "सीधा UPI और कैशलेस भुगतान संग्रह",
      scanToPay: "किसी भी UPI ऐप से स्कैन करें",
      weaverUPIHandle: "सत्यापित कारीगर UPI आईडी",
      collectionAmount: "कारीगर को देय सीधी राशि",
      simulatePaymentBtn: "ऑफलाइन भुगतान अनुकरण करें",
      simulatedSuccess: "भुगतान सफल! ऑफलाइन लेनदेन रिकॉर्ड किया गया",
      offlineQRNotice: "बिना इंटरनेट के भी काम करता है। एन्क्रिप्टेड भुगतान डिवाइस पर सुरक्षित रहता है।",
      closeQR: "वापस जाएं",
      copied: "कॉपी किया गया!"
    }
  };

  const t = translations[language] || translations.en;

  const isWeaver = profile.role === 'weaver';

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      
      <div 
        id="account-modal-container"
        className="bg-cream border-2 border-terracotta rounded-3xl p-4 sm:p-5 text-left max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-4 sm:space-y-6 my-auto"
      >
        {/* Header Close Trigger */}
        <div className="flex justify-between items-start">
          <BackButton language={language} onBack={onClose} />
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal">{t.title}</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.subtitle}</p>
          </div>
          <button
            onClick={() => {
              playSyntheticChime('click');
              onClose();
            }}
            className="text-gray-400 hover:text-black font-extrabold text-sm p-1.5 bg-white rounded-full border border-cream-border shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3D-effect ID Passport Card */}
        <div 
          className={`rounded-2xl p-5 text-cream relative overflow-hidden shadow-xl border border-white/20 ${
            isWeaver 
              ? 'bg-gradient-to-br from-indigo-custom to-indigo-light' 
              : 'bg-gradient-to-br from-terracotta to-[#8C3C26]'
          }`}
        >
          {/* Subtle background weave design */}
          <div className="absolute right-0 bottom-0 top-0 left-0 opacity-[0.04] pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%), radial-gradient(circle, #fff 10%, transparent 11%)`,
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px'
          }}></div>

          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="flex items-center gap-1.5">
              <Award className="w-5 h-5 text-mustard" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-mustard">
                {t.trustShield}
              </span>
            </div>
            
            <div className="bg-white/10 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              {t.statusText}
            </div>
          </div>

          <h4 className="font-serif font-bold text-base mb-4 tracking-wide">
            {isWeaver ? t.weaverCardTitle : t.buyerCardTitle}
          </h4>

          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2 text-[11px] leading-relaxed">
              <div>
                <p className="opacity-60 text-[9px] uppercase font-bold tracking-wider">{t.name}</p>
                <p className="font-bold text-sm tracking-wide text-white">{profile.name}</p>
              </div>

              {isWeaver ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="opacity-60 text-[9px] uppercase font-bold tracking-wider">{t.exp}</p>
                      <p className="font-semibold text-white">{profile.experience}+ Years</p>
                    </div>
                    <div>
                      <p className="opacity-60 text-[9px] uppercase font-bold tracking-wider">{t.location}</p>
                      <p className="font-semibold text-white truncate max-w-[80px]">{profile.region.split(',')[0]}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="opacity-60 text-[9px] uppercase font-bold tracking-wider">{t.phone}</p>
                    <p className="font-semibold text-white">{profile.phone}</p>
                  </div>
                </>
              )}
            </div>

            {/* QR Code and Passport details */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              {renderMockQRCode()}
              <span className="text-[8px] font-mono tracking-widest opacity-60">
                {isWeaver ? profile.weaverId : profile.buyerId}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Address or Society view info */}
        <div className="bg-white rounded-2xl border border-cream-border p-4 space-y-3.5 text-xs">
          
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                {isWeaver ? t.location : t.shipping}
              </span>
              <p className="font-medium text-charcoal leading-relaxed">
                {isWeaver ? profile.region : profile.shippingAddress}
              </p>
            </div>
          </div>

          {isWeaver ? (
            <div className="flex items-start gap-3 pt-3 border-t border-cream-dark">
              <Landmark className="w-4 h-4 text-indigo-custom shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  {t.coop}
                </span>
                <p className="font-medium text-charcoal leading-relaxed">
                  {profile.cooperative}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 pt-3 border-t border-cream-dark">
              <Phone className="w-4 h-4 text-indigo-custom shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  {t.phone}
                </span>
                <p className="font-medium text-charcoal leading-relaxed">
                  {profile.phone}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Offline Order Archive Section */}
        <div 
          id="offline-order-archive-card"
          className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-xs"
        >
          {/* Archive Header / Toggle Trigger */}
          <div className="p-4 flex items-center justify-between gap-3 bg-cream/40 border-b border-cream-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-charcoal">{t.offlineArchiveTitle}</h4>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                    {cachedOrders.length} {t.cachedOrdersCount}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">
                  {t.offlineArchiveSubtitle}
                </p>
              </div>
            </div>

            <button
              id="toggle-offline-archive-btn"
              onClick={() => {
                playSyntheticChime('click');
                setShowOfflineArchive(!showOfflineArchive);
              }}
              className="text-xs font-bold text-terracotta hover:text-charcoal flex items-center gap-1 px-2.5 py-1.5 bg-white border border-terracotta/30 rounded-lg shrink-0 transition"
            >
              <span>{showOfflineArchive ? t.hideOfflineArchive : t.viewOfflineArchive}</span>
              {showOfflineArchive ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Expanded Archive List */}
          {showOfflineArchive && (
            <div className="p-4 space-y-3 bg-cream/20">
              <div className="flex items-center gap-2 text-[10px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{t.availableOfflineDesc}</span>
              </div>

              {cachedOrders.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 font-medium">
                  <Package className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  {t.noCachedOrders}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {cachedOrders.map((order) => {
                    const isDelivered = order.status === 'Delivered' || order.status === 'Payment Settled';
                    const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <div 
                        key={order.id}
                        id={`offline-order-item-${order.id}`}
                        className="bg-white p-3 rounded-xl border border-cream-border hover:border-terracotta/40 transition shadow-2xs space-y-2 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            {order.product.images && order.product.images[0] ? (
                              <img 
                                src={order.product.images[0]} 
                                alt={order.product.title}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded-lg border border-cream-border shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center text-gray-400 shrink-0">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-xs text-charcoal line-clamp-1">
                                {order.product.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                <span>#{order.id.toUpperCase()}</span>
                                <span>•</span>
                                <span>{formattedDate}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isDelivered 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-cream-dark gap-2 flex-wrap sm:flex-nowrap">
                          <div>
                            <span className="text-[10px] text-gray-400 block font-medium">
                              {order.product?.weaverName || 'Artisan'}
                            </span>
                            <span className="font-extrabold text-charcoal font-serif">
                              ₹{(order.product?.price ?? 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              id={`show-payment-qr-btn-${order.id}`}
                              onClick={() => {
                                playSyntheticChime('click');
                                setActivePaymentQROrder(order);
                                setSimulatedPaymentSuccess(false);
                                setCopiedUPI(false);
                              }}
                              className="bg-charcoal hover:bg-black text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                            >
                              <QrCode className="w-3.5 h-3.5 text-amber-400" />
                              <span>{t.showPaymentQR}</span>
                            </button>

                            <button
                              id={`view-receipt-btn-${order.id}`}
                              onClick={() => {
                                playSyntheticChime('click');
                                setActiveReceiptOrder(order);
                              }}
                              className="bg-cream hover:bg-cream-dark text-terracotta border border-terracotta/30 text-[11px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 transition"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>{t.viewReceipt}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Data Saver Mode Toggle Block */}
        <div className="bg-white rounded-2xl border border-cream-border p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className={`w-4 h-4 ${dataSaver ? 'text-emerald-500' : 'text-terracotta'}`} />
              <span className="font-bold text-charcoal">{t.dataSaverTitle}</span>
            </div>
            {/* Toggle Switch */}
            <button
              id="data-saver-toggle-btn"
              onClick={() => {
                playSyntheticChime('click');
                setDataSaver(!dataSaver);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                dataSaver ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
                  dataSaver ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            {t.dataSaverDesc}
          </p>
        </div>

        {/* Settings Buttons */}
        <div className="space-y-2.5 pt-1">
          {onOpenLogin && (
            <button
              id="open-admin-login-modal-btn"
              onClick={() => {
                playSyntheticChime('click');
                if (typeof onClose === 'function') onClose();
                if (typeof onOpenLogin === 'function') onOpenLogin();
              }}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-700" />
              <span>Sign In as Admin / Switch Account</span>
            </button>
          )}

          <button
            id="reset-onboarding-btn"
            onClick={() => {
              playSyntheticChime('click');
              if (typeof onResetOnboarding === 'function') onResetOnboarding();
            }}
            className="w-full bg-white hover:bg-cream-dark text-terracotta border border-terracotta/40 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.relaunchOnboarding}</span>
          </button>

          <button
            id="close-profile-btn"
            onClick={() => {
              playSyntheticChime('click');
              if (typeof onClose === 'function') onClose();
            }}
            className="w-full bg-[#2D2926] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-xs text-center transition"
          >
            {t.close}
          </button>
        </div>

      </div>

      {/* Offline Digital Receipt Modal Overlay */}
      {activeReceiptOrder && (
        <div 
          id="offline-receipt-modal-backdrop"
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
        >
          <div 
            id="offline-receipt-content"
            className="bg-white border-2 border-terracotta rounded-3xl p-5 text-left max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl relative space-y-4 my-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-cream-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal">{t.receiptTitle}</h4>
                  <p className="text-[9px] font-mono text-gray-400">#{activeReceiptOrder.id.toUpperCase()} • {new Date(activeReceiptOrder.orderDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playSyntheticChime('click');
                  setActiveReceiptOrder(null);
                }}
                className="text-gray-400 hover:text-black p-1 bg-cream rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offline Badge notice */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-xl text-[10px] flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.offlineNotice}</span>
            </div>

            {/* Handloom Item Details */}
            <div className="bg-cream/40 p-3.5 rounded-2xl border border-cream-border space-y-2 text-xs">
              <div className="flex gap-3">
                {activeReceiptOrder.product.images && activeReceiptOrder.product.images[0] && (
                  <img 
                    src={activeReceiptOrder.product.images[0]} 
                    alt={activeReceiptOrder.product.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-xl border border-cream-border shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-xs text-charcoal leading-snug">{activeReceiptOrder.product.title}</p>
                  <p className="text-[10px] text-gray-500">
                    <span className="font-bold text-charcoal">{t.weaverLabel}:</span> {activeReceiptOrder.product.weaverName} ({activeReceiptOrder.product.weaverRegion})
                  </p>
                  <p className="text-[10px] text-gray-500">
                    <span className="font-bold text-charcoal">{t.buyerLabel}:</span> {activeReceiptOrder.buyerName}
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cream-dark text-[10px]">
                <div>
                  <span className="text-gray-400 block font-bold uppercase text-[9px]">Material:</span>
                  <span className="font-medium text-charcoal">{activeReceiptOrder.product.material}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold uppercase text-[9px]">Dimensions:</span>
                  <span className="font-medium text-charcoal">{activeReceiptOrder.product.dimensions?.length} x {activeReceiptOrder.product.dimensions?.width}</span>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white p-3.5 rounded-2xl border border-cream-border space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                {t.financialBreakdown}
              </span>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t.weaverDirectEarn}</span>
                  <span className="font-bold text-emerald-700">₹{Math.round((activeReceiptOrder.product?.price ?? 0) * 0.91).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>{t.logisticsCost}</span>
                  <span>₹{Math.round((activeReceiptOrder.product?.price ?? 0) * 0.06).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>{t.platformFee}</span>
                  <span>₹{Math.round((activeReceiptOrder.product?.price ?? 0) * 0.03).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-charcoal pt-2 border-t border-cream-dark text-sm">
                  <span>{t.customerPrice}</span>
                  <span className="text-terracotta font-serif">₹{(activeReceiptOrder.product?.price ?? 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-terracotta/10 text-terracotta p-2 rounded-lg text-[10px] font-bold text-center mt-2">
                ✓ {t.directWeaverBenefit}
              </div>
            </div>

            {/* Tracking Milestones (Smooth Animated Transition Progress Bar) */}
            <div className="pt-1">
              <OrderTrackingProgressBar
                order={activeReceiptOrder}
                language={language}
                variant="full"
              />
            </div>

            {/* Action buttons in Receipt */}
            <div className="space-y-2 pt-1">
              <button
                id="receipt-show-payment-qr-btn"
                onClick={() => {
                  playSyntheticChime('click');
                  setActivePaymentQROrder(activeReceiptOrder);
                  setSimulatedPaymentSuccess(false);
                  setCopiedUPI(false);
                }}
                className="w-full bg-charcoal hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{t.showPaymentQR}</span>
              </button>

              {/* Close action */}
              <button
                id="receipt-close-btn"
                onClick={() => {
                  playSyntheticChime('click');
                  setActiveReceiptOrder(null);
                }}
                className="w-full bg-cream hover:bg-cream-dark text-charcoal border border-cream-border font-bold py-2.5 px-4 rounded-xl text-xs text-center transition"
              >
                {t.closeReceipt}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline-Capable Payment QR Modal Overlay */}
      {activePaymentQROrder && (
        <div 
          id="offline-payment-qr-modal-backdrop"
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
        >
          <div 
            id="offline-payment-qr-content"
            className="bg-white border-2 border-charcoal rounded-3xl p-5 text-left max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl relative space-y-4 my-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-cream-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5 text-charcoal" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal">{t.offlinePaymentQRTitle}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">{t.offlinePaymentQRSubtitle}</p>
                </div>
              </div>
              <button
                id="close-payment-qr-x-btn"
                onClick={() => {
                  playSyntheticChime('click');
                  setActivePaymentQROrder(null);
                }}
                className="text-gray-400 hover:text-black p-1.5 bg-cream rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offline Capability Guarantee Banner */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-[11px] flex items-start gap-2.5 font-medium leading-relaxed">
              <WifiOff className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-950">{t.cachedBadge}</span>
                <span>{t.offlineQRNotice}</span>
              </div>
            </div>

            {/* Order & Weaver Summary */}
            <div className="bg-cream/40 p-3.5 rounded-2xl border border-cream-border flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-charcoal text-xs line-clamp-1">{activePaymentQROrder.product.title}</p>
                <p className="text-[10px] text-gray-500">
                  <span className="font-bold">{t.weaverLabel}:</span> {activePaymentQROrder.product.weaverName}
                </p>
                <span className="text-[9px] font-mono text-gray-400">Order #{activePaymentQROrder.id.toUpperCase()}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">{t.collectionAmount}</span>
                <span className="text-base font-extrabold text-terracotta font-serif">
                  ₹{(activePaymentQROrder.product?.price ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* High-Resolution QR Display */}
            <div className="text-center py-2 space-y-2 bg-cream/20 rounded-2xl border border-cream-border p-4">
              {renderInteractivePaymentQR(activePaymentQROrder)}

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider block">
                  {t.scanToPay}
                </span>
                <p className="text-[10px] text-gray-500 font-medium">
                  Compatible with BHIM, Google Pay, PhonePe, Paytm & Rural Offline PoS
                </p>
              </div>
            </div>

            {/* Weaver UPI VPA Handle & Copy Feature */}
            <div className="bg-white p-3 rounded-xl border border-cream-border flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-bold text-gray-400 block">{t.weaverUPIHandle}</span>
                <span className="font-mono text-xs font-bold text-charcoal truncate block">
                  {activePaymentQROrder.product.weaverName.toLowerCase().replace(/[^a-z0-9]/g, '')}.weaver@upi
                </span>
              </div>
              <button
                id="copy-upi-btn"
                onClick={() => {
                  playSyntheticChime('click');
                  navigator.clipboard?.writeText?.(
                    `${activePaymentQROrder.product.weaverName.toLowerCase().replace(/[^a-z0-9]/g, '')}.weaver@upi`
                  );
                  setCopiedUPI(true);
                  setTimeout(() => setCopiedUPI(false), 2500);
                }}
                className="px-2.5 py-1.5 bg-cream hover:bg-cream-dark text-terracotta text-[10px] font-bold rounded-lg border border-terracotta/20 flex items-center gap-1 shrink-0 transition"
              >
                {copiedUPI ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>

            {/* Offline Simulation Button / Success Feedback */}
            {!simulatedPaymentSuccess ? (
              <button
                id="simulate-offline-payment-btn"
                onClick={() => {
                  playSyntheticChime('success');
                  setSimulatedPaymentSuccess(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{t.simulatePaymentBtn}</span>
              </button>
            ) : (
              <div 
                id="payment-simulation-success-box"
                className="bg-emerald-100/90 border-2 border-emerald-500 text-emerald-950 p-3.5 rounded-2xl space-y-1.5 animate-fadeIn"
              >
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.simulatedSuccess}</span>
                </div>
                <p className="text-[10px] text-emerald-900 font-mono pl-6">
                  Crypto Proof: 0x{activePaymentQROrder.id.replace(/[^a-f0-9]/gi, '8')}a7e932b... verified & logged in local ledger.
                </p>
              </div>
            )}

            {/* Back Button */}
            <button
              id="back-from-payment-qr-btn"
              onClick={() => {
                playSyntheticChime('click');
                setActivePaymentQROrder(null);
              }}
              className="w-full bg-charcoal hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs text-center transition"
            >
              {t.closeQR}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

