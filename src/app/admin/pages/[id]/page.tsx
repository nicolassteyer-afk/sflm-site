import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteBlockAction, saveBlockAction, savePageAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField, ToggleField } from "@/components/admin/FormField";
import { getPrisma } from "@/lib/prisma";

const blockTypes = [
  "HERO",
  "EDITORIAL_TEXT",
  "FULL_WIDTH_IMAGE",
  "IMAGE_TEXT",
  "GALLERY",
  "CTA",
  "MENU_PREVIEW",
  "STORE_LOCATOR_PREVIEW",
  "RESTAURANT_LIST",
  "RESERVATION",
  "FAQ",
  "BRAND_SECTION",
  "CITY_SECTION",
  "CONTACT_SECTION",
  "HTML_EMBED",
];

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPrisma().page.findUnique({
    where: { id },
    include: { blocks: { orderBy: { displayOrder: "asc" } } },
  });
  if (!page) notFound();

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Page</p>
            <h1 className="mt-3 text-4xl font-black text-bone">{page.internalTitle}</h1>
          </div>
          <Link className="admin-button" href={`/${page.slug === "accueil" ? "" : page.slug}`} target="_blank">Preview</Link>
        </header>

        <form action={savePageAction} className="admin-card grid gap-4 p-6">
          <input type="hidden" name="id" value={page.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Titre interne" name="internalTitle" defaultValue={page.internalTitle} />
            <FormField label="Titre affiche" name="displayTitle" defaultValue={page.displayTitle} />
            <FormField label="Slug" name="slug" defaultValue={page.slug} />
            <FormField label="Ordre" name="displayOrder" type="number" defaultValue={page.displayOrder} />
            <FormField label="Meta title" name="metaTitle" defaultValue={page.metaTitle} />
            <FormField label="Image Open Graph" name="ogImage" defaultValue={page.ogImage} />
          </div>
          <FormField label="Meta description" name="metaDescription" textarea defaultValue={page.metaDescription} />
          <label className="admin-label max-w-xs">
            Statut
            <select className="admin-select" name="status" defaultValue={page.status}>
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publie</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="admin-button" name="status" value="DRAFT" type="submit">Enregistrer brouillon</button>
            <button className="admin-button admin-button-primary" name="status" value="PUBLISHED" type="submit">Publier</button>
          </div>
        </form>

        <section className="grid gap-4">
          <h2 className="text-2xl font-black text-bone">Blocs</h2>
          {page.blocks.map((block) => (
            <form action={saveBlockAction} className="admin-card grid gap-4 p-5" key={block.id}>
              <input type="hidden" name="id" value={block.id} />
              <input type="hidden" name="pageId" value={page.id} />
              <div className="grid gap-4 md:grid-cols-4">
                <label className="admin-label">
                  Type
                  <select className="admin-select" name="type" defaultValue={block.type}>
                    {blockTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <FormField label="Ordre" name="displayOrder" type="number" defaultValue={block.displayOrder} />
                <FormField label="Variante" name="variant" defaultValue={block.variant} />
                <ToggleField label="Actif" name="isActive" defaultChecked={block.isActive} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Titre" name="title" defaultValue={block.title} />
                <FormField label="Sous-titre" name="subtitle" defaultValue={block.subtitle} />
                <FormField label="Image" name="image" defaultValue={block.image} />
                <FormField label="Galerie URLs separees par virgules" name="gallery" defaultValue={Array.isArray(block.gallery) ? block.gallery.join(", ") : ""} />
                <FormField label="CTA label" name="ctaLabel" defaultValue={block.ctaLabel} />
                <FormField label="CTA URL" name="ctaUrl" defaultValue={block.ctaUrl} />
              </div>
              <FormField label="Texte" name="body" textarea defaultValue={block.body} />
              <div className="flex flex-wrap gap-3">
                <button className="admin-button admin-button-primary" type="submit">Enregistrer</button>
                <button className="admin-button" formAction={deleteBlockAction} type="submit">Supprimer</button>
              </div>
            </form>
          ))}

          <form action={saveBlockAction} className="admin-card grid gap-4 p-5">
            <input type="hidden" name="pageId" value={page.id} />
            <h3 className="text-xl font-black text-bone">Ajouter un bloc</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="admin-label">
                Type
                <select className="admin-select" name="type" defaultValue="EDITORIAL_TEXT">
                  {blockTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <FormField label="Titre" name="title" />
              <FormField label="Ordre" name="displayOrder" type="number" defaultValue={page.blocks.length + 1} />
            </div>
            <ToggleField label="Actif" name="isActive" />
            <button className="admin-button admin-button-primary" type="submit">Ajouter</button>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}
