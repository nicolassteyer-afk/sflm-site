import { saveNavigationAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField, ToggleField } from "@/components/admin/FormField";
import { getPrisma } from "@/lib/prisma";

export default async function AdminNavigationPage() {
  const items = await getPrisma().navigationItem.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Navigation</h1>
        </header>
        <section className="grid gap-4">
          {items.map((item) => (
            <form action={saveNavigationAction} className="admin-card grid gap-4 p-5" key={item.id}>
              <input type="hidden" name="id" value={item.id} />
              <div className="grid gap-4 md:grid-cols-6">
                <FormField label="Label" name="label" defaultValue={item.label} />
                <FormField label="URL" name="url" defaultValue={item.url} />
                <FormField label="Ordre" name="displayOrder" type="number" defaultValue={item.displayOrder} />
                <ToggleField label="Visible" name="isVisible" defaultChecked={item.isVisible} />
                <ToggleField label="Nouvel onglet" name="openInNewTab" defaultChecked={item.openInNewTab} />
                <ToggleField label="CTA principal" name="isPrimaryCta" defaultChecked={item.isPrimaryCta} />
              </div>
              <button className="admin-button" type="submit">Enregistrer</button>
            </form>
          ))}
          <form action={saveNavigationAction} className="admin-card grid gap-4 p-5">
            <h2 className="text-xl font-black text-bone">Ajouter un lien</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <FormField label="Label" name="label" />
              <FormField label="URL" name="url" />
              <FormField label="Ordre" name="displayOrder" type="number" defaultValue={items.length + 1} />
              <ToggleField label="Visible" name="isVisible" />
            </div>
            <button className="admin-button admin-button-primary" type="submit">Ajouter</button>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}
