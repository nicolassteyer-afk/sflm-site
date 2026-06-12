"use client";

import { useEffect, useRef } from "react";

type TextPressureProps = {
  text: string;
  className?: string;
};

export function TextPressure({ text, className = "" }: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const centerPointer = () => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      currentRef.current = { ...pointerRef.current };
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerLeave = () => centerPointer();

    centerPointer();
    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    let frame = 0;
    const animate = () => {
      currentRef.current.x +=
        (pointerRef.current.x - currentRef.current.x) * 0.12;
      currentRef.current.y +=
        (pointerRef.current.y - currentRef.current.y) * 0.12;

      const rect = container.getBoundingClientRect();
      const influence = Math.max(rect.width * 0.42, 180);

      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        const letterRect = letter.getBoundingClientRect();
        const x = letterRect.left + letterRect.width / 2;
        const y = letterRect.top + letterRect.height / 2;
        const distance = Math.hypot(
          currentRef.current.x - x,
          currentRef.current.y - y,
        );
        const pressure = Math.max(0, 1 - distance / influence);
        const scaleX = 0.94 + pressure * 0.22;
        const weight = pressure > 0.72 ? 900 : pressure > 0.42 ? 800 : 600;

        letter.style.transform = `scaleX(${scaleX})`;
        letter.style.fontWeight = String(weight);
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave,
      );
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <h1
        aria-label={text}
        className="flex w-full items-baseline justify-center whitespace-nowrap"
      >
        {Array.from(text).map((character, index) => (
          <span
            aria-hidden="true"
            className="inline-block origin-center transition-[font-weight] duration-150 will-change-transform"
            key={`${character}-${index}`}
            ref={(element) => {
              lettersRef.current[index] = element;
            }}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        ))}
      </h1>
    </div>
  );
}
