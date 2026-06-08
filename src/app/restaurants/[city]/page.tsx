import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { ScrollIconFrieze } from "@/components/ScrollIconFrieze";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { WaveText } from "@/components/WaveText";
import { allCities, getCity } from "@/data/restaurants";

export function generateStaticParams() {
  return allCities.map((city) => ({ city: city.slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();
  const isStrasbourg = city.slug === "strasbourg";

  return (
    <main className="relative min-h-screen bg-bone">
      {isStrasbourg ? <ScrollIconFrieze /> : null}

      <section className="grid min-h-screen bg-bone lg:grid-cols-2">
        <div className="relative min-h-[52vh] overflow-hidden bg-cacao lg:min-h-screen">
          {isStrasbourg ? (
            <iframe
              allow="autoplay; encrypted-media; picture-in-picture"
              aria-label="Ambiance Flam's Strasbourg"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-125 border-0"
              src="https://www.youtube.com/embed/KngfsVMDs3Q?autoplay=1&mute=1&controls=0&loop=1&playlist=KngfsVMDs3Q&playsinline=1&rel=0&modestbranding=1"
              title="Video Flam's Strasbourg"
            />
          ) : (
            <VisualPlaceholder
              className="absolute inset-0 min-h-full rounded-none"
              imageClassName="scale-110 opacity-90"
              clipped={false}
              label={city.name}
              showLabel={false}
              src={city.restaurants[0]?.mediaSrc}
              alt={`Ambiance Flam's ${city.name}`}
              tone={city.previewTone}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.08),rgba(42,21,17,.28))]" />
        </div>

        <div className="relative flex min-h-[48vh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-32 text-center md:px-12 lg:min-h-screen">
          <p className="mb-10 text-xs font-black uppercase tracking-[0.18em] text-cacao">
            Comment ca flambe ?
          </p>
          <AnimatedTitle
            className="max-w-full whitespace-nowrap text-[clamp(4rem,7.2vw,8.5rem)] text-cacao"
            text={city.name}
          />
        </div>
      </section>

      {isStrasbourg ? (
        <>
          <section className="grid min-h-screen bg-cacao text-bone lg:grid-cols-2">
            <div className="relative min-h-[58vh] overflow-hidden lg:min-h-screen">
              <VisualPlaceholder
                alt="Table Flam's Strasbourg"
                className="absolute inset-0 min-h-full rounded-none"
                clipped={false}
                imageClassName="scale-105 opacity-95"
                label="table Flam's"
                showLabel={false}
                src="/assets/flams/table-partage.png"
                tone="from-wine via-cacao to-ember"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,13,.1),rgba(17,16,13,.5))]" />
            </div>
            <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
                Le rituel
              </p>
              <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
                Grande faim, grande table, zero chichi.
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-8 text-bone/70">
                Strasbourg, c'est notre point de depart imaginaire : une pate
                fine, des bords qui chantent, une planche au milieu et personne
                qui compte vraiment les parts. Le service va droit au but, la
                salle reste chaude, et le feu se devine plus qu'il ne se montre.
              </p>
              <div className="mt-10 grid gap-5 text-sm font-black uppercase tracking-[0.14em] text-bone/65 sm:grid-cols-3">
                <span className="border-t border-bone/20 pt-4">Midi vif</span>
                <span className="border-t border-bone/20 pt-4">Soir bruyant</span>
                <span className="border-t border-bone/20 pt-4">Tables a partager</span>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-bone px-5 py-24 text-cacao md:px-10 lg:px-16">
            <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] opacity-[0.07]">
              <img
                alt=""
                className="h-full w-full object-contain"
                src="/assets/flams/flamme-bordeaux.png"
              />
            </div>
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
                  Strasbourg sauce Flam's
                </p>
                <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
                  Ici, l'Alsace claque a table.
                </h2>
              </div>
              <WaveText
                className="max-w-3xl text-3xl font-black leading-[1.08] md:text-5xl lg:text-6xl"
                text="On arrive pour une flammekueche croustillante, on reste pour le bruit des copains, les verres qui circulent et cette chaleur simple qui transforme un diner en vraie soiree."
              />
            </div>
          </section>
        </>
      ) : null}

      <Link
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 bg-cacao px-12 py-6 text-xs font-black uppercase tracking-[0.18em] text-bone shadow-soft transition hover:bg-ember"
        href="/reservation"
      >
        Reserver
      </Link>
    </main>
  );
}
