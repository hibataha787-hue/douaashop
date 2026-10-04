-- ============================================================
-- DOUAA SHOP - DONNÉES INITIALES (SEED)
-- Catégories, Produits de la capture et 58 Wilayas d'Algérie
-- ============================================================

-- 1. INSERTION DES CATÉGORIES
INSERT INTO public.categories (id, name, name_ar, slug, image, subtitle, subtitle_ar, active, display_order)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Parfums', 'عطور', 'parfums', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80', 'Senteurs uniques', 'روائح فريدة ومميزة', true, 1),
  ('a2222222-2222-2222-2222-222222222222', 'Soins visage', 'العناية بالوجه', 'soins-visage', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80', 'Une peau plus belle', 'لبشرة أكثر إشراقاً', true, 2),
  ('a3333333-3333-3333-3333-333333333333', 'Maquillage', 'مكياج', 'maquillage', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80', 'Sublimez votre beauté', 'لإبراز جمالكِ الطبيعي', true, 3),
  ('a4444444-4444-4444-4444-444444444444', 'Soins du corps', 'العناية بالجسم', 'soins-du-corps', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', 'Douceur naturelle', 'نعومة طبيعية تدوم', true, 4),
  ('a5555555-5555-5555-5555-555555555555', 'Accessoires', 'إكسسوارات', 'accessoires', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', 'L''élégance au quotidien', 'أناقة راقية كل يوم', true, 5),
  ('a6666666-6666-6666-6666-666666666666', 'Nouveautés', 'وصل حديثاً', 'nouveautes', 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=600&q=80', 'Découvrez les dernières arrivées', 'أحدث المنتجات الحصرية', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERTION DES PRODUITS DE LA CAPTURE
INSERT INTO public.products (id, name, name_ar, slug, description, price, old_price, image, category_id, badge, rating, reviews_count, in_stock, active)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Yara Lattafa 100ml', 'عطر يارا لطافة 100 مل', 'yara-lattafa-100ml', 'Une fragrance orientale florale et gourmande irrésistible. Notes dorées d''orchidée, fruits tropicaux, vanille et bois de santal.', 4900, 6200, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80', 'a1111111-1111-1111-1111-111111111111', '-20%', 4.8, 24, true, true),
  ('b2222222-2222-2222-2222-222222222222', 'Crème visage hydratante', 'كريم مرطب ومغذي للوجه', 'creme-visage-hydratante', 'Formulée à base d''acide hyaluronique et d''extraits apaisants. Hydratation profonde 24h sans effet gras.', 3200, NULL, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 'a2222222-2222-2222-2222-222222222222', 'Nouveau', 5.0, 18, true, true),
  ('b3333333-3333-3333-3333-333333333333', 'Set de pinceaux maquillage', 'طقم فراشي مكياج احترافي', 'set-de-pinceaux-maquillage', 'Ensemble de 12 pinceaux professionnels soyeux et cruelty-free avec étui cylindrique de voyage rose blush.', 2500, 2900, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', 'a3333333-3333-3333-3333-333333333333', '-15%', 4.6, 31, true, true),
  ('b4444444-4444-4444-4444-444444444444', 'Rouge à lèvres matte', 'أحمر شفاه مات مخملي ثبات طويل', 'rouge-a-levres-matte', 'Texture veloutée ultra-confortable et pigmentation intense. Tenue 12h enrichi en huile de jojoba.', 1800, NULL, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', 'a3333333-3333-3333-3333-333333333333', NULL, 4.9, 12, true, true),
  ('b5555555-5555-5555-5555-555555555555', 'Parfum Musc Blanc Prestige', 'عطر المسك الأبيض برستيج', 'parfum-musc-blanc-prestige', 'Une eau de parfum délicate et pure aux accents de musc blanc soyeux et rose poudrée.', 3800, 4500, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', 'a1111111-1111-1111-1111-111111111111', '-15%', 4.9, 42, true, true),
  ('b6666666-6666-6666-6666-666666666666', 'Sérum Anti-Âge Éclat Doré', 'سيروم النضارة ومكافحة التجاعيد', 'serum-anti-age-eclat-dore', 'Sérum précieux concentré en vitamine C pure, peptides et acide hyaluronique.', 4200, NULL, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 'a2222222-2222-2222-2222-222222222222', 'Nouveau', 5.0, 15, true, true),
  ('b7777777-7777-7777-7777-777777777777', 'Palette Fards à Paupières Nude & Rose', 'باليت ظلال عيون درجات النيود والوردي', 'palette-fards-nude-rose', '18 teintes pigmentées aux finis mats soyeux et nacrés lumineux.', 2900, 3400, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 'a3333333-3333-3333-3333-333333333333', '-14%', 4.7, 27, true, true),
  ('b8888888-8888-8888-8888-888888888888', 'Sac à main élégant Rose Poudré', 'حقيبة يد فاخرة لون وردي أنيق', 'sac-a-main-rose-poudre', 'Sac à main chic avec finitions dorées luxueuses et bandoulière amovible.', 5500, 6800, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 'a5555555-5555-5555-5555-555555555555', '-20%', 4.9, 38, true, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERTION DES 58 WILAYAS D'ALGÉRIE
INSERT INTO public.delivery_prices (wilaya_code, wilaya_name, wilaya_name_ar, home_price, stopdesk_price, active)
VALUES
  (1, 'Adrar', 'أدرار', 900, 600, true),
  (2, 'Chlef', 'الشلف', 600, 400, true),
  (3, 'Laghouat', 'الأغواط', 750, 500, true),
  (4, 'Oum El Bouaghi', 'أم البواقي', 650, 450, true),
  (5, 'Batna', 'باتنة', 650, 450, true),
  (6, 'Béjaïa', 'بجاية', 600, 400, true),
  (7, 'Biskra', 'بسكرة', 750, 500, true),
  (8, 'Béchar', 'بشار', 900, 600, true),
  (9, 'Blida', 'البليدة', 500, 350, true),
  (10, 'Bouira', 'البويرة', 600, 400, true),
  (11, 'Tamanrasset', 'تمنراست', 1200, 800, true),
  (12, 'Tébessa', 'تبسة', 700, 500, true),
  (13, 'Tlemcen', 'تلمسان', 650, 450, true),
  (14, 'Tiaret', 'تيارت', 650, 450, true),
  (15, 'Tizi Ouzou', 'تيزي وزو', 600, 400, true),
  (16, 'Alger', 'الجزائر', 450, 300, true),
  (17, 'Djelfa', 'الجلفة', 700, 500, true),
  (18, 'Jijel', 'جيجل', 650, 450, true),
  (19, 'Sétif', 'سطيف', 600, 400, true),
  (20, 'Saïda', 'سعيدة', 700, 500, true),
  (21, 'Skikda', 'سكيكدة', 650, 450, true),
  (22, 'Sidi Bel Abbès', 'سيدي بلعباس', 650, 450, true),
  (23, 'Annaba', 'عنابة', 650, 450, true),
  (24, 'Guelma', 'قالمة', 650, 450, true),
  (25, 'Constantine', 'قسنطينة', 600, 400, true),
  (26, 'Médéa', 'المدية', 550, 350, true),
  (27, 'Mostaganem', 'مستغانم', 650, 450, true),
  (28, 'M''Sila', 'المسيلة', 650, 450, true),
  (29, 'Mascara', 'معسكر', 650, 450, true),
  (30, 'Ouargla', 'ورقلة', 800, 550, true),
  (31, 'Oran', 'وهران', 600, 400, true),
  (32, 'El Bayadh', 'البيض', 800, 550, true),
  (33, 'Illizi', 'إليزي', 1200, 800, true),
  (34, 'Bordj Bou Arréridj', 'برج بوعريريج', 600, 400, true),
  (35, 'Boumerdès', 'بومرداس', 500, 350, true),
  (36, 'El Tarf', 'الطارف', 700, 500, true),
  (37, 'Tindouf', 'تندوف', 1200, 800, true),
  (38, 'Tissemsilt', 'تيسمسيلت', 700, 500, true),
  (39, 'El Oued', 'الوادي', 800, 550, true),
  (40, 'Khenchela', 'خنشلة', 700, 500, true),
  (41, 'Souk Ahras', 'سوق أهراس', 700, 500, true),
  (42, 'Tipaza', 'تيبازة', 500, 350, true),
  (43, 'Mila', 'ميلة', 650, 450, true),
  (44, 'Aïn Defla', 'عين الدفلى', 600, 400, true),
  (45, 'Naâma', 'النعامة', 850, 600, true),
  (46, 'Aïn Témouchent', 'عين تموشنت', 650, 450, true),
  (47, 'Ghardaïa', 'غرداية', 800, 550, true),
  (48, 'Relizane', 'غليزان', 650, 450, true),
  (49, 'Timimoun', 'تيميمون', 950, 650, true),
  (50, 'Bordj Badji Mokhtar', 'برج باجي مختار', 1300, 900, true),
  (51, 'Ouled Djellal', 'أولاد جلال', 800, 550, true),
  (52, 'Béni Abbès', 'بني عباس', 950, 650, true),
  (53, 'In Salah', 'عين صالح', 1100, 750, true),
  (54, 'In Guezzam', 'عين قزام', 1300, 900, true),
  (55, 'Touggourt', 'تقرت', 800, 550, true),
  (56, 'Djanet', 'جانت', 1300, 900, true),
  (57, 'El M''Ghair', 'المغير', 800, 550, true),
  (58, 'El Meniaa', 'المنيعة', 900, 600, true)
ON CONFLICT (wilaya_code) DO NOTHING;
