import { notFound } from "next/navigation";
import { RestaurantCmsPage } from "@/components/RestaurantCmsPage";
import { CityRestaurantPage } from "../page";
import { allRestaurants, getRestaurant } from "@/data/restaurants";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

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
  const cmsRestaurant = await getPrisma().restaurant.findFirst({
    where: {
      slug: restaurant,
      isActive: true,
    },
    include: {
      pageBlocks: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (cmsRestaurant && slugify(cmsRestaurant.city) === city && cmsRestaurant.pageBlocks.length) {
    return <RestaurantCmsPage blocks={cmsRestaurant.pageBlocks} restaurant={cmsRestaurant} />;
  }

  if (!selectedRestaurant && !cmsRestaurant) notFound();

  return <CityRestaurantPage citySlug={city} restaurantSlug={restaurant} />;
}
