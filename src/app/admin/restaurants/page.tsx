import Link from "next/link";
import { importStaticRestaurantsAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export default async function AdminRestaurantsPage() {
  const restaurants = await getPrisma().restaurant.findMany({
    include: { pageBlocks: true },
    orderBy: [{ city: "asc" }, { displayOrder: "asc" }],
  });
  const activeRestaurants = restaurants.filter((restaurant) => restaurant.isActive);
  const cities = Array.from(new Set(restaurants.map((restaurant) => restaurant.city))).sort();
  const restaurantsWithCms = restaurants.filter((restaurant) => restaurant.pageBlocks.length > 0);

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Store locator</p>
            <h1 className="mt-3 text-4xl font-black text-slate-100">Pilotage restaurants</h1>
            <p className="mt-2 max-w-3xl text-sm font-bold text-slate-400">
              Gere les villes, les fiches restaurant, les URLs publiques et les pages restaurant editables par blocs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <form action={importStaticRestaurantsAction}>
              <button className="admin-button" type="submit">Importer le site</button>
            </form>
            <Link className="admin-button admin-button-primary" href="/admin/restaurants/new">Ajouter</Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="admin-kpi">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Restaurants</p>
            <p className="mt-3 text-4xl font-black text-slate-100">{restaurants.length}</p>
          </div>
          <div className="admin-kpi">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Villes</p>
            <p className="mt-3 text-4xl font-black text-slate-100">{cities.length}</p>
          </div>
          <div className="admin-kpi">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Actifs</p>
            <p className="mt-3 text-4xl font-black text-slate-100">{activeRestaurants.length}</p>
          </div>
          <div className="admin-kpi">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Pages CMS</p>
            <p className="mt-3 text-4xl font-black text-cyan-200">{restaurantsWithCms.length}</p>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <div className="admin-card p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">Inventaire</p>
                <h2 className="mt-2 text-2xl font-black text-slate-100">Restaurants et pages</h2>
              </div>
            </div>

            <div className="grid gap-3">
              {restaurants.length ? restaurants.map((restaurant) => {
                const publicUrl = `/restaurants/${slugify(restaurant.city)}/${restaurant.slug}`;
                return (
                  <article className="admin-table-row grid gap-4 p-4 lg:grid-cols-[1fr_auto]" key={restaurant.id}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-black text-slate-100">{restaurant.name}</h3>
                        <span className="admin-badge">{restaurant.isActive ? "Actif" : "Inactif"}</span>
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                          {restaurant.pageBlocks.length ? `${restaurant.pageBlocks.length} blocs` : "Page a creer"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-400">{restaurant.city} - {restaurant.address}</p>
                      <p className="mt-1 truncate text-sm text-cyan-300">{publicUrl}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <Link className="admin-button" href={publicUrl} target="_blank">Preview</Link>
                      <Link className="admin-button" href={`/admin/restaurants/${restaurant.id}`}>Editer</Link>
                      <Link className="admin-button admin-button-primary" href={`/admin/restaurants/${restaurant.id}#page-builder`}>Blocs</Link>
                    </div>
                  </article>
                );
              }) : <p className="p-6 text-sm text-slate-400">Aucun restaurant. Clique sur Importer le site.</p>}
            </div>
          </div>

          <aside className="admin-card overflow-hidden">
            <div className="border-b border-slate-800 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">Preview locator</p>
              <h2 className="mt-2 text-2xl font-black text-slate-100">Carte operationnelle</h2>
            </div>
            <div className="relative min-h-[520px] bg-slate-950 p-5">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(34,211,238,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.12)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="relative grid gap-3">
                {cities.map((city, index) => {
                  const cityRestaurants = restaurants.filter((restaurant) => restaurant.city === city);
                  return (
                    <div className="rounded-lg border border-cyan-400/20 bg-slate-900/80 p-4 shadow-lg shadow-cyan-950/20" key={city}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-slate-100">{city}</p>
                        <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-black text-slate-950">{cityRestaurants.length}</span>
                      </div>
                      <div className="mt-3 h-1 rounded-full bg-slate-800">
                        <div className="h-1 rounded-full bg-cyan-300" style={{ width: `${Math.min(100, 18 + index * 11)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </AdminFrame>
  );
}
