import { AnimatedTitle } from "@/components/AnimatedTitle";
import { allCities } from "@/data/restaurants";

export default function ReservationPage() {
  return (
    <section className="min-h-screen bg-cream px-5 pb-20 pt-36 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_.8fr]">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
            Reservation
          </p>
          <AnimatedTitle className="text-[17vw] text-cacao md:text-[10vw]" text="On bloque une table ?" />
          <p className="mt-8 max-w-xl text-lg leading-8 text-cacao/65">
            Module de reservation simule pour l'instant. Il pourra etre branche a
            Zenchef, SevenRooms, TheFork ou un formulaire maison.
          </p>
        </div>
        <form className="grid content-start gap-4 rounded-sm bg-bone p-6 shadow-soft">
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-cacao/60">
            Ville
            <select className="min-h-14 rounded-sm border border-cacao/15 bg-cream px-4 text-base font-bold text-cacao">
              {allCities.map((city) => (
                <option key={city.slug}>{city.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-cacao/60">
            Date
            <input className="min-h-14 rounded-sm border border-cacao/15 bg-cream px-4 text-base font-bold text-cacao" type="date" />
          </label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-cacao/60">
            Nombre de personnes
            <input className="min-h-14 rounded-sm border border-cacao/15 bg-cream px-4 text-base font-bold text-cacao" min="1" type="number" />
          </label>
          <button className="warm-button mt-3 min-h-16 rounded-full border border-cacao/25 px-6 text-xs font-black uppercase tracking-[0.18em] text-cacao hover:text-bone" type="button">
            Simuler la reservation
          </button>
        </form>
      </div>
    </section>
  );
}
