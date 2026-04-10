import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero.jpg";

const products = [
  {
    id: 1,
    name: "Hydrating Glow Serum",
    price: "₹1,299",
    category: "Serum",
    image: heroImg,
  },
  {
    id: 2,
    name: "Vitamin C Bright Cream",
    price: "₹1,499",
    category: "Cream",
    image: heroImg,
  },
  {
    id: 3,
    name: "Daily Repair Moisturizer",
    price: "₹999",
    category: "Cream",
    image: heroImg,
  },
  {
    id: 4,
    name: "Luxury Night Elixir",
    price: "₹1,899",
    category: "Serum",
    image: heroImg,
  },
  {
    id: 5,
    name: "SPF 50 Sunscreen",
    price: "₹799",
    category: "Sunscreen",
    image: heroImg,
  },
  {
    id: 6,
    name: "Under Eye Revival Gel",
    price: "₹1,099",
    category: "Gel",
    image: heroImg,
  },
];

const categories = ["All", "Serum", "Cream", "Sunscreen", "Gel"];

function BestSellers() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    return matchesCategory;
  });

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
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={heroImg}
          alt="Best Sellers"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-[#6f4d2f]/25"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,210,160,0.18),transparent_35%)]"></div>

        <motion.div
          className="relative z-10 px-6 text-center"
          initial="hidden"
          animate="show"
          variants={sectionStagger}
        >
          <motion.p
            variants={riseIn}
            className="mx-auto inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs tracking-[0.22em] text-white/90"
          >
            CURATED ESSENTIALS
          </motion.p>
          <motion.h1
            variants={riseIn}
            className="mt-6 text-4xl font-semibold tracking-wide text-white md:text-6xl"
          >
            Best Sellers
          </motion.h1>
          <motion.p
            variants={riseIn}
            className="mx-auto mt-4 max-w-xl text-sm text-white/85 md:text-lg"
          >
            Discover our most loved products crafted for radiant, healthy skin.
          </motion.p>
        </motion.div>
      </section>

      {/* PRODUCTS & FILTERS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16">
        <motion.div
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Top Picks</h2>
            <p className="mt-2 text-sm text-[#6e5947]">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                    activeCategory === category
                      ? "border-[#8a6038] bg-[#8a6038] text-white"
                      : "border-[#d3b48f] bg-transparent text-[#6e5947] hover:border-[#8a6038] hover:text-[#8a6038]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </motion.div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
            variants={sectionStagger}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  variants={riseIn}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden rounded-3xl border border-[#edd8bc] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"></div>
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#7a522f] shadow-sm backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="text-lg font-medium text-[#2b2018]">
                      {product.name}
                    </h3>

                    <p className="text-sm text-[#6e5947]">
                      Premium skincare formula
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-[#8a6038]">
                        {product.price}
                      </span>

                      <button className="rounded-full border border-[#d3b48f] px-4 py-2 text-sm text-[#8a6038] transition hover:bg-[#b67d4a] hover:text-white">
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-lg text-[#6e5947]">
              No products found matching your selected filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
              }}
              className="mt-4 rounded-full border border-[#8a6038] px-6 py-2 text-[#8a6038] hover:bg-[#8a6038] hover:text-white transition"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="px-6 pb-20 md:px-16">
        <motion.div
          className="mx-auto max-w-7xl rounded-4xl border border-[#e8c7a5] bg-linear-to-r from-[#2f2017] via-[#5a3d27] to-[#9a6f46] px-8 py-14 text-center text-white shadow-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold md:text-4xl">
            Elevate Your Skincare Routine
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Experience luxury skincare designed for visible results and lasting
            glow.
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-7 rounded-full bg-white px-8 py-3 font-medium text-[#3b2a1f] transition hover:bg-[#f7e7d1]"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </section>

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

export default BestSellers;