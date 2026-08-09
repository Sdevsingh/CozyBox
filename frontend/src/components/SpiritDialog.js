import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Truck, Droplet, FlaskConical, MapPin, Sparkles, ShieldCheck, GlassWater } from "lucide-react";
import { formatPrice } from "../data";
import { productSchema } from "../lib/seo";
import JsonLd from "./JsonLd";

// A "perfect serve" line unique to each bottle — fills the product view with
// useful, on-brand copy (and gives search engines more to index).
const SERVE = {
  // Gin
  GIN_ORIGINAL: "Pour over ice with a good tonic and a twist of orange, the way we intended.",
  GIN_DESERT_LIME: "A tall gin and tonic with soda, plenty of ice and a wedge of fresh lime.",
  GIN_NAVAL: "Stands tall in a bold negroni, or over a single rock with premium tonic.",
  GIN_SHIRAZ: "Beautiful in a spritz with soda, or sipped neat to show the berry notes.",
  GIN_KAFFIR_LEAF: "Let it shine in a fragrant gin and tonic with a slice of cucumber.",
  GIN_TODDY: "Warm it gently with honey and lemon for the ultimate hot toddy.",
  GIN_XMAS_PUD: "Serve over ice with ginger ale and a long strip of orange peel.",
  GIN_CHILLI: "Built for a spicy margarita, or over rocks with tonic and lime.",
  GIN_GRAPEFRUIT: "Long over ice in a Paloma with grapefruit soda and a pinch of salt.",
  // Vodka
  VODKA_DOUBLE: "The clean base for any classic. Try it in a crisp vodka martini.",
  VODKA_D_DOUBLE: "Sip it ice cold and neat, or elevate a simple soda and lime.",
  VODKA_BLOOD_ORANGE: "Top with prosecco and soda for a vivid blood orange spritz.",
  // Whisky
  WHISKY_SINGLE_MALT: "Pour neat and let it open, or add one large cube of ice.",
  WHISKY_PEATED: "Best neat in a warmed glass to let the smoke unfold slowly.",
  WHISKY_MONSOON_DROP: "Sip neat and unhurried, or with a few drops of spring water.",
  WHISKY_MALWA_MALT: "Serve neat in a tulip glass to savour its silky double cask finish.",
  WHISKY_BUTTERSCOTCH: "Pour over ice, stir into coffee, or drizzle across vanilla ice cream.",
  // Rum
  RUM_HONEY: "Sip neat over ice, or shake into a honeyed daiquiri.",
  RUM_REDGUM: "Enjoy neat, or in an old fashioned with a strip of orange.",
  // Liqueurs
  LIQ_COFFEE: "The soul of an espresso martini, or poured over ice after dinner.",
  // Indian Series
  IND_MANGO: "Long over ice with soda and a squeeze of lime for a mango cooler.",
  IND_JAMUN: "Top with tonic and a sprig of mint to lift the tart jamun notes.",
  IND_LAHORI_JEERA: "A savoury twist on a gin and tonic, garnished with fresh coriander.",
  IND_BOTANICA: "Classic and clean in a botanical forward gin and tonic.",
  IND_ROSE_LYCHEE: "Pour into a rose spritz with prosecco and a few fresh lychees.",
  IND_SAFFRON: "Serve chilled and neat, or in a golden saffron martini.",
  IND_PAAN: "The base of a show stopping paan negroni with a betel leaf twist.",
  IND_POPCORN: "Shake into a sweet, buttery sour, or sip over plenty of ice.",
  IND_BLACK: "Make it the centrepiece of a striking jet black martini.",
};

/**
 * SpiritDialog — the Cellar's product overview. An accessible Radix Dialog
 * styled as a premium single-product page: full-height bottle imagery, tasting
 * copy, provenance, spec chips and buy / enquire CTA. Emits Product structured
 * data and sets the document title while open (share + SEO friendly).
 */
