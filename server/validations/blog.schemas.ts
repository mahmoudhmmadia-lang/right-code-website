import Joi from "joi";

export type BlogListQuery = {
  page?: number;
  limit?: number;
  featured?: boolean;
};

export const blogListQuerySchema = Joi.object<BlogListQuery>({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(50),
  featured: Joi.boolean(),
});
