import Link from "next/link";

const cities = [
  "Paris",
  "Bordeaux",
  "Lyon",
  "Lille",
  "Nice",
  "Marseille",
  "Strasbourg",
  "Bruxelles",
  "Londres",
];

export default function HomePage() {
  return (
    <main className="bg-cream text-cacao">
      <header className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-cacao/85 px-5 py-5 text-bone backdrop-blur-md md:px-10 lg:px-16">
        <Link className="rounded-full border border-bone/35 px-6 py-3 text-xs font-black uppercase tracking-[.18em] transition hover:bg-bone hover:text-cacao" href="/restaurants">
          Restaurants
        </Link>
        <Link className="justify-self-center font-display text-5xl uppercase leading-none" href="/">
          Flam's
        </Link>
        <Link className="rounded-full bg-ember px-6 py-3 text-xs font-black uppercase tracking-[.18em] text-bone transition hover:bg-saffron hover:text-cacao" href="/reservation">
          Reserver
        </Link>
      </header>

      <section className="relative grid min-h-screen place-items-center overflow-hidden bg-cacao px-5 py-28 text-bone">
        <div className="texture clip-visual absolute inset-0 bg-gradient-to-br from-wine via-cacao to-ember opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cacao to-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[.24em] text-saffron">
            Restaurant de grandes tables
          </p>
          <h1 className="font-display text-[24vw] uppercase leading-[.82] md:text-[17vw] lg:text-[12vw]">
            Flam's
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-bone/80">
            Un lieu chaud, direct, joyeux. On vient pour manger, on reste pour
            la table, le bruit, les verres et les copains.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-saffron" href="/reservation">
              Reserver
            </Link>
            <Link className="rounded-full border border-bone/35 px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone transition hover:bg-bone hover:text-cacao" href="/menu">
              Voir la carte
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-20 text-bone md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">
              La video
            </p>
            <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
              Le feu en vrai.
            </h2>
            <p className="mt-7 max-w-md text-lg leading-8 text-bone/65">
              Bloc video provisoire pour sentir l'ambiance Flam's pendant que
              les contenus definitifs arrivent.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-sm border border-bone/15 bg-cacao shadow-soft">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/KngfsVMDs3Q?autoplay=1&mute=1&loop=1&playlist=KngfsVMDs3Q&controls=0&modestbranding=1&playsinline=1&rel=0"
              title="Video Flam's"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">
              L'esprit
            </p>
            <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
              Une maison qui chauffe la salle avant meme l'assiette.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-cacao/65">
            Faux contenu pour visualiser l'architecture : lumiere basse, bois,
            braise suggeree, grandes tables et service vif. Les vrais textes
            viendront ensuite, mais le rythme de lecture est en place.
          </p>
        </div>
      </section>

      <section className="grid min-h-screen bg-bone text-cacao lg:grid-cols-2">
        <div className="texture clip-visual relative min-h-[58vh] bg-gradient-to-br from-saffron via-ember to-wine lg:min-h-screen">
          <div className="absolute bottom-5 left-5 rounded-full border border-bone/45 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-bone">
            Carte Flam's
          </div>
        </div>
        <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">
            La carte
          </p>
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
            Simple. chaud. a partager.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">
            Des flammes signatures, des boissons qui suivent, des desserts pour
            prolonger. Ici on posera la vraie carte avec les categories, les
            prix et les favoris.
          </p>
          <Link className="mt-8 w-fit rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[.18em] transition hover:bg-cacao hover:text-bone" href="/menu">
            Decouvrir la carte
          </Link>
        </div>
      </section>

      <section className="bg-cacao px-5 py-24 text-bone md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">
            Bientot
          </p>
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
            Le store locator arrive ici.
          </h2>
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {cities.map((city) => (
              <Link
                className="border-t border-bone/20 py-5 font-display text-5xl uppercase leading-none text-bone/70 transition hover:text-saffron"
                href={`/restaurants/${city.toLowerCase()}`}
                key={city}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ember px-5 py-20 text-bone md:px-10 lg:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
            On garde une table ?
          </h2>
          <Link className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-cacao hover:text-bone" href="/reservation">
            Reserver
          </Link>
        </div>
      </section>
    </main>
  );
}
