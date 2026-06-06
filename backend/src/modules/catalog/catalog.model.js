import mongoose from "mongoose";

const catalogProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
      default: undefined,
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    section: {
      type: String,
      required: true,
      enum: ["Cleansers", "Serums", "Moisturizers", "Best Sellers", "New Arrivals"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrls: {
      type: [String],
      default: [],
      validate: {
        validator: (items) => Array.isArray(items) && items.length <= 7,
        message: "A product can have at most 7 images.",
      },
    },
    sizeStock: {
      type: [
        {
          label: {
            type: String,
            trim: true,
            required: true,
          },
          stock: {
            type: Number,
            min: 0,
            default: 0,
          },
          originalPrice: {
            type: Number,
            min: 0,
            default: 0,
          },
          price: {
            type: Number,
            min: 0,
            default: 0,
          },
        },
      ],
      default: [],
    },
    sizeVariants: {
      type: [
        {
          label: {
            type: String,
            trim: true,
            required: true,
          },
          stock: {
            type: Number,
            min: 0,
            default: 0,
          },
          price: {
            type: Number,
            min: 0,
            default: 0,
          },
          originalPrice: {
            type: Number,
            min: 0,
            default: 0,
          },
        },
      ],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

catalogProductSchema.index({ section: 1, category: 1 });

export const CatalogProduct = mongoose.model("CatalogProduct", catalogProductSchema);
