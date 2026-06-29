import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatAUD, type VenueEvent } from "../api/client";

const pillars = [
  {
    icon: "🍸",
    title: "Menu",
    body: "Signature cocktails built around Fossey's spirits, plus bold share plates.",
    to: "/menu",
    cta: "See the menu",
  },
  {
    icon: "🎉",
    title: "Private & Functions",
    body: "Birthdays, venue hire and corporate nights — your event, our neon.",
    to: "/private",
    cta: "Plan an event",
  },
  {
    icon: "🛍️",
    title: "Online Shop",
    body: "Take Fossey's distillery spirits home — rum, whisky, vodka & gin.",
    to: "/shop",
    cta: "Shop now",
  },
];

export default function Home() {
  const [events, setEvents] = useState<VenueEvent[]>([]);

  useEffect(() => {
    api.events().then((d) => setEvents(d.events.slice(0, 3))).catch(() => {});
  }, []);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <>
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(/img/hero_club.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">Carlton · Melbourne · Open till late</p>
          <h1>
            Expect the <span className="neon-text">Unexpected</span>
          </h1>
          <p className="lede">
            Cozy Box is reborn as an electric cocktail bar & lounge by Fossey's
            Distillery — neon nights, signature cocktails and unforgettable
            events.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="btn">
              Book Your Experience
            </Link>
            <Link to="/whats-on" className="btn ghost">
              What's On
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <p className="eyebrow">One venue, every vibe</p>
          <h2>The Cozy Box experience</h2>
        </div>
        <div className="grid cols-3">
          {pillars.map((p) => (
            <div className="card hover" key={p.title}>
              <div className="pillar-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p className="muted">{p.body}</p>
              <Link to={p.to} className="btn small" style={{ marginTop: 6 }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <p className="eyebrow">What's On</p>
          <h2>Upcoming nights</h2>
        </div>
        <div className="grid cols-3">
          {events.map((e) => (
            <Link to="/whats-on" className="card media-card hover" key={e.id}>
              <div
                className="media"
                style={{ backgroundImage: `url(${e.image})` }}
              >
                <span className="chip">{e.category}</span>
              </div>
              <div className="body">
                <div className="muted" style={{ fontSize: 13 }}>
                  {fmtDate(e.date)} · {e.startTime}
                </div>
                <h3 style={{ margin: 0 }}>{e.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {e.tagline}
                </p>
                <div className="item-top" style={{ marginTop: 6 }}>
                  <span className="price">
                    {e.priceFrom === 0
                      ? "Free entry"
                      : e.priceFrom
                        ? `From ${formatAUD(e.priceFrom)}`
                        : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div
          className="card"
          style={{
            backgroundImage: "url(/img/cocktail_passport.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 320,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              background: "rgba(7,6,12,0.78)",
              padding: 26,
              borderRadius: 14,
              maxWidth: 460,
              backdropFilter: "blur(6px)",
            }}
          >
            <p className="eyebrow">Members club</p>
            <h2 style={{ margin: "4px 0 10px" }}>The Cocktail Passport</h2>
            <p className="muted">
              Stamp your way through our cocktail menu, skip the line on event
              nights, and unlock member-only masterclasses.
            </p>
            <Link to="/cocktail-passport" className="btn cyan">
              Get your Passport
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
