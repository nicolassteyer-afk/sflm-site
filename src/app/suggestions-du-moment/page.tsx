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
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
              Suggestions du moment
            </p>
            <h1 className="font-display text-7xl uppercase leading-[0.84] md:text-9xl lg:text-[9rem]">
              Le moment.
            </h1>
          </div>
          <div className="grid gap-6 lg:justify-items-end lg:text-right">
            <p className="max-w-xl text-lg font-bold leading-8 text-bone/72">
              Une selection courte, lisible et directe. Les produits restent
              visibles en entier, les choix sont accessibles sans masquer le
              visuel.
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
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
        </div>

        <SuggestionsMomentCarousel />

        <p className="mx-auto max-w-2xl text-center text-xs font-black uppercase tracking-[0.18em] text-bone/45">
          Produit visible en entier - selection automatique ou au clic
        </p>
      </div>
    </section>
  );
}
