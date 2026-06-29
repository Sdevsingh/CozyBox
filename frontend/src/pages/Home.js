import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { fadeUp, blurReveal, stagger, viewport } from "../lib/motion";
import GlowButton from "../components/GlowButton";
import Reveal from "../components/Reveal";
import ReviewsMarquee from "../components/ReviewsMarquee";

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden vignette" data-testid="hero">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src="/img/hero_club.jpg" alt="" className="h-full w-full object-cover kenburns" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-ink/25" />
      <div className="relative text-center px-6 max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="eyebrow mb-5">
          Carlton · Melbourne · by Fossey's Distillery
        </motion.p>
        <motion.img
          src="/img/cozybox-logo.png" alt="Cozy Box"
          initial={{ opacity: 0, filter: "blur(20px)", scale: 0.94 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-[min(70vw,420px)] mb-7 drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        />
        <p className="font-display italic text-xl sm:text-2xl text-white mb-9 text-glow">
          Expect the unexpected — tapas, cocktails &amp; late nights.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <GlowButton to="/book" data-testid="hero-book">Book a Table</GlowButton>
          <GlowButton to="/menu" variant="ghost" data-testid="hero-menu">Explore the Menu</GlowButton>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-smoke-dim">
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-amber to-transparent" />
      </div>
    </section>
  );
}

const TILES = [
  { to: "/menu", label: "The Menu", img: "/img/menu_food_drinks.jpg", copy: "Indian-inspired tapas & signature cocktails", span: "md:col-span-7" },
  { to: "/shop", label: "The Cellar", img: "/img/shop_bottles.jpg", copy: "Fossey's small-batch spirits, shipped", span: "md:col-span-5" },
  { to: "/whats-on", label: "What's On", img: "/img/whats_on.jpg", copy: "Ladies Night, DJs & masterclasses", span: "md:col-span-5" },
  { to: "/private", label: "Private & Events", img: "/img/private_events.jpg", copy: "Booths, functions & exclusive hire", span: "md:col-span-7" },
];

function Tile({ t }) {
  return (
    <Reveal className={t.span}>
      <Link to={t.to} data-testid={`tile-${t.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
        className="group relative block h-[340px] sm:h-[400px] overflow-hidden rounded-2xl border hairline">
        <img src={t.img} alt={t.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl sm:text-4xl mb-1">{t.label}</h3>
              <p className="text-smoke text-sm">{t.copy}</p>
            </div>
            <span className="grid place-items-center w-11 h-11 rounded-full border border-amber/40 text-amber transition-all duration-300 group-hover:bg-amber group-hover:text-ink">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Home() {
  const [spirits, setSpirits] = useState([]);
  useEffect(() => {
    api.get("/catalog", { params: { category: "retail" } }).then((r) => setSpirits(r.data.items)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Hero />

      {/* Intro */}
      <section className="relative py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal><p className="eyebrow mb-6">Welcome to the Cozy Box</p></Reveal>
            <Reveal variants={blurReveal}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.02] mb-8">
                Where Indian flavour<br />meets the after-dark.
              </h2>
            </Reveal>
            <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="space-y-5 text-smoke text-lg leading-relaxed max-w-xl">
              <motion.p variants={fadeUp}>
                Tucked into a bluestone room on Lygon Street, the Cozy Box reimagines Indian
                tapas for the cocktail hour — small plates made for sharing, poured alongside
                small-batch spirits from Fossey's Distillery.
              </motion.p>
              <motion.p variants={fadeUp}>
                Bold, expressive and built around the table. Come for the duck sliders, stay
                for the Redgum Old Fashioned and the DJ.
              </motion.p>
              <motion.div variants={fadeUp} className="pt-3">
                <Link to="/our-story" className="inline-flex items-center gap-2 text-amber text-sm uppercase tracking-[0.2em] hover:gap-4 transition-all">
                  Our Story <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <Reveal variants={blurReveal} className="relative">
            <div className="relative h-[520px] rounded-2xl overflow-hidden border hairline">
              <img src="/img/our_story.jpg" alt="Inside the Cozy Box" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-ink-surface border border-amber/30 px-7 py-5 shadow-glowsoft">
              <p className="font-display text-3xl text-amber">209 Lygon St</p>
              <p className="text-smoke text-xs uppercase tracking-[0.2em] mt-1">Carlton, Melbourne</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bento tiles */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <Reveal className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl sm:text-5xl">A night, your way.</h2>
            <p className="text-smoke max-w-sm text-sm">Whatever the occasion — dinner, drinks, a date, or the whole venue.</p>
          </Reveal>
          <div className="grid md:grid-cols-12 gap-5 sm:gap-6">
            {TILES.map((t) => <Tile key={t.to} t={t} />)}
          </div>
        </div>
      </section>

      {/* Signature spirits */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow mb-4">From the distillery</p>
            <h2 className="text-4xl sm:text-5xl">Our Fossey's spirits</h2>
          </Reveal>
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {spirits.slice(0, 4).map((s) => (
              <motion.div key={s.id} variants={fadeUp}>
                <Link to="/shop" data-testid={`spirit-${s.id}`}
                  className="group block rounded-2xl border hairline bg-ink-surface/50 p-6 h-full hover:border-amber/40 transition-colors">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-5 bg-ink">
                    <img src="/img/shop_bottles.jpg" alt={s.name} className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke-dim mb-1">Fossey's</p>
                  <h3 className="text-xl leading-tight mb-2 group-hover:text-amber transition-colors">{s.name}</h3>
                  <p className="text-amber text-sm">{formatPrice(s.price)}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <Reveal className="mt-12 text-center">
            <GlowButton to="/shop" variant="ghost" data-testid="home-shop-cta">Visit The Cellar</GlowButton>
          </Reveal>
        </div>
      </section>

      {/* Passport teaser */}
      <section className="relative py-32 overflow-hidden">
        <img src="/img/cocktail_passport.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto max-w-3xl text-center px-6">
          <Reveal><p className="eyebrow mb-5">Members get more</p></Reveal>
          <Reveal variants={blurReveal}>
            <h2 className="text-4xl sm:text-6xl mb-6 text-glow">The Cocktail Passport</h2>
          </Reveal>
          <Reveal>
            <p className="text-smoke text-lg mb-9 max-w-xl mx-auto">
              A cocktail on the house every visit, double stamps, skip-the-line entry and
              member-only masterclasses. Collect stamps, unlock rewards.
            </p>
          </Reveal>
          <Reveal><GlowButton to="/passport" data-testid="home-passport-cta">Become a Member</GlowButton></Reveal>
        </div>
      </section>

      <ReviewsMarquee />

      {/* CTA band */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 text-center">
          <Reveal variants={blurReveal}>
            <h2 className="text-5xl sm:text-7xl leading-[0.95] mb-8">Your table is<br />waiting.</h2>
          </Reveal>
          <Reveal><GlowButton to="/book" data-testid="home-book-cta">Book a Table</GlowButton></Reveal>
        </div>
      </section>
    </div>
  );
}
