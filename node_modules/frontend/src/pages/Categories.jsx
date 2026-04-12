import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero.jpg";
import { useCart } from "../context/CartContext";
import { toProductSlug } from "../lib/productUtils";

const CATEGORY_PILLS = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Sunscreens",
  "Toners",
  "Exfoliators",
  "Face Masks",
  "Eye Care",
  "Lip Care",
  "Acne Care",
  "Brightening",
  "Travel Minis",
  "Kits and Combos",
];

const CATALOG = {
  Cleansers: [
    { title: "Sunveil Daily Sunscreen Gel", price: 920, inStock: true, category: "Sunscreens" },
    { title: "Matte Guard SPF Fluid", price: 1050, inStock: true, category: "Sunscreens" },
    { title: "Pore Reset Tonic Cleanser", price: 980, inStock: true, category: "Toners" },
    { title: "Balancing AHA Toner", price: 1120, inStock: true, category: "Toners" },
    { title: "Foam Polish Exfoliant", price: 999, inStock: true, category: "Exfoliators" },
    { title: "Charcoal Enzyme Cleanser", price: 1100, inStock: false, category: "Exfoliators" },
    { title: "Night Calm Cleansing Balm", price: 1390, inStock: true, category: "Face Masks" },
    { title: "Clay Purify Mask Cleanser", price: 1290, inStock: true, category: "Face Masks" },
    { title: "Milk Cleanser", price: 799, inStock: true, category: "Eye Care" },
    { title: "Under-Eye De-Puff Wash", price: 880, inStock: true, category: "Eye Care" },
    { title: "Soft Lip Prep Cleanser", price: 740, inStock: true, category: "Lip Care" },
    { title: "Lip Line Smoothing Wash", price: 690, inStock: false, category: "Lip Care" },
    { title: "Gel Cleanser", price: 875, inStock: true, category: "Acne Care" },
    { title: "Clarifying BHA Face Wash", price: 950, inStock: true, category: "Acne Care" },
    { title: "Vitamin Foam Bright Wash", price: 870, inStock: true, category: "Brightening" },
    { title: "Glow Boost Rice Cleanser", price: 1010, inStock: true, category: "Brightening" },
    { title: "Micellar Water Mini", price: 650, inStock: true, category: "Travel Minis" },
    { title: "Pocket Fresh Cleanser", price: 590, inStock: true, category: "Travel Minis" },
    { title: "Reset Duo Cleansing Kit", price: 1490, inStock: true, category: "Kits and Combos" },
    { title: "Glow Start Combo Cleanse", price: 1590, inStock: true, category: "Kits and Combos" },
  ],
  Moisturizers: [
    { title: "Oil-Free SPF Lotion", price: 799, inStock: true, category: "Sunscreens" },
    { title: "Ultra Shield SPF 50 Cream", price: 1190, inStock: true, category: "Sunscreens" },
    { title: "Hydra Tone Moisture Milk", price: 980, inStock: true, category: "Toners" },
    { title: "Hyaluronic Serum Cream", price: 1100, inStock: false, category: "Toners" },
    { title: "Daily Lactic Soft Peel", price: 1320, inStock: true, category: "Exfoliators" },
    { title: "Renewal Overnight Peel Gel", price: 1410, inStock: true, category: "Exfoliators" },
    { title: "Intensive Moisture Mask", price: 2100, inStock: true, category: "Face Masks" },
    { title: "Hydra Soothe Sleep Mask", price: 1580, inStock: true, category: "Face Masks" },
    { title: "Under-Eye Comfort Cream", price: 1490, inStock: true, category: "Eye Care" },
    { title: "Retinol Eye Lift Balm", price: 1690, inStock: true, category: "Eye Care" },
    { title: "Overnight Lip Sleeping Balm", price: 760, inStock: true, category: "Lip Care" },
    { title: "Peptide Lip Comfort Mask", price: 910, inStock: true, category: "Lip Care" },
    { title: "Barrier Blemish Gel", price: 980, inStock: true, category: "Acne Care" },
    { title: "Calm Acne Repair Lotion", price: 1170, inStock: true, category: "Acne Care" },
    { title: "Lightweight Hydrating Gel", price: 899, inStock: true, category: "Brightening" },
    { title: "C-Glow Day Moisturizer", price: 1240, inStock: true, category: "Brightening" },
    { title: "Travel Shield Moisture Mini", price: 540, inStock: true, category: "Travel Minis" },
    { title: "Hydrating Face Mist Mini", price: 625, inStock: true, category: "Travel Minis" },
    { title: "Glow Ritual Duo", price: 1690, inStock: true, category: "Kits and Combos" },
    { title: "Barrier Rescue Starter Set", price: 1890, inStock: true, category: "Kits and Combos" },
  ],
};

