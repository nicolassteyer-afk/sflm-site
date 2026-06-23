"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Restaurant } from "@/data/restaurants";
import { VisualPlaceholder } from "./VisualPlaceholder";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <motion.article
      className="group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/restaurants/${slugCity(restaurant.city)}/${restaurant.slug}`}>
        <VisualPlaceholder
          className="min-h-[390px] transition duration-500 group-hover:scale-[0.985]"
          src={restaurant.mediaSrc}
          alt={restaurant.name}
          label={restaurant.city}
          tone={restaurant.heroTone}
        />
        <div className="mt-5 flex items-start justify-between gap-6 border-t border-cacao/20 pt-4">
          <div>
            <h3 className="font-display text-5xl uppercase leading-none text-cacao">
              {restaurant.name}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-cacao/65">{restaurant.mood}</p>
          </div>
          <span className="rounded-full border border-cacao/25 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition group-hover:border-ember group-hover:bg-ember group-hover:text-bone">
            Voir
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function slugCity(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("londres", "londres")
    .replace(/\s+/g, "-");
}
