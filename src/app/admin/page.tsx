import Link from "next/link";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { getDashboardStats } from "@/lib/cms";

const shortcuts = [
  ["Modifier homepage", "/admin/pages"],
  ["Ajouter un restaurant", "/admin/restaurants/new"],
  ["Modifier la carte", "/admin/menu"],
  ["Gerer les medias", "/admin/media"],
  ["Navigation / footer", "/admin/navigation"],
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <AdminFrame>
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Flam's CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Dashboard</h1>
        </div>
        <Link className="admin-button" href="/" target="_blank">Voir le site</Link>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Pages", stats.pages],
          ["Restaurants actifs", stats.restaurants],
          ["Produits actifs", stats.products],
        ].map(([label, value]) => (
          <article className="admin-card p-6" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-bone/45">{label}</p>
            <p className="mt-5 text-5xl font-black text-bone">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="admin-card p-6">
          <h2 className="text-lg font-black text-bone">Raccourcis</h2>
          <div className="mt-5 grid gap-3">
            {shortcuts.map(([label, href]) => (
              <Link className="rounded-lg border border-bone/10 px-4 py-4 text-sm font-bold text-bone/72 transition hover:border-saffron/70 hover:text-saffron" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="admin-card p-6">
          <h2 className="text-lg font-black text-bone">Derniers contenus modifies</h2>
          <div className="mt-5 grid gap-3">
            {stats.recent.length ? stats.recent.map((item) => (
              <div className="flex items-center justify-between gap-4 border-b border-bone/10 py-3" key={`${item.type}-${item.id}`}>
                <div>
                  <p className="font-bold text-bone">{item.title}</p>
                  <p className="text-sm text-bone/45">{item.type}</p>
                </div>
                <span className="admin-badge">{item.status}</span>
              </div>
            )) : (
              <p className="text-sm text-bone/55">Aucun contenu en base pour le moment. Lancez le seed pour remplir le CMS.</p>
            )}
          </div>
        </div>
      </section>
    </div>
    </AdminFrame>
  );
}
