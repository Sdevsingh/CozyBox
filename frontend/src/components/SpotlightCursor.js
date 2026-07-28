import { useEffect, useRef } from "react";

// Amber spotlight that trails the cursor + a sharp dot. Reveals warmth in the dark.
export default function SpotlightCursor() {
  const glow = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let gx = 0, gy = 0, tx = 0, ty = 0, raf;
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    };
    const grow = () => document.body.classList.add("cursor-grow");
    const shrink = () => document.body.classList.remove("cursor-grow");
    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      if (glow.current) glow.current.style.transform = `translate(${gx}px, ${gy}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div
        ref={glow}
        className="spotlight-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 460,
          height: 460,
          marginLeft: -230,
          marginTop: -230,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 55,
          background:
            "radial-gradient(circle, rgba(255,159,28,0.10) 0%, rgba(255,159,28,0.04) 35%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dot}
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999, /* above modals/drawers so it's always visible */
          background: "#FF9F1C",
          boxShadow: "0 0 12px rgba(255,159,28,0.9)",
          transition: "width .2s, height .2s",
        }}
      />
    </>
  );
}
