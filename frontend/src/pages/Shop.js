import { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, X, Eye, Truck } from "lucide-react";
import { CATALOG_RETAIL, SPIRIT_CATEGORIES, formatPrice } from "../data";
import { api } from "../lib/api";
import { getConfig, loadSquareSdk } from "../lib/square";
import { fadeUp, stagger, viewport } from "../lib/motion";
import GlowButton from "../components/GlowButton";
import SpiritDialog from "../components/SpiritDialog";
import CheckoutDialog from "../components/CheckoutDialog";
import PourScene from "../components/PourScene";
import Particles from "../components/Particles";
import JsonLd from "../components/JsonLd";
import { catalogSchema } from "../lib/seo";

export default function Shop() {
  // Render the curated local list instantly, then silently upgrade to the
  // live Square Catalog (price + image managed in Square) when available.
  const [items, setItems] = useState(CATALOG_RETAIL);
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [active, setActive] = useState(null); // spirit shown in quick-view dialog

  // Warm up the Square Web Payments SDK while browsing, so Checkout is instant
  useEffect(() => {
    getConfig().then((c) => { if (c?.enabled) loadSquareSdk(c.environment).catch(() => {}); });
  }, []);

  useEffect(() => {
    api.get("/catalog", { params: { category: "retail" } })
      .then((r) => {
        if (r.data?.source === "square" && r.data.items?.length) {
          const merged = r.data.items.map((si) => {
            const local = CATALOG_RETAIL.find((s) => s.name.toLowerCase() === (si.name || "").toLowerCase());
            return {
              ...(local || {}),
              ...si,
              description: si.description || local?.description || "",
              image: si.image || local?.image,
              tagline: local?.tagline,
              abv: local?.abv,
              size: local?.size,
              badge: local?.badge,
            };
          });
          setItems(merged);
        }
      })
      .catch(() => {}); // keep local list on any failure
  }, []);

  const add = (it) => { if (!it.price) return; setCart((c) => ({ ...c, [it.id]: (c[it.id] || 0) + 1 })); setOpen(true); };
  const dec = (id) => setCart((c) => { const n = { ...c }; n[id] = (n[id] || 0) - 1; if (n[id] <= 0) delete n[id]; return n; });
  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const lines = useMemo(() => Object.entries(cart).map(([id, qty]) => ({ ...items.find((i) => i.id === id), qty })).filter((l) => l.id), [cart, items]);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  // count per category for the tab labels
  const counts = useMemo(() => {
    const c = { All: items.length };
    items.forEach((i) => { c[i.section] = (c[i.section] || 0) + 1; });
    return c;
  }, [items]);

  const shown = cat === "All" ? items : items.filter((i) => i.section === cat);
  const activeMeta = SPIRIT_CATEGORIES.find((c) => c.key === cat) || SPIRIT_CATEGORIES[0];

  return (
    <div data-testid="shop-page">
      {/* Structured data for the full Cellar — Product/ItemList rich results */}
      <JsonLd data={catalogSchema(items)} />

      {/* Cellar hero — full-bleed, feathered into the page top + bottom so it blends seamlessly */}
      <section className="relative bg-ink">
        <div className="relative h-[64vh] min-h-[460px] w-full overflow-hidden flex items-end">
          <img src="/img/fosseys_still_elsie.jpg" alt="Elsie, the Fossey's copper still" className="absolute inset-0 h-full w-full object-cover object-[50%_42%]" />
          {/* blend the top up into the header */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink via-ink/45 to-transparent" />
          {/* melt the bottom + left down into the page so there is no hard edge */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent" />
          <Particles density={0.45} className="opacity-30" />
          <div className="relative mx-auto max-w-[1400px] w-full px-6 sm:px-10 pb-16 sm:pb-24">
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="eyebrow mb-3">The Cellar</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="neon-text text-4xl sm:text-6xl leading-[0.95] mb-3">
                Fossey's, shipped.
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-smoke text-base sm:text-lg max-w-md mb-6 leading-relaxed">
                Small batch spirits from our own distillery, shipped right across Australia.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.32 }}>
                <GlowButton onClick={() => document.getElementById("cellar-grid")?.scrollIntoView({ behavior: "smooth" })}>Shop the range</GlowButton>
              </motion.div>
            </div>
        </div>
      </section>

      {/* Scroll-scrubbed craft pour — opens the Cellar */}
      <PourScene
        eyebrow="Our Single Malt"
        title="Poured by hand."
        sub="We distil, age and bottle every batch ourselves at 209 Lygon Street. Scroll to pour a dram, then take a bottle home with you."
        ctaLabel="Shop the Whisky"
        ctaOnClick={() => { setCat("Whisky"); document.getElementById("cellar-grid")?.scrollIntoView({ behavior: "smooth" }); }}
      />

      <section id="cellar-grid" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">

          <Tabs.Root value={cat} onValueChange={(v) => setCat(v)}>
            {/* Category navigation */}
            <Tabs.List
              className="flex flex-wrap justify-center gap-2 mb-6"
              aria-label="Filter spirits by category"
            >
              {SPIRIT_CATEGORIES.map((c) => (
                <Tabs.Trigger
                  key={c.key}
                  value={c.key}
                  data-testid={`cat-${c.key.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="group relative inline-flex items-center gap-2 rounded-full border hairline px-5 py-2.5
                    text-[0.72rem] uppercase tracking-[0.18em] text-white/70 transition-colors
                    hover:text-white hover:border-amber/40
                    data-[state=active]:text-ink data-[state=active]:border-amber
                    outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                >
                  {cat === c.key && (
                    <motion.span layoutId="cat-active" className="absolute inset-0 rounded-full bg-amber" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative z-10">{c.label}</span>
                  <span className={`relative z-10 text-[0.6rem] ${cat === c.key ? "text-ink/70" : "text-smoke-dim"}`}>
                    {counts[c.key] || 0}
                  </span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* Category blurb — the "why buy" line */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeMeta.key}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-center text-smoke max-w-2xl mx-auto mb-4 leading-relaxed"
              >
                {activeMeta.blurb}
              </motion.p>
            </AnimatePresence>
            <p className="flex items-center justify-center gap-2 text-smoke-dim text-xs uppercase tracking-[0.2em] mb-12">
              <Truck size={14} className="text-amber" /> Free shipping on orders over $150
            </p>

            {/* Grid (single content pane; filtering handled in state for animation) */}
            <Tabs.Content value={cat} forceMount>
              <AnimatePresence mode="wait">
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {shown.map((it) => (
                    <motion.div
                      key={it.id} variants={fadeUp} initial="hidden" animate="show"
                      data-testid={`product-${it.id}`}
                      className="glow-ring group flex flex-col rounded-2xl border hairline bg-ink-surface/40 overflow-hidden hover:border-amber/40 transition-colors"
                    >
                      <button onClick={() => setActive(it)} className={`relative block aspect-[4/5] overflow-hidden text-left ${it.packshot ? "bg-gradient-to-b from-white/[0.07] via-ink to-ink" : "bg-ink"}`} aria-label={`Quick view ${it.name}`}>
                        <img src={it.image || "/img/shop_bottles.jpg"} alt={it.name} loading="lazy" decoding="async"
                          onError={(e) => { if (!e.currentTarget.src.includes("shop_bottles")) e.currentTarget.src = "/img/shop_bottles.jpg"; }}
                          className={`h-full w-full group-hover:scale-105 transition-transform duration-700 ${it.packshot ? "object-contain p-6" : "object-cover opacity-90"}`} />
                        <span className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="inline-flex items-center gap-2 rounded-full bg-ink/70 border border-amber/40 text-white text-[0.66rem] uppercase tracking-[0.18em] px-4 py-2">
                            <Eye size={14} className="text-amber" /> Quick View
                          </span>
                        </span>
                        {it.badge && (
                          <span className="absolute top-4 left-4 rounded-full neon-pill text-[0.55rem] uppercase tracking-[0.18em] px-2.5 py-1">{it.badge}</span>
                        )}
                      </button>
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-smoke-dim mb-1">Fossey's · {it.section}</p>
                        <h3 className="text-xl leading-tight mb-0.5">{it.name}</h3>
                        <p className="text-smoke-dim text-xs mb-2">{it.abv} · {it.size}</p>
                        <p className="text-smoke text-sm leading-relaxed mb-5 flex-1">{it.tagline || it.description}</p>
                        <div className="flex items-center justify-between">
                          {it.price ? (
                            <>
                              <span className="text-amber font-display text-2xl">{formatPrice(it.price)}</span>
                              <button onClick={() => add(it)} data-testid={`add-${it.id}`}
                                className="inline-flex items-center gap-2 rounded-full bg-amber text-ink px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] hover:bg-amber-soft transition-colors">
                                <Plus size={14} /> Add
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-smoke text-xs uppercase tracking-[0.15em]">Price in store</span>
                              <a href={`mailto:hello@cozybox.au?subject=${encodeURIComponent("Cellar enquiry: " + it.name)}`}
                                className="inline-flex items-center gap-2 rounded-full border border-amber/50 text-amber px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] hover:bg-amber hover:text-ink transition-colors">
                                Enquire
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </section>

      {/* Quick-view dialog */}
      <SpiritDialog spirit={active} onClose={() => setActive(null)} onAdd={(it) => { add(it); setActive(null); }} />

      {/* Checkout — centered two-panel dialog (bottles stay in view beside payment) */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        lines={lines}
        total={total}
        inc={inc}
        dec={dec}
        onDone={() => setCart({})}
      />

      {/* Floating cart button */}
      <button onClick={() => setOpen(true)} data-testid="cart-toggle"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-amber text-ink px-5 py-3.5 shadow-glow">
        <ShoppingBag size={18} />
        <span className="text-sm font-medium">{count}</span>
      </button>

      {/* Cart drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-ink border-l hairline flex flex-col"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 36 }}
              data-testid="cart-drawer">
              <div className="flex items-center justify-between p-6 border-b hairline">
                <h2 className="text-2xl">Your Cellar</h2>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white" data-testid="cart-close"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {lines.length === 0 && <p className="text-smoke text-center mt-16">Your cart is empty.</p>}
                {lines.map((l) => (
                  <div key={l.id} className="flex gap-4" data-testid={`cart-line-${l.id}`}>
                    <img src={l.image || "/img/shop_bottles.jpg"} alt={l.name} className="w-16 h-20 object-cover rounded-lg border hairline" />
                    <div className="flex-1">
                      <h4 className="text-sm leading-tight">{l.name}</h4>
                      <p className="text-amber text-sm mt-1">{formatPrice(l.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => dec(l.id)} className="w-7 h-7 grid place-items-center rounded-full border hairline hover:border-amber/50"><Minus size={13} /></button>
                        <span className="text-sm w-5 text-center">{l.qty}</span>
                        <button onClick={() => inc(l.id)} className="w-7 h-7 grid place-items-center rounded-full border hairline hover:border-amber/50"><Plus size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t hairline">
                <div className="flex justify-between mb-4">
                  <span className="text-smoke uppercase tracking-[0.2em] text-xs">Total</span>
                  <span className="text-amber font-display text-3xl">{formatPrice(total)}</span>
                </div>
                <GlowButton onClick={() => { setOpen(false); setCheckoutOpen(true); }} className="w-full" disabled={lines.length === 0} data-testid="checkout-btn">Checkout</GlowButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
