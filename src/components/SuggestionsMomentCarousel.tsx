"use client";

import Image, { type StaticImageData } from "next/image";
import cookieImage from "../../assets/images/PDM-PRINTEMPS-2026-COOKIE-scaled (1).webp";
import kombuchaImage from "../../assets/images/Kombucha-province (1).webp";
import {
  ProgressSlider,
  SliderBtn,
  SliderBtnGroup,
  SliderContent,
  SliderWrapper,
} from "@/components/ui/progressive-carousel";

type SuggestionSlide = {
  img: StaticImageData;
  title: string;
  desc: string;
  sliderName: string;
};

const items: SuggestionSlide[] = [
  {
    img: cookieImage,
    title: "Cookie gourmand",
    desc: "La douceur chaude et genereuse qui prolonge la table.",
    sliderName: "cookie",
  },
  {
    img: kombuchaImage,
    title: "Kombucha province",
    desc: "Une bulle fraiche, acidulee et legere pour les flammes de saison.",
    sliderName: "kombucha",
  },
];

export function SuggestionsMomentCarousel() {
  return (
    <ProgressSlider
      activeSlider="cookie"
      className="relative w-full overflow-hidden rounded-sm border border-bone/15 bg-bone shadow-soft"
      duration={5600}
      vertical={false}
    >
      <div className="grid bg-bone lg:grid-cols-[1fr_320px]">
        <SliderContent className="relative min-h-[430px] bg-bone md:min-h-[620px] lg:min-h-[calc(100vh-12rem)]">
        {items.map((item) => (
          <SliderWrapper
            className="absolute inset-0 grid h-full w-full place-items-center p-4 md:p-8"
            key={item.sliderName}
            value={item.sliderName}
          >
            <Image
              alt={item.desc}
              className="object-contain"
              fill
              placeholder="blur"
              priority={item.sliderName === "cookie"}
              sizes="(min-width: 1280px) 832px, 100vw"
              src={item.img}
            />
          </SliderWrapper>
        ))}
        </SliderContent>

        <SliderBtnGroup className="grid border-t border-cacao/15 bg-cream text-cacao md:grid-cols-2 lg:grid-cols-1 lg:border-l lg:border-t-0">
        {items.map((item) => (
          <SliderBtn
            className="min-h-[150px] border-t border-cacao/15 p-6 first:border-t-0 md:border-r md:first:border-t md:odd:border-l-0 lg:border-r-0 lg:first:border-t-0"
            key={item.sliderName}
            progressBarClass="h-full bg-saffron"
            value={item.sliderName}
          >
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-ember">
              Produit du moment
            </p>
            <h2 className="font-display text-5xl uppercase leading-none">
              {item.title}
            </h2>
            <p className="mt-4 text-sm font-bold leading-6 text-cacao/70">
              {item.desc}
            </p>
          </SliderBtn>
        ))}
        </SliderBtnGroup>
      </div>
    </ProgressSlider>
  );
}
