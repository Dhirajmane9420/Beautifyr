import { searchCatalogProducts } from "./catalog.controller.js";
import { Router } from "express";

const catalogrouter = Router();



catalogrouter.get(
  "/public/catalog-search",
  searchCatalogProducts
);
export const catalogRouter = catalogrouter;
