import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-keywords");

export const metadata = getSeoLandingMetadata(page, "ru");

export default function RuResumeKeywordsPage() {
  return <SeoLandingPage page={page} locale="ru" />;
}
