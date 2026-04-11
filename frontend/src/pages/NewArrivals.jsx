import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero.jpg";

// --- Data ---
const arrivals = [
  {
    id: 1,
    name: "Dew Barrier Essence",
    price: "$42.00",
    tag: "JUST DROPPED",
    note: "Rice peptides + ceramide support",
  },
  {
    id: 2,
    name: "Cloud Clean Gel",
    price: "$28.00",
    tag: "NEW",
    note: "Low-foam cleanser for daily reset",
  },
  {
    id: 3,
    name: "Peptide Lift Mist",
    price: "$34.00",
    tag: "TRENDING",
    note: "Fine hydration veil with bounce",
  },
  {
    id: 4,
    name: "Luminous Night Oil",
    price: "$52.00",
    tag: "LIMITED",
    note: "Squalane-rich overnight nourishment",
  },
  {
    id: 5,
    name: "Mineral Veil SPF 45",
    price: "$31.00",
    tag: "NEW",
    note: "Weightless UV shield, no cast",
  },
  {
    id: 6,
    name: "Calm Rescue Cream",
    price: "$39.00",
    tag: "JUST DROPPED",
    note: "Barrier-first comfort for redness",
  },
];

// --- Animation Variants ---
const fadeUpHero = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

// --- Sub-components ---
const ProductCard = ({ item }) => {
  return (
    <motion.article
      variants={cardVariants}
      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-black/[0.04] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(127,91,61,0.15)] transition-all duration-500 ease-out hover:-translate-y-1.5"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4ece3]">
        <img
          src={heroImg}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
        
        {/* Floating Tag */}
        <div className="absolute top-5 left-5">
          <span className="backdrop-blur-md bg-white/80 border border-white/40 text-[#5a402a] text-[10px] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full shadow-sm">
            {item.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-medium tracking-tight text-[#1a1410]">
          {item.name}
        </h3>
        <p className="mt-2 text-sm text-[#705845] leading-relaxed flex-grow">
          {item.note}
        </p>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-black/[0.04]">
          <span className="text-lg font-medium text-[#1a1410]">
            {item.price}
          </span>
          
          <button className="relative overflow-hidden rounded-full px-6 py-2 text-sm font-medium text-[#7f5b3d] bg-[#f9f2e8] transition-all duration-300 group-hover:bg-[#1a1410] group-hover:text-[#f9f2e8]">
            <span className="relative z-10">Add to Bag</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

// --- Main Page Component ---
export default function NewArrivals() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1410] font-sans selection:bg-[#7f5b3d] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative mt-16 flex min-h-[70vh] items-center justify-center overflow-hidden px-6 pt-24 pb-20 md:mt-20 md:px-16 md:pt-28">
        <div className="absolute inset-4 rounded-[2rem] overflow-hidden md:inset-8">
          <img
            src={heroImg}
            alt="New arrivals skincare collection"
            className="absolute inset-0 h-full w-full object-cover scale-105"
          />
          {/* Refined Luxury Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f1308]/60 to-transparent" />
        </div>

        <motion.div
          variants={fadeUpHero}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-3xl text-center flex flex-col items-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-[11px] font-medium tracking-[0.25em] text-white/90 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            The Latest Collection
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white">
            New <span className="italic font-serif">Arrivals</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg font-light">
            Fresh formulas have landed. Explore the newest additions crafted to
            hydrate, refine, and protect every skin rhythm.
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="mx-auto max-w-[90rem] px-6 py-20 md:px-16 md:py-32">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.06] pb-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
              Fresh In Store
            </h2>
            <p className="mt-3 text-[#705845] text-lg font-light">
              Curated essentials to elevate your daily ritual.
            </p>
          </div>
          <button className="group flex items-center gap-3 pb-1 text-sm font-medium tracking-wide text-[#1a1410] uppercase transition-all hover:text-[#7f5b3d]">
            <span className="border-b border-transparent transition-colors group-hover:border-[#7f5b3d]">
              Explore Everything
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Animated Grid */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
        >
          {arrivals.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </motion.div>
      </section>

      {/* NEWSLETTER + FOOTER SECTION */}
      <section className="bg-[#fff7ee] pt-12 lg:pt-20">
        {/* Newsletter Top */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#7a522f]">
            Join the DermaEthos Community
          </h2>

          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-2xl text-gray-500 leading-relaxed px-2">
            Get expert skin tips, early access to launches, and 15% off your first order.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-[300px] md:w-[500px] rounded-2xl bg-white px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg text-gray-700 outline-none border border-gray-100 shadow-sm"
            />
            <button className="w-full sm:w-auto bg-[#a66f3f] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold tracking-wide hover:bg-[#935f34] transition">
              SUBSCRIBE
            </button>
          </div>

          <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-gray-400">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </div>

        {/* Footer Main */}
        <div className="mt-16 sm:mt-20 bg-[#fff7ee] px-6 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#7a522f]">Clinical Sanctuary</h3>
              <p className="mt-4 sm:mt-6 text-gray-500 text-base sm:text-lg leading-relaxed max-w-sm">
                Dermatologist-formulated skincare that respects your biology and enhances your natural beauty.
              </p>

              <div className="mt-6 sm:mt-8 flex items-center gap-5 text-2xl sm:text-3xl text-[#8a6038]">
                <span>🌐</span>
                <span>@</span>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-xl sm:text-2xl font-semibold text-[#7a522f]">Products</h4>
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-gray-500 text-base sm:text-lg">
                <li>Face Wash</li>
                <li>Serums</li>
                <li>Moisturizers</li>
                <li>Sunscreens</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xl sm:text-2xl font-semibold text-[#7a522f]">Support</h4>
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-gray-500 text-base sm:text-lg">
                <li>Contact Support</li>
                <li>Shipping & Returns</li>
                <li>FAQs</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            {/* Newsletter Small */}
            <div>
              <h4 className="text-xl sm:text-2xl font-semibold text-[#7a522f]">Newsletter</h4>
              <p className="mt-4 sm:mt-6 text-gray-500 text-base sm:text-lg leading-relaxed">
                The latest in skin science, delivered to your inbox.
              </p>

              <input
                type="email"
                placeholder="Email"
                className="mt-6 sm:mt-8 w-full rounded-2xl bg-white px-5 py-3.5 sm:py-4 text-base sm:text-lg text-gray-700 outline-none border border-gray-100 shadow-sm"
              />
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-xs sm:text-sm text-center md:text-left">
            <p>© 2024 Clinical Sanctuary. Dermatologist Recommended.</p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}