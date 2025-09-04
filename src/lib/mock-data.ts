// Type definitions
export type RunStatus = "PASS" | "FAIL" | "FLAKY" | "RUNNING";
export type StepStatus = "PASS" | "FAIL";
export type DeviceOS = "iOS" | "Android";
export type DeviceState = "Idle" | "Busy";

export interface Run {
  id: string;
  status: RunStatus;
  device: string;
  startISO: string;
  durationSec: number;
}

export interface Step {
  id: string;
  title: string;
  status: StepStatus;
  json: Record<string, any>;
  screenshotUrl?: string;
}

export interface Device {
  id: string;
  name: string;
  os: DeviceOS;
  version: string;
  state: DeviceState;
}

// KPI data
export const kpis = {
  runsToday: 51,
  passRate: 0.27,
  avgDurationSec: 314,
  flakyRate: 0.26
};

// Runs data
export const runs: Run[] = [
  { id: "run-001", status: "PASS", device: "iPhone 15 Pro", startISO: "2024-01-15T10:30:00Z", durationSec: 285 },
  { id: "run-002", status: "FAIL", device: "Pixel 8 Pro", startISO: "2024-01-15T10:25:00Z", durationSec: 412 },
  { id: "run-003", status: "FLAKY", device: "Samsung S24", startISO: "2024-01-15T10:20:00Z", durationSec: 367 },
  { id: "run-004", status: "RUNNING", device: "iPhone 14", startISO: "2024-01-15T10:15:00Z", durationSec: 180 },
  { id: "run-005", status: "PASS", device: "iPad Pro", startISO: "2024-01-15T10:10:00Z", durationSec: 298 },
  { id: "run-006", status: "PASS", device: "iPhone 15 Pro", startISO: "2024-01-15T10:05:00Z", durationSec: 276 },
  { id: "run-007", status: "FAIL", device: "Pixel 7", startISO: "2024-01-15T10:00:00Z", durationSec: 445 },
  { id: "run-008", status: "PASS", device: "Samsung S23", startISO: "2024-01-15T09:55:00Z", durationSec: 312 },
  { id: "run-009", status: "FLAKY", device: "iPhone 14 Pro", startISO: "2024-01-15T09:50:00Z", durationSec: 389 },
  { id: "run-010", status: "PASS", device: "Pixel 8 Pro", startISO: "2024-01-15T09:45:00Z", durationSec: 267 },
  { id: "run-011", status: "FAIL", device: "OnePlus 11", startISO: "2024-01-15T09:40:00Z", durationSec: 342 },
  { id: "run-012", status: "PASS", device: "iPhone 13", startISO: "2024-01-15T09:35:00Z", durationSec: 258 },
  { id: "run-013", status: "PASS", device: "Pixel 6", startISO: "2024-01-15T09:30:00Z", durationSec: 295 },
  { id: "run-014", status: "FLAKY", device: "iPad Air", startISO: "2024-01-15T09:25:00Z", durationSec: 393 },
  { id: "run-015", status: "PASS", device: "iPhone 12 Pro", startISO: "2024-01-15T09:20:00Z", durationSec: 261 },
  { id: "run-016", status: "FAIL", device: "Samsung A54", startISO: "2024-01-15T09:15:00Z", durationSec: 495 },
  { id: "run-017", status: "PASS", device: "iPhone SE", startISO: "2024-01-15T09:10:00Z", durationSec: 228 },
  { id: "run-018", status: "PASS", device: "Pixel 8", startISO: "2024-01-15T09:05:00Z", durationSec: 269 },
  { id: "run-019", status: "FLAKY", device: "iPhone 11", startISO: "2024-01-15T09:00:00Z", durationSec: 357 },
  { id: "run-020", status: "PASS", device: "Samsung S22", startISO: "2024-01-15T08:55:00Z", durationSec: 281 },
  { id: "run-021", status: "FAIL", device: "OnePlus Nord", startISO: "2024-01-15T08:50:00Z", durationSec: 423 },
  { id: "run-022", status: "PASS", device: "iPhone 15", startISO: "2024-01-15T08:45:00Z", durationSec: 292 },
  { id: "run-023", status: "PASS", device: "Pixel 7a", startISO: "2024-01-15T08:40:00Z", durationSec: 256 },
  { id: "run-024", status: "FLAKY", device: "iPad Mini", startISO: "2024-01-15T08:35:00Z", durationSec: 371 },
  { id: "run-025", status: "PASS", device: "Samsung S21", startISO: "2024-01-15T08:30:00Z", durationSec: 278 },
  { id: "run-026", status: "FAIL", device: "Xiaomi 13", startISO: "2024-01-15T08:25:00Z", durationSec: 562 },
  { id: "run-027", status: "PASS", device: "iPhone 14 Plus", startISO: "2024-01-15T08:20:00Z", durationSec: 287 },
  { id: "run-028", status: "PASS", device: "Pixel Fold", startISO: "2024-01-15T08:15:00Z", durationSec: 301 },
  { id: "run-029", status: "FLAKY", device: "Samsung Tab S9", startISO: "2024-01-15T08:10:00Z", durationSec: 408 },
  { id: "run-030", status: "PASS", device: "iPhone 12", startISO: "2024-01-15T08:05:00Z", durationSec: 263 },
  { id: "run-011", status: "PASS", device: "iPhone 15", startISO: "2024-01-15T09:40:00Z", durationSec: 291 },
  { id: "run-012", status: "FAIL", device: "Samsung S24 Ultra", startISO: "2024-01-15T09:35:00Z", durationSec: 523 },
];

