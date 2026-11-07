"use client";

import { useEffect } from "react";
import { setEverVisitedCookie } from "../services/actions";

export default function SetVisitedCookie() {
  useEffect(() => {
    setEverVisitedCookie();
  }, []);

  return null;
}
