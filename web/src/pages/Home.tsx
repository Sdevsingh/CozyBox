import { Link } from "react-router-dom";

const pillars = [
  {
    icon: "🛍️",
    title: "Online Shop",
    body: "Order Fossey's distillery spirits and signature plates for pickup — powered by Square Catalog, Orders & Payments.",
    to: "/shop",
    cta: "Shop online",
  },
  {
    icon: "🍽️",
    title: "Table Booking",
    body: "Reserve your table for an evening of Indian tapas. Backed by Square Bookings, Customers & Locations.",
    to: "/book",
    cta: "Book a table",
  },
  {
    icon: "🎟️",
    title: "Plate Pass",
    body: "Our membership & loyalty club — earn points and unlock perks via Square Loyalty & Subscriptions.",
    to: "/plate-pass",
    cta: "Join Plate Pass",
  },
];

const reviews = [
  {
    quote:
      "Indian flavours with a modern edge. Bold but refined, and the tapas-style servings are ideal for sharing.",
    name: "Priya Malhotra",
  },
  {
    quote:
      "From the first bite you can tell how much thought went into every dish. The balance of spices and textures is spot on.",
    name: "Emily Thompson",
  },
  {
    quote:
      "Traditional Indian flavours transformed into something fresh without losing their soul. Creative and comforting.",
    name: "Sarah Mitchell",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero container">
        <p className="eyebrow">Carlton · Melbourne</p>
        <h1>Where Culinary Art Meets Indian Heritage</h1>
        <p className="lede">
          Crafted with tradition. Presented with imagination. Modern
          Indian-inspired tapas and Fossey's distillery spirits, designed to
          share, discover and connect.
        </p>
        <div className="hero-actions">
          <Link to="/book" className="btn">
            Book a Table
          </Link>
          <Link to="/shop" className="btn ghost">
            Shop Online
          </Link>
        </div>
      </section>

      <section className="section container">
        <p className="eyebrow">One brand, three experiences</p>
        <h2>Everything, in one place</h2>
        <p className="muted" style={{ maxWidth: 620 }}>
          The new cozybox.au unifies the Online Shop, Table Booking and Plate
          Pass — each connected to Square so orders, customers and bookings are
          visible in real time across the Square Dashboard and in-venue POS.
        </p>
        <div className="grid cols-3" style={{ marginTop: 26 }}>
          {pillars.map((p) => (
            <div className="card" key={p.title}>
              <div className="pillar-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p className="muted">{p.body}</p>
              <Link to={p.to} className="btn small" style={{ marginTop: 8 }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="card">
          <p className="eyebrow">Welcome to The Cozy Box</p>
          <h2>Rooted in Tradition. Elevated by Innovation.</h2>
          <p className="muted">
            We celebrate the rich diversity of Indian cuisine through a modern
            tapas-style experience designed for sharing, discovery and
            connection. From bold, expressive spices to delicate, lingering
            aromas, each plate strikes a balance between authenticity and
            creativity — paired with cocktails built around our distillery
            range.
          </p>
        </div>
      </section>

      <section className="section container">
        <p className="eyebrow">Reviews</p>
        <h2>Our customers' feedback</h2>
        <div className="grid cols-3" style={{ marginTop: 22 }}>
          {reviews.map((r) => (
            <div className="card" key={r.name}>
              <p style={{ fontStyle: "italic" }}>“{r.quote}”</p>
              <p className="muted">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
