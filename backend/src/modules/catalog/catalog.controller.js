import { CatalogProduct } from "./catalog.model.js";
import { CatalogCategory } from "./catalogCategory.model.js";

const DEFAULT_IMAGE =
  "/hero.jpg";

export const searchCatalogProducts = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.json({
        products: [],
        categories: [],
      });
    }

    const regex = new RegExp(q, "i");

    const products = await CatalogProduct.find({
      title: regex,
    })
      .select(
        "_id title category price inStock imageUrl"
      )
      .limit(8);

    const categories = await CatalogCategory.find({
      name: regex,
    })
      .select("_id name")
      .limit(5);

    return res.json({
      products,
      categories,
    });
  } catch (error) {
    return next(error);
  }
};  

const seedProducts = [
  {
    title: "LuminaTone Pore Refining Tonic",
    description: "Gentle daily cleanser that clears excess oil without stripping hydration.",
    price: 980,
    inStock: true,
    section: "Cleansers",
    category: "Toners",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Dermadetox Charcoal Enzyme Foam",
    description: "Detoxifying charcoal foam for deep pore refresh and smooth texture.",
    price: 1100,
    inStock: false,
    section: "Cleansers",
    category: "Exfoliators",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "GlowAid 15% Vitamin C Serum",
    description: "Vitamin C concentrate for glow, tone correction, and brightness support.",
    price: 1250,
    inStock: true,
    section: "Serums",
    category: "Brightening",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "AcneClenz Niacinamide + Zinc Serum",
    description: "Niacinamide and zinc serum that supports acne-prone skin barrier repair.",
    price: 1170,
    inStock: true,
    section: "Serums",
    category: "Acne Care",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "Cerashield Barrier Rescue Cream",
    description: "Ceramide-rich moisturizer that locks in hydration and calms irritation.",
    price: 1390,
    inStock: true,
    section: "Moisturizers",
    category: "Moisturizers",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "AquaCloud Dewy Gel Moisturizer",
    description: "Lightweight gel-cream for all-day hydration and smooth skin texture.",
    price: 990,
    inStock: true,
    section: "Moisturizers",
    category: "Moisturizers",
    imageUrl: DEFAULT_IMAGE,
  },
  {
    title: "HydroGlow Barrier Support Serum",
    description: "Best-selling hydration serum with clinically proven barrier support.",
    price: 1299,
    inStock: true,
    section: "Best Sellers",
    category: "Serum",
    imageUrl: DEFAULT_IMAGE,
    isBestSeller: true,
  },
  {
    title: "LumiBright Vitamin C Cream",
    description: "Customer-favorite brightening cream for daily radiance and tone correction.",
    price: 1499,
    inStock: true,
    section: "Best Sellers",
    category: "Cream",
    imageUrl: DEFAULT_IMAGE,
    isBestSeller: true,
  },
  {
    title: "SolarGuard SPF 50 PA+++",
    description: "High-protection sunscreen with lightweight finish and no white cast.",
    price: 799,
    inStock: true,
    section: "Best Sellers",
    category: "Sunscreen",
    imageUrl: DEFAULT_IMAGE,
    isBestSeller: true,
  },
  {
    title: "RevitaEye Peptide Eye Gel",
    description: "Cooling peptide eye gel loved for depuffing and brighter-looking under-eyes.",
    price: 1099,
    inStock: true,
    section: "Best Sellers",
    category: "Gel",
    imageUrl: DEFAULT_IMAGE,
    isBestSeller: true,
  },
  {
    title: "DewSkin Rice Barrier Essence",
    description: "Rice peptides plus ceramide support for lightweight daily barrier care.",
    price: 1299,
    inStock: true,
    section: "New Arrivals",
    category: "Essence",
    imageUrl: DEFAULT_IMAGE,
    isNewArrival: true,
  },
  {
    title: "PureFoam Low-Ph Gel Cleanser",
    description: "Low-foam cleanser designed for a fresh daily reset.",
    price: 899,
    inStock: true,
    section: "New Arrivals",
    category: "Cleanser",
    imageUrl: DEFAULT_IMAGE,
    isNewArrival: true,
  },
  {
    title: "AirLift Peptide Hydration Mist",
    description: "Ultra-fine hydration mist with peptide complex and glow finish.",
    price: 1099,
    inStock: true,
    section: "New Arrivals",
    category: "Mist",
    imageUrl: DEFAULT_IMAGE,
    isNewArrival: true,
  },
  {
    title: "MidnightGlow Squalane Night Oil",
    description: "Squalane-rich overnight treatment for nourishment and softness.",
    price: 1699,
    inStock: true,
    section: "New Arrivals",
    category: "Oil",
    imageUrl: DEFAULT_IMAGE,
    isNewArrival: true,
  },
].map((item) => ({
  ...item,
  originalPrice: Math.max(item.price + Math.round(item.price * 0.15), item.price),
  discountedPrice: item.price,
  stock: item.inStock ? 24 : 0,
  imageUrls: [item.imageUrl],
  sizeStock: [{
    label: "125 ml",
    originalPrice: Math.max(item.price + Math.round(item.price * 0.15), item.price),
    price: item.price,
    stock: item.inStock ? 24 : 0,
  }],
  features: ["24x7 Support", "Original Product Guaranteed"],
}));

