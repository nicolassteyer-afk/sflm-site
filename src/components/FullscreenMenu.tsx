"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { allCities } from "@/data/restaurants";
import { mainLinks } from "@/lib/navigation";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { VisualPlaceholder } from "./VisualPlaceholder";

export function FullscreenMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState(allCities[0]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-cacao text-bone"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          role="dialog"
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex min-h-screen flex-col px-5 py-5 md:px-10 lg:px-16">
            <div className="flex items-center justify-between">
              <Link className="block" href="/" onClick={onClose} aria-label="Accueil Flam's">
                <BrandLogo className="h-14 w-40" tone="cream" />
              </Link>
              <button
                aria-label="Fermer le menu de navigation"
                className="rounded-full border border-bone/30 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:bg-bone hover:text-cacao"
                onClick={onClose}
                type="button"
              >
                Fermer
              </button>
            </div>

            <div className="grid flex-1 gap-12 py-16 lg:grid-cols-[1fr_.82fr] lg:items-end">
              <div>
                <nav className="mb-12 grid gap-3">
                  {mainLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + index * 0.06 }}
                    >
                      <Link
                        className="block font-display text-6xl uppercase leading-none text-bone transition hover:translate-x-4 hover:text-saffron md:text-8xl"
                        href={link.href}
                        onClick={onClose}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div>
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-saffron">
                    Choisir une ville
                  </p>
                  <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
                    {allCities.map((city) => (
                      <div key={city.slug}>
                        <Link
                          className="group flex items-center justify-between border-b border-bone/15 py-2 text-xl font-black uppercase transition hover:border-saffron hover:text-saffron"
                          href={`/restaurants/${city.slug}`}
                          onClick={onClose}
                          onMouseEnter={() => setPreview(city)}
                        >
                          {city.name}
                          <span className="text-xs opacity-45">{city.restaurants.length}</span>
                        </Link>
                        <div className="hidden gap-2 py-2 pl-4 lg:grid">
                          {city.restaurants.map((restaurant) => (
                            <Link
                              className="text-sm font-bold text-bone/55 transition hover:text-bone"
                              href={`/restaurants/${city.slug}/${restaurant.slug}`}
                              key={restaurant.slug}
                              onClick={onClose}
                            >
                              {restaurant.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                key={preview.slug}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="hidden lg:block"
              >
                <VisualPlaceholder
                  className="min-h-[68vh]"
                  label={preview.name}
                  src={preview.restaurants[0]?.mediaSrc}
                  alt={`Ambiance Flam's ${preview.name}`}
                  tone={preview.previewTone}
                />
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-5">
              <LanguageSwitcher />
              <Link className="text-xs font-black uppercase tracking-[0.18em] text-bone/60" href="/credits" onClick={onClose}>
                Credits
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
