import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { HomeCopy } from "../home-copy";
import type { HomeFormValues, HomeLocale } from "../types";
import { FormField } from "./FormField";
import { HeadingFields } from "./HeadingFields";
import { ImageInput } from "./ImageInput";
import { SectionCard } from "./SectionCard";
import { localizedInputDirection } from "@/lib/localized-direction";

export function HeroFields({ locale, copy }: { locale: HomeLocale; copy: HomeCopy }) {
  const { register, control } = useFormContext<HomeFormValues>();
  const imageUrl = useWatch({ control, name: "hero.imageUrl" });
  const backgroundImageUrl = useWatch({ control, name: "hero.backgroundImageUrl" });
  return (
    <SectionCard title={copy.hero} icon={Sparkles}>
      <HeadingFields locale={locale} section="hero" copy={copy} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ImageInput label={copy.image} uploadLabel={copy.upload} hint={copy.imageHint} existingUrl={imageUrl} registration={register("hero.imageFile")} />
        <ImageInput label={copy.background} uploadLabel={copy.upload} hint={copy.imageHint} existingUrl={backgroundImageUrl} registration={register("hero.backgroundImageFile")} />
      </div>
      <FormField label={copy.labels}>
        <div className="grid gap-3 sm:grid-cols-2">{[0, 1, 2].map((index) => <Input key={index} {...register(`hero.visualLabels.${index}`)} />)}</div>
      </FormField>
      <FormField label={copy.tags}>
        <div className={`grid gap-3 sm:grid-cols-2 ${localizedInputDirection(locale)}`}>{[0, 1, 2].map((index) => <Input key={index} {...register(`translations.${locale}.hero.tags.${index}`)} />)}</div>
      </FormField>
      <FormField label={copy.sceneLabels}>
        <div className={`grid gap-3 lg:grid-cols-3 ${localizedInputDirection(locale)}`}>
          <Input {...register(`translations.${locale}.hero.scenePrimaryLabel`)} placeholder={copy.scenePrimaryLabel} />
          <Input {...register(`translations.${locale}.hero.sceneSecondaryLabel`)} placeholder={copy.sceneSecondaryLabel} />
          <Input {...register(`translations.${locale}.hero.capabilitiesLabel`)} placeholder={copy.capabilitiesLabel} />
        </div>
      </FormField>
      <div className={`grid gap-4 lg:grid-cols-2 ${localizedInputDirection(locale)}`}>
        {(["primaryCta", "secondaryCta"] as const).map((action) => <div key={action} className="grid gap-3 rounded-2xl border border-alt/10 p-4"><h3 className="font-black text-alt">{copy[action]}</h3><FormField label={copy.label}><Input {...register(`translations.${locale}.hero.${action}.label`)} /></FormField><FormField label={copy.link}><Input {...register(`translations.${locale}.hero.${action}.href`)} dir="ltr" /></FormField></div>)}
      </div>
      <FormField label={copy.stats}>
        <div className={`grid gap-3 md:grid-cols-2 ${localizedInputDirection(locale)}`}>{[0, 1, 2].map((index) => <div key={index} className="grid grid-cols-[110px_1fr] gap-2 rounded-xl border border-alt/10 p-3"><Input {...register(`translations.${locale}.hero.stats.${index}.value`)} placeholder={copy.value} dir="ltr" /><Input {...register(`translations.${locale}.hero.stats.${index}.label`)} placeholder={copy.label} /></div>)}</div>
      </FormField>
    </SectionCard>
  );
}
