"use client";

import React from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  className?: string;
}

export function DatePicker({ value, onChange, invalid = false, className = "" }: DatePickerProps) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`
          w-full px-0 py-3 text-2xl font-light bg-transparent outline-none
          border-b caret-black [color-scheme:light]
          ${invalid ? "border-black/60" : "border-black/20 focus:border-black/60"}
          placeholder:text-black/20
          transition-colors
          ${className}
        `}
        aria-label="Deadline date"
        aria-invalid={invalid || undefined}
      />
    </div>
  );
}