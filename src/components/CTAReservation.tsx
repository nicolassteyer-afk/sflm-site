import Link from "next/link";
import { AnimatedTitle } from "./AnimatedTitle";

export function CTAReservation({
  eyebrow = "Reservation",
  title = "On garde une grande table ?",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className="texture bg-wine px-5 py-24 text-bone md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
            {eyebrow}
          </p>
          <AnimatedTitle as="h2" className="max-w-4xl text-7xl md:text-9xl" text={title} />
        </div>
        <Link
          className="warm-button inline-flex min-h-20 items-center justify-center rounded-full border border-bone/40 px-10 text-sm font-black uppercase tracking-[0.18em] text-bone transition hover:border-ember"
          href="/reservation"
        >
          Reserver
        </Link>
      </div>
    </section>
  );
}
