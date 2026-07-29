import { Router } from "express";
import {
  createSection,
  removeSection,
  editSection,
  getSection,
  getSections,
  getHomeExperience,
  saveHomeExperience,
} from "../controllers/section.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createSectionSchema,
  editSectionSchema,
  homeExperienceSchema,
} from "../validations/section.schemas";
import verifyToken from "../middleware/verifyToken.middleware";
import { multipartForm } from "../middleware/multipart.middleware";

const sectionRoutes = Router();

sectionRoutes
  .route("/")
  .get(getSections)
  .post(
    verifyToken,
    multipartForm,
    validate(createSectionSchema),
    createSection,
  );

sectionRoutes.route("/admin").get(verifyToken, getSections);

sectionRoutes.get("/home-experience", getHomeExperience);
sectionRoutes.get("/home-experience/admin", verifyToken, getHomeExperience);
sectionRoutes.put(
  "/home-experience",
  verifyToken,
  multipartForm,
  validate(homeExperienceSchema),
  saveHomeExperience,
);

sectionRoutes
  .route("/:id")
  .patch(verifyToken, multipartForm, validate(editSectionSchema), editSection)
  .delete(verifyToken, removeSection)
  .get(getSection);

export default sectionRoutes;
