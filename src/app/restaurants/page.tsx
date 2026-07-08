import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CityGrid } from "@/components/CityGrid";
import { CountryCityNavigation } from "@/components/CountryCityNavigation";
import { StoreLocator } from "@/components/StoreLocator";
import { getPublicCities, getPublicCountries, getPublicRestaurants } from "@/lib/cms";

export default async function RestaurantsPage() {
  const [countries, cities, restaurants] = await Promise.all([
    getPublicCountries(),
    getPublicCities(),
    getPublicRestaurants(),
  ]);

  return (
    <>
      <section className="min-h-[78vh] bg-cream px-5 pb-20 pt-36 md:px-10 lg:px-16">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
          Store locator
        </p>
        <AnimatedTitle className="max-w-7xl text-[17vw] text-cacao md:text-[11vw]" text="Nos restaurants." />
        <p className="mt-8 max-w-2xl text-lg font-bold leading-8 text-cacao/70 md:text-xl">
          Cherchez une ville, choisissez une adresse, puis ouvrez la fiche du restaurant pour preparer votre table.
        </p>
      </section>
      <section className="bg-bone px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <StoreLocator restaurants={restaurants} />
        </div>
      </section>
      <section className="bg-bone px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <CountryCityNavigation countries={countries} />
        </div>
      </section>
      <section className="bg-cream px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <CityGrid cities={cities} />
        </div>
      </section>
    </>
  );
}
