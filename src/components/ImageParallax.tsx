"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { VisualPlaceholder } from "./VisualPlaceholder";

type ImageParallaxProps = {
  label: string;
  tone?: string;
  className?: string;
  src?: string;
  alt?: string;
  imageClassName?: string;
};

export function ImageParallax({
  label,
  tone,
  className = "",
  src,
  alt,
  imageClassName,
}: ImageParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <div className={`overflow-hidden ${className}`} ref={ref}>
      <motion.div style={{ y, scale }}>
        <VisualPlaceholder
          alt={alt}
          imageClassName={imageClassName}
          label={label}
          src={src}
          tone={tone}
          className="min-h-[inherit]"
        />
      </motion.div>
    </div>
  );
}
