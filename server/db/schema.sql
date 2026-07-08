-- ICON Shop Database Schema
-- Run: psql -d icon_shop -f db/schema.sql

CREATE TABLE IF NOT EXISTS laptops (
  id            SERIAL PRIMARY KEY,
  brand         VARCHAR(50) NOT NULL,
  model         VARCHAR(100) NOT NULL,
  slug          VARCHAR(200) UNIQUE NOT NULL,
  cpu_brand     VARCHAR(50) DEFAULT 'Intel',
  cpu_model     VARCHAR(50),
  cpu_generation VARCHAR(50),
  cpu_full      VARCHAR(100) NOT NULL,
  cpu_cores     INTEGER DEFAULT 0,
  cpu_base_clock VARCHAR(20),
  cpu_boost_clock VARCHAR(20),
  ram           VARCHAR(20) NOT NULL,
  storage       VARCHAR(50) NOT NULL,
  screen_size   VARCHAR(20),
  screen_resolution VARCHAR(50),
  gpu           VARCHAR(100),
  os             VARCHAR(100),
  price         NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  purchase_cost NUMERIC(10,2),
  grade         VARCHAR(20) NOT NULL DEFAULT 'Good',
  battery_health INTEGER DEFAULT 0,
  battery_cycles INTEGER DEFAULT 0,
  physical_notes TEXT DEFAULT '',
  refurb_actions TEXT[] DEFAULT '{}',
  included_items TEXT[] DEFAULT '{Laptop,Charger}',
  status        VARCHAR(20) NOT NULL DEFAULT 'Available',
  on_sale       BOOLEAN DEFAULT false,
  discount_percent INTEGER DEFAULT 0,
  flash_sale    BOOLEAN DEFAULT false,
  featured      BOOLEAN DEFAULT false,
  rating        NUMERIC(3,1) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  in_stock      BOOLEAN DEFAULT true,
  stock         INTEGER DEFAULT 0,
  images        TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id            SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(200) DEFAULT '',
  laptop_id     INTEGER REFERENCES laptops(id) ON DELETE SET NULL,
  laptop_name   VARCHAR(200) NOT NULL,
  laptop_slug   VARCHAR(200),
  status        VARCHAR(20) NOT NULL DEFAULT 'Pending',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(200),
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  sid           VARCHAR NOT NULL COLLATE "default",
  sess          JSON NOT NULL,
  expire        TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS idx_laptops_status ON laptops(status);
CREATE INDEX IF NOT EXISTS idx_laptops_slug ON laptops(slug);
CREATE INDEX IF NOT EXISTS idx_laptops_brand ON laptops(brand);
CREATE INDEX IF NOT EXISTS idx_laptops_featured ON laptops(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_laptops_flash_sale ON laptops(flash_sale) WHERE flash_sale = true;
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_laptop_id ON reservations(laptop_id);

CREATE TABLE IF NOT EXISTS site_sections (
  id            SERIAL PRIMARY KEY,
  section_type  VARCHAR(50) NOT NULL DEFAULT 'banner',
  title         VARCHAR(200) NOT NULL DEFAULT '',
  subtitle      VARCHAR(500) NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  link_url      VARCHAR(500) NOT NULL DEFAULT '',
  link_text     VARCHAR(200) NOT NULL DEFAULT '',
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
