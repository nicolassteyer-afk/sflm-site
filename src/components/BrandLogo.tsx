"use client";

import { useEffect, useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const sources =
    tone === "cream"
      ? [
          "/assets/flams/logo-beige.png?v=20260604",
          "/assets/flams/logo-beige.svg?v=20260604",
          "/assets/flams/Logo%20beige.png?v=20260604",
          "/assets/flams/Logo%20beige.svg?v=20260604",
          "/Logo%20beige.png?v=20260604",
          "/Logo%20beige.svg?v=20260604",
        ]
      : [
          "/assets/flams/logo-bdx.png?v=20260604",
          "/assets/flams/Logo%20BDX.png?v=20260604",
          "/Logo%20BDX.png?v=20260604",
          "/assets/flams/LOGO-FLAM%27S-ROUGE.png?v=20260604",
          "/LOGO-FLAM%27S-ROUGE.png?v=20260604",
          "/assets/flams/logo-beige.png?v=20260604",
          "/assets/flams/Logo%20beige.png?v=20260604",
        ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const textColor = tone === "cream" ? "text-bone" : "text-wine";

  useEffect(() => {
    setSourceIndex(0);
    setShowImage(true);
  }, [tone]);

  return (
    <span
      aria-label="Flam's"
      className={`relative inline-flex h-12 w-36 items-center justify-center overflow-hidden ${className}`}
    >
      {showImage ? (
        <img
          alt="Flam's"
          className="block h-full w-full object-contain"
          draggable={false}
          key={`${tone}-${sourceIndex}`}
          src={sources[sourceIndex]}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex(sourceIndex + 1);
              return;
            }
            setShowImage(false);
          }}
        />
      ) : (
        <span className={`font-display text-[2.8rem] uppercase leading-none ${textColor}`}>
          Flam&apos;s
        </span>
      )}
    </span>
  );
}
