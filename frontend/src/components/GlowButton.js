import { Link } from "react-router-dom";

export default function GlowButton({ to, href, children, onClick, type, variant = "solid", className = "", disabled, ...rest }) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 " +
    "text-[0.78rem] uppercase tracking-[0.2em] font-medium overflow-hidden " +
    "transition-all duration-200 ease-out " +
    "hover:scale-[1.03] active:scale-[0.98] " +
    "hover:shadow-[0_8px_32px_-6px_rgba(255,159,28,0.5)] " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const styles =
    variant === "solid"
      ? "bg-amber text-ink hover:bg-amber-soft"
      : "border border-amber/60 text-amber hover:text-amber-soft hover:border-amber";

  const cls = `${base} ${styles} ${className}`;

  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 30px -8px rgba(255,159,28,0.35)" }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return (
    <button type={type || "button"} onClick={onClick} className={cls} disabled={disabled} {...rest}>
      {inner}
    </button>
  );
}
