import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SPIRITS } from "../data";
import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";
import Particles from "./Particles";
import GlowButton from "./GlowButton";

// Group the full Fossey's range by category for the showcase list.
const RANGE = Object.entries(
  SPIRITS.reduce((acc, s) => { (acc[s.section] = acc[s.section] || []).push(s); return acc; }, {})
);

function AutoVideo({ src, caption, reduce, crop }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-amber/15 bg-ink-surface/40 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)]"
    >
      <Link to="/shop" aria-label={`${caption}, visit The Cellar`} className="block">
        {/* aspect wrapper hard-clips the frame; crop widens + left-anchors the
            video so the right-edge Instagram handle is clipped off entirely */}
        <div className="relative aspect-[9/16] overflow-hidden">
          <video
            ref={ref}
            className={`absolute inset-y-0 left-0 h-full max-w-none object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05] ${crop ? "w-[138%]" : "w-full"}`}
            muted loop playsInline preload="metadata" controls={false}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
        {/* cinematic grading */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 vignette" />
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-amber/0 via-amber/0 to-amber/15" />

        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full neon-pill text-[0.55rem] uppercase tracking-[0.2em] px-3 py-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          Shop the Cellar <ArrowUpRight size={11} />
        </span>

        <figcaption className="absolute bottom-6 left-6 right-6">
          <p className="text-[0.58rem] uppercase tracking-[0.28em] text-amber/80 mb-1">Fossey's Distillery</p>
          <p className="font-display text-2xl sm:text-3xl leading-tight text-white flex items-center gap-2">
            {caption}
            <ArrowUpRight size={18} className="text-amber opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </p>
        </figcaption>
      </Link>
    </motion.figure>
  );
}

export default function VideoStatement() {
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-ink py-24 sm:py-32 overflow-hidden" data-testid="video-statement">
      <Particles density={0.5} className="opacity-40" />
      <div className="hero-aurora absolute inset-0 mix-blend-screen opacity-30" />

      <div className="relative mx-auto max-w-[1300px] px-6 sm:px-10">
        {/* Statement */}
        <div className="text-center mb-14 sm:mb-16 max-w-3xl mx-auto">
          <Reveal><p className="eyebrow mb-5">Our own distillery · Carlton</p></Reveal>
          <SplitReveal
            as="h2"
            text="The Fossey's range."
            className="neon-text text-4xl sm:text-6xl lg:text-7xl leading-[0.95] justify-center flex flex-wrap"
          />
          <Reveal>
            <p className="text-smoke text-lg mt-6 max-w-xl mx-auto leading-relaxed">
              Gin, vodka, whisky, rum and our Indian Series. Every bottle distilled, aged and poured under one roof.
            </p>
          </Reveal>
        </div>

        {/* Two cinematic panels + the full range beside them */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_1.05fr] gap-8 lg:gap-12 items-center">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <AutoVideo src="/video/fosseys_range.mp4" caption="Crafted by hand" reduce={reduce} />
            <AutoVideo src="/video/statement-1.mp4" caption="Poured neat" reduce={reduce} />
          </div>

          {/* Interactive range directory — Radix vertical Tabs keep it tidy
              regardless of how many bottles sit in each category. */}
          <div>
            <Tabs.Root defaultValue={RANGE[0][0]} orientation="vertical"
              className="grid grid-cols-[8.5rem_1fr] sm:grid-cols-[10.5rem_1fr] gap-4 sm:gap-6">
              {/* category rail */}
              <Tabs.List className="flex flex-col gap-1.5" aria-label="Fossey's range by category">
                {RANGE.map(([cat, items]) => (
                  <Tabs.Trigger
                    key={cat}
                    value={cat}
                    data-testid={`range-tab-${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border hairline px-3.5 py-3 text-left
                      text-[0.72rem] uppercase tracking-[0.14em] text-white/70 transition-colors
                      hover:text-white hover:border-amber/40
                      data-[state=active]:bg-amber data-[state=active]:text-ink data-[state=active]:border-amber
                      outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                  >
                    <span className="leading-tight">{cat}</span>
                    <span className="text-[0.62rem] tabular-nums opacity-70 data-[state=active]:opacity-100">{items.length}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {/* selected category's bottles */}
              {RANGE.map(([cat, items]) => (
                <Tabs.Content key={cat} value={cat} className="outline-none">
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="grid sm:grid-cols-2 gap-2.5 content-start"
                  >
                    {items.map((s) => (
                      <Link
                        key={s.id}
                        to="/shop"
                        className="group rounded-xl border hairline bg-ink/40 px-4 py-3 hover:border-amber/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-white/90 group-hover:text-amber transition-colors leading-tight">{s.name}</span>
                          <span className="text-[0.62rem] text-smoke-dim shrink-0 tabular-nums">{s.abv}</span>
                        </div>
                        {s.tagline && <p className="text-smoke text-xs mt-1 line-clamp-1">{s.tagline}</p>}
                      </Link>
                    ))}
                  </motion.div>
                </Tabs.Content>
              ))}
            </Tabs.Root>

            <Reveal className="mt-9">
              <GlowButton to="/shop" data-testid="range-cta">Explore The Cellar</GlowButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
