import { useEffect, useState } from "react";
import { X, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  type Product,
  effectivePrice,
  formatZAR,
} from "@/lib/shop-types";
import { useShop } from "@/lib/shop-store";
import { whatsappLink, singleProductMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./FloatingWhatsApp";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart, settings } = useShop();
  const [variant, setVariant] = useState(product.variants[0] ?? "");
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const price = effectivePrice(product);
  const onSale = product.salePrice && product.salePrice > 0;

  const handleAdd = () => {
    addToCart(product, variant, qty);
    toast.success("Added to cart ✓");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-card sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 sm:grid-cols-2">
          <div className="bg-blush/40">
            <div className="relative aspect-square w-full overflow-hidden">
              <img
                src={product.images[imgIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={() =>
                      setImgIndex((i) => (i - 1 + product.images.length) % product.images.length)
                    }
                    className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Next"
                    onClick={() => setImgIndex((i) => (i + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      i === imgIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <span className="tracking-label text-[10px] uppercase text-muted-foreground">
              {product.category}
            </span>
            <h2 className="mt-1 font-display text-2xl text-foreground">{product.name}</h2>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">{formatZAR(price)}</span>
              {onSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatZAR(product.price)}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  product.inStock ? "bg-whatsapp" : "bg-muted-foreground/50"
                }`}
              />
              <span className="text-muted-foreground">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {product.description}
            </p>

            {product.variants.length > 0 && (
              <div className="mt-5">
                <p className="tracking-label mb-2 text-[10px] uppercase text-muted-foreground">
                  Size / Variant
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={`min-w-11 rounded-lg border px-3 py-2 text-sm ${
                        v === variant
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="tracking-label mb-2 text-[10px] uppercase text-muted-foreground">
                Quantity
              </p>
              <div className="inline-flex items-center rounded-lg border border-border">
                <button
                  aria-label="Decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  aria-label="Increase"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-11 w-11 place-items-center text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled={!product.inStock}
                onClick={handleAdd}
                className="h-12 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  singleProductMessage({
                    name: product.name,
                    variant,
                    quantity: qty,
                    price: price * qty,
                  }),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold text-whatsapp-foreground"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Buy via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
