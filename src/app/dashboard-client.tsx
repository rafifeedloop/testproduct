"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { KPICards } from "@/components/kpi-cards";
import { TestRunsTable } from "@/components/test-runs-table";
import { RunDetailDialog } from "@/components/run-detail-dialog";
import { DeviceSidebar } from "@/components/device-sidebar";
import { TestRun, RunStep, FilterOptions, Device } from "@/types";
import { fetchTestRuns, fetchRunDetails, rerunFilters, getDevices, calculateKPIs } from "./actions";

interface DashboardClientProps {
  initialRuns: TestRun[];
  initialKPIs: {
    runsToday: number;
    passRate: number;
    flakyRate: number;
    avgDuration: number;
  };
  devices: Device[];
}

export function DashboardClient({ initialRuns, initialKPIs, devices }: DashboardClientProps) {
  const [runs, setRuns] = useState<TestRun[]>(initialRuns);
  const [kpis, setKpis] = useState(initialKPIs);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runSteps, setRunSteps] = useState<RunStep[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFiltersChange = async (filters: FilterOptions) => {
    setLoading(true);
    try {
      const [newRuns, newKPIs] = await Promise.all([
        fetchTestRuns(filters),
        calculateKPIs(filters)
      ]);
      setRuns(newRuns);
      setKpis(newKPIs);
    } catch (error) {
      console.error("Failed to fetch filtered runs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = async () => {
    setLoading(true);
    try {
      const newRuns = await rerunFilters({});
      setRuns([...newRuns, ...runs]);
      const newKPIs = await calculateKPIs();
      setKpis(newKPIs);
    } catch (error) {
      console.error("Failed to rerun filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (runId: string) => {
    setSelectedRunId(runId);
    try {
      const steps = await fetchRunDetails(runId);
      setRunSteps(steps);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch run details:", error);
    }
  };

  const deviceNames = [...new Set(devices.map(d => d.name))];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          onFiltersChange={handleFiltersChange}
          onRerun={handleRerun}
          devices={deviceNames}
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <KPICards {...kpis} />
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ) : (
              <TestRunsTable 
                runs={runs} 
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        </div>
      </div>
      
      <DeviceSidebar devices={devices} />
      
      <RunDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        runId={selectedRunId}
        steps={runSteps}
      />
    </div>
  );
}