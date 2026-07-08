"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicRestaurant } from "@/lib/cms";

type StoreLocatorProps = {
  restaurants: PublicRestaurant[];
};

export function StoreLocator({ restaurants }: StoreLocatorProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [activeSlug, setActiveSlug] = useState(restaurants[0]?.slug ?? "");

  const cities = useMemo(
    () => Array.from(new Set(restaurants.map((restaurant) => restaurant.city))).sort(),
    [restaurants],
  );

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = normalize(query);
    return restaurants.filter((restaurant) => {
      const matchesCity = city === "all" || restaurant.city === city;
      const searchText = normalize(
        `${restaurant.name} ${restaurant.city} ${restaurant.address} ${restaurant.postalCode ?? ""}`,
      );
      return matchesCity && searchText.includes(normalizedQuery);
    });
  }, [city, query, restaurants]);

  const activeRestaurant =
    filteredRestaurants.find((restaurant) => restaurant.slug === activeSlug) ??
    filteredRestaurants[0] ??
    restaurants[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div className="grid gap-3 rounded-[8px] border border-cacao/15 bg-bone p-4 shadow-[0_24px_70px_rgba(42,21,17,0.08)] sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="restaurant-search">
            Rechercher un restaurant
          </label>
          <input
            className="h-12 rounded-[6px] border border-cacao/20 bg-cream px-4 text-sm font-bold text-cacao outline-none transition placeholder:text-cacao/40 focus:border-ember"
            id="restaurant-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ville, adresse, restaurant"
            type="search"
            value={query}
          />
          <label className="sr-only" htmlFor="restaurant-city">
            Filtrer par ville
          </label>
          <select
            className="h-12 rounded-[6px] border border-cacao/20 bg-cream px-4 text-sm font-black uppercase tracking-[0.12em] text-cacao outline-none transition focus:border-ember"
            id="restaurant-city"
            onChange={(event) => {
              setCity(event.target.value);
              setActiveSlug("");
            }}
            value={city}
          >
            <option value="all">Toutes les villes</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid max-h-[680px] gap-3 overflow-auto pr-1" data-lenis-prevent>
          {filteredRestaurants.map((restaurant, index) => (
            <motion.button
              className={`rounded-[8px] border p-5 text-left transition ${
                activeRestaurant?.slug === restaurant.slug
                  ? "border-ember bg-ember text-bone"
                  : "border-cacao/15 bg-cream text-cacao hover:border-cacao/40"
              }`}
              initial={{ opacity: 0, y: 14 }}
              key={restaurant.slug}
              onClick={() => setActiveSlug(restaurant.slug)}
              transition={{ delay: index * 0.025 }}
              type="button"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] opacity-70">
                {restaurant.city}
              </span>
              <h2 className="mt-2 font-display text-5xl uppercase leading-none">
                {restaurant.name}
              </h2>
              <p className="mt-3 text-sm font-bold leading-5 opacity-80">
                {formatAddress(restaurant)}
              </p>
            </motion.button>
          ))}
          {filteredRestaurants.length === 0 ? (
            <div className="rounded-[8px] border border-cacao/15 bg-cream p-6 text-sm font-bold text-cacao/70">
              Aucun restaurant ne correspond a cette recherche.
            </div>
          ) : null}
        </div>
      </aside>

      <section className="min-h-[680px] overflow-hidden rounded-[8px] border border-cacao/15 bg-cacao text-bone">
        <div className="relative min-h-[390px] border-b border-bone/15 bg-[radial-gradient(circle_at_24%_22%,rgba(243,177,42,0.28),transparent_16rem),linear-gradient(135deg,#65131a,#2a1511_55%,#11100d)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,247,223,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,223,.2)_1px,transparent_1px)] [background-size:44px_44px]" />
          {filteredRestaurants.map((restaurant, index) => (
            <button
              aria-label={restaurant.name}
              className={`absolute grid h-11 w-11 place-items-center rounded-full border-2 transition ${
                activeRestaurant?.slug === restaurant.slug
                  ? "z-10 border-saffron bg-saffron text-cacao scale-110"
                  : "border-bone/80 bg-bone/15 text-bone hover:bg-bone hover:text-cacao"
              }`}
              key={restaurant.slug}
              onClick={() => setActiveSlug(restaurant.slug)}
              style={positionForRestaurant(restaurant, index, filteredRestaurants.length)}
              type="button"
            >
              <span className="font-display text-3xl leading-none">{index + 1}</span>
            </button>
          ))}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                Nos restaurants
              </p>
              <p className="mt-2 max-w-lg font-display text-6xl uppercase leading-none md:text-7xl">
                {filteredRestaurants.length} adresse{filteredRestaurants.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {activeRestaurant ? (
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                {activeRestaurant.city}
              </p>
              <h3 className="mt-3 font-display text-6xl uppercase leading-none md:text-8xl">
                {activeRestaurant.name}
              </h3>
              <div className="mt-6 grid gap-3 text-sm font-bold leading-6 text-bone/75">
                <p>{formatAddress(activeRestaurant)}</p>
                <p>{activeRestaurant.hours}</p>
                {activeRestaurant.phone ? <p>{activeRestaurant.phone}</p> : null}
              </div>
            </div>
            <div className="grid content-start gap-3 md:min-w-52">
              <Link
                className="warm-button rounded-[6px] border border-bone bg-bone px-5 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-cacao transition hover:text-bone"
                href={`/restaurants/${slugCity(activeRestaurant.city)}/${activeRestaurant.slug}`}
              >
                Voir la fiche
              </Link>
              {activeRestaurant.reservationUrl ? (
                <Link
                  className="rounded-[6px] border border-bone/35 px-5 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-bone transition hover:border-saffron hover:text-saffron"
                  href={activeRestaurant.reservationUrl}
                  target="_blank"
                >
                  Reserver
                </Link>
              ) : null}
              {activeRestaurant.googleMapsUrl ? (
                <Link
                  className="rounded-[6px] border border-bone/35 px-5 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-bone transition hover:border-saffron hover:text-saffron"
                  href={activeRestaurant.googleMapsUrl}
                  target="_blank"
                >
                  Itineraire
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function formatAddress(restaurant: PublicRestaurant) {
  return [restaurant.address, restaurant.postalCode, restaurant.country].filter(Boolean).join(", ");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function positionForRestaurant(restaurant: PublicRestaurant, index: number, total: number) {
  if (restaurant.latitude && restaurant.longitude) {
    const left = Math.min(88, Math.max(12, ((restaurant.longitude + 5) / 15) * 100));
    const top = Math.min(82, Math.max(14, ((52 - restaurant.latitude) / 12) * 100));
    return { left: `${left}%`, top: `${top}%` };
  }

  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  const radiusX = 34;
  const radiusY = 28;
  return {
    left: `${50 + Math.cos(angle) * radiusX}%`,
    top: `${48 + Math.sin(angle) * radiusY}%`,
  };
}

function slugCity(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}
