"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const colors: Record<string, string> = {
  wine: "#65131a",
  cacao: "#2a1511",
  ember: "#ef3c19",
  saffron: "#f3b12a",
  bone: "#fff7df",
  cream: "#f5ead2",
  ink: "#11100d",
};

type Restaurant = { name: string; slug: string; mood: string; address: string };
type City = { name: string; slug: string; restaurants: Restaurant[]; tone: string[] };
type Country = { name: string; slug: string; cities: City[] };

const countries: Country[] = [
  {
    name: "France",
    slug: "france",
    cities: [
      city("Paris", ["Grand Boulevard", "Rive Gauche", "Bastille"], ["wine", "ember", "saffron"]),
      city("Bordeaux", ["Chartrons"], ["cacao", "wine", "ember"]),
      city("Lyon", ["Presqu'ile"], ["ink", "cacao", "wine"]),
      city("Lille", ["Vieux Lille"], ["wine", "cacao", "saffron"]),
      city("Nice", ["Massena"], ["saffron", "ember", "wine"]),
      city("Marseille", ["Panier"], ["cacao", "ember", "saffron"]),
      city("Strasbourg", ["Cathedrale"], ["wine", "cacao", "bone"]),
    ],
  },
  { name: "Belgique", slug: "belgique", cities: [city("Bruxelles", ["Sainte-Catherine"], ["cacao", "wine", "ember"])] },
  { name: "Royaume-Uni", slug: "royaume-uni", cities: [city("Londres", ["Shoreditch"], ["ink", "wine", "ember"])] },
];

const navLinks = [
  ["/menu", "La carte"],
  ["/restaurants", "Restaurants"],
  ["/recrutement", "Recrutement"],
  ["/a-propos", "A propos"],
  ["/contact", "Contact"],
];

export function Site({ slug }: { slug: string[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = slug[0] ?? "home";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Header onOpen={() => setMenuOpen(true)} />
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>{page === "home" || page === "en" ? <Home /> : <Interior page={page} city={slug[1]} restaurant={slug[2]} />}</main>
      <Footer />
    </>
  );
}

function Header({ onOpen }: { onOpen: () => void }) {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 120], ["rgba(101,19,26,0)", "rgba(245,234,210,.93)"]);
  const color = useTransform(scrollY, [0, 120], ["#fff7df", "#2a1511"]);

  return (
    <motion.header className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-5 md:px-10 lg:px-16" style={{ background, color, backdropFilter: "blur(16px)" }}>
      <button aria-label="Ouvrir le menu" className="rounded-full border border-current/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao" onClick={onOpen}>Menu</button>
      <Link className="justify-self-center font-display text-5xl uppercase leading-none" href="/">Flam's</Link>
      <Link className="rounded-full border border-current/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-ember hover:text-bone" href="/reservation">Reserver</Link>
    </motion.header>
  );
}

