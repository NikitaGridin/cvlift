import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-score");

export const metadata = getSeoLandingMetadata(page);

export default function ResumeScorePage() {
  return <SeoLandingPage page={page} />;
}
