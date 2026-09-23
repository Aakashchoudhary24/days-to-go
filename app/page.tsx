"use client";

import React from "react";
import { DaysToProvider } from "@/lib/countdown/store";
import { Header } from "@/components/header";
import { CountdownStage } from "@/components/countdown-stage";
import { CountdownRail } from "@/components/countdown-rail";
import { CountdownCreator } from "@/components/countdown-creator";
import { EmptyState } from "@/components/empty-state";
import { CountdownEditor } from "@/components/countdown-editor";
import { useDaysTo } from "@/lib/countdown/store";

function AppContent() {
  const {
    countdowns,
    editingCountdownId,
    isCreating,
    notice,
    cancelEditing,
  } = useDaysTo();

  const editingCountdown = countdowns.find(c => c.id === editingCountdownId);

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex relative">
        <CountdownRail />
        <main className="flex-1 flex flex-col ml-16">
          <CountdownStage />
        </main>
      </div>

      {notice && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-sm font-light text-black/60 bg-white border border-black/10"
          role="status"
          aria-live="polite"
        >
          {notice}
        </div>
      )}

      {isCreating && <CountdownCreator />}
      {editingCountdown && (
        <CountdownEditor countdown={editingCountdown} onClose={cancelEditing} />
      )}
      {countdowns.length === 0 && !isCreating && <EmptyState />}
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