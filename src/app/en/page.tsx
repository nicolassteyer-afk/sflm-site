import { HeroSection } from "@/components/HeroSection";
import { CTAReservation } from "@/components/CTAReservation";

export default function EnglishHomePage() {
  return (
    <>
      <HeroSection
        eyebrow="Warm dining rooms"
        title="Fire low, tables full."
        body="A premium restaurant experience for shared plates, long drinks and lively nights."
        visualLabel="english hero"
        primaryLabel="Book"
      />
      <CTAReservation eyebrow="Booking" title="Shall we keep you a table?" />
    </>
  );
}
