import { Inter } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={Inter.className}>
      <body>{children}</body>
    </html>
  );
}
