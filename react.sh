#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-admin-template}"

if [[ -e "$TARGET_DIR" ]] && [[ -n "$(find "$TARGET_DIR" -mindepth 1 -maxdepth 1 2>/dev/null || true)" ]]; then
  echo "Target directory '$TARGET_DIR' already exists and is not empty."
  echo "Use a new directory name: ./react.sh my-new-admin"
  exit 1
fi

mkdir -p "$TARGET_DIR"
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

PROJECT_BASENAME="$(basename "$TARGET_DIR")"
PACKAGE_NAME="$(printf "%s" "$PROJECT_BASENAME" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9._-' '-')"
PACKAGE_NAME="${PACKAGE_NAME%-}"
PACKAGE_NAME="${PACKAGE_NAME:-admin-template}"

detect_pm() {
  if [[ -n "${PACKAGE_MANAGER:-}" && "$PACKAGE_MANAGER" != "auto" ]]; then
    echo "$PACKAGE_MANAGER"
  elif command -v bun >/dev/null 2>&1; then
    echo "bun"
  elif command -v pnpm >/dev/null 2>&1; then
    echo "pnpm"
  else
    echo "npm"
  fi
}

PM="$(detect_pm)"

install_cmd() {
  case "$PM" in
    bun) echo "bun install" ;;
    pnpm) echo "pnpm install" ;;
    npm) echo "npm install" ;;
    *)
      echo "Unsupported package manager: $PM" >&2
      exit 1
      ;;
  esac
}

run_cmd() {
  case "$PM" in
    bun) echo "bun run" ;;
    pnpm) echo "pnpm" ;;
    npm) echo "npm run" ;;
  esac
}

package_manager_field() {
  case "$PM" in
    bun) echo "bun@latest" ;;
    pnpm) echo "pnpm@latest" ;;
    npm) echo "npm@latest" ;;
  esac
}

echo "Creating standalone Vite React admin template in: $TARGET_DIR"
echo "Detected package manager: $PM"

mkdir -p \
  "$TARGET_DIR/public" \
  "$TARGET_DIR/src/api" \
  "$TARGET_DIR/src/assets" \
  "$TARGET_DIR/src/components/ui" \
  "$TARGET_DIR/src/constants" \
  "$TARGET_DIR/src/context" \
  "$TARGET_DIR/src/firebase" \
  "$TARGET_DIR/src/hooks" \
  "$TARGET_DIR/src/lang" \
  "$TARGET_DIR/src/lib" \
  "$TARGET_DIR/src/pages/home" \
  "$TARGET_DIR/src/pages/login" \
  "$TARGET_DIR/src/providers" \
  "$TARGET_DIR/src/routes" \
  "$TARGET_DIR/src/types" \
  "$TARGET_DIR/server"

cat > "$TARGET_DIR/package.json" <<EOF
{
  "name": "$PACKAGE_NAME",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@preact/signals-react": "^3.3.1",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.2.3",
    "@tailwindcss/vite": "^4.1.14",
    "@tanstack/react-query": "^5.90.3",
    "axios": "^1.12.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.4.0",
    "lucide-react": "^0.545.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.65.0",
    "react-router-dom": "^7.9.4",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.14",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.36.0",
    "@types/node": "^24.6.0",
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "eslint": "^9.36.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.22",
    "globals": "^16.4.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.45.0",
    "vite": "^7.1.7"
  },
  "packageManager": "$(package_manager_field)"
}
EOF

cat > "$TARGET_DIR/.gitignore" <<'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
bun.lockb

# Dependencies and builds
node_modules
dist
dist-ssr
server/node_modules
server/dist

# Environment
.env
.env.*.local
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF

cat > "$TARGET_DIR/.env.example" <<'EOF'
VITE_MODE=DEV
VITE_DEV_URL=http://localhost:5000/api
VITE_PROD_URL=https://example.com/api

# Firebase web app config
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
EOF

cat > "$TARGET_DIR/index.html" <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Template</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > "$TARGET_DIR/components.json" <<'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
EOF

cat > "$TARGET_DIR/vite.config.ts" <<'EOF'
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
EOF

cat > "$TARGET_DIR/tsconfig.json" <<'EOF'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
EOF

