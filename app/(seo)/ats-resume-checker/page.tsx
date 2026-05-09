import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("ats-resume-checker");

export const metadata = getSeoLandingMetadata(page);

export default function AtsResumeCheckerPage() {
  return <SeoLandingPage page={page} />;
}
