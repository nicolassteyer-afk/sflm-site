import Link from "next/link";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CTAReservation } from "@/components/CTAReservation";
import { ImageParallax } from "@/components/ImageParallax";
import { Timeline } from "@/components/Timeline";

export const metadata = {
  title: "Notre Univers | Flam's",
  description:
    "L'histoire de Flam's, la chronologie de la marque et l'origine de la flammekueche.",
};

const timeline = [
  {
    year: "1989",
    eyebrow: "Le debut",
    title: "Creation de Flam's",
    body: "Creation de Flam's en 1989, par Eric Senet et Franck Riehm.",
    image: "/assets/flams/logo-bordeaux-ancien.png",
  },
  {
    year: "1990",
    eyebrow: "1er restaurant",
    title: "Flam's Strasbourg",
    body: "Succes immediat du premier restaurant en 1990 a Strasbourg. Ce qui les a encourages a le tester hors d'Alsace.",
    image: "/assets/flams/table-flam.png",
  },
  {
    year: "1993",
    eyebrow: "2eme restaurant",
    title: "L'aventure continue",
    body: "Flam's Lille confirme le succes grandissant de l'enseigne.",
    image: "/assets/flams/table-partage.png",
  },
  {
    year: "2000",
    eyebrow: "Ouverture de restaurants",
    title: "Toujours plus loin",
    body: "Le groupe continue d'ouvrir des restaurants partout en France.",
    image: "/assets/flams/dragon-bordeaux.png",
  },
  {
    year: "2011",
    eyebrow: "300 collaborateurs",
    title: "Une famille",
    body: "Flam's c'est aussi devenu une grande famille. L'enseigne compte plus de 300 collaborateurs.",
    image: "/assets/flams/annonce-da.png",
  },
  {
    year: "2017",
    eyebrow: "Nouveau logo",
    title: "Du nouveau",
    body: "En 2017, la marque se renouvelle avec un nouveau design du logo.",
    image: "/assets/flams/logo-bdx.png",
  },
  {
    year: "2020",
    eyebrow: "Les travaux",
    title: "Renovation",
    body: "S'ensuit en 2020, la renovation du parc de restaurants avec un nouvel amenagement et design d'interieur. Ici Flam's St Lazare.",
    image: "/assets/flams/dragon-beige-site.jpg",
  },
  {
    year: "2022",
    eyebrow: "14 restaurants",
    title: "L'aventure continue",
    body: "14 restaurants presents sur tout le territoire.",
    image: "/assets/flams/table-partage.png",
  },
  {
    year: "2023",
    eyebrow: "Le vin",
    title: "Cuvee Flam's",
    body: "La cuvee Flam's, le blanc des copains en collaboration avec la cave vinicole d'Hunawihr.",
    image: "/assets/flams/blanc-gourmand.png",
  },
  {
    year: "2025",
    eyebrow: "Nouveau logo",
    title: "Flam's se reveille",
    body: "Nouveau logo, nouvelle atmosphere, meme concept.",
    image: "/assets/flams/logo-beige.png",
  },
  {
    year: "2025",
    eyebrow: "Nouvelle carte",
    title: "Modernisation",
    body: "Une carte reinventee, une gamme de vins Flam's, du piquant, du raifort et d'autres nouveaux produits.",
    image: "/assets/flams/sauce-piquante.png",
  },
];

const recipeBlocks = [
  {
    title: "Le symbole culinaire alsacien par excellence",
    body: [
      "La Flammekueche, symbole culinaire alsacien par excellence, est une specialite gastronomique d'Alsace, region francaise situee dans le nord-est du pays, a la frontiere de l'Allemagne. Ce plat est tres populaire dans la region et est souvent considere comme une alternative a la pizza.",
      "Elle est preparee avec une fine pate a pain croustillante, garnie de fromage blanc, de creme epaisse, de petits lardons et d'oignons finement coupes, puis assaisonnee d'un melange d'epices. La cuisson dans un four traditionnel tres chaud au feu de bois lui donne sa saveur unique.",
    ],
  },
  {
    title: "Pourquoi Flammekueche ?",
    body: [
      "Autrefois, les habitants du village se retrouvaient autour du grand four a bois commun pour cuire le pain de la semaine. Avec le reste de pate, quelqu'un eut l'idee de preparer une grande tarte garnie de creme, de fromage, d'oignons et de lardons.",
      "La tarte etait enfournee pendant que le feu faisait encore de grandes flammes, puis servie directement sur la pelle, decoupee en morceaux. C'est pourquoi on l'appela Flammekueche : la tarte cuite avec les flammes.",
    ],
  },
  {
    title: "Et aujourd'hui ?",
    body: [
      "Depuis plus de 30 ans, Flam's innove sans cesse et s'adapte aux gouts des consommateurs tout en gardant les saveurs d'autrefois. Les recettes ont evolue avec des versions vegetariennes, au poisson, sans porc et de nouveaux produits a partager.",
      "L'objectif reste le meme : rassembler autour d'une experience culinaire conviviale a l'alsacienne.",
    ],
  },
];

