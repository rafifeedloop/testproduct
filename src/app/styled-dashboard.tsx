"use client";

import { useState, useEffect } from "react";
import { StyledHeader } from "@/components/styled-header";
import { StyledKPICards } from "@/components/styled-kpi-cards";
import { StyledTabs } from "@/components/styled-tabs";
import { StyledDrawer } from "@/components/styled-drawer";
import { Separator } from "@/components/ui/separator";
import { TestRun, RunStep, FilterOptions, Device } from "@/types";
import { fetchTestRuns, fetchRunDetails, calculateKPIs, getDevices, rerunFilters } from "./actions";

interface StyledDashboardProps {
  initialRuns: TestRun[];
  initialKPIs: {
    runsToday: number;
    passRate: number;
    flakyRate: number;
    avgDuration: number;
  };
  devices: Device[];
}

export function StyledDashboard({ initialRuns, initialKPIs, devices }: StyledDashboardProps) {
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

  const handleRerun = async () => {
    try {
      const newRuns = await rerunFilters({});
      setRuns([...newRuns, ...runs]);
      const newKPIs = await calculateKPIs();
      setKpis(newKPIs);
    } catch (error) {
      console.error("Failed to rerun filters:", error);
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
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="flex-1 p-6 space-y-6">
        <StyledHeader 
          onFiltersChange={handleFiltersChange}
          onRerun={handleRerun}
          devices={deviceNames}
        />
        
        <StyledKPICards {...kpis} />
        
        <Separator className="bg-[var(--border-subtle)]" />
        
        <StyledTabs 
          runs={runs}
          devices={devices}
          onOpenDetails={handleOpenDetails}
        />
      </div>
      
      <StyledDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        runId={selectedRunId}
        steps={runSteps}
      />
    </div>
  );
}