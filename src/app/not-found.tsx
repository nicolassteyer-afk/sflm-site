import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-cream px-5 text-center text-cacao">
      <div>
        <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-ember">
          404
        </p>
        <h1 className="font-display text-7xl uppercase leading-none md:text-9xl">
          Table introuvable
        </h1>
        <Link className="mt-8 inline-flex rounded-full border border-cacao/25 px-8 py-4 text-xs font-black uppercase tracking-[0.18em]" href="/">
          Retour accueil
        </Link>
      </div>
    </section>
  );
}
