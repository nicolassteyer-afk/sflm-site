import Link from "next/link";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { SuggestionsMomentCarousel } from "@/components/SuggestionsMomentCarousel";

export const metadata = {
  title: "Suggestions du moment | Flam's",
  description:
    "Les envies Flam's a ne pas manquer en ce moment : flammes, boissons, desserts et idees a partager.",
};

const suggestions = [
  {
    category: "Flam signature",
    title: "La genereuse du moment",
    body: "Une base creme, des oignons fondants, du fromage qui file et une garniture pensee pour etre partagee bien chaude.",
  },
  {
    category: "A partager",
    title: "La table qui commence fort",
    body: "Planche, flammes a picorer et sauces maison pour lancer la soiree sans attendre que tout le monde ait choisi.",
  },
  {
    category: "Verre complice",
    title: "Le blanc gourmand",
    body: "Un accord frais et rond, parfait pour accompagner les flammes classiques comme les recettes plus relevees.",
  },
  {
    category: "Fin douce",
    title: "Le cookie gourmand",
    body: "Une touche sucree, servie pour rester encore un peu autour de la table.",
  },
];

export default function SuggestionsDuMomentPage() {
  return (
    <>
      <section className="min-h-screen bg-cacao px-5 pb-16 pt-28 text-bone md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
            Suggestions du moment
          </p>
          <AnimatedTitle
            className="max-w-6xl text-[17vw] md:text-[10vw] lg:text-[8vw]"
            text="Les envies qui tournent bien."
          />
          <p className="mt-7 max-w-2xl text-lg leading-8 text-bone/70">
            Une selection courte pour commander vite, partager chaud et garder
            le meilleur de la saison sur la table.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <SuggestionsMomentCarousel />
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-cacao transition hover:bg-saffron"
              href="/la-carte"
            >
              Voir la carte
            </Link>
            <Link
              className="rounded-full border border-bone/35 px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-bone transition hover:bg-bone hover:text-cacao"
              href="/reservation"
            >
              Reserver
            </Link>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
              A table maintenant
            </p>
            <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
              Quatre raisons de se laisser tenter.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {suggestions.map((suggestion) => (
              <article
                className="border-t border-cacao/20 pt-5"
                key={suggestion.title}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-ember">
                  {suggestion.category}
                </p>
                <h3 className="mt-4 font-display text-5xl uppercase leading-none md:text-6xl">
                  {suggestion.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-cacao/65">
                  {suggestion.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ember px-5 py-20 text-bone md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-7xl uppercase leading-[.86] md:text-9xl">
            On goute ca quand ?
          </h2>
          <Link
            className="w-fit rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-cacao transition hover:bg-cacao hover:text-bone"
            href="/restaurants"
          >
            Trouver un Flam's
          </Link>
        </div>
      </section>
    </>
  );
}
