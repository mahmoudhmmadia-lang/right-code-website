import { Request, Response } from "express";
import { db } from "../prisma/db";
import { paginate } from "../utils/lib";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";
import type {
  CreateSectionDto,
  EditSectionDto,
} from "../validations/section.schemas";

const sectionModel = db.section as any;
const HOME_EXPERIENCE_KEY = "home-experience";

function isObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function cleanOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text ? text : undefined;
}

function normalizeSection(section: any) {
  const translations =
    section.translations && typeof section.translations === "object"
      ? section.translations
      : {};

  return {
    ...section,
    pageId: section.pageId ?? "home",
    type: section.type ?? "CUSTOM",
    status: section.status ?? "PUBLISHED",
    sortOrder: section.sortOrder ?? 0,
    anchor: section.anchor ?? null,
    settings: section.settings ?? null,
    translations,
  };
}

function sectionPayload(body: CreateSectionDto | EditSectionDto) {
  const data: Record<string, unknown> = {};

  if ("pageId" in body) data.pageId = cleanOptionalString(body.pageId) ?? "home";
  if ("key" in body && body.key != null) data.key = body.key.trim();
  if ("type" in body) data.type = body.type ?? "CUSTOM";
  if ("status" in body) data.status = body.status ?? "DRAFT";
  if ("sortOrder" in body) data.sortOrder = Number(body.sortOrder) || 0;
  if ("anchor" in body) data.anchor = cleanOptionalString(body.anchor);
  if ("settings" in body) data.settings = body.settings ?? null;
  if ("translations" in body && body.translations) {
    data.translations = body.translations;
  }
  if ("content" in body) data.content = body.content ?? null;

  return data;
}

function listWhere(req: Request, isAdmin: boolean) {
  const search = cleanOptionalString(req.query.search);
  const pageId = cleanOptionalString(req.query.pageId);
  const where: Record<string, unknown> = {};
  const and: unknown[] = [];

  if (pageId) and.push({ pageId });
  if (!isAdmin) and.push({ OR: [{ status: "PUBLISHED" }, { status: null }] });
  if (search) {
    and.push({
      OR: [{ key: { contains: search } }, { anchor: { contains: search } }],
    });
  }
  if (and.length) where.AND = and;

  return where;
}

export async function createSection(req: Request, res: Response) {
  try {
    const body = req.body as CreateSectionDto;
    const created = await sectionModel.create({
      data: sectionPayload({
        ...body,
        pageId: body.pageId ?? "home",
        type: body.type ?? "CUSTOM",
        status: body.status ?? "DRAFT",
        sortOrder: body.sortOrder ?? 0,
      }),
    });

    return successResponse({
      res,
      req,
      status: 201,
      message: "CREATED_SUCCESSFULLY",
      data: normalizeSection(created),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function editSection(req: Request, res: Response) {
  try {
    const id = String(req.params.id ?? "");
    if (!isObjectId(id)) {
      return clientErrorResponse({ res, req, message: "INVALID_ID" });
    }

    const section = await sectionModel.findUnique({ where: { id } });
    if (!section) {
      return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
    }

    const updated = await sectionModel.update({
      where: { id },
      data: sectionPayload(req.body as EditSectionDto),
    });

    return successResponse({
      res,
      req,
      message: "UPDATED_SUCCESSFULLY",
      data: normalizeSection(updated),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getSections(req: Request, res: Response) {
  try {
    const isAdmin = req.path.includes("/admin") || req.originalUrl.includes("/admin");
    const materials = await paginate({
      req,
      prismaModel: sectionModel,
      query: listWhere(req, isAdmin),
      orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
    });

    return successResponse({
      res,
      req,
      data: {
        ...materials,
        data: materials.data.map(normalizeSection),
      },
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getSection(req: Request, res: Response) {
  try {
    const id = String(req.params.id ?? "");
    if (!isObjectId(id)) {
      return clientErrorResponse({ res, req, message: "INVALID_ID" });
    }

    const section = await sectionModel.findUnique({ where: { id } });
    if (!section) {
      return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
    }

    return successResponse({ res, req, data: normalizeSection(section) });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function removeSection(req: Request, res: Response) {
  try {
    const id = String(req.params.id ?? "");
    if (!isObjectId(id)) {
      return clientErrorResponse({ res, req, message: "INVALID_ID" });
    }

    const section = await sectionModel.findUnique({ where: { id } });
    if (!section) {
      return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
    }

    await sectionModel.delete({ where: { id } });

    return successResponse({ res, req, message: "DELETED_SUCCESSFULLY" });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getHomeExperience(req: Request, res: Response) {
  try {
    const isAdmin = req.originalUrl.includes("/admin");
    const where: Record<string, unknown> = {
      pageId: "home",
      key: HOME_EXPERIENCE_KEY,
    };

    if (!isAdmin) {
      where.OR = [{ status: "PUBLISHED" }, { status: null }];
    }

    const section = await sectionModel.findFirst({ where });
    return successResponse({
      res,
      req,
      data: section ? normalizeSection(section) : null,
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function saveHomeExperience(req: Request, res: Response) {
  try {
    const existing = await sectionModel.findFirst({
      where: { pageId: "home", key: HOME_EXPERIENCE_KEY },
    });
    const body = req.body as {
      status?: string;
      content?: unknown;
      translations: Record<string, unknown>;
    };
    const data = {
      pageId: "home",
      key: HOME_EXPERIENCE_KEY,
      type: "CUSTOM",
      status: body.status ?? "PUBLISHED",
      sortOrder: 0,
      anchor: "home",
      content: body.content ?? {},
      translations: body.translations,
    };
    const saved = existing
      ? await sectionModel.update({ where: { id: existing.id }, data })
      : await sectionModel.create({ data });

    return successResponse({
      res,
      req,
      status: existing ? 200 : 201,
      message: existing ? "UPDATED_SUCCESSFULLY" : "CREATED_SUCCESSFULLY",
      data: normalizeSection(saved),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
