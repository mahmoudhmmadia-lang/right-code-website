#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-server}"
PM="${PACKAGE_MANAGER:-bun}"

prompt() {
  local label="$1"
  local default_value="$2"
  local value

  read -r -p "$label [$default_value]: " value
  echo "${value:-$default_value}"
}

normalize_db_provider() {
  local value
  value="$(printf "%s" "$1" | tr '[:upper:]' '[:lower:]')"

  case "$value" in
    mongo|mongodb) echo "mongodb" ;;
    postgres|postgress|postgresql|pg) echo "postgresql" ;;
    mysql) echo "mysql" ;;
    *)
      echo "Unsupported database '$1'. Use mongodb, postgres, or mysql." >&2
      exit 1
      ;;
  esac
}

install_project() {
  case "$PM" in
    bun) bun install ;;
    pnpm) pnpm install ;;
    npm) npm install ;;
    *)
      echo "Unsupported package manager '$PM'. Use bun, pnpm, or npm." >&2
      exit 1
      ;;
  esac
}

run_prisma_generate() {
  case "$PM" in
    bun) bunx prisma generate ;;
    pnpm) pnpm exec prisma generate ;;
    npm) npx prisma generate ;;
  esac
}

DB_PROVIDER="$(normalize_db_provider "$(prompt "Database (mongodb, postgres, mysql)" "mongodb")")"

if [[ "$DB_PROVIDER" == "mongodb" ]]; then
  PRISMA_VERSION="6.19.0"
  LOCAL_DATABASE_URL="mongodb://127.0.0.1:27017/project-name"
  DATABASE_URL="mongodb+srv://username:password@cluster0.mongodb.net/project-name"
  MIGRATE_SCRIPT="prisma db push"
else
  PRISMA_VERSION="latest"
  if [[ "$DB_PROVIDER" == "postgresql" ]]; then
    LOCAL_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_name?schema=public"
    DATABASE_URL="$LOCAL_DATABASE_URL"
  else
    LOCAL_DATABASE_URL="mysql://root:password@localhost:3306/project_name"
    DATABASE_URL="$LOCAL_DATABASE_URL"
  fi
  MIGRATE_SCRIPT="prisma migrate dev"
fi

# Create server directory structure
echo "🚀 Creating server structure..."

if [[ -e "$TARGET_DIR" ]] && [[ -n "$(find "$TARGET_DIR" -mindepth 1 -maxdepth 1 2>/dev/null)" ]]; then
  echo "Target directory '$TARGET_DIR' already exists and is not empty."
  exit 1
fi

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"
mkdir -p config
mkdir -p middleware
mkdir -p utils
mkdir -p scripts
mkdir -p routes
mkdir -p controllers
mkdir -p validations
mkdir -p seeders
mkdir -p prisma
mkdir -p logs
mkdir -p uploads/images
mkdir -p public

echo "✅ Directories created"


# 1. Create main.config.ts
cat > config/main.config.ts << 'EOF'
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
}

export default mainConfig;
EOF
echo "✅ Created config/main.config.ts"

# 2. Create mail.config.ts
cat > config/mail.config.ts << 'EOF'
import { config } from "dotenv";
import nodemailer from "nodemailer";
config();
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});
EOF
echo "✅ Created config/mail.config.ts"

# 3. Create cors.config.ts
cat > config/cors.config.ts << 'EOF'
import { CorsOptions } from "cors";

