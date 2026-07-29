import Link from "next/link";
import { SuggestionsMomentCarousel } from "@/components/SuggestionsMomentCarousel";

export const metadata = {
  title: "Suggestions du moment | Flam's",
  description:
    "Les envies Flam's a ne pas manquer en ce moment : flammes, boissons, desserts et idees a partager.",
};

export default function SuggestionsDuMomentPage() {
  return (
    <section className="min-h-screen bg-cacao px-5 pb-12 pt-28 text-bone md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
            Suggestions du moment
          </p>
          <h1 className="font-display text-[18vw] uppercase leading-[0.82] md:text-[10vw] lg:text-[7vw]">
            A gouter maintenant.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-bold leading-8 text-bone/72">
            Deux produits a l'affiche, visibles en grand, pour choisir vite et
            reserver sans quitter l'envie.
          </p>
        </div>

        <div className="mt-10">
          <SuggestionsMomentCarousel />
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
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
      </div>
    </section>
  );
}
