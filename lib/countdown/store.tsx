"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import type { Countdown, Priority, RemainingTime } from "./types";
import { saveCountdowns } from "./storage";
import { getRemainingTime } from "./calculations";

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadInitialCountdowns(): Countdown[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("days-to:v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

interface DaysToContext {
  countdowns: Countdown[];
  selectedCountdownId: string | null;
  pinnedCountdownIds: string[];
  isCreating: boolean;
  editingCountdownId: string | null;
  notice: string | null;
  remainingTimes: Map<string, RemainingTime>;
  hydrated: boolean;
  addCountdown: (input: { name: string; deadline: string; priority: Priority }) => void;
  updateCountdown: (id: string, patch: Partial<Pick<Countdown, "name" | "deadline" | "priority">>) => void;
  deleteCountdown: (id: string) => void;
  archiveCountdown: (id: string) => void;
  restoreCountdown: (id: string) => void;
  selectCountdown: (id: string | null) => void;
  pinCountdown: (id: string) => void;
  unpinCountdown: (id: string) => void;
  startCreating: () => void;
  cancelCreating: () => void;
  startEditing: (id: string) => void;
  cancelEditing: () => void;
  dismissNotice: () => void;
}

const DaysToContext = createContext<DaysToContext | null>(null);

export function useDaysTo() {
  const ctx = useContext(DaysToContext);
  if (!ctx) throw new Error("useDaysTo must be used within DaysToProvider");
  return ctx;
}

export function DaysToProvider({ children }: { children: React.ReactNode }) {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [selectedCountdownId, setSelectedCountdownId] = useState<string | null>(null);
  const [pinnedCountdownIds, setPinnedCountdownIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCountdownId, setEditingCountdownId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [remainingTimes, setRemainingTimes] = useState<Map<string, RemainingTime>>(new Map());
  const [hydrated, setHydrated] = useState(false);
  const tickRef = useRef<number | null>(null);
  const firstTickRef = useRef(true);
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const loaded = loadInitialCountdowns();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage init
    setCountdowns(loaded);
    if (loaded.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage init
      setSelectedCountdownId(loaded[0].id);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage init
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCountdowns(countdowns);
  }, [countdowns, hydrated]);

  const tick = useCallback(() => {
    const map = new Map<string, RemainingTime>();
    for (const c of countdowns) {
      map.set(c.id, getRemainingTime(c));
    }
    setRemainingTimes(map);
  }, [countdowns]);

  useEffect(() => {
    if (!hydrated) return;
    if (firstTickRef.current) {
      firstTickRef.current = false;
      tick();
    }
    tickRef.current = window.setInterval(tick, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [tick, hydrated]);

  const showNotice = useCallback((msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2000);
  }, []);

  const addCountdown = useCallback((input: { name: string; deadline: string; priority: Priority }) => {
    const newCountdown: Countdown = {
      id: makeId(),
      name: input.name.trim(),
      deadline: input.deadline,
      priority: input.priority,
      createdAt: new Date().toISOString(),
    };
    setCountdowns(prev => {
      const next = [...prev, newCountdown];
      setSelectedCountdownId(newCountdown.id);
      if (prev.length === 0) {
        setPinnedCountdownIds([newCountdown.id]);
      }
      return next;
    });
    setIsCreating(false);
  }, []);

  const updateCountdown = useCallback((id: string, patch: Partial<Pick<Countdown, "name" | "deadline" | "priority">>) => {
    setCountdowns(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const deleteCountdown = useCallback((id: string) => {
    setCountdowns(prev => {
      const next = prev.filter(c => c.id !== id);
      setSelectedCountdownId(next[0]?.id ?? null);
      setPinnedCountdownIds(p => p.filter(pid => pid !== id));
      return next;
    });
  }, []);

  const archiveCountdown = useCallback((id: string) => {
    setCountdowns(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, archived: true } : c));
      const nextUnarchived = next.filter(c => !c.archived);
      setSelectedCountdownId(nextUnarchived[0]?.id ?? null);
      setPinnedCountdownIds(p => p.filter(pid => pid !== id));
      return next;
    });
  }, []);

  const restoreCountdown = useCallback((id: string) => {
    setCountdowns(prev => prev.map(c => (c.id === id ? { ...c, archived: false } : c)));
  }, []);

  const selectCountdown = useCallback((id: string | null) => {
    setSelectedCountdownId(id);
  }, []);

  const pinCountdown = useCallback((id: string) => {
    setPinnedCountdownIds(prev => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 4) {
        showNotice("Maximum 4 countdowns on stage");
        return prev;
      }
      return [...prev, id];
    });
  }, [showNotice]);

  const unpinCountdown = useCallback((id: string) => {
    setPinnedCountdownIds(prev => prev.filter(pid => pid !== id));
  }, []);

  const startCreating = useCallback(() => {
    setIsCreating(true);
  }, []);

  const cancelCreating = useCallback(() => {
    setIsCreating(false);
  }, []);

  const startEditing = useCallback((id: string) => {
    setEditingCountdownId(id);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingCountdownId(null);
  }, []);

  const dismissNotice = useCallback(() => {
    setNotice(null);
  }, []);

  return (
    <DaysToContext.Provider
      value={{
        countdowns,
        selectedCountdownId,
        pinnedCountdownIds,
        isCreating,
        editingCountdownId,
        notice,
        remainingTimes,
        hydrated,
        addCountdown,
        updateCountdown,
        deleteCountdown,
        archiveCountdown,
        restoreCountdown,
        selectCountdown,
        pinCountdown,
        unpinCountdown,
        startCreating,
        cancelCreating,
        startEditing,
        cancelEditing,
        dismissNotice,
      }}
    >
      {children}
    </DaysToContext.Provider>
  );
}