import { useSignals } from "@preact/signals-react/runtime"
import { useSiteContent } from "@/context/site-content"
import { useRouteCopy } from "@/context/route-copy"
interface Props {
  content: string
}

function LangHandler({ content }: Props) {
  useSignals()
  const backendCopy = useSiteContent()
  const routeCopy = useRouteCopy()
  return <>{routeCopy?.[content] ?? backendCopy[content] ?? ""}</>
}

export default LangHandler
