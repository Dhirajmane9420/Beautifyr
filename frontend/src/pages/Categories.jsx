import heroImg from "../assets/hero.jpg";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  createCatalogCategory,
  createCatalogProduct,
  deleteCatalogCategory,
  deleteCatalogProduct,
  fetchCatalogCategories,
  fetchCatalogProducts,
  updateCatalogProduct,
  uploadCatalogProductImage,
} from "../lib/catalogApi";
import {
  fetchPageOverrides,
  savePageOverride,
  uploadPageOverrideImage,
} from "../lib/siteOverridesApi";
import { toProductSlug } from "../lib/productUtils";

const SECTIONS = ["Cleansers", "Serums", "Moisturizers"];

const CONTENT_DEFAULTS = {
  "hero.badge": "Curated Categories",
  "hero.titlePrefix": "Shop by",
  "hero.titleAccent": "Category",
  "hero.description": "Explore our skincare essentials crafted for radiant, healthy skin.",
  "hero.image": heroImg,
  "section.cleansers.title": "Cleansers",
  "section.cleansers.subtitle": "Gentle formulas that purify without stripping.",
  "section.cleansers.image": heroImg,
  "section.serums.title": "Serums",
  "section.serums.subtitle": "Concentrated treatments for targeted skin concerns.",
  "section.serums.image": heroImg,
  "section.moisturizers.title": "Moisturizers",
  "section.moisturizers.subtitle": "Deep hydration for a dewy, healthy complexion.",
  "section.moisturizers.image": heroImg,
  "section.dynamic.subtitle": "Explore products from this category.",
  "section.dynamic.image": heroImg,
};

const defaultCategory = SECTIONS[0];
const MAX_PRODUCT_IMAGES = 4;

const buildImageInput = (url = "") => ({ url, alt: "" });
const buildSizeVariantInput = (label = "", price = "") => ({ label, price });

const buildInitialForm = () => ({
  title: "",
  description: "",
  price: "",
  inStock: true,
  section: defaultCategory,
  category: defaultCategory,
  imageUrl: "",
  imageInputs: [buildImageInput()],
  sizeVariants: [buildSizeVariantInput()],
});

