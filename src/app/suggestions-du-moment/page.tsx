import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import cookieImage from "../../../assets/images/PDM-PRINTEMPS-2026-COOKIE-scaled (1).webp";
import kombuchaImage from "../../../assets/images/Kombucha-province (1).webp";

export const metadata = {
  title: "Suggestions du moment | Flam's",
  description:
    "Les envies Flam's a ne pas manquer en ce moment : flammes, boissons, desserts et idees a partager.",
};

type Suggestion = {
  image: StaticImageData;
  title: string;
  category: string;
  description: string;
  note: string;
};

const suggestions: Suggestion[] = [
  {
    image: cookieImage,
    title: "Cookie gourmand",
    category: "Dessert signature",
    description: "La douceur chaude et genereuse qui prolonge la table.",
    note: "A partager en fin de repas",
  },
  {
    image: kombuchaImage,
    title: "Kombucha province",
    category: "Boisson fraiche",
    description:
      "Une bulle fraiche, acidulee et legere pour les flammes de saison.",
    note: "Parfait avec une flam relevee",
  },
];

export default function SuggestionsDuMomentPage() {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <section className="px-5 pb-16 pt-28 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">
            Suggestions du moment
          </p>
          <p className="max-w-2xl text-base font-bold leading-7 text-bone/62 lg:justify-self-end lg:text-right">
            Une vitrine courte et mobile-first pour voir les produits en entier,
            comparer vite et passer a la carte sans friction.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-2">
          {suggestions.map((suggestion) => (
            <article
              className="overflow-hidden rounded-sm border border-bone/12 bg-bone text-cacao shadow-soft"
              key={suggestion.title}
            >
              <div className="relative grid min-h-[430px] place-items-center bg-cream p-5 md:min-h-[620px] md:p-8">
                <Image
                  alt={suggestion.description}
                  className="object-contain"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={suggestion.image}
                />
              </div>
              <div className="grid gap-4 p-6 md:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ember">
                  {suggestion.category}
                </p>
                <h2 className="font-display text-6xl uppercase leading-none">
                  {suggestion.title}
                </h2>
                <p className="max-w-lg text-sm font-bold leading-6 text-cacao/70">
                  {suggestion.description}
                </p>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cacao/45">
                  {suggestion.note}
                </p>
              </div>
            </article>
          ))}
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
