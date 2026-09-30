import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const KEY = "learnmaths.theme";

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? systemTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Preference not saved (storage unavailable): the theme still changes for this visit.
    }
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-pressed={theme === "dark"}>
      {theme === "dark" ? "Mode clair" : "Mode sombre"}
    </button>
  );
}
