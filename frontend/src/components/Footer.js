import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t hairline bg-ink pt-20 pb-10" data-testid="site-footer">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <img src="/img/cozybox-logo.png" alt="Cozy Box" className="h-12 mb-6" />
            <p className="text-smoke text-sm leading-relaxed max-w-sm">
              An electric cocktail bar & lounge by Fossey's Distillery. Indian-inspired
              tapas, small-batch spirits and late nights in Carlton.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://www.instagram.com/cozybox_au/" target="_blank" rel="noreferrer"
                 className="grid place-items-center w-11 h-11 rounded-full border hairline text-white/70 hover:text-amber hover:border-amber/50 transition-colors"
                 data-testid="footer-instagram" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3 text-sm">
              {[["Our Story", "/our-story"], ["Menu", "/menu"], ["What's On", "/whats-on"],
                ["Private & Events", "/private"], ["The Cellar", "/shop"], ["Cocktail Passport", "/passport"]].map(([l, to]) => (
                <li key={to}><Link to={to} className="text-smoke hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-5">Find Us</p>
            <ul className="space-y-4 text-sm text-smoke">
              <li className="flex gap-3"><MapPin size={18} className="text-amber shrink-0 mt-0.5" /><span>209 Lygon St, Carlton VIC 3053, Australia</span></li>
              <li className="flex gap-3"><Phone size={18} className="text-amber shrink-0 mt-0.5" /><a href="tel:+61391001916" className="hover:text-white transition-colors">+61 3 9100 1916</a></li>
              <li className="flex gap-3"><Mail size={18} className="text-amber shrink-0 mt-0.5" /><a href="mailto:hello@cozybox.au" className="hover:text-white transition-colors">hello@cozybox.au</a></li>
            </ul>
            <p className="mt-6 text-smoke-dim text-xs leading-relaxed">
              Wed–Thu 4pm–10pm · Fri 4pm–12am<br />Sat 12pm–12am · Sun 12pm–10pm
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-smoke-dim text-xs">
          <p>© {new Date().getFullYear()} Cozy Box by Fossey's Distillery. All rights reserved.</p>
          <p>Please enjoy responsibly. 18+ only.</p>
        </div>
      </div>
    </footer>
  );
}
