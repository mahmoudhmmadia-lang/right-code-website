import { myAxios } from "@/api/myAxios";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { RoutePageKey } from "./route-content-config";
import { ROUTE_PAGE_CONFIGS } from "./route-content-config";
import { routeContentDefaults, routeSectionPayload } from "./route-content-form";
import type { ApiCollection, ApiEnvelope, RouteContentFormValues, RouteContentLocale, RouteSectionKey, RouteSectionRecord } from "./types";
import { lang } from "@/context/global";

export function useRouteContent(pageKey: RoutePageKey) {
  const config = ROUTE_PAGE_CONFIGS[pageKey];
  const [activeLocale, setActiveLocale] = useState<RouteContentLocale>(lang.value);
  const [activeSection, setActiveSection] = useState<RouteSectionKey>("general");

  const list = useCustomQuery<ApiCollection<RouteSectionRecord>>({
    queryKey: ["route-content", config.pageId, "admin"],
    queryFn: async () =>
      (await myAxios.get<ApiEnvelope<ApiCollection<RouteSectionRecord>>>("/sections/admin", {
        params: { pageId: config.pageId, limit: 50, withTranslationsKey: true },
      })).data.materials,
  });

  const records = useMemo(() => list.data?.data ?? [], [list.data]);
  const form = useForm<RouteContentFormValues>({ defaultValues: routeContentDefaults(config) });

  const save = useCustomMutation<RouteSectionRecord[], RouteContentFormValues>({
    mutationFn: async (values) => {
      const byKey = new Map(records.map((record) => [record.key, record]));
      const saved = await Promise.all(config.sections.map(async (section) => {
        const existing = byKey.get(section.key);
        const payload = routeSectionPayload({ pageId: config.pageId, section, values });
        const response = existing
          ? await myAxios.patch<ApiEnvelope<RouteSectionRecord>>(`/sections/${existing.id}`, payload, { params: { withTranslationsKey: true } })
          : await myAxios.post<ApiEnvelope<RouteSectionRecord>>("/sections", payload, { params: { withTranslationsKey: true } });
        return response.data.materials;
      }));

      return { data: { materials: saved, message: "UPDATED_SUCCESSFULLY" } };
    },
    queryKey: ["route-content", config.pageId],
    isSuccessLog: true,
    onSuccess: (saved) => form.reset(routeContentDefaults(config, saved)),
  });

  useEffect(() => {
    if (list.isFetched) form.reset(routeContentDefaults(config, records));
  }, [config, form, list.isFetched, records]);

  return { config, list, form, save, activeLocale, setActiveLocale, activeSection, setActiveSection };
}
