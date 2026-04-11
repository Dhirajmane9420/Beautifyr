import React from "react";
import aboutImg from "../assets/hero.jpg"; // replace later with actual image
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const sectionReveal = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

function About() {
  return (
    <div className="min-h-screen bg-[#fff7ee]">
      <Navbar />

      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="px-6 md:px-16 pt-24 md:pt-28 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 premium-fade-up">
            <p className="inline-flex rounded-full border border-[#e2bf98] bg-[#fff1df] px-4 py-2 text-xs tracking-[0.2em] text-[#9a6f46] mb-5 uppercase premium-fade-up">
              The Core of Our Science
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#7a522f] leading-tight mb-6 premium-fade-up premium-delay-1">
              Our Story
            </h1>

            <p className="text-[#7f6249] text-lg leading-relaxed max-w-xl premium-fade-up premium-delay-2">
              Where science meets skincare. We blend innovation with nature to
              create products that nourish, protect, and transform your skin.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#e8c9a8] bg-white/80 px-5 py-4 premium-card">
                <p className="text-3xl font-semibold text-[#8a6038]">15k+</p>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#9a6f46]">
                  5-Star Reviews
                </p>
              </div>
              <div className="rounded-2xl border border-[#e8c9a8] bg-white/80 px-5 py-4 premium-card">
                <p className="text-3xl font-semibold text-[#8a6038]">98%</p>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#9a6f46]">
                  Retention Rate
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-[#a66f3f] px-7 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#935f34] premium-btn">
                Explore Collection
              </button>
              <span className="text-sm text-[#8b6f54]">
                Dermatologist-developed, barrier-first routines
              </span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-6 w-full premium-fade-up premium-delay-1">
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_55px_-30px_rgba(123,82,47,0.45)] border border-[#e7c8a7] premium-card">
              <img
                src={aboutImg}
                alt="Skincare Products"
                className="w-full h-[340px] sm:h-[460px] object-cover premium-image"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2616]/45 via-transparent to-transparent"></div>

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-white/60">
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#9a6f46]">
                  Founder Note
                </p>
                <p className="mt-2 text-[#6d4728] text-sm sm:text-base leading-relaxed">
                  "Healthy skin should feel achievable, not overwhelming. Our formulas are made to support real life routines."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      {/* FEATURES SECTION */}
<motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="px-6 md:px-16 pb-16 md:pb-24">
  <div className="max-w-7xl mx-auto">
    <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <p className="text-xs tracking-[0.22em] uppercase text-[#9a6f46]">What We Stand For</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-[#7a522f]">Our Core Principles</h2>
      </div>
      <p className="text-[#87684d] max-w-xl">
        Every formula is engineered for performance and comfort, so your skin can thrive consistently.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 md:gap-10">
    
    {/* Card 1 */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#efd4b7] hover:shadow-md transition duration-300 premium-card">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ffe8d0] text-[#8a6038] mb-6">
        âœ“
      </div>

      <h3 className="text-xl font-semibold text-[#7a522f] mb-3">
        Quality
      </h3>

      <p className="text-[#87684d] leading-relaxed text-sm">
        Every batch is triple-tested for purity and potency. We don't settle for
        industry standardsâ€”we set our own clinical benchmarks.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#efd4b7] hover:shadow-md transition duration-300 premium-card">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ffe8d0] text-[#8a6038] mb-6">
        ðŸ‘
      </div>

      <h3 className="text-xl font-semibold text-[#7a522f] mb-3">
        Transparency
      </h3>

      <p className="text-[#87684d] leading-relaxed text-sm">
        We list every concentration. No secret blends. No hidden fillers. Just
        pure, science-backed clarity on what goes onto your skin.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#efd4b7] hover:shadow-md transition duration-300 premium-card">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ffe8d0] text-[#8a6038] mb-6">
        ðŸŒ¿
      </div>

      <h3 className="text-xl font-semibold text-[#7a522f] mb-3">
        Skin-First
      </h3>

      <p className="text-[#87684d] leading-relaxed text-sm">
        We solve for the biological cause, not just the aesthetic symptom.
        Healthy skin is beautiful skin, by design.
      </p>
    </div>

    </div>
  </div>
</motion.section>
{/* STATS SECTION */}
<motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="px-6 md:px-16 pb-14 md:pb-20">
  <div className="max-w-7xl mx-auto rounded-[2rem] bg-gradient-to-r from-[#a66f3f] via-[#9b6638] to-[#8f5e34] px-6 md:px-10 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-[0_18px_45px_-28px_rgba(123,82,47,0.6)]">
    
    {/* Stat 1 */}
    <div>
      <h3 className="text-3xl md:text-4xl font-semibold text-white">
        500k+
      </h3>
      <p className="text-sm tracking-widest text-white/70 mt-2 uppercase">
        Happy Patients
      </p>
    </div>

    {/* Stat 2 */}
    <div>
      <h3 className="text-3xl md:text-4xl font-semibold text-white">
        120+
      </h3>
      <p className="text-sm tracking-widest text-white/70 mt-2 uppercase">
        Unique Formulas
      </p>
    </div>

    {/* Stat 3 */}
    <div>
      <h3 className="text-3xl md:text-4xl font-semibold text-white">
        98%
      </h3>
      <p className="text-sm tracking-widest text-white/70 mt-2 uppercase">
        Retention Rate
      </p>
    </div>

    {/* Stat 4 */}
    <div>
      <h3 className="text-3xl md:text-4xl font-semibold text-white">
        15k
      </h3>
      <p className="text-sm tracking-widest text-white/70 mt-2 uppercase">
        5-Star Reviews
      </p>
    </div>

  </div>
</motion.section>

      {/* NEWSLETTER + FOOTER SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] pt-12 lg:pt-20">
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
                <span>ðŸŒ</span>
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
            <p>Â© 2024 Clinical Sanctuary. Dermatologist Recommended.</p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default About;
