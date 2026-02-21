import { Link } from "react-router-dom";
import { MapPin, Phone, Instagram } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/types";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary pb-24 pt-10 text-primary-foreground md:pb-10">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-bold">Jossy-Diva Collections</h3>
            <p className="mt-2 text-sm opacity-80">
              Wholesale & Retail Store for All Fashion Items
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Contact</h4>
            <div className="mt-3 space-y-2 text-sm opacity-80">
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 hover:opacity-100"
              >
                <Phone className="h-4 w-4" />
                +234-904 926 4366
              </a>
              <a href="tel:+2348162187320" className="flex items-center gap-2 hover:opacity-100">
                <Phone className="h-4 w-4" />
                +234-808 422 2261
              </a>
              <a
                href="https://instagram.com/jossydiva_collection"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-100"
              >
                <Instagram className="h-4 w-4" />
                @jossydiva_collection
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Location</h4>
            <p className="mt-3 flex items-start gap-2 text-sm opacity-80">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              11 Jejeleko Street, Otemuyi Inside, Off Matogun Road, Ogun State
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs opacity-60">
              © {new Date().getFullYear()} Jossy-Diva Collections. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs opacity-60">
              <Link to="/shop" className="hover:opacity-100">Shop</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
