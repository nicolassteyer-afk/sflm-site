"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PointerEvent } from "react";
import type { PublicRestaurant } from "@/lib/cms";

type StoreLocatorProps = {
  restaurants: PublicRestaurant[];
};

type MapRestaurant = PublicRestaurant & {
  mapLat: number;
  mapLng: number;
  mapX: number;
  mapY: number;
  region: string;
};

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const FRANCE_VIEWBOX: ViewBox = { x: 0, y: 0, width: 760, height: 760 };

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
  const [activeSlug, setActiveSlug] = useState(mappedRestaurants[0]?.slug ?? "");
  const [viewBox, setViewBox] = useState<ViewBox>(FRANCE_VIEWBOX);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; viewBox: ViewBox } | null>(null);

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
    filteredRestaurants.find((restaurant) => restaurant.slug === activeSlug) ??
    filteredRestaurants[0] ??
    mappedRestaurants[0];

  function focusRestaurant(restaurant: MapRestaurant) {
    setActiveSlug(restaurant.slug);
    setViewBox(centerOn(restaurant.mapX, restaurant.mapY, 240));
  }

  function fitVisible() {
    if (!filteredRestaurants.length) {
      setViewBox(FRANCE_VIEWBOX);
      return;
    }

    const xs = filteredRestaurants.map((restaurant) => restaurant.mapX);
    const ys = filteredRestaurants.map((restaurant) => restaurant.mapY);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = Math.max(220, maxX - minX + 190);
    const height = Math.max(220, maxY - minY + 190);
    setViewBox({
      x: clamp(minX - (width - (maxX - minX)) / 2, 0, 760 - width),
      y: clamp(minY - (height - (maxY - minY)) / 2, 0, 760 - height),
      width,
      height,
    });
  }

  function zoom(direction: "in" | "out") {
    const factor = direction === "in" ? 0.78 : 1.22;
    const nextWidth = clamp(viewBox.width * factor, 180, 760);
    const nextHeight = clamp(viewBox.height * factor, 180, 760);
    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;
    setViewBox({
      x: clamp(centerX - nextWidth / 2, 0, 760 - nextWidth),
      y: clamp(centerY - nextHeight / 2, 0, 760 - nextHeight),
      width: nextWidth,
      height: nextHeight,
    });
  }

  function startDrag(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ x: event.clientX, y: event.clientY, viewBox });
  }

  function drag(event: PointerEvent<SVGSVGElement>) {
    if (!dragStart) return;
    const scaleX = dragStart.viewBox.width / event.currentTarget.clientWidth;
    const scaleY = dragStart.viewBox.height / event.currentTarget.clientHeight;
    setViewBox({
      ...dragStart.viewBox,
      x: clamp(dragStart.viewBox.x - (event.clientX - dragStart.x) * scaleX, 0, 760 - dragStart.viewBox.width),
      y: clamp(dragStart.viewBox.y - (event.clientY - dragStart.y) * scaleY, 0, 760 - dragStart.viewBox.height),
    });
  }

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
              onClick={fitVisible}
              type="button"
            >
              Voir
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
          <Stat label="selection" value={activeRestaurant?.city ?? "-"} />
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
              onClick={() => focusRestaurant(restaurant)}
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
          <div className="relative min-h-[520px] bg-[radial-gradient(circle_at_20%_20%,rgba(243,177,42,0.32),transparent_18rem),linear-gradient(135deg,#65131a,#2a1511_58%,#11100d)]">
            <div className="absolute left-5 right-5 top-5 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-bone/15 bg-ink/70 p-3 backdrop-blur-md">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                  Carte de France
                </p>
                <p className="mt-1 text-sm font-bold text-bone/70">
                  Cliquez, zoomez et deplacez la carte pour naviguer.
                </p>
              </div>
              <div className="flex gap-2">
                <MapButton label="+" onClick={() => zoom("in")} />
                <MapButton label="-" onClick={() => zoom("out")} />
                <MapButton label="Tout" onClick={() => setViewBox(FRANCE_VIEWBOX)} />
                <MapButton label="Selection" onClick={fitVisible} />
              </div>
            </div>

            <svg
              aria-label="Carte interactive des restaurants Flam's en France"
              className="h-full min-h-[520px] w-full cursor-grab touch-none select-none active:cursor-grabbing"
              onPointerDown={startDrag}
              onPointerLeave={() => setDragStart(null)}
              onPointerMove={drag}
              onPointerUp={() => setDragStart(null)}
              role="img"
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            >
              <defs>
                <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feDropShadow dx="0" dy="10" floodColor="#11100d" floodOpacity="0.45" stdDeviation="8" />
                </filter>
                <linearGradient id="franceFill" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff7df" stopOpacity="0.22" />
                  <stop offset="58%" stopColor="#f3b12a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#ef3c19" stopOpacity="0.22" />
                </linearGradient>
              </defs>
              <rect height="760" width="760" fill="transparent" />
              <path
                d="M355 52 L450 70 L520 122 L565 198 L625 278 L604 372 L642 458 L585 562 L510 618 L430 705 L342 665 L260 678 L188 610 L150 512 L104 440 L145 355 L118 275 L170 196 L255 154 L300 88 Z"
                fill="url(#franceFill)"
                stroke="rgba(255,247,223,.72)"
                strokeWidth="4"
              />
              <path
                d="M190 202 C260 236 320 248 382 232 C455 214 520 222 578 268 M144 356 C236 335 310 352 382 386 C460 424 532 420 612 380 M176 560 C246 506 334 502 420 530 C482 550 532 548 588 522"
                fill="none"
                stroke="rgba(255,247,223,.18)"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d="M356 52 C336 168 332 260 352 360 C373 468 378 572 342 665 M520 122 C468 204 446 282 452 358 C458 454 440 562 430 705 M255 154 C292 244 292 344 260 448 C238 518 222 588 260 678"
                fill="none"
                stroke="rgba(255,247,223,.13)"
                strokeLinecap="round"
                strokeWidth="3"
              />
              {filteredRestaurants.map((restaurant, index) => (
                <g
                  className="cursor-pointer"
                  filter="url(#pinGlow)"
                  key={`${restaurant.city}-${restaurant.slug}-pin`}
                  onClick={(event) => {
                    event.stopPropagation();
                    focusRestaurant(restaurant);
                  }}
                  role="button"
                  tabIndex={0}
                  transform={`translate(${restaurant.mapX} ${restaurant.mapY})`}
                >
                  <circle
                    fill={activeRestaurant?.slug === restaurant.slug ? "#f3b12a" : "#fff7df"}
                    r={activeRestaurant?.slug === restaurant.slug ? 20 : 15}
                    stroke="#65131a"
                    strokeWidth="5"
                  />
                  <text
                    dy="6"
                    fill="#65131a"
                    fontFamily="Arial, sans-serif"
                    fontSize="15"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {index + 1}
                  </text>
                  <text
                    className="pointer-events-none"
                    dy="-26"
                    fill="#fff7df"
                    fontFamily="Arial, sans-serif"
                    fontSize="14"
                    fontWeight="900"
                    paintOrder="stroke"
                    stroke="#2a1511"
                    strokeWidth="5"
                    textAnchor="middle"
                  >
                    {restaurant.city}
                  </text>
                </g>
              ))}
            </svg>
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
      <p className="font-display text-4xl uppercase leading-none">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-cacao/55">{label}</p>
    </div>
  );
}

function MapButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rounded-[6px] border border-bone/25 bg-bone/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-saffron hover:text-saffron"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
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
    mapX: longitudeToX(mapLng),
    mapY: latitudeToY(mapLat),
    region: fallback.region,
  };
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

function longitudeToX(lng: number) {
  return 115 + ((lng + 5.2) / 14.2) * 530;
}

function latitudeToY(lat: number) {
  return 690 - ((lat - 41.1) / 10.3) * 620;
}

function centerOn(x: number, y: number, size: number): ViewBox {
  return {
    x: clamp(x - size / 2, 0, 760 - size),
    y: clamp(y - size / 2, 0, 760 - size),
    width: size,
    height: size,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function slugCity(city: string) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}
