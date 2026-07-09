"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PublicRestaurant } from "@/lib/cms";

type StoreLocatorProps = {
  restaurants: PublicRestaurant[];
};

type MapRestaurant = PublicRestaurant & {
  mapLat: number;
  mapLng: number;
  region: string;
};

type MapCenter = {
  lat: number;
  lng: number;
};

type MapSize = {
  width: number;
  height: number;
};

type ScreenRestaurant = MapRestaurant & {
  screenX: number;
  screenY: number;
};

type ScreenCluster = {
  key: string;
  count: number;
  screenX: number;
  screenY: number;
  mapLat: number;
  mapLng: number;
  restaurants: ScreenRestaurant[];
};

type Tile = {
  key: string;
  url: string;
  left: number;
  top: number;
};

const tileSize = 256;
const minZoom = 5;
const maxZoom = 15;
const franceCenter = { lat: 46.603, lng: 1.888 };

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

  const selectRestaurant = useCallback((restaurant: MapRestaurant) => {
    setCity(restaurant.city);
    setActiveSlug(restaurant.slug);
  }, []);

  const resetFrance = useCallback(() => {
    setCity("all");
    setActiveSlug("");
  }, []);

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
              onClick={() => {
                const firstResult = filteredRestaurants[0];
                if (firstResult) selectRestaurant(firstResult);
              }}
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
              onClick={() => selectRestaurant(restaurant)}
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
          <DynamicRestaurantMap
            activeRestaurant={activeRestaurant}
            onCityFocus={(cityName) => {
              setCity(cityName);
              setActiveSlug("");
            }}
            onReset={resetFrance}
            onSelect={selectRestaurant}
            restaurants={mappedRestaurants}
          />

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