const allowedOrigins = [""];
const corsOptions: CorsOptions = {
  async origin(requestOrigin, callback) {
    if (allowedOrigins?.includes(requestOrigin!) || null) {
      callback(null, true);
    } else {
      callback(new Error("NOT ALLOWED BY CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
EOF
echo "✅ Created config/cors.config.ts"

# 4. Create validation middleware
cat > middleware/validation.middleware.ts << 'EOF'
import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { clientErrorResponse, serverErrorResponse } from "../utils/responses";

const validate =
  (schema: Schema): any =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
       return res.status(400).json({
          message: error.message,
        });
      }
      return next();
    } catch (err) {
      return serverErrorResponse({ res, err ,req});
    }
  };

export { validate };
EOF
echo "✅ Created middleware/validation.ts"

# 5. Create verifyToken middleware
cat > middleware/verifyToken.middleware.ts << 'EOF'
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "../utils/lib";
import { prisma } from "../utils/prisma";
import { clientErrorResponse, serverErrorResponse } from "../utils/responses";

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const token = getToken(req);

    jwt.verify(token!, process.env.SECRET!, async (err, decoded) => {
      if (err) {
        return clientErrorResponse({
          res,
          message: "SESSION_EXPIRED",
          status: 403,
          req,
        });
      } else {
        const account = await prisma.account.findUnique({
          where: { id: (decoded as any)?.id },
        });

        if (!account || account.token != token)
          return clientErrorResponse({
            res,
            message: "SESSION_EXPIRED",
            status: 403,
            req,
          });
        req.account = account;

        return next();
      }
    });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}
EOF
echo "✅ Created middleware/verifyToken.ts"

# 6. Create lib.ts
cat > utils/lib.ts << 'EOF'
import { config } from "dotenv";
import type { Request } from "express";
import { existsSync, mkdir, unlink } from "fs";
import multer, { diskStorage } from "multer";
import { join } from "path";
import { v4 as unique } from "uuid";
import { transporter } from "../config/mail.config";
import { DIRNAME } from "../server";
config();

export function getToken(req: Request) {
  const bearerHeader = req.headers["authorization"];

  const token = bearerHeader?.split(" ")[1];

  return token;
}

export function removeFakeEmails(account: any) {
  return {
    ...account,
    email: account.email?.split("@")[1].startsWith("fake")
      ? ""
      : account.email || "",
  };
}

export function getLang(req: Request) {
  const langHeader: "en" | "ar" = req.headers["accept-language"] as "en" | "ar";

  return langHeader == "en" || langHeader == "ar" ? langHeader : "en";
}

export async function paginate({
  req,
  model,
  query = {},
  populate,
  select,
  orderBy,
  prismaModel,
}: {
  req: Request;
  model?: any;
  query?: any;
  populate?: any;
  select?: any;
  orderBy?: any;
  prismaModel?: any;
}) {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const startIndex = parseInt(
    (req.query.startIndex as string) || `${(page - 1) * limit}`,
    10,
  );

  if (prismaModel) {
    // ✅ Prisma - Fixed to properly handle select/include
    const totalCount = await prismaModel.count({ where: query });
    const pagesNumber = Math.ceil(totalCount / limit);

    // Build the findMany options
    const findManyOptions: any = {
      where: query,
      skip: startIndex,
      take: limit,
      orderBy: orderBy || { createdAt: "desc" },
    };

    // Handle select vs include for Prisma
    if (select) {
      findManyOptions.select = select;
    } else if (populate) {
      findManyOptions.include = populate;
    }

    const data = await prismaModel.findMany(findManyOptions);

    return { data, pagesNumber, totalCount };
  }
  if (model) {
    // ✅ Mongoose
    const totalCount = await model.countDocuments(query);
    const pagesNumber = Math.ceil(totalCount / limit);

    const data = await model
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(orderBy || { _id: -1 })
      .populate(populate)
      .select(select || "");

    return { data, pagesNumber, totalCount };
  }

  throw new Error("Invalid configuration for pagination");
}

export function createMulter({
  dir,
  folder = "images",
}: {
  dir?: string;
  folder?: string;
}) {
  const storage = diskStorage({
    destination(_req, _file, callback) {
      const destination = dir
        ? join(DIRNAME, "public", folder, dir)
        : join(DIRNAME, "public", folder);

      mkdir(destination, { recursive: true }, (err) => {
        if (err) {
          return callback(err, destination);
        }
        callback(null, destination);
      });
    },

    filename(_req, file, callback) {
      const fileExtension = file.originalname.split(".").pop();
      const uniqueFilename = `${unique()}.${fileExtension}`;
      callback(null, uniqueFilename);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 50 },
  });

  return upload;
}

export async function sendMail({
  email,
  html,
  subject,
}: {
  email: string;
  subject: string;
  html: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_FORM,
    to: email,
    subject,
    html,
  };

  await transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log(`SENDED EMAIL TO ${email}`);
    })
    .catch((e: any) => {
      console.log(e);
    });
}

export function generateCode(length: number) {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let code = "";

  for (let index = 0; index < length; index++) {
    const letter = arr[Math.floor(Math.random() * arr.length)];
    code += letter;
  }

  return code;
}

export function deleteFile({
  dirName,
  url,
  folder = "images",
}: {
  dirName?: string;
  url: string;
  folder?: string;
}) {
  const pathName = dirName
    ? join(
        DIRNAME,
        "public",
        folder,
        dirName,
        url.split("/")[url.split("/").length - 1],
      )
    : join(
        DIRNAME,
        "public",
        folder,
        url.split("/")[url.split("/").length - 1],
      );

  if (existsSync(pathName)) {
    unlink(pathName, (err) => {
      if (err) {
        console.log(err.message);
        throw new Error(err.message);
      }
    });
  }
}

