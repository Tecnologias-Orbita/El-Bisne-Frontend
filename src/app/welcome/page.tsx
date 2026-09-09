import { seo } from "@/lib/seo/seo";
import WelcomePage from "@/modules/platform-public/pages/WelcomePage";
import type { Metadata } from "next";

export const metadata: Metadata = seo("Bienvenido");

export default function Page() {
  return <WelcomePage />;
}
