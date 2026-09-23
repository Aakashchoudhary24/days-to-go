"use client";

import React, { useState } from "react";
import { useDaysTo } from "@/lib/countdown/store";
import { DatePicker } from "./date-picker";
import { PrioritySelector } from "./priority-selector";

interface CountdownEditorProps {
  countdown: {
    id: string;
    name: string;
    deadline: string;
    priority: "low" | "medium" | "high";
    createdAt: string;
    archived?: boolean;
  };
  onClose: () => void;
}

export function CountdownEditor({ countdown, onClose }: CountdownEditorProps) {
  const { updateCountdown, archiveCountdown, deleteCountdown } = useDaysTo();
  const [name, setName] = useState(countdown.name);
  const [deadline, setDeadline] = useState(countdown.deadline);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(countdown.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deadline) return;
    updateCountdown(countdown.id, { name: name.trim(), deadline, priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-white">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white p-8 border border-black/5">
        <div className="space-y-8">
          <div>
            <label htmlFor="edit-name" className="block text-xs font-medium uppercase tracking-wider text-black/40 mb-2">
              Goal name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-0 py-2 text-xl font-light bg-transparent border-none outline-none border-b border-black/10 caret-black"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="edit-deadline" className="block text-xs font-medium uppercase tracking-wider text-black/40 mb-2">
              Deadline
            </label>
            <DatePicker value={deadline} onChange={setDeadline} />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-black/40 mb-2">
              Priority
            </label>
            <PrioritySelector value={priority} onChange={setPriority} />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-black/5 pt-6">
          <button
            type="button"
            onClick={() => { archiveCountdown(countdown.id); onClose(); }}
            className="text-sm font-light text-black/40 hover:text-black"
          >
            Archive
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { deleteCountdown(countdown.id); onClose(); }}
              className="text-sm font-light text-black/40 hover:text-black"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-light text-black/40 hover:text-black px-4 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm font-medium tracking-wider text-black px-4 py-1"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}