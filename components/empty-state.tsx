"use client";

import React from "react";
import { useDaysTo } from "@/lib/countdown/store";

export function EmptyState() {
  const { startCreating, countdowns } = useDaysTo();

  if (countdowns.length > 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-light tracking-tight mb-12">What are you working toward?</h1>
        <button
          onClick={startCreating}
          className="w-full py-3 text-left text-2xl font-light border-b border-black/10 hover:border-black/30 transition-colors"
        >
          + Create countdown
        </button>
      </div>
    </div>
  );
}