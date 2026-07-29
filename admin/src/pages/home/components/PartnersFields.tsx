import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Handshake, Plus, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { HomeCopy } from "../home-copy";
import { HOME_LOCALES, type HomeFormValues, type HomeLocale } from "../types";
import { FormField } from "./FormField";
import { HeadingFields } from "./HeadingFields";
import { SectionCard } from "./SectionCard";
import { ImageInput } from "./ImageInput";
import { localizedInputDirection } from "@/lib/localized-direction";

export function PartnersFields({ locale, copy }: { locale: HomeLocale; copy: HomeCopy }) {
  const { register, control, getValues, setValue } = useFormContext<HomeFormValues>();
  const partners = useWatch({ control, name: "partners" });
  const add = () => {
    setValue("partners", [...getValues("partners"), { imageUrl: "" }], { shouldDirty: true });
    HOME_LOCALES.forEach((itemLocale) => setValue(`translations.${itemLocale}.partners.items`, [...getValues(`translations.${itemLocale}.partners.items`), { name: "", category: "" }], { shouldDirty: true }));
  };
  const remove = (index: number) => {
    if (partners.length === 1) return;
    setValue("partners", getValues("partners").filter((_, itemIndex) => itemIndex !== index), { shouldDirty: true });
    HOME_LOCALES.forEach((itemLocale) => setValue(`translations.${itemLocale}.partners.items`, getValues(`translations.${itemLocale}.partners.items`).filter((_, itemIndex) => itemIndex !== index), { shouldDirty: true }));
  };

  return (
    <SectionCard title={copy.partners} icon={Handshake}>
      <HeadingFields locale={locale} section="partners" copy={copy} />
      <div className="grid gap-4">
        {partners.map((_, index) => (
          <div key={index} className={`rounded-2xl border border-alt/10 bg-alt/[.015] p-4 ${localizedInputDirection(locale)}`}>
            <div className="mb-4 flex items-center justify-between"><h3 className="font-black text-alt">{copy.partner} {index + 1}</h3><Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)} aria-label={copy.remove}><Trash2 className="size-4" /></Button></div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={copy.name}><Input {...register(`translations.${locale}.partners.items.${index}.name`)} /></FormField>
              <FormField label={copy.category}><Input {...register(`translations.${locale}.partners.items.${index}.category`)} /></FormField>
              <div className="md:col-span-2"><ImageInput label={copy.image} uploadLabel={copy.upload} hint={copy.imageHint} existingUrl={partners[index]?.imageUrl} registration={register(`partners.${index}.imageFile`)} /></div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" className="w-fit" onClick={add}><Plus className="size-4" />{copy.addPartner}</Button>
    </SectionCard>
  );
}
