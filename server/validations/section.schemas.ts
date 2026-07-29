import Joi from "joi";

export type CreateSectionDto = {
  pageId?: string;
  key: string;
  type?: string;
  status?: string;
  sortOrder?: number;
  anchor?: string;
  settings?: unknown;
  translations: Record<string, unknown>;
  content?: unknown;
};

export type EditSectionDto = {
  pageId?: string;
  key?: string;
  type?: string;
  status?: string;
  sortOrder?: number;
  anchor?: string | null;
  settings?: unknown;
  translations?: Record<string, unknown>;
  content?: unknown;
};

const translationSchema = Joi.object({
  badge: Joi.string().allow("", null),
  heading: Joi.string().allow("", null),
  subheading: Joi.string().allow("", null),
  body: Joi.any(),
  content: Joi.any(),
  primaryCta: Joi.object({
    label: Joi.string().allow("", null),
    href: Joi.string().allow("", null),
  }).allow(null),
  secondaryCta: Joi.object({
    label: Joi.string().allow("", null),
    href: Joi.string().allow("", null),
  }).allow(null),
}).unknown(true);

const sectionPayload = {
  pageId: Joi.string().allow("", null),
  key: Joi.string().trim().min(1),
  type: Joi.string()
    .valid("HERO", "STATS", "CTA", "RICH_TEXT", "CUSTOM", "ROUTE_SECTION")
    .default("CUSTOM"),
  status: Joi.string()
    .valid("DRAFT", "PUBLISHED", "ARCHIVED")
    .default("DRAFT"),
  sortOrder: Joi.number().integer().default(0),
  anchor: Joi.string().trim().allow("", null),
  settings: Joi.any(),
  translations: Joi.object()
    .pattern(Joi.string().valid("en", "ar", "tr"), translationSchema)
    .min(1),
  content: Joi.any(),
};

export const createSectionSchema = Joi.object({
  ...sectionPayload,
  key: sectionPayload.key.required(),
  translations: sectionPayload.translations.required(),
});

export const editSectionSchema = Joi.object({
  ...sectionPayload,
  key: sectionPayload.key.optional(),
  translations: sectionPayload.translations.optional(),
}).min(1);

export const homeExperienceSchema = Joi.object({
  status: Joi.string()
    .valid("DRAFT", "PUBLISHED", "ARCHIVED")
    .default("PUBLISHED"),
  content: Joi.object().unknown(true).default({}),
  translations: Joi.object()
    .pattern(
      Joi.string().valid("en", "ar", "tr"),
      Joi.object().unknown(true),
    )
    .min(1)
    .required(),
});
