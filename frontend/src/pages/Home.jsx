import heroImg from "../assets/hero.jpg";
import heroVideoDesktop from "../assets/hero1.mp4";
import heroVideoMobile from "../assets/hero2.mp4";
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

function Home() {
  return (
    <div className="relative w-full h-screen">
      <Navbar />

      {/* Background Video (Desktop) */}
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={heroVideoDesktop} type="video/mp4" />
      </video>

      {/* Background Video (Mobile) */}
      <video
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={heroVideoMobile} type="video/mp4" />
      </video>

      {/* Premium dark-soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-white/10"></div>

      {/* Soft luxury glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,215,180,0.12),transparent_30%)]"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl pt-28 sm:pt-32 lg:pt-20">
            {/* Premium Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-2 shadow-lg premium-fade-up">
              <span className="h-2 w-2 rounded-full bg-amber-300"></span>
              <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/90 font-medium">
                Dermatologist Approved
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white premium-fade-up premium-delay-1">
              Elevate Your
              <span className="block text-amber-200 italic font-light">
                Natural Radiance
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-7 text-white/80 premium-fade-up premium-delay-2">
              Discover clinically crafted skincare designed to nourish, restore,
              and reveal your healthiest glow with premium ingredients your skin
              will truly love.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row premium-fade-up premium-delay-3">
              <button className="group premium-btn bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-xl transition-all duration-300 hover:bg-amber-100 sm:text-base rounded-full">
                Shop Collection
              </button>

              <button className="premium-btn rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:text-base">
                Discover More
              </button>
            </div>

            {/* Small Luxury Stats */}
            <div className="mt-12 flex flex-wrap gap-8 text-white/85">
              <div>
                <p className="text-2xl font-semibold sm:text-3xl">10k+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                  Happy Clients
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold sm:text-3xl">98%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                  Visible Results
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold sm:text-3xl">Clinically</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                  Tested Formula
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHOP BY CATEGORY SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#7a522f]">Shop by Category</h2>
              <div className="mt-3 h-1 w-16 bg-pink-200 rounded-full"></div>
            </div>

            <button className="group inline-flex items-center gap-2 text-[#9a6f46] font-semibold tracking-wide border-b border-[#e8c7a5] hover:text-[#7a522f] transition">
              VIEW ALL
              <span className="text-lg transition-transform group-hover:translate-x-1">â†’</span>
            </button>
          </div>

          {/* Grid */}
          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Left Big Card */}
            <div className="relative overflow-hidden rounded-3xl group h-[350px] md:h-[450px] lg:h-[580px] premium-card">
              <img
                src={heroImg}
                alt="Serums"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/15"></div>
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white">
                <h3 className="text-4xl sm:text-5xl font-bold">Serums</h3>
                <p className="mt-2 text-base sm:text-lg text-white/90">
                  Potent elixirs for deep repair
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Moisturizers */}
              <div className="relative overflow-hidden rounded-3xl group h-[200px] sm:h-[280px] premium-card">
                <img
                  src={heroImg}
                  alt="Moisturizers"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/15"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Moisturizers</h3>
                </div>
              </div>

              {/* Face Wash */}
              <div className="relative overflow-hidden rounded-3xl group h-[200px] sm:h-[280px] premium-card">
                <img
                  src={heroImg}
                  alt="Face Wash"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold">Face Wash</h3>
                </div>
              </div>

              {/* Sunscreens */}
              <div className="relative overflow-hidden rounded-3xl group h-[200px] sm:h-[280px] col-span-1 sm:col-span-2 premium-card">
                <img
                  src={heroImg}
                  alt="Sunscreens"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                  <h3 className="text-2xl sm:text-3xl font-bold">Sunscreens</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FEATURED SELECTIONS SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-gradient-to-b from-[#fffaf5] to-[#fdf6ee] px-6 py-16 lg:py-24">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-4xl lg:text-5xl font-semibold text-[#3d2b1f] tracking-tight">
        Featured Essentials
      </h2>
      <p className="mt-4 text-gray-500 text-lg">
        Elevated skincare crafted for clarity, hydration, and glow.
      </p>
    </div>

    {/* Products */}
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Product Card */}
      {[1,2,3,4].map((item) => (
        <div
          key={item}
          className="group relative rounded-[28px] overflow-hidden bg-white/70 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-xl transition duration-500"
        >

          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={heroImg}
              alt="product"
              className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-700"
            />

            {/* Floating Badge */}
            <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 text-xs font-medium rounded-full text-gray-700">
              Bestseller
            </span>

            {/* Wishlist */}
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-lg text-[#7a522f] shadow">
              â™¥
            </button>
          </div>

          {/* Content */}
          <div className="p-5">

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Skincare</span>
              <span className="text-yellow-500">â˜… 4.9</span>
            </div>

            <h3 className="mt-2 text-xl font-semibold text-[#2f2f2f]">
              Vitamin Glow Serum
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Lightweight formula for radiant and even skin tone.
            </p>

            {/* Bottom */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xl font-semibold text-[#7a522f]">
                $48
              </span>

              <button className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition duration-300 bg-[#7a522f] text-white text-sm px-4 py-2 rounded-full">
                Add
              </button>
            </div>

          </div>

        </div>
      ))}

    </div>

    {/* View All */}
    <div className="mt-16 text-center">
      <button className="px-8 py-3 rounded-full border border-[#e0c3a3] text-[#7a522f] font-medium hover:bg-[#7a522f] hover:text-white transition">
        Explore Collection
      </button>
    </div>

  </div>
</motion.section>

      {/* ABOUT SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-5 relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] min-h-[380px] lg:min-h-[560px] group">
            <img
              src={heroImg}
              alt="About Clinical Sanctuary"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent"></div>

            <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-white/90 backdrop-blur-md p-5 sm:p-6">
              <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#8e6641]">
                Since 2018
              </p>
              <p className="mt-2 text-[#5b3a20] text-lg sm:text-xl font-semibold leading-snug">
                Science-led skincare designed for everyday ritual, not quick fixes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#fff1df] via-[#fff7ee] to-[#fce9d2] p-6 sm:p-8 lg:p-10 border border-[#f0d4b5]">
            <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#a5764b]">
              About Us
            </p>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#6d4728] leading-tight">
              Where Clinical Precision Meets Skin Comfort
            </h2>

            <p className="mt-5 text-base sm:text-lg text-[#7f6249] leading-8 max-w-3xl">
              Clinical Sanctuary began with one goal: make dermatologist-level care
              feel effortless at home. Every formula is crafted with evidence-backed
              actives, balanced textures, and barrier-first philosophy so your skin
              improves over time without compromise.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl bg-white/80 p-5 border border-[#efd4b7]">
                <h3 className="text-xl font-semibold text-[#7a522f]">Our Promise</h3>
                <p className="mt-2 text-sm sm:text-base text-[#87684d] leading-7">
                  Transparent ingredients, responsible sourcing, and formulas tested
                  for real-world sensitivity.
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 p-5 border border-[#efd4b7]">
                <h3 className="text-xl font-semibold text-[#7a522f]">Our Method</h3>
                <p className="mt-2 text-sm sm:text-base text-[#87684d] leading-7">
                  Cleanse, treat, protect. We simplify routines into practical steps
                  you can sustain daily.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <button className="rounded-full bg-[#a66f3f] px-7 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-[#915f34]">
                Meet The Story
              </button>
              <p className="text-sm sm:text-base text-[#8b6f54]">
                Trusted by 10,000+ glow-focused customers worldwide.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TRUST FEATURES SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffe8d0] flex items-center justify-center text-2xl sm:text-3xl text-[#8a6038] shadow-sm">
              âœ”
            </div>
            <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-semibold text-[#7a522f]">
              Authentic Products
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xs">
              Direct sourcing from world-class laboratories.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffe8d0] flex items-center justify-center text-2xl sm:text-3xl text-[#8a6038] shadow-sm">
              ðŸ§ª
            </div>
            <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-semibold text-[#7a522f]">
              Safe & Tested
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xs">
              Every formula passes rigorous clinical trials.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffe8d0] flex items-center justify-center text-2xl sm:text-3xl text-[#8a6038] shadow-sm">
              ðŸ”’
            </div>
            <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-semibold text-[#7a522f]">
              Secure Checkout
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xs">
              Your privacy and security are our priority.
            </p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffe8d0] flex items-center justify-center text-2xl sm:text-3xl text-[#8a6038] shadow-sm">
              ðŸ’¼
            </div>
            <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-semibold text-[#7a522f]">
              Easy Returns
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xs">
              Hassle-free 30-day return policy.
            </p>
          </div>

        </div>
      </motion.section>

      {/* TARGETED SOLUTIONS SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto premium-fade-up">
          {/* Heading */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-[#7a522f]">
            Targeted Solutions
          </h2>

          {/* Cards */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Acne */}
            <div className="relative h-[250px] sm:h-[300px] lg:h-[340px] overflow-hidden rounded-3xl group">
              <img
                src={heroImg}
                alt="Acne"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl sm:text-4xl font-semibold tracking-widest">
                  ACNE
                </h3>
              </div>
            </div>

            {/* Dry Skin */}
            <div className="relative h-[250px] sm:h-[300px] lg:h-[340px] overflow-hidden rounded-3xl group">
              <img
                src={heroImg}
                alt="Dry Skin"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl sm:text-4xl font-semibold tracking-widest">
                  DRY SKIN
                </h3>
              </div>
            </div>

            {/* Sensitive */}
            <div className="relative h-[250px] sm:h-[300px] lg:h-[340px] overflow-hidden rounded-3xl group">
              <img
                src={heroImg}
                alt="Sensitive"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl sm:text-4xl font-semibold tracking-widest">
                  SENSITIVE
                </h3>
              </div>
            </div>

            {/* Dullness */}
            <div className="relative h-[250px] sm:h-[300px] lg:h-[340px] overflow-hidden rounded-3xl group">
              <img
                src={heroImg}
                alt="Dullness"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl sm:text-4xl font-semibold tracking-widest">
                  DULLNESS
                </h3>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-[#7a522f]">
            Voices of the Sanctuary
          </h2>

          {/* Testimonial Cards */}
          <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border-l-4 border-[#a66f3f]">
              <div className="text-yellow-400 text-2xl sm:text-3xl tracking-wide">â˜…â˜…â˜…â˜…â˜…</div>
              <p className="mt-6 text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                "The Radiant Vitamin C Serum changed my life. My dark spots faded in
                just 3 weeks. Truly clinical results at home."
              </p>
              <h4 className="mt-8 text-[#8a6038] text-xl lg:text-2xl font-semibold">
                â€” Elena M.
              </h4>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border-l-4 border-[#a66f3f]">
              <div className="text-yellow-400 text-2xl sm:text-3xl tracking-wide">â˜…â˜…â˜…â˜…â˜…</div>
              <p className="mt-6 text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                "I have extremely sensitive skin and everything used to burn. The
                Gentle Cleanser is so soothing. I finally feel safe."
              </p>
              <h4 className="mt-8 text-[#8a6038] text-xl lg:text-2xl font-semibold">
                â€” Marcus T.
              </h4>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border-l-4 border-[#a66f3f]">
              <div className="text-yellow-400 text-2xl sm:text-3xl tracking-wide">â˜…â˜…â˜…â˜…â˜…</div>
              <p className="mt-6 text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                "Fast delivery and the packaging is beautiful. You can tell they care
                about the luxury experience."
              </p>
              <h4 className="mt-8 text-[#8a6038] text-xl lg:text-2xl font-semibold">
                â€” Sophia R.
              </h4>
            </div>

          </div>
        </div>
      </motion.section>

      {/* PROMO BANNER SECTION */}
      <motion.section variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#a66f3f] px-6 py-10 sm:py-16 md:px-14 lg:px-16 premium-card">
            
            {/* Soft background overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%),radial-gradient(circle_at_bottom_left,_white,_transparent_35%)]"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-center lg:text-left">
              
              {/* Left Content */}
              <div className="text-white flex flex-col items-center lg:items-start">
                <p className="text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.35em] font-semibold text-white/70 uppercase">
                  Limited Time Exclusive
                </p>

                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  The Glow Kit Bundle
                </h2>

                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-2xl text-white/70 max-w-2xl leading-relaxed">
                  Complete 4-step routine for dull skin. Save $35 today.
                </p>

                <button className="mt-8 sm:mt-10 bg-white text-[#8a6038] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-bold tracking-wide hover:bg-gray-100 transition w-full sm:w-auto">
                  CLAIM OFFER
                </button>
              </div>

              {/* Right Image Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="bg-pink-200 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-2xl lg:rotate-2 w-64 sm:w-[320px] md:w-[380px]">
                  <img
                    src={heroImg}
                    alt="Glow Kit Bundle"
                    className="w-full h-[200px] sm:h-[260px] md:h-[300px] object-cover rounded-xl sm:rounded-2xl"
                  />
                </div>
              </div>

            </div>
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

export default Home;


