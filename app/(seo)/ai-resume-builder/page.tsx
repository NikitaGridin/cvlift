import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("ai-resume-builder");

export const metadata = getSeoLandingMetadata(page, "en");

export default function AiResumeBuilderPage() {
  return <SeoLandingPage page={page} locale="en" />;
}
