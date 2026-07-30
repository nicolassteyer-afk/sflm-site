import Link from "next/link";
import { SuggestionsMomentCarousel } from "@/components/SuggestionsMomentCarousel";

export const metadata = {
  title: "Suggestions du moment | Flam's",
  description:
    "Les envies Flam's a ne pas manquer en ce moment : flammes, boissons, desserts et idees a partager.",
};

export default function SuggestionsDuMomentPage() {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <section className="px-5 pb-10 pt-28 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">
            Suggestions du moment
          </p>
          <p className="max-w-2xl text-base font-bold leading-7 text-bone/62 lg:justify-self-end lg:text-right">
            Une vitrine courte et mobile-first pour voir les produits en entier,
            comparer vite et passer a la carte sans friction.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-7xl">
          <SuggestionsMomentCarousel />
        </div>

        <div className="mx-auto mt-7 flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-6xl uppercase leading-[0.84] md:text-8xl lg:text-[7.5rem]">
            A gouter maintenant.
          </h1>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-bone px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-cacao shadow-soft transition hover:bg-saffron"
              href="/la-carte"
            >
              Voir la carte
            </Link>
            <Link
              className="rounded-full border border-bone/35 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-bone transition hover:bg-bone hover:text-cacao"
              href="/reservation"
            >
              Reserver
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
