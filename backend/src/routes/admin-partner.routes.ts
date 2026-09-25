import { Router } from "express";
import * as partnerController from "../controllers/partner.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { partnerSchema, partnerUpdateSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", partnerController.listAdmin);
router.get("/:id", partnerController.getById);
router.post("/", validateBody(partnerSchema), partnerController.create);
router.put("/:id", validateBody(partnerUpdateSchema), partnerController.update);
router.delete("/:id", partnerController.remove);

export default router;
