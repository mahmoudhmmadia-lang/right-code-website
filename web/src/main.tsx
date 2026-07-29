import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import Response from "./components/Response"
import { ThemeProvider } from "./components/theme-provider"
import { SiteContentProvider } from "./context/site-content"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="rightcode-theme">
      <BrowserRouter>
        <SiteContentProvider>
          <Response />
          <App />
        </SiteContentProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
)
