"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RunStep } from "@/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface RunDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runId: string | null;
  steps: RunStep[];
}

export function RunDetailDrawer({ open, onOpenChange, runId, steps }: RunDetailDrawerProps) {
  const getStepIcon = (status: RunStep["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "error":
        return <XCircle className="h-3 w-3 text-red-500" />;
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-[400px] max-w-[90vw] rounded-none">
        <DrawerHeader>
          <DrawerTitle className="text-base">{runId}</DrawerTitle>
          <DrawerDescription className="text-xs">Test execution details</DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          <Accordion type="single" collapsible defaultValue="overview" className="w-full">
            <AccordionItem value="overview">
              <AccordionTrigger className="text-sm">Overview</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Steps</span>
                    <span>{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passed</span>
                    <span className="text-green-600">{steps.filter(s => s.status === "ok").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Failed</span>
                    <span className="text-red-600">{steps.filter(s => s.status === "error").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="text-yellow-600">{steps.filter(s => s.status === "pending").length}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="steps">
              <AccordionTrigger className="text-sm">Steps</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.index} className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {getStepIcon(step.status)}
                        <span className="text-xs font-medium">Step {step.index + 1}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {step.status}
                        </Badge>
                      </div>
                      
                      <div className="bg-muted rounded p-2 mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Command</p>
                        <pre className="text-xs overflow-x-auto">
{JSON.stringify(step.llmCommandJson, null, 2).slice(0, 150)}...
                        </pre>
                      </div>
                      
                      {step.screenshotUrl && (
                        <div className="bg-gray-100 rounded h-20 flex items-center justify-center text-xs text-gray-400">
                          Screenshot placeholder
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="artifacts">
              <AccordionTrigger className="text-sm">Artifacts</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded aspect-square flex items-center justify-center text-xs text-gray-400">
                      Thumbnail {i}
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