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
    desc: "La douceur du moment pour terminer la table sur une note chaude et genereuse.",
    sliderName: "cookie",
  },
  {
    img: kombuchaImage,
    title: "Kombucha province",
    desc: "Une bulle fraiche, acidulee et legere pour accompagner les flammes de saison.",
    sliderName: "kombucha",
  },
];

export function SuggestionsMomentCarousel() {
  return (
    <ProgressSlider
      activeSlider="cookie"
      className="mx-auto w-full overflow-hidden rounded-sm border border-bone/15 bg-ink shadow-soft"
      duration={5600}
      vertical={false}
    >
      <SliderContent className="relative min-h-[460px] md:min-h-[640px] lg:min-h-[72vh]">
        {items.map((item) => (
          <SliderWrapper
            className="absolute inset-0 h-full w-full"
            key={item.sliderName}
            value={item.sliderName}
          >
            <Image
              alt={item.desc}
              className="h-full w-full object-cover"
              fill
              placeholder="blur"
              priority={item.sliderName === "cookie"}
              sizes="(min-width: 1280px) 1184px, 100vw"
              src={item.img}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
          </SliderWrapper>
        ))}
      </SliderContent>

      <SliderBtnGroup className="absolute bottom-0 grid w-full grid-cols-1 overflow-hidden bg-bone/80 text-cacao backdrop-blur-md md:grid-cols-2">
        {items.map((item) => (
          <SliderBtn
            className="min-h-[118px] border-t border-cacao/15 p-5 md:min-h-[136px] md:border-r md:p-6 md:last:border-r-0"
            key={item.sliderName}
            progressBarClass="h-full bg-saffron/80"
            value={item.sliderName}
          >
            <h2 className="w-fit rounded-full bg-cacao px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-bone">
              {item.title}
            </h2>
            <p className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-cacao/75">
              {item.desc}
            </p>
          </SliderBtn>
        ))}
      </SliderBtnGroup>
    </ProgressSlider>
  );
}