export function imagesUrl() {
  return `${
    process.env.MODE === "DEV" ? process.env.DEV_URL : process.env.URL
  }/${process.env.IMAGES_PATH}`;
}

export function assetsUrl() {
  return `${
    process.env.MODE === "DEV" ? process.env.DEV_URL : process.env.URL
  }/${process.env.ASSETS_PATH}`;
}

export function shapeLocation(account: any) {
  try {
    if (account.location?.coordinates?.length > 0)
      return {
        ...account,
        location: {
          lat: account.location.coordinates[1],
          lng: account.location.coordinates[0],
          display_name: account.location.display_name,
        },
      };
    else return account;
  } catch (err: any) {
    if (err.message.includes("account.toObject is not a function")) {
      if (account.location?.coordinates?.length > 0)
        return {
          ...account,
          location: {
            lat: account.location?.coordinates[1],
            lng: account.location?.coordinates[0],
            display_name: account.location.display_name,
          },
        };
      return account;
    }
  }
}

export function convertLocation(location: any, initValue?: any) {
  let parsedLocation: any;
  try {
    parsedLocation =
      typeof location == "string" ? JSON.parse(location) : location;
  } catch (error) {
    console.log(error);
    parsedLocation = location || null;
  }

  return parsedLocation
    ? {
        type: "Point",
        coordinates: [parsedLocation.lng, parsedLocation.lat],
        display_name: parsedLocation.display_name,
      }
    : initValue
      ? initValue
      : null;
}

export function getWhere(key: string) {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(key);

  const where = isObjectId ? { id: key } : { slug: key };
  return where;
}

export function transformTranslations(data: any, lang: "en" | "ar"): any {
  if (data == null) return data;
  if (data instanceof Date) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformTranslations(item, lang));
  }

  if (typeof data !== "object") return data;

  const result: any = {};

  for (const key in data) {
    if (key !== "translations") {
      if (data[key] && typeof data[key] === "object") {
        result[key] = transformTranslations(data[key], lang);
      } else {
        result[key] = data[key];
      }
    }
  }

  if (data.translations && typeof data.translations === "object") {
    const translations = data.translations;
    const targetLang = translations[lang] || translations["en"] || {};

    for (const [fieldName, fieldValue] of Object.entries(targetLang)) {
      result[fieldName] = fieldValue;
    }
  }

  return result;
}

EOF
echo "✅ Created utils/lib.ts"


cat > utils/slug.ts << 'EOF'
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts: number = 10
): Promise<string> {
  let slug = generateSlug(baseText);
  let attempt = 0;

  while (await checkExists(slug)) {
    attempt++;
    if (attempt >= maxAttempts) {
      const timestamp = Date.now().toString(36);
      slug = `${generateSlug(baseText)}-${timestamp}`;
      break;
    }

    slug = `${generateSlug(baseText)}-${attempt + 1}`;
  }

  return slug;
}

export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function extractIdentifier(param: string): {
  type: "id" | "slug";
  value: string;
} {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (objectIdRegex.test(param)) {
    return { type: "id", value: param };
  }

  return { type: "slug", value: param };
}
EOF

cat > seeders/admin.seeder.ts << 'EOF'

import { prisma } from "@/utils/prisma";
import { hash } from "bcryptjs";
import { config } from "dotenv";

config();
async function seedAdmin() {
  const existingAdmin = await prisma.account.findFirst({
    where: {
      role: 0,
    },
  });

  if (!existingAdmin) {
    const hashed = await hash(process.env.ADMIN_PASSWORD ?? "fitness@M", 10);
    //await prisma.account.create({
      data: {

      },
    //});
  }
}

seedAdmin();


EOF
cat > utils/responses.ts << 'EOF'
import { Response, Request } from "express";
import { getLang } from "./lib";

export function serverErrorResponse({ res, err, req }: { res: Response; err: any; req: Request }) {
  if (err.message.includes("Cast to ObjectId failed for value")) {
    return clientErrorResponse({
      res: res,
      message: "INVALID_ID",
      status: 400,
      req
    });
  }
  console.log("THE SERVER ERROR: \n", err);
  return res.status(500).json({ message: err.message ? err.message : err });
}

