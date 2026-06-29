import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ArrowUpRight } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";

const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long" });

export default function WhatsOn() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data.events)).catch(() => {});
  }, []);

  return (
    <div data-testid="whats-on-page">
      <PageHero eyebrow="What's On" title="The Lineup" sub="Ladies Night, resident DJs, launch parties and Fossey's masterclasses." image="/img/whats_on.jpg" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {events.map((e) => (
              <motion.article key={e.id} variants={fadeUp} data-testid={`event-${e.id}`}
                className="group relative overflow-hidden rounded-2xl border hairline">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                </div>
                <div className="absolute top-5 left-5">
                  <span className="rounded-full bg-amber/90 text-ink text-[0.62rem] uppercase tracking-[0.2em] px-3 py-1.5">{e.category}</span>
                </div>
                <div className="p-7">
                  <h2 className="text-3xl mb-1">{e.title}</h2>
                  <p className="text-amber text-sm italic font-display text-lg mb-4">{e.tagline}</p>
                  <div className="flex flex-wrap gap-5 text-smoke text-xs uppercase tracking-[0.15em] mb-4">
                    <span className="flex items-center gap-2"><CalendarDays size={15} className="text-amber" />{fmtDate(e.date)}</span>
                    <span className="flex items-center gap-2"><Clock size={15} className="text-amber" />{e.startTime}</span>
                  </div>
                  <p className="text-smoke text-sm leading-relaxed mb-6">{e.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{e.priceFrom === 0 ? "Free entry" : `From ${formatPrice(e.priceFrom)}`}</span>
                    <Link to="/book" className="inline-flex items-center gap-2 text-amber text-xs uppercase tracking-[0.2em] hover:gap-4 transition-all" data-testid={`event-book-${e.id}`}>
                      {e.bookable ? "Book / RSVP" : "Details"} <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
