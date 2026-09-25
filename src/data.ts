import { Product, Order, Language, Translation, SearchFilters, GovernmentScheme, MaterialClusterRequest } from './types';

// Unsplash premium-looking textile and weaver-related images
export const SAMPLE_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600', // Saree texture 1
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600', // Loom / weaving close up
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600', // Saree texture 2
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600', // India textile / shawl
];

export const MOCK_WEAVER_IMAGES = [
  'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300', // Friendly craftsman 1
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', // Craftswoman 1
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', // Craftsman 2
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Ilkal Cotton-Silk Saree with Kasuti Border',
    weaverName: 'Sharanappa Devanga',
    weaverBio: 'A 4th generation master weaver from Ilkal, Bagalkot. He specializes in the ancient Tope Teni pallu joining technique and loves natural indigo dyes.',
    weaverRegion: 'Ilkal, Bagalkot, Karnataka',
    weaverImage: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300',
    material: '80% cotton, 20% silk',
    price: 3200,
    dimensions: { length: '6.0 meters', width: '1.2 meters' },
    specialFeatures: 'Handcrafted red Kasuti embroidered border, traditional temple motifs, lightweight breathable texture.',
    description: 'Perfect for summers and local festivals. This authentic Ilkal saree features a dark forest green body and a classic deep crimson red border, joined together with painstaking interlocking weaves.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600'
    ],
    careInstructions: 'Dry clean recommended for first wash. Subsequently, gentle hand wash in cold water using mild soap/shampoo. Dry in shade.',
    dateAdded: '2026-07-15T12:00:00Z',
    status: 'Listed',
    languageCreated: 'kn',
    capacityPerWeek: 3,
    capacityPerMonth: 12,
    giInfo: {
      status: 'VERIFIED',
      productName: 'Ilkal Sarees',
      registrationNumber: 'GI-IN-0079',
      origin: 'Ilkal, Bagalkot District',
      stateRegion: 'Karnataka',
      category: 'Textiles & Handicrafts',
      verificationDate: '2024-03-15',
      verificationSource: 'Geographical Indications Registry of India, Intellectual Property India (Certificate #79)'
    }
  },
  {
    id: 'p2',
    title: 'Pochampally Ikat Pure Silk Saree',
    weaverName: 'Ramesh Kootala',
    weaverBio: 'Ramesh has been running a family co-operative in Pochampally for 25 years. He is passionate about geometric tie-and-dye layouts and natural herbal colors.',
    weaverRegion: 'Pochampally, Yadadri Bhuvanagiri, Telangana',
    weaverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    material: '100% Pure Mulberry Silk',
    price: 5800,
    dimensions: { length: '5.5 meters', width: '1.1 meters' },
    specialFeatures: 'Double Ikat tie-dye pattern, rich heavy golden pallu, smooth natural silk luster.',
    description: 'An elegant premium Pochampally Ikat silk saree in bright saffron yellow and warm terracotta colors. Known for its distinct geometric sharpness and highly stable dye quality.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    careInstructions: 'Strictly dry clean only. Store wrapped in a soft cotton cloth inside a cool drawer away from dampness.',
    dateAdded: '2026-07-16T14:30:00Z',
    status: 'Listed',
    languageCreated: 'en',
    capacityPerWeek: 2,
    capacityPerMonth: 8,
    giInfo: {
      status: 'PENDING',
      productName: 'Pochampally Ikat',
      registrationNumber: 'GI-IN-0004',
      origin: 'Pochampally, Yadadri Bhuvanagiri',
      stateRegion: 'Telangana',
      category: 'Textiles',
      verificationDate: 'Pending Verification',
      verificationSource: 'Submitted by Weaver Ramesh Kootala (Under Admin Review)',
      submittedAt: '2026-08-01T10:00:00Z'
    }
  },
  {
    id: 'p3',
    title: 'Banarasi Brocade Silk Saree with Gold Zari',
    weaverName: 'Smt. Savita Devi',
    weaverBio: 'Savita Devi is a pioneer in women handloom guilds in Varanasi, keeping the legacy of fine brocades alive with intricate designs inspired by heritage Mughal patterns.',
    weaverRegion: 'Varanasi, Uttar Pradesh',
    weaverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    material: 'Katan Silk, Fine Gold Thread (Zari)',
    price: 11500,
    dimensions: { length: '5.5 meters', width: '1.1 meters' },
    specialFeatures: 'Extravagant gold zari border, flora-fauna motifs (Amru), thick heavy fall and structure.',
    description: 'A spectacular royal indigo blue Banarasi saree made for wedding celebrations. Takes nearly 18 days of continuous double-loom setup to construct.',
    images: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    careInstructions: 'Dry clean only. Do not iron directly on the zari work — use a warm iron underneath a thin protective cotton layer.',
    dateAdded: '2026-07-17T09:15:00Z',
    status: 'Listed',
    languageCreated: 'hi',
    giInfo: {
      status: 'REJECTED',
      productName: 'Banarasi Brocade Silk',
      registrationNumber: 'GI-IN-0028',
      origin: 'Varanasi',
      stateRegion: 'Uttar Pradesh',
      category: 'Handlooms & Textiles',
      verificationDate: '2026-07-20',
      verificationSource: 'Geographical Indications Registry of India (Audit Review)',
      notes: 'Submission rejected: Documentation incomplete. Cooperative affiliation proof could not be verified against the official active GI repository.'
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
      explanation: 'High knot-density Amru floral brocade with genuine silver-gold zari thread requires 96 artisan hours. Based on raw silk yarn index (₹6,800/kg) and master weaver skill benchmark, this piece commands premium heirloom pricing.',
      materialCost: 5200,
      labourHours: 96,
      craftComplexity: 'Masterpiece',
      category: 'Sarees',
      craftType: 'Pit-loom Brocade',
      productionDays: 18,
      isDemo: true,
      generatedAt: '2026-08-01T10:00:00Z'
    }
  },
  {
    id: 'p4',
    title: 'Traditional Kasavu Fine Cotton Mundu Set',
    weaverName: 'Madhavan Unnithan',
    weaverBio: 'Madhavan weaves in the lush backwater village of Chendamangalam. He uses ancient hand-combed cotton techniques to ensure the highest breathability.',
    weaverRegion: 'Chendamangalam, Ernakulam, Kerala',
    weaverImage: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300',
    material: '100% Organic combed cotton, 10% pure zari borders',
    price: 1950,
    dimensions: { length: '4.0 meters', width: '1.2 meters' },
    specialFeatures: 'Fine unbleached ecru color, double layered structure, sleek 2-inch golden border thread.',
    description: 'Perfect wear for religious rituals, festivals, and hot humid weather. Highly lightweight, airy, and soft on the skin.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'
    ],
    careInstructions: 'Gentle hand wash. Starch lightly if a crisp, elegant drape is preferred. Dry under soft morning sunlight.',
    dateAdded: '2026-07-18T10:00:00Z',
    status: 'Listed',
    languageCreated: 'en',
    giInfo: {
      status: 'PENDING',
      productName: 'Chendamangalam Dhoties & Set Mundu',
      registrationNumber: 'GI-IN-0226',
      origin: 'Chendamangalam, Ernakulam District',
      stateRegion: 'Kerala',
      category: 'Textiles',
      verificationDate: 'Pending Verification',
      verificationSource: 'Submitted by Artisan Madhavan Unnithan (Pending Admin Review)',
      submittedAt: '2026-08-05T11:00:00Z'
    }
  }
];

const CATEGORY_IMAGE_SETS: Record<string, string[]> = {
  'Sarees & Textiles': [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600'
  ],
  'Pottery & Ceramics': [
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&q=80&w=600'
  ],
  Jewellery: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'
  ],
  Woodcraft: [
    'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?auto=format&fit=crop&q=80&w=600'
  ],
  'Bamboo & Cane': [
    'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1603787081207-362bcef7c144?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&q=80&w=600'
  ],
  Embroidery: [
    'https://images.unsplash.com/photo-1598731252951-3c0fce0c4d1d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583845112203-454c7b0b9b2a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=600'
  ],
  Metalcraft: [
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=600'
  ],
  'Paintings & Folk Art': [
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=600'
  ],
  Leathercraft: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=600'
  ],
  Handicrafts: [
    'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600'
  ],
  'Home Décor': [
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600'
  ],
  'Other Traditional Crafts': [
    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1544413164-5f1b0f1b0f1b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600'
  ]
};

const CATEGORY_PRODUCT_NAMES: Record<string, string[]> = {
  'Sarees & Textiles': ['Handwoven Chanderi Cotton Saree', 'Natural Indigo Ajrakh Textile', 'Kalamkari Handloom Dupatta', 'Kutch Handwoven Shawl'],
  'Pottery & Ceramics': ['Blue Pottery Serving Bowl', 'Terracotta Water Pot', 'Hand-thrown Ceramic Vase', 'Black Clay Dinner Set'],
  Jewellery: ['Dhokra Brass Necklace', 'Silver Filigree Earrings', 'Kundan Craft Pendant', 'Terracotta Bead Jewellery Set'],
  Woodcraft: ['Sandalwood Carved Box', 'Kashmir Walnut Tray', 'Hand-carved Wooden Elephant', 'Rosewood Utility Stand'],
  'Bamboo & Cane': ['Bamboo Storage Basket', 'Cane Lounge Chair', 'Bamboo Woven Lamp', 'Cane Picnic Hamper'],
  Embroidery: ['Kasuti Embroidered Wall Hanging', 'Phulkari Embroidered Dupatta', 'Kantha Stitch Cushion Cover', 'Chikankari Embroidered Kurta'],
  Metalcraft: ['Bell Metal Serving Thali', 'Bidri Metal Trinket Box', 'Copper Hand-hammered Pot', 'Brass Oil Lamp Set'],
  'Paintings & Folk Art': ['Madhubani Folk Painting', 'Warli Village Scene Painting', 'Pattachitra Story Panel', 'Gond Tree of Life Painting'],
  Leathercraft: ['Vegetable-tanned Leather Journal', 'Kolhapuri Leather Sandals', 'Leather Tool Roll', 'Hand-stitched Leather Sling Bag'],
  Handicrafts: ['Handmade Palm Leaf Sculpture', 'Traditional Paper Mache Mask', 'Clay Festival Figurine', 'Handcrafted Folk Toy Set'],
  'Home Décor': ['Handwoven Wall Basket', 'Traditional Textile Cushion', 'Crafted Brass Candle Holder', 'Block-print Table Runner'],
  'Other Traditional Crafts': ['Lacquered Wooden Toy Set', 'Traditional Hand Fan', 'Stone Carved Figurine', 'Natural Fibre Craft Basket']
};

const CATEGORY_MATERIALS: Record<string, string> = {
  'Sarees & Textiles': 'Handspun cotton and natural dyes',
  'Pottery & Ceramics': 'Local clay and food-safe glaze',
  Jewellery: 'Brass, silver and natural beads',
  Woodcraft: 'Seasoned native hardwood',
  'Bamboo & Cane': 'Sustainably harvested bamboo and cane',
  Embroidery: 'Cotton fabric and silk thread',
  Metalcraft: 'Hand-hammered brass and copper',
  'Paintings & Folk Art': 'Natural pigments on handmade paper',
  Leathercraft: 'Vegetable-tanned leather',
  Handicrafts: 'Natural fibres and locally sourced materials',
  'Home Décor': 'Handwoven cotton and traditional craft materials',
  'Other Traditional Crafts': 'Locally sourced natural craft materials'
};

const CATEGORY_PRODUCT_CATALOG: Product[] = Object.entries(CATEGORY_PRODUCT_NAMES).flatMap(([category, names]) => {
  const images = CATEGORY_IMAGE_SETS[category];
  return names.map((title, index) => ({
    id: `catalog-${category.toLowerCase().replace(/[^a-z]+/g, '-')}-${index + 1}`,
    title,
    category,
    weaverName: `${category} Artisan ${index + 1}`,
    weaverBio: `An independent Indian artisan preserving traditional ${category.toLowerCase()} techniques.`,
    weaverRegion: ['Karnataka', 'Rajasthan', 'Odisha', 'West Bengal'][index],
    weaverImage: MOCK_WEAVER_IMAGES[index % MOCK_WEAVER_IMAGES.length],
    material: CATEGORY_MATERIALS[category],
    price: 1200 + index * 650,
    dimensions: { length: '30 cm', width: '20 cm' },
    specialFeatures: `Handmade ${category.toLowerCase()} with regional motifs and traditional finishing.`,
    description: `A distinctive ${category.toLowerCase()} piece made by hand in small batches for authentic craft lovers.`,
    images: [images[index], images[(index + 1) % images.length]],
    careInstructions: 'Keep dry and store away from direct sunlight. Follow the artisan care instructions supplied with the product.',
    dateAdded: '2026-09-11T10:00:00Z',
    status: 'Listed' as const,
    languageCreated: 'en' as Language
  }));
});

