import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import { api } from "../lib/api";
import { blurReveal } from "../lib/motion";
import PageHero from "../components/PageHero";
import GlowButton from "../components/GlowButton";

const empty = { name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("done");
      setForm(empty);
    } catch {
      setStatus("error");
    }
  };

  const field = "w-full bg-ink-surface/60 border hairline rounded-xl px-4 py-3 text-white placeholder:text-smoke-dim focus:border-amber/60 focus:outline-none transition-colors";

  return (
    <div data-testid="contact-page">
      <PageHero eyebrow="Say hello" title="Get in touch" sub="Questions, feedback or media — we'd love to hear from you." image="/img/our_story.jpg" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid lg:grid-cols-2 gap-16">
          <div>
            <ul className="space-y-6 mb-10">
              <li className="flex gap-4"><span className="grid place-items-center w-11 h-11 rounded-full border border-amber/40 text-amber shrink-0"><MapPin size={18} /></span><div><p className="text-white">209 Lygon St, Carlton VIC 3053</p><p className="text-smoke text-sm">Australia</p></div></li>
              <li className="flex gap-4"><span className="grid place-items-center w-11 h-11 rounded-full border border-amber/40 text-amber shrink-0"><Phone size={18} /></span><a href="tel:+61391001916" className="text-white hover:text-amber transition-colors">+61 3 9100 1916</a></li>
              <li className="flex gap-4"><span className="grid place-items-center w-11 h-11 rounded-full border border-amber/40 text-amber shrink-0"><Mail size={18} /></span><a href="mailto:hello@cozybox.au" className="text-white hover:text-amber transition-colors">hello@cozybox.au</a></li>
              <li className="flex gap-4"><span className="grid place-items-center w-11 h-11 rounded-full border border-amber/40 text-amber shrink-0"><Clock size={18} /></span><p className="text-smoke text-sm leading-relaxed">Wed–Thu 4pm–10pm · Fri 4pm–12am<br />Sat 12pm–12am · Sun 12pm–10pm</p></li>
            </ul>
            <div className="rounded-2xl overflow-hidden border hairline h-72">
              <iframe title="map" className="w-full h-full grayscale contrast-125" loading="lazy"
                src="https://www.google.com/maps?q=209+Lygon+St,+Carlton+VIC+3053&output=embed" />
            </div>
          </div>

          <div>
            {status === "done" ? (
              <motion.div initial="hidden" animate="show" variants={blurReveal} className="rounded-2xl border border-amber/40 bg-ink-surface p-10 text-center" data-testid="contact-success">
                <Check className="mx-auto text-amber mb-4" size={36} />
                <h3 className="text-3xl mb-3">Message sent</h3>
                <p className="text-smoke">Thanks for reaching out — we'll reply soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4" data-testid="contact-form">
                <input required placeholder="Full name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="contact-name" />
                <input required type="email" placeholder="Email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="contact-email" />
                <input placeholder="Phone (optional)" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="contact-phone" />
                <textarea required placeholder="Your message" rows={6} className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="contact-message" />
                {status === "error" && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
                <GlowButton type="submit" data-testid="contact-submit">{status === "sending" ? "Sending…" : "Send Message"}</GlowButton>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
