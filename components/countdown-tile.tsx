"use client";

import React from "react";
import { formatDeadlineFull, formatClock } from "@/lib/countdown/calculations";
import type { Countdown, Priority, RemainingTime } from "@/lib/countdown/types";

export type TileVariant = "full" | "half" | "quarter";

interface CountdownTileProps {
  countdown: Countdown;
  remaining: RemainingTime;
  variant: TileVariant;
  onEdit?: () => void;
  onUnpin?: () => void;
  onDelete?: () => void;
}

const NUMBER_SIZE: Record<TileVariant, string> = {
  full: "text-[min(30vw,44vh)]",
  half: "text-[min(21vw,32vh)]",
  quarter: "text-[min(13vw,20vh)]",
};

const PRIORITY_OPACITY: Record<Priority, string> = {
  low: "bg-black/15",
  medium: "bg-black/45",
  high: "bg-black",
};

export function CountdownTile({
  countdown,
  remaining,
  variant,
  onEdit,
  onUnpin,
  onDelete,
}: CountdownTileProps) {
  const { calendarDays, status } = remaining;
  const deadlineStr = formatDeadlineFull(countdown.deadline);
  const isToday = status === "today";
  const isPast = status === "past";

  const dayLabel = isPast ? "DAY LATE" : isToday ? "TODAY" : calendarDays === 1 ? "DAY TO GO" : "DAYS TO GO";
  const displayDays = isPast ? `+${calendarDays}` : calendarDays;

  return (
    <div className="relative flex flex-col items-center justify-center flex-1 px-4 py-8 overflow-hidden">
      <div className="absolute top-3 right-4 flex items-center gap-3">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[11px] font-light uppercase tracking-wider text-black/25 hover:text-black transition-colors"
          >
            Edit
          </button>
        )}
        {onUnpin && (
          <button
            type="button"
            onClick={onUnpin}
            className="text-[11px] font-light uppercase tracking-wider text-black/25 hover:text-black transition-colors"
          >
            Unpin
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-[11px] font-light uppercase tracking-wider text-black/25 hover:text-black transition-colors"
            aria-label="Delete"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-col items-center text-center">
        <span className={`w-6 h-px mb-6 ${PRIORITY_OPACITY[countdown.priority]}`} aria-hidden="true" />
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/45 mb-6">
          {countdown.name}
        </p>
        <p
          className={`font-mono font-extralight leading-none tracking-tight text-black ${NUMBER_SIZE[variant]}`}
        >
          {displayDays}
        </p>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/45 mt-5">
          {dayLabel}
        </p>
        <p className="font-mono text-base md:text-lg font-light text-black/45 mt-6">
          {formatClock(remaining.days, remaining.hours, remaining.minutes, remaining.seconds, remaining.status)}
        </p>
        <p className="text-xs font-light uppercase tracking-[0.2em] text-black/30 mt-3">
          {deadlineStr}
        </p>
      </div>
    </div>
  );
}