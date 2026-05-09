export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvlift.ru").replace(
  /\/$/,
  "",
);
export const siteLogoPath = "/cvlift-logo.svg";

export const siteMetadataBase = new URL(siteUrl);

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteLogoUrl = absoluteUrl(siteLogoPath);