cat > "$TARGET_DIR/tsconfig.app.json" <<'EOF'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
EOF

cat > "$TARGET_DIR/tsconfig.node.json" <<'EOF'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
EOF

cat > "$TARGET_DIR/eslint.config.js" <<'EOF'
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "server/dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
EOF

cat > "$TARGET_DIR/src/index.css" <<'EOF'
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-main: #022545;
  --color-alt: #e58d27;
  --color-light-alt: #b8860b;
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
  }
}

.app {
  width: 100%;
}
EOF

cat > "$TARGET_DIR/src/lib/utils.ts" <<'EOF'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function appendData(data: Record<string, unknown>) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value instanceof File || typeof value === "string") {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(
          `${key}[${index}]`,
          item instanceof File || typeof item === "string"
            ? item
            : JSON.stringify(item),
        );
      });
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}
EOF

cat > "$TARGET_DIR/src/lib/cookies.ts" <<'EOF'
export const setCookie = (
  name: string,
  value: string,
  days = 7,
  path = "/",
) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=${path};SameSite=Strict${
    window.location.protocol === "https:" ? ";Secure" : ""
  }`;
};

export const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();
    if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
  }

  return null;
};

export const deleteCookie = (name: string, path = "/") => {
  document.cookie = `${name}=; Max-Age=-99999999; path=${path}`;
};

export const updateCookie = (
  name: string,
  value: string,
  days = 7,
  path = "/",
) => {
  setCookie(name, value, days, path);
};
EOF

cat > "$TARGET_DIR/src/api/myAxios.ts" <<'EOF'
import axios from "axios";

export const myAxios = axios.create({
  baseURL:
    import.meta.env.VITE_MODE === "DEV"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL,
});
EOF

cat > "$TARGET_DIR/src/context/global.ts" <<'EOF'
import { myAxios } from "@/api/myAxios";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";
import { effect, signal } from "@preact/signals-react";

export type Lang = "en" | "ar";

export const lang = signal<Lang>((getCookie("admin-lang") as Lang) ?? "en");
export const langLoader = signal(false);
export const accountInfo = signal<Record<string, unknown> | undefined>(
  getCookie("admin-account")
    ? JSON.parse(getCookie("admin-account") as string)
    : undefined,
);
export const page = signal(1);
export const fcmToken = signal(getCookie("admin-fcm") ?? "");
export const response = signal<
  | {
      type: "success" | "error" | "warning";
      message: string;
    }
  | undefined
>();

effect(() => {
  myAxios.defaults.headers.common["Accept-Language"] = lang.value;
  setCookie("admin-lang", lang.value);
});

effect(() => {
  const token = accountInfo.value?.token;

  if (token) {
    myAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setCookie("admin-account", JSON.stringify(accountInfo.value));
  } else {
    delete myAxios.defaults.headers.common.Authorization;
    deleteCookie("admin-account");
  }
});

effect(() => {
  if (fcmToken.value) setCookie("admin-fcm", fcmToken.value);
});
EOF

cat > "$TARGET_DIR/src/lang/translator.ts" <<'EOF'
export const TRANSLATOR = {
  en: {
    dashboard: "Dashboard",
    login: "Login",
    email: "Email",
    password: "Password",
    templateReady: "Template ready",
    templateReadyDescription:
      "Start adding pages under src/pages and wire them in src/routes.",
    logout: "Logout",
    success: "Success",
    error: "Error",
    warning: "Warning",
    done: "Done",
    somethingWentWrong: "Something went wrong",
  },
  ar: {
    dashboard: "Dashboard",
    login: "Login",
    email: "Email",
    password: "Password",
    templateReady: "Template ready",
    templateReadyDescription:
      "Start adding pages under src/pages and wire them in src/routes.",
    logout: "Logout",
    success: "Success",
    error: "Error",
    warning: "Warning",
    done: "Done",
    somethingWentWrong: "Something went wrong",
  },
} as const;

export type TranslatorKey = keyof typeof TRANSLATOR.en;
EOF

cat > "$TARGET_DIR/src/components/LangHandler.tsx" <<'EOF'
import { lang } from "@/context/global";
import { TRANSLATOR, type TranslatorKey } from "@/lang/translator";
import { useSignals } from "@preact/signals-react/runtime";

function LangHandler({ content }: { content: TranslatorKey }) {
  useSignals();
  return <>{TRANSLATOR[lang.value][content]}</>;
}

export default LangHandler;
EOF

cat > "$TARGET_DIR/src/components/ui/button.tsx" <<'EOF'
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
EOF

cat > "$TARGET_DIR/src/components/ui/input.tsx" <<'EOF'
import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
EOF

cat > "$TARGET_DIR/src/components/ui/label.tsx" <<'EOF'
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
EOF

cat > "$TARGET_DIR/src/components/ui/card.tsx" <<'EOF'
import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("grid auto-rows-min gap-1.5 px-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  );
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
EOF

cat > "$TARGET_DIR/src/components/ui/dialog.tsx" <<'EOF'
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
};
EOF

cat > "$TARGET_DIR/src/components/CustomButton.tsx" <<'EOF'
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

function CustomButton({
  className,
  asChild = false,
  children,
  isLoading,
  isDanger,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  children: ReactNode;
  isLoading?: boolean;
  isDanger?: boolean;
}) {
  return (
    <Button
      asChild={asChild}
      className={cn("bg-main text-white", isDanger && "bg-red-600", className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}

export default CustomButton;
EOF

cat > "$TARGET_DIR/src/components/CustomInput.tsx" <<'EOF'
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";

function CustomInput<T extends FieldValues>({
  id,
  label,
  register,
  errors,
  options,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  options?: RegisterOptions<T, Path<T>>;
  className?: string;
}) {
  const error = errors[id]?.message;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={cn(error && "border-destructive", className)}
        {...register(id, options)}
        {...props}
      />
      {typeof error === "string" ? (
        <span className="text-xs text-destructive">{error}</span>
      ) : null}
    </div>
  );
}

export default CustomInput;
EOF

cat > "$TARGET_DIR/src/components/AuthContainer.tsx" <<'EOF'
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}

export default AuthContainer;
EOF

cat > "$TARGET_DIR/src/components/PageLayout.tsx" <<'EOF'
import type { ReactNode } from "react";

function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-slate-50 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <h1 className="text-3xl font-bold capitalize text-main">{title}</h1>
        {children}
      </div>
    </main>
  );
}

export default PageLayout;
EOF

cat > "$TARGET_DIR/src/components/Loader.tsx" <<'EOF'
import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-main" />
    </div>
  );
}

export default Loader;
EOF

cat > "$TARGET_DIR/src/components/Response.tsx" <<'EOF'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { response } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";

function Response() {
  useSignals();

  if (!response.value) return null;

  return (
    <Dialog
      open={Boolean(response.value)}
      onOpenChange={() => (response.value = undefined)}
    >
      <DialogContent>
        <h2 className="text-lg font-semibold capitalize">
          {response.value.type}
        </h2>
        <p className="text-sm text-muted-foreground">{response.value.message}</p>
        <Button className="mt-2" onClick={() => (response.value = undefined)}>
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default Response;
EOF

cat > "$TARGET_DIR/src/hooks/useDebounce.ts" <<'EOF'
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
EOF

cat > "$TARGET_DIR/src/hooks/useCalls.ts" <<'EOF'
import { accountInfo, lang, response } from "@/context/global";
import { useQueryClient } from "@tanstack/react-query";

export function useCalls() {
  const client = useQueryClient();

  function handleSuccess({
    res,
    queryKey,
    isLog,
    to,
  }: {
    res: any;
    queryKey?: string[];
    isLog?: boolean;
    to?: (path: string) => void;
  }) {
    if (queryKey) void client.invalidateQueries({ queryKey });
    if (to) to("/");

    if (isLog) {
      response.value = {
        type: "success",
        message: res?.data?.message ?? (lang.value === "ar" ? "Done" : "Done"),
      };
    }

    return res?.data?.materials;
  }

  function handleError({ err, isLog = true }: { err: any; isLog?: boolean }) {
    if (err?.response?.status === 403) {
      accountInfo.value = undefined;
    }

    if (isLog) {
      response.value = {
        type: "error",
        message:
          err?.response?.data?.message ??
          (lang.value === "ar" ? "Something went wrong" : "Something went wrong"),
      };
    }
  }

  function shapeData(query: any) {
    return query.data?.data?.materials;
  }

  return { handleSuccess, handleError, shapeData };
}
EOF

cat > "$TARGET_DIR/src/hooks/useCustomQuery.ts" <<'EOF'
import {
  useQuery,
  type UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useCalls } from "./useCalls";

export function useCustomQuery({
  queryKey,
  queryFn,
  isErrLog = true,
}: UndefinedInitialDataOptions<unknown, Error, unknown, any> & {
  isErrLog?: boolean;
}) {
  const { handleError } = useCalls();
  const query = useQuery({ queryKey, queryFn });

  useEffect(() => {
    if (query.isError) handleError({ isLog: isErrLog, err: query.error });
  }, [query.isError, query.error, isErrLog]);

  return query;
}
EOF

cat > "$TARGET_DIR/src/hooks/useCustomMutation.ts" <<'EOF'
import { type MutationFunction, useMutation } from "@tanstack/react-query";
import { useCalls } from "./useCalls";

export function useCustomMutation({
  mutationFn,
  isSuccessLog,
  isErrLog,
  queryKey,
  onSuccess,
  onError,
}: {
  mutationFn: MutationFunction<any, any>;
  isSuccessLog?: boolean;
  isErrLog?: boolean;
  queryKey?: string[];
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) {
  const { handleError, handleSuccess } = useCalls();

  return useMutation({
    mutationFn,
    onSuccess(res) {
      const data = handleSuccess({ res, isLog: isSuccessLog, queryKey });
      onSuccess?.(data);
    },
    onError(err) {
      handleError({ isLog: isErrLog, err });
      onError?.(err);
    },
  });
}
EOF

cat > "$TARGET_DIR/src/firebase/config.ts" <<'EOF'
import { fcmToken, lang, response } from "@/context/global";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const setupNotifications = async () => {
  try {
    if (!(await isSupported())) return;

    const notificationsPermission = await navigator.permissions.query({
      name: "notifications",
    });

    if (notificationsPermission.state !== "granted") {
      response.value = {
        type: "warning",
        message:
          lang.value === "ar"
            ? "Enable notifications to receive alerts."
            : "Enable notifications to receive alerts.",
      };
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const messaging = getMessaging(app);
      fcmToken.value = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
    }
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
};

export { app, setupNotifications };
EOF

cat > "$TARGET_DIR/src/providers/InitProvider.tsx" <<'EOF'
import type { ReactNode } from "react";

function InitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default InitProvider;
EOF

cat > "$TARGET_DIR/src/pages/home/Home.tsx" <<'EOF'
import CustomButton from "@/components/CustomButton";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accountInfo } from "@/context/global";

function Home() {
  return (
    <PageLayout title="dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Template ready</CardTitle>
            <CardDescription>
              Start adding pages under src/pages and wire them in src/routes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomButton onClick={() => (accountInfo.value = undefined)}>
              Logout
            </CustomButton>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

export default Home;
EOF

cat > "$TARGET_DIR/src/pages/login/Login.tsx" <<'EOF'
import AuthContainer from "@/components/AuthContainer";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { accountInfo } from "@/context/global";
import { useForm } from "react-hook-form";

type LoginValues = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginValues>();

  return (
    <AuthContainer>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit((values) => {
          accountInfo.value = {
            ...values,
            token: "replace-with-real-token",
            role: "admin",
          };
        })}
      >
        <CustomInput
          id="email"
          label="Email"
          type="email"
          register={register}
          errors={errors}
          options={{ required: "Email is required" }}
        />
        <CustomInput
          id="password"
          label="Password"
          type="password"
          register={register}
          errors={errors}
          options={{ required: "Password is required" }}
        />
        <CustomButton type="submit">Login</CustomButton>
      </form>
    </AuthContainer>
  );
}

export default Login;
EOF

cat > "$TARGET_DIR/src/routes/Routes.tsx" <<'EOF'
import { accountInfo } from "@/context/global";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import { useSignals } from "@preact/signals-react/runtime";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";

function Routes() {
  useSignals();

  return (
    <RouterRoutes>
      <Route
        path="/login"
        element={accountInfo.value ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={accountInfo.value ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}

export default Routes;
EOF

cat > "$TARGET_DIR/src/App.tsx" <<'EOF'
import { useSignals } from "@preact/signals-react/runtime";
import Loader from "@/components/Loader";
import { lang, langLoader } from "@/context/global";
import { cn } from "@/lib/utils";
import Routes from "@/routes/Routes";

function App() {
  useSignals();

  return (
    <div
      className={cn("min-h-screen app flex justify-center items-center", lang.value)}
      dir={lang.value === "ar" ? "rtl" : "ltr"}
    >
      {langLoader.value && (
        <div className="fixed left-0 top-0 z-50 h-full w-full bg-white">
          <Loader />
        </div>
      )}
      <Routes />
    </div>
  );
}

export default App;
EOF

cat > "$TARGET_DIR/src/main.tsx" <<'EOF'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Response from "./components/Response";
import "./index.css";
import InitProvider from "./providers/InitProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

if (import.meta.env.VITE_MODE === "PROD") {
  console.error = () => {};
  console.log = () => {};
  console.warn = () => {};
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <InitProvider>
        <Response />
        <App />
      </InitProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
EOF

cat > "$TARGET_DIR/server/package.json" <<EOF
{
  "name": "$PACKAGE_NAME-server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.ts",
  "scripts": {
    "start": "tsx server.ts"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "tsx": "^4.20.6"
  },
  "packageManager": "$(package_manager_field)"
}
EOF

cat > "$TARGET_DIR/server/server.ts" <<'EOF'
import cors from "cors";
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = Number(process.env.PORT || 3002);

const app = express();

app.use(cors());
app.use(express.static(join(__dirname, "dist")));

app.get(/^\/(.*)/, (_req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOF

cat > "$TARGET_DIR/server/Dockerfile" <<'EOF'
FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3002
CMD ["npm", "start"]
EOF

cat > "$TARGET_DIR/server/docker-compose.yml" <<'EOF'
version: "3.8"

services:
  admin:
    build: .
    container_name: admin-template
    environment:
      PORT: 3002
    ports:
      - "3002:3002"
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 384M
        reservations:
          cpus: "0.25"
          memory: 128M
EOF

cat > "$TARGET_DIR/bitbucket-pipelines.yml" <<'EOF'
image: node:20

pipelines:
  branches:
    main:
      - step:
          name: Build and Deploy
          caches:
            - node
          script:
            - corepack enable
            - npm install
            - npm run build
            - rm -rf server/dist
            - mkdir -p server
            - cp -r dist server/dist
            - ssh $DEPLOY_HOST "mkdir -p $DEPLOY_PATH"
            - scp -r server $DEPLOY_HOST:$DEPLOY_PATH/
            - ssh $DEPLOY_HOST "cd $DEPLOY_PATH/server && docker compose down || true && docker compose up -d --build"
EOF

cat > "$TARGET_DIR/README.md" <<EOF
# $PROJECT_BASENAME

Standalone admin template generated by \`react.sh\`.

## Includes

- Vite + React + TypeScript
- Tailwind CSS v4
- shadcn-compatible \`components.json\`
- shadcn-style UI primitives in \`src/components/ui\`
- Reusable components in \`src/components\`
- API helper in \`src/api/myAxios.ts\`
- Shared hooks in \`src/hooks\`
- Utilities and cookies in \`src/lib\`
- Signals global context in \`src/context\`
- Firebase notification setup in \`src/firebase/config.ts\`
- React Router starter routes and pages
- Express production server in \`server\` for serving \`dist\`

## Package Manager

This script detected \`$PM\`.

Priority:

1. bun
2. pnpm
3. npm

Override with:

\`\`\`bash
PACKAGE_MANAGER=pnpm ./react.sh my-admin
\`\`\`

## Start

\`\`\`bash
$(install_cmd)
cp .env.example .env
$(run_cmd) dev
\`\`\`

## Build and Serve Dist

\`\`\`bash
$(run_cmd) build
mkdir -p server/dist
cp -R dist/* server/dist/
cd server
$(install_cmd)
$(run_cmd) start
\`\`\`
EOF

echo
echo "Template created: $TARGET_DIR"
echo
echo "Next steps:"
echo "  cd \"$TARGET_DIR\""
echo "  $(install_cmd)"
echo "  cp .env.example .env"
echo "  $(run_cmd) dev"
