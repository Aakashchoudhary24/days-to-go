"use client";

import React from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className = "" }: DatePickerProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`
        w-full px-0 py-2 text-base font-light bg-transparent border-none outline-none
        placeholder:text-black/20 caret-black
        ${className}
      `}
      aria-label="Deadline date"
    />
  );
}