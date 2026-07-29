import { myAxios } from "@/api/myAxios";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import type { Message, MessageCollection, MessageForm } from "./types";

type Envelope<T> = { materials: T; message: string };

export function useMessages({ page, search, status }: { page: number; search: string; status: string }) {
  const queryKey = ["messages", page, search, status] as const;
  const list = useCustomQuery<MessageCollection>({
    queryKey,
    queryFn: async () => (await myAxios.get<Envelope<MessageCollection>>("/inquiries", {
      params: { page, limit: 12, search: search || undefined, status: status || undefined },
    })).data.materials,
  });
  const update = useCustomMutation<Message, { id: string; values: MessageForm }>({
    mutationFn: ({ id, values }) => myAxios.patch(`/inquiries/${id}`, values),
    queryKey: ["messages"],
    isSuccessLog: true,
  });
  return { list, update };
}
