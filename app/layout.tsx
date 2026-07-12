import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Inter powers the admin dashboard UI (see styles/admin.css).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Asad Khan — Full-Stack Developer",
    template: "%s — Asad Khan",
  },
  description:
    "Portfolio of Asad Khan, a full-stack developer building AI-integrated web applications with React, Next.js, and Node.js.",
  openGraph: {
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> (the :root scope) so that --font-sans,
    // declared on :root, can substitute --font-inter. On <body> they were
    // invisible to :root and the site fell back to the default font.
    <html
      lang="en"
      data-bs-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
