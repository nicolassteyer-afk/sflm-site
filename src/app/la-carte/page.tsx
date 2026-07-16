import Link from "next/link";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { getPublicRestaurants } from "@/lib/cms";

export const metadata = {
  title: "La carte | Flam's",
  description: "Choisissez votre restaurant Flam's et ouvrez la carte digitale.",
};

export default async function LaCartePage() {
  const restaurants = await getPublicRestaurants();

  return (
    <>
      <section className="grid min-h-[72vh] items-end bg-cream px-5 pb-16 pt-32 md:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
            La carte
          </p>
          <AnimatedTitle
            className="max-w-5xl text-[18vw] text-cacao md:text-[11vw]"
            text="Choisis ta table."
          />
          <p className="mt-8 max-w-2xl text-lg font-bold leading-8 text-cacao/60">
            Retrouve ton restaurant Flam's et ouvre sa carte digitale avant de
            commander, partager, defendre ta derniere part.
          </p>
        </div>
      </section>

      <section className="bg-bone px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4">
          {restaurants.map((restaurant) => (
            <article
              className="grid gap-6 border-t border-cacao/15 py-8 md:grid-cols-[1fr_auto] md:items-center"
              key={`${restaurant.city}-${restaurant.slug}`}
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-ember">
                  {restaurant.city}
                </p>
                <h2 className="mt-2 font-display text-5xl uppercase leading-none text-cacao md:text-7xl">
                  {restaurant.name}
                </h2>
                <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-cacao/55">
                  {[restaurant.address, restaurant.postalCode, restaurant.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <Link
                className="warm-button inline-flex min-h-16 items-center justify-center rounded-full bg-ember px-8 text-center text-xs font-black uppercase tracking-[0.16em] text-bone transition hover:bg-wine md:min-w-64"
                href="/menu"
              >
                Voir la carte digitale
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
