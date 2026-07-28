import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";
import GlowButton from "./GlowButton";
import Particles from "./Particles";

/**
 * PourScene — a pinned, scroll-scrubbed whiskey pour. The bottle leans in over
 * the glass, its level drops as an amber stream fills the tumbler (ice, bubbles,
 * sloshing surface, splash, droplets). Pure SVG/CSS; static filled glass under
 * reduced-motion.
 *
 * Geometry (viewBox 0 0 420 520): bottle pivots about (150,210) and also slides
 * toward the glass while pouring. Mouth (local 0,-114) world position accounts
 * for both the rotation and the translate. Glass fills y=298 → 414.
 */
const GTOP = 298;
const GBOT = 414;
const GH = GBOT - GTOP;
// bottle interior liquid range (local coords, upright)
const BLIQ_TOP = 190;
const BLIQ_BASE = 302;
const BLIQ_H = BLIQ_BASE - BLIQ_TOP;

function Scene({ bottleTransform, liqY, liqH, streamOpacity, mouthX, mouthY, fill, iceShift, iceOpacity, bLiqY, bLiqH, glow, isStatic, bottleImage }) {
  return (
    <svg viewBox="0 0 420 520" className="w-full h-full max-h-[76vh]" aria-hidden="true">
      <defs>
        <linearGradient id="glass-bottle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3c2812" />
          <stop offset="0.45" stopColor="#6b4423" />
          <stop offset="0.58" stopColor="#c98a3a" />
          <stop offset="0.7" stopColor="#6b4423" />
          <stop offset="1" stopColor="#2a1a0c" />
        </linearGradient>
        <linearGradient id="whisky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8a94e" />
          <stop offset="1" stopColor="#a85e18" />
        </linearGradient>
        <linearGradient id="stream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0bd6a" />
          <stop offset="1" stopColor="#c9781f" />
        </linearGradient>
        <radialGradient id="floorglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(255,159,28,0.4)" />
          <stop offset="1" stopColor="rgba(255,159,28,0)" />
        </radialGradient>
        {/* round-glass cylinder shading (semi-transparent, laid over the liquid) */}
        <linearGradient id="bottle-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(18,11,5,0.92)" />
          <stop offset="0.13" stopColor="rgba(60,40,22,0.72)" />
          <stop offset="0.34" stopColor="rgba(150,110,60,0.4)" />
          <stop offset="0.5" stopColor="rgba(235,200,140,0.5)" />
          <stop offset="0.66" stopColor="rgba(150,110,60,0.4)" />
          <stop offset="0.87" stopColor="rgba(60,40,22,0.72)" />
          <stop offset="1" stopColor="rgba(18,11,5,0.95)" />
        </linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0e0906" />
          <stop offset="0.5" stopColor="#39281a" />
          <stop offset="1" stopColor="#0e0906" />
        </linearGradient>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b4a16" />
          <stop offset="0.28" stopColor="#e9c66a" />
          <stop offset="0.55" stopColor="#b78a34" />
          <stop offset="1" stopColor="#5a3d12" />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="0.6" /></filter>
        <filter id="bshadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        <clipPath id="glass-inner">
          <path d="M221,296 L221,406 Q221,415 230,415 L270,415 Q279,415 279,406 L279,296 Z" />
        </clipPath>
        <clipPath id="bottle-inner">
          <path d="M131,300 L131,208 C131,195 137,184 146,174 L146,128 L154,128 L154,174 C163,184 169,195 169,208 L169,300 C169,305 166,307 161,307 L139,307 C134,307 131,305 131,300 Z" />
        </clipPath>
      </defs>

      {/* ambient floor glow + reflection */}
      <motion.ellipse cx="250" cy="432" rx="120" ry="26" fill="url(#floorglow)" style={{ opacity: glow }} />
      <motion.ellipse cx="250" cy="440" rx="40" ry="8" fill="url(#whisky)" style={{ opacity: isStatic ? 0.18 : glow }} />

      {/* ── Glass ── */}
      <path d="M214,290 L214,406 Q214,422 230,422 L270,422 Q286,422 286,406 L286,290 Z"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* whisky in the glass */}
      <motion.rect x="214" width="72" y={liqY} height={liqH} fill="url(#whisky)" clipPath="url(#glass-inner)" />

      {/* ice cubes floating at the surface */}
      <motion.g clipPath="url(#glass-inner)" style={{ y: iceShift, opacity: iceOpacity }}>
        <g className={isStatic ? "" : "pour-ice"}>
          <rect x="236" y="300" width="16" height="14" rx="2.5" fill="rgba(214,236,255,0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
          <path d="M239,303 L248,303 M239,303 L237,311" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" fill="none" />
        </g>
        <g className={isStatic ? "" : "pour-ice-b"}>
          <rect x="252" y="305" width="13" height="12" rx="2.5" fill="rgba(214,236,255,0.34)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <path d="M255,308 L262,308" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" fill="none" />
        </g>
      </motion.g>

      {/* rising bubbles */}
      <motion.g clipPath="url(#glass-inner)" style={{ opacity: fill }}>
        <circle className="pour-bubble" cx="240" cy="408" r="2" fill="#ffe1ad" style={{ animationDuration: "3.4s" }} />
        <circle className="pour-bubble" cx="256" cy="410" r="1.5" fill="#ffe1ad" style={{ animationDuration: "4.1s", animationDelay: "0.9s" }} />
        <circle className="pour-bubble" cx="262" cy="406" r="2.2" fill="#ffe1ad" style={{ animationDuration: "3.8s", animationDelay: "1.8s" }} />
      </motion.g>

      {/* sloshing surface */}
      <motion.ellipse className={isStatic ? "" : "pour-surface"} cx="250" cy={liqY} rx="29" ry="4.5" fill="#f2c074" opacity="0.95" clipPath="url(#glass-inner)" />

      {/* rim + glass highlight */}
      <ellipse cx="250" cy="290" rx="36" ry="6" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" />
      <rect x="224" y="298" width="4" height="112" rx="2" fill="rgba(255,255,255,0.18)" />

      {/* ── Stream + splash + droplets (pour only) ── */}
      {!isStatic && (
        <>
          <motion.line className="pour-stream" x1={mouthX} y1={mouthY} x2={250} y2={300}
            stroke="url(#stream)" strokeWidth="4.5" strokeLinecap="round" filter="url(#soft)"
            style={{ opacity: streamOpacity }} />
          <motion.g style={{ opacity: streamOpacity }}>
            <ellipse className="pour-splash" cx="250" cy="300" rx="8" ry="3" fill="none" stroke="#f0c07a" strokeWidth="1.5" />
            <ellipse className="pour-splash" cx="250" cy="300" rx="8" ry="3" fill="none" stroke="#f0c07a" strokeWidth="1.5" style={{ animationDelay: "0.55s" }} />
            <circle className="pour-drip" cx="249" cy="278" r="2" fill="#f0bd6a" style={{ animationDuration: "0.8s" }} />
            <circle className="pour-drip" cx="252" cy="284" r="1.6" fill="#f0bd6a" style={{ animationDuration: "0.95s", animationDelay: "0.4s" }} />
          </motion.g>
        </>
      )}

      {/* ── Real bottle photo (transparent PNG) when provided ── */}
      {bottleImage && (
        <motion.image href={bottleImage} x="104" y="86" width="92" height="240"
          preserveAspectRatio="xMidYMid meet" transform={bottleTransform}
          style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.55))" }} />
      )}

      {/* ── SVG bottle fallback (always leaning over the glass; level drops) ── */}
      {!bottleImage && (
      <motion.g transform={bottleTransform}>
        {/* soft contact shadow under the bottle */}
        <ellipse cx="150" cy="312" rx="30" ry="7" fill="rgba(0,0,0,0.5)" filter="url(#bshadow)" />

        {/* empty-glass interior (dark) */}
        <path d="M126,300 L126,206 C126,192 133,180 143,170 L143,124 L157,124 L157,170 C167,180 174,192 174,206 L174,300 C174,307 169,310 162,310 L138,310 C131,310 126,307 126,300 Z"
          fill="#160d06" />
        {/* whisky inside — level drops (clipped to interior) */}
        <motion.rect x="126" width="48" y={bLiqY} height={bLiqH} fill="url(#whisky)" clipPath="url(#bottle-inner)" />
        {/* round-glass cylinder shading over everything for a real glass look */}
        <path d="M126,300 L126,206 C126,192 133,180 143,170 L143,124 L157,124 L157,170 C167,180 174,192 174,206 L174,300 C174,307 169,310 162,310 L138,310 C131,310 126,307 126,300 Z"
          fill="url(#bottle-glass)" />
        {/* glass outline + right-edge rim light */}
        <path d="M126,300 L126,206 C126,192 133,180 143,170 L143,124 L157,124 L157,170 C167,180 174,192 174,206 L174,300 C174,307 169,310 162,310 L138,310 C131,310 126,307 126,300 Z"
          fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.2" />
        <path d="M172,210 L172,296" stroke="rgba(255,240,210,0.5)" strokeWidth="1.4" strokeLinecap="round" />
        {/* specular highlight */}
        <path d="M135,186 C132,210 132,260 136,292" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* neck glass */}
        <rect x="143" y="128" width="14" height="44" fill="url(#bottle-glass)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
        {/* gold foil sleeve over the neck */}
        <path d="M141,120 L159,120 L159,149 Q150,153 141,149 Z" fill="url(#foil)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
        <rect x="141.6" y="121" width="3" height="27" fill="rgba(255,255,255,0.3)" />
        {/* wax-dipped cap */}
        <path d="M139,107 Q150,102 161,107 L161,120 Q150,124 139,120 Z" fill="url(#cap)" stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" />
        <ellipse cx="150" cy="106.5" rx="11" ry="3.4" fill="#463019" />
        <ellipse cx="150" cy="106" rx="6" ry="1.6" fill="rgba(255,255,255,0.2)" />

        {/* label — premium parchment */}
        <rect x="127" y="216" width="46" height="58" rx="5" fill="#f4e9d2" opacity="0.97" />
        <rect x="127" y="216" width="46" height="58" rx="5" fill="none" stroke="rgba(120,80,30,0.4)" strokeWidth="0.9" />
        <rect x="130.5" y="219.5" width="39" height="51" rx="3.5" fill="none" stroke="rgba(180,140,70,0.55)" strokeWidth="0.6" />
        {/* emblem — a single amber drop */}
        <circle cx="150" cy="230" r="6" fill="none" stroke="#b07d2e" strokeWidth="0.9" />
        <path d="M150,226.6 Q153,230 150,233.4 Q147,230 150,226.6 Z" fill="#b07d2e" />
        <text x="150" y="246" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="6.4" letterSpacing="1.9" fill="#6b4423">FOSSEY'S</text>
        <line x1="135" y1="250" x2="165" y2="250" stroke="#c9a15a" strokeWidth="0.8" />
        <text x="150" y="261" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="9.5" fill="#3a2410">Single Malt</text>
        <text x="150" y="269" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="3.6" letterSpacing="1.3" fill="#8a6a3a">AUS · EST 2023</text>
      </motion.g>
      )}
    </svg>
  );
}

