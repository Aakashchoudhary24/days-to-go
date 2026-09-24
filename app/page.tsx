"use client";

import React from "react";
import { DaysToProvider, useDaysTo } from "@/lib/countdown/store";
import { Header } from "@/components/header";
import { CountdownStage } from "@/components/countdown-stage";
import { CountdownRail } from "@/components/countdown-rail";
import { CountdownCreator } from "@/components/countdown-creator";
import { CountdownEditor } from "@/components/countdown-editor";

function AppContent() {
  const {
    countdowns,
    editingCountdownId,
    isCreating,
    notice,
    cancelEditing,
  } = useDaysTo();

  const editingCountdown = countdowns.find(c => c.id === editingCountdownId);
  const hasCountdowns = countdowns.length > 0;
  // With zero countdowns, the creation flow IS the page.
  const showCreator = !hasCountdowns || isCreating;
  // The desktop island nav shows with >1 active countdown; reserve its gutter.
  const hasIsland = countdowns.filter(c => !c.archived).length > 1;

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex relative">
        <CountdownRail />
        <main className={`flex-1 flex flex-col ${hasIsland ? "md:pl-24" : ""}`}>
          <CountdownStage />
        </main>
      </div>

      {notice && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-sm font-light text-foreground/70 bg-background border border-foreground/10"
          role="status"
          aria-live="polite"
        >
          {notice}
        </div>
      )}

      {showCreator && <CountdownCreator />}
      {editingCountdown && (
        <CountdownEditor countdown={editingCountdown} onClose={cancelEditing} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <DaysToProvider>
      <AppContent />
    </DaysToProvider>
  );
}