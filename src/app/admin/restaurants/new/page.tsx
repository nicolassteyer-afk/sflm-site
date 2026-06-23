import { AdminFrame } from "@/components/admin/AdminFrame";
import { RestaurantForm } from "../RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <AdminFrame>
      <div className="grid gap-8">
        <header>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Restaurant</p>
          <h1 className="mt-3 text-4xl font-black text-bone">Ajouter une adresse</h1>
        </header>
        <RestaurantForm />
      </div>
    </AdminFrame>
  );
}
