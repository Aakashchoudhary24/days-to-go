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
  low: "bg-foreground/15",
  medium: "bg-foreground/45",
  high: "bg-foreground",
};

export function CountdownTile({
  countdown,
  remaining,
  variant,
  onEdit,
  onUnpin,
  onDelete,
}: CountdownTileProps) {
  const { calendarDays, status, progress } = remaining;
  const deadlineStr = formatDeadlineFull(countdown.deadline);
  const isToday = status === "today";
  const isPast = status === "past";

  const dayLabel = isPast ? "DAY LATE" : isToday ? "TODAY" : calendarDays === 1 ? "DAY TO GO" : "DAYS TO GO";
  const displayDays = isPast ? `+${calendarDays}` : calendarDays;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute right-4 top-3 flex items-center gap-3">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[11px] font-light uppercase tracking-wider text-foreground/50 transition-colors hover:text-foreground"
          >
            Edit
          </button>
        )}
        {onUnpin && (
          <button
            type="button"
            onClick={onUnpin}
            className="text-[11px] font-light uppercase tracking-wider text-foreground/50 transition-colors hover:text-foreground"
          >
            Unpin
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-[11px] font-light uppercase tracking-wider text-foreground/50 transition-colors hover:text-foreground"
            aria-label="Delete"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-col items-center text-center">
        <span className={`mb-6 h-px w-6 ${PRIORITY_OPACITY[countdown.priority]}`} aria-hidden="true" />
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70">
          {countdown.name}
        </p>
        <p
          className={`font-mono font-extralight leading-none tracking-tight text-foreground ${NUMBER_SIZE[variant]}`}
        >
          {displayDays}
        </p>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70">
          {dayLabel}
        </p>
        <p className="mt-6 font-mono text-base font-light text-foreground/70 md:text-lg">
          {formatClock(remaining.days, remaining.hours, remaining.minutes, remaining.seconds, remaining.status)}
        </p>
        <p className="mt-3 text-xs font-light uppercase tracking-[0.2em] text-foreground/50">
          {deadlineStr}
        </p>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px bg-foreground/10"
        role="progressbar"
        aria-label={`${countdown.name} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full bg-foreground/70"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}