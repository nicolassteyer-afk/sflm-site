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

type UserLocation = {
  lat: number;
  lng: number;
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

type TileLayer = {
  id: number;
  tiles: Tile[];
};

declare global {
  interface Window {
    google?: GoogleMapsNamespace;
    __googleMapsStoreLocatorPromise?: Promise<GoogleMapsNamespace>;
  }
}

type GoogleMapsNamespace = {
  maps: {
    Animation: { DROP: number };
    InfoWindow: new (options?: Record<string, unknown>) => GoogleInfoWindow;
    LatLngBounds: new () => GoogleLatLngBounds;
    Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMap;
    Marker: new (options: Record<string, unknown>) => GoogleMarker;
    Size: new (width: number, height: number) => unknown;
    Point: new (x: number, y: number) => unknown;
  };
};

type GoogleMap = {
  fitBounds: (bounds: GoogleLatLngBounds, padding?: number | Record<string, number>) => void;
  panTo: (position: UserLocation) => void;
  setCenter: (position: UserLocation) => void;
  setZoom: (zoom: number) => void;
};

type GoogleMarker = {
  addListener: (eventName: string, callback: () => void) => void;
  setMap: (map: GoogleMap | null) => void;
};

type GoogleInfoWindow = {
  close: () => void;
  open: (options: { anchor: GoogleMarker; map: GoogleMap }) => void;
  setContent: (content: string) => void;
};

type GoogleLatLngBounds = {
  extend: (position: UserLocation) => void;
};

const tileSize = 256;
const minZoom = 5;
const maxZoom = 15;
const franceCenter = { lat: 46.603, lng: 1.888 };
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const cities = useMemo(
    () => Array.from(new Set(mappedRestaurants.map((restaurant) => restaurant.city))).sort(),
    [mappedRestaurants],
  );

  const filteredRestaurants = useMemo(() => {
    const queryTokens = normalize(query).split(/\s+/).filter(Boolean);

    return mappedRestaurants
      .filter((restaurant) => {
        const matchesCity = city === "all" || restaurant.city === city;
        const searchableWords = normalize(
          `${restaurant.name} ${restaurant.city} ${restaurant.address} ${restaurant.postalCode ?? ""} ${restaurant.region}`,
        ).split(/\s+/);
        const matchesQuery =
          queryTokens.length === 0 ||
          queryTokens.every((token) =>
            searchableWords.some(
              (word) =>
                word.includes(token) ||
                token.includes(word) ||
                word.startsWith(token.slice(0, Math.min(4, token.length))),
            ),
          );

        return matchesCity && matchesQuery;
      })
      .sort((a, b) => {
        if (!userLocation) return a.city.localeCompare(b.city) || a.name.localeCompare(b.name);
        return distanceKm(userLocation, a) - distanceKm(userLocation, b);
      });
  }, [city, mappedRestaurants, query, userLocation]);

  const activeRestaurant =
    mappedRestaurants.find((restaurant) => restaurant.slug === activeSlug) ?? null;

  const selectRestaurant = useCallback((restaurant: MapRestaurant) => {
    setCity(restaurant.city);
    setActiveSlug(restaurant.slug);
    setMobileView("map");
  }, []);

  const resetFilters = useCallback(() => {
    setCity("all");
    setActiveSlug("");
    setQuery("");
  }, []);

  const resetAll = useCallback(() => {
    resetFilters();
    setUserLocation(null);
    setLocationStatus("idle");
  }, [resetFilters]);

  const useCurrentPosition = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCity("all");
        setActiveSlug("");
        setLocationStatus("ready");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 9000 },
    );
  }, []);

  const hasActiveFilters = city !== "all" || query.trim().length > 0 || Boolean(userLocation);

  return (
    <div className="grid min-h-[calc(100vh-6rem)] bg-white lg:grid-cols-[36rem_1fr]">
      <aside
        className={`z-20 min-h-[calc(100vh-6rem)] flex-col border-r border-black/10 bg-white pb-20 lg:flex lg:pb-0 ${
          mobileView === "list" ? "flex" : "hidden"
        }`}
      >
        <div className="border-b border-black/10 px-6 pb-5 pt-8 md:px-8">
          <h1 className="font-display text-5xl uppercase leading-none text-black md:text-6xl">
            Trouver un restaurant
          </h1>
          <div className="mt-5 flex min-h-12 items-center rounded-[6px] border border-black/20 bg-white px-4 text-cacao">
            <span className="mr-3 text-xs font-black uppercase tracking-[0.08em] text-ember">
              Chercher
            </span>
            <label className="sr-only" htmlFor="restaurant-search">
              Rechercher un restaurant
            </label>
            <input
              className="h-12 min-w-0 flex-1 bg-transparent text-sm font-bold text-cacao outline-none placeholder:text-cacao/45"
              id="restaurant-search"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveSlug("");
              }}
              placeholder="Ville, code postal, adresse"
              type="search"
              value={query}
            />
            <button
              aria-label="Afficher le premier resultat"
              className="ml-3 min-h-10 rounded-[3px] px-3 text-xs font-black uppercase tracking-[0.1em] text-ember transition hover:bg-ember hover:text-white"
              onClick={() => {
                const firstResult = filteredRestaurants[0];
                if (firstResult) selectRestaurant(firstResult);
              }}
              type="button"
            >
              Go
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
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="min-h-11 rounded-[3px] border border-ember px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-ember transition hover:bg-ember hover:text-white disabled:cursor-wait disabled:opacity-60"
              disabled={locationStatus === "loading"}
              onClick={useCurrentPosition}
              type="button"
            >
              {locationStatus === "loading" ? "Localisation..." : "Autour de moi"}
            </button>
            {hasActiveFilters ? (
              <button
                className="min-h-11 rounded-[3px] border border-black/15 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-black/65 transition hover:bg-black hover:text-white"
                onClick={resetAll}
                type="button"
              >
                Reinitialiser
              </button>
            ) : null}
          </div>
          {locationStatus === "error" ? (
            <p className="mt-3 text-sm font-bold text-ember">
              Localisation indisponible. Recherchez par ville, adresse ou code postal.
            </p>
          ) : null}
          <p className="mt-4 text-sm font-bold text-black">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? "s" : ""} trouve
            {filteredRestaurants.length > 1 ? "s" : ""}
          </p>
          {hasActiveFilters ? (
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-black/55">
              {city !== "all" ? <span className="rounded-full bg-black/[0.06] px-3 py-2">{city}</span> : null}
              {query.trim() ? <span className="rounded-full bg-black/[0.06] px-3 py-2">Recherche: {query}</span> : null}
              {userLocation ? <span className="rounded-full bg-black/[0.06] px-3 py-2">Les plus proches</span> : null}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 md:px-8" data-lenis-prevent>
          {filteredRestaurants.map((restaurant, index) => (
            <motion.button
              className={`block w-full border-b border-black/15 py-7 text-left transition ${
                activeRestaurant?.slug === restaurant.slug
                  ? "bg-ember/[0.08] text-black"
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
              <div className="flex items-start gap-3">
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-ember" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black leading-tight">{restaurant.name}</h2>
                  {userLocation ? (
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-ember">
                      A {formatDistance(distanceKm(userLocation, restaurant))}
                    </p>
                  ) : null}
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
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="mr-auto grid gap-1 text-sm leading-4">
                  <span className="font-black">Infos horaires</span>
                  <span className="text-black/75">{restaurant.hours}</span>
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
                  La fiche
                </Link>
                <Link
                  className="rounded-[2px] border border-ember px-4 py-3 text-xs font-black text-ember transition hover:bg-ember hover:text-white"
                  href={directionsUrl(restaurant)}
                  onClick={(event) => event.stopPropagation()}
                  target="_blank"
                >
                  Itineraire
                </Link>
              </div>
            </motion.button>
          ))}
          {filteredRestaurants.length === 0 ? (
            <div className="my-8 rounded-[8px] border border-black/10 bg-black/[0.03] p-6 text-sm font-bold text-black/70">
              Aucun restaurant ne correspond a cette recherche. Essayez une ville, un code postal plus court ou reinitialisez les filtres.
            </div>
          ) : null}
        </div>
      </aside>

      <section
        className={`min-h-[calc(100vh-6rem)] overflow-hidden bg-[#76c7df] lg:block ${
          mobileView === "map" ? "block" : "hidden"
        }`}
      >
        <div className="h-full min-h-[calc(100vh-6rem)]">
          <DynamicRestaurantMap
            activeRestaurant={activeRestaurant}
            onCityFocus={(cityName) => {
              setCity(cityName);
              setActiveSlug("");
            }}
            onReset={resetFilters}
            onSelect={selectRestaurant}
            restaurants={filteredRestaurants}
            userLocation={userLocation}
          />
        </div>
      </section>

      <div className="fixed bottom-4 left-4 right-4 z-50 grid grid-cols-2 gap-2 rounded-[6px] border border-black/10 bg-white p-1 shadow-[0_18px_45px_rgba(42,21,17,0.2)] lg:hidden">
        <button
          className={`min-h-12 rounded-[4px] text-xs font-black uppercase tracking-[0.12em] ${
            mobileView === "list" ? "bg-ember text-white" : "text-black"
          }`}
          onClick={() => setMobileView("list")}
          type="button"
        >
          Liste
        </button>
        <button
          className={`min-h-12 rounded-[4px] text-xs font-black uppercase tracking-[0.12em] ${
            mobileView === "map" ? "bg-ember text-white" : "text-black"
          }`}
          onClick={() => setMobileView("map")}
          type="button"
        >
          Carte
        </button>
      </div>
    </div>
  );
}

function DynamicRestaurantMap({
  activeRestaurant,
  onCityFocus,
  onReset,
  onSelect,
  restaurants,
  userLocation,
}: {
  activeRestaurant: MapRestaurant | null;
  onCityFocus: (city: string) => void;
  onReset: () => void;
  onSelect: (restaurant: MapRestaurant) => void;
  restaurants: MapRestaurant[];
  userLocation: UserLocation | null;
}) {
  if (googleMapsApiKey) {
    return (
      <GoogleRestaurantMap
        activeRestaurant={activeRestaurant}
        apiKey={googleMapsApiKey}
        onReset={onReset}
        onSelect={onSelect}
        restaurants={restaurants}
        userLocation={userLocation}
      />
    );
  }

  return (
    <FallbackTileRestaurantMap
      activeRestaurant={activeRestaurant}
      onCityFocus={onCityFocus}
      onReset={onReset}
      onSelect={onSelect}
      restaurants={restaurants}
      userLocation={userLocation}
    />
  );
}

function GoogleRestaurantMap({
  activeRestaurant,
  apiKey,
  onReset,
  onSelect,
  restaurants,
  userLocation,
}: {
  activeRestaurant: MapRestaurant | null;
  apiKey: string;
  onReset: () => void;
  onSelect: (restaurant: MapRestaurant) => void;
  restaurants: MapRestaurant[];
  userLocation: UserLocation | null;
}) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const infoWindowRef = useRef<GoogleInfoWindow | null>(null);
  const markerRefs = useRef<GoogleMarker[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (cancelled || !mapElementRef.current) return;

        const map = new google.maps.Map(mapElementRef.current, {
          center: franceCenter,
          clickableIcons: false,
          disableDefaultUI: true,
          fullscreenControl: true,
          gestureHandling: "cooperative",
          mapTypeControl: false,
          streetViewControl: false,
          zoom: 6,
          zoomControl: true,
          styles: googleMapStyle,
        });

        mapRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow({ maxWidth: 320 });
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
      markerRefs.current.forEach((marker) => marker.setMap(null));
      markerRefs.current = [];
    };
  }, [apiKey]);

  useEffect(() => {
    const google = window.google;
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!google || !map || !infoWindow) return;

    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];

    const bounds = new google.maps.LatLngBounds();
    restaurants.forEach((restaurant) => {
      const marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        icon: {
          anchor: new google.maps.Point(16, 34),
          scaledSize: new google.maps.Size(32, 42),
          url: markerSvgDataUrl(activeRestaurant?.slug === restaurant.slug),
        },
        map,
        optimized: true,
        position: { lat: restaurant.mapLat, lng: restaurant.mapLng },
        title: restaurant.name,
      });

      marker.addListener("click", () => {
        onSelect(restaurant);
        infoWindow.setContent(infoWindowHtml(restaurant, userLocation));
        infoWindow.open({ anchor: marker, map });
      });

      markerRefs.current.push(marker);
      bounds.extend({ lat: restaurant.mapLat, lng: restaurant.mapLng });
    });

    if (userLocation) {
      bounds.extend(userLocation);
      const userMarker = new google.maps.Marker({
        icon: {
          anchor: new google.maps.Point(10, 10),
          scaledSize: new google.maps.Size(20, 20),
          url: userMarkerSvgDataUrl(),
        },
        map,
        position: userLocation,
        title: "Votre position",
      });
      markerRefs.current.push(userMarker);
    }

    if (restaurants.length > 1 || userLocation) {
      map.fitBounds(bounds, { bottom: 72, left: 72, right: 72, top: 72 });
    } else if (restaurants.length === 1) {
      map.setCenter({ lat: restaurants[0].mapLat, lng: restaurants[0].mapLng });
      map.setZoom(13);
    } else {
      map.setCenter(franceCenter);
      map.setZoom(6);
    }
  }, [activeRestaurant?.slug, onSelect, restaurants, userLocation]);

  useEffect(() => {
    const google = window.google;
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    if (!google || !map || !infoWindow || !activeRestaurant) return;

    const markerIndex = restaurants.findIndex((restaurant) => restaurant.slug === activeRestaurant.slug);
    const marker = markerRefs.current[markerIndex];
    map.panTo({ lat: activeRestaurant.mapLat, lng: activeRestaurant.mapLng });
    map.setZoom(14);

    if (marker) {
      infoWindow.setContent(infoWindowHtml(activeRestaurant, userLocation));
      infoWindow.open({ anchor: marker, map });
    }
  }, [activeRestaurant, restaurants, userLocation]);

  if (loadState === "error") {
    return (
      <FallbackTileRestaurantMap
        activeRestaurant={activeRestaurant}
        onCityFocus={() => undefined}
        onReset={onReset}
        onSelect={onSelect}
        restaurants={restaurants}
        userLocation={userLocation}
      />
    );
  }

  return (
    <div className="relative h-full min-h-[calc(100vh-6rem)] overflow-hidden bg-[#76c7df]">
      <div className="h-full min-h-[calc(100vh-6rem)]" ref={mapElementRef} />
      {loadState === "loading" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/80 text-sm font-black uppercase tracking-[0.14em] text-cacao">
          Chargement de la carte
        </div>
      ) : null}
      <div className="absolute left-4 top-4 z-20 max-w-[16rem] rounded-[3px] bg-white/95 px-3 py-2 text-xs font-bold text-black/70 shadow md:left-5 md:top-5">
        Carte Google Maps - glissez, zoomez, cliquez un repere
      </div>
      <button
        className="absolute bottom-4 left-4 z-20 rounded-[3px] border border-black/15 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-black shadow transition hover:bg-ember hover:text-white"
        onClick={onReset}
        type="button"
      >
        France
      </button>
    </div>
  );
}

function FallbackTileRestaurantMap({
  activeRestaurant,
  onCityFocus,
  onReset,
  onSelect,
  restaurants,
  userLocation,
}: {
  activeRestaurant: MapRestaurant | null;
  onCityFocus: (city: string) => void;
  onReset: () => void;
  onSelect: (restaurant: MapRestaurant) => void;
  restaurants: MapRestaurant[];
  userLocation: UserLocation | null;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; center: MapCenter } | null>(null);
  const [size, setSize] = useState<MapSize>({ width: 960, height: 620 });
  const [center, setCenter] = useState<MapCenter>(franceCenter);
  const [zoom, setZoom] = useState(6);
  const [previousTileLayer, setPreviousTileLayer] = useState<TileLayer | null>(null);

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

  const centerPoint = useMemo(() => project(center.lat, center.lng, zoom), [center, zoom]);

  const tiles = useMemo(
    () => getVisibleTiles(centerPoint, size, zoom),
    [centerPoint, size, zoom],
  );

  const setSmoothZoom = useCallback(
    (nextZoom: number) => {
      const clampedZoom = Math.min(Math.max(nextZoom, minZoom), maxZoom);
      if (clampedZoom === zoom) return;

      setPreviousTileLayer({ id: Date.now(), tiles });
      setZoom(clampedZoom);
    },
    [tiles, zoom],
  );

  useEffect(() => {
    if (!previousTileLayer) return;

    const timeout = window.setTimeout(() => setPreviousTileLayer(null), 420);
    return () => window.clearTimeout(timeout);
  }, [previousTileLayer]);

  useEffect(() => {
    if (!activeRestaurant) return;
    setCenter({ lat: activeRestaurant.mapLat, lng: activeRestaurant.mapLng });
    setSmoothZoom(13);
  }, [activeRestaurant, setSmoothZoom]);

  useEffect(() => {
    if (activeRestaurant || !userLocation) return;
    setCenter(userLocation);
    setSmoothZoom(10);
  }, [activeRestaurant, setSmoothZoom, userLocation]);

  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;

      event.preventDefault();
      setSmoothZoom(zoom + (event.deltaY < 0 ? 1 : -1));
    };

    mapElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => mapElement.removeEventListener("wheel", handleWheel);
  }, [setSmoothZoom, zoom]);

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

  const userScreenLocation = useMemo(() => {
    if (!userLocation) return null;
    const point = project(userLocation.lat, userLocation.lng, zoom);
    return {
      x: point.x - centerPoint.x + size.width / 2,
      y: point.y - centerPoint.y + size.height / 2,
    };
  }, [centerPoint, size, userLocation, zoom]);

  const screenClusters = useMemo(
    () => clusterScreenRestaurants(screenRestaurants, zoom),
    [screenRestaurants, zoom],
  );

  const activeScreenRestaurant = useMemo(
    () =>
      activeRestaurant
        ? screenRestaurants.find((restaurant) => restaurant.slug === activeRestaurant.slug) ?? null
        : null,
    [activeRestaurant, screenRestaurants],
  );

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
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClusterClick = (cluster: ScreenCluster) => {
    const cities = Array.from(new Set(cluster.restaurants.map((restaurant) => restaurant.city)));

    if (cluster.count === 1) {
      onSelect(cluster.restaurants[0]);
      return;
    }

    setCenter({ lat: cluster.mapLat, lng: cluster.mapLng });
    setSmoothZoom(zoom + 2);

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
      ref={mapRef}
    >
      {previousTileLayer ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-45 transition-opacity duration-[420ms]"
          key={previousTileLayer.id}
        >
          {previousTileLayer.tiles.map((tile) => (
            <img
              alt=""
              className="absolute h-64 w-64 select-none"
              draggable={false}
              key={`previous-${tile.key}`}
              src={tile.url}
              style={{ left: tile.left, top: tile.top }}
            />
          ))}
        </div>
      ) : null}
      {tiles.map((tile) => (
        <img
          alt=""
          className="absolute h-64 w-64 select-none transition-opacity duration-200"
          draggable={false}
          key={tile.key}
          src={tile.url}
          style={{ left: tile.left, top: tile.top }}
        />
      ))}

      <div
        className="absolute right-4 top-4 z-20 grid gap-2 md:right-5 md:top-5"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          className="h-11 w-11 rounded-[3px] border border-black/15 bg-white text-lg font-black text-black shadow transition hover:bg-ember hover:text-white"
          onClick={() => setSmoothZoom(zoom + 1)}
          type="button"
        >
          +
        </button>
        <button
          className="h-11 w-11 rounded-[3px] border border-black/15 bg-white text-lg font-black text-black shadow transition hover:bg-ember hover:text-white"
          onClick={() => setSmoothZoom(zoom - 1)}
          type="button"
        >
          -
        </button>
        <button
          className="rounded-[3px] border border-black/15 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-black shadow transition hover:bg-ember hover:text-white"
          onClick={() => {
            setPreviousTileLayer({ id: Date.now(), tiles });
            setCenter(franceCenter);
            setZoom(6);
            onReset();
          }}
          type="button"
        >
          France
        </button>
      </div>

      <div className="absolute left-4 top-4 z-20 max-w-[14rem] rounded-[3px] bg-white/90 px-3 py-2 text-xs font-bold text-black/70 shadow md:left-5 md:top-5">
        Ctrl + molette pour zoomer
      </div>

      {userScreenLocation ? (
        <div
          className="absolute z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cacao shadow-[0_0_0_8px_rgba(42,21,17,0.16)]"
          style={{ left: userScreenLocation.x, top: userScreenLocation.y }}
          title="Votre position"
        />
      ) : null}

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
              onPointerDown={(event) => event.stopPropagation()}
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

      {activeScreenRestaurant ? (
        <div
          className="absolute z-30 w-[min(20rem,calc(100%-2rem))] -translate-x-1/2 rounded-[6px] border border-black/15 bg-white p-4 text-black shadow-[0_18px_45px_rgba(42,21,17,0.22)]"
          onPointerDown={(event) => event.stopPropagation()}
          style={{
            left: Math.min(Math.max(activeScreenRestaurant.screenX, 164), size.width - 164),
            top: Math.min(Math.max(activeScreenRestaurant.screenY - 168, 18), size.height - 260),
          }}
        >
          <button
            aria-label="Fermer la fiche restaurant"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-black/50 transition hover:bg-black/5 hover:text-black"
            onClick={onReset}
            type="button"
          >
            x
          </button>
          <p className="pr-8 text-[10px] font-black uppercase tracking-[0.16em] text-ember">
            {activeScreenRestaurant.city}
            {userLocation ? ` - ${formatDistance(distanceKm(userLocation, activeScreenRestaurant))}` : ""}
          </p>
          <h3 className="mt-1 text-lg font-black leading-tight">
            {activeScreenRestaurant.name}
          </h3>
          <p className="mt-3 text-sm font-medium leading-5 text-black/75">
            {activeScreenRestaurant.address}
            <br />
            {[activeScreenRestaurant.postalCode, activeScreenRestaurant.city]
              .filter(Boolean)
              .join(", ")}
            {activeScreenRestaurant.phone ? (
              <>
                <br />
                {activeScreenRestaurant.phone}
              </>
            ) : null}
          </p>
          <p className="mt-3 text-sm font-bold text-black/70">{activeScreenRestaurant.hours}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              className="rounded-[3px] bg-ember px-3 py-2 text-xs font-black text-white transition hover:bg-cacao"
              href={`/restaurants/${slugCity(activeScreenRestaurant.city)}/${activeScreenRestaurant.slug}`}
            >
              Voir la fiche
            </Link>
            <Link
              className="rounded-[3px] border border-ember px-3 py-2 text-xs font-black text-ember transition hover:bg-ember hover:text-white"
              href={directionsUrl(activeScreenRestaurant)}
              target="_blank"
            >
              Itineraire
            </Link>
          </div>
        </div>
      ) : null}

      {restaurants.length === 0 ? (
        <div className="absolute left-1/2 top-1/2 z-20 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[6px] border border-black/15 bg-white p-5 text-center text-sm font-bold text-black/70 shadow">
          Aucun resultat a afficher sur la carte.
        </div>
      ) : null}

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

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsNamespace> {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (window.__googleMapsStoreLocatorPromise) {
    return window.__googleMapsStoreLocatorPromise;
  }

  window.__googleMapsStoreLocatorPromise = new Promise((resolve, reject) => {
    const callbackName = `initFlamsStoreLocatorMap_${Date.now()}`;
    const script = document.createElement("script");

    window[callbackName as keyof Window] = (() => {
      delete window[callbackName as keyof Window];
      if (window.google?.maps) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps unavailable"));
      }
    }) as never;

    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Google Maps script failed"));
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}&v=weekly`;
    document.head.appendChild(script);
  });

  return window.__googleMapsStoreLocatorPromise;
}

function infoWindowHtml(restaurant: MapRestaurant, userLocation: UserLocation | null) {
  const distance = userLocation ? `<p style="margin:6px 0 0;color:#d4471d;font-weight:900;text-transform:uppercase;font-size:11px;letter-spacing:.08em">A ${formatDistance(distanceKm(userLocation, restaurant))}</p>` : "";
  const phone = restaurant.phone ? `<p style="margin:8px 0 0;color:#2a1511;font-weight:700">${escapeHtml(restaurant.phone)}</p>` : "";
  const address = [restaurant.postalCode, restaurant.city].filter(Boolean).join(", ");

  return `
    <div style="font-family:Arial,sans-serif;max-width:280px;color:#2a1511">
      <p style="margin:0;color:#d4471d;font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase">${escapeHtml(restaurant.city)}</p>
      <h3 style="margin:4px 0 0;font-size:18px;line-height:1.15;font-weight:900">${escapeHtml(restaurant.name)}</h3>
      ${distance}
      <p style="margin:10px 0 0;color:rgba(42,21,17,.75);font-weight:700;line-height:1.35">${escapeHtml(restaurant.address)}<br>${escapeHtml(address)}</p>
      ${phone}
      <p style="margin:10px 0 0;color:rgba(42,21,17,.72);font-weight:700;line-height:1.35">${escapeHtml(restaurant.hours)}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
        <a style="background:#d4471d;color:white;padding:10px 12px;border-radius:3px;text-decoration:none;font-weight:900;font-size:12px" href="/restaurants/${slugCity(restaurant.city)}/${restaurant.slug}">Voir la fiche</a>
        <a style="border:1px solid #d4471d;color:#d4471d;padding:9px 12px;border-radius:3px;text-decoration:none;font-weight:900;font-size:12px" href="${directionsUrl(restaurant)}" target="_blank" rel="noreferrer">Itineraire</a>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function markerSvgDataUrl(active: boolean) {
  const fill = active ? "#2a1511" : "#d4471d";
  const svg = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 41C16 41 30 25.8 30 15.8C30 7.6 23.7 1 16 1C8.3 1 2 7.6 2 15.8C2 25.8 16 41 16 41Z" fill="${fill}" stroke="#fff7df" stroke-width="3"/>
      <circle cx="16" cy="16" r="5.5" fill="#fff7df"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function userMarkerSvgDataUrl() {
  const svg = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="#2a1511" stroke="#fff" stroke-width="4"/>
      <circle cx="10" cy="10" r="10" fill="#2a1511" fill-opacity=".16"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const googleMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f2ead9" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a332c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fff7df" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b89a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#dccdb4" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f4c48c" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#dc8d4d" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#78c9df" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#376f7f" }] },
];

function getVisibleTiles(centerPoint: { x: number; y: number }, size: MapSize, zoom: number) {
  const tiles: Tile[] = [];
  const startX = Math.floor((centerPoint.x - size.width / 2) / tileSize) - 1;
  const endX = Math.floor((centerPoint.x + size.width / 2) / tileSize) + 1;
  const startY = Math.floor((centerPoint.y - size.height / 2) / tileSize) - 1;
  const endY = Math.floor((centerPoint.y + size.height / 2) / tileSize) + 1;
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

function distanceKm(from: UserLocation, restaurant: MapRestaurant) {
  const earthRadiusKm = 6371;
  const dLat = toRad(restaurant.mapLat - from.lat);
  const dLng = toRad(restaurant.mapLng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(restaurant.mapLat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function formatDistance(distance: number) {
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  if (distance < 10) return `${distance.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(distance)} km`;
}

function directionsUrl(restaurant: MapRestaurant) {
  return (
    restaurant.googleMapsUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${restaurant.mapLat},${restaurant.mapLng}`
  );
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
