import {Noto_Serif_Thai } from "next/font/google";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section lang="th"
      >
        <TopBar />
        {children}
        <Footer />
    </section>
  );
}
