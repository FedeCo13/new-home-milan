import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Milano",
  description: "Sei ambienti, diciotto viste statiche del modello approvato di Casa Milano",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
