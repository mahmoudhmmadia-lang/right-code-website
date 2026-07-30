import Loader from "@/components/Loader"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { lazy, Suspense, useEffect } from "react"
import {
  Navigate,
  Route,
  Routes as RouterRoutes,
  useLocation,
} from "react-router-dom"

const Home = lazy(() => import("@/pages/home/Home"))
const Services = lazy(() => import("@/pages/site/ServicesPage"))
const Work = lazy(() => import("@/pages/site/WorkPage"))
const About = lazy(() => import("@/pages/site/AboutPage"))
const Contact = lazy(() => import("@/pages/site/ContactPage"))
const Team = lazy(() => import("@/pages/team/TeamPage"))
const Blog = lazy(() => import("@/pages/blog/BlogPage"))
const BlogDetail = lazy(() => import("@/pages/blog/BlogDetailPage"))
const ProjectWizard = lazy(
  () => import("@/pages/project-wizard/ProjectWizardPage")
)
const ProjectDetail = lazy(() => import("@/pages/projects/ProjectDetailPage"))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  return null
}

function Routes() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
          transition={{
            duration: reduceMotion ? 0.12 : 0.26,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Suspense fallback={<Loader />}>
            <RouterRoutes location={location}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="work" element={<Work />} />
              <Route path="work/:slug" element={<ProjectDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="team" element={<Team />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="create-project" element={<ProjectWizard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </RouterRoutes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default Routes
