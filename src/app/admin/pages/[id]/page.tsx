import Link from "next/link";
import { notFound } from "next/navigation";
import { savePageAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField } from "@/components/admin/FormField";
import { PageBlockBuilder } from "@/components/admin/PageBlockBuilder";
import { getPrisma } from "@/lib/prisma";

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

        <PageBlockBuilder blocks={page.blocks} pageId={page.id} />
      </div>
    </AdminFrame>
  );
}
