import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { FieldControl, type DraftValue } from "./FieldControl";
import { CONTENT_LOCALES, type ContentLocale, type FieldConfig } from "./types";
import type { Lang } from "@/context/global";
import { fieldGroupLabel, type ResourceCopyText } from "./resource-copy";
import { fieldGroups } from "./field-groups";

export type TranslationDrafts = Record<ContentLocale, Record<string, DraftValue>>;

export function MultilingualFields({ fields, value, onChange, copy, adminLocale }: {
  fields: FieldConfig[];
  value: TranslationDrafts;
  onChange: (locale: ContentLocale, field: string, value: DraftValue) => void;
  copy: ResourceCopyText;
  adminLocale: Lang;
}) {
  const [activeLocale, setActiveLocale] = useState<ContentLocale>(adminLocale);

  useEffect(() => {
    setActiveLocale(adminLocale);
  }, [adminLocale]);

  return (
    <section className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-5 border-b pb-4">
        <h3 className="text-base font-bold text-alt">{copy.localized}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{copy.localizedHint}</p>
      </div>
      <Tabs value={activeLocale} onValueChange={(next) => setActiveLocale(next as ContentLocale)}>
        <TabsList className="mb-5 h-11 rounded-xl bg-muted p-1">
          {CONTENT_LOCALES.map((locale) => <TabsTrigger key={locale} value={locale}>{copy[locale]}</TabsTrigger>)}
        </TabsList>
        {CONTENT_LOCALES.map((locale) => (
          <TabsContent key={locale} value={locale}>
            <div className="grid gap-7">
              {fieldGroups(fields).map((group) => (
                <div key={group.key}>
                  {group.key !== "default" ? <h4 className="mb-4 text-xs font-black tracking-[.12em] text-main uppercase">{fieldGroupLabel(adminLocale, group.key)}</h4> : null}
                  <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                    {group.items.map((field) => (
                      <FieldControl key={field.name} field={field} locale={locale} adminLocale={adminLocale} copy={copy} value={value[locale][field.name] ?? ""} onChange={(next) => onChange(locale, field.name, next)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
