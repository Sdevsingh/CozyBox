import { useEffect, useRef } from "react";

/**
 * Particles — lightweight canvas field of drifting amber "embers / bokeh"
 * for the bar/club atmosphere. No external libs.
 *
 * - Pauses when scrolled offscreen (IntersectionObserver)
 * - Respects prefers-reduced-motion (renders nothing)
 * - DPR-aware, resizes with its parent
 *
 * Props:
 *   density  — particles per 100k px² (default 0.9)
 *   color    — base RGB string "255,159,28" (amber)
 *   className
 */
export default function Particles({ density = 0.9, color = "255,159,28", className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0, raf = 0, running = true;
    let particles = [];

    const seed = () => {
      const count = Math.round((w * h) / 100000 * density);
      particles = Array.from({ length: count }, () => spawn());
    };

    const spawn = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,           // radius
      vy: -(Math.random() * 0.35 + 0.08),      // drift up
      vx: (Math.random() - 0.5) * 0.18,        // gentle sway
      a: Math.random() * 0.5 + 0.15,           // base alpha
      tw: Math.random() * Math.PI * 2,         // twinkle phase
      tws: Math.random() * 0.03 + 0.008,       // twinkle speed
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += p.tws;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        // recycle when it floats off the top
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${color},${alpha})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) { running = true; draw(); }
        else if (!entry.isIntersecting) { running = false; cancelAnimationFrame(raf); }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
