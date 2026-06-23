import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { type Product, effectivePrice, formatZAR } from "@/lib/shop-types";
import { useShop } from "@/lib/shop-store";

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: () => void;
}) {
  const { addToCart } = useShop();
  const price = effectivePrice(product);
  const onSale = product.salePrice && product.salePrice > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.variants[0] ?? "", 1);
    toast.success("Added to cart ✓");
  };

  return (
    <div
      onClick={onOpen}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-card shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.22)] ${
        product.inStock ? "" : "opacity-75"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-blush/40">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="tracking-label rounded-full bg-foreground px-2 py-1 text-[9px] font-semibold uppercase text-background">
              New Arrival
            </span>
          )}
          {onSale && (
            <span className="tracking-label rounded-full bg-primary px-2 py-1 text-[9px] font-semibold uppercase text-primary-foreground">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="tracking-label rounded-full bg-muted-foreground/80 px-2 py-1 text-[9px] font-semibold uppercase text-background">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <span className="tracking-label text-[9px] uppercase text-muted-foreground">
          {product.category}
        </span>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">{formatZAR(price)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatZAR(product.price)}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              product.inStock ? "bg-whatsapp" : "bg-muted-foreground/50"
            }`}
          />
          <span className="text-muted-foreground">
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <button
          disabled={!product.inStock}
          onClick={handleAdd}
          className="mt-3 flex h-10 items-center justify-center gap-1.5 rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:hover:bg-secondary disabled:hover:text-secondary-foreground"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
