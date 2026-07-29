import { myAxios } from "@/api/myAxios";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { homeDefaults, homeFormData } from "./home-form";
import type { ApiEnvelope, HomeEditorSection, HomeExperienceRecord, HomeFormValues, HomeLocale } from "./types";

export function useHome() {
  const [activeLocale, setActiveLocale] = useState<HomeLocale>("en");
  const [activeSection, setActiveSection] = useState<HomeEditorSection>("general");
  const experience = useCustomQuery<HomeExperienceRecord | null>({
    queryKey: ["home-experience", "admin"],
    queryFn: async () =>
      (await myAxios.get<ApiEnvelope<HomeExperienceRecord | null>>("/sections/home-experience/admin", {
        params: { withTranslationsKey: true },
      })).data.materials,
  });
  const form = useForm<HomeFormValues>({ defaultValues: homeDefaults() });
  const save = useCustomMutation<HomeExperienceRecord, HomeFormValues>({
    mutationFn: (values) => myAxios.put("/sections/home-experience", homeFormData(values), {
      params: { withTranslationsKey: true },
    }),
    queryKey: ["home-experience"],
    isSuccessLog: true,
    onSuccess: (record) => form.reset(homeDefaults(record)),
  });

  useEffect(() => {
    if (experience.isFetched) form.reset(homeDefaults(experience.data));
  }, [experience.data, experience.isFetched, form]);

  return { experience, form, save, activeLocale, setActiveLocale, activeSection, setActiveSection };
}
