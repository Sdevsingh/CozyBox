import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PACKAGES, formatPrice, LOCATION } from "../data";
import { fadeUp, stagger, viewport } from "../lib/motion";
import PageHero from "../components/PageHero";
import GlowButton from "../components/GlowButton";

const empty = { name: "", email: "", phone: "", packageId: "", date: "", guests: "", message: "" };

export default function Private() {
  const packages = PACKAGES;
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Private Event Enquiry — ${form.packageId || "General"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nPackage: ${form.packageId || "Not specified"}\nDate: ${form.date || "Flexible"}\nGuests: ${form.guests || "TBC"}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${LOCATION.enquiryEmail}?subject=${subject}&body=${body}`;
    setStatus("done");
    setForm(empty);
  };

  const field = "w-full bg-ink-surface/60 border hairline rounded-xl px-4 py-3 text-white placeholder:text-smoke-dim focus:border-amber/60 focus:outline-none transition-colors";

  return (
    <div data-testid="private-page">
      <PageHero eyebrow="Private & Events" title="Your night, behind closed doors." sub="Booths, functions, corporate nights and exclusive venue hire." image="/img/private_events.jpg" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid sm:grid-cols-2 gap-6">
            {packages.map((p) => (
              <motion.div key={p.id} variants={fadeUp} data-testid={`package-${p.id}`}
                className="group relative overflow-hidden rounded-2xl border hairline bg-ink-surface/40">
                <div className="grid sm:grid-cols-5">
                  <div className="sm:col-span-2 aspect-[4/3] sm:aspect-auto overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                  </div>
                  <div className="sm:col-span-3 p-7">
                    <h2 className="text-2xl mb-1">{p.name}</h2>
                    <p className="text-amber text-xs uppercase tracking-[0.2em] mb-4">{p.capacity} · from {formatPrice(p.priceFrom)}</p>
                    <p className="text-smoke text-sm leading-relaxed mb-5">{p.blurb}</p>
                    <ul className="space-y-2">
                      {p.inclusions.map((inc) => (
                        <li key={inc} className="flex gap-2 text-sm text-white/80"><Check size={16} className="text-amber shrink-0 mt-0.5" />{inc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <p className="text-smoke-dim text-sm max-w-xl mx-auto">Every function is tailored to you. Send an enquiry below and our events team will craft a bespoke package and quote.</p>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section className="py-20 border-t hairline bg-ink-surface/30">
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          <div className="text-center mb-10">
            <p className="eyebrow mb-4">Make an enquiry</p>
            <h2 className="text-4xl sm:text-5xl">Plan your event</h2>
          </div>
          {status === "done" ? (
            <div className="text-center rounded-2xl border border-amber/40 bg-ink-surface p-10" data-testid="enquiry-success">
              <h3 className="text-3xl text-amber mb-3">Enquiry received</h3>
              <p className="text-smoke">Our events team will be in touch shortly. Cheers!</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="enquiry-form">
              <input required placeholder="Full name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="enquiry-name" />
              <input required type="email" placeholder="Email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="enquiry-email" />
              <input required placeholder="Phone" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="enquiry-phone" />
              <select className={field} value={form.packageId} onChange={(e) => setForm({ ...form, packageId: e.target.value })} data-testid="enquiry-package">
                <option value="">Package (optional)</option>
                {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} data-testid="enquiry-date" />
              <input type="number" min="1" placeholder="Guests" className={field} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} data-testid="enquiry-guests" />
              <textarea placeholder="Tell us about your event" rows={4} className={`${field} sm:col-span-2`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="enquiry-message" />
              <div className="sm:col-span-2 flex items-center gap-4">
                <GlowButton type="submit" onClick={() => {}} data-testid="enquiry-submit">{status === "sending" ? "Sending…" : "Send Enquiry"}</GlowButton>
                {status === "error" && <span className="text-red-400 text-sm">Something went wrong. Try again.</span>}
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
