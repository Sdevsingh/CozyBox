import { useEffect, useState } from "react";
import { api, formatAUD, type FunctionPackage } from "../api/client";

export default function Private() {
  const [packages, setPackages] = useState<FunctionPackage[]>([]);
  const [active, setActive] = useState<string>("");
  const [form, setForm] = useState({
    givenName: "",
    email: "",
    phone: "",
    guests: 10,
    preferredDate: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ id: string; pkg: string } | null>(null);

  useEffect(() => {
    api
      .packages()
      .then((d) => {
        setPackages(d.packages);
        setActive(d.packages[0]?.id ?? "");
      })
      .catch((e) => setError(e.message));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { enquiry, package: pkg } = await api.enquire({
        packageId: active,
        guests: Number(form.guests),
        preferredDate: form.preferredDate || undefined,
        message: form.message || undefined,
        customer: {
          givenName: form.givenName,
          email: form.email,
          phone: form.phone || undefined,
        },
      });
      setDone({ id: enquiry.id, pkg: pkg.name });
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
          style={{ backgroundImage: "url(/img/private_events.png)" }}
        />
        <div className="container hero-content">
          <p className="eyebrow">Private Area & Functions</p>
          <h1 style={{ fontSize: "clamp(42px,7vw,80px)" }}>
            Your <span className="neon-text">Private</span> Party
          </h1>
          <p className="lede">
            Birthdays, venue takeovers, corporate nights and cocktail
            masterclasses — tailored packages with a brochure for every option.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <p className="eyebrow">Packages</p>
          <h2>Choose your experience</h2>
        </div>
        <div className="grid cols-2">
          {packages.map((p) => (
            <div
              className={`card media-card hover`}
              key={p.id}
              style={{
                borderColor:
                  active === p.id ? "var(--magenta)" : undefined,
                boxShadow: active === p.id ? "var(--glow-magenta)" : undefined,
              }}
            >
              <div
                className="media"
                style={{ backgroundImage: `url(${p.image})`, height: 200 }}
              >
                <span className="chip">{p.capacity}</span>
              </div>
              <div className="body">
                <div className="item-top">
                  <h3 style={{ margin: 0, fontSize: 22 }}>{p.name}</h3>
                  <span className="price">From {formatAUD(p.priceFrom)}</span>
                </div>
                <p className="muted" style={{ margin: 0 }}>
                  {p.blurb}
                </p>
                <ul className="perks muted">
                  {p.inclusions.map((inc) => (
                    <li key={inc}>{inc}</li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    className={`btn small ${active === p.id ? "" : "ghost"}`}
                    onClick={() => {
                      setActive(p.id);
                      setDone(null);
                    }}
                  >
                    {active === p.id ? "Selected" : "Select"}
                  </button>
                  <a
                    className="btn small ghost"
                    href={p.brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View brochure ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="grid cols-2" style={{ alignItems: "start" }}>
          <div className="card">
            <h2 style={{ fontSize: 28 }}>Enquire now</h2>
            <p className="muted">
              Tell us about your event and our functions team will be in touch
              within one business day.
            </p>
            <p className="muted">
              📞 +61 3 9100 1916 &nbsp;·&nbsp; ✉️ functions@cozybox.au
            </p>
          </div>
          <div className="card">
            {done ? (
              <div className="notice ok">
                🎉 Enquiry <strong>{done.id}</strong> received for{" "}
                <strong>{done.pkg}</strong>. We'll email {form.email} shortly to
                lock in the details.
              </div>
            ) : (
              <form onSubmit={submit}>
                <label htmlFor="pkg">Package</label>
                <select
                  id="pkg"
                  value={active}
                  onChange={(e) => setActive(e.target.value)}
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="grid cols-2" style={{ gap: 0, columnGap: 14 }}>
                  <div>
                    <label htmlFor="guests">Guests</label>
                    <input
                      id="guests"
                      type="number"
                      min={1}
                      value={form.guests}
                      onChange={(e) =>
                        setForm({ ...form, guests: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="pdate">Preferred date</label>
                    <input
                      id="pdate"
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) =>
                        setForm({ ...form, preferredDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  required
                  value={form.givenName}
                  onChange={(e) =>
                    setForm({ ...form, givenName: e.target.value })
                  }
                />
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <label htmlFor="msg">Tell us more</label>
                <textarea
                  id="msg"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
                {error && <div className="notice err">{error}</div>}
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: 14 }}
                  disabled={submitting || !active}
                >
                  {submitting ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
