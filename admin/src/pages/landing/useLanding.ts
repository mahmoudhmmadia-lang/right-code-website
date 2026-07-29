import { myAxios } from "@/api/myAxios";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useState } from "react";

export const LANDING_LOCALES = ["en", "ar", "tr"] as const;
export type LandingLocale = (typeof LANDING_LOCALES)[number];

export type LandingTranslation = {
  id?: string;
  locale?: LandingLocale;
  badge?: string | null;
  heading?: string | null;
  subheading?: string | null;
  body?: string | null;
  content?: unknown;
  primaryCta?: unknown;
  secondaryCta?: unknown;
};

export type LandingSection = {
  id: string;
  pageId: string;
  key: string;
  type: string;
  status: string;
  sortOrder: number;
  anchor?: string | null;
  settings?: unknown;
  translations: Partial<Record<LandingLocale, LandingTranslation>>;
  updatedAt: string;
};

export type LandingSectionInput = Omit<
  LandingSection,
  "id" | "translations" | "updatedAt"
> & {
  imageFile?: File | null;
  backgroundImageFile?: File | null;
  translations: Array<
    Omit<LandingTranslation, "id"> & { locale: LandingLocale }
  >;
};

type Collection<T> = {
  data: T[];
  pagesNumber: number;
  totalCount: number;
};

type ApiEnvelope<T> = { materials: T; message: string };
const HOME_PAGE_ID = "home";

function optionalAppend(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, value instanceof File ? value : String(value));
}

function appendNested(formData: FormData, prefix: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  if (value instanceof File) {
    formData.append(prefix, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      appendNested(formData, `${prefix}.${index}`, item),
    );
    return;
  }
  if (typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
      appendNested(formData, `${prefix}.${key}`, item);
    });
    return;
  }
  formData.append(prefix, String(value));
}

function sectionFormData(input: LandingSectionInput) {
  const formData = new FormData();
  optionalAppend(formData, "pageId", input.pageId);
  optionalAppend(formData, "key", input.key);
  optionalAppend(formData, "type", input.type);
  optionalAppend(formData, "status", input.status);
  optionalAppend(formData, "sortOrder", input.sortOrder);
  optionalAppend(formData, "anchor", input.anchor);
  appendNested(formData, "settings", input.settings);
  optionalAppend(formData, "image", input.imageFile);
  optionalAppend(formData, "backgroundImage", input.backgroundImageFile);
  input.translations.forEach(({ locale, ...translation }) => {
    appendNested(formData, `translations.${locale}`, translation);
  });
  return formData;
}

export function useLanding() {
  const [currentPage, setCurrentPage] = useState(1);

  const sections = useCustomQuery<Collection<LandingSection>>({
    queryKey: ["sections", "landing", HOME_PAGE_ID, currentPage],
    queryFn: async () => {
      const response = await myAxios.get<
        ApiEnvelope<Collection<LandingSection>>
      >("/sections/admin", {
        params: {
          page: currentPage,
          limit: 10,
          pageId: HOME_PAGE_ID,
          withTranslationsKey: true,
        },
      });
      return response.data.materials;
    },
  });

  const createSection = useCustomMutation<LandingSection, LandingSectionInput>({
    mutationFn: (input) => myAxios.post("/sections", sectionFormData(input)),
    queryKey: ["sections", "landing"],
    isSuccessLog: true,
  });

  const updateSection = useCustomMutation<
    LandingSection,
    { id: string; input: LandingSectionInput }
  >({
    mutationFn: ({ id, input }) =>
      myAxios.patch(`/sections/${id}`, sectionFormData(input)),
    queryKey: ["sections", "landing"],
    isSuccessLog: true,
  });

  const deleteSection = useCustomMutation<void, string>({
    mutationFn: (id) => myAxios.delete(`/sections/${id}`),
    queryKey: ["sections", "landing"],
    isSuccessLog: true,
    onSuccess: () => {
      if (sections.data?.data.length === 1 && currentPage > 1) {
        setCurrentPage((value) => value - 1);
      }
    },
  });

  return {
    homePage: {
      data: { id: HOME_PAGE_ID, slug: HOME_PAGE_ID },
      isLoading: false,
    },
    sections,
    currentPage,
    setCurrentPage,
    createSection,
    updateSection,
    deleteSection,
  };
}

export function useLandingSection(id?: string) {
  return useCustomQuery<LandingSection>({
    queryKey: ["sections", "landing", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await myAxios.get<ApiEnvelope<LandingSection>>(
        `/sections/${id}`,
        { params: { withTranslationsKey: true } },
      );
      return response.data.materials;
    },
  });
}
