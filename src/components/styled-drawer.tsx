"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RunStep } from "@/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface StyledDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runId: string | null;
  steps: RunStep[];
}

export function StyledDrawer({ open, onOpenChange, runId, steps }: StyledDrawerProps) {
  const getStepIcon = (status: RunStep["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-[var(--brand-success)]" />;
      case "error":
        return <XCircle className="h-4 w-4 text-[var(--brand-danger)]" />;
      case "pending":
        return <Clock className="h-4 w-4 text-[var(--brand-warn)]" />;
    }
  };

  const getStepBadge = (status: RunStep["status"]) => {
    const styles: Record<RunStep["status"], string> = {
      ok: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
      pending: "bg-amber-100 text-amber-700",
    };

    return (
      <Badge className={`${styles[status]} rounded-[var(--r-chip)] border-0 px-2 py-0.5 text-xs`}>
        {status}
      </Badge>
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-[480px] max-w-[90vw] rounded-none bg-[var(--bg-page)] shadow-[var(--e-2)]">
        <DrawerHeader className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <DrawerTitle className="text-base font-semibold text-[var(--brand-ink)]">
            {runId}
          </DrawerTitle>
          <DrawerDescription className="text-xs text-[var(--text-muted)]">
            Test execution details
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-6">
          <Accordion type="single" collapsible defaultValue="overview" className="w-full">
            <AccordionItem value="overview" className="border-b border-[var(--border-subtle)]">
              <AccordionTrigger className="text-sm font-medium text-[var(--brand-ink)] hover:text-[var(--brand-primary-500)]">
                Overview
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 py-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--text-muted)]">Total Steps</span>
                    <span className="text-sm font-medium text-[var(--brand-ink)] tabular-nums">{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--text-muted)]">Passed</span>
                    <span className="text-sm font-medium text-[var(--brand-success)] tabular-nums">
                      {steps.filter(s => s.status === "ok").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--text-muted)]">Failed</span>
                    <span className="text-sm font-medium text-[var(--brand-danger)] tabular-nums">
                      {steps.filter(s => s.status === "error").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--text-muted)]">Pending</span>
                    <span className="text-sm font-medium text-[var(--brand-warn)] tabular-nums">
                      {steps.filter(s => s.status === "pending").length}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="steps" className="border-b border-[var(--border-subtle)]">
              <AccordionTrigger className="text-sm font-medium text-[var(--brand-ink)] hover:text-[var(--brand-primary-500)]">
                Steps
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 py-2">
                  {steps.map((step) => (
                    <div key={step.index} className="bg-[var(--surface)] rounded-[var(--r-ctl)] p-3 shadow-[var(--e-1)]">
                      <div className="flex items-center gap-2 mb-3">
                        {getStepIcon(step.status)}
                        <span className="text-xs font-medium text-[var(--brand-ink)]">
                          Step {step.index + 1}
                        </span>
                        {getStepBadge(step.status)}
                      </div>
                      
                      <div className="bg-zinc-50 rounded p-2 mb-2">
                        <p className="text-xs text-[var(--text-muted)] mb-1">JSON Command</p>
                        <pre className="text-xs text-zinc-700 overflow-x-auto font-mono">
{JSON.stringify(step.llmCommandJson, null, 2).slice(0, 150)}...
                        </pre>
                      </div>
                      
                      {step.screenshotUrl && (
                        <div className="bg-zinc-100 rounded h-20 flex items-center justify-center">
                          <span className="text-xs text-[var(--text-muted)]">Screenshot placeholder</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="artifacts" className="border-b border-[var(--border-subtle)]">
              <AccordionTrigger className="text-sm font-medium text-[var(--brand-ink)] hover:text-[var(--brand-primary-500)]">
                Artifacts
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-100 rounded-[var(--r-ctl)] aspect-square flex items-center justify-center">
                      <span className="text-xs text-[var(--text-muted)]">Thumbnail {i}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}