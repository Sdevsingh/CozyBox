import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatPrice } from "../data";
import SquareCheckout from "./SquareCheckout";

/**
 * CheckoutDialog — a centered, two-panel Radix Dialog.
 *  • Left  : the order summary (bottle imagery stays visible while paying).
 *  • Right : the Square payment form (wallets + card).
 * Replaces the cramped in-drawer checkout so the product is never hidden.
 */
export default function CheckoutDialog({ open, onOpenChange, lines, total, inc, dec, onDone }) {
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const FREE_SHIP = 15000;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              onOpenAutoFocus={(e) => e.preventDefault()}
              data-testid="checkout-dialog"
            >
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                <motion.div
                  className="pointer-events-auto relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col
                    rounded-3xl border border-amber/25 bg-ink-surface
                    shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Dialog.Title className="sr-only">Checkout — your Fossey's order</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Review the bottles in your order and pay securely with Apple Pay, Google Pay, Afterpay or card.
                  </Dialog.Description>

                  <div className="grid md:grid-cols-2 flex-1 min-h-0 overflow-hidden">
                    {/* ── Order summary (bottles stay visible) ── */}
                    <div className="hidden md:flex flex-col min-h-0 overflow-hidden bg-ink/50 border-r hairline">
                      <div className="p-7 border-b hairline shrink-0">
                        <p className="eyebrow mb-1">Your order</p>
                        <h2 className="text-2xl">The Cellar</h2>
                        <p className="text-smoke-dim text-xs mt-1">{count} {count === 1 ? "bottle" : "bottles"} · ships Australia-wide</p>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto p-7 space-y-5">
                        {lines.map((l) => (
                          <div key={l.id} className="flex gap-4" data-testid={`summary-line-${l.id}`}>
                            <img src={l.image || "/img/shop_bottles.jpg"} alt={l.name}
                              onError={(e) => { if (!e.currentTarget.src.includes("shop_bottles")) e.currentTarget.src = "/img/shop_bottles.jpg"; }}
                              className="w-16 h-20 object-cover rounded-lg border hairline shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm leading-tight">{l.name}</h4>
                              <p className="text-smoke-dim text-xs mt-0.5">{l.abv} · {l.size}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <button onClick={() => dec(l.id)} className="w-7 h-7 grid place-items-center rounded-full border hairline hover:border-amber/50 transition-colors" aria-label={`Remove one ${l.name}`}><Minus size={13} /></button>
                                <span className="text-sm w-5 text-center">{l.qty}</span>
                                <button onClick={() => inc(l.id)} className="w-7 h-7 grid place-items-center rounded-full border hairline hover:border-amber/50 transition-colors" aria-label={`Add one ${l.name}`}><Plus size={13} /></button>
                              </div>
                            </div>
                            <span className="text-white/80 text-sm whitespace-nowrap">{formatPrice(l.price * l.qty)}</span>
                          </div>
                        ))}
                        {lines.length === 0 && <p className="text-smoke text-center mt-10 text-sm">Your cart is empty.</p>}
                      </div>
                      <div className="p-7 border-t hairline space-y-1.5 shrink-0">
                        <div className="flex justify-between text-smoke text-xs uppercase tracking-[0.15em]">
                          <span>Subtotal</span><span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between text-smoke-dim text-xs">
                          <span>Shipping</span>
                          <span>{total >= FREE_SHIP ? "Free" : "Calculated at dispatch"}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2">
                          <span className="text-smoke uppercase tracking-[0.2em] text-xs">Total</span>
                          <span className="text-amber font-display text-3xl">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* ── Payment ── */}
                    <div className="flex flex-col min-h-0 overflow-y-auto">
                      <div className="p-6 sm:p-8">
                        {/* Compact summary on mobile (left panel is hidden) */}
                        <div className="md:hidden mb-5 flex items-center justify-between rounded-xl border hairline bg-ink/50 px-4 py-3">
                          <span className="inline-flex items-center gap-2 text-sm text-white/80">
                            <ShoppingBag size={15} className="text-amber" /> {count} {count === 1 ? "bottle" : "bottles"}
                          </span>
                          <span className="text-amber font-display text-xl">{formatPrice(total)}</span>
                        </div>

                        <p className="eyebrow mb-1">Secure checkout</p>
                        <h3 className="text-2xl mb-5">Almost there.</h3>

                        <SquareCheckout lines={lines} total={total} onDone={onDone} />
                      </div>
                    </div>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 grid place-items-center h-9 w-9 rounded-full bg-ink/60 border hairline text-white/70 hover:text-white hover:border-amber/50 transition-colors"
                      aria-label="Close checkout"
                      data-testid="checkout-dialog-close"
                    >
                      <X size={18} />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
