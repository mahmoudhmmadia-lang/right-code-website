import { myAxios } from "@/api/myAxios";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import type { AnalyticsOverview } from "./types";

type Envelope<T> = { materials: T; message: string };

export function useAnalytics(days: number) {
  return useCustomQuery<AnalyticsOverview>({
    queryKey: ["analytics", "overview", days],
    queryFn: async () =>
      (await myAxios.get<Envelope<AnalyticsOverview>>("/analytics/overview", { params: { days } })).data.materials,
  });
}
