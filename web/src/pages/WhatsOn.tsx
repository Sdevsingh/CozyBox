import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatAUD, type VenueEvent } from "../api/client";

export default function WhatsOn() {
  const [events, setEvents] = useState<VenueEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .events()
      .then((d) => setEvents(d.events))
      .finally(() => setLoading(false));
  }, []);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <section className="hero" style={{ minHeight: "50vh" }}>
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(/img/whats_on.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">What's On</p>
          <h1 style={{ fontSize: "clamp(44px,7vw,84px)" }}>
            The <span className="neon-text">Line-Up</span>
          </h1>
          <p className="lede">
            Ladies Nights, launch parties, masterclasses and resident DJs.
            Reserve your spot before the room fills up.
          </p>
        </div>
      </section>

      <section className="section container">
        {loading && <p className="spinner">Loading events…</p>}
        <div className="grid cols-2">
          {events.map((e) => (
            <div className="card media-card hover" key={e.id}>
              <div
                className="media"
                style={{ backgroundImage: `url(${e.image})`, height: 220 }}
              >
                <span className="chip">{e.category}</span>
              </div>
              <div className="body">
                <div className="muted" style={{ fontSize: 13 }}>
                  {fmtDate(e.date)} · from {e.startTime}
                </div>
                <h3 style={{ margin: 0, fontSize: 24 }}>{e.title}</h3>
                <p style={{ margin: 0, color: "var(--magenta-soft)" }}>
                  {e.tagline}
                </p>
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  {e.description}
                </p>
                <div className="item-top" style={{ marginTop: 12 }}>
                  <span className="price">
                    {e.priceFrom === 0
                      ? "Free entry"
                      : e.priceFrom
                        ? `From ${formatAUD(e.priceFrom)}`
                        : "—"}
                  </span>
                  {e.bookable && (
                    <Link to="/book" className="btn small">
                      Reserve
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
