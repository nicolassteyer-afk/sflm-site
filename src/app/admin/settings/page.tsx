import { saveSettingsAction } from "@/app/admin/actions";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { FormField } from "@/components/admin/FormField";
import { getPrisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const settings = await getPrisma().siteSettings.findUnique({ where: { id: "site" } });

  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">CMS</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Parametres du site</h1>
        </header>
        <form action={saveSettingsAction} className="admin-card grid gap-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Nom du site" name="siteName" defaultValue={settings?.siteName ?? "Flam's"} />
            <FormField label="Email contact" name="contactEmail" defaultValue={settings?.contactEmail} />
            <FormField label="Telephone global" name="globalPhone" defaultValue={settings?.globalPhone} />
            <FormField label="URL reservation globale" name="globalReservationUrl" defaultValue={settings?.globalReservationUrl} />
            <FormField label="Favicon" name="favicon" defaultValue={settings?.favicon} />
            <FormField label="Logo clair" name="lightLogo" defaultValue={settings?.lightLogo} />
            <FormField label="Logo sombre" name="darkLogo" defaultValue={settings?.darkLogo} />
            <FormField label="Image Open Graph defaut" name="defaultOgImage" defaultValue={settings?.defaultOgImage} />
          </div>
          <FormField label="Description globale" name="globalDescription" textarea defaultValue={settings?.globalDescription} />
          <FormField label="Reseaux sociaux, separes par virgules" name="socialLinks" defaultValue={Array.isArray(settings?.socialLinks) ? settings?.socialLinks.join(", ") : ""} />
          <FormField label="Scripts analytics" name="analyticsScripts" textarea defaultValue={settings?.analyticsScripts} />
          <button className="admin-button admin-button-primary" type="submit">Enregistrer</button>
        </form>
      </div>
    </AdminFrame>
  );
}
