import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Categories", path: "/categories" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "#" },
  ];

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-xl bg-[#fffaf2]/95 shadow-md border-b border-[#eadfc8]"
          : "bg-[#fef7ea]/95 shadow-sm border-b border-[#eadfc8]"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold tracking-tight text-[#1b2330] transition duration-300 hover:text-[#8a6038] premium-fade-up">
          Clinical Sanctuary
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#283548]">
          {navLinks.map((link) => (
            <li key={link.label} className="group relative cursor-pointer">
              {link.path.startsWith("/") ? (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `premium-link ${isActive ? "text-[#b88a44] premium-link-active" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              ) : (
                <a href={link.path} className="premium-link group-hover:text-[#b88a44]">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-3">
          
          {[Search, Heart].map((Icon, i) => (
            <button
              key={i}
              className="group relative rounded-full p-2 text-[#1b2330] transition duration-300 hover:bg-[#f3e5cc] hover:shadow-md premium-float"
            >
              <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" />
            </button>
          ))}

          {/* User Icon */}
          <button
            className="group relative rounded-full p-2 text-[#1b2330] transition duration-300 hover:bg-[#f3e5cc] hover:shadow-md premium-float"
            onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
          >
            <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" />
            {isAuthenticated ? (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#a66f3f] text-[9px] font-semibold text-white">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            ) : null}
          </button>

          {/* Cart */}
          <button className="relative rounded-full p-2 text-[#1b2330] transition duration-300 hover:bg-[#f3e5cc] hover:shadow-md premium-float">
            <ShoppingBag className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow">
              2
            </span>
          </button>

          {/* Mobile Toggle */}
          <button
            className="ml-2 rounded-md p-1 text-[#1b2330] transition hover:bg-[#f3e5cc] md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Animated) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#fffaf2] backdrop-blur-lg px-6 pb-6 shadow-lg">
          <ul className="flex flex-col gap-4 pt-4 text-lg font-medium text-[#283548]">
            {navLinks.map((link, index) => (
              <li
                key={link.label}
                className="transform transition duration-300 hover:translate-x-2 hover:text-[#b88a44]"
                style={{
                  transitionDelay: `${index * 70}ms`,
                }}
              >
                {link.path.startsWith("/") ? (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => (isActive ? "text-[#b88a44]" : "")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ) : (
                  <a href={link.path} onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;