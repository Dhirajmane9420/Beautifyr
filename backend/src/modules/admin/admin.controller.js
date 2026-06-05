import { SiteOverride } from "./admin.model.js";
import multer from "multer";
import { env } from "../../config/env.js";
import { uploadImageBufferToCloudinary } from "../../config/cloudinary.js";
import { Order } from "../orders/order.model.js";
import { User } from "../auth/auth.model.js";
import { CatalogProduct } from "../catalog/catalog.model.js";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

// Note: average ratings should come from real user reviews.
// Do not fabricate or synthesize ratings here.

const getProductKey = (item) => String(item?.productId || item?.title || "").trim().toLowerCase();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
});

export const siteOverrideUpload = imageUpload.single("image");

export const getPublicSiteOverrides = async (req, res, next) => {
  try {
    const page = (req.query.page || "home").toString().toLowerCase();
    const overrides = await SiteOverride.find({ page })
      .select("page key kind value updatedAt")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ overrides });
  } catch (error) {
    return next(error);
  }
};

export const upsertSiteOverride = async (req, res, next) => {
  try {
    const { page, key, kind, value } = req.body;

    if (!page || !key || !kind || typeof value !== "string") {
      return res.status(400).json({ message: "page, key, kind and value are required." });
    }

    if (!["text", "image"].includes(kind)) {
      return res.status(400).json({ message: "kind must be either 'text' or 'image'." });
    }

    const normalizedPage = page.toLowerCase().trim();
    const normalizedKey = key.trim();

    if (!normalizedKey) {
      return res.status(400).json({ message: "key cannot be empty." });
    }

    const override = await SiteOverride.findOneAndUpdate(
      { page: normalizedPage, key: normalizedKey },
      {
        page: normalizedPage,
        key: normalizedKey,
        kind,
        value,
        updatedBy: req.user._id,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).select("page key kind value updatedAt");

    return res.status(200).json({
      message: "Saved successfully.",
      override,
    });
  } catch (error) {
    return next(error);
  }
};

export const uploadSiteOverrideImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    if (!req.file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files are allowed." });
    }

    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
      return res.status(500).json({ message: "Cloudinary is not configured on the server." });
    }

    const uploadResult = await uploadImageBufferToCloudinary({
      buffer: req.file.buffer,
    });

    return res.status(200).json({
      message: "Image uploaded successfully.",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    if (error?.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image size exceeds 10MB limit." });
    }

    return next(error);
  }
};

export const getDeliveryDetails = async (_req, res, next) => {
  try {
    const [usersCount, orders, catalogProducts] = await Promise.all([
      User.countDocuments({}),
      Order.find({})
        .sort({ createdAt: -1 })
        .populate("user", "name email role")
        .lean(),
      CatalogProduct.find({}).select("title category price imageUrl inStock").lean(),
    ]);

    const productStats = new Map();

    for (const order of orders) {
      const seenInOrder = new Set();

      for (const item of order.items || []) {
        const key = getProductKey(item);
        if (!key) continue;

        const quantity = Math.max(0, Number(item.quantity) || 0);
        const existing = productStats.get(key) || {
          productId: item.productId || key,
          title: item.title || "Product",
          category: item.category || "Skincare",
          price: Number(item.price) || 0,
          imageUrl: item.imageUrl || "/hero.jpg",
          soldCount: 0,
          orderCount: 0,
        };

        existing.soldCount += quantity;
        if (!seenInOrder.has(key)) {
          existing.orderCount += 1;
          seenInOrder.add(key);
        }

        productStats.set(key, existing);
      }
    }

    for (const product of catalogProducts) {
      const key = getProductKey({ productId: product._id, title: product.title });
      if (productStats.has(key)) continue;

      productStats.set(key, {
        productId: product._id,
        title: product.title,
        category: product.category,
        price: Number(product.price) || 0,
        imageUrl: product.imageUrl || "/hero.jpg",
        soldCount: 0,
        orderCount: 0,
      });
    }

    const topProducts = Array.from(productStats.values()).sort(
      (left, right) => right.soldCount - left.soldCount || left.title.localeCompare(right.title)
    );

    const requestedProductsCount = orders.reduce(
      (sum, order) => sum + (order.items || []).reduce((itemSum, item) => itemSum + (Number(item.quantity) || 0), 0),
      0
    );

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

    const normalizedOrders = orders.map((order) => ({
      id: order._id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: Number(order.totalAmount) || 0,
      subtotal: Number(order.subtotal) || 0,
      deliveryFee: Number(order.deliveryFee) || 0,
      createdAt: order.createdAt,
      customer: order.user
        ? {
            id: order.user._id,
            name: order.user.name,
            email: order.user.email,
            role: order.user.role,
          }
        : order.userSnapshot,
      address: order.address,
      items: (order.items || []).map((item) => ({
        productId: item.productId,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        size: item.size,
        sizeVariant: item.sizeVariant,
      })),
    }));

    return res.status(200).json({
      summary: {
        usersCount,
        ordersCount: orders.length,
        requestedProductsCount,
        totalRevenue,
        topSellingProductsCount: topProducts.filter((product) => product.soldCount > 0).length,
      },
      topProducts,
      orders: normalizedOrders,
    });
  } catch (error) {
    return next(error);
  }
};
