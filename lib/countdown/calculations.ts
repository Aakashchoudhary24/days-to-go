import type { Countdown, RemainingTime, CountdownStatus } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseDeadline(deadline: string): Date {
  const [y, m, d] = deadline.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

export function calendarDaysBetween(from: Date, to: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / MS_PER_DAY);
}

export function getRemainingTime(countdown: Countdown): RemainingTime {
  const now = new Date();
  const target = parseDeadline(countdown.deadline);
  const totalMs = target.getTime() - now.getTime();
  const calendarDays = calendarDaysBetween(now, target);

  let status: CountdownStatus;
  if (calendarDays < 0) {
    status = "past";
  } else if (calendarDays === 0) {
    status = "today";
  } else if (totalMs < MS_PER_DAY) {
    status = "less-than-24h";
  } else if (calendarDays <= 7) {
    status = "final-week";
  } else if (calendarDays <= 30) {
    status = "approaching";
  } else {
    status = "normal";
  }

  const abs = Math.max(0, totalMs);
  const days = Math.floor(abs / MS_PER_DAY);
  const hours = Math.floor((abs % MS_PER_DAY) / (1000 * 60 * 60));
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((abs % (1000 * 60)) / 1000);

  return { calendarDays, days, hours, minutes, seconds, totalMs, status };
}

export function formatDeadlineFull(deadline: string): string {
  const [y, m, d] = deadline.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

export function formatDeadlineLong(deadline: string): string {
  const [y, m, d] = deadline.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export function formatClock(days: number, hours: number, minutes: number, seconds: number, status: CountdownStatus): string {
  if (status === "less-than-24h") {
    return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
  }
  return `${String(days).padStart(2, "0")} : ${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
}