MOCK_PRODUCTS.push(...CATEGORY_PRODUCT_CATALOG);

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    product: MOCK_PRODUCTS[0], // Sharanappa's Ilkal Saree
    buyerName: 'Priya Iyer',
    buyerAddress: 'Flat 402, Shanti Vihar Apartments, Jayanagar 4th Block, Bengaluru, Karnataka',
    orderDate: '2026-07-18T15:45:00Z',
    status: 'Order Received',
    shippingAddress: {
      street: 'Flat 402, Shanti Vihar Apartments, Jayanagar 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560011',
      phone: '+91 98452 11099'
    },
    trackingHistory: [
      {
        status: 'Order Received',
        timestamp: '2026-07-18T15:45:00Z',
        description: 'Order placed successfully by Priya Iyer. Payment verified via UPI.'
      }
    ],
    paymentProtection: {
      isDemo: true,
      label: 'DEMO / SANDBOX',
      orderTotal: 3200,
      paymentSecured: 3200,
      releasedAmount: 640,
      pendingAmount: 2560,
      refundedAmount: 0,
      milestones: [
        {
          id: 'm-o1-1',
          name: 'ORDER CONFIRMED',
          percentage: 20,
          amount: 640,
          status: 'RELEASED',
          releasedAt: '2026-07-18T15:46:00Z',
          transactionId: 'TXN-DEMO-101'
        },
        {
          id: 'm-o1-2',
          name: 'CRAFTING / MAKING',
          percentage: 40,
          amount: 1280,
          status: 'PENDING'
        },
        {
          id: 'm-o1-3',
          name: 'DELIVERED',
          percentage: 40,
          amount: 1280,
          status: 'PENDING'
        }
      ]
    },
    transactionHistory: [
      {
        id: 'tx-101',
        orderId: 'o1',
        type: 'PAYMENT_SECURED',
        amount: 3200,
        status: 'SUCCESS',
        timestamp: '2026-07-18T15:45:00Z',
        description: 'Buyer payment secured in TantuLink Payment Protection Sandbox',
        isDemo: true
      },
      {
        id: 'tx-102',
        orderId: 'o1',
        type: 'MILESTONE_RELEASE',
        amount: 640,
        milestoneName: 'ORDER CONFIRMED',
        status: 'SUCCESS',
        timestamp: '2026-07-18T15:46:00Z',
        description: 'Milestone 1 (20% Order Confirmed) released to artisan account',
        isDemo: true
      }
    ]
  },
  {
    id: 'o2',
    product: {
      ...MOCK_PRODUCTS[1],
      weaverName: 'Annaiah Devanga' // Match weaver profile
    },
    buyerName: 'Jagadish B.', // Match buyer profile
    buyerAddress: 'Indiranagar, Bengaluru, Karnataka - 560038',
    orderDate: '2026-07-10T10:30:00Z',
    status: 'Payment Settled',
    shippingAddress: {
      street: 'Indiranagar, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '+91 98765 43210'
    },
    trackingHistory: [
      {
        status: 'Order Received',
        timestamp: '2026-07-10T10:30:00Z',
        description: 'Order placed successfully. Paid ₹5,800 via UPI.'
      },
      {
        status: 'Accepted',
        timestamp: '2026-07-10T12:00:00Z',
        description: 'Weaver Annaiah Devanga accepted the order.'
      },
      {
        status: 'Quality Checked',
        timestamp: '2026-07-11T09:15:00Z',
        description: 'Quality check passed. Threads trimmed and handloom stamp verified.'
      },
      {
        status: 'Shipped',
        timestamp: '2026-07-11T16:00:00Z',
        description: 'Shipped via Indian Postal Service (IP8892102IN).'
      },
      {
        status: 'Delivered',
        timestamp: '2026-07-14T11:45:00Z',
        description: 'Delivered to buyer Jagadish B. and handloom authenticity verified.'
      },
      {
        status: 'Payment Settled',
        timestamp: '2026-07-15T10:00:00Z',
        description: 'Funds disbursed directly to Annaiah Devanga bank account.'
      }
    ],
    paymentProtection: {
      isDemo: true,
      label: 'DEMO / SANDBOX',
      orderTotal: 5800,
      paymentSecured: 5800,
      releasedAmount: 5800,
      pendingAmount: 0,
      refundedAmount: 0,
      milestones: [
        {
          id: 'm-o2-1',
          name: 'ORDER CONFIRMED',
          percentage: 20,
          amount: 1160,
          status: 'RELEASED',
          releasedAt: '2026-07-10T10:35:00Z',
          transactionId: 'TXN-DEMO-201'
        },
        {
          id: 'm-o2-2',
          name: 'CRAFTING / MAKING',
          percentage: 40,
          amount: 2320,
          status: 'RELEASED',
          releasedAt: '2026-07-11T16:05:00Z',
          transactionId: 'TXN-DEMO-202'
        },
        {
          id: 'm-o2-3',
          name: 'DELIVERED',
          percentage: 40,
          amount: 2320,
          status: 'RELEASED',
          releasedAt: '2026-07-15T10:00:00Z',
          transactionId: 'TXN-DEMO-203'
        }
      ]
    },
    transactionHistory: [
      {
        id: 'tx-201',
        orderId: 'o2',
        type: 'PAYMENT_SECURED',
        amount: 5800,
        status: 'SUCCESS',
        timestamp: '2026-07-10T10:30:00Z',
        description: 'Buyer payment secured in TantuLink Payment Protection Sandbox',
        isDemo: true
      },
      {
        id: 'tx-202',
        orderId: 'o2',
        type: 'MILESTONE_RELEASE',
        amount: 1160,
        milestoneName: 'ORDER CONFIRMED',
        status: 'SUCCESS',
        timestamp: '2026-07-10T10:35:00Z',
        description: 'Milestone 1 (20% Order Confirmed) released to weaver account',
        isDemo: true
      },
      {
        id: 'tx-203',
        orderId: 'o2',
        type: 'MILESTONE_RELEASE',
        amount: 2320,
        milestoneName: 'CRAFTING / MAKING',
        status: 'SUCCESS',
        timestamp: '2026-07-11T16:05:00Z',
        description: 'Milestone 2 (40% Crafting) released upon courier handover',
        isDemo: true
      },
      {
        id: 'tx-204',
        orderId: 'o2',
        type: 'MILESTONE_RELEASE',
        amount: 2320,
        milestoneName: 'DELIVERED',
        status: 'SUCCESS',
        timestamp: '2026-07-15T10:00:00Z',
        description: 'Milestone 3 (40% Delivered) released following 24hr inspection window',
        isDemo: true
      }
    ]
  },
  {
    id: 'o4',
    product: {
      ...MOCK_PRODUCTS[0],
      weaverName: 'Annaiah Devanga'
    },
    buyerName: 'Kavita Nair',
    buyerAddress: 'Flat 12B, Palm Meadows, Whitefield, Bengaluru, Karnataka - 560066',
    orderDate: '2026-07-22T11:00:00Z',
    status: 'Delivered',
    shippingAddress: {
      street: 'Flat 12B, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+91 97411 88200'
    },
    trackingHistory: [
      {
        status: 'Order Received',
        timestamp: '2026-07-22T11:00:00Z',
        description: 'Order placed by Kavita Nair. Payment secured via UPI.'
      },
      {
        status: 'Accepted',
        timestamp: '2026-07-22T14:30:00Z',
        description: 'Weaver acknowledged order.'
      },
      {
        status: 'Quality Checked',
        timestamp: '2026-07-23T10:00:00Z',
        description: 'Pre-dispatch check completed.'
      },
      {
        status: 'Shipped',
        timestamp: '2026-07-23T16:00:00Z',
        description: 'Package in transit via Rural Express.'
      },
      {
        status: 'Delivered',
        timestamp: '2026-07-25T13:00:00Z',
        description: 'Delivered to buyer.'
      }
    ],
    paymentProtection: {
      isDemo: true,
      label: 'DEMO / SANDBOX',
      orderTotal: 3200,
      paymentSecured: 3200,
      releasedAmount: 640,
      pendingAmount: 2560,
      refundedAmount: 0,
      milestones: [
        {
          id: 'm-o4-1',
          name: 'ORDER CONFIRMED',
          percentage: 20,
          amount: 640,
          status: 'RELEASED',
          releasedAt: '2026-07-22T11:05:00Z',
          transactionId: 'TXN-DEMO-401'
        },
        {
          id: 'm-o4-2',
          name: 'CRAFTING / MAKING',
          percentage: 40,
          amount: 1280,
          status: 'PENDING'
        },
        {
          id: 'm-o4-3',
          name: 'DELIVERED',
          percentage: 40,
          amount: 1280,
          status: 'PENDING'
        }
      ]
    },
    dispute: {
      id: 'disp-101',
      status: 'OPEN',
      reason: 'Quality issue',
      description: 'The selvedge border has a small snag near the pallu join, and the weave tension feels loose on the pallu fringe.',
      createdAt: '2026-07-25T14:20:00Z',
      updatedAt: '2026-07-25T14:20:00Z',
      buyerName: 'Kavita Nair'
    },
    transactionHistory: [
      {
        id: 'tx-401',
        orderId: 'o4',
        type: 'PAYMENT_SECURED',
        amount: 3200,
        status: 'SUCCESS',
        timestamp: '2026-07-22T11:00:00Z',
        description: 'Buyer payment secured in TantuLink Payment Protection Sandbox',
        isDemo: true
      },
      {
        id: 'tx-402',
        orderId: 'o4',
        type: 'MILESTONE_RELEASE',
        amount: 640,
        milestoneName: 'ORDER CONFIRMED',
        status: 'SUCCESS',
        timestamp: '2026-07-22T11:05:00Z',
        description: 'Milestone 1 (20% Order Confirmed) released to artisan account',
        isDemo: true
      }
    ]
  },
  {
    id: 'o3',
    product: {
      ...MOCK_PRODUCTS[2],
      weaverName: 'Annaiah Devanga' // Match weaver profile
    },
    buyerName: 'Jagadish B.', // Match buyer profile
    buyerAddress: 'Indiranagar, Bengaluru, Karnataka - 560038',
    orderDate: '2026-07-05T14:15:00Z',
    status: 'Delivered',
    shippingAddress: {
      street: 'Indiranagar, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '+91 98765 43210'
    },
    trackingHistory: [
      {
        status: 'Order Received',
        timestamp: '2026-07-05T14:15:00Z',
        description: 'Order placed successfully. Paid ₹4,200 via UPI.'
      },
      {
        status: 'Accepted',
        timestamp: '2026-07-05T17:30:00Z',
        description: 'Weaver accepted the order and started final detailing.'
      },
      {
        status: 'Quality Checked',
        timestamp: '2026-07-06T11:00:00Z',
        description: 'Quality check completed successfully.'
      },
      {
        status: 'Shipped',
        timestamp: '2026-07-07T14:00:00Z',
        description: 'Shipped via KalaSetu Premium Logistics.'
      },
      {
        status: 'Delivered',
        timestamp: '2026-07-09T17:00:00Z',
        description: 'Delivered safely to destination.'
      }
    ]
  }
];

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    weaverView: 'Artisan Dashboard',
    buyerView: 'Buyer Mode (Customer)',
    languageName: 'English',
    logoSub: 'Artisan-to-Buyer Direct Voice Market',

    weaverDashboard: 'Artisan Dashboard',
    addNewProduct: 'Add New Product',
    earningsSummary: 'My Earnings',
    availableEarnings: 'Available to Withdraw',
    pendingPayments: 'Pending (Hold)',
    completedOrders: 'Completed Orders',
    readEarningsAloud: 'Read earnings aloud',
    myListedProducts: 'My Craft Products',
    incomingOrders: 'Active Orders to Ship',
    markReady: 'Mark Ready for Pickup',
    qcChecklistTitle: 'Pre-Dispatch Quality Check',
    damageCheck: 'I have checked this product for damage, holes or weaving tears.',
    threadsCheck: 'All loose warp/weft threads have been neatly trimmed.',
    stitchingCheck: 'Stitching and borders are fully checked and consistent.',
    qcPhotoUpload: 'Optional: Upload or snap a photo of the packed bundle',
    cancel: 'Cancel',
    submitQc: 'Mark and Confirm Pickup',

    qaTitle: 'Step-by-Step Product Listing',
    microphoneTap: 'Tap Microphone & Speak, or use keyboard',
    typeFallback: 'Prefer to type? Open keyboard below',
    speakInstead: 'Switch back to voice',
    back: 'Go Back',
    next: 'Save & Next',
    confirmListing: 'Listen or Read to Confirm',
    playAudio: '▶ Hear listing summary',
    confirmAndPublish: '✓ Perfect, Publish Now',
    editDetails: '✕ No, Edit Details',

    buyerSearchPlaceholder: 'Describe what you want (e.g., green saree under ₹5,000)...',
    searchTitle: 'Conversational Artisan Search',
    weaverStory: "The Artisan's Story",
    hearWeaverStory: "▶ Hear the artisan's story",
    buyRightPanel: 'Buy Right: Handmade Specs',
    variationDisclaimer: 'Handmade products are unique and may carry very subtle differences from the photo.',
    reviewCheckbox: 'I have reviewed the exact measurements and specifications.',
    buyNow: 'Buy Now',
    checkoutTitle: 'Transparent Direct Checkout',
    priceBreakdown: 'Transparent Pricing Breakdown',
    customerPrice: 'Total Price You Pay',
    logisticsCost: 'Direct Logistics & Rural Courier',
    platformFee: 'KalaSetu Tech Fee (3%)',
    weaverEarnings: 'Artisan Direct Earnings (91%)',
    payWithUpi: 'Pay Instantly with UPI / QR',
    orderConfirmed: 'Order Confirmed!',
    trackStatus: 'Track Order Progress',
    recommendationsTitle: 'More from this craft',
    recommendationsEmpty: 'More products from this category will be available soon.',
    recommendationsWhy: 'Shown because it is the same craft as items you viewed',
    searchNothingFound: "We couldn't find a good match",
    searchNothingFoundHint: 'Try removing a filter or describing what you want differently - we would rather tell you than show something that does not fit.',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to cart',
    cart: 'Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyHint: 'Browse the marketplace and add products you like - they will show up here.',
    cartFromArtisan: 'From',
    cartGrandTotal: 'Grand Total',
    cartProceedToCheckout: 'Proceed to Checkout',
    cartRemove: 'Remove',
    cartOrderSplitNotice: 'Your items are from {n} different artisans. You will get one order reference; we handle payment, tracking, and payout to each artisan separately behind the scenes.',
    orderReference: 'Order Reference',
    shipmentsFromArtisans: 'shipments from different artisans',
    wishlist: 'Wishlist',
    wishlistEmpty: 'Your wishlist is empty',
    wishlistEmptyHint: 'Tap the heart on any product to save it here for later.',
    addToWishlist: 'Save to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    reviews: 'Reviews',
    writeReview: 'Write a Review',
    verifiedPurchase: 'Verified Purchase',
    reviewNeedsPurchase: 'You can review this product after your order is delivered.',
    reviewSubmitted: 'Thank you! Your review has been posted.',
    reportReview: 'Report',
    reviewReportedThanks: 'Thanks - we will look into this review.',
    noReviewsYet: 'No reviews yet',
    noReviewsYetHint: 'This is a newer listing - be the first buyer to leave a verified review.',
    returnOrReplace: 'Return or Replace',
    returnStatus: 'Return Status',
    returnReasonLabel: 'What went wrong?',
    returnNote: 'Tell us more (optional)',
    returnSubmit: 'Submit Return Request',
    returnSubmitted: 'Your return request has been submitted. We will update the status here.',
    returnNotAvailable: 'Returns open once your order is marked Delivered.',
    chatWithArtisan: 'Chat with Artisan',
    chatEmpty: 'No messages yet - ask the artisan a question about your order.',
    chatPlaceholder: 'Type a message...',
    chatSend: 'Send',
    chatReportMessage: 'Report',
    chatReportedThanks: 'Thanks, this message has been reported.',
    chatOffPlatformWarning: 'For your safety, keep payments and contact details inside KalaSetu. This message looks like it may be suggesting a payment or contact outside the app.',
    genericErrorTitle: 'Something did not load correctly',
    genericErrorHint: 'This is usually temporary. Please try again.',
    retry: 'Try Again',
    editProduct: 'Edit',
    duplicateProduct: 'Duplicate',
    saveAsDraft: 'Save as Draft',
    publishProduct: 'Publish',
    unpublishProduct: 'Unpublish',
    archiveProduct: 'Archive',
    statusDraft: 'Draft',
    statusUnpublished: 'Unpublished',
    statusArchived: 'Archived',
    confirmArchive: 'Archive this product? Buyers will no longer see it, but your past orders stay safe.',
    variants: 'Sizes / Colours / Materials',
    addVariant: 'Add an Option',
    variantSize: 'Size',
    variantColor: 'Colour',
    variantMaterial: 'Material',
    variantExtraPrice: 'Extra Price (₹)',
    variantStock: 'How Many in Stock',
    removeVariant: 'Remove',
    discountsAndOffers: 'Discounts & Offers',
    discountPercentLabel: 'Discount (%)',
    saleEndsOn: 'Offer Ends On',
    bulkPricingTiers: 'Bulk Pricing (cheaper for more pieces)',
    addBulkTier: 'Add a Bulk Price',
    bulkMinQty: 'From this many pieces',
    bulkPricePerUnit: 'Price per piece (₹)',
    payoutSettings: 'How You Get Paid',
    payoutMethodLabel: 'Payout Method',
    bankAccountOption: 'Bank Account',
    upiOption: 'UPI',
    payoutSchedule: 'When You Get Paid',
    payoutScheduleText: 'Payouts are released automatically at each order milestone (confirmed, crafted, delivered) directly to your selected method.',
    minPayoutThresholdLabel: 'Minimum Payout Amount',
    provenanceRecord: 'First-Listing Record',
    provenanceRecordedOn: 'Recorded on',
    provenanceExplain: 'This is a timestamped record of your original photos and description. If someone copies your design later, this proves you listed it first.',
    materialCluster: 'Buy Materials Together',
    materialClusterHint: 'Join other artisans nearby to buy raw materials in bulk for a better price.',
    joinClusterRequest: 'Join This Group Buy',
    joinedClusterRequest: 'You have joined this group buy',
    clusterDeadlineLabel: 'Join before',
    clusterTargetLabel: 'Target quantity',
    whatsappIntegration: 'WhatsApp Alerts',
    whatsappNumberLabel: 'Your WhatsApp Number',
    whatsappEnableAlerts: 'Send me order alerts on WhatsApp',
    whatsappComingSoonNote: 'WhatsApp alerts are being set up for KalaSetu and are not live yet. The app is always the full and final place to manage your shop; WhatsApp will be a shortcut for quick alerts once ready.',
    attachProcessVideo: 'Attach a Short Making Video (optional)',
    videoAttachedLabel: 'Video attached',
    aiCameraTitle: 'Smart Photo Helper',
    aiEnhancedBadge: 'AI-Enhanced',
    viewOriginalPhoto: 'Original',
    viewEnhancedPhoto: 'Enhanced',
    photoBlurWarning: 'This photo looks a little blurry. Try holding the camera steady.',
    photoDarkWarning: 'This photo looks a little dark. Try moving to better light.',
    retakePhotoLabel: 'Retake Photo',
    useThisPhotoLabel: 'Use This Photo',
    enhancePhotoLabel: 'Clean Up Background',
    downloadInvoice: 'Download Invoice',
    invoiceTitleLabel: 'Tax Invoice'
  },
  kn: {
    weaverView: 'ಕುಶಲಕರ್ಮಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    buyerView: 'ಖರೀದಿದಾರರ ವಿಭಾಗ (ಗ್ರಾಹಕ)',
    languageName: 'ಕನ್ನಡ',
    logoSub: 'ಕುಶಲಕರ್ಮಿ ಮತ್ತು ಗ್ರಾಹಕರ ನೇರ ಧ್ವನಿ ಮಾರುಕಟ್ಟೆ',

    weaverDashboard: 'ಕುಶಲಕರ್ಮಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    addNewProduct: 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    earningsSummary: 'ನನ್ನ ಗಳಿಕೆ',
    availableEarnings: 'ಹಿಂಪಡೆಯಲು ಲಭ್ಯವಿದೆ',
    pendingPayments: 'ಬಾಕಿ ಇರುವ ಪಾವತಿ',
    completedOrders: 'ಪೂರ್ಣಗೊಂಡ ಆರ್ಡರ್‌ಗಳು',
    readEarningsAloud: 'ಗಳಿಕೆಯನ್ನು ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
    myListedProducts: 'ನನ್ನ ಕರಕುಶಲ ಉತ್ಪನ್ನಗಳು',
    incomingOrders: 'ಕಳುಹಿಸಬೇಕಾದ ಸಕ್ರಿಯ ಆರ್ಡರ್‌ಗಳು',
    markReady: 'ಪಿಕ್-ಅಪ್‌ಗೆ ಸಿದ್ಧ ಎಂದು ಗುರುತಿಸಿ',
    qcChecklistTitle: 'ರವಾನೆಗಿಂತ ಮುಂಚಿನ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ',
    damageCheck: 'ನಾನು ಈ ಉತ್ಪನ್ನದಲ್ಲಿ ಯಾವುದೇ ಹಾನಿ, ರಂಧ್ರಗಳು ಅಥವಾ ಹರಿದ ಭಾಗಗಳಿಲ್ಲ ಎಂದು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ.',
    threadsCheck: 'ಎಲ್ಲಾ ಸಡಿಲವಾದ ದಾರಗಳನ್ನು ಅಚ್ಚುಕಟ್ಟಾಗಿ ಕತ್ತರಿಸಲಾಗಿದೆ.',
    stitchingCheck: 'ಹೊಲಿಗೆ ಮತ್ತು ಬಾರ್ಡರ್‌ಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
    qcPhotoUpload: 'ಐಚ್ಛಿಕ: ಪ್ಯಾಕ್ ಮಾಡಿದ ಬಂಡಲ್‌ನ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submitQc: 'ಗುರುತಿಸಿ ಮತ್ತು ಪಿಕ್-ಅಪ್ ಖಚಿತಪಡಿಸಿ',

    qaTitle: 'ಹಂತ-ಹಂತದ ಉತ್ಪನ್ನ ಪಟ್ಟಿ',
    microphoneTap: 'ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ಮಾತನಾಡಿ, ಅಥವಾ ಕೀಬೋರ್ಡ್ ಬಳಸಿ',
    typeFallback: 'ಟೈಪ್ ಮಾಡಲು ಬಯಸುವಿರಾ? ಕೀಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
    speakInstead: 'ಮತ್ತೆ ಧ್ವನಿಗೆ ಬದಲಿಸಿ',
    back: 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ',
    next: 'ಉಳಿಸಿ ಮತ್ತು ಮುಂದೆ ಹೋಗಿ',
    confirmListing: 'ಖಚಿತಪಡಿಸಲು ಆಲಿಸಿ ಅಥವಾ ಓದಿ',
    playAudio: '▶ ಪಟ್ಟಿಯ ಸಾರಾಂಶವನ್ನು ಆಲಿಸಿ',
    confirmAndPublish: '✓ ಎಲ್ಲವೂ ಸರಿ ಇದೆ, ಪ್ರಕಟಿಸಿ',
    editDetails: '✕ ಇಲ್ಲ, ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ',

    buyerSearchPlaceholder: 'ನಿಮಗೆ ಬೇಕಾದುದನ್ನು ವಿವರಿಸಿ (ಉದಾಹರಣೆಗೆ: ₹೫,೦೦೦ ಒಳಗೆ ಹಸಿರು ಸೀರೆ)...',
    searchTitle: 'ಕುಶಲಕರ್ಮಿ ಉತ್ಪನ್ನ ಹುಡುಕಾಟ',
    weaverStory: 'ಕುಶಲಕರ್ಮಿಯ ಕಥೆ',
    hearWeaverStory: '▶ ಕುಶಲಕರ್ಮಿಯ ಕಥೆಯನ್ನು ಆಲಿಸಿ',
    buyRightPanel: 'ಬೈ ರೈಟ್: ಕೈಮಗ್ಗದ ನಿಖರ ವಿವರಗಳು',
    variationDisclaimer: 'ಕೈಯಿಂದ ತಯಾರಿಸಿದ ಉತ್ಪನ್ನಗಳು ವಿಶಿಷ್ಟವಾಗಿರುತ್ತವೆ ಮತ್ತು ಫೋಟೋಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಭಿನ್ನವಾಗಿರಬಹುದು.',
    reviewCheckbox: 'ನಾನು ನಿಖರ ಅಳತೆಗಳು ಮತ್ತು ವಿಶೇಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ.',
    buyNow: 'ಈಗಲೇ ಖರೀದಿಸಿ',
    checkoutTitle: 'ಪಾರದರ್ಶಕ ನೇರ ಪಾವತಿ',
    priceBreakdown: 'ಪಾರದರ್ಶಕ ಬೆಲೆ ವಿಭಜನೆ',
    customerPrice: 'ನೀವು ಪಾವತಿಸುವ ಒಟ್ಟು ಬೆಲೆ',
    logisticsCost: 'ನೇರ ಸಾರಿಗೆ ಮತ್ತು ಗ್ರಾಮೀಣ ಕೊರಿಯರ್',
    platformFee: 'ಕಲಾಸೇತು ಸೇವಾ ಶುಲ್ಕ (೩%)',
    weaverEarnings: 'ಕುಶಲಕರ್ಮಿಯ ನೇರ ಆದಾಯ (೯೧%)',
    payWithUpi: 'UPI / QR ಮೂಲಕ ತಕ್ಷಣ ಪಾವತಿಸಿ',
    orderConfirmed: 'ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    trackStatus: 'ಆರ್ಡರ್ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    recommendationsTitle: 'ಈ ಕರಕುಶಲ ವರ್ಗದ ಇನ್ನಷ್ಟು ಉತ್ಪನ್ನಗಳು',
    recommendationsEmpty: 'ಈ ವರ್ಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಇನ್ನಷ್ಟು ಉತ್ಪನ್ನಗಳು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿವೆ.',
    recommendationsWhy: 'ನೀವು ನೋಡಿದ ಉತ್ಪನ್ನಗಳ ಅದೇ ಕರಕುಶಲ ವರ್ಗದ್ದು ಆದ್ದರಿಂದ ತೋರಿಸಲಾಗಿದೆ',
    searchNothingFound: 'ಸೂಕ್ತ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ',
    searchNothingFoundHint: 'ಫಿಲ್ಟರ್ ತೆಗೆದುಹಾಕಿ ಅಥವಾ ಬೇರೆ ರೀತಿಯಲ್ಲಿ ವಿವರಿಸಿ ಪ್ರಯತ್ನಿಸಿ - ಹೊಂದಿಕೆಯಾಗದ್ದನ್ನು ತೋರಿಸುವ ಬದಲು ನಿಮಗೆ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸುತ್ತೇವೆ.',
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    addedToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ',
    cart: 'ಕಾರ್ಟ್',
    cartEmpty: 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ',
    cartEmptyHint: 'ಮಾರುಕಟ್ಟೆ ಬ್ರೌಸ್ ಮಾಡಿ ಮತ್ತು ನಿಮಗೆ ಇಷ್ಟವಾದ ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಿ - ಅವು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    cartFromArtisan: 'ಇವರಿಂದ',
    cartGrandTotal: 'ಒಟ್ಟು ಮೊತ್ತ',
    cartProceedToCheckout: 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ',
    cartRemove: 'ತೆಗೆದುಹಾಕಿ',
    cartOrderSplitNotice: 'ನಿಮ್ಮ ವಸ್ತುಗಳು {n} ವಿಭಿನ್ನ ಕುಶಲಕರ್ಮಿಗಳಿಂದ ಬಂದಿವೆ. ನಿಮಗೆ ಒಂದೇ ಆರ್ಡರ್ ಉಲ್ಲೇಖ ಸಿಗುತ್ತದೆ; ಪಾವತಿ, ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಪ್ರತಿ ಕುಶಲಕರ್ಮಿಗೆ ಪಾವತಿಯನ್ನು ನಾವು ಪ್ರತ್ಯೇಕವಾಗಿ ನಿರ್ವಹಿಸುತ್ತೇವೆ.',
    orderReference: 'ಆರ್ಡರ್ ಉಲ್ಲೇಖ',
    shipmentsFromArtisans: 'ವಿಭಿನ್ನ ಕುಶಲಕರ್ಮಿಗಳಿಂದ ಸಾಗಣೆಗಳು',
    wishlist: 'ವಿಶ್ಲಿಸ್ಟ್',
    wishlistEmpty: 'ನಿಮ್ಮ ವಿಶ್ಲಿಸ್ಟ್ ಖಾಲಿಯಾಗಿದೆ',
    wishlistEmptyHint: 'ಯಾವುದೇ ಉತ್ಪನ್ನದಲ್ಲಿ ಹೃದಯ ಐಕಾನ್ ಒತ್ತಿ ನಂತರ ನೋಡಲು ಇಲ್ಲಿ ಉಳಿಸಿ.',
    addToWishlist: 'ವಿಶ್ಲಿಸ್ಟ್‌ಗೆ ಉಳಿಸಿ',
    removeFromWishlist: 'ವಿಶ್ಲಿಸ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಿ',
    reviews: 'ವಿಮರ್ಶೆಗಳು',
    writeReview: 'ವಿಮರ್ಶೆ ಬರೆಯಿರಿ',
    verifiedPurchase: 'ಪರಿಶೀಲಿತ ಖರೀದಿ',
    reviewNeedsPurchase: 'ನಿಮ್ಮ ಆರ್ಡರ್ ವಿತರಣೆಯಾದ ನಂತರ ನೀವು ಈ ಉತ್ಪನ್ನವನ್ನು ವಿಮರ್ಶಿಸಬಹುದು.',
    reviewSubmitted: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿಮರ್ಶೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
    reportReview: 'ವರದಿ ಮಾಡಿ',
    reviewReportedThanks: 'ಧನ್ಯವಾದಗಳು - ನಾವು ಈ ವಿಮರ್ಶೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತೇವೆ.',
    noReviewsYet: 'ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ',
    noReviewsYetHint: 'ಇದು ಹೊಸ ಪಟ್ಟಿ - ಪರಿಶೀಲಿತ ವಿಮರ್ಶೆ ನೀಡುವ ಮೊದಲ ಖರೀದಿದಾರರಾಗಿರಿ.',
    returnOrReplace: 'ಹಿಂತಿರುಗಿಸಿ ಅಥವಾ ಬದಲಾಯಿಸಿ',
    returnStatus: 'ಹಿಂತಿರುಗಿಸುವಿಕೆಯ ಸ್ಥಿತಿ',
    returnReasonLabel: 'ಏನು ತಪ್ಪಾಯಿತು?',
    returnNote: 'ಹೆಚ್ಚಿನ ವಿವರ (ಐಚ್ಛಿಕ)',
    returnSubmit: 'ಹಿಂತಿರುಗಿಸುವಿಕೆ ವಿನಂತಿ ಸಲ್ಲಿಸಿ',
    returnSubmitted: 'ನಿಮ್ಮ ಹಿಂತಿರುಗಿಸುವಿಕೆ ವಿನಂತಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಾವು ಸ್ಥಿತಿಯನ್ನು ಇಲ್ಲಿ ನವೀಕರಿಸುತ್ತೇವೆ.',
    returnNotAvailable: 'ನಿಮ್ಮ ಆರ್ಡರ್ ವಿತರಣೆಯಾದ ಎಂದು ಗುರುತಿಸಿದ ನಂತರ ಹಿಂತಿರುಗಿಸುವಿಕೆ ತೆರೆಯುತ್ತದೆ.',
    chatWithArtisan: 'ಕುಶಲಕರ್ಮಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ',
    chatEmpty: 'ಇನ್ನೂ ಸಂದೇಶಗಳಿಲ್ಲ - ನಿಮ್ಮ ಆರ್ಡರ್ ಬಗ್ಗೆ ಕುಶಲಕರ್ಮಿಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
    chatPlaceholder: 'ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ...',
    chatSend: 'ಕಳುಹಿಸಿ',
    chatReportMessage: 'ವರದಿ ಮಾಡಿ',
    chatReportedThanks: 'ಧನ್ಯವಾದಗಳು, ಈ ಸಂದೇಶವನ್ನು ವರದಿ ಮಾಡಲಾಗಿದೆ.',
    chatOffPlatformWarning: 'ನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ, ಪಾವತಿ ಮತ್ತು ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಕಲಾಸೇತು ಒಳಗೆ ಇರಿಸಿ. ಈ ಸಂದೇಶ ಆ್ಯಪ್‌ನ ಹೊರಗೆ ಪಾವತಿ ಅಥವಾ ಸಂಪರ್ಕ ಸೂಚಿಸುತ್ತಿರಬಹುದು.',
    genericErrorTitle: 'ಏನೋ ಸರಿಯಾಗಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ',
    genericErrorHint: 'ಇದು ಸಾಮಾನ್ಯವಾಗಿ ತಾತ್ಕಾಲಿಕ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    editProduct: 'ತಿದ್ದುಪಡಿ',
    duplicateProduct: 'ನಕಲು ಮಾಡಿ',
    saveAsDraft: 'ಡ್ರಾಫ್ಟ್ ಆಗಿ ಉಳಿಸಿ',
    publishProduct: 'ಪ್ರಕಟಿಸಿ',
    unpublishProduct: 'ಪ್ರಕಟಣೆ ರದ್ದುಮಾಡಿ',
    archiveProduct: 'ಆರ್ಕೈವ್ ಮಾಡಿ',
    statusDraft: 'ಡ್ರಾಫ್ಟ್',
    statusUnpublished: 'ಪ್ರಕಟಿಸಿಲ್ಲ',
    statusArchived: 'ಆರ್ಕೈವ್ ಮಾಡಲಾಗಿದೆ',
    confirmArchive: 'ಈ ಉತ್ಪನ್ನವನ್ನು ಆರ್ಕೈವ್ ಮಾಡುವುದೇ? ಖರೀದಿದಾರರಿಗೆ ಇನ್ನು ಕಾಣುವುದಿಲ್ಲ, ಆದರೆ ಹಳೆಯ ಆರ್ಡರ್‌ಗಳು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
    variants: 'ಗಾತ್ರ / ಬಣ್ಣ / ವಸ್ತು',
    addVariant: 'ಆಯ್ಕೆ ಸೇರಿಸಿ',
    variantSize: 'ಗಾತ್ರ',
    variantColor: 'ಬಣ್ಣ',
    variantMaterial: 'ವಸ್ತು',
    variantExtraPrice: 'ಹೆಚ್ಚುವರಿ ಬೆಲೆ (₹)',
    variantStock: 'ಎಷ್ಟು ಸ್ಟಾಕ್ ಇದೆ',
    removeVariant: 'ತೆಗೆದುಹಾಕಿ',
    discountsAndOffers: 'ರಿಯಾಯಿತಿ ಮತ್ತು ಆಫರ್‌ಗಳು',
    discountPercentLabel: 'ರಿಯಾಯಿತಿ (%)',
    saleEndsOn: 'ಆಫರ್ ಮುಗಿಯುವ ದಿನಾಂಕ',
    bulkPricingTiers: 'ಸಗಟು ಬೆಲೆ (ಹೆಚ್ಚು ತೆಗೆದುಕೊಂಡರೆ ಅಗ್ಗ)',
    addBulkTier: 'ಸಗಟು ಬೆಲೆ ಸೇರಿಸಿ',
    bulkMinQty: 'ಇಷ್ಟು ತುಣುಕುಗಳಿಂದ',
    bulkPricePerUnit: 'ಪ್ರತಿ ತುಣುಕಿನ ಬೆಲೆ (₹)',
    payoutSettings: 'ನಿಮಗೆ ಪಾವತಿ ಹೇಗೆ ಸಿಗುತ್ತದೆ',
    payoutMethodLabel: 'ಪಾವತಿ ವಿಧಾನ',
    bankAccountOption: 'ಬ್ಯಾಂಕ್ ಖಾತೆ',
    upiOption: 'UPI',
    payoutSchedule: 'ನಿಮಗೆ ಯಾವಾಗ ಪಾವತಿಯಾಗುತ್ತದೆ',
    payoutScheduleText: 'ಪ್ರತಿ ಆರ್ಡರ್ ಹಂತದಲ್ಲಿ (ದೃಢೀಕರಣ, ತಯಾರಿಕೆ, ವಿತರಣೆ) ಪಾವತಿ ನಿಮ್ಮ ಆಯ್ಕೆಯ ವಿಧಾನಕ್ಕೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ.',
    minPayoutThresholdLabel: 'ಕನಿಷ್ಠ ಪಾವತಿ ಮೊತ್ತ',
    provenanceRecord: 'ಮೊದಲ-ಪಟ್ಟಿ ದಾಖಲೆ',
    provenanceRecordedOn: 'ದಾಖಲಿಸಿದ ದಿನಾಂಕ',
    provenanceExplain: 'ಇದು ನಿಮ್ಮ ಮೂಲ ಫೋಟೋ ಮತ್ತು ವಿವರಣೆಯ ಸಮಯ-ಮುದ್ರಿತ ದಾಖಲೆ. ಯಾರಾದರೂ ನಂತರ ನಿಮ್ಮ ವಿನ್ಯಾಸ ನಕಲಿಸಿದರೆ, ಇದು ನೀವು ಮೊದಲು ಪಟ್ಟಿ ಮಾಡಿದ್ದನ್ನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ.',
    materialCluster: 'ಒಟ್ಟಿಗೆ ವಸ್ತು ಖರೀದಿಸಿ',
    materialClusterHint: 'ಉತ್ತಮ ಬೆಲೆಗೆ ಸಗಟು ಕಚ್ಚಾ ವಸ್ತು ಖರೀದಿಸಲು ಹತ್ತಿರದ ಇತರ ಕುಶಲಕರ್ಮಿಗಳೊಂದಿಗೆ ಸೇರಿ.',
    joinClusterRequest: 'ಈ ಗುಂಪು ಖರೀದಿಗೆ ಸೇರಿ',
    joinedClusterRequest: 'ನೀವು ಈ ಗುಂಪು ಖರೀದಿಗೆ ಸೇರಿದ್ದೀರಿ',
    clusterDeadlineLabel: 'ಇದಕ್ಕೂ ಮೊದಲು ಸೇರಿ',
    clusterTargetLabel: 'ಗುರಿ ಪ್ರಮಾಣ',
    whatsappIntegration: 'WhatsApp ಎಚ್ಚರಿಕೆಗಳು',
    whatsappNumberLabel: 'ನಿಮ್ಮ WhatsApp ಸಂಖ್ಯೆ',
    whatsappEnableAlerts: 'ಆರ್ಡರ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು WhatsApp ನಲ್ಲಿ ಕಳುಹಿಸಿ',
    whatsappComingSoonNote: 'KalaSetu ಗಾಗಿ WhatsApp ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ, ಇನ್ನೂ ಲೈವ್ ಆಗಿಲ್ಲ. ನಿಮ್ಮ ಅಂಗಡಿ ನಿರ್ವಹಿಸಲು ಆ್ಯಪ್ ಯಾವಾಗಲೂ ಸಂಪೂರ್ಣ ಸ್ಥಳ; WhatsApp ಸಿದ್ಧವಾದಾಗ ತ್ವರಿತ ಎಚ್ಚರಿಕೆಗಳಿಗೆ ಸಹಾಯಕವಾಗುತ್ತದೆ.',
    attachProcessVideo: 'ಸಣ್ಣ ತಯಾರಿಕೆ ವೀಡಿಯೊ ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)',
    videoAttachedLabel: 'ವೀಡಿಯೊ ಸೇರಿಸಲಾಗಿದೆ',
    aiCameraTitle: 'ಸ್ಮಾರ್ಟ್ ಫೋಟೋ ಸಹಾಯಕ',
    aiEnhancedBadge: 'AI-ವರ್ಧಿತ',
    viewOriginalPhoto: 'ಮೂಲ',
    viewEnhancedPhoto: 'ವರ್ಧಿತ',
    photoBlurWarning: 'ಈ ಫೋಟೋ ಸ್ವಲ್ಪ ಮಸುಕಾಗಿ ಕಾಣುತ್ತದೆ. ಕ್ಯಾಮೆರಾವನ್ನು ಸ್ಥಿರವಾಗಿ ಹಿಡಿಯಲು ಪ್ರಯತ್ನಿಸಿ.',
    photoDarkWarning: 'ಈ ಫೋಟೋ ಸ್ವಲ್ಪ ಕತ್ತಲಾಗಿ ಕಾಣುತ್ತದೆ. ಉತ್ತಮ ಬೆಳಕಿಗೆ ಹೋಗಿ ಪ್ರಯತ್ನಿಸಿ.',
    retakePhotoLabel: 'ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    useThisPhotoLabel: 'ಈ ಫೋಟೋ ಬಳಸಿ',
    enhancePhotoLabel: 'ಹಿನ್ನೆಲೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ',
    downloadInvoice: 'ಇನ್‌ವಾಯ್ಸ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    invoiceTitleLabel: 'ತೆರಿಗೆ ಇನ್‌ವಾಯ್ಸ್'
  },
  hi: {
    weaverView: 'कारीगर डैशबोर्ड',
    buyerView: 'खरीदार मोड (ग्राहक)',
    languageName: 'हिन्दी',
    logoSub: 'कारीगर-से-खरीदार सीधा वॉयस मार्केटप्लेस',

    weaverDashboard: 'कारीगर डैशबोर्ड',
    addNewProduct: 'नया उत्पाद जोड़ें',
    earningsSummary: 'मेरी कमाई',
    availableEarnings: 'निकासी के लिए उपलब्ध',
    pendingPayments: 'होल्ड पर भुगतान',
    completedOrders: 'पूरे हुए ऑर्डर',
    readEarningsAloud: 'कमाई बोलकर सुनें',
    myListedProducts: 'मेरे हस्तशिल्प उत्पाद',
    incomingOrders: 'शिपिंग के लिए सक्रिय ऑर्डर',
    markReady: 'पिकअप के लिए तैयार चिह्नित करें',
    qcChecklistTitle: 'डिस्पैच से पहले गुणवत्ता जांच',
    damageCheck: 'मैंने उत्पाद की अच्छी तरह जांच कर ली है; कोई टूट-फूट या दोष नहीं है।',
    threadsCheck: 'सभी अतिरिक्त और ढीले धागे काटकर साफ कर दिए गए हैं।',
    stitchingCheck: 'सिलाई और किनारे पूरी तरह से सही और सुसंगत हैं।',
    qcPhotoUpload: 'वैकल्पिक: पैक किए गए बंडल की फोटो अपलोड करें',
    cancel: 'रद्द करें',
    submitQc: 'पिकअप की पुष्टि करें',

    qaTitle: 'कदम-दर-कदम उत्पाद प्रविष्टि',
    microphoneTap: 'माइक दबाकर बोलें, या कीबोर्ड का प्रयोग करें',
    typeFallback: 'लिखना चाहते हैं? नीचे कीबोर्ड खोलें',
    speakInstead: 'वापस वॉयस पर जाएं',
    back: 'पीछे जाएं',
    next: 'सहेजें और आगे बढ़ें',
    confirmListing: 'पुष्टि के लिए सुनें या पढ़ें',
    playAudio: '▶ विवरण बोलकर सुनें',
    confirmAndPublish: '✓ बिल्कुल सही है, अभी प्रकाशित करें',
    editDetails: '✕ नहीं, सुधार करें',

    buyerSearchPlaceholder: 'आपको क्या चाहिए? (जैसे: ₹5,000 के अंदर हरी साड़ी)...',
    searchTitle: 'कारीगर उत्पाद खोज',
    weaverStory: 'कारीगर की कहानी',
    hearWeaverStory: '▶ कारीगर की कहानी सुनें',
    buyRightPanel: 'बाय राइट: हस्तनिर्मित विवरण',
    variationDisclaimer: 'हथकरघा उत्पाद अद्वितीय होते हैं, रंग या बनावट में मामूली अंतर संभव है।',
    reviewCheckbox: 'मैंने उत्पाद के सटीक माप और विवरणों की समीक्षा कर ली है।',
    buyNow: 'अभी खरीदें',
    checkoutTitle: 'पारदर्शी डायरेक्ट चेकआउट',
    priceBreakdown: 'पारदर्शी मूल्य विभाजन',
    customerPrice: 'आपके द्वारा भुगतान की जाने वाली राशि',
    logisticsCost: 'सीधा परिवहन और ग्रामीण कूरियर',
    platformFee: 'कलासेतु सेवा शुल्क (3%)',
    weaverEarnings: 'कारीगर की सीधी कमाई (91%)',
    payWithUpi: 'UPI / QR द्वारा तुरंत भुगतान करें',
    orderConfirmed: 'ऑर्डर की पुष्टि हो गई!',
    trackStatus: 'ऑर्डर ट्रैकिंग',
    recommendationsTitle: 'इस शिल्प श्रेणी के और उत्पाद',
    recommendationsEmpty: 'इस श्रेणी से जुड़े और उत्पाद जल्द उपलब्ध होंगे।',
    recommendationsWhy: 'आपने देखी गई वस्तुओं जैसी ही शिल्प श्रेणी की वजह से दिखाया गया',
    searchNothingFound: 'हमें अच्छा मेल नहीं मिला',
    searchNothingFoundHint: 'कोई फ़िल्टर हटाकर देखें या अलग तरीके से बताएं - हम गलत चीज़ दिखाने के बजाय आपको साफ़ बता देना बेहतर समझते हैं।',
    addToCart: 'कार्ट में जोड़ें',
    addedToCart: 'कार्ट में जोड़ा गया',
    cart: 'कार्ट',
    cartEmpty: 'आपका कार्ट खाली है',
    cartEmptyHint: 'बाज़ार देखें और पसंदीदा उत्पाद जोड़ें - वे यहाँ दिखेंगे।',
    cartFromArtisan: 'द्वारा',
    cartGrandTotal: 'कुल राशि',
    cartProceedToCheckout: 'चेकआउट पर जाएं',
    cartRemove: 'हटाएं',
    cartOrderSplitNotice: 'आपकी वस्तुएं {n} अलग-अलग कारीगरों की हैं। आपको एक ही ऑर्डर संदर्भ मिलेगा; भुगतान, ट्रैकिंग और हर कारीगर को भुगतान हम अलग-अलग संभालते हैं।',
    orderReference: 'ऑर्डर संदर्भ',
    shipmentsFromArtisans: 'अलग-अलग कारीगरों से शिपमेंट',
    wishlist: 'विशलिस्ट',
    wishlistEmpty: 'आपकी विशलिस्ट खाली है',
    wishlistEmptyHint: 'किसी भी उत्पाद पर दिल आइकन दबाएं ताकि उसे बाद के लिए यहाँ सहेजा जा सके।',
    addToWishlist: 'विशलिस्ट में सहेजें',
    removeFromWishlist: 'विशलिस्ट से हटाएं',
    reviews: 'समीक्षाएं',
    writeReview: 'समीक्षा लिखें',
    verifiedPurchase: 'सत्यापित खरीद',
    reviewNeedsPurchase: 'आपका ऑर्डर डिलीवर होने के बाद आप इस उत्पाद की समीक्षा कर सकते हैं।',
    reviewSubmitted: 'धन्यवाद! आपकी समीक्षा प्रकाशित कर दी गई है।',
    reportReview: 'रिपोर्ट करें',
    reviewReportedThanks: 'धन्यवाद - हम इस समीक्षा की जांच करेंगे।',
    noReviewsYet: 'अभी तक कोई समीक्षा नहीं',
    noReviewsYetHint: 'यह एक नई लिस्टिंग है - सत्यापित समीक्षा देने वाले पहले खरीदार बनें।',
    returnOrReplace: 'वापस करें या बदलें',
    returnStatus: 'वापसी की स्थिति',
    returnReasonLabel: 'क्या गलत हुआ?',
    returnNote: 'अधिक बताएं (वैकल्पिक)',
    returnSubmit: 'वापसी अनुरोध भेजें',
    returnSubmitted: 'आपका वापसी अनुरोध भेज दिया गया है। हम स्थिति यहां अपडेट करेंगे।',
    returnNotAvailable: 'आपका ऑर्डर डिलीवर के रूप में चिह्नित होने पर वापसी खुलती है।',
    chatWithArtisan: 'कारीगर से चैट करें',
    chatEmpty: 'अभी तक कोई संदेश नहीं - अपने ऑर्डर के बारे में कारीगर से पूछें।',
    chatPlaceholder: 'संदेश लिखें...',
    chatSend: 'भेजें',
    chatReportMessage: 'रिपोर्ट करें',
    chatReportedThanks: 'धन्यवाद, इस संदेश की रिपोर्ट कर दी गई है।',
    chatOffPlatformWarning: 'अपनी सुरक्षा के लिए, भुगतान और संपर्क विवरण कलासेतु के भीतर ही रखें। यह संदेश ऐप के बाहर भुगतान या संपर्क का सुझाव दे रहा लगता है।',
    genericErrorTitle: 'कुछ सही से लोड नहीं हुआ',
    genericErrorHint: 'यह आमतौर पर अस्थायी होता है। कृपया फिर से प्रयास करें।',
    retry: 'फिर से प्रयास करें',
    editProduct: 'बदलें',
    duplicateProduct: 'डुप्लीकेट करें',
    saveAsDraft: 'ड्राफ्ट के रूप में सहेजें',
    publishProduct: 'प्रकाशित करें',
    unpublishProduct: 'प्रकाशन रद्द करें',
    archiveProduct: 'आर्काइव करें',
    statusDraft: 'ड्राफ्ट',
    statusUnpublished: 'अप्रकाशित',
    statusArchived: 'आर्काइव किया गया',
    confirmArchive: 'इस उत्पाद को आर्काइव करें? खरीदार अब इसे नहीं देखेंगे, लेकिन आपके पुराने ऑर्डर सुरक्षित रहेंगे।',
    variants: 'साइज़ / रंग / सामग्री',
    addVariant: 'विकल्प जोड़ें',
    variantSize: 'साइज़',
    variantColor: 'रंग',
    variantMaterial: 'सामग्री',
    variantExtraPrice: 'अतिरिक्त कीमत (₹)',
    variantStock: 'स्टॉक में कितने हैं',
    removeVariant: 'हटाएं',
    discountsAndOffers: 'छूट और ऑफर',
    discountPercentLabel: 'छूट (%)',
    saleEndsOn: 'ऑफर खत्म होने की तारीख',
    bulkPricingTiers: 'थोक कीमत (ज्यादा लेने पर सस्ता)',
    addBulkTier: 'थोक कीमत जोड़ें',
    bulkMinQty: 'इतने टुकड़ों से',
    bulkPricePerUnit: 'प्रति टुकड़ा कीमत (₹)',
    payoutSettings: 'आपको भुगतान कैसे मिलता है',
    payoutMethodLabel: 'भुगतान तरीका',
    bankAccountOption: 'बैंक खाता',
    upiOption: 'UPI',
    payoutSchedule: 'आपको भुगतान कब मिलता है',
    payoutScheduleText: 'हर ऑर्डर चरण (पुष्टि, निर्माण, डिलीवरी) पर भुगतान अपने आप आपके चुने हुए तरीके से जारी होता है।',
    minPayoutThresholdLabel: 'न्यूनतम भुगतान राशि',
    provenanceRecord: 'पहली-सूची रिकॉर्ड',
    provenanceRecordedOn: 'दर्ज तारीख',
    provenanceExplain: 'यह आपकी मूल तस्वीरों और विवरण का समय-मुद्रित रिकॉर्ड है। अगर बाद में कोई आपका डिज़ाइन कॉपी करता है, तो यह साबित करता है कि आपने पहले सूचीबद्ध किया था।',
    materialCluster: 'साथ मिलकर सामग्री खरीदें',
    materialClusterHint: 'बेहतर कीमत के लिए पास के अन्य कारीगरों के साथ मिलकर कच्ची सामग्री थोक में खरीदें।',
    joinClusterRequest: 'इस समूह खरीद में शामिल हों',
    joinedClusterRequest: 'आप इस समूह खरीद में शामिल हो चुके हैं',
    clusterDeadlineLabel: 'इससे पहले शामिल हों',
    clusterTargetLabel: 'लक्ष्य मात्रा',
    whatsappIntegration: 'WhatsApp सूचनाएं',
    whatsappNumberLabel: 'आपका WhatsApp नंबर',
    whatsappEnableAlerts: 'मुझे ऑर्डर सूचनाएं WhatsApp पर भेजें',
    whatsappComingSoonNote: 'KalaSetu के लिए WhatsApp सूचनाएं तैयार की जा रही हैं और अभी लाइव नहीं हैं। आपकी दुकान संभालने के लिए ऐप हमेशा पूरी और अंतिम जगह है; तैयार होने पर WhatsApp त्वरित सूचनाओं के लिए एक शॉर्टकट होगा।',
    attachProcessVideo: 'छोटा निर्माण वीडियो जोड़ें (वैकल्पिक)',
    videoAttachedLabel: 'वीडियो जोड़ा गया',
    aiCameraTitle: 'स्मार्ट फोटो सहायक',
    aiEnhancedBadge: 'AI-संवर्धित',
    viewOriginalPhoto: 'मूल',
    viewEnhancedPhoto: 'संवर्धित',
    photoBlurWarning: 'यह फोटो थोड़ी धुंधली लग रही है। कैमरा स्थिर पकड़ने की कोशिश करें।',
    photoDarkWarning: 'यह फोटो थोड़ी अंधेरी लग रही है। बेहतर रोशनी में जाने की कोशिश करें।',
    retakePhotoLabel: 'फिर से फोटो लें',
    useThisPhotoLabel: 'यह फोटो इस्तेमाल करें',
    enhancePhotoLabel: 'बैकग्राउंड साफ करें',
    downloadInvoice: 'इनवॉइस डाउनलोड करें',
    invoiceTitleLabel: 'टैक्स इनवॉइस'
  },
  as: {
    weaverView: 'শিল্পী ডেছব’ৰ্ড',
    buyerView: 'ক্ৰেতা মোড (গ্ৰাহক)',
    languageName: 'অসমীয়া',
    logoSub: 'শিল্পী-ৰ পৰা ক্ৰেতালৈ পোনপটীয়া কণ্ঠধ্বনি বজাৰ',
    weaverDashboard: 'শিল্পী ডেছব’ৰ্ড',
    addNewProduct: 'নতুন সামগ্ৰী যোগ কৰক',
    earningsSummary: 'মোৰ উপাৰ্জন',
    availableEarnings: 'উলিয়াবলৈ উপলব্ধ',
    pendingPayments: 'বাকী থকা (হ’ল্ড)',
    completedOrders: 'সম্পূৰ্ণ হোৱা অৰ্ডাৰ',
    readEarningsAloud: 'উপাৰ্জন উচ্চস্বৰে পঢ়ক',
    myListedProducts: 'মোৰ শিল্পসামগ্ৰী',
    incomingOrders: 'পঠিয়াবলগীয়া সক্ৰিয় অৰ্ডাৰ',
    markReady: 'পিকআপৰ বাবে সাজু বুলি চিহ্নিত কৰক',
    qcChecklistTitle: 'প্ৰেৰণৰ আগৰ গুণাগুণ পৰীক্ষা',
    damageCheck: 'মই এই সামগ্ৰীটোত কোনো ক্ষতি বা ফুটা নাই বুলি পৰীক্ষা কৰিছোঁ।',
    threadsCheck: 'সকলো লেৰেলা সুতা পৰিপাটিকৈ কাটি দিয়া হৈছে।',
    stitchingCheck: 'চিলাই আৰু পাৰ সম্পূৰ্ণৰূপে পৰীক্ষা কৰা হৈছে।',
    qcPhotoUpload: 'ঐচ্ছিক: পেক কৰা বাণ্ডলৰ ফটো আপল’ড কৰক',
    cancel: 'বাতিল কৰক',
    submitQc: 'চিহ্নিত কৰক আৰু পিকআপ নিশ্চিত কৰক',
    qaTitle: 'পদক্ষেপ-অনুসৰি সামগ্ৰী তালিকাভুক্তি',
    microphoneTap: 'মাইক্ৰ’ফ’ন টিপি কথা কওক, বা কীব’ৰ্ড ব্যৱহাৰ কৰক',
    typeFallback: 'টাইপ কৰিব বিচাৰে? তলৰ কীব’ৰ্ড খোলক',
    speakInstead: 'পুনৰ কণ্ঠধ্বনিলৈ যাওক',
    back: 'উভতি যাওক',
    next: 'সংৰক্ষণ কৰক আৰু পৰৱৰ্তী',
    confirmListing: 'নিশ্চিত কৰিবলৈ শুনক বা পঢ়ক',
    playAudio: '▶ তালিকাৰ সাৰাংশ শুনক',
    confirmAndPublish: '✓ ঠিক আছে, এতিয়াই প্ৰকাশ কৰক',
    editDetails: '✕ নহয়, বিৱৰণ সম্পাদনা কৰক',
    buyerSearchPlaceholder: 'আপুনি কি বিচাৰে বৰ্ণনা কৰক (যেনে: ₹৫,০০০ৰ তলৰ সেউজীয়া শাৰী)...',
    searchTitle: 'শিল্পী সামগ্ৰী সন্ধান',
    weaverStory: 'শিল্পীৰ কাহিনী',
    hearWeaverStory: '▶ শিল্পীৰ কাহিনী শুনক',
    buyRightPanel: 'সঠিকভাৱে কিনক: হস্তনিৰ্মিত বিৱৰণ',
    variationDisclaimer: 'হাতেৰে বনোৱা সামগ্ৰী অনন্য, ফটোৰ পৰা সামান্য পাৰ্থক্য থাকিব পাৰে।',
    reviewCheckbox: 'মই সঠিক জোখ-মাখ আৰু বিৱৰণ পৰ্যালোচনা কৰিছোঁ।',
    buyNow: 'এতিয়াই কিনক',
    checkoutTitle: 'স্বচ্ছ পোনপটীয়া চেকআউট',
    priceBreakdown: 'স্বচ্ছ মূল্য বিভাজন',
    customerPrice: 'আপুনি পৰিশোধ কৰা মুঠ মূল্য',
    logisticsCost: 'পোনপটীয়া পৰিবহণ আৰু গ্ৰাম্য কুৰিয়াৰ',
    platformFee: 'কলাসেতু সেৱা মাচুল (৩%)',
    weaverEarnings: 'শিল্পীৰ পোনপটীয়া উপাৰ্জন (৯১%)',
    payWithUpi: 'UPI / QR ৰে তৎক্ষণাৎ পৰিশোধ কৰক',
    orderConfirmed: 'অৰ্ডাৰ নিশ্চিত কৰা হ’ল!',
    trackStatus: 'অৰ্ডাৰৰ অগ্ৰগতি ট্ৰেক কৰক',
    recommendationsTitle: 'এই শিল্পৰ পৰা আৰু অধিক',
    recommendationsEmpty: 'এই শ্ৰেণীৰ অধিক সামগ্ৰী সোনকালে উপলব্ধ হ’ব।'
  },
  bn: {
    weaverView: 'শিল্পী ড্যাশবোর্ড',
    buyerView: 'ক্রেতা মোড (গ্রাহক)',
    languageName: 'বাংলা',
    logoSub: 'শিল্পী থেকে ক্রেতা সরাসরি ভয়েস মার্কেট',
    weaverDashboard: 'শিল্পী ড্যাশবোর্ড',
    addNewProduct: 'নতুন পণ্য যোগ করুন',
    earningsSummary: 'আমার আয়',
    availableEarnings: 'উত্তোলনের জন্য উপলব্ধ',
    pendingPayments: 'অপেক্ষমাণ (হোল্ড)',
    completedOrders: 'সম্পন্ন অর্ডার',
    readEarningsAloud: 'আয় জোরে পড়ুন',
    myListedProducts: 'আমার হস্তশিল্প পণ্য',
    incomingOrders: 'পাঠানোর জন্য সক্রিয় অর্ডার',
    markReady: 'পিকআপের জন্য প্রস্তুত চিহ্নিত করুন',
    qcChecklistTitle: 'প্রেরণের আগে গুণমান পরীক্ষা',
    damageCheck: 'আমি এই পণ্যটিতে কোনো ক্ষতি বা ছিদ্র নেই তা পরীক্ষা করেছি।',
    threadsCheck: 'সমস্ত আলগা সুতা পরিপাটিভাবে কাটা হয়েছে।',
    stitchingCheck: 'সেলাই এবং বর্ডার সম্পূর্ণরূপে পরীক্ষিত।',
    qcPhotoUpload: 'ঐচ্ছিক: প্যাক করা বান্ডিলের ছবি আপলোড করুন',
    cancel: 'বাতিল করুন',
    submitQc: 'চিহ্নিত করুন ও পিকআপ নিশ্চিত করুন',
    qaTitle: 'ধাপে ধাপে পণ্য তালিকাভুক্তি',
    microphoneTap: 'মাইক্রোফোন চেপে কথা বলুন, বা কীবোর্ড ব্যবহার করুন',
    typeFallback: 'টাইপ করতে চান? নিচে কীবোর্ড খুলুন',
    speakInstead: 'আবার ভয়েসে ফিরে যান',
    back: 'ফিরে যান',
    next: 'সংরক্ষণ করুন ও পরবর্তী',
    confirmListing: 'নিশ্চিত করতে শুনুন বা পড়ুন',
    playAudio: '▶ তালিকার সারাংশ শুনুন',
    confirmAndPublish: '✓ ঠিক আছে, এখনই প্রকাশ করুন',
    editDetails: '✕ না, বিবরণ সম্পাদনা করুন',
    buyerSearchPlaceholder: 'আপনি কী চান তা বর্ণনা করুন (যেমন: ₹৫,০০০ এর নিচে সবুজ শাড়ি)...',
    searchTitle: 'শিল্পী পণ্য অনুসন্ধান',
    weaverStory: 'শিল্পীর গল্প',
    hearWeaverStory: '▶ শিল্পীর গল্প শুনুন',
    buyRightPanel: 'সঠিকভাবে কিনুন: হস্তনির্মিত বিবরণ',
    variationDisclaimer: 'হাতে তৈরি পণ্য অনন্য এবং ছবি থেকে সামান্য ভিন্ন হতে পারে।',
    reviewCheckbox: 'আমি সঠিক পরিমাপ ও বিবরণ পর্যালোচনা করেছি।',
    buyNow: 'এখনই কিনুন',
    checkoutTitle: 'স্বচ্ছ সরাসরি চেকআউট',
    priceBreakdown: 'স্বচ্ছ মূল্য বিভাজন',
    customerPrice: 'আপনার পরিশোধিত মোট মূল্য',
    logisticsCost: 'সরাসরি পরিবহন ও গ্রামীণ কুরিয়ার',
    platformFee: 'কলাসেতু সেবা মাশুল (৩%)',
    weaverEarnings: 'শিল্পীর সরাসরি আয় (৯১%)',
    payWithUpi: 'UPI / QR দিয়ে তাৎক্ষণিক পরিশোধ করুন',
    orderConfirmed: 'অর্ডার নিশ্চিত হয়েছে!',
    trackStatus: 'অর্ডারের অগ্রগতি ট্র্যাক করুন',
    recommendationsTitle: 'এই শিল্প থেকে আরও',
    recommendationsEmpty: 'এই বিভাগের আরও পণ্য শীঘ্রই উপলব্ধ হবে।'
  },
  brx: {
    weaverView: 'शिल्पी डासबर्ड',
    buyerView: 'खरिददार मोड (गिराहाक)',
    languageName: 'बड़ो',
    logoSub: 'शिल्पी निफ्राय खरिददारनि थाखाय सिधा रादाब बजार',
    weaverDashboard: 'शिल्पी डासबर्ड',
    addNewProduct: 'गोदान फोथार दागान',
    earningsSummary: 'आंनि मोनफा',
    availableEarnings: 'उलिनायाव थानाय',
    pendingPayments: 'गाहायखौ नाजासे (होल्ड)',
    completedOrders: 'सोरबथि जानाय अर्डार',
    readEarningsAloud: 'मोनफाखौ रावसो पर',
    myListedProducts: 'आंनि शिल्प फोथार',
    incomingOrders: 'फेदेरनो थानाय सक्रिय अर्डार',
    markReady: 'पिकआपनि थाखाय सादों होन',
    qcChecklistTitle: 'फेदेराव सिगाংनि गुणथाय जाँच',
    damageCheck: 'आं फोथारखौ गोरैथि, फोर बा फेसे यागोन बुबुं जाँच खालामबाय।',
    threadsCheck: 'गासै हारिफुड़ फांथिखौ सुरजिनाय जाबाय।',
    stitchingCheck: 'सिलाइ आरो बर्डार गासैखौ जाँच खालामबाय।',
    qcPhotoUpload: 'गोसो: पैक खालामनाय बान्दलनि फटो अपलोड खालाम',
    cancel: 'खारिज खालाम',
    submitQc: 'सादों होन आरो पिकआप निश्चित खालाम',
    qaTitle: 'सिगां-सिगां फोथार लिस्टिं',
    microphoneTap: 'माइक्रोफोन गोदेर सोलैनाय बा की-बर्ड बाहायथाव',
    typeFallback: 'टाइप खालामनो नोंथाङ? गाहायाव की-बर्ड खेव',
    speakInstead: 'रादाबाव फिन जा',
    back: 'फिन जा',
    next: 'रोखा खालाम आरो उननि',
    confirmListing: 'निश्चित खालामनो सोलैथाव बा पर',
    playAudio: '▶ लिस्टिंगि सारांश सोलैथाव',
    confirmAndPublish: '✓ गोबां, दानि जाथिय फोरमायथाव',
    editDetails: '✕ नङा, फोथार सुबुं',
    buyerSearchPlaceholder: 'नोंथाङा मोनथि जायखौ फोर (जेरै: ₹५,000 गाहायनि गथार सारी)...',
    searchTitle: 'शिल्पी फोथार नागिरनाय',
    weaverStory: 'शिल्पीनि खोरां',
    hearWeaverStory: '▶ शिल्पीनि खोरां सोलैथाव',
    buyRightPanel: 'सठिकाव लां: गोहोनि फोथार विवरण',
    variationDisclaimer: 'गोहोआव सानाय फोथार गोबां सोमोन्दो, फटो निफ्राय गोसोलाय जाथाव हागौ।',
    reviewCheckbox: 'आं सठिक थुंलाइ आरो विवरणखौ नुजाबाय।',
    buyNow: 'दानि नु',
    checkoutTitle: 'गोसाय सिधा चेकआउट',
    priceBreakdown: 'गोसाय बिबान बांटिनाय',
    customerPrice: 'नोंथाङा होनाय मुलि बिबान',
    logisticsCost: 'सिधा लजिस्टिक्स आरो गामिनि कुरियार',
    platformFee: 'कलासेतु सेवा फी (३%)',
    weaverEarnings: 'शिल्पीनि सिधा मोनफा (९१%)',
    payWithUpi: 'UPI / QR जों गोख्रोमबो हो',
    orderConfirmed: 'अर्डार निश्चित जाबाय!',
    trackStatus: 'अर्डारनि उन्नति ट्रेक खालाम',
    recommendationsTitle: 'बे शिल्प निफ्राय गोबां',
    recommendationsEmpty: 'बे भागनि गोबां फोथार सिगिं जाबाय।'
  },
  doi: {
    weaverView: 'कारीगर डैशबोर्ड',
    buyerView: 'खरीददार मोड (ग्राहक)',
    languageName: 'डोगरी',
    logoSub: 'कारीगर थमां खरीददार तगर सिद्धी अवाज़ बाजार',
    weaverDashboard: 'कारीगर डैशबोर्ड',
    addNewProduct: 'नमां उत्पाद जोड़ो',
    earningsSummary: 'मेरी कमाई',
    availableEarnings: 'कड्ढने आस्तै उपलब्ध',
    pendingPayments: 'बकाया (होल्ड)',
    completedOrders: 'पूरे होई गे ऑर्डर',
    readEarningsAloud: 'कमाई उच्ची अवाज़ च पढ़ो',
    myListedProducts: 'मेरे हस्तशिल्प उत्पाद',
    incomingOrders: 'भेजने आस्तै सक्रिय ऑर्डर',
    markReady: 'पिकअप आस्तै त्यार निशान लाओ',
    qcChecklistTitle: 'भेजने थमां पैह्ले गुणवत्ता जांच',
    damageCheck: 'मैं इस उत्पाद दी अच्छी तरह जांच करी लयी ऐ, कोई नुकसान नेईं ऐ।',
    threadsCheck: 'सारे ढीले धागे साफ-सुथरे कट्टी दित्ते गे न।',
    stitchingCheck: 'सिलाई ते किनारे पूरी तरह जांचे गे न।',
    qcPhotoUpload: 'वैकल्पिक: पैक कीते बंडल दी फोटो अपलोड करो',
    cancel: 'रद्द करो',
    submitQc: 'निशान लाओ ते पिकअप पक्का करो',
    qaTitle: 'कदम-दर-कदम उत्पाद सूची',
    microphoneTap: 'माइक दबाइयै बोलो, जां कीबोर्ड बरतो',
    typeFallback: 'लिखना चांह्दे ओ? हेठ कीबोर्ड खोलो',
    speakInstead: 'वापस अवाज़ पर जाओ',
    back: 'पिच्छें जाओ',
    next: 'सांभो ते अग्गें',
    confirmListing: 'पक्का करने आस्तै सुणो जां पढ़ो',
    playAudio: '▶ सूची दा सार सुणो',
    confirmAndPublish: '✓ बिल्कुल ठीक ऐ, हुण प्रकाशित करो',
    editDetails: '✕ नेईं, विवरण सुधारो',
    buyerSearchPlaceholder: 'तुसां जो की चाहिदा दस्सो (जिसे: ₹5,000 दे अंदर हरी साड़ी)...',
    searchTitle: 'कारीगर उत्पाद खोज',
    weaverStory: 'कारीगर दी कहाणी',
    hearWeaverStory: '▶ कारीगर दी कहाणी सुणो',
    buyRightPanel: 'सही खरीद: हत्थें बणाए दे विवरण',
    variationDisclaimer: 'हत्थें बणाए उत्पाद अनोखे न, फोटो थमां थोड़ा फर्क होई सकदा ऐ।',
    reviewCheckbox: 'मैं सही नाप ते विवरणें दी समीक्षा करी लयी ऐ।',
    buyNow: 'हुण खरीदो',
    checkoutTitle: 'पारदर्शी सिद्धा चेकआउट',
    priceBreakdown: 'पारदर्शी कीमत बंडवारा',
    customerPrice: 'तुसें द्वारा दित्ती जाने आह्ली कुल कीमत',
    logisticsCost: 'सिद्धा ढुलाई ते ग्रामीण कूरियर',
    platformFee: 'कलासेतु सेवा शुल्क (3%)',
    weaverEarnings: 'कारीगर दी सिद्धी कमाई (91%)',
    payWithUpi: 'UPI / QR कन्नै फौरन भुगतान करो',
    orderConfirmed: 'ऑर्डर पक्का होई गेआ!',
    trackStatus: 'ऑर्डर दी प्रगति ट्रैक करो',
    recommendationsTitle: 'इस शिल्प थमां होर',
    recommendationsEmpty: 'इस श्रेणी दे होर उत्पाद जल्दी उपलब्ध होङगे।'
  },
  gu: {
    weaverView: 'કારીગર ડેશબોર્ડ',
    buyerView: 'ખરીદનાર મોડ (ગ્રાહક)',
    languageName: 'ગુજરાતી',
    logoSub: 'કારીગરથી ખરીદનાર સીધું અવાજ બજાર',
    weaverDashboard: 'કારીગર ડેશબોર્ડ',
    addNewProduct: 'નવું ઉત્પાદન ઉમેરો',
    earningsSummary: 'મારી કમાણી',
    availableEarnings: 'ઉપાડવા માટે ઉપલબ્ધ',
    pendingPayments: 'બાકી (હોલ્ડ)',
    completedOrders: 'પૂર્ણ થયેલા ઓર્ડર',
    readEarningsAloud: 'કમાણી મોટેથી વાંચો',
    myListedProducts: 'મારા હસ્તકલા ઉત્પાદનો',
    incomingOrders: 'મોકલવાના સક્રિય ઓર્ડર',
    markReady: 'પિકઅપ માટે તૈયાર ચિહ્નિત કરો',
    qcChecklistTitle: 'મોકલતા પહેલાં ગુણવત્તા તપાસ',
    damageCheck: 'મેં આ ઉત્પાદનમાં કોઈ નુકસાન કે છિદ્ર નથી તે તપાસ્યું છે.',
    threadsCheck: 'બધા છૂટા દોરા વ્યવસ્થિત રીતે કાપવામાં આવ્યા છે.',
    stitchingCheck: 'સિલાઈ અને કિનારીઓ સંપૂર્ણપણે તપાસાયેલ છે.',
    qcPhotoUpload: 'વૈકલ્પિક: પેક કરેલા બંડલનો ફોટો અપલોડ કરો',
    cancel: 'રદ કરો',
    submitQc: 'ચિહ્નિત કરો અને પિકઅપ પુષ્ટિ કરો',
    qaTitle: 'પગલું-દર-પગલું ઉત્પાદન યાદી',
    microphoneTap: 'માઇક દબાવીને બોલો, અથવા કીબોર્ડ વાપરો',
    typeFallback: 'ટાઇપ કરવા માંગો છો? નીચે કીબોર્ડ ખોલો',
    speakInstead: 'ફરી અવાજ પર જાઓ',
    back: 'પાછા જાઓ',
    next: 'સાચવો અને આગળ',
    confirmListing: 'પુષ્ટિ કરવા સાંભળો અથવા વાંચો',
    playAudio: '▶ યાદીનો સારાંશ સાંભળો',
    confirmAndPublish: '✓ બરાબર છે, હમણાં પ્રકાશિત કરો',
    editDetails: '✕ ના, વિગતો સંપાદિત કરો',
    buyerSearchPlaceholder: 'તમને શું જોઈએ છે તે વર્ણવો (દા.ત.: ₹5,000 ની અંદર લીલી સાડી)...',
    searchTitle: 'કારીગર ઉત્પાદન શોધ',
    weaverStory: 'કારીગરની વાર્તા',
    hearWeaverStory: '▶ કારીગરની વાર્તા સાંભળો',
    buyRightPanel: 'સાચી ખરીદી: હાથબનાવટની વિગતો',
    variationDisclaimer: 'હાથબનાવટના ઉત્પાદનો અનોખા હોય છે અને ફોટાથી થોડો ફરક હોઈ શકે છે.',
    reviewCheckbox: 'મેં ચોક્કસ માપ અને વિગતોની સમીક્ષા કરી છે.',
    buyNow: 'હમણાં ખરીદો',
    checkoutTitle: 'પારદર્શક સીધો ચેકઆઉટ',
    priceBreakdown: 'પારદર્શક કિંમત વિભાજન',
    customerPrice: 'તમે ચૂકવેલ કુલ કિંમત',
    logisticsCost: 'સીધું પરિવહન અને ગ્રામીણ કુરિયર',
    platformFee: 'કલાસેતુ સેવા ફી (3%)',
    weaverEarnings: 'કારીગરની સીધી કમાણી (91%)',
    payWithUpi: 'UPI / QR વડે તરત ચૂકવણી કરો',
    orderConfirmed: 'ઓર્ડર પુષ્ટિ થયો!',
    trackStatus: 'ઓર્ડરની પ્રગતિ ટ્રેક કરો',
    recommendationsTitle: 'આ હસ્તકલામાંથી વધુ',
    recommendationsEmpty: 'આ શ્રેણીના વધુ ઉત્પાદનો ટૂંક સમયમાં ઉપલબ્ધ થશે.'
  },
  ks: {
    weaverView: 'کاریگر ڈیش بورڈ',
    buyerView: 'خریدار موڈ (گاہک)',
    languageName: 'کٲشُر',
    logoSub: 'کاریگرہ پؠٹھ خریدار تام سیدھی آواز مارکیٹ',
    weaverDashboard: 'کاریگر ڈیش بورڈ',
    addNewProduct: 'نئ پروڈکٹ شامل کریو',
    earningsSummary: 'میۏن کمَے',
    availableEarnings: 'کاڈنہ خٲطرہ دستیاب',
    pendingPayments: 'بقایا (ہولڈ)',
    completedOrders: 'مکمل آرڈر',
    readEarningsAloud: 'کمَے اوچی آواز منز پرِو',
    myListedProducts: 'میۏن دستکاری پروڈکٹ',
    incomingOrders: 'یژھنہ خٲطرہ سرگرم آرڈر',
    markReady: 'پک اپ خٲطرہ تیار نِشان دِیو',
    qcChecklistTitle: 'روانگی برونہہ کوالٹی چیک',
    damageCheck: 'بہٕ چیک کرمت اکھ چیز، یتھ منز کانہہ نقصان چھُ نہ۔',
    threadsCheck: 'سٲری ڈھیلہ دھاگہ صاف کٲری واتنہ آمت چھُ۔',
    stitchingCheck: 'سلائی تہ کنارہ مکمل طور چیک کرنہ آمت چھُ۔',
    qcPhotoUpload: 'اختیاری: پیک کرمت بنڈل ہنٛز فوٹو اپلوڈ کریو',
    cancel: 'منسوخ کریو',
    submitQc: 'نِشان دِیو تہ پک اپ تصدیق کریو',
    qaTitle: 'قدم بہ قدم پروڈکٹ لِسٹنگ',
    microphoneTap: 'مائیک دبٲیتھ گوڈ کریو، یا کی بورڈ کارِیو',
    typeFallback: 'ٹائپ کرن چھُوی؟ نیچے کی بورڈ کھولیو',
    speakInstead: 'واپس آواز پؠٹھ گژھیو',
    back: 'واپس گژھیو',
    next: 'سیو کریو تہ اگرٕ',
    confirmListing: 'تصدیق خٲطرہ پرِو یا شونیو',
    playAudio: '▶ لِسٹنگ ہنٛز خلاصہ شونیو',
    confirmAndPublish: '✓ ٹھیک چھُ، اوس شائع کریو',
    editDetails: '✕ نہٕ، تفصیل درست کریو',
    buyerSearchPlaceholder: 'تُہہِ کیا لوڑ چھُ بیان کریو (مثال: ₹5,000 منٛز ہیریٚ ساڑی)...',
    searchTitle: 'کاریگر پروڈکٹ ژھانڈ',
    weaverStory: 'کاریگرن ہٕنٛز کہانی',
    hearWeaverStory: '▶ کاریگرن ہٕنٛز کہانی شونیو',
    buyRightPanel: 'صحیح خرید: دستی ساز تفصیل',
    variationDisclaimer: 'ہٲتھہٕ بناومت پروڈکٹ چھِ منفرد، فوٹوس منٛز فرق ہیوٚ ہیکہ۔',
    reviewCheckbox: 'بہٕ چیک کرمت چھُ صحیح پیمانہ تہ تفصیل۔',
    buyNow: 'اوس خریدیو',
    checkoutTitle: 'شفاف سیدھا چیک آؤٹ',
    priceBreakdown: 'شفاف قیمت تقسیم',
    customerPrice: 'تُہٕنٛدِ ادا کرنہ آمت کُل قیمت',
    logisticsCost: 'سیدھی ٹرانسپورٹ تہ دیہاتی کورئیر',
    platformFee: 'کلاسیتو سروس فیس (3%)',
    weaverEarnings: 'کاریگرن ہٕنٛز سیدھی کمَے (91%)',
    payWithUpi: 'UPI / QR کارِتھ فوراً ادا کریو',
    orderConfirmed: 'آرڈر تصدیق!',
    trackStatus: 'آرڈر ہنٛز پیش رفت ٹریک کریو',
    recommendationsTitle: 'اَتھ دستکاری ہنٛد بیٚ',
    recommendationsEmpty: 'اَتھ زمرہ ہنٛد بیٚ پروڈکٹ جلد دستیاب گژھن۔'
  },
  kok: {
    weaverView: 'कारागीर डॅशबोर्ड',
    buyerView: 'खरेदीदार मोड (ग्राहक)',
    languageName: 'कोंकणी',
    logoSub: 'कारागीरा थावन खरेदीदारा मेरेन थेट उलोवपाचो बाजार',
    weaverDashboard: 'कारागीर डॅशबोर्ड',
    addNewProduct: 'नवें उत्पादन जोडात',
    earningsSummary: 'म्हजी कमाई',
    availableEarnings: 'काडपाक उपलब्ध',
    pendingPayments: 'बाकी (होल्ड)',
    completedOrders: 'सोंपिल्ल्यो ऑर्डरी',
    readEarningsAloud: 'कमाई मोट्या आवाजान वाचात',
    myListedProducts: 'म्हजीं हस्तकला उत्पादनां',
    incomingOrders: 'धाडपाची सक्रिय ऑर्डर',
    markReady: 'पिकअपाखातीर तयार अशें चिन्न करात',
    qcChecklistTitle: 'धाडचे आदीं गुणवत्ता तपासणी',
    damageCheck: 'हांव ह्या उत्पादनांत कसलेंय नुकसान वा भोक ना हें तपासलां.',
    threadsCheck: 'सगळे सैल दोरे नेटान कापून काडल्यात.',
    stitchingCheck: 'शिवणी आनी कडा पुराय तपासल्यात.',
    qcPhotoUpload: 'वैकल्पीक: पॅक केल्ल्या बंडलाचो फोटो अपलोड करात',
    cancel: 'रद्द करात',
    submitQc: 'चिन्न करात आनी पिकअप निश्चीत करात',
    qaTitle: 'पावला-पावलांनी उत्पादन नोंदणी',
    microphoneTap: 'मायक्रोफोन दाबून उलोवात, वा कीबोर्ड वापरात',
    typeFallback: 'टायप करपाक जाय? सकयल कीबोर्ड उगडात',
    speakInstead: 'परत आवाजाक वचात',
    back: 'फाटीं वचात',
    next: 'जतनाय करात आनी फुडें',
    confirmListing: 'निश्चीत करपाक आयकात वा वाचात',
    playAudio: '▶ नोंदणीचो सारांश आयकात',
    confirmAndPublish: '✓ बरोबर, आतां प्रकाशीत करात',
    editDetails: '✕ ना, तपशील संपादीत करात',
    buyerSearchPlaceholder: 'तुमकां कितें जाय तें सांगात (उदा: ₹5,000 भितर हिरवें सारी)...',
    searchTitle: 'कारागीर उत्पादन सोद',
    weaverStory: 'कारागीराची कथा',
    hearWeaverStory: '▶ कारागीराची कथा आयकात',
    buyRightPanel: 'बरोबर विकत घेवचें: हाताच्यो तपशील',
    variationDisclaimer: 'हाताने केल्ली उत्पादनां अनन्य आसात, फोटो परस उणें-चड फरक आसूं येता.',
    reviewCheckbox: 'हांव सारके मेजपाचे आनी तपशील पळेलां.',
    buyNow: 'आतांच विकत घेयात',
    checkoutTitle: 'पारदर्शक थेट चेकआउट',
    priceBreakdown: 'पारदर्शक मोल विभागणी',
    customerPrice: 'तुमी दिल्ली एकूण किंमत',
    logisticsCost: 'थेट वाहतूक आनी ग्रामीण कुरियर',
    platformFee: 'कलासेतू सेवा फी (3%)',
    weaverEarnings: 'कारागीराची थेट कमाई (91%)',
    payWithUpi: 'UPI / QR वरवीं तत्काळ पैशे दियात',
    orderConfirmed: 'ऑर्डर निश्चीत जालो!',
    trackStatus: 'ऑर्डराची प्रगती ट्रॅक करात',
    recommendationsTitle: 'ह्या हस्तकलेंतल्यो आनीक',
    recommendationsEmpty: 'ह्या वर्गांतल्यो आनीक उत्पादनां रवांरवीं उपलब्ध जातलीं.'
  },
  mai: {
    weaverView: 'कारीगर डैशबोर्ड',
    buyerView: 'खरीदार मोड (ग्राहक)',
    languageName: 'मैथिली',
    logoSub: 'कारीगर सँ खरीदार धरि सीधा आवाज बजार',
    weaverDashboard: 'कारीगर डैशबोर्ड',
    addNewProduct: 'नव उत्पाद जोड़ू',
    earningsSummary: 'हमर कमाई',
    availableEarnings: 'निकालबाक लेल उपलब्ध',
    pendingPayments: 'बाकी (होल्ड)',
    completedOrders: 'पूर्ण भेल ऑर्डर',
    readEarningsAloud: 'कमाई जोर सँ पढ़ू',
    myListedProducts: 'हमर हस्तशिल्प उत्पाद',
    incomingOrders: 'पठेबाक लेल सक्रिय ऑर्डर',
    markReady: 'पिकअप लेल तैयार चिन्हित करू',
    qcChecklistTitle: 'भेजबाक पहिने गुणवत्ता जांच',
    damageCheck: 'हम एहि उत्पाद मे कोनो नुकसान वा छेद नहि अछि से जांच कऽ लेने छी।',
    threadsCheck: 'सभटा ढील डोरी नीक जकाँ काटि देल गेल अछि।',
    stitchingCheck: 'सिलाई आ किनार पूर्ण रूप सँ जांचल गेल अछि।',
    qcPhotoUpload: 'वैकल्पिक: पैक कएल बंडलक फोटो अपलोड करू',
    cancel: 'रद्द करू',
    submitQc: 'चिन्हित करू आ पिकअप पक्का करू',
    qaTitle: 'चरण-दर-चरण उत्पाद सूची',
    microphoneTap: 'माइक दबा कऽ बाजू, वा कीबोर्ड प्रयोग करू',
    typeFallback: 'टाइप करय चाहैत छी? नीचाँ कीबोर्ड खोलू',
    speakInstead: 'फेर आवाज पर जाउ',
    back: 'पाछाँ जाउ',
    next: 'सहेजू आ आगाँ',
    confirmListing: 'पक्का करबाक लेल सुनू वा पढ़ू',
    playAudio: '▶ सूचीक सार सुनू',
    confirmAndPublish: '✓ बिल्कुल ठीक अछि, आब प्रकाशित करू',
    editDetails: '✕ नहि, विवरण सुधारू',
    buyerSearchPlaceholder: 'अहाँ के की चाही से बताउ (जेना: ₹5,000 भीतर हरियर साड़ी)...',
    searchTitle: 'कारीगर उत्पाद खोज',
    weaverStory: 'कारीगरक कथा',
    hearWeaverStory: '▶ कारीगरक कथा सुनू',
    buyRightPanel: 'सही खरीद: हाथ सँ बनल विवरण',
    variationDisclaimer: 'हाथ सँ बनल उत्पाद अनूठा होइत अछि, फोटो सँ किछु फर्क भऽ सकैत अछि।',
    reviewCheckbox: 'हम सही माप आ विवरणक समीक्षा कऽ लेने छी।',
    buyNow: 'आब खरीदू',
    checkoutTitle: 'पारदर्शी सीधा चेकआउट',
    priceBreakdown: 'पारदर्शी मूल्य विभाजन',
    customerPrice: 'अहाँ द्वारा देल गेल कुल मूल्य',
    logisticsCost: 'सीधा परिवहन आ ग्रामीण कूरियर',
    platformFee: 'कलासेतु सेवा शुल्क (3%)',
    weaverEarnings: 'कारीगरक सीधा कमाई (91%)',
    payWithUpi: 'UPI / QR सँ तुरंत भुगतान करू',
    orderConfirmed: 'ऑर्डर पक्का भऽ गेल!',
    trackStatus: 'ऑर्डरक प्रगति ट्रैक करू',
    recommendationsTitle: 'एहि शिल्प सँ आओर',
    recommendationsEmpty: 'एहि श्रेणीक आओर उत्पाद जल्दी उपलब्ध हएत।'
  },
  ml: {
    weaverView: 'കരകൗശലക്കാരൻ ഡാഷ്ബോർഡ്',
    buyerView: 'വാങ്ങുന്നയാൾ മോഡ് (ഉപഭോക്താവ്)',
    languageName: 'മലയാളം',
    logoSub: 'കരകൗശലക്കാരനിൽ നിന്ന് വാങ്ങുന്നയാളിലേക്ക് നേരിട്ടുള്ള ശബ്ദ മാർക്കറ്റ്',
    weaverDashboard: 'കരകൗശലക്കാരൻ ഡാഷ്ബോർഡ്',
    addNewProduct: 'പുതിയ ഉൽപ്പന്നം ചേർക്കുക',
    earningsSummary: 'എന്റെ വരുമാനം',
    availableEarnings: 'പിൻവലിക്കാൻ ലഭ്യമായത്',
    pendingPayments: 'തീർപ്പാക്കാത്തത് (ഹോൾഡ്)',
    completedOrders: 'പൂർത്തിയായ ഓർഡറുകൾ',
    readEarningsAloud: 'വരുമാനം ഉറക്കെ വായിക്കുക',
    myListedProducts: 'എന്റെ കരകൗശല ഉൽപ്പന്നങ്ങൾ',
    incomingOrders: 'അയക്കാനുള്ള സജീവ ഓർഡറുകൾ',
    markReady: 'പിക്കപ്പിന് തയ്യാറാണെന്ന് അടയാളപ്പെടുത്തുക',
    qcChecklistTitle: 'അയക്കുന്നതിന് മുമ്പുള്ള ഗുണനിലവാര പരിശോധന',
    damageCheck: 'ഈ ഉൽപ്പന്നത്തിൽ കേടുപാടുകളോ ദ്വാരങ്ങളോ ഇല്ലെന്ന് ഞാൻ പരിശോധിച്ചു.',
    threadsCheck: 'എല്ലാ അയഞ്ഞ നൂലുകളും ഭംഗിയായി മുറിച്ചു കളഞ്ഞു.',
    stitchingCheck: 'തുന്നലും അരികുകളും പൂർണ്ണമായി പരിശോധിച്ചു.',
    qcPhotoUpload: 'ഐച്ഛികം: പാക്ക് ചെയ്ത ബണ്ടിലിന്റെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    submitQc: 'അടയാളപ്പെടുത്തി പിക്കപ്പ് സ്ഥിരീകരിക്കുക',
    qaTitle: 'ഘട്ടം ഘട്ടമായുള്ള ഉൽപ്പന്ന ലിസ്റ്റിംഗ്',
    microphoneTap: 'മൈക്ക് അമർത്തി സംസാരിക്കുക, അല്ലെങ്കിൽ കീബോർഡ് ഉപയോഗിക്കുക',
    typeFallback: 'ടൈപ്പ് ചെയ്യണോ? താഴെ കീബോർഡ് തുറക്കുക',
    speakInstead: 'വീണ്ടും ശബ്ദത്തിലേക്ക് മാറുക',
    back: 'തിരികെ പോകുക',
    next: 'സേവ് ചെയ്ത് അടുത്തത്',
    confirmListing: 'സ്ഥിരീകരിക്കാൻ കേൾക്കുക അല്ലെങ്കിൽ വായിക്കുക',
    playAudio: '▶ ലിസ്റ്റിംഗ് സംഗ്രഹം കേൾക്കുക',
    confirmAndPublish: '✓ ശരി, ഇപ്പോൾ പ്രസിദ്ധീകരിക്കുക',
    editDetails: '✕ വേണ്ട, വിശദാംശങ്ങൾ തിരുത്തുക',
    buyerSearchPlaceholder: 'നിങ്ങൾക്ക് വേണ്ടത് വിവരിക്കുക (ഉദാ: ₹5,000-ന് താഴെയുള്ള പച്ച സാരി)...',
    searchTitle: 'കരകൗശല ഉൽപ്പന്ന തിരയൽ',
    weaverStory: 'കരകൗശലക്കാരന്റെ കഥ',
    hearWeaverStory: '▶ കരകൗശലക്കാരന്റെ കഥ കേൾക്കുക',
    buyRightPanel: 'ശരിയായി വാങ്ങുക: കൈകൊണ്ട് നിർമ്മിച്ചതിന്റെ വിശദാംശങ്ങൾ',
    variationDisclaimer: 'കൈകൊണ്ട് നിർമ്മിച്ച ഉൽപ്പന്നങ്ങൾ അതുല്യമാണ്, ഫോട്ടോയിൽ നിന്ന് ചെറിയ വ്യത്യാസം ഉണ്ടാകാം.',
    reviewCheckbox: 'ഞാൻ കൃത്യമായ അളവുകളും വിശദാംശങ്ങളും അവലോകനം ചെയ്തു.',
    buyNow: 'ഇപ്പോൾ വാങ്ങുക',
    checkoutTitle: 'സുതാര്യമായ നേരിട്ടുള്ള ചെക്ക്ഔട്ട്',
    priceBreakdown: 'സുതാര്യമായ വില വിഭജനം',
    customerPrice: 'നിങ്ങൾ അടയ്ക്കുന്ന ആകെ വില',
    logisticsCost: 'നേരിട്ടുള്ള ലോജിസ്റ്റിക്സും ഗ്രാമീണ കൊറിയറും',
    platformFee: 'കലാസേതു സേവന ഫീസ് (3%)',
    weaverEarnings: 'കരകൗശലക്കാരന്റെ നേരിട്ടുള്ള വരുമാനം (91%)',
    payWithUpi: 'UPI / QR വഴി തൽക്ഷണം പണമടയ്ക്കുക',
    orderConfirmed: 'ഓർഡർ സ്ഥിരീകരിച്ചു!',
    trackStatus: 'ഓർഡർ പുരോഗതി ട്രാക്ക് ചെയ്യുക',
    recommendationsTitle: 'ഈ കരകൗശലത്തിൽ നിന്ന് കൂടുതൽ',
    recommendationsEmpty: 'ഈ വിഭാഗത്തിലെ കൂടുതൽ ഉൽപ്പന്നങ്ങൾ ഉടൻ ലഭ്യമാകും.'
  },
  mni: {
    weaverView: 'শিল্পীগী ড্যাশবোর্ড',
    buyerView: 'লৈবিবা মোড (কাস্টমার)',
    languageName: 'মৈতৈলোন্',
    logoSub: 'শিল্পীদগী লৈবিবা ফাওবা মায়োক্তা ৱার্লবা বজার',
    weaverDashboard: 'শিল্পীগী ড্যাশবোর্ড',
    addNewProduct: 'অনৌবা প্রোডাক্ট হাপচিনবিয়ু',
    earningsSummary: 'ঐগী কান্নবা',
    availableEarnings: 'লৌথোকপা য়াবা',
    pendingPayments: 'লৈরিবা (হোল্ড)',
    completedOrders: 'লোইরবা অর্ডার',
    readEarningsAloud: 'কান্নবাদু কুম্শাক্না পাড়িয়ু',
    myListedProducts: 'ঐগী শিল্প প্রোডাক্ট',
    incomingOrders: 'থাদোকখিগদবা য়াউবা অর্ডার',
    markReady: 'পিকআপকী থৌরাং তৌরে হায়না খুদম উৎলু',
    qcChecklistTitle: 'থাদোকপা মমাংদা কোয়ালিটি চেক',
    damageCheck: 'ঐহাক্না প্রোডাক্ট অসিদা মানাখিবা অমসুং খোংথাং লৈত্রবা চেক তৌবা লৈ।',
    threadsCheck: 'অসোনা লৈরিবা থ্রেড পুম্নমক শেংনা কাকপা লৈ।',
    stitchingCheck: 'ফুরিৎ অমসুং মপাল পুম্নমক চেক তৌবা লৈ।',
    qcPhotoUpload: 'ৱাফম: পেক তৌরবা বান্ডলগী ফটো আপলোড তৌবিয়ু',
    cancel: 'কেন্সেল তৌবিয়ু',
    submitQc: 'খুদম উৎলু অমসুং পিকআপ চেক তৌবিয়ু',
    qaTitle: 'ওইনা ওইনা প্রোডাক্ট লিস্টিং',
    microphoneTap: 'মাইক্রোফোন থীবা নীংগৎলু, নত্রগা কীবোর্ড শীজিন্নবিয়ু',
    typeFallback: 'টাইপ তৌনিংবা? মখাদা কীবোর্ড হাংবিয়ু',
    speakInstead: 'অমুক হন্না ৱার্লবাদা হন্না চৎলু',
    back: 'হন্না চৎলু',
    next: 'সেভ তৌবিয়ু অমসুং মথং',
    confirmListing: 'চেক তৌনবা তাবিয়ু নত্রগা পাড়িয়ু',
    playAudio: '▶ লিস্টিংগী সামারী তাবিয়ু',
    confirmAndPublish: '✓ য়ারে, হৌজিক পাবলিশ তৌবিয়ু',
    editDetails: '✕ য়ারোই, ডিটেইল শেমগৎলু',
    buyerSearchPlaceholder: 'নহাক্না পামবা অদু হায়বিয়ু (খুদম: ₹5,000 মখাদা অসাংবা সারী)...',
    searchTitle: 'শিল্পী প্রোডাক্ট থিবা',
    weaverStory: 'শিল্পীগী ৱারী',
    hearWeaverStory: '▶ শিল্পীগী ৱারী তাবিয়ু',
    buyRightPanel: 'চুমহনা লৈবিবা: খুৎনা শাবগী মরু',
    variationDisclaimer: 'খুৎনা শাবা প্রোডাক্টশিং অদু কনগৎপা ওই, ফটোদগী য়াম্না অসোই তোঙান তোঙানবা ওইবা য়াই।',
    reviewCheckbox: 'ঐহাক্না চুমহনা মমল অমসুং ডিটেইল য়েংশিনবা লৈ।',
    buyNow: 'হৌজিক লৈবিবিয়ু',
    checkoutTitle: 'চুমহনবা মায়োক্তা চেকআউট',
    priceBreakdown: 'চুমহনবা মমল খাইদোকপা',
    customerPrice: 'নহাক্না পীগদবা অপুনবা মমল',
    logisticsCost: 'মায়োক্তা লজিস্টিক অমসুং খুঙ্গংগী কুরিয়ার',
    platformFee: 'কলাসেতু সর্ভিস ফী (3%)',
    weaverEarnings: 'শিল্পীগী মায়োক্তা কান্নবা (91%)',
    payWithUpi: 'UPI / QR না খুদক্তগী পীবিয়ু',
    orderConfirmed: 'অর্ডার চেক তৌরে!',
    trackStatus: 'অর্ডারগী প্রগ্রেস ট্রেক তৌবিয়ু',
    recommendationsTitle: 'শিল্প অসিদগী হেন্না',
    recommendationsEmpty: 'কেটাগরি অসিগী প্রোডাক্ট হেন্না থুনা ফংগনি।'
  },
  mr: {
    weaverView: 'कारागीर डॅशबोर्ड',
    buyerView: 'खरेदीदार मोड (ग्राहक)',
    languageName: 'मराठी',
    logoSub: 'कारागीर ते खरेदीदार थेट आवाज बाजारपेठ',
    weaverDashboard: 'कारागीर डॅशबोर्ड',
    addNewProduct: 'नवीन उत्पादन जोडा',
    earningsSummary: 'माझी कमाई',
    availableEarnings: 'काढण्यासाठी उपलब्ध',
    pendingPayments: 'प्रलंबित (होल्ड)',
    completedOrders: 'पूर्ण झालेल्या ऑर्डर',
    readEarningsAloud: 'कमाई मोठ्याने वाचा',
    myListedProducts: 'माझी हस्तकला उत्पादने',
    incomingOrders: 'पाठवायच्या सक्रिय ऑर्डर',
    markReady: 'पिकअपसाठी तयार म्हणून चिन्हांकित करा',
    qcChecklistTitle: 'पाठवण्यापूर्वी गुणवत्ता तपासणी',
    damageCheck: 'मी या उत्पादनात कोणतेही नुकसान किंवा छिद्र नाही हे तपासले आहे.',
    threadsCheck: 'सर्व सैल धागे व्यवस्थित कापले आहेत.',
    stitchingCheck: 'शिलाई आणि कडा पूर्णपणे तपासल्या आहेत.',
    qcPhotoUpload: 'पर्यायी: पॅक केलेल्या बंडलचा फोटो अपलोड करा',
    cancel: 'रद्द करा',
    submitQc: 'चिन्हांकित करा आणि पिकअप निश्चित करा',
    qaTitle: 'टप्प्याटप्प्याने उत्पादन नोंदणी',
    microphoneTap: 'माइक दाबून बोला, किंवा कीबोर्ड वापरा',
    typeFallback: 'टाइप करायचे आहे? खाली कीबोर्ड उघडा',
    speakInstead: 'पुन्हा आवाजाकडे जा',
    back: 'मागे जा',
    next: 'जतन करा आणि पुढे',
    confirmListing: 'निश्चित करण्यासाठी ऐका किंवा वाचा',
    playAudio: '▶ नोंदणीचा सारांश ऐका',
    confirmAndPublish: '✓ बरोबर आहे, आता प्रकाशित करा',
    editDetails: '✕ नाही, तपशील संपादित करा',
    buyerSearchPlaceholder: 'तुम्हाला काय हवे आहे ते सांगा (उदा: ₹5,000 च्या आत हिरवी साडी)...',
    searchTitle: 'कारागीर उत्पादन शोध',
    weaverStory: 'कारागीराची कहाणी',
    hearWeaverStory: '▶ कारागीराची कहाणी ऐका',
    buyRightPanel: 'योग्य खरेदी: हस्तनिर्मित तपशील',
    variationDisclaimer: 'हाताने बनवलेली उत्पादने अनन्यसाधारण असतात, फोटोपेक्षा थोडा फरक असू शकतो.',
    reviewCheckbox: 'मी अचूक मोजमाप आणि तपशीलांचे पुनरावलोकन केले आहे.',
    buyNow: 'आत्ता खरेदी करा',
    checkoutTitle: 'पारदर्शक थेट चेकआउट',
    priceBreakdown: 'पारदर्शक किंमत विभाजन',
    customerPrice: 'तुम्ही भरलेली एकूण किंमत',
    logisticsCost: 'थेट वाहतूक आणि ग्रामीण कुरियर',
    platformFee: 'कलासेतू सेवा शुल्क (3%)',
    weaverEarnings: 'कारागीराची थेट कमाई (91%)',
    payWithUpi: 'UPI / QR द्वारे त्वरित पैसे द्या',
    orderConfirmed: 'ऑर्डर निश्चित झाली!',
    trackStatus: 'ऑर्डरची प्रगती ट्रॅक करा',
    recommendationsTitle: 'या हस्तकलेतून आणखी',
    recommendationsEmpty: 'या श्रेणीतील आणखी उत्पादने लवकरच उपलब्ध होतील.'
  },
  ne: {
    weaverView: 'कारीगर ड्यासबोर्ड',
    buyerView: 'खरिददार मोड (ग्राहक)',
    languageName: 'नेपाली',
    logoSub: 'कारीगरदेखि खरिददारसम्म सिधा आवाज बजार',
    weaverDashboard: 'कारीगर ड्यासबोर्ड',
    addNewProduct: 'नयाँ उत्पादन थप्नुहोस्',
    earningsSummary: 'मेरो कमाइ',
    availableEarnings: 'झिक्नका लागि उपलब्ध',
    pendingPayments: 'बाँकी (होल्ड)',
    completedOrders: 'पूरा भएका अर्डर',
    readEarningsAloud: 'कमाइ ठूलो स्वरमा पढ्नुहोस्',
    myListedProducts: 'मेरा हस्तकला उत्पादनहरू',
    incomingOrders: 'पठाउनुपर्ने सक्रिय अर्डर',
    markReady: 'पिकअपका लागि तयार चिन्ह लगाउनुहोस्',
    qcChecklistTitle: 'पठाउनुअघि गुणस्तर जाँच',
    damageCheck: 'मैले यो उत्पादनमा कुनै क्षति वा प्वाल छैन भनी जाँचेको छु।',
    threadsCheck: 'सबै फुस्रो धागोहरू राम्ररी काटिएका छन्।',
    stitchingCheck: 'सिलाई र किनाराहरू पूर्ण रूपमा जाँचिएका छन्।',
    qcPhotoUpload: 'वैकल्पिक: प्याक गरिएको बन्डलको फोटो अपलोड गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    submitQc: 'चिन्ह लगाउनुहोस् र पिकअप पक्का गर्नुहोस्',
    qaTitle: 'चरणबद्ध उत्पादन सूची',
    microphoneTap: 'माइक थिचेर बोल्नुहोस्, वा किबोर्ड प्रयोग गर्नुहोस्',
    typeFallback: 'टाइप गर्न चाहनुहुन्छ? तल किबोर्ड खोल्नुहोस्',
    speakInstead: 'फेरि आवाजमा जानुहोस्',
    back: 'फर्कनुहोस्',
    next: 'सुरक्षित गर्नुहोस् र अर्को',
    confirmListing: 'पक्का गर्न सुन्नुहोस् वा पढ्नुहोस्',
    playAudio: '▶ सूचीको सारांश सुन्नुहोस्',
    confirmAndPublish: '✓ ठीक छ, अहिले प्रकाशित गर्नुहोस्',
    editDetails: '✕ होइन, विवरण सम्पादन गर्नुहोस्',
    buyerSearchPlaceholder: 'तपाईंलाई के चाहिन्छ भन्नुहोस् (जस्तै: ₹5,000 भित्र हरियो साडी)...',
    searchTitle: 'कारीगर उत्पादन खोज',
    weaverStory: 'कारीगरको कथा',
    hearWeaverStory: '▶ कारीगरको कथा सुन्नुहोस्',
    buyRightPanel: 'सही खरिद: हस्तनिर्मित विवरण',
    variationDisclaimer: 'हातले बनेका उत्पादनहरू अनौठा हुन्छन्, फोटोभन्दा अलिकति फरक हुन सक्छ।',
    reviewCheckbox: 'मैले सही नाप र विवरणहरू समीक्षा गरेको छु।',
    buyNow: 'अहिले नै किन्नुहोस्',
    checkoutTitle: 'पारदर्शी सिधा चेकआउट',
    priceBreakdown: 'पारदर्शी मूल्य विभाजन',
    customerPrice: 'तपाईंले तिर्नुभएको कुल मूल्य',
    logisticsCost: 'सिधा ढुवानी र ग्रामीण कुरियर',
    platformFee: 'कलासेतु सेवा शुल्क (3%)',
    weaverEarnings: 'कारीगरको सिधा कमाइ (91%)',
    payWithUpi: 'UPI / QR मार्फत तुरुन्त भुक्तानी गर्नुहोस्',
    orderConfirmed: 'अर्डर पक्का भयो!',
    trackStatus: 'अर्डरको प्रगति ट्र्याक गर्नुहोस्',
    recommendationsTitle: 'यो हस्तकलाबाट थप',
    recommendationsEmpty: 'यो श्रेणीका थप उत्पादनहरू चाँडै उपलब्ध हुनेछन्।'
  },
  or: {
    weaverView: 'ଶିଳ୍ପୀ ଡ୍ୟାସବୋର୍ଡ',
    buyerView: 'କ୍ରେତା ମୋଡ (ଗ୍ରାହକ)',
    languageName: 'ଓଡ଼ିଆ',
    logoSub: 'ଶିଳ୍ପୀଙ୍କଠାରୁ କ୍ରେତାଙ୍କ ପାଇଁ ସିଧାସଳଖ ସ୍ୱର ବଜାର',
    weaverDashboard: 'ଶିଳ୍ପୀ ଡ୍ୟାସବୋର୍ଡ',
    addNewProduct: 'ନୂଆ ଉତ୍ପାଦ ଯୋଡ଼ନ୍ତୁ',
    earningsSummary: 'ମୋର ଆୟ',
    availableEarnings: 'ଉଠାଇବା ପାଇଁ ଉପଲବ୍ଧ',
    pendingPayments: 'ବକେୟା (ହୋଲ୍ଡ)',
    completedOrders: 'ସମ୍ପୂର୍ଣ୍ଣ ଅର୍ଡର',
    readEarningsAloud: 'ଆୟ ଜୋରରେ ପଢ଼ନ୍ତୁ',
    myListedProducts: 'ମୋର ହସ୍ତଶିଳ୍ପ ଉତ୍ପାଦ',
    incomingOrders: 'ପଠାଇବାକୁ ଥିବା ସକ୍ରିୟ ଅର୍ଡର',
    markReady: 'ପିକଅପ୍ ପାଇଁ ପ୍ରସ୍ତୁତ ଚିହ୍ନିତ କରନ୍ତୁ',
    qcChecklistTitle: 'ପଠାଇବା ପୂର୍ବରୁ ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    damageCheck: 'ମୁଁ ଏହି ଉତ୍ପାଦରେ କୌଣସି କ୍ଷତି କିମ୍ବା ଛିଦ୍ର ନାହିଁ ବୋଲି ଯାଞ୍ଚ କରିଛି।',
    threadsCheck: 'ସମସ୍ତ ଢିଲା ଧागा ସୁନ୍ଦର ଭାବେ କଟାଯାଇଛି।',
    stitchingCheck: 'ସିଲେଇ ଏବଂ କଡ଼ ସମ୍ପୂର୍ଣ୍ଣ ଯାଞ୍ଚ ହୋଇଛି।',
    qcPhotoUpload: 'ଇଚ୍ଛାଧୀନ: ପ୍ୟାକ୍ ହୋଇଥିବା ବଣ୍ଡଲର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    submitQc: 'ଚିହ୍ନିତ କରନ୍ତୁ ଏବଂ ପିକଅପ୍ ନିଶ୍ଚିତ କରନ୍ତୁ',
    qaTitle: 'ପାହାଚ-ପାହାଚ ଉତ୍ପାଦ ତାଲିକାଭୁକ୍ତି',
    microphoneTap: 'ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ, କିମ୍ବା କୀବୋର୍ଡ ବ୍ୟବହାର କରନ୍ତୁ',
    typeFallback: 'ଟାଇପ୍ କରିବାକୁ ଚାହାଁନ୍ତି? ତଳେ କୀବୋର୍ଡ ଖୋଲନ୍ତୁ',
    speakInstead: 'ପୁଣି ସ୍ୱରକୁ ଫେରନ୍ତୁ',
    back: 'ପଛକୁ ଯାଆନ୍ତୁ',
    next: 'ସେଭ୍ କରନ୍ତୁ ଏବଂ ପରବର୍ତ୍ତୀ',
    confirmListing: 'ନିଶ୍ଚିତ କରିବାକୁ ଶୁଣନ୍ତୁ କିମ୍ବା ପଢ଼ନ୍ତୁ',
    playAudio: '▶ ତାଲିକାର ସାରାଂଶ ଶୁଣନ୍ତୁ',
    confirmAndPublish: '✓ ଠିକ୍ ଅଛି, ବର୍ତ୍ତମାନ ପ୍ରକାଶ କରନ୍ତୁ',
    editDetails: '✕ ନାହିଁ, ବିବରଣୀ ସମ୍ପାଦନ କରନ୍ତୁ',
    buyerSearchPlaceholder: 'ଆପଣଙ୍କୁ କଣ ଦରକାର ବର୍ଣ୍ଣନା କରନ୍ତୁ (ଯଥା: ₹5,000 ମଧ୍ୟରେ ସବୁଜ ଶାଢ଼ୀ)...',
    searchTitle: 'ଶିଳ୍ପୀ ଉତ୍ପାଦ ସନ୍ଧାନ',
    weaverStory: 'ଶିଳ୍ପୀଙ୍କ କାହାଣୀ',
    hearWeaverStory: '▶ ଶିଳ୍ପୀଙ୍କ କାହାଣୀ ଶୁଣନ୍ତୁ',
    buyRightPanel: 'ସଠିକ୍ କିଣନ୍ତୁ: ହସ୍ତନିର୍ମିତ ବିବରଣୀ',
    variationDisclaimer: 'ହାତରେ ତିଆରି ଉତ୍ପାଦ ଅନନ୍ୟ, ଫଟୋଠାରୁ ଟିକିଏ ଭିନ୍ନ ହୋଇପାରେ।',
    reviewCheckbox: 'ମୁଁ ସଠିକ୍ ମାପ ଏବଂ ବିବରଣୀ ସମୀକ୍ଷା କରିଛି।',
    buyNow: 'ବର୍ତ୍ତମାନ କିଣନ୍ତୁ',
    checkoutTitle: 'ସ୍ୱଚ୍ଛ ସିଧାସଳଖ ଚେକଆଉଟ୍',
    priceBreakdown: 'ସ୍ୱଚ୍ଛ ମୂଲ୍ୟ ବିଭାଜନ',
    customerPrice: 'ଆପଣ ପ୍ରଦାନ କରୁଥିବା ମୋଟ ମୂଲ୍ୟ',
    logisticsCost: 'ସିଧାସଳଖ ପରିବହନ ଏବଂ ଗ୍ରାମୀଣ କୁରିଅର୍',
    platformFee: 'କଳାସେତୁ ସେବା ଶୁଳ୍କ (3%)',
    weaverEarnings: 'ଶିଳ୍ପୀଙ୍କ ସିଧାସଳଖ ଆୟ (91%)',
    payWithUpi: 'UPI / QR ମାଧ୍ୟମରେ ତୁରନ୍ତ ପେମେଣ୍ଟ କରନ୍ତୁ',
    orderConfirmed: 'ଅର୍ଡର ନିଶ୍ଚିତ ହେଲା!',
    trackStatus: 'ଅର୍ଡରର ପ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ',
    recommendationsTitle: 'ଏହି ଶିଳ୍ପରୁ ଆହୁରି',
    recommendationsEmpty: 'ଏହି ବର୍ଗର ଆହୁରି ଉତ୍ପାଦ ଶୀଘ୍ର ଉପଲବ୍ଧ ହେବ।'
  },
  pa: {
    weaverView: 'ਕਾਰੀਗਰ ਡੈਸ਼ਬੋਰਡ',
    buyerView: 'ਖਰੀਦਦਾਰ ਮੋਡ (ਗਾਹਕ)',
    languageName: 'ਪੰਜਾਬੀ',
    logoSub: 'ਕਾਰੀਗਰ ਤੋਂ ਖਰੀਦਦਾਰ ਤੱਕ ਸਿੱਧੀ ਆਵਾਜ਼ ਮੰਡੀ',
    weaverDashboard: 'ਕਾਰੀਗਰ ਡੈਸ਼ਬੋਰਡ',
    addNewProduct: 'ਨਵਾਂ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ',
    earningsSummary: 'ਮੇਰੀ ਕਮਾਈ',
    availableEarnings: 'ਕਢਵਾਉਣ ਲਈ ਉਪਲਬਧ',
    pendingPayments: 'ਬਕਾਇਆ (ਹੋਲਡ)',
    completedOrders: 'ਪੂਰੇ ਹੋਏ ਆਰਡਰ',
    readEarningsAloud: 'ਕਮਾਈ ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਪੜ੍ਹੋ',
    myListedProducts: 'ਮੇਰੇ ਦਸਤਕਾਰੀ ਉਤਪਾਦ',
    incomingOrders: 'ਭੇਜਣ ਲਈ ਸਰਗਰਮ ਆਰਡਰ',
    markReady: 'ਪਿਕਅੱਪ ਲਈ ਤਿਆਰ ਵਜੋਂ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ',
    qcChecklistTitle: 'ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਗੁਣਵੱਤਾ ਜਾਂਚ',
    damageCheck: 'ਮੈਂ ਇਸ ਉਤਪਾਦ ਦੀ ਜਾਂਚ ਕਰ ਲਈ ਹੈ, ਕੋਈ ਨੁਕਸਾਨ ਜਾਂ ਛੇਕ ਨਹੀਂ ਹੈ।',
    threadsCheck: 'ਸਾਰੇ ਢਿੱਲੇ ਧਾਗੇ ਸਾਫ਼-ਸੁਥਰੇ ਕੱਟ ਦਿੱਤੇ ਗਏ ਹਨ।',
    stitchingCheck: 'ਸਿਲਾਈ ਅਤੇ ਕਿਨਾਰੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਜਾਂਚੇ ਗਏ ਹਨ।',
    qcPhotoUpload: 'ਵਿਕਲਪਿਕ: ਪੈਕ ਕੀਤੇ ਬੰਡਲ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    submitQc: 'ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ ਅਤੇ ਪਿਕਅੱਪ ਪੱਕਾ ਕਰੋ',
    qaTitle: 'ਕਦਮ-ਦਰ-ਕਦਮ ਉਤਪਾਦ ਸੂਚੀ',
    microphoneTap: 'ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ, ਜਾਂ ਕੀਬੋਰਡ ਵਰਤੋ',
    typeFallback: 'ਟਾਈਪ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਹੇਠਾਂ ਕੀਬੋਰਡ ਖੋਲ੍ਹੋ',
    speakInstead: 'ਵਾਪਸ ਆਵਾਜ਼ ਵੱਲ ਜਾਓ',
    back: 'ਵਾਪਸ ਜਾਓ',
    next: 'ਸੰਭਾਲੋ ਅਤੇ ਅੱਗੇ',
    confirmListing: 'ਪੱਕਾ ਕਰਨ ਲਈ ਸੁਣੋ ਜਾਂ ਪੜ੍ਹੋ',
    playAudio: '▶ ਸੂਚੀ ਦਾ ਸਾਰ ਸੁਣੋ',
    confirmAndPublish: '✓ ਬਿਲਕੁਲ ਠੀਕ ਹੈ, ਹੁਣੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ',
    editDetails: '✕ ਨਹੀਂ, ਵੇਰਵੇ ਸੋਧੋ',
    buyerSearchPlaceholder: 'ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ ਦੱਸੋ (ਜਿਵੇਂ: ₹5,000 ਦੇ ਅੰਦਰ ਹਰੀ ਸਾੜੀ)...',
    searchTitle: 'ਕਾਰੀਗਰ ਉਤਪਾਦ ਖੋਜ',
    weaverStory: 'ਕਾਰੀਗਰ ਦੀ ਕਹਾਣੀ',
    hearWeaverStory: '▶ ਕਾਰੀਗਰ ਦੀ ਕਹਾਣੀ ਸੁਣੋ',
    buyRightPanel: 'ਸਹੀ ਖਰੀਦ: ਹੱਥ ਨਾਲ ਬਣੇ ਵੇਰਵੇ',
    variationDisclaimer: 'ਹੱਥ ਨਾਲ ਬਣੇ ਉਤਪਾਦ ਵਿਲੱਖਣ ਹਨ, ਫੋਟੋ ਨਾਲੋਂ ਥੋੜ੍ਹਾ ਫਰਕ ਹੋ ਸਕਦਾ ਹੈ।',
    reviewCheckbox: 'ਮੈਂ ਸਹੀ ਮਾਪ ਅਤੇ ਵੇਰਵਿਆਂ ਦੀ ਸਮੀਖਿਆ ਕਰ ਲਈ ਹੈ।',
    buyNow: 'ਹੁਣੇ ਖਰੀਦੋ',
    checkoutTitle: 'ਪਾਰਦਰਸ਼ੀ ਸਿੱਧਾ ਚੈੱਕਆਉਟ',
    priceBreakdown: 'ਪਾਰਦਰਸ਼ੀ ਕੀਮਤ ਵੰਡ',
    customerPrice: 'ਤੁਹਾਡੇ ਦੁਆਰਾ ਅਦਾ ਕੀਤੀ ਕੁੱਲ ਕੀਮਤ',
    logisticsCost: 'ਸਿੱਧੀ ਢੋਆ-ਢੁਆਈ ਅਤੇ ਪੇਂਡੂ ਕੋਰੀਅਰ',
    platformFee: 'ਕਲਾਸੇਤੁ ਸੇਵਾ ਫੀਸ (3%)',
    weaverEarnings: 'ਕਾਰੀਗਰ ਦੀ ਸਿੱਧੀ ਕਮਾਈ (91%)',
    payWithUpi: 'UPI / QR ਨਾਲ ਤੁਰੰਤ ਭੁਗਤਾਨ ਕਰੋ',
    orderConfirmed: 'ਆਰਡਰ ਪੱਕਾ ਹੋ ਗਿਆ!',
    trackStatus: 'ਆਰਡਰ ਦੀ ਤਰੱਕੀ ਟਰੈਕ ਕਰੋ',
    recommendationsTitle: 'ਇਸ ਦਸਤਕਾਰੀ ਤੋਂ ਹੋਰ',
    recommendationsEmpty: 'ਇਸ ਸ਼੍ਰੇਣੀ ਦੇ ਹੋਰ ਉਤਪਾਦ ਜਲਦੀ ਉਪਲਬਧ ਹੋਣਗੇ।'
  },
  sa: {
    weaverView: 'शिल्पी फलकम्',
    buyerView: 'क्रेतृ प्रकारः (ग्राहकः)',
    languageName: 'संस्कृतम्',
    logoSub: 'शिल्पिनः क्रेतारं यावत् प्रत्यक्षं ध्वनि-आपणम्',
    weaverDashboard: 'शिल्पी फलकम्',
    addNewProduct: 'नूतनं उत्पादनं योजयतु',
    earningsSummary: 'मम आयः',
    availableEarnings: 'निष्कासनाय उपलब्धः',
    pendingPayments: 'अवशिष्टं (स्थगितम्)',
    completedOrders: 'पूर्णाः आदेशाः',
    readEarningsAloud: 'आयं उच्चैः पठतु',
    myListedProducts: 'मम हस्तकला उत्पादनानि',
    incomingOrders: 'प्रेषणीयाः सक्रियाः आदेशाः',
    markReady: 'ग्रहणाय सज्जं इति चिह्नितं करोतु',
    qcChecklistTitle: 'प्रेषणात् पूर्वं गुणवत्ता परीक्षणम्',
    damageCheck: 'अहं एतत् उत्पादनं क्षतिरहितं इति परीक्षितवान्।',
    threadsCheck: 'सर्वे शिथिलाः सूत्राः सम्यक् छिन्नाः सन्ति।',
    stitchingCheck: 'सीवनं सीमाश्च सम्पूर्णतया परीक्षिताः।',
    qcPhotoUpload: 'ऐच्छिकम्: संगृहीत-पुञ्जस्य छायाचित्रं प्रेषयतु',
    cancel: 'रद्द करोतु',
    submitQc: 'चिह्नितं कृत्वा ग्रहणं निश्चितं करोतु',
    qaTitle: 'सोपान-सोपानेन उत्पादन-सूचीकरणम्',
    microphoneTap: 'ध्वनिग्राहकं स्पृशित्वा वदतु, अथवा कुञ्जिपटलं उपयुज्यताम्',
    typeFallback: 'लेखितुम् इच्छति? अधः कुञ्जिपटलं उद्घाटयतु',
    speakInstead: 'पुनः ध्वनिं प्रति गच्छतु',
    back: 'प्रत्यागच्छतु',
    next: 'रक्षतु च अग्रे गच्छतु',
    confirmListing: 'निश्चयाय शृणोतु अथवा पठतु',
    playAudio: '▶ सूचीसारं शृणोतु',
    confirmAndPublish: '✓ सम्यक्, अधुना प्रकाशयतु',
    editDetails: '✕ न, विवरणं संशोधयतु',
    buyerSearchPlaceholder: 'भवतः किं अपेक्षितम् वदतु (यथा: ₹5,000 अन्तः हरितशाटी)...',
    searchTitle: 'शिल्पी उत्पादन अन्वेषणम्',
    weaverStory: 'शिल्पिनः कथा',
    hearWeaverStory: '▶ शिल्पिनः कथां शृणोतु',
    buyRightPanel: 'सम्यक् क्रयः: हस्तनिर्मित विवरणम्',
    variationDisclaimer: 'हस्तनिर्मितानि उत्पादनानि अद्वितीयानि, छायाचित्रात् किञ्चित् भिन्नानि भवितुम् अर्हन्ति।',
    reviewCheckbox: 'अहं सम्यक् मापनं विवरणं च अवलोकितवान्।',
    buyNow: 'अधुना क्रीणातु',
    checkoutTitle: 'पारदर्शी प्रत्यक्ष चेकआउट्',
    priceBreakdown: 'पारदर्शी मूल्य विभाजनम्',
    customerPrice: 'भवता दत्तं सम्पूर्णं मूल्यम्',
    logisticsCost: 'प्रत्यक्षं परिवहनं ग्रामीण-वाहकश्च',
    platformFee: 'कलासेतु सेवाशुल्कम् (3%)',
    weaverEarnings: 'शिल्पिनः प्रत्यक्षः आयः (91%)',
    payWithUpi: 'UPI / QR द्वारा तत्क्षणं दत्तं करोतु',
    orderConfirmed: 'आदेशः निश्चितः!',
    trackStatus: 'आदेशस्य प्रगतिं अनुसरतु',
    recommendationsTitle: 'अस्मात् शिल्पात् अधिकम्',
    recommendationsEmpty: 'अस्य वर्गस्य अधिकानि उत्पादनानि शीघ्रं उपलब्धानि भविष्यन्ति।'
  },
  sat: {
    weaverView: 'शिल्पी डेशबर्ड',
    buyerView: 'किरिञ रेयाक् मोड (गिराहाक)',
    languageName: 'सन्ताड़ी',
    logoSub: 'शिल्पी थेन किरिञ रेयाक् ताला रोड़ बाजार',
    weaverDashboard: 'शिल्पी डेशबर्ड',
    addNewProduct: 'नावा फोथार सेर्मा',
    earningsSummary: 'इञाक् मोनफा',
    availableEarnings: 'ओलनाय आगु मेनाक्',
    pendingPayments: 'बाकी (होल्ड)',
    completedOrders: 'सोम्तिज लेना अर्डार',
    readEarningsAloud: 'मोनफा रोड़ आग् पाढाव',
    myListedProducts: 'इञाक् शिल्प फोथार',
    incomingOrders: 'ओलनाय लागित सक्रिय अर्डार',
    markReady: 'पिकआप् लागित तयार चिन्हा',
    qcChecklistTitle: 'ओलनाय हाराड़ गुणथाय जाँच',
    damageCheck: 'इञ नेल केदा नोवा फोथार रे बाहा बा फोर बानुक कान।',
    threadsCheck: 'सबगे लोगोन सुता बेस काटा एना।',
    stitchingCheck: 'सिलाई आर बडार बेस जाँच एना।',
    qcPhotoUpload: 'बादाय: पैक एना बान्दलाक् फोटो अपलोड',
    cancel: 'बातिल',
    submitQc: 'चिन्हा आर पिकआप निश्चित',
    qaTitle: 'सिड़ा-सिड़ा फोथार लिस्टिं',
    microphoneTap: 'माइक्रोफोन दाबा रोड़, बा कीबर्ड ब्यवहार',
    typeFallback: 'टाइप मन काना? लातार कीबर्ड खोला',
    speakInstead: 'बाहा रोड़ रे रुवाड़',
    back: 'ताया चालाव',
    next: 'राखा आर सेटेर',
    confirmListing: 'निश्चित लागित आयुम बा पाढाव',
    playAudio: '▶ लिस्टिं सारांश आयुम',
    confirmAndPublish: '✓ बेस, नित्तिड़ प्रकाशित',
    editDetails: '✕ बानुक, विवरण सुधार',
    buyerSearchPlaceholder: 'आम् चेत् सानाम् उना ओल (जेमोन्: ₹5,000 लातार हरियल साड़ी)...',
    searchTitle: 'शिल्पी फोथार नाम',
    weaverStory: 'शिल्पी रेयाक् काहानी',
    hearWeaverStory: '▶ शिल्पी रेयाक् काहानी आयुम',
    buyRightPanel: 'बेस किरिञ: तिञ बेनाव विवरण',
    variationDisclaimer: 'तिञ बेनाव फोथार सबेन बांगे, फोटो थेन थोड़ा बांगे मेनाक् दाड़ेयाक्।',
    reviewCheckbox: 'इञ निश्चित नाप आर विवरण नेल लेना।',
    buyNow: 'नित्तिड़ किरिञ',
    checkoutTitle: 'चोक्खा ताला चेकआउट्',
    priceBreakdown: 'चोक्खा दाम बाटा',
    customerPrice: 'आम् दाड़े रेयाक् सबगे दाम',
    logisticsCost: 'ताला ढुलाई आर गाँव कुरियर',
    platformFee: 'कलासेतु सेवा फी (3%)',
    weaverEarnings: 'शिल्पी रेयाक् ताला मोनफा (91%)',
    payWithUpi: 'UPI / QR ते सेटाक् दाड़े',
    orderConfirmed: 'अर्डार निश्चित काना!',
    trackStatus: 'अर्डार रेयाक् आगु ट्रेक',
    recommendationsTitle: 'नोवा शिल्प थेन आर',
    recommendationsEmpty: 'नोवा भाग रेयाक् आर फोथार लाहा मेनाक् काना।'
  },
  sd: {
    weaverView: 'कारीगर डैशबोर्ड',
    buyerView: 'खरीददार मोड (गराहक)',
    languageName: 'सिन्धी',
    logoSub: 'कारीगर खां खरीददार तائين सڌي آواز बाजार',
    weaverDashboard: 'कारीगर डैशबोर्ड',
    addNewProduct: 'नئون उत्पाद شامل ڪريو',
    earningsSummary: 'मेरी कमाई',
    availableEarnings: 'काढڻ लاءِ उपलब्ध',
    pendingPayments: 'बाकी (होल्ड)',
    completedOrders: 'पूरा थيل आर्डر',
    readEarningsAloud: 'कमाई وڏي آواز सان پڙهو',
    myListedProducts: 'मेरा हस्तशिल्प उत्पाद',
    incomingOrders: 'موڪلڻ لاءِ सक्रिय आर्डर',
    markReady: 'پڪ اپ लاءِ تيار نشان لڳايو',
    qcChecklistTitle: 'موڪلڻ کان اڳ گُڻ تحقيق',
    damageCheck: 'مون هي شئي جي جانچ ڪري ورتي آهي، ڪو به نقصان ناهي.',
    threadsCheck: 'سمورا ڍري تند صاف ڪٽيا ويا آهن.',
    stitchingCheck: 'سلاءِ ۽ ڪنارا مڪمل طور تي جانچيا ويا آهن.',
    qcPhotoUpload: 'اختياري: پيڪ ٿيل بنڊل جو فوٽو اپلوڊ ڪريو',
    cancel: 'رد ڪريو',
    submitQc: 'نشان لڳايو ۽ پڪ اپ پڪو ڪريو',
    qaTitle: 'قدم بہ قدم شئي جي فهرست',
    microphoneTap: 'مائيڪ دٻائي ڳالهايو، يا ڪيبورڊ استعمال ڪريو',
    typeFallback: 'ٽائيپ ڪرڻ چاهيو ٿا؟ هيٺ ڪيبورڊ کوليو',
    speakInstead: 'واپس آواز ڏانهن وڃو',
    back: 'واپس وڃو',
    next: 'سيو ڪريو ۽ اڳتي',
    confirmListing: 'پڪو ڪرڻ لاءِ ٻڌو يا پڙهو',
    playAudio: '▶ فهرست جو خلاصو ٻڌو',
    confirmAndPublish: '✓ صحيح آهي، هاڻي شايع ڪريو',
    editDetails: '✕ نه، تفصيل درست ڪريو',
    buyerSearchPlaceholder: 'اوهان کي ڇا گھرجي ٻڌايو (مثال: ₹5,000 اندر ساوي ساڙهي)...',
    searchTitle: 'कारीगर उत्पाद searchی',
    weaverStory: 'कारीगर جي ڪهاणी',
    hearWeaverStory: '▶ कारीगर جي ڪهاणी ٻڌو',
    buyRightPanel: 'صحيح خريداري: هٿ سان ٺهيل تفصيل',
    variationDisclaimer: 'هٿ سان ٺهيل شيون منفرد آهن، فوٽو کان ٿورو فرق ٿي سگهي ٿو.',
    reviewCheckbox: 'مون صحيح ماپ ۽ تفصيل جو جائزو ورتو آهي.',
    buyNow: 'هاڻي خريدو',
    checkoutTitle: 'شفاف سڌي چيڪ آئوٽ',
    priceBreakdown: 'شفاف قيمت ورهاست',
    customerPrice: 'اوهان جي ادا ڪيل ڪل قيمت',
    logisticsCost: 'سڌي ٽرانسپورٽ ۽ ڳوٺاڻو ڪورئير',
    platformFee: 'ڪلاسيتو سروس فيس (3%)',
    weaverEarnings: 'कारीगर جي सڌي कमाई (91%)',
    payWithUpi: 'UPI / QR ذريعي فوري ادائيگي ڪريو',
    orderConfirmed: 'آرڊر پڪو ٿي ويو!',
    trackStatus: 'آرڊر جي پيش رفت ٽريڪ ڪريو',
    recommendationsTitle: 'هن دستڪاري مان وڌيڪ',
    recommendationsEmpty: 'هن درجي جون وڌيڪ شيون جلد دستياب ٿينديون.'
  },
  ta: {
    weaverView: 'கைவினைஞர் டாஷ்போர்டு',
    buyerView: 'வாங்குபவர் பயன்முறை (வாடிக்கையாளர்)',
    languageName: 'தமிழ்',
    logoSub: 'கைவினைஞரிடமிருந்து வாங்குபவருக்கு நேரடி குரல் சந்தை',
    weaverDashboard: 'கைவினைஞர் டாஷ்போர்டு',
    addNewProduct: 'புதிய தயாரிப்பைச் சேர்க்கவும்',
    earningsSummary: 'எனது வருமானம்',
    availableEarnings: 'எடுக்கக்கூடிய தொகை',
    pendingPayments: 'நிலுவையில் (ஹோல்டு)',
    completedOrders: 'முடிக்கப்பட்ட ஆர்டர்கள்',
    readEarningsAloud: 'வருமானத்தை உரக்கப் படிக்கவும்',
    myListedProducts: 'எனது கைவினைப் பொருட்கள்',
    incomingOrders: 'அனுப்ப வேண்டிய செயலில் உள்ள ஆர்டர்கள்',
    markReady: 'பிக்அப்புக்குத் தயார் என குறிக்கவும்',
    qcChecklistTitle: 'அனுப்பும் முன் தர சோதனை',
    damageCheck: 'இந்தப் பொருளில் சேதம் அல்லது துளை இல்லை என்பதை நான் சரிபார்த்தேன்.',
    threadsCheck: 'தளர்வான அனைத்து நூல்களும் நேர்த்தியாக வெட்டப்பட்டுள்ளன.',
    stitchingCheck: 'தையல் மற்றும் விளிம்புகள் முழுமையாக சரிபார்க்கப்பட்டுள்ளன.',
    qcPhotoUpload: 'விருப்பத்தேர்வு: பேக் செய்யப்பட்ட மூட்டையின் புகைப்படத்தைப் பதிவேற்றவும்',
    cancel: 'ரத்து செய்',
    submitQc: 'குறியிட்டு பிக்அப்பை உறுதிசெய்யவும்',
    qaTitle: 'படிப்படியான தயாரிப்பு பட்டியலிடல்',
    microphoneTap: 'மைக்கை அழுத்தி பேசவும், அல்லது கீபோர்டைப் பயன்படுத்தவும்',
    typeFallback: 'தட்டச்சு செய்ய விரும்புகிறீர்களா? கீழே கீபோர்டைத் திறக்கவும்',
    speakInstead: 'மீண்டும் குரலுக்கு மாறவும்',
    back: 'திரும்பிச் செல்',
    next: 'சேமித்து அடுத்து',
    confirmListing: 'உறுதிசெய்ய கேளுங்கள் அல்லது படியுங்கள்',
    playAudio: '▶ பட்டியல் சுருக்கத்தைக் கேளுங்கள்',
    confirmAndPublish: '✓ சரி, இப்போது வெளியிடவும்',
    editDetails: '✕ இல்லை, விவரங்களைத் திருத்தவும்',
    buyerSearchPlaceholder: 'உங்களுக்கு என்ன வேண்டும் எனச் சொல்லுங்கள் (எ.கா: ₹5,000க்குள் பச்சை புடவை)...',
    searchTitle: 'கைவினைஞர் தயாரிப்பு தேடல்',
    weaverStory: 'கைவினைஞரின் கதை',
    hearWeaverStory: '▶ கைவினைஞரின் கதையைக் கேளுங்கள்',
    buyRightPanel: 'சரியாக வாங்குங்கள்: கைவினை விவரங்கள்',
    variationDisclaimer: 'கையால் செய்யப்பட்ட பொருட்கள் தனித்துவமானவை, புகைப்படத்திலிருந்து சற்று வேறுபடலாம்.',
    reviewCheckbox: 'சரியான அளவுகள் மற்றும் விவரங்களை நான் மதிப்பாய்வு செய்தேன்.',
    buyNow: 'இப்போது வாங்கு',
    checkoutTitle: 'வெளிப்படையான நேரடி செக்அவுட்',
    priceBreakdown: 'வெளிப்படையான விலை பிரிவு',
    customerPrice: 'நீங்கள் செலுத்தும் மொத்த விலை',
    logisticsCost: 'நேரடி போக்குவரத்து மற்றும் கிராமப்புற கூரியர்',
    platformFee: 'கலாசேது சேவைக் கட்டணம் (3%)',
    weaverEarnings: 'கைவினைஞரின் நேரடி வருமானம் (91%)',
    payWithUpi: 'UPI / QR மூலம் உடனடியாகச் செலுத்துங்கள்',
    orderConfirmed: 'ஆர்டர் உறுதி செய்யப்பட்டது!',
    trackStatus: 'ஆர்டர் முன்னேற்றத்தைக் கண்காணிக்கவும்',
    recommendationsTitle: 'இந்த கைவினையிலிருந்து மேலும்',
    recommendationsEmpty: 'இந்த வகையின் கூடுதல் பொருட்கள் விரைவில் கிடைக்கும்.'
  },
  te: {
    weaverView: 'కళాకారుడు డాష్‌బోర్డ్',
    buyerView: 'కొనుగోలుదారు మోడ్ (వినియోగదారు)',
    languageName: 'తెలుగు',
    logoSub: 'కళాకారుడి నుండి కొనుగోలుదారుకు నేరుగా వాయిస్ మార్కెట్',
    weaverDashboard: 'కళాకారుడు డాష్‌బోర్డ్',
    addNewProduct: 'కొత్త ఉత్పత్తిని జోడించండి',
    earningsSummary: 'నా సంపాదన',
    availableEarnings: 'ఉపసంహరణకు అందుబాటులో ఉంది',
    pendingPayments: 'పెండింగ్ (హోల్డ్)',
    completedOrders: 'పూర్తయిన ఆర్డర్‌లు',
    readEarningsAloud: 'సంపాదనను బిగ్గరగా చదవండి',
    myListedProducts: 'నా హస్తకళా ఉత్పత్తులు',
    incomingOrders: 'పంపవలసిన క్రియాశీల ఆర్డర్‌లు',
    markReady: 'పికప్ కోసం సిద్ధంగా గుర్తించండి',
    qcChecklistTitle: 'పంపే ముందు నాణ్యత తనిఖీ',
    damageCheck: 'ఈ ఉత్పత్తిలో ఏ నష్టం లేదా రంధ్రం లేదని నేను తనిఖీ చేసాను.',
    threadsCheck: 'అన్ని వదులుగా ఉన్న దారాలు చక్కగా కత్తిరించబడ్డాయి.',
    stitchingCheck: 'కుట్టు మరియు అంచులు పూర్తిగా తనిఖీ చేయబడ్డాయి.',
    qcPhotoUpload: 'ఐచ్ఛికం: ప్యాక్ చేసిన బండిల్ ఫోటోను అప్‌లోడ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    submitQc: 'గుర్తించి పికప్‌ను నిర్ధారించండి',
    qaTitle: 'దశల వారీగా ఉత్పత్తి జాబితా',
    microphoneTap: 'మైక్ నొక్కి మాట్లాడండి, లేదా కీబోర్డ్ ఉపయోగించండి',
    typeFallback: 'టైప్ చేయాలనుకుంటున్నారా? కింద కీబోర్డ్ తెరవండి',
    speakInstead: 'మళ్లీ వాయిస్‌కు వెళ్లండి',
    back: 'వెనక్కి వెళ్లండి',
    next: 'సేవ్ చేసి తదుపరి',
    confirmListing: 'నిర్ధారించడానికి వినండి లేదా చదవండి',
    playAudio: '▶ జాబితా సారాంశం వినండి',
    confirmAndPublish: '✓ సరే, ఇప్పుడే ప్రచురించండి',
    editDetails: '✕ వద్దు, వివరాలు సవరించండి',
    buyerSearchPlaceholder: 'మీకు ఏమి కావాలో వివరించండి (ఉదా: ₹5,000లోపు ఆకుపచ్చ చీర)...',
    searchTitle: 'కళాకారుడి ఉత్పత్తి శోధన',
    weaverStory: 'కళాకారుడి కథ',
    hearWeaverStory: '▶ కళాకారుడి కథను వినండి',
    buyRightPanel: 'సరిగ్గా కొనండి: చేతితో తయారు చేసిన వివరాలు',
    variationDisclaimer: 'చేతితో తయారు చేసిన ఉత్పత్తులు ప్రత్యేకమైనవి, ఫోటో నుండి కొద్దిగా తేడా ఉండవచ్చు.',
    reviewCheckbox: 'నేను ఖచ్చితమైన కొలతలు మరియు వివరాలను సమీక్షించాను.',
    buyNow: 'ఇప్పుడే కొనండి',
    checkoutTitle: 'పారదర్శక ప్రత్యక్ష చెక్అవుట్',
    priceBreakdown: 'పారదర్శక ధర విభజన',
    customerPrice: 'మీరు చెల్లించే మొత్తం ధర',
    logisticsCost: 'ప్రత్యక్ష రవాణా మరియు గ్రామీణ కొరియర్',
    platformFee: 'కలాసేతు సేవా రుసుము (3%)',
    weaverEarnings: 'కళాకారుడి ప్రత్యక్ష సంపాదన (91%)',
    payWithUpi: 'UPI / QR ద్వారా వెంటనే చెల్లించండి',
    orderConfirmed: 'ఆర్డర్ నిర్ధారించబడింది!',
    trackStatus: 'ఆర్డర్ పురోగతిని ట్రాక్ చేయండి',
    recommendationsTitle: 'ఈ హస్తకళ నుండి మరిన్ని',
    recommendationsEmpty: 'ఈ వర్గంలోని మరిన్ని ఉత్పత్తులు త్వరలో అందుబాటులోకి వస్తాయి.'
  }
};

