import { useEffect, useState } from "react";
import { api, formatAUD, type PlatePassPlan } from "../api/client";

export default function CocktailPassport() {
  const [plans, setPlans] = useState<PlatePassPlan[]>([]);
  const [planId, setPlanId] = useState("");
  const [form, setForm] = useState({ givenName: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    subscriptionId: string;
    loyaltyId: string;
    plan: string;
  } | null>(null);

  useEffect(() => {
    api
      .plans()
      .then((d) => {
        setPlans(d.plans);
        setPlanId(d.plans[0]?.id ?? "");
      })
      .catch((e) => setError(e.message));
  }, []);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const customer = {
        givenName: form.givenName,
        email: form.email,
        phone: form.phone || undefined,
      };
      const sub = await api.subscribe({ planId, customer });
      const loyalty = await api.enrollLoyalty({ customer });
      setResult({
        subscriptionId: sub.subscription.id,
        loyaltyId: loyalty.account.id,
        plan: sub.plan.name,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="hero" style={{ minHeight: "52vh" }}>
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(/img/cocktail_passport.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">Members Club</p>
          <h1 style={{ fontSize: "clamp(42px,7vw,80px)" }}>
            Cocktail <span className="neon-text">Passport</span>
          </h1>
          <p className="lede">
            Stamp your way through our cocktail menu. Earn rewards, skip the line
            on event nights and unlock member-only masterclasses. Powered by
            Square Subscriptions, Loyalty & Customers.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="grid cols-2" style={{ alignItems: "start" }}>
          <div className="grid" style={{ gap: 16 }}>
            {plans.map((p) => (
              <label
                key={p.id}
                className="card hover"
                style={{
                  cursor: "pointer",
                  borderColor: planId === p.id ? "var(--magenta)" : undefined,
                  boxShadow: planId === p.id ? "var(--glow-magenta)" : undefined,
                }}
              >
                <div className="item-top">
                  <h3
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      margin: 0,
                    }}
                  >
                    <input
                      type="radio"
                      name="plan"
                      style={{ width: "auto" }}
                      checked={planId === p.id}
                      onChange={() => setPlanId(p.id)}
                    />
                    {p.name}
                  </h3>
                  <span className="price">
                    {formatAUD(p.price)}
                    <span className="muted" style={{ fontWeight: 400 }}>
                      /{p.cadence === "MONTHLY" ? "mo" : "yr"}
                    </span>
                  </span>
                </div>
                <ul className="perks muted">
                  {p.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </label>
            ))}
          </div>

          <div className="card sticky-side">
            {result ? (
              <div className="notice ok">
                🎟️ Welcome to <strong>{result.plan}</strong>! Subscription{" "}
                <strong>{result.subscriptionId}</strong> is active and your
                passport <strong>{result.loyaltyId}</strong> is ready for its
                first stamp.
              </div>
            ) : (
              <form onSubmit={join}>
                <h3>Get your Passport</h3>
                <label htmlFor="pp-name">Name</label>
                <input
                  id="pp-name"
                  required
                  value={form.givenName}
                  onChange={(e) =>
                    setForm({ ...form, givenName: e.target.value })
                  }
                />
                <label htmlFor="pp-email">Email</label>
                <input
                  id="pp-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <label htmlFor="pp-phone">Phone</label>
                <input
                  id="pp-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {error && <div className="notice err">{error}</div>}
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: 14 }}
                  disabled={submitting || !planId}
                >
                  {submitting ? "Activating…" : "Activate Passport"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
