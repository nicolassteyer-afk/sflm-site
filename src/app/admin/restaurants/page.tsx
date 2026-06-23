import Link from "next/link";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { getPrisma } from "@/lib/prisma";

export default async function AdminRestaurantsPage() {
  const restaurants = await getPrisma().restaurant.findMany({ orderBy: [{ city: "asc" }, { displayOrder: "asc" }] });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
            <h1 className="mt-3 text-4xl font-black text-bone">Restaurants</h1>
          </div>
          <Link className="admin-button admin-button-primary" href="/admin/restaurants/new">Ajouter</Link>
        </header>
        <section className="admin-card divide-y divide-bone/10">
          {restaurants.length ? restaurants.map((restaurant) => (
            <Link className="flex items-center justify-between gap-4 p-5 transition hover:bg-bone/5" href={`/admin/restaurants/${restaurant.id}`} key={restaurant.id}>
              <div>
                <p className="font-black text-bone">{restaurant.name}</p>
                <p className="text-sm text-bone/45">{restaurant.city} - /restaurants/{restaurant.slug}</p>
              </div>
              <span className="admin-badge">{restaurant.isActive ? "Actif" : "Inactif"}</span>
            </Link>
          )) : <p className="p-6 text-sm text-bone/55">Aucun restaurant.</p>}
        </section>
      </div>
    </AdminFrame>
  );
}
