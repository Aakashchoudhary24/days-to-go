"use client";

import React, { useState } from "react";
import { useDaysTo } from "@/lib/countdown/store";
import { DatePicker } from "./date-picker";
import { PrioritySelector } from "./priority-selector";

function CountdownCreatorInner({ onClose }: { onClose: () => void }) {
  const { addCountdown } = useDaysTo();
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState(() => new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<"name" | "deadline", string>>>({});

  const validateStep = () => {
    const newErrors: Partial<Record<"name" | "deadline", string>> = {};
    if (step === 0 && !name.trim()) newErrors.name = "Required";
    if (step === 1 && !deadline) newErrors.deadline = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deadline) return;
    addCountdown({ name: name.trim(), deadline, priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="space-y-12">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-8">What are you working toward?</h1>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Get in shape"
                className="w-full px-0 py-3 text-2xl font-light bg-transparent border-none outline-none border-b border-black/10 placeholder:text-black/20 caret-black"
                autoFocus
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-2 text-sm text-black/40">{errors.name}</p>}
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-8">When does it end?</h1>
              <DatePicker value={deadline} onChange={setDeadline} />
              {errors.deadline && <p className="mt-2 text-sm text-black/40">{errors.deadline}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-8">How important is it?</h1>
              <PrioritySelector value={priority} onChange={setPriority} />
            </div>
          )}
        </div>

        <div className="mt-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="text-sm font-light text-black/40 hover:text-black/70 disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="text-sm font-medium tracking-wider text-black"
              disabled={(step === 0 && !name.trim()) || (step === 1 && !deadline)}
            >
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              className="text-sm font-medium tracking-wider text-black"
              disabled={!name.trim() || !deadline}
            >
              Create
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-xl font-light text-black/30 hover:text-black/60"
          aria-label="Close"
        >
          ×
        </button>
      </form>
    </div>
  );
}

export function CountdownCreator() {
  const { isCreating, cancelCreating, countdowns } = useDaysTo();

  if (!isCreating && countdowns.length > 0) return null;

  return (
    <CountdownCreatorInner
      key={isCreating ? "open" : "closed"}
      onClose={cancelCreating}
    />
  );
}