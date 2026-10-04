-- ============================================================
-- DOUAA SHOP - BASE DE DONNÉES POSTGRESQL / SUPABASE
-- Schéma Produits, Catégories, Frais de Livraison (58 Wilayas)
-- (Sans stockage de commandes : transmission directe sur Instagram)
-- ============================================================

-- 1. Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES CATÉGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  slug VARCHAR(120) UNIQUE NOT NULL,
  image TEXT NOT NULL,
  subtitle VARCHAR(255),
  subtitle_ar VARCHAR(255),
  active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE DES PRODUITS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  slug VARCHAR(280) UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  old_price NUMERIC(10, 2) CHECK (old_price >= 0),
  image TEXT NOT NULL,
  additional_images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  badge VARCHAR(50), -- '-20%', 'Nouveau', '-15%', etc.
  rating NUMERIC(2, 1) DEFAULT 5.0,
  reviews_count INT DEFAULT 1,
  in_stock BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE DES FRAIS DE LIVRAISON (58 WILAYAS D'ALGÉRIE)
CREATE TABLE IF NOT EXISTS public.delivery_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wilaya_code INT UNIQUE NOT NULL,
  wilaya_name VARCHAR(100) NOT NULL,
  wilaya_name_ar VARCHAR(100) NOT NULL,
  home_price NUMERIC(10, 2) NOT NULL DEFAULT 600.00 CHECK (home_price >= 0),
  stopdesk_price NUMERIC(10, 2) DEFAULT 400.00 CHECK (stopdesk_price IS NULL OR stopdesk_price >= 0),
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE DES ADMINISTRATEURS
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_delivery_wilaya ON public.delivery_prices(wilaya_code);

ALTER TABLE public.delivery_prices
  DROP CONSTRAINT IF EXISTS delivery_prices_home_price_check;
ALTER TABLE public.delivery_prices
  ADD CONSTRAINT delivery_prices_home_price_check CHECK (home_price >= 0);
ALTER TABLE public.delivery_prices
  DROP CONSTRAINT IF EXISTS delivery_prices_stopdesk_price_check;
ALTER TABLE public.delivery_prices
  ADD CONSTRAINT delivery_prices_stopdesk_price_check
  CHECK (stopdesk_price IS NULL OR stopdesk_price >= 0);

-- TRIGGER POUR MISE À JOUR DU CHAMP updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins full access on categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins full access on products" ON public.products;
DROP POLICY IF EXISTS "Public can view delivery prices" ON public.delivery_prices;
DROP POLICY IF EXISTS "Admins can update delivery prices" ON public.delivery_prices;
DROP POLICY IF EXISTS "Admins can view admins table" ON public.admins;

-- Public reads are limited to active rows; mutations require an admin record.
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "Admins full access on categories" ON public.categories
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "Admins full access on products" ON public.products
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Public can view delivery prices" ON public.delivery_prices
  FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "Admins can update delivery prices" ON public.delivery_prices
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Admins can view admins table" ON public.admins
  FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
