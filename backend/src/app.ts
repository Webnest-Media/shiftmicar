import path from "node:path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import authRoutes from "./routes/auth.routes.js";
import adminBlogRoutes from "./routes/admin-blog.routes.js";
import adminCategoryRoutes from "./routes/admin-category.routes.js";
import adminTagRoutes from "./routes/admin-tag.routes.js";
import adminMediaRoutes from "./routes/admin-media.routes.js";
import adminTestimonialRoutes from "./routes/admin-testimonial.routes.js";
import adminPartnerRoutes from "./routes/admin-partner.routes.js";
import adminServiceRoutes from "./routes/admin-service.routes.js";
import adminRouteRoutes from "./routes/admin-route.routes.js";
import adminPageSeoRoutes from "./routes/admin-page-seo.routes.js";
import publicRoutes from "./routes/public.routes.js";


export function createApp() {
  const app = express();

  const helmetFn = (typeof helmet === "function" ? helmet : (helmet as any)?.default || helmet) as any;
  app.use(
    helmetFn({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        const allowed = env.FRONTEND_URL;
        const normalized = origin.replace(/\/+$/, "");
        callback(null, normalized === allowed);
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

  app.get(["/", "/api"], (_req, res) => {
    res.json({
      success: true,
      message: "Shift My Car API is live",
      status: "ok",
      database: env.IS_DB_CONFIGURED,
      timestamp: new Date().toISOString(),
    });
  });

  app.get(["/health", "/api/health"], (_req, res) => {
    res.json({
      success: true,
      data: {
        status: "ok",
        database: env.IS_DB_CONFIGURED,
      },
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/admin/blogs", adminBlogRoutes);
  app.use("/api/admin/categories", adminCategoryRoutes);
  app.use("/api/admin/tags", adminTagRoutes);
  app.use("/api/admin/media", adminMediaRoutes);
  app.use("/api/admin/testimonials", adminTestimonialRoutes);
  app.use("/api/admin/partners", adminPartnerRoutes);
  app.use("/api/admin/services", adminServiceRoutes);
  app.use("/api/admin/routes", adminRouteRoutes);
  app.use("/api/admin/page-seo", adminPageSeoRoutes);
  app.use("/api", publicRoutes);


  app.use(errorHandler);

  return app;
}
