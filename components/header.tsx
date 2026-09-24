"use client";

import React, { useState } from "react";
import { useDaysTo } from "@/lib/countdown/store";
import { ThemeToggle } from "./theme-toggle";
import { IconMenu, IconX } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const {
    isCreating,
    startCreating,
    countdowns,
    hydrated,
    selectedCountdownId,
    pinnedCountdownIds,
    remainingTimes,
    selectCountdown,
    pinCountdown,
  } = useDaysTo();

  const [menuOpen, setMenuOpen] = useState(false);

  const active = countdowns.filter(c => !c.archived);
  const showCreate = hydrated && countdowns.length > 0 && !isCreating;
  const showMenu = hydrated && active.length > 1 && !isCreating;

  const activate = (id: string) => {
    selectCountdown(id);
    if (!pinnedCountdownIds.includes(id)) pinCountdown(id);
    setMenuOpen(false);
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-foreground/5">
      <div className="text-sm font-medium tracking-wide">days-to</div>
      <div className="flex items-center gap-1">
        <ThemeToggle />

        {showMenu && (
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              aria-label="Countdown navigation"
              className="inline-flex size-7 items-center justify-center text-foreground/60 transition-opacity hover:opacity-70"
            >
              {menuOpen ? (
                <IconX size={16} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <IconMenu size={16} strokeWidth={1.5} aria-hidden="true" />
              )}
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[min(19rem,calc(100vw-2rem))] gap-0 p-1 shadow-none"
            >
              <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Countdowns
              </p>
              <div className="flex max-h-[min(55vh,22rem)] flex-col gap-0.5 overflow-y-auto pb-1">
                {active.map(c => {
                  const isSelected = selectedCountdownId === c.id;
                  const isPinned = pinnedCountdownIds.includes(c.id);
                  const days = remainingTimes.get(c.id)?.calendarDays ?? null;
                  const dayText =
                    days === null
                      ? "–"
                      : days < 0
                        ? `+${-days}D`
                        : `${days}D`;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => activate(c.id)}
                      aria-current={isSelected ? "true" : "false"}
                      className={`
                        flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors
                        ${
                          isSelected
                            ? "bg-foreground/5"
                            : "hover:bg-foreground/5"
                        }
                      `}
                    >
                      <span
                        className={`w-9 shrink-0 font-mono text-xs font-light ${
                          isSelected ? "text-foreground" : "text-foreground/60"
                        }`}
                      >
                        {dayText}
                      </span>
                      <span
                        className={`flex-1 truncate text-xs font-medium uppercase tracking-wider ${
                          isSelected
                            ? "text-foreground"
                            : "text-foreground/55"
                        }`}
                      >
                        {c.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`size-1 rounded-full ${
                          isPinned ? "bg-foreground" : "bg-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {showCreate && (
          <button
            onClick={startCreating}
            className="text-lg font-light hover:opacity-70 transition-opacity"
            aria-label="Create countdown"
          >
            +
          </button>
        )}
      </div>
    </header>
  );
}