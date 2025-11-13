import {Noto_Serif_Thai } from "next/font/google";
import TopBar from "@/components/TopBar/TopBar";
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
    <section lang="th">
      <div className={`${notoSerifThai.className} antialiased`}>
        <TopBar />
        {/* เพิ่ม padding-top เผื่อพื้นที่ nav bar */}
        <div className="pt-20">
          {children}
        </div>
        <Footer />
      </div>
    </section>
  );
}
