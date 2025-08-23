import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_Thai } from "next/font/google";
import "./globals.css";


const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeGear",
  description: "Time management for event in Engineering faculty",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifThai.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
