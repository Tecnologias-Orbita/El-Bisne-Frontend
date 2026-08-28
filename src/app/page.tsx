import { PlatformHomePage } from "@/modules/platform-public/pages/PlatformHomePage";
import { seo } from "@/lib/seo/seo";

export const metadata = seo("Inicio");

export default function Page() {
  return <PlatformHomePage />;
}
