import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ReviewsMarquee() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    api.get("/reviews").then((r) => setReviews(r.data.reviews)).catch(() => {});
  }, []);
  if (!reviews.length) return null;
  const row = [...reviews, ...reviews];
  return (
    <section className="py-20 border-y hairline overflow-hidden" data-testid="reviews">
      <p className="eyebrow text-center mb-12">What people are saying</p>
      <div className="relative">
        <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
          {row.map((rv, i) => (
            <figure key={i} className="w-[340px] shrink-0 rounded-2xl border hairline bg-ink-surface/60 p-7">
              <blockquote className="font-display text-2xl leading-snug text-white/90">“{rv.quote}”</blockquote>
              <figcaption className="mt-5 text-amber text-xs uppercase tracking-[0.2em]">— {rv.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
