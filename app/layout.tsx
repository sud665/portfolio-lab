import type { Metadata } from "next";
import { Outfit, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { getProfile } from "@/lib/content";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ScrollToTop } from "@/components/common/ScrollToTop";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio — 화학에서 코드로, 코드에서 AI로",
    template: "%s",
  },
  description:
    "화학공학 7년 + 풀스택 4년 + AI Agent. 도메인 지식을 가진 풀스택 개발자 포트폴리오.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = getProfile();

  return (
    <html lang="ko">
      <body
        className={`${outfit.variable} ${playfair.variable} ${jetbrainsMono.variable} font-outfit antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer
          name={profile.name}
          github={profile.github}
          email={profile.email}
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
