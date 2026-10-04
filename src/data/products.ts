import { Category, Product } from "@/types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-parfums",
    name: "Parfums",
    name_ar: "عطور",
    slug: "parfums",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    subtitle: "Senteurs uniques",
    subtitle_ar: "روائح فريدة ومميزة",
    active: true,
    display_order: 1
  },
  {
    id: "cat-soins-visage",
    name: "Soins visage",
    name_ar: "العناية بالوجه",
    slug: "soins-visage",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    subtitle: "Une peau plus belle",
    subtitle_ar: "لبشرة أكثر إشراقاً",
    active: true,
    display_order: 2
  },
  {
    id: "cat-maquillage",
    name: "Maquillage",
    name_ar: "مكياج",
    slug: "maquillage",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
    subtitle: "Sublimez votre beauté",
    subtitle_ar: "لإبراز جمالكِ الطبيعي",
    active: true,
    display_order: 3
  },
  {
    id: "cat-soins-corps",
    name: "Soins du corps",
    name_ar: "العناية بالجسم",
    slug: "soins-du-corps",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    subtitle: "Douceur naturelle",
    subtitle_ar: "نعومة طبيعية تدوم",
    active: true,
    display_order: 4
  },
  {
    id: "cat-accessoires",
    name: "Accessoires",
    name_ar: "إكسسوارات",
    slug: "accessoires",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    subtitle: "L'élégance au quotidien",
    subtitle_ar: "أناقة راقية كل يوم",
    active: true,
    display_order: 5
  },
  {
    id: "cat-nouveautes",
    name: "Nouveautés",
    name_ar: "وصل حديثاً",
    slug: "nouveautes",
    image: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=600&q=80",
    subtitle: "Découvrez les dernières arrivées",
    subtitle_ar: "أحدث المنتجات الحصرية",
    active: true,
    display_order: 6
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Yara Lattafa 100ml",
    name_ar: "عطر يارا لطافة 100 مل",
    slug: "yara-lattafa-100ml",
    description: "Une fragrance orientale florale et gourmande irrésistible. Notes de tête éclatantes d'orchidée et d'héliotrope, cœur gourmand de fruits tropicaux et fond enveloppant de vanille et bois de santal. Une signature olfactive féminine et captivante.",
    description_ar: "عطر شرقي زهري ساحر لا يُقاوم. افتتاحية من زهر الأوركيد والهليوتروب، وقلب حلو من الفواكه الاستوائية وقاعدة غنية بالفانيليا وخشب الصندل.",
    price: 4900,
    old_price: 6200,
    badge: "-20%",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
    ],
    category_id: "cat-parfums",
    category_name: "Parfums",
    rating: 4.8,
    reviews_count: 24,
    in_stock: true,
    active: true
  },
  {
    id: "prod-2",
    name: "Crème visage hydratante",
    name_ar: "كريم مرطب ومغذي للوجه",
    slug: "creme-visage-hydratante",
    description: "Formulée à base d'acide hyaluronique et d'extraits botaniques apaisants. Elle apporte une hydratation profonde pendant 24h sans laisser de fini gras, pour un teint frais, rebondi et lumineux.",
    description_ar: "مركب غني بحمض الهيالورونيك وخلاصات نباتية مهدئة، يمنح ترطيباً عميقاً طوال 24 ساعة لبشرة ناعمة ومشرقة وخالية من اللمعان.",
    price: 3200,
    badge: "Nouveau",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    category_id: "cat-soins-visage",
    category_name: "Soins visage",
    rating: 5.0,
    reviews_count: 18,
    in_stock: true,
    active: true
  },
  {
    id: "prod-3",
    name: "Set de pinceaux maquillage",
    name_ar: "طقم فراشي مكياج احترافي",
    slug: "set-de-pinceaux-maquillage",
    description: "Ensemble complet de 12 pinceaux professionnels aux poils synthétiques soyeux et cruelty-free. Conçu pour le teint, les poudres, le blush et les paupières. Livré avec son élégant étui cylindrique rose poudré.",
    description_ar: "مجموعة متكاملة من 12 فرشاة ناعمة فائقة الجودة للوجه والعيون، تأتي داخل حافظة أسطوانية وردية أنيقة وفخمة.",
    price: 2500,
    old_price: 2900,
    badge: "-15%",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    category_id: "cat-maquillage",
    category_name: "Maquillage",
    rating: 4.6,
    reviews_count: 31,
    in_stock: true,
    active: true
  },
  {
    id: "prod-4",
    name: "Rouge à lèvres matte",
    name_ar: "أحمر شفاه مات مخملي ثبات طويل",
    slug: "rouge-a-levres-matte",
    description: "Texture veloutée ultra-confortable et pigmentation intense dès le premier passage. Tenue infaillible jusqu'à 12 heures sans assécher les lèvres grâce aux huiles nourrissantes de jojoba.",
    description_ar: "لون كثيف بلمسة مخملية تدوم حتى 12 ساعة دون أن يجفف الشفاه بفضل زيوت الجوجوبا المغذية.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    ],
    category_id: "cat-maquillage",
    category_name: "Maquillage",
    rating: 4.9,
    reviews_count: 12,
    in_stock: true,
    active: true
  },
  {
    id: "prod-5",
    name: "Parfum Musc Blanc Prestige",
    name_ar: "عطر المسك الأبيض برستيج",
    slug: "parfum-musc-blanc-prestige",
    description: "Une eau de parfum délicate et pure aux accents de musc blanc soyeux, fleur de coton et rose poudrée. Le sillage intemporel et raffiné par excellence.",
    description_ar: "عطر نقي وناعم يجمع بين سحر المسك الأبيض وزهور القطن والورد البودري لإحساس دائم بالنظافة والفخامة.",
    price: 3800,
    old_price: 4500,
    badge: "-15%",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    category_id: "cat-parfums",
    category_name: "Parfums",
    rating: 4.9,
    reviews_count: 42,
    in_stock: true,
    active: true
  },
  {
    id: "prod-6",
    name: "Sérum Anti-Âge Éclat Doré",
    name_ar: "سيروم النضارة ومكافحة التجاعيد",
    slug: "serum-anti-age-eclat-dore",
    description: "Sérum précieux concentré en vitamine C pure, peptides et acide hyaluronique. Réduit visiblement les ridules et illumine le teint dès 7 jours d'utilisation.",
    description_ar: "سيروم غني بفيتامين C والببتيدات لتوحيد لون البشرة ومكافحة علامات التقدم في السن لبشرة مشرقة ومشدودة.",
    price: 4200,
    badge: "Nouveau",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    category_id: "cat-soins-visage",
    category_name: "Soins visage",
    rating: 5.0,
    reviews_count: 15,
    in_stock: true,
    active: true
  },
  {
    id: "prod-7",
    name: "Palette Fards à Paupières Nude & Rose",
    name_ar: "باليت ظلال عيون درجات النيود والوردي",
    slug: "palette-fards-nude-rose",
    description: "18 teintes pigmentées alliant finis mats soyeux, nacrés lumineux et paillettes scintillantes. Idéale pour des looks naturels de jour comme des maquillages sophistiqués de soirée.",
    description_ar: "18 تدرجاً لونياً جذاباً بين المات الحريري واللامع الجذاب لتنسيق أروع إطلالات اليوم والمناسبات.",
    price: 2900,
    old_price: 3400,
    badge: "-14%",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    category_id: "cat-maquillage",
    category_name: "Maquillage",
    rating: 4.7,
    reviews_count: 27,
    in_stock: true,
    active: true
  },
  {
    id: "prod-8",
    name: "Sac à main élégant Rose Poudré",
    name_ar: "حقيبة يد فاخرة لون وردي أنيق",
    slug: "sac-a-main-rose-poudre",
    description: "Sac à main chic avec finitions dorées luxueuses et bandoulière amovible. Conçu en cuir synthétique premium avec coutures renforcées. L'accessoire incontournable.",
    description_ar: "حقيبة نسائية فاخرة بلمسات ذهبية راقية وحزام كتف قابل للتعديل لتكمل إطلالتك في كل خروجاتك.",
    price: 5500,
    old_price: 6800,
    badge: "-20%",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    category_id: "cat-accessoires",
    category_name: "Accessoires",
    rating: 4.9,
    reviews_count: 38,
    in_stock: true,
    active: true
  }
];
