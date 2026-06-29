import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../store/cart";

export default function Layout() {
  const { count } = useCart();
  const [mode, setMode] = useState<string>("");

  useEffect(() => {
    api
      .health()
      .then((h) => setMode(h.mode))
      .catch(() => setMode(""));
  }, []);

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <NavLink to="/" className="brand">
            Cozy Box
            <small>by Fossey's Distillery</small>
          </NavLink>
          <NavLink to="/" className="link" end>
            Home
          </NavLink>
          <NavLink to="/shop" className="link">
            Online Shop
          </NavLink>
          <NavLink to="/book" className="link">
            Table Booking
          </NavLink>
          <NavLink to="/plate-pass" className="link">
            Plate Pass
          </NavLink>
          <NavLink to="/shop" className="cart-pill">
            Cart · {count}
          </NavLink>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container grid cols-3">
          <div>
            <div className="brand" style={{ fontSize: 20 }}>
              Cozy Box
            </div>
            <p>
              Where culinary art meets Indian heritage — modern Indian tapas &
              Fossey's distillery spirits.
            </p>
            {mode && (
              <span className="mode-badge">
                data source: {mode === "mock" ? "mock (dev)" : "Square"}
              </span>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: 18 }}>Visit</h3>
            <p>209 Lygon St, Carlton VIC 3053</p>
            <p>Wed–Sun from 4pm</p>
          </div>
          <div>
            <h3 style={{ fontSize: 18 }}>Contact</h3>
            <p>hello@cozybox.au</p>
            <p>+61 3 9100 1916</p>
          </div>
        </div>
        <div className="container" style={{ marginTop: 24 }}>
          © 2026 Cozybox. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
