import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flam's - Tables chaudes et grandes soirees",
  description: "Site vitrine restaurant premium avec navigation immersive, scroll fluide et reservation."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
