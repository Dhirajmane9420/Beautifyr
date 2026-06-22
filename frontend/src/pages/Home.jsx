import heroVideoDesktop from "../assets/hero1.mp4";
import heroVideoMobile from "../assets/hero2.mp4";
import heroVideoMobileAlt from "../assets/hero3.mp4";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomeLiveEditor from "../components/admin/HomeLiveEditor";
import {
  fetchPageOverrides,
  savePageOverride,
  uploadPageOverrideImage,
} from "../lib/siteOverridesApi";
import { fetchCatalogProducts } from "../lib/catalogApi";
import { useCart } from "../context/CartContext";
import serumimg from "../assets/HERO PAGE/ser.jpg";
import moisturizerimg from "../assets/HERO PAGE/mois.jpg";
import cleanserimg from "../assets/HERO PAGE/clean.jpg";
// Refined, ultra-smooth animation curves
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const trustStripItems = [
  "Dermatologist Approved",
  "Cruelty Free",
  "Clinically Tested",
  "Fragrance Free Options",
];

const applyOverridesToDom = (overrides) => {
  overrides.forEach((override) => {
    const key = (override.key || "").replace(/"/g, "\\\"");
    const editableNodes = document.querySelectorAll(`[data-edit-key="${key}"]`);

    editableNodes.forEach((node) => {
      if (override.kind === "image") {
        node.setAttribute("src", override.value);
        return;
      }

      node.textContent = override.value;
    });
  });
};

