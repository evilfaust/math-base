import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isBlog = hostname.startsWith("blog.");

  if (isBlog) {
    const url = request.nextUrl.clone();
    const originalPath = url.pathname;
    // Rewrite blog.oipav.ru/anything → /blog/anything
    url.pathname = `/blog${originalPath === "/" ? "" : originalPath}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