/* ── ANIMATION VARIANTS ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0, 1] } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0, 1] } },
};

/* ── GOLD ACCENT ── */
const GOLD = "#C8A97E";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const isAdmin = user?.role === "admin";

  /* ── STATE ── */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pageOverrides, setPageOverrides] = useState({});

  /* Admin product state */
  const [form, setForm] = useState(buildInitialForm());
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState(buildInitialForm());
  const [editingProductFile, setEditingProductFile] = useState(null);

  /* Admin category state */
  const [newCategoryName, setNewCategoryName] = useState("");

  /* Content editor state */
  const [activeContentTab, setActiveContentTab] = useState("hero");
  const [contentForm, setContentForm] = useState({});

  /* ── LOADING ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [catalog, catalogCats, overrides] = await Promise.all([
          fetchCatalogProducts(),
          fetchCatalogCategories(),
          fetchPageOverrides("categories"),
        ]);
        setProducts(Array.isArray(catalog) ? catalog : []);
        setCategories(Array.isArray(catalogCats) ? catalogCats : []);
        setPageOverrides(overrides?.content || {});
      } catch (err) {
        console.error("Failed to load catalog data", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ── DERIVED ── */
  const categoryNames = useMemo(() => {
    const names = categories.map((c) => c.name);
    return [...new Set(names)];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase().trim();
      const sel = selectedCategory.toLowerCase().trim();
      return cat === sel;
    });
  }, [products, selectedCategory]);

  const sectionProducts = useMemo(() => {
    const map = {};
    SECTIONS.forEach((sec) => {
      map[sec] = products.filter(
        (p) => (p.section || "").toLowerCase().trim() === sec.toLowerCase().trim()
      );
    });
    return map;
  }, [products]);

  const getContent = (title) => {
    const key = title?.toLowerCase().trim();
    const overrides = pageOverrides;
    const defs = CONTENT_DEFAULTS;

    if (title === "hero") {
      return {
        badge: overrides["hero.badge"] ?? defs["hero.badge"],
        titlePrefix: overrides["hero.titlePrefix"] ?? defs["hero.titlePrefix"],
        titleAccent: overrides["hero.titleAccent"] ?? defs["hero.titleAccent"],
        description: overrides["hero.description"] ?? defs["hero.description"],
        image: overrides["hero.image"] ?? defs["hero.image"],
      };
    }

    if (SECTIONS.map((s) => s.toLowerCase()).includes(key)) {
      return {
        title: overrides[`section.${key}.title`] ?? defs[`section.${key}.title`] ?? title,
        subtitle: overrides[`section.${key}.subtitle`] ?? defs[`section.${key}.subtitle`] ?? "",
        image: overrides[`section.${key}.image`] ?? defs[`section.${key}.image`] ?? heroImg,
      };
    }

    return {
      title,
      subtitle: overrides["section.dynamic.subtitle"] ?? defs["section.dynamic.subtitle"],
      image: overrides["section.dynamic.image"] ?? defs["section.dynamic.image"] ?? heroImg,
    };
  };

  const handleViewAll = (title) => {
    navigate("/categories/view-all", {
      state: {
        title,
        products: products.filter(
          (p) => (p.category || "").toLowerCase().trim() === title.toLowerCase().trim()
        ),
        image: heroImg,
      },
    });
  };

  /* ── CRUD PRODUCTS ── */
  const toPayload = (form, imageUrl) => ({
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    inStock: form.inStock,
    section: form.section || "Cleansers",
    category: form.category || "Cleansers",
    imageUrl: imageUrl || heroImg,
  });

  const handleCreateProduct = async () => {
    if (!form.title.trim() || !form.price) return;
    setIsSaving(true);
    try {
      const payload = toPayload(form);
      await createCatalogProduct(payload);
      const updated = await fetchCatalogProducts();
      setProducts(Array.isArray(updated) ? updated : []);
      setForm(buildInitialForm());
    } catch (err) {
      console.error("Failed to create product", err);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (product) => {
    const existingImageUrls = Array.from(
      new Set(
        [
          ...(Array.isArray(product.imageUrls) ? product.imageUrls : []),
          product.imageUrl,
        ].filter(Boolean)
      )
    ).slice(0, MAX_PRODUCT_IMAGES);

    setEditingProductId(product._id);
    setEditingProductForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      inStock: product.inStock ?? true,
      section: product.section || "Cleansers",
      category: product.category || "Cleansers",
      imageUrl: product.imageUrl || "",
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProductId) return;
    setIsSaving(true);
    try {
      let imageUrl = editingProductForm.imageUrl;
      if (editingProductFile) {
        const uploaded = await uploadCatalogProductImage(editingProductFile);
        imageUrl = uploaded.url || uploaded.imageUrl || heroImg;
      }
      const payload = toPayload(editingProductForm, imageUrl);
      await updateCatalogProduct(editingProductId, payload);
      const updated = await fetchCatalogProducts();
      setProducts(Array.isArray(updated) ? updated : []);
      setEditingProductId(null);
    } catch (err) {
      console.error("Failed to update product", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteCatalogProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  /* ── CRUD CATEGORIES ── */
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCatalogCategory(newCategoryName.trim());
      const updated = await fetchCatalogCategories();
      setCategories(Array.isArray(updated) ? updated : []);
      setNewCategoryName("");
    } catch (err) {
      console.error("Failed to create category", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCatalogCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  /* ── CONTENT OVERRIDES ── */
  const saveSingleOverride = async (key, value, kind = "text") => {
    try {
      const result = await savePageOverride("categories", key, value, kind);
      if (result?.content) setPageOverrides(result.content);
    } catch (err) {
      console.error("Failed to save override", err);
    }
  };

  const handleSaveContent = async () => {
    try {
      for (const [key, value] of Object.entries(contentForm)) {
        const kind = key.endsWith(".image") ? "image" : "text";
        await saveSingleOverride(key, value, kind);
      }
      const refreshed = await fetchPageOverrides("categories");
      setPageOverrides(refreshed?.content || {});
      setContentForm({});
    } catch (err) {
      console.error("Failed to save content", err);
    }
  };

  const handleUploadContentImage = async (key, file) => {
    try {
      const result = await uploadPageOverrideImage(file);
      const url = result?.url || result?.imageUrl || heroImg;
      await saveSingleOverride(key, url, "image");
      const refreshed = await fetchPageOverrides("categories");
      setPageOverrides(refreshed?.content || {});
    } catch (err) {
      console.error("Failed to upload content image", err);
    }
  };

  /* ── STYLING HELPERS ── */
  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/20";
  const btnCls =
    "px-6 py-2.5 text-sm font-semibold text-white bg-[#C8A97E] rounded-xl hover:bg-[#B89A6E] transition-all shadow-lg shadow-[#C8A97E]/20 disabled:opacity-50";

  /* ── HERO CONTENT ── */
  const heroContent = getContent("hero");

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAF8] via-white to-[#FAFAF8]">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-[#C8A97E]/5 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#D4B896]/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-[#C8A97E]/30" />
        <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#D4B896]/40" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-[#C8A97E]/20" />

        <div className="relative max-w-[1400px] mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center md:text-left"
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#C8A97E] mb-6"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="w-6 h-px bg-[#C8A97E]" />
                  {heroContent.badge}
                </span>
              </motion.span>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-[#2A2520] leading-[1.1] mb-6"
              >
                {heroContent.titlePrefix}{" "}
                <span className="text-[#C8A97E] relative">
                  {heroContent.titleAccent}
                  {/* SVG underline */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C50 3 100 3 150 10"
                      stroke="#C8A97E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.6"
                    />
                    <path
                      d="M2 10C50 3 100 3 150 10"
                      stroke="#D4B896"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.3"
                      transform="translate(0, 3)"
                    />
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-base md:text-lg text-stone-500 font-light max-w-lg mx-auto md:mx-0 leading-relaxed mb-8"
              >
                {heroContent.description}
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="w-4 h-4 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clinically Tested
                </span>
                <span className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="w-4 h-4 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dermatologist Approved
                </span>
                <span className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="w-4 h-4 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clean Ingredients
                </span>
              </motion.div>
            </motion.div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroContent.image}
                  alt="Skincare Categories"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2520]/40 via-transparent to-transparent" />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[#C8A97E]/10 backdrop-blur border border-[#C8A97E]/20 flex items-center justify-center hidden md:flex">
                <span className="text-[#C8A97E] text-xs font-bold text-center leading-tight">
                  PREMIUM<br />SKINCARE
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ADMIN PANEL ── */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-stone-200 bg-white"
          >
            <div className="max-w-[1400px] mx-auto px-6 py-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-[#2A2520]">Catalog Admin</h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 mb-6 p-1 bg-stone-100 rounded-xl w-fit">
                {[
                  { id: "products", label: "Products" },
                  { id: "categories", label: "Categories" },
                  { id: "content", label: "Content" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveContentTab(tab.id)}
                    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeContentTab === tab.id
                        ? "bg-white text-[#C8A97E] shadow-sm"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Products Tab */}
              {activeContentTab === "products" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      className={inputCls}
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Product Title *"
                    />
                    <input
                      className={inputCls}
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                      type="number"
                      min="0"
                      placeholder="Price *"
                    />
                    <select
                      className={inputCls}
                      value={form.section}
                      onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}
                    >
                      {SECTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      className={inputCls}
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      list="cat-options"
                      placeholder="Category"
                    />
                  </div>
                  <textarea
                    className={inputCls}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="Description"
                  />
                  <datalist id="cat-options">
                    {categoryNames.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded border ${
                          form.inStock
                            ? "bg-[#C8A97E] border-[#C8A97E]"
                            : "border-stone-300 group-hover:border-stone-400"
                        }`}
                      >
                        {form.inStock && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.inStock}
                        onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))}
                      />
                      <span className="text-sm font-medium text-stone-600">In Stock</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleCreateProduct}
                      disabled={isSaving || !form.title.trim() || !form.price}
                      className={btnCls}
                    >
                      {isSaving ? "Adding…" : "Add Product"}
                    </button>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeContentTab === "categories" && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      className={inputCls}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim()}
                      className={btnCls}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full text-sm text-stone-700"
                      >
                        <span>{cat.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="text-stone-400 hover:text-red-500 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeContentTab === "content" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["hero.badge", "hero.titlePrefix", "hero.titleAccent", "hero.description"].map(
                      (key) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">{key}</label>
                          <input
                            className={inputCls}
                            defaultValue={getContent("hero")[key.split(".").pop()] || ""}
                            onBlur={(e) => saveSingleOverride(key, e.target.value)}
                            placeholder={key}
                          />
                        </div>
                      )
                    )}
                  </div>
                  {["cleansers", "serums", "moisturizers"].map((sec) => (
                    <div key={sec} className="border border-stone-100 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
                        {sec}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          className={inputCls}
                          defaultValue={getContent(sec).title || ""}
                          onBlur={(e) => saveSingleOverride(`section.${sec}.title`, e.target.value)}
                          placeholder="Section Title"
                        />
                        <input
                          className={inputCls}
                          defaultValue={getContent(sec).subtitle || ""}
                          onBlur={(e) => saveSingleOverride(`section.${sec}.subtitle`, e.target.value)}
                          placeholder="Section Subtitle"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadContentImage(`section.${sec}.image`, file);
                          }}
                          className="text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#C8A97E]/10 file:text-[#C8A97E] hover:file:bg-[#C8A97E]/20"
                        />
                        <span className="text-xs text-stone-400">Upload section image</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CATEGORY NAV ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          {/* Desktop: wrapped pills */}
          <div className="hidden sm:flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-[#2A2520] text-white shadow-lg"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All Categories
            </button>
            {categoryNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  selectedCategory === name
                    ? "bg-[#C8A97E] text-white shadow-lg shadow-[#C8A97E]/20"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Mobile: dropdown select */}
          <div className="sm:hidden">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition-all focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/20 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C8A97E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1rem",
              }}
            >
              <option value="">All Categories</option>
              {categoryNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-[1400px] mx-auto px-6 py-16 min-h-[50vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#C8A97E] animate-spin" />
            </div>
            <p className="text-sm font-medium text-stone-400 uppercase tracking-[0.2em]">Curating Catalog...</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="space-y-24"
          >
            {selectedCategory ? (
              <SectionGrid
                title={selectedCategory}
                products={filteredProducts}
                content={getContent(selectedCategory)}
                isAdmin={isAdmin}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
                addToCart={addToCart}
              />
            ) : (
              SECTIONS.map((sec) => (
                <SectionGrid
                  key={sec}
                  title={sec}
                  products={sectionProducts[sec]}
                  content={getContent(sec)}
                  isAdmin={isAdmin}
                  onEdit={openEditModal}
                  onDelete={handleDeleteProduct}
                  addToCart={addToCart}
                />
              ))
            )}
          </motion.div>
        )}

        {/* ── EMPTY STATE ── */}
        {!isLoading && selectedCategory && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-600 mb-2">No products found</h3>
            <p className="text-sm text-stone-400 font-light">This category is empty. Check back soon.</p>
          </motion.div>
        )}
      </main>

      {/* ── TRUST BAR ── */}
      <section className="border-t border-stone-200 bg-gradient-to-r from-[#FAFAF8] via-white to-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Dermatologist Approved", desc: "All products meet clinical standards" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Fast & Free Shipping", desc: "On orders above ₹499" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "Easy Returns", desc: "30-day satisfaction guarantee" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-stone-100 hover:border-[#C8A97E]/20 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C8A97E]/20 transition-colors">
                  <svg className="w-5 h-5 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2A2520] mb-0.5">{item.label}</h4>
                  <p className="text-xs text-stone-400 font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editingProductId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2520]/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0, 1] }}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#2A2520]">Edit Product</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProductId(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className={inputCls}
                    value={editingProductForm.title}
                    onChange={(e) => setEditingProductForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Title"
                  />
                  <input
                    className={inputCls}
                    value={editingProductForm.price}
                    onChange={(e) => setEditingProductForm((p) => ({ ...p, price: e.target.value }))}
                    type="number"
                    min="0"
                    placeholder="Price"
                  />
                  <select
                    className={inputCls}
                    value={editingProductForm.section}
                    onChange={(e) => setEditingProductForm((p) => ({ ...p, section: e.target.value }))}
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    className={inputCls}
                    value={editingProductForm.category}
                    onChange={(e) => setEditingProductForm((p) => ({ ...p, category: e.target.value }))}
                    list="cat-options"
                    placeholder="Category"
                  />
                </div>
                <textarea
                  className={inputCls}
                  value={editingProductForm.description}
                  onChange={(e) => setEditingProductForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Description"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className={inputCls}
                    value={editingProductForm.imageUrl}
                    onChange={(e) => setEditingProductForm((p) => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="Image URL"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingProductFile(e.target.files?.[0])}
                    className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#C8A97E]/10 file:text-[#C8A97E] hover:file:bg-[#C8A97E]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded border ${
                      editingProductForm.inStock
                        ? "bg-[#C8A97E] border-[#C8A97E]"
                        : "border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {editingProductForm.inStock && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={editingProductForm.inStock}
                    onChange={(e) => setEditingProductForm((p) => ({ ...p, inStock: e.target.checked }))}
                  />
                  <span className="text-sm font-medium text-stone-600">Item is in stock</span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProductId(null)}
                    className="px-6 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateProduct}
                    disabled={isSaving}
                    className={btnCls}
                  >
                    {isSaving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ── SECTION GRID ── */
function SectionGrid({ title, products, content, isAdmin, onEdit, onDelete, addToCart }) {
  if (products.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeIn}
      className="scroll-mt-32"
    >
      {/* Premium Section Banner */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-10 group shadow-xl">
        <img
          src={content.image || heroImg}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2520]/70 via-[#2A2520]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-16">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#C8A97E] text-xs font-bold uppercase tracking-[0.25em] mb-3"
          >
            EXPLORE
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-white mb-3 tracking-tight">
            {content.title}
          </h2>
          <p className="text-stone-300 text-sm md:text-base font-light max-w-lg">
            {content.subtitle}
          </p>
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8A97E] via-[#D4B896] to-transparent" />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
          >
            <ProductCard
              product={product}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
              addToCart={addToCart}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ product, isAdmin, onEdit, onDelete, addToCart }) {
  const navigate = useNavigate();
  const price = Number(product.price) || 0;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  return (
    <div className="group flex flex-col h-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 rounded-xl mb-4 shadow-sm hover:shadow-xl transition-all duration-500">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist({
              _id: product._id,
              title: product.title,
              name: product.title,
              description: product.description,
              price: product.price,
              image: product.imageUrl || heroImg,
              category: product.category,
              inStock: product.inStock,
            });
          }}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          className={`absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition ${
            wishlisted
              ? "border-rose-200 bg-rose-500 text-white"
              : "border-white/70 bg-white/85 text-[#7f674d] hover:bg-white"
          }`}
        >
          <Heart size={16} className={wishlisted ? "fill-current" : ""} />
        </button>

        {/* Premium Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.category && (
            <span className="bg-white/90 backdrop-blur text-stone-900 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
              {product.category}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Gold Rating Badge */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur text-[#C8A97E] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          4.8
        </div>

        <img
          src={heroImg}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2520]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {isAdmin ? (
            <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(product);
                }}
                className="flex-1 bg-white text-stone-900 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-100 shadow-lg"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(product._id);
                }}
                className="flex-1 bg-red-600 text-white py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-700 shadow-lg"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                if (product.inStock) addToCart?.({ id: product._id, name: product.title, price, image: heroImg });
              }}
              className="w-full bg-[#C8A97E] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#B89A6E] shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          )}
        </div>

        {/* Click layer */}
        <button
          className="absolute inset-0 z-0"
          onClick={() => navigate(`/product/${toProductSlug(product.title)}`, { state: { product } })}
        >
          <span className="sr-only">View {product.title}</span>
        </button>
      </div>

      <div className="flex flex-col flex-grow text-center">
        <h4 className="text-sm md:text-base font-medium text-[#2A2520] line-clamp-1 mb-1">
          {product.title}
        </h4>
        <p className="text-xs text-stone-400 line-clamp-1 mb-2 font-light">
          {product.description}
        </p>
        <div className="mt-auto">
          <span className="text-sm font-semibold text-[#C8A97E]">
            ₹{price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}