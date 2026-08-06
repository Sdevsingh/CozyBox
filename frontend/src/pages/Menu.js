import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { LUNCH_MENU, DINNER_MENU, MENU_LEGEND } from "../data";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";

const money = (n) =>
  n == null ? "" : "$" + (Number.isInteger(n) ? n : n.toFixed(2));

const TABS = [
  { key: "lunch", label: "Lunch", menu: LUNCH_MENU },
  { key: "dinner", label: "Dinner", menu: DINNER_MENU },
];

function Diet({ tags }) {
  if (!tags?.length) return null;
  return (
    <span className="shrink-0 text-[0.55rem] uppercase tracking-[0.14em] text-smoke-dim border hairline rounded px-1.5 py-0.5">
      {tags.join(" · ")}
    </span>
  );
}

function SectionHead({ children, sub }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-5">
        <h2 className="font-display text-3xl sm:text-[2.5rem] leading-none text-amber whitespace-nowrap">{children}</h2>
        <span className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
      </div>
      {sub && <p className="mt-3 text-smoke text-sm">{sub}</p>}
    </div>
  );
}

// A dish line: name (+ star), dietary chips, dotted leader, price, description.
function DishRow({ name, desc, price, diet, star }) {
  return (
    <motion.div variants={fadeUp} className="group" data-hover>
      <div className="flex items-baseline gap-3">
        <h3 className="text-lg text-white group-hover:text-amber transition-colors flex items-center gap-2">
          {name}
          {star && <Star size={13} className="text-amber fill-amber" />}
        </h3>
        <Diet tags={diet} />
        <span className="flex-1 border-b border-dotted border-white/15 translate-y-[-4px]" />
        {price != null && <span className="font-display text-2xl text-amber tabular-nums">{money(price)}</span>}
      </div>
      {desc && <p className="text-smoke text-sm mt-1.5 max-w-md leading-relaxed">{desc}</p>}
    </motion.div>
  );
}

function MenuTab({ menu }) {
  return (
    <div className="space-y-16">
      {menu.sections.map((sec) => (
        <div key={sec.label}>
          <SectionHead sub={sec.note}>{sec.label}</SectionHead>
          <motion.div
            initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
            className="grid sm:grid-cols-2 gap-x-14 gap-y-9"
          >
            {sec.items.map((it) => <DishRow key={it.name} {...it} />)}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [tab, setTab] = useState("lunch");
  const active = TABS.find((t) => t.key === tab) || TABS[0];

  return (
    <div data-testid="menu-page">
      <PageHero
        eyebrow="Taste · Sip · Discover"
        title="The Menu"
        sub="Lunch by day, tapas and large plates by night — Indian flavour, share-friendly and built for the table."
        image="/img/menu_food_drinks.jpg"
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
          <Tabs.Root value={tab} onValueChange={setTab}>
            {/* Lunch / Dinner switch */}
            <Tabs.List className="flex justify-center gap-2 mb-16" aria-label="Menu">
              {TABS.map((t) => (
                <Tabs.Trigger
                  key={t.key}
                  value={t.key}
                  data-testid={`menu-tab-${t.key}`}
                  className="relative px-8 sm:px-10 py-2.5 text-[0.74rem] uppercase tracking-[0.2em] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber/60 transition-colors"
                >
                  {tab === t.key && (
                    <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-amber"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className={`relative z-10 ${tab === t.key ? "text-ink font-medium" : "text-white/70 hover:text-white"}`}>{t.label}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value={tab} forceMount>
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  <MenuTab menu={active.menu} />
                </motion.div>
              </AnimatePresence>
            </Tabs.Content>
          </Tabs.Root>

          {/* Legend + function hire */}
          <div className="mt-20 pt-10 border-t hairline flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-smoke-dim">
              {MENU_LEGEND.map((l) => (
                <span key={l.code}><span className="text-amber/80 font-medium">{l.code}</span> {l.label}</span>
              ))}
              <span className="flex items-center gap-1.5"><Star size={11} className="text-amber fill-amber" /> Staff pick</span>
            </div>
            <a href="mailto:hello@cozybox.au?subject=Function%20%26%20group%20booking"
              className="group inline-flex items-center gap-2 text-sm text-amber hover:text-white transition-colors shrink-0" data-testid="menu-function-hire">
              Function hire · group bookings, birthdays & engagements
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="mt-6 text-center text-smoke-dim text-xs">Please advise our team of any dietary requirements or allergies.</p>
        </div>
      </section>
    </div>
  );
}
