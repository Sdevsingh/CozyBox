import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../store/cart";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/our-story", label: "Our Story" },
  { to: "/menu", label: "Menu" },
  { to: "/whats-on", label: "What's On" },
  { to: "/private", label: "Private & Functions" },
  { to: "/shop", label: "Online Shop" },
];

export default function Layout() {
  const { count } = useCart();
  const [mode, setMode] = useState("");

  useEffect(() => {
    api.health().then((h) => setMode(h.mode)).catch(() => setMode(""));
  }, []);

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-main">COZY BOX</span>
            <small>Bar · Lounge · Fossey's Distillery</small>
          </Link>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="link" end={n.end}>
              {n.label}
            </NavLink>
          ))}
          <div className="nav-cta">
            <NavLink to="/cocktail-passport" className="link">
              Passport
            </NavLink>
            <NavLink to="/shop" className="cart-pill">
              Cart · {count}
            </NavLink>
            <Link to="/book" className="btn small">
              Book
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container grid cols-4">
          <div>
            <span className="brand-main" style={{ fontSize: 22 }}>
              COZY BOX
            </span>
            <p style={{ marginTop: 10 }}>
              An electric cocktail bar & lounge by Fossey's Distillery. Expect
              the unexpected.
            </p>
            {mode && (
              <span className="mode-badge">
                data: {mode === "mock" ? "mock (dev)" : "Square"}
              </span>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>Explore</h3>
            <p><Link to="/whats-on">What's On</Link></p>
            <p><Link to="/private">Private & Functions</Link></p>
            <p><Link to="/cocktail-passport">Cocktail Passport</Link></p>
            <p><Link to="/shop">Online Shop</Link></p>
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>Visit</h3>
            <p>209 Lygon St, Carlton VIC 3053</p>
            <p>Wed–Sun, from 4pm till late</p>
            <p><Link to="/book">Book your experience →</Link></p>
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>Contact</h3>
            <p>hello@cozybox.au</p>
            <p>+61 3 9100 1916</p>
            <p><Link to="/contact">Get in touch →</Link></p>
          </div>
        </div>
        <div className="container" style={{ marginTop: 26 }}>
          © 2026 Cozybox by Fossey's Distillery. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
