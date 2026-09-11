/**
 * Taana Structured Database Schemas & Conflict Resolution Specifications
 * Defines relational PostgreSQL / SQLite schemas, table constraints, indexes,
 * and Last-Write-Wins (LWW) optimistic concurrency control structures.
 */

export interface DBWeaver {
  id: string;
  phone: string;
  name: string;
  regional_language: 'kn' | 'hi' | 'en';
  bio?: string;
  region: string;
  profile_image: string;
  upi_id?: string;
  kyc_status: 'verified' | 'pending' | 'rejected';
  created_at: number; // Unix timestamp in ms
  updated_at: number; // Unix timestamp in ms
  version: number;
}

export interface DBProduct {
  id: string;
  weaver_id: string;
  title_en: string;
  title_kn?: string;
  title_hi?: string;
  material: string;
  price: number;
  length_m: number;
  width_m: number;
  special_features: string[];
  description: string;
  images: string[];
  care_instructions?: string[];
  status: 'available' | 'sold' | 'reserved' | 'draft';
  created_at: number;
  updated_at: number;
  client_timestamp: number; // For Last-Write-Wins arbitration
  version: number;
}

export interface DBOrder {
  id: string;
  product_id: string;
  buyer_name: string;
  buyer_address: string;
  phone: string;
  order_date: string;
  status: 'placed' | 'confirmed' | 'qc_passed' | 'dispatched' | 'delivered' | 'cancelled';
  tracking_history: Array<{
    status: string;
    label: string;
    timestamp: string;
    notes?: string;
  }>;
  payment_status: 'escrow_locked' | 'payout_released' | 'refunded';
  payout_status: 'pending' | 'escrow_held' | 'released_to_weaver';
  created_at: number;
  updated_at: number;
  client_timestamp: number; // For Last-Write-Wins arbitration
  version: number;
}

export interface DBOfflineOutboxQueue {
  id: string;
  action_type: 'NEW_PRODUCT' | 'QC_SUBMIT' | 'NEW_ORDER' | 'UPDATE_ORDER_STATUS' | 'UPDATE_PROFILE';
  entity_type: 'product' | 'order' | 'weaver';
  entity_id: string;
  payload: Record<string, any>;
  client_timestamp: number; // Client local epoch when action occurred
  server_timestamp?: number; // Server epoch when sync received
  sync_status: 'queued' | 'synced' | 'conflict_resolved' | 'failed';
  retry_count: number;
  conflict_resolution_policy: 'LAST_WRITE_WINS';
  created_at: number;
}

export interface DBSyncConflictLog {
  id: string;
  outbox_item_id: string;
  entity_type: string;
  entity_id: string;
  client_payload: Record<string, any>;
  server_payload: Record<string, any>;
  client_timestamp: number;
  server_timestamp: number;
  winning_side: 'client' | 'server';
  resolution_strategy: 'LAST_WRITE_WINS';
  resolved_payload: Record<string, any>;
  created_at: number;
}

export interface DBGiVerification {
  id: string;
  product_id: string;
  product_name: string;
  registration_number: string;
  origin: string;
  state_region: string;
  category: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verification_date?: string;
  verification_source?: string;
  submitted_at: string;
  notes?: string;
}

export interface DBPaymentMilestone {
  id: string;
  order_id: string;
  name: 'ORDER CONFIRMED' | 'CRAFTING / MAKING' | 'DELIVERED';
  percentage: number;
  amount: number;
  status: 'PENDING' | 'RELEASED';
  released_at?: string;
  transaction_id?: string;
}

export interface DBDispute {
  id: string;
  order_id: string;
  buyer_name: string;
  reason: string;
  description: string;
  evidence_url?: string;
  status: 'OPEN' | 'UNDER REVIEW' | 'RESOLVED' | 'REFUNDED' | 'PAYMENT RELEASED';
  artisan_response?: string;
  artisan_responded_at?: string;
  admin_notes?: string;
  requested_info?: string;
  created_at: string;
  updated_at: string;
}

export interface DBTransactionHistory {
  id: string;
  order_id: string;
  type: 'PAYMENT_SECURED' | 'MILESTONE_RELEASE' | 'REFUND' | 'PARTIAL_REFUND';
  amount: number;
  milestone_name?: string;
  status: 'SUCCESS';
  timestamp: string;
  description: string;
  is_demo: boolean;
}

