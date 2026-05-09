import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("cover-letter-generator");

export const metadata = getSeoLandingMetadata(page, "en");

export default function CoverLetterGeneratorPage() {
  return <SeoLandingPage page={page} locale="en" />;
}
