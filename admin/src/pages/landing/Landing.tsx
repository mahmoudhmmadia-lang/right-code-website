import CustomButton from "@/components/CustomButton";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { lang } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { FilePenLine, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LANDING_LOCALES,
  type LandingLocale,
  type LandingSection,
  type LandingSectionInput,
  type LandingTranslation,
  useLanding,
  useLandingSection,
} from "./useLanding";

const SECTION_TYPES = ["HERO", "STATS", "CTA", "RICH_TEXT", "CUSTOM"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

type TranslationDraft = {
  badge: string;
  heading: string;
  subheading: string;
  body: string;
  tags: string[];
  stats: Array<{ value: string; label: string }>;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

type FormDraft = {
  key: string;
  type: string;
  status: string;
  sortOrder: string;
  anchor: string;
  imageUrl: string;
  backgroundImageUrl: string;
  imageFile: File | null;
  backgroundImageFile: File | null;
  visualLabels: string[];
  translations: Record<LandingLocale, TranslationDraft>;
};

function emptyTranslation(): TranslationDraft {
  return {
    badge: "",
    heading: "",
    subheading: "",
    body: "",
    tags: ["", "", ""],
    stats: [
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" },
    ],
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
  };
}

function stringArray(value: unknown, size: number) {
  const items = Array.isArray(value)
    ? value.map((item) => String(item ?? ""))
    : [];
  return Array.from({ length: size }, (_, index) => items[index] ?? "");
}

function translationDraft(value?: LandingTranslation): TranslationDraft {
  const primary = (value?.primaryCta ?? {}) as {
    label?: string;
    href?: string;
  };
  const secondary = (value?.secondaryCta ?? {}) as {
    label?: string;
    href?: string;
  };
  const content = (value?.content ?? {}) as {
    tags?: unknown;
    items?: Array<{ value?: unknown; label?: unknown }>;
  };
  const items = Array.isArray(content.items) ? content.items : [];
  return {
    badge: value?.badge ?? "",
    heading: value?.heading ?? "",
    subheading: value?.subheading ?? "",
    body: value?.body ?? "",
    tags: stringArray(content.tags, 3),
    stats: Array.from({ length: 3 }, (_, index) => ({
      value: String(items[index]?.value ?? ""),
      label: String(items[index]?.label ?? ""),
    })),
    primaryCtaLabel: primary.label ?? "",
    primaryCtaHref: primary.href ?? "",
    secondaryCtaLabel: secondary.label ?? "",
    secondaryCtaHref: secondary.href ?? "",
  };
}

function draftFor(section?: LandingSection): FormDraft {
  const settings = (section?.settings ?? {}) as {
    imageUrl?: string;
    backgroundImageUrl?: string;
    visualLabels?: unknown;
  };
  return {
    key: section?.key ?? "",
    type: section?.type ?? "HERO",
    status: section?.status ?? "DRAFT",
    sortOrder: String(section?.sortOrder ?? 0),
    anchor: section?.anchor ?? "",
    imageUrl: settings.imageUrl ?? "",
    backgroundImageUrl: settings.backgroundImageUrl ?? "",
    imageFile: null,
    backgroundImageFile: null,
    visualLabels: stringArray(settings.visualLabels, 3),
    translations: Object.fromEntries(
      LANDING_LOCALES.map((locale) => [
        locale,
        translationDraft(section?.translations[locale]),
      ]),
    ) as Record<LandingLocale, TranslationDraft>,
  };
}

function optionalText(value: string) {
  return value.trim() || undefined;
}

function contentFrom(item: TranslationDraft) {
  const tags = item.tags.map((tag) => tag.trim()).filter(Boolean);
  const stats = item.stats
    .map((stat) => ({
      value: stat.value.trim(),
      label: stat.label.trim(),
    }))
    .filter((stat) => stat.value || stat.label);

  return {
    ...(tags.length ? { tags } : {}),
    ...(stats.length ? { items: stats } : {}),
  };
}

function SectionForm({
  section,
  pageId,
  onSave,
  isSaving,
  onCancel,
}: {
  section?: LandingSection;
  pageId: string;
  onSave: (input: LandingSectionInput) => void;
  isSaving: boolean;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<FormDraft>(() => draftFor(section));
  const [activeLocale, setActiveLocale] = useState<LandingLocale>(
    LANDING_LOCALES.includes(lang.value as LandingLocale)
      ? (lang.value as LandingLocale)
      : "en",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(draftFor(section));
    setActiveLocale(
      LANDING_LOCALES.includes(lang.value as LandingLocale)
        ? (lang.value as LandingLocale)
        : "en",
    );
    setError("");
  }, [section]);

  function setField<Key extends keyof FormDraft>(
    key: Key,
    value: FormDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setTranslation<Key extends keyof TranslationDraft>(
    key: Key,
    value: TranslationDraft[Key],
  ) {
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: {
          ...current.translations[activeLocale],
          [key]: value,
        },
      },
    }));
  }

  function setVisualLabel(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      visualLabels: current.visualLabels.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  function setTag(index: number, value: string) {
    setDraft((current) => {
      const currentTranslation = current.translations[activeLocale];
      return {
        ...current,
        translations: {
          ...current.translations,
          [activeLocale]: {
            ...currentTranslation,
            tags: currentTranslation.tags.map((item, itemIndex) =>
              itemIndex === index ? value : item,
            ),
          },
        },
      };
    });
  }

  function setStat(
    index: number,
    key: keyof TranslationDraft["stats"][number],
    value: string,
  ) {
    setDraft((current) => {
      const currentTranslation = current.translations[activeLocale];
      return {
        ...current,
        translations: {
          ...current.translations,
          [activeLocale]: {
            ...currentTranslation,
            stats: currentTranslation.stats.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item,
            ),
          },
        },
      };
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const translations = LANDING_LOCALES.map((locale) => {
        const item = draft.translations[locale] ?? emptyTranslation();
        const content = contentFrom(item);
        return {
          locale,
          badge: optionalText(item.badge),
          heading: optionalText(item.heading),
          subheading: optionalText(item.subheading),
          body: optionalText(item.body),
          content: Object.keys(content).length ? content : undefined,
          primaryCta:
            item.primaryCtaLabel.trim() || item.primaryCtaHref.trim()
              ? {
                  label: optionalText(item.primaryCtaLabel),
                  href: optionalText(item.primaryCtaHref),
                }
              : undefined,
          secondaryCta:
            item.secondaryCtaLabel.trim() || item.secondaryCtaHref.trim()
              ? {
                  label: optionalText(item.secondaryCtaLabel),
                  href: optionalText(item.secondaryCtaHref),
                }
              : undefined,
        };
      });

      onSave({
        pageId,
        key: draft.key.trim(),
        type: draft.type,
        status: draft.status,
        sortOrder: Number(draft.sortOrder) || 0,
        anchor: optionalText(draft.anchor),
        settings: {
          imageUrl: optionalText(draft.imageUrl),
          backgroundImageUrl: optionalText(draft.backgroundImageUrl),
          visualLabels: draft.visualLabels
            .map((item) => item.trim())
            .filter(Boolean),
        },
        imageFile: draft.imageFile,
        backgroundImageFile: draft.backgroundImageFile,
        translations,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Invalid form data.");
    }
  }

  const translation = draft.translations[activeLocale];
  const textareaClass = "min-h-24 rounded-xl font-mono";

  return (
    <form
      onSubmit={submit}
      className="overflow-hidden rounded-2xl border border-alt/10 bg-background shadow-[0_16px_44px_rgba(18,36,35,0.08)]"
    >
      <header className="shrink-0 border-b border-alt/10 bg-gradient-to-r from-main/[0.08] via-background to-background px-6 py-5 sm:px-8 sm:py-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-main">
          {section ? "Update section" : "New section"}
        </p>
        <h2 className="mt-0.5 text-2xl font-black tracking-tight text-alt">
          {section ? "Edit landing section" : "Add landing section"}
        </h2>
        <p className="mt-1 text-sm text-alt/50">
          Changes are used by the public landing-page query after publishing.
        </p>
      </header>

      <div className="bg-muted/20 px-4 py-5 sm:px-8 sm:py-7">
        <div className="mx-auto grid max-w-5xl gap-6">
          <section className="grid gap-5 rounded-2xl border border-alt/10 bg-background p-5 shadow-sm md:grid-cols-2 sm:p-6">
            <Field label="Key">
              <Input
                value={draft.key}
                onChange={(event) => setField("key", event.target.value)}
                placeholder="hero"
                required
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Type">
              <Select
                value={draft.type}
                onValueChange={(value) => setField("type", value)}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={draft.status}
                onValueChange={(value) => setField("status", value)}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sort order">
              <Input
                type="number"
                value={draft.sortOrder}
                onChange={(event) => setField("sortOrder", event.target.value)}
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Anchor">
              <Input
                value={draft.anchor}
                onChange={(event) => setField("anchor", event.target.value)}
                placeholder="home"
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Logo / hero image" className="md:col-span-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setField("imageFile", event.target.files?.[0] ?? null)
                }
                className="h-11 rounded-xl"
              />
            </Field>
            <Field
              label="Background image"
              className="md:col-span-2 lg:col-span-1"
            >
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setField(
                    "backgroundImageFile",
                    event.target.files?.[0] ?? null,
                  )
                }
                className="h-11 rounded-xl"
              />
            </Field>
            <Field
              label="Visual labels"
              className="md:col-span-2"
            >
              <div className="grid gap-3 md:grid-cols-2">
                {draft.visualLabels.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(event) =>
                      setVisualLabel(index, event.target.value)
                    }
                    placeholder={["API", "Cloud", "Ops"][index]}
                    className="h-11 rounded-xl"
                  />
                ))}
              </div>
            </Field>
          </section>

          <section className="rounded-2xl border border-alt/10 bg-background p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex gap-2 border-b border-alt/10 pb-3">
              {LANDING_LOCALES.map((locale) => (
                <Button
                  key={locale}
                  type="button"
                  variant={activeLocale === locale ? "default" : "outline"}
                  className={cn(
                    "uppercase",
                    activeLocale === locale && "bg-main text-white",
                  )}
                  onClick={() => setActiveLocale(locale)}
                >
                  {locale}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Badge">
                <Input
                  value={translation.badge}
                  onChange={(event) =>
                    setTranslation("badge", event.target.value)
                  }
                  className="h-11 rounded-xl"
                />
              </Field>
              <Field label="Heading">
                <Input
                  value={translation.heading}
                  onChange={(event) =>
                    setTranslation("heading", event.target.value)
                  }
                  className="h-11 rounded-xl"
                  dir={activeLocale === "ar" ? "rtl" : "ltr"}
                />
              </Field>
              <Field label="Subheading" className="md:col-span-2">
                <Textarea
                  value={translation.subheading}
                  onChange={(event) =>
                    setTranslation("subheading", event.target.value)
                  }
                  className={cn(textareaClass, "font-sans")}
                  dir={activeLocale === "ar" ? "rtl" : "ltr"}
                />
              </Field>
              <Field label="Body" className="md:col-span-2">
                <Textarea
                  value={translation.body}
                  onChange={(event) =>
                    setTranslation("body", event.target.value)
                  }
                  className={cn(textareaClass, "font-sans")}
                  dir={activeLocale === "ar" ? "rtl" : "ltr"}
                />
              </Field>
              <Field label="Hero tags" className="md:col-span-2">
                <div className="grid gap-3 md:grid-cols-2">
                  {translation.tags.map((item, index) => (
                    <Input
                      key={index}
                      value={item}
                      onChange={(event) => setTag(index, event.target.value)}
                      placeholder={`Tag ${index + 1}`}
                      className="h-11 rounded-xl"
                      dir={activeLocale === "ar" ? "rtl" : "ltr"}
                    />
                  ))}
                </div>
              </Field>
              <Field label="Stats" className="md:col-span-2">
                <div className="grid gap-3">
                  {translation.stats.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 md:grid-cols-[160px_1fr]"
                    >
                      <Input
                        value={item.value}
                        onChange={(event) =>
                          setStat(index, "value", event.target.value)
                        }
                        placeholder="20+"
                        className="h-11 rounded-xl"
                        dir="ltr"
                      />
                      <Input
                        value={item.label}
                        onChange={(event) =>
                          setStat(index, "label", event.target.value)
                        }
                        placeholder={`Stat label ${index + 1}`}
                        className="h-11 rounded-xl"
                        dir={activeLocale === "ar" ? "rtl" : "ltr"}
                      />
                    </div>
                  ))}
                </div>
              </Field>
              <Field label="Primary CTA label">
                <Input
                  value={translation.primaryCtaLabel}
                  onChange={(event) =>
                    setTranslation("primaryCtaLabel", event.target.value)
                  }
                  className="h-11 rounded-xl"
                />
              </Field>
              <Field label="Primary CTA link">
                <Input
                  value={translation.primaryCtaHref}
                  onChange={(event) =>
                    setTranslation("primaryCtaHref", event.target.value)
                  }
                  placeholder="#contact"
                  className="h-11 rounded-xl"
                  dir="ltr"
                />
              </Field>
              <Field label="Secondary CTA label">
                <Input
                  value={translation.secondaryCtaLabel}
                  onChange={(event) =>
                    setTranslation("secondaryCtaLabel", event.target.value)
                  }
                  className="h-11 rounded-xl"
                />
              </Field>
              <Field label="Secondary CTA link">
                <Input
                  value={translation.secondaryCtaHref}
                  onChange={(event) =>
                    setTranslation("secondaryCtaHref", event.target.value)
                  }
                  placeholder="#work"
                  className="h-11 rounded-xl"
                  dir="ltr"
                />
              </Field>
            </div>
          </section>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <footer className="flex justify-end gap-3 border-t border-alt/10 bg-background px-6 py-4 sm:px-8">
        <Button
          type="button"
          variant="outline"
          className="h-11 min-w-28 rounded-xl"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <CustomButton
          type="submit"
          isLoading={isSaving}
          className="h-11 min-w-36 rounded-xl shadow-md shadow-main/20"
        >
          Save section
        </CustomButton>
      </footer>
    </form>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Label
      className={cn("grid gap-2 text-sm font-semibold text-alt/75", className)}
    >
      {label}
      {children}
    </Label>
  );
}

