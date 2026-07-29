import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { lang } from "@/context/global";
import { useDebounce } from "@/hooks/useDebounce";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useState } from "react";
import { MessageDetail } from "./components/MessageDetail";
import { MessageFilters } from "./components/MessageFilters";
import { MessageList } from "./components/MessageList";
import { MESSAGES_COPY } from "./messages-copy";
import type { Message } from "./types";
import { useMessages } from "./useMessages";

export default function Messages() {
  useSignals();
  const copy = MESSAGES_COPY[lang.value];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Message>();
  const debouncedSearch = useDebounce(search);
  const { list, update } = useMessages({ page, search: debouncedSearch, status });

  useEffect(() => {
    const rows = list.data?.data;
    if (!rows?.length) return setSelected(undefined);
    setSelected((current) => rows.find((item) => item.id === current?.id) ?? rows[0]);
  }, [list.data]);

  function changeSearch(value: string) { setSearch(value); setPage(1); }
  function changeStatus(value: string) { setStatus(value); setPage(1); }

  return <DashboardPageLayout title={copy.title} description={copy.description}>
    <MessageFilters search={search} status={status} total={list.data?.totalCount ?? 0} copy={copy} onSearch={changeSearch} onStatus={changeStatus} />
    <div className="grid min-h-[620px] gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="self-start overflow-hidden rounded-3xl border border-alt/10 bg-white shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20">
        <header className="flex items-center justify-between border-b border-alt/10 px-5 py-4 dark:border-white/10"><h2 className="font-black text-alt dark:text-white">{copy.inbox}</h2><span className="grid min-w-7 place-items-center rounded-full bg-main px-2 py-1 text-[10px] font-black text-white">{list.data?.totalCount ?? 0}</span></header>
        {list.isLoading ? <Loader fullScreen={false} /> : <MessageList rows={list.data?.data ?? []} selectedId={selected?.id} copy={copy} locale={lang.value} onSelect={setSelected} />}
        <Pagination currentPage={page} pagesNumber={list.data?.pagesNumber ?? 0} onPageChange={setPage} />
      </aside>
      <MessageDetail message={selected} copy={copy} locale={lang.value} saving={update.isPending} onSave={(values) => selected && update.mutate({ id: selected.id, values })} />
    </div>
  </DashboardPageLayout>;
}
