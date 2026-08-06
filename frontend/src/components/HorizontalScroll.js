import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * HorizontalScroll — pins this section while the inner track pans horizontally
 * on scroll progress (GSAP ScrollTrigger scrub).
 * On mobile (≤768px) falls back to normal vertical overflow-x scroll.
 *
 * Props:
 *   children — the cards / content to scroll horizontally
 *   className — wrapper classes
 *   title     — optional eyebrow label
 */
export default function HorizontalScroll({ children, className = "", title }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 768) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`hs-section relative overflow-hidden ${className}`}>
      {title && (
        <div className="hs-label absolute top-10 left-8 sm:left-14 z-10 pointer-events-none">
          <p className="eyebrow">{title}</p>
        </div>
      )}
      {/* Scroll viewport: on mobile this is the swipeable container (bounded to
          the screen). On desktop it's visible and GSAP pans the inner track. */}
      <div className="overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none">
        <div
          ref={trackRef}
          className="hs-track flex gap-5 sm:gap-8 px-8 sm:px-14 py-24 sm:py-32 will-change-transform"
          style={{ width: "max-content" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