// Every selectable language, in Master Spec Section 10 order, with its own native display name
// (English is always the base/fallback and stays first).
export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  'en', 'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok',
  'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd', 'ta', 'te'
].map((code) => ({ code: code as Language, label: TRANSLATIONS[code as Language].languageName }));

export const QA_QUESTIONS = [
  {
    key: 'title',
    label: {
      en: 'What have you made?',
      kn: 'ನೀವು ಏನು ತಯಾರಿಸಿದ್ದೀರಿ?',
      hi: 'आपने क्या बनाया है?'
    },
    hint: {
      en: 'Describe your product (e.g. Silk Saree, Cotton Veshti, Shawl...)',
      kn: 'ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ವಿವರಿಸಿ (ಉದಾ: ರೇಷ್ಮೆ ಸೀರೆ, ಹತ್ತಿ ಪಂಚೆ, ಶಾಲು...)',
      hi: 'अपने उत्पाद का नाम बताएं (जैसे: रेशमी साड़ी, सूती धोती, शॉल...)'
    },
    examples: {
      en: ['Ilkal Cotton Saree', 'Pochampally Ikat Dress Material', 'Kasavu Mundu'],
      kn: ['ಇಳಕಲ್ ಹತ್ತಿ ಸೀರೆ', 'ಪೋಚಂಪಲ್ಲಿ ಇಕ್ಕತ್ ಬಟ್ಟೆ', 'ಕಸವು ಮುಂಡು'],
      hi: ['इल्कल सूती साड़ी', 'पोचंपल्ली इकत सूट मटेरियल', 'कासावू मुंडू']
    }
  },
  {
    key: 'material',
    label: {
      en: 'What material did you use?',
      kn: 'ನೀವು ಯಾವ ಬಟ್ಟೆ/ದಾರ ಬಳಸಿದ್ದೀರಿ?',
      hi: 'आपने किस सामग्री (कपड़े/धागे) का उपयोग किया है?'
    },
    hint: {
      en: 'Mention the yarn (e.g. Mulberry Silk, Organic Cotton, Zari, Wool...)',
      kn: 'ದಾರವನ್ನು ಉಲ್ಲೇಖಿಸಿ (ಉದಾ: ರೇಷ್ಮೆ ದಾರ, ಸಾವಯವ ಹತ್ತಿ, ಜರಿ, ಉಣ್ಣೆ...)',
      hi: 'धागा बताएं (जैसे: शहतूत रेशम, जैविक कपास, जरी, ऊन...)'
    },
    examples: {
      en: ['Pure Mulberry Silk and fine Gold Zari', '80% Local Cotton and 20% Silk', 'Unbleached Organic Cotton'],
      kn: ['ಶುದ್ಧ ರೇಷ್ಮೆ ಮತ್ತು ನಿಖರ ಚಿನ್ನದ ಜರಿ', '೮೦% ಹತ್ತಿ ಮತ್ತು ೨೦% ರೇಷ್ಮೆ', 'ಸಾವಯವ ಹತ್ತಿ'],
      hi: ['शुद्ध शहतूत रेशम और बढ़िया सोने की जरी', '80% स्थानीय कपास और 20% रेशम', 'बिना ब्लीच किया हुआ जैविक कपास']
    }
  },
  {
    key: 'dimensions',
    label: {
      en: 'What are its length and width?',
      kn: 'ಇದರ ಉದ್ದ ಮತ್ತು ಅಗಲ ಎಷ್ಟು?',
      hi: 'इसकी लंबाई और चौड़ाई क्या है?'
    },
    hint: {
      en: 'Enter measurements (e.g., saree is usually 5.5m by 1.1m)',
      kn: 'ಅಳತೆಗಳನ್ನು ನಮೂದಿಸಿ (ಉದಾ: ಸೀರೆ ಸಾಮಾನ್ಯವಾಗಿ ೫.೫ ಮೀಟರ್ ಉದ್ದ ಮತ್ತು ೧.೧ ಮೀಟರ್ ಅಗಲವಿರುತ್ತದೆ)',
      hi: 'माप दर्ज करें (जैसे: साड़ी आमतौर पर 5.5 मीटर लंबी और 1.1 मीटर चौड़ी होती है)'
    },
    isMeasurements: true
  },
  {
    key: 'specialFeatures',
    label: {
      en: 'What makes this piece special or unique?',
      kn: 'ಇದರ ವಿಶೇಷತೆ ಅಥವಾ ವಿಶಿಷ್ಟತೆ ಏನು?',
      hi: 'यह कपड़ा क्यों विशेष या अनोखा है?'
    },
    hint: {
      en: 'Explain the weave, border, color, or inspiration (e.g., hand-loomed with natural dyes, double ikat geometry)',
      kn: 'ನೇಯ್ಗೆ ಶೈಲಿ, ಬಾರ್ಡರ್ ಅಥವಾ ಬಣ್ಣಗಳ ಕಥೆ ಹೇಳಿ (ಉದಾ: ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳು, ದೇವಸ್ಥಾನದ ಜರಿ ಬಾರ್ಡರ್)',
      hi: 'बुनाई, बॉर्डर, रंग या डिजाइन की कहानी बताएं (जैसे: प्राकृतिक रंगों से हाथ से बुना, मंदिर का जरी बॉर्डर)'
    },
    examples: {
      en: ['Traditional double-ikat pattern with chemical-free indigo dye.', 'Unique Tope Teni pallu joined with interlocking loops.', 'Woven only during early morning hours to keep yarn tension perfect.'],
      kn: ['ನೈಸರ್ಗಿಕ ಇಂಡಿಗೋ ಬಣ್ಣದೊಂದಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಡಬಲ್-ಇಕ್ಕತ್ ವಿನ್ಯಾಸ.', 'ಮಧ್ಯೆ ಇಂಟರ್‌ಲಾಕ್ ನೇಯ್ಗೆಯಿಂದ ಜೋಡಿಸಿದ ತೋಪ್ ತೇಣಿ ಪಲ್ಲು.', 'ದಾರದ ಬಿಗಿತವನ್ನು ಕಾಪಾಡಲು ಬೆಳಗಿನ ಜಾವ ಮಾತ್ರ ನೇಯ್ದದ್ದು.'],
      hi: ['बिना रसायनों के नील रंग का उपयोग और पारंपरिक डबल-इकत पैटर्न।', 'विशेष टोप तेनी पल्लू जिसे इंटरलॉकिंग लूप के साथ जोड़ा गया है।', 'धागे का खिंचाव सही रखने के लिए सुबह के समय ही बुनाई की गई है।']
    }
  },
  {
    key: 'price',
    label: {
      en: 'What price would you like to sell it for?',
      kn: 'ನೀವು ಇದನ್ನು ಎಷ್ಟು ಬೆಲೆಗೆ ಮಾರಾಟ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?',
      hi: 'आप इसे किस कीमत पर बेचना चाहते हैं?'
    },
    hint: {
      en: 'We recommend ₹3,000 to ₹6,000 for standard handlooms. Input numbers only.',
      kn: 'ಸಾಮಾನ್ಯ ಕೈಮಗ್ಗ ಸೀರೆಗಳಿಗೆ ₹೩,೦೦೦ ರಿಂದ ₹೬,೦೦೦ ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ. ಕೇವಲ ಸಂಖ್ಯೆಗಳನ್ನು ನಮೂದಿಸಿ.',
      hi: 'हम मानक हथकरघा के लिए ₹3,000 से ₹6,000 की सलाह देते हैं। केवल अंक लिखें।'
    },
    isPrice: true
  }
];

