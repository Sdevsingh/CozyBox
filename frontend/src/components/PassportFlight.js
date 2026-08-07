import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

/**
 * PassportFlight — a scroll-scrubbed passport "journey". A gold airliner follows
 * a curving, looping dotted flight route (sampled from a real SVG path via
 * getPointAtLength, so it rides the line exactly and banks to its heading). The
 * dotted trail grows behind it, destination checkpoints (departure stamp,
 * cocktail, reward, pin, arrival) pop in as it passes, gold sparkles trail the
 * craft, and it lands into a "WELCOME TO COZYBOX" passport stamp.
 *
 * Pure SVG/CSS + Framer Motion. viewBox 1000×620. Reduced-motion = landed frame.
 */

// The flight route (an airline-map style curve). Sweeps gently across to the
// left in the middle instead of a steep right-side drop.
const ROUTE =
  "M120,110 C 290,55 450,85 580,165 " +
  "C 710,240 760,100 855,195 " +
  "C 940,285 860,405 705,385 " +
  "C 545,363 455,285 320,330 " +
  "C 200,368 195,475 320,515 " +
  "C 470,560 645,520 800,468";

// Top-down airliner silhouette, nose +x. Shared by plane + stamp emblems.
const PLANE_PATH =
  "M44,0 C44,-3 40,-5 34,-5 L20,-5 L14,-6 L-18,-30 L-26,-30 L-6,-6 L-22,-6 " +
  "L-30,-18 L-38,-18 L-34,-5 L-40,-5 L-40,5 L-34,5 L-38,18 L-30,18 L-22,6 L-6,6 " +
  "L-26,30 L-18,30 L14,6 L20,5 L34,5 C40,5 44,3 44,0 Z";

// Checkpoints along the route (fraction of path length + label + kind + tilt).
const CHECKPOINTS = [
  { f: 0.015, kind: "stamp",    top: "MELBOURNE", sub: "DEPARTURE",   rot: -8, emblem: "plane" },
  { f: 0.30,  kind: "cocktail", top: "3 COCKTAILS", sub: "CHECK-IN",  rot: 5 },
  { f: 0.55,  kind: "reward",  top: "REWARD",     sub: "$25 VOUCHER", rot: -6 },
  { f: 0.78,  kind: "pin",     top: "FOSSEY'S",   sub: "DISTILLERY",  rot: 6 },
  { f: 0.985, kind: "stamp",   top: "COZY BOX",   sub: "ARRIVED",     rot: -5, emblem: "star" },
];

function StampMark({ top, sub, rot, emblem, id }) {
  const arcId = `pf-ck-${id}`;
  return (
    <g transform={`rotate(${rot})`} fill="#e8b755" filter="url(#pf-ink)">
      <circle r="30" fill="none" stroke="#c9902f" strokeWidth="1.3" strokeDasharray="2 3" opacity="0.7" />
      <circle r="24" fill="none" stroke="#e8b755" strokeWidth="2.2" />
      <circle r="21" fill="none" stroke="#e8b755" strokeWidth="0.7" opacity="0.55" />
      <path id={arcId} d="M -16 0 A 16 16 0 0 1 16 0" fill="none" />
      <text fontFamily="Outfit, sans-serif" fontSize="4.1" letterSpacing="0.7" fontWeight="600">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">{top}</textPath>
      </text>
      {/* star separators either side */}
      <text x="-20.5" y="1.8" textAnchor="middle" fontSize="4.4">✦</text>
      <text x="20.5" y="1.8" textAnchor="middle" fontSize="4.4">✦</text>
      {emblem === "plane"
        ? <path d={PLANE_PATH} transform="translate(0 -3) rotate(-45) scale(0.16)" />
        : <text y="0.5" textAnchor="middle" fontSize="11">★</text>}
      <text y="12" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="3.3" letterSpacing="0.6" fontWeight="500">{sub}</text>
    </g>
  );
}

