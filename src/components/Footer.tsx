import { Instagram, Facebook } from "lucide-react";
import { useShop } from "@/lib/shop-store";
import { whatsappLink, contactMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./FloatingWhatsApp";

export function Footer() {
  const { settings } = useShop();
  return (
    <footer id="contact" className="mt-20 border-t border-border/60 bg-blush/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-3xl text-foreground">Zanele's</p>
          <p className="tracking-label mt-2 text-xs uppercase text-muted-foreground">
            Look good. Feel confident. Shop Zanele's.
          </p>

          <a
            href={whatsappLink(settings.whatsappNumber, contactMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-medium text-whatsapp-foreground"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat with us on WhatsApp
          </a>

          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-background text-foreground/70 transition-colors hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full bg-background text-foreground/70 transition-colors hover:text-primary"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            © 2025 Zanele's Online Shop
          </p>
        </div>
      </div>
    </footer>
  );
}
