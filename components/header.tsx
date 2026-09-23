"use client";

import React from "react";
import { useDaysTo } from "@/lib/countdown/store";

export function Header() {
  const { isCreating, startCreating, countdowns, hydrated } = useDaysTo();
  const showActions = hydrated && countdowns.length > 0 && !isCreating;

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-black/5">
      <div className="text-sm font-medium tracking-wide">days-to</div>
      {showActions && (
        <div className="flex items-center gap-3">
          <button
            onClick={startCreating}
            className="text-lg font-light hover:opacity-70 transition-opacity"
            aria-label="Create countdown"
          >
            +
          </button>
          <button
            className="text-lg font-light hover:opacity-70 transition-opacity"
            aria-label="Settings"
          >
            ○
          </button>
        </div>
      )}
    </header>
  );
}