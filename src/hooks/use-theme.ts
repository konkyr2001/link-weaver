import { useState, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// Simple external store so all consumers share the same theme value
let currentTheme: Theme = (localStorage.getItem("theme") === "dark" ? "dark" : "light");
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function setTheme(t: Theme) {
  currentTheme = t;
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", t);
  listeners.forEach((cb) => cb());
}

// Initialize on load
(() => {
  const root = document.documentElement;
  if (currentTheme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
})();

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return { theme, toggleTheme };
}
