import mongoose from "mongoose";

const catalogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
    },
  },
  {
    timestamps: true,
  }
);

catalogCategorySchema.index({ name: 1 }, { unique: true });

export const CatalogCategory = mongoose.model("CatalogCategory", catalogCategorySchema);
