export type ThemeMode = "auto" | "light" | "dark";

const THEME_STORAGE_KEY = "theme";

export const getSavedTheme = (): ThemeMode => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "auto") {
    return saved;
  }
  return "auto";
};

export const applyTheme = (mode: ThemeMode) => {
  const isDark =
    mode === "dark" ||
    (mode === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
  root.dataset.theme = isDark ? "dark" : "light";
};

export const setThemePreference = (mode: ThemeMode) => {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
  applyTheme(mode);
};

export const subscribeToSystemTheme = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    if (getSavedTheme() === "auto") {
      applyTheme("auto");
    }
  };

  applyTheme(getSavedTheme());
  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
};
