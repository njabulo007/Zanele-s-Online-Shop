import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useShop } from "@/lib/shop-store";
import { formatZAR } from "@/lib/shop-types";
import { whatsappLink, cartMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Zanele's Online Shop" },
      { name: "description", content: "Review your items and check out via WhatsApp." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, cartSubtotal, removeFromCart, setQuantity, settings } = useShop();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>

        <h1 className="font-display text-3xl text-foreground">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="mt-8 rounded-xl bg-blush/40 py-20 text-center">
            <p className="text-lg text-foreground">Your cart is empty 🛍️</p>
            <Link
              to="/"
              className="mt-5 inline-block h-11 rounded-lg bg-primary px-6 text-sm font-semibold leading-[2.75rem] text-primary-foreground"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl bg-card p-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.15)]"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-blush/40">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">{item.name}</p>
                      <button
                        aria-label="Remove"
                        onClick={() => removeFromCart(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {item.variant && (
                      <span className="text-xs text-muted-foreground">{item.variant}</span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex items-center rounded-lg border border-border">
                        <button
                          aria-label="Decrease"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          aria-label="Increase"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatZAR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl bg-blush/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-semibold text-foreground">
                  {formatZAR(cartSubtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Delivery fees discussed via WhatsApp
              </p>

              <a
                href={whatsappLink(settings.whatsappNumber, cartMessage(cart, cartSubtotal))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-whatsapp text-base font-semibold text-whatsapp-foreground"
              >
                <WhatsAppIcon className="h-6 w-6" />
                Checkout via WhatsApp
              </a>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
