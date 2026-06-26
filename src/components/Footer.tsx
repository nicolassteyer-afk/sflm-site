import { getPublicFooter } from "@/lib/cms";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const cmsFooter = await getPublicFooter();
  return <FooterClient cmsFooter={cmsFooter} />;
}
