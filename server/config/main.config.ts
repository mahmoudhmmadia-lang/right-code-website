import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet, { crossOriginResourcePolicy } from "helmet";
import logger from "morgan";
import { join } from "path";
import { createStream } from "rotating-file-stream";
import { DIRNAME } from "../server";

function mainConfig(server: Express) {
  server.use(cors());

  server.use(express.json());

  server.use(logger("dev"));

  const accessLogStream = createStream("accessLog.log", { path: "./logs" });

  server.use(logger("combined", { stream: accessLogStream }));

  server.use(helmet());

  server.use(crossOriginResourcePolicy({ policy: "cross-origin" }));

  server.use(cookieParser());

  server.use(express.static(join(DIRNAME, "dist")));

  server.use("/assets", express.static(join(DIRNAME, "public")));
  // Compatibility paths for Home records created before media moved server-side.
  server.use("/customers", express.static(join(DIRNAME, "public", "home", "customers")));
  server.use(express.static(join(DIRNAME, "public", "home")));
  server.use("/uploads", express.static(join(process.cwd(), "uploads")));
}

export default mainConfig;
