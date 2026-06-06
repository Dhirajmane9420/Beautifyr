import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero.jpg";
import { toProductSlug } from "../lib/productUtils";
import {
  deleteCatalogProduct,
  fetchCatalogProducts,
  updateCatalogProduct,
  uploadCatalogProductImage,
} from "../lib/catalogApi";

const categories = ["All", "Serum", "Cream", "Sunscreen", "Gel"];

const priceRanges = [
  { key: "all", label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { key: "under-1000", label: "Under Rs 1,000", min: 0, max: 999 },
  { key: "1000-1500", label: "Rs 1,000 - Rs 1,500", min: 1000, max: 1500 },
  { key: "above-1500", label: "Above Rs 1,500", min: 1501, max: Number.POSITIVE_INFINITY },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const buildInitialForm = () => ({
  title: "",
  description: "",
  price: "",
  inStock: true,
  isBestSeller: true,
  section: "Best Sellers",
  category: "Serum",
  imageUrl: "",
});

function BestSellers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [minimumRating, setMinimumRating] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [adminNotice, setAdminNotice] = useState("");

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState(buildInitialForm());
  const [editingProductFile, setEditingProductFile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await fetchCatalogProducts();
        if (!isMounted) return;
        const bestSellerProducts = allProducts.filter(
          (item) => item.isBestSeller ?? item.section === "Best Sellers"
        );
        setProducts(bestSellerProducts);
      } catch {
        if (!isMounted) return;
        setProducts([]);
      }

      if (!isMounted) return;
      setIsLoading(false);
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const withComputed = useMemo(() => {
    return products.map((product) => {
      const numericPrice = Number(product.price) || 0;
      return {
        ...product,
        numericPrice,
        rating: null,
        sold: null,
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const activePriceRange =
      priceRanges.find((range) => range.key === priceRange) || priceRanges[0];
    const parsedMinimumRating = minimumRating === "all" ? 0 : Number(minimumRating);

    return withComputed.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const priceMatch =
        product.numericPrice >= activePriceRange.min && product.numericPrice <= activePriceRange.max;
      const ratingMatch =
        minimumRating === "all" ? true : (product.rating ? product.rating >= parsedMinimumRating : false);
      const stockMatch = !inStockOnly || product.inStock;

      return categoryMatch && priceMatch && ratingMatch && stockMatch;
    });
  }, [withComputed, activeCategory, priceRange, minimumRating, inStockOnly]);

  const visibleProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    if (sortBy === "price-low") {
      sorted.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (sortBy === "top-rated") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  const hasAdvancedFilters =
    priceRange !== "all" || minimumRating !== "all" || inStockOnly;

  const resetAdvancedFilters = () => {
    setPriceRange("all");
    setMinimumRating("all");
    setInStockOnly(false);
    setSortBy("featured");
  };

  const toPayload = (form, imageUrl) => ({
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    inStock: Boolean(form.inStock),
    isBestSeller: Boolean(form.isBestSeller),
    category: form.category.trim() || "Serum",
    imageUrl,
  });

  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setEditingProductForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price || ""),
      inStock: Boolean(product.inStock),
      isBestSeller: product.isBestSeller ?? product.section === "Best Sellers",
      category: product.category || "Serum",
      imageUrl: product.imageUrl || "",
    });
    setEditingProductFile(null);
  };

  const handleUpdateProduct = async () => {
    if (!editingProductId) return;

    try {
      setIsSaving(true);
      setAdminNotice("");

      let imageUrl = editingProductForm.imageUrl.trim();
      if (editingProductFile) {
        imageUrl = await uploadCatalogProductImage(editingProductFile);
      }

      const payload = toPayload(editingProductForm, imageUrl);
      const updated = await updateCatalogProduct(editingProductId, payload);

      const updatedIsBestSeller = updated?.isBestSeller ?? updated?.section === "Best Sellers";
      setProducts((current) => {
        const remaining = current.filter((item) => item._id !== editingProductId);
        return updatedIsBestSeller ? [updated, ...remaining] : remaining;
      });
      setEditingProductId(null);
      setEditingProductFile(null);
      setAdminNotice("Best seller updated.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Delete this best seller product?");
    if (!confirmed) return;

    try {
      setIsSaving(true);
      setAdminNotice("");
      await deleteCatalogProduct(productId);
      setProducts((current) => current.filter((item) => item._id !== productId));
      setAdminNotice("Best seller deleted.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to delete product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1ec] text-[#2A2520] font-sans selection:bg-[#C8A97E] selection:text-white">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36 md:px-16 lg:px-28">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C8A97E]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#D4B896]/5 blur-3xl" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-7xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            {/* Text content */}
            <div className="lg:col-span-6">
              <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#D4B896]/40 bg-white/60 px-5 py-2 text-xs font-medium uppercase tracking-[0.25em] text-[#8B7359] shadow-sm backdrop-blur-md">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8A97E]" />
                The Cult Classics
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05]">
                Most{" "}
                <span className="relative">
                  <span className="font-serif italic text-[#C8A97E]">Desired.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10C42 3 84 3 124 5C144 6 164 3 198 1" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 max-w-lg text-[#7A6E62] font-light leading-relaxed text-base sm:text-lg">
                Explore the formulations that have defined our sanctuary. Clinically proven, universally adored — each bottle tells a story of devotion.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-[#8B7359]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Clinically Tested</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8B7359]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>50k+ Happy Users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8B7359]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span>Ratings shown only for verified user reviews</span>
                </div>
              </motion.div>
            </div>

            {/* Hero image */}
            <motion.div variants={scaleIn} className="lg:col-span-6">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-[2.5rem] shadow-2xl">
                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2A2520]/30 via-transparent to-transparent z-10" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C8A97E]/10 via-transparent to-[#D4B896]/10 z-10" />
                <img
                  src={heroImage}
                  alt="Most Desired"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Decorative corner accent */}
                <div className="pointer-events-none absolute -top-3 -right-3 z-20 h-16 w-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl" />
                <div className="pointer-events-none absolute -bottom-3 -left-3 z-20 h-16 w-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── ADMIN PANEL ─── */}
      {isAdmin ? (
        <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 md:px-16 lg:px-28">
          <div className="rounded-2xl border border-[#D4B896]/40 bg-white/70 p-5 shadow-lg backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f674d]">Admin Best Sellers Manager</h3>
              <p className="text-xs font-medium text-[#8a6038]">Mark products as best sellers from the edit dialog.</p>
            </div>
            {adminNotice ? <p className="mt-3 rounded-full bg-[#C8A97E]/10 px-4 py-1 text-xs font-medium text-[#8a6038]">{adminNotice}</p> : null}
          </div>
        </section>
      ) : null}

      {/* ─── PRODUCTS SECTION ─── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:px-16 lg:px-28">
        {/* Category & Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-14"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-[#2A2520] text-white shadow-lg"
                      : "bg-white/60 text-[#8B7359] hover:bg-white hover:text-[#2A2520]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center gap-6">
              <p className="text-sm font-light text-[#8B7E72] whitespace-nowrap">
                <span className="font-medium text-[#2A2520]">{visibleProducts.length}</span>{" "}
                {visibleProducts.length === 1 ? "Formulation" : "Formulations"}
              </p>
              <div className="h-6 w-px bg-[#D4B896]/40" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-full border border-[#D4B896]/40 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6e5947] outline-none backdrop-blur-sm transition focus:border-[#C8A97E]"
              >
                <option value="featured">Featured</option>
                <option value="top-rated">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-14 grid grid-cols-1 gap-3 rounded-2xl border border-[#D4B896]/30 bg-white/50 p-4 shadow-sm backdrop-blur-md sm:grid-cols-4 sm:p-5"
        >
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b7359]">Price Range</p>
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="w-full rounded-xl border border-[#D4B896]/30 bg-white/80 px-3 py-2.5 text-xs font-medium text-[#6e5947] outline-none transition focus:border-[#C8A97E]"
            >
              {priceRanges.map((range) => (
                <option key={range.key} value={range.key}>{range.label}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b7359]">Minimum Rating</p>
            <select
              value={minimumRating}
              onChange={(event) => setMinimumRating(event.target.value)}
              className="w-full rounded-xl border border-[#D4B896]/30 bg-white/80 px-3 py-2.5 text-xs font-medium text-[#6e5947] outline-none transition focus:border-[#C8A97E]"
            >
              <option value="all">Any Rating</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.8">4.8+</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setInStockOnly((current) => !current)}
              className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                inStockOnly
                  ? "border-[#C8A97E] bg-[#C8A97E] text-white shadow-md"
                  : "border-[#D4B896]/30 bg-white/80 text-[#6e5947] hover:border-[#C8A97E]/50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {inStockOnly ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : null}
                {inStockOnly ? "In Stock Only" : "Show All Stock"}
              </span>
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetAdvancedFilters}
              disabled={!hasAdvancedFilters && sortBy === "featured"}
              className="w-full rounded-xl border border-[#D4B896]/30 bg-white/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6e5947] transition hover:border-[#C8A97E]/50 hover:bg-[#C8A97E]/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="min-h-[50vh]">
          <AnimatePresence mode="wait">
            {!isLoading && visibleProducts.length > 0 ? (
              <motion.div
                key="grid"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleProducts.map((product, index) => {
                  const mrp = Math.round(product.numericPrice * 1.25);

                  return (
                    <motion.div
                      layout
                      variants={fadeUp}
                      key={product._id}
                      onClick={() =>
                        navigate(`/product/${toProductSlug(product.title)}`, {
                          state: { product },
                        })
                      }
                      className="group flex cursor-pointer flex-col"
                    >
                      {/* Image container */}
                      <div
                        className={`relative mb-6 overflow-hidden rounded-[2.5rem] bg-[#F7F4F0] shadow-lg shadow-black/5 transition-all duration-700 hover:shadow-2xl hover:shadow-black/10 ${
                          index % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/5.5]"
                        }`}
                      >
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <img
  src={product.imageUrl || heroImage}
  alt={product.title}
  className="h-full w-full object-cover transition-all duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.08]"
  onError={(e) => {
    e.currentTarget.src = heroImage;
  }}
/>

                        {/* Rating badge */}
                        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#7f674d] shadow-sm backdrop-blur-md">
                          <svg className="h-3 w-3 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          No verified rating
                        </div>

                        {/* Hover add-to-cart */}
                        <div className="absolute inset-x-4 bottom-4 z-20 translate-y-8 opacity-0 transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0 group-hover:opacity-100">
                          <button className="w-full rounded-2xl border border-[#D4B896]/30 bg-white/90 py-3.5 text-sm font-medium uppercase tracking-widest text-[#2A2520] shadow-lg backdrop-blur-xl transition-all hover:bg-white hover:shadow-xl">
                            Add to Cart — Rs {product.numericPrice}
                          </button>
                        </div>
                      </div>

                      {/* Product info */}
                      <div className="flex flex-col px-1">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="text-lg font-light text-[#2A2520] leading-snug">{product.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#9A8C80]">
                          <span className="rounded-full bg-[#C8A97E]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#7f674d]">
                            {product.category}
                          </span>
                          <span>•</span>
                          <span>{product.sold ? `${product.sold} sold` : "Sales shown in admin"}</span>
                          {product.inStock ? (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                In Stock
                              </span>
                            </>
                          ) : (
                            <>
                              <span>•</span>
                              <span className="text-rose-500">Out of Stock</span>
                            </>
                          )}
                        </div>

                        <div className="mt-3 flex items-baseline gap-2.5">
                          <span className="text-lg font-semibold text-[#2A2520]">Rs {product.numericPrice}</span>
                          <span className="text-sm font-normal text-[#B0A398] line-through">Rs {mrp}</span>
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            {Math.round((1 - product.numericPrice / mrp) * 100)}% OFF
                          </span>
                        </div>
                        <p className="text-sm text-[#8B7E72] font-light">
                          {product.category} • {product.sold} sold • {product.inStock ? "In Stock" : "Out of Stock"}
                        </p>
                        {/* <p className="mt-2 text-base font-semibold text-[#8a6038]">
                          Rs {product.numericPrice}{" "}
                          <span className="ml-1 text-sm font-normal text-[#9d9388] line-through">Rs {mrp}</span>
                        </p> */}
                        <p className="mt-2 text-sm text-[#6f5a47] line-clamp-2">{product.description}</p>

                        {isAdmin ? (
                          <div className="relative z-20 mt-4 flex gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openEditModal(product);
                              }}
                              className="flex-1 rounded-xl bg-[#C8A97E] px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-[#B8976E]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteProduct(product._id);
                              }}
                              className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-600 transition hover:bg-rose-100"
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : null}

            {!isLoading && visibleProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="mb-6 rounded-full bg-[#C8A97E]/10 p-6">
                  <svg className="h-10 w-10 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <p className="text-2xl font-light text-[#7A6E62]">No formulations found in this category.</p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2A2520] px-6 py-3 text-xs font-medium uppercase tracking-widest text-white shadow-lg transition hover:bg-[#3D3530]"
                >
                  View All Classics
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#C8A97E] border-t-transparent" />
                <p className="text-sm font-light text-[#8B7359]">Loading best sellers...</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ─── EDIT MODAL ─── */}
      {editingProductId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#5f3f25]">Edit Best Seller</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setEditingProductFile(null);
                }}
                className="rounded-lg p-2 text-sm text-[#6e5947] transition hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={editingProductForm.title}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Product title"
                className="rounded-xl border border-[#D4B896]/40 bg-[#fff8ef] px-3 py-2.5 text-sm outline-none transition focus:border-[#C8A97E]"
              />
              <input
                value={editingProductForm.price}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                placeholder="Price"
                className="rounded-xl border border-[#D4B896]/40 bg-[#fff8ef] px-3 py-2.5 text-sm outline-none transition focus:border-[#C8A97E]"
              />

              <select
                value={editingProductForm.category}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-xl border border-[#D4B896]/40 bg-[#fff8ef] px-3 py-2.5 text-sm outline-none transition focus:border-[#C8A97E]"
              >
                <option value="Serum">Serum</option>
                <option value="Cream">Cream</option>
                <option value="Sunscreen">Sunscreen</option>
                <option value="Gel">Gel</option>
              </select>

              <input
                value={editingProductForm.imageUrl}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, imageUrl: event.target.value }))}
                placeholder="Image URL"
                className="rounded-xl border border-[#D4B896]/40 bg-[#fff8ef] px-3 py-2.5 text-sm outline-none transition focus:border-[#C8A97E]"
              />
            </div>

            <textarea
              value={editingProductForm.description}
              onChange={(event) =>
                setEditingProductForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={3}
              placeholder="Description"
              className="mt-3 w-full rounded-xl border border-[#D4B896]/40 bg-[#fff8ef] px-3 py-2.5 text-sm outline-none transition focus:border-[#C8A97E]"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    setAdminNotice("Image must be 10MB or smaller.");
                    return;
                  }
                  setEditingProductFile(file);
                }}
                className="rounded-xl border border-[#D4B896]/40 bg-[#fff8ef] px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[#C8A97E] file:px-3 file:py-1 file:text-xs file:font-medium file:text-white"
              />
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-[#6e5947]">
                  <input
                    type="checkbox"
                    checked={editingProductForm.inStock}
                    onChange={(event) =>
                      setEditingProductForm((current) => ({ ...current, inStock: event.target.checked }))
                    }
                    className="accent-[#C8A97E]"
                  />
                  In stock
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-[#6e5947]">
                  <input
                    type="checkbox"
                    checked={editingProductForm.isBestSeller}
                    onChange={(event) =>
                      setEditingProductForm((current) => ({ ...current, isBestSeller: event.target.checked }))
                    }
                    className="accent-[#C8A97E]"
                  />
                  Best seller
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setEditingProductFile(null);
                }}
                className="rounded-xl border border-[#D4B896]/30 px-5 py-2.5 text-sm text-[#6e5947] transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProduct}
                disabled={isSaving}
                className="rounded-xl bg-[#C8A97E] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#B8976E] disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}

      {/* ─── BOTTOM TRUST SECTION ─── */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 md:px-16 lg:px-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[#D4B896]/30 bg-gradient-to-br from-[#F7F1EA] via-[#F0E8DD] to-[#EBE1D4] p-8 shadow-lg md:p-12"
        >
          {/* Decorative bg */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#C8A97E]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#D4B896]/10 blur-2xl" />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8A97E]/10">
                <svg className="h-5 w-5 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b7359] font-semibold">Why Customers Love These</p>
              <h3 className="mt-1 text-2xl font-light text-[#2A2520]">Top Picks, <span className="font-serif italic text-[#C8A97E]">Real Results</span></h3>
            </div>
            <div className="rounded-2xl border border-[#D4B896]/20 bg-white/50 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-[#C8A97E]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7359]">Fast Moving</p>
              </div>
              <p className="text-sm leading-relaxed text-[#6f5a47]">Most products in this list restock every 7-10 days due to overwhelming demand.</p>
            </div>
            <div className="rounded-2xl border border-[#D4B896]/20 bg-white/50 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-[#C8A97E]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7359]">Dermatologist Curated</p>
              </div>
              <p className="text-sm leading-relaxed text-[#6f5a47]">Each bestseller is selected for efficacy, tolerance, and routine compatibility.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default BestSellers;