// High fidelity voice synthesis fallback sounds using Web Audio API in case browser synthesis isn't active
export function playSyntheticChime(type: 'success' | 'record' | 'stop' | 'click' | 'speech') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'record') {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.2); // E4
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'stop') {
      osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15); // A4
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'click') {
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'speech') {
      // Simulate speech-like clicks or warbles
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.warn('Web Audio API not supported or blocked:', e);
  }
}

// Safely reads a per-language dictionary that hasn't been (or can't yet be) filled in for every
// target language: falls back to the English entry so a screen is never blank/broken for a
// language whose translation is still pending, per the "correct fallback behavior" requirement.
export function pickLang<T>(dict: { en: T } & Record<string, T | undefined>, lang: string): T {
  return dict[lang] ?? dict.en;
}

// Converts Devanagari (०-९) and Kannada (೦-೯) digit characters to ASCII so voice transcripts
// in any supported script can still be parsed as numbers by parseInt/parseFloat.
export function normalizeSpokenNumerals(text: string): string {
  return text.replace(/[०-९೦-೯]/g, (ch) => {
    const code = ch.codePointAt(0)!;
    // Devanagari digits: U+0966-U+096F, Kannada digits: U+0CE6-U+0CEF
    const base = code >= 0x0CE6 ? 0x0CE6 : 0x0966;
    return String(code - base);
  });
}

