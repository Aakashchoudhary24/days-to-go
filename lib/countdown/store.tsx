"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import type { Countdown, Priority, RemainingTime } from "./types";
import {
  loadCountdowns,
  saveCountdowns,
  loadPinnedIds,
  savePinnedIds,
} from "./storage";
import { getRemainingTime } from "./calculations";

const MAX_PINNED = 4;

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const stored = loadCountdowns();
    const active = stored.filter(c => !c.archived);
    let pinned = loadPinnedIds().filter(id => stored.some(c => c.id === id));
    if (active.length > 0 && pinned.length === 0) {
      pinned = active.slice(0, MAX_PINNED).map(c => c.id);
    }
    setCountdowns(stored);
    setPinnedCountdownIds(pinned);
    if (active.length > 0) {
      setSelectedCountdownId(active[0].id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCountdowns(countdowns);
    savePinnedIds(pinnedCountdownIds);
  }, [countdowns, pinnedCountdownIds, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [hydrated]);

  const remainingTimes = useMemo(() => {
    const map = new Map<string, RemainingTime>();
    for (const c of countdowns) {
      if (!c.archived) {
        map.set(c.id, getRemainingTime(c, now));
      }
    }
    return map;
  }, [countdowns, now]);

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
    setCountdowns(prev => [...prev, newCountdown]);
    setPinnedCountdownIds(prev => {
      if (prev.includes(newCountdown.id)) return prev;
      if (prev.length >= MAX_PINNED) return prev;
      return [...prev, newCountdown.id];
    });
    setSelectedCountdownId(newCountdown.id);
    setIsCreating(false);
  }, []);

  const updateCountdown = useCallback((id: string, patch: Partial<Pick<Countdown, "name" | "deadline" | "priority">>) => {
    setCountdowns(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const deleteCountdown = useCallback((id: string) => {
    const next = countdowns.filter(c => c.id !== id);
    setCountdowns(next);
    setPinnedCountdownIds(prev => prev.filter(pid => pid !== id));
    setSelectedCountdownId(prev => {
      if (prev !== id) return prev;
      return next.find(c => !c.archived)?.id ?? null;
    });
  }, [countdowns]);

  const archiveCountdown = useCallback((id: string) => {
    setCountdowns(prev => prev.map(c => (c.id === id ? { ...c, archived: true } : c)));
    setPinnedCountdownIds(prev => prev.filter(pid => pid !== id));
    setSelectedCountdownId(prev => {
      if (prev !== id) return prev;
      return countdowns.find(c => c.id !== id && !c.archived)?.id ?? null;
    });
  }, [countdowns]);

  const restoreCountdown = useCallback((id: string) => {
    setCountdowns(prev => prev.map(c => (c.id === id ? { ...c, archived: false } : c)));
  }, []);

  const selectCountdown = useCallback((id: string | null) => {
    setSelectedCountdownId(id);
  }, []);

  const pinCountdown = useCallback((id: string) => {
    if (pinnedCountdownIds.includes(id)) return;
    if (pinnedCountdownIds.length >= MAX_PINNED) {
      showNotice("Maximum 4 countdowns on stage");
      return;
    }
    setPinnedCountdownIds(prev => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_PINNED) return prev;
      return [...prev, id];
    });
  }, [pinnedCountdownIds, showNotice]);

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