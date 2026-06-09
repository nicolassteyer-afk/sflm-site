"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const icons = [
  {
    alt: "Biere Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-BIERE-BEIGE.svg",
  },
  {
    alt: "Flamme Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-FLAMME-BEIGE.svg",
  },
  {
    alt: "Fut Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-FUT-BEIGE.svg",
  },
  {
    alt: "Planche Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-PLANCHE-BEIGE.svg",
  },
  {
    alt: "Vin Flam's",
    src: "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-VIN-BEIGE.svg",
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
  const x = useTransform(scrollY, [0, 280, 940], [0, 0, horizontalOffsets[index]]);
  const y = useTransform(scrollY, [0, 280, 940], [verticalOffsets[index], verticalOffsets[index] + 120, 0]);
  const rotate = useTransform(scrollY, [0, 840], [-8 + index * 4, 0]);

  return (
    <motion.img
      alt={icon.alt}
      className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,.2)] xl:h-20 xl:w-20"
      draggable={false}
      src={icon.src}
      style={{ x, y, rotate }}
    />
  );
}

export function ScrollIconFrieze() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 280, 940], [0, 120, 770]);
  const opacity = useTransform(scrollY, [0, 80, 1180, 1420], [1, 1, 1, 0]);
  const scale = useTransform(scrollY, [0, 940], [0.9, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[50vh] z-30 hidden h-0 w-0 lg:block"
      style={{ opacity, scale, y }}
    >
      {icons.map((icon, index) => (
        <FriezeIcon icon={icon} index={index} key={icon.src} />
      ))}
    </motion.div>
  );
}
