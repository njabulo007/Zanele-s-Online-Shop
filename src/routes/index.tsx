import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { useShop } from "@/lib/shop-store";
import { CATEGORIES, type Product, effectivePrice } from "@/lib/shop-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zanele's Online Shop — Fashion That Speaks Before You Do" },
      {
        name: "description",
        content:
          "Clothing, bags, belts, wallets, scarves & accessories — delivered to your door. Shop Zanele's boutique via WhatsApp.",
      },
    ],
  }),
  component: Index,
});

type Filter = "All" | (typeof CATEGORIES)[number];
type Sort = "newest" | "low" | "high" | "sale";

const filters: Filter[] = ["All", ...CATEGORIES];

function Index() {
  const { products } = useShop();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [active, setActive] = useState<Product | null>(null);

  const visible = useMemo(() => {
    let list = [...products];
    if (filter !== "All") list = list.filter((p) => p.category === filter);
    if (search.trim())
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase()),
      );
    switch (sort) {
      case "low":
        list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "high":
        list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case "sale":
        list.sort(
          (a, b) =>
            Number(!!(b.salePrice && b.salePrice > 0)) -
            Number(!!(a.salePrice && a.salePrice > 0)),
        );
        break;
      default:
        list.sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [products, filter, search, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="hero-linen">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="tracking-label text-xs uppercase text-primary">
            Zanele's Online Shop
          </span>
          <h1 className="shimmer-text mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
            Fashion That Speaks Before You Do
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
            Clothing, bags, accessories &amp; more — delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#shop"
              className="h-12 rounded-lg bg-primary px-7 text-sm font-semibold leading-[3rem] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Shop Now
            </a>
            <button
              onClick={() => {
                setSort("newest");
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-12 rounded-lg border border-primary px-7 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View New Arrivals
            </button>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Category strip */}
        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tracking-label shrink-0 rounded-full px-4 py-2 text-xs font-medium uppercase transition-colors ${
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-blush/60 text-foreground/70 hover:bg-blush"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-lg border border-input bg-blush/40 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-11 rounded-lg border border-input bg-blush/40 px-3 text-sm outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="sale">On Sale</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl bg-blush/40 py-20 text-center">
            <p className="text-lg text-foreground">No items here yet — check back soon! 🛍️</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => setActive(p)} />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-blush/40">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl text-foreground">Our Story</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground/80">
            Zanele's Online Shop was built on a love for fashion that empowers. Every piece is
            handpicked for the woman who wants to look good, feel confident, and express herself —
            without breaking the bank.
          </p>
        </div>
      </section>

      <Footer />

      {active && <ProductModal product={active} onClose={() => setActive(null)} />}
    </div>
  );
}
