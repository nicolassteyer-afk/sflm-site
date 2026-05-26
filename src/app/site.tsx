"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
type City = { name: string; slug: string; country: string; restaurants: Restaurant[]; tone: string[] };

const youtubeEmbed = "https://www.youtube.com/embed/KngfsVMDs3Q?autoplay=1&mute=1&loop=1&playlist=KngfsVMDs3Q&controls=0&modestbranding=1&playsinline=1&rel=0";

const cities: City[] = [
  city("Paris", "France", ["Grand Boulevard", "Rive Gauche", "Bastille"], ["wine", "ember", "saffron"]),
  city("Bordeaux", "France", ["Chartrons"], ["cacao", "wine", "ember"]),
  city("Lyon", "France", ["Presqu'ile"], ["ink", "cacao", "wine"]),
  city("Lille", "France", ["Vieux Lille"], ["wine", "cacao", "saffron"]),
  city("Nice", "France", ["Massena"], ["saffron", "ember", "wine"]),
  city("Marseille", "France", ["Panier"], ["cacao", "ember", "saffron"]),
  city("Strasbourg", "France", ["Cathedrale"], ["wine", "cacao", "bone"]),
  city("Bruxelles", "Belgique", ["Sainte-Catherine"], ["cacao", "wine", "ember"]),
  city("Londres", "Royaume-Uni", ["Shoreditch"], ["ink", "wine", "ember"]),
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
  const currentCity = page === "restaurants" ? findCity(slug[1]) : undefined;
  const currentRestaurant = currentCity?.restaurants.find((item) => item.slug === slug[2]);

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
      <main>
        {page === "home" || page === "en" ? (
          <Home />
        ) : currentRestaurant ? (
          <RestaurantPage cityItem={currentCity!} restaurant={currentRestaurant} />
        ) : currentCity ? (
          <CityPage cityItem={currentCity} />
        ) : (
          <Interior page={page} />
        )}
      </main>
      {currentRestaurant ? <FloatingMenuButton /> : null}
      <Footer />
    </>
  );
}

function Header({ onOpen }: { onOpen: () => void }) {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 140], ["rgba(101,19,26,0)", "rgba(245,234,210,.94)"]);
  const color = useTransform(scrollY, [0, 140], ["#fff7df", "#2a1511"]);

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-5 md:px-10 lg:px-16"
      style={{ background, color, backdropFilter: "blur(16px)" }}
    >
      <button
        aria-label="Ouvrir le menu"
        className="rounded-full border border-current/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao"
        onClick={onOpen}
      >
        Menu
      </button>
      <Link className="justify-self-center font-display text-5xl uppercase leading-none" href="/">
        Flam's
      </Link>
      <Link
        className="rounded-full border border-current/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-ember hover:text-bone"
        href="/reservation"
      >
        Reserver
      </Link>
    </motion.header>
  );
}

function Home() {
  return (
    <>
      <section className="relative grid min-h-screen place-items-center overflow-hidden bg-cacao px-5 py-28 text-bone">
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [.16, 1, .3, 1] }}
          className="absolute inset-0"
        >
          <Visual label="table chaude" tone={["wine", "cacao", "ember"]} className="h-full min-h-screen rounded-none opacity-85" />
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cacao to-transparent" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
          <Reveal>
            <p className="mb-5 text-xs font-black uppercase tracking-[.24em] text-saffron">Restaurant de grandes tables</p>
          </Reveal>
          <Title text="Flam's" huge />
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-bone/75">
              Un lieu chaud, direct, joyeux. On vient pour manger, on reste pour la table, le bruit, les verres, les copains.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-saffron" href="/reservation">
                Reserver
              </Link>
              <Link className="rounded-full border border-bone/35 px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone transition hover:bg-bone hover:text-cacao" href="/menu">
                Voir la carte
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-xs font-black uppercase tracking-[.22em] text-bone/65">Scroll</div>
      </section>

      <VideoSection />

      <EditorialBlock
        eyebrow="L'esprit"
        title="Une maison qui chauffe la salle avant meme l'assiette."
        body="Ici, tout est pense pour la convivialite : une lumiere basse, du bois, une carte courte, des flammes qui arrivent vite et des tables qui se remplissent naturellement."
      />

      <section className="grid min-h-screen bg-bone text-cacao lg:grid-cols-2">
        <Parallax label="flammes et grandes tables" tone={["saffron", "ember", "wine"]} />
        <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
          <Reveal>
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">La carte</p>
          </Reveal>
          <Title text="Simple. chaud. a partager." dark />
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">
              Des recettes franches, des boissons qui suivent, des desserts pour prolonger. Le contenu final arrivera, mais l'architecture est la.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link className="mt-8 w-fit rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[.18em] transition hover:bg-cacao hover:text-bone" href="/menu">
              Decouvrir la carte
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">Bientot</p>
            </Reveal>
            <Title text="Le store locator arrive ici." dark />
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-xl text-lg leading-8 text-cacao/65">
              Cette zone remplacera la liste des restaurants : recherche par ville, filtre, carte et acces rapide aux reservations. Pour l'instant, on garde la home propre et orientee marque.
            </p>
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}

