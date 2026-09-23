"use client";

import React from "react";
import { formatDeadlineFull, formatClock } from "@/lib/countdown/calculations";
import type { CountdownStatus } from "@/lib/countdown/types";

interface CountdownTileProps {
  countdown: {
    id: string;
    name: string;
    deadline: string;
    priority: "low" | "medium" | "high";
    createdAt: string;
    archived?: boolean;
  };
  remaining: {
    calendarDays: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    status: CountdownStatus;
  };
  isPinned: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onPin: () => void;
  onUnpin: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CountdownTile({
  countdown,
  remaining,
  isPinned,
  isSelected,
  onSelect,
  onPin,
  onUnpin,
  onEdit,
  onDelete,
}: CountdownTileProps) {
  const { calendarDays, status } = remaining;
  const deadlineStr = formatDeadlineFull(countdown.deadline);
  const isToday = status === "today";
  const isPast = status === "past";

  const dayLabel = isPast ? "DAY LATE" : isToday ? "TODAY" : calendarDays === 1 ? "DAY TO GO" : "DAYS TO GO";
  const displayDays = isPast ? Math.abs(calendarDays) : calendarDays;

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center p-8 min-h-[300px]
        border border-black/5 transition-all duration-300
        ${isPinned ? "flex-1" : ""}
        ${isSelected ? "bg-black/2" : "hover:bg-black/1"}
      `}
      onClick={onSelect}
    >
      <div className="absolute top-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="px-2 py-1 text-xs font-light text-black/40 hover:text-black"
          aria-label="Edit"
        >
          Edit
        </button>
        <button
          onClick={e => { e.stopPropagation(); if (isPinned) onUnpin(); else onPin(); }}
          className="px-2 py-1 text-xs font-light text-black/40 hover:text-black"
          aria-label={isPinned ? "Unpin" : "Pin"}
        >
          {isPinned ? "Unpin" : "Pin"}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-black/40 mb-4">
          {countdown.name}
        </p>
        <p className="font-mono text-6xl md:text-8xl font-light tracking-tight text-black">
          {displayDays}
        </p>
        <p className="text-xs font-medium uppercase tracking-wider text-black/40 mt-2">
          {dayLabel}
        </p>
        <p className="font-mono text-lg font-light text-black/30 mt-4">
          {formatClock(remaining.days, remaining.hours, remaining.minutes, remaining.seconds, remaining.status)}
        </p>
        <p className="text-xs font-light text-black/30 mt-2">
          {deadlineStr}
        </p>
      </div>

      {!isPinned && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="absolute bottom-3 right-3 p-1 text-black/20 hover:text-black/60 transition-colors"
          aria-label="Delete"
        >
          ×
        </button>
      )}
    </div>
  );
}