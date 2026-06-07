import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Loader } from "@/components/Loader";
import { CustomCursor } from "@/components/CustomCursor";

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
  title: "honey.is-a.dev — Himanshu Soni",
  description: "Full-stack developer. Mobile, web, and backend.",
  openGraph: {
    title: "honey.is-a.dev — Himanshu Soni",
    description: "Full-stack developer — mobile, web, and backend.",
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
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased cursor-none`}
      suppressHydrationWarning
    >
      <body className="bg-[#0a0a0a] text-[#fafafa] min-h-screen bg-grid-fine bg-noise">
        <CustomCursor />
        <Loader />
        {children}
      </body>
    </html>
  );
}
