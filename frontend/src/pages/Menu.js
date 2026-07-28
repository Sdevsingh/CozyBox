import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Sparkles, Flame, Droplet, ArrowRight } from "lucide-react";
import {
  GIN_FLIGHT, MUST_TRY, PITCHERS, WEEKLY_SPECIALS, HOUSE_OFFERS,
  FOOD_MENU, MENU_LEGEND,
} from "../data";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";

const money = (n) =>
  n == null ? "" : "$" + (Number.isInteger(n) ? n : n.toFixed(2));

const TABS = [
  { key: "flights", label: "Flights & Tasting" },
  { key: "plates", label: "Small Plates" },
  { key: "grill", label: "Skewers & Kebabs" },
  { key: "steam", label: "Bao & Dumplings" },
  { key: "pitchers", label: "Pitchers" },
  { key: "specials", label: "Weekly Specials" },
];

/* ── shared bits ─────────────────────────────────────────── */

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
    <div className="mb-9">
      <div className="flex items-center gap-5">
        <h2 className="font-display text-3xl sm:text-[2.5rem] leading-none text-amber whitespace-nowrap">{children}</h2>
        <span className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
      </div>
      {sub && <p className="mt-3 text-smoke text-sm">{sub}</p>}
    </div>
  );
}

// A single dish line with a dotted leader and price on the right.
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

function DishGrid({ items }) {
  return (
    <motion.div
      initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
      className="grid sm:grid-cols-2 gap-x-14 gap-y-9"
    >
      {items.map((it) => <DishRow key={it.name} {...it} diet={it.diet} />)}
    </motion.div>
  );
}

/* ── Flights & Tasting ───────────────────────────────────── */

