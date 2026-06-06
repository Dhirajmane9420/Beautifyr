import { CatalogCategory } from "./catalogCategory.model.js";

const defaultCategories = [
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
];

const normalizeCategoryName = (name = "") => {
  const trimmed = String(name || "").trim();
  const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (["clenser", "clensers", "cleanser", "cleansers"].includes(key)) {
    return "Cleansers";
  }

  return trimmed;
};

export const getPublicCatalogCategories = async (_req, res, next) => {
  try {
    const categories = await CatalogCategory.find({}).sort({ name: 1 });
    return res.status(200).json({ categories });
  } catch (error) {
    return next(error);
  }
};

export const createCatalogCategory = async (req, res, next) => {
  try {
    const name = normalizeCategoryName(req.body?.name);

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existing = await CatalogCategory.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existing) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const category = await CatalogCategory.create({ name });
    return res.status(201).json({ message: "Category created.", category });
  } catch (error) {
    return next(error);
  }
};

export const deleteCatalogCategory = async (req, res, next) => {
  try {
    const category = await CatalogCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted." });
  } catch (error) {
    return next(error);
  }
};

export const ensureDefaultCatalogCategories = async () => {
  const count = await CatalogCategory.countDocuments({});
  if (count > 0) {
    return;
  }

  await CatalogCategory.insertMany(defaultCategories.map((name) => ({ name })));
};
