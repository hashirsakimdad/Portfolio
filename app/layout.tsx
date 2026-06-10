import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hashir Sakimdad — AI Engineer Laboratory",
  description:
    "Futuristic AI Engineer portfolio. LLM systems, computer vision, multi-agent pipelines, and holographic AI — built by Hashir Sakimdad in Islamabad, Pakistan.",
  keywords: [
    "AI Engineer",
    "LLM",
    "Computer Vision",
    "LangGraph",
    "Hashir Sakimdad",
    "FastAPI",
    "HoloHome AI",
  ],
  openGraph: {
    title: "Hashir Sakimdad — AI Engineer Laboratory",
    description: "Enter the personal AI laboratory of Hashir Sakimdad.",
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
      className={`${inter.variable} ${orbitron.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full bg-[#05080F] font-sans text-[#F0F4FF] antialiased">
        {children}
      </body>
    </html>
  );
}
