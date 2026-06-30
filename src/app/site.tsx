"use client";

import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Restaurant = {
  name: string;
  slug: string;
  city: string;
  address: string;
  mood: string;
};

type City = {
  name: string;
  slug: string;
  headline: string;
  restaurants: Restaurant[];
  tone: string;
};

const youtubeEmbed =
  "https://www.youtube.com/embed/0pPdjm650bo?autoplay=1&mute=1&loop=1&playlist=0pPdjm650bo&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3";

const cities: City[] = [
  city("Paris", ["Grand Boulevard", "Rive Gauche"], "La table qui allonge les soirees."),
  city("Bordeaux", ["Chartrons"], "Feu doux, bois sombre, verres qui circulent."),
  city("Lyon", ["Presqu'ile"], "Une adresse vive pour midi comme pour tard."),
  city("Lille", ["Vieux Lille"], "Grande tablée, grande faim, grande chaleur."),
  city("Nice", ["Massena"], "Le Sud en version Flam's, direct et solaire."),
  city("Marseille", ["Panier"], "Pierre, braise et repas qui debordent."),
  city("Strasbourg", ["Cathedrale"], "La racine alsacienne, en version contemporaine."),
  city("Bruxelles", ["Sainte-Catherine"], "Compact, vivant, parfait pour revenir nombreux."),
  city("Londres", ["Shoreditch"], "Warm room, sharp drinks, late table energy."),
];

const mainLinks = [
  ["La carte", "/menu"],
  ["Restaurants", "/restaurants"],
  ["Recrutement", "/recrutement"],
  ["A propos", "/a-propos"],
  ["Contact", "/contact"],
];

