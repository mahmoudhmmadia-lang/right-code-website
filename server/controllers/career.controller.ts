import type { Request, Response } from "express";
import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { db } from "../prisma/db";
import { paginate } from "../utils/lib";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";
import type { CreateCareerDto } from "../validations/career.schemas";

const jobTitleModel = db.jobTitle;
const teamMemberModel = db.teamMember;
const jobApplicationModel = db.jobApplication;

const applicationStatuses = new Set([
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
  "ARCHIVED",
]);

function validId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

export async function getJobTitles(req: Request, res: Response) {
  try {
    const data = await jobTitleModel.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
    });
    return successResponse({ res, req, data });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getTeamMembers(req: Request, res: Response) {
  try {
    const [members, jobTitles] = await Promise.all([
      teamMemberModel.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { fullName: "asc" }],
      }),
      jobTitleModel.findMany({ where: { isActive: true } }),
    ]);
    const titleByKey = new Map(jobTitles.map((title) => [title.key, title]));
    const data = members.map((member) => ({
      ...member,
      jobTitle: titleByKey.get(member.jobTitleKey) ?? null,
    }));
    return successResponse({ res, req, data });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function createJobApplication(req: Request, res: Response) {
  try {
    const body = req.body as CreateCareerDto;
    const title = body.jobTitleId
      ? await jobTitleModel.findFirst({
          where: { id: body.jobTitleId, isActive: true },
        })
      : null;
    if (body.jobTitleId && !title) {
      return clientErrorResponse({
        res,
        req,
        message: "INVALID_DATA",
        status: 422,
      });
    }

    const created = await jobApplicationModel.create({
      data: {
        fullName: body.fullName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        jobTitleId: body.jobTitleId || null,
        customJobTitle: body.customJobTitle?.trim() || null,
        linkedInUrl: body.linkedInUrl?.trim() || null,
        portfolioUrl: body.portfolioUrl?.trim() || null,
        coverNote: body.coverNote?.trim() || null,
        cvUrl: body.cvUrl,
      },
    });

    return successResponse({
      res,
      req,
      data: { id: created.id },
      status: 201,
      message: "CREATED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getJobApplications(req: Request, res: Response) {
  try {
    const conditions: Record<string, unknown>[] = [];
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status.trim() : "";
    if (search) {
      conditions.push({
        OR: ["fullName", "email", "phone", "customJobTitle"].map((field) => ({
          [field]: { contains: search, mode: "insensitive" },
        })),
      });
    }
    if (status && applicationStatuses.has(status)) conditions.push({ status });

    const collection = await paginate({
      req,
      prismaModel: jobApplicationModel,
      query: conditions.length ? { AND: conditions } : {},
      orderBy: [{ createdAt: "desc" }],
    });
    const titleIds = [...new Set(collection.data.map((item: { jobTitleId?: string | null }) => item.jobTitleId).filter(Boolean))] as string[];
    const titles = titleIds.length
      ? await jobTitleModel.findMany({ where: { id: { in: titleIds } } })
      : [];
    const titleById = new Map(titles.map((title) => [title.id, title]));
    collection.data = collection.data.map((application: { jobTitleId?: string | null }) => ({
      ...application,
      jobTitle: application.jobTitleId ? titleById.get(application.jobTitleId) ?? null : null,
    }));
    return successResponse({ res, req, data: collection });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function updateJobApplication(req: Request, res: Response) {
  try {
    const id = String(req.params.id ?? "");
    if (!validId(id)) return clientErrorResponse({ res, req, message: "INVALID_ID" });
    const status = String(req.body.status ?? "");
    if (!applicationStatuses.has(status)) {
      return clientErrorResponse({ res, req, message: "INVALID_DATA", status: 422 });
    }
    const existing = await jobApplicationModel.findUnique({ where: { id } });
    if (!existing) return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
    const data = await jobApplicationModel.update({
      where: { id },
      data: {
        status,
        internalNotes: typeof req.body.internalNotes === "string"
          ? req.body.internalNotes.trim().slice(0, 5000) || null
          : existing.internalNotes,
      },
    });
    return successResponse({ res, req, data, message: "UPDATED_SUCCESSFULLY" });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function downloadApplicationCv(req: Request, res: Response) {
  try {
    const id = String(req.params.id ?? "");
    if (!validId(id)) return clientErrorResponse({ res, req, message: "INVALID_ID" });
    const application = await jobApplicationModel.findUnique({ where: { id } });
    if (!application) return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
    const filename = basename(application.cvUrl);
    const filePath = resolve(process.cwd(), "private-uploads/cv", filename);
    if (!existsSync(filePath)) return clientErrorResponse({ res, req, message: "NOT_FOUND", status: 404 });
    return res.download(filePath, `${application.fullName.replace(/[^\p{L}\p{N}.-]+/gu, "-")}-CV${filename.includes(".") ? `.${filename.split(".").pop()}` : ""}`);
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
