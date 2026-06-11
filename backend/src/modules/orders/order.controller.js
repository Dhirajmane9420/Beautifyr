import { Order } from "./order.model.js";
import { CatalogProduct } from "../catalog/catalog.model.js";
const normalizeOrderItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const title = String(item?.title || item?.name || "").trim();
      const price = Number(item?.price) || 0;
      const quantity = Math.max(1, Number(item?.quantity) || 1);

      if (!title || price < 0) {
        return null;
      }

      return {
        productId: String(item?.productId || item?.id || "").trim(),
        title,
        category: String(item?.category || "Skincare").trim(),
        imageUrl: String(item?.imageUrl || item?.image || "/hero.jpg").trim(),
        price,
        quantity,
        size: String(item?.size || "").trim(),
        sizeVariant: String(item?.sizeVariant || item?.variant || "").trim(),
      };
    })
    .filter(Boolean);
};

export const placeOrder = async (req, res, next) => {
  try {
    const { items, address, paymentMethod } = req.body;
    const normalizedItems = normalizeOrderItems(items);

    for (const item of normalizedItems) {
  const product = await CatalogProduct.findById(
    item.productId
  );

  if (!product) {
    return res.status(404).json({
      message: `${item.title} not found.`,
    });
  }

  const selectedSize =
    item.sizeVariant || item.size;

  const sizeEntry =
    product.sizeStock.find(
      (size) =>
        size.label === selectedSize
    );

  if (!sizeEntry) {
    return res.status(400).json({
      message: `Selected size not available for ${item.title}.`,
    });
  }

  if (
    sizeEntry.stock <
    item.quantity
  ) {
    return res.status(400).json({
      message:
        `${item.title} (${selectedSize}) has only ${sizeEntry.stock} left in stock.`,
    });
  }
}

    if (!normalizedItems.length) {
      return res.status(400).json({ message: "Order items are required." });
    }

    if (!address || !address.fullName || !address.phone || !address.line1 || !address.city || !address.pincode) {
      return res.status(400).json({ message: "Delivery address is required." });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 7 : 0;
    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      userSnapshot: {
        name: req.user.name,
        email: req.user.email,
      },
      items: normalizedItems,
      address: {
        fullName: String(address.fullName).trim(),
        phone: String(address.phone).trim(),
        line1: String(address.line1).trim(),
        city: String(address.city).trim(),
        pincode: String(address.pincode).trim(),
      },
      paymentMethod: ["upi", "card", "cod"].includes(paymentMethod) ? paymentMethod : "upi",
      subtotal,
      deliveryFee,
      totalAmount,
      status: "processing",
    });

    for (const item of normalizedItems) {
  const product =
    await CatalogProduct.findById(
      item.productId
    );

  if (!product) continue;

  const selectedSize =
    item.sizeVariant || item.size;

  const sizeEntry =
    product.sizeStock.find(
      (size) =>
        size.label === selectedSize
    );

  if (!sizeEntry) continue;

  sizeEntry.stock =
    Math.max(
      0,
      sizeEntry.stock -
        item.quantity
    );

  product.stock =
    product.sizeStock.reduce(
      (sum, size) =>
        sum + size.stock,
      0
    );

  product.inStock =
    product.stock > 0;

  await product.save();
}

    return res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
     console.log(error);
    return next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};