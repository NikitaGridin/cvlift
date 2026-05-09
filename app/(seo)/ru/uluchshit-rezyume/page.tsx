import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-improvement");

export const metadata = getSeoLandingMetadata(page, "ru");

export default function RuResumeImprovementPage() {
  return <SeoLandingPage page={page} locale="ru" />;
}
