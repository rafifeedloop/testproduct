"use client";

import { Info, Lightbulb } from "lucide-react";

interface ReasoningNotesProps {
  reasoning?: string;
  className?: string;
}

export function ReasoningNotes({ reasoning, className = "" }: ReasoningNotesProps) {
  if (!reasoning) {
    return (
      <div className={`bg-gray-50 rounded-[var(--r-card)] p-4 border border-gray-200 ${className}`}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-500 italic">
            No reasoning notes available for this step
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 rounded-[var(--r-card)] p-4 border border-blue-200 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-blue-900 mb-1">AI Reasoning</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            {reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}