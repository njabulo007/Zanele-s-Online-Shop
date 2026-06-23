import type { CartItem } from "./shop-types";
import { formatZAR } from "./shop-types";

export function whatsappLink(number: string, message: string) {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function singleProductMessage(opts: {
  name: string;
  variant: string;
  quantity: number;
  price: number;
}) {
  return [
    "Hi Zanele's Online Shop! 👋",
    "",
    "I'd like to purchase the following item and would like to confirm if it's available:",
    "",
    `🛍️ Product: ${opts.name}`,
    `📐 Size/Variant: ${opts.variant || "—"}`,
    `🔢 Quantity: ${opts.quantity}`,
    `💰 Price: ${formatZAR(opts.price)}`,
    "",
    "Please confirm availability and arrange delivery. Thank you! 😊",
  ].join("\n");
}

export function cartMessage(items: CartItem[], subtotal: number) {
  const lines = items.map(
    (i) =>
      `🛍️ ${i.name} — ${i.variant || "—"} x ${i.quantity} — ${formatZAR(i.price * i.quantity)}`,
  );
  return [
    "Hi Zanele's Online Shop! 👋",
    "",
    "I'd like to purchase the following items and confirm availability:",
    "",
    ...lines,
    "",
    `💰 Subtotal: ${formatZAR(subtotal)}`,
    "",
    "Please confirm which items are available and arrange delivery. Thank you! 😊",
  ].join("\n");
}

export function contactMessage() {
  return "Hi Zanele's Online Shop! 👋 I have a question about your products.";
}
