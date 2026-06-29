import { motion } from "framer-motion";
import ParallaxImage from "./ParallaxImage";
import { blurReveal } from "../lib/motion";

// Cinematic banner used at the top of interior pages.
export default function PageHero({ eyebrow, title, sub, image }) {
  return (
    <section className="relative h-[58vh] min-h-[440px] flex items-end overflow-hidden">
      <ParallaxImage src={image} alt={title} className="absolute inset-0" overlay="bg-gradient-to-t from-ink via-ink/60 to-ink/30" amount={14} />
      <div className="relative mx-auto max-w-[1400px] w-full px-6 sm:px-10 pb-16">
        {eyebrow && (
          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="eyebrow mb-4">
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={blurReveal}
          className="text-4xl sm:text-5xl lg:text-6xl leading-[0.98] max-w-4xl"
        >
          {title}
        </motion.h1>
        {sub && (
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-5 text-smoke max-w-xl text-lg">
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  );
}
