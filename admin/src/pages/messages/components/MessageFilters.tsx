import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { messageStatusLabel, type MessagesCopyText } from "../messages-copy";
import { MESSAGE_STATUSES } from "../types";

export function MessageFilters({ search, status, total, copy, onSearch, onStatus }: { search: string; status: string; total: number; copy: MessagesCopyText; onSearch: (value: string) => void; onStatus: (value: string) => void }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground rtl:right-3.5 rtl:left-auto" />
        <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={copy.search} className="ps-10" />
      </div>
      <Select value={status || "ALL"} onValueChange={(value) => onStatus(value === "ALL" ? "" : value)}>
        <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="ALL">{copy.allStatuses}</SelectItem>{MESSAGE_STATUSES.map((item) => <SelectItem key={item} value={item}>{messageStatusLabel(copy, item)}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    <span className="whitespace-nowrap text-xs font-bold text-alt/45 dark:text-white/45">{total} {total === 1 ? copy.result : copy.results}</span>
  </div>;
}