const SECTION_VALUES = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Sunscreens",
  "Toners",
  "Exfoliators",
  "Face Masks",
  "Eye Care",
  "Lip Care",
  "Acne Care",
  "Brightening",
  "Travel Minis",
  "Kits and Combos",
  "Best Sellers",
  "New Arrivals",
];

const normalizeCategoryName = (name = "") => {
  const trimmed = String(name || "").trim();
  const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (["clenser", "clensers", "cleanser", "cleansers"].includes(key)) {
    return "Cleansers";
  }

  return trimmed;
};

const toFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeSizeStock = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const label = String(item?.label || "").trim();
      const stockNumber = toFiniteNumber(item?.stock);
      const price = toFiniteNumber(item?.price);
      const originalPrice = toFiniteNumber(item?.originalPrice) ?? price;

      if (!label) {
        return null;
      }

      if (!Number.isFinite(price) || price < 0) {
        return null;
      }

      if (!Number.isFinite(originalPrice) || originalPrice < price) {
        return null;
      }

      return {
        label,
        originalPrice,
        price,
        stock: Math.max(0, Math.floor(stockNumber ?? 0)),
      };
    })
    .filter(Boolean);
};

const normalizeSizeVariants = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const label = String(item?.label || "").trim();
      const stock = Math.max(0, Math.floor(toFiniteNumber(item?.stock) ?? 0));
      const price = toFiniteNumber(item?.price);
      const originalPrice = toFiniteNumber(item?.originalPrice) ?? price;

      if (!label) {
        return null;
      }

      if (!Number.isFinite(price) || price < 0) {
        return null;
      }

      if (!Number.isFinite(originalPrice) || originalPrice < price) {
        return null;
      }

      return {
        label,
        stock,
        price,
        originalPrice,
      };
    })
    .filter(Boolean);
};

const normalizeInput = (payload) => {
  const discountedPrice = toFiniteNumber(payload.discountedPrice);
  const parsedPrice = toFiniteNumber(payload.price);
  const price = discountedPrice ?? parsedPrice;

  const parsedOriginalPrice = toFiniteNumber(payload.originalPrice);
  const originalPrice =
    parsedOriginalPrice ??
    (price === null ? null : price);

  const imageUrlInput = String(payload.imageUrl || "").trim();
  const imageUrlsInput = toStringArray(payload.imageUrls);
  const fallbackImage = imageUrlsInput[0] || imageUrlInput;
  const imageUrl = imageUrlInput || fallbackImage;
  const imageUrls = Array.from(new Set([imageUrl, ...imageUrlsInput].filter(Boolean)));

  const sizeStock = normalizeSizeStock(payload.sizeStock);
  const sizeVariants = normalizeSizeVariants(payload.sizeVariants);
  const stock = Math.max(0, Math.floor(toFiniteNumber(payload.stock) ?? 0));
  const hasPositiveStockBySize = sizeStock.some((item) => item.stock > 0);
  const hasPositiveStockByVariant = sizeVariants.some((item) => item.stock > 0);
  const hasInStockValue = typeof payload.inStock === "boolean";

  return {
    title: String(payload.title || "").trim(),
    description: String(payload.description || "").trim(),
    price,
    discountedPrice: price,
    originalPrice,
    stock,
    inStock: hasInStockValue ? payload.inStock : (stock > 0 || hasPositiveStockBySize || hasPositiveStockByVariant),
    isNewArrival: Boolean(payload.isNewArrival),
    isBestSeller: Boolean(payload.isBestSeller),
    section: String(payload.section || "").trim(),
    category: normalizeCategoryName(payload.category),
    imageUrl,
    imageUrls,
    sizeStock,
    sizeVariants,
    features: toStringArray(payload.features),
  };
};

