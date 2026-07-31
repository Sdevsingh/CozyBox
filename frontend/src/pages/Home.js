import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { SPIRITS, EVENTS, CATALOG, formatPrice } from "../data";
import { fadeUp, stagger, viewport } from "../lib/motion";
import GlowButton from "../components/GlowButton";
import Reveal from "../components/Reveal";
import ReviewsMarquee from "../components/ReviewsMarquee";
import SplitReveal from "../components/SplitReveal";
import Marquee from "../components/Marquee";
import Magnetic from "../components/Magnetic";
import LightStreak from "../components/LightStreak";
import StaggerGrid from "../components/StaggerGrid";
import HorizontalScroll from "../components/HorizontalScroll";
import Particles from "../components/Particles";
import TiltCard from "../components/TiltCard";
import VideoStatement from "../components/VideoStatement";

/* ─────────────────────────────────────────
   HERO — full-bleed video / photo with
   parallax text and scroll indicator
───────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const txtY = useTransform(scrollYProgress, [0, 1], ["0%", "65%"]);
  const txtOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.6], [0, 340]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[660px] overflow-hidden vignette flex items-center justify-center"
      data-testid="hero"
    >
      {/* ── Background: video with img fallback ── */}
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          ref={videoRef}
          className="video-hero kenburns-slow"
          autoPlay
          muted
          loop
          playsInline
          poster="/img/fosseys_still.jpg"
        >
          {/* Drop a Higgsfield-generated .mp4 here when ready */}
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        {/* Fallback static image shown until video loads */}
        <img
          src="/img/fosseys_still.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: -1 }}
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/45 to-ink" />

      {/* Animated amber aurora glow */}
      <div className="hero-aurora pointer-events-none absolute inset-0 mix-blend-screen" />

      {/* Drifting embers */}
      <Particles className="opacity-60" density={0.8} />

      {/* Side verticals */}
      <span className="hidden md:block absolute left-7 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[0.62rem] uppercase tracking-[0.45em] text-white/40">
        Est. Carlton · Melbourne
      </span>
      <span className="hidden md:block absolute right-7 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[0.62rem] uppercase tracking-[0.45em] text-white/40">
        Tapas · Cocktails · Late
      </span>

      {/* Hero content */}
      <motion.div
        style={{ y: txtY, opacity: txtOpacity }}
        className="relative text-center px-6 max-w-5xl [perspective:1200px]"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="eyebrow mb-6"
        >
          by Fossey's Distillery
        </motion.p>

        <motion.div
          initial={{ opacity: 0, filter: "blur(24px)", scale: 0.9 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateY: logoRotate, rotateX: 6 }}
          className="relative mx-auto w-[min(78vw,460px)] mb-8 preserve-3d transform-gpu"
        >
          {/* extruded depth layers give the mark real thickness as it turns */}
          {Array.from({ length: 18 }).map((_, i) => (
            <img
              key={i}
              src="/img/cozybox-logo.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-auto"
              style={{ transform: `translateZ(${-(i + 1) * 3}px)`, filter: `brightness(${Math.max(0.1, 0.45 - i * 0.028)})` }}
            />
          ))}
          {/* front face */}
          <img
            src="/img/cozybox-logo.png"
            alt="Cozy Box"
            className="relative w-full h-auto drop-shadow-[0_8px_60px_rgba(0,0,0,0.85)]"
            style={{ transform: "translateZ(3px)" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="font-display italic text-xl sm:text-2xl text-white mb-10 text-glow"
        >
          Expect the unexpected. Tapas, cocktails &amp; late nights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <Magnetic>
            <GlowButton to="/book" data-testid="hero-book">Book a Table</GlowButton>
          </Magnetic>
          <Magnetic>
            <GlowButton to="/menu" variant="ghost" data-testid="hero-menu">Explore the Menu</GlowButton>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          className="h-12 w-px bg-gradient-to-b from-amber to-transparent"
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MARQUEE TICKER
───────────────────────────────────────── */
function Ticker() {
  return (
    <div className="py-10 border-y hairline bg-ink relative overflow-hidden">
      <LightStreak delay={200} />
      <Marquee items={["Cocktails", "Indian Tapas", "Late Nights", "Fossey's Spirits", "Carlton"]} />
    </div>
  );
}

/* ─────────────────────────────────────────
   INTRO — sticky-reveal image + copy
   LIGHT section
───────────────────────────────────────── */
function Intro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1, 1.08]);
  const clip = useTransform(scrollYProgress, [0, 0.5], ["inset(18% 18% 18% 18%)", "inset(0% 0% 0% 0%)"]);

  return (
    <section ref={ref} className="relative py-28 sm:py-40 section-light">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal><p className="eyebrow mb-7">Welcome to the Cozy Box</p></Reveal>
          <SplitReveal
            as="h2"
            text="Where Indian flavour meets the after-dark."
            className="text-4xl sm:text-5xl lg:text-6xl leading-[0.98] mb-9"
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="space-y-5 text-[#4a3f30] text-lg leading-relaxed max-w-xl"
          >
            <motion.p variants={fadeUp}>
              A bluestone room on Lygon Street that reimagines Indian tapas for the cocktail
              hour. Small plates made for sharing, poured beside small batch spirits from
              Fossey's Distillery.
            </motion.p>
            <motion.p variants={fadeUp}>
              Come for the duck sliders. Stay for the Redgum Old Fashioned and the DJ.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-3">
              <Link
                to="/our-story"
                className="group inline-flex items-center gap-2 text-[#a0720f] text-sm uppercase tracking-[0.2em]"
              >
                Our Story <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div style={{ clipPath: clip }} className="relative h-[560px] rounded-[2rem] overflow-hidden border border-black/10">
          <motion.img
            style={{ scale: imgScale }}
            src="/img/fosseys_bar.jpg"
            alt="Inside the Cozy Box"
            className="h-full w-full object-cover"
          />
          <div className="absolute -bottom-px left-0 right-0 h-24 bg-gradient-to-t from-[#f5f0e8] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PINNED HORIZONTAL SHOWCASE
   DARK section
───────────────────────────────────────── */
const PANELS = [
  { to: "/menu", n: "01", label: "The Menu", img: "/img/food6.jpg", copy: "Indian inspired tapas & signature cocktails, built for the table." },
  { to: "/shop", n: "02", label: "The Cellar", img: "/img/shop_bottles.jpg", copy: "Fossey's small batch spirits. Gin, vodka, whisky, rum & the Indian Series." },
  { to: "/whats-on", n: "03", label: "What's On", img: "/img/whats_on.jpg", copy: "Ladies Night, resident DJs, launch parties & masterclasses." },
  { to: "/private", n: "04", label: "Private & Events", img: "/img/private_events.jpg", copy: "Booths, functions, corporate nights & exclusive venue hire." },
];

function Showcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-74%"]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.max(0, Math.min(PANELS.length - 1, Math.floor(v * PANELS.length + 0.15))));
  });

  return (
    <section ref={ref} className="relative h-[360vh] bg-ink" data-testid="showcase">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* ambient life so the empty space never feels dead */}
        <Particles density={0.4} className="opacity-30" />
        <div className="hero-aurora absolute inset-0 mix-blend-screen opacity-20 pointer-events-none" />

        <div className="relative px-6 sm:px-10 mb-10 flex items-end justify-between max-w-[1500px] mx-auto w-full">
          <h2 className="text-3xl sm:text-5xl leading-none">A night,<br />your way.</h2>
          <span className="hidden sm:block text-smoke-dim text-xs uppercase tracking-[0.3em] pulse-idle">Scroll →</span>
        </div>

        <motion.div style={{ x }} className="relative flex gap-6 sm:gap-8 pl-6 sm:pl-10 w-max">
          {PANELS.map((p, i) => (
            <Link
              key={p.to}
              to={p.to}
              data-testid={`panel-${p.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={`group relative w-[78vw] sm:w-[60vw] lg:w-[42vw] h-[60vh] rounded-[1.75rem] overflow-hidden border shrink-0 transition-all duration-500 ${i === active ? "border-amber/40 shadow-[0_20px_80px_-30px_rgba(255,159,28,0.5)]" : "hairline"}`}
            >
              <img src={p.img} alt={p.label} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
              <span className="absolute top-7 left-7 font-display text-2xl text-amber/80">{p.n}</span>
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <h3 className="text-3xl sm:text-4xl mb-3 group-hover:text-amber transition-colors">{p.label}</h3>
                <p className="text-smoke max-w-md mb-5">{p.copy}</p>
                <span className="inline-flex items-center gap-2 text-amber text-xs uppercase tracking-[0.2em]">
                  Discover <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   THE REEL — mixed Events + Signature Cocktails
   DARK / CLUB section — GSAP pinned horizontal
───────────────────────────────────────── */
const fmtReelDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short" });

// Interleave upcoming events with signature pours for an eye-catching mix.
function buildReel() {
  const events = EVENTS.map((e) => ({
    kind: "event",
    id: e.id,
    title: e.title,
    sub: e.tagline,
    img: e.image,
    badge: e.category,
    meta: fmtReelDate(e.date),
    to: "/whats-on",
    cta: e.bookable ? "RSVP" : "Details",
  }));
  const cocktails = CATALOG
    .filter((i) => i.category === "drink")
    .slice(0, 6)
    .map((c) => ({
      kind: "cocktail",
      id: c.id,
      title: c.name,
      sub: c.description,
      img: c.image || (c.spirit === "Whisky" ? "/img/real_still.jpg" : "/img/real_cocktail.jpg"),
      badge: c.spirit || "Signature",
      meta: formatPrice(c.price),
      to: "/menu",
      cta: "On the menu",
    }));

  // weave: event, cocktail, event, cocktail …
  const reel = [];
  const max = Math.max(events.length, cocktails.length);
  for (let i = 0; i < max; i++) {
    if (events[i]) reel.push(events[i]);
    if (cocktails[i]) reel.push(cocktails[i]);
  }
  return reel;
}

function ReelCard({ item }) {
  const isEvent = item.kind === "event";
  return (
    <Link
      to={item.to}
      data-testid={`reel-${item.id}`}
      className="glow-ring group relative shrink-0 w-[74vw] sm:w-[40vw] lg:w-[27vw] rounded-2xl overflow-hidden border hairline bg-ink-surface/40 snap-start"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.img}
          alt={item.title} loading="lazy" decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber/0 via-amber/0 to-amber/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* type badge */}
      <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full neon-pill text-[0.58rem] uppercase tracking-[0.2em] px-3 py-1.5">
        {isEvent ? <CalendarDays size={11} /> : <Sparkles size={11} />}
        {item.badge}
      </span>

      {/* meta chip (date / price) */}
      <span className="absolute top-5 right-5 rounded-full bg-ink/70 backdrop-blur-sm border hairline text-white text-[0.62rem] uppercase tracking-[0.16em] px-3 py-1.5">
        {item.meta}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-amber/80 mb-1">
          {isEvent ? "What's On" : "Now Pouring"}
        </p>
        <h3 className="text-2xl leading-tight mb-2 group-hover:text-amber transition-colors">{item.title}</h3>
        <p className="text-smoke text-sm mb-4 leading-relaxed line-clamp-2">{item.sub}</p>
        <span className="inline-flex items-center gap-2 text-amber text-[0.7rem] uppercase tracking-[0.2em]">
          {item.cta} <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}

function TheReel() {
  const reel = buildReel();
  return (
    <div className="relative bg-ink">
      {/* drifting embers for the club atmosphere */}
      <Particles className="opacity-70" density={1.1} />
      <LightStreak delay={100} />

      <div className="relative pt-20 pb-4 px-8 sm:px-14 max-w-[1500px] mx-auto">
        <Reveal>
          <p className="eyebrow mb-4">Tonight at the Cozy Box</p>
          <SplitReveal as="h2" text="The lineup &amp; the pour." className="neon-text text-3xl sm:text-5xl mb-2" />
          <p className="text-smoke max-w-lg mt-3">Events, DJ nights and the signature cocktails worth showing up for. Scroll the reel.</p>
        </Reveal>
      </div>

      <HorizontalScroll>
        {reel.map((item) => <ReelCard key={item.id} item={item} />)}

        {/* CTA card */}
        <div className="shrink-0 w-[58vw] sm:w-[30vw] lg:w-[20vw] rounded-2xl border border-amber/30 bg-ink-surface neon-breathe flex flex-col items-center justify-center gap-6 p-8 snap-start text-center">
          <Sparkles className="text-amber" size={34} />
          <p className="text-white/85 leading-relaxed">See every event and the full cocktail list.</p>
          <div className="flex flex-col gap-3 w-full">
            <GlowButton to="/whats-on">What's On</GlowButton>
            <GlowButton to="/menu" variant="ghost">View Menu</GlowButton>
          </div>
        </div>
      </HorizontalScroll>
    </div>
  );
}

/* ─────────────────────────────────────────
   SPIRITS STAGGER GRID
   LIGHT section
───────────────────────────────────────── */
function Spirits() {
  return (
    <section className="py-28 sm:py-36 section-light">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow mb-4">From our distillery</p>
          <SplitReveal as="h2" text="Crafted by Fossey's" className="text-3xl sm:text-5xl justify-center flex flex-wrap" />
        </Reveal>

        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6" stagger={90} slideY={20}>
          {SPIRITS.slice(0, 4).map((s) => (
            <TiltCard key={s.id} className="h-full">
              <Link
                to="/shop"
                data-testid={`spirit-${s.id}`}
                className="tilt-lift group block rounded-2xl border border-black/10 bg-white/60 p-5 sm:p-6 h-full hover:border-[#a0720f]/40 transition-colors"
              >
                <div className="shine-host aspect-[3/4] rounded-xl overflow-hidden mb-5 bg-[#e8e0d0] tilt-depth">
                  <img
                    src={s.image || "/img/shop_bottles.jpg"}
                    alt={s.name}
                    onError={(e) => { if (!e.currentTarget.src.includes("shop_bottles")) e.currentTarget.src = "/img/shop_bottles.jpg"; }}
                    className="h-full w-full object-cover opacity-95 group-hover:scale-110 transition-transform duration-700"
                  />
                  <span className="card-shine" />
                </div>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#8a7050] mb-1">Fossey's · {s.section}</p>
                <h3 className="text-lg sm:text-xl leading-tight mb-1 group-hover:text-[#a0720f] transition-colors text-[#1a1510]">{s.name}</h3>
                <p className="text-[#6b5c3e] text-xs mb-2 leading-snug">{s.abv} · {s.size}</p>
                <p className="text-[#a0720f] font-display text-xl">{formatPrice(s.price)}</p>
              </Link>
            </TiltCard>
          ))}
        </StaggerGrid>

        <Reveal className="mt-12 text-center">
          <GlowButton to="/shop" variant="ghost" data-testid="home-shop-cta">Visit The Cellar</GlowButton>
        </Reveal>
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────
   HOME PAGE — composition
───────────────────────────────────────── */
export default function Home() {
  return (
    <div data-testid="home-page">
      {/* 1. Cinematic video hero */}
      <Hero />

      {/* 2. Ticker marquee — dark → with light streak */}
      <Ticker />

      {/* 3. Welcome intro — LIGHT */}
      <Intro />

      {/* 4. Dual vertical video statement — DARK */}
      <VideoStatement />

      {/* 5. Pinned horizontal showcase — DARK */}
      <Showcase />

      {/* 5. The Reel — events + cocktails mix (GSAP) — CLUB */}
      <TheReel />

      {/* 6. Spirits stagger grid — LIGHT */}
      <Spirits />

      {/* 7. Reviews marquee */}
      <ReviewsMarquee />

      {/* 10. Reverse marquee */}
      <div className="py-8 bg-ink overflow-hidden">
        <Marquee reverse items={["Book a Table", "209 Lygon St", "Open Late", "Cozy Box"]} />
      </div>

      {/* 11. Final booking CTA — LIGHT */}
      <section className="py-32 sm:py-44 section-light relative overflow-hidden">
        <LightStreak delay={0} />
        <div className="mx-auto max-w-[1500px] px-6 sm:px-10 text-center">
          <SplitReveal
            as="h2"
            text="Your table is waiting."
            className="text-5xl sm:text-7xl leading-[0.95] mb-10 justify-center flex flex-wrap"
          />
          <Magnetic>
            <GlowButton to="/book" data-testid="home-book-cta">Book a Table</GlowButton>
          </Magnetic>
        </div>
      </section>
    </div>
  );
}
