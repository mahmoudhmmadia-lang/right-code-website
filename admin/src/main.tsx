import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Response from "./components/Response";
import "./index.css";
import InitProvider from "./providers/InitProvider";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

if (import.meta.env.VITE_MODE === "PROD") {
  console.error = () => {};
  console.log = () => {};
  console.warn = () => {};
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <InitProvider>
          <Response />
          <App />
        </InitProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>,
);
