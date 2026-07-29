import { Router } from "express";
import {
  createJobApplication,
  getJobTitles,
  getTeamMembers,
} from "../controllers/career.controller";
import { validate } from "../middleware/validation.middleware";
import { careerDocumentUpload } from "../middleware/career-upload.middleware";
import { createCareerSchema } from "../validations/career.schemas";

const careerRoutes = Router();

careerRoutes.get("/job-titles", getJobTitles);
careerRoutes.get("/team", getTeamMembers);
careerRoutes.post(
  "/applications",
  careerDocumentUpload,
  validate(createCareerSchema),
  createJobApplication,
);

export default careerRoutes;
