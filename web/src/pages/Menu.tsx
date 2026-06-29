import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatAUD, type CatalogItem } from "../api/client";
import { useCart } from "../store/cart";

export default function Menu() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    api
      .catalog()
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  const sections = useMemo(() => {
    const food = items.filter((i) => i.category === "food");
    const groups = new Map<string, CatalogItem[]>();
    for (const i of food) {
      groups.set(i.section, [...(groups.get(i.section) ?? []), i]);
    }
    return [...groups.entries()];
  }, [items]);

  return (
    <>
      <section className="hero" style={{ minHeight: "50vh" }}>
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(/img/menu_food_drinks.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">Food & Drinks</p>
          <h1 style={{ fontSize: "clamp(44px,7vw,84px)" }}>The Menu</h1>
          <p className="lede">
            Signature cocktails, Fossey's spirits and bold share plates —
            designed to graze, sip and share.
          </p>
        </div>
      </section>

      <section className="section container">
        {loading && <p className="spinner">Loading menu…</p>}
        {sections.map(([section, list]) => (
          <div key={section} style={{ marginBottom: 40 }}>
            <div className="section-head">
              <p className="eyebrow">Kitchen</p>
              <h2>{section}</h2>
            </div>
            <div className="grid cols-2">
              {list.map((item) => (
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
                      {item.dietary.map((d) => (
                        <span className="tag" key={d}>
                          {d}
                        </span>
                      ))}
                    </div>
                    <button className="btn small ghost" onClick={() => add(item)}>
                      Add to order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card" style={{ textAlign: "center", marginTop: 10 }}>
          <p className="muted">
            Thirsty? Browse Fossey's distillery spirits and order for pickup.
          </p>
          <Link to="/shop" className="btn">
            Go to the Online Shop
          </Link>
        </div>
      </section>
    </>
  );
}
