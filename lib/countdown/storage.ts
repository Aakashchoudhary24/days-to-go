import type { Countdown } from "./types";

const STORAGE_KEY = "days-to:v1";
const PINNED_KEY = "days-to:v1:pinned";

/** Ensures `createdAt` exists for the progress lifecycle (backward-compatible with legacy records). */
function normalizeCountdown(c: Countdown): Countdown {
  const createdAt =
    c.createdAt && !Number.isNaN(new Date(c.createdAt).getTime())
      ? c.createdAt
      : new Date().toISOString();
  if (createdAt === c.createdAt) return c;
  return { ...c, createdAt };
}

export function loadCountdowns(): Countdown[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c): c is Countdown =>
          Boolean(c) &&
          typeof c === "object" &&
          typeof c.id === "string" &&
          typeof c.deadline === "string",
      )
      .map(normalizeCountdown);
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

export function loadPinnedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PINNED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(v => typeof v === "string");
  } catch {
    return [];
  }
}

export function savePinnedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PINNED_KEY, JSON.stringify(ids));
  } catch {
  }
}