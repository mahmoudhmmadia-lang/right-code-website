import { myAxios } from "@/api/myAxios";
import { useCalls } from "@/hooks/useCalls";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useState } from "react";
import type { ApplicationCollection, ApplicationForm, JobApplication } from "./types";

type Envelope<T> = { materials: T; message: string };

export function useJobApplications({ page, search, status }: { page: number; search: string; status: string }) {
  const [downloadingId, setDownloadingId] = useState<string>();
  const { handleError } = useCalls();
  const list = useCustomQuery<ApplicationCollection>({
    queryKey: ["job-applications", page, search, status],
    queryFn: async () => (await myAxios.get<Envelope<ApplicationCollection>>("/careers/applications", {
      params: { page, limit: 12, search: search || undefined, status: status || undefined },
    })).data.materials,
  });
  const update = useCustomMutation<JobApplication, { id: string; values: ApplicationForm }>({
    mutationFn: ({ id, values }) => myAxios.patch(`/careers/applications/${id}`, values),
    queryKey: ["job-applications"],
    isSuccessLog: true,
  });

  async function downloadCv(application: JobApplication) {
    setDownloadingId(application.id);
    try {
      const response = await myAxios.get(`/careers/applications/${application.id}/cv`, { responseType: "blob" });
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      const extension = response.data.type === "application/pdf" ? ".pdf" : response.data.type.includes("wordprocessingml") ? ".docx" : response.data.type.includes("msword") ? ".doc" : "";
      link.download = `${application.fullName.replace(/[^\p{L}\p{N}.-]+/gu, "-")}-CV${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch (error) {
      handleError({ err: error, isLog: true });
    } finally {
      setDownloadingId(undefined);
    }
  }

  return { list, update, downloadCv, downloadingId };
}
