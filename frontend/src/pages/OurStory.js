import { motion } from "framer-motion";
import { fadeUp, blurReveal, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import GlowButton from "../components/GlowButton";

const GALLERY = ["/img/menu_food_drinks.jpg", "/img/hero_club.jpg", "/img/whats_on.jpg"];

export default function OurStory() {
  return (
    <div data-testid="our-story-page">
      <PageHero
        eyebrow="Our Story"
        title={<>Rooted in tradition.<br />Poured for the night.</>}
        sub="A bluestone bar on Lygon Street where Indian flavour meets the cocktail hour."
        image="/img/our_story.jpg"
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
            className="space-y-8 text-smoke text-lg leading-relaxed">
            <motion.p variants={fadeUp} className="font-display text-3xl sm:text-4xl text-white leading-snug">
              At the Cozy Box, we celebrate the rich diversity of Indian cuisine through a
              modern, tapas-style experience — designed for sharing, discovery and connection.
            </motion.p>
            <motion.p variants={fadeUp}>
              Deeply rooted in traditional Indian cooking and elevated with a contemporary
              touch, our menu draws regional inspiration from across India. From bold,
              expressive spices to delicate, lingering aromas, each plate is crafted to strike
              a balance between authenticity and creativity.
            </motion.p>
            <motion.p variants={fadeUp}>
              By night, the room shifts gears. The bar comes alive with small-batch spirits
              from Fossey's Distillery, signature cocktails and resident DJs — the same warmth,
              turned up after dark.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid sm:grid-cols-3 gap-5">
          {GALLERY.map((g, i) => (
            <Reveal key={g} variants={blurReveal} className={i === 1 ? "sm:mt-12" : ""}>
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border hairline group">
                <img src={g} alt="" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-28 bg-ink-surface/40 border-y hairline">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid md:grid-cols-2 gap-12 items-center">
          <Reveal variants={blurReveal}>
            <h2 className="text-4xl sm:text-5xl leading-tight">Expect the unexpected at the Cozy Box by Fossey's Distillery.</h2>
          </Reveal>
          <Reveal className="text-smoke text-lg leading-relaxed space-y-5">
            <p>Beyond the menu, the Cozy Box is a celebration of atmosphere, hospitality and experience — from expertly crafted cocktails to warm, attentive service.</p>
            <div className="pt-2"><GlowButton to="/menu" variant="ghost">See the Menu</GlowButton></div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