export function clientErrorResponse({
  res,
  message,
  status = 400,
  data,
  req
}: {
  res: Response;
  req:Request;
  message: keyof (typeof RESPONSES)["en"] ;
  status?: number;
  data?: any;
}) {
 return res.status(status).json({
    message: RESPONSES[getLang(req)][message as keyof (typeof RESPONSES)["en"]]||
      "something went wrong",
    data,
  });
}

export function successResponse({
  res,
  data = {},
  message = "SUCCESS",
  status = 200,
  req,
}: {
  res: Response;
  data?: any;
  message?: keyof (typeof RESPONSES)["en"];
  status?: number;
  req: Request;
}) {
  return res.status(status).json({
    materials: data,
    message: RESPONSES[getLang(req)][message],
  });
}

export const RESPONSES = {
  en: {
    INVALID_ID: "invalid id",
    VERIFICATION_CODE_EXPIRED: "Verification code has expired",
    NO_PERMISSIONS_MESSAGE: "you have no permission",
    VERIFICATION_CODE_SENT: "Verification code sent successfully",
    NOT_CONFIRMED: "Incorrect verification code",
    // Success
    SUCCESS: "success response",
    // Authentication & Session
    SESSION_EXPIRED: "Session expired! Please login again",
    INVALID_CREDENTIALS: "Invalid email or password",
    ACCESS_DENIED: "Access denied",
    LOCATION_ERROR: "Error get location",

    // Validation Errors
    INVALID_EMAIL: "Invalid email address",
    INVALID_PASSWORD: "Invalid password",
    INVALID_USERNAME: "Invalid username",
    INVALID_DATE: "Invalid date",
    INVALID_URL: "Invalid URL",
    INVALID_TYPE: "Invalid type",
    INVALID_DATA: "Please provide all required information",

    // Required Fields
    REQUIRED_EMAIL: "Email is required",
    REQUIRED_PASSWORD: "Password is required",
    REQUIRED_NAME: "Name is required",
    REQUIRED_TITLE: "Title is required",
    REQUIRED_FIELD: "This field is required",

    // Operations
    CREATED_SUCCESSFULLY: "Data created successfully",
    UPDATED_SUCCESSFULLY: "Data updated successfully",
    DELETED_SUCCESSFULLY: "Data deleted successfully",
    NOT_FOUND: "Data not found",
    ALREADY_EXISTS: "Item already exists",

    // Permissions & Access
    NO_PERMISSIONS: "You don't have permission to perform this action",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden",

    // System & General
    SERVER_ERROR: "Server error. Please try again later",
    MAINTENANCE_MODE: "System under maintenance. Please try again later",
    FAILED: "Operation failed",
  },
  ar: {
    NO_PERMISSIONS_MESSAGE: "ليس لديك صلاحية",
    VERIFICATION_CODE_EXPIRED: "رمز التحقق منتهي الصلاحية",
    INVALID_ID: "رقم التعريف غير صالح",
    NOT_CONFIRMED: "رمز تحقق خاطئ",
    // Success
    VERIFICATION_CODE_SENT: "تم ارسال رمز التحقق بنجاح",
    SUCCESS: "تم بنجاح",
    // Authentication & Session
    SESSION_EXPIRED: "انتهت صلاحية الجلسة ، يرجى تسجيل الدخول مرة أخرى",
    INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    ACCESS_DENIED: "تم رفض الوصول",
    LOCATION_ERROR: "خطأ في الوصول للموقع",
    // Validation Errors
    INVALID_EMAIL: "البريد الإلكتروني غير صحيح",
    INVALID_PASSWORD: "كلمة المرور غير صحيحة",
    INVALID_USERNAME: "اسم المستخدم غير صحيح",
    INVALID_DATE: "تاريخ غير صحيح",
    INVALID_URL: "رابط غير صحيح",
    INVALID_TYPE: "نوع غير صحيح",
    INVALID_DATA: "يرجى تقديم جميع المعلومات المطلوبة",

    // Required Fields
    REQUIRED_EMAIL: "البريد الإلكتروني مطلوب",
    REQUIRED_PASSWORD: "كلمة المرور مطلوبة",
    REQUIRED_NAME: "الاسم مطلوب",
    REQUIRED_TITLE: "العنوان مطلوب",
    REQUIRED_FIELD: "هذا الحقل مطلوب",

    // Operations
    CREATED_SUCCESSFULLY: "تم إنشاء البيانات بنجاح",
    UPDATED_SUCCESSFULLY: "تم تحديث البيانات بنجاح",
    DELETED_SUCCESSFULLY: "تم حذف البيانات بنجاح",
    NOT_FOUND: "البيانات غير موجودة",
    ALREADY_EXISTS: "العنصر موجود مسبقاً",

    // Permissions & Access
    NO_PERMISSIONS: "ليس لديك إذن لأداء هذا الإجراء",
    UNAUTHORIZED: "وصول غير مصرح به",
    FORBIDDEN: "ممنوع",

    // System & General
    SERVER_ERROR: "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا",
    MAINTENANCE_MODE: "النظام قيد الصيانة. يرجى المحاولة مرة أخرى لاحقًا",
    FAILED: "فشلت العملية",
  },
};

