import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("cover-letter-generator");

export const metadata = getSeoLandingMetadata(page, "ru");

export default function RuCoverLetterGeneratorPage() {
  return <SeoLandingPage page={page} locale="ru" />;
}
