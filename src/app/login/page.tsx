import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { seo } from "@/lib/seo/seo";

export const metadata = seo("Iniciar sesión");

export default function Page() {
  return <LoginPage />;
}
