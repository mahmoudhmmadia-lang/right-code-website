import { lang } from "@/context/global"
import { ADMIN_TRANSLATOR } from "@/lang/admin"
import { cn } from "@/lib/utils"
import { useSignals } from "@preact/signals-react/runtime"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "./ui/button"

function Pagination({
  currentPage,
  pagesNumber,
  onPageChange,
  className,
}: {
  currentPage: number
  pagesNumber: number
  onPageChange: (page: number) => void
  className?: string
}) {
  useSignals()
  if (pagesNumber <= 1) return null
  const copy = ADMIN_TRANSLATOR[lang.value]
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= pagesNumber
  const changePage = (page: number) => onPageChange(Math.min(Math.max(page, 1), pagesNumber))

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-alt/10 px-5 py-4 dark:border-white/10", className)}>
      <span className="text-xs font-medium text-alt/50">
        {copy.page} {currentPage} {copy.of} {pagesNumber}
      </span>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={isFirstPage}
          onClick={() => changePage(1)}
          aria-label={copy.first}
          title={copy.first}
        >
          <ChevronsLeft className="size-4 rtl:rotate-180" />
        </Button>
        <Button
          variant="outline"
          disabled={isFirstPage}
          onClick={() => changePage(currentPage - 1)}
        >
          <ChevronLeft className="rtl:rotate-180" />
          {copy.previous}
        </Button>
        <Button
          variant="outline"
          disabled={isLastPage}
          onClick={() => changePage(currentPage + 1)}
        >
          {copy.next}
          <ChevronRight className="rtl:rotate-180" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={isLastPage}
          onClick={() => changePage(pagesNumber)}
          aria-label={copy.last}
          title={copy.last}
        >
          <ChevronsRight className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
