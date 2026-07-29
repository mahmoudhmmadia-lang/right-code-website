import Footer from "@/components/Footer"
import LanguageLoader from "@/components/LanguageLoader"
import Navbar from "@/components/Navbar"
import SeoManager from "@/components/SeoManager"
import { lang, langLoader } from "@/context/global"
import Routes from "@/routes/Routes"
import { useSignals } from "@preact/signals-react/runtime"

export function App() {
  useSignals()
  return (
    <div
      dir={lang.value === "ar" ? "rtl" : "ltr"}
      className={`app site-shell min-h-screen overflow-x-clip ${lang.value}`}
    >
      <SeoManager />
      {langLoader.value ? (
        <LanguageLoader />
      ) : (
        <>
          <Navbar />
          <Routes />
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