const validatePayload = (payload) => {
  if (!payload.title || !payload.description || !payload.section || !payload.category || !payload.imageUrl) {
    return "title, description, section, category and at least one image are required.";
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return "discounted price must be a valid non-negative number.";
  }

  if (!Number.isFinite(payload.originalPrice) || payload.originalPrice < 0) {
    return "original price must be a valid non-negative number.";
  }

  if (payload.originalPrice < payload.price) {
    return "original price must be greater than or equal to discounted price.";
  }

  if (!Number.isFinite(payload.stock) || payload.stock < 0) {
    return "stock must be a valid non-negative number.";
  }

  if (payload.imageUrls.length > 7) {
    return "a product can have at most 7 images.";
  }

  if (payload.sizeVariants.length > 0) {
    const invalidVariant = payload.sizeVariants.find(
      (variant) => !Number.isFinite(variant.price) || variant.originalPrice < variant.price
    );

    if (invalidVariant) {
      return "each size variant must have valid actual and discount prices.";
    }
  }

  if (!SECTION_VALUES.includes(payload.section)) {
    return "section must be one of: Cleansers, Serums, Moisturizers, Best Sellers, New Arrivals.";
  }

  return null;
};

export const getPublicCatalogProducts = async (_req, res, next) => {
  try {
    const products = await CatalogProduct.find({}).sort({
      createdAt: -1,
    });

    console.log("PRODUCTS API CALLED");
    console.log(
      products[0]?.reviews,
      products[0]?.averageRating,
      products[0]?.reviewCount
    );

    return res.status(200).json({
      message: "Review saved successfully",
      products,
    });
  } catch (error) {
    return next(error);
  }
};

export const createCatalogProduct = async (req, res, next) => {
  try {
    const payload = normalizeInput(req.body);
    //console.log("REQ BODY:", req.body);
    //console.log("NORMALIZED:", payload);
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
    console.log("REQ BODY =", JSON.stringify(req.body, null, 2));
    const payload = normalizeInput(req.body);
    console.log("NORMALIZED =", JSON.stringify(payload, null, 2));
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

export const submitProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({
        message: "Comment must be at least 5 characters",
      });
    }

    const product = await CatalogProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingReview = product.reviews.find(
      (review) =>
        review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment.trim();
      existingReview.createdAt = new Date();
    } else {
      product.reviews.push({
        userId: req.user._id,
        userName: req.user.name,
        rating,
        comment: comment.trim(),
      });
    }

    product.reviewCount = product.reviews.length;

    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    product.averageRating =
      product.reviewCount > 0
        ? Number(
            (totalRating / product.reviewCount).toFixed(1)
          )
        : 0;

    console.log("==== REVIEW DEBUG ====");
console.log("Reviews:", product.reviews);
console.log("Average Rating:", product.averageRating);
console.log("Review Count:", product.reviewCount);
console.log("======================");

    await product.save();

    return res.status(200).json({
      message: "Review saved successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
    });
  } catch (error) {
    next(error);
  }
};


export const ensureDefaultCatalogProducts = async () => {
  const count = await CatalogProduct.countDocuments({});
  if (count > 0) {
    const bestSellersCount = await CatalogProduct.countDocuments({
      $or: [{ isBestSeller: true }, { section: "Best Sellers" }],
    });
    if (bestSellersCount === 0) {
      const bestSellersSeed = seedProducts.filter((item) => item.section === "Best Sellers");
      await CatalogProduct.insertMany(bestSellersSeed);
    }

    const newArrivalsCount = await CatalogProduct.countDocuments({
      $or: [{ isNewArrival: true }, { section: "New Arrivals" }],
    });
    if (newArrivalsCount === 0) {
      const newArrivalsSeed = seedProducts.filter((item) => item.section === "New Arrivals");
      await CatalogProduct.insertMany(newArrivalsSeed);
    }

    return;
  }

  await CatalogProduct.insertMany(seedProducts);
};
