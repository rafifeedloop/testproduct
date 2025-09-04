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