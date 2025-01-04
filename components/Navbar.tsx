import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white px-[5%]">
      <div className="container flex h-20 items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold">InstaTrack</span>
        </div>
        <nav className="hidden md:flex items-center justify-center space-x-8 flex-1 max-w-2xl mx-auto">
          <Link
            href="#features"
            className="text-lg font-semibold hover:text-purple-500 transition-all duration-200 hover:scale-105 capitalize"
          >
            Features
          </Link>
          <Link
            href="#team"
            className="text-lg font-semibold hover:text-purple-500 transition-all duration-200 hover:scale-105 capitalize"
          >
            Team
          </Link>
          <Link
            href="#contact"
            className="text-lg font-semibold hover:text-purple-500 transition-all duration-200 hover:scale-105 capitalize"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="#get-started"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
