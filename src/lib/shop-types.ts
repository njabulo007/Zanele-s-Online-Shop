export const CATEGORIES = [
  "Clothing",
  "Bags",
  "Belts",
  "Wallets",
  "Scarves",
  "Accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type PaymentMethod = "WhatsApp" | "Cash" | "EFT";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  salePrice?: number | null;
  inStock: boolean;
  isNewArrival?: boolean;
  images: string[];
  variants: string[];
  createdAt: number;
}

export interface CartItem {
  id: string; // line id
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  price: number; // effective unit price
  image?: string;
}

export interface Sale {
  id: string;
  customerName: string;
  items: string;
  total: number;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: number;
}

export interface ShopSettings {
  whatsappNumber: string; // digits only, e.g. 27821234567
}

export const formatZAR = (n: number) =>
  "R " + Math.round(n).toLocaleString("en-ZA");

export const effectivePrice = (p: Product) =>
  p.salePrice && p.salePrice > 0 ? p.salePrice : p.price;
