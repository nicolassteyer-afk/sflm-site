import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@flams.fr";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-now";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin Flam's",
      passwordHash: hashPassword(adminPassword),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      siteName: "Flam's",
      globalDescription:
        "Tables chaudes, recettes partagees, adresses vivantes. Flam's rassemble les grandes tablees autour d'une carte simple, chaude et genereuse.",
      contactEmail: "contact@flams.fr",
      globalReservationUrl: "/reservation",
      lightLogo: "/assets/flams/logo-beige.svg",
      darkLogo: "/assets/flams/logo-bdx.png",
      defaultOgImage: "/assets/flams/table-partage.png",
    },
  });

  const page = await prisma.page.upsert({
    where: { slug: "accueil" },
    update: {},
    create: {
      internalTitle: "Accueil",
      displayTitle: "Restaurant de grandes tables",
      slug: "accueil",
      metaTitle: "Flam's - Tables chaudes et grandes soirees",
      metaDescription:
        "Site vitrine Flam's premium, chaleureux et immersif, avec restaurants, carte et reservations.",
      status: "PUBLISHED",
      displayOrder: 1,
    },
  });

  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: page.id,
        type: "HERO",
        title: "Flam's",
        subtitle: "Restaurant de grandes tables",
        body: "Un lieu chaud, direct, joyeux. On vient pour manger, on reste pour la table, le bruit, les verres et les copains.",
        image: "/assets/flams/table-flam.png",
        ctaLabel: "Reserver",
        ctaUrl: "/reservation",
        variant: "dark",
        displayOrder: 1,
      },
      {
        pageId: page.id,
        type: "BRAND_SECTION",
        title: "Une maison qui chauffe la salle avant meme l'assiette.",
        body: "Lumiere basse, bois, grandes tables et service vif. Le rythme de lecture est chaud, premium et editorial.",
        image: "/assets/flams/table-partage.png",
        displayOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  const navItems = [
    ["Carte", "/menu", 1, false],
    ["Restaurants", "/restaurants", 2, false],
    ["Recrutement", "/recrutement", 3, false],
    ["Contact", "/contact", 4, false],
    ["Reserver", "/reservation", 5, true],
  ] as const;

  for (const [label, url, displayOrder, isPrimaryCta] of navItems) {
    await prisma.navigationItem.upsert({
      where: { id: `seed-${label.toLowerCase()}` },
      update: { label, url, displayOrder, isPrimaryCta, isVisible: true },
      create: { id: `seed-${label.toLowerCase()}`, label, url, displayOrder, isPrimaryCta, isVisible: true },
    });
  }

  const restaurants = [
    ["Flam's Montparnasse", "Paris", "montparnasse", "Paris Montparnasse", "/assets/flams/annonce-da.png"],
    ["Flam's Saint-Lazare", "Paris", "saint-lazare", "Paris Saint-Lazare", "/assets/flams/punchline-vin-retrouvailles.jpg"],
    ["Flam's Begles", "Bordeaux", "begles", "Begles", "/assets/flams/table-partage.png"],
    ["Flam's Presqu'ile", "Lyon", "presquile", "4 rue du Four, 69002 Lyon", "/assets/flams/flamme-beige.png"],
    ["Flam's Place d'Austerlitz", "Strasbourg", "place-austerlitz", "Place d'Austerlitz, Strasbourg", "/assets/flams/dragon-beige.png"],
  ] as const;

  for (const [name, city, slug, address, mainImage] of restaurants) {
    const restaurant = await prisma.restaurant.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        city,
        slug,
        address,
        country: "France",
        mainImage,
        shortDescription: "Grande table, service vif, ambiance chaude.",
        longDescription:
          "Une adresse Flam's faite pour les grandes tablees, les recettes a partager et les soirees qui s'installent.",
        services: ["sur place", "groupes", "anniversaire"],
        isActive: true,
      },
    });

    const existingHours = await prisma.restaurantHours.count({ where: { restaurantId: restaurant.id } });
    if (existingHours === 0) {
      await prisma.restaurantHours.createMany({
        data: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"].map((day, index) => ({
          restaurantId: restaurant.id,
          day,
          opensAt: "12:00",
          closesAt: "23:30",
          displayOrder: index,
        })),
      });
    }
  }

  const categoryData = [
    ["Flammes", "flammes", "Des recettes fines, croustillantes, posees au centre.", 1],
    ["Boissons", "boissons", "Bieres, vins et bulles pour tenir la conversation.", 2],
    ["Desserts", "desserts", "Le dernier morceau qu'on pretend ne pas vouloir.", 3],
    ["Groupes", "groupes", "Des offres faites pour reserver nombreux.", 4],
    ["Offres speciales", "offres-speciales", "Temps forts, nouveautes et editions limitees.", 5],
  ] as const;

  for (const [name, slug, description, displayOrder] of categoryData) {
    await prisma.menuCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description, displayOrder, isActive: true },
    });
  }

  const flammes = await prisma.menuCategory.findUniqueOrThrow({ where: { slug: "flammes" } });
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: flammes.id,
        name: "Classique",
        description: "Creme, oignons, lardons fumes.",
        price: 10.9,
        tags: ["populaire", "a partager"],
        displayOrder: 1,
      },
      {
        categoryId: flammes.id,
        name: "Forestiere",
        description: "Champignons, herbes, fromage fondu.",
        price: 12.5,
        tags: ["populaire"],
        displayOrder: 2,
      },
      {
        categoryId: flammes.id,
        name: "Legumes rotis",
        description: "Legumes rotis, pointe de piment.",
        price: 11.9,
        tags: ["vegetarien", "epice"],
        displayOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  const cityColumn = await prisma.footerColumn.upsert({
    where: { id: "footer-villes" },
    update: {},
    create: { id: "footer-villes", title: "Villes", displayOrder: 1 },
  });
  const legalColumn = await prisma.footerColumn.upsert({
    where: { id: "footer-liens" },
    update: {},
    create: { id: "footer-liens", title: "Liens", displayOrder: 2 },
  });

  for (const [label, url, columnId, order] of [
    ["Paris", "/restaurants/paris", cityColumn.id, 1],
    ["Bordeaux", "/restaurants/bordeaux", cityColumn.id, 2],
    ["Strasbourg", "/restaurants/strasbourg", cityColumn.id, 3],
    ["Contact", "/contact", legalColumn.id, 1],
    ["Recrutement", "/recrutement", legalColumn.id, 2],
    ["Credits", "/credits", legalColumn.id, 3],
  ] as const) {
    await prisma.footerLink.upsert({
      where: { id: `footer-${label.toLowerCase()}` },
      update: { label, url, columnId, displayOrder: order },
      create: { id: `footer-${label.toLowerCase()}`, label, url, columnId, displayOrder: order },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
