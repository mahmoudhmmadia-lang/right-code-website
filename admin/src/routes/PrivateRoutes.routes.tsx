import DashboardLayout from "@/components/DashboardLayout";
import Loader from "@/components/Loader";
import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ResourcePage = lazy(() => import("@/features/resources/ResourcePage"));
const ResourceEditorPage = lazy(() => import("@/features/resources/ResourceEditorPage"));
const Analytics = lazy(() => import("@/pages/analytics/Analytics"));
const Messages = lazy(() => import("@/pages/messages/Messages"));
const JobApplications = lazy(() => import("@/pages/job-applications/JobApplications"));
const Pages = lazy(() => import("@/pages/pages/Pages"));
const PageEditor = lazy(() => import("@/pages/pages/PageEditor"));
const ContentManager = lazy(() => import("@/pages/content/ContentManager"));

function Deferred({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/content" replace />} />
        <Route path="content" element={<Deferred><ContentManager /></Deferred>} />
        <Route path="pages" element={<Deferred><Pages /></Deferred>} />
        <Route path="pages/:slug" element={<Deferred><PageEditor /></Deferred>} />
        <Route path="about-page" element={<Navigate to="/content?page=about" replace />} />
        <Route path="services-page" element={<Navigate to="/content?page=services" replace />} />
        <Route path="work-page" element={<Navigate to="/content?page=work" replace />} />
        <Route path="team-page" element={<Navigate to="/content?page=team" replace />} />
        <Route path="contact-page" element={<Navigate to="/content?page=contact" replace />} />
        <Route path="blog-page" element={<Navigate to="/content?page=blog" replace />} />
        <Route path="project-planner" element={<Navigate to="/content?page=projectWizard" replace />} />
        <Route
          path="projects"
          element={
            <Deferred>
              <ResourcePage resource="projects" />
            </Deferred>
          }
        />
        <Route path="projects/new" element={<Deferred><ResourceEditorPage resource="projects" /></Deferred>} />
        <Route path="projects/:id/edit" element={<Deferred><ResourceEditorPage resource="projects" /></Deferred>} />
        <Route
          path="services"
          element={
            <Deferred>
              <ResourcePage resource="services" />
            </Deferred>
          }
        />
        <Route path="services/new" element={<Deferred><ResourceEditorPage resource="services" /></Deferred>} />
        <Route path="services/:id/edit" element={<Deferred><ResourceEditorPage resource="services" /></Deferred>} />
        <Route
          path="analytics"
          element={
            <Deferred>
              <Analytics />
            </Deferred>
          }
        />
        <Route path="messages" element={<Deferred><Messages /></Deferred>} />
        <Route path="job-requests" element={<Deferred><JobApplications /></Deferred>} />
        <Route path="job-titles" element={<Deferred><ResourcePage resource="jobTitles" /></Deferred>} />
        <Route path="job-titles/new" element={<Deferred><ResourceEditorPage resource="jobTitles" /></Deferred>} />
        <Route path="job-titles/:id/edit" element={<Deferred><ResourceEditorPage resource="jobTitles" /></Deferred>} />
        <Route path="team-members" element={<Deferred><ResourcePage resource="teamMembers" /></Deferred>} />
        <Route path="team-members/new" element={<Deferred><ResourceEditorPage resource="teamMembers" /></Deferred>} />
        <Route path="team-members/:id/edit" element={<Deferred><ResourceEditorPage resource="teamMembers" /></Deferred>} />
        <Route
          path="blog"
          element={
            <Deferred>
              <ResourcePage resource="blog" />
            </Deferred>
          }
        />
        <Route path="blog/new" element={<Deferred><ResourceEditorPage resource="blog" /></Deferred>} />
        <Route path="blog/:id/edit" element={<Deferred><ResourceEditorPage resource="blog" /></Deferred>} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default PrivateRoutes;
