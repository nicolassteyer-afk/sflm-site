import { AnimatedTitle } from "@/components/AnimatedTitle";
import { ImageParallax } from "@/components/ImageParallax";

export default function AboutPage() {
  return (
    <section className="grid min-h-screen gap-10 bg-cream px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[.9fr_1fr] lg:px-16">
      <div className="flex flex-col justify-end">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
          A propos
        </p>
        <AnimatedTitle className="text-[18vw] text-cacao md:text-[11vw]" text="Une tradition sortie du cadre." />
        <p className="mt-8 max-w-xl text-lg leading-8 text-cacao/65">
          Flam's devient une marque de restaurant contemporaine : plus editoriale,
          plus immersive, plus fluide, avec un site capable de grandir ville par ville.
        </p>
      </div>
      <ImageParallax className="min-h-[70vh]" label="histoire visuelle" tone="from-wine via-cacao to-saffron" />
    </section>
  );
}
