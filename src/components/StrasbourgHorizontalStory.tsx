"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VariableProximity } from "@/components/VariableProximity";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";

const panels = [
  {
    eyebrow: "La table",
    title: "On pose les planches, tout le monde attaque.",
    text: "Une flamme au centre, des verres qui passent de main en main, et ce petit bruit de salle qui annonce que la soiree commence vraiment.",
    image: "/assets/flams/tfmainspartage.png",
  },
  {
    eyebrow: "Le feu",
    title: "Croustillant dehors, ultra vivant dedans.",
    text: "La flammekueche arrive fine, chaude, directe. Pas besoin d'en faire trop : quand c'est bon, la table comprend tout de suite.",
    image: "/assets/flams/tfmain.png",
  },
  {
    eyebrow: "Les copains",
    title: "Un service rapide, une salle qui reste chaude.",
    text: "Flam's Strasbourg, c'est le spot simple et genereux pour dejeuner vite, diner longtemps, ou transformer un verre en vraie tablee.",
    image: "/assets/flams/banquetvinrouge.png",
  },
];

export function StrasbourgHorizontalStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  return (
    <section
      className="relative h-[300vh] bg-bone text-cacao"
      ref={sectionRef}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          className="flex h-full w-[300vw]"
          style={{ x }}
        >
          {panels.map((panel, index) => (
            <article
              className="grid h-screen w-screen shrink-0 overflow-hidden lg:grid-cols-[0.92fr_1.08fr]"
              key={panel.title}
            >
              <div className="relative min-h-[44vh] overflow-hidden bg-cacao lg:min-h-screen">
                <VisualPlaceholder
                  alt={panel.title}
                  className="absolute inset-0 min-h-full rounded-none"
                  clipped={false}
                  imageClassName="scale-110 opacity-90"
                  label={panel.eyebrow}
                  showLabel={false}
                  src={panel.image}
                  tone="from-wine via-cacao to-ember"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.18),rgba(42,21,17,.42))]" />
              </div>

              <div className="flex min-h-[56vh] flex-col justify-center px-5 py-16 md:px-10 lg:min-h-screen lg:px-16">
                <motion.p
                  className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-ember"
                  initial={{ y: 18, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  viewport={{ amount: 0.5, once: false }}
                >
                  0{index + 1} / {panel.eyebrow}
                </motion.p>
                <motion.div
                  className="max-w-4xl"
                  initial={{ y: 42, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ amount: 0.45, once: false }}
                >
                  <VariableProximity
                    className="text-5xl font-black uppercase leading-[0.92] md:text-6xl xl:text-7xl"
                    label={panel.title}
                    radius={170}
                  />
                </motion.div>
                <motion.p
                  className="mt-8 max-w-xl text-lg leading-8 text-cacao/70"
                  initial={{ y: 26, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ amount: 0.45, once: false }}
                >
                  {panel.text}
                </motion.p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
