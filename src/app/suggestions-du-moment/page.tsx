import Link from "next/link";
import { SuggestionsMomentCarousel } from "@/components/SuggestionsMomentCarousel";

export const metadata = {
  title: "Suggestions du moment | Flam's",
  description:
    "Les envies Flam's a ne pas manquer en ce moment : flammes, boissons, desserts et idees a partager.",
};

export default function SuggestionsDuMomentPage() {
  return (
    <section className="min-h-screen bg-cacao px-5 pb-16 pt-28 text-bone md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-saffron">
          Suggestions du moment
        </p>
        <h1 className="mx-auto max-w-6xl font-display text-[18vw] uppercase leading-[0.82] md:text-[10vw] lg:text-[8vw]">
          Les envies qui tournent bien.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg font-bold leading-8 text-bone/75">
          Une selection courte pour commander vite, partager chaud et garder
          le meilleur de la saison sur la table.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-7xl">
        <SuggestionsMomentCarousel />
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-3">
        <Link
          className="rounded-full bg-bone px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-cacao shadow-soft transition hover:bg-saffron"
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
  );
}
