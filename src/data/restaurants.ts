export type Restaurant = {
  slug: string;
  name: string;
  city: string;
  country: string;
  address: string;
  hours: string;
  mood: string;
  heroTone: string;
  mediaSrc: string;
};

export type City = {
  slug: string;
  name: string;
  country: string;
  headline: string;
  previewTone: string;
  restaurants: Restaurant[];
};

const flamAssets = {
  biere: "/assets/flams/biere-flams.png",
  dragon: "/assets/flams/dragon-beige.png",
  flamme: "/assets/flams/flamme-beige.png",
  frise: "/assets/flams/annonce-da.png",
  fut: "/assets/flams/table-flam.png",
  planche: "/assets/flams/table-partage.png",
  vin: "/assets/flams/punchline-vin-retrouvailles.jpg",
};

export type Country = {
  slug: string;
  name: string;
  cities: City[];
};

const restaurantsByCity: Record<string, Restaurant[]> = {
  paris: [
    {
      slug: "grand-boulevard",
      name: "Flam's Grand Boulevard",
      city: "Paris",
      country: "France",
      address: "12 rue des Tables, 75002 Paris",
      hours: "Tous les jours, 12h - 23h30",
      mood: "Grande salle, service vif, tables qui s'allongent.",
      heroTone: "from-wine via-cacao to-ember",
      mediaSrc: flamAssets.frise,
    },
    {
      slug: "rive-gauche",
      name: "Flam's Rive Gauche",
      city: "Paris",
      country: "France",
      address: "8 passage des Copains, 75006 Paris",
      hours: "Lundi au samedi, 12h - 00h",
      mood: "Adresse plus intime, lumiere basse et verres qui tournent.",
      heroTone: "from-cacao via-wine to-saffron",
      mediaSrc: flamAssets.vin,
    },
  ],
  bordeaux: [
    {
      slug: "chartrons",
      name: "Flam's Chartrons",
      city: "Bordeaux",
      country: "France",
      address: "21 quai des Soirees, 33000 Bordeaux",
      hours: "Mardi au dimanche, 12h - 23h",
      mood: "Bois sombre, banquettes chaudes, grandes tablees.",
      heroTone: "from-wine via-ember to-cacao",
      mediaSrc: flamAssets.planche,
    },
  ],
  lyon: [
    {
      slug: "presquile",
      name: "Flam's Presqu'ile",
      city: "Lyon",
      country: "France",
      address: "4 rue du Four, 69002 Lyon",
      hours: "Tous les jours, 11h30 - 23h30",
      mood: "Le midi file, le soir s'attarde.",
      heroTone: "from-cacao via-wine to-ember",
      mediaSrc: flamAssets.flamme,
    },
  ],
  lille: [
    {
      slug: "vieux-lille",
      name: "Flam's Vieux Lille",
      city: "Lille",
      country: "France",
      address: "17 rue des Braises, 59000 Lille",
      hours: "Mercredi au dimanche, 12h - 00h",
      mood: "Brut, chaleureux, parfait pour arriver nombreux.",
      heroTone: "from-wine via-cacao to-saffron",
      mediaSrc: flamAssets.biere,
    },
  ],
  nice: [
    {
      slug: "massena",
      name: "Flam's Massena",
      city: "Nice",
      country: "France",
      address: "3 avenue des Tables, 06000 Nice",
      hours: "Tous les jours, 12h - 23h",
      mood: "Energie sud, aperitif long, plats partages.",
      heroTone: "from-saffron via-ember to-wine",
      mediaSrc: flamAssets.flamme,
    },
  ],
  marseille: [
    {
      slug: "panier",
      name: "Flam's Panier",
      city: "Marseille",
      country: "France",
      address: "10 montee des Flammes, 13002 Marseille",
      hours: "Jeudi au lundi, 12h - 00h",
      mood: "Texture pierre, feu franc, esprit de bande.",
      heroTone: "from-cacao via-ember to-wine",
      mediaSrc: flamAssets.planche,
    },
  ],
  strasbourg: [
    {
      slug: "cathedrale",
      name: "Flam's Cathedrale",
      city: "Strasbourg",
      country: "France",
      address: "6 rue du Levain, 67000 Strasbourg",
      hours: "Tous les jours, 11h30 - 23h",
      mood: "Clin d'oeil alsacien, version contemporaine.",
      heroTone: "from-wine via-cacao to-bone",
      mediaSrc: flamAssets.dragon,
    },
  ],
  bruxelles: [
    {
      slug: "sainte-catherine",
      name: "Flam's Sainte-Catherine",
      city: "Bruxelles",
      country: "Belgique",
      address: "14 place des Braises, 1000 Bruxelles",
      hours: "Mardi au dimanche, 12h - 23h",
      mood: "Restaurant compact, vivant, ouvert aux longues soirees.",
      heroTone: "from-cacao via-wine to-ember",
      mediaSrc: flamAssets.fut,
    },
  ],
  londres: [
    {
      slug: "shoreditch",
      name: "Flam's Shoreditch",
      city: "Londres",
      country: "Royaume-Uni",
      address: "29 Ember Lane, London E1",
      hours: "Wednesday to Sunday, 12pm - 11pm",
      mood: "Warm room, sharp drinks, late table energy.",
      heroTone: "from-ink via-cacao to-ember",
      mediaSrc: flamAssets.vin,
    },
  ],
};

export const countries: Country[] = [
  {
    slug: "france",
    name: "France",
    cities: [
      "paris",
      "bordeaux",
      "lyon",
      "lille",
      "nice",
      "marseille",
      "strasbourg",
    ].map((slug) => cityFactory(slug, "France")),
  },
  {
    slug: "belgique",
    name: "Belgique",
    cities: ["bruxelles"].map((slug) => cityFactory(slug, "Belgique")),
  },
  {
    slug: "royaume-uni",
    name: "Royaume-Uni",
    cities: ["londres"].map((slug) => cityFactory(slug, "Royaume-Uni")),
  },
];

function cityFactory(slug: string, country: string): City {
  const names: Record<string, string> = {
    paris: "Paris",
    bordeaux: "Bordeaux",
    lyon: "Lyon",
    lille: "Lille",
    nice: "Nice",
    marseille: "Marseille",
    strasbourg: "Strasbourg",
    bruxelles: "Bruxelles",
    londres: "Londres",
  };

  return {
    slug,
    name: names[slug],
    country,
    headline: `Les tables Flam's a ${names[slug]}`,
    previewTone: cityTone(slug),
    restaurants: restaurantsByCity[slug],
  };
}

function cityTone(slug: string) {
  const tones: Record<string, string> = {
    paris: "from-wine via-ember to-saffron",
    bordeaux: "from-cacao via-wine to-ember",
    lyon: "from-ink via-cacao to-wine",
    lille: "from-wine via-cacao to-saffron",
    nice: "from-saffron via-ember to-wine",
    marseille: "from-cacao via-ember to-saffron",
    strasbourg: "from-wine via-cacao to-bone",
    bruxelles: "from-cacao via-wine to-ember",
    londres: "from-ink via-wine to-ember",
  };
  return tones[slug] ?? "from-wine via-cacao to-ember";
}

export const allCities = countries.flatMap((country) => country.cities);
export const allRestaurants = allCities.flatMap((city) => city.restaurants);

export function getCity(slug: string) {
  return allCities.find((city) => city.slug === slug);
}

export function getRestaurant(citySlug: string, restaurantSlug: string) {
  return getCity(citySlug)?.restaurants.find(
    (restaurant) => restaurant.slug === restaurantSlug,
  );
}
