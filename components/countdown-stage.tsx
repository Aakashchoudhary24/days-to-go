"use client";

import React from "react";
import { useDaysTo } from "@/lib/countdown/store";
import { CountdownTile } from "./countdown-tile";

export function CountdownStage() {
  const {
    countdowns,
    pinnedCountdownIds,
    selectedCountdownId,
    remainingTimes,
    selectCountdown,
    pinCountdown,
    unpinCountdown,
    startEditing,
    deleteCountdown,
  } = useDaysTo();

  const pinnedCountdowns = pinnedCountdownIds
    .map(id => countdowns.find(c => c.id === id))
    .filter(Boolean) as Array<{
      id: string;
      name: string;
      deadline: string;
      priority: "low" | "medium" | "high";
      createdAt: string;
      archived?: boolean;
    }>;

  if (pinnedCountdowns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-black/30 text-lg font-light">No countdowns pinned</p>
      </div>
    );
  }

  const renderTile = (c: typeof pinnedCountdowns[0]) => {
    const remaining = remainingTimes.get(c.id);
    if (!remaining) return null;
    return (
      <CountdownTile
        key={c.id}
        countdown={c}
        remaining={remaining}
        isPinned={true}
        isSelected={selectedCountdownId === c.id}
        onSelect={() => selectCountdown(c.id)}
        onPin={() => pinCountdown(c.id)}
        onUnpin={() => unpinCountdown(c.id)}
        onEdit={() => startEditing(c.id)}
        onDelete={() => deleteCountdown(c.id)}
      />
    );
  };

  if (pinnedCountdowns.length === 1) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        {renderTile(pinnedCountdowns[0])}
      </div>
    );
  }

  if (pinnedCountdowns.length === 2) {
    return (
      <div className="flex-1 flex h-full">
        {pinnedCountdowns.map(renderTile)}
      </div>
    );
  }

  if (pinnedCountdowns.length === 3) {
    return (
      <div className="flex-1 flex h-full">
        <div className="flex flex-col flex-1 border-r border-black/5">
          {pinnedCountdowns.slice(0, 2).map(renderTile)}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          {renderTile(pinnedCountdowns[2])}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full">
      <div className="flex flex-col flex-1 border-r border-black/5">
        {pinnedCountdowns.slice(0, 2).map(renderTile)}
      </div>
      <div className="flex flex-col flex-1">
        {pinnedCountdowns.slice(2, 4).map(renderTile)}
      </div>
    </div>
  );
}