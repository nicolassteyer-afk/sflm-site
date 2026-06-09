"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const iconNames = ["BIERE", "FLAMME", "FUT", "PLANCHE", "VIN"];

const icons = iconNames.map((name) => ({
  alt: `${name.toLowerCase()} Flam's`,
  bdx: `https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-${name}-BDX.svg`,
  beige: `https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-${name}-BEIGE.svg`,
}));

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
  const bdxOpacity = useTransform(scrollY, [0, 720, 940], [1, 1, 0]);
  const beigeOpacity = useTransform(scrollY, [0, 720, 940], [0, 0, 1]);

  return (
    <motion.div
      className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 xl:h-24 xl:w-24"
      style={{ x, y, rotate }}
    >
      <motion.img
        alt={icon.alt}
        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,.2)]"
        draggable={false}
        src={icon.bdx}
        style={{ opacity: bdxOpacity }}
      />
      <motion.img
        alt=""
        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,.2)]"
        draggable={false}
        src={icon.beige}
        style={{ opacity: beigeOpacity }}
      />
    </motion.div>
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
      className="pointer-events-none absolute left-1/2 top-[48vh] z-[60] hidden h-0 w-0 lg:block"
      style={{ opacity, scale, y }}
    >
      {icons.map((icon, index) => (
        <FriezeIcon icon={icon} index={index} key={icon.bdx} />
      ))}
    </motion.div>
  );
}
