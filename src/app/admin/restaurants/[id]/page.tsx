import { notFound } from "next/navigation";
import { createDefaultRestaurantBlocksAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { RestaurantPageBuilder } from "@/components/admin/RestaurantPageBuilder";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { RestaurantForm } from "../RestaurantForm";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await getPrisma().restaurant.findUnique({
    where: { id },
    include: {
      hours: { orderBy: { displayOrder: "asc" } },
      pageBlocks: { orderBy: { displayOrder: "asc" } },
    },
  });
  if (!restaurant) notFound();

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Restaurant</p>
            <h1 className="mt-3 text-4xl font-black text-bone">{restaurant.name}</h1>
            <p className="mt-2 text-sm font-bold text-bone/45">
              /restaurants/{slugify(restaurant.city)}/{restaurant.slug}
            </p>
          </div>
          {restaurant.pageBlocks.length === 0 ? (
            <form action={createDefaultRestaurantBlocksAction}>
              <input type="hidden" name="restaurantId" value={restaurant.id} />
              <button className="admin-button admin-button-primary" type="submit">
                Creer les blocs depuis la page actuelle
              </button>
            </form>
          ) : null}
        </header>
        <section className="grid gap-4" id="page-builder">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Page builder</p>
              <h2 className="mt-2 text-3xl font-black text-slate-100">Edition visuelle de la page restaurant</h2>
              <p className="mt-2 text-sm font-bold text-slate-400">
                Glisse les blocs, modifie les contenus, puis ouvre la preview publique.
              </p>
            </div>
            <a
              className="admin-button admin-button-primary"
              href={`/restaurants/${slugify(restaurant.city)}/${restaurant.slug}`}
              target="_blank"
            >
              Ouvrir la preview
            </a>
          </div>
          <RestaurantPageBuilder
            blocks={restaurant.pageBlocks}
            publicUrl={`/restaurants/${slugify(restaurant.city)}/${restaurant.slug}`}
            restaurantId={restaurant.id}
          />
        </section>
        <section className="grid gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Fiche locator</p>
            <h2 className="mt-2 text-3xl font-black text-slate-100">Informations du point de vente</h2>
          </div>
          <RestaurantForm restaurant={restaurant} />
        </section>
      </div>
    </AdminFrame>
  );
}
