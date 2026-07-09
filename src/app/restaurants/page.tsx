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
      <section className="bg-white pt-24">
        <StoreLocator restaurants={restaurants} />
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
