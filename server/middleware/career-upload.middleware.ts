import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { extname, resolve } from "node:path";

const cvDir = resolve(process.cwd(), "private-uploads/cv");
mkdirSync(cvDir, { recursive: true });

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, cvDir),
    filename: (_req, file, callback) =>
      callback(
        null,
        `${Date.now()}-${randomUUID()}${extname(file.originalname).toLowerCase()}`,
      ),
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (allowedTypes.has(file.mimetype)) return callback(null, true);
    return callback(new Error("CV must be a PDF, DOC, or DOCX file."));
  },
});

export function careerDocumentUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single("cv")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message ?? "Invalid CV upload.",
      });
    }
    if (!req.file) {
      return res.status(422).json({ message: "A CV file is required." });
    }
    const storedFile = req.file.path;
    res.once("finish", () => {
      if (res.statusCode >= 400) void unlink(storedFile).catch(() => undefined);
    });
    req.body.cvUrl = `/private/cv/${req.file.filename}`;
    return next();
  });
}
