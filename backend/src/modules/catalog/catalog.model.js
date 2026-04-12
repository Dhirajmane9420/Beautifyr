import mongoose from "mongoose";

const catalogProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

catalogProductSchema.index({ section: 1, category: 1 });

export const CatalogProduct = mongoose.model("CatalogProduct", catalogProductSchema);
