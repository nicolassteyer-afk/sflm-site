"use client";

import { useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const sources = ["/assets/flams/logo-beige.svg"];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const textColor = tone === "cream" ? "text-bone" : "text-wine";
  const bordeauxFilter =
    "brightness(0) saturate(100%) invert(10%) sepia(57%) saturate(2252%) hue-rotate(335deg) brightness(96%) contrast(91%)";

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
          style={tone === "bordeaux" ? { filter: bordeauxFilter } : undefined}
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
