export default function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur-md text-black text-center py-4 border-t border-gray-200">
      <p className="text-sm sm:text-base font-semibold">
        © {new Date().getFullYear()} LifeGear. All rights reserved.
      </p>
    </footer>
  );
}
