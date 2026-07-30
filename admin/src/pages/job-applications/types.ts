export const APPLICATION_STATUSES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
  "ARCHIVED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type JobApplication = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  jobTitleId?: string | null;
  customJobTitle?: string | null;
  jobTitle?: { id: string; title: string } | null;
  linkedInUrl?: string | null;
  portfolioUrl?: string | null;
  coverNote?: string | null;
  status: ApplicationStatus;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationCollection = {
  data: JobApplication[];
  pagesNumber: number;
  totalCount: number;
};

export type ApplicationForm = { status: ApplicationStatus; internalNotes: string };

export function applicationTitle(application: JobApplication) {
  return application.jobTitle?.title || application.customJobTitle || "—";
}
