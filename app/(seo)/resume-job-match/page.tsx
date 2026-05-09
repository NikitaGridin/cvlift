import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("resume-job-match");

export const metadata = getSeoLandingMetadata(page, "en");

export default function ResumeJobMatchPage() {
  return <SeoLandingPage page={page} locale="en" />;
}
