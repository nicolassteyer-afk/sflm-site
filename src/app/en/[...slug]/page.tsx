import Link from "next/link";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CTAReservation } from "@/components/CTAReservation";

const titles: Record<string, string> = {
  menu: "Menu built for sharing.",
  restaurants: "Find your table.",
  reservation: "Book the warmest seat.",
  recrutement: "Join the room.",
  "a-propos": "A tradition out of frame.",
  contact: "Talk to the team.",
  credits: "Credits and notes.",
};

export default async function EnglishCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join("/");
  const section = slug[0] ?? "home";
  const title = titles[section] ?? "Flam's is being rebuilt in English.";

  return (
    <>
      <section className="grid min-h-screen content-end bg-cream px-5 pb-20 pt-36 text-cacao md:px-10 lg:px-16">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
          English / {path}
        </p>
        <AnimatedTitle className="max-w-6xl text-[17vw] md:text-[10vw]" text={title} />
        <p className="mt-8 max-w-xl text-lg leading-8 text-cacao/65">
          This first English layer mirrors the navigation structure. Detailed
          translated content can be filled in after the French direction is approved.
        </p>
        <Link
          className="mt-8 inline-flex w-fit rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[0.18em] transition hover:border-ember hover:bg-ember hover:text-bone"
          href="/"
        >
          Back to French site
        </Link>
      </section>
      <CTAReservation eyebrow="Booking" title="Shall we keep you a table?" />
    </>
  );
}
