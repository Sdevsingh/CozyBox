import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { fadeUp, stagger, viewport } from "../lib/motion";
import GlowButton from "../components/GlowButton";
import Reveal from "../components/Reveal";
import ReviewsMarquee from "../components/ReviewsMarquee";
import SplitReveal from "../components/SplitReveal";
import Marquee from "../components/Marquee";
import Magnetic from "../components/Magnetic";

/* ---------------- HERO ---------------- */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const txtY = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const txtOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[660px] overflow-hidden vignette flex items-center justify-center" data-testid="hero">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src="/img/hero_club.jpg" alt="" className="h-full w-full object-cover kenburns" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink" />

      {/* side verticals */}
      <span className="hidden md:block absolute left-7 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[0.62rem] uppercase tracking-[0.45em] text-white/40">Est. Carlton — Melbourne</span>
      <span className="hidden md:block absolute right-7 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[0.62rem] uppercase tracking-[0.45em] text-white/40">Tapas · Cocktails · Late</span>

      <motion.div style={{ y: txtY, opacity: txtOpacity }} className="relative text-center px-6 max-w-4xl">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="eyebrow mb-6">
          by Fossey's Distillery
        </motion.p>
        <motion.img
          src="/img/cozybox-logo.png" alt="Cozy Box"
          initial={{ opacity: 0, filter: "blur(24px)", scale: 0.92 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-[min(78vw,440px)] mb-8 drop-shadow-[0_8px_50px_rgba(0,0,0,0.7)]"
        />
        <p className="font-display italic text-xl sm:text-2xl text-white mb-9 text-glow">
          Expect the unexpected — tapas, cocktails &amp; late nights.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Magnetic><GlowButton to="/book" data-testid="hero-book">Book a Table</GlowButton></Magnetic>
          <Magnetic><GlowButton to="/menu" variant="ghost" data-testid="hero-menu">Explore the Menu</GlowButton></Magnetic>
        </div>
      </motion.div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-smoke-dim">
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-amber to-transparent" />
      </div>
    </section>
  );
}

