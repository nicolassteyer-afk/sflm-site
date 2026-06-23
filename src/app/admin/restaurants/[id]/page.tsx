import { notFound } from "next/navigation";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { getPrisma } from "@/lib/prisma";
import { RestaurantForm } from "../RestaurantForm";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await getPrisma().restaurant.findUnique({
    where: { id },
    include: { hours: { orderBy: { displayOrder: "asc" } } },
  });
  if (!restaurant) notFound();

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Restaurant</p>
          <h1 className="mt-3 text-4xl font-black text-bone">{restaurant.name}</h1>
        </header>
        <RestaurantForm restaurant={restaurant} />
      </div>
    </AdminFrame>
  );
}
