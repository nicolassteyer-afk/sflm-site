"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicRestaurant } from "@/lib/cms";

type StoreLocatorProps = {
  restaurants: PublicRestaurant[];
};

type MapRestaurant = PublicRestaurant & {
  mapLat: number;
  mapLng: number;
  region: string;
};

const cityCoordinates: Record<string, { lat: number; lng: number; region: string }> = {
  arras: { lat: 50.291, lng: 2.778, region: "Hauts-de-France" },
  begles: { lat: 44.808, lng: -0.548, region: "Nouvelle-Aquitaine" },
  bordeaux: { lat: 44.838, lng: -0.579, region: "Nouvelle-Aquitaine" },
  chatelet: { lat: 48.858, lng: 2.347, region: "Ile-de-France" },
  lille: { lat: 50.629, lng: 3.057, region: "Hauts-de-France" },
  lyon: { lat: 45.764, lng: 4.836, region: "Auvergne-Rhone-Alpes" },
  montparnasse: { lat: 48.842, lng: 2.321, region: "Ile-de-France" },
  nantes: { lat: 47.218, lng: -1.554, region: "Pays de la Loire" },
  paris: { lat: 48.856, lng: 2.352, region: "Ile-de-France" },
  "place-austerlitz": { lat: 48.58, lng: 7.752, region: "Grand Est" },
  "rue-des-freres": { lat: 48.582, lng: 7.753, region: "Grand Est" },
  selestat: { lat: 48.259, lng: 7.454, region: "Grand Est" },
  "saint-lazare": { lat: 48.876, lng: 2.325, region: "Ile-de-France" },
  strasbourg: { lat: 48.573, lng: 7.752, region: "Grand Est" },
  "thonon-les-bains": { lat: 46.371, lng: 6.479, region: "Auvergne-Rhone-Alpes" },
};

