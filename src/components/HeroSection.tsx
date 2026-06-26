import Link from "next/link";
import { AnimatedTitle } from "./AnimatedTitle";
import { ImageParallax } from "./ImageParallax";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  visualLabel: string;
  visualSrc?: string;
  visualAlt?: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function HeroSection({
  eyebrow,
  title,
  body,
  visualLabel,
  visualSrc,
  visualAlt,
  primaryHref = "/reservation",
  primaryLabel = "Reserver",
}: HeroSectionProps) {
  return (
    <section className="texture grid min-h-screen items-end gap-10 bg-cream px-5 pb-14 pt-32 md:px-10 lg:grid-cols-[1fr_.72fr] lg:px-16">
      <div className="relative z-10">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-ember">{eyebrow}</p>
        <AnimatedTitle className="max-w-6xl text-[18vw] text-cacao md:text-[13vw] lg:text-[10.5vw]" text={title} />
        <div className="mt-8 flex max-w-2xl flex-col gap-6 md:flex-row md:items-center">
          <p className="text-lg leading-8 text-cacao/70">{body}</p>
          <Link
            className="warm-button shrink-0 rounded-full border border-cacao/25 px-8 py-5 text-sm font-black uppercase tracking-[0.18em] text-cacao transition hover:border-ember hover:text-bone"
            href={primaryHref}
          >
            {primaryLabel}
          </Link>
        </div>
      </div>
      <ImageParallax
        className="min-h-[48vh] lg:min-h-[72vh]"
        label={visualLabel}
        src={visualSrc}
        alt={visualAlt}
        tone="from-wine via-ember to-saffron"
      />
    </section>
  );
}
