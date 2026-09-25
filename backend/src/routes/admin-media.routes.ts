import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { Router } from "express";
import * as mediaController from "../controllers/media.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { env } from "../config/env.js";

const uploadRoot = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", mediaController.list);
router.post("/", upload.single("file"), mediaController.create);
router.delete("/:id", mediaController.remove);

export default router;
