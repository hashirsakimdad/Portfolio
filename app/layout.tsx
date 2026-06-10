import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakimdad Labs — Intelligence, Engineered",
  description:
    "The digital headquarters of Hashir Sakimdad. Research and production systems in LLMs, computer vision, and autonomous AI — built with precision.",
  keywords: [
    "Sakimdad Labs",
    "AI Engineer",
    "LLM Systems",
    "Computer Vision",
    "Hashir Sakimdad",
    "HoloHome AI",
  ],
  openGraph: {
    title: "Sakimdad Labs — Intelligence, Engineered",
    description:
      "Explore the digital headquarters of an AI engineer building production intelligence systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full`}
    >
      <body className="grain min-h-full bg-[#09090B] font-sans text-[#FAFAFA] antialiased">
        {children}
      </body>
    </html>
  );
}
