import {
  CatalogProduct,
} from "../catalog/catalog.model.js";

import {
  HomeFeatured,
} from "./homeFeatured.model.js";

export const getHomeFeatured =
  async (req, res) => {
    let record =
      await HomeFeatured.findOne()
        .populate("productIds");

    if (!record) {
      return res.json({
        products: [],
      });
    }

    res.json({
      products:
        record.productIds,
    });
  };

export const saveHomeFeatured =
  async (req, res) => {
    const {
      productIds,
    } = req.body;

    let record =
      await HomeFeatured.findOne();

    if (!record) {
      record =
        await HomeFeatured.create(
          {
            productIds,
          }
        );
    } else {
      record.productIds =
        productIds;

      await record.save();
    }

    const updated =
      await HomeFeatured.findById(
        record._id
      ).populate("productIds");

    res.json({
      products:
        updated.productIds,
    });
  };