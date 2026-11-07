import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: "variable",
  subsets: ["latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
