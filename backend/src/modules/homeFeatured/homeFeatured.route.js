import { Router }
from "express";

import {
  getHomeFeatured,
  saveHomeFeatured,
}
from "./homeFeatured.controller.js";

const router =
  Router();

router.get(
  "/public/home-featured",
  getHomeFeatured
);

router.put(
  "/admin/home-featured",
  saveHomeFeatured
);

export default router;