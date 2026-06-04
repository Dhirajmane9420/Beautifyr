export function toProductSlug(name) {
  return String(name || "product")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const priceNumber = Number(String(input?.price || "").replace(/[^0-9]/g, "")) || 0;
  const originalPrice =
    Number(String(input?.originalPrice || "").replace(/[^0-9]/g, "")) ||
    Math.max(priceNumber + Math.round(priceNumber * 0.05), priceNumber);

  const liquid = isLiquidProduct(input);

  return {
    id: input?.id || input?._id || `p-${toProductSlug(input?.name || input?.title)}`,
    name: input?.name || input?.title || "Product",
    category: input?.category || "Skincare",
    image: input?.image || input?.imageUrl || "/hero.jpg",
    price: priceNumber,
    originalPrice,
    size: liquid ? normalizeMlSize(input?.size) : "",
    isLiquid: liquid,
  };
}
