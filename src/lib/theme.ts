export type Theme = "light" | "dark";

const KEY = "insont.theme";

export function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem(KEY, theme);
}

export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("insont.theme");if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})();`;
