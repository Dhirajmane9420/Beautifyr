import mongoose from "mongoose";

const siteOverrideSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    kind: {
      type: String,
      required: true,
      enum: ["text", "image"],
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

siteOverrideSchema.index({ page: 1, key: 1 }, { unique: true });

export const SiteOverride = mongoose.model("SiteOverride", siteOverrideSchema);
