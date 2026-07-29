import { useSignals } from "@preact/signals-react/runtime";
import Loader from "@/components/Loader";
import { lang, langLoader } from "@/context/global";
import { cn } from "@/lib/utils";
import Routes from "@/routes/Routes";

function App() {
  useSignals();

  return (
    <div
      className={cn("min-h-screen app flex justify-center items-center", lang.value)}
      dir={lang.value === "ar" ? "rtl" : "ltr"}
    >
      {langLoader.value && (
        <div className="fixed top-0 left-0 z-50 h-full w-full bg-background">
          <Loader />
        </div>
      )}
      <Routes />
    </div>
  );
}

export default App;
