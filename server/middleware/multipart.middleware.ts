import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { mkdirSync } from "node:fs";
import { extname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const imageDir = resolve(process.cwd(), "uploads/images");
mkdirSync(imageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imageDir),
  filename: (_req, file, cb) => {
    const extension = extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 32 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image uploads are allowed."));
  },
});

function fieldPath(key: string) {
  return key
    .replace(/\]/g, "")
    .replace(/\[/g, ".")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseValue(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return value;
    }
  }
  return value;
}

function assignPath(
  target: Record<string, unknown>,
  path: string[],
  value: unknown,
) {
  if (!path.length || value === undefined) return;

  let cursor: Record<string, unknown> | unknown[] = target;
  path.forEach((part, index) => {
    const isLast = index === path.length - 1;
    const nextPart = path[index + 1];
    const key = /^\d+$/.test(part) ? Number(part) : part;

    if (isLast) {
      if (Array.isArray(cursor) && typeof key === "number") {
        cursor[key] = value;
      } else if (!Array.isArray(cursor) && typeof key === "string") {
        cursor[key] = value;
      }
      return;
    }

    const nextValue = /^\d+$/.test(nextPart) ? [] : {};
    if (Array.isArray(cursor) && typeof key === "number") {
      cursor[key] ??= nextValue;
      cursor = cursor[key] as Record<string, unknown> | unknown[];
      return;
    }

    if (!Array.isArray(cursor) && typeof key === "string") {
      cursor[key] ??= nextValue;
      cursor = cursor[key] as Record<string, unknown> | unknown[];
    }
  });
}

function normalizeMultipartBody(req: Request) {
  const normalized: Record<string, unknown> = {};

  Object.entries(req.body as Record<string, unknown>).forEach(
    ([key, rawValue]) => {
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      values.forEach((value) => {
        const parsed = parseValue(value);
        if (key === "__payload" && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          Object.assign(normalized, parsed);
          return;
        }
        assignPath(normalized, fieldPath(key), parsed);
      });
    },
  );

  const files = Array.isArray(req.files) ? req.files : [];
  files.forEach((file) => {
    const url = `/uploads/images/${file.filename}`;
    if (file.fieldname === "image" || file.fieldname === "settings.image") {
      assignPath(normalized, ["settings", "imageUrl"], url);
      return;
    }
    if (
      file.fieldname === "backgroundImage" ||
      file.fieldname === "settings.backgroundImage"
    ) {
      assignPath(normalized, ["settings", "backgroundImageUrl"], url);
      return;
    }
    assignPath(normalized, fieldPath(file.fieldname), url);
  });

  req.body = normalized;
}

export function multipartForm(req: Request, res: Response, next: NextFunction) {
  if (!req.is("multipart/form-data")) return next();

  upload.any()(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message ?? "Invalid upload." });
    }
    normalizeMultipartBody(req);
    return next();
  });
}
