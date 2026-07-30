import { Router } from "express";
import {
  createJobApplication,
  downloadApplicationCv,
  getJobApplications,
  getJobTitles,
  getTeamMembers,
  updateJobApplication,
} from "../controllers/career.controller";
import { validate } from "../middleware/validation.middleware";
import { careerDocumentUpload } from "../middleware/career-upload.middleware";
import { createCareerSchema } from "../validations/career.schemas";
import verifyToken from "../middleware/verifyToken.middleware";

const careerRoutes = Router();

careerRoutes.get("/job-titles", getJobTitles);
careerRoutes.get("/team", getTeamMembers);
careerRoutes.get("/applications", verifyToken, getJobApplications);
careerRoutes.patch("/applications/:id", verifyToken, updateJobApplication);
careerRoutes.get("/applications/:id/cv", verifyToken, downloadApplicationCv);
careerRoutes.post(
  "/applications",
  careerDocumentUpload,
  validate(createCareerSchema),
  createJobApplication,
);

export default careerRoutes;