// Extracts up to two numbers (length, width) from a free-form voice/typed dimensions answer,
// e.g. "length 5.5 meters and width 1.1 meters" or "5.5 by 1.1 meters". Returns null when no
// number could be found, so callers can fall back to whatever dimensions are already set.
export function parseSpokenDimensions(text: string): { length: string; width: string } | null {
  const normalized = normalizeSpokenNumerals(text);
  const numbers = normalized.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length === 0) return null;

  const unitMatch = normalized.match(/meter|metre|मीटर|ಮೀಟರ್|inch|इंच|ಇಂಚ್|feet|foot|फुट|ಅಡಿ/i);
  const unit = unitMatch ? unitMatch[0] : 'meters';

  const length = `${numbers[0]} ${unit}`;
  const width = `${numbers[1] || numbers[0]} ${unit}`;
  return { length, width };
}

// Client-side Conversational NLP Parser for the demo
export function parseConversationalSearch(query: string): SearchFilters {
  const lowercase = query.toLowerCase();
  const filters: SearchFilters = {};

  // Parse color
  const colors = ['green', 'red', 'yellow', 'saffron', 'blue', 'indigo', 'white', 'white gold', 'gold', 'crimson'];
  for (const c of colors) {
    if (lowercase.includes(c)) {
      filters.color = c.charAt(0).toUpperCase() + c.slice(1);
    }
  }
  if (lowercase.includes('ಹಸಿರು') || lowercase.includes('green')) filters.color = 'Green';
  if (lowercase.includes('ಕೆಂಪು') || lowercase.includes('red')) filters.color = 'Red';
  if (lowercase.includes('ಹಳದಿ') || lowercase.includes('yellow')) filters.color = 'Yellow';
  if (lowercase.includes('ನೀಲಿ') || lowercase.includes('blue')) filters.color = 'Blue';

  // Parse budget / price
  const budgetMatch = lowercase.match(/(?:under|below|less than|within|₹|\brs\.?\s*)\s*(\d+[,.]?\d*)/i);
  if (budgetMatch) {
    const amount = parseInt(budgetMatch[1].replace(/,/g, ''));
    if (!isNaN(amount)) {
      filters.maxBudget = amount;
    }
  } else {
    // Check Kannada/Hindi script numbers or general keywords
    if (lowercase.includes('5000') || lowercase.includes('೫೦೦೦') || lowercase.includes('५०००')) {
      filters.maxBudget = 5000;
    } else if (lowercase.includes('2000') || lowercase.includes('೨೦೦೦') || lowercase.includes('२०००')) {
      filters.maxBudget = 2000;
    } else if (lowercase.includes('10000') || lowercase.includes('೧೦೦೦೦') || lowercase.includes('१००००')) {
      filters.maxBudget = 10000;
    }
  }

  // Parse material
  if (lowercase.includes('cotton') || lowercase.includes('ಹತ್ತಿ') || lowercase.includes('सूती') || lowercase.includes('सूति')) {
    filters.material = 'Cotton';
  } else if (lowercase.includes('silk') || lowercase.includes('ರೇಷ್ಮೆ') || lowercase.includes('रेशम') || lowercase.includes('रेशमी')) {
    filters.material = 'Silk';
  }

  // Parse Occasion / Style
  if (lowercase.includes('wedding') || lowercase.includes('marriage') || lowercase.includes('ಲಗ್ನ') || lowercase.includes('ಮದುವೆ') || lowercase.includes('शादी') || lowercase.includes('विवाह')) {
    filters.occasion = 'Wedding';
  } else if (lowercase.includes('festival') || lowercase.includes('festive') || lowercase.includes('ಹಬ್ಬ') || lowercase.includes('त्योहार') || lowercase.includes('पूजा')) {
    filters.occasion = 'Festive';
  }

  if (lowercase.includes('summer') || lowercase.includes('lightweight') || lowercase.includes('ಹಗುರ') || lowercase.includes('breathable') || lowercase.includes('हल्की')) {
    filters.style = 'Lightweight';
  } else if (lowercase.includes('traditional') || lowercase.includes('heavy') || lowercase.includes('ಸಾಂಪ್ರದಾಯಿಕ') || lowercase.includes('पारंपरिक')) {
    filters.style = 'Traditional';
  }

  return filters;
}

