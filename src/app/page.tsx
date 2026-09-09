import { seo } from "@/lib/seo/seo";
import { PlatformHomePage } from "@/modules/platform-public/pages/PlatformHomePage";
import type { Metadata } from "next";

export const metadata: Metadata = seo("Inicio");

export default function Page() {
  return <PlatformHomePage />;
}
