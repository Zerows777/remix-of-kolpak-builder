/*
# Create products table (single-tenant, no auth)

## Purpose
Stores the product catalog shown on the catalog page. The app has no
sign-in screen, so all data is intentionally public/shared.

## 1. New Tables
- `products`
  - `id` (int2, primary key, auto-increment)
  - `name` (text, not null) — product name
  - `description` (text, not null) — short description
  - `price` (numeric(10,2), not null) — price in rubles
  - `category` (text, not null) — product category
  - `image_url` (text, not null) — URL to product image
  - `in_stock` (boolean, default true) — availability flag
  - `created_at` (timestamptz, default now())

## 2. Security
- RLS enabled on `products`.
- Four policies (SELECT/INSERT/UPDATE/DELETE) scoped to `anon, authenticated`
  because the app has no sign-in screen and the data is intentionally public.

## 3. Seed Data
- 8 sample products across 4 categories with Pexels stock images.
*/

CREATE TABLE IF NOT EXISTS products (
  id smallint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO products (name, description, price, category, image_url, in_stock) VALUES
  ('Беспроводные наушники SoundPro', 'Премиальные наушники с активным шумоподавлением и 30 часами работы.', 8990, 'Электроника', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', true),
  ('Умные часы FitWatch X2', 'Фитнес-браслет с пульсометром, GPS и водозащитой 5 ATM.', 12990, 'Электроника', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600', true),
  ('Портативная колонка BoomBox', 'Мощная Bluetooth-колонка с глубоким басом и защитой IPX7.', 4990, 'Электроника', 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600', false),
  ('Кожаный кошелёк Urban', 'Стильный мужской кошелёк из натуральной кожи с отделом для карт.', 2490, 'Аксессуары', 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=600', true),
  ('Солнцезащитные очки Aviator', 'Классические очки-авиаторы с поляризацией и UV-защитой.', 3990, 'Аксессуары', 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600', true),
  ('Хлопковая футболка Basic', 'Базовая футболка из 100% органического хлопка, унисекс.', 1490, 'Одежда', 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600', true),
  ('Куртка-бомбер Pilot', 'Лёгкая бомбер-куртка с водоотталкивающим покрытием.', 7990, 'Одежда', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600', false),
  ('Керамическая кружка CoffeeTime', 'Кружка объёмом 350 мл из керамики ручной работы.', 690, 'Дом', 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=600', true)
ON CONFLICT DO NOTHING;
