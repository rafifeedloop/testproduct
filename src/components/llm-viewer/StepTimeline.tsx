"use client";

import { TestStep, ExecutionStatus } from "@/lib/llm-command-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, XCircle, Clock, AlertCircle, 
  MousePointer, Type, Move, Timer, CheckSquare, 
  ArrowUpDown, Circle
} from "lucide-react";

interface StepTimelineProps {
  steps: TestStep[];
  selectedStepIndex?: number;
  onStepSelect: (step: TestStep) => void;
}

export function StepTimeline({ steps, selectedStepIndex, onStepSelect }: StepTimelineProps) {
  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "timeout":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "pending":
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "tap":
        return <MousePointer className="h-3 w-3" />;
      case "type":
        return <Type className="h-3 w-3" />;
      case "swipe":
        return <Move className="h-3 w-3" />;
      case "wait":
        return <Timer className="h-3 w-3" />;
      case "assert":
        return <CheckSquare className="h-3 w-3" />;
      case "scroll":
        return <ArrowUpDown className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: ExecutionStatus) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "fail":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "timeout":
        return "bg-amber-50 border-amber-200 hover:bg-amber-100";
      case "pending":
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "tap":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "type":
        return "bg-green-100 text-green-700 border-green-200";
      case "swipe":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "wait":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "assert":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "scroll":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] border-0 h-full">
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <h3 className="text-sm font-semibold text-[var(--brand-ink)]">Test Steps</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">{steps.length} steps executed</p>
      </div>
      
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-4 space-y-2">
          {steps.map((step, index) => {
            const isSelected = selectedStepIndex === step.index;
            return (
              <div key={step.id} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                <button
                  onClick={() => onStepSelect(step)}
                  className={`w-full text-left rounded-lg border p-3 transition-all ${
                    isSelected 
                      ? "border-[var(--brand-primary-500)] bg-blue-50 shadow-sm" 
                      : getStatusColor(step.executionStatus)
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Step number with status */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-[var(--brand-ink)]">
                        {step.index}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        {getStatusIcon(step.executionStatus)}
                      </div>
                    </div>
                    
                    {/* Step details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`rounded-[var(--r-chip)] text-xs px-2 py-0.5 border ${getActionBadgeColor(step.command.action)}`}
                        >
                          <span className="flex items-center gap-1">
                            {getActionIcon(step.command.action)}
                            {step.command.action}
                          </span>
                        </Badge>
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatDuration(step.duration)}
                        </span>
                      </div>
                      
                      {/* Target info */}
                      {step.command.target.label && (
                        <p className="text-xs text-[var(--brand-ink)] font-medium truncate">
                          {step.command.target.label}
                        </p>
                      )}
                      
                      {step.command.target.selector && (
                        <p className="text-xs text-[var(--text-muted)] truncate mt-1">
                          {step.command.target.selector}
                        </p>
                      )}
                      
                      {step.command.parameters?.text && (
                        <p className="text-xs text-[var(--text-muted)] truncate mt-1">
                          Text: "{step.command.parameters.text}"
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}