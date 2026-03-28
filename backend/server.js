// ============================================================
//  ADI ARI HALAL FOOD CORNER — Backend API
//  Auto-creates SQLite DB on first run. Zero config needed.
// ============================================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

// ── Auto-create & open SQLite database ──
const DB_PATH = path.join(__dirname, 'data', 'restaurant.db');

// Make sure data/ folder exists
const fs = require('fs');
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

const db = new Database(DB_PATH);
console.log(`[DB] SQLite database ready at: ${DB_PATH}`);

// ── Run migrations (create tables if not exist) ──
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    jp          TEXT    DEFAULT '',
    category    TEXT    NOT NULL DEFAULT 'Mains',
    price       REAL    NOT NULL,
    img         TEXT    DEFAULT '',
    description TEXT    DEFAULT '',
    badge       TEXT    DEFAULT '',
    halal       INTEGER DEFAULT 1,
    available   INTEGER DEFAULT 1,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    items_json TEXT    NOT NULL,
    total      REAL    NOT NULL,
    mode       TEXT    DEFAULT 'delivery',
    status     TEXT    DEFAULT 'pending',
    customer   TEXT    DEFAULT '',
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT DEFAULT '',
    date        TEXT NOT NULL,
    time        TEXT NOT NULL,
    party_size  INTEGER NOT NULL,
    notes       TEXT DEFAULT '',
    status      TEXT DEFAULT 'pending',
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT DEFAULT '',
    subject    TEXT DEFAULT '',
    message    TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ── Seed default menu items if table is empty ──
