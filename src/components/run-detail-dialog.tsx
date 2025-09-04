"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RunStep } from "@/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";

interface RunDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runId: string | null;
  steps: RunStep[];
}

export function RunDetailDialog({ open, onOpenChange, runId, steps }: RunDetailDialogProps) {
  const getStepIcon = (status: RunStep["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStepBadge = (status: RunStep["status"]) => {
    const variants: Record<RunStep["status"], "default" | "destructive" | "secondary"> = {
      ok: "default",
      error: "destructive",
      pending: "secondary",
    };
    
    return (
      <Badge variant={variants[status]} className={status === "ok" ? "bg-green-500 hover:bg-green-600" : ""}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Run Details - {runId}</DialogTitle>
          <DialogDescription>
            Test execution steps and screenshots
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStepIcon(step.status)}
                  <span className="font-medium">Step {step.index + 1}</span>
                  {getStepBadge(step.status)}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Screenshot</h4>
                  <div className="border rounded bg-gray-100 h-48 flex items-center justify-center text-gray-400">
                    Screenshot placeholder
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">LLM Command</h4>
                  <pre className="bg-gray-50 rounded p-3 text-xs overflow-x-auto">
{JSON.stringify(step.llmCommandJson, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {steps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No steps available for this run
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}