import Joi from "joi";

export type CreateCareerDto = {
  fullName: string;
  email: string;
  phone?: string;
  jobTitleId?: string;
  customJobTitle?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  coverNote?: string;
  cvUrl: string;
};

export const createCareerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().max(180).required(),
  phone: Joi.string().trim().max(40).allow("", null),
  jobTitleId: Joi.string().hex().length(24),
  customJobTitle: Joi.string().trim().min(2).max(120),
  linkedInUrl: Joi.string().trim().uri({ scheme: ["http", "https"] }).max(500).allow("", null),
  portfolioUrl: Joi.string().trim().uri({ scheme: ["http", "https"] }).max(500).allow("", null),
  coverNote: Joi.string().trim().max(3000).allow("", null),
  cvUrl: Joi.string().trim().required(),
}).xor("jobTitleId", "customJobTitle");
