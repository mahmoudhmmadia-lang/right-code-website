import { myAxios } from "@/api/myAxios";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import type { PageCollection, PageForm, RoutePage } from "./types";

type Envelope<T> = { materials: T; message: string };

export function usePages() {
  const list = useCustomQuery<PageCollection>({
    queryKey: ["route-pages"],
    queryFn: async () => (await myAxios.get<Envelope<PageCollection>>("/pages/admin", { params: { limit: 100, withTranslationsKey: true } })).data.materials,
  });
  const update = useCustomMutation<RoutePage, { page: RoutePage; values: PageForm }>({
    mutationFn: ({ page, values }) => myAxios.patch(`/pages/${page.id}`, values),
    queryKey: ["route-pages"],
    isSuccessLog: true,
  });
  return { list, update };
}
