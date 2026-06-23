import { saveRestaurantAction } from "@/app/admin/actions";
import { FormField, ToggleField } from "@/components/admin/FormField";

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

type RestaurantForForm = {
  id?: string;
  name?: string;
  city?: string;
  slug?: string;
  address?: string;
  postalCode?: string | null;
  country?: string;
  phone?: string | null;
  email?: string | null;
  reservationUrl?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mainImage?: string | null;
  gallery?: unknown;
  shortDescription?: string | null;
  longDescription?: string | null;
  services?: unknown;
  isActive?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  displayOrder?: number;
  hours?: { day: string; opensAt?: string | null; closesAt?: string | null; isClosed: boolean; note?: string | null }[];
};

function csv(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export function RestaurantForm({ restaurant }: { restaurant?: RestaurantForForm }) {
  return (
    <form action={saveRestaurantAction} className="admin-card grid gap-5 p-6">
      {restaurant?.id ? <input type="hidden" name="id" value={restaurant.id} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Nom" name="name" defaultValue={restaurant?.name} />
        <FormField label="Ville" name="city" defaultValue={restaurant?.city} />
        <FormField label="Slug" name="slug" defaultValue={restaurant?.slug} />
        <FormField label="Adresse" name="address" defaultValue={restaurant?.address} />
        <FormField label="Code postal" name="postalCode" defaultValue={restaurant?.postalCode} />
        <FormField label="Pays" name="country" defaultValue={restaurant?.country ?? "France"} />
        <FormField label="Telephone" name="phone" defaultValue={restaurant?.phone} />
        <FormField label="Email" name="email" type="email" defaultValue={restaurant?.email} />
        <FormField label="Ordre" name="displayOrder" type="number" defaultValue={restaurant?.displayOrder ?? 0} />
        <FormField label="Latitude" name="latitude" type="number" defaultValue={restaurant?.latitude} />
        <FormField label="Longitude" name="longitude" type="number" defaultValue={restaurant?.longitude} />
        <ToggleField label="Actif" name="isActive" defaultChecked={restaurant?.isActive ?? true} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Lien reservation" name="reservationUrl" defaultValue={restaurant?.reservationUrl} />
        <FormField label="Lien Google Maps" name="googleMapsUrl" defaultValue={restaurant?.googleMapsUrl} />
        <FormField label="Image principale" name="mainImage" defaultValue={restaurant?.mainImage} />
        <FormField label="Galerie URLs separees par virgules" name="gallery" defaultValue={csv(restaurant?.gallery)} />
      </div>
      <FormField label="Description courte" name="shortDescription" textarea defaultValue={restaurant?.shortDescription} />
      <FormField label="Description longue" name="longDescription" textarea defaultValue={restaurant?.longDescription} />
      <FormField label="Services separes par virgules" name="services" defaultValue={csv(restaurant?.services)} />

      <div className="admin-card grid gap-4 p-4">
        <h2 className="font-black text-bone">Horaires</h2>
        {days.map((day) => {
          const hour = restaurant?.hours?.find((item) => item.day === day);
          return (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_1fr]" key={day}>
              <p className="self-center text-sm font-black uppercase tracking-[0.12em] text-bone/60">{day}</p>
              <FormField label="Ouverture" name={`${day}Open`} defaultValue={hour?.opensAt} />
              <FormField label="Fermeture" name={`${day}Close`} defaultValue={hour?.closesAt} />
              <FormField label="Note" name={`${day}Note`} defaultValue={hour?.note} />
              <ToggleField label="Ferme" name={`${day}Closed`} defaultChecked={hour?.isClosed ?? false} />
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Meta title" name="metaTitle" defaultValue={restaurant?.metaTitle} />
        <FormField label="Image Open Graph" name="ogImage" defaultValue={restaurant?.ogImage} />
      </div>
      <FormField label="Meta description" name="metaDescription" textarea defaultValue={restaurant?.metaDescription} />
      <button className="admin-button admin-button-primary" type="submit">Enregistrer</button>
    </form>
  );
}
