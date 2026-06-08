"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const assetBase =
  "https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams";

const icons = [
  {
    alt: "Biere Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-BIERE-BEIGE.svg`,
  },
  {
    alt: "Flamme Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-FLAMME-BEIGE.svg`,
  },
  {
    alt: "Fut Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-FUT-BEIGE.svg`,
  },
  {
    alt: "Planche Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-PLANCHE-BEIGE.svg`,
  },
  {
    alt: "Vin Flam's",
    src: `${assetBase}/2025-09-FLAMS-Valise-Logo_ILLU-VIN-BEIGE.svg`,
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
  const y = useTransform(scrollY, [0, 840], [verticalOffsets[index], 650]);
  const rotate = useTransform(scrollY, [0, 840], [-8 + index * 4, 0]);
  const size = useTransform(scrollY, [0, 840], [78, 96]);

  return (
    <motion.img
      alt={icon.alt}
      className="absolute -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,.25)]"
      draggable={false}
      src={icon.src}
      style={{ x, y, rotate, height: size, width: size }}
    />
  );
}

export function ScrollIconFrieze() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 80, 1080, 1280], [1, 1, 1, 0]);
  const scale = useTransform(scrollY, [0, 840], [0.9, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[50vh] z-30 hidden h-0 w-0 lg:block"
      style={{ opacity, scale }}
    >
      {icons.map((icon, index) => (
        <FriezeIcon icon={icon} index={index} key={icon.src} />
      ))}
    </motion.div>
  );
}
