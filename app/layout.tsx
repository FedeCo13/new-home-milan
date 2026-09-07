import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Milano",
  description: "Simulatore della futura casa a Milano",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
