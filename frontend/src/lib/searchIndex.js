import { categoryProducts } from "./products-data";

export { categoryProducts };

export const categoryKeywords = {
  Cleansers: ["cleanser", "face wash", "foam", "wash", "cleansing"],
  Serums: ["serum", "vitamin c", "niacinamide", "retinol", "elixir"],
  Moisturizers: ["moisturizer", "cream", "hydration", "barrier"],
  Sunscreens: ["sunscreen", "spf", "sun", "uv"],
  Toners: ["toner", "balancing", "mist", "aha"],
  "Best Sellers": ["best", "sellers", "top", "popular", "trending"],
  "New Arrivals": ["new", "arrivals", "latest", "just", "launched"],
};

function createEntries() {
  const categoryEntries = Object.entries(categoryProducts).map(([category, products]) => ({
    id: `cat-${category.toLowerCase().replace(/\s+/g, "-")}`,
    title: category,
    type: "Category",
    description: `${products.length} products`,
    keywords: categoryKeywords[category] || [],
    path: "/categories/view-all",
    state: { title: category, products },
  }));

  const productEntries = Object.entries(categoryProducts).flatMap(([category, products]) =>
    products.map((product) => ({
      id: `prod-${category.toLowerCase().replace(/\s+/g, "-")}-${product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: product.title,
      type: "Product",
      category,
      price: product.price,
      inStock: product.inStock,
      description: `${category} • ${product.inStock ? "In Stock" : "Out of Stock"}`,
      keywords: [...(categoryKeywords[category] || []), category, product.title],
      path: "/categories/view-all",
      state: { title: category, products: categoryProducts[category] },
    }))
  );

  const pageEntries = [
    { id: "nav-home", title: "Home", type: "Page", description: "Landing page", path: "/", keywords: ["home", "landing"] },
    { id: "nav-categories", title: "Categories", type: "Page", description: "Browse skincare categories", path: "/categories", keywords: ["categories", "shop"] },
    { id: "nav-best-sellers", title: "Best Sellers", type: "Page", description: "Top products", path: "/best-sellers", keywords: ["best", "sellers"] },
    { id: "nav-new-arrivals", title: "New Arrivals", type: "Page", description: "Latest products", path: "/new-arrivals", keywords: ["new", "arrivals", "latest"] },
    { id: "nav-wishlist", title: "Wishlist", type: "Page", description: "Saved products", path: "/wishlist", keywords: ["wishlist", "saved"] },
    { id: "nav-cart", title: "Cart", type: "Page", description: "Shopping cart", path: "/cart", keywords: ["cart", "bag", "checkout"] },
    { id: "nav-about", title: "About", type: "Page", description: "About Clinical Sanctuary", path: "/about", keywords: ["about", "brand"] },
  ];

  return [...categoryEntries, ...productEntries, ...pageEntries];
}

export const searchIndex = createEntries();

const singular = (value) => {
  const text = String(value || "").toLowerCase();
  return text.endsWith("s") ? text.slice(0, -1) : text;
};

const normalize = (value) => String(value || "").trim().toLowerCase();

export function findCategoryIntent(rawQuery) {
  const query = normalize(rawQuery);
  if (!query) return null;

  const categories = Object.keys(categoryProducts);

  for (const category of categories) {
    const categoryLower = normalize(category);
    const categorySingular = singular(categoryLower);
    const keywords = categoryKeywords[category] || [];
    const keywordHit = keywords.some((keyword) => {
      const kw = normalize(keyword);
      return kw.includes(query) || query.includes(kw) || kw.startsWith(query);
    });

    const categoryHit =
      categoryLower.includes(query) ||
      query.includes(categoryLower) ||
      categorySingular.includes(query) ||
      query.includes(categorySingular);

    if (categoryHit || keywordHit) {
      return {
        category,
        products: categoryProducts[category],
      };
    }
  }

  return null;
}

export function findProductIntent(rawQuery) {
  const query = normalize(rawQuery);
  if (!query) return null;

  const products = searchIndex.filter((entry) => entry.type === "Product");

  const exact = products.find((product) => normalize(product.title) === query);
  if (exact) return exact;

  const startsWith = products.find((product) => normalize(product.title).startsWith(query));
  if (startsWith) return startsWith;

  const includes = products.find((product) => normalize(product.title).includes(query));
  if (includes) return includes;

  return null;
}

function scoreEntry(entry, terms, query) {
  const title = entry.title.toLowerCase();
  const keywords = (entry.keywords || []).join(" ").toLowerCase();
  const description = String(entry.description || "").toLowerCase();
  const type = String(entry.type || "").toLowerCase();
  const titleTokens = title.split(/[^a-z0-9]+/).filter(Boolean);
  const keywordTokens = keywords.split(/[^a-z0-9]+/).filter(Boolean);

  let score = 0;

  terms.forEach((term) => {
    if (title === term) score += 12;
    if (title.startsWith(term)) score += 6;
    if (title.includes(term)) score += 4;
    if (keywords.includes(term)) score += 3;
    if (description.includes(term)) score += 2;
    if (type.includes(term)) score += 1;

    if (titleTokens.some((token) => token.startsWith(term) || term.startsWith(token) || token.includes(term))) {
      score += 5;
    }
    if (keywordTokens.some((token) => token.startsWith(term) || term.startsWith(token) || token.includes(term))) {
      score += 3;
    }
  });

  if (title.includes(query)) score += 2;
  if (entry.type === "Product") score += 1;

  return score;
}

export function searchCatalog(rawQuery) {
  const query = String(rawQuery || "").trim().toLowerCase();
  if (!query) return [];

  const terms = query.split(/\s+/).filter(Boolean);

  return searchIndex
    .map((entry) => ({ ...entry, score: scoreEntry(entry, terms, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 30);
}
