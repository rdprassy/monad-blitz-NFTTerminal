import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";

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

export const metadata: Metadata = {
  title: "NFT Terminal | The All-in-One NFT Launchpad on Monad",
  description:
    "Deploy, mint, gate, and analyze NFT collections on Monad. No-code launchpad for creators, influencers, and artists.",
  keywords: ["NFT", "Monad", "Launchpad", "Mint", "Web3", "Token Gating"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-monad-dark text-white`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
