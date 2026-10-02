import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS } from "@/config/app";

const PUBLIC_PATHS = ["/login", "/signup", "/admin/login"];

/**
 * Controllo ottimistico: solo presenza del cookie e rinnovo della sua scadenza.
 * L'autorizzazione vera avviene nei guard server (lib/auth/guards.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!token && !isPublic) {
    const target = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  const response = NextResponse.next();
  if (token) {
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Esclude asset statici, icone e manifest PWA
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|pwa-icon|manifest.webmanifest|.*\\.(?:png|svg|jpg|jpeg|webp|ico|txt)$).*)",
  ],
};
