import { useEffect, useRef } from "react";

/**
 * StaggerGrid — wraps children in a grid and fade+slide-up reveals each child
 * staggered 80-100ms apart as the grid scrolls into view.
 * Uses IntersectionObserver threshold 0.2.
 *
 * Props:
 *   className   — classes added to the wrapper div
 *   stagger     — ms between each child reveal (default 90)
 *   slideY      — px to slide up from (default 20)
 *   children    — grid items (wraps each in a reveal span automatically)
 */
export default function StaggerGrid({ className = "", stagger = 90, slideY = 20, children, ...rest }) {
  const ref = useRef(null);
  const revealed = useRef(false);

  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items = Array.from(wrapper.querySelectorAll(":scope > .sg-item"));

    if (reduced) {
      items.forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }

    // Prime all items hidden
    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${slideY}px)`;
      el.style.transition = `opacity 0.6s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)`;
    });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed.current) {
          revealed.current = true;
          items.forEach((el, i) => {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, i * stagger);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(wrapper);
    return () => obs.disconnect();
  }, [stagger, slideY]);

  return (
    <div ref={ref} className={className} {...rest}>
      {/* wrap each child in a .sg-item sentinel */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} className="sg-item">
              {child}
            </div>
          ))
        : <div className="sg-item">{children}</div>}
    </div>
  );
}