export default function NotreUniversPage() {
  return (
    <>
      <section className="texture grid min-h-screen items-end gap-10 bg-cacao px-5 pb-16 pt-32 text-bone md:px-10 lg:grid-cols-[1fr_.72fr] lg:px-16">
        <div className="relative z-10">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-saffron">
            Notre Univers
          </p>
          <AnimatedTitle
            className="max-w-6xl text-[18vw] md:text-[12vw] lg:text-[10vw]"
            text="Comment tout a commence."
          />
          <p className="mt-8 max-w-2xl text-lg leading-8 text-bone/70">
            De Strasbourg aux grandes tables d'aujourd'hui, Flam's raconte une
            histoire de copains, de flammes fines, de verres qui circulent et
            de soirees qui prennent le temps.
          </p>
        </div>
        <ImageParallax
          alt="Table Flam's a partager"
          className="min-h-[52vh] lg:min-h-[74vh]"
          imageClassName="object-contain p-8"
          label="notre histoire"
          src="/assets/flams/table-partage.png"
          tone="from-wine via-cacao to-ember"
        />
      </section>

      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.78fr_1fr] lg:items-start">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">
              Notre histoire
            </p>
            <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
              Une passion flambee depuis le lycee.
            </h2>
          </div>
          <div className="grid gap-6 text-lg leading-8 text-cacao/70">
            <p className="border-l-4 border-ember pl-6 text-2xl font-black leading-9 text-cacao">
              "Notre passion pour la tarte flambee a commence dans notre
              jeunesse, lorsque nous etions eleves au lycee Kleber de
              Strasbourg."
            </p>
            <p>
              En 1990, Eric Senet et Franck Riehm ont ouvert leur premier
              restaurant Flam's a Strasbourg. Plus de 30 ans plus tard, la
              maison continue de faire decouvrir la tarte flambee, ou
              Flammekueche en Alsace.
            </p>
            <p>
              Chez Flam's, on sert des tartes flambees natures ou gratinees,
              accompagnees d'une biere ou d'un verre de vin blanc. Un plat
              convivial, pense pour etre partage entre amis ou en famille.
            </p>
          </div>
        </div>
      </section>

      <Timeline
        data={timeline.map((item, index) => ({
          title: item.year,
          content: (
            <article className="relative max-w-3xl overflow-hidden rounded-sm border border-bone/10 bg-bone/[0.035] p-5 shadow-soft md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(248,175,7,.18),transparent_26%),linear-gradient(135deg,rgba(101,19,26,.38),rgba(42,21,17,.22),rgba(17,16,13,.86))]" />
              <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-6xl uppercase leading-[0.86] text-bone md:text-8xl">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-bone/65">
                    {item.body}
                  </p>
                </div>
                <div className="relative min-h-56 overflow-hidden rounded-sm bg-ink/35">
                  <img
                    alt=""
                    className="h-full min-h-56 w-full object-contain p-7"
                    loading="lazy"
                    src={item.image}
                  />
                  <p className="absolute bottom-4 left-4 rounded-full border border-bone/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-bone/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </article>
          ),
        }))}
      />

      <section className="grid bg-cacao text-bone lg:grid-cols-[.78fr_1fr]">
        <ImageParallax
          alt="Flamme bordeaux Flam's"
          className="min-h-[58vh] lg:min-h-screen"
          imageClassName="object-contain p-10"
          label="flammekueche"
          src="/assets/flams/flamme-beige.png"
          tone="from-wine via-cacao to-ink"
        />
        <div className="flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron">
            L'authentique recette
          </p>
          <h2 className="font-display text-7xl uppercase leading-[0.86] md:text-9xl">
            La flammekueche.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-bone/68">
            Fine, croustillante, genereuse et faite pour etre partagee avec les
            doigts : la tarte flambee reste le symbole culinaire alsacien par
            excellence.
          </p>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 text-cacao md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {recipeBlocks.map((block) => (
            <article className="border-t border-cacao/20 pt-6" key={block.title}>
              <h3 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">
                {block.title}
              </h3>
              <div className="mt-6 grid gap-4 text-base leading-7 text-cacao/66">
                {block.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-14 flex max-w-7xl flex-wrap gap-3">
          <Link
            className="warm-button rounded-full border border-cacao/25 px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-cacao transition hover:border-ember hover:text-bone"
            href="/menu"
          >
            Voir la carte
          </Link>
          <Link
            className="rounded-full bg-cacao px-8 py-5 text-xs font-black uppercase tracking-[0.18em] text-bone transition hover:bg-ember hover:text-cacao"
            href="/restaurants"
          >
            Trouver un restaurant
          </Link>
        </div>
      </section>

      <CTAReservation
        eyebrow="A table"
        title="Venez gouter l'histoire."
      />
    </>
  );
}
