import express from "express";
import path from "path";
import { randomId } from "./src/utils/id";
import {
  GiInfo,
  PricingRecommendation,
  PaymentProtection,
  OrderDispute,
  TransactionHistoryEntry,
  OrderMilestone
} from "./src/types";
import {
  upsertProduct, deleteProduct, loadAllProducts,
  upsertOrder, loadAllOrders,
  upsertTransaction, loadAllTransactions,
  upsertGiRecord,
  findAccountByEmail, seedDemoAccountsIfEmpty
} from "./src/db/database";
import { verifyPassword, issueSessionToken, attachSession, requireAuth, requireRole } from "./src/auth";

// In-Memory Server State with Persistent Seed
interface ServerProduct {
  id: string;
  title: string;
  category?: string;
  weaverName: string;
  weaverBio: string;
  weaverRegion: string;
  weaverImage: string;
  material: string;
  price: number;
  dimensions: { length: string; width: string; customText?: string };
  specialFeatures: string;
  description: string;
  images: string[];
  careInstructions: string;
  dateAdded: string;
  status: 'Pending Approval' | 'Listed' | 'Sold';
  updatedAt: number;
  version: number;
  giInfo?: GiInfo;
  pricingRecommendation?: PricingRecommendation;
}

interface ServerOrder {
  id: string;
  product: any;
  buyerName: string;
  buyerAddress: string;
  orderDate: string;
  status: string;
  qualityCheck?: any;
  shippingAddress: any;
  trackingHistory: Array<{ status: string; timestamp: string; description: string }>;
  paymentProtection?: PaymentProtection;
  dispute?: OrderDispute;
  transactionHistory?: TransactionHistoryEntry[];
  updatedAt: number;
  version: number;
}

interface ServerConflictLog {
  id: string;
  outboxItemId: string;
  entityType: string;
  entityId: string;
  clientTimestamp: number;
  serverTimestamp: number;
  winningSide: 'client' | 'server';
  resolutionStrategy: 'LAST_WRITE_WINS';
  resolvedAt: string;
}

// Initial Database Seed State
let serverProducts: ServerProduct[] = [
  {
    id: "p1",
    title: "Ilkal Cotton-Silk Saree with Kasuti Border",
    weaverName: "Sharanappa Devanga",
    weaverBio: "A 4th generation master weaver from Ilkal, Bagalkot. He specializes in the ancient Tope Teni pallu joining technique and loves natural indigo dyes.",
    weaverRegion: "Ilkal, Bagalkot, Karnataka",
    weaverImage: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300",
    material: "80% cotton, 20% silk",
    price: 3200,
    dimensions: { length: "6.0 meters", width: "1.2 meters" },
    specialFeatures: "Handcrafted red Kasuti embroidered border, traditional temple motifs, lightweight breathable texture.",
    description: "Perfect for summers and local festivals. This authentic Ilkal saree features a dark forest green body and a classic deep crimson red border, joined together with painstaking interlocking weaves.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600"
    ],
    careInstructions: "Dry clean recommended for first wash. Subsequently, gentle hand wash in cold water using mild soap/shampoo. Dry in shade.",
    dateAdded: "2026-07-15T12:00:00Z",
    status: "Listed",
    updatedAt: Date.now() - 172800000,
    version: 1,
    giInfo: {
      status: "VERIFIED",
      productName: "Ilkal Sarees",
      registrationNumber: "GI-IN-0079",
      origin: "Ilkal, Bagalkot District",
      stateRegion: "Karnataka",
      category: "Textiles & Handicrafts",
      verificationDate: "2024-03-15",
      verificationSource: "Geographical Indications Registry of India, Intellectual Property India (Certificate #79)",
      verifiedBy: "National GI Registry (Govt. of India)"
    }
  },
  {
    id: "p2",
    title: "Pochampally Ikat Pure Silk Saree",
    weaverName: "Ramesh Kootala",
    weaverBio: "Ramesh has been running a family co-operative in Pochampally for 25 years. He is passionate about geometric tie-and-dye layouts and natural herbal colors.",
    weaverRegion: "Pochampally, Yadadri Bhuvanagiri, Telangana",
    weaverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    material: "100% Pure Mulberry Silk",
    price: 5800,
    dimensions: { length: "5.5 meters", width: "1.1 meters" },
    specialFeatures: "Double Ikat tie-dye pattern, rich heavy golden pallu, smooth natural silk luster.",
    description: "An elegant premium Pochampally Ikat silk saree in bright saffron yellow and warm terracotta colors. Known for its distinct geometric sharpness and highly stable dye quality.",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600"
    ],
    careInstructions: "Strictly dry clean only. Store wrapped in a soft cotton cloth inside a cool drawer away from dampness.",
    dateAdded: "2026-07-16T14:30:00Z",
    status: "Listed",
    updatedAt: Date.now() - 259200000,
    version: 1,
    giInfo: {
      status: "PENDING",
      productName: "Pochampally Ikat",
      registrationNumber: "GI-IN-0004",
      origin: "Pochampally, Yadadri Bhuvanagiri",
      stateRegion: "Telangana",
      category: "Textiles",
      verificationDate: "Pending Verification",
      verificationSource: "Submitted by Weaver Ramesh Kootala (Under Admin Review)",
      submittedAt: "2026-08-01T10:00:00Z"
    }
  },
  {
    id: "p3",
    title: "Banarasi Brocade Silk Saree with Gold Zari",
    weaverName: "Smt. Savita Devi",
    weaverBio: "Savita Devi is a pioneer in women handloom guilds in Varanasi, keeping the legacy of fine brocades alive with intricate designs inspired by heritage Mughal patterns.",
    weaverRegion: "Varanasi, Uttar Pradesh",
    weaverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    material: "Katan Silk, Fine Gold Thread (Zari)",
    price: 11500,
    dimensions: { length: "5.5 meters", width: "1.1 meters" },
    specialFeatures: "Extravagant gold zari border, flora-fauna motifs (Amru), thick heavy fall and structure.",
    description: "A spectacular royal indigo blue Banarasi saree made for wedding celebrations. Takes nearly 18 days of continuous double-loom setup to construct.",
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600"
    ],
    careInstructions: "Dry clean only. Do not iron directly on the zari work — use a warm iron underneath a thin protective cotton layer.",
    dateAdded: "2026-07-17T09:15:00Z",
    status: "Listed",
    updatedAt: Date.now() - 345600000,
    version: 1,
    giInfo: {
      status: "REJECTED",
      productName: "Banarasi Brocade Silk",
      registrationNumber: "GI-IN-0028",
      origin: "Varanasi",
      stateRegion: "Uttar Pradesh",
      category: "Handlooms & Textiles",
      verificationDate: "2026-07-20",
      verificationSource: "Geographical Indications Registry of India (Audit Review)",
      notes: "Submission rejected: Documentation incomplete. Cooperative affiliation proof could not be verified against the official active GI repository."
    },
    pricingRecommendation: {
      currentPrice: 11500,
      recommendedPrice: 12800,
      rangeMin: 12200,
      rangeMax: 13500,
      estimatedArtisanEarnings: 11776,
      platformFee: 384,
      otherCosts: 640,
      estimatedNetEarnings: 11776,
      explanation: "High knot-density Amru floral brocade with genuine silver-gold zari thread requires 96 artisan hours. Based on raw silk yarn index (₹6,800/kg) and master weaver skill benchmark, this piece commands premium heirloom pricing.",
      materialCost: 5200,
      labourHours: 96,
      craftComplexity: "Masterpiece",
      category: "Sarees",
      craftType: "Pit-loom Brocade",
      productionDays: 18,
      isDemo: true,
      generatedAt: "2026-08-01T10:00:00Z"
    }
  },
  {
    id: "p4",
    title: "Traditional Kasavu Fine Cotton Mundu Set",
    weaverName: "Madhavan Unnithan",
    weaverBio: "Madhavan weaves in the lush backwater village of Chendamangalam. He uses ancient hand-combed cotton techniques to ensure the highest breathability.",
    weaverRegion: "Chendamangalam, Ernakulam, Kerala",
    weaverImage: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300",
    material: "100% Organic combed cotton, 10% pure zari borders",
    price: 1950,
    dimensions: { length: "4.0 meters", width: "1.2 meters" },
    specialFeatures: "Fine unbleached ecru color, double layered structure, sleek 2-inch golden border thread.",
    description: "Perfect wear for religious rituals, festivals, and hot humid weather. Highly lightweight, airy, and soft on the skin.",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"
    ],
    careInstructions: "Gentle hand wash. Starch lightly if a crisp, elegant drape is preferred. Dry under soft morning sunlight.",
    dateAdded: "2026-07-18T10:00:00Z",
    status: "Listed",
    updatedAt: Date.now() - 400000000,
    version: 1,
    giInfo: {
      status: "PENDING",
      productName: "Chendamangalam Dhoties & Set Mundu",
      registrationNumber: "GI-IN-0226",
      origin: "Chendamangalam, Ernakulam District",
      stateRegion: "Kerala",
      category: "Textiles",
      verificationDate: "Pending Verification",
      verificationSource: "Submitted by Artisan Madhavan Unnithan (Pending Admin Review)",
      submittedAt: "2026-08-05T11:00:00Z"
    }
  }
];