export function Site({ slug }: { slug: string[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = slug[0] ?? "home";
  const currentCity = page === "restaurants" ? cities.find((item) => item.slug === slug[1]) : undefined;
  const currentRestaurant = currentCity?.restaurants.find((item) => item.slug === slug[2]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Header onOpen={() => setMenuOpen(true)} />
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        {page === "home" || page === "en" ? (
          <Home />
        ) : currentCity && currentRestaurant ? (
          <RestaurantPage cityItem={currentCity} restaurant={currentRestaurant} />
        ) : currentCity ? (
          <CityPage cityItem={currentCity} />
        ) : page === "restaurants" ? (
          <RestaurantsPage />
        ) : (
          <InteriorPage page={page} />
        )}
      </main>
      {currentRestaurant ? <FloatingMenuButton /> : null}
      <Footer />
    </>
  );
}

function Header({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-cacao/80 px-5 py-5 text-bone backdrop-blur-md md:px-10 lg:px-16">
      <button
        className="rounded-full border border-bone/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao"
        onClick={onOpen}
      >
        Menu
      </button>
      <Link className="justify-self-center font-display text-5xl uppercase leading-none" href="/">
        Flam's
      </Link>
      <Link
        className="rounded-full border border-bone/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-ember hover:text-bone"
        href="/reservation"
      >
        Reserver
      </Link>
    </header>
  );
}

function Home() {
  return (
    <>
      <Hero
        eyebrow="Restaurant de grandes tables"
        title="Flam's"
        body="Un lieu chaud, direct, joyeux. On vient pour manger, on reste pour la table, le bruit, les verres et les copains."
        ctaHref="/reservation"
        ctaLabel="Reserver"
      />
      <VideoSection />
      <Editorial
        eyebrow="L'esprit"
        title="Une maison qui chauffe la salle avant meme l'assiette."
        body="Faux contenu pour visualiser l'architecture : lumiere basse, bois, braise suggeree, grandes tables et service vif. Les vrais textes viendront ensuite, mais le rythme de lecture est en place."
      />
      <SplitSection
        eyebrow="La carte"
        title="Simple. chaud. a partager."
        body="Des flammes signatures, des boissons qui suivent, des desserts pour prolonger. Ici on posera la vraie carte avec les categories, les prix et les favoris."
        label="Carte Flam's"
        href="/menu"
      />
      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">Bientot</p>
            <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">Le store locator arrive ici.</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-cacao/65">
            Cette zone remplacera la liste des restaurants : recherche par ville, filtres, carte et acces rapide aux reservations.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}

function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20 text-bone md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">La video</p>
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">Le feu en vrai.</h2>
          <p className="mt-7 max-w-md text-lg leading-8 text-bone/65">
            La video YouTube est integree pour donner de la vie au site pendant que les contenus definitifs arrivent.
          </p>
        </div>
        <motion.div
          className="relative aspect-video overflow-hidden rounded-sm border border-bone/15 bg-cacao shadow-soft"
          whileHover={{ scale: 0.985 }}
          transition={{ duration: 0.35 }}
        >
          <iframe
            allow="autoplay; encrypted-media"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            src={youtubeEmbed}
            tabIndex={-1}
            title="Video Flam's"
          />
          <div aria-hidden="true" className="absolute inset-0 z-[1]" />
          <div aria-hidden="true" className="youtube-start-mask" />
        </motion.div>
      </div>
    </section>
  );
}

function RestaurantsPage() {
  return (
    <>
      <Hero
        eyebrow="Restaurants"
        title="Trouver sa table"
        body="Page provisoire avant le store locator : elle permet deja de tester les villes, les pages detail et les appels a reservation."
        ctaHref="/reservation"
        ctaLabel="Reserver"
      />
      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((cityItem) => (
            <Link
              className="group block border-t border-cacao/20 pt-5 transition hover:text-ember"
              href={`/restaurants/${cityItem.slug}`}
              key={cityItem.slug}
            >
              <Visual label={cityItem.name} tone={cityItem.tone} />
              <h2 className="mt-6 font-display text-6xl uppercase leading-none">{cityItem.name}</h2>
              <p className="mt-3 text-cacao/60">{cityItem.headline}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function CityPage({ cityItem }: { cityItem: City }) {
  return (
    <>
      <Hero
        eyebrow={`Flam's ${cityItem.name}`}
        title="Ici ca chauffe."
        body={`${cityItem.headline} Faux contenu : ambiance, adresse, horaires, acces et reservation seront remplaces ensuite.`}
        ctaHref="/reservation"
        ctaLabel="Reserver"
        tone={cityItem.tone}
      />
      <Editorial
        eyebrow="Hola la table"
        title={`La salle de ${cityItem.name}, version Flam's.`}
        body="Du bois, du bruit juste comme il faut, des assiettes qui circulent, des verres qui restent sur la table. Ce contenu sert a valider les blocs et les animations."
      />
      <section className="bg-cacao py-10 text-bone">
        <Marquee text={`Flam's ${cityItem.name} - Reserver - Carte - Grande table - Soiree chaude - `} />
      </section>
      <SplitSection
        eyebrow="Dans l'assiette"
        title="Des flammes, des verres, du rythme."
        body="Une carte courte pour commander vite et partager longtemps. Ici on posera les vrais plats, les signatures et les offres locales."
        href="/menu"
        label="Food mood"
      />
      <section className="grid gap-8 bg-cream px-5 py-24 text-cacao md:px-10 lg:grid-cols-3 lg:px-16">
        {cityItem.restaurants.map((restaurant) => (
          <TextCard
            body={`${restaurant.mood} Adresse provisoire : ${restaurant.address}.`}
            href={`/restaurants/${cityItem.slug}/${restaurant.slug}`}
            key={restaurant.slug}
            title={restaurant.name}
          />
        ))}
      </section>
    </>
  );
}

function RestaurantPage({ cityItem, restaurant }: { cityItem: City; restaurant: Restaurant }) {
  return (
    <>
      <Hero
        eyebrow={`Flam's ${cityItem.name}`}
        title={restaurant.name}
        body={`${restaurant.mood} Page detail en attente du contenu final : galerie, horaires, adresse, module reservation et acces carte.`}
        ctaHref="/reservation"
        ctaLabel="Reserver"
        tone={cityItem.tone}
      />
      <Editorial
        eyebrow="Infos pratiques"
        title="Une page restaurant claire, chaude et utile."
        body={`Adresse provisoire : ${restaurant.address}. Horaires, telephone, acces, reservation, carte et photos seront ajoutes ici avec le contenu final.`}
      />
      <SplitSection
        eyebrow="Ambiance"
        title="Bois, feu doux, grandes faims."
        body="Ici on placera les photos du restaurant, les tables, les plats et les details qui donnent envie de reserver."
        href="/reservation"
        label="Ambiance"
      />
      <CTA />
    </>
  );
}

function InteriorPage({ page }: { page: string }) {
  const title = pageTitle(page);
  return (
    <>
      <Hero
        eyebrow={title}
        title={title}
        body="Faux contenu pour visualiser l'architecture de page, les textes, les respirations, les CTA et les animations."
        ctaHref="/reservation"
        ctaLabel="Reserver"
      />
      <Editorial
        eyebrow="Contenu"
        title="Une section editoriale pour donner du rythme."
        body="On posera ici les vrais textes, les vrais modules et les visuels definitifs. Pour l'instant, tout sert a valider la structure."
      />
      <CTA />
    </>
  );
}

function Hero({
  eyebrow,
  title,
  body,
  ctaHref,
  ctaLabel,
  tone = "from-wine via-cacao to-ember",
}: {
  eyebrow: string;
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  tone?: string;
}) {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-cacao px-5 py-28 text-bone">
      <Visual className="absolute inset-0 h-full min-h-screen rounded-none opacity-80" label="table chaude" tone={tone} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cacao to-transparent" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="mb-5 text-xs font-black uppercase tracking-[.24em] text-saffron">{eyebrow}</p>
        <motion.h1
          className="font-display text-[22vw] uppercase leading-[.82] md:text-[16vw] lg:text-[12vw]"
          initial={false}
          whileInView={{ scale: [1, 0.98, 1] }}
          transition={{ duration: 0.9 }}
        >
          {title}
        </motion.h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-bone/80">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-saffron" href={ctaHref}>
            {ctaLabel}
          </Link>
          <Link className="rounded-full border border-bone/35 px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone transition hover:bg-bone hover:text-cacao" href="/menu">
            Voir la carte
          </Link>
        </div>
      </div>
    </section>
  );
}

function FullscreenMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeCity, setActiveCity] = useState(cities[0]);
  const activeRestaurants = useMemo(() => activeCity.restaurants, [activeCity]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ y: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-cacao text-bone"
          exit={{ y: "-100%" }}
          initial={{ y: "-100%" }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex min-h-screen flex-col px-5 py-5 md:px-10 lg:px-16">
            <div className="grid grid-cols-[1fr_auto] items-center">
              <Link className="font-display text-5xl uppercase" href="/" onClick={onClose}>
                Flam's
              </Link>
              <button className="rounded-full border border-bone/30 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao" onClick={onClose}>
                Fermer
              </button>
            </div>
            <div className="grid flex-1 gap-10 py-14 lg:grid-cols-[.75fr_1fr_.9fr] lg:items-end">
              <nav className="grid content-end gap-3">
                {mainLinks.map(([label, href]) => (
                  <Link className="block font-display text-5xl uppercase leading-none text-bone/70 transition hover:translate-x-3 hover:text-saffron md:text-7xl" href={href} key={href} onClick={onClose}>
                    {label}
                  </Link>
                ))}
              </nav>
              <div>
                <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">Choisir une ville</p>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">
                  {cities.map((cityItem) => (
                    <Link
                      className={`group flex items-center justify-between border-b border-bone/15 py-3 transition hover:text-saffron ${activeCity.slug === cityItem.slug ? "text-saffron" : "text-bone"}`}
                      href={`/restaurants/${cityItem.slug}`}
                      key={cityItem.slug}
                      onClick={onClose}
                      onMouseEnter={() => setActiveCity(cityItem)}
                    >
                      <span>
                        <span className="block font-display text-5xl uppercase leading-none md:text-6xl">{cityItem.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-[.18em] opacity-45">{cityItem.restaurants.length} adresse(s)</span>
                      </span>
                      <span className="text-xs font-black opacity-50">Voir</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="grid gap-5">
                <Visual className="min-h-[340px]" label={activeCity.name} tone={activeCity.tone} />
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[.22em] text-saffron">Adresses</p>
                  {activeRestaurants.map((restaurant) => (
                    <Link className="block border-b border-bone/15 py-3 text-lg font-black uppercase transition hover:text-saffron" href={`/restaurants/${activeCity.slug}/${restaurant.slug}`} key={restaurant.slug} onClick={onClose}>
                      {restaurant.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Editorial({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">{eyebrow}</p>
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">{title}</h2>
        </div>
        <p className="max-w-xl text-lg leading-8 text-cacao/65">{body}</p>
      </div>
    </section>
  );
}

function SplitSection({ eyebrow, title, body, href, label }: { eyebrow: string; title: string; body: string; href: string; label: string }) {
  return (
    <section className="grid min-h-screen bg-bone text-cacao lg:grid-cols-2">
      <Visual className="min-h-[58vh] lg:min-h-screen" label={label} tone="from-saffron via-ember to-wine" />
      <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
        <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">{eyebrow}</p>
        <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">{title}</h2>
        <p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">{body}</p>
        <Link className="mt-8 w-fit rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[.18em] transition hover:bg-cacao hover:text-bone" href={href}>
          Voir
        </Link>
      </div>
    </section>
  );
}

function Visual({ label, tone, className = "" }: { label: string; tone: string; className?: string }) {
  return (
    <motion.div
      className={`texture clip-visual relative min-h-[360px] overflow-hidden rounded-sm bg-gradient-to-br ${tone} ${className}`}
      whileHover={{ scale: 0.985 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,247,223,.42),transparent_22%),linear-gradient(120deg,transparent_0_48%,rgba(255,247,223,.18)_48%_51%,transparent_51%)]" />
      <div className="absolute left-6 top-6 h-20 w-20 rounded-full border border-bone/25" />
      <div className="absolute bottom-5 left-5 rounded-full border border-bone/35 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-bone">{label}</div>
    </motion.div>
  );
}

function TextCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link className="block border-t border-cacao/20 pt-5 transition hover:text-ember" href={href}>
      <h3 className="font-display text-6xl uppercase leading-none">{title}</h3>
      <p className="mt-5 text-lg leading-8 text-cacao/65">{body}</p>
    </Link>
  );
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div animate={{ x: [0, -600] }} className="font-display text-6xl uppercase md:text-8xl" transition={{ repeat: Infinity, duration: 16, ease: "linear" }}>
        {text.repeat(8)}
      </motion.div>
    </div>
  );
}

function CTA() {
  return (
    <section className="bg-ember px-5 py-20 text-bone md:px-10 lg:px-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">On garde une table ?</h2>
        <Link className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-cacao hover:text-bone" href="/reservation">
          Reserver
        </Link>
      </div>
    </section>
  );
}

function FloatingMenuButton() {
  return (
    <Link className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-cacao px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone shadow-soft transition hover:bg-ember" href="/menu">
      Voir la carte
    </Link>
  );
}

function Footer() {
  return (
    <footer className="bg-ink px-5 py-14 text-bone md:px-10 lg:px-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-6xl uppercase">Flam's</p>
          <p className="mt-3 text-bone/55">Restaurant finder, carte, reservation, recrutement, contact.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-[.16em]">
          {mainLinks.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link href="/credits">Credits</Link>
          <Link href="/en">EN</Link>
        </div>
      </div>
    </footer>
  );
}

function city(name: string, restaurants: string[], headline: string): City {
  const slug = slugify(name);
  return {
    name,
    slug,
    headline,
    tone: toneFor(slug),
    restaurants: restaurants.map((restaurant, index) => ({
      name: `Flam's ${restaurant}`,
      slug: slugify(restaurant),
      city: name,
      address: `${index + 1} rue des Tables, ${name}`,
      mood: "Table chaude, rythme vif, ambiance de bande.",
    })),
  };
}

function toneFor(slug: string) {
  const tones: Record<string, string> = {
    paris: "from-wine via-cacao to-ember",
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

function pageTitle(page: string) {
  const titles: Record<string, string> = {
    menu: "La carte",
    reservation: "Reserver",
    recrutement: "Recrutement",
    "a-propos": "A propos",
    contact: "Contact",
    credits: "Credits",
  };
  return titles[page] ?? "Flam's";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
