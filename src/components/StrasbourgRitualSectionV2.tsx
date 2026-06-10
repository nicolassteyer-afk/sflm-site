"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";

const flamePatternSrc =
  "/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-FLAMME-BEIGE.svg";

const ritualIcons = [
  {
    alt: "Biere Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-BIERE-BEIGE.svg",
  },
  {
    alt: "Flamme Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-FLAMME-BEIGE.svg",
  },
  {
    alt: "Fut Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-FUT-BEIGE.svg",
  },
  {
    alt: "Planche Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-PLANCHE-BEIGE.svg",
  },
  {
    alt: "Vin Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-VIN-BEIGE.svg",
  },
];

export function StrasbourgRitualSectionV2() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start 80%", "end 18%"],
  });
  const wallpaperOpacity = useTransform(
    scrollYProgress,
    [0, 0.46, 0.6, 1],
    [0, 0, 0.14, 0.3],
  );
  const wallpaperY = useTransform(scrollYProgress, [0, 0.46, 1], ["104%", "104%", "-10%"]);
  const wallpaperScale = useTransform(scrollYProgress, [0.48, 1], [1.1, 1]);

  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-cacao text-bone">
      <motion.div
        className="grid min-h-screen lg:grid-cols-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.12, once: false }}
      >
        <motion.div
          className="relative min-h-[58vh] overflow-hidden lg:min-h-screen"
          ref={imageRef}
          initial={{ opacity: 0.82 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.18, once: false }}
        >
          <VisualPlaceholder
            alt="Table Flam's Strasbourg"
            className="absolute inset-0 min-h-full rounded-none"
            clipped={false}
            imageClassName="scale-105 opacity-95"
            label="table Flam's"
            showLabel={false}
            src="/assets/flams/shootingf%C3%A9vrier2026-4.webp"
            tone="from-wine via-cacao to-ember"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,13,.1),rgba(17,16,13,.5))]" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-[-10%] bottom-[-10%] top-0 z-10"
            style={{
              opacity: wallpaperOpacity,
              scale: wallpaperScale,
              y: wallpaperY,
            }}
          >
            <div
              className="absolute inset-0 bg-repeat"
              style={{
                backgroundImage: `url("${flamePatternSrc}")`,
                backgroundSize: "clamp(190px, 19vw, 310px) clamp(190px, 19vw, 310px)",
              }}
            />
            <div
              className="absolute inset-0 bg-repeat"
              style={{
                backgroundImage: `url("${flamePatternSrc}")`,
                backgroundSize: "clamp(190px, 19vw, 310px) clamp(190px, 19vw, 310px)",
                transform: "translate(clamp(95px, 9.5vw, 155px), clamp(95px, 9.5vw, 155px))",
              }}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="relative flex flex-col justify-center px-5 py-28 md:px-10 lg:px-16 lg:pt-40"
          initial={{ x: "10vw", opacity: 0 }}
          whileInView={{ x: "0vw", opacity: 1 }}
          transition={{ duration: 0.95, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.22, once: false }}
        >
          <motion.div
            aria-hidden="true"
            className="mb-10 flex flex-wrap items-center gap-4 md:gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.45, once: false }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09 } },
            }}
          >
            {ritualIcons.map((icon, index) => (
              <motion.div
                className="h-14 w-14 md:h-20 md:w-20"
                key={icon.src}
                variants={{
                  hidden: { y: 28, opacity: 0, rotate: -8 },
                  show: {
                    y: 0,
                    opacity: 1,
                    rotate: index % 2 === 0 ? -3 : 3,
                    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{ y: -8, rotate: 0, scale: 1.08 }}
              >
                <motion.img
                  alt={icon.alt}
                  className="h-full w-full object-contain"
                  draggable={false}
                  src={icon.src}
                  animate={{
                    y: [0, -6, 0],
                    transition: {
                      duration: 3.2 + index * 0.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.12,
                    },
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
            Le rituel
          </p>
          <motion.h2
            className="font-display text-7xl uppercase leading-[0.86] md:text-9xl"
            initial={{ y: 44, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.45, once: false }}
          >
            Grande faim, grande table, zero chichi.
          </motion.h2>
          <motion.p
            className="mt-8 max-w-xl text-lg leading-8 text-bone/70"
            initial={{ y: 28, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.45, once: false }}
          >
            Strasbourg, c'est notre point de depart imaginaire : une pate fine,
            des bords qui chantent, une planche au milieu et personne qui compte
            vraiment les parts. Le service va droit au but, la salle reste chaude,
            et le feu se devine plus qu'il ne se montre.
          </motion.p>
          <motion.div
            className="mt-10 grid gap-5 text-sm font-black uppercase tracking-[0.14em] text-bone/65 sm:grid-cols-3"
            initial={{ y: 26, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.45, once: false }}
          >
            <span className="border-t border-bone/20 pt-4">Midi vif</span>
            <span className="border-t border-bone/20 pt-4">Soir bruyant</span>
            <span className="border-t border-bone/20 pt-4">Tables a partager</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
