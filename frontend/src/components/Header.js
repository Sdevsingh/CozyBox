import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import GlowButton from "./GlowButton";

const LINKS = [
  { to: "/our-story", label: "Our Story" },
  { to: "/menu", label: "Menu" },
  { to: "/whats-on", label: "What's On" },
  { to: "/private", label: "Private & Events" },
  { to: "/shop", label: "The Cellar" },
  { to: "/passport", label: "Passport" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc.pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 200);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
          scrolled ? "backdrop-blur-xl bg-ink/70 border-b hairline" : "bg-transparent"
        }`}
        data-testid="site-header"
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 flex items-center justify-between h-20">
          <Link to="/" data-testid="logo-home" className="shrink-0">
            <img src="/img/cozybox-logo.png" alt="Cozy Box" className="h-9 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-${l.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className={({ isActive }) =>
                  `nav-wipe text-[0.74rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
                    isActive ? "text-amber active" : "text-white/70 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <GlowButton to="/book" data-testid="book-cta-header">Book a Table</GlowButton>
          </div>

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(true)}
            data-testid="mobile-menu-open"
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/98 backdrop-blur-xl flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            data-testid="mobile-menu"
          >
            <div className="flex items-center justify-between h-20 px-6">
              <img src="/img/cozybox-logo.png" alt="Cozy Box" className="h-9" />
              <button onClick={() => setOpen(false)} className="text-white p-2" data-testid="mobile-menu-close" aria-label="Close menu">
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-8 mt-6">
              {[{ to: "/", label: "Home" }, ...LINKS, { to: "/contact", label: "Contact" }].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link to={l.to} className="block font-display text-4xl py-2 text-white/85 hover:text-amber transition-colors">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-8 mt-8">
              <GlowButton to="/book" className="w-full" data-testid="book-cta-mobile">Book a Table</GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
