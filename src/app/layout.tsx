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
  title: "honey is a dev — Himanshu Soni",
  description:
    "honey is a dev — Himanshu Soni, full-stack developer. Mobile, web & backend.",
  verification: {
    google: "ew84dA09uOb0TOrmOvKS69o3QseZeHkvb6H9djXtYoU",
  },
  openGraph: {
    title: "honey is a dev — Himanshu Soni",
    description:
      "honey is a dev — Himanshu Soni, full-stack developer. Mobile, web & backend.",
    siteName: "honey.is-a.dev",
    type: "website",
  },
  keywords: [
    "honey is a dev",
    "honey",
    "developer",
    "dev",
    "full-stack developer",
    "Himanshu Soni",
    "React",
    "Next.js",
    "Python",
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Himanshu Soni",
              alternateName: "honey",
              url: "https://honey.is-a.dev",
              jobTitle: "Full-stack Developer",
              knowsAbout: [
                "React",
                "Next.js",
                "Python",
                "Laravel",
                "React Native",
                "AWS",
                "Docker",
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "IIT Madras",
              },
            }),
          }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-[#fafafa] min-h-screen bg-grid-fine bg-noise">
        <CustomCursor />
        <Loader />
        {children}
      </body>
    </html>
  );
}
