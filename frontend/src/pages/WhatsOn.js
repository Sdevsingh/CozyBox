import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, ArrowUpRight } from "lucide-react";
import { EVENTS, formatPrice } from "../data";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import GlowButton from "../components/GlowButton";

const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long" });

// A weekly event shows its recurring label ("Every Wednesday"); a one-off shows its date.
const whenLabel = (e) => e.recurring || (e.date ? fmtDate(e.date) : "");

export default function WhatsOn() {
  const events = EVENTS;
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...new Set(events.map((e) => e.category))];
  }, []);

  const filtered = useMemo(() =>
    activeCategory === "All" ? events : events.filter((e) => e.category === activeCategory),
    [activeCategory]
  );

  return (
    <div data-testid="whats-on-page">
      <PageHero eyebrow="What's On" title="The Lineup" sub="Wednesday gin flights, Thursday Ladies Night, the Friday Passport and Fossey's masterclasses." image="/img/whats_on.jpg" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <div className="inline-flex flex-wrap gap-2 rounded-full border hairline p-1 bg-ink-surface/60">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`filter-${cat.toLowerCase()}`}
                  className="relative px-5 py-2 text-[0.7rem] uppercase tracking-[0.18em] rounded-full transition-colors"
                >
                  {activeCategory === cat && (
                    <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-amber" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className={`relative z-10 ${activeCategory === cat ? "text-ink" : "text-white/70"}`}>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {filtered.map((e) => (
                  <motion.article key={e.id} variants={fadeUp} data-testid={`event-${e.id}`}
                    className="group relative overflow-hidden rounded-2xl border hairline">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    </div>
                    <div className="absolute top-5 left-5">
                      <span className="rounded-full bg-amber/90 text-ink text-[0.62rem] uppercase tracking-[0.2em] px-3 py-1.5">{e.category}</span>
                    </div>
                    <div className="absolute top-5 right-5">
                      <span className="rounded-full bg-ink/70 backdrop-blur-sm border border-amber/40 text-amber text-[0.62rem] uppercase tracking-[0.18em] px-3 py-1.5">
                        {formatPrice(e.priceFrom)} {e.priceUnit || ""}
                      </span>
                    </div>
                    <div className="p-7">
                      <h2 className="text-3xl mb-1 group-hover:text-amber transition-colors">{e.title}</h2>
                      <p className="text-amber italic font-display text-lg mb-4">{e.tagline}</p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-smoke text-xs uppercase tracking-[0.15em] mb-4">
                        <span className="flex items-center gap-2"><CalendarDays size={15} className="text-amber" />{whenLabel(e)}</span>
                        <span className="flex items-center gap-2"><Clock size={15} className="text-amber" />{e.startTime}</span>
                      </div>
                      {e.highlights?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {e.highlights.map((h) => (
                            <span key={h} className="rounded-full border hairline bg-white/[0.03] text-white/80 text-[0.7rem] px-3 py-1">{h}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-smoke text-sm leading-relaxed mb-6">{e.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">{formatPrice(e.priceFrom)} <span className="text-smoke-dim">{e.priceUnit || ""}</span></span>
                        <a
                          href={`mailto:hello@cozybox.au?subject=${encodeURIComponent(`Event enquiry: ${e.title} — ${whenLabel(e)}`)}&body=${encodeURIComponent(`Hi Cozy Box team,\n\nI'd like to enquire about "${e.title}" (${whenLabel(e)}${e.startTime ? ", " + e.startTime : ""}).\n\nNumber of guests:\nPreferred date:\nName:\nContact number:\n\nThank you!`)}`}
                          className="inline-flex items-center gap-2 text-amber text-xs uppercase tracking-[0.2em] hover:gap-4 transition-all"
                          data-testid={`event-book-${e.id}`}
                        >
                          {e.bookable ? "Enquire / RSVP" : "Details"} <ArrowUpRight size={15} />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {filtered.length === 0 && (
                <p className="text-center text-smoke py-20">No events in this category right now.</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Newsletter / stay in the loop */}
          <div className="mt-20 rounded-2xl border border-amber/20 bg-ink-surface/40 p-10 sm:p-14 text-center">
            <p className="eyebrow mb-4">Never miss a night</p>
            <h3 className="text-3xl sm:text-4xl mb-4">Stay in the loop.</h3>
            <p className="text-smoke max-w-md mx-auto mb-8">New events, exclusive invites and early access — straight to your inbox.</p>
            <GlowButton to="/contact">Get in Touch</GlowButton>
          </div>
        </div>
      </section>
    </div>
  );
}
