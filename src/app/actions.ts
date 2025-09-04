"use server";

import { TestRun, RunStep, FilterOptions, Device } from "@/types";
import { 
  runs as mockRuns, 
  stepsByRun, 
  devices as mockDevices, 
  kpis as mockKpis,
  Run,
  Step
} from "@/lib/mock-data";

// Convert new Run type to TestRun type
function convertRun(run: Run): TestRun {
  return {
    id: run.id,
    status: run.status.toLowerCase() as "pass" | "fail" | "flaky" | "running",
    device: run.device,
    startedAt: run.startISO,
    durationSec: run.durationSec,
  };
}

// Convert new Step type to RunStep type
function convertStep(step: Step): RunStep {
  return {
    index: parseInt(step.id.split('-')[1]) - 1,
    status: step.status === "PASS" ? "ok" : "error",
    screenshotUrl: step.screenshotUrl,
    llmCommandJson: step.json,
  };
}

// Generate more test runs for a fuller dashboard
function generateTestRuns(count: number = 100): TestRun[] {
  const baseRuns = mockRuns.map(convertRun);
  const runs: TestRun[] = [];
  
  // Add the base runs
  runs.push(...baseRuns);
  
  // Generate additional runs to reach the count
  const statuses: Array<"pass" | "fail" | "flaky" | "running"> = ["pass", "fail", "flaky", "running"];
  const devices = ["iPhone 15 Pro", "Pixel 8 Pro", "Samsung S24", "iPad Pro", "iPhone 14"];
  
  for (let i = runs.length; i < count; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 15); // Space out by 15 minutes
    
    runs.push({
      id: `run-${String(i + 1).padStart(3, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      startedAt: date.toISOString(),
      durationSec: Math.floor(Math.random() * 400) + 100,
    });
  }
  
  return runs;
}

export async function fetchTestRuns(filters?: FilterOptions): Promise<TestRun[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let runs = generateTestRuns(100);
  
  if (filters) {
    // Filter by status
    if (filters.status && filters.status !== "all") {
      runs = runs.filter(run => run.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      runs = runs.filter(run => new Date(run.startedAt) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      runs = runs.filter(run => new Date(run.startedAt) <= new Date(filters.dateTo!));
    }
    
    // Filter by device
    if (filters.device && filters.device !== "all") {
      runs = runs.filter(run => run.device === filters.device);
    }
  }
  
  return runs;
}

export async function fetchRunDetails(runId: string): Promise<RunStep[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Get steps for this run if they exist, otherwise generate some
  const steps = stepsByRun[runId];
  if (steps) {
    return steps.map(convertStep);
  }
  
  // Generate default steps for runs that don't have specific steps
  const defaultSteps: RunStep[] = [
    {
      index: 0,
      status: "ok",
      screenshotUrl: "/api/placeholder/400/800",
      llmCommandJson: { action: "launch", target: "app" },
    },
    {
      index: 1,
      status: Math.random() > 0.3 ? "ok" : "error",
      screenshotUrl: "/api/placeholder/400/800",
      llmCommandJson: { action: "test", step: "main flow" },
    },
  ];
  
  return defaultSteps;
}

export async function rerunFilters(filters: FilterOptions): Promise<TestRun[]> {
  // Simulate re-running tests with filters
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate new test runs based on filters
  const newRuns = generateTestRuns(10).map(run => ({
    ...run,
    status: "running" as const,
    startedAt: new Date().toISOString(),
  }));
  
  return newRuns;
}

// Convert Device type to match what dashboard expects
export async function getDevices(): Promise<Device[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockDevices.map(device => ({
    id: device.id,
    name: device.name,
    platform: device.os,
    status: device.state.toLowerCase() as "idle" | "busy",
    osVersion: device.version,
  }));
}

export async function calculateKPIs(filters?: FilterOptions) {
  const runs = await fetchTestRuns(filters);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayRuns = runs.filter(run => 
    new Date(run.startedAt) >= today
  );
  
  const passedRuns = runs.filter(run => run.status === "pass");
  const flakyRuns = runs.filter(run => run.status === "flaky");
  
  const totalDuration = runs.reduce((sum, run) => sum + run.durationSec, 0);
  const avgDuration = runs.length > 0 ? totalDuration / runs.length : 0;
  
  // Use mock KPIs as base but recalculate based on filters
  return {
    runsToday: todayRuns.length > 0 ? todayRuns.length : mockKpis.runsToday,
    passRate: runs.length > 0 ? (passedRuns.length / runs.length) * 100 : mockKpis.passRate * 100,
    flakyRate: runs.length > 0 ? (flakyRuns.length / runs.length) * 100 : mockKpis.flakyRate * 100,
    avgDuration: Math.round(avgDuration > 0 ? avgDuration : mockKpis.avgDurationSec),
  };
}