EOF
echo "✅ Created utils/responses.ts"

cat > utils/prisma.ts << 'EOF'
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
EOF
echo "✅ Created utils/prisma.ts"

if [[ "$DB_PROVIDER" == "mongodb" ]]; then
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Account {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String?  @unique
  password  String?
  token     String?
  role      Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF
else
cat > prisma/schema.prisma << EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "$DB_PROVIDER"
  url      = env("DATABASE_URL")
}

model Account {
  id        Int      @id @default(autoincrement())
  email     String?  @unique
  password  String?
  token     String?
  role      Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF
fi
echo "✅ Created prisma/schema.prisma"

# 8. Create new-module.sh script
cat > scripts/new-module.sh << 'EOF'
#!/bin/bash

# Check if name argument is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a name for the module"
    echo "Usage: npm run new-module <name>"
    echo "Example: npm run new-module user"
    exit 1
fi

# Function to pluralize
pluralize() {
    local word="$1"
    case "${word: -1}" in
        s|sh|ch|x|z)
            echo "${word}es"
            ;;
        y)
            if [[ ! ${word: -2:1} =~ [aeiou] ]]; then
                echo "${word%y}ies"
            else
                echo "${word}s"
            fi
            ;;
        *)
            echo "${word}s"
            ;;
    esac
}

