// Real, file-based SQLite persistence layer. No external services, no accounts, no connection
// strings - the database file is created automatically on first run at data/kalasetu.db.
//
// Design note: `products` and `orders` keep a full JSON snapshot in their `data` column (matching
// the exact shape the rest of the app already reads/writes) alongside indexed scalar columns
// (status, price, weaver_name, etc.) for real querying. This avoids a lossy relational rewrite of
// deeply nested fields (dimensions, giInfo, tracking history, payment milestones) while still
// being a real, queryable, durable SQLite table - not a fake DB. `disputes`, `gi_records` and
// `milestones` are additionally kept as their own normalized tables (denormalized out of
// orders/products) so they exist as real, independently-queryable tables as requested.
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'kalasetu.db');
const isNewDatabase = !fs.existsSync(DB_PATH);

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK(role IN ('artisan','consumer','admin')),
    account_subtype TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    region TEXT,
    craft_type TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS producer_capacity (
    account_id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    weekly_limit INTEGER,
    monthly_limit INTEGER,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    weaver_name TEXT,
    price REAL,
    status TEXT,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    status TEXT,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    type TEXT,
    amount REAL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS disputes (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    status TEXT,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gi_records (
    product_id TEXT PRIMARY KEY,
    status TEXT,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    status TEXT,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_order ON transactions(order_id);
  CREATE INDEX IF NOT EXISTS idx_disputes_order ON disputes(order_id);
  CREATE INDEX IF NOT EXISTS idx_milestones_order ON milestones(order_id);
`);

// --- Generic upsert helpers used by server.ts's write-through persistence calls ---

export function upsertProduct(p: { id: string; weaverName?: string; price?: number; status?: string }) {
  db.prepare(`
    INSERT INTO products (id, weaver_name, price, status, data, updated_at)
    VALUES (@id, @weaver_name, @price, @status, @data, @updated_at)
    ON CONFLICT(id) DO UPDATE SET weaver_name=excluded.weaver_name, price=excluded.price,
      status=excluded.status, data=excluded.data, updated_at=excluded.updated_at
  `).run({
    id: p.id,
    weaver_name: p.weaverName ?? null,
    price: p.price ?? null,
    status: p.status ?? null,
    data: JSON.stringify(p),
    updated_at: Date.now()
  });
}

export function deleteProduct(id: string) {
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

export function loadAllProducts<T>(): T[] {
  return db.prepare('SELECT data FROM products ORDER BY rowid ASC').all()
    .map((row: any) => JSON.parse(row.data));
}

export function upsertOrder(o: { id: string; status?: string; product?: { id?: string } }) {
  db.prepare(`
    INSERT INTO orders (id, product_id, status, data, updated_at)
    VALUES (@id, @product_id, @status, @data, @updated_at)
    ON CONFLICT(id) DO UPDATE SET product_id=excluded.product_id, status=excluded.status,
      data=excluded.data, updated_at=excluded.updated_at
  `).run({
    id: o.id,
    product_id: o.product?.id ?? null,
    status: o.status ?? null,
    data: JSON.stringify(o),
    updated_at: Date.now()
  });

  // Keep the normalized dispute/milestone tables in sync with the embedded order fields.
  const order = o as any;
  if (order.dispute) {
    db.prepare(`
      INSERT INTO disputes (id, order_id, status, data, updated_at)
      VALUES (@id, @order_id, @status, @data, @updated_at)
      ON CONFLICT(id) DO UPDATE SET status=excluded.status, data=excluded.data, updated_at=excluded.updated_at
    `).run({
      id: order.dispute.id || `${order.id}-dispute`,
      order_id: order.id,
      status: order.dispute.status ?? null,
      data: JSON.stringify(order.dispute),
      updated_at: Date.now()
    });
  }
  if (order.paymentProtection?.milestones) {
    for (const m of order.paymentProtection.milestones) {
      db.prepare(`
        INSERT INTO milestones (id, order_id, status, data, updated_at)
        VALUES (@id, @order_id, @status, @data, @updated_at)
        ON CONFLICT(id) DO UPDATE SET status=excluded.status, data=excluded.data, updated_at=excluded.updated_at
      `).run({
        id: m.id,
        order_id: order.id,
        status: m.status ?? null,
        data: JSON.stringify(m),
        updated_at: Date.now()
      });
    }
  }
}

export function loadAllOrders<T>(): T[] {
  return db.prepare('SELECT data FROM orders ORDER BY rowid ASC').all()
    .map((row: any) => JSON.parse(row.data));
}

export function upsertTransaction(t: { id: string; orderId?: string; type?: string; amount?: number }) {
  db.prepare(`
    INSERT INTO transactions (id, order_id, type, amount, data, created_at)
    VALUES (@id, @order_id, @type, @amount, @data, @created_at)
    ON CONFLICT(id) DO UPDATE SET data=excluded.data
  `).run({
    id: t.id,
    order_id: t.orderId ?? null,
    type: t.type ?? null,
    amount: t.amount ?? null,
    data: JSON.stringify(t),
    created_at: Date.now()
  });
}

export function loadAllTransactions<T>(): T[] {
  return db.prepare('SELECT data FROM transactions ORDER BY rowid ASC').all()
    .map((row: any) => JSON.parse(row.data));
}

export function upsertGiRecord(productId: string, gi: { status?: string }) {
  db.prepare(`
    INSERT INTO gi_records (product_id, status, data, updated_at)
    VALUES (@product_id, @status, @data, @updated_at)
    ON CONFLICT(product_id) DO UPDATE SET status=excluded.status, data=excluded.data, updated_at=excluded.updated_at
  `).run({
    product_id: productId,
    status: gi.status ?? null,
    data: JSON.stringify(gi),
    updated_at: Date.now()
  });
}

// --- Accounts / auth ---

export interface Account {
  id: string;
  role: 'artisan' | 'consumer' | 'admin';
  account_subtype: string | null;
  name: string;
  phone: string | null;
  email: string;
  password_hash: string;
  region: string | null;
  craft_type: string | null;
  created_at: number;
}

export function findAccountByEmail(email: string): Account | undefined {
  return db.prepare('SELECT * FROM accounts WHERE email = ?').get(email.trim().toLowerCase()) as Account | undefined;
}

export function findAccountById(id: string): Account | undefined {
  return db.prepare('SELECT * FROM accounts WHERE id = ?').get(id) as Account | undefined;
}

export function createAccount(input: {
  id: string;
  role: 'artisan' | 'consumer' | 'admin';
  accountSubtype?: string;
  name: string;
  phone?: string;
  email: string;
  password: string;
  region?: string;
  craftType?: string;
}) {
  const passwordHash = bcrypt.hashSync(input.password, 10);
  db.prepare(`
    INSERT INTO accounts (id, role, account_subtype, name, phone, email, password_hash, region, craft_type, created_at)
    VALUES (@id, @role, @account_subtype, @name, @phone, @email, @password_hash, @region, @craft_type, @created_at)
  `).run({
    id: input.id,
    role: input.role,
    account_subtype: input.accountSubtype ?? null,
    name: input.name,
    phone: input.phone ?? null,
    email: input.email.trim().toLowerCase(),
    password_hash: passwordHash,
    region: input.region ?? null,
    craft_type: input.craftType ?? null,
    created_at: Date.now()
  });
}

export function setProducerCapacity(accountId: string, weeklyLimit?: number, monthlyLimit?: number) {
  db.prepare(`
    INSERT INTO producer_capacity (account_id, weekly_limit, monthly_limit, updated_at)
    VALUES (@account_id, @weekly_limit, @monthly_limit, @updated_at)
    ON CONFLICT(account_id) DO UPDATE SET weekly_limit=excluded.weekly_limit, monthly_limit=excluded.monthly_limit, updated_at=excluded.updated_at
  `).run({
    account_id: accountId,
    weekly_limit: weeklyLimit ?? null,
    monthly_limit: monthlyLimit ?? null,
    updated_at: Date.now()
  });
}

// One-time first-boot seeding: a demo admin account (credentials printed to console by the
// caller in server.ts) plus demo artisan/buyer accounts matching the pre-existing quick-login
// demo buttons in LoginModal.tsx, so that existing demo flow keeps working under real auth.
export function seedDemoAccountsIfEmpty(): { adminEmail: string; adminPassword: string } | null {
  const count = (db.prepare('SELECT COUNT(*) as c FROM accounts').get() as any).c;
  if (count > 0) return null;

  const adminPassword = 'Admin@123';
  createAccount({
    id: 'admin-1',
    role: 'admin',
    name: 'KalaSetu Administrator',
    email: 'admin@kalasetu.demo',
    password: adminPassword,
    region: 'National Handloom Registry Center, New Delhi'
  });
  createAccount({
    id: 'wev-1',
    role: 'artisan',
    accountSubtype: 'individual_artisan',
    name: 'Annaiah Devanga',
    email: 'weaver@kalasetu.demo',
    password: 'Weaver@123',
    region: 'Gudikal, Bagalkot, Karnataka',
    craftType: 'Handloom & Textiles'
  });
  createAccount({
    id: 'byr-1',
    role: 'consumer',
    accountSubtype: 'individual_consumer',
    name: 'Jagadish B.',
    email: 'buyer@kalasetu.demo',
    password: 'Buyer@123',
    region: 'Indiranagar, Bengaluru, Karnataka - 560038'
  });

  return { adminEmail: 'admin@kalasetu.demo', adminPassword };
}

export { isNewDatabase };
