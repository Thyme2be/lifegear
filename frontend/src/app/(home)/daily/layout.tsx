import { Metadata } from "next";
import {Noto_Serif_Thai } from "next/font/google";

const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata: Metadata = {
    title: "LifeGear | Daily",
    description: "Time management for event in Engineering faculty",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className={`${notoSerifThai.className} antialiased`}
        >
            {children}
        </section>
    );
}