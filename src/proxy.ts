import { COOKIE_KEYS, SET_COOKIE_VALUES } from "@/lib/constants/cookies";
import { APP_ROUTER } from "@/lib/route/app-router";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== APP_ROUTER.WELCOME) {
    const hasEverVisited = request.cookies.get(COOKIE_KEYS.hasEverVisited);

    if (hasEverVisited?.value !== SET_COOKIE_VALUES.hasEverVisited) {
      return NextResponse.redirect(new URL(APP_ROUTER.WELCOME, request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
