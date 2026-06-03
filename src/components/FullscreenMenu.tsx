"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { countries, type City } from "@/data/restaurants";
import { LanguageSwitcher } from "./LanguageSwitcher";

const footerLinks = [
  { href: "/recrutement", label: "Recrutement" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" },
  { href: "/credits", label: "Credits" },
];

export function FullscreenMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const menuCountries = useMemo(() => {
    const order = ["royaume-uni", "france", "belgique"];
    return [...countries].sort(
      (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug),
    );
  }, []);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const activeRestaurants =
    hoveredCity && hoveredCity.restaurants.length > 1
      ? hoveredCity.restaurants
      : [];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden bg-ink/55 text-bone"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.aside
            className="relative z-10 flex h-screen w-full max-w-[920px] flex-col overflow-y-auto overscroll-contain bg-wine px-6 py-6 md:px-10 lg:w-[58vw]"
            onWheel={(event) => event.stopPropagation()}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 flex items-center justify-between">
              <button
                aria-label="Fermer le menu de navigation"
                className="group grid h-12 w-12 place-items-center"
                onClick={onClose}
                type="button"
              >
                <span className="relative h-5 w-5" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 bg-current transition group-hover:rotate-[35deg]" />
                  <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 bg-current transition group-hover:-rotate-[35deg]" />
                </span>
              </button>
              <Link
                className="warm-button px-3 py-2 text-xs font-black uppercase tracking-[0.18em] md:hidden"
                href="/reservation"
                onClick={onClose}
              >
                Reserver
              </Link>
            </div>

            <nav className="flex-1">
              {menuCountries.map((country, countryIndex) => (
                <motion.div
                  className="mb-5 last:mb-0"
                  key={country.slug}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + countryIndex * 0.08 }}
                >
                  <p className="mb-3 text-[0.72rem] font-black uppercase tracking-[0.12em] text-bone/55">
                    {country.name}
                  </p>
                  <div className="grid gap-1.5">
                    {country.cities.map((city, cityIndex) => {
                      const hasMany = city.restaurants.length > 1;
                      const isHovered = hoveredCity?.slug === city.slug;

                      return (
                        <motion.div
                          key={city.slug}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.18 + countryIndex * 0.08 + cityIndex * 0.045,
                          }}
                          onMouseEnter={() => setHoveredCity(city)}
                          onMouseLeave={() => {
                            if (!hasMany) setHoveredCity(null);
                          }}
                        >
                          <Link
                            className={`block origin-left font-display text-[clamp(2.65rem,4.4vw,4.8rem)] uppercase leading-[0.82] transition duration-300 ${
                              isHovered
                                ? "translate-x-2 -rotate-1 text-saffron"
                                : "text-bone hover:text-saffron"
                            }`}
                            href={`/restaurants/${city.slug}`}
                            onClick={onClose}
                          >
                            {city.name}
                          </Link>
                          {hasMany ? (
                            <div className="mt-2 grid gap-1 border-l border-bone/20 pl-4 lg:hidden">
                              {city.restaurants.map((restaurant) => (
                                <Link
                                  className="text-sm font-black uppercase tracking-[0.08em] text-bone/70"
                                  href={`/restaurants/${city.slug}/${restaurant.slug}`}
                                  key={restaurant.slug}
                                  onClick={onClose}
                                >
                                  {restaurantLabel(restaurant.name, city.name)}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </nav>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {footerLinks.map((link) => (
                  <Link
                    className="text-sm font-black uppercase tracking-[0.08em] transition hover:text-saffron"
                    href={link.href}
                    key={link.href}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <LanguageSwitcher />
            </div>
          </motion.aside>

          <AnimatePresence>
            {activeRestaurants.length > 0 ? (
              <motion.div
                className="fixed bottom-0 left-[58vw] top-0 z-0 hidden w-[38vw] bg-cacao px-16 py-28 lg:block"
                initial={{ x: -48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -48, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex h-full flex-col justify-center">
                  <p className="mb-8 text-xs font-black uppercase tracking-[0.16em] text-saffron">
                    {hoveredCity?.name}
                  </p>
                  <div className="grid gap-6">
                    {activeRestaurants.map((restaurant, index) => (
                      <motion.div
                        key={restaurant.slug}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Link
                          className="group block font-display text-[clamp(2.2rem,3.2vw,4rem)] uppercase leading-[0.86] text-bone transition hover:translate-x-3 hover:text-saffron"
                          href={`/restaurants/${hoveredCity?.slug}/${restaurant.slug}`}
                          onClick={onClose}
                        >
                          {restaurantLabel(restaurant.name, hoveredCity?.name ?? "")}
                        </Link>
                        <p className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-bone/45">
                          {restaurant.address}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function restaurantLabel(name: string, city: string) {
  return name.replace(/^Flam's\s*/i, "").replace(new RegExp(`^${city}\\s*`, "i"), "");
}
