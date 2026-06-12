import heroImg from "../assets/hero.jpg";
import heroVideoDesktop from "../assets/hero1.mp4";
import heroVideoMobile from "../assets/hero2.mp4";
import heroVideoMobileAlt from "../assets/hero3.mp4";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomeLiveEditor from "../components/admin/HomeLiveEditor";
import {
  fetchPageOverrides,
  savePageOverride,
  uploadPageOverrideImage,
} from "../lib/siteOverridesApi";
import {
  fetchHomeFeatured,
} from "../lib/homeFeaturedApi";
import serumimg from "../assets/HERO PAGE/serums.jpg";
import moisturizerimg from "../assets/HERO PAGE/moisturizer.jpg";
import cleanserimg from "../assets/HERO PAGE/sunscreens.jpg";
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
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });
  const [activeMobileVideoIndex, setActiveMobileVideoIndex] = useState(0);
  const [overrides, setOverrides] = useState([]);
  const [
  featuredProducts,
  setFeaturedProducts
] = useState([]);
useEffect(() => {
  const load =
    async () => {
      try {
        const products =
          await fetchHomeFeatured();

        setFeaturedProducts(
          products
        );
      } catch {
        //
      }
    };

  load();
}, []);

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
              className={`absolute inset-0 h-full w-full object-cover scale-105 transition-opacity duration-1000 ${
                index === activeMobileVideoIndex ? "opacity-100" : "opacity-0"
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

      {/* 2. EDITORIAL CATEGORY GRID */}
      <motion.section 
        variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
        className="px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24 lg:py-28"
      >
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-6">
          <motion.div variants={fadeUp} className="max-w-xl">
            <h2 data-edit-key="categories.title" data-edit-kind="text" data-edit-label="Categories Title" className="text-3xl md:text-5xl font-light tracking-tight text-[#2A2520]">
              Curated <span className="font-serif italic text-[#8B7E72]">Essentials</span>
            </h2>
            <p data-edit-key="categories.subtitle" data-edit-kind="text" data-edit-label="Categories Subtitle" className="mt-4 text-[#7A6E62] font-light leading-relaxed">
              Targeted solutions designed to integrate seamlessly into your daily ritual.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              to="/categories"
              onMouseEnter={preloadCategoryRoutes}
              onFocus={preloadCategoryRoutes}
              onTouchStart={preloadCategoryRoutes}
              className="group flex items-center gap-2 text-sm uppercase tracking-widest text-[#2A2520] hover:text-[#8B7E72] transition-colors pb-1 border-b border-[#2A2520]/20"
            >
              Explore All <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>

        <div className="grid h-auto grid-cols-1 gap-5 md:h-[560px] md:grid-cols-12 md:gap-6">
          {/* Main Large Card */}
          <motion.div variants={fadeUp} className="group relative h-[320px] overflow-hidden rounded-[1.5rem] md:col-span-7 md:h-full md:rounded-[2rem]">
            <img data-edit-key="categories.mainCard.image" data-edit-kind="image" data-edit-label="Main Category Image" src={serumimg} alt="Serums" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
              <div className="max-w-xs transform rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-2xl transition-all duration-500 group-hover:translate-y-0 sm:max-w-sm sm:translate-y-4 sm:p-6">
                <p data-edit-key="categories.mainCard.badge" data-edit-kind="text" data-edit-label="Main Category Badge" className="text-[10px] tracking-[0.2em] text-white/80 uppercase mb-2">Bestseller</p>
                <h3 data-edit-key="categories.mainCard.title" data-edit-kind="text" data-edit-label="Main Category Title" className="text-3xl font-light text-white mb-2">Active Serums</h3>
                <Link data-edit-key="categories.mainCard.cta" data-edit-kind="text" data-edit-label="Main Category CTA" to="/categories" className="text-sm text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all">Shop Category</Link>
              </div>
            </div>
          </motion.div>

          {/* Side Cards Stack */}
          <div className="flex h-full flex-col gap-5 md:col-span-5 md:gap-6">
            <motion.div variants={fadeUp} className="group relative min-h-[220px] flex-1 overflow-hidden rounded-[1.5rem] md:min-h-[250px] md:rounded-[2rem]">
              <img data-edit-key="categories.sideTop.image" data-edit-kind="image" data-edit-label="Top Side Category Image" src={moisturizerimg} alt="Moisturizers" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6">
                <h3 data-edit-key="categories.sideTop.title" data-edit-kind="text" data-edit-label="Top Side Category Title" className="text-2xl font-light text-white">Moisturizers</h3>
                <p data-edit-key="categories.sideTop.subtitle" data-edit-kind="text" data-edit-label="Top Side Category Subtitle" className="text-white/80 text-sm font-light mt-1">Barrier protection</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="group relative min-h-[220px] flex-1 overflow-hidden rounded-[1.5rem] md:min-h-[250px] md:rounded-[2rem]">
              <img data-edit-key="categories.sideBottom.image" data-edit-kind="image" data-edit-label="Bottom Side Category Image" src={cleanserimg} alt="Cleansers" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6">
                <h3 data-edit-key="categories.sideBottom.title" data-edit-kind="text" data-edit-label="Bottom Side Category Title" className="text-2xl font-light text-white">Cleansers</h3>
                <p data-edit-key="categories.sideBottom.subtitle" data-edit-kind="text" data-edit-label="Bottom Side Category Subtitle" className="text-white/80 text-sm font-light mt-1">Gentle purification</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 3. GLASSMORPHISM FEATURED PRODUCTS */}
      <motion.section 
        variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
        className="relative overflow-hidden bg-[#F7F4F0] px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24"
      >
        {/* Soft abstract background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#EAE2D8] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F1EBE4] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center mb-16">
          <motion.h2 data-edit-key="favorites.title" data-edit-kind="text" data-edit-label="Favorites Title" variants={fadeUp} className="text-3xl md:text-5xl font-light tracking-tight text-[#2A2520]">
            The Cult <span className="font-serif italic text-[#8B7E72]">Favorites</span>
          </motion.h2>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
  {featuredProducts.map((product) => (
    <motion.div
      key={product._id}
      variants={fadeUp}
      className="group cursor-pointer"
    >
      <Link
        to={`/product/${product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`}
        state={{ product }}
      >
        <div className="relative rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:bg-white/60">
          <div className="relative h-[250px] overflow-hidden rounded-2xl sm:h-[300px]">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
            />

            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-[#2A2520]">
              {product.category}
            </div>
          </div>

          <div className="mt-6 px-2 pb-2">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-[#2A2520]">
                {product.title}
              </h3>

              <span className="text-sm text-[#8B7E72]">
                ₹{product.price}
              </span>
            </div>

            <p className="text-sm font-light text-[#7A6E62] line-clamp-2">
              {product.description ||
                "Premium skincare product"}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  ))}
</div>
      </motion.section>

      {/* 4. SPLIT-SCREEN ABOUT WITH PARALLAX FEEL */}
      <section className="px-5 py-10 sm:px-6 sm:py-12 md:px-12 md:py-14 lg:px-24">
        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col overflow-hidden rounded-[1.75rem] bg-[#2A2520] text-[#FCFAF8] sm:rounded-[2.5rem] lg:flex-row"
        >
          <div className="flex flex-col justify-center p-7 sm:p-10 md:p-14 lg:w-1/2 lg:p-20">
            <motion.p data-edit-key="about.badge" data-edit-kind="text" data-edit-label="About Badge" variants={fadeUp} className="text-[#AFA192] text-xs tracking-[0.3em] uppercase mb-6">The Ethos</motion.p>
            <motion.h2 data-edit-key="about.title" data-edit-kind="text" data-edit-label="About Title" variants={fadeUp} className="text-4xl md:text-5xl font-light tracking-tight leading-[1.1] mb-8">
              Science that respects <br/><span className="font-serif italic text-[#D2C5B5]">your biology.</span>
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