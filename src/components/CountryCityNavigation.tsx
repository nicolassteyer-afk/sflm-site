"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { countries } from "@/data/restaurants";
import { VisualPlaceholder } from "./VisualPlaceholder";

export function CountryCityNavigation({
  countries: countryList = countries,
}: {
  countries?: typeof countries;
}) {
  const firstCity = countryList[0]?.cities[0];
  const [preview, setPreview] = useState(firstCity);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
      <div className="space-y-8">
        {countryList.map((country, countryIndex) => (
          <motion.div
            key={country.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: countryIndex * 0.08 }}
          >
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-ember">
              {country.name}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {country.cities.map((city) => (
                <Link
                  className="group flex items-end justify-between border-b border-cacao/20 py-4 transition hover:border-ember"
                  href={`/restaurants/${city.slug}`}
                  key={city.slug}
                  onMouseEnter={() => setPreview(city)}
                >
                  <span className="font-display text-5xl uppercase leading-none text-cacao transition group-hover:text-ember md:text-6xl">
                    {city.name}
                  </span>
                  <span className="pb-2 text-sm font-black uppercase text-cacao/50">
                    {city.restaurants.length}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {preview ? (
        <VisualPlaceholder
          className="sticky top-28 hidden min-h-[620px] lg:block"
          src={preview.restaurants[0]?.mediaSrc}
          alt={`Ambiance Flam's ${preview.name}`}
          label={preview.name}
          tone={preview.previewTone}
        />
      ) : null}
    </div>
  );
}
