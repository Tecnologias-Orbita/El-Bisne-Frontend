"use server";

import { COOKIE_KEYS, SET_COOKIE_VALUES } from "@/lib/constants/cookies";
import { cookies } from "next/headers";

export async function setEverVisitedCookie() {
  (await cookies()).set(
    COOKIE_KEYS.hasEverVisited,
    SET_COOKIE_VALUES.hasEverVisited,
    {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    },
  );
}
