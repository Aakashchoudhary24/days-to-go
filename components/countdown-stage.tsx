"use client";

import React from "react";
import { useDaysTo } from "@/lib/countdown/store";
import { CountdownTile } from "./countdown-tile";
import type { TileVariant } from "./countdown-tile";
import type { Countdown } from "@/lib/countdown/types";

export function CountdownStage() {
  const {
    countdowns,
    pinnedCountdownIds,
    remainingTimes,
    unpinCountdown,
    startEditing,
    deleteCountdown,
  } = useDaysTo();

  const pinnedCountdowns = pinnedCountdownIds
    .map(id => countdowns.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (pinnedCountdowns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-black/30 text-lg font-light">
          {countdowns.length > 0 ? "Nothing on stage yet" : ""}
        </p>
      </div>
    );
  }

  const renderTiles = (list: Countdown[], variant: TileVariant, className = "") => (
    <div className={`flex-1 flex flex-col ${className}`}>
      {list.map(c => {
        const remaining = remainingTimes.get(c.id);
        if (!remaining) return null;
        return (
          <CountdownTile
            key={c.id}
            countdown={c}
            remaining={remaining}
            variant={variant}
            onEdit={() => startEditing(c.id)}
            onUnpin={() => unpinCountdown(c.id)}
            onDelete={() => deleteCountdown(c.id)}
          />
        );
      })}
    </div>
  );

  if (pinnedCountdowns.length === 1) {
    return (
      <div className="flex-1 flex p-4 md:p-8">
        {renderTiles(pinnedCountdowns, "full")}
      </div>
    );
  }

  if (pinnedCountdowns.length === 2) {
    return (
      <div className="flex-1 flex divide-x divide-black/10">
        {renderTiles(pinnedCountdowns, "half")}
      </div>
    );
  }

  if (pinnedCountdowns.length === 3) {
    return (
      <div className="flex-1 flex">
        {renderTiles(pinnedCountdowns.slice(0, 2), "quarter", "border-r border-black/10 divide-y divide-black/10")}
        {renderTiles(pinnedCountdowns.slice(2), "half")}
      </div>
    );
  }

  return (
    <div className="flex-1 flex divide-x divide-black/10">
      {renderTiles(pinnedCountdowns.slice(0, 2), "quarter", "divide-y divide-black/10")}
      {renderTiles(pinnedCountdowns.slice(2), "quarter", "divide-y divide-black/10")}
    </div>
  );
}