export type RunStatus = "pass" | "fail" | "flaky" | "running";

export interface TestRun {
  id: string;
  status: RunStatus;
  device: string;
  startedAt: string; // ISO
  durationSec: number;
}

export interface RunStep {
  index: number;
  status: "ok" | "error" | "pending";
  screenshotUrl?: string;
  llmCommandJson: Record<string, unknown>;
}

export interface Device {
  id: string;
  name: string;
  platform: "iOS" | "Android";
  status: "idle" | "busy";
  osVersion: string;
}

export interface FilterOptions {
  status?: RunStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  device?: string;
}

// Bulk Testing Types
export interface DevicePreset {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: number;
}

export interface BulkTestConfig {
  id: string;
  name: string;
  scenarioId: string;
  deviceIds: string[];
  iterationCount: number;
  createdAt: string;
}

export interface BulkTestRun {
  id: string;
  configId: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  totalRuns: number;
  completedRuns: number;
  runs: TestRun[];
}

export interface BulkTestStats {
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  flakyRuns: number;
  runningRuns: number;
  passRate: number;
  flakyRate: number;
  avgDuration: number;
  deviceStats: DeviceStats[];
}

export interface DeviceStats {
  deviceId: string;
  deviceName: string;
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  flakyRuns: number;
  runningRuns: number;
  passRate: number;
  avgDuration: number;
}