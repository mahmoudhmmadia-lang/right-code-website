/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void };
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolved(theme: Theme) {
  return theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
}

function storedTheme(): Theme {
  const value = localStorage.getItem("rightcode-admin-theme");
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(storedTheme);
  const setTheme = (next: Theme) => { localStorage.setItem("rightcode-admin-theme", next); setThemeState(next); };

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const next = resolved(theme);
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.dataset.theme = next;
      root.style.colorScheme = next;
    };
    apply();
    const query = matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
