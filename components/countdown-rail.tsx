"use client";

import React from "react";
import { useDaysTo } from "@/lib/countdown/store";

export function CountdownRail() {
  const {
    countdowns,
    selectedCountdownId,
    pinnedCountdownIds,
    remainingTimes,
    selectCountdown,
    pinCountdown,
  } = useDaysTo();

  const active = countdowns.filter(c => !c.archived);
  if (active.length <= 1) return null;

  const activate = (id: string) => {
    selectCountdown(id);
    if (!pinnedCountdownIds.includes(id)) pinCountdown(id);
  };

  return (
    <nav
      className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-10 flex-col items-stretch gap-0.5 rounded-lg border border-foreground/10 bg-background px-1.5 py-2"
      aria-label="Countdown navigation"
    >
      {active.map(c => {
        const isSelected = selectedCountdownId === c.id;
        const isPinned = pinnedCountdownIds.includes(c.id);
        const days = remainingTimes.get(c.id)?.calendarDays ?? null;
        const dayText = days === null ? "–" : days < 0 ? `+${-days}D` : `${days}D`;

        return (
          <button
            key={c.id}
            onClick={() => activate(c.id)}
            aria-current={isSelected ? "true" : "false"}
            aria-label={c.name}
            className={`
              flex min-w-16 flex-col items-center gap-0.5 rounded-md px-2.5 py-2 transition-colors
              ${isSelected ? "bg-foreground/5" : "hover:bg-foreground/5"}
            `}
          >
            <span className={`font-mono text-xs font-light ${isSelected ? "text-foreground" : "text-foreground/60"}`}>
              {dayText}
            </span>
            <span
              className={`w-full truncate text-center text-[10px] font-medium uppercase tracking-wider ${
                isSelected ? "text-foreground/80" : "text-foreground/50"
              }`}
            >
              {c.name}
            </span>
            <span
              aria-hidden="true"
              className={`mt-0.5 h-px w-5 ${isPinned ? "bg-foreground" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </nav>
  );
}