import { Router } from "express";
import { getBlog, getBlogs } from "../controllers/blog.controller";

const blogRoutes = Router();

blogRoutes.get("/", getBlogs);
blogRoutes.get("/:slug", getBlog);

export default blogRoutes;
