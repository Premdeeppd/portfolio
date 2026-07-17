import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Prem - Portfolio, articles, and notes",
  description: "ROXC | Turing | IIT Roorkee",
  authors: [{ name: "Prem Deep" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.premdeep.co.in/",
  },
  openGraph: {
    type: "website",
    url: "https://www.premdeep.co.in/",
    title: "Prem - Portfolio, articles, and notes",
    description: "ROXC | Turing | IIT Roorkee",
    images: [
      {
        url: "https://www.premdeep.co.in/og/home.png",
        width: 1200,
        height: 630,
        alt: "Prem - Portfolio, articles, and notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prem - Portfolio, articles, and notes",
    description: "ROXC | Turing | IIT Roorkee",
    images: ["https://www.premdeep.co.in/og/home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <div className="App pt-0 sm:pt-4">
          <NavBar />
          <main className="min-h-[calc(100vh-80px)] pb-12">{children}</main>
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
