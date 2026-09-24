"use client";

import React from "react";

type Priority = "low" | "medium" | "high";

interface PrioritySelectorProps {
  value: Priority;
  onChange: (value: Priority) => void;
  className?: string;
}

export function PrioritySelector({ value, onChange, className = "" }: PrioritySelectorProps) {
  const priorities: Priority[] = ["low", "medium", "high"];

  return (
    <div className={className} role="radiogroup" aria-label="Priority">
      {priorities.map(p => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={value === p}
          onClick={() => onChange(p)}
          className={`px-4 py-2 text-sm uppercase tracking-wider transition-all ${
            value === p
              ? "font-semibold text-foreground"
              : "text-foreground/55 hover:text-foreground/85"
          }`}
        >
          {p.toUpperCase()}
        </button>
      ))}
    </div>
  );
}