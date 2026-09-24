"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { IconMoon, IconSun } from "@tabler/icons-react";

const emptySubscribe = () => () => {};

/** Returns true only after the client has hydrated (server/prerender: false). */
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    // Avoid hydration mismatch: render a same-size placeholder until mounted.
    return <span className="size-7" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex size-7 items-center justify-center text-foreground/60 transition-opacity hover:opacity-70"
    >
      {isDark ? (
        <IconSun size={16} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <IconMoon size={16} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}