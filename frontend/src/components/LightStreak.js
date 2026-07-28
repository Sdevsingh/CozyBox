import { useEffect, useRef } from "react";

/**
 * LightStreak — a diagonal band of light with chromatic-aberration edges
 * that sweeps across the viewport once when the host element scrolls into view.
 * Use sparingly: once or twice per page to punctuate section transitions.
 *
 * Props:
 *   delay   — ms before the streak fires after intersection (default 0)
 *   color   — base streak color (default amber)
 */
export default function LightStreak({ delay = 0, color = "rgba(255,159,28,0.18)" }) {
  const ref = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          setTimeout(() => {
            el.classList.add("streak-fire");
          }, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="streak-host"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* chromatic red offset */}
      <div
        className="streak-band streak-r"
        style={{ "--streak-color": "rgba(255,80,80,0.09)", "--streak-delay": `${delay}ms` }}
      />
      {/* main amber band */}
      <div
        className="streak-band streak-main"
        style={{ "--streak-color": color, "--streak-delay": `${delay}ms` }}
      />
      {/* chromatic blue offset */}
      <div
        className="streak-band streak-b"
        style={{ "--streak-color": "rgba(80,180,255,0.07)", "--streak-delay": `${delay}ms` }}
      />
    </div>
  );
}
