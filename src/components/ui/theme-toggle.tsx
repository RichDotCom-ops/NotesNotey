"use client";
import * as React from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("notey-theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem("notey-theme", theme);
    }
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-full p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors shadow"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      type="button"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-zinc-800" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-300" />
      )}
    </button>
  );
}