const count = db.prepare('SELECT count(*) as c FROM menu_items').get();
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO menu_items (name, jp, category, price, img, description, badge, halal, available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const SEED = [
    // Starters
    ['Edamame',         '枝豆',           'Starters', 8,  'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?q=80&w=400&auto=format&fit=crop', 'Sea-salted organic edamame served warm.', '', 1, 1],
    ['Gyoza (Halal)',   '餃子',           'Starters', 14, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=400&auto=format&fit=crop', 'Pan-fried halal chicken and cabbage dumplings with yuzu ponzu.', 'Popular', 1, 1],
    ['Miso Soup',       '味噌汁',         'Starters', 7,  'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop', 'Traditional white miso with tofu, wakame, and spring onion.', '', 1, 1],
    ['Chicken Karaage', '唐揚げ',         'Starters', 16, 'https://images.unsplash.com/photo-1562802378-063ec186a863?q=80&w=400&auto=format&fit=crop', 'Crispy halal chicken marinated in soy, garlic, and ginger, fried twice.', '', 1, 1],
    ['Hummus & Pita',   'حمص وخبز',      'Starters', 9,  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop', 'Creamy homemade hummus with warm pita bread and olive oil.', '', 1, 1],
    // Sushi
    ['Omakase Nigiri',  'おまかせ握り',   'Sushi',    85, 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop', "Daily selection of premium-grade fish hand-selected by our Master Sushi Chef.", "Chef's Choice", 1, 1],
    ['Salmon Aburi',    'サーモン炙り',   'Sushi',    28, 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=400&auto=format&fit=crop', 'Torched Norwegian salmon with yuzu-miso glaze on vinegar rice.', '', 1, 1],
    ['Tuna Tataki',     'マグロたたき',   'Sushi',    36, 'https://images.unsplash.com/photo-1562802378-063ec186a863?q=80&w=400&auto=format&fit=crop', 'Seared tuna slices with ponzu sauce and micro herbs.', '', 1, 1],
    ['Rainbow Roll',    'レインボーロール','Sushi',   32, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=400&auto=format&fit=crop', 'California roll topped with assorted fresh fish slices.', 'New', 1, 1],
    // Ramen
    ['Tonkotsu Black',  '豚骨ブラック',   'Ramen',    24, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop', '48-hour halal bone broth, black garlic oil, chashu, hand-pulled noodles.', 'Popular', 1, 1],
    ['Shio Chicken',    '塩鶏ラーメン',   'Ramen',    22, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop', 'Clear salt-based broth with free-range halal chicken and yuzu zest.', '', 1, 1],
    ['Spicy Miso',      '辛味噌ラーメン', 'Ramen',    23, 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=400&auto=format&fit=crop', 'Rich miso broth with togarashi, corn, bean sprouts, and sesame oil.', '', 1, 1],
    ['Chicken Shoyu',   '鶏醤油ラーメン', 'Ramen',    21, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop', 'Golden chicken broth with soy tare, halal chicken chashu, and soft egg.', '', 1, 1],
    // Mains
    ['Botan Tempura',   '天ぷら盛り合わせ','Mains',   32, 'https://images.unsplash.com/photo-1581184953963-d15972933db1?q=80&w=400&auto=format&fit=crop', 'Ice-chilled batter tempura of vegetables and halal shrimp.', '', 1, 1],
    ['Chicken Teriyaki','鶏の照り焼き',   'Mains',    28, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?q=80&w=400&auto=format&fit=crop', 'Juicy halal chicken glazed with house teriyaki sauce, served with rice.', 'Popular', 1, 1],
    ['Black Cod Miso',  '銀ダラ西京焼き', 'Mains',    54, 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=400&auto=format&fit=crop', 'Saikyo miso-marinated black cod, broiled until caramelized perfection.', 'Premium', 1, 1],
    ['Chicken Biryani', 'チキンビリヤニ', 'Mains',    18, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop', 'Fragrant basmati rice with halal chicken, spices, and saffron.', '', 1, 1],
    ['Beef Yakitori',   '牛やきとり',     'Mains',    38, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop', 'Halal beef skewers brushed with tare glaze, grilled over binchotan charcoal.', '', 1, 1],
    ['Lamb Kebab',      'ラムケバブ',     'Mains',    26, 'https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=400&auto=format&fit=crop', 'Juicy halal lamb with Middle Eastern and Japanese fusion spices.', '', 1, 1],
    ['Butter Chicken',  'バターチキン',   'Mains',    22, 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=400&auto=format&fit=crop', 'Tender halal chicken in rich creamy tomato-butter sauce.', '', 1, 1],
    // Desserts
    ['Matcha Kakigori', '抹茶かき氷',     'Desserts', 12, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=400&auto=format&fit=crop', 'Shaved ice with ceremonial matcha syrup and sweet red bean.', '', 1, 1],
    ['Yuzu Cheesecake', 'ゆずチーズケーキ','Desserts',14, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=400&auto=format&fit=crop', 'Silky Japanese-style cheesecake infused with yuzu citrus.', '', 1, 1],
    ['Gulab Jamun',     'グラブジャムン', 'Desserts', 10, 'https://images.unsplash.com/photo-1666493652979-e8a8c22d9ef0?q=80&w=400&auto=format&fit=crop', 'Soft milk dumplings soaked in rose-flavoured sugar syrup, served warm.', '', 1, 1],
    ['Mango Lassi',     'マンゴーラッシー','Desserts',  8, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop', 'Chilled blended mango, yogurt, with a hint of cardamom.', '', 1, 1],
    ['Dorayaki',        'どら焼き',       'Desserts',  9, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop', 'Fluffy honey pancake sandwiches filled with sweet red bean paste.', 'New', 1, 1],
  ];

  const seedAll = db.transaction(() => {
    SEED.forEach(row => insert.run(...row));
  });
  seedAll();
  console.log(`[DB] Seeded ${SEED.length} default menu items.`);
}

// ================================================================
//  HELPERS
// ================================================================
const rowToItem = (r) => ({
  id:          r.id,
  name:        r.name,
  jp:          r.jp,
  cat:         r.category,
  price:       r.price,
  img:         r.img,
  desc:        r.description,
  badge:       r.badge,
  halal:       !!r.halal,
  available:   !!r.available,
  created_at:  r.created_at,
});

// ================================================================
//  ROUTES — HEALTH
// ================================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ADI ARI HALAL FOOD CORNER API running.', db: DB_PATH });
});

// ================================================================
//  ROUTES — MENU  (full CRUD)
// ================================================================
// GET all (optionally filter by category, available)
app.get('/api/menu', (req, res) => {
  try {
    const { category, available } = req.query;
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];
    if (category && category !== 'all') { sql += ' AND category = ?'; params.push(category); }
    if (available === 'true')           { sql += ' AND available = 1'; }
    sql += ' ORDER BY category, id';
    const rows = db.prepare(sql).all(...params);
    res.json(rows.map(rowToItem));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
app.get('/api/menu/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Item not found' });
    res.json(rowToItem(row));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
app.post('/api/menu', (req, res) => {
  try {
    const { name, jp = '', cat = 'Mains', price, img = '', desc = '', badge = '', halal = true, available = true } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name and price are required' });
    const result = db.prepare(`
      INSERT INTO menu_items (name, jp, category, price, img, description, badge, halal, available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, jp, cat, Number(price), img, desc, badge, halal ? 1 : 0, available ? 1 : 0);
    const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(rowToItem(row));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update
app.put('/api/menu/:id', (req, res) => {
  try {
    const { name, jp, cat, price, img, desc, badge, halal, available } = req.body;
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });
    db.prepare(`
      UPDATE menu_items SET
        name=?, jp=?, category=?, price=?, img=?, description=?, badge=?, halal=?, available=?
      WHERE id=?
    `).run(
      name ?? existing.name, jp ?? existing.jp, cat ?? existing.category,
      price != null ? Number(price) : existing.price, img ?? existing.img,
      desc ?? existing.description, badge ?? existing.badge,
      halal != null ? (halal ? 1 : 0) : existing.halal,
      available != null ? (available ? 1 : 0) : existing.available,
      req.params.id
    );
    const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    res.json(rowToItem(row));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH toggle available
app.patch('/api/menu/:id/toggle', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });
    db.prepare('UPDATE menu_items SET available = ? WHERE id = ?').run(existing.available ? 0 : 1, req.params.id);
    const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    res.json(rowToItem(row));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
app.delete('/api/menu/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
    res.json({ message: 'Item deleted', id: Number(req.params.id) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================================================================
//  ROUTES — ORDERS
// ================================================================
app.post('/api/orders', (req, res) => {
  try {
    const { items, total, mode = 'delivery', customer = '' } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Empty order' });
    const result = db.prepare(
      'INSERT INTO orders (items_json, total, mode, customer) VALUES (?, ?, ?, ?)'
    ).run(JSON.stringify(items), Number(total), mode, customer);
    res.status(201).json({ message: 'Order placed!', orderId: result.lastInsertRowid, status: 'pending' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(rows.map(r => ({ ...r, items: JSON.parse(r.items_json) })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================================================================
//  ROUTES — RESERVATIONS
// ================================================================
app.post('/api/reservations', (req, res) => {
  try {
    const { first_name, last_name, email, phone = '', date, time, party_size, notes = '' } = req.body;
    if (!first_name || !email || !date || !time || !party_size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = db.prepare(
      'INSERT INTO reservations (first_name, last_name, email, phone, date, time, party_size, notes) VALUES (?,?,?,?,?,?,?,?)'
    ).run(first_name, last_name, email, phone, date, time, Number(party_size), notes);
    res.status(201).json({ message: 'Reservation confirmed!', id: result.lastInsertRowid, status: 'pending' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/reservations', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM reservations ORDER BY date, time').all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================================================================
//  ROUTES — CONTACT
// ================================================================
app.post('/api/contact', (req, res) => {
  try {
    const { first_name, last_name, email, phone = '', subject = '', message } = req.body;
    if (!first_name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
    db.prepare(
      'INSERT INTO contacts (first_name, last_name, email, phone, subject, message) VALUES (?,?,?,?,?,?)'
    ).run(first_name, last_name, email, phone, subject, message);
    res.status(201).json({ message: 'Message received! We will reply within 24 hours.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================================================================
//  ROUTES — ADMIN overview
// ================================================================
app.get('/api/admin/overview', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const ordersToday  = db.prepare('SELECT * FROM orders WHERE DATE(created_at) = ? ORDER BY created_at DESC').all(today);
    const orders       = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 20').all();
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY date, time').all();
    const revenue      = db.prepare('SELECT COALESCE(SUM(total),0) as total FROM orders').get();
    const menuCount    = db.prepare('SELECT count(*) as c FROM menu_items WHERE available=1').get();
    res.json({
      ordersToday:   ordersToday.length,
      revenue:       revenue.total,
      reservations:  reservations.length,
      activeMenu:    menuCount.c,
      recentOrders:  orders.slice(0, 5),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================================================================
//  START
// ================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🍱 ADI ARI HALAL FOOD CORNER — API Server`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   Database: ${DB_PATH}`);
  console.log(`   Endpoints: /api/menu /api/orders /api/reservations /api/contact\n`);
});
