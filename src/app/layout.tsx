import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Loader } from "@/components/Loader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "honey.is-a.dev — Himanshu Soni | Full-Stack Developer",
  description:
    "Portfolio of Himanshu Soni — Software Engineer & Full-Stack Developer. Creator of Extroverts (8K+ users) and Kitinit.com (27K+ users).",
  openGraph: {
    title: "honey.is-a.dev — Himanshu Soni",
    description:
      "Full-Stack Developer building products at scale. Creator of Extroverts & Kitinit.com.",
    siteName: "honey.is-a.dev",
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
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
        <Loader />
        {children}
      </body>
    </html>
  );
}
