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
      slug: "montparnasse",
      name: "Flam's Montparnasse",
      city: "Paris",
      country: "France",
      address: "Paris Montparnasse",
      hours: "Tous les jours, 12h - 23h30",
      mood: "Grande salle, service vif, tables qui s'allongent.",
      heroTone: "from-wine via-cacao to-ember",
      mediaSrc: flamAssets.frise,
    },
    {
      slug: "saint-lazare",
      name: "Flam's Saint-Lazare",
      city: "Paris",
      country: "France",
      address: "Paris Saint-Lazare",
      hours: "Lundi au samedi, 12h - 00h",
      mood: "Adresse plus intime, lumiere basse et verres qui tournent.",
      heroTone: "from-cacao via-wine to-saffron",
      mediaSrc: flamAssets.vin,
    },
    {
      slug: "chatelet",
      name: "Flam's Chatelet",
      city: "Paris",
      country: "France",
      address: "Paris Chatelet",
      hours: "Tous les jours, 12h - 00h",
      mood: "Une table centrale, vive et genereuse.",
      heroTone: "from-wine via-ember to-saffron",
      mediaSrc: flamAssets.biere,
    },
  ],
  bordeaux: [
    {
      slug: "begles",
      name: "Flam's Begles",
      city: "Bordeaux",
      country: "France",
      address: "Begles",
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
  strasbourg: [
    {
      slug: "place-austerlitz",
      name: "Flam's Place d'Austerlitz",
      city: "Strasbourg",
      country: "France",
      address: "Place d'Austerlitz, Strasbourg",
      hours: "Tous les jours, 11h30 - 23h",
      mood: "Clin d'oeil alsacien, version contemporaine.",
      heroTone: "from-wine via-cacao to-bone",
      mediaSrc: flamAssets.dragon,
    },
    {
      slug: "rue-des-freres",
      name: "Flam's Rue des Freres",
      city: "Strasbourg",
      country: "France",
      address: "Rue des Freres, Strasbourg",
      hours: "Tous les jours, 11h30 - 23h",
      mood: "Une adresse vive au coeur de Strasbourg.",
      heroTone: "from-cacao via-wine to-bone",
      mediaSrc: flamAssets.flamme,
    },
  ],
  "thonon-les-bains": [
    {
      slug: "thonon-les-bains",
      name: "Flam's Thonon-les-Bains",
      city: "Thonon-les-Bains",
      country: "France",
      address: "Thonon-les-Bains",
      hours: "Tous les jours, 12h - 23h",
      mood: "Une table chaude entre lac et montagne.",
      heroTone: "from-cacao via-wine to-ember",
      mediaSrc: flamAssets.planche,
    },
  ],
  arras: [
    {
      slug: "arras",
      name: "Flam's Arras",
      city: "Arras",
      country: "France",
      address: "Arras",
      hours: "Tous les jours, 12h - 23h",
      mood: "Une adresse conviviale au rythme des grandes tables.",
      heroTone: "from-wine via-cacao to-saffron",
      mediaSrc: flamAssets.fut,
    },
  ],
  selestat: [
    {
      slug: "selestat",
      name: "Flam's Selestat",
      city: "Selestat",
      country: "France",
      address: "Selestat",
      hours: "Tous les jours, 12h - 23h",
      mood: "L'Alsace a table, genereuse et sans chichi.",
      heroTone: "from-wine via-cacao to-bone",
      mediaSrc: flamAssets.dragon,
    },
  ],
  nantes: [
    {
      slug: "nantes",
      name: "Flam's Nantes",
      city: "Nantes",
      country: "France",
      address: "Nantes",
      hours: "Tous les jours, 12h - 23h",
      mood: "Une salle vivante pour les tables qui debordent.",
      heroTone: "from-cacao via-ember to-wine",
      mediaSrc: flamAssets.biere,
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
      "strasbourg",
      "thonon-les-bains",
      "arras",
      "selestat",
      "nantes",
    ].map((slug) => cityFactory(slug, "France")),
  },
];

function cityFactory(slug: string, country: string): City {
  const names: Record<string, string> = {
    paris: "Paris",
    bordeaux: "Bordeaux",
    lyon: "Lyon",
    lille: "Lille",
    strasbourg: "Strasbourg",
    "thonon-les-bains": "Thonon-les-Bains",
    arras: "Arras",
    selestat: "Selestat",
    nantes: "Nantes",
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
    strasbourg: "from-wine via-cacao to-bone",
    "thonon-les-bains": "from-cacao via-wine to-ember",
    arras: "from-wine via-cacao to-saffron",
    selestat: "from-wine via-cacao to-bone",
    nantes: "from-cacao via-ember to-wine",
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
