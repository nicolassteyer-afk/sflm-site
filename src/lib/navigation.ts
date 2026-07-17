export const mainLinks = [
  { href: "/notre-univers", label: "Notre Univers" },
  { href: "/menu", label: "Carte" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/recrutement", label: "Recrutement" },
  { href: "/contact", label: "Contact" },
];

export function withLocale(pathname: string, locale: "fr" | "en") {
  if (locale === "fr") {
    return pathname.replace(/^\/en/, "") || "/";
  }

  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  return `/en${pathname}`;
}
