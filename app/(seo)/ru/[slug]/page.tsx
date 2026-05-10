import { notFound } from "next/navigation";
import { getSeoLandingMetadata, SeoLandingPage } from "@/components/seo-landing-page";
import { getSeoPage, seoPages } from "@/lib/seo-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoPages.map((page) => ({
    slug: page.localizedSlugs.ru,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    return {};
  }

  return getSeoLandingMetadata(page, "ru");
}

export default async function RuSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} locale="ru" />;
}
