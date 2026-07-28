import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { LOCATION, HOURS, hourLabel, openStatus } from "../data";

// Recompute the open/now + today highlight every minute so it stays live.
function useOpenStatus() {
  const [status, setStatus] = useState(() => openStatus());
  useEffect(() => {
    const id = setInterval(() => setStatus(openStatus()), 60000);
    return () => clearInterval(id);
  }, []);
  return status;
}

// Uniform column heading — same treatment across all three columns so the
// footer reads as one arranged system rather than three mismatched blocks.
function ColHeading({ children, accessory }) {
  return (
    <div className="flex items-center justify-between mb-6 h-6">
      <h3 className="text-[0.72rem] uppercase tracking-[0.28em] text-amber/80">{children}</h3>
      {accessory}
    </div>
  );
}

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION.address)}`;

export default function Footer() {
  const { openNow, todayDow } = useOpenStatus();

  return (
    <footer className="relative border-t hairline bg-ink pt-20 pb-10" data-testid="site-footer">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        {/* Brand mark — logo already carries "by Fossey's Distillery"; no repeat */}
        <div className="text-center">
          <img src="/img/cozybox-logo.png" alt="Cozy Box by Fossey's Distillery" className="h-16 mx-auto" />
        </div>

        <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* The House */}
          <div className="lg:col-span-4">
            <ColHeading>The House</ColHeading>
            <p className="text-smoke text-sm leading-[1.75] max-w-sm">{LOCATION.aboutBlurb}</p>
            <div className="mt-7 flex gap-3">
              {[
                { href: LOCATION.instagram, Icon: Instagram, label: "Instagram" },
                { href: LOCATION.facebook, Icon: Facebook, label: "Facebook" },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="grid place-items-center w-10 h-10 rounded-full border hairline text-white/70 hover:text-amber hover:border-amber/50 hover:bg-amber/5 transition-colors"
                  data-testid={`footer-${label.toLowerCase()}`} aria-label={label}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Visit */}
          <div className="lg:col-span-4">
            <ColHeading>Visit Us</ColHeading>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3.5">
                <MapPin size={17} className="text-amber shrink-0 mt-0.5" />
                <div>
                  <p className="text-smoke leading-relaxed">{LOCATION.address}, Australia</p>
                  <a href={MAPS_URL} target="_blank" rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-amber/90 hover:text-amber transition-colors text-[0.8rem]"
                    data-testid="footer-directions">
                    Get directions <ArrowUpRight size={13} />
                  </a>
                </div>
              </li>
              <li className="flex gap-3.5">
                <Mail size={17} className="text-amber shrink-0 mt-0.5" />
                <a href={`mailto:${LOCATION.email}`} className="text-smoke hover:text-white transition-colors">{LOCATION.email}</a>
              </li>
              <li className="flex gap-3.5">
                <Phone size={17} className="text-amber shrink-0 mt-0.5" />
                <a href={`tel:${LOCATION.phone.replace(/\s/g, "")}`} className="text-smoke hover:text-white transition-colors">{LOCATION.phone}</a>
              </li>
            </ul>
            <Link to="/book"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber/40 px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.22em] text-amber hover:bg-amber hover:text-ink transition-colors"
              data-testid="footer-reserve">
              Reserve a Table <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-4">
            <ColHeading
              accessory={
                <span className="inline-flex items-center gap-2" data-testid="open-status">
                  <span className="relative flex h-2 w-2">
                    {openNow && <span className="absolute inline-flex h-full w-full rounded-full bg-green-400/60 animate-ping" />}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${openNow ? "bg-green-400" : "bg-red-400/80"}`} />
                  </span>
                  <span className={`text-[0.62rem] uppercase tracking-[0.22em] ${openNow ? "text-green-400" : "text-red-400/90"}`}>
                    {openNow ? "Open Now" : "Closed"}
                  </span>
                </span>
              }
            >
              Opening Hours
            </ColHeading>

            <ul>
              {HOURS.map((h) => {
                const isToday = h.dow === todayDow;
                const closed = h.open == null;
                return (
                  <li key={h.day}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-colors ${isToday ? "bg-amber/10" : ""}`}
                    data-testid={`hours-${h.day.toLowerCase()}`}>
                    <span className="flex items-center gap-2">
                      <span className={`text-sm ${isToday ? "text-amber" : "text-white/80"}`}>{h.day}</span>
                      {isToday && <span className="text-[0.5rem] uppercase tracking-[0.2em] text-amber/70 border border-amber/30 rounded px-1.5 py-0.5">Today</span>}
                    </span>
                    <span className={`text-sm tabular-nums ${closed ? "italic text-smoke-dim" : isToday ? "text-amber" : "text-smoke"}`}>
                      {hourLabel(h)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 px-3 text-smoke-dim text-xs italic">Kitchen closes one hour before last call.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t hairline flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between text-smoke-dim text-xs">
          <p className="order-2 sm:order-1">© {new Date().getFullYear()} Cozy Box by Fossey's Distillery. All rights reserved.</p>
          <nav className="order-1 sm:order-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[["Our Story", "/our-story"], ["Menu", "/menu"], ["What's On", "/whats-on"],
              ["Private & Events", "/private"], ["The Cellar", "/shop"], ["Passport", "/passport"]].map(([l, to]) => (
              <Link key={to} to={to} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </nav>
          <p className="order-3 hidden lg:block">Please enjoy responsibly. 18+ only.</p>
        </div>
      </div>
    </footer>
  );
}
