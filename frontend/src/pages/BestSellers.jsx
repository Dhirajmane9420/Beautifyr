import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  createCatalogProduct,
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const buildInitialForm = () => ({
  title: "",
  description: "",
  price: "",
  inStock: true,
  section: "Best Sellers",
  category: "Serum",
  imageUrl: "",
});

function BestSellers() {
  const { user } = useAuth();
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

  const [newProductForm, setNewProductForm] = useState(buildInitialForm());
  const [newProductFile, setNewProductFile] = useState(null);

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
        const bestSellerProducts = allProducts.filter((item) => item.section === "Best Sellers");
        setProducts(bestSellerProducts);
      } catch {
        if (!isMounted) return;
        setProducts([]);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const withComputed = useMemo(() => {
    return products.map((product) => {
      const numericPrice = Number(product.price) || 0;
      const rating = 4.6 + ((numericPrice % 5) * 0.08);
      const soldCount = 5000 + ((numericPrice % 17) * 420);
      return {
        ...product,
        numericPrice,
        rating: Number(rating.toFixed(1)),
        sold: `${(soldCount / 1000).toFixed(1)}k`,
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
      const ratingMatch = product.rating >= parsedMinimumRating;
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
      sorted.sort((a, b) => b.rating - a.rating);
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
    section: "Best Sellers",
    category: form.category.trim() || "Serum",
    imageUrl,
  });

  const handleCreateProduct = async () => {
    try {
      setIsSaving(true);
      setAdminNotice("");

      let imageUrl = newProductForm.imageUrl.trim();
      if (newProductFile) {
        imageUrl = await uploadCatalogProductImage(newProductFile);
      }

      const payload = toPayload(newProductForm, imageUrl);
      const created = await createCatalogProduct(payload);
      setProducts((current) => [created, ...current]);

      setNewProductForm(buildInitialForm());
      setNewProductFile(null);
      setAdminNotice("Best seller added.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to add product.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setEditingProductForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price || ""),
      inStock: Boolean(product.inStock),
      section: "Best Sellers",
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

      setProducts((current) => current.map((item) => (item._id === editingProductId ? updated : item)));
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
    <div className="min-h-screen bg-linear-to-b from-[#f4eee6] via-[#efe6db] to-[#e7dbcd] text-[#2A2520] font-sans selection:bg-[#E8DCCB] selection:text-[#2A2520]">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[#2A2520]/10 px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 md:px-12 lg:px-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end"
        >
          <div className="lg:col-span-7 flex flex-col justify-end">
            <motion.p variants={fadeUp} className="text-[#8B7E72] text-xs tracking-[0.3em] uppercase mb-6">
              The Cult Classics
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.05]">
              Most <span className="font-serif italic text-[#8B7E72]">Desired.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-8 max-w-md text-[#7A6E62] font-light leading-relaxed text-lg">
              Explore the formulations that have defined our sanctuary. Clinically proven, universally adored.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="lg:col-span-5 h-[300px] sm:h-[400px] w-full relative rounded-t-[10rem] rounded-b-3xl overflow-hidden">
            <img
              src={visibleProducts[0]?.imageUrl || products[0]?.imageUrl || "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=900&q=80"}
              alt="Most Desired"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2A2520]/10 mix-blend-overlay"></div>
          </motion.div>
        </motion.div>
      </section>

      {isAdmin ? (
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 md:px-12 lg:px-24">
          <div className="rounded-2xl border border-[#dcc7ae] bg-[#f9efe3] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#7f674d]">Admin Best Sellers Manager</h3>
              {adminNotice ? <p className="text-xs font-medium text-[#8a6038]">{adminNotice}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input
                value={newProductForm.title}
                onChange={(event) => setNewProductForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Product title"
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
              <input
                value={newProductForm.price}
                onChange={(event) => setNewProductForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                placeholder="Price"
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
              <select
                value={newProductForm.category}
                onChange={(event) => setNewProductForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              >
                <option value="Serum">Serum</option>
                <option value="Cream">Cream</option>
                <option value="Sunscreen">Sunscreen</option>
                <option value="Gel">Gel</option>
              </select>
            </div>

            <textarea
              value={newProductForm.description}
              onChange={(event) =>
                setNewProductForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={3}
              placeholder="Product description"
              className="mt-3 w-full rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={newProductForm.imageUrl}
                onChange={(event) => setNewProductForm((current) => ({ ...current, imageUrl: event.target.value }))}
                placeholder="Image URL (optional if uploading file)"
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
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
                  setNewProductFile(file);
                }}
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-[#6e5947]">
                <input
                  type="checkbox"
                  checked={newProductForm.inStock}
                  onChange={(event) =>
                    setNewProductForm((current) => ({ ...current, inStock: event.target.checked }))
                  }
                />
                In stock
              </label>
              <button
                type="button"
                onClick={handleCreateProduct}
                disabled={isSaving}
                className="rounded-xl bg-[#8a6038] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Add Best Seller"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8"
        >
          <div className="flex flex-wrap gap-8 border-b border-[#2A2520]/10 pb-4 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm uppercase tracking-widest transition-all duration-300 relative pb-2 ${
                  activeCategory === category
                    ? "text-[#2A2520] font-medium"
                    : "text-[#AFA192] font-light hover:text-[#2A2520]"
                }`}
              >
                {category}
                {activeCategory === category && (
                  <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 right-0 h-px bg-[#2A2520]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex w-full flex-col items-start gap-4 md:w-auto md:items-end">
            <p className="text-sm font-light text-[#8B7E72] uppercase tracking-widest shrink-0">
              {visibleProducts.length} Results
            </p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-full border border-[#d8c8b6] bg-[#f7efe5] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6e5947] outline-none"
            >
              <option value="featured">Featured</option>
              <option value="top-rated">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        <div className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-[#dcc7ae] bg-[#f9efe3] p-4 sm:p-5 md:grid-cols-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b7359]">Price Range</p>
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="w-full rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-xs font-medium text-[#6e5947] outline-none"
            >
              {priceRanges.map((range) => (
                <option key={range.key} value={range.key}>{range.label}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b7359]">Minimum Rating</p>
            <select
              value={minimumRating}
              onChange={(event) => setMinimumRating(event.target.value)}
              className="w-full rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-xs font-medium text-[#6e5947] outline-none"
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
              className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                inStockOnly
                  ? "border-[#8a6038] bg-[#8a6038] text-white"
                  : "border-[#d8c8b6] bg-[#fff8ef] text-[#6e5947]"
              }`}
            >
              {inStockOnly ? "In Stock Only" : "Show All Stock"}
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetAdvancedFilters}
              disabled={!hasAdvancedFilters && sortBy === "featured"}
              className="w-full rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6e5947] transition hover:bg-[#f4e7d8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="min-h-[50vh]">
          <AnimatePresence mode="wait">
            {!isLoading && visibleProducts.length > 0 ? (
              <motion.div
                key="grid"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleProducts.map((product) => {
                  const mrp = Number(product.originalPrice) || product.numericPrice;
                  const hasDiscount = mrp > product.numericPrice;

                  return (
                    <motion.div layout variants={fadeUp} key={product._id} className="group cursor-pointer flex flex-col">
                      <div className="relative overflow-hidden rounded-[2rem] bg-[#F7F4F0] mb-6 aspect-[4/5] flex items-center justify-center p-8">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover shadow-2xl transform group-hover:scale-105 transition duration-1000 ease-[0.16,1,0.3,1]"
                        />

                        <div className="absolute inset-x-4 bottom-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
                          <button className="w-full rounded-2xl border border-[#d8c8b6] bg-[#f2e8dc]/85 py-4 text-sm font-medium uppercase tracking-widest text-[#2A2520] backdrop-blur-xl transition-colors hover:bg-[#eadfce]">
                            Add to Cart — Rs {product.numericPrice}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col px-2">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <h3 className="text-lg font-light text-[#2A2520]">{product.title}</h3>
                          <span className="rounded-full border border-[#e2cfb8] bg-[#f9f1e7] px-2.5 py-1 text-[11px] font-semibold text-[#7f674d]">
                            {product.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-[#8B7E72] font-light">
                          {product.category} • {product.sold} sold • {product.inStock ? "In Stock" : "Out of Stock"}
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#8a6038]">
                          Rs {product.numericPrice}{" "}
                          {hasDiscount ? (
                            <span className="ml-1 text-sm font-normal text-[#9d9388] line-through">Rs {mrp}</span>
                          ) : null}
                        </p>
                        <p className="mt-2 text-sm text-[#6f5a47] line-clamp-2">{product.description}</p>

                        {isAdmin ? (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="flex-1 rounded-xl border border-[#8a6038] bg-[#8a6038] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-red-700"
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
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 text-center flex flex-col items-center justify-center">
                <p className="text-xl font-light text-[#7A6E62]">No formulations found in this category.</p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-6 border-b border-[#2A2520] pb-1 text-sm uppercase tracking-widest hover:text-[#8B7E72] hover:border-[#8B7E72] transition-colors"
                >
                  View All Classics
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {isLoading ? (
            <div className="rounded-2xl border border-[#dcc7ae] bg-[#f9efe3] px-5 py-10 text-center text-[#6e5947]">
              Loading best sellers...
            </div>
          ) : null}
        </div>
      </section>

      {editingProductId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#5f3f25]">Edit Best Seller</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setEditingProductFile(null);
                }}
                className="text-sm text-[#6e5947]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={editingProductForm.title}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Product title"
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
              <input
                value={editingProductForm.price}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                placeholder="Price"
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />

              <select
                value={editingProductForm.category}
                onChange={(event) => setEditingProductForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
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
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
            </div>

            <textarea
              value={editingProductForm.description}
              onChange={(event) =>
                setEditingProductForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={3}
              placeholder="Description"
              className="mt-3 w-full rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
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
                className="rounded-xl border border-[#d8c8b6] bg-[#fff8ef] px-3 py-2 text-sm"
              />
              <label className="inline-flex items-center gap-2 text-sm text-[#6e5947]">
                <input
                  type="checkbox"
                  checked={editingProductForm.inStock}
                  onChange={(event) =>
                    setEditingProductForm((current) => ({ ...current, inStock: event.target.checked }))
                  }
                />
                In stock
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setEditingProductFile(null);
                }}
                className="rounded-xl border border-[#d8c8b6] bg-white px-4 py-2 text-sm text-[#6e5947]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProduct}
                disabled={isSaving}
                className="rounded-xl bg-[#8a6038] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-7xl px-5 pb-6 sm:px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-[#dfcdb7] bg-[#f9efe3] p-6 md:grid-cols-3 md:p-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b7359]">Why Customers Love These</p>
            <h3 className="mt-2 text-2xl font-light text-[#2A2520]">Top Picks, Real Results</h3>
          </div>
          <div className="rounded-2xl border border-[#e3d3be] bg-[#fff8ef] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8b7359]">Fast Moving</p>
            <p className="mt-2 text-sm text-[#6f5a47]">Most products in this list restock every 7-10 days due to demand.</p>
          </div>
          <div className="rounded-2xl border border-[#e3d3be] bg-[#fff8ef] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8b7359]">Dermatologist Curated</p>
            <p className="mt-2 text-sm text-[#6f5a47]">Each bestseller is selected for efficacy, tolerance, and routine compatibility.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BestSellers;
