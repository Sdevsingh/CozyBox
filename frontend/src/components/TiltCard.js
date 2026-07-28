import { useRef } from "react";

/**
 * TiltCard — cursor-tracked 3D tilt. Sets --rx/--ry CSS vars from pointer
 * position; the .tilt-card class applies the perspective transform.
 * Reduced-motion is handled in CSS (transform disabled).
 */
export default function TiltCard({ children, className = "", max = 9 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}
