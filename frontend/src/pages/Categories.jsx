import heroImg from "../assets/sc1.jpg";
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
import categoryhero from "../assets/categoryhero.jpg";
import categoryhero2 from "../assets/sc1.jpg";
const SECTIONS = ["Cleansers", "Serums", "Moisturizers", "Acne Care", "Brightening", "Exfoliators", "Eye Care", "Kits and Combos", "Lip Care", "Sunscreens", "Toners", "Travel Minis"];

const CONTENT_DEFAULTS = {
  "hero.badge": "Curated Categories",
  "hero.titlePrefix": "Shop by",
  "hero.titleAccent": "Category",
  "hero.description": "Explore our skincare essentials crafted for radiant, healthy skin.",
  "hero.image": categoryhero2,
  "section.cleansers.title": "Cleansers",
  "section.cleansers.subtitle": "Gentle formulas that purify without stripping.",
  "section.cleansers.image": categoryhero,
  "section.serums.title": "Serums",
  "section.serums.subtitle": "Concentrated treatments for targeted skin concerns.",
  "section.serums.image": categoryhero,
  "section.moisturizers.title": "Moisturizers",
  "section.moisturizers.subtitle": "Deep hydration for a dewy, healthy complexion.",
  "section.moisturizers.image": categoryhero,
  "section.dynamic.subtitle": "Explore products from this category.",
  "section.dynamic.image": categoryhero,
};

const defaultCategory = SECTIONS[0];
const MAX_ADMIN_PRODUCT_IMAGES = 7;
const buildImageInput = (url = "") => ({ url });
const buildSizeInput = (label = "", originalPrice = "", price = "", stock = "") => ({ label, originalPrice, price, stock });

const normalizeCategoryName = (name = "") => {
  const trimmed = String(name || "").trim();
  const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (["clenser", "clensers", "cleanser", "cleansers"].includes(key)) {
    return "Cleansers";
  }

  return trimmed;
};

const buildInitialForm = () => ({
  title: "",
  description: "",
  inStock: true,
  isNewArrival: false,
  isBestSeller: false,
  section: defaultCategory,
  category: defaultCategory,
  imageUrl: "",
  imageInputs: [buildImageInput()],
  sizeStock: [buildSizeInput("250 ml"), buildSizeInput("500 ml")],
  sizeVariants: [],
  features: "",
});

const normalizeProductForm = (product = {}) => {
  const imageUrls = Array.isArray(product.imageUrls) && product.imageUrls.length
    ? product.imageUrls
    : [product.imageUrl].filter(Boolean);
  const sizes = Array.isArray(product.sizeStock) && product.sizeStock.length
    ? product.sizeStock
    : [];

  return {
    title: product.title || "",
    description: product.description || "",
    inStock: product.inStock ?? true,
    isNewArrival: product.isNewArrival ?? product.section === "New Arrivals",
    isBestSeller: product.isBestSeller ?? product.section === "Best Sellers",
    section: product.section || "Cleansers",
    category: product.section,
    imageUrl: product.imageUrl || imageUrls[0] || "",
    imageInputs: imageUrls.length ? imageUrls.slice(0, MAX_ADMIN_PRODUCT_IMAGES).map(buildImageInput) : [buildImageInput()],
    sizeStock: sizes.length
      ? sizes.map((size) => buildSizeInput(
        size.label || "",
        String(size.originalPrice ?? product.originalPrice ?? size.price ?? product.price ?? ""),
        String(size.price ?? product.discountedPrice ?? product.price ?? ""),
        String(size.stock ?? "")
      ))
      : [buildSizeInput("250 ml"), buildSizeInput("500 ml")],
    sizeVariants: [],
    features: Array.isArray(product.features) ? product.features.join("\n") : "",
  };
};

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

