import { Router } from "express";
import {
  resourceHandlers,
  type ResourceConfig,
} from "../controllers/resource.controller";
import { multipartForm } from "../middleware/multipart.middleware";
import verifyToken from "../middleware/verifyToken.middleware";

export function contentResourceRoutes(config: ResourceConfig) {
  const router = Router();
  const handlers = resourceHandlers(config);

  router.get("/", handlers.list);
  router.get("/admin", verifyToken, handlers.list);
  router.post("/", verifyToken, multipartForm, handlers.create);
  router.get("/:id", handlers.get);
  router.patch("/:id", verifyToken, multipartForm, handlers.update);
  router.delete("/:id", verifyToken, handlers.remove);
  return router;
}

export function inquiryRoutes() {
  const router = Router();
  const handlers = resourceHandlers({
    model: "inquiry",
    required: ["fullName", "email", "message"],
    searchFields: ["fullName", "email", "organization"],
  });

  router.post("/", multipartForm, handlers.create);
  router.get("/", verifyToken, handlers.list);
  router.patch("/:id", verifyToken, multipartForm, handlers.update);
  router.delete("/:id", verifyToken, handlers.remove);
  return router;
}
