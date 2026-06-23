import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CTAReservation } from "@/components/CTAReservation";
import { ImageParallax } from "@/components/ImageParallax";
import { getPublicMenu } from "@/lib/cms";

export default async function MenuPage() {
  const menuSections = await getPublicMenu();

  return (
    <>
      <section className="grid min-h-screen items-end gap-10 bg-cream px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[1fr_.72fr] lg:px-16">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-ember">La carte</p>
          <AnimatedTitle className="text-[18vw] text-cacao md:text-[12vw]" text="A partager ou a defendre." />
        </div>
        <ImageParallax className="min-h-[68vh]" label="visuel carte" tone="from-saffron via-ember to-wine" />
      </section>
      <section className="bg-bone px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10">
          {menuSections.map((section, index) => (
            <article className="grid gap-6 border-t border-cacao/20 py-10 md:grid-cols-[.45fr_1fr]" key={section.slug}>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
                0{index + 1}
              </span>
              <div>
                <h2 className="font-display text-7xl uppercase leading-none text-cacao md:text-9xl">
                  {section.name}
                </h2>
                {section.description ? (
                  <p className="mt-4 max-w-2xl text-lg font-bold leading-7 text-cacao/55">
                    {section.description}
                  </p>
                ) : null}
                <div className="mt-8 grid gap-4">
                  {section.items.map((item) => (
                    <div className="border-b border-cacao/15 pb-4" key={item.id}>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-lg font-black text-cacao/80">{item.name}</p>
                        {item.price ? <p className="font-black text-ember">{item.price} EUR</p> : null}
                      </div>
                      {item.description ? (
                        <p className="mt-1 text-base font-bold text-cacao/55">{item.description}</p>
                      ) : null}
                      {item.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span className="rounded-full border border-cacao/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cacao/50" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTAReservation title="On commande la premiere flamme ?" />
    </>
  );
}
