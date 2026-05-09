import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-improvement");

export const metadata = getSeoLandingMetadata(page, "en");

export default function ResumeImprovementPage() {
  return <SeoLandingPage page={page} locale="en" />;
}
