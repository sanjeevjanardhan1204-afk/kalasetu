import { Product, Order, Language, Translation, SearchFilters, GovernmentScheme } from './types';

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
        description: 'Shipped via Taana Premium Logistics.'
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
    platformFee: 'Taana Tech Fee (3%)',
    weaverEarnings: 'Artisan Direct Earnings (91%)',
    payWithUpi: 'Pay Instantly with UPI / QR',
    orderConfirmed: 'Order Confirmed!',
    trackStatus: 'Track Order Progress',
    recommendationsTitle: 'More from this craft',
    recommendationsEmpty: 'More products from this category will be available soon.'
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
    platformFee: 'ತಂತುಲಿಂಕ್ ಸೇವಾ ಶುಲ್ಕ (೩%)',
    weaverEarnings: 'ಕುಶಲಕರ್ಮಿಯ ನೇರ ಆದಾಯ (೯೧%)',
    payWithUpi: 'UPI / QR ಮೂಲಕ ತಕ್ಷಣ ಪಾವತಿಸಿ',
    orderConfirmed: 'ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    trackStatus: 'ಆರ್ಡರ್ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    recommendationsTitle: 'ಈ ಕರಕುಶಲ ವರ್ಗದ ಇನ್ನಷ್ಟು ಉತ್ಪನ್ನಗಳು',
    recommendationsEmpty: 'ಈ ವರ್ಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಇನ್ನಷ್ಟು ಉತ್ಪನ್ನಗಳು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿವೆ.'
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
    platformFee: 'तंतुलिंक सेवा शुल्क (3%)',
    weaverEarnings: 'कारीगर की सीधी कमाई (91%)',
    payWithUpi: 'UPI / QR द्वारा तुरंत भुगतान करें',
    orderConfirmed: 'ऑर्डर की पुष्टि हो गई!',
    trackStatus: 'ऑर्डर ट्रैकिंग',
    recommendationsTitle: 'इस शिल्प श्रेणी के और उत्पाद',
    recommendationsEmpty: 'इस श्रेणी से जुड़े और उत्पाद जल्द उपलब्ध होंगे।'
  }
};

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
