export function toProductSlug(name) {
  return String(name || "product")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value || "").replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeImageList(input) {
  if (Array.isArray(input)) {
    return input.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof input === "string") {
    return input
      .split(/\r?\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSizeVariants(input) {
  if (Array.isArray(input)) {
    return input
      .map((variant) => {
        const label = String(variant?.label || "").trim();
        const stock = Number(variant?.stock) || 0;
        const price = Number(variant?.price) || 0;
        const originalPrice = Number(variant?.originalPrice) || price;

        if (!label) {
          return null;
        }

        return {
          label,
          stock: Math.max(0, Math.floor(stock)),
          price: Math.max(0, price),
          originalPrice: Math.max(price, originalPrice),
        };
      })
      .filter(Boolean);
  }

  return [];
}

function normalizeMlSize(inputSize) {
  const match = String(inputSize || "").match(/\d+/);
  if (!match) return "125 ml";
  return `${match[0]} ml`;
}

export function isLiquidProduct(input) {
  const value = `${input?.name || input?.title || ""} ${input?.category || ""}`.toLowerCase();
  return ["serum", "cleanser", "toner", "sunscreen", "gel", "lotion", "essence", "elixir", "fluid", "mist", "wash"]
    .some((token) => value.includes(token));
}

export function toProductPayload(input) {
  const priceNumber = parsePrice(input?.discountedPrice ?? input?.price);
  const parsedOriginalPrice = parsePrice(input?.originalPrice);
  const originalPrice = parsedOriginalPrice > 0 ? parsedOriginalPrice : priceNumber;

  const explicitImageList = normalizeImageList(input?.images);
  const catalogImageList = normalizeImageList(input?.imageUrls);
  const fallbackImage = input?.image || input?.imageUrl || explicitImageList[0] || catalogImageList[0];
  const images = Array.from(
    new Set([fallbackImage, ...explicitImageList, ...catalogImageList].filter(Boolean))
  );

  const sizeStock = Array.isArray(input?.sizeStock)
    ? input.sizeStock
        .map((entry) => ({
          label: String(entry?.label || "").trim(),
          stock: Number(entry?.stock) || 0,
        }))
        .filter((entry) => entry.label)
    : [];

  const sizeVariants = normalizeSizeVariants(input?.sizeVariants);

  const sizeOptions = Array.isArray(input?.sizes)
    ? input.sizes.map((size) => String(size || "").trim()).filter(Boolean)
    : sizeVariants.length > 0
      ? sizeVariants.map((variant) => variant.label)
      : sizeStock.filter((entry) => entry.stock > 0).map((entry) => entry.label);

  const fallbackSize = sizeOptions[0] || input?.size;
  const selectedSizeVariant = sizeVariants.find((variant) => variant.label === fallbackSize) || sizeVariants[0] || null;

  const liquid = isLiquidProduct(input);
  const resolvedPrice = selectedSizeVariant ? selectedSizeVariant.price : priceNumber;
  const resolvedOriginalPrice = selectedSizeVariant ? selectedSizeVariant.originalPrice : originalPrice;

  return {
    id: input?.id || input?._id || `p-${toProductSlug(input?.name || input?.title)}`,
    name: input?.name || input?.title || "Product",
    description: String(input?.description || "").trim(),
    category: input?.category || "Skincare",
    image: input?.image || input?.imageUrl || "/hero.jpg",
    price: priceNumber,
    originalPrice,
    size: liquid ? normalizeMlSize(input?.size) : "",
    isLiquid: liquid,
  };
}
