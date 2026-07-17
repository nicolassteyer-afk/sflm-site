import { DigitalMenuShowcase } from "@/components/DigitalMenuShowcase";
import { allRestaurants } from "@/data/restaurants";

export const metadata = {
  title: "La carte | Flam's",
  description: "Choisissez votre restaurant Flam's et ouvrez la carte digitale.",
};

export default async function LaCartePage() {
  return <DigitalMenuShowcase restaurants={allRestaurants} />;
}
