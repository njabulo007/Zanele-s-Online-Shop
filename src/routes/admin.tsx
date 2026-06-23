import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, Plus, X, Lock } from "lucide-react";
import { useShop, newLineId } from "@/lib/shop-store";
import {
  CATEGORIES,
  type Category,
  type PaymentMethod,
  type Product,
  type Sale,
  formatZAR,
} from "@/lib/shop-types";

const ADMIN_PASSWORD = "zanele2025";
const SESSION_KEY = "zanele_admin_session";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Zanele's" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(
    typeof window !== "undefined" && localStorage.getItem(SESSION_KEY) === "1",
  );
  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setErr(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blush">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h1 className="mt-4 text-center text-lg font-semibold text-foreground">Admin Access</h1>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr(false);
          }}
          placeholder="Password"
          className="mt-5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {err && <p className="mt-2 text-xs text-destructive">Incorrect password.</p>}
        <button
          type="submit"
          className="mt-4 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.2)]">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="tracking-label mt-1 text-[10px] uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const {
    products,
    sales,
    settings,
    setSettings,
    deleteProduct,
    deleteSale,
  } = useShop();
  const [tab, setTab] = useState<"products" | "sales" | "settings">("products");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);

  const outOfStock = products.filter((p) => !p.inStock).length;
  const revenue = sales.reduce((n, s) => n + s.total, 0);
  const monthRevenue = useMemo(() => {
    const now = new Date();
    return sales
      .filter((s) => {
        const d = new Date(s.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((n, s) => n + s.total, 0);
  }, [sales]);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-xl text-foreground">Zanele's</p>
            <p className="tracking-label text-[10px] uppercase text-muted-foreground">
              Admin Dashboard
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Products Listed" value={products.length} />
          <Stat label="Out of Stock" value={outOfStock} />
          <Stat label="Sales Recorded" value={sales.length} />
          <Stat label="Total Revenue" value={formatZAR(revenue)} />
        </div>

        <div className="mt-6 flex gap-2">
          {(["products", "sales", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                tab === t ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Product Manager</h2>
              <button
                onClick={() => setEditing(null)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl bg-card shadow-[0_4px_20px_-12px_rgba(0,0,0,0.2)]">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Sale</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border/60">
                      <td className="p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md bg-blush/40">
                          {p.images[0] && (
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-medium text-foreground">{p.name}</td>
                      <td className="p-3 text-muted-foreground">{p.category}</td>
                      <td className="p-3">{formatZAR(p.price)}</td>
                      <td className="p-3">{p.salePrice ? formatZAR(p.salePrice) : "—"}</td>
                      <td className="p-3">
                        <span className={p.inStock ? "text-whatsapp" : "text-muted-foreground"}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditing(p)}
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteProduct(p.id);
                              toast.success("Product deleted");
                            }}
                            className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-secondary"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "sales" && <SalesTracker monthRevenue={monthRevenue} />}

        {tab === "settings" && (
          <SettingsPanel
            value={settings.whatsappNumber}
            onSave={(n) => {
              setSettings({ whatsappNumber: n });
              toast.success("WhatsApp number saved");
            }}
          />
        )}
      </main>

      {editing !== undefined && (
        <ProductForm product={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}

function ProductForm({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { saveProduct } = useShop();
  const [form, setForm] = useState<Product>(
    product ?? {
      id: newLineId(),
      name: "",
      description: "",
      category: "Clothing",
      price: 0,
      salePrice: null,
      inStock: true,
      isNewArrival: false,
      images: [],
      variants: [],
      createdAt: Date.now(),
    },
  );

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const slots = 3 - form.images.length;
    Array.from(files)
      .slice(0, slots)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () =>
          setForm((f) => ({ ...f, images: [...f.images, reader.result as string] }));
        reader.readAsDataURL(file);
      });
  };

  const save = () => {
    if (!form.name.trim()) return toast.error("Product name is required");
    saveProduct({ ...form, price: Number(form.price) || 0 });
    toast.success("Product saved");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputCls} h-20 py-2`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (ZAR)">
              <input
                type="number"
                className={inputCls}
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sale Price (optional)">
              <input
                type="number"
                className={inputCls}
                value={form.salePrice ?? ""}
                onChange={(e) =>
                  setForm({ ...form, salePrice: e.target.value ? Number(e.target.value) : null })
                }
              />
            </Field>
            <Field label="Variants (comma sep.)">
              <input
                className={inputCls}
                value={form.variants.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    variants: e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </div>

          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.isNewArrival}
                onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
              />
              New Arrival
            </label>
          </div>

          <Field label={`Images (${form.images.length}/3)`}>
            <input type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="text-sm" />
            {form.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() =>
                        setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })
                      }
                      className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-foreground/70 text-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>

        <button
          onClick={save}
          className="mt-5 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}

function SalesTracker({ monthRevenue }: { monthRevenue: number }) {
  const { products, sales, addSale, deleteSale } = useShop();
  const [customer, setCustomer] = useState("");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("WhatsApp");
  const [notes, setNotes] = useState("");

  const record = () => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return toast.error("Select a product");
    if (!total) return toast.error("Enter the amount received");
    addSale({
      customerName: customer,
      items: `${prod.name} x ${qty}`,
      total: Number(total),
      paymentMethod: method,
      notes,
    });
    toast.success("Sale recorded");
    setCustomer("");
    setQty(1);
    setTotal("");
    setNotes("");
  };

  return (
    <section className="mt-6">
      <div className="mb-4 rounded-xl bg-blush/50 p-4">
        <p className="tracking-label text-[10px] uppercase text-muted-foreground">
          Total Sales This Month
        </p>
        <p className="font-display text-2xl text-foreground">{formatZAR(monthRevenue)}</p>
      </div>

      <div className="rounded-xl bg-card p-5 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.2)]">
        <h3 className="mb-3 text-base font-semibold text-foreground">Record a Sale</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Customer (optional)">
            <input className={inputCls} value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </Field>
          <Field label="Product">
            <select className={inputCls} value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input type="number" className={inputCls} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </Field>
          <Field label="Amount Received (ZAR)">
            <input type="number" className={inputCls} value={total} onChange={(e) => setTotal(e.target.value)} />
          </Field>
          <Field label="Payment Method">
            <select
              className={inputCls}
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              <option>WhatsApp</option>
              <option>Cash</option>
              <option>EFT</option>
            </select>
          </Field>
          <Field label="Notes (optional)">
            <input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
        <button
          onClick={record}
          className="mt-4 h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Record Sale
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-card shadow-[0_4px_20px_-12px_rgba(0,0,0,0.2)]">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((s: Sale) => (
                <tr key={s.id} className="border-b border-border/60">
                  <td className="p-3 text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString("en-ZA")}
                  </td>
                  <td className="p-3">{s.customerName || "—"}</td>
                  <td className="p-3">{s.items}</td>
                  <td className="p-3 font-medium">{formatZAR(s.total)}</td>
                  <td className="p-3 text-muted-foreground">{s.paymentMethod}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        deleteSale(s.id);
                        toast.success("Sale deleted");
                      }}
                      className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-secondary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SettingsPanel({ value, onSave }: { value: string; onSave: (n: string) => void }) {
  const [num, setNum] = useState(value);
  return (
    <section className="mt-6 max-w-md rounded-xl bg-card p-5 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.2)]">
      <h2 className="text-lg font-semibold text-foreground">WhatsApp Number</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Used in all checkout links. Use international format without "+", e.g. 27821234567.
      </p>
      <input className={`${inputCls} mt-3`} value={num} onChange={(e) => setNum(e.target.value)} />
      <button
        onClick={() => onSave(num.replace(/[^0-9]/g, ""))}
        className="mt-4 h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground"
      >
        Save
      </button>
    </section>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tracking-label mb-1 block text-[10px] uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
