import { Express, Router } from "express";
import authRoutes from "./auth.routes";
import sectionRoutes from "./section.routes";
import { contentResourceRoutes, inquiryRoutes } from "./resource.routes";
import careerRoutes from "./career.routes";
import blogRoutes from "./blog.routes";
import analyticsRoutes from "./analytics.routes";

function apiRouter() {
  const api = Router();

  api.get(
    "/health",
    (
      _req: unknown,
      res: { status: (code: number) => { json: (value: unknown) => unknown } },
    ) => {
      return res
        .status(200)
        .json({ status: "OK", timestamp: new Date().toISOString() });
    },
  );
  api.use("/auth", authRoutes);
  api.use("/sections", sectionRoutes);
  api.use(
    "/pages",
    contentResourceRoutes({
      model: "page",
      required: ["slug", "translations"],
      searchFields: ["slug"],
      publicWhere: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }],
    }),
  );
  api.use(
    "/services",
    contentResourceRoutes({
      model: "service",
      required: ["slug", "translations"],
      searchFields: ["slug"],
      publicWhere: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }],
    }),
  );
  api.use(
    "/projects",
    contentResourceRoutes({
      model: "project",
      required: ["projectNumber", "name", "translations"],
      searchFields: ["projectNumber", "name", "slug"],
      publicWhere: { visibility: "PUBLIC" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  );
  api.use(
    "/posts",
    contentResourceRoutes({
      model: "post",
      required: ["slug", "translations"],
      searchFields: ["slug"],
      publicWhere: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }],
    }),
  );
  api.use(
    "/training/programs",
    contentResourceRoutes({
      model: "trainingProgram",
      required: ["slug", "translations"],
      searchFields: ["slug"],
      publicWhere: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }],
    }),
  );
  api.use(
    "/job-titles",
    contentResourceRoutes({
      model: "jobTitle",
      required: ["key", "translations"],
      searchFields: ["key"],
      publicWhere: { isActive: true },
      orderBy: [{ sortOrder: "asc" }],
    }),
  );
  api.use(
    "/team-members",
    contentResourceRoutes({
      model: "teamMember",
      required: ["slug", "fullName", "jobTitleKey"],
      searchFields: ["slug", "fullName", "jobTitleKey"],
      publicWhere: { isActive: true },
      orderBy: [{ sortOrder: "asc" }],
    }),
  );
  api.use("/inquiries", inquiryRoutes());
  api.use("/careers", careerRoutes);
  api.use("/blogs", blogRoutes);
  api.use("/analytics", analyticsRoutes);
  return api;
}

export default function router(server: Express) {
  const api = apiRouter();
  server.use("/api", api);
  server.use(apiRouter());
}
