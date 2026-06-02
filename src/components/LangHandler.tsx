import { lang } from "@/context/global"
import { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"

interface Props {
  content: keyof typeof translator.en
}

function LangHandler({ content }: Props) {
  useSignals()
  return <>{translator[lang.value][content]}</>
}

export default LangHandler
