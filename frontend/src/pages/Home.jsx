import heroImg from "../assets/hero.jpg";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="relative w-full h-screen">

      <Navbar />

      {/* Background Image */}
      <img
        src={heroImg}
        alt="Skincare"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Light overlay (NO BLUR) */}
      <div className="absolute inset-0 bg-white/60"></div>

      {/* Content (LEFT aligned) */}
      <div className="relative z-10 flex items-center h-full justify-start">
        <div className="w-full px-6 lg:px-12">

          <div className="max-w-2xl">
            
            {/* Tag */}
            <span className="inline-block bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold">
              DERMATOLOGIST RECOMMENDED
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Science-Backed Skincare for Your Unique Glow
            </h1>

            {/* Description */}
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Premium formulas tailored to your specific skin concerns,
              formulated by experts and backed by clinical research.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              
              <button className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition">
                SHOP NOW
              </button>

              <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold border border-gray-300 hover:bg-gray-100 transition">
                EXPLORE CATEGORIES
              </button>

            </div>

          </div>
        </div>
      </div>
      {/* SHOP BY CATEGORY SECTION */}
<section className="bg-[#f7f5f2] px-6 py-20">
  <div className="max-w-7xl mx-auto">
    
    {/* Heading */}
    <h2 className="text-4xl font-bold text-teal-900">Shop by Category</h2>
    <div className="mt-3 h-1 w-16 bg-pink-200 rounded-full"></div>

    {/* Grid */}
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Left Big Card */}
      <div className="relative overflow-hidden rounded-3xl group h-[580px]">
        <img
          src={heroImg}
          alt="Serums"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h3 className="text-5xl font-bold">Serums</h3>
          <p className="mt-2 text-lg text-white/90">
            Potent elixirs for deep repair
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Moisturizers */}
        <div className="relative overflow-hidden rounded-3xl group h-[280px]">
          <img
            src={heroImg}
            alt="Moisturizers"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/15"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">Moisturizers</h3>
          </div>
        </div>

        {/* Face Wash */}
        <div className="relative overflow-hidden rounded-3xl group h-[280px]">
          <img
            src={heroImg}
            alt="Face Wash"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">Face Wash</h3>
          </div>
        </div>

        {/* Sunscreens */}
        <div className="relative overflow-hidden rounded-3xl group h-[280px] col-span-2">
          <img
            src={heroImg}
            alt="Sunscreens"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-3xl font-bold">Sunscreens</h3>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
{/* FEATURED SELECTIONS SECTION */}
<section className="bg-[#f7f5f2] px-6 py-20">
  <div className="max-w-7xl mx-auto">
    
    {/* Heading */}
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <h2 className="text-4xl font-bold text-teal-900">Featured Selections</h2>
        <p className="mt-3 text-gray-500 text-lg">
          Expert-curated favorites for every skin type.
        </p>
      </div>

      <button className="text-teal-700 font-semibold tracking-wide border-b border-teal-300 hover:text-teal-900 transition">
        VIEW ALL
      </button>
    </div>

    {/* Product Cards */}
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      
      {/* Card 1 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={heroImg}
            alt="Radiance Vitamin C Serum"
            className="w-full h-64 object-cover"
          />
          <button className="absolute top-4 right-4 bg-white w-11 h-11 rounded-full flex items-center justify-center text-teal-700 text-xl shadow">
            ♥
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="bg-orange-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
            BRIGHTENING
          </span>
          <span className="text-yellow-500 font-semibold">⭐ 4.9</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold text-gray-800">
          Radiance Vitamin C Serum
        </h3>
        <p className="mt-2 text-gray-500">
          Pure 15% L-Ascorbic Acid for glow.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-3xl font-bold text-teal-800">$48.00</span>
          <button className="bg-teal-700 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-teal-800 transition">
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={heroImg}
            alt="Gentle pH Cleanser"
            className="w-full h-64 object-cover"
          />
          <button className="absolute top-4 right-4 bg-white w-11 h-11 rounded-full flex items-center justify-center text-teal-700 text-xl shadow">
            ♥
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="bg-emerald-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
            OILY SKIN
          </span>
          <span className="text-yellow-500 font-semibold">⭐ 4.8</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold text-gray-800">
          Gentle pH Cleanser
        </h3>
        <p className="mt-2 text-gray-500">
          Balanced cleansing for sensitive skin.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-3xl font-bold text-teal-800">$24.00</span>
          <button className="bg-teal-700 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-teal-800 transition">
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={heroImg}
            alt="Barrier Repair Cream"
            className="w-full h-64 object-cover"
          />
          <button className="absolute top-4 right-4 bg-white w-11 h-11 rounded-full flex items-center justify-center text-teal-700 text-xl shadow">
            ♥
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="bg-orange-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
            HYDRATION
          </span>
          <span className="text-yellow-500 font-semibold">⭐ 5.0</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold text-gray-800">
          Barrier Repair Cream
        </h3>
        <p className="mt-2 text-gray-500">
          Ceramide-rich intense moisturizer.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-3xl font-bold text-teal-800">$52.00</span>
          <button className="bg-teal-700 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-teal-800 transition">
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={heroImg}
            alt="Ultra-Sheer SPF 50+"
            className="w-full h-64 object-cover"
          />
          <button className="absolute top-4 right-4 bg-white w-11 h-11 rounded-full flex items-center justify-center text-teal-700 text-xl shadow">
            ♥
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="bg-emerald-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
            PROTECTION
          </span>
          <span className="text-yellow-500 font-semibold">⭐ 4.7</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold text-gray-800">
          Ultra-Sheer SPF 50+
        </h3>
        <p className="mt-2 text-gray-500">
          Invisible finish broad spectrum.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-3xl font-bold text-teal-800">$32.00</span>
          <button className="bg-teal-700 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-teal-800 transition">
            ADD TO CART
          </button>
        </div>
      </div>

    </div>
  </div>
</section>
{/* TRUST FEATURES SECTION */}
<section className="bg-[#f7f5f2] px-6 py-20">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
    
    {/* Item 1 */}
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-teal-800 shadow-sm">
        ✔
      </div>
      <h3 className="mt-6 text-3xl font-semibold text-teal-900">
        Authentic Products
      </h3>
      <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-xs">
        Direct sourcing from world-class laboratories.
      </p>
    </div>

    {/* Item 2 */}
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-teal-800 shadow-sm">
        🧪
      </div>
      <h3 className="mt-6 text-3xl font-semibold text-teal-900">
        Safe & Tested
      </h3>
      <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-xs">
        Every formula passes rigorous clinical trials.
      </p>
    </div>

    {/* Item 3 */}
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-teal-800 shadow-sm">
        🔒
      </div>
      <h3 className="mt-6 text-3xl font-semibold text-teal-900">
        Secure Checkout
      </h3>
      <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-xs">
        Your privacy and security are our priority.
      </p>
    </div>

    {/* Item 4 */}
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-teal-800 shadow-sm">
        💼
      </div>
      <h3 className="mt-6 text-3xl font-semibold text-teal-900">
        Easy Returns
      </h3>
      <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-xs">
        Hassle-free 30-day return policy.
      </p>
    </div>

  </div>
