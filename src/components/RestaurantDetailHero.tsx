import Link from "next/link";
import type { Restaurant } from "@/data/restaurants";
import { AnimatedTitle } from "./AnimatedTitle";
import { VisualPlaceholder } from "./VisualPlaceholder";

export function RestaurantDetailHero({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section className="grid min-h-screen bg-bone text-cacao lg:grid-cols-2">
      <div className="relative min-h-[62vh] overflow-hidden bg-cacao lg:min-h-screen">
        <VisualPlaceholder
          className="absolute inset-0 min-h-full rounded-none"
          imageClassName="scale-110 opacity-90"
          clipped={false}
          label="visuel restaurant"
          showLabel={false}
          src={restaurant.mediaSrc}
          alt={restaurant.name}
          tone={restaurant.heroTone}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,13,.08),rgba(17,16,13,.52))]" />
      </div>

      <div className="flex min-h-[68vh] flex-col items-center justify-center px-5 pb-24 pt-32 text-center md:px-12 lg:min-h-screen">
        <p className="mb-8 text-xs font-black uppercase tracking-[0.18em] text-cacao">
          Comment ca flambe ?
        </p>
        <AnimatedTitle
          className="max-w-3xl text-[clamp(5rem,10vw,12rem)] text-cacao"
          text={restaurant.city}
        />
        <p className="mt-8 max-w-xl text-base font-bold uppercase tracking-[0.06em] text-cacao/55">
          {restaurant.name} / {restaurant.country}
        </p>
        <p className="mt-6 max-w-xl text-lg leading-8 text-cacao/65">{restaurant.mood}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            className="warm-button bg-cacao px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-bone"
            href="/reservation"
          >
            Reserver
          </Link>
          <Link
            className="border border-cacao/20 px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-cacao transition hover:border-cacao hover:bg-cacao hover:text-bone"
            href="/restaurants"
          >
            Tous les restaurants
          </Link>
        </div>
      </div>
    </section>
  );
}
