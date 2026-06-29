import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "cozybox_age_ok";

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem(KEY)) setOpen(true);
  }, []);
  const accept = () => {
    sessionStorage.setItem(KEY, "1");
    setOpen(false);
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          data-testid="age-gate"
        >
          <div className="absolute inset-0 bg-ink/95 backdrop-blur-xl" />
          <motion.div
            initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-lg text-center"
          >
            <img src="/img/cozybox-logo.png" alt="Cozy Box" className="mx-auto w-44 mb-8 opacity-90" />
            <p className="eyebrow mb-4">Welcome to the Cozy Box</p>
            <h2 className="text-4xl sm:text-5xl mb-5 leading-tight">Are you 18 or older?</h2>
            <p className="text-smoke text-sm mb-9 max-w-sm mx-auto leading-relaxed">
              We craft spirits meant to be savoured — and by law, only by those of legal drinking age.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={accept}
                data-testid="age-gate-yes"
                className="rounded-full bg-amber px-8 py-3.5 text-[0.78rem] uppercase tracking-[0.2em] font-medium text-ink hover:bg-amber-soft transition-colors"
              >
                Yes, I'm 18+
              </button>
              <a
                href="https://www.google.com"
                className="rounded-full border border-white/15 px-8 py-3.5 text-[0.78rem] uppercase tracking-[0.2em] text-smoke hover:text-white transition-colors"
              >
                No
              </a>
            </div>
            <p className="text-smoke-dim text-[0.7rem] mt-8">
              By entering you confirm you are of legal drinking age in your state or territory.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
