import { Link } from "react-router-dom";

// Pill button with animated amber border-glow (no jarring color flip).
export default function GlowButton({ to, href, children, onClick, type, variant = "solid", className = "", ...rest }) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[0.78rem] uppercase tracking-[0.2em] font-medium transition-colors duration-300 overflow-hidden";
  const styles =
    variant === "solid"
      ? "bg-amber text-ink hover:bg-amber-soft"
      : "border border-amber/60 text-amber hover:text-amber-soft";
  const cls = `${base} ${styles} ${className}`;

  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "0 0 40px -6px rgba(255,159,28,0.6)" }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return <button type={type || "button"} onClick={onClick} className={cls} {...rest}>{inner}</button>;
}
