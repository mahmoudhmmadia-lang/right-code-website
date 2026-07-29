import { LoaderCircle } from "lucide-react"

function Loader({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen w-full items-center justify-center"
          : "flex min-h-48 w-full items-center justify-center"
      }
    >
      <LoaderCircle className="size-7 animate-spin text-main" />
    </div>
  )
}

export default Loader