function FlightsPanel() {
  return (
    <div className="space-y-20">
      {/* Hero flight card */}
      <motion.div
        initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border hairline bg-gradient-to-br from-amber/[0.08] via-ink-surface/60 to-ink"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber/10 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-2">
          {/* Text */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-amber/80 flex items-center gap-2">
              <Sparkles size={14} /> {GIN_FLIGHT.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-white mt-4 leading-[1.05]">{GIN_FLIGHT.title}</h2>
            <p className="text-smoke mt-3">{GIN_FLIGHT.note}</p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {GIN_FLIGHT.flavours.map((f) => (
                <span key={f} className="text-[0.72rem] tracking-wide text-white/85 rounded-full border hairline bg-white/[0.03] px-3.5 py-1.5 hover:border-amber/50 hover:text-amber transition-colors">
                  {f}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-display text-5xl sm:text-6xl text-amber leading-none">{money(GIN_FLIGHT.price)}</span>
              <span className="text-[0.7rem] uppercase tracking-[0.24em] text-smoke-dim">any 3 pours · Wed flight {money(10)}</span>
            </div>
          </div>

          {/* Gin tasters image */}
          <div className="relative min-h-[280px] lg:min-h-full">
            <img
              src="/img/gin_tasters.jpg"
              alt="A flight of three house distilled Fossey's gin tasters"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Blend the photo into the card on the text side */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <span className="absolute bottom-5 right-5 rounded-full border border-amber/40 bg-ink/70 backdrop-blur px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-amber">
              3 Tasters · 11+ Gins
            </span>
          </div>
        </div>
      </motion.div>

      {/* Must try */}
      <div>
        <SectionHead sub="Single malt pours our distiller wants you to meet.">Must Try</SectionHead>
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid sm:grid-cols-2 gap-6">
          {MUST_TRY.map((w) => (
            <motion.div key={w.name} variants={fadeUp} data-hover
              className="group relative overflow-hidden rounded-2xl border hairline bg-ink-surface/50 p-7 hover:border-amber/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-white group-hover:text-amber transition-colors">{w.name}</h3>
                  <p className="text-smoke text-sm mt-1 italic">"{w.note}"</p>
                  <p className="text-smoke-dim text-[0.7rem] uppercase tracking-[0.18em] mt-3">{w.kind}</p>
                </div>
                <span className="shrink-0 grid place-items-center h-14 w-14 rounded-full border border-amber/40 text-amber font-display text-lg">
                  {w.abv}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Small Plates ────────────────────────────────────────── */

function PlatesPanel() {
  const { plates, sliders, sides } = FOOD_MENU;
  return (
    <div className="space-y-16">
      <div>
        <SectionHead>{plates.label}</SectionHead>
        <DishGrid items={plates.items} />
      </div>

      <div className="grid lg:grid-cols-2 gap-x-14 gap-y-16">
        <div>
          <SectionHead sub={sliders.note}>{sliders.label}</SectionHead>
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="space-y-6">
            {sliders.items.map((it) => <DishRow key={it.name} {...it} />)}
          </motion.div>
        </div>
        <div>
          <SectionHead>{sides.label}</SectionHead>
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="space-y-6">
            {sides.items.map((it) => <DishRow key={it.name} {...it} />)}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Skewers & Kebabs ────────────────────────────────────── */

function GrillCard({ data }) {
  return (
    <div className="rounded-2xl border hairline bg-ink-surface/40 p-7 sm:p-9">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl sm:text-3xl text-amber">{data.label}</h2>
          <Diet tags={data.diet} />
        </div>
        <span className="font-display text-3xl text-amber tabular-nums shrink-0">{money(data.price)}</span>
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
        className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
        {data.items.map((it) => (
          <motion.div key={it.name} variants={fadeUp} className="flex items-baseline gap-3 group" data-hover>
            <span className="text-white group-hover:text-amber transition-colors">{it.name}</span>
            {it.desc && <>
              <span className="flex-1 border-b border-dotted border-white/10 translate-y-[-4px]" />
              <span className="text-smoke text-sm shrink-0">{it.desc}</span>
            </>}
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-6 text-smoke text-sm">{data.served}</p>
      <p className="mt-1 text-smoke-dim text-xs">{data.extra}</p>
    </div>
  );
}

function GrillPanel() {
  return (
    <div className="space-y-8">
      <GrillCard data={FOOD_MENU.skewers} />
      <GrillCard data={FOOD_MENU.kebabs} />
    </div>
  );
}

/* ── Bao & Dumplings ─────────────────────────────────────── */

function ChipRow({ label, items, accent }) {
  return (
    <div className="mt-5">
      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-smoke-dim mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((c) => (
          <span key={c} className={`text-[0.72rem] rounded-full px-3 py-1.5 border transition-colors ${accent ? "border-amber/30 text-amber/90 bg-amber/[0.04]" : "hairline text-white/80 bg-white/[0.02]"}`}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function SteamPanel() {
  const { bao, dumplings } = FOOD_MENU;
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border hairline bg-ink-surface/40 p-7 sm:p-9">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl sm:text-3xl text-amber">{bao.label}</h2>
            <Diet tags={bao.diet} />
          </div>
          <span className="font-display text-3xl text-amber tabular-nums shrink-0">{money(bao.price)}</span>
        </div>
        <p className="text-smoke text-sm mt-2">{bao.note}</p>
        <ChipRow label="Filling" items={bao.fillings} />
        <ChipRow label="Flavour" items={bao.flavours} accent />
      </div>

      <div className="rounded-2xl border hairline bg-ink-surface/40 p-7 sm:p-9">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl sm:text-3xl text-amber">{dumplings.label}</h2>
            <Diet tags={dumplings.diet} />
          </div>
          <span className="font-display text-3xl text-amber tabular-nums shrink-0">{money(dumplings.price)}</span>
        </div>
        <p className="text-smoke text-sm mt-2">{dumplings.note}</p>
        <ChipRow label="Filling" items={dumplings.fillings} />
        <div className="mt-5">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-smoke-dim mb-2.5">Sauces · {money(4)}</p>
          <div className="flex flex-wrap gap-2">
            {dumplings.sauces.map((s) => (
              <span key={s.name} className="text-[0.72rem] rounded-full px-3 py-1.5 border hairline text-white/80 bg-white/[0.02] flex items-center gap-1.5">
                {s.star && <Star size={11} className="text-amber fill-amber" />}{s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pitchers ────────────────────────────────────────────── */

function PitchersPanel() {
  return (
    <div>
      <SectionHead sub={`Poured to share · ${money(PITCHERS.price)} each`}>Cocktail Pitchers</SectionHead>
      <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
        className="grid sm:grid-cols-2 gap-5">
        {PITCHERS.items.map((p) => (
          <motion.div key={p.name} variants={fadeUp} data-hover
            className="group relative overflow-hidden rounded-2xl border hairline bg-ink-surface/40 p-6 hover:border-amber/40 transition-colors">
            <Droplet size={16} className="text-amber/60 mb-3" />
            <h3 className="font-display text-xl text-white group-hover:text-amber transition-colors">{p.name}</h3>
            <p className="text-smoke text-sm mt-1.5 leading-relaxed">{p.build}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Weekly Specials ─────────────────────────────────────── */

function SpecialsPanel() {
  return (
    <div className="space-y-12">
      <div>
        <SectionHead sub="Every week at the Cozy Box.">The Week</SectionHead>
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WEEKLY_SPECIALS.map((s) => (
            <motion.div key={s.day} variants={fadeUp} data-hover
              className="group relative overflow-hidden rounded-2xl border hairline bg-gradient-to-b from-ink-surface/60 to-ink p-6 hover:border-amber/40 transition-colors">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-amber/80">{s.day}</p>
              <h3 className="font-display text-xl text-white mt-2 group-hover:text-amber transition-colors">{s.title}</h3>
              <p className="text-smoke text-sm mt-1.5 leading-relaxed min-h-[2.5rem]">{s.detail}</p>
              <p className="font-display text-4xl text-amber mt-3">{money(s.price)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {HOUSE_OFFERS.map((o) => (
          <motion.div key={o.title} initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} data-hover
            className="group flex items-center justify-between gap-6 rounded-2xl border border-amber/20 bg-amber/[0.04] p-7 hover:bg-amber/[0.07] transition-colors">
            <div>
              <h3 className="font-display text-2xl text-white group-hover:text-amber transition-colors flex items-center gap-2">
                <Flame size={18} className="text-amber" /> {o.title}
              </h3>
              <p className="text-smoke text-sm mt-1.5">{o.detail}</p>
            </div>
            <p className="font-display text-3xl text-amber shrink-0">{o.prefix ? <span className="text-sm text-smoke mr-1">{o.prefix}</span> : null}{money(o.price)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

const PANELS = {
  flights: FlightsPanel,
  plates: PlatesPanel,
  grill: GrillPanel,
  steam: SteamPanel,
  pitchers: PitchersPanel,
  specials: SpecialsPanel,
};

export default function Menu() {
  const [tab, setTab] = useState("flights");
  const Panel = PANELS[tab];

  return (
    <div data-testid="menu-page">
      <PageHero
        eyebrow="Taste · Sip · Discover"
        title="The Menu"
        sub="Small batch spirits, house distilled gin flights and share plates built for the table."
        image="/img/menu_food_drinks.jpg"
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
          <Tabs.Root value={tab} onValueChange={setTab}>
            {/* Tab bar */}
            <Tabs.List className="flex flex-wrap justify-center gap-2 mb-16" aria-label="Menu sections">
              {TABS.map((t) => (
                <Tabs.Trigger
                  key={t.key}
                  value={t.key}
                  data-testid={`menu-tab-${t.key}`}
                  className="relative px-5 sm:px-6 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber/60 transition-colors"
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
                  <Panel />
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
