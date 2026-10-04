export interface Category {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  image: string;
  subtitle?: string;
  subtitle_ar?: string;
  active: boolean;
  display_order?: number;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description: string;
  description_ar?: string;
  price: number;
  old_price?: number;
  image: string;
  additional_images?: string[];
  category_id: string;
  category_name?: string;
  category_name_ar?: string;
  badge?: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryPrice {
  id: string;
  wilaya_code: number;
  wilaya_name: string;
  wilaya_name_ar: string;
  home_price: number;
  stopdesk_price?: number | null;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderSummaryItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  wilayaCode: number;
  wilayaName: string;
  address: string;
  deliveryType: "home" | "stopdesk";
  subtotal: number;
  deliveryCost: number;
  total: number;
  notes?: string;
  items: OrderSummaryItem[];
}

export interface OrderPriceUpdate {
  productId: string;
  productName: string;
  productPrice: number;
  image: string;
}
