import Image from "next/image";

export default function TopBar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-md px-6 sm:px-10 py-4 flex justify-between items-center top-0 left-0 z-50">
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="LifeGear Logo" width={50} height={50} className="object-contain" />
        <span className="font-bold text-xl sm:text-2xl text-black">LifeGear</span>
      </div>
      <ul className="hidden sm:flex space-x-6 text-black font-semibold">
        <li><a href="#" className="hover:text-blue-600">หน้าหลัก</a></li>
        <li><a href="#" className="hover:text-blue-600">เกี่ยวกับเรา</a></li>
        <li><a href="#" className="hover:text-blue-600">ติดต่อ</a></li>
      </ul>
      <button className="sm:hidden text-black font-bold">☰</button>
    </nav>
  );
}
