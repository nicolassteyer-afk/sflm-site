"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type CursorMode = "idle" | "title" | "link";

export function FlamsCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("idle");

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const supportsCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsCursor) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let renderedX = x;
    let renderedY = y;
    const root = document.documentElement;

    setEnabled(true);
    root.classList.add("flams-cursor-on");

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
    };

    const updateMode = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const title = target?.closest("h1, h2, .font-display");
      const link = target?.closest("a, button, [role='button'], input, textarea, select");

      if (title && !title.closest("header, footer, [data-cursor-ignore='true']")) {
        setMode("title");
        return;
      }

      if (link) {
        setMode("link");
        return;
      }

      setMode("idle");
    };

    const render = () => {
      renderedX += (x - renderedX) * 0.22;
      renderedY += (y - renderedY) * 0.22;
      root.style.setProperty("--flams-cursor-x", `${renderedX}px`);
      root.style.setProperty("--flams-cursor-y", `${renderedY}px`);
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", updateMode, { passive: true });
    window.addEventListener("pointerout", updateMode, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", updateMode);
      window.removeEventListener("pointerout", updateMode);
      root.classList.remove("flams-cursor-on");
      root.style.removeProperty("--flams-cursor-x");
      root.style.removeProperty("--flams-cursor-y");
      setEnabled(false);
    };
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={`flams-cursor flams-cursor--${mode}`}>
      <span className="flams-cursor__toe flams-cursor__toe--left" />
      <span className="flams-cursor__toe flams-cursor__toe--center" />
      <span className="flams-cursor__toe flams-cursor__toe--right" />
      <span className="flams-cursor__pad" />
    </div>
  );
}