// Sample Voice Responses for Q&A inputs
export const SIMULATED_VOICE_SPEECHES = {
  title: [
    "This is a Pochampally Ikat Silk Saree in orange",
    "Traditional Ilkal Saree with red border",
    "Lightweight unbleached Kerala cotton Mundu set",
    "Soft green cotton saree with direct floral block prints"
  ],
  material: [
    "It is made of pure high-grade mulberry silk with fine golden border threads",
    "I used eighty percent pure handspun cotton yarn and twenty percent mercerized silk",
    "It is pure natural organic cotton without any chemicals or artificial bleach"
  ],
  dimensions: [
    "The length is five point five meters and width is one point one meters",
    "It is four meters long and one point two meters wide",
    "Standard saree size, five and a half meters"
  ],
  specialFeatures: [
    "It features beautiful custom Kasuti embroidery hand-stitched by women artisans in our village cooperative.",
    "It has double ikat geometric patterns where both warp and weft are dyed beforehand.",
    "The border has fine golden temple motifs which are woven extremely slowly over three days."
  ],
  price: [
    "I would like to sell it for four thousand five hundred rupees",
    "Two thousand five hundred rupees is my expected price",
    "Twelve thousand rupees because it took eighteen days to weave"
  ]
};

export const CURATED_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'gov-scheme-1',
    title: 'National Handloom Development Programme (NHDP)',
    agency: 'Ministry of Textiles, Govt. of India',
    description: 'Comprehensive financial support for handloom weaver cooperatives and individual artisans for loom upgrades, raw material subsidies, and cluster development.',
    benefitSummary: 'Up to ₹2,00,000 for lighting and advanced loom accessories + 10% yarn subsidy',
    eligibilityCrafts: ['Handloom & Textiles', 'Embroidery', 'Sarees & Textiles'],
    applicableStates: ['Karnataka', 'Telangana', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'West Bengal', 'Uttar Pradesh', 'All India'],
    linkUrl: 'https://handlooms.nic.in/',
    category: 'Subsidy'
  },
  {
    id: 'gov-scheme-2',
    title: 'Handloom Mark & Silk Mark Certification Grant',
    agency: 'Textiles Committee & Silk Mark Organisation of India',
    description: 'Provides 100% reimbursement for small artisans and cooperatives to obtain official Handloom Mark and Silk Mark holographic tags to protect against powerloom counterfeits.',
    benefitSummary: 'Free registration + 500 holographic authenticity tags per weaver',
    eligibilityCrafts: ['Handloom & Textiles', 'Sarees & Textiles'],
    applicableStates: ['All India'],
    linkUrl: 'http://textilescommittee.nic.in/',
    category: 'GI & Heritage'
  },
  {
    id: 'gov-scheme-3',
    title: 'Pradhan Mantri MUDRA Yojana (Shishu & Kishore)',
    agency: 'SIDBI & Scheduled Commercial Banks',
    description: 'Collateral-free institutional credit loans specifically tailored for solo artisans, self-help groups, and rural master craftsmen to purchase raw silk/cotton in bulk.',
    benefitSummary: 'Collateral-free loan up to ₹50,000 (Shishu) to ₹5,00,000 (Kishore) at low interest',
    eligibilityCrafts: ['Handloom & Textiles', 'Pottery & Ceramics', 'Woodcraft', 'Metalcraft', 'Jewellery', 'Leathercraft', 'Bamboo & Cane', 'Embroidery'],
    applicableStates: ['All India'],
    linkUrl: 'https://www.mudra.org.in/',
    category: 'Credit'
  },
  {
    id: 'gov-scheme-4',
    title: 'PM VIKAS (Vishwakarma Kaushal Samman)',
    agency: 'Ministry of Micro, Small & Medium Enterprises',
    description: 'End-to-end support for traditional artisans including toolkit incentive, modern design training, brand building, and direct e-commerce onboarding linkage.',
    benefitSummary: '₹15,000 toolkit grant + ₹500/day stipend during skill upgrade training',
    eligibilityCrafts: ['Woodcraft', 'Metalcraft', 'Pottery & Ceramics', 'Bamboo & Cane', 'Folk Painting', 'Traditional Toys'],
    applicableStates: ['All India'],
    linkUrl: 'https://pmvishwakarma.gov.in/',
    category: 'Infrastructure'
  },
  {
    id: 'gov-scheme-5',
    title: 'Handicraft & Handloom Export Promotion Subsidy (MEIS/RoDTEP)',
    agency: 'Directorate General of Foreign Trade (DGFT)',
    description: 'Duty drawback and export incentive scheme for registered artisan cooperatives, SHGs, and exporters shipping Indian heritage crafts globally.',
    benefitSummary: '3.5% to 6% rebate on FOB export value + freight subsidies for craft fairs',
    eligibilityCrafts: ['Handloom & Textiles', 'Woodcraft', 'Metalcraft', 'Embroidery', 'Jewellery'],
    applicableStates: ['All India'],
    linkUrl: 'https://dgft.gov.in/',
    category: 'Export'
  },
  {
    id: 'gov-scheme-6',
    title: 'Geographical Indication (GI) Registration Financial Support',
    agency: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    description: 'Financial assistance and legal support for artisan societies to register local authentic crafts under GI registry and enforce GI legal rights.',
    benefitSummary: '100% grant for GI registration application + legal defense fund',
    eligibilityCrafts: ['Handloom & Textiles', 'Pottery & Ceramics', 'Woodcraft', 'Metalcraft', 'Folk Painting'],
    applicableStates: ['Karnataka', 'Telangana', 'Odisha', 'Tamil Nadu', 'All India'],
    linkUrl: 'https://ipindia.gov.in/',
    category: 'GI & Heritage'
  }
];

