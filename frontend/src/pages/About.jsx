import { useEffect, useState } from "react";
import aboutImg from "../assets/hero.jpg"; // replace later with actual image
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import AboutLiveEditor from "../components/admin/AboutLiveEditor";
import {
  fetchPageOverrides,
  savePageOverride,
  uploadPageOverrideImage,
} from "../lib/siteOverridesApi";

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const processSteps = [
  {
    id: "01",
    title: "Clinical Mapping",
    description:
      "We start with barrier biology and map ingredient pathways to real skin concerns before any formula is drafted.",
  },
  {
    id: "02",
    title: "Lab Validation",
    description:
      "Every prototype is tested for stability, tolerance, and active efficacy under dermatologist-reviewed protocols.",
  },
  {
    id: "03",
    title: "Ritual Simplicity",
    description:
      "Only formulas that stay high-performing and easy to use in daily routines are released to our collection.",
  },
];

const impactCommitments = [
  {
    metric: "100%",
    title: "Cruelty-Free Development",
    description: "No animal testing at any stage of research, formulation, or batch verification.",
  },
  {
    metric: "92%",
    title: "Recyclable Packaging",
    description: "Primary packaging is recyclable and designed to reduce mixed-material waste over time.",
  },
  {
    metric: "0",
    title: "Hidden Concentrations",
    description: "We publish active concentration ranges so your routine decisions are data-backed.",
  },
  {
    metric: "24h",
    title: "Batch Trace Window",
    description: "Each batch can be traced with supplier and QA logs for complete formulation transparency.",
  },
];

