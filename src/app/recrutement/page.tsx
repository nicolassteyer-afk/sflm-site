import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CTAReservation } from "@/components/CTAReservation";
import { ImageParallax } from "@/components/ImageParallax";

export default function RecruitmentPage() {
  return (
    <>
      <section className="grid min-h-screen gap-8 bg-cacao px-5 pb-16 pt-32 text-bone md:px-10 lg:grid-cols-[1fr_.8fr] lg:px-16">
        <div className="flex flex-col justify-end">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
            Recrutement
          </p>
          <AnimatedTitle className="text-[17vw] md:text-[10vw]" text="La salle a besoin d'energie." />
          <p className="mt-8 max-w-xl text-lg leading-8 text-bone/65">
            Cuisines, salle, management, extras : une page simple et impactante
            pour transformer les candidatures.
          </p>
        </div>
        <ImageParallax className="min-h-[70vh]" label="team mood" tone="from-ink via-wine to-ember" />
      </section>
      <section className="bg-cream px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {["Salle", "Cuisine", "Management"].map((job) => (
            <article className="border-t border-cacao/20 pt-5" key={job}>
              <h2 className="font-display text-6xl uppercase leading-none text-cacao">{job}</h2>
              <p className="mt-5 text-base leading-7 text-cacao/65">
                Postes ouverts prochainement. Candidature spontanee via la page contact.
              </p>
            </article>
          ))}
        </div>
      </section>
      <CTAReservation eyebrow="Candidature" title="Envie de rejoindre la table ?" />
    </>
  );
}
