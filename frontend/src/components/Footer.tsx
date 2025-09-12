import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { SiLine, SiGmail } from "react-icons/si";

export default function Footer() {
  const base =
    "inline-flex items-center justify-center rounded-full p-2 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition";

  return (
    <footer className="bg-[#730217] w-full backdrop-blur-md text-white border-t px-6 sm:px-16 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        
        {/* Social Icons */}
        <div className="flex gap-3">
          <Link
            href="https://www.facebook.com/ENGR.THAMMASAT"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className={base}
          >
            <FaFacebook className="h-8 w-8 text-white" />
          </Link>
          <Link
            href="https://line.me/R/ti/p/@797bwksv"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LINE"
            className={base}
          >
            <SiLine className="h-8 w-8 text-white" />
          </Link>
          <Link
            href="mailto:lifegear.tu@gmail.com"
            aria-label="Email"
            className={base}
          >
            <SiGmail className="h-8 w-8 text-white" />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm sm:text-base font-semibold">
          Copyright ©{new Date().getFullYear()} Designed by{" "}
          <span className="font-bold">CodeHodeCodeTehCodeUntaraiCodeyaaow</span>
        </p>
      </div>
    </footer>
  );
}