export function LandingSectionEditor() {
  useSignals();
  const { id } = useParams();
  const navigate = useNavigate();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const { homePage, createSection, updateSection } = useLanding();
  const section = useLandingSection(id);
  const isEditing = Boolean(id);

  function save(input: LandingSectionInput) {
    const options = { onSuccess: () => navigate("/landing") };
    if (id) {
      updateSection.mutate({ id, input }, options);
      return;
    }
    createSection.mutate(input, options);
  }

  if (isEditing && section.isLoading) {
    return <Loader fullScreen={false} />;
  }

  if (isEditing && !section.data) {
    return (
      <DashboardPageLayout
        title="Landing section"
        description={copy.landingDescription}
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
          Landing section was not found.
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      title={isEditing ? "Edit landing section" : "Add landing section"}
      description={copy.landingDescription}
    >
      <SectionForm
        section={section.data}
        pageId={homePage.data.id}
        onSave={save}
        onCancel={() => navigate("/landing")}
        isSaving={createSection.isPending || updateSection.isPending}
      />
    </DashboardPageLayout>
  );
}

function Landing() {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const { homePage, sections, currentPage, setCurrentPage, deleteSection } =
    useLanding();
  const [pendingDelete, setPendingDelete] = useState<LandingSection>();

  const isLoading = homePage.isLoading || sections.isLoading;
  const data = sections.data;

  return (
    <DashboardPageLayout
      title={copy.landingSections}
      description={copy.landingDescription}
    >
      <div className="flex justify-end">
        <CustomButton asChild disabled={!homePage.data}>
          <Link to="/landing/new">
            <Plus className="size-4" />
            {copy.addSection}
          </Link>
        </CustomButton>
      </div>

      {isLoading ? (
        <Loader fullScreen={false} />
      ) : !homePage.data ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
          The home CMS page was not found. Create or seed the home page first.
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_12px_35px_rgba(18,36,35,0.06)]">
          {data?.data.length ? (
            <Table className="min-w-[720px]">
              <TableHeader className="bg-alt/[0.025] text-[11px] tracking-wider text-alt/45 uppercase">
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div className="font-bold text-alt">{section.key}</div>
                      <div className="mt-1 line-clamp-1 text-xs text-alt/45">
                        {section.translations[lang.value]?.heading ??
                          section.anchor ??
                          "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-alt/65">
                      {section.type}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-bold",
                          section.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                        )}
                      >
                        {section.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-alt/60">
                      {section.sortOrder}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/landing/${section.id}/edit`}>
                            <FilePenLine /> {copy.edit}
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteSection.isPending}
                          onClick={() => setPendingDelete(section)}
                        >
                          <Trash2 /> {copy.delete}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-5 py-16 text-center text-sm text-alt/45">
              {copy.noSections}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            pagesNumber={data?.pagesNumber ?? 0}
            onPageChange={setCurrentPage}
          />
        </section>
      )}

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(undefined)}
      >
        <DialogContent>
          <h2 className="text-lg font-bold">{copy.delete}</h2>
          <p className="text-sm text-muted-foreground">
            {copy.deleteSectionConfirm}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setPendingDelete(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteSection.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                deleteSection.mutate(pendingDelete.id, {
                  onSuccess: () => setPendingDelete(undefined),
                });
              }}
            >
              {deleteSection.isPending ? "Deleting…" : copy.delete}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardPageLayout>
  );
}

export default Landing;
