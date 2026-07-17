"use client";

import {
  motion,
  useScroll,
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

  return (
    <section
      className="relative w-full overflow-hidden bg-ink px-5 py-24 text-bone md:px-10 lg:px-16"
      ref={containerRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-wine/70 to-transparent"
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
          <div
            className="flex justify-start pt-12 md:gap-10 md:pt-40"
            key={`${item.title}-${index}`}
          >
            <div className="sticky top-32 z-20 flex max-w-xs flex-col items-center self-start md:w-full md:max-w-sm md:flex-row lg:top-40">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink md:left-3">
                <div className="h-4 w-4 rounded-full border border-saffron/70 bg-saffron p-2 shadow-[0_0_0_0.7rem_rgba(248,175,7,0.12)]" />
              </div>
              <h3 className="hidden pl-20 font-display text-5xl uppercase leading-none text-bone/38 md:block lg:text-7xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-20 pr-0 md:pl-4">
              <h3 className="mb-5 block font-display text-6xl uppercase leading-none text-saffron md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
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
