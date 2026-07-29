import type { Request, Response } from "express";
import { db } from "../prisma/db";
import { serverErrorResponse, successResponse } from "../utils/responses";

const WINDOWS = new Set([7, 30, 90]);

function countsByStatus(rows: Array<{ status: string }>) {
  const counts = new Map<string, number>();
  rows.forEach(({ status }) => counts.set(status, (counts.get(status) ?? 0) + 1));
  return [...counts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

function activityBuckets(rows: Array<{ createdAt: Date }>, since: Date, days: number) {
  const bucketCount = Math.min(days, 12);
  const bucketSize = days / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({
    start: new Date(since.getTime() + index * bucketSize * 86_400_000),
    end: new Date(since.getTime() + (index + 1) * bucketSize * 86_400_000),
    count: 0,
  }));
  rows.forEach((row) => {
    const bucket = buckets.find((item) => row.createdAt >= item.start && row.createdAt < item.end);
    if (bucket) bucket.count += 1;
  });
  return buckets.map((bucket) => ({
    date: bucket.start.toISOString(),
    count: bucket.count,
  }));
}

export async function getAnalyticsOverview(req: Request, res: Response) {
  try {
    const requestedDays = Number(req.query.days ?? 30);
    const days = WINDOWS.has(requestedDays) ? requestedDays : 30;
    const since = new Date(Date.now() - days * 86_400_000);

    const [
      publishedPages,
      activeServices,
      publicProjects,
      publishedPosts,
      trainingPrograms,
      teamMembers,
      totalInquiries,
      newInquiries,
      inquiriesInWindow,
      projects,
      recentInquiries,
    ] = await Promise.all([
      db.page.count({ where: { status: "PUBLISHED" } }),
      db.service.count({ where: { status: "PUBLISHED" } }),
      db.project.count({ where: { visibility: "PUBLIC" } }),
      db.post.count({ where: { status: "PUBLISHED" } }),
      db.trainingProgram.count({ where: { status: "PUBLISHED" } }),
      db.teamMember.count({ where: { isActive: true } }),
      db.inquiry.count(),
      db.inquiry.count({ where: { status: "NEW" } }),
      db.inquiry.findMany({ where: { createdAt: { gte: since } }, select: { status: true, createdAt: true } }),
      db.project.findMany({ select: { status: true, progressPercent: true } }),
      db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, fullName: true, email: true, organization: true, status: true, createdAt: true } }),
    ]);

    const averageProgress = projects.length
      ? Math.round(projects.reduce((sum, project) => sum + project.progressPercent, 0) / projects.length)
      : 0;

    return successResponse({
      res,
      req,
      data: {
        windowDays: days,
        generatedAt: new Date().toISOString(),
        summary: { publishedPages, activeServices, publicProjects, publishedPosts, trainingPrograms, teamMembers, totalInquiries, newInquiries, averageProgress },
        inquiryStatuses: countsByStatus(inquiriesInWindow),
        projectStatuses: countsByStatus(projects),
        inquiryActivity: activityBuckets(inquiriesInWindow, since, days),
        recentInquiries,
      },
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