export default function SpiritDialog({ spirit, onClose, onAdd }) {
  // Reflect the open product in the tab title (better sharing + crawlability).
  useEffect(() => {
    if (!spirit) return;
    const prev = document.title;
    document.title = `Fossey's ${spirit.name} · The Cellar · Cozy Box`;
    return () => { document.title = prev; };
  }, [spirit]);

  // Freeze Lenis smooth-scroll while the product view is open so the Cellar
  // page behind it doesn't scroll (paired with data-lenis-prevent below).
  useEffect(() => {
    if (spirit) window.__lenis?.stop();
    else window.__lenis?.start();
    return () => window.__lenis?.start();
  }, [spirit]);

  return (
    <Dialog.Root open={!!spirit} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {spirit && (
          <Dialog.Portal forceMount>
            {/* Per-product structured data for Google Product rich results */}
            <JsonLd data={productSchema(spirit)} />

            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[80] bg-ink/85 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              onOpenAutoFocus={(e) => e.preventDefault()}
              data-testid={`spirit-dialog-${spirit.id}`}
            >
              <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <motion.div
                  data-lenis-prevent
                  className="pointer-events-auto relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain
                    rounded-3xl border border-amber/25 bg-ink-surface
                    shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
                  initial={{ opacity: 0, scale: 0.94, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="grid sm:grid-cols-[0.85fr_1.15fr] sm:items-stretch">
                    {/* ── Imagery ── */}
                    <div className={`relative overflow-hidden flex items-center justify-center aspect-[4/5] sm:aspect-auto sm:min-h-[420px] ${spirit.packshot ? "bg-gradient-to-b from-white/[0.06] via-ink to-ink" : "bg-ink"}`}>
                      <img src={spirit.image || "/img/shop_bottles.jpg"} alt={`Fossey's ${spirit.name}`}
                        onError={(e) => { if (!e.currentTarget.src.includes("shop_bottles")) e.currentTarget.src = "/img/shop_bottles.jpg"; }}
                        className={spirit.packshot
                          ? "max-h-[340px] w-auto object-contain drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)]"
                          : "absolute inset-0 h-full w-full object-cover"} />
                      {!spirit.packshot && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-surface/30 hidden sm:block" />
                        </>
                      )}
                      {spirit.badge && (
                        <span className="absolute top-5 left-5 rounded-full neon-pill text-[0.58rem] uppercase tracking-[0.2em] px-3 py-1.5">
                          {spirit.badge}
                        </span>
                      )}
                      {/* Provenance chip */}
                      <div className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-ink/70 border hairline px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-white/85">
                        <MapPin size={12} className="text-amber" /> Distilled in Carlton
                      </div>
                    </div>

                    {/* ── Details ── */}
                    <div className="p-6 sm:p-8 flex flex-col">
                      <p className="text-[0.62rem] uppercase tracking-[0.25em] text-amber/80 mb-2">
                        Fossey's Distillery · {spirit.section}
                      </p>
                      <Dialog.Title className="text-3xl sm:text-4xl leading-tight mb-2">{spirit.name}</Dialog.Title>
                      {spirit.tagline && <p className="font-display italic text-xl text-amber mb-5">{spirit.tagline}</p>}

                      <Dialog.Description className="text-smoke text-sm leading-relaxed mb-6">
                        {spirit.description}
                      </Dialog.Description>

                      {/* Spec chips */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="inline-flex items-center gap-1.5 rounded-full border hairline px-3 py-1.5 text-xs text-white/80">
                          <Droplet size={12} className="text-amber" /> {spirit.abv} ABV
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border hairline px-3 py-1.5 text-xs text-white/80">
                          <FlaskConical size={12} className="text-amber" /> {spirit.size}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border hairline px-3 py-1.5 text-xs text-white/80">
                          <Truck size={12} className="text-amber" /> Ships Australia-wide
                        </span>
                      </div>

                      {/* Reassurance row */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                          { icon: Sparkles, label: "Small batch" },
                          { icon: MapPin, label: "Made in Melbourne" },
                          { icon: ShieldCheck, label: "Secure checkout" },
                        ].map(({ icon: Icon, label }) => (
                          <div key={label} className="flex flex-col items-center text-center gap-1.5 rounded-xl border hairline bg-ink/30 py-3">
                            <Icon size={16} className="text-amber/90" />
                            <span className="text-[0.62rem] uppercase tracking-[0.12em] text-smoke-dim leading-tight">{label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Perfect serve — fills the space with on-brand, indexable copy */}
                      <div className="flex items-start gap-3 rounded-xl border border-amber/20 bg-amber/[0.04] px-4 py-3.5 mb-7">
                        <GlassWater size={16} className="text-amber shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-amber/80 mb-1">Perfect serve</p>
                          <p className="text-smoke text-sm leading-relaxed">{SERVE[spirit.id] || "Best enjoyed however you like it, neat, over ice, or in your favourite cocktail."}</p>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t hairline">
                        {spirit.price ? (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-smoke-dim">Price</span>
                              <span className="font-display text-4xl text-amber leading-none">{formatPrice(spirit.price)}</span>
                            </div>
                            <button
                              onClick={() => onAdd(spirit)}
                              data-testid={`dialog-add-${spirit.id}`}
                              className="inline-flex items-center gap-2 rounded-full bg-amber text-ink px-6 py-3 text-[0.72rem] uppercase tracking-[0.18em] font-medium hover:bg-amber-soft transition-colors"
                            >
                              <Plus size={16} /> Add to Cart
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-smoke-dim">Availability</span>
                              <span className="text-white/85 text-lg leading-none mt-1">In store &amp; on enquiry</span>
                            </div>
                            <a
                              href={`mailto:hello@cozybox.au?subject=${encodeURIComponent("Cellar enquiry: " + spirit.name)}`}
                              className="inline-flex items-center gap-2 rounded-full border border-amber/50 text-amber px-6 py-3 text-[0.72rem] uppercase tracking-[0.18em] font-medium hover:bg-amber hover:text-ink transition-colors"
                            >
                              Enquire to buy
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 grid place-items-center h-9 w-9 rounded-full bg-ink/60 border hairline text-white/70 hover:text-white hover:border-amber/50 transition-colors"
                      aria-label="Close"
                      data-testid="spirit-dialog-close"
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
