import { useEffect, useState } from "react";
import { api, formatAUD, type CatalogItem } from "../api/client";
import { useCart } from "../store/cart";

type Filter = "all" | "retail" | "food";

export default function Shop() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [filter, setFilter] = useState<Filter>("retail");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { lines, subtotal, count, add, setQty, clear } = useCart();

  const [placing, setPlacing] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    orderId: string;
    paymentId: string;
    source: string;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .catalog()
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = items.filter((i) =>
    filter === "all" ? true : i.category === filter,
  );

  async function checkout() {
    setPlacing(true);
    setError("");
    try {
      const { order } = await api.createOrder({
        fulfillment: "PICKUP",
        lineItems: lines.map((l) => ({
          catalogObjectId: l.item.id,
          quantity: l.quantity,
        })),
      });
      const { payment, source } = await api.pay(order.id);
      setConfirmation({ orderId: order.id, paymentId: payment.id, source });
      clear();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <section className="hero" style={{ minHeight: "46vh" }}>
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(/img/shop_bottles.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">Online Shop · Fossey's</p>
          <h1 style={{ fontSize: "clamp(42px,7vw,76px)" }}>Take it home</h1>
          <p className="lede">
            Fossey's distillery spirits and signature plates — order for pickup
            at Carlton. Powered by Square Catalog, Orders & Payments.
          </p>
        </div>
      </section>

      <section className="section container">
        <div style={{ display: "flex", gap: 10, margin: "0 0 20px" }}>
          {(["retail", "food", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`btn small ${filter === f ? "" : "ghost"}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Everything" : f === "retail" ? "Distillery" : "Kitchen"}
            </button>
          ))}
        </div>

        {error && <div className="notice err">{error}</div>}
        {confirmation && (
          <div className="notice ok">
            ✅ Order <strong>{confirmation.orderId}</strong> paid (payment{" "}
            {confirmation.paymentId}) via <strong>{confirmation.source}</strong>.
            See you at Carlton!
          </div>
        )}

        <div className="grid cols-2" style={{ alignItems: "start" }}>
          <div className="grid" style={{ gap: 16 }}>
            {loading && <p className="spinner">Loading shop…</p>}
            {visible.map((item) => (
              <div className="card" key={item.id}>
                <div className="item-top">
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <span className="price">{formatAUD(item.price)}</span>
                </div>
                <p className="muted" style={{ margin: "6px 0 10px" }}>
                  {item.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="tags">
                    <span className="tag">{item.section}</span>
                    {item.dietary.map((d) => (
                      <span className="tag" key={d}>
                        {d}
                      </span>
                    ))}
                  </div>
                  <button className="btn small" onClick={() => add(item)}>
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card sticky-side" aria-label="cart">
            <h3>Your cart ({count})</h3>
            {lines.length === 0 && <p className="muted">Your cart is empty.</p>}
            {lines.map((l) => (
              <div className="cart-row" key={l.item.id}>
                <div>
                  <div>{l.item.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {formatAUD(l.item.price)}
                  </div>
                </div>
                <div className="qty">
                  <button onClick={() => setQty(l.item.id, l.quantity - 1)}>
                    −
                  </button>
                  <span>{l.quantity}</span>
                  <button onClick={() => setQty(l.item.id, l.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}

            {lines.length > 0 && (
              <>
                <div className="totals">
                  <span>Subtotal</span>
                  <span>{formatAUD(subtotal)}</span>
                </div>
                <button
                  className="btn"
                  style={{ width: "100%" }}
                  disabled={placing}
                  onClick={checkout}
                >
                  {placing ? "Processing…" : "Checkout & Pay"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
