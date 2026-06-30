import Link from "next/link";
import { HorizontalDragon } from "@/components/HorizontalDragon";
import { StrasbourgRitualSectionV2 } from "@/components/StrasbourgRitualSectionV2";
import { TextPressure } from "@/components/TextPressure";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { WaveText } from "@/components/WaveText";

type RestaurantBlock = {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image: string | null;
  gallery: unknown;
  ctaLabel: string | null;
  ctaUrl: string | null;
  variant: string | null;
  isActive: boolean;
};

type CmsRestaurant = {
  slug: string;
  name: string;
  city: string;
  country: string;
  address: string;
  postalCode: string | null;
  phone: string | null;
  googleMapsUrl: string | null;
  mainImage: string | null;
  shortDescription: string | null;
  reservationUrl: string | null;
  hours?: {
    day: string;
    opensAt: string | null;
    closesAt: string | null;
    isClosed: boolean;
    note: string | null;
    displayOrder: number;
  }[];
};

function galleryItems(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function RestaurantCmsPage({
  restaurant,
  blocks,
}: {
  restaurant: CmsRestaurant;
  blocks: RestaurantBlock[];
}) {
  const activeBlocks = blocks.filter((block) => block.isActive);
  const stickyCta = activeBlocks.find((block) => block.type === "STICKY_CTA");

  return (
    <main className="relative min-h-screen bg-bone">
      {activeBlocks.map((block) => (
        <RestaurantCmsBlock block={block} key={block.id} restaurant={restaurant} />
      ))}
      <Link
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 bg-cacao px-12 py-6 text-xs font-black uppercase tracking-[0.18em] text-bone shadow-soft transition hover:bg-ember"
        href={stickyCta?.ctaUrl || restaurant.reservationUrl || "/reservation"}
      >
        {stickyCta?.ctaLabel || "Reserver"}
      </Link>
    </main>
  );
}

function RestaurantCmsBlock({
  block,
  restaurant,
}: {
  block: RestaurantBlock;
  restaurant: CmsRestaurant;
}) {
  if (block.type === "STICKY_CTA") return null;

  if (block.type === "RESTAURANT_HERO") {
    const useVideo = block.variant === "video";
    return (
      <section className="grid min-h-screen bg-bone lg:grid-cols-2">
        <div className="relative min-h-[52vh] overflow-hidden bg-cacao lg:min-h-screen">
          {useVideo ? (
            <iframe
              allow="autoplay; encrypted-media; picture-in-picture"
              aria-label={`Ambiance ${restaurant.name}`}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-125 border-0"
              src={block.image || "https://www.youtube.com/embed/0pPdjm650bo?autoplay=1&mute=1&controls=0&loop=1&playlist=0pPdjm650bo&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3"}
              tabIndex={-1}
              title={`Video ${restaurant.name}`}
            />
          ) : (
            <VisualPlaceholder
              alt={restaurant.name}
              className="absolute inset-0 min-h-full rounded-none"
              clipped={false}
              imageClassName="scale-110 opacity-90"
              label={restaurant.city}
              showLabel={false}
              src={block.image || restaurant.mainImage || undefined}
              tone="from-wine via-cacao to-bone"
            />
          )}
          {useVideo ? (
            <div aria-hidden="true" className="absolute inset-0 z-[1]" />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.08),rgba(42,21,17,.28))]" />
        </div>

        <div className="relative flex min-h-[48vh] flex-col items-center justify-center overflow-visible px-5 pb-24 pt-32 text-center md:px-12 lg:min-h-screen">
          <p className="mb-10 text-xs font-black uppercase tracking-[0.18em] text-cacao">
            {block.body || restaurant.shortDescription || "Comment ca flambe ?"}
          </p>
          <h1 className="max-w-full px-4 font-display text-[clamp(4.75rem,11vw,10rem)] uppercase leading-[0.98] text-cacao">
            {block.title || restaurant.city}
          </h1>
          {block.subtitle ? (
            <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-cacao/65 md:text-base">
              {block.subtitle}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  if (block.type === "PRESSURE_TEXT") {
    const lines = [block.title, block.subtitle, block.body].filter((line): line is string => Boolean(line));
    return (
      <section className="flex min-h-screen items-center justify-center overflow-hidden bg-wine px-5 py-24 text-bone md:px-10">
        <div className="flex w-full max-w-[96rem] flex-col items-center gap-0">
          {lines.map((line, index) => (
            <TextPressure
              alpha={false}
              className={`${index ? "-mt-[clamp(1rem,2vw,2rem)] " : ""}h-[clamp(5.5rem,11vw,10rem)] w-full overflow-visible`}
              flex={false}
              italic={false}
              key={line}
              minFontSize={24}
              stroke={false}
              text={line}
              textColor={index === lines.length - 1 ? "#f3b12a" : "#fff7df"}
              weight
              width
            />
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "RITUAL_SECTION") {
    return (
      <StrasbourgRitualSectionV2
        body={block.body || ""}
        eyebrow={block.subtitle || "Le rituel"}
        imageAlt={block.title || restaurant.name}
        imageSrc={block.image || restaurant.mainImage || undefined}
        stats={galleryItems(block.gallery).map((label) => ({ label }))}
        title={block.title || restaurant.name}
      />
    );
  }

  if (block.type === "HORIZONTAL_STORY") {
    return <CmsHorizontalStory block={block} restaurant={restaurant} />;
  }

  if (block.type === "CLOSING_SECTION") {
    return (
      <section className="relative overflow-hidden bg-bone px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
              {block.subtitle || `${restaurant.city} sauce Flam's`}
            </p>
            <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
              {block.title}
            </h2>
          </div>
          <WaveText
            className="max-w-3xl text-3xl font-black leading-[1.08] md:text-5xl lg:text-6xl"
            text={block.body || ""}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bone px-5 py-24 text-cacao md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {block.subtitle ? <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">{block.subtitle}</p> : null}
        {block.title ? <h2 className="font-display text-6xl uppercase leading-none md:text-8xl">{block.title}</h2> : null}
        {block.body ? <p className="mt-8 max-w-3xl text-xl font-bold leading-9 text-cacao/70">{block.body}</p> : null}
      </div>
    </section>
  );
}

function CmsHorizontalStory({
  block,
  restaurant,
}: {
  block: RestaurantBlock;
  restaurant: CmsRestaurant;
}) {
  const showRueDesFreresMap = restaurant.slug === "rue-des-freres";
  const panels = [
    {
      eyebrow: block.subtitle || "La table",
      title: block.title || "On pose les planches, tout le monde attaque.",
      text: block.body || "",
      image: block.image || "/assets/flams/tfmainspartage.png",
    },
    ...galleryItems(block.gallery).map((item) => {
      const [eyebrow, title, text, image] = item.split("|");
      return { eyebrow, title, text, image };
    }),
  ];

  return (
    <section className="relative bg-bone text-cacao">
      <div className="flex overflow-x-auto">
        {panels.map((panel, index) => (
          <article className="grid min-h-screen w-screen shrink-0 overflow-hidden lg:grid-cols-[0.92fr_1.08fr]" key={`${panel.title}-${index}`}>
            <div className="relative min-h-[44vh] overflow-hidden bg-cacao lg:min-h-screen">
              <VisualPlaceholder
                alt={panel.title}
                className="absolute inset-0 min-h-full rounded-none"
                clipped={false}
                imageClassName="scale-110 opacity-90"
                label={panel.eyebrow}
                showLabel={false}
                src={panel.image}
                tone="from-wine via-cacao to-ember"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.18),rgba(42,21,17,.42))]" />
            </div>

            <div className="flex min-h-[56vh] flex-col justify-center px-5 py-16 md:px-10 lg:min-h-screen lg:px-16">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-ember">
                0{index + 1} / {panel.eyebrow}
              </p>
              <h2 className="font-display max-w-4xl text-5xl uppercase leading-[0.92] md:text-6xl xl:text-7xl">
                {panel.title}
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-8 text-cacao/70">{panel.text}</p>
              {showRueDesFreresMap && index === 0 ? (
                <RestaurantDetails restaurant={restaurant} />
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <HorizontalDragon />
    </section>
  );
}

function RestaurantMapBlock({ restaurant }: { restaurant: CmsRestaurant }) {
  const address = restaurant.slug === "rue-des-freres" ? "29 rue des Freres, 67000 Strasbourg" : restaurant.address;
  const mapQuery = encodeURIComponent(`${address}, ${restaurant.city}`);

  return (
    <div className="relative min-h-[18rem] overflow-hidden bg-cacao shadow-soft">
      <iframe
        aria-label={`Carte ${restaurant.name}`}
        className="absolute inset-0 h-full w-full border-0 grayscale-[.18] saturate-[1.1]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
        title={`Carte ${restaurant.name}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(42,21,17,.08),rgba(42,21,17,.22))]" />
      <a
        className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] bg-bone px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-cacao shadow-soft transition hover:bg-saffron"
        href={restaurant.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
        rel="noreferrer"
        target="_blank"
      >
        29 rue des Freres, Strasbourg
      </a>
    </div>
  );
}

function RestaurantDetails({ restaurant }: { restaurant: CmsRestaurant }) {
  const hours = restaurant.slug === "rue-des-freres" ? rueDesFreresHours : restaurant.hours ?? [];
  const phone = restaurant.slug === "rue-des-freres" ? "03 88 36 36 90" : restaurant.phone;

  return (
    <div className="mt-10 grid max-w-4xl gap-8 border-t border-cacao/15 pt-8 xl:grid-cols-[minmax(15rem,0.95fr)_1fr]">
      <RestaurantMapBlock restaurant={restaurant} />
      <div>
        <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-ember">Horaires</p>
        <dl className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-cacao/75 sm:grid-cols-[7rem_1fr]">
          {hours.map((hour) => (
            <div className="contents" key={hour.day}>
              <dt>{hour.day}</dt>
              <dd className="text-cacao">
                {hour.isClosed ? "Ferme" : hour.note || `${hour.opensAt}-${hour.closesAt}`}
              </dd>
            </div>
          ))}
        </dl>
        {phone ? (
          <div className="mt-6">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-ember">Telephone</p>
            <a className="text-xl font-black text-cacao transition hover:text-ember" href={`tel:${phone.replace(/\s/g, "")}`}>
              {phone}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const rueDesFreresHours = [
  { day: "mercredi", opensAt: "11:30", closesAt: "23:00", isClosed: false, note: null, displayOrder: 0 },
  { day: "jeudi", opensAt: "11:30", closesAt: "23:00", isClosed: false, note: null, displayOrder: 1 },
  { day: "vendredi", opensAt: "11:30", closesAt: "00:00", isClosed: false, note: null, displayOrder: 2 },
  { day: "samedi", opensAt: "11:30", closesAt: "00:00", isClosed: false, note: null, displayOrder: 3 },
  { day: "dimanche", opensAt: "11:30", closesAt: "23:00", isClosed: false, note: null, displayOrder: 4 },
  { day: "lundi", opensAt: "11:30", closesAt: "23:00", isClosed: false, note: null, displayOrder: 5 },
  { day: "mardi", opensAt: "11:30", closesAt: "23:00", isClosed: false, note: null, displayOrder: 6 },
];
