"use client";

import { useState, useEffect } from "react";
import { MinimalHeader } from "@/components/minimal-header";
import { MinimalKPICards } from "@/components/minimal-kpi-cards";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { RunDetailDrawer } from "@/components/run-detail-drawer";
import { Separator } from "@/components/ui/separator";
import { TestRun, RunStep, FilterOptions, Device } from "@/types";
import { fetchTestRuns, fetchRunDetails, calculateKPIs, getDevices } from "./actions";

interface MinimalDashboardProps {
  initialRuns: TestRun[];
  initialKPIs: {
    runsToday: number;
    passRate: number;
    flakyRate: number;
    avgDuration: number;
  };
  devices: Device[];
}

export function MinimalDashboard({ initialRuns, initialKPIs, devices }: MinimalDashboardProps) {
  const [runs, setRuns] = useState<TestRun[]>(initialRuns);
  const [kpis, setKpis] = useState(initialKPIs);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runSteps, setRunSteps] = useState<RunStep[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFiltersChange = async (filters: FilterOptions) => {
    try {
      const [newRuns, newKPIs] = await Promise.all([
        fetchTestRuns(filters),
        calculateKPIs(filters)
      ]);
      setRuns(newRuns);
      setKpis(newKPIs);
    } catch (error) {
      console.error("Failed to fetch filtered runs:", error);
    }
  };

  const handleOpenDetails = async (runId: string) => {
    setSelectedRunId(runId);
    try {
      const steps = await fetchRunDetails(runId);
      setRunSteps(steps);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Failed to fetch run details:", error);
    }
  };

  const deviceNames = [...new Set(devices.map(d => d.name))];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <MinimalHeader 
          onFiltersChange={handleFiltersChange}
          devices={deviceNames}
        />
        
        <MinimalKPICards {...kpis} />
        
        <Separator className="my-6" />
        
        <DashboardTabs 
          runs={runs}
          devices={devices}
          onOpenDetails={handleOpenDetails}
        />
      </div>
      
      <RunDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        runId={selectedRunId}
        steps={runSteps}
      />
    </div>
  );
}