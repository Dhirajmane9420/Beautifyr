import mongoose from "mongoose";

const homeFeaturedSchema =
  new mongoose.Schema(
    {
      productIds: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "CatalogProduct",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export const HomeFeatured =
  mongoose.model(
    "HomeFeatured",
    homeFeaturedSchema
  );