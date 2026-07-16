import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CityGrid } from "@/components/CityGrid";
import { CountryCityNavigation } from "@/components/CountryCityNavigation";
import { getPublicCities, getPublicCountries } from "@/lib/cms";

export default async function RestaurantsPage() {
  const [countries, cities] = await Promise.all([getPublicCountries(), getPublicCities()]);

  return (
    <>
      <section className="min-h-[78vh] bg-cream px-5 pb-20 pt-36 md:px-10 lg:px-16">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
          Pays / villes / restaurants
        </p>
        <AnimatedTitle className="max-w-6xl text-[17vw] text-cacao md:text-[11vw]" text="Trouver sa table." />
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
