import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Stamp } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import GlowButton from "../components/GlowButton";
import Reveal from "../components/Reveal";

const TIERS = [
  { name: "Free signature cocktail", points: 50 },
  { name: "Cocktail flight for two", points: 150 },
  { name: "Private cocktail masterclass", points: 300 },
];

export default function CocktailPassport() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    api.get("/passport/plans").then((r) => setPlans(r.data.plans)).catch(() => {});
  }, []);

  return (
    <div data-testid="passport-page">
      <PageHero eyebrow="Membership" title="The Cocktail Passport" sub="Collect stamps. Unlock rewards. Drink better, more often." image="/img/cocktail_passport.jpg" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid md:grid-cols-2 gap-6">
            {plans.map((p, idx) => (
              <motion.div key={p.id} variants={fadeUp} data-testid={`plan-${p.id}`}
                className={`relative rounded-2xl border p-8 ${idx === 1 ? "border-amber/50 bg-ink-surface shadow-glowsoft" : "hairline bg-ink-surface/40"}`}>
                {idx === 1 && <span className="absolute top-6 right-6 rounded-full bg-amber text-ink text-[0.6rem] uppercase tracking-[0.2em] px-3 py-1">Best value</span>}
                <p className="eyebrow mb-3">{p.cadence === "MONTHLY" ? "Monthly" : "Annual"}</p>
                <h2 className="text-3xl mb-2">{p.name.split("—")[0]}</h2>
                <p className="font-display text-5xl text-amber mb-1">{formatPrice(p.price)}</p>
                <p className="text-smoke-dim text-xs uppercase tracking-[0.2em] mb-7">{p.cadence === "MONTHLY" ? "per month" : "per year"}</p>
                <ul className="space-y-3 mb-8">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex gap-3 text-sm text-white/85"><Check size={17} className="text-amber shrink-0 mt-0.5" />{perk}</li>
                  ))}
                </ul>
                <GlowButton to="/contact" variant={idx === 1 ? "solid" : "ghost"} className="w-full" data-testid={`join-${p.id}`}>Join {p.cadence === "MONTHLY" ? "Monthly" : "Annual"}</GlowButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t hairline bg-ink-surface/30">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <Reveal className="text-center mb-14">
            <p className="eyebrow mb-4">How stamps work</p>
            <h2 className="text-4xl sm:text-5xl">Earn 1 stamp per $1</h2>
          </Reveal>
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid sm:grid-cols-3 gap-6">
            {TIERS.map((t) => (
              <motion.div key={t.points} variants={fadeUp} className="text-center rounded-2xl border hairline bg-ink p-8">
                <Stamp className="mx-auto text-amber mb-4" size={30} />
                <p className="font-display text-4xl text-amber mb-2">{t.points}</p>
                <p className="text-smoke-dim text-xs uppercase tracking-[0.2em] mb-3">stamps</p>
                <p className="text-white/85">{t.name}</p>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-smoke-dim text-xs mt-10">Membership billing & stamp tracking will run on Square Loyalty & Subscriptions (Phase 2).</p>
        </div>
      </section>
    </div>
  );
}
