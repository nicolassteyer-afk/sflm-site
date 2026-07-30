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
  kicker: string;
  pairing: string;
  sliderName: string;
};

const items: SuggestionSlide[] = [
  {
    img: cookieImage,
    title: "Cookie gourmand",
    desc: "La douceur chaude et genereuse qui prolonge la table.",
    kicker: "Dessert signature",
    pairing: "A partager en fin de repas",
    sliderName: "cookie",
  },
  {
    img: kombuchaImage,
    title: "Kombucha province",
    desc: "Une bulle fraiche, acidulee et legere pour les flammes de saison.",
    kicker: "Boisson fraiche",
    pairing: "Parfait avec une flam relevee",
    sliderName: "kombucha",
  },
];

export function SuggestionsMomentCarousel() {
  return (
    <ProgressSlider
      activeSlider="cookie"
      className="relative w-full overflow-hidden rounded-sm border border-bone/12 bg-bone text-cacao shadow-soft"
      duration={6200}
      vertical={false}
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <SliderContent className="relative min-h-[500px] overflow-hidden bg-cream md:min-h-[680px] lg:min-h-[calc(100vh-13rem)]">
          <div className="absolute left-5 top-5 z-10 rounded-full bg-cacao px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-bone md:left-7 md:top-7">
            Edition limitee
          </div>
          {items.map((item) => (
            <SliderWrapper
              className="absolute inset-0 grid h-full w-full place-items-center p-5 md:p-10"
              key={item.sliderName}
              value={item.sliderName}
            >
              <Image
                alt={item.desc}
                className="object-contain"
                fill
                placeholder="blur"
                priority={item.sliderName === "cookie"}
                sizes="(min-width: 1280px) 864px, 100vw"
                src={item.img}
              />
            </SliderWrapper>
          ))}
        </SliderContent>

        <SliderBtnGroup className="grid border-t border-cacao/15 bg-bone lg:border-l lg:border-t-0">
          <div className="border-b border-cacao/15 p-6 md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ember">
              Faites votre choix
            </p>
            <p className="mt-4 text-sm font-bold leading-6 text-cacao/62">
              Chaque suggestion prend toute la place, puis la barre de
              progression passe automatiquement a la suivante.
            </p>
          </div>
          {items.map((item, index) => (
            <SliderBtn
              className="min-h-[190px] border-b border-cacao/15 p-6 md:p-7"
              key={item.sliderName}
              progressBarClass="h-full bg-saffron"
              value={item.sliderName}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ember">
                  {item.kicker}
                </p>
                <span className="text-xs font-black text-cacao/35">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mt-5 font-display text-5xl uppercase leading-none">
                {item.title}
              </h2>
              <p className="mt-4 text-sm font-bold leading-6 text-cacao/70">
                {item.desc}
              </p>
              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.16em] text-cacao/45">
                {item.pairing}
              </p>
            </SliderBtn>
          ))}
        </SliderBtnGroup>
      </div>
    </ProgressSlider>
  );
}
