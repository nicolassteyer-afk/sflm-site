"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const colors: Record<string, string> = {
  wine: "#65131a",
  cacao: "#2a1511",
  ember: "#ef3c19",
  saffron: "#f3b12a",
  bone: "#fff7df",
  ink: "#11100d"
};

const countries = [
  { name: "France", slug: "france", cities: ["Paris", "Bordeaux", "Lyon", "Lille", "Nice", "Marseille", "Strasbourg"] },
  { name: "Belgique", slug: "belgique", cities: ["Bruxelles"] },
  { name: "Royaume-Uni", slug: "royaume-uni", cities: ["Londres"] }
];

const restaurants = [
  ["Paris", "Grand Boulevard", "Grande salle, lumiere basse, tables qui s'allongent."],
  ["Paris", "Rive Gauche", "Adresse intime, verres vifs, service en cadence."],
  ["Bordeaux", "Chartrons", "Bois sombre, banquettes chaudes, grandes tablees."],
  ["Lyon", "Presqu'ile", "Le midi file, le soir s'attarde."],
  ["Lille", "Vieux Lille", "Brut, chaleureux, parfait pour arriver nombreux."],
  ["Nice", "Massena", "Energie sud, aperitif long, plats partages."],
  ["Marseille", "Panier", "Texture pierre, feu franc, esprit de bande."],
  ["Strasbourg", "Cathedrale", "Clin d'oeil alsacien, version contemporaine."],
  ["Bruxelles", "Sainte-Catherine", "Compact, vivant, ouvert aux longues soirees."],
  ["Londres", "Shoreditch", "Warm room, sharp drinks, late table energy."]
];

const mainLinks = [
  ["/menu", "Carte"],
  ["/restaurants", "Restaurants"],
  ["/recrutement", "Recrutement"],
  ["/a-propos", "A propos"],
  ["/contact", "Contact"]
];

export function Site({ slug }: { slug: string[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = slug[0] ?? "home";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.08, smoothWheel: true, wheelMultiplier: .9 });
    let raf = 0;
    const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <>
      <Header onOpen={() => setMenuOpen(true)} />
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        {page === "home" || page === "en" ? <Home /> : <Interior page={page} city={slug[1]} restaurant={slug[2]} />}
      </main>
      <Footer />
    </>
  );
}

function Header({ onOpen }: { onOpen: () => void }) {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 120], ["rgba(245,234,210,0)", "rgba(245,234,210,.92)"]);
  return (
    <motion.header className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-cacao md:px-10 lg:px-16" style={{ background, backdropFilter: "blur(18px)" }}>
      <button aria-label="Ouvrir le menu" className="rounded-full border border-cacao/25 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:border-ember hover:bg-ember hover:text-bone" onClick={onOpen}>Menu</button>
      <Link className="justify-self-center font-display text-5xl uppercase leading-none" href="/">Flam's</Link>
      <Link className="warm-button rounded-full border border-cacao/25 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:border-ember hover:text-bone" href="/reservation">Reserver</Link>
    </motion.header>
  );
}

function FullscreenMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [preview, setPreview] = useState("Paris");
  return (
    <AnimatePresence>
      {open && (
        <motion.div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto bg-cacao text-bone" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .72, ease: [.16,1,.3,1] }}>
          <div className="flex min-h-screen flex-col px-5 py-5 md:px-10 lg:px-16">
            <div className="flex items-center justify-between"><Link href="/" onClick={onClose} className="font-display text-5xl uppercase">Flam's</Link><button onClick={onClose} className="rounded-full border border-bone/30 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao">Fermer</button></div>
            <div className="grid flex-1 gap-12 py-16 lg:grid-cols-[1fr_.82fr] lg:items-end">
              <div>
                <nav className="mb-12 grid gap-3">{mainLinks.map(([href,label], i) => <motion.div key={href} initial={{opacity:0,x:-28}} animate={{opacity:1,x:0}} transition={{delay:.15+i*.06}}><Link href={href} onClick={onClose} className="block font-display text-6xl uppercase leading-none transition hover:translate-x-4 hover:text-saffron md:text-8xl">{label}</Link></motion.div>)}</nav>
                <div className="grid gap-8 md:grid-cols-3">{countries.map(country => <div key={country.slug}><p className="mb-4 text-xs font-black uppercase tracking-[.22em] text-saffron">{country.name}</p><div className="grid gap-2">{country.cities.map(city => <Link key={city} href={`/restaurants/${slugify(city)}`} onClick={onClose} onMouseEnter={() => setPreview(city)} className="border-b border-bone/15 py-2 text-xl font-black uppercase transition hover:border-saffron hover:text-saffron">{city}</Link>)}</div></div>)}</div>
              </div>
              <motion.div key={preview} initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} className="hidden lg:block"><Visual label={preview} tone={["wine","ember","saffron"]} className="min-h-[68vh]" /></motion.div>
            </div>
            <div className="flex justify-between border-t border-bone/15 pt-5 text-xs font-black uppercase tracking-[.18em]"><div className="flex gap-4"><Link href="/">FR</Link><Link href="/en">EN</Link></div><Link href="/credits" onClick={onClose}>Credits</Link></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Home() {
  return (
    <>
      <section className="texture relative grid min-h-screen items-end gap-10 bg-cream px-5 pb-14 pt-32 md:px-10 lg:grid-cols-[1fr_.72fr] lg:px-16"><div className="relative z-10"><p className="mb-6 text-xs font-black uppercase tracking-[.24em] text-ember">Restaurant de grandes tables</p><Title text="Feu doux, table pleine." /><p className="mt-8 max-w-2xl text-lg leading-8 text-cacao/70">Une maison de flammes contemporaines, pensee pour les repas qui commencent simplement et finissent en vraie soiree.</p><Link href="/reservation" className="warm-button mt-8 inline-flex rounded-full border border-cacao/25 px-8 py-5 text-sm font-black uppercase tracking-[.18em] transition hover:border-ember hover:text-bone">Reserver</Link></div><Parallax label="visuel hero" tone={["wine","ember","saffron"]} /></section>
      <section className="bg-cacao px-5 py-24 text-bone md:px-10 lg:px-16"><p className="mb-8 text-xs font-black uppercase tracking-[.22em] text-saffron">Experience</p><Title text="Une adresse qui respire avant meme l'assiette." small /></section>
      <section className="bg-cream px-5 py-24 md:px-10 lg:px-16"><p className="mb-4 text-xs font-black uppercase tracking-[.22em] text-ember">Restaurants</p><Title text="Choisir sa ville" small dark /><CityGrid /></section>
      <section className="grid gap-4 bg-bone px-5 py-24 md:px-10 lg:grid-cols-2 lg:px-16"><Parallax label="food visual" tone={["saffron","ember","wine"]} /><div className="flex flex-col justify-center"><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">Carte</p><Title text="Court. chaud. partage." small dark /><p className="mt-8 max-w-lg text-lg leading-8 text-cacao/65">Des flammes signatures, des verres bien choisis et une carte faite pour partager.</p></div></section>
      <section className="bg-cream px-5 py-24 md:px-10 lg:px-16"><p className="mb-4 text-xs font-black uppercase tracking-[.22em] text-ember">Selection</p><Title text="Adresses vivantes" small dark /><RestaurantGrid /></section>
      <section className="grid min-h-screen gap-8 bg-cacao px-5 py-24 text-bone md:px-10 lg:grid-cols-[1fr_.75fr] lg:px-16"><div className="flex flex-col justify-center"><p className="mb-4 text-xs font-black uppercase tracking-[.22em] text-saffron">Recrutement</p><Title text="Viens tenir la salle chaude." small /><p className="mt-8 max-w-lg text-lg leading-8 text-bone/65">Une section recrutement visible, directe, avec prise de contact claire pour les futures equipes.</p></div><Parallax label="equipe visual" tone={["ink","wine","ember"]} /></section>
      <CTA />
    </>
  );
}

function Interior({ page, city, restaurant }: { page: string; city?: string; restaurant?: string }) {
  const titles: Record<string,string> = { menu: "La carte a partager", restaurants: "Nos restaurants", reservation: "Reserver une table", recrutement: "Rejoindre l'equipe", "a-propos": "Une maison de feu doux", contact: "Nous contacter", credits: "Credits" };
  const cityName = city ? clean(city) : "";
  const restName = restaurant ? clean(restaurant) : "";
  const title = restName || cityName || titles[page] || "Flam's";
  return (
    <>
      <section className="grid min-h-screen gap-8 bg-cream px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[.9fr_1.1fr] lg:px-16"><div className="flex flex-col justify-end"><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">{page}</p><Title text={title} dark /><p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">Page vitrine prete a recevoir les contenus definitifs, avec une structure multi-villes, reservation et navigation immersive.</p></div><Visual label={title} tone={["wine","cacao","ember"]} className="min-h-[70vh]" /></section>
      {page === "restaurants" ? <section className="bg-bone px-5 py-24 md:px-10 lg:px-16"><CityGrid /></section> : <section className="bg-bone px-5 py-24 md:px-10 lg:px-16"><RestaurantGrid /></section>}
      <CTA />
    </>
  );
}

function CityGrid() { return <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{countries.flatMap(c => c.cities).map((city, i) => <Link key={city} href={`/restaurants/${slugify(city)}`} className="group border-t border-cacao/20 pt-5"><Visual label={city} tone={i%2?["cacao","wine","ember"]:["wine","ember","saffron"]} className="min-h-[300px] transition group-hover:scale-[.985]" /><h3 className="mt-4 font-display text-5xl uppercase leading-none text-cacao">{city}</h3></Link>)}</div>; }
function RestaurantGrid() { return <div className="mt-12 grid gap-10 lg:grid-cols-2">{restaurants.slice(0,6).map(([city,name,mood], i) => <Link key={name} href={`/restaurants/${slugify(city)}/${slugify(name)}`} className="group"><Visual label={city} tone={i%2?["ink","wine","ember"]:["saffron","ember","wine"]} className="min-h-[390px] transition group-hover:scale-[.985]" /><h3 className="mt-5 border-t border-cacao/20 pt-4 font-display text-5xl uppercase leading-none text-cacao">Flam's {name}</h3><p className="mt-3 text-cacao/65">{mood}</p></Link>)}</div>; }

function Title({ text, small=false, dark=false }: { text: string; small?: boolean; dark?: boolean }) { return <h1 className={`font-display uppercase leading-[.84] ${dark ? "text-cacao" : "text-bone"} ${small ? "text-7xl md:text-9xl" : "text-[18vw] text-cacao md:text-[13vw] lg:text-[10.5vw]"}`}>{text.split(" ").map((word,i) => <motion.span key={`${word}-${i}`} className="mr-[.18em] inline-block overflow-hidden"><motion.span className="inline-block" initial={{y:"110%", rotate:3}} whileInView={{y:"0%", rotate:0}} viewport={{once:true}} transition={{duration:.8, delay:i*.055, ease:[.16,1,.3,1]}}>{word}</motion.span></motion.span>)}</h1>; }
function Visual({ label, tone, className="" }: { label: string; tone: string[]; className?: string }) { return <div className={`texture clip-visual relative min-h-[360px] overflow-hidden rounded-sm ${className}`} style={{background:`linear-gradient(135deg, ${tone.map(t=>colors[t]).join(", ")})`}}><div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,247,223,.42),transparent_22%),linear-gradient(120deg,transparent_0_48%,rgba(255,247,223,.18)_48%_51%,transparent_51%)]"/><div className="absolute bottom-5 left-5 rounded-full border border-bone/35 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-bone">{label}</div></div>; }
function Parallax(props: { label: string; tone: string[] }) { const ref = useRef<HTMLDivElement>(null); const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] }); const y = useTransform(scrollYProgress, [0,1], ["-8%","8%"]); const scale = useTransform(scrollYProgress, [0,.5,1], [1.08,1,1.08]); return <div ref={ref} className="min-h-[58vh] overflow-hidden lg:min-h-[72vh]"><motion.div style={{y,scale}}><Visual {...props} className="min-h-[inherit]" /></motion.div></div>; }
function CTA() { return <section className="bg-ember px-5 py-20 text-bone md:px-10 lg:px-16"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><Title text="On garde une table ?" small /><Link href="/reservation" className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-cacao hover:text-bone">Reserver</Link></div></section>; }
function Footer() { return <footer className="bg-ink px-5 py-14 text-bone md:px-10 lg:px-16"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p className="font-display text-6xl uppercase">Flam's</p><p className="mt-3 text-bone/55">Site vitrine en construction graphique.</p></div><div className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-[.16em]"><Link href="/credits">Credits</Link><Link href="/contact">Contact</Link><Link href="/en">EN</Link></div></div></footer>; }
function slugify(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function clean(value: string) { return value.split("-").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" "); }
