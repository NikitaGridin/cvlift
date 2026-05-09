import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("ai-resume-builder");

export const metadata = getSeoLandingMetadata(page, "ru");

export default function RuAiResumeBuilderPage() {
  return <SeoLandingPage page={page} locale="ru" />;
}
