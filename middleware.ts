import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect / to /sv
  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];

  // If first segment is a valid locale, allow
  if (isValidLocale(maybeLocale)) {
    return NextResponse.next();
  }

  // Legacy /experiment etc. → redirect to /sv/experiment
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon|images|.*\\..*).*)"],
};
