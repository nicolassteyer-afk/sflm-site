import { saveMenuCategoryAction, saveMenuItemAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField, ToggleField } from "@/components/admin/FormField";
import { getPrisma } from "@/lib/prisma";

export default async function AdminMenuPage() {
  const categories = await getPrisma().menuCategory.findMany({
    include: { items: { orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Carte</h1>
        </header>
        <section className="grid gap-5">
          {categories.map((category) => (
            <article className="admin-card grid gap-5 p-6" key={category.id}>
              <form action={saveMenuCategoryAction} className="grid gap-4">
                <input type="hidden" name="id" value={category.id} />
                <div className="grid gap-4 md:grid-cols-5">
                  <FormField label="Nom" name="name" defaultValue={category.name} />
                  <FormField label="Slug" name="slug" defaultValue={category.slug} />
                  <FormField label="Image" name="image" defaultValue={category.image} />
                  <FormField label="Ordre" name="displayOrder" type="number" defaultValue={category.displayOrder} />
                  <ToggleField label="Actif" name="isActive" defaultChecked={category.isActive} />
                </div>
                <FormField label="Description" name="description" textarea defaultValue={category.description} />
                <button className="admin-button" type="submit">Enregistrer categorie</button>
              </form>
              <div className="grid gap-3">
                {category.items.map((item) => (
                  <form action={saveMenuItemAction} className="grid gap-3 rounded-lg border border-bone/10 p-4" key={item.id}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="categoryId" value={category.id} />
                    <div className="grid gap-3 md:grid-cols-5">
                      <FormField label="Produit" name="name" defaultValue={item.name} />
                      <FormField label="Prix" name="price" type="number" defaultValue={item.price?.toString()} />
                      <FormField label="Image" name="image" defaultValue={item.image} />
                      <FormField label="Ordre" name="displayOrder" type="number" defaultValue={item.displayOrder} />
                      <ToggleField label="Actif" name="isActive" defaultChecked={item.isActive} />
                    </div>
                    <FormField label="Description" name="description" textarea defaultValue={item.description} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <FormField label="Tags" name="tags" defaultValue={Array.isArray(item.tags) ? item.tags.join(", ") : ""} />
                      <FormField label="Allergenes" name="allergens" defaultValue={Array.isArray(item.allergens) ? item.allergens.join(", ") : ""} />
                    </div>
                    <button className="admin-button" type="submit">Enregistrer produit</button>
                  </form>
                ))}
              </div>
              <form action={saveMenuItemAction} className="grid gap-3 rounded-lg border border-saffron/20 p-4">
                <input type="hidden" name="categoryId" value={category.id} />
                <div className="grid gap-3 md:grid-cols-4">
                  <FormField label="Nouveau produit" name="name" />
                  <FormField label="Prix" name="price" type="number" />
                  <FormField label="Ordre" name="displayOrder" type="number" defaultValue={category.items.length + 1} />
                  <ToggleField label="Actif" name="isActive" />
                </div>
                <button className="admin-button admin-button-primary" type="submit">Ajouter produit</button>
              </form>
            </article>
          ))}
          <form action={saveMenuCategoryAction} className="admin-card grid gap-4 p-6">
            <h2 className="text-xl font-black text-bone">Nouvelle categorie</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <FormField label="Nom" name="name" />
              <FormField label="Slug" name="slug" />
              <FormField label="Ordre" name="displayOrder" type="number" defaultValue={categories.length + 1} />
              <ToggleField label="Actif" name="isActive" />
            </div>
            <button className="admin-button admin-button-primary" type="submit">Ajouter categorie</button>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}
