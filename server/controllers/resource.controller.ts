import type { Request, Response } from "express";
import { db } from "../prisma/db";
import { paginate } from "../utils/lib";
import { clientErrorResponse, serverErrorResponse, successResponse } from "../utils/responses";

export type ResourceConfig = {
  model: "page" | "service" | "project" | "post" | "trainingProgram" | "inquiry" | "jobTitle" | "teamMember";
  required: string[];
  searchFields: string[];
  publicWhere?: Record<string, unknown>;
  orderBy?: Array<Record<string, "asc" | "desc">>;
};

function modelFor(config: ResourceConfig) {
  return (db as unknown as Record<string, any>)[config.model];
}

function validId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function cleanPayload(body: Record<string, unknown>) {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = body;
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

function localizedValue(payload: Record<string, unknown>, field: string) {
  const translations = payload.translations;
  if (!translations || typeof translations !== "object" || Array.isArray(translations)) return "";
  const records = translations as Record<string, unknown>;
  for (const locale of ["en", "ar", "tr"]) {
    const translation = records[locale];
    if (translation && typeof translation === "object" && !Array.isArray(translation)) {
      const value = (translation as Record<string, unknown>)[field];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return "";
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "item";
}

async function uniqueGeneratedValue(model: any, field: "slug" | "key", source: string) {
  const base = slugify(source);
  let candidate = base;
  let suffix = 2;
  while (await model.findFirst({ where: { [field]: candidate }, select: { id: true } })) candidate = `${base}-${suffix++}`;
  return candidate;
}

async function addGeneratedFields(config: ResourceConfig, model: any, payload: Record<string, unknown>) {
  if (config.model === "teamMember" && !payload.fullName) payload.fullName = localizedValue(payload, "fullName");
  if (config.model === "jobTitle" && !payload.key) payload.key = await uniqueGeneratedValue(model, "key", localizedValue(payload, "title"));
  if (["page", "service", "project", "post", "trainingProgram", "teamMember"].includes(config.model) && !payload.slug) {
    const source = String(payload.name || payload.fullName || localizedValue(payload, "title"));
    payload.slug = await uniqueGeneratedValue(model, "slug", source);
  }
  return payload;
}

function validateRequired(config: ResourceConfig, payload: Record<string, unknown>) {
  return config.required.every((key) => {
    const value = payload[key];
    return value !== undefined && value !== null && (typeof value !== "string" || value.trim().length > 0);
  });
}

function whereFor(req: Request, config: ResourceConfig, admin: boolean) {
  const conditions: Record<string, unknown>[] = [];
  if (!admin && config.publicWhere) conditions.push(config.publicWhere);

  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  if (search && config.searchFields.length) {
    conditions.push({ OR: config.searchFields.map((field) => ({ [field]: { contains: search, mode: "insensitive" } })) });
  }

  if (typeof req.query.status === "string" && req.query.status) conditions.push({ status: req.query.status });
  return conditions.length ? { AND: conditions } : {};
}

export function resourceHandlers(config: ResourceConfig) {
  const model = modelFor(config);

  return {
    list: async (req: Request, res: Response) => {
      try {
        const admin = req.path.includes("/admin") || req.originalUrl.includes("/admin");
        const data = await paginate({
          req,
          prismaModel: model,
          query: whereFor(req, config, admin),
          orderBy: config.orderBy ?? [{ createdAt: "desc" }],
        });
        return successResponse({ res, req, data });
      } catch (err) {
        return serverErrorResponse({ err, res, req });
      }
    },

    get: async (req: Request, res: Response) => {
      try {
        const id = String(req.params.id ?? "");
        if (!validId(id)) return clientErrorResponse({ res, req, message: "INVALID_ID" });
        const record = await model.findUnique({ where: { id } });
        if (!record) return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
        return successResponse({ res, req, data: record });
      } catch (err) {
        return serverErrorResponse({ err, res, req });
      }
    },

    create: async (req: Request, res: Response) => {
      try {
        const payload = await addGeneratedFields(config, model, cleanPayload(req.body as Record<string, unknown>));
        if (!validateRequired(config, payload)) {
          return clientErrorResponse({ res, req, message: "INVALID_DATA", status: 422 });
        }
        const record = await model.create({ data: payload });
        return successResponse({ res, req, data: record, status: 201, message: "CREATED_SUCCESSFULLY" });
      } catch (err) {
        return serverErrorResponse({ err, res, req });
      }
    },

    update: async (req: Request, res: Response) => {
      try {
        const id = String(req.params.id ?? "");
        if (!validId(id)) return clientErrorResponse({ res, req, message: "INVALID_ID" });
        const existing = await model.findUnique({ where: { id } });
        if (!existing) return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
        const record = await model.update({ where: { id }, data: cleanPayload(req.body as Record<string, unknown>) });
        return successResponse({ res, req, data: record, message: "UPDATED_SUCCESSFULLY" });
      } catch (err) {
        return serverErrorResponse({ err, res, req });
      }
    },

    remove: async (req: Request, res: Response) => {
      try {
        const id = String(req.params.id ?? "");
        if (!validId(id)) return clientErrorResponse({ res, req, message: "INVALID_ID" });
        const existing = await model.findUnique({ where: { id } });
        if (!existing) return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
        await model.delete({ where: { id } });
        return successResponse({ res, req, message: "DELETED_SUCCESSFULLY" });
      } catch (err) {
        return serverErrorResponse({ err, res, req });
      }
    },
  };
}
