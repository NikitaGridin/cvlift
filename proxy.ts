import { NextResponse, type NextRequest } from "next/server";

const localeCookieName = "offerlyra_locale";

export function proxy(request: NextRequest) {
  const locale = getLocaleFromPath(request.nextUrl.pathname);

  if (!locale) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-offerlyra-locale", locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 31_536_000,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/ru/:path*"],
};

function getLocaleFromPath(pathname: string) {
  return pathname === "/ru" || pathname.startsWith("/ru/") ? "ru" : null;
}
