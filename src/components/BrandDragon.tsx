"use client";

type BrandDragonProps = {
  alt?: string;
  className?: string;
  tone?: "beige" | "bordeaux" | "jaune" | "rouge";
};

const toneColors = {
  beige: "#fff9df",
  bordeaux: "#71131a",
  jaune: "#f5ad16",
  rouge: "#ee1017",
} satisfies Record<NonNullable<BrandDragonProps["tone"]>, string>;

export function BrandDragon({
  alt = "Dragon Flam's",
  className = "",
  tone = "beige",
}: BrandDragonProps) {
  const color = toneColors[tone];

  return (
    <svg
      aria-label={alt}
      className={className}
      role="img"
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M117 338c-27-4-45-18-52-39-8-23 2-47 18-66 8-10 15-20 16-33 1-19-13-34-25-48-15-18-29-38-24-64 4-22 19-40 40-48 20-8 42-4 57 10 10 9 14 21 19 33 5 14 11 29 24 34 17 7 34-9 48-22 20-19 41-37 72-29 33 8 55 37 55 70 0 22-9 39-24 53-15 14-35 22-57 27 6 21 21 36 40 51 26 20 58 44 61 85 1 12-5 20-17 20-25-1-53-13-82-11-38 2-77 20-116 14-8-1-14-5-15-14-1-15 18-35 33-52 10-12 22-25 19-32-3-8-22 5-33 10-20 11-37 24-57 21Z"
        fill={color}
      />
      <path
        d="M83 83c-2 38 29 83 75 103-24-28-49-57-75-103Zm170 90c39-4 70-16 81-36 8-16 1-33-13-40-17-9-33 0-43 15-4 7-11 12-19 16-17 10-35 24-56 24 12 12 28 19 50 21Zm-18 91c28 6 52 2 67-12 6-5 2-13-5-11-17 6-33 9-54 7-9-1-14 13-8 16Zm-37 46c-5 19-16 31-31 42-9 7-4 18 8 18 35 0 56-17 70-51 5-13-43-22-47-9Z"
        fill="#fffdf0"
        opacity="0.18"
      />
      <path
        d="M292 68c8-18 21-29 43-32-4 13-2 24 8 35 11 13 13 28 6 42-14-14-31-25-57-45ZM81 359c-17-6-29-20-34-39 13 6 25 7 37 0 14-8 29-8 42 0-14 11-29 24-45 39ZM335 174c25-1 47 8 64 29-20 3-33 11-40 25-15-16-23-34-24-54Z"
        fill={color}
      />
      <path
        d="M256 123c10 1 17 5 22 13-12 4-24 4-36 1 1-9 6-14 14-14Z"
        fill="#fffdf0"
      />
      <path
        d="M260 278c15 2 30-1 44-7M245 305c18 3 36 0 54-8M220 330c17 4 33 4 48 0"
        fill="none"
        stroke="#fffdf0"
        strokeLinecap="round"
        strokeWidth="10"
        opacity="0.9"
      />
      <path
        d="M273 39c5 24 0 45-15 63-13 17-32 31-51 44M102 177c26 23 56 35 90 36"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="18"
      />
    </svg>
  );
}
