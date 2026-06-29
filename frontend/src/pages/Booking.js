import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { api } from "../lib/api";
import { blurReveal } from "../lib/motion";
import GlowButton from "../components/GlowButton";

const empty = { name: "", email: "", phone: "", date: "", time: "", guests: 2, notes: "" };

export default function Booking() {
  const [form, setForm] = useState(empty);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!form.date) return;
    api.get("/bookings/availability", { params: { date: form.date } })
      .then((r) => setSlots(r.data.slots)).catch(() => setSlots([]));
  }, [form.date]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.time) { setStatus("notime"); return; }
    setStatus("sending");
    try {
      await api.post("/bookings", { ...form, guests: Number(form.guests) });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const field = "w-full bg-ink-surface/60 border hairline rounded-xl px-4 py-3 text-white placeholder:text-smoke-dim focus:border-amber/60 focus:outline-none transition-colors";

  return (
    <div data-testid="booking-page" className="relative min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src="/img/hero_club.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-ink" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="eyebrow mb-4">Reservations</p>
          <h2 className="font-display text-5xl leading-tight">Pull up a seat at the Cozy Box.</h2>
          <p className="text-smoke mt-4 max-w-md">209 Lygon St, Carlton · Wed–Sun. For parties over 12, use Private & Events.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-32 sm:py-36">
        <div className="w-full max-w-md">
          {status === "done" ? (
            <motion.div initial="hidden" animate="show" variants={blurReveal} className="text-center rounded-2xl border border-amber/40 bg-ink-surface p-10" data-testid="booking-success">
              <Check className="mx-auto text-amber mb-4" size={36} />
              <h3 className="text-3xl mb-3">Request received</h3>
              <p className="text-smoke">We'll confirm your table by email shortly. Can't wait to host you.</p>
              <button onClick={() => { setForm(empty); setStatus(null); }} className="mt-7 text-amber text-xs uppercase tracking-[0.2em]">Book another</button>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4" data-testid="booking-form">
              <div className="mb-8">
                <p className="eyebrow mb-3">Book a Table</p>
                <h1 className="text-4xl sm:text-5xl">Reserve your night</h1>
              </div>
              <input required placeholder="Full name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="booking-name" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="email" placeholder="Email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="booking-email" />
                <input required placeholder="Phone" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="booking-phone" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })} data-testid="booking-date" />
                <select className={field} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} data-testid="booking-guests">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
                </select>
              </div>
              {form.date && (
                <div data-testid="booking-slots">
                  <p className="text-smoke-dim text-xs uppercase tracking-[0.2em] mb-3">Choose a time</p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button type="button" key={s} onClick={() => setForm({ ...form, time: s })}
                        className={`py-2 rounded-lg text-sm border transition-colors ${form.time === s ? "bg-amber text-ink border-amber" : "hairline text-white/80 hover:border-amber/50"}`}
                        data-testid={`slot-${s}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <textarea placeholder="Special requests (optional)" rows={3} className={field} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} data-testid="booking-notes" />
              {status === "notime" && <p className="text-amber text-sm">Please pick a time slot.</p>}
              {status === "error" && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
              <GlowButton type="submit" className="w-full" data-testid="booking-submit">{status === "sending" ? "Sending…" : "Request Table"}</GlowButton>
              <p className="text-smoke-dim text-xs text-center pt-2">Confirmations & live availability move to Square Bookings in Phase 2.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
