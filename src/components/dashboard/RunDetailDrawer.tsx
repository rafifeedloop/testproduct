"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { stepsByRun, runs } from "@/lib/mock-data";
import { format } from "date-fns";

interface RunDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runId: string | null;
}

export function RunDetailDrawer({ open, onOpenChange, runId }: RunDetailDrawerProps) {
  const run = runs.find(r => r.id === runId);
  const steps = runId ? stepsByRun[runId] || [] : [];
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-[480px] max-w-[90vw] rounded-none bg-[var(--surface)] shadow-[var(--e-3)]">
        <DrawerHeader className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-base font-semibold text-[var(--brand-ink)]">
                Run Details
              </DrawerTitle>
              <DrawerDescription className="text-xs text-[var(--text-muted)]">
                {runId}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-6">
          <Accordion type="single" collapsible defaultValue="overview" className="w-full">
            {/* Overview */}
            <AccordionItem value="overview" className="border-b border-[var(--border-subtle)]">
              <AccordionTrigger className="text-sm font-medium text-[var(--brand-ink)]">
                Overview
              </AccordionTrigger>
              <AccordionContent>
                {run && (
                  <div className="space-y-3 py-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Run ID</span>
                      <span className="text-sm font-medium text-[var(--brand-ink)]">{run.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Status</span>
                      <Badge className={`rounded-[var(--r-chip)] border-0 px-2 py-0.5 text-xs ${
                        run.status === "PASS" ? "bg-[var(--brand-success)] text-white" :
                        run.status === "FAIL" ? "bg-[var(--brand-danger)] text-white" :
                        run.status === "FLAKY" ? "bg-[var(--brand-warn)] text-white" :
                        "bg-blue-500 text-white"
                      }`}>
                        {run.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Device</span>
                      <span className="text-sm font-medium text-[var(--brand-ink)]">{run.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Start Time</span>
                      <span className="text-sm text-[var(--brand-ink)]">
                        {format(new Date(run.startISO), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Duration</span>
                      <span className="text-sm font-medium text-[var(--brand-ink)] tabular-nums">
                        {formatDuration(run.durationSec)}
                      </span>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Steps */}
            <AccordionItem value="steps" className="border-b border-[var(--border-subtle)]">
              <AccordionTrigger className="text-sm font-medium text-[var(--brand-ink)]">
                Steps ({steps.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 py-2">
                  {steps.map((step) => (
                    <div key={step.id} className="bg-zinc-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--brand-ink)]">
                          {step.title}
                        </span>
                        <Badge className={`rounded-[var(--r-chip)] border-0 px-2 py-0.5 text-xs ${
                          step.status === "PASS" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {step.status}
                        </Badge>
                      </div>
                      
                      <pre className="text-xs bg-white rounded p-2 overflow-x-auto font-mono text-zinc-700">
{JSON.stringify(step.json, null, 2)}
                      </pre>
                      
                      {step.screenshotUrl && (
                        <div className="mt-2 bg-zinc-100 rounded h-24 flex items-center justify-center">
                          <span className="text-xs text-[var(--text-muted)]">Screenshot placeholder</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Artifacts */}
            <AccordionItem value="artifacts" className="border-b border-[var(--border-subtle)]">
              <AccordionTrigger className="text-sm font-medium text-[var(--brand-ink)]">
                Artifacts
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2 py-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-zinc-100 rounded-lg aspect-square flex items-center justify-center">
                      <span className="text-xs text-[var(--text-muted)]">Artifact {i}</span>
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