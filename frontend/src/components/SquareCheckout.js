import { useEffect, useRef, useState } from "react";
import { ShieldCheck, CreditCard, ExternalLink, Loader2, Truck } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { getConfig, loadSquareSdk } from "../lib/square";
import { isValidEmail, isValidAuPhone, isValidAuPostcode } from "../lib/validate";
import GlowButton from "./GlowButton";

/**
 * SquareCheckout — Square Web Payments: Apple Pay + Google Pay + card, all
 * tokenized client-side then sent to /api/orders (Square Order + Payment).
 * Wallets appear only when the browser/device/domain supports them.
 * Falls back to an order-only flow when Square keys aren't configured yet.
 */
export default function SquareCheckout({ lines, total, onDone }) {
  const [cfg, setCfg] = useState(null);
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [ship, setShip] = useState({ phone: "", line1: "", line2: "", suburb: "", state: "VIC", postcode: "" });
  const [status, setStatus] = useState("idle"); // idle | paying | done | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [wallets, setWallets] = useState({ apple: false, google: false, afterpay: false });
  const [cardLoading, setCardLoading] = useState(true);

  const cardRef = useRef(null);
  const applePayRef = useRef(null);
  const googlePayRef = useRef(null);
  const afterpayRef = useRef(null);
  const finishRef = useRef(null);
  const containerId = "sq-card-container";

  useEffect(() => { getConfig().then(setCfg); }, []);

  // Shared order-completion — kept on a ref so wallet click handlers always
  // call the latest version (avoids stale closures).
  const finishOrder = async (sourceId, { requireEmail = true } = {}) => {
    setError("");
    if (cfg?.enabled && requireEmail && !isValidEmail(buyer.email)) {
      setError("Please add a valid email for your receipt.");
      return;
    }
    // Delivery address validation (bottles ship Australia-wide).
    if (!ship.line1.trim() || !ship.suburb.trim()) {
      setError("Please add your delivery street and suburb.");
      return;
    }
    if (!isValidAuPostcode(ship.postcode)) {
      setError("Enter a valid 4-digit Australian postcode.");
      return;
    }
    if (!isValidAuPhone(ship.phone)) {
      setError("Enter a valid Australian phone number for delivery.");
      return;
    }
    setStatus("paying");
    try {
      const { data } = await api.post("/orders", {
        sourceId,
        name: buyer.name,
        email: buyer.email,
        lines: lines.map((l) => ({ id: l.id, name: l.name, price: l.price, qty: l.qty })),
        shipping: {
          name: buyer.name,
          phone: ship.phone,
          line1: ship.line1,
          line2: ship.line2,
          suburb: ship.suburb,
          state: ship.state,
          postcode: ship.postcode,
          country: "AU",
        },
      });
      setResult(data);
      setStatus("done");
      onDone?.(data);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || "Payment failed. Try again.");
      setStatus("error");
    }
  };
  finishRef.current = finishOrder;

  // Initialise Square payment methods (card + wallets)
  useEffect(() => {
    if (!cfg?.enabled || !cfg.applicationId || !cfg.locationId) return;
    let cancelled = false;

    const buildRequest = (payments) =>
      payments.paymentRequest({
        countryCode: "AU",
        currencyCode: cfg.currency || "AUD",
        total: { amount: (total / 100).toFixed(2), label: "Cozy Box" },
      });

    (async () => {
      try {
        const Square = await loadSquareSdk(cfg.environment);
        if (cancelled) return;
        const payments = Square.payments(cfg.applicationId, cfg.locationId);

        // Card
        try {
          const card = await payments.card();
          if (!cancelled) { await card.attach(`#${containerId}`); cardRef.current = card; setCardLoading(false); }
        } catch { if (!cancelled) setCardLoading(false); /* card unavailable */ }

        // Google Pay
        try {
          const gp = await payments.googlePay(buildRequest(payments));
          await gp.attach("#google-pay-button", { buttonColor: "black", buttonType: "long", buttonSizeMode: "fill" });
          googlePayRef.current = gp;
          const btn = document.getElementById("google-pay-button");
          btn?.addEventListener("click", async (e) => {
            e.preventDefault();
            const res = await gp.tokenize();
            if (res.status === "OK") finishRef.current(res.token, { requireEmail: false });
            else setError(res.errors?.[0]?.message || "Google Pay was cancelled.");
          });
          if (!cancelled) setWallets((w) => ({ ...w, google: true }));
        } catch { /* google pay unsupported */ }

        // Apple Pay (Safari + verified HTTPS domain only)
        try {
          const ap = await payments.applePay(buildRequest(payments));
          applePayRef.current = ap;
          const btn = document.getElementById("apple-pay-button");
          btn?.addEventListener("click", async (e) => {
            e.preventDefault();
            const res = await ap.tokenize();
            if (res.status === "OK") finishRef.current(res.token, { requireEmail: false });
            else setError(res.errors?.[0]?.message || "Apple Pay was cancelled.");
          });
          if (!cancelled) setWallets((w) => ({ ...w, apple: true }));
        } catch { /* apple pay unsupported */ }

        // Afterpay / Clearpay (buy now, pay later) — needs the itemised request
        try {
          const req = payments.paymentRequest({
            countryCode: "AU",
            currencyCode: cfg.currency || "AUD",
            total: { amount: (total / 100).toFixed(2), label: "Total" },
            lineItems: lines.map((l) => ({
              label: l.name,
              amount: ((l.price * l.qty) / 100).toFixed(2),
              pending: false,
            })),
          });
          const afterpay = await payments.afterpayClearpay(req);
          await afterpay.attach("#afterpay-button");
          afterpayRef.current = afterpay;
          const btn = document.getElementById("afterpay-button");
          btn?.addEventListener("click", async (e) => {
            e.preventDefault();
            const res = await afterpay.tokenize();
            if (res.status === "OK") finishRef.current(res.token, { requireEmail: false });
            else setError(res.errors?.[0]?.message || "Afterpay was cancelled.");
          });
          if (!cancelled) setWallets((w) => ({ ...w, afterpay: true }));
        } catch { /* afterpay unavailable (account/amount limits) */ }
      } catch {
        setError("Couldn't load the secure payment form. Refresh and try again.");
      }
    })();

    return () => {
      cancelled = true;
      cardRef.current?.destroy?.();
      cardRef.current = null;
      const g = document.getElementById("google-pay-button"); if (g) g.innerHTML = "";
      const a = document.getElementById("afterpay-button"); if (a) a.innerHTML = "";
    };
  }, [cfg, total]);

  const submitCard = async () => {
    if (!cfg?.enabled) return finishOrder(null);
    setError("");
    setStatus("paying");
    try {
      const res = await cardRef.current.tokenize();
      if (res.status !== "OK") throw new Error(res.errors?.[0]?.message || "Card was declined.");
      await finishOrder(res.token);
    } catch (e) {
      setError(e.message || "Card was declined.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-xl border border-amber/40 bg-ink-surface p-5 text-center" data-testid="order-success">
        <ShieldCheck className="mx-auto text-amber mb-2" />
        <p className="text-white/90 mb-1">{result?.message || "Order placed."}</p>
        {result?.orderId && <p className="text-smoke-dim text-xs">Order #{String(result.orderId).slice(0, 8)}</p>}
        {result?.receiptUrl && (
          <a href={result.receiptUrl} target="_blank" rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-amber text-xs uppercase tracking-[0.18em]">
            View receipt <ExternalLink size={13} />
          </a>
        )}
      </div>
    );
  }

  const field = "w-full bg-ink border hairline rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-smoke-dim focus:border-amber/60 focus:outline-none transition-colors";
  const anyWallet = wallets.apple || wallets.google || wallets.afterpay;

  return (
    <div className="space-y-3" data-testid="square-checkout">
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Name" className={field} value={buyer.name}
          onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} data-testid="checkout-name" />
        <input type="email" placeholder="Email" className={field} value={buyer.email}
          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} data-testid="checkout-email" />
      </div>

      {/* Delivery address — bottles ship Australia-wide */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.2em] text-smoke-dim pt-1">
          <Truck size={12} className="text-amber" /> Delivery address
        </p>
        <input placeholder="Street address" className={field} value={ship.line1}
          onChange={(e) => setShip({ ...ship, line1: e.target.value })} data-testid="checkout-address1" autoComplete="address-line1" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Apt / unit (optional)" className={field} value={ship.line2}
            onChange={(e) => setShip({ ...ship, line2: e.target.value })} autoComplete="address-line2" />
          <input placeholder="Phone (for delivery)" inputMode="tel" className={field} value={ship.phone}
            onChange={(e) => setShip({ ...ship, phone: e.target.value.replace(/[^\d+\s()-]/g, "") })} autoComplete="tel" />
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <input placeholder="Suburb" className={field} value={ship.suburb}
            onChange={(e) => setShip({ ...ship, suburb: e.target.value })} data-testid="checkout-suburb" autoComplete="address-level2" />
          <select className={`${field} pr-8`} value={ship.state}
            onChange={(e) => setShip({ ...ship, state: e.target.value })} data-testid="checkout-state" aria-label="State">
            {["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Postcode" inputMode="numeric" maxLength={4} className={`${field} w-24`} value={ship.postcode}
            onChange={(e) => setShip({ ...ship, postcode: e.target.value.replace(/\D/g, "").slice(0, 4) })} data-testid="checkout-postcode" autoComplete="postal-code" />
        </div>
      </div>

      {/* Express wallets */}
      {cfg?.enabled && (
        <div className="space-y-2">
          {anyWallet && (
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-smoke-dim pb-0.5">Express checkout</p>
          )}
          <div id="apple-pay-button" className={`apple-pay-button ${wallets.apple ? "" : "hidden"}`} aria-label="Pay with Apple Pay" />
          <div id="google-pay-button" className={`min-h-[44px] ${wallets.google ? "" : "hidden"}`} />
          <div id="afterpay-button" className={`min-h-[44px] ${wallets.afterpay ? "" : "hidden"}`} aria-label="Pay with Afterpay" />
          {/* Apple Pay only renders in Safari on a verified HTTPS domain — hint elsewhere */}
          {!wallets.apple && (
            <p className="text-smoke-dim text-[0.62rem] leading-relaxed">
               Apple Pay appears in Safari once we're live on cozybox.au (it can't show on localhost or in Chrome).
            </p>
          )}
          {anyWallet && (
            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-smoke-dim">or pay by card</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
          )}
        </div>
      )}

      {cfg?.enabled ? (
        <div className="relative">
          <div id={containerId} className="rounded-lg border hairline bg-ink p-3 min-h-[52px]" />
          {cardLoading && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-smoke-dim text-xs pointer-events-none">
              <Loader2 size={14} className="animate-spin text-amber" /> Loading secure card field…
            </div>
          )}
        </div>
      ) : (
        <p className="flex items-start gap-2 text-smoke-dim text-xs rounded-lg border hairline bg-ink/60 px-3 py-2.5">
          <CreditCard size={14} className="text-amber shrink-0 mt-0.5" />
          Card payments activate once Square keys are added. Your order will be recorded now.
        </p>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <GlowButton onClick={submitCard} className="w-full" disabled={status === "paying"} data-testid="pay-btn">
        {status === "paying"
          ? <span className="inline-flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Processing…</span>
          : `Pay ${formatPrice(total)}`}
      </GlowButton>

      <p className="flex items-center justify-center gap-1.5 text-smoke-dim text-[0.68rem]">
        <ShieldCheck size={12} className="text-amber" /> Secured by Square · Apple Pay, Google Pay &amp; cards
      </p>
    </div>
  );
}