function findServerProductIndex(productId: string): number {
  return serverProducts.findIndex(p => 
    p.id === productId || 
    p.id === productId.replace(/^prod-/, 'p') || 
    p.id === productId.replace(/^p/, 'prod-') ||
    (productId === 'p1' && p.id === 'prod-1') ||
    (productId === 'prod-1' && p.id === 'p1') ||
    (productId === 'p2' && p.id === 'prod-2') ||
    (productId === 'prod-2' && p.id === 'p2') ||
    (productId === 'p3' && p.id === 'prod-3') ||
    (productId === 'prod-3' && p.id === 'p3') ||
    (productId === 'p4' && p.id === 'prod-4') ||
    (productId === 'prod-4' && p.id === 'p4')
  );
}

let serverTransactions: TransactionHistoryEntry[] = [
  {
    id: "tx-demo-9482-1",
    orderId: "ORD-9482",
    type: "PAYMENT_SECURED",
    amount: 6850,
    status: "SUCCESS",
    timestamp: "2026-07-28T10:30:00Z",
    description: "Buyer payment secured in KalaSetu Payment Protection Sandbox",
    isDemo: true
  },
  {
    id: "tx-demo-9482-2",
    orderId: "ORD-9482",
    type: "MILESTONE_RELEASE",
    amount: 1370,
    milestoneName: "ORDER CONFIRMED",
    status: "SUCCESS",
    timestamp: "2026-07-28T10:35:00Z",
    description: "Milestone 1 (20% Order Confirmed) released to Devappa Pattar",
    isDemo: true
  },
  {
    id: "tx-demo-comp-1",
    orderId: "ORD-COMPLETED",
    type: "PAYMENT_SECURED",
    amount: 5800,
    status: "SUCCESS",
    timestamp: "2026-07-10T10:30:00Z",
    description: "Buyer payment secured in KalaSetu Payment Protection Sandbox",
    isDemo: true
  },
  {
    id: "tx-demo-comp-2",
    orderId: "ORD-COMPLETED",
    type: "MILESTONE_RELEASE",
    amount: 1160,
    milestoneName: "ORDER CONFIRMED",
    status: "SUCCESS",
    timestamp: "2026-07-10T10:35:00Z",
    description: "Milestone 1 released upon weaver confirmation",
    isDemo: true
  },
  {
    id: "tx-demo-comp-3",
    orderId: "ORD-COMPLETED",
    type: "MILESTONE_RELEASE",
    amount: 2320,
    milestoneName: "CRAFTING / MAKING",
    status: "SUCCESS",
    timestamp: "2026-07-11T16:00:00Z",
    description: "Milestone 2 released upon logistics handover",
    isDemo: true
  },
  {
    id: "tx-demo-comp-4",
    orderId: "ORD-COMPLETED",
    type: "MILESTONE_RELEASE",
    amount: 2320,
    milestoneName: "DELIVERED",
    status: "SUCCESS",
    timestamp: "2026-07-15T10:00:00Z",
    description: "Milestone 3 released following buyer inspection clearance",
    isDemo: true
  },
  {
    id: "tx-demo-disp-1",
    orderId: "ORD-DISPUTED",
    type: "PAYMENT_SECURED",
    amount: 4950,
    status: "SUCCESS",
    timestamp: "2026-07-22T11:00:00Z",
    description: "Buyer payment secured in KalaSetu Payment Protection Sandbox",
    isDemo: true
  },
  {
    id: "tx-demo-disp-2",
    orderId: "ORD-DISPUTED",
    type: "MILESTONE_RELEASE",
    amount: 990,
    milestoneName: "ORDER CONFIRMED",
    status: "SUCCESS",
    timestamp: "2026-07-22T11:05:00Z",
    description: "Milestone 1 released upon weaver confirmation",
    isDemo: true
  }
];

