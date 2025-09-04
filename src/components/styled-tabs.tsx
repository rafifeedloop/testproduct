"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StyledRunsTable } from "./styled-runs-table";
import { TestRun, Device } from "@/types";
import { useState } from "react";

interface StyledTabsProps {
  runs: TestRun[];
  devices: Device[];
  onOpenDetails: (runId: string) => void;
}

export function StyledTabs({ runs, devices, onOpenDetails }: StyledTabsProps) {
  const [showRuns, setShowRuns] = useState(false);

  const idleDevices = devices.filter(d => d.status === "idle").length;
  const busyDevices = devices.filter(d => d.status === "busy").length;

  return (
    <Tabs defaultValue="runs" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-2">
        <TabsTrigger 
          value="runs" 
          className="h-10 text-sm font-medium rounded-[var(--r-ctl)] data-[state=active]:bg-gradient-to-tr data-[state=active]:from-[var(--brand-primary-500)] data-[state=active]:to-[var(--brand-primary-600)] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_24px_rgba(41,94,236,0.25)] data-[state=inactive]:bg-[var(--surface)] data-[state=inactive]:shadow-[var(--e-1)]"
        >
          Runs
        </TabsTrigger>
        <TabsTrigger 
          value="devices" 
          className="h-10 text-sm font-medium rounded-[var(--r-ctl)] data-[state=active]:bg-gradient-to-tr data-[state=active]:from-[var(--brand-primary-500)] data-[state=active]:to-[var(--brand-primary-600)] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_24px_rgba(41,94,236,0.25)] data-[state=inactive]:bg-[var(--surface)] data-[state=inactive]:shadow-[var(--e-1)]"
        >
          Devices
        </TabsTrigger>
        <TabsTrigger 
          value="trends" 
          className="h-10 text-sm font-medium rounded-[var(--r-ctl)] data-[state=active]:bg-gradient-to-tr data-[state=active]:from-[var(--brand-primary-500)] data-[state=active]:to-[var(--brand-primary-600)] data-[state=active]:text-white data-[state=active]:shadow-[0_8px_24px_rgba(41,94,236,0.25)] data-[state=inactive]:bg-[var(--surface)] data-[state=inactive]:shadow-[var(--e-1)]"
        >
          Trends
        </TabsTrigger>
      </TabsList>

      <TabsContent value="runs" className="mt-6">
        {!showRuns ? (
          <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
            <p className="text-sm leading-6 text-zinc-800 mb-4">
              View recent test execution runs and their detailed results
            </p>
            <Button 
              onClick={() => setShowRuns(true)}
              className="h-10 rounded-[var(--r-ctl)] bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] hover:shadow-[0_8px_24px_rgba(41,94,236,0.25)] transition-shadow"
            >
              View runs
            </Button>
          </Card>
        ) : (
          <StyledRunsTable runs={runs} onOpenDetails={onOpenDetails} />
        )}
      </TabsContent>

      <TabsContent value="devices" className="mt-6 space-y-4">
        <div className="flex gap-3">
          <Badge className="rounded-[var(--r-chip)] bg-zinc-100 text-[var(--brand-ink)] border-0 px-3 py-1 text-xs">
            Total: {devices.length}
          </Badge>
          <Badge className="rounded-[var(--r-chip)] bg-green-100 text-green-700 border-0 px-3 py-1 text-xs">
            Available: {idleDevices}
          </Badge>
          <Badge className="rounded-[var(--r-chip)] bg-amber-100 text-amber-700 border-0 px-3 py-1 text-xs">
            In Use: {busyDevices}
          </Badge>
        </div>

        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[var(--brand-ink)]">{device.name}</p>
                  <p className="text-xs leading-5 text-[var(--text-muted)]">
                    {device.platform} {device.osVersion}
                  </p>
                </div>
                <Badge 
                  className={`rounded-[var(--r-chip)] border-0 px-3 py-1 text-xs ${
                    device.status === "idle" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {device.status === "idle" ? "Available" : "Busy"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="mt-6">
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
          <h3 className="text-base font-semibold leading-6 text-[var(--brand-ink)] mb-4">
            Pass rate over time
          </h3>
          <div className="h-48 bg-zinc-50 rounded-[var(--r-ctl)] flex items-center justify-center">
            <p className="text-sm text-[var(--text-muted)]">Chart placeholder</p>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}