function Home() {
  const [activeCity, setActiveCity] = useState(countries[0].cities[0]);

  return (
    <>
      <section className="relative grid min-h-screen place-items-center overflow-hidden bg-cacao px-5 py-28 text-bone">
        <motion.div initial={{ scale: 1.12, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.1, ease: [.16,1,.3,1] }} className="absolute inset-0">
          <Visual label="hero image placeholder" tone={["wine", "cacao", "ember"]} className="h-full min-h-screen rounded-none opacity-80" />
        </motion.div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[.24em] text-saffron">Restaurants de grandes tables</p>
          <Title text="Flam's" huge />
          <p className="mt-6 max-w-2xl text-lg leading-8 text-bone/75">Choisissez votre ville, trouvez votre table, gardez la soiree chaude.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-saffron" href="/reservation">Reserver</Link>
            <Link className="rounded-full border border-bone/35 px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone transition hover:bg-bone hover:text-cacao" href="#restaurants">Voir les restaurants</Link>
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-xs font-black uppercase tracking-[.22em] text-bone/65">Scroll</div>
      </section>

      <section id="restaurants" className="bg-cream px-5 py-20 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">Choisir un restaurant</p>
            <Title text="Pays. villes. tables." dark />
            <p className="mt-6 max-w-md text-lg leading-8 text-cacao/65">La home sert d'aiguillage principal : le visiteur arrive, choisit une ville, puis accede a l'adresse ou a la reservation.</p>
          </div>
          <div className="grid gap-7">
            {countries.map((country) => (
              <div key={country.slug} className="border-t border-cacao/20 pt-5">
                <p className="mb-4 text-sm font-black uppercase tracking-[.22em] text-ember">{country.name}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {country.cities.map((cityItem) => (
                    <Link key={cityItem.slug} href={`/restaurants/${cityItem.slug}`} onMouseEnter={() => setActiveCity(cityItem)} className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-cacao/15 py-4 transition hover:border-ember">
                      <span className="font-display text-5xl uppercase leading-none transition group-hover:translate-x-2 group-hover:text-ember">{cityItem.name}</span>
                      <span className="rounded-full border border-cacao/20 px-3 py-1 text-xs font-black uppercase tracking-[.16em]">{cityItem.restaurants.length}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <motion.div key={activeCity.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 bg-cacao p-5 text-bone md:grid-cols-[.9fr_1.1fr] md:p-8">
              <Visual label={`preview ${activeCity.name}`} tone={activeCity.tone} className="min-h-[330px]" />
              <div className="flex flex-col justify-between gap-8">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[.22em] text-saffron">{activeCity.name}</p>
                  <h2 className="font-display text-6xl uppercase leading-none">Adresses</h2>
                  <div className="mt-6 grid gap-3">{activeCity.restaurants.map((restaurant) => <Link key={restaurant.slug} href={`/restaurants/${activeCity.slug}/${restaurant.slug}`} className="border-b border-bone/15 py-3 text-xl font-black uppercase transition hover:text-saffron">Flam's {restaurant.name}</Link>)}</div>
                </div>
                <Link className="w-fit rounded-full bg-bone px-7 py-4 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-saffron" href="/reservation">Reserver</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="grid min-h-screen bg-bone text-cacao lg:grid-cols-2">
        <Parallax label="menu image placeholder" tone={["saffron", "ember", "wine"]} />
        <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">La carte</p>
          <Title text="A partager sans trop reflechir." dark />
          <p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">Un bloc court comme sur une home de restaurant : donner envie, puis envoyer vers la carte ou la reservation.</p>
          <Link className="mt-8 w-fit rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[.18em] transition hover:bg-cacao hover:text-bone" href="/menu">Voir la carte</Link>
        </div>
      </section>

      <CTA />
    </>
  );
}

function FullscreenMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeCountry, setActiveCountry] = useState(countries[0]);
  const [activeCity, setActiveCity] = useState(countries[0].cities[0]);
  const cityList = activeCountry.cities;

  return (
    <AnimatePresence>
      {open && (
        <motion.div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto bg-cacao text-bone" initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: .72, ease: [.16,1,.3,1] }}>
          <div className="flex min-h-screen flex-col px-5 py-5 md:px-10 lg:px-16">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center"><Link href="/" onClick={onClose} className="font-display text-5xl uppercase">Flam's</Link><p className="hidden text-xs font-black uppercase tracking-[.22em] text-bone/45 md:block">Navigation</p><button onClick={onClose} className="justify-self-end rounded-full border border-bone/30 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao">Fermer</button></div>
            <div className="grid flex-1 gap-10 py-14 lg:grid-cols-[.55fr_.75fr_1fr_.85fr] lg:items-end">
              <nav className="grid content-end gap-3">{navLinks.map(([href, label], index) => <motion.div key={href} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .055 }}><Link href={href} onClick={onClose} className="block font-display text-5xl uppercase leading-none text-bone/65 transition hover:translate-x-3 hover:text-saffron md:text-7xl">{label}</Link></motion.div>)}</nav>
              <div><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">Pays</p><div className="grid gap-2">{countries.map((country) => <button key={country.slug} onMouseEnter={() => { setActiveCountry(country); setActiveCity(country.cities[0]); }} onClick={() => { setActiveCountry(country); setActiveCity(country.cities[0]); }} className={`border-b border-bone/15 py-3 text-left font-display text-5xl uppercase leading-none transition hover:text-saffron ${activeCountry.slug === country.slug ? "text-saffron" : "text-bone"}`}>{country.name}</button>)}</div></div>
              <div><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">Villes</p><div className="grid gap-2">{cityList.map((cityItem) => <Link key={cityItem.slug} href={`/restaurants/${cityItem.slug}`} onMouseEnter={() => setActiveCity(cityItem)} onClick={onClose} className={`group flex items-center justify-between border-b border-bone/15 py-3 transition hover:text-saffron ${activeCity.slug === cityItem.slug ? "text-saffron" : "text-bone"}`}><span className="font-display text-5xl uppercase leading-none md:text-6xl">{cityItem.name}</span><span className="text-xs font-black opacity-50">{cityItem.restaurants.length}</span></Link>)}</div></div>
              <motion.div key={activeCity.slug} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45 }} className="grid gap-5"><Visual label={activeCity.name} tone={activeCity.tone} className="min-h-[340px]" /><div><p className="mb-2 text-xs font-black uppercase tracking-[.22em] text-saffron">Restaurants</p>{activeCity.restaurants.map((restaurant) => <Link key={restaurant.slug} href={`/restaurants/${activeCity.slug}/${restaurant.slug}`} onClick={onClose} className="block border-b border-bone/15 py-3 text-lg font-black uppercase transition hover:text-saffron">Flam's {restaurant.name}</Link>)}</div></motion.div>
            </div>
            <div className="flex flex-wrap justify-between gap-4 border-t border-bone/15 pt-5 text-xs font-black uppercase tracking-[.18em]"><div className="flex gap-4"><Link href="/" onClick={onClose}>FR</Link><Link href="/en" onClick={onClose}>EN</Link></div><div className="flex gap-5"><Link href="/credits" onClick={onClose}>Credits</Link><Link href="/contact" onClick={onClose}>Contact</Link></div></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Interior({ page, city: citySlug, restaurant }: { page: string; city?: string; restaurant?: string }) {
  const cityItem = findCity(citySlug);
  const title = restaurant ? clean(restaurant) : cityItem?.name ?? pageTitle(page);
  return (
    <>
      <section className="grid min-h-screen gap-8 bg-cream px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[.9fr_1.1fr] lg:px-16"><div className="flex flex-col justify-end"><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">{page}</p><Title text={title} dark /><p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">Structure posee pour la page. Les contenus detailles, photos et modules de reservation seront ajustes ensuite.</p></div><Visual label={title} tone={cityItem?.tone ?? ["wine", "cacao", "ember"]} className="min-h-[70vh]" /></section>
      <section className="bg-bone px-5 py-24 md:px-10 lg:px-16">{page === "restaurants" || cityItem ? <Directory active={cityItem} /> : <RestaurantCards />}</section>
      <CTA />
    </>
  );
}

function Directory({ active }: { active?: City }) {
  const cities = active ? [active] : countries.flatMap((country) => country.cities);
  return <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">{cities.map((cityItem) => <div key={cityItem.slug}><Visual label={cityItem.name} tone={cityItem.tone} className="min-h-[360px]" /><h2 className="mt-5 font-display text-6xl uppercase leading-none text-cacao">{cityItem.name}</h2>{cityItem.restaurants.map((restaurant) => <Link key={restaurant.slug} href={`/restaurants/${cityItem.slug}/${restaurant.slug}`} className="block border-b border-cacao/15 py-3 text-lg font-black uppercase text-cacao/75 transition hover:text-ember">Flam's {restaurant.name}</Link>)}</div>)}</div>;
}

function RestaurantCards() {
  return <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">{countries.flatMap((country) => country.cities).slice(0, 4).map((cityItem) => <Link key={cityItem.slug} href={`/restaurants/${cityItem.slug}`} className="group"><Visual label={cityItem.name} tone={cityItem.tone} className="min-h-[390px] transition group-hover:scale-[.985]" /><h3 className="mt-5 font-display text-5xl uppercase leading-none text-cacao">{cityItem.name}</h3></Link>)}</div>;
}

function Title({ text, dark = false, huge = false }: { text: string; dark?: boolean; huge?: boolean }) {
  return <h1 className={`font-display uppercase leading-[.84] ${dark ? "text-cacao" : "text-bone"} ${huge ? "text-[24vw] md:text-[18vw] lg:text-[13vw]" : "text-7xl md:text-9xl"}`}>{text.split(" ").map((word, index) => <span key={`${word}-${index}`} className="mr-[.18em] inline-block overflow-hidden"><motion.span className="inline-block" initial={{ y: "110%", rotate: 3 }} whileInView={{ y: "0%", rotate: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: index * .055, ease: [.16,1,.3,1] }}>{word}</motion.span></span>)}</h1>;
}

function Visual({ label, tone, className = "" }: { label: string; tone: string[]; className?: string }) {
  return <div className={`texture clip-visual relative min-h-[360px] overflow-hidden rounded-sm ${className}`} style={{ background: `linear-gradient(135deg, ${tone.map((item) => colors[item]).join(", ")})` }}><div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,247,223,.42),transparent_22%),linear-gradient(120deg,transparent_0_48%,rgba(255,247,223,.18)_48%_51%,transparent_51%)]" /><div className="absolute bottom-5 left-5 rounded-full border border-bone/35 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-bone">{label}</div></div>;
}

function Parallax(props: { label: string; tone: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], [1.08, 1, 1.08]);
  return <div ref={ref} className="min-h-[58vh] overflow-hidden lg:min-h-screen"><motion.div style={{ y, scale }}><Visual {...props} className="min-h-[inherit]" /></motion.div></div>;
}

function CTA() {
  return <section className="bg-ember px-5 py-20 text-bone md:px-10 lg:px-16"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><Title text="On garde une table ?" /><Link href="/reservation" className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-cacao hover:text-bone">Reserver</Link></div></section>;
}

function Footer() {
  return <footer className="bg-ink px-5 py-14 text-bone md:px-10 lg:px-16"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p className="font-display text-6xl uppercase">Flam's</p><p className="mt-3 text-bone/55">Restaurant finder, carte, reservation, recrutement, contact.</p></div><div className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-[.16em]"><Link href="/menu">Carte</Link><Link href="/restaurants">Restaurants</Link><Link href="/credits">Credits</Link><Link href="/en">EN</Link></div></div></footer>;
}

function city(name: string, names: string[], tone: string[]): City {
  return { name, slug: slugify(name), tone, restaurants: names.map((restaurantName, index) => ({ name: restaurantName, slug: slugify(restaurantName), mood: "Table chaude, rythme vif, ambiance de bande.", address: `${index + 1} rue des Tables` })) };
}

function findCity(slug?: string) {
  if (!slug) return undefined;
  return countries.flatMap((country) => country.cities).find((cityItem) => cityItem.slug === slug);
}

function pageTitle(page: string) {
  const titles: Record<string, string> = { menu: "La carte", restaurants: "Nos restaurants", reservation: "Reserver", recrutement: "Recrutement", "a-propos": "A propos", contact: "Contact", credits: "Credits" };
  return titles[page] ?? "Flam's";
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clean(value: string) {
  return value.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