let serverOrders: ServerOrder[] = [
  {
    id: "ORD-9482",
    product: serverProducts[0],
    buyerName: "Ananya Deshmukh",
    buyerAddress: "Indiranagar 100ft Rd, Bengaluru, Karnataka - 560038",
    orderDate: "Today, 10:30 AM",
    status: "Order Received",
    shippingAddress: {
      street: "Flat 402, Sai Residency, 100ft Rd",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      phone: "+91 98450 12345"
    },
    trackingHistory: [
      {
        status: "Order Received",
        timestamp: "Today, 10:30 AM",
        description: "Payment locked in verified escrow. Artisan notified for loom QC dispatch."
      }
    ],
    paymentProtection: {
      isDemo: true,
      label: "DEMO / SANDBOX",
      orderTotal: 6850,
      paymentSecured: 6850,
      releasedAmount: 1370,
      pendingAmount: 5480,
      refundedAmount: 0,
      milestones: [
        {
          id: "m-ord9482-1",
          name: "ORDER CONFIRMED",
          percentage: 20,
          amount: 1370,
          status: "RELEASED",
          releasedAt: "2026-07-28T10:35:00Z",
          transactionId: "TXN-DEMO-9482-1"
        },
        {
          id: "m-ord9482-2",
          name: "CRAFTING / MAKING",
          percentage: 40,
          amount: 2740,
          status: "PENDING"
        },
        {
          id: "m-ord9482-3",
          name: "DELIVERED",
          percentage: 40,
          amount: 2740,
          status: "PENDING"
        }
      ]
    },
    transactionHistory: [
      serverTransactions[0],
      serverTransactions[1]
    ],
    updatedAt: Date.now() - 3600000,
    version: 1
  },
  {
    id: "ORD-COMPLETED",
    product: serverProducts[1],
    buyerName: "Jagadish B.",
    buyerAddress: "Indiranagar, Bengaluru, Karnataka - 560038",
    orderDate: "2026-07-10T10:30:00Z",
    status: "Payment Settled",
    shippingAddress: {
      street: "Indiranagar, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      phone: "+91 98765 43210"
    },
    trackingHistory: [
      {
        status: "Delivered",
        timestamp: "2026-07-14T11:45:00Z",
        description: "Delivered to buyer Jagadish B. and handloom authenticity verified."
      },
      {
        status: "Payment Settled",
        timestamp: "2026-07-15T10:00:00Z",
        description: "Funds disbursed directly to artisan bank account."
      }
    ],
    paymentProtection: {
      isDemo: true,
      label: "DEMO / SANDBOX",
      orderTotal: 5800,
      paymentSecured: 5800,
      releasedAmount: 5800,
      pendingAmount: 0,
      refundedAmount: 0,
      milestones: [
        {
          id: "m-comp-1",
          name: "ORDER CONFIRMED",
          percentage: 20,
          amount: 1160,
          status: "RELEASED",
          releasedAt: "2026-07-10T10:35:00Z",
          transactionId: "TXN-DEMO-COMP-1"
        },
        {
          id: "m-comp-2",
          name: "CRAFTING / MAKING",
          percentage: 40,
          amount: 2320,
          status: "RELEASED",
          releasedAt: "2026-07-11T16:00:00Z",
          transactionId: "TXN-DEMO-COMP-2"
        },
        {
          id: "m-comp-3",
          name: "DELIVERED",
          percentage: 40,
          amount: 2320,
          status: "RELEASED",
          releasedAt: "2026-07-15T10:00:00Z",
          transactionId: "TXN-DEMO-COMP-3"
        }
      ]
    },
    transactionHistory: [
      serverTransactions[2],
      serverTransactions[3],
      serverTransactions[4],
      serverTransactions[5]
    ],
    updatedAt: Date.now() - 864000000,
    version: 2
  },
  {
    id: "ORD-DISPUTED",
    product: serverProducts[1],
    buyerName: "Kavita Nair",
    buyerAddress: "Flat 12B, Palm Meadows, Whitefield, Bengaluru, Karnataka - 560066",
    orderDate: "2026-07-22T11:00:00Z",
    status: "Delivered",
    shippingAddress: {
      street: "Flat 12B, Palm Meadows, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
      phone: "+91 97411 88200"
    },
    trackingHistory: [
      {
        status: "Delivered",
        timestamp: "2026-07-25T13:00:00Z",
        description: "Package received by buyer."
      }
    ],
    paymentProtection: {
      isDemo: true,
      label: "DEMO / SANDBOX",
      orderTotal: 4950,
      paymentSecured: 4950,
      releasedAmount: 990,
      pendingAmount: 3960,
      refundedAmount: 0,
      milestones: [
        {
          id: "m-disp-1",
          name: "ORDER CONFIRMED",
          percentage: 20,
          amount: 990,
          status: "RELEASED",
          releasedAt: "2026-07-22T11:05:00Z",
          transactionId: "TXN-DEMO-DISP-1"
        },
        {
          id: "m-disp-2",
          name: "CRAFTING / MAKING",
          percentage: 40,
          amount: 1980,
          status: "PENDING"
        },
        {
          id: "m-disp-3",
          name: "DELIVERED",
          percentage: 40,
          amount: 1980,
          status: "PENDING"
        }
      ]
    },
    dispute: {
      id: "disp-101",
      status: "OPEN",
      reason: "Quality issue",
      description: "The selvedge border has a small snag near the pallu join, and the thread count appears lighter than described in the craft specifications.",
      createdAt: "2026-07-25T14:20:00Z",
      updatedAt: "2026-07-25T14:20:00Z",
      buyerName: "Kavita Nair"
    },
    transactionHistory: [
      serverTransactions[6],
      serverTransactions[7]
    ],
    updatedAt: Date.now() - 432000000,
    version: 1
  }
];

let serverConflictLogs: ServerConflictLog[] = [];

// --- Real SQLite persistence bootstrap ---
// On first run (empty database) the hardcoded arrays above become the seed data written into
// SQLite. On every run thereafter (including restarts), the in-memory arrays actually used by
// the API routes below are re-hydrated FROM the database, so data survives a restart; every
// mutating route writes back through upsert*() immediately after mutating the in-memory array
// (see the persist* calls throughout this file). Note: on Vercel's serverless environment the
// filesystem is ephemeral per cold start, so this DB does not durably persist across deployments
// there - it is fully durable for local dev and any standalone host (Cloud Run, a VM, etc.).
if (loadAllProducts().length === 0) {
  serverProducts.forEach(p => upsertProduct(p));
} else {
  serverProducts = loadAllProducts<ServerProduct>();
}
if (loadAllOrders().length === 0) {
  serverOrders.forEach(o => upsertOrder(o));
} else {
  serverOrders = loadAllOrders<ServerOrder>();
}
if (loadAllTransactions().length === 0) {
  serverTransactions.forEach(t => upsertTransaction({ id: t.id, orderId: t.orderId, type: t.type, amount: t.amount, ...t }));
} else {
  serverTransactions = loadAllTransactions<TransactionHistoryEntry>();
}

const seededAdmin = seedDemoAccountsIfEmpty();
if (seededAdmin) {
  console.log('\n[KalaSetu] First run detected - seeded demo accounts in data/kalasetu.db:');
  console.log(`  Admin  -> email: ${seededAdmin.adminEmail}  password: ${seededAdmin.adminPassword}`);
  console.log('  Artisan -> email: weaver@kalasetu.demo  password: Weaver@123');
  console.log('  Buyer   -> email: buyer@kalasetu.demo   password: Buyer@123');
  console.log('[KalaSetu] Change these passwords before any real deployment.\n');
}

