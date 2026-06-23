import { notFound } from "next/navigation";
import CityPage from "../page";
import { allRestaurants, getRestaurant } from "@/data/restaurants";

export function generateStaticParams() {
  return allRestaurants.map((restaurant) => ({
    city: restaurant.city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-"),
    restaurant: restaurant.slug,
  }));
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ city: string; restaurant: string }>;
}) {
  const { city, restaurant } = await params;
  const selectedRestaurant = getRestaurant(city, restaurant);

  if (!selectedRestaurant) notFound();

  if (city === "strasbourg" && restaurant === "rue-des-freres") {
    return <CityPage params={Promise.resolve({ city: "strasbourg" })} />;
  }

  if (city === "strasbourg" && restaurant === "place-austerlitz") {
    return <CityPage params={Promise.resolve({ city: "strasbourg" })} />;
  }

  return <CityPage params={Promise.resolve({ city })} />;
}
