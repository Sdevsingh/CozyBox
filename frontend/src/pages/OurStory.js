import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Expand } from "lucide-react";
import { fadeUp, blurReveal, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import GlowButton from "../components/GlowButton";
import CountUp from "../components/CountUp";

const GALLERY = [
  { src: "/img/fosseys_pour.jpg", alt: "A Fossey's pour" },
  { src: "/img/cozybox_table.jpg", alt: "Set for the evening at the Cozy Box" },
  { src: "/img/cozybox_vase.jpg", alt: "Fossey's Honey Rum, styled on the shelf" },
];

const STATS = [
  { value: "209", label: "Lygon Street, Carlton" },
  { value: "2023", label: "Established" },
  { value: "12+", label: "Fossey's spirits on pour" },
  { value: "5", label: "Nights a week, late" },
];

export default function OurStory() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div data-testid="our-story-page">
      <PageHero
        eyebrow="Our Story"
        title={<>Rooted in tradition.<br />Poured for the night.</>}
        sub="A bluestone bar on Lygon Street where Indian flavour meets the cocktail hour."
        image="/img/cozybox_stairs.jpg"
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
            className="space-y-8 text-smoke text-lg leading-relaxed">
            <motion.p variants={fadeUp} className="font-display text-3xl sm:text-4xl text-white leading-snug">
              At the Cozy Box, we celebrate the rich diversity of Indian cuisine through a
              modern, tapas style experience designed for sharing, discovery and connection.
            </motion.p>
            <motion.p variants={fadeUp}>
              Deeply rooted in traditional Indian cooking and elevated with a contemporary
              touch, our menu draws regional inspiration from across India. From bold,
              expressive spices to delicate, lingering aromas, each plate is crafted to strike
              a balance between authenticity and creativity.
            </motion.p>
            <motion.p variants={fadeUp}>
              By night, the room shifts gears. The bar comes alive with small batch spirits
              from Fossey's Distillery, signature cocktails and resident DJs. The same warmth,
              turned up after dark.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10 border-y hairline bg-ink-surface/30">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <motion.div key={s.value} variants={fadeUp}>
                <CountUp value={s.value} className="block font-display text-4xl sm:text-5xl text-amber mb-2 tabular-nums" />
                <p className="text-smoke-dim text-xs uppercase tracking-[0.2em]">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery — click to open the lightbox */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {GALLERY.map(({ src, alt }, i) => (
            <Reveal key={src} variants={blurReveal} className={i % 2 === 1 ? "sm:mt-12" : ""}>
              <button
                onClick={() => setLightbox({ src, alt })}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border hairline"
                aria-label={`View ${alt}`}
              >
                <img src={src} alt={alt} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                <span className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink/70 border border-amber/40 text-white text-[0.62rem] uppercase tracking-[0.18em] px-4 py-2">
                    <Expand size={13} className="text-amber" /> View
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fossey's section */}
      <section className="py-24 sm:py-32 bg-ink-surface/40 border-y hairline">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative overflow-hidden rounded-2xl border hairline h-[440px]">
            <img src="/img/fosseys_still.jpg" alt="Fossey's copper still" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>
          <div>
            <Reveal variants={blurReveal}>
              <p className="eyebrow mb-4">The distillery connection</p>
              <h2 className="text-4xl sm:text-5xl leading-tight mb-7">
                Spirits made from<br />the ground up at Fossey's.
              </h2>
            </Reveal>
            <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
              className="space-y-5 text-smoke text-lg leading-relaxed">
              <motion.p variants={fadeUp}>
                Everything poured at the Cozy Box bar traces back to Fossey's Distillery,
                a small batch Australian producer with a distinct voice: native botanicals,
                unexpected infusions and a commitment to craft over volume.
              </motion.p>
              <motion.p variants={fadeUp}>
                Their Redgum Honey Rum, Chilli Gin, Blood Orange Vodka and Peated Single
                Malt each tell a different story. On our cocktail list, those stories become
                experiences. In The Cellar, you can take them home.
              </motion.p>
              <motion.div variants={fadeUp} className="pt-3 flex flex-wrap gap-4">
                <GlowButton to="/menu" variant="ghost">See the Menu</GlowButton>
                <GlowButton to="/shop">Visit The Cellar</GlowButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid md:grid-cols-2 gap-12 items-center">
          <Reveal variants={blurReveal}>
            <h2 className="text-4xl sm:text-5xl leading-tight">Expect the unexpected at the Cozy Box by Fossey's Distillery.</h2>
          </Reveal>
          <Reveal className="text-smoke text-lg leading-relaxed space-y-5">
            <p>Beyond the menu, the Cozy Box is a celebration of atmosphere, hospitality and experience, from expertly crafted cocktails to warm, attentive service.</p>
            <p>Join us Wednesday through Sunday. Bring your appetite and a sense of curiosity.</p>
            <div className="pt-2"><GlowButton to="/book">Book a Table</GlowButton></div>
          </Reveal>
        </div>
      </section>

      {/* Radix lightbox */}
      <Dialog.Root open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <AnimatePresence>
          {lightbox && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div className="fixed inset-0 z-[80] bg-ink/90 backdrop-blur-sm"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                  <motion.figure
                    className="pointer-events-auto relative max-h-[88vh] max-w-[92vw]"
                    initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Dialog.Title className="sr-only">{lightbox.alt}</Dialog.Title>
                    <img src={lightbox.src} alt={lightbox.alt} className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]" />
                    <figcaption className="mt-3 text-center text-smoke text-sm">{lightbox.alt}</figcaption>
                    <Dialog.Close asChild>
                      <button className="absolute -top-3 -right-3 grid place-items-center h-10 w-10 rounded-full bg-ink border border-amber/40 text-white hover:text-amber transition-colors" aria-label="Close">
                        <X size={18} />
                      </button>
                    </Dialog.Close>
                  </motion.figure>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
