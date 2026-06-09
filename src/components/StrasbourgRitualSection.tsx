"use client";

import { motion } from "framer-motion";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";

export function StrasbourgRitualSection() {
  return (
    <motion.section
      className="grid min-h-screen overflow-hidden bg-cacao text-bone lg:grid-cols-2"
      initial={{ y: 120 }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.18, once: false }}
    >
      <motion.div
        className="relative min-h-[58vh] overflow-hidden lg:min-h-screen"
        initial={{ x: "-10%", opacity: 0.75 }}
        whileInView={{ x: "0%", opacity: 1 }}
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
          src="/assets/flams/table-partage.png"
          tone="from-wine via-cacao to-ember"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,13,.1),rgba(17,16,13,.5))]" />
      </motion.div>
      <motion.div
        className="flex flex-col justify-center px-5 py-28 md:px-10 lg:px-16 lg:pt-40"
        initial={{ x: "12%", opacity: 0 }}
        whileInView={{ x: "0%", opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.22, once: false }}
      >
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
          Le rituel
        </p>
        <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
          Grande faim, grande table, zero chichi.
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-8 text-bone/70">
          Strasbourg, c'est notre point de depart imaginaire : une pate fine,
          des bords qui chantent, une planche au milieu et personne qui compte
          vraiment les parts. Le service va droit au but, la salle reste chaude,
          et le feu se devine plus qu'il ne se montre.
        </p>
        <div className="mt-10 grid gap-5 text-sm font-black uppercase tracking-[0.14em] text-bone/65 sm:grid-cols-3">
          <span className="border-t border-bone/20 pt-4">Midi vif</span>
          <span className="border-t border-bone/20 pt-4">Soir bruyant</span>
          <span className="border-t border-bone/20 pt-4">Tables a partager</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
