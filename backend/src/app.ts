import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { openApiDocument } from "./config/openapi.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { leaveRequestRoutes } from "./modules/leave-requests/leave-request.routes.js";
import { userRoutes } from "./modules/users/user.routes.js";

export const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API çalışıyor.", data: null });
});

app.get("/api/docs.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);

app.use(errorHandler);
