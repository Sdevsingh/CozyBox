import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Background image that drifts slower than the foreground for depth.
export default function ParallaxImage({ src, alt = "", className = "", amount = 18, overlay = "bg-ink/55" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.25]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
}
