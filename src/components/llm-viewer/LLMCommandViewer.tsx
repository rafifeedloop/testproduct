"use client";

import { useState } from "react";
import { TestStep, ActionType, filterStepsByAction } from "@/lib/llm-command-data";
import { CommandJsonViewer } from "./CommandJsonViewer";
import { ReasoningNotes } from "./ReasoningNotes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, Target, FileJson, Brain, Filter,
  CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

interface LLMCommandViewerProps {
  step: TestStep;
  testGoal: string;
  onNavigate?: (direction: "prev" | "next") => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function LLMCommandViewer({ 
  step, 
  testGoal,
  onNavigate,
  hasPrevious = false,
  hasNext = false
}: LLMCommandViewerProps) {
  const [filterAction, setFilterAction] = useState<ActionType | "all">("all");

  const getStatusBadge = () => {
    switch (step.executionStatus) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 rounded-[var(--r-chip)]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case "fail":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 rounded-[var(--r-chip)]">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "timeout":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 rounded-[var(--r-chip)]">
            <AlertCircle className="h-3 w-3 mr-1" />
            Timeout
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 rounded-[var(--r-chip)]">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Test Goal */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[var(--r-card)] p-4 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[var(--r-chip)] bg-white flex items-center justify-center shadow-sm">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-1">Test Goal</h3>
            <p className="text-sm text-[var(--text-muted)]">{testGoal}</p>
          </div>
        </div>
      </Card>

      {/* Step Details Header */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-[var(--brand-ink)]">
              {step.index}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--brand-ink)]">
                Step {step.index}: {step.command.action.toUpperCase()}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(step.duration)}
                </span>
                {getStatusBadge()}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          {onNavigate && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("prev")}
                disabled={!hasPrevious}
                className="h-8 px-3 text-xs rounded-[var(--r-ctl)]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("next")}
                disabled={!hasNext}
                className="h-8 px-3 text-xs rounded-[var(--r-ctl)]"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* UI Context */}
        {step.uiTreeSnapshot && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">UI Context</span>
              <Badge variant="secondary" className="text-xs rounded-[var(--r-chip)]">
                {step.uiTreeSnapshot.screen}
              </Badge>
            </div>
            {step.uiTreeSnapshot.elements && (
              <div className="flex flex-wrap gap-1">
                {step.uiTreeSnapshot.elements.slice(0, 5).map((element: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs rounded-[var(--r-chip)] bg-white"
                  >
                    {element}
                  </Badge>
                ))}
                {step.uiTreeSnapshot.elements.length > 5 && (
                  <Badge variant="outline" className="text-xs rounded-[var(--r-chip)] bg-white">
                    +{step.uiTreeSnapshot.elements.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-[var(--text-muted)]">
          Executed at: {new Date(step.timestamp).toLocaleString()}
        </p>
      </Card>

      {/* Command JSON */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-[var(--text-muted)]" />
          <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Command Output</h4>
        </div>
        <CommandJsonViewer command={step.command} />
      </div>

      {/* Reasoning Notes */}
      {step.reasoning && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-[var(--text-muted)]" />
            <h4 className="text-sm font-semibold text-[var(--brand-ink)]">AI Decision Process</h4>
          </div>
          <ReasoningNotes reasoning={step.reasoning} />
        </div>
      )}

      {/* Execution Details */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
        <h4 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Execution Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-[var(--text-muted)]">Target Element</span>
            <p className="text-sm text-[var(--brand-ink)] font-medium mt-1">
              {step.command.target.label || step.command.target.selector || "N/A"}
            </p>
          </div>
          {step.command.target.elementId && (
            <div>
              <span className="text-xs text-[var(--text-muted)]">Element ID</span>
              <p className="text-sm text-[var(--brand-ink)] font-mono mt-1">
                {step.command.target.elementId}
              </p>
            </div>
          )}
          {step.command.target.coordinates && (
            <div>
              <span className="text-xs text-[var(--text-muted)]">Coordinates</span>
              <p className="text-sm text-[var(--brand-ink)] font-mono mt-1">
                x: {step.command.target.coordinates.x}, y: {step.command.target.coordinates.y}
              </p>
            </div>
          )}
          {step.command.parameters?.direction && (
            <div>
              <span className="text-xs text-[var(--text-muted)]">Direction</span>
              <p className="text-sm text-[var(--brand-ink)] font-medium mt-1">
                {step.command.parameters.direction}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}