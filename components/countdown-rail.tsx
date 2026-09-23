"use client";

import React from "react";
import { useDaysTo } from "@/lib/countdown/store";
import { formatDeadlineFull } from "@/lib/countdown/calculations";

export function CountdownRail() {
  const {
    countdowns,
    selectedCountdownId,
    pinnedCountdownIds,
    selectCountdown,
  } = useDaysTo();

  if (countdowns.length <= 1) return null;

  return (
    <nav
      className="fixed left-0 top-14 bottom-0 w-16 flex flex-col items-center py-6 border-r border-black/5 bg-white/80 backdrop-blur"
      aria-label="Countdown navigation"
    >
      {countdowns.map(c => {
        const isSelected = selectedCountdownId === c.id;
        const isPinned = pinnedCountdownIds.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => selectCountdown(c.id)}
            className={`
              w-full px-3 py-4 text-left transition-all duration-200
              ${isSelected ? "bg-black/3" : "hover:bg-black/2"}
              ${isPinned ? "border-l-2 border-black" : ""}
            `}
            aria-current={isSelected ? "true" : "false"}
            aria-label={c.name}
          >
            <p className={`text-xs font-medium uppercase tracking-wider ${
              isSelected ? "text-black" : "text-black/40"
            }`}>
              {c.name}
            </p>
            <p className={`font-mono text-xs font-light mt-1 ${
              isSelected ? "text-black" : "text-black/30"
            }`}>
              {formatDeadlineFull(c.deadline)}
            </p>
            {isPinned && (
              <span className="block mt-1 text-xs font-light text-black/30">Pinned</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}