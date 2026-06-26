import { notFound } from "next/navigation";
import { RestaurantCmsPage } from "@/components/RestaurantCmsPage";
import CityPage from "../page";
import { allRestaurants, getRestaurant } from "@/data/restaurants";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

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
  const cmsRestaurant = await getCmsRestaurant(restaurant);

  if (cmsRestaurant && slugify(cmsRestaurant.city) === city && cmsRestaurant.pageBlocks.length) {
    return <RestaurantCmsPage blocks={cmsRestaurant.pageBlocks} restaurant={cmsRestaurant} />;
  }

  if (!selectedRestaurant && !cmsRestaurant) notFound();

  return <CityPage params={Promise.resolve({ city })} />;
}

async function getCmsRestaurant(restaurantSlug: string) {
  try {
    return await getPrisma().restaurant.findFirst({
      where: {
        slug: restaurantSlug,
        isActive: true,
      },
      include: {
        hours: {
          orderBy: { displayOrder: "asc" },
        },
        pageBlocks: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });
  } catch (error) {
    console.warn("CMS restaurant unavailable, falling back to static page.", error);
    return null;
  }
}
