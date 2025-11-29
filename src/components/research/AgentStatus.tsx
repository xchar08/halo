"use client";

import { AgentLogEntry } from "@/types/agent";

/**
 * Real-time Agent Status Indicator.
 * Shows the current step and recent logs of the running agent.
 */
export function AgentStatus({ logs }: { logs: AgentLogEntry[] }) {
  if (logs.length === 0) return null;

  const latest = logs[logs.length - 1];

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
          Agent Active: {latest.step}
        </span>
      </div>
      <div className="font-mono text-xs text-zinc-400 truncate">
        {latest.message}
      </div>
    </div>
  );
}
