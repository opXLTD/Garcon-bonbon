import "./globals.css";
import type { Metadata } from "next";
import { SITE } from "@/lib/supabase";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Garçon Bonbon | Legendary Stories", template: "%s | Garçon Bonbon" },
  description: "The lore of Garçon Bonbon and the President of Italy: AI-written, witty, spontaneous stories.",
  openGraph: { type: "website", siteName: "Garçon Bonbon" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        <nav className="flex justify-between p-5 max-w-5xl mx-auto">
          <a href="/" className="font-serif text-xl text-pink-300">Garçon Bonbon</a>
          <a href="/stories" className="hover:text-pink-300">Stories</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
