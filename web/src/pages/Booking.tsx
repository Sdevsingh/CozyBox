import { useEffect, useState } from "react";
import { api, type Location } from "../api/client";

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Booking() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [date, setDate] = useState(todayPlus(1));
  const [slots, setSlots] = useState<{ startAt: string; available: boolean }[]>(
    [],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [form, setForm] = useState({ givenName: "", email: "", phone: "", note: "" });
  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ id: string; startAt: string } | null>(
    null,
  );

  useEffect(() => {
    api.locations().then((d) => setLocations(d.locations)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoadingSlots(true);
    setSelected(null);
    api
      .availability(date)
      .then((d) => setSlots(d.slots))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError("Please choose a time slot.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { booking } = await api.createBooking({
        startAt: selected,
        partySize,
        note: form.note || undefined,
        customer: {
          givenName: form.givenName,
          email: form.email,
          phone: form.phone || undefined,
        },
      });
      setConfirmed({ id: booking.id, startAt: selected });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <section className="section container">
      <p className="eyebrow">Table Booking</p>
      <h2>Reserve your table</h2>
      <p className="muted">
        Backed by Square Bookings, Customers & Locations. Pick a date and time,
        and we'll have your table ready.
      </p>

      {locations[0] && (
        <div className="card" style={{ margin: "14px 0" }}>
          <strong>{locations[0].name}</strong>
          <div className="muted">{locations[0].address}</div>
          <div className="muted">{locations[0].hours}</div>
        </div>
      )}

      {confirmed ? (
        <div className="notice ok">
          ✅ Table booked! Reference <strong>{confirmed.id}</strong> for{" "}
          {partySize} guests on{" "}
          {new Date(confirmed.startAt).toLocaleString("en-AU")}. A confirmation
          has been sent to {form.email}.
        </div>
      ) : (
        <form className="grid cols-2" onSubmit={submit} style={{ alignItems: "start" }}>
          <div className="card">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              min={todayPlus(0)}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>Available times</label>
            {loadingSlots ? (
              <p className="spinner">Checking availability…</p>
            ) : (
              <div className="slots">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s.startAt}
                    disabled={!s.available}
                    className={`slot ${selected === s.startAt ? "selected" : ""} ${
                      s.available ? "" : "disabled"
                    }`}
                    onClick={() => s.available && setSelected(s.startAt)}
                  >
                    {time(s.startAt)}
                  </button>
                ))}
              </div>
            )}

            <label htmlFor="party">Party size</label>
            <select
              id="party"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>

          <div className="card">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              required
              value={form.givenName}
              onChange={(e) => setForm({ ...form, givenName: e.target.value })}
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
            <label htmlFor="note">Special requests</label>
            <textarea
              id="note"
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            {error && <div className="notice err">{error}</div>}
            <button
              className="btn"
              style={{ width: "100%", marginTop: 14 }}
              disabled={submitting}
            >
              {submitting ? "Booking…" : "Confirm booking"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
