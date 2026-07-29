import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Lang } from "@/context/global";
import { fieldLabel, optionLabel, type ResourceCopyText } from "./resource-copy";
import type { FieldConfig } from "./types";
import { mediaUrl } from "@/lib/media";
import { ImageUp, Plus, Trash2 } from "lucide-react";
import { RelationField } from "./RelationField";

export type DraftValue = string | boolean | File | string[];

export function FieldControl({ field, value, onChange, locale, adminLocale, copy }: {
  field: FieldConfig;
  value: DraftValue;
  onChange: (value: DraftValue) => void;
  locale?: string;
  adminLocale: Lang;
  copy: ResourceCopyText;
}) {
  const id = `${locale ?? "base"}-${field.name}`;
  const direction = locale === "ar" ? "rtl" : "ltr";
  const label = fieldLabel(adminLocale, field.name, field.label);

  if (field.kind === "image") {
    const preview = value instanceof File ? URL.createObjectURL(value) : String(value || "");
    return (
      <div className={cn("grid gap-2.5", field.wide && "md:col-span-2")}>
        <Label htmlFor={id} className="text-sm font-semibold text-alt/80">{label}</Label>
        <label htmlFor={id} className="group grid min-h-48 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-main/30 bg-main/[.025] p-4 text-center transition hover:border-main/60 hover:bg-main/[.05]">
          {preview ? <img src={value instanceof File ? preview : mediaUrl(preview)} alt="" className="h-52 w-full rounded-xl object-cover" /> : <span className="grid gap-2 text-sm font-bold text-main"><ImageUp className="mx-auto size-7" />{copy.select} {label}</span>}
          <input id={id} className="sr-only" type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) onChange(file); }} />
        </label>
      </div>
    );
  }

  if (field.kind === "list") {
    const items = Array.isArray(value) ? value : [];
    return <div className={cn("grid gap-2.5", field.wide && "md:col-span-2")}><Label className="text-sm font-semibold text-alt/80">{label}{field.required ? <span className="text-destructive"> *</span> : ""}</Label><div className="grid gap-2">{items.map((item, index) => <div key={index} className="flex gap-2"><Input value={item} dir={direction} onChange={(event) => onChange(items.map((current, itemIndex) => itemIndex === index ? event.target.value : current))} /><Button type="button" size="icon" variant="ghost" className="shrink-0 text-destructive" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="size-4" /></Button></div>)}<Button type="button" variant="outline" className="w-fit" onClick={() => onChange([...items, ""])}><Plus className="size-4" />{copy.add}</Button></div></div>;
  }

  if (field.kind === "boolean") {
    return (
      <div className={cn("flex min-h-12 items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40", field.wide && "md:col-span-2")}>
        <Checkbox id={id} checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked === true)} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  }

  if (field.kind === "relation" && field.relation) {
    return <div className={cn("grid gap-2.5", field.wide && "md:col-span-2")}><Label className="text-sm font-semibold text-alt/80">{label}{field.required ? <span className="text-destructive"> *</span> : ""}</Label><RelationField field={field} value={String(value ?? "")} onChange={onChange} copy={copy} /></div>;
  }

  return (
    <div className={cn("grid gap-2.5", field.wide && "md:col-span-2")}>
      <Label htmlFor={id} className="text-sm font-semibold text-alt/80">{label}{field.required ? <span className="text-destructive"> *</span> : ""}</Label>
      {field.kind === "select" ? (
        <Select value={String(value)} onValueChange={onChange}>
          <SelectTrigger id={id} className="h-12 w-full rounded-xl bg-background px-4"><SelectValue placeholder={`${copy.select} ${label}`} /></SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => <SelectItem key={option} value={option}>{optionLabel(adminLocale, option)}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : field.kind === "textarea" ? (
        <Textarea
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className="min-h-28 rounded-xl bg-background p-4"
          dir={direction}
        />
      ) : (
        <Input
          id={id}
          type={field.kind === "number" ? "number" : field.kind === "date" ? "date" : "text"}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className="h-12 rounded-xl bg-background px-4"
          dir={direction}
        />
      )}
    </div>
  );
}
