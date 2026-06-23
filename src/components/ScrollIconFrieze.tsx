"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const iconNames = ["BIERE", "FLAMME", "FUT", "PLANCHE", "VIN"];

const icons = iconNames.map((name) => ({
  alt: `${name.toLowerCase()} Flam's`,
  bdx: `https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-${name}-BDX.svg`,
  beige: `https://raw.githubusercontent.com/nicolassteyer-afk/sflm-site/main/public/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-${name}-BEIGE.svg`,
}));

const verticalOffsets = ["-17rem", "-8.5rem", "0rem", "8.5rem", "17rem"];
const midVerticalOffsets = ["-10rem", "-5rem", "0rem", "5rem", "10rem"];
const horizontalOffsets = ["-28vw", "-14vw", "0vw", "14vw", "28vw"];

function FriezeIcon({
  icon,
  index,
}: {
  icon: (typeof icons)[number];
  index: number;
}) {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 520, 980], ["0vw", "0vw", horizontalOffsets[index]]);
  const y = useTransform(scrollY, [0, 520, 980], [verticalOffsets[index], midVerticalOffsets[index], "0rem"]);
  const rotate = useTransform(scrollY, [0, 980], [-7 + index * 3.5, 0]);
  const bdxOpacity = useTransform(scrollY, [0, 650, 900], [1, 1, 0]);
  const beigeOpacity = useTransform(scrollY, [0, 650, 900], [0, 0, 1]);

  return (
    <motion.div
      className="absolute h-[clamp(3.1rem,5.8vw,5.6rem)] w-[clamp(3.1rem,5.8vw,5.6rem)] -translate-x-1/2 -translate-y-1/2"
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
  const y = useTransform(scrollY, [0, 520, 980], ["58vh", "78vh", "108vh"]);
  const opacity = useTransform(scrollY, [0, 80, 1180, 1380], [1, 1, 1, 0]);
  const scale = useTransform(scrollY, [0, 980], [0.82, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-0 w-0 -translate-x-1/2 md:block"
      style={{ opacity, scale, y }}
    >
      {icons.map((icon, index) => (
        <FriezeIcon icon={icon} index={index} key={icon.bdx} />
      ))}
    </motion.div>
  );
}
