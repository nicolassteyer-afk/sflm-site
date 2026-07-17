"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Restaurant } from "@/data/restaurants";

type DigitalMenuShowcaseProps = {
  restaurants: Restaurant[];
};

const introItems = ["Flammes", "Boissons", "Desserts", "Grandes tablees"];

export function DigitalMenuShowcase({ restaurants }: DigitalMenuShowcaseProps) {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-cacao px-5 pb-14 pt-32 text-bone md:px-10 lg:px-16">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-wine/70 to-transparent"
        />

        <div className="relative mx-auto grid min-h-[calc(100vh-11rem)] max-w-7xl items-end gap-10 lg:grid-cols-[1fr_.72fr]">
          <div>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-saffron"
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.55 }}
            >
              La carte digitale
            </motion.p>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-[23vw] uppercase leading-[0.78] tracking-normal text-bone md:text-[14vw] lg:text-[11vw]"
              initial={{ opacity: 0, y: 42 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              Choisis ta flamme.
            </motion.h1>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-2xl text-lg font-bold leading-8 text-bone/70 md:text-xl"
              initial={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.18, duration: 0.65 }}
            >
              Selectionne ton restaurant Flam's et ouvre directement sa carte
              digitale. Simple, chaud, pret a commander.
            </motion.p>
          </div>

          <motion.div
            animate={{ opacity: 1, rotate: -1.5, y: 0 }}
            className="relative min-h-[54vh] overflow-hidden rounded-[6px] border border-bone/15 bg-wine shadow-[0_28px_80px_rgba(0,0,0,0.3)]"
            initial={{ opacity: 0, rotate: 2.5, y: 40 }}
            transition={{ delay: 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              alt="Table Flam's"
              className="h-full w-full object-cover opacity-80"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              src="/assets/flams/table-partage.png"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cacao via-cacao/15 to-transparent" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              className="absolute bottom-6 left-6 right-6"
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
                Carte ouverte
              </p>
              <p className="mt-2 font-display text-6xl uppercase leading-none text-bone md:text-7xl">
                A partager
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden bg-ember py-4 text-bone">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          className="flex w-max gap-8 text-sm font-black uppercase tracking-[0.18em]"
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {[...introItems, ...introItems, ...introItems, ...introItems].map((item, index) => (
            <span className="whitespace-nowrap" key={`${item}-${index}`}>
              {item} / Carte digitale / Flam's
            </span>
          ))}
        </motion.div>
      </section>

      <section className="texture bg-bone px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-5 md:grid-cols-[.5fr_1fr] md:items-end">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-ember">
              Restaurants
            </p>
            <h2 className="font-display text-7xl uppercase leading-none text-cacao md:text-9xl">
              Ouvre la bonne carte.
            </h2>
          </div>

          <div className="grid gap-5">
            {restaurants.map((restaurant, index) => (
              <motion.article
                className="group grid overflow-hidden border-t border-cacao/15 py-6 md:grid-cols-[12rem_1fr_auto] md:items-center md:gap-8"
                initial={{ opacity: 0, y: 36 }}
                key={`${restaurant.city}-${restaurant.slug}`}
                transition={{ duration: 0.58, delay: Math.min(index * 0.035, 0.28) }}
                viewport={{ once: true, margin: "-12% 0px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[4px] bg-cacao md:mb-0">
                  <Image
                    alt={restaurant.name}
                    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                    fill
                    sizes="12rem"
                    src={restaurant.mediaSrc}
                  />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-ember">
                    {restaurant.city}
                  </p>
                  <h3 className="mt-2 font-display text-5xl uppercase leading-none text-cacao md:text-7xl">
                    {restaurant.name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-cacao/60 md:text-base">
                    {restaurant.address}
                  </p>
                </div>
                <Link
                  className="warm-button mt-6 inline-flex min-h-16 items-center justify-center rounded-full bg-cacao px-8 text-center text-xs font-black uppercase tracking-[0.16em] text-bone transition hover:text-bone md:mt-0 md:min-w-64"
                  href="/menu"
                >
                  Voir la carte digitale
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