function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });
  const [activeMobileVideoIndex, setActiveMobileVideoIndex] = useState(0);
  const [overrides, setOverrides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setFeaturedLoading(true);
    setFeaturedError(false);

    const load = async () => {
      try {
        const allProducts = await fetchCatalogProducts();
        if (!cancelled) {
          const featured = allProducts.filter((p) => p.isHomeFeatured === true);
          setFeaturedProducts(featured);
          setFeaturedLoading(false);
        }
      } catch {
        if (!cancelled) {
          setFeaturedError(true);
          setFeaturedLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [retryKey]);

  const homepageCategories = useMemo(() => {
    const slots = [
      { category: "", imageUrl: "" },
      { category: "", imageUrl: "" },
      { category: "", imageUrl: "" },
      { category: "", imageUrl: "" },
    ];
    overrides.forEach((override) => {
      const match = override.key.match(/^home\.category_(\d)_(name|image)$/);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        const field = match[2] === "name" ? "category" : "imageUrl";
        if (index >= 0 && index < 4) {
          slots[index][field] = override.value;
        }
      }
    });
    return slots.filter((slot) => slot.category);
  }, [overrides]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    const maxScrollLeft = scrollWidth - clientWidth;
    const pct = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
    setScrollProgress(pct);

    const children = el.children;
    if (children.length > 0) {
      let index = 0;
      let minDiff = Infinity;
      for (let i = 0; i < children.length; i++) {
        const childLeft = children[i].offsetLeft - el.offsetLeft;
        const diff = Math.abs(childLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          index = i;
        }
      }
      setCurrentPage(index + 1);
    }
  };

  const scrollByAmount = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(".product-card")?.clientWidth || 300;
    const scrollAmount = cardWidth * 1.2;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const primarySize = product.sizeStock?.[0] || { label: "Standard", price: product.price, originalPrice: product.originalPrice || product.price, stock: product.stock };
    addToCart({
      id: product._id,
      productId: product._id,
      name: product.title,
      title: product.title,
      price: primarySize.price,
      originalPrice: primarySize.originalPrice,
      image: product.imageUrl,
      category: product.category,
      size: primarySize.label,
      sizeVariant: primarySize,
      quantity: 1,
    });
  };

  const mobileHeroVideos = [heroVideoMobile, heroVideoMobileAlt];

  const preloadCategoryRoutes = () => {
    void import("./Categories");
    void import("./CategoryViewAll");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => setIsDesktop(event.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadCategoryRoutes);
      return () => window.cancelIdleCallback?.(idleId);
    }
    const timeoutId = window.setTimeout(preloadCategoryRoutes, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isDesktop) return;

    const rotationId = window.setInterval(() => {
      setActiveMobileVideoIndex((current) => (current + 1) % mobileHeroVideos.length);
    }, 7000);

    return () => window.clearInterval(rotationId);
  }, [isDesktop, mobileHeroVideos.length]);

  useEffect(() => {
    let isMounted = true;

    const loadOverrides = async () => {
      try {
        const records = await fetchPageOverrides("home");
        if (!isMounted) return;
        setOverrides(records);
      } catch {
        if (!isMounted) return;
        setOverrides([]);
      }
    };

    void loadOverrides();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => applyOverridesToDom(overrides));
    return () => window.cancelAnimationFrame(frameId);
  }, [overrides]);

  const handleSaveOverride = async ({ key, kind, value }) => {
    const saved = await savePageOverride({
      page: "home",
      key,
      kind,
      value,
    });

    setOverrides((current) => {
      const next = current.filter((item) => item.key !== saved.key);
      return [saved, ...next];
    });
  };

  return (
    <div className="relative w-full bg-[#FCFAF8] font-sans selection:bg-[#E8DCCB] selection:text-[#2A2520]">
      <Navbar />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full min-h-[100svh] overflow-hidden">
        {isDesktop ? (
          <video
            className="absolute inset-0 h-full w-full object-cover scale-105"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={heroVideoDesktop} type="video/mp4" />
          </video>
        ) : (
          mobileHeroVideos.map((videoSrc, index) => (
            <video
              key={videoSrc}
              className={`absolute inset-0 h-full w-full object-cover scale-105 transition-opacity duration-1000 ${index === activeMobileVideoIndex ? "opacity-100" : "opacity-0"
                }`}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ))
        )}

        {/* Sophisticated Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#FCFAF8]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-8 pt-24 text-center sm:px-6 sm:pt-28 md:pt-32"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-2 shadow-2xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8DCCB] animate-pulse"></span>
            <span data-edit-key="hero.badge" data-edit-kind="text" data-edit-label="Hero Badge" className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/90 font-medium">
              Clinical Grade
            </span>
          </motion.div>

          <motion.h1 data-edit-key="hero.title" data-edit-kind="text" data-edit-label="Hero Title" variants={fadeUp} className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight text-white leading-[1.1]">
            Elevate Your <br />
            <span className="font-serif italic text-[#E8DCCB] pr-4">Natural Radiance</span>
          </motion.h1>

          <motion.p data-edit-key="hero.subtitle" data-edit-kind="text" data-edit-label="Hero Subtitle" variants={fadeUp} className="mt-5 max-w-xl text-sm sm:text-base md:text-lg font-light text-white/80 leading-relaxed">
            Formulations crafted at the intersection of clinical science and pure botanical luxury. Reveal your healthiest barrier yet.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
            <button data-edit-key="hero.ctaPrimary" data-edit-kind="text" data-edit-label="Hero Primary CTA" className="w-full px-8 py-4 bg-white text-[#2A2520] rounded-full text-sm font-medium tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-transform duration-300 sm:w-auto">
              Shop Collection
            </button>
            <button data-edit-key="hero.ctaSecondary" data-edit-kind="text" data-edit-label="Hero Secondary CTA" className="w-full px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-medium tracking-wide hover:bg-white/20 transition-all duration-300 sm:w-auto">
              Discover The Science
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* INFINITE SCROLL MARQUEE (Premium touch) */}
      <div className="bg-[#2A2520] py-4 overflow-hidden border-y border-[#3A3530]">
        <div className="flex min-w-max whitespace-nowrap text-[#D2C5B5] text-xs sm:text-sm tracking-[0.2em] uppercase font-light animate-[trustMarquee_20s_linear_infinite]">
          {[...trustStripItems, ...trustStripItems].map((item, index) => (
            <span key={`${item}-${index}`} className="mr-12 inline-flex items-center gap-12">
              <span data-edit-key={`trustStrip.item${(index % trustStripItems.length) + 1}`} data-edit-kind="text" data-edit-label={`Trust Strip Item ${(index % trustStripItems.length) + 1}`}>{item}</span>
              <span aria-hidden="true">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS & CATEGORIES SETUP */}
      <section className="relative overflow-hidden bg-[#F7F4F0] px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24">
        {/* Soft abstract background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#EAE2D8] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F1EBE4] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          {/* Products Horizontal Slider Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#C8A97E] mb-2">
                  Featured Collection
                </span>
                <h2 className="text-3xl font-light tracking-tight text-[#2A2520] font-serif">
                  The Cult <span className="italic text-[#8B7E72]">Favorites</span>
                </h2>
              </div>
            </div>

            {featuredLoading ? (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skel-${i}`} className="shrink-0 w-[280px] sm:w-[320px] bg-white/40 border border-white/60 p-4 rounded-3xl animate-pulse">
                    <div className="aspect-square rounded-2xl bg-[#E8E0D6]" />
                    <div className="mt-5 space-y-3">
                      <div className="h-5 w-2/3 bg-[#E8E0D6] rounded" />
                      <div className="h-4 w-1/3 bg-[#E8E0D6] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white/30 backdrop-blur border border-white/40 rounded-3xl p-6">
                <p className="text-[#7A6E62] text-sm mb-4">
                  Couldn't load products — please check your connection.
                </p>
                <button
                  onClick={() => setRetryKey((k) => k + 1)}
                  className="px-5 py-2.5 bg-[#2A2520] text-white rounded-full text-xs font-semibold tracking-wide hover:scale-105 transition-transform"
                >
                  Retry
                </button>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-16 bg-white/30 backdrop-blur border border-white/40 rounded-3xl">
                <p className="text-[#7A6E62] text-sm">No featured products marked yet.</p>
              </div>
            ) : (
              <div className="relative w-full">
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 px-2"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {featuredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="product-card snap-start shrink-0 w-[280px] sm:w-[320px] bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <Link
                        to={`/product/${product.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "")}`}
                        state={{ product }}
                        className="flex-1 flex flex-col"
                      >
                        <div className="relative aspect-square overflow-hidden bg-stone-50">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#2A2520] border border-stone-100">
                            {product.category}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="text-base font-semibold text-stone-800 line-clamp-1 group-hover:text-[#C8A97E] transition-colors">{product.title}</h3>
                            <p className="text-xs text-stone-400 font-light line-clamp-2 mt-1">
                              {product.description || "Premium skincare formulation."}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <span className="text-lg font-bold text-stone-900">
                                ₹{Number(product.price).toLocaleString("en-IN")}
                              </span>
                              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                <span className="text-xs text-stone-400 line-through ml-2">
                                  ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className="h-10 w-10 rounded-xl bg-stone-50 hover:bg-[#C8A97E] hover:text-white transition flex items-center justify-center text-stone-600 shadow-sm border border-stone-100 group/btn"
                              title="Add to bag"
                            >
                              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Slider Controls & Progress Tracker */}
                <div className="mt-8 flex items-center justify-between gap-4 px-2">
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-mono tracking-wider">
                    <span className="font-semibold text-stone-800">{String(currentPage).padStart(2, '0')}</span>
                    <span className="text-stone-300">/</span>
                    <span>{String(featuredProducts.length).padStart(2, '0')}</span>
                  </div>

                  <div className="flex-1 h-[2px] bg-stone-200/60 rounded-full relative overflow-hidden hidden sm:block mx-8 max-w-[200px]">
                    <div
                      className="absolute top-0 bottom-0 w-8 bg-[#C8A97E] rounded-full transition-all duration-100"
                      style={{ left: `${scrollProgress * (100 - 16)}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => scrollByAmount("left")}
                      className="h-9 w-9 rounded-full bg-white hover:bg-stone-50 border border-stone-200 shadow-sm flex items-center justify-center text-stone-600 transition"
                      title="Scroll Left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => scrollByAmount("right")}
                      className="h-9 w-9 rounded-full bg-white hover:bg-stone-50 border border-stone-200 shadow-sm flex items-center justify-center text-stone-600 transition"
                      title="Scroll Right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t border-[#eadfc8]/30 my-6" />

          {/* Categories Grid Setup */}
          <div className="space-y-8 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2A2520] font-serif">
                Elevate Your <span className="italic text-[#8B7E72]">Everyday</span>
              </h2>
              <p className="text-stone-500 font-light text-sm sm:text-base leading-relaxed">
                Click any of our major categories to browse targeted, clinical skincare formulations.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {homepageCategories.map((slot, index) => {
                const defaultImages = [serumimg, moisturizerimg, cleanserimg, serumimg];
                const fallbackImg = defaultImages[index % defaultImages.length];
                const cardImg = slot.imageUrl || fallbackImg;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      navigate(`/categories`, { state: { selectedCategory: slot.category } });
                    }}
                    className="group relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-500 bg-stone-100"
                  >
                    <img
                      src={cardImg}
                      alt={slot.category}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 text-center">
                      <h3 className="text-lg sm:text-xl font-medium text-white tracking-wide group-hover:translate-y-[-4px] transition-transform duration-500 font-serif">
                        {slot.category}
                      </h3>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#E8DCCB] font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        Shop Collection
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN ABOUT WITH PARALLAX FEEL */}
      <section className="px-5 py-10 sm:px-6 sm:py-12 md:px-12 md:py-14 lg:px-24">
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col overflow-hidden rounded-[1.75rem] bg-[#2A2520] text-[#FCFAF8] sm:rounded-[2.5rem] lg:flex-row"
        >
          <div className="flex flex-col justify-center p-7 sm:p-10 md:p-14 lg:w-1/2 lg:p-20">
            <motion.p data-edit-key="about.badge" data-edit-kind="text" data-edit-label="About Badge" variants={fadeUp} className="text-[#AFA192] text-xs tracking-[0.3em] uppercase mb-6">The Ethos</motion.p>
            <motion.h2 data-edit-key="about.title" data-edit-kind="text" data-edit-label="About Title" variants={fadeUp} className="text-4xl md:text-5xl font-light tracking-tight leading-[1.1] mb-8">
              Science that respects <br /><span className="font-serif italic text-[#D2C5B5]">your biology.</span>
            </motion.h2>
            <motion.p data-edit-key="about.description" data-edit-kind="text" data-edit-label="About Description" variants={fadeUp} className="text-white/70 font-light leading-relaxed mb-10 max-w-md">
              We engineer formulations that mimic your skin's natural structure. No harsh stripping, no empty fillers—just precise, biocompatible ingredients that restore optimal health.
            </motion.p>
            <motion.div variants={fadeUp}>
              <button data-edit-key="about.cta" data-edit-kind="text" data-edit-label="About CTA" className="border-b border-white/30 pb-1 text-sm uppercase tracking-widest hover:border-white transition-colors duration-300">
                Read Our Story
              </button>
            </motion.div>
          </div>
          <motion.div variants={fadeUp} className="relative min-h-[260px] sm:min-h-[360px] lg:min-h-full lg:w-1/2">
            <img data-edit-key="about.image" data-edit-kind="image" data-edit-label="About Image" src={serumimg} alt="Lab/Texture" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        </motion.div>
      </section>

      {/* 5. MINIMALIST TRUST ICONS */}
      <motion.section
        variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="border-y border-[#EAE2D8] bg-white/40 px-5 py-8 backdrop-blur-lg sm:px-6 sm:py-10 md:px-12"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 text-center sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:divide-x md:divide-[#EAE2D8]/50">
          {[
            { title: "Clinical Actives", desc: "Dermatologist formulated" },
            { title: "Clean Chemistry", desc: "No harmful additives" },
            { title: "Sustainable", desc: "Recyclable glass packaging" },
            { title: "Guaranteed", desc: "30-day efficacy return" }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center justify-center px-4">
              <h3 data-edit-key={`trustBlocks.${i + 1}.title`} data-edit-kind="text" data-edit-label={`Trust Block ${i + 1} Title`} className="text-sm font-medium tracking-wide text-[#2A2520] uppercase">{item.title}</h3>
              <p data-edit-key={`trustBlocks.${i + 1}.desc`} data-edit-kind="text" data-edit-label={`Trust Block ${i + 1} Description`} className="mt-2 text-xs font-light text-[#8B7E72]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 6. GLASS PROMO BANNER */}
      <motion.section
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
        className="px-5 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 md:px-12 md:pb-18 md:pt-14 lg:px-24"
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-[#E8DCCB] p-6 shadow-sm sm:rounded-[2.5rem] sm:p-10 md:p-16 lg:p-20">
          {/* Subtle noise/texture overlay if desired */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center md:gap-12">
            <div className="max-w-xl">
              <p data-edit-key="promo.badge" data-edit-kind="text" data-edit-label="Promo Badge" className="text-[10px] tracking-[0.3em] uppercase text-[#2A2520]/60 font-medium mb-4">Limited Allocation</p>
              <h2 data-edit-key="promo.title" data-edit-kind="text" data-edit-label="Promo Title" className="text-4xl md:text-5xl font-light text-[#2A2520] tracking-tight mb-6">
                The <span className="font-serif italic">Restoration</span> Protocol
              </h2>
              <p data-edit-key="promo.description" data-edit-kind="text" data-edit-label="Promo Description" className="mb-8 text-base font-light leading-relaxed text-[#5C534A] sm:text-lg">
                A highly concentrated 3-step regimen designed to repair the epidermal barrier in 14 days. Exclusively bundled.
              </p>
              <button data-edit-key="promo.cta" data-edit-kind="text" data-edit-label="Promo CTA" className="px-8 py-4 bg-[#2A2520] text-white rounded-full text-sm font-medium tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Unlock The Bundle — $145
              </button>
            </div>
            <div className="relative mx-auto w-full max-w-[260px] flex-shrink-0 sm:max-w-[320px] md:mx-0 md:w-auto">
              <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-white/30 shadow-2xl backdrop-blur-3xl sm:h-64 sm:w-64 md:h-80 md:w-80">
                <img data-edit-key="promo.image" data-edit-kind="image" data-edit-label="Promo Image" src={moisturizerimg} alt="Bundle" className="w-[120%] h-[120%] object-cover opacity-90 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />

      <HomeLiveEditor
        isAdmin={isAdmin}
        onSaveOverride={handleSaveOverride}
        onUploadImage={uploadPageOverrideImage}
      />


      <style>{`
        @keyframes trustMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;