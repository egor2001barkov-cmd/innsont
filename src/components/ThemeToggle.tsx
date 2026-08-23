"use client";

import { useEffect, useState } from "react";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";
import { Ico } from "@/components/kabinet/icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = readTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  function pick(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div className="theme-dock" role="group" aria-label="Тема оформления">
      <button
        type="button"
        className={theme === "light" ? "is-on" : ""}
        onClick={() => pick("light")}
        title="Светлая тема"
      >
        <Ico name="sun" className="h-4 w-4" />
        <span>Светлая</span>
      </button>
      <button
        type="button"
        className={theme === "dark" ? "is-on" : ""}
        onClick={() => pick("dark")}
        title="Тёмная тема"
      >
        <Ico name="moon" className="h-4 w-4" />
        <span>Тёмная</span>
      </button>
    </div>
  );
}
