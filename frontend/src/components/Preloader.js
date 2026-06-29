import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KEY = "cozybox_loaded";

export default function Preloader() {
  const [done, setDone] = useState(() => !!sessionStorage.getItem(KEY));
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (done) return;
    document.body.style.overflow = "hidden";
    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 8) + 3;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem(KEY, "1");
          document.body.style.overflow = "";
          setDone(true);
        }, 650);
      }
      setCount(n);
    }, 90);
    return () => { clearInterval(id); document.body.style.overflow = ""; };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          data-testid="preloader"
        >
          <motion.img
            src="/img/cozybox-logo.png" alt="Cozy Box"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-56 sm:w-72 mb-10"
          />
          <div className="w-[min(70vw,420px)] h-px bg-white/10 relative overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 bg-amber" style={{ width: `${count}%` }} />
          </div>
          <div className="mt-6 flex w-[min(70vw,420px)] items-center justify-between text-smoke-dim text-xs uppercase tracking-[0.3em]">
            <span>Loading the night</span>
            <span className="font-display text-amber text-3xl tabular-nums">{count}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
