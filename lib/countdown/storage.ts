import type { Countdown } from "./types";

const STORAGE_KEY = "days-to:v1";

export function loadCountdowns(): Countdown[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCountdowns(countdowns: Countdown[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(countdowns));
  } catch {
  }
}