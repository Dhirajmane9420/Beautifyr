import { Router } from "express";
import {
	getPublicSiteOverrides,
	siteOverrideUpload,
	upsertSiteOverride,
	uploadSiteOverrideImage,
	getDeliveryDetails,
} from "./admin.controller.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import {
	createCatalogProduct,
	deleteCatalogProduct,
	getPublicCatalogProducts,
	updateCatalogProduct,
	submitProductReview,
} from "../catalog/catalog.controller.js";
import {
	createCatalogCategory,
	deleteCatalogCategory,
	getPublicCatalogCategories,
} from "../catalog/catalogCategory.controller.js";

export const adminRouter = Router();

adminRouter.get("/public/site-overrides", getPublicSiteOverrides);
adminRouter.get("/public/catalog-products", getPublicCatalogProducts);
adminRouter.get("/public/catalog-categories", getPublicCatalogCategories);
adminRouter.get("/admin/delivery-details", requireAuth, requireAdmin, getDeliveryDetails);
adminRouter.put("/admin/site-overrides", requireAuth, requireAdmin, upsertSiteOverride);
adminRouter.post(
	"/admin/site-overrides/upload-image",
	requireAuth,
	requireAdmin,
	siteOverrideUpload,
	uploadSiteOverrideImage
);
adminRouter.post("/admin/catalog-products", requireAuth, requireAdmin, createCatalogProduct);
adminRouter.put("/admin/catalog-products/:id", requireAuth, requireAdmin, updateCatalogProduct);
adminRouter.delete("/admin/catalog-products/:id", requireAuth, requireAdmin, deleteCatalogProduct);
adminRouter.post("/admin/catalog-categories", requireAuth, requireAdmin, createCatalogCategory);
adminRouter.delete("/admin/catalog-categories/:id", requireAuth, requireAdmin, deleteCatalogCategory);
adminRouter.post(
  "/catalog-products/:id/review",
  requireAuth,
  submitProductReview
);