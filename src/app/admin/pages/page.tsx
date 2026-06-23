import Link from "next/link";
import { savePageAction } from "@/app/admin/actions";
import { FormField } from "@/components/admin/FormField";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { getPrisma } from "@/lib/prisma";

export default async function AdminPagesPage() {
  const pages = await getPrisma().page.findMany({ orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }] });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Pages</h1>
        </header>
        <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="admin-card divide-y divide-bone/10">
            {pages.length ? pages.map((page) => (
              <Link className="flex items-center justify-between gap-4 p-5 transition hover:bg-bone/5" href={`/admin/pages/${page.id}`} key={page.id}>
                <div>
                  <p className="font-black text-bone">{page.internalTitle}</p>
                  <p className="text-sm text-bone/45">/{page.slug}</p>
                </div>
                <span className="admin-badge">{page.status}</span>
              </Link>
            )) : <p className="p-6 text-sm text-bone/55">Aucune page en base.</p>}
          </div>
          <form action={savePageAction} className="admin-card grid gap-4 p-6">
            <h2 className="text-xl font-black text-bone">Nouvelle page</h2>
            <FormField label="Titre interne" name="internalTitle" />
            <FormField label="Titre affiche" name="displayTitle" />
            <FormField label="Slug" name="slug" />
            <FormField label="Ordre" name="displayOrder" type="number" defaultValue={0} />
            <label className="admin-label">
              Statut
              <select className="admin-select" name="status" defaultValue="DRAFT">
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publie</option>
              </select>
            </label>
            <button className="admin-button admin-button-primary" type="submit">Creer</button>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}
