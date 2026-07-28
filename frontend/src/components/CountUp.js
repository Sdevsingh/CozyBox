import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Animates a number from 0 → its value the first time it scrolls into view.
// Preserves any non-numeric prefix/suffix, e.g. "12+" counts 0→12 then "+".
export default function CountUp({ value, duration = 1.8, className }) {
  // Parse once per value — a fresh object here every render would restart the
  // animation each frame (the count would freeze on a low, gibberish number).
  const { prefix, target, suffix, isNumeric } = useMemo(() => {
    const m = String(value).match(/^(\D*)(\d[\d,]*)(\D*)$/);
    if (!m) return { prefix: "", target: 0, suffix: "", isNumeric: false };
    return { prefix: m[1], target: parseInt(m[2].replace(/,/g, ""), 10), suffix: m[3], isNumeric: true };
  }, [value]);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let raf;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setDisplay(Math.round(easeOutCubic(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNumeric, target, duration]);

  if (!isNumeric) return <span ref={ref} className={className}>{value}</span>;
  return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
}
