import { AnimatedTitle } from "@/components/AnimatedTitle";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-bone px-5 pb-20 pt-36 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.8fr]">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
            Contact
          </p>
          <AnimatedTitle className="text-[18vw] text-cacao md:text-[11vw]" text="Parler table, lieu, equipe." />
        </div>
        <div className="grid content-end gap-6 text-lg leading-8 text-cacao/70">
          <p>contact@flams.fr</p>
          <p>Presse, franchises, reservations de groupe, candidature spontanee.</p>
          <p className="border-t border-cacao/20 pt-6 text-sm font-black uppercase tracking-[0.18em] text-cacao">
            Formulaire detaille a brancher dans une prochaine etape.
          </p>
        </div>
      </div>
    </section>
  );
}
