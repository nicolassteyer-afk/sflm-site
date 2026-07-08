import { unstable_noStore as noStore } from "next/cache";
import { allCities, allRestaurants, countries } from "@/data/restaurants";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

export type PublicMenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  items: {
    id: string;
    name: string;
    description?: string | null;
    price?: string | null;
    image?: string | null;
    tags: string[];
    allergens: string[];
  }[];
};

export type PublicRestaurant = {
  slug: string;
  name: string;
  city: string;
  country: string;
  address: string;
  postalCode?: string | null;
  phone?: string | null;
  reservationUrl?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hours: string;
  mood: string;
  heroTone: string;
  mediaSrc: string;
};

export async function getDashboardStats() {
  noStore();
  if (!hasDatabaseUrl()) {
    return {
      pages: 0,
      restaurants: allRestaurants.length,
      products: 0,
      recent: [],
    };
  }

  const prisma = getPrisma();
  const [pages, restaurants, products, recentPages, recentRestaurants] = await Promise.all([
    prisma.page.count(),
    prisma.restaurant.count({ where: { isActive: true } }),
    prisma.menuItem.count({ where: { isActive: true } }),
    prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { id: true, internalTitle: true, updatedAt: true, status: true },
    }),
    prisma.restaurant.findMany({
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { id: true, name: true, updatedAt: true, isActive: true },
    }),
  ]);

  return {
    pages,
    restaurants,
    products,
    recent: [
      ...recentPages.map((item) => ({
        id: item.id,
        title: item.internalTitle,
        type: "Page",
        status: item.status,
        updatedAt: item.updatedAt,
      })),
      ...recentRestaurants.map((item) => ({
        id: item.id,
        title: item.name,
        type: "Restaurant",
        status: item.isActive ? "PUBLISHED" : "DRAFT",
        updatedAt: item.updatedAt,
      })),
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6),
  };
}

export async function getPublicMenu(): Promise<PublicMenuCategory[]> {
  noStore();
  if (!hasDatabaseUrl()) {
    return [
      {
        id: "flammes",
        name: "Flammes",
        slug: "flammes",
        description: "Des recettes fines, croustillantes, posees au centre.",
        items: [
          { id: "classic", name: "Classique", description: "Creme, oignons, lardons fumes", price: null, tags: [], allergens: [] },
          { id: "mushroom", name: "Forestiere", description: "Champignons, herbes, fromage fondu", price: null, tags: [], allergens: [] },
          { id: "veggie", name: "Legumes rotis", description: "Legumes rotis, pointe de piment", price: null, tags: ["vegetarien"], allergens: [] },
        ],
      },
      {
        id: "boissons",
        name: "Boissons",
        slug: "boissons",
        description: "Bieres, vins et bulles pour tenir la conversation.",
        items: [
          { id: "white", name: "Blanc vif", description: "Verre frais et direct", price: null, tags: [], allergens: [] },
          { id: "red", name: "Rouge croquant", description: "Vin rouge leger", price: null, tags: [], allergens: [] },
        ],
      },
    ];
  }

  const categories = await getPrisma().menuCategory.findMany({
    where: { isActive: true },
    include: { items: { where: { isActive: true }, orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price?.toString() ?? null,
      image: item.image,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      allergens: Array.isArray(item.allergens) ? item.allergens.map(String) : [],
    })),
  }));
}

export async function getPublicCities() {
  noStore();
  if (!hasDatabaseUrl()) return allCities;

  const restaurants = await getPrisma().restaurant.findMany({
    where: { isActive: true },
    orderBy: [{ city: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
  });

  if (restaurants.length === 0) return allCities;

  const cityMap = new Map<string, typeof allCities[number]>();
  for (const restaurant of restaurants) {
    const slug = restaurant.city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    const existing = cityMap.get(slug);
    const convertedRestaurant = {
      slug: restaurant.slug,
      name: restaurant.name,
      city: restaurant.city,
      country: restaurant.country,
      address: restaurant.address,
      hours: restaurant.shortDescription ?? "Horaires a confirmer",
      mood: restaurant.shortDescription ?? "Grande table, service vif.",
      heroTone: "from-wine via-cacao to-ember",
      mediaSrc: restaurant.mainImage ?? "/assets/flams/table-partage.png",
    };

    if (existing) {
      existing.restaurants.push(convertedRestaurant);
    } else {
      cityMap.set(slug, {
        slug,
        name: restaurant.city,
        country: restaurant.country,
        headline: `Les tables Flam's a ${restaurant.city}`,
        previewTone: "from-wine via-cacao to-ember",
        restaurants: [convertedRestaurant],
      });
    }
  }

  return Array.from(cityMap.values());
}

export async function getPublicRestaurants(): Promise<PublicRestaurant[]> {
  noStore();
  if (!hasDatabaseUrl()) {
    return allRestaurants.map((restaurant) => ({
      ...restaurant,
      postalCode: null,
      reservationUrl: null,
      googleMapsUrl: null,
      latitude: null,
      longitude: null,
    }));
  }

  const restaurants = await getPrisma().restaurant.findMany({
    where: { isActive: true },
    orderBy: [{ city: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
  });

  if (restaurants.length === 0) return getPublicRestaurantsFallback();

  return restaurants.map((restaurant) => ({
    slug: restaurant.slug,
    name: restaurant.name,
    city: restaurant.city,
    country: restaurant.country,
    address: restaurant.address,
    postalCode: restaurant.postalCode,
    phone: restaurant.phone,
    reservationUrl: restaurant.reservationUrl,
    googleMapsUrl: restaurant.googleMapsUrl,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    hours: restaurant.shortDescription ?? "Horaires a confirmer",
    mood: restaurant.shortDescription ?? "Grande table, service vif.",
    heroTone: "from-wine via-cacao to-ember",
    mediaSrc: restaurant.mainImage ?? "/assets/flams/table-partage.png",
  }));
}

function getPublicRestaurantsFallback(): PublicRestaurant[] {
  return allRestaurants.map((restaurant) => ({
    ...restaurant,
    postalCode: null,
    reservationUrl: null,
    googleMapsUrl: null,
    latitude: null,
    longitude: null,
  }));
}

export async function getPublicCountries() {
  const publicCities = await getPublicCities();
  if (!hasDatabaseUrl()) return countries;

  const grouped = new Map<string, typeof publicCities>();
  for (const city of publicCities) {
    grouped.set(city.country, [...(grouped.get(city.country) ?? []), city]);
  }

  return Array.from(grouped.entries()).map(([name, cityList]) => ({
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    cities: cityList,
  }));
}

export async function getPublicFooter() {
  noStore();
  if (!hasDatabaseUrl()) return null;

  const [settings, columns] = await Promise.all([
    getPrisma().siteSettings.findUnique({
      where: { id: "site" },
      select: { globalDescription: true },
    }),
    getPrisma().footerColumn.findMany({
      select: {
        id: true,
        title: true,
        links: {
          orderBy: { displayOrder: "asc" },
          select: { id: true, label: true, url: true, openInNewTab: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return { settings, columns };
}
