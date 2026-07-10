"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname === "/restaurants") {
    return null;
  }

  return <Footer />;
}
