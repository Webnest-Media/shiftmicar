import { Router } from "express";
import * as blogController from "../controllers/blog.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/error-handler.js";
import {
  blogCreateSchema,
  blogUpdateSchema,
  paginationSchema,
  scheduleSchema,
} from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/dashboard", blogController.dashboard);
router.get("/authors", blogController.authors);
router.get("/link-search", blogController.linkSearch);
router.get("/", validateQuery(paginationSchema), blogController.listAdmin);
router.get("/:id", blogController.getAdminById);
router.get("/:id/preview", blogController.preview);
router.get("/:id/revisions", blogController.revisions);
router.get("/:id/related-suggestions", blogController.suggestRelated);
router.post("/", validateBody(blogCreateSchema), blogController.create);
router.put("/:id", validateBody(blogUpdateSchema), blogController.update);
router.delete("/:id", blogController.remove);
router.post("/:id/publish", blogController.publish);
router.post("/:id/unpublish", blogController.unpublish);
router.post("/:id/schedule", validateBody(scheduleSchema), blogController.schedule);

export default router;
