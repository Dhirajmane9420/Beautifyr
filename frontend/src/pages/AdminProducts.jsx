import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit,
  Package,
  Settings,
  AlertCircle,
  Filter,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  fetchCatalogProducts,
  fetchCatalogCategories,
  updateCatalogProduct,
  deleteCatalogProduct,
  uploadCatalogProductImage,
} from "../lib/catalogApi";

const GOLD = "#C8A97E";
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
  section: "",
  category: "",
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
    section: product.category || product.section || "",
    category: product.category || product.section || "",
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

function ProductAdminForm({ value, onChange, inputCls, onSubmit, isSaving, submitLabel, error, categoryNames }) {
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
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Product Title *</label>
          <input className={inputCls} value={value.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Product Title" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Category *</label>
          <select
            className={inputCls}
            value={value.category}
            onChange={(e) => {
              updateField("category", e.target.value);
              updateField("section", e.target.value);
            }}
          >
            <option value="">Select Category *</option>
            {categoryNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Description *</label>
        <textarea className={inputCls} value={value.description} onChange={(e) => updateField("description", e.target.value)} rows={3} placeholder="Product Description" />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans">Feature bullet lines (One per line)</label>
        <textarea className={inputCls} value={value.features} onChange={(e) => updateField("features", e.target.value)} rows={3} placeholder="Feature 1&#10;Feature 2" />
      </div>

      <section className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#2A2520]">Product Images</h4>
            <p className="text-xs text-stone-500">Upload up to 7 images. Reorder or replace as needed.</p>
          </div>
          <button type="button" onClick={addImage} disabled={value.imageInputs.length >= MAX_ADMIN_PRODUCT_IMAGES} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#8a6038] border border-stone-200 shadow-sm disabled:opacity-50">
            Add Image
          </button>
        </div>
        <div className="space-y-3">
          {value.imageInputs.map((image, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 md:grid-cols-[72px_1fr_auto] md:items-center">
              {image.url ? (
                <img src={image.url} alt={`Product ${index + 1}`} className="h-16 w-16 rounded-lg border border-stone-200 object-cover mx-auto" />
              ) : (
                <div className="h-16 w-16 rounded-lg border border-stone-200 bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              <div className="grid gap-2">
                <input className={inputCls} value={image.url} onChange={(e) => updateImage(index, e.target.value)} placeholder={`Image ${index + 1} URL`} />
                <input type="file" accept="image/*" onChange={(e) => uploadImage(index, e.target.files?.[0])} className="text-xs text-stone-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C8A97E]/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#8a6038]" />
              </div>
              <div className="flex justify-center gap-2">
                <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-40 bg-stone-50">Up</button>
                <button type="button" onClick={() => moveImage(index, 1)} disabled={index === value.imageInputs.length - 1} className="rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-40 bg-stone-50">Down</button>
                <button type="button" onClick={() => removeImage(index)} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#2A2520]">Product Sizes & Pricing (Inventory)</h4>
            <p className="text-xs text-stone-500">Specify size labels, MRP (original price), sale price, and exact stock counts.</p>
          </div>
          <button type="button" onClick={addSize} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#8a6038] border border-stone-200 shadow-sm">Add Size</button>
        </div>
        <div className="space-y-3">
          {value.sizeStock.map((size, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
              <input className={inputCls} value={size.label} onChange={(e) => updateSize(index, "label", e.target.value)} placeholder="Size, e.g. 250 ml" />
              <input className={inputCls} value={size.originalPrice} onChange={(e) => updateSize(index, "originalPrice", e.target.value)} type="number" min="0" placeholder="MRP" />
              <input className={inputCls} value={size.price} onChange={(e) => updateSize(index, "price", e.target.value)} type="number" min="0" placeholder="Sale price" />
              <input className={inputCls} value={size.stock} onChange={(e) => updateSize(index, "stock", e.target.value)} type="number" min="0" placeholder="Stock quantity" />
              <button type="button" onClick={() => removeSize(index)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600 cursor-pointer">
            <input type="checkbox" checked={value.inStock} onChange={(e) => updateField("inStock", e.target.checked)} className="rounded text-[#C8A97E] focus:ring-[#C8A97E]" />
            Available / In Stock
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600 cursor-pointer">
            <input type="checkbox" checked={value.isNewArrival} onChange={(e) => updateField("isNewArrival", e.target.checked)} className="rounded text-[#C8A97E] focus:ring-[#C8A97E]" />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600 cursor-pointer">
            <input type="checkbox" checked={value.isBestSeller} onChange={(e) => updateField("isBestSeller", e.target.checked)} className="rounded text-[#C8A97E] focus:ring-[#C8A97E]" />
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

export default function AdminProducts() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Filter and Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("all"); // 'all', 'in-stock', 'out-of-stock'
  const [sortBy, setSortBy] = useState("title-asc"); // 'title-asc', 'title-desc', 'price-asc', 'price-desc', 'stock-asc', 'stock-desc'

  // Editing product modal states
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState(buildInitialForm());
  const [productFormError, setProductFormError] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [allProducts, allCategories] = await Promise.all([
        fetchCatalogProducts(),
        fetchCatalogCategories(),
      ]);
      setProducts(allProducts);
      setCategories(allCategories);
    } catch (err) {
      setError(err.message || "Failed to load catalog inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const categoryNames = useMemo(() => {
    const names = categories
      .map((c) => normalizeCategoryName(c.name))
      .filter(Boolean);
    return [...new Set(names)];
  }, [categories]);

  // Derived filtered & sorted products list
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory) {
      const selCat = selectedCategory.toLowerCase().trim();
      result = result.filter(
        (p) => (p.category || "").toLowerCase().trim() === selCat
      );
    }

    // Stock Filter
    if (stockStatus !== "all") {
      result = result.filter((p) => {
        const totalStock = Array.isArray(p.sizeStock)
          ? p.sizeStock.reduce((sum, size) => sum + (Number(size.stock) || 0), 0)
          : Number(p.stock) || 0;
        return stockStatus === "in-stock" ? totalStock > 0 : totalStock <= 0;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const getPrice = (p) => Number(p.price) || 0;
      const getStock = (p) =>
        Array.isArray(p.sizeStock)
          ? p.sizeStock.reduce((sum, size) => sum + (Number(size.stock) || 0), 0)
          : Number(p.stock) || 0;

      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return getPrice(a) - getPrice(b);
        case "price-desc":
          return getPrice(b) - getPrice(a);
        case "stock-asc":
          return getStock(a) - getStock(b);
        case "stock-desc":
          return getStock(b) - getStock(a);
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchQuery, selectedCategory, stockStatus, sortBy]);

  // Edit action handlers
  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setProductFormError("");
    setEditingProductForm(normalizeProductForm(product));
  };

  const validateProductForm = (currentForm) => {
    const imageUrls = currentForm.imageInputs.map((item) => item.url.trim()).filter(Boolean);
    const features = String(currentForm.features || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!currentForm.title.trim()) return "Product title is required.";
    if (!currentForm.category || !currentForm.category.trim()) return "Product category is required.";
    if (!currentForm.description.trim()) return "Product description is required.";
    if (!imageUrls.length) return "Add at least one product image.";
    if (imageUrls.length > MAX_ADMIN_PRODUCT_IMAGES) return `A product can have at most ${MAX_ADMIN_PRODUCT_IMAGES} images.`;
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
      inStock: Boolean(currentForm.inStock) && (stock > 0 || sizeStock.some((size) => size.stock > 0)),
      isNewArrival: Boolean(currentForm.isNewArrival),
      isBestSeller: Boolean(currentForm.isBestSeller),
      section: category,
      category: category,
      imageUrl: imageUrls[0] || "",
      imageUrls,
      sizeStock,
      sizeVariants: [],
      features,
    };
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
      await loadData();
      setEditingProductId(null);
    } catch (err) {
      setProductFormError(err.message || "Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product from catalog?")) return;
    try {
      await deleteCatalogProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/20";

  return (
    <div className="min-h-screen bg-[#f6f1ec] text-[#2A2520] font-sans selection:bg-[#C8A97E] selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:px-16 lg:px-28">
        {/* Page Header */}
        <section className="relative overflow-hidden rounded-4xl border border-[#D4B896]/30 bg-white/75 p-6 shadow-xl backdrop-blur-xl sm:p-8 mb-8">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C8A97E]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#D4B896]/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4B896]/35 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7359] shadow-sm">
                <Package className="h-4 w-4" /> Catalog Inventory
              </div>
              <h1 className="text-4xl font-light tracking-tight text-[#1d1712] sm:text-5xl">
                Product Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7A6E62]">
                Monitor product stock levels, adjust price variations, and toggle flags such as New Arrival or Best Seller.
              </p>
            </div>
            <div className="flex gap-3 text-center shrink-0">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm min-w-[120px]">
                <p className="text-xs text-stone-500 uppercase tracking-wider">Total Items</p>
                <p className="text-3xl font-semibold text-[#2A2520] mt-1">{products.length}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm min-w-[120px]">
                <p className="text-xs text-stone-500 uppercase tracking-wider">Out of Stock</p>
                <p className="text-3xl font-semibold text-rose-600 mt-1">
                  {products.filter((p) => {
                    const totalStock = Array.isArray(p.sizeStock)
                      ? p.sizeStock.reduce((sum, s) => sum + (Number(s.stock) || 0), 0)
                      : Number(p.stock) || 0;
                    return totalStock <= 0;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar: Filters, Search, and Sort */}
        <section className="rounded-3xl border border-[#D4B896]/20 bg-white p-5 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search catalog products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAFAF8] pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#C8A97E]/20 focus:border-[#C8A97E]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 shrink-0">
                <Filter className="h-4 w-4" />
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAFAF8] px-3 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-[#C8A97E]/20 focus:border-[#C8A97E] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C8A97E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "0.8rem",
                }}
              >
                <option value="">All Categories</option>
                {categoryNames.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock status filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAFAF8] px-3 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-[#C8A97E]/20 focus:border-[#C8A97E] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C8A97E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "0.8rem",
                }}
              >
                <option value="all">All Inventory</option>
                <option value="in-stock">Available Items</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 shrink-0">
                <ArrowUpDown className="h-4 w-4" />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAFAF8] px-3 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-[#C8A97E]/20 focus:border-[#C8A97E] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C8A97E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "0.8rem",
                }}
              >
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock-asc">Stock: Low to High</option>
                <option value="stock-desc">Stock: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Catalog Table */}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-4xl border border-dashed border-[#d9c8b0] bg-white/70 px-6 py-20 text-center text-stone-500 shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#C8A97E] animate-spin" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider text-stone-400">Loading catalog items...</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#D4B896]/20 bg-white/95 shadow-xl backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#eadfc8] bg-[#fbf5ee]/80 text-xs font-semibold uppercase tracking-wider text-[#8b7359]">
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price Details</th>
                    <th className="py-4 px-6">Stock Level</th>
                    <th className="py-4 px-6">Badges</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5ebdc]">
                  {processedProducts.length > 0 ? (
                    processedProducts.map((product) => {
                      const totalStock = Array.isArray(product.sizeStock)
                        ? product.sizeStock.reduce((sum, size) => sum + (Number(size.stock) || 0), 0)
                        : Number(product.stock) || 0;

                      return (
                        <tr key={product._id} className="hover:bg-stone-50/50 transition">
                          {/* Image & Title */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.title}
                                  className="h-14 w-14 rounded-2xl border border-stone-200 object-cover shadow-sm"
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-2xl border border-stone-100 bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-stone-900 leading-tight">
                                  {product.title}
                                </p>
                                <p className="text-xs text-stone-400 mt-1 font-light max-w-[240px] truncate">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-6">
                            <span className="rounded-full bg-[#C8A97E]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#8a6038]">
                              {product.category || "General"}
                            </span>
                          </td>

                          {/* Prices */}
                          <td className="py-4 px-6">
                            <div className="text-sm font-semibold text-stone-800">
                              Rs. {Number(product.price).toLocaleString("en-IN")}
                            </div>
                            {product.originalPrice && Number(product.originalPrice) > Number(product.price) ? (
                              <div className="text-xs text-stone-400 line-through mt-0.5">
                                Rs. {Number(product.originalPrice).toLocaleString("en-IN")}
                              </div>
                            ) : null}
                          </td>

                          {/* Stock variant details */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${totalStock > 0 ? "text-[#7f674d]" : "text-rose-600"}`}>
                                {totalStock > 0 ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-[#8a6038] shrink-0" />
                                    <span>{totalStock} in stock</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 shrink-0" />
                                    <span>Out of stock</span>
                                  </>
                                )}
                              </span>

                              {/* Size Stock breakdown details */}
                              {Array.isArray(product.sizeStock) && product.sizeStock.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {product.sizeStock.map((size, idx) => (
                                    <span
                                      key={idx}
                                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                                        Number(size.stock) > 0
                                          ? "border-stone-200 bg-stone-50 text-stone-500"
                                          : "border-rose-100 bg-rose-50 text-rose-500"
                                      }`}
                                    >
                                      {size.label}: {size.stock}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </td>

                          {/* Badges flags */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1.5">
                              {product.isNewArrival ? (
                                <span className="inline-block text-[9px] uppercase font-bold tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full w-fit">
                                  New
                                </span>
                              ) : null}
                              {product.isBestSeller ? (
                                <span className="inline-block text-[9px] uppercase font-bold tracking-wider bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-full w-fit">
                                  Best Seller
                                </span>
                              ) : null}
                              {!product.isNewArrival && !product.isBestSeller ? (
                                <span className="text-xs text-stone-400 font-light">-</span>
                              ) : null}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-[#C8A97E]/10 hover:text-[#8a6038] transition shadow-sm"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 rounded-xl bg-stone-100 text-rose-600 hover:bg-rose-50 transition shadow-sm"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 px-6 text-center text-sm text-stone-400 font-light bg-stone-50/50">
                        No products match your filter search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProductId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2520]/45 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
              className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center text-[#8a6038]">
                    <Settings className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2A2520]">Edit Catalog Product</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProductId(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition"
                >
                  <XCircle className="h-5 w-5" />
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
                  categoryNames={categoryNames}
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