/* ---------------- INTRO with sticky scaling image ---------------- */
function Intro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1, 1.1]);
  const clip = useTransform(scrollYProgress, [0, 0.5], ["inset(18% 18% 18% 18%)", "inset(0% 0% 0% 0%)"]);

  return (
    <section ref={ref} className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal><p className="eyebrow mb-7">Welcome to the Cozy Box</p></Reveal>
          <SplitReveal as="h2" text="Where Indian flavour meets the after-dark." className="text-4xl sm:text-5xl lg:text-6xl leading-[0.98] mb-9" />
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="space-y-5 text-smoke text-lg leading-relaxed max-w-xl">
            <motion.p variants={fadeUp}>
              A bluestone room on Lygon Street that reimagines Indian tapas for the cocktail
              hour — small plates made for sharing, poured beside small-batch spirits from
              Fossey's Distillery.
            </motion.p>
            <motion.p variants={fadeUp}>
              Come for the duck sliders. Stay for the Redgum Old Fashioned and the DJ.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-3">
              <Link to="/our-story" className="group inline-flex items-center gap-2 text-amber text-sm uppercase tracking-[0.2em]">
                Our Story <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div style={{ clipPath: clip }} className="relative h-[560px] rounded-[2rem] overflow-hidden border hairline">
          <motion.img style={{ scale: imgScale }} src="/img/our_story.jpg" alt="Inside the Cozy Box" className="h-full w-full object-cover" />
          <div className="absolute -bottom-px left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PINNED HORIZONTAL SHOWCASE ---------------- */
const PANELS = [
  { to: "/menu", n: "01", label: "The Menu", img: "/img/menu_food_drinks.jpg", copy: "Indian-inspired tapas & signature cocktails, built for the table." },
  { to: "/shop", n: "02", label: "The Cellar", img: "/img/shop_bottles.jpg", copy: "Fossey's small-batch spirits — gin, vodka, whisky, rum & the Indian Series." },
  { to: "/whats-on", n: "03", label: "What's On", img: "/img/whats_on.jpg", copy: "Ladies Night, resident DJs, launch parties & masterclasses." },
  { to: "/private", n: "04", label: "Private & Events", img: "/img/private_events.jpg", copy: "Booths, functions, corporate nights & exclusive venue hire." },
];

function Showcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-74%"]);

  return (
    <section ref={ref} className="relative h-[360vh]" data-testid="showcase">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-6 sm:px-10 mb-10 flex items-end justify-between max-w-[1500px] mx-auto w-full">
          <h2 className="text-3xl sm:text-5xl leading-none">A night,<br />your way.</h2>
          <span className="hidden sm:block text-smoke-dim text-xs uppercase tracking-[0.3em]">Scroll →</span>
        </div>
        <motion.div style={{ x }} className="flex gap-6 sm:gap-8 pl-6 sm:pl-10 w-max">
          {PANELS.map((p) => (
            <Link key={p.to} to={p.to} data-testid={`panel-${p.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="group relative w-[78vw] sm:w-[60vw] lg:w-[42vw] h-[60vh] rounded-[1.75rem] overflow-hidden border hairline shrink-0">
              <img src={p.img} alt={p.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
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

/* ---------------- SPIRITS ---------------- */
function Spirits() {
  const [spirits, setSpirits] = useState([]);
  useEffect(() => {
    api.get("/catalog", { params: { category: "retail" } }).then((r) => setSpirits(r.data.items)).catch(() => {});
  }, []);
  return (
    <section className="py-28 sm:py-36">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow mb-4">From the distillery</p>
          <SplitReveal as="h2" text="Our Fossey's spirits" className="text-3xl sm:text-5xl justify-center flex flex-wrap" />
        </Reveal>
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {spirits.slice(0, 4).map((s) => (
            <motion.div key={s.id} variants={fadeUp}>
              <Link to="/shop" data-testid={`spirit-${s.id}`} className="group block rounded-2xl border hairline bg-ink-surface/50 p-5 sm:p-6 h-full hover:border-amber/40 transition-colors">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-5 bg-ink">
                  <img src="/img/shop_bottles.jpg" alt={s.name} className="h-full w-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-smoke-dim mb-1">{s.section}</p>
                <h3 className="text-lg sm:text-xl leading-tight mb-2 group-hover:text-amber transition-colors">{s.name}</h3>
                <p className="text-amber text-sm">{formatPrice(s.price)}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <Reveal className="mt-12 text-center"><GlowButton to="/shop" variant="ghost" data-testid="home-shop-cta">Visit The Cellar</GlowButton></Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <div className="py-10 border-y hairline bg-ink">
        <Marquee items={["Cocktails", "Indian Tapas", "Late Nights", "Fossey's Spirits", "Carlton"]} />
      </div>
      <Intro />
      <Showcase />
      <Spirits />

      {/* Passport */}
      <section className="relative py-36 overflow-hidden vignette">
        <img src="/img/cocktail_passport.jpg" alt="" className="absolute inset-0 h-full w-full object-cover kenburns" />
        <div className="absolute inset-0 bg-ink/82" />
        <div className="relative mx-auto max-w-3xl text-center px-6">
          <Reveal><p className="eyebrow mb-5">Members get more</p></Reveal>
          <SplitReveal as="h2" text="The Cocktail Passport" className="text-4xl sm:text-6xl mb-7 text-glow justify-center flex flex-wrap" />
          <Reveal><p className="text-smoke text-lg mb-9 max-w-xl mx-auto">A cocktail on the house every visit, double stamps, skip-the-line entry and member-only masterclasses. Collect stamps, unlock rewards.</p></Reveal>
          <Reveal><Magnetic><GlowButton to="/passport" data-testid="home-passport-cta">Become a Member</GlowButton></Magnetic></Reveal>
        </div>
      </section>

      <ReviewsMarquee />

      <div className="py-8 bg-ink overflow-hidden">
        <Marquee reverse items={["Book a Table", "209 Lygon St", "Open Late", "Cozy Box"]} />
      </div>

      {/* CTA */}
      <section className="py-32 sm:py-44">
        <div className="mx-auto max-w-[1500px] px-6 sm:px-10 text-center">
          <SplitReveal as="h2" text="Your table is waiting." className="text-5xl sm:text-7xl leading-[0.95] mb-10 justify-center flex flex-wrap" />
          <Magnetic><GlowButton to="/book" data-testid="home-book-cta">Book a Table</GlowButton></Magnetic>
        </div>
      </section>
    </div>
  );
}
