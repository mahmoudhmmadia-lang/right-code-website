import { lang } from "@/context/global";
import { TRANSLATOR, type TranslatorKey } from "@/lang/translator";
import { useSignals } from "@preact/signals-react/runtime";

function LangHandler({ content }: { content: TranslatorKey }) {
  useSignals();
  return <>{TRANSLATOR[lang.value][content]}</>;
}

export default LangHandler;
