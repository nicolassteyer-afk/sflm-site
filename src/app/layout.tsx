import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { FlamsCursor } from "@/components/FlamsCursor";
import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Flam's - Tables chaudes et grandes soirees",
  description:
    "Site vitrine Flam's inspire des grandes experiences restaurant premium, avec navigation immersive et reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SmoothScrollProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <FlamsCursor />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
