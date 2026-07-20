"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type TimelineEntry = {
  title: string;
  content: ReactNode;
};

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      const rect = ref.current?.getBoundingClientRect();
      setHeight(rect?.height ?? 0);
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "58%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 0.38, 0.38, 0]);

  return (
    <section
      className="relative w-full overflow-hidden bg-ink px-5 py-24 text-bone md:px-10 lg:px-16"
      ref={containerRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-wine/70 to-transparent"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-saffron/20 blur-3xl"
        style={{ opacity: glowOpacity, y: glowY }}
      />
      <div className="relative z-10 mx-auto max-w-7xl pb-10">
        <div className="grid gap-8 lg:grid-cols-[.95fr_1fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
              Frise chronologique
            </p>
            <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl lg:text-[11rem]">
              De 1989 a 2025.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-bone/62">
            Les etapes de l'enseigne, dans l'ordre chronologique de la page
            d'origine : creation, premieres ouvertures, nouvelle identite et
            modernisation de la carte.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pb-20" ref={ref}>
        {data.map((item, index) => (
          <TimelineItem
            index={index}
            item={item}
            key={`${item.title}-${index}`}
          />
        ))}

        <div
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-bone/18 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
          style={{ height: `${height}px` }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-saffron via-ember to-transparent from-[0%] via-[10%]"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, index }: { item: TimelineEntry; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 75%", "end 35%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  const cardOpacity = useTransform(smoothProgress, [0, 0.22, 0.86, 1], [0.28, 1, 1, 0.55]);
  const cardX = useTransform(smoothProgress, [0, 0.35, 1], [34, 0, -8]);
  const cardY = useTransform(smoothProgress, [0, 0.35, 1], [36, 0, -18]);
  const cardScale = useTransform(smoothProgress, [0, 0.35, 0.82, 1], [0.94, 1, 1, 0.98]);
  const yearScale = useTransform(smoothProgress, [0, 0.28, 0.72, 1], [0.88, 1.08, 1.02, 0.92]);
  const yearOpacity = useTransform(smoothProgress, [0, 0.2, 0.85, 1], [0.22, 1, 0.86, 0.34]);
  const dotScale = useTransform(smoothProgress, [0, 0.28, 0.5, 1], [0.72, 1.35, 1, 0.78]);
  const haloScale = useTransform(smoothProgress, [0, 0.32, 1], [0.55, 1.5, 0.8]);
  const haloOpacity = useTransform(smoothProgress, [0, 0.28, 0.7, 1], [0, 0.42, 0.18, 0]);
  const progressWidth = useTransform(smoothProgress, [0, 0.45, 1], ["0%", "100%", "100%"]);

  return (
    <div
      className="group flex justify-start pt-12 md:gap-10 md:pt-40"
      ref={itemRef}
    >
      <div className="sticky top-32 z-20 flex max-w-xs flex-col items-center self-start md:w-full md:max-w-sm md:flex-row lg:top-40">
        <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink md:left-3">
          <motion.div
            aria-hidden="true"
            className="absolute h-10 w-10 rounded-full bg-saffron/25 blur-sm"
            style={{ opacity: haloOpacity, scale: haloScale }}
          />
          <motion.div
            className="relative h-4 w-4 rounded-full border border-saffron/80 bg-saffron p-2 shadow-[0_0_0_0.7rem_rgba(248,175,7,0.12)]"
            style={{ scale: dotScale }}
          />
        </div>
        <motion.h3
          className="hidden pl-20 font-display text-5xl uppercase leading-none text-bone/38 md:block lg:text-7xl"
          style={{ opacity: yearOpacity, scale: yearScale, transformOrigin: "left center" }}
        >
          {item.title}
        </motion.h3>
      </div>

      <div className="relative w-full pl-20 pr-0 md:pl-4">
        <motion.h3
          className="mb-5 block font-display text-6xl uppercase leading-none text-saffron md:hidden"
          style={{ opacity: yearOpacity, scale: yearScale, transformOrigin: "left center" }}
        >
          {item.title}
        </motion.h3>
        <motion.div
          className="relative"
          style={{
            opacity: cardOpacity,
            scale: cardScale,
            x: cardX,
            y: cardY,
          }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute -inset-4 rounded-sm bg-saffron/10 blur-2xl"
            style={{ opacity: haloOpacity }}
          />
          <div className="relative">{item.content}</div>
          <div className="mt-5 h-px w-full overflow-hidden bg-bone/10">
            <motion.div
              className="h-full bg-gradient-to-r from-saffron via-bone/70 to-transparent"
              style={{ width: progressWidth }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
