import { useSignals } from "@preact/signals-react/runtime"
import { useSiteContent } from "@/context/site-content"
interface Props {
  content: string
}

function LangHandler({ content }: Props) {
  useSignals()
  const backendCopy = useSiteContent()
  return <>{backendCopy[content] ?? ""}</>
}

export default LangHandler