// Steps by run
export const stepsByRun: Record<string, Step[]> = {
  "run-001": [
    { id: "step-1", title: "Launch Application", status: "PASS", json: { action: "launch", target: "app.bundle.id" } },
    { id: "step-2", title: "Login Flow", status: "PASS", json: { action: "login", user: "test@example.com" }, screenshotUrl: "/api/screenshot/1" },
    { id: "step-3", title: "Navigate to Dashboard", status: "PASS", json: { action: "navigate", screen: "dashboard" } },
  ],
  "run-002": [
    { id: "step-1", title: "Launch Application", status: "PASS", json: { action: "launch", target: "app.bundle.id" } },
    { id: "step-2", title: "Login Flow", status: "FAIL", json: { action: "login", error: "Element not found" }, screenshotUrl: "/api/screenshot/2" },
  ],
  "run-003": [
    { id: "step-1", title: "Launch Application", status: "PASS", json: { action: "launch", target: "app.bundle.id" } },
    { id: "step-2", title: "Login Flow", status: "PASS", json: { action: "login", user: "test@example.com" } },
    { id: "step-3", title: "Payment Flow", status: "FAIL", json: { action: "payment", error: "Timeout after 30s" } },
  ],
};

// Devices data
export const devices: Device[] = [
  { id: "dev-001", name: "iPhone 15 Pro", os: "iOS", version: "17.2", state: "Busy" },
  { id: "dev-002", name: "iPhone 14", os: "iOS", version: "17.0", state: "Idle" },
  { id: "dev-003", name: "iPad Pro", os: "iOS", version: "17.2", state: "Idle" },
  { id: "dev-004", name: "Pixel 8 Pro", os: "Android", version: "14", state: "Busy" },
  { id: "dev-005", name: "Samsung S24", os: "Android", version: "14", state: "Idle" },
  { id: "dev-006", name: "Pixel 7", os: "Android", version: "13", state: "Idle" },
  { id: "dev-007", name: "Samsung S23", os: "Android", version: "13", state: "Busy" },
  { id: "dev-008", name: "iPhone 15", os: "iOS", version: "17.2", state: "Idle" },
];

// Trend data
export const trendPoints = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  pass: [6, 7, 5, 8, 9, 7, 6],
  fail: [2, 1, 3, 1, 1, 2, 1],
  flaky: [1, 1, 2, 1, 1, 1, 1]
};

// Flaky breakdown by device
export const flakyByDevice = [
  { device: "iPhone 14", percent: 34 },
  { device: "Samsung S24", percent: 28 },
  { device: "Pixel 8 Pro", percent: 22 },
  { device: "iPad Pro", percent: 16 },
];