import { Router } from "express";
import * as pageSeoController from "../controllers/page-seo.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { pageSeoSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", pageSeoController.listAll);
router.get("/by-path", pageSeoController.getByPath);
router.put("/by-path", validateBody(pageSeoSchema), pageSeoController.upsert);

export default router;
