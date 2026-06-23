import Link from "next/link";
import { allCities } from "@/data/restaurants";
import { VisualPlaceholder } from "./VisualPlaceholder";

export function CityGrid({ cities = allCities }: { cities?: typeof allCities }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cities.map((city, index) => (
        <Link
          className={`group block ${index % 3 === 1 ? "md:mt-16" : ""}`}
          href={`/restaurants/${city.slug}`}
          key={city.slug}
        >
          <VisualPlaceholder
            className="min-h-[430px] transition duration-500 group-hover:scale-[0.985]"
            src={city.restaurants[0]?.mediaSrc}
            alt={`Ambiance Flam's ${city.name}`}
            label={city.country}
            tone={city.previewTone}
          />
          <div className="mt-4 flex items-center justify-between border-b border-cacao/20 pb-5">
            <h3 className="font-display text-6xl uppercase leading-none text-cacao">
              {city.name}
            </h3>
            <span className="text-sm font-black uppercase tracking-[0.16em] text-cacao/55">
              {city.restaurants.length} adresse{city.restaurants.length > 1 ? "s" : ""}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