function DynamicRestaurantMap({
  activeRestaurant,
  onCityFocus,
  onReset,
  onSelect,
  restaurants,
}: {
  activeRestaurant: MapRestaurant | null;
  onCityFocus: (city: string) => void;
  onReset: () => void;
  onSelect: (restaurant: MapRestaurant) => void;
  restaurants: MapRestaurant[];
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; center: MapCenter } | null>(null);
  const [size, setSize] = useState<MapSize>({ width: 960, height: 620 });
  const [center, setCenter] = useState<MapCenter>(franceCenter);
  const [zoom, setZoom] = useState(6);

  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.max(width, 320), height: Math.max(height, 420) });
    });

    resizeObserver.observe(mapElement);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!activeRestaurant) return;
    setCenter({ lat: activeRestaurant.mapLat, lng: activeRestaurant.mapLng });
    setZoom(13);
  }, [activeRestaurant]);

  const centerPoint = useMemo(() => project(center.lat, center.lng, zoom), [center, zoom]);

  const tiles = useMemo(
    () => getVisibleTiles(centerPoint, size, zoom),
    [centerPoint, size, zoom],
  );

  const screenRestaurants = useMemo(
    () =>
      restaurants.map((restaurant) => {
        const point = project(restaurant.mapLat, restaurant.mapLng, zoom);
        return {
          ...restaurant,
          screenX: point.x - centerPoint.x + size.width / 2,
          screenY: point.y - centerPoint.y + size.height / 2,
        };
      }),
    [centerPoint, restaurants, size, zoom],
  );

  const screenClusters = useMemo(
    () => clusterScreenRestaurants(screenRestaurants, zoom),
    [screenRestaurants, zoom],
  );

  const setZoomAroundCenter = useCallback((nextZoom: number) => {
    setZoom(Math.min(Math.max(nextZoom, minZoom), maxZoom));
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, center };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dragCenterPoint = project(drag.center.lat, drag.center.lng, zoom);
    const nextPoint = {
      x: dragCenterPoint.x - (event.clientX - drag.x),
      y: dragCenterPoint.y - (event.clientY - drag.y),
    };
    setCenter(unproject(nextPoint.x, nextPoint.y, zoom));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleClusterClick = (cluster: ScreenCluster) => {
    const cities = Array.from(new Set(cluster.restaurants.map((restaurant) => restaurant.city)));

    if (cluster.count === 1) {
      onSelect(cluster.restaurants[0]);
      return;
    }

    setCenter({ lat: cluster.mapLat, lng: cluster.mapLng });
    setZoom((currentZoom) => Math.min(currentZoom + 2, maxZoom));

    if (cities.length === 1) {
      onCityFocus(cities[0]);
    }
  };

  return (
    <div
      className="relative min-h-[620px] overflow-hidden bg-[#e8dfcf] touch-none"
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={(event) => {
        event.preventDefault();
        setZoomAroundCenter(zoom + (event.deltaY < 0 ? 1 : -1));
      }}
      ref={mapRef}
    >
      {tiles.map((tile) => (
        <img
          alt=""
          className="absolute h-64 w-64 select-none"
          draggable={false}
          key={tile.key}
          src={tile.url}
          style={{ left: tile.left, top: tile.top }}
        />
      ))}

      <div className="absolute left-5 right-5 top-5 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-bone/15 bg-ink/80 p-3 backdrop-blur-md">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
            Carte dynamique
          </p>
          <p className="mt-1 text-sm font-bold text-bone/70">
            Deplacez la carte, zoomez, puis cliquez une bulle ou un restaurant.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="h-9 w-9 rounded-[6px] border border-bone/25 bg-bone/10 text-sm font-black text-bone transition hover:border-saffron hover:text-saffron"
            onClick={() => setZoomAroundCenter(zoom + 1)}
            type="button"
          >
            +
          </button>
          <button
            className="h-9 w-9 rounded-[6px] border border-bone/25 bg-bone/10 text-sm font-black text-bone transition hover:border-saffron hover:text-saffron"
            onClick={() => setZoomAroundCenter(zoom - 1)}
            type="button"
          >
            -
          </button>
          <button
            className="rounded-[6px] border border-bone/25 bg-bone/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-saffron hover:text-saffron"
            onClick={() => {
              setCenter(franceCenter);
              setZoom(6);
              onReset();
            }}
            type="button"
          >
            France
          </button>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        {screenClusters.map((cluster) => {
          const isCluster = cluster.count > 1;
          const active = cluster.restaurants.some(
            (restaurant) => restaurant.slug === activeRestaurant?.slug,
          );

          return (
            <button
              aria-label={
                isCluster
                  ? `Voir les ${cluster.count} restaurants dans cette zone`
                  : `Voir ${cluster.restaurants[0]?.name}`
              }
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-bone font-black shadow-[0_14px_34px_rgba(42,21,17,0.34)] transition hover:scale-110 ${
                isCluster
                  ? "h-14 w-14 bg-saffron text-cacao ring-[10px] ring-saffron/25"
                  : "h-11 w-11 bg-ember text-bone"
              } ${active ? "scale-110 ring-[10px] ring-ember/30" : ""}`}
              key={cluster.key}
              onClick={(event) => {
                event.stopPropagation();
                handleClusterClick(cluster);
              }}
              style={{ left: cluster.screenX, top: cluster.screenY }}
              title={
                isCluster
                  ? `${cluster.count} restaurants dans cette zone`
                  : cluster.restaurants[0]?.name
              }
              type="button"
            >
              {isCluster ? cluster.count : "F"}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 z-20 rounded-[6px] bg-bone/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-cacao shadow">
        OpenStreetMap
      </div>
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

function getVisibleTiles(centerPoint: { x: number; y: number }, size: MapSize, zoom: number) {
  const tiles: Tile[] = [];
  const startX = Math.floor((centerPoint.x - size.width / 2) / tileSize);
  const endX = Math.floor((centerPoint.x + size.width / 2) / tileSize);
  const startY = Math.floor((centerPoint.y - size.height / 2) / tileSize);
  const endY = Math.floor((centerPoint.y + size.height / 2) / tileSize);
  const maxTile = 2 ** zoom;

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= maxTile) continue;

      const wrappedX = ((x % maxTile) + maxTile) % maxTile;
      tiles.push({
        key: `${zoom}-${wrappedX}-${y}`,
        url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
        left: x * tileSize - centerPoint.x + size.width / 2,
        top: y * tileSize - centerPoint.y + size.height / 2,
      });
    }
  }

  return tiles;
}

function clusterScreenRestaurants(restaurants: ScreenRestaurant[], zoom: number): ScreenCluster[] {
  const radius = zoom < 8 ? 68 : zoom < 11 ? 54 : 34;
  const clusters: ScreenCluster[] = [];

  for (const restaurant of restaurants) {
    const existingCluster = clusters.find((cluster) => {
      const distance = Math.hypot(cluster.screenX - restaurant.screenX, cluster.screenY - restaurant.screenY);
      return distance < radius;
    });

    if (existingCluster) {
      existingCluster.restaurants.push(restaurant);
      existingCluster.count += 1;
      existingCluster.screenX =
        (existingCluster.screenX * (existingCluster.count - 1) + restaurant.screenX) /
        existingCluster.count;
      existingCluster.screenY =
        (existingCluster.screenY * (existingCluster.count - 1) + restaurant.screenY) /
        existingCluster.count;
      existingCluster.mapLat =
        (existingCluster.mapLat * (existingCluster.count - 1) + restaurant.mapLat) /
        existingCluster.count;
      existingCluster.mapLng =
        (existingCluster.mapLng * (existingCluster.count - 1) + restaurant.mapLng) /
        existingCluster.count;
    } else {
      clusters.push({
        key: restaurant.slug,
        count: 1,
        screenX: restaurant.screenX,
        screenY: restaurant.screenY,
        mapLat: restaurant.mapLat,
        mapLng: restaurant.mapLng,
        restaurants: [restaurant],
      });
    }
  }

  return clusters.map((cluster) => ({
    ...cluster,
    key: cluster.restaurants.map((restaurant) => restaurant.slug).join("-"),
  }));
}

function project(lat: number, lng: number, zoom: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = tileSize * 2 ** zoom;
  return {
    x: ((lng + 180) / 360) * scale,
    y:
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) *
      scale,
  };
}

function unproject(x: number, y: number, zoom: number): MapCenter {
  const scale = tileSize * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat: Math.min(Math.max(lat, -85), 85), lng };
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
