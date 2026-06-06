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

  const liquid = isLiquidProduct(input);
  return {
    id: input?.id || input?._id || `p-${toProductSlug(input?.name || input?.title)}`,
    name: input?.name || input?.title || "Product",
    description: String(input?.description || "").trim(),
    category: input?.category || "Skincare",
    image: input?.image || input?.imageUrl || input?.imageUrls?.[0] || "/hero.jpg",
    imageUrls: Array.isArray(input?.imageUrls) && input.imageUrls.length ? input.imageUrls : [input?.image || input?.imageUrl || "/hero.jpg"],
    price: priceNumber,
    originalPrice,
    stock: Number(input?.stock) || 0,
    sizeStock: Array.isArray(input?.sizeStock) ? input.sizeStock : [],
    sizeVariants: Array.isArray(input?.sizeVariants) ? input.sizeVariants : [],
    features: Array.isArray(input?.features) ? input.features : [],
    size: liquid ? normalizeMlSize(input?.size) : "",
    isLiquid: liquid,
  };
}
