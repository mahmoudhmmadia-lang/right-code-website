export const CONTENT_LOCALES = ["en", "ar", "tr"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export type FieldKind = "text" | "number" | "date" | "textarea" | "list" | "select" | "boolean" | "image" | "relation";

export type FieldConfig = {
  name: string;
  label: string;
  kind?: FieldKind;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  wide?: boolean;
  relation?: {
    endpoint: string;
    valueField: string;
    labelField: string;
  };
};

export type ResourceConfig = {
  key: string;
  title: string;
  description: string;
  endpoint: string;
  adminPath: string;
  protectedRead?: boolean;
  fields: FieldConfig[];
  translationFields?: FieldConfig[];
  columns: Array<{ field: string; label: string }>;
  displayField: string;
};

export type ResourceRecord = Record<string, unknown> & {
  id: string;
  translations?: Partial<Record<ContentLocale, Record<string, unknown>>>;
};

export type Collection<T> = { data: T[]; pagesNumber: number; totalCount: number };
export type ApiEnvelope<T> = { materials: T; message: string };
