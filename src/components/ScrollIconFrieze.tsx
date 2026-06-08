"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const assetBase =
  "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams";

const icons = [
  {
    alt: "Biere Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-BIERE-BDX.svg`,
  },
  {
    alt: "Flamme Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-FLAMME-BDX.svg`,
  },
  {
    alt: "Fut Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-FUT-BDX.svg`,
  },
  {
    alt: "Planche Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-PLANCHE-BDX.svg`,
  },
  {
    alt: "Vin Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-VIN-BDX.svg`,
  },
];

const verticalOffsets = [-220, -110, 0, 110, 220];
const horizontalOffsets = [-360, -180, 0, 180, 360];

function FriezeIcon({
  icon,
  index,
}: {
  icon: (typeof icons)[number];
  index: number;
}) {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 840], [0, horizontalOffsets[index]]);
  const y = useTransform(scrollY, [0, 840], [verticalOffsets[index], 0]);
  const rotate = useTransform(scrollY, [0, 840], [-8 + index * 4, 0]);

  return (
    <motion.img
      alt={icon.alt}
      className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,.25)] xl:h-24 xl:w-24"
      draggable={false}
      src={icon.src}
      style={{ x, y, rotate }}
    />
  );
}

export function ScrollIconFrieze() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 80, 1180, 1420], [1, 1, 1, 0]);
  const scale = useTransform(scrollY, [0, 900], [0.9, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-1/2 z-[55] hidden h-0 w-0 lg:block"
      style={{ opacity, scale }}
    >
      {icons.map((icon, index) => (
        <FriezeIcon icon={icon} index={index} key={icon.src} />
      ))}
    </motion.div>
  );
}

export function HeroIconColumn() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 lg:flex"
    >
      {icons.map((icon) => (
        <img
          alt=""
          className="h-16 w-16 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,.2)] xl:h-20 xl:w-20"
          draggable={false}
          key={icon.src}
          src={icon.src}
        />
      ))}
    </div>
  );
}

export function BordeauxIconRow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 lg:flex"
    >
      {icons.map((icon) => (
        <img
          alt=""
          className="h-20 w-20 object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,.24)] xl:h-24 xl:w-24"
          draggable={false}
          key={icon.src}
          src={icon.src}
        />
      ))}
    </div>
  );
}
