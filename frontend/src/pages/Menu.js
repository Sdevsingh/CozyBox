import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, formatPrice } from "../lib/api";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";

const TABS = [
  { key: "food", label: "Food" },
  { key: "drink", label: "Cocktails" },
];

export default function Menu() {
  const [tab, setTab] = useState("food");
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/catalog").then((r) => setItems(r.data.items)).catch(() => {});
  }, []);

  const sections = useMemo(() => {
    const filtered = items.filter((i) => i.category === tab);
    const map = {};
    filtered.forEach((i) => {
      (map[i.section] = map[i.section] || []).push(i);
    });
    return Object.entries(map);
  }, [items, tab]);

  return (
    <div data-testid="menu-page">
      <PageHero eyebrow="Food & Drinks" title="The Menu" sub="Small plates made for sharing, cocktails poured with Fossey's spirits." image="/img/menu_food_drinks.jpg" />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-16">
            <div className="inline-flex rounded-full border hairline p-1 bg-ink-surface/60">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  data-testid={`menu-tab-${t.key}`}
                  className="relative px-8 py-2.5 text-[0.74rem] uppercase tracking-[0.2em] rounded-full transition-colors"
                >
                  {tab === t.key && (
                    <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-amber" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className={`relative z-10 ${tab === t.key ? "text-ink" : "text-white/70"}`}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
              {sections.map(([section, list]) => (
                <div key={section} className="mb-16">
                  <div className="flex items-center gap-5 mb-8">
                    <h2 className="text-3xl sm:text-4xl text-amber whitespace-nowrap">{section}</h2>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                    {list.map((it) => (
                      <motion.div key={it.id} variants={fadeUp} data-testid={`menu-item-${it.id}`} className="group" data-hover>
                        <div className="flex items-baseline gap-3">
                          <h3 className="text-xl text-white group-hover:text-amber transition-colors">{it.name}</h3>
                          {it.dietary?.length > 0 && (
                            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-smoke-dim border hairline rounded px-1.5 py-0.5">{it.dietary.join(" · ")}</span>
                          )}
                          <span className="flex-1 border-b border-dotted border-white/15 translate-y-[-4px]" />
                          <span className="text-amber font-display text-2xl">{formatPrice(it.price)}</span>
                        </div>
                        <p className="text-smoke text-sm mt-1.5 max-w-md leading-relaxed">{it.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-smoke-dim text-xs mt-8">V = Vegetarian · GF = Gluten Free · DFO = Dairy Free Option. Please advise staff of any allergies.</p>
        </div>
      </section>
    </div>
  );
}
