import { saveFooterColumnAction, saveFooterLinkAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField, ToggleField } from "@/components/admin/FormField";
import { getPrisma } from "@/lib/prisma";

export default async function AdminFooterPage() {
  const columns = await getPrisma().footerColumn.findMany({
    include: { links: { orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Footer</h1>
        </header>
        <section className="grid gap-5">
          {columns.map((column) => (
            <article className="admin-card grid gap-4 p-6" key={column.id}>
              <form action={saveFooterColumnAction} className="grid gap-4 md:grid-cols-[1fr_160px_160px]">
                <input type="hidden" name="id" value={column.id} />
                <FormField label="Titre colonne" name="title" defaultValue={column.title} />
                <FormField label="Ordre" name="displayOrder" type="number" defaultValue={column.displayOrder} />
                <button className="admin-button self-end" type="submit">Enregistrer</button>
              </form>
              {column.links.map((link) => (
                <form action={saveFooterLinkAction} className="grid gap-3 rounded-lg border border-bone/10 p-4 md:grid-cols-5" key={link.id}>
                  <input type="hidden" name="id" value={link.id} />
                  <input type="hidden" name="columnId" value={column.id} />
                  <FormField label="Label" name="label" defaultValue={link.label} />
                  <FormField label="URL" name="url" defaultValue={link.url} />
                  <FormField label="Ordre" name="displayOrder" type="number" defaultValue={link.displayOrder} />
                  <ToggleField label="Nouvel onglet" name="openInNewTab" defaultChecked={link.openInNewTab} />
                  <button className="admin-button self-end" type="submit">Enregistrer</button>
                </form>
              ))}
              <form action={saveFooterLinkAction} className="grid gap-3 rounded-lg border border-saffron/20 p-4 md:grid-cols-4">
                <input type="hidden" name="columnId" value={column.id} />
                <FormField label="Nouveau lien" name="label" />
                <FormField label="URL" name="url" />
                <FormField label="Ordre" name="displayOrder" type="number" defaultValue={column.links.length + 1} />
                <button className="admin-button admin-button-primary self-end" type="submit">Ajouter</button>
              </form>
            </article>
          ))}
          <form action={saveFooterColumnAction} className="admin-card grid gap-4 p-6 md:grid-cols-[1fr_160px_160px]">
            <FormField label="Nouvelle colonne" name="title" />
            <FormField label="Ordre" name="displayOrder" type="number" defaultValue={columns.length + 1} />
            <button className="admin-button admin-button-primary self-end" type="submit">Ajouter</button>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}
