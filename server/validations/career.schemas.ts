import Joi from "joi";

export type CreateCareerDto = {
  fullName: string;
  email: string;
  phone?: string;
  jobTitleId: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  coverNote?: string;
  cvUrl: string;
};

export const createCareerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().max(180).required(),
  phone: Joi.string().trim().max(40).allow("", null),
  jobTitleId: Joi.string().hex().length(24).required(),
  linkedInUrl: Joi.string().trim().uri().max(500).allow("", null),
  portfolioUrl: Joi.string().trim().uri().max(500).allow("", null),
  coverNote: Joi.string().trim().max(3000).allow("", null),
  cvUrl: Joi.string().trim().required(),
});
