import heroImg from "../assets/hero.jpg";
import heroVideo from "../assets/hero1.mp4";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="relative w-full h-screen">
      <Navbar />

      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={heroVideo} type="video/mp4" />
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-2 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-amber-300"></span>
              <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/90 font-medium">
                Dermatologist Approved
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white">
              Elevate Your
              <span className="block text-amber-200 italic font-light">
                Natural Radiance
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-7 text-white/80">
              Discover clinically crafted skincare designed to nourish, restore,
              and reveal your healthiest glow with premium ingredients your skin
              will truly love.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="group bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-xl transition-all duration-300 hover:bg-amber-100 sm:text-base rounded-full">
                Shop Collection
              </button>

              <button className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:text-base">
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
      <section className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#7a522f]">Shop by Category</h2>
              <div className="mt-3 h-1 w-16 bg-pink-200 rounded-full"></div>
            </div>

            <button className="group inline-flex items-center gap-2 text-[#9a6f46] font-semibold tracking-wide border-b border-[#e8c7a5] hover:text-[#7a522f] transition">
              VIEW ALL
              <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* Grid */}
          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Left Big Card */}
            <div className="relative overflow-hidden rounded-3xl group h-[350px] md:h-[450px] lg:h-[580px]">
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
              <div className="relative overflow-hidden rounded-3xl group h-[200px] sm:h-[280px]">
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
              <div className="relative overflow-hidden rounded-3xl group h-[200px] sm:h-[280px]">
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
              <div className="relative overflow-hidden rounded-3xl group h-[200px] sm:h-[280px] col-span-1 sm:col-span-2">
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
      </section>

      {/* FEATURED SELECTIONS SECTION */}
      <section className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#7a522f]">Featured Selections</h2>
              <p className="mt-2 sm:mt-3 text-gray-500 text-base sm:text-lg">
                Expert-curated favorites for every skin type.
              </p>
            </div>

            <button className="text-[#9a6f46] font-semibold tracking-wide border-b border-[#e8c7a5] hover:text-[#7a522f] transition">
              VIEW ALL
            </button>
          </div>

          {/* Product Cards */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImg}
                  alt="Radiance Vitamin C Serum"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <button className="absolute top-4 right-4 bg-white w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[#9a6f46] text-lg sm:text-xl shadow">
                  ♥
                </button>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="bg-orange-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
                  BRIGHTENING
                </span>
                <span className="text-yellow-500 font-semibold">⭐ 4.9</span>
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-gray-800">
                Radiance Vitamin C Serum
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Pure 15% L-Ascorbic Acid for glow.
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#8a6038]">$48.00</span>
                <button className="w-full xl:w-auto bg-[#b67d4a] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#a66f3f] transition text-sm sm:text-base">
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImg}
                  alt="Gentle pH Cleanser"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <button className="absolute top-4 right-4 bg-white w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[#9a6f46] text-lg sm:text-xl shadow">
                  ♥
                </button>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="bg-[#ffe8d0] text-gray-600 px-3 py-1 rounded-full font-semibold">
                  OILY SKIN
                </span>
                <span className="text-yellow-500 font-semibold">⭐ 4.8</span>
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-gray-800">
                Gentle pH Cleanser
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Balanced cleansing for sensitive skin.
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#8a6038]">$24.00</span>
                <button className="w-full xl:w-auto bg-[#b67d4a] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#a66f3f] transition text-sm sm:text-base">
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImg}
                  alt="Barrier Repair Cream"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <button className="absolute top-4 right-4 bg-white w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[#9a6f46] text-lg sm:text-xl shadow">
                  ♥
                </button>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="bg-orange-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
                  HYDRATION
                </span>
                <span className="text-yellow-500 font-semibold">⭐ 5.0</span>
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-gray-800">
                Barrier Repair Cream
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Ceramide-rich intense moisturizer.
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#8a6038]">$52.00</span>
                <button className="w-full xl:w-auto bg-[#b67d4a] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#a66f3f] transition text-sm sm:text-base">
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImg}
                  alt="Ultra-Sheer SPF 50+"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <button className="absolute top-4 right-4 bg-white w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[#9a6f46] text-lg sm:text-xl shadow">
                  ♥
                </button>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="bg-[#ffe8d0] text-gray-600 px-3 py-1 rounded-full font-semibold">
                  PROTECTION
                </span>
                <span className="text-yellow-500 font-semibold">⭐ 4.7</span>
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-gray-800">
                Ultra-Sheer SPF 50+
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Invisible finish broad spectrum.
              </p>

              <div className="mt-4 sm:mt-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#8a6038]">$32.00</span>
                <button className="w-full xl:w-auto bg-[#b67d4a] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#a66f3f] transition text-sm sm:text-base">
                  ADD TO CART
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST FEATURES SECTION */}
      <section className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffe8d0] flex items-center justify-center text-2xl sm:text-3xl text-[#8a6038] shadow-sm">
              ✔
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
              🧪
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
              🔒
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
              💼
            </div>
            <h3 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-semibold text-[#7a522f]">
              Easy Returns
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xs">
              Hassle-free 30-day return policy.
            </p>
          </div>

        </div>
      </section>

      {/* TARGETED SOLUTIONS SECTION */}
      <section className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
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
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-[#7a522f]">
            Voices of the Sanctuary
          </h2>

          {/* Testimonial Cards */}
          <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border-l-4 border-[#a66f3f]">
              <div className="text-yellow-400 text-2xl sm:text-3xl tracking-wide">★★★★★</div>
              <p className="mt-6 text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                "The Radiant Vitamin C Serum changed my life. My dark spots faded in
                just 3 weeks. Truly clinical results at home."
              </p>
              <h4 className="mt-8 text-[#8a6038] text-xl lg:text-2xl font-semibold">
                — Elena M.
              </h4>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border-l-4 border-[#a66f3f]">
              <div className="text-yellow-400 text-2xl sm:text-3xl tracking-wide">★★★★★</div>
              <p className="mt-6 text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                "I have extremely sensitive skin and everything used to burn. The
                Gentle Cleanser is so soothing. I finally feel safe."
              </p>
              <h4 className="mt-8 text-[#8a6038] text-xl lg:text-2xl font-semibold">
                — Marcus T.
              </h4>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border-l-4 border-[#a66f3f]">
              <div className="text-yellow-400 text-2xl sm:text-3xl tracking-wide">★★★★★</div>
              <p className="mt-6 text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                "Fast delivery and the packaging is beautiful. You can tell they care
                about the luxury experience."
              </p>
              <h4 className="mt-8 text-[#8a6038] text-xl lg:text-2xl font-semibold">
                — Sophia R.
              </h4>
            </div>

          </div>
        </div>
      </section>

      {/* PROMO BANNER SECTION */}
      <section className="bg-[#fff7ee] px-4 sm:px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#a66f3f] px-6 py-10 sm:py-16 md:px-14 lg:px-16">
            
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

export default Home;

