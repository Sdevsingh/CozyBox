import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="section container">
      <div className="section-head">
        <p className="eyebrow">Contact</p>
        <h2>Get in touch</h2>
      </div>
      <div className="grid cols-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3>Cozy Box by Fossey's Distillery</h3>
          <p className="muted">209 Lygon St, Carlton VIC 3053, Australia</p>
          <div className="divider" />
          <p>📞 +61 3 9100 1916</p>
          <p>✉️ hello@cozybox.au</p>
          <p>🎉 functions@cozybox.au</p>
          <div className="divider" />
          <h3 style={{ fontSize: 18 }}>Hours</h3>
          <p className="muted">Wed–Thu 4pm–10pm</p>
          <p className="muted">Fri 4pm–late · Sat 12pm–late · Sun 12pm–10pm</p>
        </div>
        <div className="card">
          {sent ? (
            <div className="notice ok">
              ✅ Thanks {form.name || "there"}! Your message is on its way — we'll
              reply to {form.email} soon.
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3>Send us a message</h3>
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label htmlFor="c-msg">Message</label>
              <textarea
                id="c-msg"
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button className="btn" style={{ width: "100%", marginTop: 14 }}>
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
