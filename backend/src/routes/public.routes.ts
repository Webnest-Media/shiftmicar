import { Router } from "express";
import type { Request, Response } from "express";
import * as blogController from "../controllers/blog.controller.js";
import * as categoryController from "../controllers/category.controller.js";
import * as testimonialController from "../controllers/testimonial.controller.js";
import * as partnerController from "../controllers/partner.controller.js";
import * as serviceController from "../controllers/service.controller.js";
import * as routeController from "../controllers/route.controller.js";
import * as pageSeoController from "../controllers/page-seo.controller.js";
import * as blogService from "../services/blog.service.js";
import { validateQuery, asyncHandler } from "../middleware/error-handler.js";
import { paginationSchema } from "../utils/validators.js";
import { success } from "../utils/api-response.js";

const router = Router();

router.get("/blogs", validateQuery(paginationSchema), blogController.listPublic);
router.get("/blogs/:slug", blogController.getPublicBySlug);
router.get("/categories", categoryController.list);
router.get("/categories/:slug", categoryController.getBySlug);
router.get("/testimonials", testimonialController.listPublic);
router.get("/partners", partnerController.listPublic);
router.get("/services", serviceController.listPublic);
router.get("/services/:slug", serviceController.getBySlug);
router.get("/routes", routeController.listPublic);
router.get("/routes/:slug", routeController.getBySlug);
router.get("/page-seo", pageSeoController.getByPath);

router.get(
  "/redirects",
  asyncHandler(async (req: Request, res: Response) => {
    const fromPath =
      typeof req.query.from === "string" ? req.query.from : "";
    if (!fromPath) {
      return res.status(400).json({ success: false, message: "from is required" });
    }
    const redirect = await blogService.resolveRedirect(fromPath);
    if (!redirect) {
      return res.status(404).json({ success: false, message: "Redirect not found" });
    }
    return success(res, redirect);
  }),
);

export default router;
