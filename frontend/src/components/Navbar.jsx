import { Search, Heart, User, ShoppingBag } from "lucide-react";

function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-20 bg-white/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        
        {/* Logo */}
        <a
          href="#"
          className="text-2xl font-bold text-slate-900 tracking-tight"
        >
          Clinical Sanctuary
        </a>

        {/* Center Links */}
        <ul className="hidden md:flex items-center gap-10 text-lg font-semibold text-gray-600">
          <li>
            <a
              href="#"
              className="text-amber-700 border-b-2 border-amber-500 pb-1"
            >
              Shop
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-amber-700 transition">
              Categories
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-amber-700 transition">
              Best Sellers
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-amber-700 transition">
              New Arrivals
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-amber-700 transition">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-amber-700 transition">
              Contact
            </a>
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5 text-slate-900">
          <button className="hover:scale-110 transition">
            <Search size={24} />
          </button>
          <button className="hover:scale-110 transition">
            <Heart size={24} />
          </button>
          <button className="hover:scale-110 transition">
            <User size={24} />
          </button>

          {/* Cart with badge */}
          <button className="relative hover:scale-110 transition">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              2
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;