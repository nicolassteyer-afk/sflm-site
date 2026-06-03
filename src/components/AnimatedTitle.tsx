"use client";

import { motion } from "framer-motion";

type AnimatedTitleProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function AnimatedTitle({
  text,
  as = "h1",
  className = "",
}: AnimatedTitleProps) {
  const Tag = as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : motion.h1;
  const words = text.split(" ");

  return (
    <Tag className={`mask-title font-display uppercase leading-[0.84] ${className}`}>
      {words.map((word, index) => (
        <span className="mr-[0.18em] inline-block overflow-hidden" key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 3 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: 0.8,
              delay: index * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
