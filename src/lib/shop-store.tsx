import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type CartItem,
  type Product,
  type Sale,
  type ShopSettings,
  effectivePrice,
} from "./shop-types";
import dress from "@/assets/seed/dress.jpg";
import bag from "@/assets/seed/bag.jpg";
import belt from "@/assets/seed/belt.jpg";
import wallet from "@/assets/seed/wallet.jpg";
import scarf from "@/assets/seed/scarf.jpg";
import earrings from "@/assets/seed/earrings.jpg";

const PRODUCTS_KEY = "zanele_products_v1";
const CART_KEY = "zanele_cart_v1";
const SALES_KEY = "zanele_sales_v1";
const SETTINGS_KEY = "zanele_settings_v1";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Terracotta Flow Midi Dress",
    description:
      "A flowing midi dress in warm terracotta with a flattering tie waist. Effortless elegance for day or evening.",
    category: "Clothing",
    price: 649,
    salePrice: 499,
    inStock: true,
    isNewArrival: true,
    images: [dress],
    variants: ["S", "M", "L", "XL"],
    createdAt: Date.now() - 1000,
  },
  {
    id: "p2",
    name: "Amara Structured Tote",
    description:
      "A structured tan leather tote with gold hardware and a detachable strap. Roomy enough for everyday luxury.",
    category: "Bags",
    price: 899,
    salePrice: null,
    inStock: true,
    isNewArrival: true,
    images: [bag],
    variants: [],
    createdAt: Date.now() - 2000,
  },
  {
    id: "p3",
    name: "Woven Leather Belt",
    description: "Hand-woven leather belt with a brushed brass buckle. A timeless waist statement.",
    category: "Belts",
    price: 299,
    salePrice: null,
    inStock: true,
    images: [belt],
    variants: ["S", "M", "L"],
    createdAt: Date.now() - 3000,
  },
  {
    id: "p4",
    name: "Slim Card Wallet",
    description: "A compact tan leather card wallet — slips into any bag or pocket with ease.",
    category: "Wallets",
    price: 249,
    salePrice: 199,
    inStock: false,
    images: [wallet],
    variants: [],
    createdAt: Date.now() - 4000,
  },
  {
    id: "p5",
    name: "Golden Hour Silk Scarf",
    description: "Lightweight silk scarf in warm gold tones. Wear it at the neck, in the hair, or on a bag.",
    category: "Scarves",
    price: 199,
    salePrice: null,
    inStock: true,
    images: [scarf],
    variants: [],
    createdAt: Date.now() - 5000,
  },
  {
    id: "p6",
    name: "Statement Gold Hoops",
    description: "Bold textured gold hoop earrings that elevate any outfit instantly.",
    category: "Accessories",
    price: 179,
    salePrice: null,
    inStock: true,
    isNewArrival: true,
    images: [earrings],
    variants: [],
    createdAt: Date.now() - 6000,
  },
];

const defaultSettings: ShopSettings = { whatsappNumber: "27821234567" };

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface ShopContextValue {
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
  settings: ShopSettings;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, variant: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, "id" | "createdAt"> & { createdAt?: number }) => void;
  updateSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  setSettings: (s: ShopSettings) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [settings, setSettingsState] = useState<ShopSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(load(PRODUCTS_KEY, seedProducts));
    setCart(load(CART_KEY, []));
    setSales(load(SALES_KEY, []));
    setSettingsState(load(SETTINGS_KEY, defaultSettings));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  }, [sales, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const addToCart = useCallback((product: Product, variant: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.variant === variant,
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [
        ...prev,
        {
          id: uid(),
          productId: product.id,
          name: product.name,
          variant,
          quantity,
          price: effectivePrice(product),
          image: product.images[0],
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === lineId ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? product : p));
      return [product, ...prev];
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addSale = useCallback(
    (sale: Omit<Sale, "id" | "createdAt"> & { createdAt?: number }) => {
      setSales((prev) => [
        { ...sale, id: uid(), createdAt: sale.createdAt ?? Date.now() },
        ...prev,
      ]);
    },
    [],
  );

  const updateSale = useCallback((sale: Sale) => {
    setSales((prev) => prev.map((s) => (s.id === sale.id ? sale : s)));
  }, []);

  const deleteSale = useCallback((id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setSettings = useCallback((s: ShopSettings) => setSettingsState(s), []);

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((n, i) => n + i.price * i.quantity, 0),
    [cart],
  );

  const value: ShopContextValue = {
    products,
    cart,
    sales,
    settings,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    saveProduct,
    deleteProduct,
    addSale,
    updateSale,
    deleteSale,
    setSettings,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export const newLineId = uid;