// Raw-material cluster/bulk-buying: a curated static list (like the schemes panel above) rather
// than a live marketplace - artisans "join" a group buy, recorded locally.
export const CURATED_MATERIAL_CLUSTERS: MaterialClusterRequest[] = [
  {
    id: 'cluster-1',
    materialName: 'Mulberry Silk Yarn (Grade A)',
    craft: 'Handloom & Textiles',
    region: 'Bagalkot, Karnataka',
    targetQuantity: '200 kg',
    pricePerUnitEstimate: '₹6,200/kg (bulk) vs ₹7,800/kg (solo)',
    organizerName: 'Gudikal Weavers Co-operative',
    deadline: '2026-10-15',
    joinedArtisanIds: []
  },
  {
    id: 'cluster-2',
    materialName: 'Gold Zari Thread',
    craft: 'Handloom & Textiles',
    region: 'Bagalkot, Karnataka',
    targetQuantity: '50 kg',
    pricePerUnitEstimate: '₹9,500/kg (bulk) vs ₹11,000/kg (solo)',
    organizerName: 'Ilkal Artisan Cluster',
    deadline: '2026-10-20',
    joinedArtisanIds: []
  },
  {
    id: 'cluster-3',
    materialName: 'Natural Indigo Dye Blocks',
    craft: 'Handloom & Textiles',
    region: 'Karnataka & Telangana',
    targetQuantity: '80 kg',
    pricePerUnitEstimate: '₹1,400/kg (bulk) vs ₹1,900/kg (solo)',
    organizerName: 'Deccan Natural Dyers SHG',
    deadline: '2026-11-01',
    joinedArtisanIds: []
  }
];

