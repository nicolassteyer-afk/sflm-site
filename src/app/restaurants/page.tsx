import { StoreLocator } from "@/components/StoreLocator";
import { getPublicRestaurants } from "@/lib/cms";

export default async function RestaurantsPage() {
  const restaurants = await getPublicRestaurants();

  return (
    <section className="bg-white pt-24">
      <StoreLocator restaurants={restaurants} />
    </section>
  );
}