</section>
{/* TARGETED SOLUTIONS SECTION */}
<section className="bg-[#f7f5f2] px-6 py-20">
  <div className="max-w-7xl mx-auto">
    
    {/* Heading */}
    <h2 className="text-center text-4xl md:text-5xl font-bold text-teal-900">
      Targeted Solutions
    </h2>

    {/* Cards */}
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Acne */}
      <div className="relative h-[340px] overflow-hidden rounded-3xl group">
        <img
          src={heroImg}
          alt="Acne"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-4xl font-semibold tracking-widest">
            ACNE
          </h3>
        </div>
      </div>

      {/* Dry Skin */}
      <div className="relative h-[340px] overflow-hidden rounded-3xl group">
        <img
          src={heroImg}
          alt="Dry Skin"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-4xl font-semibold tracking-widest">
            DRY SKIN
          </h3>
        </div>
      </div>

      {/* Sensitive */}
      <div className="relative h-[340px] overflow-hidden rounded-3xl group">
        <img
          src={heroImg}
          alt="Sensitive"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-4xl font-semibold tracking-widest">
            SENSITIVE
          </h3>
        </div>
      </div>

      {/* Dullness */}
      <div className="relative h-[340px] overflow-hidden rounded-3xl group">
        <img
          src={heroImg}
          alt="Dullness"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-4xl font-semibold tracking-widest">
            DULLNESS
          </h3>
        </div>
      </div>

    </div>
  </div>