/**
 * Raw SQL Migration Definitions for PostgreSQL / SQLite
 */
export const DATABASE_SQL_DDL = `
-- ==========================================================
-- TAANA DATABASE DDL (PostgreSQL & SQLite Compatible)
-- Supports Offline-First Outbox Synchronization & LWW Locking
-- ==========================================================

CREATE TABLE IF NOT EXISTS weavers (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    regional_language TEXT NOT NULL DEFAULT 'kn',
    bio TEXT,
    region TEXT NOT NULL,
    profile_image TEXT NOT NULL,
    upi_id TEXT,
    kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK(kyc_status IN ('verified', 'pending', 'rejected')),
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    weaver_id TEXT NOT NULL REFERENCES weavers(id) ON DELETE CASCADE,
    title_en TEXT NOT NULL,
    title_kn TEXT,
    title_hi TEXT,
    material TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    length_m NUMERIC(5, 2) NOT NULL,
    width_m NUMERIC(5, 2) NOT NULL,
    special_features JSON NOT NULL DEFAULT '[]',
    description TEXT NOT NULL,
    images JSON NOT NULL DEFAULT '[]',
    care_instructions JSON DEFAULT '[]',
    gi_status TEXT DEFAULT 'PENDING' CHECK(gi_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'NONE')),
    gi_registration_number TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'sold', 'reserved', 'draft')),
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    client_timestamp BIGINT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS product_gi_verifications (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    origin TEXT NOT NULL,
    state_region TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verification_date TEXT,
    verification_source TEXT,
    submitted_at TEXT NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    buyer_name TEXT NOT NULL,
    buyer_address TEXT NOT NULL,
    phone TEXT NOT NULL,
    order_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'placed' CHECK(status IN ('placed', 'confirmed', 'qc_passed', 'dispatched', 'delivered', 'cancelled')),
    tracking_history JSON NOT NULL DEFAULT '[]',
    payment_status TEXT NOT NULL DEFAULT 'escrow_locked' CHECK(payment_status IN ('escrow_locked', 'payout_released', 'refunded')),
    payout_status TEXT NOT NULL DEFAULT 'escrow_held' CHECK(payout_status IN ('pending', 'escrow_held', 'released_to_weaver')),
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    client_timestamp BIGINT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS payment_milestones (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK(name IN ('ORDER CONFIRMED', 'CRAFTING / MAKING', 'DELIVERED')),
    percentage NUMERIC(5, 2) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'RELEASED')),
    released_at TEXT,
    transaction_id TEXT
);

CREATE TABLE IF NOT EXISTS order_disputes (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'UNDER REVIEW', 'RESOLVED', 'REFUNDED', 'PAYMENT RELEASED')),
    artisan_response TEXT,
    artisan_responded_at TEXT,
    admin_notes TEXT,
    requested_info TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_history (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('PAYMENT_SECURED', 'MILESTONE_RELEASE', 'REFUND', 'PARTIAL_REFUND')),
    amount NUMERIC(10, 2) NOT NULL,
    milestone_name TEXT,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    timestamp TEXT NOT NULL,
    description TEXT NOT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS offline_outbox_queue (
    id TEXT PRIMARY KEY,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSON NOT NULL,
    client_timestamp BIGINT NOT NULL,
    server_timestamp BIGINT,
    sync_status TEXT NOT NULL DEFAULT 'queued' CHECK(sync_status IN ('queued', 'synced', 'conflict_resolved', 'failed')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    conflict_resolution_policy TEXT NOT NULL DEFAULT 'LAST_WRITE_WINS',
    created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_conflict_logs (
    id TEXT PRIMARY KEY,
    outbox_item_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    client_payload JSON NOT NULL,
    server_payload JSON NOT NULL,
    client_timestamp BIGINT NOT NULL,
    server_timestamp BIGINT NOT NULL,
    winning_side TEXT NOT NULL CHECK(winning_side IN ('client', 'server')),
    resolution_strategy TEXT NOT NULL DEFAULT 'LAST_WRITE_WINS',
    resolved_payload JSON NOT NULL,
    created_at BIGINT NOT NULL
);

-- Indices for rapid queries and rural sync burst lookups
CREATE INDEX IF NOT EXISTS idx_products_weaver ON products(weaver_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON offline_outbox_queue(sync_status);
CREATE INDEX IF NOT EXISTS idx_outbox_client_time ON offline_outbox_queue(client_timestamp);
`;
