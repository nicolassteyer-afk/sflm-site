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

export default function Page() {
  return (
    <main className="bg-cream text-cacao">
      <section className="relative min-h-screen overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0 scale-105">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute left-1/2 top-1/2 h-[115vh] w-[204vh] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/KngfsVMDs3Q?autoplay=1&mute=1&loop=1&playlist=KngfsVMDs3Q&controls=0&modestbranding=1&playsinline=1&rel=0"
            title="Video Flam's"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-cacao/20 to-ink/80" />
        <div className="texture absolute inset-0 opacity-40" />

        <div className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-14 pt-32 md:px-10 lg:px-16 lg:pb-20">
          <div className="max-w-7xl">
            <p className="mb-5 w-fit rounded-full border border-bone/25 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-saffron backdrop-blur-sm">
              Restaurant de grandes tables
            </p>
            <h1 className="sr-only">Flam's</h1>
            <img
              alt="Dragon Flam's"
              className="h-auto w-[min(52vw,260px)] drop-shadow-[0_24px_62px_rgba(0,0,0,.34)] sm:w-[min(38vw,320px)] lg:w-[min(25vw,360px)]"
              draggable={false}
              src="/assets/flams/dragon-beige.png"
            />
            <div className="mt-6 grid gap-6 lg:grid-cols-[.95fr_1fr] lg:items-end">
              <p className="max-w-2xl text-lg leading-8 text-bone/85 md:text-2xl md:leading-9">
                Un lieu chaud, direct, joyeux. On vient pour manger, on reste
                pour la table, le bruit, les verres et les copains.
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link className="warm-button rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:text-bone" href="/reservation">
                  Reserver
                </Link>
                <Link className="rounded-full border border-bone/35 px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-bone transition hover:bg-bone hover:text-cacao" href="/menu">
                  Voir la carte
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-14 flex items-center gap-3 text-xs font-black uppercase tracking-[.2em] text-bone/70">
            <span className="h-px w-14 bg-bone/45" />
            Scroll
          </div>
        </div>
      </section>

      <section className="grid min-h-screen bg-cream text-cacao lg:grid-cols-[.95fr_1.05fr]">
        <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">
            L'esprit Flam's
          </p>
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
            Une maison qui chauffe la salle avant meme l'assiette.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-cacao/65">
            Faux contenu pour visualiser l'architecture : lumiere basse, bois,
            braise suggeree, grandes tables et service vif. Les vrais textes
            viendront ensuite, mais le rythme de lecture est en place.
          </p>
        </div>
        <div className="texture relative min-h-[62vh] overflow-hidden bg-cacao lg:min-h-screen">
          <div className="absolute inset-8 bg-[linear-gradient(135deg,#65131a,#ef3c19_52%,#f3b12a)] shadow-soft transition duration-700 hover:scale-[1.02]" />
          <div className="absolute bottom-10 left-10 right-10 border-t border-bone/30 pt-6 text-bone">
            <p className="font-display text-6xl uppercase leading-none md:text-8xl">
              Feu doux. Grande table.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-wine px-5 py-24 text-bone md:px-10 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-px bg-bone/25" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-saffron">
              La carte
            </p>
            <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
              Simple. chaud. a partager.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["Flammes", "Des recettes fines, croustillantes, posees au centre."],
              ["Verres", "Bieres, vins et bulles pour tenir la conversation."],
              ["Desserts", "Le dernier morceau qu'on pretend ne pas vouloir."],
              ["Groupes", "Des tables faites pour reserver nombreux."],
            ].map(([title, text]) => (
              <Link
                className="group border-t border-bone/25 py-6 transition hover:border-saffron"
                href="/menu"
                key={title}
              >
                <h3 className="font-display text-5xl uppercase leading-none transition group-hover:text-saffron">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-bone/65">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[.22em] text-ember">
            Bientot
          </p>
          <h2 className="max-w-5xl font-display text-7xl uppercase leading-[.86] md:text-9xl">
            Le store locator prendra place ici.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-cacao/65">
            Pour l'instant, les villes restent visibles pour comprendre le futur
            parcours restaurants. Le vrai module arrivera ensuite.
          </p>
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {cities.map((city) => (
              <Link
                className="group border-t border-cacao/20 py-5 transition hover:border-ember"
                href={`/restaurants/${city.toLowerCase()}`}
                key={city}
              >
                <span className="font-display text-5xl uppercase leading-none text-cacao/75 transition group-hover:text-ember">
                  {city}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[76vh] overflow-hidden bg-cacao px-5 py-24 text-bone md:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(243,177,42,.28),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(239,60,25,.28),transparent_28%)]" />
        <div className="relative z-10 flex min-h-[55vh] flex-col justify-between">
          <p className="text-xs font-black uppercase tracking-[.22em] text-saffron">
            Reservation
          </p>
          <div className="max-w-6xl">
            <h2 className="font-display text-7xl uppercase leading-[.82] md:text-9xl lg:text-[11vw]">
              On garde une table ?
            </h2>
            <Link className="mt-8 inline-block rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[.18em] text-cacao transition hover:bg-saffron" href="/reservation">
              Reserver maintenant
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
