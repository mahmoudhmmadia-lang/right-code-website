import { lang } from "@/context/global"
import { ADMIN_TRANSLATOR } from "@/lang/admin"
import { useSignals } from "@preact/signals-react/runtime"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

function Pagination({
  currentPage,
  pagesNumber,
  onPageChange,
}: {
  currentPage: number
  pagesNumber: number
  onPageChange: (page: number) => void
}) {
  useSignals()
  if (pagesNumber <= 1) return null
  const copy = ADMIN_TRANSLATOR[lang.value]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-alt/10 px-5 py-4">
      <span className="text-xs font-medium text-alt/50">
        {copy.page} {currentPage} {copy.of} {pagesNumber}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="rtl:rotate-180" />
          {copy.previous}
        </Button>
        <Button
          variant="outline"
          disabled={currentPage >= pagesNumber}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {copy.next}
          <ChevronRight className="rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
