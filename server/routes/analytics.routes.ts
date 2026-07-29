import { Router } from "express";
import { getAnalyticsOverview } from "../controllers/analytics.controller";
import verifyToken from "../middleware/verifyToken.middleware";

const analyticsRoutes = Router();
analyticsRoutes.get("/overview", verifyToken, getAnalyticsOverview);
export default analyticsRoutes;
