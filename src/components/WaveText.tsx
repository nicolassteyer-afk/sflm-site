"use client";

import { motion } from "framer-motion";

type WaveTextProps = {
  text: string;
  className?: string;
};

export function WaveText({ text, className = "" }: WaveTextProps) {
  return (
    <motion.p
      className={`bg-[linear-gradient(90deg,#2a1511_0%,#65131a_28%,#f8af07_48%,#f8af07_58%,#65131a_72%,#2a1511_100%)] bg-[length:240%_100%] bg-clip-text text-transparent ${className}`}
      initial={{ backgroundPosition: "0% 50%" }}
      whileInView={{ backgroundPosition: "100% 50%" }}
      viewport={{ amount: 0.55, once: false }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.p>
  );
}
