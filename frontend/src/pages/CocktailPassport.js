import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plane, Gift, Stamp, Star, RotateCcw, Ticket, GlassWater, RefreshCw,
  Check, MapPin, X, Sparkles, ArrowRight,
} from "lucide-react";
import { PASSPORT, LOCATION } from "../data";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import GlowButton from "../components/GlowButton";
import Reveal from "../components/Reveal";
import PassportFlight from "../components/PassportFlight";

const STEP_ICONS = { ticket: Ticket, glass: GlassWater, stamp: Stamp, repeat: RefreshCw, star: Star, gift: Gift };

// A circular "GOOD DRINKS · GOOD TIMES" postmark badge, echoing the card.
function StampBadge({ className = "" }) {
  return (
    <div className={`relative grid place-items-center rounded-full border-2 border-amber/70 text-amber ${className}`}>
      <Plane size={26} className="rotate-45" />
      <div className="absolute inset-1.5 rounded-full border border-dashed border-amber/40" />
    </div>
  );
}

export default function CocktailPassport() {
  const { totalStamps, blocks, drinksPerBlock, tagline, subtitle, steps, terms } = PASSPORT;
  const [count, setCount] = useState(0);
  const [rewardOpen, setRewardOpen] = useState(false);

  // Pop the reward when the passport fills up.
  useEffect(() => {
    if (count >= totalStamps) setRewardOpen(true);
  }, [count, totalStamps]);

  const stampTo = (i) => setCount((c) => (i + 1 === c ? i : i + 1)); // click fills to i, click the last to remove it
  const remaining = Math.max(0, totalStamps - count);
  const pct = Math.round((count / totalStamps) * 100);

  const tabTrigger =
    "group relative inline-flex items-center gap-2 rounded-full border hairline px-5 py-2.5 " +
    "text-[0.72rem] uppercase tracking-[0.18em] text-white/70 transition-colors " +
    "hover:text-white hover:border-amber/40 data-[state=active]:text-ink data-[state=active]:border-amber " +
    "outline-none focus-visible:ring-2 focus-visible:ring-amber/60";

  return (
    <Tooltip.Provider delayDuration={120}>
      <div data-testid="passport-page">
        <PageHero
          eyebrow="Loyalty"
          title="The Cozy Passport"
          sub="Sip. Stamp. Repeat. Your passport to good drinks and even better times."
          image="/img/cocktail_passport.jpg"
        />

        {/* ── Passport cover: the pitch ── */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* The card visual */}
            <Reveal>
              <div className="relative rounded-[1.75rem] border border-amber/30 bg-gradient-to-br from-ink-surface to-ink p-8 sm:p-10 overflow-hidden shadow-[0_30px_120px_-30px_rgba(0,0,0,0.9)]">
                {/* postmark squiggles */}
                <svg className="absolute top-6 right-6 text-amber/30" width="90" height="34" viewBox="0 0 90 34" fill="none">
                  {[0, 11, 22].map((y) => (
                    <path key={y} d={`M2 ${8 + y} q 11 -8 22 0 t 22 0 t 22 0 t 20 0`} stroke="currentColor" strokeWidth="1.5" fill="none" />
                  ))}
                </svg>
                <div className="flex items-center gap-2 text-amber mb-6">
                  <Star size={12} className="fill-amber" />
                  <span className="text-[0.6rem] uppercase tracking-[0.3em]">Cozy Box · by Fossey's Distillery</span>
                </div>
                <h2 className="font-display text-6xl sm:text-7xl leading-[0.85] text-amber mb-6">COZY<br />PASSPORT</h2>
                <div className="flex items-center gap-5">
                  <div className="rounded-xl border border-amber/40 px-5 py-3 text-center">
                    <p className="font-display text-4xl text-amber leading-none">$25</p>
                    <p className="text-[0.55rem] uppercase tracking-[0.2em] text-smoke-dim mt-1">per block</p>
                  </div>
                  <div className="text-white/85 text-sm leading-relaxed">
                    <p className="uppercase tracking-[0.2em] text-[0.62rem] text-smoke-dim mb-1">3 Cocktails or Spirits</p>
                    <p className="font-display italic text-xl text-amber">{tagline}</p>
                  </div>
                  <StampBadge className="ml-auto h-16 w-16 shrink-0 hidden sm:grid" />
                </div>
              </div>
            </Reveal>

            {/* The pitch */}
            <Reveal>
              <p className="eyebrow mb-4">The loyalty card, reimagined</p>
              <h3 className="text-4xl sm:text-5xl mb-5 leading-[1.05]">Every pour brings you closer to a reward.</h3>
              <p className="text-smoke leading-relaxed mb-6">
                Grab a passport at the bar for ${(PASSPORT.blockPrice / 100).toFixed(0)}, enjoy any three cocktails or spirits,
                and collect a stamp with every drink. Fill all {totalStamps} stamps across as many visits as you like and
                we'll reward you with a {PASSPORT.rewardLabel}. {subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <GlowButton to="/book">Book a table</GlowButton>
                <a href={`mailto:${LOCATION.email}?subject=${encodeURIComponent("Cozy Passport enquiry")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-amber/40 text-amber px-6 py-3 text-[0.72rem] uppercase tracking-[0.18em] hover:bg-amber hover:text-ink transition-colors">
                  Ask us about it <ArrowRight size={15} />
                </a>
              </div>
              <p className="flex items-center gap-2 text-smoke-dim text-xs mt-6">
                <MapPin size={14} className="text-amber" /> Available in-venue at {LOCATION.address}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Scroll-scrubbed flight: the plane lands on the stamp strip ── */}
        <PassportFlight />

        {/* ── Tabs: How it works / Your stamp card / Good to know ── */}
        <section className="py-16 sm:py-24 border-t hairline bg-ink-surface/30">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
            <Tabs.Root defaultValue="how">
              <Tabs.List className="flex flex-wrap justify-center gap-2 mb-14" aria-label="Passport information">
                <Tabs.Trigger value="how" className={tabTrigger}><span className="relative z-10">How it works</span></Tabs.Trigger>
                <Tabs.Trigger value="card" className={tabTrigger}><span className="relative z-10">Your stamp card</span></Tabs.Trigger>
                <Tabs.Trigger value="terms" className={tabTrigger}><span className="relative z-10">Good to know</span></Tabs.Trigger>
              </Tabs.List>

              {/* How it works — 6-step journey */}
              <Tabs.Content value="how" className="outline-none">
                <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {steps.map((s, i) => {
                    const Icon = STEP_ICONS[s.icon] || Stamp;
                    return (
                      <motion.div key={s.title} variants={fadeUp}
                        className="relative rounded-2xl border hairline bg-ink p-7 hover:border-amber/40 transition-colors">
                        <span className="absolute top-6 right-6 font-display text-4xl text-white/10">{String(i + 1).padStart(2, "0")}</span>
                        <span className="grid place-items-center h-11 w-11 rounded-full border border-amber/40 text-amber mb-5"><Icon size={19} /></span>
                        <h4 className="text-xl mb-2">{s.title}</h4>
                        <p className="text-smoke text-sm leading-relaxed">{s.text}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </Tabs.Content>

              {/* Your stamp card — interactive */}
              <Tabs.Content value="card" className="outline-none">
                <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
                  {/* The live stamp page */}
                  <div className="rounded-3xl border border-amber/25 bg-ink p-7 sm:p-9">
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-2 text-amber">
                        <Star size={12} className="fill-amber" />
                        <span className="text-[0.6rem] uppercase tracking-[0.28em]">Stamp Page</span>
                      </div>
                      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-smoke-dim">Tap a stamp to try it</span>
                    </div>

                    <div className="space-y-3">
                      {Array.from({ length: blocks }).map((_, b) => (
                        <div key={b} className="flex items-center gap-4">
                          <div className="w-14 text-right shrink-0">
                            <p className="font-display text-lg text-amber leading-none">$25</p>
                            <p className="text-[0.5rem] uppercase tracking-[0.16em] text-smoke-dim mt-0.5">Block {b + 1}</p>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-3">
                            {Array.from({ length: drinksPerBlock }).map((_, j) => {
                              const i = b * drinksPerBlock + j;
                              const on = i < count;
                              return (
                                <Tooltip.Root key={i}>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() => stampTo(i)}
                                      data-testid={`stamp-${i + 1}`}
                                      aria-label={on ? `Stamp ${i + 1}, collected` : `Stamp ${i + 1}, empty`}
                                      className={`relative grid place-items-center aspect-square rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber/60
                                        ${on ? "border-amber bg-amber/15" : "border-dashed border-white/20 hover:border-amber/50"}`}
                                    >
                                      <AnimatePresence mode="wait">
                                        <motion.span
                                          key={on ? "on" : "off"}
                                          initial={on ? { scale: 1.7, rotate: -16, opacity: 0 } : false}
                                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 17 }}
                                          className={on ? "text-amber" : "text-white/25"}
                                        >
                                          <Plane size={20} className="rotate-45" />
                                        </motion.span>
                                      </AnimatePresence>
                                      <span className="absolute bottom-1 text-[0.5rem] text-smoke-dim">{i + 1}</span>
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content sideOffset={6}
                                      className="rounded-md bg-ink-surface border border-amber/30 px-2.5 py-1.5 text-[0.68rem] text-white/90 shadow-lg data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 z-[120]">
                                      {on ? "Stamped · cheers!" : `Drink ${i + 1}`}
                                      <Tooltip.Arrow className="fill-amber/30" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reward node */}
                    <div className={`mt-6 flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${count >= totalStamps ? "border-amber bg-amber/15" : "border-amber/25 bg-amber/[0.04]"}`}>
                      <Gift size={22} className="text-amber shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-white/90">{totalStamps} stamps = {PASSPORT.rewardLabel}</p>
                        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-smoke-dim">Not redeemable for cash</p>
                      </div>
                      {count >= totalStamps && <Check size={20} className="text-amber" />}
                    </div>
                  </div>

                  {/* Progress + controls */}
                  <div className="rounded-3xl border hairline bg-ink-surface/40 p-7 sm:p-8">
                    <p className="eyebrow mb-2">Your progress</p>
                    <p className="font-display text-6xl text-amber leading-none mb-1">{count}<span className="text-2xl text-smoke-dim">/{totalStamps}</span></p>
                    <p className="text-smoke text-sm mb-6">
                      {remaining > 0 ? `${remaining} ${remaining === 1 ? "stamp" : "stamps"} until your ${PASSPORT.rewardLabel}.` : "Passport complete — voucher unlocked!"}
                    </p>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-8">
                      <motion.div className="h-full rounded-full bg-amber" initial={false} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 200, damping: 26 }} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setCount((c) => Math.min(totalStamps, c + 1))} disabled={count >= totalStamps}
                        data-testid="add-stamp"
                        className="inline-flex items-center gap-2 rounded-full bg-amber text-ink px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] hover:bg-amber-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Stamp size={15} /> Add a stamp
                      </button>
                      <button onClick={() => { setCount(0); setRewardOpen(false); }}
                        data-testid="reset-stamps"
                        className="inline-flex items-center gap-2 rounded-full border hairline text-white/80 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] hover:border-amber/50 transition-colors">
                        <RotateCcw size={15} /> Reset
                      </button>
                    </div>
                    <p className="text-smoke-dim text-xs mt-6 leading-relaxed">
                      This is a live preview of how your passport fills. In-venue, our team stamps it each time you order.
                    </p>
                  </div>
                </div>
              </Tabs.Content>

              {/* Good to know — terms */}
              <Tabs.Content value="terms" className="outline-none">
                <div className="mx-auto max-w-[720px]">
                  <Reveal className="text-center mb-10">
                    <p className="eyebrow mb-3">Terms &amp; conditions</p>
                    <h3 className="text-3xl sm:text-4xl">The fine print, kept simple.</h3>
                  </Reveal>
                  <motion.ul initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="space-y-3">
                    {terms.map((t) => (
                      <motion.li key={t} variants={fadeUp}
                        className="flex items-center gap-4 rounded-xl border hairline bg-ink px-5 py-4 text-white/85">
                        <Check size={17} className="text-amber shrink-0" /> {t}
                      </motion.li>
                    ))}
                  </motion.ul>
                  <p className="text-center text-smoke-dim text-xs mt-8">
                    Stamp tracking will run on Square Loyalty in a future phase — for now your passport is stamped at the bar.
                  </p>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </section>

        {/* ── Reward Dialog ── */}
        <Dialog.Root open={rewardOpen} onOpenChange={setRewardOpen}>
          <AnimatePresence>
            {rewardOpen && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div className="fixed inset-0 z-[130] bg-ink/85 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()} data-testid="reward-dialog">
                  <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 pointer-events-none">
                    <motion.div
                      className="pointer-events-auto relative w-full max-w-md rounded-3xl border border-amber/40 bg-ink-surface p-9 text-center overflow-hidden shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    >
                      <div className="mx-auto mb-5 grid place-items-center h-16 w-16 rounded-full border-2 border-amber/60 text-amber">
                        <Gift size={30} />
                      </div>
                      <Dialog.Title className="text-3xl mb-2">Passport complete!</Dialog.Title>
                      <Dialog.Description className="text-smoke leading-relaxed mb-6">
                        That's all {totalStamps} stamps — in-venue this earns you a <span className="text-amber">{PASSPORT.rewardLabel}</span>. Sip. Stamp. Repeat.
                      </Dialog.Description>
                      <div className="flex items-center justify-center gap-2 text-amber text-[0.62rem] uppercase tracking-[0.2em] mb-7">
                        <Sparkles size={13} /> {PASSPORT.subtitle} <Sparkles size={13} />
                      </div>
                      <div className="flex gap-3">
                        <GlowButton to="/book" className="flex-1">Book a table</GlowButton>
                        <button onClick={() => { setCount(0); setRewardOpen(false); }}
                          className="inline-flex items-center gap-2 rounded-full border hairline text-white/80 px-5 py-3 text-[0.7rem] uppercase tracking-[0.18em] hover:border-amber/50 transition-colors">
                          <RotateCcw size={14} /> Again
                        </button>
                      </div>
                      <Dialog.Close asChild>
                        <button className="absolute top-4 right-4 grid place-items-center h-9 w-9 rounded-full bg-ink/60 border hairline text-white/70 hover:text-white transition-colors" aria-label="Close">
                          <X size={18} />
                        </button>
                      </Dialog.Close>
                    </motion.div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </Tooltip.Provider>
  );
}
