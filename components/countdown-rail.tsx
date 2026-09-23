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
      className="fixed inset-x-0 bottom-0 z-10 w-full bg-white/95 backdrop-blur border-t border-black/10 md:inset-x-auto md:top-14 md:bottom-0 md:left-0 md:w-16 md:border-t-0 md:border-r md:flex-col overflow-x-auto flex flex-row md:py-6"
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
              relative shrink-0 min-w-[5.5rem] flex items-center gap-2 px-4 md:w-full md:min-w-0 md:px-3 md:py-4 md:flex-col md:items-start md:gap-1
              border-l first:border-l-0 md:border-l-0
              border-black/10 transition-colors
              ${isSelected ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"}
            `}
          >
            <span
              className={`hidden md:block absolute left-0 top-0 bottom-0 w-0.5 ${isPinned ? "bg-black" : "bg-transparent"}`}
              aria-hidden="true"
            />
            <span
              className={`absolute top-0 left-0 right-0 h-0.5 md:hidden ${isPinned ? "bg-black" : "bg-transparent"}`}
              aria-hidden="true"
            />
            <span className={`font-mono text-xs font-light ${isSelected ? "text-black" : "text-black/50"}`}>
              {dayText}
            </span>
            <span
              className={`text-xs font-medium uppercase tracking-wider truncate max-w-[10rem] md:max-w-[6rem] ${
                isSelected ? "text-black" : "text-black/40"
              }`}
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}