// The authentic Cozy Box arrival seal — an engraved circular stamp with
// curved wording, star separators and hand-pressed ink distress.
function CozyStamp() {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter id="cz-ink" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <path id="cz-top" d="M -45 0 A 45 45 0 0 1 45 0" fill="none" />
      </defs>
      <g fill="#e8b755" stroke="#e8b755" filter="url(#cz-ink)">
        {/* rings */}
        <circle r="56" fill="none" strokeWidth="1" opacity="0.45" />
        <circle r="52" fill="none" strokeWidth="2.6" />
        <circle r="41" fill="none" strokeWidth="0.7" opacity="0.7" />
        <circle r="38.5" fill="none" strokeWidth="0.5" strokeDasharray="1.4 2.6" opacity="0.55" />
        {/* top curved legend */}
        <text fontFamily="Outfit, sans-serif" fontSize="6.4" fontWeight="600" letterSpacing="1.1" stroke="none">
          <textPath href="#cz-top" startOffset="50%" textAnchor="middle">COZY BOX · BY FOSSEY'S DISTILLERY</textPath>
        </text>
        {/* side star separators */}
        <text x="-47" y="2.6" textAnchor="middle" fontSize="7.5" stroke="none">✦</text>
        <text x="47" y="2.6" textAnchor="middle" fontSize="7.5" stroke="none">✦</text>
        {/* centre wordmark */}
        <text y="-15" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="4.4" letterSpacing="2.6" stroke="none" opacity="0.85">WELCOME TO</text>
        <text y="4" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="19" fontWeight="600" stroke="none">COZY BOX</text>
        <line x1="-22" y1="13" x2="22" y2="13" strokeWidth="0.7" opacity="0.55" />
        <text y="23" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="3.9" letterSpacing="1" stroke="none" opacity="0.9">3 COCKTAILS · 15 STAMPS · $25</text>
        {/* base legend */}
        <text y="41" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="4.6" letterSpacing="2.2" fontWeight="600" stroke="none">CARLTON · EST 2023</text>
      </g>
    </svg>
  );
}

function CocktailMark({ top, sub, rot }) {
  return (
    <g transform={`rotate(${rot})`} fill="none" stroke="#e8b755">
      <circle r="26" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.65" />
      <path d="M-11,-12 L11,-12 L0,1 Z" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M0,1 L0,10 M-6,10 L6,10" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="5" cy="-8" r="1.8" fill="#e8b755" stroke="none" />
      <text y="24" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="3.6" letterSpacing="0.5" fill="#e8b755" stroke="none">{top}</text>
    </g>
  );
}

function RewardMark({ top, sub, rot }) {
  return (
    <g transform={`rotate(${rot})`}>
      <circle r="26" fill="none" stroke="#c9902f" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.65" />
      <g stroke="#e8b755" strokeWidth="1.5" fill="none" strokeLinejoin="round">
        <rect x="-9" y="-4" width="18" height="13" rx="1.5" />
        <path d="M-9,1 h18 M0,-4 v13" />
        <path d="M0,-4 C-6,-11 -12,-6 0,-4 C6,-11 12,-6 0,-4 Z" />
      </g>
      <text y="22" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="3.6" letterSpacing="0.5" fill="#e8b755">{top}</text>
    </g>
  );
}

function PinMark({ top, rot }) {
  return (
    <g transform={`rotate(${rot})`}>
      <circle r="26" fill="none" stroke="#c9902f" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.65" />
      <path d="M0,-13 C6,-13 9,-8 9,-4 C9,3 0,13 0,13 C0,13 -9,3 -9,-4 C-9,-8 -6,-13 0,-13 Z"
        fill="#e8b755" stroke="#8a5f1c" strokeWidth="0.8" />
      <circle cy="-4" r="3.4" fill="#1c150b" />
      <text y="24" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="3.6" letterSpacing="0.5" fill="#e8b755">{top}</text>
    </g>
  );
}

