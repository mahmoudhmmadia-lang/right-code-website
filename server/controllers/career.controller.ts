import type { Request, Response } from "express";
import { db } from "../prisma/db";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";
import type { CreateCareerDto } from "../validations/career.schemas";

const jobTitleModel = db.jobTitle;
const teamMemberModel = db.teamMember;
const jobApplicationModel = db.jobApplication;

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
    const title = await jobTitleModel.findFirst({
      where: { id: body.jobTitleId, isActive: true },
    });
    if (!title) {
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
        jobTitleId: body.jobTitleId,
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