export const DEMAND_INTELLIGENCE_DATA = {
  trendingCrafts: [
    { craft: 'Ilkal Silk & Kasuti Embroidery', demandIndex: 94, growth: '+28%', peakSeason: 'Diwali & Wedding Season', topSearchTerms: ['Kasuti pallu', 'pure silk green saree'] },
    { craft: 'Pochampally Double Ikat', demandIndex: 88, growth: '+22%', peakSeason: 'Navratri & Festival Season', topSearchTerms: ['Geometric ikat', 'gold zari saree'] },
    { craft: 'Natural Indigo Cotton Handloom', demandIndex: 82, growth: '+35%', peakSeason: 'Summer & Daily Wear', topSearchTerms: ['Vegetable dye', 'organic cotton'] },
    { craft: 'Kerala Traditional Mundu', demandIndex: 79, growth: '+18%', peakSeason: 'Onam & Vishu', topSearchTerms: ['Golden border mundu', 'unbleached cotton'] }
  ],
  seasonalForecasts: [
    { period: 'Oct - Nov (Festival Peak)', expectedSpike: '+45% Surge', recommendedPrep: 'Stock pure silk sarees with gold zari and traditional festive colors (Red, Saffron, Emerald Green).' },
    { period: 'Dec - Feb (Wedding Season)', expectedSpike: '+35% Surge', recommendedPrep: 'Focus on heavy bridal double-ikat sarees, Kasuti embroidery, and bulk wedding gift sets.' },
    { period: 'Mar - May (Summer Casuals)', expectedSpike: '+20% Surge', recommendedPrep: 'Increase production of breathable fine organic cotton daily wear sarees, dupattas, and mundus.' }
  ]
};