const ALL_PRODUCTS = Object.values(CATALOG).flat();

const CATEGORY_INFO = {
  Cleansers: {
    image: heroImg,
    description: "Deep-clean formulas that remove buildup while keeping the skin barrier balanced.",
  },
  Moisturizers: {
    image: heroImg,
    description: "Hydration-first creams and gels built for comfort, repair, and long-lasting glow.",
  },
  Serums: {
    image: heroImg,
    description: "High-performance actives for brightening, texture support, and visible correction.",
  },
};

const sectionStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCatalog = {
    Cleansers: CATALOG.Cleansers,
    Moisturizers: CATALOG.Moisturizers,
  };

  const selectedCategoryProducts = useMemo(() => {
    if (!selectedCategory) return [];

    const allCatalogProducts = [...CATALOG.Cleansers, ...CATALOG.Moisturizers];

    if (selectedCategory === "Cleansers") {
      return CATALOG.Cleansers;
    }

    if (selectedCategory === "Moisturizers") {
      return CATALOG.Moisturizers;
    }

    if (selectedCategory === "Serums") {
      return allCatalogProducts.filter((product) =>
        ["Brightening", "Acne Care", "Toners"].includes(product.category)
      );
    }

    return allCatalogProducts.filter(
      (product) => product.category === selectedCategory
    );
  }, [selectedCategory]);

  const serumProducts = useMemo(() => {
    return [...filteredCatalog.Cleansers, ...filteredCatalog.Moisturizers].filter((product) =>
      ["Brightening", "Acne Care", "Toners"].includes(product.category)
    );
  }, [filteredCatalog.Cleansers, filteredCatalog.Moisturizers]);

  const handleViewAll = (title) => {
    const normalizedTitle = title.replace(/\s+Products$/, "");

    let allProductsForSection = [];

    if (normalizedTitle === "Cleansers") {
      allProductsForSection = CATALOG.Cleansers;
    } else if (normalizedTitle === "Moisturizers") {
      allProductsForSection = CATALOG.Moisturizers;
    } else if (normalizedTitle === "Serums") {
      allProductsForSection = [...CATALOG.Cleansers, ...CATALOG.Moisturizers].filter((product) =>
        ["Brightening", "Acne Care", "Toners"].includes(product.category)
      );
    } else {
      allProductsForSection = [...CATALOG.Cleansers, ...CATALOG.Moisturizers].filter(
        (product) => product.category === normalizedTitle
      );
    }

    navigate("/categories/view-all", {
      state: {
        title: normalizedTitle,
        products: allProductsForSection,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018] overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <motion.section
        className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto min-h-[750px] px-6 lg:px-12 items-center pt-24"
        initial="hidden"
        animate="show"
        variants={sectionStagger}
      >

        {/* LEFT SIDE (IMAGES) */}
        <motion.div variants={riseIn} className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">

          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffbda7]/20 to-transparent blur-3xl rounded-full"></div>

          {/* Main Product */}
          <div className="relative z-10 -translate-x-10 translate-y-6">
            <img
              src={heroImg}
              className="w-64 h-80 object-cover rounded-xl shadow-2xl"
              alt="product"
            />
          </div>

          {/* Floating Product 2 */}
          <div className="absolute right-10 top-10 z-20">
            <img
              src={heroImg}
              className="w-44 h-60 rounded-xl shadow-xl border-4 border-white"
              alt="product"
            />
          </div>

          {/* Floating Product 3 */}
          <div className="absolute bottom-10 right-20 z-30">
            <img
              src={heroImg}
              className="w-36 h-36 rounded-full shadow-lg border-2 border-gray-200"
              alt="product"
            />
          </div>
        </motion.div>

        {/* RIGHT SIDE (TEXT) */}
        <motion.div variants={riseIn} className="w-full lg:w-1/2 flex flex-col items-start lg:pl-20 py-10">

          {/* Tag */}
          <motion.span variants={riseIn} className="px-4 py-1 text-xs tracking-widest uppercase border border-[#d3b48f] rounded-full text-[#6e5947] mb-6 bg-white/70">
            Curated Categories
          </motion.span>

          {/* Heading */}
          <motion.h1 variants={riseIn} className="text-5xl lg:text-7xl font-light leading-tight mb-6">
            Shop by <br />
            <span className="font-bold italic">Category</span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={riseIn} className="text-[#6e5947] max-w-md mb-10">
            Explore our skincare essentials crafted for radiant, healthy skin.
            Every formula is a ritual of self-care designed for results you can feel.
          </motion.p>

          {/* Arrows */}
          <motion.div variants={riseIn} className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-[#d3b48f] text-[#8a6038] flex items-center justify-center hover:bg-[#8a6038] hover:text-white transition">
              &#60;
            </button>
            <button className="w-12 h-12 rounded-full border border-[#d3b48f] text-[#8a6038] flex items-center justify-center hover:bg-[#8a6038] hover:text-white transition">
              &#62;
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-10">

        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {selectedCategory && (
          <Section
            title={selectedCategory}
            products={selectedCategoryProducts}
            onViewAll={handleViewAll}
          />
        )}

        {!selectedCategory && (
          <>
            <Section title="Cleansers" products={filteredCatalog.Cleansers} onViewAll={handleViewAll} />
            <Section title="Serums" products={serumProducts} onViewAll={handleViewAll} />
            <Section title="Moisturizers" products={filteredCatalog.Moisturizers} onViewAll={handleViewAll} />
          </>
        )}

      </div>

      {/* FOOTER */}
      <div className="mt-16 bg-[#fff7ee] px-6 py-12 sm:mt-20 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-[#7a522f] sm:text-3xl">
              Clinical Sanctuary
            </h3>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-gray-500 sm:mt-6 sm:text-lg">
              Dermatologist-formulated skincare that respects your biology and
              enhances your natural beauty.
            </p>

            <div className="mt-6 flex items-center gap-5 text-2xl text-[#8a6038] sm:mt-8 sm:text-3xl">
              <span>🌐</span>
              <span>@</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xl font-semibold text-[#7a522f] sm:text-2xl">
              Products
            </h4>
            <ul className="mt-4 space-y-3 text-base text-gray-500 sm:mt-6 sm:space-y-4 sm:text-lg">
              <li>Face Wash</li>
              <li>Serums</li>
              <li>Moisturizers</li>
              <li>Sunscreens</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-semibold text-[#7a522f] sm:text-2xl">
              Support
            </h4>
            <ul className="mt-4 space-y-3 text-base text-gray-500 sm:mt-6 sm:space-y-4 sm:text-lg">
              <li>Contact Support</li>
              <li>Shipping & Returns</li>
              <li>FAQs</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter Small */}
          <div>
            <h4 className="text-xl font-semibold text-[#7a522f] sm:text-2xl">
              Newsletter
            </h4>
            <p className="mt-4 text-base leading-relaxed text-gray-500 sm:mt-6 sm:text-lg">
              The latest in skin science, delivered to your inbox.
            </p>

            <input
              type="email"
              placeholder="Email"
              className="mt-6 w-full rounded-2xl border border-gray-100 bg-white px-5 py-3.5 text-base text-gray-700 shadow-sm outline-none sm:mt-8 sm:py-4 sm:text-lg"
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 text-center text-xs text-gray-400 sm:mt-16 sm:text-sm md:flex-row md:text-left">
          <p>© 2024 Clinical Sanctuary. Dermatologist Recommended.</p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:justify-end">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SECTION WITH ARROWS */
function Section({ title, products, onViewAll }) {
  const scrollRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrowState = () => {
    const row = scrollRef.current;
    if (!row) return;

    setCanScrollLeft(row.scrollLeft > 4);
    setCanScrollRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
  };

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return;

    row.scrollLeft = 0;
    updateArrowState();

    const handleResize = () => updateArrowState();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [products]);

  const scroll = (dir) => {
    const row = scrollRef.current;
    if (!row) return;

    const distance = Math.max(220, Math.floor(row.clientWidth * 0.65));
    row.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" });
    window.setTimeout(updateArrowState, 240);
  };

  const isEmpty = products.length === 0;

  const info = CATEGORY_INFO[title] || {
    image: heroImg,
    description: `Explore high-performance ${title.toLowerCase()} crafted for visible, healthy results.`,
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-bold text-[#2b2018]">{title}</h2>
          <p className="mt-2 text-[#6e5947]">High-performance formulas for healthy, glowing skin.</p>
        </div>
        <button
          onClick={() => onViewAll?.(title)}
          className="rounded-full border border-[#d3b48f] bg-white px-4 py-2 text-xs font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div
          className="lg:col-span-4 rounded-2xl overflow-hidden bg-white border border-[#edd8bc]"
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -6 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="overflow-hidden">
            <motion.img
              src={info.image}
              alt={title}
              className="h-96 w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-semibold text-[#2b2018]">{title}</h3>
            <p className="mt-2 text-lg text-[#6e5947]">{info.description}</p>
          </div>
        </motion.div>

        <div className="relative lg:col-span-8">

      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#edd8bc] text-[#8a6038] shadow-md w-10 h-10 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ❮
      </button>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#edd8bc] text-[#8a6038] shadow-md w-10 h-10 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ❯
      </button>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-[#d8cec4] bg-[#f6f1eb] px-5 py-10 text-center text-sm text-[#6f6258]">
          No products match the current filters.
        </div>
      ) : (
      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={updateArrowState}
          className="flex w-full gap-6 overflow-x-auto scroll-smooth px-8 pb-1"
        >
          {products.map((product, i) => (
            <ProductCard
              key={`${title}-${product.title}-${i}`}
              title={product.title}
              price={`₹${product.price}`}
              image={heroImg}
              inStock={product.inStock}
              category={product.category}
            />
          ))}
        </div>
      </div>
      )}
        </div>
      </div>
    </section>
  );
}

/* PRODUCT CARD */
function ProductCard({ title, price, image, inStock, category }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const numericPrice = Number(String(price).replace(/[^0-9]/g, "")) || 0;
  const discountPct = Math.max(4, (numericPrice % 37));

  return (
    <div className="min-w-65 bg-white border border-[#edd8bc] rounded-xl p-4 hover:shadow-xl transition">
      <button
        type="button"
        onClick={() =>
          navigate(`/product/${toProductSlug(title)}`, {
            state: { product: { name: title, price: numericPrice, originalPrice: Math.round(numericPrice * 1.3), image, category } },
          })
        }
        className="w-full text-left"
      >
      <div className="bg-white rounded-md overflow-hidden relative">
        <span className="absolute right-3 top-3 rounded-full bg-[#b67d4a] px-3 py-1 text-[11px] font-semibold text-white">
          {discountPct}% OFF
        </span>
        <img src={image} className="w-full h-64 object-cover" />
      </div>

      <p className={`mt-3 text-xs font-semibold ${inStock ? "text-green-700" : "text-red-600"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </p>
      <h3 className="text-sm font-bold mt-3 text-[#2b2018]">{title}</h3>
      <p className="font-bold text-[#8a6038]">{price} <span className="text-[#8f8f8f] line-through">₹{Math.round(numericPrice * 1.3)}</span></p>
      </button>

      <button
        onClick={() =>
          addToCart({
            id: `cat-${title}`,
            name: title,
            price: numericPrice,
            originalPrice: Math.round(numericPrice * 1.3),
            image,
          })
        }
        className="mt-4 w-full bg-[#8a6038] hover:bg-[#b67d4a] text-white py-2 rounded-lg text-sm transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

/* CATEGORY PILLS */
function CategoryPills({ selectedCategory, onSelectCategory }) {

  return (
    <section className="mt-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6e5947]">
          Shop by Category
        </h3>
        <button
          onClick={() => onSelectCategory(null)}
          className="text-xs font-semibold text-[#8a6038] hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {CATEGORY_PILLS.map((item) => (
          <button
            key={item}
            onClick={() => onSelectCategory((current) => (current === item ? null : item))}
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase border transition ${
              selectedCategory === item
                ? "bg-[#8a6038] text-white scale-105 border-[#8a6038]"
                : "bg-white border-[#d3b48f] text-[#6e5947] hover:bg-[#8a6038] hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

/* SMALL CARD */
function SmallCard({ title, price }) {
  return (
    <div className="bg-white border border-[#edd8bc] p-4 rounded-xl flex justify-between items-center">
      <div>
        <h4 className="text-sm font-bold text-[#2b2018]">{title}</h4>
        <p className="text-[#8a6038]">{price}</p>
      </div>
      <span className="text-[#8a6038]">+</span>
    </div>
  );
}