function Checkpoint({ progress, cp, pt, isStatic }) {
  const o = useTransform(progress, [cp.f - 0.06, cp.f + 0.01], [0, 1]);
  const s = useTransform(progress, [cp.f - 0.06, cp.f + 0.01], [1.7, 1]);
  const Mark = cp.kind === "cocktail" ? CocktailMark : cp.kind === "reward" ? RewardMark : cp.kind === "pin" ? PinMark : StampMark;
  return (
    <motion.g style={{ opacity: isStatic ? 1 : o }} transform={`translate(${pt.x} ${pt.y})`}>
      <motion.g style={isStatic ? undefined : { scale: s, transformBox: "fill-box", transformOrigin: "center" }}>
        <Mark {...cp} id={`${Math.round(pt.x)}-${Math.round(pt.y)}`} />
      </motion.g>
    </motion.g>
  );
}

function Plane() {
  return (
    <g>
      <path d={PLANE_PATH} fill="rgba(0,0,0,0.35)" transform="translate(3 7)" />
      <path d={PLANE_PATH} fill="#f2cb73" stroke="#6e4a13" strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx="-6" cy="-15" rx="4" ry="2.4" fill="#b7862f" />
      <ellipse cx="-6" cy="15" rx="4" ry="2.4" fill="#b7862f" />
      <path d="M-32,0 L38,0" stroke="rgba(255,245,220,0.5)" strokeWidth="1.4" />
      <circle cx="34" cy="0" r="2.6" fill="#2a1c08" />
    </g>
  );
}

