import type { Metadata } from "next";
import "./globals.css";
import {Noto_Serif_Thai } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
import ToastMount from "@/components/ToastMount";




const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
        className={`${notoSerifThai.variable} antialiased`}
      >
        <AuthGuard>
          {children}
           <ToastMount />
        </AuthGuard>
      </body>
    </html>
  );
}