# Get the name and convert to proper case
name="$1"
lower_name=$(echo "$name" | tr '[:upper:]' '[:lower:]')
controller_name=$(echo "$name" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
plural_name=$(pluralize "$lower_name")
plural_controller_name=$(echo "$plural_name" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

# Create directories if they don't exist
mkdir -p controllers
mkdir -p validations
mkdir -p routes

echo "🚀 Creating module: $controller_name"

# 1. Create Controller
controller_file="controllers/${lower_name}.controller.ts"
cat > "$controller_file" << CONTROLLER_EOF
import { Request, Response } from "express";
import { serverErrorResponse } from "../utils/responses";

export async function create${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function edit${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function get${plural_controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function get${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function remove${controller_name}(req: Request, res: Response) {
  try {
  } catch (err) {
    return serverErrorResponse({ err, res , req});
  }
}
CONTROLLER_EOF
echo "✅ Controller created: $controller_file"

# 2. Create Validation Schemas
validation_file="validations/${lower_name}.schemas.ts"
cat > "$validation_file" << VALIDATION_EOF
import Joi from "joi";

export type Create${controller_name}Dto = {

};

export type Edit${controller_name}Dto = {

};

export const create${controller_name}Schema = Joi.object({

});

export const edit${controller_name}Schema = Joi.object({

});
VALIDATION_EOF
echo "✅ Validation schemas created: $validation_file"

# 3. Create Routes
routes_file="routes/${lower_name}.routes.ts"
cat > "$routes_file" << ROUTES_EOF
import { Router } from "express";
import {
  create${controller_name},
  remove${controller_name},
  edit${controller_name},
  get${controller_name},
  get${plural_controller_name},
} from "../controllers/${lower_name}.controller";
import { validate } from "../middleware/validation.middleware";
import {
  create${controller_name}Schema,
  edit${controller_name}Schema,
} from "../validations/${lower_name}.schemas";

const ${lower_name}Routes = Router();


${lower_name}Routes
  .route("/")
  .get(get${plural_controller_name})
  .post(validate(create${controller_name}Schema), create${controller_name})
  .patch(validate(edit${controller_name}Schema), edit${controller_name});

${lower_name}Routes
  .route("/:id")
  .delete(remove${controller_name})
  .get(get${controller_name});

export default ${lower_name}Routes;
ROUTES_EOF
echo "✅ Routes created: $routes_file"

echo ""
echo "🎉 Module '$controller_name' created successfully!"
echo "📁 Files created:"
echo "   - controllers/${lower_name}.controller.ts"
echo "   - validations/${lower_name}.schemas.ts"
echo "   - routes/${lower_name}.routes.ts"
echo ""
echo "📝 Next steps:"
echo "   1. Implement your business logic in the controller"
echo "   2. Define your validation schemas"
echo "   3. Register the routes in your main server file"
echo "   4. Update your DTO types with actual properties"
EOF

chmod +x scripts/new-module.sh
echo "✅ Created scripts/new-module.sh"

# 9. Create server.ts
cat > server.ts << 'EOF'
import { config } from "dotenv";
import express from "express";
import { dirname } from "path";
import mainConfig from "./config/main.config";
import "./index.d";
import router from "./routes/router";

config();

const server = express();

export const DIRNAME = dirname(__filename);

mainConfig(server);

router(server);

server.listen(+process.env.PORT!, async () => {
  console.log(`Server Up And Running On Port: ${process.env.PORT!}`);
});
EOF
echo "✅ Created server.ts"

# 10. Create .env file
cat > .env << EOF
# MAIN
PORT=3000
MODE=DEV

# DB
DEV_DATABASE_URL=$LOCAL_DATABASE_URL
DATABASE_URL=$DATABASE_URL

# SECURITY
SECRET="your-super-secret-jwt-key-here"

# URLS
DEV_URL=http://localhost:3000
URL=
LOCATION_URL=https://nominatim.openstreetmap.org

# PATHS
IMAGES_PATH=uploads/images
ASSETS_PATH=uploads

# EMAIL
EMAIL=your-email@gmail.com
PASSWORD=your-app-password
EOF
echo "✅ Created .env"

# 11. Create package.json with dependencies
cat > package.json << EOF
{
  "name": "server",
  "version": "1.0.0",
  "description": "Express server with TypeScript",
  "main": "server.ts",
  "scripts": {
    "start": "tsx server.ts",
    "dev": "tsx watch server.ts",
    "build": "esbuild server.ts --bundle --platform=node --outfile=server.js --external:@prisma/client --external:.prisma/client",
    "db:push": "prisma db push",
    "migrate": "$MIGRATE_SCRIPT",
    "generate": "prisma generate",
    "studio": "prisma studio",
    "new-module": "./scripts/new-module.sh",
    "init-prisma": "prisma init"
  },
  "keywords": ["express", "typescript", "nodejs"],
  "author": "",
  "license": "ISC",
  "packageManager": "$PM@latest",
  "dependencies": {
    "@prisma/client": "$PRISMA_VERSION",
    "bcryptjs": "latest",
    "cookie-parser": "latest",
    "cors": "latest",
    "dotenv": "latest",
    "express": "latest",
    "helmet": "latest",
    "joi": "latest",
    "jsonwebtoken": "latest",
    "morgan": "latest",
    "multer": "latest",
    "nodemailer": "latest",
    "rotating-file-stream": "latest",
    "uuid": "latest"
  },
  "devDependencies": {
    "@types/cookie-parser": "latest",
    "@types/cors": "latest",
    "@types/express": "latest",
    "@types/jsonwebtoken": "latest",
    "@types/morgan": "latest",
    "@types/multer": "latest",
    "@types/nodemailer": "latest",
    "@types/uuid": "latest",
    "esbuild": "latest",
    "prisma": "$PRISMA_VERSION",
    "tsx": "latest",
    "typescript": "latest"
  }
}
EOF
echo "✅ Created package.json"

if [[ "${SKIP_INSTALL:-0}" != "1" ]]; then
  install_project
  run_prisma_generate
else
  echo "⏭️ Skipped dependency install because SKIP_INSTALL=1"
fi

# 12. Create basic router file
cat > routes/router.ts << 'EOF'
import { Express } from "express";

export default function router(server: Express) {
  server.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Add your routes here
  // Example: server.use("/api/users", userRoutes);
}
EOF
echo "✅ Created routes/router.ts"

# 13. Create index.d.ts for type definitions
cat > index.d.ts << 'EOF'
import { Account } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      account?: Account;
    }
  }
}
EOF
echo "✅ Created index.d.ts"

# 14. Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": false,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
EOF
echo "✅ Created tsconfig.json"

echo ""
echo "🎉 Server structure created successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. cd $TARGET_DIR"
echo "   2. $PM install"
echo "   3. Update .env with your actual values"
echo "   4. Run '$PM run generate' after installing dependencies"
echo "   5. Run '$PM run migrate' to sync Prisma"
echo "   6. Run '$PM run dev' to start development server"
echo "   7. Use '$PM run new-module <name>' to create new modules"
echo ""
echo "🚀 Happy coding!"
