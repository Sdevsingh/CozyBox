import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Minus } from "lucide-react";
import { api } from "../lib/api";
import { blurReveal } from "../lib/motion";
import { isValidEmail, isValidAuPhone } from "../lib/validate";
import GlowButton from "../components/GlowButton";

const empty = { name: "", email: "", phone: "", date: "", time: "", startAt: "", guests: 2, notes: "" };

// Open dates for the next ~8 weeks (Wed to Sun; closed Mon/Tue) as a date strip.
const OPEN_DATES = (() => {
  const out = [];
  const t = new Date();
  for (let i = 0; i < 56 && out.length < 24; i++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
    const wd = d.getDay();
    if (wd === 1 || wd === 2) continue; // Mon + Tue closed
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({
      value,
      wd: i === 0 ? "Today" : d.toLocaleDateString("en-AU", { weekday: "short" }),
      day: d.getDate(),
      mon: d.toLocaleDateString("en-AU", { month: "short" }),
    });
  }
  return out;
})();

export default function Booking() {
  const [form, setForm] = useState(empty);
  const [slots, setSlots] = useState([]);
  const [openDay, setOpenDay] = useState(true);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Name, email and phone are all required and format-checked (AU phone).
  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!isValidAuPhone(form.phone)) e.phone = "Enter a valid Australian phone number.";
    return e;
  };

  // Validate a single field when the user leaves it — but don't nag on empty
  // fields until they actually submit.
  const blurCheck = (name, value) => {
    if (!value) return;
    let msg = null;
    if (name === "name" && value.trim().length < 2) msg = "Please enter your full name.";
    if (name === "email" && !isValidEmail(value)) msg = "Enter a valid email address.";
    if (name === "phone" && !isValidAuPhone(value)) msg = "Enter a valid Australian phone number.";
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  useEffect(() => {
    if (!form.date) return;
    api.get("/bookings/availability", { params: { date: form.date } })
      .then((r) => { setSlots(r.data.slots); setOpenDay(r.data.open !== false); })
      .catch(() => { setSlots([]); setOpenDay(true); });
  }, [form.date]);

  const submit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) { setErrors(eObj); setStatus("invalid"); return; }
    setErrors({});
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
    <div data-testid="booking-page" className="relative min-h-screen grid lg:grid-cols-2 overflow-x-hidden">
      <div className="relative hidden lg:block">
        <img src="/img/hero_club.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-ink" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="eyebrow mb-4">Reservations</p>
          <h2 className="font-display text-5xl leading-tight">Pull up a seat at the Cozy Box.</h2>
          <p className="text-smoke mt-4 max-w-md">209 Lygon St, Carlton · Wed to Sun. For parties over 12, use Private & Events.</p>
        </div>
      </div>

      <div className="flex items-start lg:items-center justify-center px-6 pt-28 pb-20 lg:py-24 min-w-0">
        <div className="w-full max-w-md min-w-0">
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
              <div>
                <input required placeholder="Full name" className={field} value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value.replace(/[^\p{L} .'-]/gu, "") }); if (errors.name) setErrors({ ...errors, name: null }); }}
                  onBlur={(e) => blurCheck("name", e.target.value)}
                  aria-invalid={!!errors.name} data-testid="booking-name" />
                {errors.name && <p className="text-red-400 text-xs mt-1.5" data-testid="err-name">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input required type="email" inputMode="email" placeholder="Email" className={field} value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: null }); }}
                    onBlur={(e) => blurCheck("email", e.target.value)}
                    aria-invalid={!!errors.email} data-testid="booking-email" />
                  {errors.email && <p className="text-red-400 text-xs mt-1.5" data-testid="err-email">{errors.email}</p>}
                </div>
                <div>
                  <input required type="tel" inputMode="tel" placeholder="Phone e.g. 04XX XXX XXX" className={field} value={form.phone}
                    onChange={(e) => { const v = e.target.value.replace(/[^\d+\s()-]/g, ""); setForm({ ...form, phone: v }); if (errors.phone) setErrors({ ...errors, phone: null }); }}
                    onBlur={(e) => blurCheck("phone", e.target.value)}
                    aria-invalid={!!errors.phone} data-testid="booking-phone" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1.5" data-testid="err-phone">{errors.phone}</p>}
                </div>
              </div>
              {/* Date — an elegant horizontal date strip */}
              <div>
                <p className="text-smoke-dim text-xs uppercase tracking-[0.2em] mb-3">Choose a date</p>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1" data-testid="booking-dates">
                  {OPEN_DATES.map((d) => {
                    const on = form.date === d.value;
                    return (
                      <button type="button" key={d.value}
                        onClick={() => setForm({ ...form, date: d.value, time: "", startAt: "" })}
                        data-testid={`date-${d.value}`}
                        className={`shrink-0 w-[62px] rounded-xl border py-3 flex flex-col items-center gap-1 transition-all duration-200 ${on ? "bg-amber text-ink border-amber shadow-[0_8px_24px_-8px_rgba(255,159,28,0.6)]" : "hairline text-white/85 hover:border-amber/50 hover:-translate-y-0.5"}`}>
                        <span className={`text-[0.56rem] uppercase tracking-[0.14em] ${on ? "text-ink/70" : "text-smoke-dim"}`}>{d.wd}</span>
                        <span className="font-display text-2xl leading-none">{d.day}</span>
                        <span className={`text-[0.56rem] uppercase tracking-[0.14em] ${on ? "text-ink/70" : "text-smoke-dim"}`}>{d.mon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guests — inline stepper */}
              <div className="flex items-center justify-between rounded-xl border hairline bg-ink-surface/60 px-4 py-2.5">
                <span className="text-smoke-dim text-xs uppercase tracking-[0.2em]">Guests</span>
                <div className="flex items-center gap-4">
                  <button type="button" aria-label="Fewer guests" onClick={() => setForm({ ...form, guests: Math.max(1, Number(form.guests) - 1) })}
                    className="w-8 h-8 grid place-items-center rounded-full border hairline text-white hover:border-amber/60 disabled:opacity-40" disabled={Number(form.guests) <= 1}>
                    <Minus size={15} />
                  </button>
                  <span className="w-6 text-center text-lg tabular-nums">{form.guests}</span>
                  <button type="button" aria-label="More guests" onClick={() => setForm({ ...form, guests: Math.min(12, Number(form.guests) + 1) })}
                    className="w-8 h-8 grid place-items-center rounded-full border hairline text-white hover:border-amber/60 disabled:opacity-40" disabled={Number(form.guests) >= 12}>
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              {form.date && (
                <div data-testid="booking-slots">
                  <p className="text-smoke-dim text-xs uppercase tracking-[0.2em] mb-3">Choose a time</p>
                  {!openDay ? (
                    <p className="text-amber/90 text-sm rounded-lg border border-amber/30 bg-amber/5 px-4 py-3">
                      We're closed that day. We are open Wed to Sun. Pick another date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((s) => (
                        <button type="button" key={s.startAt} onClick={() => setForm({ ...form, time: s.time, startAt: s.startAt })}
                          className={`py-2.5 rounded-lg text-sm border transition-colors ${form.time === s.time ? "bg-amber text-ink border-amber" : "hairline text-white/80 hover:border-amber/50"}`}
                          data-testid={`slot-${s.time}`}>{s.time}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <textarea placeholder="Special requests (optional)" rows={3} className={field} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} data-testid="booking-notes" />
              {status === "invalid" && <p className="text-red-400 text-sm">Please fix the highlighted fields above.</p>}
              {status === "notime" && <p className="text-amber text-sm">Please pick a time slot.</p>}
              {status === "error" && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
              <GlowButton type="submit" className="w-full" data-testid="booking-submit">{status === "sending" ? "Sending…" : "Request Table"}</GlowButton>
              <p className="text-smoke-dim text-xs text-center pt-2">You'll get an instant email confirmation with a calendar invite.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