function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20 text-bone md:px-10 lg:px-16">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
        <div>
          <Reveal>
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">La video</p>
          </Reveal>
          <Title text="Le feu en vrai." />
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-md text-lg leading-8 text-bone/65">
              La video YouTube est maintenant integree : elle sert de bloc vivant pour sentir l'ambiance avant les vrais contenus definitifs.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="relative aspect-video overflow-hidden rounded-sm border border-bone/15 bg-cacao shadow-soft">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={youtubeEmbed}
              title="Video Flam's"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FullscreenMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeCity, setActiveCity] = useState(cities[0]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-cacao text-bone"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: .72, ease: [.16, 1, .3, 1] }}
        >
          <div className="flex min-h-screen flex-col px-5 py-5 md:px-10 lg:px-16">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center">
              <Link href="/" onClick={onClose} className="font-display text-5xl uppercase">Flam's</Link>
              <p className="hidden text-xs font-black uppercase tracking-[.22em] text-bone/45 md:block">Navigation</p>
              <button onClick={onClose} className="justify-self-end rounded-full border border-bone/30 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao">Fermer</button>
            </div>
            <div className="grid flex-1 gap-10 py-14 lg:grid-cols-[.7fr_1fr_.95fr] lg:items-end">
              <nav className="grid content-end gap-3">
                {navLinks.map(([href, label], index) => (
                  <motion.div key={href} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .055 }}>
                    <Link href={href} onClick={onClose} className="block font-display text-5xl uppercase leading-none text-bone/65 transition hover:translate-x-3 hover:text-saffron md:text-7xl">
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div>
                <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">Choisir une ville</p>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">
                  {cities.map((cityItem) => (
                    <Link
                      key={cityItem.slug}
                      href={`/restaurants/${cityItem.slug}`}
                      onMouseEnter={() => setActiveCity(cityItem)}
                      onClick={onClose}
                      className={`group flex items-center justify-between border-b border-bone/15 py-3 transition hover:text-saffron ${activeCity.slug === cityItem.slug ? "text-saffron" : "text-bone"}`}
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
              <motion.div key={activeCity.slug} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45 }} className="grid gap-5">
                <Visual label={activeCity.name} tone={activeCity.tone} className="min-h-[340px]" />
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[.22em] text-saffron">Adresses</p>
                  {activeCity.restaurants.map((restaurant) => (
                    <Link key={restaurant.slug} href={`/restaurants/${activeCity.slug}/${restaurant.slug}`} onClick={onClose} className="block border-b border-bone/15 py-3 text-lg font-black uppercase transition hover:text-saffron">
                      Flam's {restaurant.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="flex flex-wrap justify-between gap-4 border-t border-bone/15 pt-5 text-xs font-black uppercase tracking-[.18em]">
              <div className="flex gap-4"><Link href="/" onClick={onClose}>FR</Link><Link href="/en" onClick={onClose}>EN</Link></div>
              <div className="flex gap-5"><Link href="/credits" onClick={onClose}>Credits</Link><Link href="/contact" onClick={onClose}>Contact</Link></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CityPage({ cityItem }: { cityItem: City }) {
  return (
    <>
      <section className="relative grid min-h-screen place-items-end overflow-hidden bg-cacao px-5 pb-14 pt-32 text-bone md:px-10 lg:px-16">
        <Visual label={`${cityItem.name} hero`} tone={cityItem.tone} className="absolute inset-0 h-full min-h-screen rounded-none opacity-75" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">Flam's {cityItem.name}</p></Reveal>
            <Title text="Ici ca chauffe." huge />
            <Reveal delay={0.2}><p className="mt-7 max-w-xl text-lg leading-8 text-bone/75">Une adresse pensee pour les grandes faims, les tables qui s'allongent et les soirees qui commencent tot sans finir trop vite.</p></Reveal>
          </div>
          <Reveal delay={0.35}>
            <div className="grid gap-3 rounded-sm bg-bone p-5 text-cacao md:grid-cols-3">
              <Info label="Service" value="12h - 23h30" />
              <Info label="Ambiance" value="Tablees, feu doux" />
              <Info label="Acces" value="Centre-ville" />
            </div>
          </Reveal>
        </div>
      </section>

      <EditorialBlock eyebrow="Hola la table" title={`La salle de ${cityItem.name}, version Flam's.`} body="Du bois, du bruit juste comme il faut, des assiettes qui circulent, des verres qui restent sur la table. Ce faux contenu sert a voir les rythmes de lecture, les titres et les animations." />
      <section className="bg-cacao py-10 text-bone"><Marquee text={`Flam's ${cityItem.name} - Reserver - Carte - Grande table - Soiree chaude - `} /></section>
      <section className="grid min-h-screen bg-bone text-cacao lg:grid-cols-2">
        <Parallax label="food city" tone={["saffron", "ember", "wine"]} />
        <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
          <Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">Dans l'assiette</p></Reveal>
          <Title text="Des flammes, des verres, du rythme." dark />
          <Reveal delay={0.2}><p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">Une carte courte pour commander vite et partager longtemps. Ici on posera les vrais plats, les signatures et les offres locales.</p></Reveal>
          <Reveal delay={0.3}><Link className="mt-8 w-fit rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[.18em] transition hover:bg-cacao hover:text-bone" href="/menu">Voir la carte</Link></Reveal>
        </div>
      </section>
      <Gallery cityItem={cityItem} />
      <section className="grid gap-8 bg-cream px-5 py-24 text-cacao md:px-10 lg:grid-cols-3 lg:px-16">
        <TextCard title="Reserver" body="Un dejeuner rapide, une table de dix, une soiree qui s'improvise : le module de reservation viendra ici." href="/reservation" />
        <TextCard title="Groupes" body="Privatisation, anniversaire, grande table, equipe : cette zone servira a pousser les demandes groupe." href="/contact" />
        <TextCard title="Infos" body={`${cityItem.restaurants.length} adresse(s), horaires indicatifs, acces, contact et informations pratiques.`} href={`/restaurants/${cityItem.slug}`} />
      </section>
    </>
  );
}

function RestaurantPage({ cityItem, restaurant }: { cityItem: City; restaurant: Restaurant }) {
  return (
    <>
      <section className="grid min-h-screen gap-8 bg-cream px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[.9fr_1.1fr] lg:px-16">
        <div className="flex flex-col justify-end">
          <Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">Flam's {cityItem.name}</p></Reveal>
          <Title text={restaurant.name} dark />
          <Reveal delay={0.2}><p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">{restaurant.mood} Page detail en attente du contenu final : galerie, horaires, adresse, module reservation et acces carte.</p></Reveal>
        </div>
        <Visual label={restaurant.name} tone={cityItem.tone} className="min-h-[70vh]" />
      </section>
      <CityPage cityItem={cityItem} />
    </>
  );
}

function Interior({ page }: { page: string }) {
  return (
    <>
      <section className="grid min-h-screen gap-8 bg-cream px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[.9fr_1.1fr] lg:px-16">
        <div className="flex flex-col justify-end">
          <Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">{page}</p></Reveal>
          <Title text={pageTitle(page)} dark />
          <Reveal delay={0.2}><p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">Faux contenu pour visualiser l'architecture de page, les textes animes, les respirations et les appels a l'action.</p></Reveal>
        </div>
        <Visual label={pageTitle(page)} tone={["wine", "cacao", "ember"]} className="min-h-[70vh]" />
      </section>
      <EditorialBlock eyebrow="Contenu" title="Une section editoriale pour donner du rythme." body="On posera ici les vrais textes, les vrais modules et les visuels definitifs. Pour l'instant, tout sert a valider la structure." />
      <CTA />
    </>
  );
}

function EditorialBlock({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div><Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">{eyebrow}</p></Reveal><Title text={title} dark /></div>
        <Reveal delay={0.2}><p className="max-w-xl text-lg leading-8 text-cacao/65">{body}</p></Reveal>
      </div>
    </section>
  );
}

function Gallery({ cityItem }: { cityItem: City }) {
  return (
    <section className="bg-cacao px-5 py-24 text-bone md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">Ambiance</p></Reveal>
        <Title text="Ca vit, ca parle, ca partage." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Parallax label="salle" tone={cityItem.tone} />
          <Visual label="table" tone={["ink", "wine", "ember"]} className="min-h-[58vh]" />
          <Parallax label="verres" tone={["saffron", "ember", "wine"]} />
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: .7, delay, ease: [.16, 1, .3, 1] }}>
      {children}
    </motion.div>
  );
}

function Title({ text, dark = false, huge = false }: { text: string; dark?: boolean; huge?: boolean }) {
  return (
    <h1 className={`font-display uppercase leading-[.84] ${dark ? "text-cacao" : "text-bone"} ${huge ? "text-[24vw] md:text-[18vw] lg:text-[13vw]" : "text-7xl md:text-9xl"}`}>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="mr-[.18em] inline-block overflow-hidden">
          <motion.span className="inline-block" initial={{ y: "110%", rotate: 3 }} whileInView={{ y: "0%", rotate: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: index * .055, ease: [.16, 1, .3, 1] }}>
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function Visual({ label, tone, className = "" }: { label: string; tone: string[]; className?: string }) {
  return (
    <div className={`texture clip-visual relative min-h-[360px] overflow-hidden rounded-sm ${className}`} style={{ background: `linear-gradient(135deg, ${tone.map((item) => colors[item]).join(", ")})` }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,247,223,.42),transparent_22%),linear-gradient(120deg,transparent_0_48%,rgba(255,247,223,.18)_48%_51%,transparent_51%)]" />
      <div className="absolute left-6 top-6 h-20 w-20 rounded-full border border-bone/25" />
      <div className="absolute bottom-5 left-5 rounded-full border border-bone/35 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-bone">{label}</div>
    </div>
  );
}

function Parallax(props: { label: string; tone: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], [1.08, 1, 1.08]);
  return <div ref={ref} className="min-h-[58vh] overflow-hidden lg:min-h-screen"><motion.div style={{ y, scale }}><Visual {...props} className="min-h-[inherit]" /></motion.div></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-ember">{label}</p><p className="mt-2 font-black uppercase">{value}</p></div>;
}

function TextCard({ title, body, href }: { title: string; body: string; href: string }) {
  return <Reveal><Link href={href} className="block border-t border-cacao/20 pt-5 transition hover:text-ember"><h3 className="font-display text-6xl uppercase leading-none">{title}</h3><p className="mt-5 text-lg leading-8 text-cacao/65">{body}</p></Link></Reveal>;
}

function Marquee({ text }: { text: string }) {
  return <div className="overflow-hidden whitespace-nowrap"><motion.div animate={{ x: [0, -600] }} transition={{ repeat: Infinity, duration: 16, ease: "linear" }} className="font-display text-6xl uppercase md:text-8xl">{text.repeat(8)}</motion.div></div>;
}

function CTA() {
  return <section className="bg-ember px-5 py-20 text-bone md:px-10 lg:px-16"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><Title text="On garde une table ?" /><Link href="/reservation" className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-cacao hover:text-bone">Reserver</Link></div></section>;
}

function FloatingMenuButton() {
  return <Link href="/menu" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-cacao px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone shadow-soft transition hover:bg-ember">Voir la carte</Link>;
}

function Footer() {
  return <footer className="bg-ink px-5 py-14 text-bone md:px-10 lg:px-16"><div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p className="font-display text-6xl uppercase">Flam's</p><p className="mt-3 text-bone/55">Restaurant finder, carte, reservation, recrutement, contact.</p></div><div className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-[.16em]"><Link href="/menu">Carte</Link><Link href="/restaurants">Restaurants</Link><Link href="/credits">Credits</Link><Link href="/en">EN</Link></div></div></footer>;
}

function city(name: string, country: string, names: string[], tone: string[]): City {
  return {
    name,
    country,
    slug: slugify(name),
    tone,
    restaurants: names.map((restaurantName, index) => ({
      name: restaurantName,
      slug: slugify(restaurantName),
      mood: "Table chaude, rythme vif, ambiance de bande.",
      address: `${index + 1} rue des Tables`,
    })),
  };
}

function findCity(slug?: string) {
  return slug ? cities.find((cityItem) => cityItem.slug === slug) : undefined;
}

function pageTitle(page: string) {
  const titles: Record<string, string> = {
    menu: "La carte",
    restaurants: "Nos restaurants",
    reservation: "Reserver",
    recrutement: "Recrutement",
    "a-propos": "A propos",
    contact: "Contact",
    credits: "Credits",
  };
  return titles[page] ?? "Flam's";
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
