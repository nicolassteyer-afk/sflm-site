import { AnimatedTitle } from "@/components/AnimatedTitle";

export default function CreditsPage() {
  return (
    <section className="min-h-screen bg-ink px-5 pb-20 pt-36 text-bone md:px-10 lg:px-16">
      <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
        Credits
      </p>
      <AnimatedTitle className="max-w-5xl text-[17vw] md:text-[10vw]" text="Credits et mentions." />
      <div className="mt-12 grid max-w-4xl gap-6 text-lg leading-8 text-bone/65">
        <p>
          Prototype Flam's realise avec Next.js, TypeScript, Tailwind CSS,
          Framer Motion et Lenis.
        </p>
        <p>
          Les visuels sont des placeholders graphiques originaux. Aucun texte,
          logo, image ou contenu proprietaire du site de reference n'est repris.
        </p>
      </div>
    </section>
  );
}
