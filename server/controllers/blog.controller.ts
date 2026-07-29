import type { Request, Response } from "express";
import { db } from "../prisma/db";
import { paginate } from "../utils/lib";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";

const publishedWhere = () => ({
  status: "PUBLISHED",
  publishedAt: { lte: new Date() },
});

export async function getBlogs(req: Request, res: Response) {
  try {
    const featured = req.query.featured === "true";
    const data = await paginate({
      req,
      prismaModel: db.post,
      query: {
        ...publishedWhere(),
        ...(featured ? { isFeatured: true } : {}),
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
        { publishedAt: "desc" },
      ],
    });

    return successResponse({ res, req, data });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getBlog(req: Request, res: Response) {
  try {
    const slug = String(req.params.slug ?? "").trim();
    const blog = await db.post.findFirst({
      where: { slug, ...publishedWhere() },
    });

    if (!blog) {
      return clientErrorResponse({
        res,
        req,
        message: "NOT_FOUND",
        status: 404,
      });
    }

    return successResponse({ res, req, data: blog });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
