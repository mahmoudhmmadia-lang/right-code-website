import { useSignals } from "@preact/signals-react/runtime"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Footer from "./components/Footer"
import Loader from "./components/Loader"
import Navbar from "./components/Navbar"
import { TerminalAbout } from "./components/Terminal"
import { HexagonPattern } from "./components/ui/hexagon-pattern"
import { lang, langLoader } from "./context/global"
import Landing from "./pages/landing/Landing"
import Customers from "./pages/customers/Customers"
import Services from "./pages/services/Services"
import ProductLifecycle from "./pages/product-life-cycle/ProductLifecycle"
import WhyChooseUs from "./pages/why-us/WhyChooseUs"
import MoreAbout from "./pages/more-about/MoreAbout"
import Testimonials from "./pages/testimonials/Testimonials"
import ContactUs from "./pages/contact/Contact"
import CaseStudies from "./pages/case-studies/CaseStudies"
import ServicesN from "./pages/services-n/ServicesN"

export function App() {
  useSignals()
  return (
    <div
      dir={lang.value == "ar" ? "rtl" : "ltr"}
      className={`app flex flex-col bg-gradient-cloudy text-alt ${lang.value}`}
    >
      <HexagonPattern strokeDasharray="2" />
      {langLoader.value ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Landing />
          <Customers />
          <MoreAbout />
          <ServicesN />
          <Services />
          <ProductLifecycle />
          <WhyChooseUs />
          <TerminalAbout />
          <CaseStudies />
          <Testimonials />
          <ContactUs />
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