export function StoreLocator({ restaurants }: StoreLocatorProps) {
  const mappedRestaurants = useMemo(
    () => restaurants.map((restaurant) => withMapPosition(restaurant)),
    [restaurants],
  );
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [activeSlug, setActiveSlug] = useState("");

  const cities = useMemo(
    () => Array.from(new Set(mappedRestaurants.map((restaurant) => restaurant.city))).sort(),
    [mappedRestaurants],
  );

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = normalize(query);
    return mappedRestaurants.filter((restaurant) => {
      const matchesCity = city === "all" || restaurant.city === city;
      const searchText = normalize(
        `${restaurant.name} ${restaurant.city} ${restaurant.address} ${restaurant.postalCode ?? ""} ${restaurant.region}`,
      );
      return matchesCity && searchText.includes(normalizedQuery);
    });
  }, [city, mappedRestaurants, query]);

  const activeRestaurant =
    mappedRestaurants.find((restaurant) => restaurant.slug === activeSlug) ?? null;

  const mapUrl = activeRestaurant ? mapsEmbedUrl(activeRestaurant) : mapsFranceUrl();

  return (
    <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div className="grid gap-3 rounded-[8px] border border-cacao/15 bg-bone p-4 shadow-[0_24px_70px_rgba(42,21,17,0.08)]">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="restaurant-search">
              Rechercher un restaurant
            </label>
            <input
              className="h-12 rounded-[6px] border border-cacao/20 bg-cream px-4 text-sm font-bold text-cacao outline-none transition placeholder:text-cacao/40 focus:border-ember"
              id="restaurant-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ville, code postal, region"
              type="search"
              value={query}
            />
            <button
              className="warm-button h-12 rounded-[6px] border border-cacao bg-cacao px-5 text-xs font-black uppercase tracking-[0.16em] text-bone transition hover:text-bone"
              onClick={() => setActiveSlug(filteredRestaurants[0]?.slug ?? "")}
              type="button"
            >
              Trouver
            </button>
          </div>
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

        <div className="grid grid-cols-3 gap-3">
          <Stat label="adresses" value={filteredRestaurants.length.toString()} />
          <Stat label="villes" value={cities.length.toString()} />
          <Stat label="selection" value={activeRestaurant?.city ?? "France"} />
        </div>

        <div className="grid max-h-[620px] gap-3 overflow-auto pr-1" data-lenis-prevent>
          {filteredRestaurants.map((restaurant, index) => (
            <motion.button
              className={`rounded-[8px] border p-5 text-left transition ${
                activeRestaurant?.slug === restaurant.slug
                  ? "border-ember bg-ember text-bone"
                  : "border-cacao/15 bg-cream text-cacao hover:border-cacao/40"
              }`}
              initial={{ opacity: 0, y: 14 }}
              key={`${restaurant.city}-${restaurant.slug}`}
              onClick={() => setActiveSlug(restaurant.slug)}
              transition={{ delay: index * 0.025 }}
              type="button"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] opacity-70">
                {restaurant.region}
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

      <section className="overflow-hidden rounded-[8px] border border-cacao/15 bg-cacao text-bone">
        <div className="grid min-h-[760px] lg:grid-rows-[1fr_auto]">
          <div className="relative min-h-[520px] bg-ink">
            <div className="absolute left-5 right-5 top-5 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-bone/15 bg-ink/75 p-3 backdrop-blur-md">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                  {activeRestaurant ? "Carte Maps" : "Carte de France"}
                </p>
                <p className="mt-1 text-sm font-bold text-bone/70">
                  {activeRestaurant
                    ? "La carte est zoomee sur le restaurant choisi."
                    : "Cliquez un marqueur ou une adresse pour zoomer sur le restaurant."}
                </p>
              </div>
              {activeRestaurant ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-[6px] border border-bone/25 bg-bone/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-saffron hover:text-saffron"
                    onClick={() => setActiveSlug("")}
                    type="button"
                  >
                    Voir la France
                  </button>
                  <Link
                    className="rounded-[6px] border border-bone/25 bg-bone/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-saffron hover:text-saffron"
                    href={
                      activeRestaurant.googleMapsUrl ??
                      `https://www.google.com/maps/dir/?api=1&destination=${activeRestaurant.mapLat},${activeRestaurant.mapLng}`
                    }
                    target="_blank"
                  >
                    Ouvrir Maps
                  </Link>
                </div>
              ) : (
                <Link
                  className="rounded-[6px] border border-bone/25 bg-bone/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-saffron hover:text-saffron"
                  href="https://www.google.com/maps/search/Flam's+restaurant+France"
                  target="_blank"
                >
                  Ouvrir Maps
                </Link>
              )}
            </div>
            <iframe
              className="h-full min-h-[520px] w-full border-0"
              key={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              title={
                activeRestaurant
                  ? `Carte Maps - ${activeRestaurant.name}`
                  : "Carte Maps des restaurants Flam's"
              }
            />
            {!activeRestaurant ? (
              <div className="pointer-events-none absolute inset-0 z-10">
                {mappedRestaurants.map((restaurant) => {
                  const position = markerPosition(restaurant);
                  return (
                    <button
                      aria-label={`Zoomer sur ${restaurant.name}`}
                      className="pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-bone bg-ember text-xs font-black text-bone shadow-[0_10px_28px_rgba(42,21,17,0.28)] transition hover:scale-110 hover:bg-saffron hover:text-cacao"
                      key={`marker-${restaurant.slug}`}
                      onClick={() => setActiveSlug(restaurant.slug)}
                      style={{ left: `${position.x}%`, top: `${position.y}%` }}
                      title={restaurant.name}
                      type="button"
                    >
                      F
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {activeRestaurant ? (
            <div className="grid gap-8 border-t border-bone/15 p-6 md:grid-cols-[1fr_auto] md:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                  {activeRestaurant.city} / {activeRestaurant.region}
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
                <Link
                  className="rounded-[6px] border border-bone/35 px-5 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-bone transition hover:border-saffron hover:text-saffron"
                  href={
                    activeRestaurant.googleMapsUrl ??
                    `https://www.google.com/maps/dir/?api=1&destination=${activeRestaurant.mapLat},${activeRestaurant.mapLng}`
                  }
                  target="_blank"
                >
                  Itineraire
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
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-cacao/15 bg-cream p-4 text-cacao">
      <p className="truncate font-display text-4xl uppercase leading-none">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-cacao/55">{label}</p>
    </div>
  );
}

function withMapPosition(restaurant: PublicRestaurant): MapRestaurant {
  const keyCandidates = [
    restaurant.slug,
    slugCity(restaurant.city),
    normalize(restaurant.address).split(",")[0]?.replace(/\s+/g, "-"),
  ];
  const fallback =
    keyCandidates.map((key) => cityCoordinates[key]).find(Boolean) ??
    cityCoordinates[slugCity(restaurant.city)] ??
    { lat: 46.603, lng: 1.888, region: "France" };
  const mapLat = restaurant.latitude ?? fallback.lat;
  const mapLng = restaurant.longitude ?? fallback.lng;

  return {
    ...restaurant,
    mapLat,
    mapLng,
    region: fallback.region,
  };
}

function mapsEmbedUrl(restaurant: MapRestaurant) {
  const query = encodeURIComponent(`${restaurant.name}, ${formatAddress(restaurant)}`);
  return `https://maps.google.com/maps?q=${query}&ll=${restaurant.mapLat},${restaurant.mapLng}&z=14&output=embed`;
}

function mapsFranceUrl() {
  return "https://maps.google.com/maps?q=France&ll=46.603,1.888&z=6&output=embed";
}

function formatAddress(restaurant: PublicRestaurant) {
  return [restaurant.address, restaurant.postalCode, restaurant.country].filter(Boolean).join(", ");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugCity(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function markerPosition(restaurant: MapRestaurant) {
  const minLng = -5.6;
  const maxLng = 9.7;
  const minLat = 41.0;
  const maxLat = 51.4;
  const x = ((restaurant.mapLng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - restaurant.mapLat) / (maxLat - minLat)) * 100;

  return {
    x: Math.min(Math.max(x, 4), 96),
    y: Math.min(Math.max(y, 8), 92),
  };
}
