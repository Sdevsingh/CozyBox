// Oversized infinite marquee band.
export default function Marquee({ items = [], reverse = false, className = "" }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`flex w-max items-center gap-10 ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row.map((it, i) => (
          <div key={i} className="flex items-center gap-10 shrink-0">
            <span className="font-display text-6xl sm:text-8xl leading-none whitespace-nowrap text-white/90">{it}</span>
            <span className="text-amber text-4xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
