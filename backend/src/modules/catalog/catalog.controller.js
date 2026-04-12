import { CatalogProduct } from "./catalog.model.js";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=900&q=80";

const seedProducts = [
  {
    title: "Pore Reset Tonic Cleanser",
    description: "Gentle daily cleanser that clears excess oil without stripping hydration.",
    price: 980,
    inStock: true,
    section: "Cleansers",
    category: "Toners",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Charcoal Enzyme Cleanser",
    description: "Detoxifying charcoal foam for deep pore refresh and smooth texture.",
    price: 1100,
    inStock: false,
    section: "Cleansers",
    category: "Exfoliators",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Radiance C-Serum",
    description: "Vitamin C concentrate for glow, tone correction, and brightness support.",
    price: 1250,
    inStock: true,
    section: "Serums",
    category: "Brightening",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Blemish Repair Serum",
    description: "Niacinamide and zinc serum that supports acne-prone skin barrier repair.",
    price: 1170,
    inStock: true,
    section: "Serums",
    category: "Acne Care",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Barrier Rescue Cream",
    description: "Ceramide-rich moisturizer that locks in hydration and calms irritation.",
    price: 1390,
    inStock: true,
    section: "Moisturizers",
    category: "Moisturizers",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Cloud Dew Gel Moisturizer",
    description: "Lightweight gel-cream for all-day hydration and smooth skin texture.",
    price: 990,
    inStock: true,
    section: "Moisturizers",
    category: "Moisturizers",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Hydrating Glow Serum",
    description: "Best-selling hydration serum with clinically proven barrier support.",
    price: 1299,
    inStock: true,
    section: "Best Sellers",
    category: "Serum",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Vitamin C Bright Cream",
    description: "Customer-favorite brightening cream for daily radiance and tone correction.",
    price: 1499,
    inStock: true,
    section: "Best Sellers",
    category: "Cream",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "SPF 50 Sunscreen",
    description: "High-protection sunscreen with lightweight finish and no white cast.",
    price: 799,
    inStock: true,
    section: "Best Sellers",
    category: "Sunscreen",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Under Eye Revival Gel",
    description: "Cooling peptide eye gel loved for depuffing and brighter-looking under-eyes.",
    price: 1099,
    inStock: true,
    section: "Best Sellers",
    category: "Gel",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Dew Barrier Essence",
    description: "Rice peptides plus ceramide support for lightweight daily barrier care.",
    price: 1299,
    inStock: true,
    section: "New Arrivals",
    category: "Essence",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Cloud Clean Gel",
    description: "Low-foam cleanser designed for a fresh daily reset.",
    price: 899,
    inStock: true,
    section: "New Arrivals",
    category: "Cleanser",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Peptide Lift Mist",
    description: "Ultra-fine hydration mist with peptide complex and glow finish.",
    price: 1099,
    inStock: true,
    section: "New Arrivals",
    category: "Mist",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Luminous Night Oil",
    description: "Squalane-rich overnight treatment for nourishment and softness.",
    price: 1699,
    inStock: true,
    section: "New Arrivals",
    category: "Oil",
    imageUrl: DEFAULT_IMAGE,
  },
];

const SECTION_VALUES = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Best Sellers",
  "New Arrivals",
];

const normalizeInput = (payload) => {
  return {
    title: String(payload.title || "").trim(),
    description: String(payload.description || "").trim(),
    price: Number(payload.price),
    inStock: Boolean(payload.inStock),
    section: String(payload.section || "").trim(),
    category: String(payload.category || "").trim(),
    imageUrl: String(payload.imageUrl || "").trim(),
  };
};

const validatePayload = (payload) => {
  if (!payload.title || !payload.description || !payload.section || !payload.category || !payload.imageUrl) {
    return "title, description, section, category and imageUrl are required.";
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return "price must be a valid non-negative number.";
  }

  if (!SECTION_VALUES.includes(payload.section)) {
    return "section must be one of: Cleansers, Serums, Moisturizers, Best Sellers, New Arrivals.";
  }

  return null;
};

export const getPublicCatalogProducts = async (_req, res, next) => {
  try {
    const products = await CatalogProduct.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

export const createCatalogProduct = async (req, res, next) => {
  try {
    const payload = normalizeInput(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await CatalogProduct.create(payload);
    return res.status(201).json({ message: "Product created.", product });
  } catch (error) {
    return next(error);
  }
};

export const updateCatalogProduct = async (req, res, next) => {
  try {
    const payload = normalizeInput(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await CatalogProduct.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product updated.", product });
  } catch (error) {
    return next(error);
  }
};

export const deleteCatalogProduct = async (req, res, next) => {
  try {
    const product = await CatalogProduct.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted." });
  } catch (error) {
    return next(error);
  }
};

export const ensureDefaultCatalogProducts = async () => {
  const count = await CatalogProduct.countDocuments({});
  if (count > 0) {
    const bestSellersCount = await CatalogProduct.countDocuments({ section: "Best Sellers" });
    if (bestSellersCount === 0) {
      const bestSellersSeed = seedProducts.filter((item) => item.section === "Best Sellers");
      await CatalogProduct.insertMany(bestSellersSeed);
    }

    const newArrivalsCount = await CatalogProduct.countDocuments({ section: "New Arrivals" });
    if (newArrivalsCount === 0) {
      const newArrivalsSeed = seedProducts.filter((item) => item.section === "New Arrivals");
      await CatalogProduct.insertMany(newArrivalsSeed);
    }

    return;
  }

  await CatalogProduct.insertMany(seedProducts);
};