export default function PassportFlight() {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [planeImg, setPlaneImg] = useState(null);
  const [points, setPoints] = useState([]); // checkpoint coords, resolved from the path
  const [landed, setLanded] = useState(false);
  // On phones the flight graphic (landscape) must FIT (meet) so the route/stamps
  // aren't cropped off the sides; on desktop it fills (slice).
  const [par, setPar] = useState("xMidYMid slice");
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setPar(mq.matches ? "xMidYMid meet" : "xMidYMid slice");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const px = useMotionValue(110);
  const py = useMotionValue(90);
  const pa = useMotionValue(0);
  const traveledD = useMotionValue("");
  const ps = useTransform(scrollYProgress, [0, 0.85, 0.94, 1], [0.75, 1.35, 1.5, 1.3]);
  const planeT = useTransform([px, py, pa, ps], ([x, y, a, s]) => `translate(${x} ${y}) rotate(${a}) scale(${s})`);
  const speed = useTransform(scrollYProgress, [0, 0.5, 0.82], [0.9, 0.5, 0]);
  const glow = useTransform(scrollYProgress, [0.5, 0.92], [0.15, 0.7]);
  const textY = useTransform(scrollYProgress, [0, 1], ["3%", "-9%"]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setPlaneImg("/img/plane.png");
    img.onerror = () => setPlaneImg(null);
    img.src = "/img/plane.png";
  }, []);

  // Sample plane position + growing dotted trail from the actual path geometry.
  const TRAVEL = 0.9; // plane completes the route by 90% scroll, then holds/lands
  const sample = useCallback((p) => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    const d = Math.min(p / TRAVEL, 1) * L;
    const a = path.getPointAtLength(d);
    const b = path.getPointAtLength(Math.min(d + 2, L));
    px.set(a.x); py.set(a.y);
    pa.set((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI);
    const N = 72, seg = d / N;
    let str = "";
    for (let i = 0; i <= N; i++) { const q = path.getPointAtLength(seg * i); str += (i ? " L" : "M") + q.x.toFixed(1) + " " + q.y.toFixed(1); }
    traveledD.set(str);
    setLanded(p > 0.985);
  }, [px, py, pa, traveledD]);

  // Resolve checkpoint coordinates + draw the initial frame once mounted.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    setPoints(CHECKPOINTS.map((c) => { const q = path.getPointAtLength(c.f * L); return { x: q.x, y: q.y }; }));
    sample(scrollYProgress.get());
  }, [sample, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", sample);

  return (
    <section ref={ref} className="relative bg-ink" style={{ height: reduce ? "auto" : "360vh" }} data-testid="passport-flight">
      <div className={`${reduce ? "" : "sticky top-0"} h-[100svh] overflow-hidden`}>
        <motion.div style={reduce ? undefined : { y: textY }} className="absolute z-10 top-[13%] left-0 right-0 px-6 sm:px-10">
          <div className="mx-auto max-w-[1200px] text-center">
            <Reveal><p className="eyebrow mb-3">Your passport journey</p></Reveal>
            <Reveal><h2 className="font-display text-4xl sm:text-6xl text-amber leading-[0.95]">Every visit, a new stamp.</h2></Reveal>
            <Reveal><p className="text-smoke mt-4 max-w-md mx-auto">Scroll to fly the route and collect your stamps.</p></Reveal>
          </div>
        </motion.div>

        <svg viewBox="0 0 1000 620" className="w-full h-full" preserveAspectRatio={par} aria-hidden="true">
          <defs>
            <radialGradient id="pf-glow" cx="0.72" cy="0.78" r="0.6">
              <stop offset="0" stopColor="rgba(255,170,45,0.5)" />
              <stop offset="1" stopColor="rgba(255,170,45,0)" />
            </radialGradient>
            <linearGradient id="pf-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a0a0a" />
              <stop offset="0.7" stopColor="#12100c" />
              <stop offset="1" stopColor="#1c150b" />
            </linearGradient>
            <filter id="pf-soft"><feGaussianBlur stdDeviation="2.5" /></filter>
            {/* Rubber-stamp ink distress: roughens edges so seals read hand-pressed */}
            <filter id="pf-ink" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="620" fill="url(#pf-sky)" />
          <motion.ellipse cx="770" cy="470" rx="360" ry="150" fill="url(#pf-glow)" style={{ opacity: reduce ? 0.6 : glow }} />

          {/* full planned route (faint dotted) — also the geometry we sample */}
          <path ref={pathRef} d={ROUTE} fill="none" stroke="rgba(233,183,85,0.16)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0.1 14" />
          {/* travelled trail (bright dotted, grows with scroll) */}
          <motion.path d={reduce ? ROUTE : traveledD} fill="none" stroke="rgba(240,198,110,0.22)" strokeWidth="6.5" strokeLinecap="round" filter="url(#pf-soft)" />
          <motion.path d={reduce ? ROUTE : traveledD} fill="none" stroke="#e8b755" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 15" />

          {/* checkpoints */}
          {points.map((pt, i) => (
            <Checkpoint key={i} progress={scrollYProgress} cp={CHECKPOINTS[i]} pt={pt} isStatic={reduce} />
          ))}

          {/* plane + sparkle trail */}
          <motion.g transform={reduce ? "translate(780 470) rotate(20) scale(1.3)" : planeT}>
            {!reduce && (
              <motion.g style={{ opacity: speed }}>
                <g stroke="rgba(240,198,110,0.5)" strokeWidth="2" strokeLinecap="round">
                  <line x1="-34" y1="-5" x2="-74" y2="-5" />
                  <line x1="-34" y1="0" x2="-86" y2="0" />
                  <line x1="-34" y1="5" x2="-70" y2="5" />
                </g>
                <g fill="#ffe6a6">
                  <circle className="pf-sparkle" cx="-48" cy="-8" r="1.7" />
                  <circle className="pf-sparkle" cx="-64" cy="6" r="1.3" style={{ animationDelay: "0.3s" }} />
                  <circle className="pf-sparkle" cx="-40" cy="9" r="1.5" style={{ animationDelay: "0.6s" }} />
                  <circle className="pf-sparkle" cx="-78" cy="-3" r="1.2" style={{ animationDelay: "0.9s" }} />
                </g>
              </motion.g>
            )}
            {planeImg ? (
              <image href={planeImg} x="-90" y="-70" width="180" height="140" preserveAspectRatio="xMidYMid meet"
                style={{ filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.55))" }} />
            ) : (
              <Plane />
            )}
          </motion.g>
        </svg>

        {/* Arrival — WELCOME TO COZYBOX passport stamp */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6"
          initial={false}
          animate={landed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative grid place-items-center h-[300px] w-[300px] sm:h-[360px] sm:w-[360px]
              drop-shadow-[0_0_28px_rgba(233,183,85,0.22)]"
            initial={false}
            animate={landed ? { scale: 1, rotate: -7, opacity: 1 } : { scale: 1.5, rotate: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
          >
            <CozyStamp />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
