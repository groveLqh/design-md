import { NextResponse, type NextRequest } from "next/server";

const kamiAliases = new Set([
  "/design/print-kami",
  "/design/print–kami",
  "/design/print—kami",
]);

export function proxy(request: NextRequest) {
  const pathname = decodeURIComponent(request.nextUrl.pathname);

  if (kamiAliases.has(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/design/print--kami";
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/design/:path*",
};
