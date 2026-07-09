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
    <div className="grid min-h-[calc(100vh-6rem)] bg-white lg:grid-cols-[36rem_1fr]">
      <aside className="z-20 flex min-h-[42rem] flex-col border-r border-black/10 bg-white">
        <div className="border-b border-black/10 px-6 pb-5 pt-8 md:px-8">
          <h1 className="font-display text-5xl uppercase leading-none text-black md:text-6xl">
            Trouver un restaurant
          </h1>
          <div className="mt-5 flex h-12 items-center rounded-[6px] border border-black/20 bg-white px-4 text-cacao">
            <span className="mr-3 text-xl leading-none text-ember">⌕</span>
            <label className="sr-only" htmlFor="restaurant-search">
              Rechercher un restaurant
            </label>
            <input
              className="h-full flex-1 bg-transparent text-sm font-bold text-cacao outline-none placeholder:text-cacao/45"
              id="restaurant-search"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveSlug("");
              }}
              placeholder="Ville, code postal"
              type="search"
              value={query}
            />
            <button
              aria-label="Rechercher"
              className="ml-3 text-xl leading-none text-ember transition hover:text-cacao"
              onClick={() => {
                const firstResult = filteredRestaurants[0];
                if (firstResult) selectRestaurant(firstResult);
              }}
              type="button"
            >
              ›
            </button>
          </div>
          <label className="sr-only" htmlFor="restaurant-city">
            Filtrer par ville
          </label>
          <select
            className="mt-3 h-11 w-full rounded-[6px] border border-black/15 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-cacao outline-none transition focus:border-ember"
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
          <p className="mt-4 text-sm font-bold text-black">
            {filteredRestaurants.length} restaurants a proximite
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 md:px-8" data-lenis-prevent>
          {filteredRestaurants.map((restaurant, index) => (
            <motion.button
              className={`block w-full border-b border-black/15 py-7 text-left transition ${
                activeRestaurant?.slug === restaurant.slug
                  ? "bg-ember/[0.06] text-black"
                  : "bg-white text-black hover:bg-black/[0.03]"
              }`}
              initial={{ opacity: 0, y: 14 }}
              key={`${restaurant.city}-${restaurant.slug}`}
              onClick={() => selectRestaurant(restaurant)}
              transition={{ delay: index * 0.025 }}
              type="button"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-lg font-black leading-tight">
                {restaurant.name}
              </h2>
              <p className="mt-3 text-sm font-medium leading-5 text-black/80">
                {restaurant.address}
                <br />
                {[restaurant.postalCode, restaurant.city, restaurant.country].filter(Boolean).join(", ")}
                {restaurant.phone ? (
                  <>
                    <br />
                    {restaurant.phone}
                  </>
                ) : null}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="mr-auto grid gap-1 text-sm leading-4">
                  <span className="flex items-center gap-2 font-black">
                    <span className="h-2 w-2 rounded-full bg-ember" />
                    Ferme
                  </span>
                  <span className="pl-4 text-black/75">Ouvre a 18:30</span>
                </div>
                {restaurant.reservationUrl ? (
                  <Link
                    className="rounded-[2px] bg-ember px-4 py-3 text-xs font-black text-white transition hover:bg-cacao"
                    href={restaurant.reservationUrl}
                    onClick={(event) => event.stopPropagation()}
                    target="_blank"
                  >
                    Reserver
                  </Link>
                ) : null}
                <Link
                  className="rounded-[2px] border border-ember px-4 py-3 text-xs font-black text-ember transition hover:bg-ember hover:text-white"
                  href={`/restaurants/${slugCity(restaurant.city)}/${restaurant.slug}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  La carte
                </Link>
                <Link
                  className="rounded-[2px] border border-ember px-4 py-3 text-xs font-black text-ember transition hover:bg-ember hover:text-white"
                  href={
                    restaurant.googleMapsUrl ??
                    `https://www.google.com/maps/dir/?api=1&destination=${restaurant.mapLat},${restaurant.mapLng}`
                  }
                  onClick={(event) => event.stopPropagation()}
                  target="_blank"
                >
                  Y aller
                </Link>
              </div>
            </motion.button>
          ))}
          {filteredRestaurants.length === 0 ? (
            <div className="my-8 rounded-[8px] border border-black/10 bg-black/[0.03] p-6 text-sm font-bold text-black/70">
              Aucun restaurant ne correspond a cette recherche.
            </div>
          ) : null}
        </div>
      </aside>

      <section className="min-h-[42rem] overflow-hidden bg-[#76c7df]">
        <div className="h-full min-h-[calc(100vh-6rem)]">
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
      className="relative h-full min-h-[calc(100vh-6rem)] overflow-hidden bg-[#76c7df] touch-none"
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

      <div className="absolute right-5 top-5 z-20 grid gap-2">
        <button
          className="h-10 w-10 rounded-[3px] border border-black/15 bg-white text-lg font-black text-black shadow transition hover:bg-ember hover:text-white"
          onClick={() => setZoomAroundCenter(zoom + 1)}
          type="button"
        >
          +
        </button>
        <button
          className="h-10 w-10 rounded-[3px] border border-black/15 bg-white text-lg font-black text-black shadow transition hover:bg-ember hover:text-white"
          onClick={() => setZoomAroundCenter(zoom - 1)}
          type="button"
        >
          -
        </button>
        <button
          className="rounded-[3px] border border-black/15 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-black shadow transition hover:bg-ember hover:text-white"
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
                  ? "h-11 w-11 bg-ember text-white ring-[8px] ring-ember/25"
                  : "h-10 w-10 bg-ember text-white after:absolute after:top-[28px] after:h-4 after:w-4 after:rotate-45 after:bg-ember"
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
              <span className="relative z-10">{isCluster ? cluster.count : ""}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-3 right-3 z-20 rounded-[3px] bg-white/85 px-2 py-1 text-[10px] font-medium text-black/70 shadow">
        OpenStreetMap
      </div>
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
