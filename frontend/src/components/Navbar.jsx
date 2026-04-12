import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { searchCatalog } from "../lib/searchIndex";

const trendingSearches = [
  "Vitamin C Serum",
  "Sunscreen SPF 50",
  "Moisturizer",
  "Niacinamide",
  "Cleansers",
  "Best Sellers",
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { totals } = useCart();

  const trimmedQuery = searchQuery.trim();
  const showTrending = isSearchOpen && trimmedQuery.length === 0;
  const liveSuggestions = trimmedQuery.length
    ? searchCatalog(trimmedQuery).slice(0, 6)
    : [];
  const keyboardSuggestions = showTrending
    ? trendingSearches.map((term, index) => ({ id: `trend-${index}`, title: term, type: "Trending" }))
    : liveSuggestions;

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery, isSearchOpen]);

  const runSearch = (queryValue) => {
    const query = queryValue.trim();
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (!isSearchOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setIsSearchOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (!keyboardSuggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => (current + 1) % keyboardSuggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => (current <= 0 ? keyboardSuggestions.length - 1 : current - 1));
      return;
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      runSearch(keyboardSuggestions[highlightedIndex].title);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    runSearch(searchQuery);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Categories", path: "/categories" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return undefined;

    const shouldLock = isMenuOpen;
    const previousOverflow = document.body.style.overflow;
    if (shouldLock) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

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

          <button
            className="group relative rounded-full p-2 text-[#1b2330] transition duration-300 hover:bg-[#f3e5cc] hover:shadow-md premium-float"
            onClick={() => setIsSearchOpen((current) => !current)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" />
          </button>

          <button
            className="group relative rounded-full p-2 text-[#1b2330] transition duration-300 hover:bg-[#f3e5cc] hover:shadow-md premium-float"
            onClick={() => navigate("/wishlist")}
            aria-label="Open wishlist"
          >
            <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" />
          </button>

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
          <button
            className="relative rounded-full p-2 text-[#1b2330] transition duration-300 hover:bg-[#f3e5cc] hover:shadow-md premium-float"
            onClick={() => navigate("/cart")}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
            {totals.itemCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#8a6038] px-1 text-[10px] font-bold text-white shadow">
                {totals.itemCount > 99 ? "99+" : totals.itemCount}
              </span>
            ) : null}
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

      {isSearchOpen ? (
        <div className="border-t border-[#eadfc8] bg-[#fffaf2] px-6 pb-4 pt-3 lg:px-10">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-7xl flex-col gap-2">
            <div className="flex w-full items-center gap-2">
              <div className="flex flex-1 items-center rounded-xl border border-[#d7c2a4] bg-white px-3 py-2 shadow-sm">
                <Search className="h-4 w-4 text-[#8a6038]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search categories, items, and more"
                  className="ml-2 w-full bg-transparent text-sm text-[#2b2018] outline-none placeholder:text-[#927d67]"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#8a6038] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7a522f]"
              >
                Search
              </button>
            </div>

            {showTrending ? (
              <div className="rounded-xl border border-[#e7d6be] bg-white p-3 shadow-sm">
                <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-[#8a6038] uppercase">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onMouseEnter={() => {
                        const index = keyboardSuggestions.findIndex((item) => item.title === term);
                        setHighlightedIndex(index);
                      }}
                      onClick={() => {
                        setSearchQuery(term);
                        runSearch(term);
                      }}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        highlightedIndex >= 0 && keyboardSuggestions[highlightedIndex]?.title === term
                          ? "border-[#8a6038] bg-[#f3e6d3] text-[#7a522f]"
                          : "border-[#d7c2a4] bg-[#fff8ec] text-[#7a522f] hover:bg-[#f3e6d3]"
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : liveSuggestions.length > 0 ? (
              <div className="rounded-xl border border-[#e7d6be] bg-white p-2 shadow-sm">
                {liveSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => {
                      const index = keyboardSuggestions.findIndex((entry) => entry.id === item.id);
                      setHighlightedIndex(index);
                    }}
                    onClick={() => {
                      setSearchQuery(item.title);
                      runSearch(item.title);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      highlightedIndex >= 0 && keyboardSuggestions[highlightedIndex]?.id === item.id
                        ? "bg-[#f9efe2]"
                        : "hover:bg-[#f9efe2]"
                    }`}
                  >
                    <span className="text-sm text-[#2b2018]">{item.title}</span>
                    <span className="rounded-full bg-[#f3e6d3] px-2 py-0.5 text-[10px] font-semibold text-[#8a6038]">{item.type}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </div>
      ) : null}

      {/* Mobile Menu (Animated) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto overscroll-contain bg-[#fffaf2] backdrop-blur-lg px-6 pb-6 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="mb-4 mt-4 flex flex-col gap-2">
            <div className="flex flex-1 items-center rounded-xl border border-[#d7c2a4] bg-white px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 text-[#8a6038]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search..."
                className="ml-2 w-full bg-transparent text-sm text-[#2b2018] outline-none placeholder:text-[#927d67]"
              />
            </div>
            <button
              type="submit"
              className="self-end rounded-lg bg-[#8a6038] px-3 py-2 text-xs font-semibold text-white"
            >
              Go
            </button>

            {trimmedQuery.length === 0 ? (
              <div className="rounded-xl border border-[#e7d6be] bg-white p-3 shadow-sm">
                <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-[#8a6038] uppercase">Trending</p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onMouseEnter={() => {
                        const index = keyboardSuggestions.findIndex((item) => item.title === term);
                        setHighlightedIndex(index);
                      }}
                      onClick={() => {
                        setSearchQuery(term);
                        runSearch(term);
                      }}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                        highlightedIndex >= 0 && keyboardSuggestions[highlightedIndex]?.title === term
                          ? "border-[#8a6038] bg-[#f3e6d3] text-[#7a522f]"
                          : "border-[#d7c2a4] bg-[#fff8ec] text-[#7a522f]"
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : liveSuggestions.length > 0 ? (
              <div className="rounded-xl border border-[#e7d6be] bg-white p-2 shadow-sm">
                {liveSuggestions.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => {
                      const index = keyboardSuggestions.findIndex((entry) => entry.id === item.id);
                      setHighlightedIndex(index);
                    }}
                    onClick={() => {
                      setSearchQuery(item.title);
                      runSearch(item.title);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      highlightedIndex >= 0 && keyboardSuggestions[highlightedIndex]?.id === item.id
                        ? "bg-[#f9efe2]"
                        : "hover:bg-[#f9efe2]"
                    }`}
                  >
                    <span className="text-xs text-[#2b2018]">{item.title}</span>
                    <span className="rounded-full bg-[#f3e6d3] px-2 py-0.5 text-[10px] font-semibold text-[#8a6038]">{item.type}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>

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