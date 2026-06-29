import { motion } from "framer-motion";
import { fadeUp, viewport } from "../lib/motion";

// Drop-in scroll reveal wrapper.
export default function Reveal({ children, variants = fadeUp, className = "", as = "div", ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}