export default function PourScene({
  eyebrow = "Our Single Malt",
  title = "Poured by hand.",
  sub = "Every drop of our Single Malt is distilled, aged and bottled at 209 Lygon Street. Pour yourself a dram, then take a bottle home.",
  ctaLabel = "Shop the Whisky",
  ctaTo = "/shop",
  ctaHref,
  ctaOnClick,
  bottleImage = "/img/bottle_whisky.png",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Use the real bottle PNG only if it actually exists; otherwise the SVG bottle.
  const [imgSrc, setImgSrc] = useState(null);
  useEffect(() => {
    if (!bottleImage) return;
    const img = new Image();
    img.onload = () => setImgSrc(bottleImage);
    img.onerror = () => setImgSrc(null);
    img.src = bottleImage;
  }, [bottleImage]);

  // bottle is ALWAYS tilted over the glass; it dips further to pour, then eases back
  const angle = useTransform(scrollYProgress, [0.05, 0.34, 0.7, 0.95], [104, 127, 127, 104]);
  const tx = useTransform(scrollYProgress, [0.05, 0.34, 0.7, 0.95], [0, 8, 8, 0]);
  const ty = useTransform(scrollYProgress, [0.05, 0.34, 0.7, 0.95], [0, 6, 6, 0]);
  const bottleT = useTransform([tx, ty, angle], ([x, y, a]) => `translate(${x} ${y}) rotate(${a} 150 210)`);
  const mouthX = useTransform([angle, tx], ([a, x]) => 150 + 114 * Math.sin((a * Math.PI) / 180) + x);
  const mouthY = useTransform([angle, ty], ([a, y]) => 210 - 114 * Math.cos((a * Math.PI) / 180) + y);

  // glass fills up; bottle level drops
  const fill = useTransform(scrollYProgress, [0.34, 0.7], [0, 1]);
  const liqH = useTransform(fill, (f) => GH * f);
  const liqY = useTransform(fill, (f) => GBOT - GH * f);
  const bLiqH = useTransform(fill, (f) => BLIQ_H * (1 - f * 0.72));
  const bLiqY = useTransform(fill, (f) => BLIQ_BASE - BLIQ_H * (1 - f * 0.72));
  const iceShift = useTransform(fill, (f) => (GBOT - GH * f) - 308);
  const iceOpacity = useTransform(fill, [0.2, 0.45], [0, 1]);
  const glow = useTransform(fill, [0, 1], [0.12, 0.6]);
  const streamOpacity = useTransform(scrollYProgress, [0.32, 0.38, 0.64, 0.7], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={ref} className="pour-blend relative bg-ink" style={{ height: reduce ? "auto" : "230vh" }} data-testid="pour-scene">
      <div className={`${reduce ? "" : "sticky top-0"} h-screen overflow-hidden flex items-center`}>
        <Particles density={0.5} className="opacity-40" />
        <div className="hero-aurora absolute inset-0 mix-blend-screen opacity-40" />

        <div className="relative mx-auto max-w-[1400px] w-full px-6 sm:px-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Copy */}
          <motion.div style={reduce ? undefined : { y: textY }} className="order-2 lg:order-1 text-center lg:text-left">
            <Reveal><p className="eyebrow mb-4">{eyebrow}</p></Reveal>
            <SplitReveal as="h2" text={title} className="neon-text text-4xl sm:text-6xl mb-6 justify-center lg:justify-start flex flex-wrap" />
            <Reveal>
              <p className="text-smoke text-lg max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">{sub}</p>
            </Reveal>
            <Reveal>
              <GlowButton to={ctaHref || ctaOnClick ? undefined : ctaTo} href={ctaHref} onClick={ctaOnClick} data-testid="pour-shop-cta">{ctaLabel}</GlowButton>
            </Reveal>
          </motion.div>

          {/* The pour */}
          <div className="order-1 lg:order-2 h-[54vh] lg:h-[82vh] flex items-center justify-center">
            {reduce ? (
              <Scene isStatic bottleImage={imgSrc} bottleTransform="rotate(112 150 210)" liqY={GTOP + 6} liqH={GH - 6} streamOpacity={0}
                mouthX={150} mouthY={96} fill={1} iceShift={GTOP - 302} iceOpacity={1} bLiqY={BLIQ_TOP + 34} bLiqH={BLIQ_H - 34} glow={0.4} />
            ) : (
              <Scene bottleImage={imgSrc} bottleTransform={bottleT} liqY={liqY} liqH={liqH} streamOpacity={streamOpacity} mouthX={mouthX} mouthY={mouthY}
                fill={fill} iceShift={iceShift} iceOpacity={iceOpacity} bLiqY={bLiqY} bLiqH={bLiqH} glow={glow} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
