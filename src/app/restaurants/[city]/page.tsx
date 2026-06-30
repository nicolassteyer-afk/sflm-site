import { notFound } from "next/navigation";
import Link from "next/link";
import { StrasbourgHorizontalStory } from "@/components/StrasbourgHorizontalStory";
import { StrasbourgRitualSectionV2 } from "@/components/StrasbourgRitualSectionV2";
import { TextPressure } from "@/components/TextPressure";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { WaveText } from "@/components/WaveText";
import { allCities, getCity, getRestaurant } from "@/data/restaurants";
import styles from "./city-title.module.css";

const cityCopy: Record<
  string,
  {
    heroEyebrow: string;
    pressure: [string, string, string];
    ritualEyebrow: string;
    ritualTitle: string;
    ritualBody: string;
    ritualStats: { label: string }[];
    closingEyebrow: string;
    closingTitle: string;
    closingBody: string;
  }
> = {
  paris: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["DES GRANDES", "TABLEES", "QUI DEBORDENT"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Grande tablee, service vif, soiree longue.",
    ritualBody:
      "A Paris, Flam's avance vite sans perdre la chaleur. On pose les planches, les verres suivent, et la salle garde juste ce qu'il faut de bruit pour donner envie de rester encore un peu.",
    ritualStats: [
      { label: "Midi rapide" },
      { label: "Soir qui dure" },
      { label: "Copains en bande" },
    ],
    closingEyebrow: "Paris sauce Flam's",
    closingTitle: "Ici, la table donne le rythme.",
    closingBody:
      "On vient pour une pate fine bien envoyee, on reste pour l'energie, les banquettes pleines, les assiettes qui circulent et la sensation simple d'etre exactement au bon endroit.",
  },
  bordeaux: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["DU VIN", "DES PLANCHES", "ET DU BRUIT"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Grande faim, grands verres, zero detour.",
    ritualBody:
      "A Bordeaux, Flam's prend une allure plus profonde, plus boisee, plus franche. On partage, on trinque, on commande une deuxieme tournee sans faire de ceremonie.",
    ritualStats: [
      { label: "Midi franc" },
      { label: "Soir chaleureux" },
      { label: "Tables genereuses" },
    ],
    closingEyebrow: "Bordeaux sauce Flam's",
    closingTitle: "Ici, la chaleur reste jusqu'au dernier verre.",
    closingBody:
      "Une flammekueche qui croustille, des verres qui reviennent, et cette ambiance bordeaux ou tout parait plus dense, plus ample, plus vivant autour de la table.",
  },
  lyon: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["CA PART", "CA TOURNE", "CA REVIENT"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Service net, grande table, energie vive.",
    ritualBody:
      "A Lyon, on garde le geste direct. La salle prend vite, le rythme monte vite aussi, et chacun trouve sa place entre une planche au centre et des assiettes qui s'enchainent.",
    ritualStats: [
      { label: "Midi tendu" },
      { label: "Soir anime" },
      { label: "Partage naturel" },
    ],
    closingEyebrow: "Lyon sauce Flam's",
    closingTitle: "Ici, ca mange vite et ca reste longtemps.",
    closingBody:
      "On attaque sans attendre, puis la soiree s'installe. Une pate fine, un feu suggere, des eclats de voix et une table qui finit toujours par gagner une ou deux personnes de plus.",
  },
  lille: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["DES COPAINS", "DES PLANCHES", "ET CA TOURNE"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Table pleine, ton direct, chaleur immediate.",
    ritualBody:
      "A Lille, Flam's joue la convivialite sans filtre. Ca arrive vite, ca parle fort, ca commande a plusieurs et ca garde ce fond chaleureux qui rend les grandes tablees evidentes.",
    ritualStats: [
      { label: "Midi vivant" },
      { label: "Soir debout presque" },
      { label: "Partage immediat" },
    ],
    closingEyebrow: "Lille sauce Flam's",
    closingTitle: "Ici, on ne vient jamais vraiment seul.",
    closingBody:
      "Une adresse qui appelle les grandes tables, les coups a boire, les parts qu'on attrape au milieu et cette generosite simple qui fait tout le style Flam's.",
  },
  strasbourg: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["DU BRUIT", "DU DEBORDEMENT", "DES RIRES A TABLE"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Grande faim, grande table, zero chichi.",
    ritualBody:
      "Strasbourg, c'est notre point de depart imaginaire : une pate fine, des bords qui chantent, une planche au milieu et personne qui compte vraiment les parts. Le service va droit au but, la salle reste chaude, et le feu se devine plus qu'il ne se montre.",
    ritualStats: [
      { label: "Midi vif" },
      { label: "Soir bruyant" },
      { label: "Tables a partager" },
    ],
    closingEyebrow: "Strasbourg sauce Flam's",
    closingTitle: "Ici, l'Alsace claque a table.",
    closingBody:
      "On arrive pour une flammekueche croustillante, on reste pour le bruit des copains, les verres qui circulent et cette chaleur simple qui transforme un diner en vraie soiree.",
  },
  "thonon-les-bains": {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["DU CALME", "DU PARTAGE", "ET DU FEU"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Entre lac et table chaude, tout s'equilibre.",
    ritualBody:
      "A Thonon-les-Bains, Flam's prend un souffle plus pose sans perdre son energie. Les planches arrivent au milieu, la table s'organise seule et la chaleur monte naturellement.",
    ritualStats: [
      { label: "Midi clair" },
      { label: "Soir doux" },
      { label: "Table qui s'etire" },
    ],
    closingEyebrow: "Thonon-les-Bains sauce Flam's",
    closingTitle: "Ici, la generosite prend son temps.",
    closingBody:
      "Une ambiance simple, directe, solaire. On partage une flammekueche, un verre, une sauce qui pique un peu, et tout se met en place sans effort autour de la table.",
  },
  arras: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["CA RIGOLE", "CA CROQUE", "CA REPART"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Une grande table, du repondant, aucune pose.",
    ritualBody:
      "A Arras, Flam's garde le gout des tablees qui se remplissent d'un coup. On partage vite, on reprend une part, on appelle une autre carafe, et le ton reste simple du debut a la fin.",
    ritualStats: [
      { label: "Midi cash" },
      { label: "Soir franc" },
      { label: "Tables qui appellent" },
    ],
    closingEyebrow: "Arras sauce Flam's",
    closingTitle: "Ici, la table prend toute la place.",
    closingBody:
      "Des bords qui chantent, des verres qui cognent un peu, et une ambiance qui dit tout de suite qu'on est la pour manger bien, parler fort et rester ensemble.",
  },
  selestat: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["L'ALSACE", "ENCORE", "ET ENSEMBLE"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Le feu discret, la salle chaude, la table pleine.",
    ritualBody:
      "A Selestat, Flam's reprend ses appuis alsaciens avec une energie plus contemporaine. La pate file, les parts se volent un peu, et l'ambiance garde toujours ce fond genereux.",
    ritualStats: [
      { label: "Midi alsacien" },
      { label: "Soir complice" },
      { label: "Partage instinctif" },
    ],
    closingEyebrow: "Selestat sauce Flam's",
    closingTitle: "Ici, l'Alsace reste vive et gourmande.",
    closingBody:
      "Une adresse qui melange precision, chaleur et bruit juste comme il faut. On y retrouve l'esprit Flam's: une table qui rassemble, un service qui avance, une soiree qui se pose.",
  },
  nantes: {
    heroEyebrow: "Comment ca flambe ?",
    pressure: ["DES GRANDES", "ENVIES", "ET DU MOUVEMENT"],
    ritualEyebrow: "Le rituel",
    ritualTitle: "Le bon bruit, la bonne table, le bon rythme.",
    ritualBody:
      "A Nantes, Flam's prend de l'elan. Les salles se remplissent avec fluidite, les verres suivent les plats, et le partage devient presque un reflexe des les premieres minutes.",
    ritualStats: [
      { label: "Midi fluide" },
      { label: "Soir qui monte" },
      { label: "Tables mouvantes" },
    ],
    closingEyebrow: "Nantes sauce Flam's",
    closingTitle: "Ici, tout commence autour d'une planche.",
    closingBody:
      "On se retrouve, on commande large, on s'installe pour de vrai. Une table Flam's a Nantes, c'est une energie directe, festive et sans distance.",
  },
};

export function generateStaticParams() {
  return allCities.map((city) => ({ city: city.slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  return <CityRestaurantPage citySlug={citySlug} />;
}

export function CityRestaurantPage({
  citySlug,
  restaurantSlug,
}: {
  citySlug: string;
  restaurantSlug?: string;
}) {
  const city = getCity(citySlug);
  if (!city) notFound();

  const copy = cityCopy[city.slug] ?? cityCopy.strasbourg;
  const isStrasbourg = city.slug === "strasbourg";
  const restaurant = restaurantSlug
    ? getRestaurant(city.slug, restaurantSlug)
    : undefined;
  const subtitle =
    city.slug === "strasbourg" && restaurant
      ? restaurant.name
          .replace(/^Flam's\s*/i, "")
          .replace(/^Strasbourg\s*/i, "")
      : null;

  return (
    <main className="relative min-h-screen bg-bone">
      <section className="grid min-h-screen bg-bone lg:grid-cols-2">
        <div className="relative min-h-[52vh] overflow-hidden bg-cacao lg:min-h-screen">
          {isStrasbourg ? (
            <iframe
              allow="autoplay; encrypted-media; picture-in-picture"
              aria-label="Ambiance Flam's Strasbourg"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-125 border-0"
              src="https://www.youtube.com/embed/0pPdjm650bo?autoplay=1&mute=1&controls=0&loop=1&playlist=0pPdjm650bo&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3"
              tabIndex={-1}
              title="Video Flam's Strasbourg"
            />
          ) : (
            <VisualPlaceholder
              alt={`Ambiance Flam's ${city.name}`}
              className="absolute inset-0 min-h-full rounded-none"
              clipped={false}
              imageClassName="scale-110 opacity-90"
              label={city.name}
              showLabel={false}
              src={city.restaurants[0]?.mediaSrc}
              tone={city.previewTone}
            />
          )}
          {isStrasbourg ? (
            <>
              <div aria-hidden="true" className="absolute inset-0 z-[1]" />
              <div aria-hidden="true" className="youtube-start-mask" />
            </>
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.08),rgba(42,21,17,.28))]" />
        </div>

        <div className="relative flex min-h-[48vh] flex-col items-center justify-center overflow-visible px-5 pb-24 pt-32 text-center md:px-12 lg:min-h-screen">
          <p className="mb-10 text-xs font-black uppercase tracking-[0.18em] text-cacao">
            {copy.heroEyebrow}
          </p>
          <h1 className={`${styles.title} max-w-full px-4 font-display text-[clamp(4.75rem,11vw,10rem)] uppercase leading-[0.98] text-cacao`}>
            {city.name}
          </h1>
          {subtitle ? (
            <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-cacao/65 md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center overflow-hidden bg-wine px-5 py-24 text-bone md:px-10">
        <div className="flex w-full max-w-[96rem] flex-col items-center gap-0">
          <TextPressure
            alpha={false}
            className="h-[clamp(5.5rem,11vw,10rem)] w-full overflow-visible"
            flex={false}
            italic={false}
            minFontSize={24}
            stroke={false}
            text={copy.pressure[0]}
            textColor="#fff7df"
            weight
            width
          />
          <TextPressure
            alpha={false}
            className="-mt-[clamp(1rem,2vw,2rem)] h-[clamp(5.5rem,11vw,10rem)] w-full overflow-visible"
            flex={false}
            italic={false}
            minFontSize={24}
            stroke={false}
            text={copy.pressure[1]}
            textColor="#fff7df"
            weight
            width
          />
          <TextPressure
            alpha={false}
            className="-mt-[clamp(1rem,2vw,2rem)] h-[clamp(5.5rem,11vw,10rem)] w-full overflow-visible"
            flex={false}
            italic={false}
            minFontSize={24}
            stroke={false}
            text={copy.pressure[2]}
            textColor="#f3b12a"
            weight
            width
          />
        </div>
      </section>

      <StrasbourgRitualSectionV2
        body={copy.ritualBody}
        eyebrow={copy.ritualEyebrow}
        imageAlt={`Table Flam's ${city.name}`}
        imageSrc={
          city.slug === "strasbourg"
            ? "/assets/flams/table-partage.png"
            : city.restaurants[0]?.mediaSrc
        }
        stats={copy.ritualStats}
        title={copy.ritualTitle}
      />

      <StrasbourgHorizontalStory />

      <section className="relative overflow-hidden bg-bone px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
              {copy.closingEyebrow}
            </p>
            <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
              {copy.closingTitle}
            </h2>
          </div>
          <WaveText
            className="max-w-3xl text-3xl font-black leading-[1.08] md:text-5xl lg:text-6xl"
            text={copy.closingBody}
          />
        </div>
      </section>

      <Link
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 bg-cacao px-12 py-6 text-xs font-black uppercase tracking-[0.18em] text-bone shadow-soft transition hover:bg-ember"
        href="/reservation"
      >
        Reserver
      </Link>
    </main>
  );
}
