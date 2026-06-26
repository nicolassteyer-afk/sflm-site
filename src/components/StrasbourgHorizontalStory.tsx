"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { HorizontalDragon } from "@/components/HorizontalDragon";

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
  const pathname = usePathname();
  const showRueDesFreresInfo = pathname?.includes("/restaurants/strasbourg/rue-des-freres");
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
              {showRueDesFreresInfo && index === 0 ? (
                <RueDesFreresMap />
              ) : (
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
              )}

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
                <motion.h2
                  className="font-display max-w-4xl text-5xl uppercase leading-[0.92] md:text-6xl xl:text-7xl"
                  initial={{ y: 42, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ amount: 0.45, once: false }}
                >
                  {panel.title}
                </motion.h2>
                <motion.p
                  className="mt-8 max-w-xl text-lg leading-8 text-cacao/70"
                  initial={{ y: 26, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ amount: 0.45, once: false }}
                >
                  {panel.text}
                </motion.p>
                {showRueDesFreresInfo && index === 0 ? (
                  <motion.div
                    className="mt-8 max-w-2xl border-t border-cacao/15 pt-6"
                    initial={{ y: 26, opacity: 0 }}
                    transition={{ duration: 0.68, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ amount: 0.45, once: false }}
                    whileInView={{ y: 0, opacity: 1 }}
                  >
                    <RueDesFreresDetails />
                  </motion.div>
                ) : null}
              </div>
            </article>
          ))}
        </motion.div>
        {showRueDesFreresInfo ? null : <HorizontalDragon />}
      </div>
    </section>
  );
}

function RueDesFreresMap() {
  const mapQuery = encodeURIComponent("29 rue des Freres, 67000 Strasbourg");

  return (
    <div className="relative min-h-[44vh] overflow-hidden bg-cacao lg:min-h-screen">
      <iframe
        aria-label="Carte Flam's Rue des Freres"
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
        title="Carte Flam's Rue des Freres"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.08),rgba(42,21,17,.22))]" />
      <a
        className="absolute bottom-8 left-8 bg-bone px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-cacao shadow-soft transition hover:bg-saffron"
        href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
        rel="noreferrer"
        target="_blank"
      >
        Itineraire
      </a>
    </div>
  );
}

function RueDesFreresDetails() {
  return (
    <div>
      <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-ember">Horaires</p>
      <dl className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-cacao/75 sm:grid-cols-[7rem_1fr]">
        {rueDesFreresHours.map((hour) => (
          <div className="contents" key={hour.day}>
            <dt>{hour.day}</dt>
            <dd className="text-cacao">{hour.time}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-ember">Telephone</p>
        <a className="text-xl font-black text-cacao transition hover:text-ember" href="tel:0388363690">
          03 88 36 36 90
        </a>
      </div>
    </div>
  );
}

const rueDesFreresHours = [
  { day: "mercredi", time: "11:30-23:00" },
  { day: "jeudi", time: "11:30-23:00" },
  { day: "vendredi", time: "11:30-00:00" },
  { day: "samedi", time: "11:30-00:00" },
  { day: "dimanche", time: "11:30-23:00" },
  { day: "lundi", time: "11:30-23:00" },
  { day: "mardi", time: "11:30-23:00" },
];
