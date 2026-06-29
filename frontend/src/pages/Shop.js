import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, X, ShieldCheck } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import GlowButton from "../components/GlowButton";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api.get("/catalog", { params: { category: "retail" } }).then((r) => setItems(r.data.items)).catch(() => {});
  }, []);

  const add = (it) => { setCart((c) => ({ ...c, [it.id]: (c[it.id] || 0) + 1 })); setOpen(true); };
  const dec = (id) => setCart((c) => { const n = { ...c }; n[id] = (n[id] || 0) - 1; if (n[id] <= 0) delete n[id]; return n; });
  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const lines = useMemo(() => Object.entries(cart).map(([id, qty]) => ({ ...items.find((i) => i.id === id), qty })).filter((l) => l.id), [cart, items]);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div data-testid="shop-page">
      <PageHero eyebrow="The Cellar" title="Fossey's, shipped." sub="Small-batch spirits from our distillery — delivered across Australia." image="/img/shop_bottles.jpg" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((it) => (
              <motion.div key={it.id} variants={fadeUp} data-testid={`product-${it.id}`}
                className="group flex flex-col rounded-2xl border hairline bg-ink-surface/40 overflow-hidden hover:border-amber/40 transition-colors">
                <div className="aspect-[4/5] overflow-hidden bg-ink">
                  <img src="/img/shop_bottles.jpg" alt={it.name} className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-smoke-dim mb-1">Fossey's Distillery</p>
                  <h3 className="text-xl leading-tight mb-2">{it.name}</h3>
                  <p className="text-smoke text-sm leading-relaxed mb-5 flex-1">{it.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber font-display text-2xl">{formatPrice(it.price)}</span>
                    <button onClick={() => add(it)} data-testid={`add-${it.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-amber text-ink px-4 py-2 text-[0.7rem] uppercase tracking-[0.18em] hover:bg-amber-soft transition-colors">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
                    <img src="/img/shop_bottles.jpg" alt={l.name} className="w-16 h-20 object-cover rounded-lg border hairline" />
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
                {checked ? (
                  <div className="rounded-xl border border-amber/40 bg-ink-surface p-4 text-center" data-testid="checkout-notice">
                    <ShieldCheck className="mx-auto text-amber mb-2" />
                    <p className="text-sm text-white/85">Secure card checkout is powered by <strong>Square</strong> and arrives in Phase 2. Your cart is ready to go.</p>
                  </div>
                ) : (
                  <GlowButton onClick={() => setChecked(true)} className="w-full" disabled={lines.length === 0} data-testid="checkout-btn">Checkout</GlowButton>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
