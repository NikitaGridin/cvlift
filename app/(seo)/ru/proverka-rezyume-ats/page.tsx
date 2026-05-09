import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getRequiredSeoPage } from "@/lib/seo-content";

const page = getRequiredSeoPage("ats-resume-checker");

export const metadata = getSeoLandingMetadata(page, "ru");

export default function RuAtsResumeCheckerPage() {
  return <SeoLandingPage page={page} locale="ru" />;
}