</section>
{/* TESTIMONIALS SECTION */}
<section className="bg-[#f7f5f2] px-6 py-24">
  <div className="max-w-7xl mx-auto">
    
    {/* Heading */}
    <h2 className="text-center text-4xl md:text-5xl font-bold text-teal-900">
      Voices of the Sanctuary
    </h2>

    {/* Testimonial Cards */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      {/* Card 1 */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border-l-4 border-teal-700">
        <div className="text-yellow-400 text-3xl tracking-wide">★★★★★</div>
        <p className="mt-8 text-gray-600 text-2xl leading-relaxed">
          "The Radiant Vitamin C Serum changed my life. My dark spots faded in
          just 3 weeks. Truly clinical results at home."
        </p>
        <h4 className="mt-10 text-teal-800 text-2xl font-semibold">
          — Elena M.
        </h4>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border-l-4 border-teal-700">
        <div className="text-yellow-400 text-3xl tracking-wide">★★★★★</div>
        <p className="mt-8 text-gray-600 text-2xl leading-relaxed">
          "I have extremely sensitive skin and everything used to burn. The
          Gentle Cleanser is so soothing. I finally feel safe."
        </p>
        <h4 className="mt-10 text-teal-800 text-2xl font-semibold">
          — Marcus T.
        </h4>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border-l-4 border-teal-700">
        <div className="text-yellow-400 text-3xl tracking-wide">★★★★★</div>
        <p className="mt-8 text-gray-600 text-2xl leading-relaxed">
          "Fast delivery and the packaging is beautiful. You can tell they care
          about the luxury experience."
        </p>
        <h4 className="mt-10 text-teal-800 text-2xl font-semibold">
          — Sophia R.
        </h4>
      </div>

    </div>
  </div>
</section>
{/* PROMO BANNER SECTION */}
<section className="bg-[#f7f5f2] px-6 py-20">
  <div className="max-w-7xl mx-auto">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-teal-800 px-8 py-16 md:px-14 lg:px-16">
      
      {/* Soft background overlay */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%),radial-gradient(circle_at_bottom_left,_white,_transparent_35%)]"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Left Content */}
        <div className="text-white">
          <p className="text-sm md:text-base tracking-[0.35em] font-semibold text-white/70 uppercase">
            Limited Time Exclusive
          </p>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            The Glow Kit Bundle
          </h2>

          <p className="mt-6 text-lg md:text-2xl text-white/70 max-w-2xl leading-relaxed">
            Complete 4-step routine for dull skin. Save $35 today.
          </p>

          <button className="mt-10 bg-white text-teal-800 px-8 py-4 rounded-2xl text-lg font-bold tracking-wide hover:bg-gray-100 transition">
            CLAIM OFFER
          </button>
        </div>

        {/* Right Image Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-pink-200 rounded-[2rem] p-6 md:p-8 shadow-2xl rotate-2 w-[320px] md:w-[380px]">
            <img
              src={heroImg}
              alt="Glow Kit Bundle"
              className="w-full h-[260px] md:h-[300px] object-cover rounded-2xl"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
{/* NEWSLETTER + FOOTER SECTION */}
<section className="bg-[#f7f5f2] pt-20">
  
  {/* Newsletter Top */}
  <div className="max-w-4xl mx-auto text-center px-6">
    <h2 className="text-4xl md:text-5xl font-bold text-teal-900">
      Join the DermaEthos Community
    </h2>

    <p className="mt-5 text-lg md:text-2xl text-gray-500 leading-relaxed">
      Get expert skin tips, early access to launches, and 15% off your first order.
    </p>

    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <input
        type="email"
        placeholder="Enter your email address"
        className="w-full sm:w-[500px] rounded-2xl bg-white px-6 py-5 text-lg text-gray-700 outline-none border border-gray-100 shadow-sm"
      />
      <button className="bg-teal-800 text-white px-10 py-5 rounded-2xl text-lg font-bold tracking-wide hover:bg-teal-900 transition">
        SUBSCRIBE
      </button>
    </div>

    <p className="mt-5 text-sm text-gray-400">
      By subscribing, you agree to our Privacy Policy.
    </p>
  </div>

  {/* Footer Main */}
  <div className="mt-20 bg-[#f4f4f4] px-6 py-20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      
      {/* Brand */}
      <div>
        <h3 className="text-3xl font-bold text-teal-900">Clinical Sanctuary</h3>
        <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-sm">
          Dermatologist-formulated skincare that respects your biology and enhances your natural beauty.
        </p>

        <div className="mt-8 flex items-center gap-5 text-3xl text-teal-800">
          <span>🌐</span>
          <span>@</span>
        </div>
      </div>

      {/* Products */}
      <div>
        <h4 className="text-2xl font-semibold text-teal-900">Products</h4>
        <ul className="mt-6 space-y-4 text-gray-500 text-lg">
          <li>Face Wash</li>
          <li>Serums</li>
          <li>Moisturizers</li>
          <li>Sunscreens</li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="text-2xl font-semibold text-teal-900">Support</h4>
        <ul className="mt-6 space-y-4 text-gray-500 text-lg">
          <li>Contact Support</li>
          <li>Shipping & Returns</li>
          <li>FAQs</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      {/* Newsletter Small */}
      <div>
        <h4 className="text-2xl font-semibold text-teal-900">Newsletter</h4>
        <p className="mt-6 text-gray-500 text-lg leading-relaxed">
          The latest in skin science, delivered to your inbox.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="mt-8 w-full rounded-2xl bg-white px-5 py-4 text-lg text-gray-700 outline-none border border-gray-100 shadow-sm"
        />
      </div>

    </div>

    {/* Bottom Footer */}
    <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-sm">
      <p>© 2024 Clinical Sanctuary. Dermatologist Recommended.</p>

      <div className="flex items-center gap-8">
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