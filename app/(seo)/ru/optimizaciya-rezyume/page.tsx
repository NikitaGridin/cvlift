import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-optimizer");

export const metadata = getSeoLandingMetadata(page, "ru");

export default function RuResumeOptimizerPage() {
  return <SeoLandingPage page={page} locale="ru" />;
}
