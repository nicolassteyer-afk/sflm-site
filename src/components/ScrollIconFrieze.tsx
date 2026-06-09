"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const iconNames = ["BIERE", "FLAMME", "FUT", "PLANCHE", "VIN"];

const icons = iconNames.map((name) => ({
  alt: `${name.toLowerCase()} Flam's`,
  bdx: `https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-${name}-BDX.svg`,
  beige: `https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-${name}-BEIGE.svg`,
}));

const verticalOffsets = [-210, -105, 0, 105, 210];
const horizontalOffsets = [-320, -160, 0, 160, 320];

function FriezeIcon({
  icon,
  index,
}: {
  icon: (typeof icons)[number];
  index: number;
}) {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 420, 960], [0, 0, horizontalOffsets[index]]);
  const y = useTransform(scrollY, [0, 420, 960], [verticalOffsets[index], verticalOffsets[index] + 80, 0]);
  const rotate = useTransform(scrollY, [0, 960], [-7 + index * 3.5, 0]);
  const bdxOpacity = useTransform(scrollY, [0, 650, 860], [1, 1, 0]);
  const beigeOpacity = useTransform(scrollY, [0, 650, 860], [0, 0, 1]);

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
  const y = useTransform(scrollY, [0, 420, 960], ["46vh", "66vh", "112vh"]);
  const opacity = useTransform(scrollY, [0, 80, 1250, 1500], [1, 1, 1, 0]);
  const scale = useTransform(scrollY, [0, 960], [0.9, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-[60] hidden h-0 w-0 -translate-x-1/2 lg:block"
      style={{ opacity, scale, y }}
    >
      {icons.map((icon, index) => (
        <FriezeIcon icon={icon} index={index} key={icon.bdx} />
      ))}
    </motion.div>
  );
}
