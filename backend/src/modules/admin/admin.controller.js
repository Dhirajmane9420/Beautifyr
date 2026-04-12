import { SiteOverride } from "./admin.model.js";
import multer from "multer";
import { env } from "../../config/env.js";
import { uploadImageBufferToCloudinary } from "../../config/cloudinary.js";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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