function ProductAdminForm({ value, onChange, inputCls, onSubmit, isSaving, submitLabel, error }) {
  const updateField = (field, nextValue) => onChange((prev) => ({ ...prev, [field]: nextValue }));

  const updateImage = (index, url) => {
    onChange((prev) => ({
      ...prev,
      imageInputs: prev.imageInputs.map((item, itemIndex) => itemIndex === index ? { ...item, url } : item),
    }));
  };

  const uploadImage = async (index, file) => {
    if (!file) return;
    try {
      const uploadedUrl = await uploadCatalogProductImage(file);
      updateImage(index, uploadedUrl || "");
    } catch (err) {
      console.error("Failed to upload product image", err);
    }
  };

  const addImage = () => {
    onChange((prev) => {
      if (prev.imageInputs.length >= MAX_ADMIN_PRODUCT_IMAGES) return prev;
      return { ...prev, imageInputs: [...prev.imageInputs, buildImageInput()] };
    });
  };

  const removeImage = (index) => {
    onChange((prev) => ({
      ...prev,
      imageInputs: prev.imageInputs.length > 1
        ? prev.imageInputs.filter((_, itemIndex) => itemIndex !== index)
        : [buildImageInput()],
    }));
  };

  const moveImage = (index, direction) => {
    onChange((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.imageInputs.length) return prev;
      const imageInputs = [...prev.imageInputs];
      [imageInputs[index], imageInputs[nextIndex]] = [imageInputs[nextIndex], imageInputs[index]];
      return { ...prev, imageInputs };
    });
  };

  const updateSize = (index, field, nextValue) => {
    onChange((prev) => ({
      ...prev,
      sizeStock: prev.sizeStock.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: nextValue } : item),
    }));
  };

  const addSize = () => {
    onChange((prev) => ({ ...prev, sizeStock: [...prev.sizeStock, buildSizeInput()] }));
  };

  const removeSize = (index) => {
    onChange((prev) => ({
      ...prev,
      sizeStock: prev.sizeStock.length > 1
        ? prev.sizeStock.filter((_, itemIndex) => itemIndex !== index)
        : [buildSizeInput()],
    }));
  };

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <input className={inputCls} value={value.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Product Title *" />
        <select className={inputCls} value={value.section} onChange={(e) => updateField("section", e.target.value)}>
          {SECTIONS.map((section) => <option key={section} value={section}>{section}</option>)}
        </select>
        <input className={inputCls} value={value.category} onChange={(e) => updateField("category", e.target.value)} list="cat-options" placeholder="Category" />
      </div>

      <textarea className={inputCls} value={value.description} onChange={(e) => updateField("description", e.target.value)} rows={3} placeholder="Product Description *" />

      <textarea className={inputCls} value={value.features} onChange={(e) => updateField("features", e.target.value)} rows={3} placeholder="Product page feature lines, one per line" />

      <section className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#2A2520]">Product Images</h4>
            <p className="text-xs text-stone-500">Upload, replace, remove, or reorder up to 7 images.</p>
          </div>
          <button type="button" onClick={addImage} disabled={value.imageInputs.length >= MAX_ADMIN_PRODUCT_IMAGES} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#8a6038] shadow-sm disabled:opacity-50">
            Add Image
          </button>
        </div>
        <div className="space-y-3">
          {value.imageInputs.map((image, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 md:grid-cols-[72px_1fr_auto] md:items-center">
              <img src={image.url || heroImg} alt={`Product ${index + 1}`} className="h-16 w-16 rounded-lg border border-stone-200 object-cover" />
              <div className="grid gap-2">
                <input className={inputCls} value={image.url} onChange={(e) => updateImage(index, e.target.value)} placeholder={`Image ${index + 1} URL`} />
                <input type="file" accept="image/*" onChange={(e) => uploadImage(index, e.target.files?.[0])} className="text-xs text-stone-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C8A97E]/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#8a6038]" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded-lg border px-3 py-2 text-xs disabled:opacity-40">Up</button>
                <button type="button" onClick={() => moveImage(index, 1)} disabled={index === value.imageInputs.length - 1} className="rounded-lg border px-3 py-2 text-xs disabled:opacity-40">Down</button>
                <button type="button" onClick={() => removeImage(index)} className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#2A2520]">Product Sizes and Pricing</h4>
            <p className="text-xs text-stone-500">Examples: 250 ml, 500 ml. Set MRP, sale price, and stock for each size.</p>
          </div>
          <button type="button" onClick={addSize} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#8a6038] shadow-sm">Add Size</button>
        </div>
        <div className="space-y-3">
          {value.sizeStock.map((size, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
              <input className={inputCls} value={size.label} onChange={(e) => updateSize(index, "label", e.target.value)} placeholder="Size, e.g. 250 ml" />
              <input className={inputCls} value={size.originalPrice} onChange={(e) => updateSize(index, "originalPrice", e.target.value)} type="number" min="0" placeholder="MRP" />
              <input className={inputCls} value={size.price} onChange={(e) => updateSize(index, "price", e.target.value)} type="number" min="0" placeholder="Sale price" />
              <input className={inputCls} value={size.stock} onChange={(e) => updateSize(index, "stock", e.target.value)} type="number" min="0" placeholder="Size stock" />
              <button type="button" onClick={() => removeSize(index)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <input type="checkbox" checked={value.inStock} onChange={(e) => updateField("inStock", e.target.checked)} />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <input type="checkbox" checked={value.isNewArrival} onChange={(e) => updateField("isNewArrival", e.target.checked)} />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <input type="checkbox" checked={value.isBestSeller} onChange={(e) => updateField("isBestSeller", e.target.checked)} />
            Best Seller
          </label>
        </div>
        <button type="button" onClick={onSubmit} disabled={isSaving} className="px-6 py-2.5 text-sm font-semibold text-white bg-[#C8A97E] rounded-xl hover:bg-[#B89A6E] transition-all shadow-lg shadow-[#C8A97E]/20 disabled:opacity-50">
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
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
  const [productFormError, setProductFormError] = useState("");

  /* Admin category state */
  const [newCategoryName, setNewCategoryName] = useState("");

  /* Content editor state */
  const [activeContentTab, setActiveContentTab] = useState("hero");

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
    const names = categories
      .map((c) => normalizeCategoryName(c.name))
      .filter(Boolean);
    return [...new Set(names)];
  }, [categories]);

  const categoryChips = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      const name = normalizeCategoryName(category.name);
      if (name && !map.has(name)) {
        map.set(name, { ...category, name });
      }
    });
    return [...map.values()];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => {
      const cat = normalizeCategoryName(p.category).toLowerCase().trim();
      const sel = normalizeCategoryName(selectedCategory).toLowerCase().trim();
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

  /* ── CRUD PRODUCTS ── */
  const validateProductForm = (currentForm) => {
    const imageUrls = currentForm.imageInputs.map((item) => item.url.trim()).filter(Boolean);
    const features = String(currentForm.features || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!currentForm.title.trim()) return "Product title is required.";
    if (!currentForm.description.trim()) return "Product description is required.";
    if (!imageUrls.length) return "Add at least one product image.";
    if (imageUrls.length > MAX_ADMIN_PRODUCT_IMAGES) return "A product can have at most 7 images.";
    if (features.length > 12) return "Keep product page feature lines to 12 or fewer.";

    const invalidSize = currentForm.sizeStock
      .filter((size) => size.label.trim() || size.originalPrice || size.price || size.stock)
      .find((size) => {
        const sizeOriginalPrice = Number(size.originalPrice);
        const sizePrice = Number(size.price);
        const sizeStock = Number(size.stock);
        return !size.label.trim() ||
          !Number.isFinite(sizeOriginalPrice) ||
          sizeOriginalPrice < 0 ||
          !Number.isFinite(sizePrice) ||
          sizePrice < 0 ||
          sizePrice > sizeOriginalPrice ||
          !Number.isFinite(sizeStock) ||
          sizeStock < 0;
      });

    if (invalidSize) return "Each size needs a label, valid MRP, sale price, and stock. Sale price cannot exceed MRP.";
    if (!currentForm.sizeStock.some((size) => size.label.trim() && size.price && size.originalPrice)) return "Add at least one product size with MRP and sale price.";

    return "";
  };

  const toPayload = (currentForm) => {
    const imageUrls = currentForm.imageInputs.map((item) => item.url.trim()).filter(Boolean);
    const features = String(currentForm.features || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    const sizeStock = currentForm.sizeStock
      .filter((size) => size.label.trim() || size.originalPrice || size.price || size.stock)
      .map((size) => ({
        label: size.label.trim(),
        originalPrice: Number(size.originalPrice),
        price: Number(size.price),
        stock: Math.max(0, Math.floor(Number(size.stock) || 0)),
      }));
    const primarySize = sizeStock[0] || { originalPrice: 0, price: 0, stock: 0 };
    const stock = sizeStock.reduce((sum, size) => sum + size.stock, 0);
    const category = normalizeCategoryName(currentForm.category) || "Cleansers";

    return {
      title: currentForm.title.trim(),
      description: currentForm.description.trim(),

      originalPrice: primarySize.originalPrice,
      price: primarySize.price,
      discountedPrice: primarySize.price,

      stock,
      inStock:
        Boolean(currentForm.inStock) &&
        (stock > 0 || sizeStock.some((size) => size.stock > 0)),

      isNewArrival: Boolean(currentForm.isNewArrival),
      isBestSeller: Boolean(currentForm.isBestSeller),

      section: category,
      category: category,   // <-- ADD THIS

      imageUrl: imageUrls[0] || heroImg,
      imageUrls,

      sizeStock,
      sizeVariants: [],
      features,
    };
  };

  const handleCreateProduct = async () => {
    const validationError = validateProductForm(form);
    if (validationError) {
      setProductFormError(validationError);
      return;
    }
    setIsSaving(true);
    try {
      setProductFormError("");
      //console.log("CURRENT FORM:", currentForm);
      const payload = toPayload(form);
      //       console.log({
      //   title: payload.title,
      //   description: payload.description,
      //   section: payload.section,
      //   category: payload.category,
      //   imageUrl: payload.imageUrl,
      //   imageUrls: payload.imageUrls,
      // });
      await createCatalogProduct(payload);
      const updated = await fetchCatalogProducts();
      setProducts(Array.isArray(updated) ? updated : []);
      setForm(buildInitialForm());
    } catch (err) {
      setProductFormError(err.message || "Failed to create product.");
      console.error("Failed to create product", err);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setProductFormError("");
    setEditingProductForm(normalizeProductForm(product));
  };

  const handleUpdateProduct = async () => {
    if (!editingProductId) return;
    const validationError = validateProductForm(editingProductForm);
    if (validationError) {
      setProductFormError(validationError);
      return;
    }
    setIsSaving(true);
    try {
      setProductFormError("");
      const payload = toPayload(editingProductForm);
      await updateCatalogProduct(editingProductId, payload);
      const updated = await fetchCatalogProducts();
      setProducts(Array.isArray(updated) ? updated : []);
      setEditingProductId(null);
    } catch (err) {
      setProductFormError(err.message || "Failed to update product.");
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
      await createCatalogCategory(normalizeCategoryName(newCategoryName));
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
                    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeContentTab === tab.id
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
                <div className="space-y-4">
                  <datalist id="cat-options">
                    {categoryNames.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                  <ProductAdminForm
                    value={form}
                    onChange={setForm}
                    inputCls={inputCls}
                    onSubmit={handleCreateProduct}
                    isSaving={isSaving}
                    submitLabel="Add Product"
                    error={productFormError}
                  />
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
                    {categoryChips.map((cat) => (
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
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!selectedCategory
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
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === name
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
              className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden"
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

              <div className="max-h-[75vh] overflow-y-auto p-6">
                <ProductAdminForm
                  value={editingProductForm}
                  onChange={setEditingProductForm}
                  inputCls={inputCls}
                  onSubmit={handleUpdateProduct}
                  isSaving={isSaving}
                  submitLabel="Save Changes"
                  error={productFormError}
                />
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
function SectionGrid({ products, content, isAdmin, onEdit, onDelete, addToCart }) {
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
  const originalPrice = Number(product.originalPrice) || price;
  const productImage = product.imageUrls?.[0] || product.imageUrl || heroImg;
  const stockCount = Number(product.stock) || 0;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);
  const ratingValue = Number(product.averageRating ?? product.rating);
  const reviewCount = Number(product.reviewCount ?? product.reviewsCount ?? product.ratingCount ?? product.ratingsCount ?? 0);
  const hasUserRating = Number.isFinite(ratingValue) && ratingValue > 0 && reviewCount > 0;

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
              image: productImage,
              category: product.category,
              inStock: product.inStock,
            });
          }}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          className={`absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition ${wishlisted
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

        {hasUserRating && (
          <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur text-[#C8A97E] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {ratingValue.toFixed(1)}
          </div>
        )}

        <img
          src={productImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {!isAdmin ? (
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A2520]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <button
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                if (product.inStock) {
                  addToCart?.({
                    id: product._id,
                    name: product.title,
                    price,
                    image: productImage,
                    category: product.category || product.section || "Skincare",
                  });
                }
              }}
              className="w-full bg-[#C8A97E] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#B89A6E] shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        ) : null}

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
        <p className="mb-2 text-[11px] font-medium text-stone-500">
          Stock: {stockCount}
        </p>
        <div className="mt-auto">
          <span className="text-sm font-semibold text-[#C8A97E]">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice > price ? (
            <span className="ml-2 text-xs text-stone-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          ) : null}
        </div>
        {isAdmin ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(product)}
              className="rounded-lg border border-[#C8A97E]/40 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8a6038] shadow-sm transition hover:bg-[#C8A97E] hover:text-white"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(product._id)}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
