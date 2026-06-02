import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flam's - Tables chaudes et grandes soirees",
  description:
    "Site vitrine restaurant premium avec navigation immersive, scroll fluide et reservation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <header className="fixed left-0 right-0 top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[#fff7df]/20 bg-[#11100d]/45 px-5 py-4 text-[#fff7df] backdrop-blur-md md:px-10 lg:px-16">
          <a
            className="rounded-full border border-current px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:border-[#ef3c19] hover:bg-[#ef3c19]"
            href="#navigation"
          >
            Menu
          </a>
          <a className="justify-self-center" href="/" aria-label="Accueil Flam's">
            <img
              alt="Flam's"
              className="h-12 w-auto max-w-[150px] object-contain md:h-14 md:max-w-[190px]"
              src="/assets/flams/logo-beige.png"
            />
          </a>
          <a
            className="rounded-full border border-current px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:border-[#ef3c19] hover:bg-[#ef3c19]"
            href="/reservation"
          >
            Reserver
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
