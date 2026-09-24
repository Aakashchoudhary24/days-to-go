export type Priority = "low" | "medium" | "high";

export type CountdownStatus =
  | "normal"
  | "approaching"
  | "final-week"
  | "less-than-24h"
  | "today"
  | "past";

export interface Countdown {
  id: string;
  name: string;
  deadline: string;
  priority: Priority;
  createdAt: string;
  archived?: boolean;
}

export interface RemainingTime {
  calendarDays: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  status: CountdownStatus;
  /** Fraction of the countdown lifecycle [createdAt → deadline] that has elapsed, 0–1. */
  progress: number;
}