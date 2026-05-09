import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-keywords");

export const metadata = getSeoLandingMetadata(page);

export default function ResumeKeywordsPage() {
  return <SeoLandingPage page={page} />;
}
