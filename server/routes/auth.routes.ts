import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { loginSchema } from "../validations/auth.schemas";
import { validate } from "@/middleware/validation.middleware";

const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), login);

export default authRoutes;