// Builds and configures the Express app with every API route registered, but does not bind a
// port or wire up static/SPA serving. Used both by the standalone server (Cloud Run/local dev)
// and by the Vercel serverless function entrypoint (api/index.ts), which invokes this directly
// instead of a long-lived process since Vercel does not execute app.listen()-based servers.
export async function createApp() {
  const app = express();

  // JSON Body Parser for REST Endpoints
  app.use(express.json({ limit: "10mb" }));
  app.use(attachSession);

  // ==========================================
  // REST API Endpoints
  // ==========================================

  // 1. Health & Server Telemetry
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      version: "3.2.0",
      pwa: "active",
      serviceWorkerCache: "taana-pwa-v3",
      dbStatus: "connected",
      conflictPolicy: "LAST_WRITE_WINS",
      uptime: process.uptime()
    });
  });

  // 1b. Authentication Endpoint - real accounts, bcrypt-verified, JWT session issued on success.
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required" });
      }

      const account = findAccountByEmail(String(email));
      if (!account || !verifyPassword(String(password), account.password_hash)) {
        return res.status(401).json({ success: false, error: "Invalid email or password" });
      }

      const token = issueSessionToken(account);
      // Legacy client role vocabulary (ADMIN/WEAVER/BUYER) preserved so existing frontend role
      // routing logic (App.tsx / LoginModal.tsx) does not need to change.
      const legacyRole = account.role === 'admin' ? 'ADMIN' : account.role === 'artisan' ? 'WEAVER' : 'BUYER';

      return res.json({
        success: true,
        token,
        user: {
          id: account.id,
          email: account.email,
          name: account.name,
          role: legacyRole,
          region: account.region || undefined,
          phone: account.phone || undefined
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 1c. Logout - JWTs are stateless, so there is no server-side session to invalidate; the real
  // logout is the client discarding its stored token (see App.tsx). This endpoint exists so the
  // client has a consistent server round-trip to call, and so a future server-side denylist
  // (if ever needed) has a natural place to live.
  app.post("/api/auth/logout", (_req, res) => {
    res.json({ success: true });
  });

  // 3. Products Endpoints (GET & POST)
  app.get("/api/products", (req, res) => {
    res.json({
      success: true,
      count: serverProducts.length,
      products: serverProducts
    });
  });

  app.post("/api/products", (req, res) => {
    try {
      const productData = req.body;
      const clientTime = productData.updatedAt || Date.now();
      
      const newProduct: ServerProduct = {
        id: productData.id || `prod-${Date.now()}`,
        title: productData.title || "Handloom Saree",
        category: productData.category,
        weaverName: productData.weaverName || "Master Weaver",
        weaverBio: productData.weaverBio || "Artisan",
        weaverRegion: productData.weaverRegion || "Karnataka",
        weaverImage: productData.weaverImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
        material: productData.material || "Pure Silk",
        price: Number(productData.price) || 5000,
        dimensions: productData.dimensions || { length: "6.25 meters", width: "1.15 meters" },
        specialFeatures: productData.specialFeatures || "Handloom authentic",
        description: productData.description || "Handcrafted saree",
        images: productData.images && productData.images.length > 0 ? productData.images : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"],
        careInstructions: productData.careInstructions || "Dry clean only",
        dateAdded: "Just now",
        status: "Listed",
        giInfo: productData.giInfo,
        updatedAt: clientTime,
        version: 1
      };

      // Check if product exists (LWW Policy)
      const existingIdx = serverProducts.findIndex(p => p.id === newProduct.id);
      if (existingIdx !== -1) {
        const existing = serverProducts[existingIdx];
        if (clientTime >= existing.updatedAt) {
          serverProducts[existingIdx] = { ...newProduct, version: existing.version + 1 };
          upsertProduct(serverProducts[existingIdx]);
        }
      } else {
        serverProducts.unshift(newProduct);
        upsertProduct(newProduct);
      }

      res.status(201).json({ success: true, product: newProduct });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // 4. Orders Endpoints (GET, POST, PUT)
  app.get("/api/orders", (req, res) => {
    res.json({
      success: true,
      count: serverOrders.length,
      orders: serverOrders
    });
  });

  app.post("/api/orders", (req, res) => {
    try {
      const orderData = req.body;
      const clientTime = orderData.updatedAt || Date.now();
      // Spread the full client payload first (preserves paymentProtection, quantity, cartGroupId,
      // giInfo snapshot, etc. - the escrow/milestone data the admin panel and buyer/artisan views
      // depend on), then fill in defaults only for whatever the client omitted.
      const newOrder: ServerOrder = {
        ...orderData,
        id: orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        product: orderData.product || serverProducts[0],
        buyerName: orderData.buyerName || "Conscious Buyer",
        buyerAddress: orderData.buyerAddress || "Bengaluru",
        orderDate: orderData.orderDate || "Just now",
        status: orderData.status || "Order Received",
        shippingAddress: orderData.shippingAddress || {
          street: "Direct Address",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          phone: "+91 98000 00000"
        },
        trackingHistory: orderData.trackingHistory || [
          {
            status: "Order Received",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: "Direct order created and synchronized."
          }
        ],
        updatedAt: clientTime,
        version: 1
      };

      const existingIdx = serverOrders.findIndex(o => o.id === newOrder.id);
      if (existingIdx !== -1) {
        serverOrders[existingIdx] = newOrder;
      } else {
        serverOrders.unshift(newOrder);
      }
      upsertOrder(newOrder);
      res.status(201).json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put("/api/orders/:id/status", (req, res) => {
    try {
      const orderId = req.params.id;
      const { status, qualityCheck, note, clientTimestamp } = req.body;
      const incomingTime = clientTimestamp || Date.now();

      const existingIdx = serverOrders.findIndex(o => o.id === orderId);
      if (existingIdx === -1) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const existingOrder = serverOrders[existingIdx];
      const clientWins = incomingTime >= existingOrder.updatedAt;

      if (clientWins) {
        serverOrders[existingIdx] = {
          ...existingOrder,
          status: status || existingOrder.status,
          qualityCheck: qualityCheck || existingOrder.qualityCheck,
          updatedAt: incomingTime,
          version: existingOrder.version + 1,
          trackingHistory: [
            ...existingOrder.trackingHistory,
            {
              status: status || "Updated",
              timestamp: new Date(incomingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              description: note || "Status updated via verified QC check."
            }
          ]
        };
        upsertOrder(serverOrders[existingIdx]);

        return res.json({
          success: true,
          resolution: "client-wins",
          order: serverOrders[existingIdx]
        });
      } else {
        return res.json({
          success: true,
          resolution: "server-wins-preserved",
          message: "Server timestamp is newer. Existing order state preserved.",
          order: existingOrder
        });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4a. Geographical Indication (GI) Submission by Artisan
  app.put("/api/products/:id/gi", (req, res) => {
    try {
      const productId = req.params.id;
      const { productName, registrationNumber, origin, stateRegion, category } = req.body;

      if (!registrationNumber || !productName || !origin) {
        return res.status(400).json({ success: false, error: "Registration Number, Product Name, and Origin are required" });
      }

      const prodIdx = findServerProductIndex(productId);
      if (prodIdx === -1) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      // Artisan submission always sets status to PENDING (cannot mark as VERIFIED)
      const giInfo: GiInfo = {
        status: "PENDING",
        productName: String(productName).trim(),
        registrationNumber: String(registrationNumber).trim(),
        origin: String(origin).trim(),
        stateRegion: stateRegion ? String(stateRegion).trim() : "Karnataka",
        category: category ? String(category).trim() : "Handlooms & Textiles",
        verificationDate: "Pending Verification",
        verificationSource: `Submitted by Artisan ${serverProducts[prodIdx].weaverName} (Pending Admin Review)`,
        submittedAt: new Date().toISOString()
      };

      serverProducts[prodIdx] = {
        ...serverProducts[prodIdx],
        giInfo,
        updatedAt: Date.now(),
        version: serverProducts[prodIdx].version + 1
      };
      upsertProduct(serverProducts[prodIdx]);
      upsertGiRecord(productId, giInfo);

      res.json({ success: true, product: { ...serverProducts[prodIdx], id: productId } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4b. Admin GI Verification / Rejection - server-verified admin session required.
  app.put("/api/products/:id/gi/verify", requireRole('admin'), (req, res) => {
    try {
      const productId = req.params.id;
      const { status, verificationSource, verificationDate, verifiedBy, notes } = req.body;

      if (!["VERIFIED", "REJECTED"].includes(status)) {
        return res.status(400).json({ success: false, error: "Status must be VERIFIED or REJECTED" });
      }

      const prodIdx = findServerProductIndex(productId);
      if (prodIdx === -1) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      const currentGi = serverProducts[prodIdx].giInfo;
      if (!currentGi) {
        return res.status(400).json({ success: false, error: "No GI submission exists for this product" });
      }

      const updatedGi: GiInfo = {
        ...currentGi,
        status: status as 'VERIFIED' | 'REJECTED',
        verificationDate: status === "VERIFIED" ? (verificationDate || new Date().toISOString().split("T")[0]) : undefined,
        verificationSource: verificationSource || (status === "VERIFIED" ? "Geographical Indications Registry of India, Govt. of India" : undefined),
        verifiedBy: verifiedBy || (status === "VERIFIED" ? "KalaSetu Administrative Cell (admin@kalasetu.demo)" : undefined),
        notes: notes || undefined
      };

      serverProducts[prodIdx] = {
        ...serverProducts[prodIdx],
        giInfo: updatedGi,
        updatedAt: Date.now(),
        version: serverProducts[prodIdx].version + 1
      };
      upsertProduct(serverProducts[prodIdx]);
      upsertGiRecord(productId, updatedGi);

      res.json({ success: true, product: { ...serverProducts[prodIdx], id: productId } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4c. AI Dynamic Pricing Engine
  app.post("/api/pricing/recommend", async (req, res) => {
    try {
      const {
        materialCost = 2500,
        labourHours = 40,
        craftComplexity = "Medium",
        category = "Sarees",
        craftType = "Pit-loom Weaving",
        productionDays = 5,
        currentPrice = 4500
      } = req.body;

      const numMaterialCost = Number(materialCost) || 2500;
      const numLabourHours = Number(labourHours) || 40;
      const numCurrentPrice = Number(currentPrice) || 4500;
      const numDays = Number(productionDays) || 5;

      // Deterministic Fair Artisan Benchmark Engine
      const hourlyBenchmark = craftComplexity === "Masterpiece" ? 85 : craftComplexity === "Medium" ? 65 : 50;
      const complexityMultiplier = craftComplexity === "Masterpiece" ? 1.35 : craftComplexity === "Medium" ? 1.20 : 1.10;
      const directCost = numMaterialCost + (numLabourHours * hourlyBenchmark);
      const calculatedFairPrice = Math.round((directCost * complexityMultiplier) / 50) * 50;
      
      const rangeMin = Math.round((calculatedFairPrice * 0.92) / 50) * 50;
      const rangeMax = Math.round((calculatedFairPrice * 1.08) / 50) * 50;
      const platformFee = Math.round(calculatedFairPrice * 0.03); // 3%
      const otherCosts = Math.round(calculatedFairPrice * 0.05); // 5% logistics & craft packaging
      const estimatedArtisanEarnings = calculatedFairPrice - platformFee - otherCosts;

      const explanation = `Fair-price benchmark for ${craftComplexity.toLowerCase()} ${craftType}: Includes ₹${numMaterialCost.toLocaleString()} raw materials + ${numLabourHours} artisan hours at ₹${hourlyBenchmark}/hr master labor rate. With a ${Math.round((complexityMultiplier - 1) * 100)}% heritage skill premium, fair direct market valuation ranges from ₹${rangeMin.toLocaleString()} to ₹${rangeMax.toLocaleString()}.`;

      const recommendation: PricingRecommendation = {
        currentPrice: numCurrentPrice,
        recommendedPrice: calculatedFairPrice,
        rangeMin,
        rangeMax,
        estimatedArtisanEarnings,
        platformFee,
        otherCosts,
        estimatedNetEarnings: estimatedArtisanEarnings,
        explanation,
        materialCost: numMaterialCost,
        labourHours: numLabourHours,
        craftComplexity: craftComplexity as 'Standard' | 'Medium' | 'Masterpiece',
        category: String(category),
        craftType: String(craftType),
        productionDays: numDays,
        isDemo: true,
        generatedAt: new Date().toISOString()
      };

      res.json({ success: true, recommendation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4d. Milestone Payment Release
  app.post("/api/orders/:id/milestones/release", requireRole('admin'), (req, res) => {
    try {
      const orderId = req.params.id;
      const { milestoneId, milestoneName } = req.body;

      const orderIdx = serverOrders.findIndex(o => o.id === orderId);
      if (orderIdx === -1) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const order = serverOrders[orderIdx];
      if (!order.paymentProtection) {
        return res.status(400).json({ success: false, error: "Order does not have payment protection enabled" });
      }

      // If active dispute exists, releases are paused!
      if (order.dispute && (order.dispute.status === "OPEN" || order.dispute.status === "UNDER REVIEW")) {
        return res.status(400).json({
          success: false,
          error: "Cannot release milestone payment: Order has an active dispute. All payouts are paused until dispute resolution."
        });
      }

      const milestoneIdx = order.paymentProtection.milestones.findIndex(
        m => (milestoneId && m.id === milestoneId) || (milestoneName && m.name.toLowerCase() === milestoneName.toLowerCase())
      );
      if (milestoneIdx === -1) {
        return res.status(404).json({ success: false, error: "Milestone not found" });
      }

      const milestone = order.paymentProtection.milestones[milestoneIdx];
      if (milestone.status === "RELEASED") {
        return res.status(400).json({ success: false, error: "Milestone has already been released" });
      }

      // Invariants check: released + milestone.amount cannot exceed orderTotal
      const newReleased = order.paymentProtection.releasedAmount + milestone.amount;
      if (newReleased + order.paymentProtection.refundedAmount > order.paymentProtection.paymentSecured) {
        return res.status(400).json({ success: false, error: "Milestone release would exceed secured payment amount" });
      }

      const now = new Date().toISOString();
      const txnId = `TXN-REL-${Date.now()}`;

      // Update milestone
      const updatedMilestones = [...order.paymentProtection.milestones];
      updatedMilestones[milestoneIdx] = {
        ...milestone,
        status: "RELEASED",
        releasedAt: now,
        transactionId: txnId
      };

      const newPending = Math.max(0, order.paymentProtection.paymentSecured - newReleased - order.paymentProtection.refundedAmount);

      const updatedProtection: PaymentProtection = {
        ...order.paymentProtection,
        releasedAmount: newReleased,
        pendingAmount: newPending,
        milestones: updatedMilestones
      };

      const newTxn: TransactionHistoryEntry = {
        id: txnId,
        orderId,
        type: "MILESTONE_RELEASE",
        amount: milestone.amount,
        milestoneName: milestone.name,
        status: "SUCCESS",
        timestamp: now,
        description: `Milestone (${milestone.percentage}% ${milestone.name}) released to artisan`,
        isDemo: true
      };

      serverTransactions.unshift(newTxn);
      upsertTransaction({ id: newTxn.id, orderId: newTxn.orderId, type: newTxn.type, amount: newTxn.amount, ...newTxn });

      serverOrders[orderIdx] = {
        ...order,
        paymentProtection: updatedProtection,
        transactionHistory: [newTxn, ...(order.transactionHistory || [])],
        updatedAt: Date.now(),
        version: order.version + 1
      };
      upsertOrder(serverOrders[orderIdx]);

      res.json({
        success: true,
        order: serverOrders[orderIdx],
        transaction: newTxn
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4d-2. Admin Escrow Hold - flags an order for review, pausing further milestone releases.
  // Reuses the existing dispute record/status (the milestone-release route above already refuses
  // to release funds while dispute.status is OPEN/UNDER REVIEW) instead of a parallel hold flag.
  app.post("/api/orders/:id/hold", requireRole('admin'), (req, res) => {
    try {
      const orderId = req.params.id;
      const { reason } = req.body;

      const orderIdx = serverOrders.findIndex(o => o.id === orderId);
      if (orderIdx === -1) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const order = serverOrders[orderIdx];
      const now = new Date().toISOString();

      const heldDispute: OrderDispute = order.dispute || {
        id: `${order.id}-dispute`,
        status: 'UNDER REVIEW',
        reason: 'Other',
        description: reason || 'Escrow release held by admin for manual review.',
        createdAt: now,
        updatedAt: now,
        buyerName: order.buyerName
      };
      if (order.dispute) {
        heldDispute.status = 'UNDER REVIEW';
        heldDispute.updatedAt = now;
        heldDispute.adminNotes = [...(heldDispute.adminNotes || []), reason || 'Held by admin for manual review.'];
      }

      serverOrders[orderIdx] = {
        ...order,
        dispute: heldDispute,
        updatedAt: Date.now(),
        version: order.version + 1
      };
      upsertOrder(serverOrders[orderIdx]);

      res.json({ success: true, order: serverOrders[orderIdx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4e. Raise Dispute (Buyer Flow)
  app.post("/api/orders/:id/disputes", (req, res) => {
    try {
      const orderId = req.params.id;
      const { reason, description, buyerNotes, evidenceUrl, buyerName } = req.body;
      const finalDesc = description || buyerNotes;

      if (!reason || !finalDesc) {
        return res.status(400).json({ success: false, error: "Dispute reason and description are required" });
      }

      const orderIdx = serverOrders.findIndex(o => o.id === orderId);
      if (orderIdx === -1) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const order = serverOrders[orderIdx];
      if (order.dispute && (order.dispute.status === "OPEN" || order.dispute.status === "UNDER REVIEW")) {
        return res.status(400).json({ success: false, error: "A dispute is already active on this order" });
      }

      const now = new Date().toISOString();
      const newDispute: OrderDispute = {
        id: `disp-${Date.now()}`,
        status: "OPEN",
        reason,
        description: finalDesc,
        evidenceUrl: evidenceUrl || undefined,
        createdAt: now,
        updatedAt: now,
        buyerName: buyerName || order.buyerName
      };

      serverOrders[orderIdx] = {
        ...order,
        dispute: newDispute,
        updatedAt: Date.now(),
        version: order.version + 1
      };
      upsertOrder(serverOrders[orderIdx]);

      res.status(201).json({ success: true, dispute: newDispute, order: serverOrders[orderIdx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4f. Respond to Dispute (Artisan Flow)
  app.post("/api/orders/:id/disputes/respond", (req, res) => {
    try {
      const orderId = req.params.id;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, error: "Response message is required" });
      }

      const orderIdx = serverOrders.findIndex(o => o.id === orderId);
      if (orderIdx === -1) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const order = serverOrders[orderIdx];
      if (!order.dispute) {
        return res.status(404).json({ success: false, error: "No dispute found on this order" });
      }

      const now = new Date().toISOString();
      const updatedDispute: OrderDispute = {
        ...order.dispute,
        status: "UNDER REVIEW",
        artisanResponse: {
          message,
          respondedAt: now
        },
        updatedAt: now
      };

      serverOrders[orderIdx] = {
        ...order,
        dispute: updatedDispute,
        updatedAt: Date.now(),
        version: order.version + 1
      };
      upsertOrder(serverOrders[orderIdx]);

      res.json({ success: true, dispute: updatedDispute, order: serverOrders[orderIdx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4g. Resolve Dispute (Admin Flow) - server-verified admin session required.
  app.post("/api/orders/:id/disputes/resolve", requireRole('admin'), (req, res) => {
    try {
      const orderId = req.params.id;
      const { action, amount, notes } = req.body;

      const validActions = ["RELEASE PAYMENT", "REFUND BUYER", "PARTIAL REFUND", "REQUEST MORE INFORMATION"];
      if (!validActions.includes(action)) {
        return res.status(400).json({ success: false, error: `Action must be one of: ${validActions.join(", ")}` });
      }

      const orderIdx = serverOrders.findIndex(o => o.id === orderId);
      if (orderIdx === -1) {
        return res.status(404).json({ success: false, error: "Order not found" });
      }

      const order = serverOrders[orderIdx];
      if (!order.dispute) {
        return res.status(404).json({ success: false, error: "No dispute found on this order" });
      }

      const now = new Date().toISOString();
      let updatedDispute: OrderDispute = { ...order.dispute, updatedAt: now };
      let updatedProtection = order.paymentProtection ? { ...order.paymentProtection } : undefined;
      const newTransactions: TransactionHistoryEntry[] = [];

      if (action === "REQUEST MORE INFORMATION") {
        updatedDispute.status = "UNDER REVIEW";
        updatedDispute.requestedInfo = notes || "Additional photos of the weave border required";
        updatedDispute.adminNotes = [...(updatedDispute.adminNotes || []), notes || "Admin requested additional information from buyer/artisan"];
      } else if (action === "RELEASE PAYMENT") {
        // Release remaining pending amount to artisan
        if (updatedProtection) {
          const releaseAmount = updatedProtection.pendingAmount;
          if (releaseAmount > 0) {
            updatedProtection.releasedAmount += releaseAmount;
            updatedProtection.pendingAmount = 0;
            // Mark remaining milestones as RELEASED
            updatedProtection.milestones = updatedProtection.milestones.map(m =>
              m.status === "PENDING" ? { ...m, status: "RELEASED", releasedAt: now, transactionId: `TXN-DISP-REL-${Date.now()}` } : m
            );

            const txn: TransactionHistoryEntry = {
              id: `TXN-REL-DISP-${Date.now()}`,
              orderId,
              type: "MILESTONE_RELEASE",
              amount: releaseAmount,
              status: "SUCCESS",
              timestamp: now,
              description: `Dispute resolved: Remaining escrow funds released to artisan. Notes: ${notes || "No defect found"}`,
              isDemo: true
            };
            newTransactions.push(txn);
            serverTransactions.unshift(txn);
          }
        }
        updatedDispute.status = "PAYMENT RELEASED";
        updatedDispute.resolution = {
          action: "RELEASE PAYMENT",
          resolvedAt: now,
          notes: notes || "Dispute reviewed by admin. Payment released to artisan."
        };
      } else if (action === "REFUND BUYER") {
        // Full refund of pending/remaining escrow funds to buyer
        if (updatedProtection) {
          const refundAmount = updatedProtection.pendingAmount;
          if (refundAmount > 0) {
            updatedProtection.refundedAmount += refundAmount;
            updatedProtection.pendingAmount = 0;

            const txn: TransactionHistoryEntry = {
              id: `TXN-REFUND-${Date.now()}`,
              orderId,
              type: "REFUND",
              amount: refundAmount,
              status: "SUCCESS",
              timestamp: now,
              description: `Dispute resolved: ₹${refundAmount.toLocaleString()} refunded to buyer. Notes: ${notes || "Item returned"}`,
              isDemo: true
            };
            newTransactions.push(txn);
            serverTransactions.unshift(txn);
          }
        }
        updatedDispute.status = "REFUNDED";
        updatedDispute.resolution = {
          action: "REFUND BUYER",
          amount: updatedProtection?.refundedAmount,
          resolvedAt: now,
          notes: notes || "Full refund issued to buyer."
        };
      } else if (action === "PARTIAL REFUND") {
        const partialAmt = Number(amount) || 0;
        if (partialAmt <= 0) {
          return res.status(400).json({ success: false, error: "Partial refund amount must be greater than 0" });
        }
        if (updatedProtection && partialAmt > updatedProtection.pendingAmount) {
          return res.status(400).json({ success: false, error: `Partial refund (₹${partialAmt}) cannot exceed pending escrow balance (₹${updatedProtection.pendingAmount})` });
        }

        if (updatedProtection) {
          updatedProtection.refundedAmount += partialAmt;
          updatedProtection.pendingAmount -= partialAmt;

          const txn: TransactionHistoryEntry = {
            id: `TXN-PART-REF-${Date.now()}`,
            orderId,
            type: "PARTIAL_REFUND",
            amount: partialAmt,
            status: "SUCCESS",
            timestamp: now,
            description: `Dispute resolved: Partial refund of ₹${partialAmt.toLocaleString()} sent to buyer. Notes: ${notes || "Mutually agreed"}`,
            isDemo: true
          };
          newTransactions.push(txn);
          serverTransactions.unshift(txn);
        }

        updatedDispute.status = "RESOLVED";
        updatedDispute.resolution = {
          action: "PARTIAL REFUND",
          amount: partialAmt,
          resolvedAt: now,
          notes: notes || `Partial refund of ₹${partialAmt} issued.`
        };
      }

      serverOrders[orderIdx] = {
        ...order,
        dispute: updatedDispute,
        paymentProtection: updatedProtection,
        transactionHistory: [...newTransactions, ...(order.transactionHistory || [])],
        updatedAt: Date.now(),
        version: order.version + 1
      };
      upsertOrder(serverOrders[orderIdx]);
      newTransactions.forEach(t => upsertTransaction({ id: t.id, orderId: t.orderId, type: t.type, amount: t.amount, ...t }));

      res.json({
        success: true,
        order: serverOrders[orderIdx],
        dispute: updatedDispute
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4h. Transaction History Endpoint (All Sandbox / Demo records) - admin only.
  app.get("/api/transactions", requireRole('admin'), (req, res) => {
    res.json({
      success: true,
      count: serverTransactions.length,
      transactions: serverTransactions
    });
  });
  app.post("/api/sync/batch", (req, res) => {
    try {
      const { items, policy } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, error: "items array is required" });
      }

      let syncedCount = 0;
      let conflictCount = 0;
      const results: any[] = [];

      for (const item of items) {
        const clientTime = item.clientTimestamp || Date.now();

        if (item.type === "NEW_PRODUCT") {
          const prodPayload = item.payload;
          const newProd: ServerProduct = {
            id: prodPayload.id || `prod-${Date.now()}`,
            title: prodPayload.title,
            weaverName: prodPayload.weaverName || "Master Weaver",
            weaverBio: prodPayload.weaverBio || "Artisan",
            weaverRegion: prodPayload.weaverRegion || "Karnataka",
            weaverImage: prodPayload.weaverImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
            material: prodPayload.material || "Silk",
            price: Number(prodPayload.price) || 4500,
            dimensions: prodPayload.dimensions || { length: "6.0m", width: "1.1m" },
            specialFeatures: prodPayload.specialFeatures || "",
            description: prodPayload.description || "",
            images: prodPayload.images || [],
            careInstructions: prodPayload.careInstructions || "",
            dateAdded: "Synchronized",
            status: "Listed",
            updatedAt: clientTime,
            version: 1
          };

          const existingIdx = serverProducts.findIndex(p => p.id === newProd.id);
          if (existingIdx !== -1) {
            if (clientTime >= serverProducts[existingIdx].updatedAt) {
              serverProducts[existingIdx] = { ...newProd, version: serverProducts[existingIdx].version + 1 };
              upsertProduct(serverProducts[existingIdx]);
              syncedCount++;
            } else {
              conflictCount++;
            }
          } else {
            serverProducts.unshift(newProd);
            upsertProduct(newProd);
            syncedCount++;
          }
          results.push({ id: item.id, status: "synced" });
        } else if (item.type === "QC_SUBMIT" || item.type === "ORDER_STATUS_UPDATE") {
          const orderId = item.payload.orderId || item.payload.id;
          const existingIdx = serverOrders.findIndex(o => o.id === orderId);

          if (existingIdx !== -1) {
            const existingOrder = serverOrders[existingIdx];
            const clientWins = clientTime >= existingOrder.updatedAt;

            if (clientWins) {
              serverOrders[existingIdx] = {
                ...existingOrder,
                status: item.payload.status || "Quality Checked",
                qualityCheck: item.payload.qualityCheck || existingOrder.qualityCheck,
                updatedAt: clientTime,
                version: existingOrder.version + 1,
                trackingHistory: [
                  ...existingOrder.trackingHistory,
                  {
                    status: item.payload.status || "Quality Checked",
                    timestamp: new Date(clientTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    description: item.payload.note || "QC verified offline and synchronized via LWW policy."
                  }
                ]
              };
              upsertOrder(serverOrders[existingIdx]);
              syncedCount++;

              const conflictLog: ServerConflictLog = {
                id: randomId('conf'),
                outboxItemId: item.id,
                entityType: "order",
                entityId: orderId,
                clientTimestamp: clientTime,
                serverTimestamp: existingOrder.updatedAt,
                winningSide: "client",
                resolutionStrategy: "LAST_WRITE_WINS",
                resolvedAt: new Date().toISOString()
              };
              serverConflictLogs.unshift(conflictLog);
            } else {
              conflictCount++;
              const conflictLog: ServerConflictLog = {
                id: randomId('conf'),
                outboxItemId: item.id,
                entityType: "order",
                entityId: orderId,
                clientTimestamp: clientTime,
                serverTimestamp: existingOrder.updatedAt,
                winningSide: "server",
                resolutionStrategy: "LAST_WRITE_WINS",
                resolvedAt: new Date().toISOString()
              };
              serverConflictLogs.unshift(conflictLog);
            }
          }
          results.push({ id: item.id, status: "processed" });
        } else if (item.type === "NEW_ORDER") {
          const newOrder: ServerOrder = {
            ...item.payload,
            updatedAt: clientTime,
            version: 1
          };
          serverOrders.unshift(newOrder);
          upsertOrder(newOrder);
          syncedCount++;
          results.push({ id: item.id, status: "synced" });
        }
      }

      res.json({
        success: true,
        policy: policy || "LAST_WRITE_WINS",
        syncedCount,
        conflictCount,
        serverTimestamp: Date.now(),
        results
      });
    } catch (err: any) {
      console.error("Batch sync error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Conflict Resolution Telemetry Logs
  app.get("/api/sync/conflicts", (req, res) => {
    res.json({
      success: true,
      count: serverConflictLogs.length,
      conflicts: serverConflictLogs
    });
  });

  // 7. TTS Proxy Route with Chunk Concatenation
  app.get("/api/tts", async (req, res) => {
    try {
      const text = req.query.text as string;
      const lang = req.query.lang as string;
      if (!text || !text.trim()) {
        return res.status(400).send("Text is required");
      }
      
      const shortLang = lang === "kn" ? "kn" : lang === "hi" ? "hi" : lang === "ta" ? "ta" : "en";
      
      const splitTextIntoChunks = (raw: string, maxLen = 130): string[] => {
        const clean = raw.trim();
        if (clean.length <= maxLen) return [clean];
        const sentences = clean.split(/(?<=[.।?!,])\s+/);
        const chunks: string[] = [];
        let currentChunk = '';
        for (const sentence of sentences) {
          if ((currentChunk + ' ' + sentence).trim().length <= maxLen) {
            currentChunk = (currentChunk + ' ' + sentence).trim();
          } else {
            if (currentChunk) chunks.push(currentChunk);
            if (sentence.length <= maxLen) {
              currentChunk = sentence;
            } else {
              const words = sentence.split(/\s+/);
              currentChunk = '';
              for (const word of words) {
                if ((currentChunk + ' ' + word).trim().length <= maxLen) {
                  currentChunk = (currentChunk + ' ' + word).trim();
                } else {
                  if (currentChunk) chunks.push(currentChunk);
                  currentChunk = word;
                }
              }
            }
          }
        }
        if (currentChunk) chunks.push(currentChunk);
        return chunks;
      };

      const chunks = splitTextIntoChunks(text);
      const audioBuffers: Buffer[] = [];

      for (const chunk of chunks) {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${shortLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://translate.google.com/"
          }
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          audioBuffers.push(Buffer.from(arrayBuffer));
        }
      }

      if (audioBuffers.length === 0) {
        throw new Error("Failed to generate audio for any text chunk");
      }

      const combinedBuffer = Buffer.concat(audioBuffers);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(combinedBuffer);
    } catch (error: any) {
      console.error("TTS proxy error:", error);
      res.status(500).send("Failed to generate TTS");
    }
  });

  return app;
}

// Standalone server entrypoint (local dev via tsx, and any long-lived host like Cloud Run).
// Not used on Vercel: Vercel invokes createApp() directly from api/index.ts per-request instead
// of starting a persistent process, so this function must never run there.
async function startServer() {
  const app = await createApp();

  // Environment & Port configuration:
  // - In development: Dev server MUST strictly bind to port 3000 (required by local reverse proxy).
  // - In production: Cloud Run injects PORT (default 8080) and expects container ingress on that port.
  const isBundled = typeof __filename !== "undefined" && (__filename.includes("dist") || __filename.endsWith(".cjs"));
  const isProduction = process.env.NODE_ENV === "production" || process.env.npm_lifecycle_event === "start" || isBundled;
  const PORT = isProduction && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Vite middleware for development & SPA serving
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err && !res.headersSent) {
          res.status(500).send("Unable to serve application. Ensure build has succeeded.");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KalaSetu PWA Server] Ready on http://0.0.0.0:${PORT} (${isProduction ? "production" : "development"})`);
  });

  // In production (Cloud Run), if PORT is not 3000, also bind to port 3000 if available
  if (isProduction && PORT !== 3000) {
    try {
      const secondaryServer = app.listen(3000, "0.0.0.0", () => {
        console.log(`[KalaSetu PWA Server] Secondary listener on http://0.0.0.0:3000`);
      });
      secondaryServer.on("error", () => {
        // Port 3000 already occupied or unavailable, safe to ignore
      });
    } catch {
      // Safe to ignore
    }
  }
}

// Vercel sets VERCEL=1 in its build/runtime environment; the serverless function in api/index.ts
// imports createApp() directly and must not trigger a second, listen()-based server here.
if (!process.env.VERCEL) {
  startServer();
}