function About() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [overrides, setOverrides] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadOverrides = async () => {
      try {
        const records = await fetchPageOverrides("about");
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
    const keyToSelector = (key) => `[data-edit-key="${String(key).replace(/"/g, '\\\"')}"]`;

    const apply = () => {
      overrides.forEach((override) => {
        const nodes = document.querySelectorAll(keyToSelector(override.key));
        nodes.forEach((node) => {
          if (override.kind === "image") {
            node.setAttribute("src", override.value);
            return;
          }
          node.textContent = override.value;
        });
      });
    };

    const frameId = window.requestAnimationFrame(apply);
    return () => window.cancelAnimationFrame(frameId);
  }, [overrides]);

  const handleSaveOverride = async ({ key, kind, value }) => {
    const saved = await savePageOverride({
      page: "about",
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
    <div className="min-h-screen bg-[#FCFAF8] text-[#2A2520] font-sans selection:bg-[#E8DCCB] selection:text-[#2A2520]">
      <Navbar />

      {/* HERO & STORY SECTION */}
      <motion.section 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.2 }} 
        className="px-6 md:px-12 lg:px-24 pt-32 pb-20 relative overflow-hidden"
      >
        {/* Soft background glows */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#F3E5D4] blur-[100px] opacity-60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-12 items-center relative z-10">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div variants={fadeUp} className="mb-6">
              <span data-edit-key="about.hero.badge" data-edit-kind="text" data-edit-label="Hero Badge" className="inline-flex rounded-full border border-[#E8DCCB] bg-[#F7F4F0] px-4 py-2 text-[10px] tracking-[0.2em] text-[#8B7E72] uppercase">
                The Core of Our Science
              </span>
            </motion.div>

            <motion.h1 data-edit-key="about.hero.title" data-edit-kind="text" data-edit-label="Hero Title" variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#2A2520] leading-[1.1] mb-8">
              Our <span className="font-serif italic text-[#8B7E72]">Story</span>
            </motion.h1>

            <motion.p data-edit-key="about.hero.description" data-edit-kind="text" data-edit-label="Hero Description" variants={fadeUp} className="text-[#7A6E62] text-lg font-light leading-relaxed max-w-lg mb-10">
              Where clinical precision meets skin comfort. We blend vanguard innovation with biocompatible ingredients to create formulations that nourish, protect, and let your natural barrier thrive.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6">
              <button data-edit-key="about.hero.cta" data-edit-kind="text" data-edit-label="Hero CTA" className="rounded-full bg-[#2A2520] px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-white transition-all hover:bg-[#3A332D] hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                Explore Formulations
              </button>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div variants={fadeUp} className="lg:col-span-7 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-[#F7F4F0] aspect-[4/5] sm:aspect-auto sm:h-[600px] w-full">
              <img
                src={aboutImg}
                data-edit-key="about.hero.image"
                data-edit-kind="image"
                data-edit-label="Hero Image"
                alt="Skincare Science"
                className="w-full h-full object-cover opacity-95 mix-blend-multiply"
              />
              
              {/* Floating Glass Founder Note */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 rounded-[2rem] bg-white/70 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                <p data-edit-key="about.founder.badge" data-edit-kind="text" data-edit-label="Founder Badge" className="text-[10px] tracking-[0.2em] uppercase text-[#8B7E72] font-semibold mb-3">
                  Founder Note
                </p>
                <p data-edit-key="about.founder.quote" data-edit-kind="text" data-edit-label="Founder Quote" className="text-[#2A2520] text-sm sm:text-base font-light leading-relaxed">
                  "Healthy skin should feel achievable, not overwhelming. Our minimal, high-impact formulas are engineered to support real-life routines."
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* CORE PRINCIPLES SECTION */}
      <motion.section 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.2 }} 
        className="px-6 md:px-12 lg:px-24 py-24 bg-[#F7F4F0]/70"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#E8DCCB] pb-10">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2A2520]">
                Our <span className="font-serif italic text-[#8B7E72]">Principles</span>
              </h2>
            </div>
            <p className="text-[#7A6E62] font-light text-lg max-w-md">
              Every formula is engineered for clinical performance and daily comfort.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <motion.div variants={fadeUp} className="bg-[#fff8ef] rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCCB] hover:-translate-y-2 transition-transform duration-500">
              <div className="text-xs font-semibold tracking-[0.2em] text-[#8B7E72] mb-8 border-b border-[#E8DCCB] pb-2 inline-block">
                01
              </div>
              <h3 className="text-2xl font-light tracking-tight text-[#2A2520] mb-4">
                Clinical Quality
              </h3>
              <p className="text-[#7A6E62] font-light leading-relaxed">
                Every batch is rigorously tested for purity and potency. We bypass industry standards to set our own evidence-backed benchmarks.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeUp} className="bg-[#fff8ef] rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCCB] hover:-translate-y-2 transition-transform duration-500">
              <div className="text-xs font-semibold tracking-[0.2em] text-[#8B7E72] mb-8 border-b border-[#E8DCCB] pb-2 inline-block">
                02
              </div>
              <h3 className="text-2xl font-light tracking-tight text-[#2A2520] mb-4">
                Radical Clarity
              </h3>
              <p className="text-[#7A6E62] font-light leading-relaxed">
                We list every active concentration. No proprietary blends. No hidden fillers. Just pure transparency on what touches your skin.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeUp} className="bg-[#fff8ef] rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#E8DCCB] hover:-translate-y-2 transition-transform duration-500">
              <div className="text-xs font-semibold tracking-[0.2em] text-[#8B7E72] mb-8 border-b border-[#E8DCCB] pb-2 inline-block">
                03
              </div>
              <h3 className="text-2xl font-light tracking-tight text-[#2A2520] mb-4">
                Biology First
              </h3>
              <p className="text-[#7A6E62] font-light leading-relaxed">
                We solve for the biological cause, not just the aesthetic symptom. Healthy skin is radiant skin, by structural design.
              </p>
            </motion.div>

          </div>
        </div>
      </motion.section>

      <AboutLiveEditor isAdmin={isAdmin} onSaveOverride={handleSaveOverride} onUploadImage={uploadPageOverrideImage} />

      {/* AIRY STATS SECTION */}
      <motion.section 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.4 }} 
        className="px-6 md:px-12 lg:px-24 py-24"
      >
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#2A2520] px-8 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative overflow-hidden">
          
          {/* Subtle light effect inside the dark container */}
          <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />

          {/* Stat 1 */}
          <motion.div variants={fadeUp} className="relative z-10 flex flex-col items-center">
              <h3 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
              500k<span className="text-[#B7A694]">+</span>
            </h3>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#B7A694] uppercase">
              Global Routines
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div variants={fadeUp} className="relative z-10 flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
              120<span className="text-[#B7A694]">+</span>
            </h3>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#B7A694] uppercase">
              Clinical Formulas
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div variants={fadeUp} className="relative z-10 flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
              98<span className="text-[#B7A694]">%</span>
            </h3>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#B7A694] uppercase">
              Retention Rate
            </p>
          </motion.div>

          {/* Stat 4 */}
          <motion.div variants={fadeUp} className="relative z-10 flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
              15k<span className="text-[#B7A694]">+</span>
            </h3>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#B7A694] uppercase">
              5-Star Efficacy
            </p>
          </motion.div>

        </div>
      </motion.section>

      {/* FORMULATION PROCESS SECTION */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="px-6 md:px-12 lg:px-24 py-24 bg-[#F7F4F0]/70"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="max-w-2xl mb-14">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8B7E72] font-semibold mb-4">
              How We Build
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2A2520]">
              The <span className="font-serif italic text-[#8B7E72]">Formulation Journey</span>
            </h2>
            <p className="mt-5 text-[#7A6E62] text-lg font-light leading-relaxed">
              A three-phase system designed to keep every launch evidence-led, skin-safe, and routine-ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <motion.article
                key={step.id}
                variants={fadeUp}
                className="rounded-4xl border border-[#E8DCCB] bg-[#fff8ef] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
              >
                <p className="inline-flex border-b border-[#E8DCCB] pb-2 text-xs font-semibold tracking-[0.2em] text-[#8B7E72]">
                  {step.id}
                </p>
                <h3 className="mt-6 text-2xl font-light tracking-tight text-[#2A2520]">{step.title}</h3>
                <p className="mt-4 text-[#7A6E62] font-light leading-relaxed">{step.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* IMPACT COMMITMENTS SECTION */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="px-6 md:px-12 lg:px-24 py-24"
      >
        <div className="max-w-7xl mx-auto rounded-[2.5rem] border border-[#E8DCCB] bg-[#fff8ef] p-8 md:p-12">
          <motion.div variants={fadeUp} className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8B7E72] font-semibold mb-4">
                Beyond Formulas
              </p>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2A2520]">
                Our <span className="font-serif italic text-[#8B7E72]">Impact Commitments</span>
              </h2>
            </div>
            <p className="max-w-md text-[#7A6E62] font-light text-lg leading-relaxed">
              Performance should never compromise responsibility. These standards guide every release.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactCommitments.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-[1.75rem] border border-[#E8DCCB] bg-[#F7F4F0] p-6"
              >
                <p className="text-3xl md:text-4xl font-light tracking-tight text-[#2A2520]">{item.metric}</p>
                <h3 className="mt-4 text-lg font-medium text-[#2A2520]">{item.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#7A6E62]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* REFINED FOOTER & NEWSLETTER */}
      <footer className="mt-12 rounded-t-4xl bg-[#1A1816] px-5 pb-12 pt-16 text-[#FCFAF8] sm:rounded-t-[3rem] sm:px-6 sm:pt-20 md:px-12 lg:px-24 lg:pt-24">
        <div className="mb-16 grid grid-cols-1 gap-12 lg:mb-20 lg:grid-cols-12 lg:gap-16">
          
          {/* Newsletter */}
          <div className="lg:col-span-6 pr-0 lg:pr-12">
            <h2 className="text-3xl font-light mb-4 tracking-tight">Join the <span className="font-serif italic text-[#D2C5B5]">Sanctuary</span></h2>
            <p className="text-white/50 font-light mb-8 max-w-md">Privileged access to new formulations, clinical insights, and 10% off your introductory ritual.</p>
            <div className="relative flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full rounded-none border-b border-white/20 bg-white/5 px-0 py-4 text-white placeholder-white/30 transition-colors focus:border-white focus:outline-none sm:pr-28"
              />
              <button className="text-left text-sm uppercase tracking-widest text-[#D2C5B5] transition-colors hover:text-white sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:text-right">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 gap-8 text-sm font-light text-white/60 sm:grid-cols-2 md:grid-cols-3 lg:col-span-6">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium tracking-widest uppercase text-xs mb-2">Shop</h4>
              <a href="#" className="hover:text-white transition-colors">All Products</a>
              <a href="#" className="hover:text-white transition-colors">Best Sellers</a>
              <a href="#" className="hover:text-white transition-colors">Routines</a>
              <a href="#" className="hover:text-white transition-colors">Gift Cards</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium tracking-widest uppercase text-xs mb-2">About</h4>
              <a href="#" className="hover:text-white transition-colors">Our Story</a>
              <a href="#" className="hover:text-white transition-colors">Ingredients</a>
              <a href="#" className="hover:text-white transition-colors">Clinical Trials</a>
              <a href="#" className="hover:text-white transition-colors">Journal</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium tracking-widest uppercase text-xs mb-2">Support</h4>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
              <a href="#" className="hover:text-white transition-colors">Shipping</a>
              <a href="#" className="hover:text-white transition-colors">Returns</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs font-light text-white/40 md:flex-row md:items-center md:gap-6">
          <p>© 2026 Clinical Sanctuary. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;