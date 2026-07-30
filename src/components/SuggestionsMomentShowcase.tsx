"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import cookieImage from "../../assets/images/PDM-PRINTEMPS-2026-COOKIE-scaled (1).webp";
import kombuchaImage from "../../assets/images/Kombucha-province (1).webp";

type Suggestion = {
  image: StaticImageData;
  title: string;
  category: string;
  description: string;
  note: string;
};

const suggestions: Suggestion[] = [
  {
    image: cookieImage,
    title: "Cookie gourmand",
    category: "Dessert signature",
    description: "La douceur chaude et genereuse qui prolonge la table.",
    note: "A partager en fin de repas",
  },
  {
    image: kombuchaImage,
    title: "Kombucha province",
    category: "Boisson fraiche",
    description:
      "Une bulle fraiche, acidulee et legere pour les flammes de saison.",
    note: "Parfait avec une flam relevee",
  },
];

export function SuggestionsMomentShowcase() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {suggestions.map((suggestion, index) => (
        <motion.article
          className="group overflow-hidden rounded-sm border border-bone/12 bg-bone text-cacao shadow-soft"
          initial={{ opacity: 0, y: 36 }}
          key={suggestion.title}
          transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10% 0px" }}
          whileHover={{ y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="relative grid min-h-[430px] place-items-center overflow-hidden bg-cream p-5 md:min-h-[620px] md:p-8">
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-8 h-14 bg-cacao/10 blur-2xl"
              animate={{ opacity: [0.3, 0.55, 0.3], scaleX: [0.86, 1, 0.86] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.025, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                alt={suggestion.description}
                className="object-contain p-3 transition duration-500 group-hover:scale-[1.025]"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={suggestion.image}
              />
            </motion.div>
            <span className="absolute left-5 top-5 rounded-full bg-cacao px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-bone md:left-7 md:top-7">
              Produit du moment
            </span>
          </div>
          <div className="grid gap-4 p-6 md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ember">
              {suggestion.category}
            </p>
            <h2 className="font-display text-6xl uppercase leading-none">
              {suggestion.title}
            </h2>
            <p className="max-w-lg text-sm font-bold leading-6 text-cacao/70">
              {suggestion.description}
            </p>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cacao/45">
              {suggestion.note}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
