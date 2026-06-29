import { Link } from "react-router-dom";

export default function OurStory() {
  return (
    <>
      <section className="hero" style={{ minHeight: "56vh" }}>
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(/img/our_story.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">Our Story</p>
          <h1 style={{ fontSize: "clamp(44px,7vw,84px)" }}>
            Craft meets <span className="neon-text">nightlife</span>
          </h1>
        </div>
      </section>

      <section className="section container">
        <div className="grid cols-2" style={{ alignItems: "start" }}>
          <div className="card">
            <h2 style={{ fontSize: 30 }}>From distillery to dancefloor</h2>
            <p className="muted">
              Cozy Box began as an intimate kitchen alongside Fossey's
              Distillery on Lygon Street. Today it's evolved into Carlton's most
              electric cocktail bar & lounge — where the spirits we distil
              in-house become the cocktails in your hand.
            </p>
            <p className="muted">
              Our philosophy hasn't changed: expect the unexpected. We pair
              boundary-pushing cocktails with bold share plates, a resident DJ
              programme and a room designed to glow.
            </p>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 30 }}>Made at Fossey's</h2>
            <p className="muted">
              Every signature cocktail starts with a Fossey's spirit — our
              Redgum Honey Rum, Peated Single Malt Whisky, Blood Orange Vodka
              and Chilli Gin. Small batches, big character.
            </p>
            <ul className="perks muted">
              <li>Distilled & bottled locally in Carlton</li>
              <li>Cocktails crafted around our own spirits</li>
              <li>Take the range home from our Online Shop</li>
            </ul>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <Link to="/menu" className="btn small">
                Explore the menu
              </Link>
              <Link to="/shop" className="btn small ghost">
                Shop the spirits
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="card" style={{ textAlign: "center" }}>
          <p className="eyebrow">The vibe</p>
          <h2>Neon-lit. Spirit-led. Unforgettable.</h2>
          <p className="muted" style={{ maxWidth: 620, margin: "0 auto" }}>
            Mood lighting, a thumping playlist and a bar team that treats every
            pour as a performance. Whether it's date night, a celebration or a
            big night out — this is your room.
          </p>
          <div style={{ marginTop: 16 }}>
            <Link to="/book" className="btn">
              Reserve a table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
