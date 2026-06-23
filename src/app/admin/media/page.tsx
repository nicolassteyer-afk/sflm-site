import Image from "next/image";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField } from "@/components/admin/FormField";
import { getPrisma } from "@/lib/prisma";
import { deleteMediaAction, uploadMediaAction } from "./actions";

export default async function AdminMediaPage() {
  const media = await getPrisma().media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Medias</h1>
        </header>
        <form action={uploadMediaAction} className="admin-card grid gap-4 p-6">
          <h2 className="text-xl font-black text-bone">Uploader une image</h2>
          <input className="admin-input" name="file" type="file" accept="image/*" required />
          <FormField label="Texte alternatif" name="altText" />
          <button className="admin-button admin-button-primary" type="submit">Uploader</button>
        </form>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {media.map((item) => (
            <article className="admin-card overflow-hidden" key={item.id}>
              <div className="relative aspect-[4/3] bg-black/25">
                <Image src={item.url} alt={item.altText ?? item.filename} fill className="object-cover" sizes="(min-width: 1280px) 25vw, 50vw" />
              </div>
              <div className="grid gap-3 p-4">
                <p className="truncate text-sm font-black text-bone">{item.filename}</p>
                <input className="admin-input text-xs" readOnly value={item.url} />
                <p className="text-xs text-bone/45">{item.altText}</p>
                <form action={deleteMediaAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="admin-button w-full" type="submit">Supprimer</button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AdminFrame>
  );
}
