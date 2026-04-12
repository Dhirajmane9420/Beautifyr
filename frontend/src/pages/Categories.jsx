import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
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

const SECTION_OPTIONS = ["Cleansers", "Serums", "Moisturizers"];

const CONTENT_DEFAULTS = {
  "hero.badge": "Curated Categories",
  "hero.titlePrefix": "Shop by",
  "hero.titleAccent": "Category",
  "hero.description":
    "Explore our skincare essentials crafted for radiant, healthy skin.",
  "hero.image":
    "https://images.unsplash.com/photo-1556227702-d1e4e7b8c232?auto=format&fit=crop&w=900&q=80",
  "section.cleansers.title": "Cleansers",
  "section.cleansers.subtitle": "High-performance formulas for healthy, glowing skin.",
  "section.cleansers.image":
    "https://images.unsplash.com/photo-1556227702-d1e4e7b8c232?auto=format&fit=crop&w=900&q=80",
  "section.serums.title": "Serums",
  "section.serums.subtitle": "High-performance formulas for healthy, glowing skin.",
  "section.serums.image":
    "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=900&q=80",
  "section.moisturizers.title": "Moisturizers",
  "section.moisturizers.subtitle": "High-performance formulas for healthy, glowing skin.",
  "section.moisturizers.image":
    "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=900&q=80",
  "section.dynamic.subtitle": "Explore products from this category.",
  "section.dynamic.image":
    "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=900&q=80",
};

const sectionStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const buildInitialProductForm = () => ({
  title: "",
  description: "",
  price: "",
  inStock: true,
  section: "Cleansers",
  category: "Cleansers",
  imageUrl: "",
});

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageOverrides, setPageOverrides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [adminNotice, setAdminNotice] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");

  const [newProductForm, setNewProductForm] = useState(buildInitialProductForm());
  const [newProductFile, setNewProductFile] = useState(null);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState(buildInitialProductForm());
  const [editingProductFile, setEditingProductFile] = useState(null);

  const [contentDraft, setContentDraft] = useState(CONTENT_DEFAULTS);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);

        const [catalog, catalogCategories, overrides] = await Promise.all([
          fetchCatalogProducts(),
          fetchCatalogCategories(),
          fetchPageOverrides("categories"),
        ]);

        if (!isMounted) return;

        setProducts(catalog);
        setCategories(catalogCategories);
        setPageOverrides(overrides);
      } catch {
        if (!isMounted) return;
        setProducts([]);
        setCategories([]);
        setPageOverrides([]);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const overrideMap = useMemo(() => {
    const map = new Map();
    pageOverrides.forEach((item) => {
      map.set(item.key, item.value);
    });
    return map;
  }, [pageOverrides]);

  const pageContent = useMemo(() => {
    const merged = { ...CONTENT_DEFAULTS };
    Object.keys(merged).forEach((key) => {
      if (overrideMap.has(key)) {
        merged[key] = overrideMap.get(key);
      }
    });
    return merged;
  }, [overrideMap]);

  useEffect(() => {
    setContentDraft(pageContent);
  }, [pageContent]);

  const pillNames = useMemo(() => {
    const names = categories.map((item) => item.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [categories]);

  const selectedCategoryProducts = useMemo(() => {
    if (!selectedCategory) return [];

    if (SECTION_OPTIONS.includes(selectedCategory)) {
      return products.filter((item) => item.section === selectedCategory);
    }

    return products.filter((item) => item.category === selectedCategory);
  }, [products, selectedCategory]);

  const sectionProducts = useMemo(() => {
    return {
      Cleansers: products.filter((item) => item.section === "Cleansers"),
      Serums: products.filter((item) => item.section === "Serums"),
      Moisturizers: products.filter((item) => item.section === "Moisturizers"),
    };
  }, [products]);

  const sectionContentByTitle = (title) => {
    const normalized = title.toLowerCase();

    if (normalized === "cleansers") {
      return {
        title: pageContent["section.cleansers.title"],
        subtitle: pageContent["section.cleansers.subtitle"],
        image: pageContent["section.cleansers.image"],
      };
    }

    if (normalized === "serums") {
      return {
        title: pageContent["section.serums.title"],
        subtitle: pageContent["section.serums.subtitle"],
        image: pageContent["section.serums.image"],
      };
    }

    if (normalized === "moisturizers") {
      return {
        title: pageContent["section.moisturizers.title"],
        subtitle: pageContent["section.moisturizers.subtitle"],
        image: pageContent["section.moisturizers.image"],
      };
    }

    return {
      title,
      subtitle: pageContent["section.dynamic.subtitle"],
      image: pageContent["section.dynamic.image"],
    };
  };

  const handleViewAll = (title) => {
    navigate("/categories/view-all", {
      state: {
        title,
        products: (SECTION_OPTIONS.includes(title)
          ? products.filter((item) => item.section === title)
          : products.filter((item) => item.category === title)
        ).map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      },
    });
  };

  const toPayload = (form, imageUrl) => ({
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    inStock: Boolean(form.inStock),
    section: form.section,
    category: form.category.trim(),
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
      setNewProductForm(buildInitialProductForm());
      setNewProductFile(null);
      setAdminNotice("Product created.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to create product.");
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
      section: product.section || "Cleansers",
      category: product.category || "",
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
      setAdminNotice("Product updated.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      setIsSaving(true);
      setAdminNotice("");
      await deleteCatalogProduct(productId);
      setProducts((current) => current.filter((item) => item._id !== productId));
      setAdminNotice("Product deleted.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to delete product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setAdminNotice("Category name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setAdminNotice("");
      const created = await createCatalogCategory(trimmed);
      setCategories((current) => [...current, created]);
      setNewCategoryName("");
      setAdminNotice("Category created.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to create category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      setIsSaving(true);
      setAdminNotice("");
      await deleteCatalogCategory(categoryId);
      setCategories((current) => current.filter((item) => item._id !== categoryId));
      setAdminNotice("Category deleted.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to delete category.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveSingleOverride = async (key, value, kind) => {
    const saved = await savePageOverride({
      page: "categories",
      key,
      kind,
      value,
    });

    setPageOverrides((current) => {
      const next = current.filter((item) => item.key !== saved.key);
      return [saved, ...next];
    });
  };

  const handleSaveContent = async () => {
    try {
      setIsSaving(true);
      setAdminNotice("");

      const keys = Object.keys(contentDraft);
      for (const key of keys) {
        const nextValue = String(contentDraft[key] ?? "");
        const currentValue = String(pageContent[key] ?? "");
        if (nextValue === currentValue) continue;

        const kind = key.endsWith(".image") ? "image" : "text";
        await saveSingleOverride(key, nextValue, kind);
      }

      setAdminNotice("Page content updated.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to update page content.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadContentImage = async (key, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setAdminNotice("Image must be 10MB or smaller.");
      return;
    }

    try {
      setIsSaving(true);
      setAdminNotice("");
      const imageUrl = await uploadPageOverrideImage(file);
      setContentDraft((current) => ({ ...current, [key]: imageUrl }));
      await saveSingleOverride(key, imageUrl, "image");
      setAdminNotice("Page image updated.");
    } catch (error) {
      setAdminNotice(error.message || "Failed to upload image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018] overflow-x-hidden">
      <Navbar />

      <motion.section
        className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto min-h-[650px] px-6 lg:px-12 items-center pt-24"
        initial="hidden"
        animate="show"
        variants={sectionStagger}
      >
        <motion.div variants={riseIn} className="w-full lg:w-1/2 relative h-[420px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffbda7]/20 to-transparent blur-3xl rounded-full"></div>
          <div className="relative z-10 rounded-2xl border border-[#edd8bc] bg-white p-4 shadow-xl">
            <img
              src={pageContent["hero.image"]}
              className="w-72 h-80 object-cover rounded-xl"
              alt="Category showcase"
            />
          </div>
        </motion.div>

        <motion.div variants={riseIn} className="w-full lg:w-1/2 flex flex-col items-start lg:pl-20 py-10">
          <motion.span variants={riseIn} className="px-4 py-1 text-xs tracking-widest uppercase border border-[#d3b48f] rounded-full text-[#6e5947] mb-6 bg-white/70">
            {pageContent["hero.badge"]}
          </motion.span>

          <motion.h1 variants={riseIn} className="text-5xl lg:text-7xl font-light leading-tight mb-6">
            {pageContent["hero.titlePrefix"]} <br />
            <span className="font-bold italic">{pageContent["hero.titleAccent"]}</span>
          </motion.h1>

          <motion.p variants={riseIn} className="text-[#6e5947] max-w-md mb-10">
            {pageContent["hero.description"]}
          </motion.p>
        </motion.div>
      </motion.section>

      {isAdmin ? (
        <section className="mx-auto max-w-7xl px-8 pb-4 space-y-4">
          <div className="rounded-2xl border border-[#dcbf9e] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#6f4a2b]">Admin Category Page Content</h3>
              {adminNotice ? <p className="text-sm text-[#8a6038]">{adminNotice}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={contentDraft["hero.badge"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "hero.badge": event.target.value }))
                }
                placeholder="Hero badge"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["hero.titlePrefix"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "hero.titlePrefix": event.target.value }))
                }
                placeholder="Hero title prefix"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["hero.titleAccent"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "hero.titleAccent": event.target.value }))
                }
                placeholder="Hero title accent"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["hero.image"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "hero.image": event.target.value }))
                }
                placeholder="Hero image URL"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <textarea
              value={contentDraft["hero.description"]}
              onChange={(event) =>
                setContentDraft((current) => ({ ...current, "hero.description": event.target.value }))
              }
              placeholder="Hero description"
              rows={3}
              className="mt-3 w-full rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleUploadContentImage("hero.image", event.target.files?.[0])
                }
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleUploadContentImage("section.cleansers.image", event.target.files?.[0])
                }
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleUploadContentImage("section.serums.image", event.target.files?.[0])
                }
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                value={contentDraft["section.cleansers.title"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "section.cleansers.title": event.target.value }))
                }
                placeholder="Cleansers title"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["section.serums.title"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "section.serums.title": event.target.value }))
                }
                placeholder="Serums title"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["section.moisturizers.title"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "section.moisturizers.title": event.target.value }))
                }
                placeholder="Moisturizers title"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                value={contentDraft["section.cleansers.subtitle"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "section.cleansers.subtitle": event.target.value }))
                }
                placeholder="Cleansers subtitle"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["section.serums.subtitle"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "section.serums.subtitle": event.target.value }))
                }
                placeholder="Serums subtitle"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={contentDraft["section.moisturizers.subtitle"]}
                onChange={(event) =>
                  setContentDraft((current) => ({ ...current, "section.moisturizers.subtitle": event.target.value }))
                }
                placeholder="Moisturizers subtitle"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveContent}
                disabled={isSaving}
                className="rounded-lg bg-[#8a6038] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Page Content"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dcbf9e] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#6f4a2b]">Admin Category Manager</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div key={category._id} className="inline-flex items-center gap-2 rounded-full border border-[#d3b48f] px-3 py-1">
                  <span className="text-xs font-semibold text-[#8a6038]">{category.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-[11px] font-semibold text-red-700"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="New category name"
                className="flex-1 rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isSaving}
                className="rounded-lg bg-[#8a6038] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Add Category
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dcbf9e] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#6f4a2b]">Admin Product Manager</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <input
                value={newProductForm.title}
                onChange={(event) =>
                  setNewProductForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Product title"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={newProductForm.price}
                onChange={(event) =>
                  setNewProductForm((current) => ({ ...current, price: event.target.value }))
                }
                placeholder="Price"
                type="number"
                min="0"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <select
                value={newProductForm.section}
                onChange={(event) =>
                  setNewProductForm((current) => ({ ...current, section: event.target.value }))
                }
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              >
                {SECTION_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                value={newProductForm.category}
                onChange={(event) =>
                  setNewProductForm((current) => ({ ...current, category: event.target.value }))
                }
                list="category-options"
                placeholder="Category tag"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <datalist id="category-options">
                {pillNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>

            <textarea
              value={newProductForm.description}
              onChange={(event) =>
                setNewProductForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Product description"
              rows={3}
              className="mt-3 w-full rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={newProductForm.imageUrl}
                onChange={(event) =>
                  setNewProductForm((current) => ({ ...current, imageUrl: event.target.value }))
                }
                placeholder="Image URL (optional if uploading file)"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
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
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
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
                className="rounded-lg bg-[#8a6038] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Add Product"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-10">
        <CategoryPills
          categories={pillNames}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {isLoading ? (
          <div className="rounded-xl border border-[#edd8bc] bg-white px-6 py-10 text-center text-[#6e5947]">
            Loading products...
          </div>
        ) : null}

        {!isLoading && selectedCategory ? (
          <Section
            title={selectedCategory}
            products={selectedCategoryProducts}
            content={sectionContentByTitle(selectedCategory)}
            onViewAll={handleViewAll}
            isAdmin={isAdmin}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />
        ) : null}

        {!isLoading && !selectedCategory ? (
          <>
            <Section
              title="Cleansers"
              products={sectionProducts.Cleansers}
              content={sectionContentByTitle("Cleansers")}
              onViewAll={handleViewAll}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
            />
            <Section
              title="Serums"
              products={sectionProducts.Serums}
              content={sectionContentByTitle("Serums")}
              onViewAll={handleViewAll}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
            />
            <Section
              title="Moisturizers"
              products={sectionProducts.Moisturizers}
              content={sectionContentByTitle("Moisturizers")}
              onViewAll={handleViewAll}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
            />
          </>
        ) : null}
      </div>

      {editingProductId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#5f3f25]">Edit Product</h3>
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
                onChange={(event) =>
                  setEditingProductForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Product title"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
              <input
                value={editingProductForm.price}
                onChange={(event) =>
                  setEditingProductForm((current) => ({ ...current, price: event.target.value }))
                }
                type="number"
                min="0"
                placeholder="Price"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />

              <select
                value={editingProductForm.section}
                onChange={(event) =>
                  setEditingProductForm((current) => ({ ...current, section: event.target.value }))
                }
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              >
                {SECTION_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                value={editingProductForm.category}
                onChange={(event) =>
                  setEditingProductForm((current) => ({ ...current, category: event.target.value }))
                }
                list="category-options"
                placeholder="Category"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <textarea
              value={editingProductForm.description}
              onChange={(event) =>
                setEditingProductForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={3}
              placeholder="Description"
              className="mt-3 w-full rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={editingProductForm.imageUrl}
                onChange={(event) =>
                  setEditingProductForm((current) => ({ ...current, imageUrl: event.target.value }))
                }
                placeholder="Image URL"
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
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
                  setEditingProductFile(file);
                }}
                className="rounded-lg border border-[#e8d4bc] px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
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

              <button
                type="button"
                onClick={handleUpdateProduct}
                disabled={isSaving}
                className="rounded-lg bg-[#8a6038] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CategoryPills({ categories, selectedCategory, onSelectCategory }) {
  return (
    <section className="rounded-2xl border border-[#edd8bc] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6e5947]">Shop by Category</h3>
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className="text-xs font-semibold text-[#8a6038] hover:underline"
        >
          Show All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((pill) => {
          const isActive = selectedCategory === pill;
          return (
            <button
              key={pill}
              type="button"
              onClick={() => onSelectCategory(pill)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? "border-[#8a6038] bg-[#8a6038] text-white"
                  : "border-[#d3b48f] bg-white text-[#8a6038] hover:bg-[#fff1df]"
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Section({ title, products, content, onViewAll, isAdmin, onEdit, onDelete }) {
  const scrollRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrowState = () => {
    const row = scrollRef.current;
    if (!row) return;

    setCanScrollLeft(row.scrollLeft > 4);
    setCanScrollRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
  };

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return;

    row.scrollLeft = 0;
    updateArrowState();

    const handleResize = () => updateArrowState();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [products]);

  const scroll = (dir) => {
    const row = scrollRef.current;
    if (!row) return;

    const distance = Math.max(220, Math.floor(row.clientWidth * 0.65));
    row.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" });
    window.setTimeout(updateArrowState, 240);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-bold text-[#2b2018]">{content.title}</h2>
          <p className="mt-2 text-[#6e5947]">{content.subtitle}</p>
        </div>
        <button
          onClick={() => onViewAll?.(title)}
          className="rounded-full border border-[#d3b48f] bg-white px-4 py-2 text-xs font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
        >
          View All
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d8cec4] bg-[#f6f1eb] px-5 py-8 text-center text-sm text-[#6f6258]">
          No products in this section yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <motion.div
            className="lg:col-span-4 rounded-2xl overflow-hidden bg-white border border-[#edd8bc]"
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -6 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <img src={content.image} alt={content.title} className="h-[260px] w-full object-cover" />
            <div className="p-4">
              <h3 className="text-2xl font-bold text-[#2b2018]">{content.title}</h3>
              <p className="mt-2 text-sm text-[#6e5947]">{content.subtitle}</p>
            </div>
          </motion.div>

          <div className="lg:col-span-8 rounded-2xl border border-[#edd8bc] bg-white p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    canScrollLeft
                      ? "bg-[#8a6038] text-white"
                      : "bg-[#e9d8c5] text-[#8a6038]"
                  }`}
                >
                  Prev
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    canScrollRight
                      ? "bg-[#8a6038] text-white"
                      : "bg-[#e9d8c5] text-[#8a6038]"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            <div ref={scrollRef} onScroll={updateArrowState} className="flex gap-3 overflow-x-auto pb-2">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const numericPrice = Number(product.price) || 0;
  const discountPct = Math.max(4, numericPrice % 37);

  return (
    <article className="w-[260px] shrink-0 rounded-xl border border-[#edd8bc] bg-white p-2">
      <button
        type="button"
        onClick={() =>
          navigate(`/product/${toProductSlug(product.title)}`, {
            state: {
              product: {
                name: product.title,
                price: numericPrice,
                originalPrice: Math.round(numericPrice * 1.3),
                image: product.imageUrl,
                category: product.category,
                inStock: product.inStock,
                description: product.description,
              },
            },
          })
        }
        className="w-full text-left"
      >
        <div className="relative overflow-hidden rounded-lg bg-white">
          <span className="absolute right-2 top-2 rounded-full bg-[#b67d4a] px-2 py-1 text-[10px] font-semibold text-white">
            {discountPct}% OFF
          </span>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-40 w-full rounded-lg object-cover"
          />
        </div>
        <p className={`mt-2 text-[11px] font-semibold ${product.inStock ? "text-green-700" : "text-red-600"}`}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
        <h4 className="mt-1 text-sm font-bold text-[#2b2018]">{product.title}</h4>
        <p className="mt-1 text-xs text-[#6e5947] line-clamp-2">{product.description}</p>
        <p className="mt-2 text-sm font-bold text-[#8a6038]">
          Rs {numericPrice} <span className="text-[#8f8f8f] line-through">Rs {Math.round(numericPrice * 1.3)}</span>
        </p>
      </button>

      {isAdmin ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(product)}
            className="flex-1 rounded-md bg-[#8a6038] px-2 py-1.5 text-[11px] font-semibold text-white"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(product._id)}
            className="flex-1 rounded-md border border-red-300 px-2 py-1.5 text-[11px] font-semibold text-red-700"
          >
            Delete
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            addToCart({
              id: `cat-${product._id || product.title}`,
              name: product.title,
              price: numericPrice,
              originalPrice: Math.round(numericPrice * 1.3),
              image: product.imageUrl,
            })
          }
          className="mt-3 w-full rounded-md bg-[#8a6038] px-2 py-1.5 text-[11px] font-semibold text-white"
        >
          Add to Cart
        </button>
      )}
    </article>
  );
}
