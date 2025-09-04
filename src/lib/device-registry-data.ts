// Device Registry Types
export type DeviceStatus = "Idle" | "Busy" | "Offline" | "Reserved";
export type DeviceType = "Real" | "Emulator";
export type DevicePlatform = "iOS" | "Android";

export interface DeviceMetadata {
  network: string;
  osBuild: string;
  location?: string;
  battery?: number;
  storage?: string;
  cpu?: string;
  ram?: string;
}

export interface DeviceUsageHistory {
  runId: string;
  timestamp: string;
  duration: number;
  result: "Pass" | "Fail" | "Aborted";
  testSuite: string;
}

export interface DeviceRegistry {
  id: string;
  udid: string;
  name: string;
  platform: DevicePlatform;
  osVersion: string;
  status: DeviceStatus;
  type: DeviceType;
  lastSeen: string;
  metadata: DeviceMetadata;
  usageHistory: DeviceUsageHistory[];
  screenshotUrl?: string;
}

// Mock Device Data
export const deviceRegistryData: DeviceRegistry[] = [
  {
    id: "dev-001",
    udid: "00008110-001234567890ABCD",
    name: "iPhone 15 Pro",
    platform: "iOS",
    osVersion: "17.2",
    status: "Idle",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 5GHz",
      osBuild: "21C62",
      location: "Lab Rack A-1",
      battery: 95,
      storage: "45GB/256GB",
      cpu: "A17 Pro",
      ram: "8GB"
    },
    usageHistory: [
      { runId: "run-892", timestamp: "2024-01-15T14:30:00Z", duration: 285, result: "Pass", testSuite: "Login Flow" },
      { runId: "run-856", timestamp: "2024-01-15T10:15:00Z", duration: 412, result: "Pass", testSuite: "Payment Tests" },
    ],
    screenshotUrl: "/api/screenshot/device1"
  },
  {
    id: "dev-002",
    udid: "emulator-28282",
    name: "iPhone 14 Simulator",
    platform: "iOS",
    osVersion: "16.4",
    status: "Busy",
    type: "Emulator",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "Host Network",
      osBuild: "20E247",
      cpu: "Apple M2",
      ram: "4GB Allocated"
    },
    usageHistory: [
      { runId: "run-901", timestamp: "2024-01-15T15:00:00Z", duration: 180, result: "Pass", testSuite: "Smoke Tests" },
    ],
  },
  {
    id: "dev-003",
    udid: "3a4d5e6f7890",
    name: "Pixel 8 Pro",
    platform: "Android",
    osVersion: "14",
    status: "Idle",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 5GHz",
      osBuild: "AP1A.240405.002",
      location: "Lab Rack B-2",
      battery: 78,
      storage: "89GB/128GB",
      cpu: "Tensor G3",
      ram: "12GB"
    },
    usageHistory: [
      { runId: "run-878", timestamp: "2024-01-15T13:45:00Z", duration: 523, result: "Fail", testSuite: "Performance Tests" },
      { runId: "run-845", timestamp: "2024-01-15T09:30:00Z", duration: 367, result: "Pass", testSuite: "API Integration" },
    ],
  },
  {
    id: "dev-004",
    udid: "9b8c7d6e5f4a",
    name: "Samsung Galaxy S24",
    platform: "Android",
    osVersion: "14",
    status: "Reserved",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 6",
      osBuild: "UP1A.231005.007",
      location: "Lab Rack B-3",
      battery: 62,
      storage: "102GB/256GB",
      cpu: "Snapdragon 8 Gen 3",
      ram: "8GB"
    },
    usageHistory: [
      { runId: "run-899", timestamp: "2024-01-15T14:00:00Z", duration: 445, result: "Pass", testSuite: "UI Tests" },
    ],
  },
  {
    id: "dev-005",
    udid: "00008120-001456789012EFGH",
    name: "iPad Pro 12.9",
    platform: "iOS",
    osVersion: "17.2",
    status: "Idle",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 6E",
      osBuild: "21C62",
      location: "Lab Rack A-2",
      battery: 100,
      storage: "234GB/512GB",
      cpu: "M2",
      ram: "16GB"
    },
    usageHistory: [
      { runId: "run-812", timestamp: "2024-01-14T16:20:00Z", duration: 612, result: "Pass", testSuite: "Tablet Layout" },
    ],
  },
  {
    id: "dev-006",
    udid: "emulator-pixel-7",
    name: "Pixel 7 Emulator",
    platform: "Android",
    osVersion: "13",
    status: "Offline",
    type: "Emulator",
    lastSeen: "2024-01-15T08:00:00Z",
    metadata: {
      network: "Host Network",
      osBuild: "TP1A.221005.002",
      cpu: "x86_64",
      ram: "2GB Allocated"
    },
    usageHistory: [],
  },
  {
    id: "dev-007",
    udid: "4c5d6e7f8901",
    name: "OnePlus 11",
    platform: "Android",
    osVersion: "13",
    status: "Busy",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 6",
      osBuild: "CPH2451_13.1.0.581",
      location: "Lab Rack C-1",
      battery: 45,
      storage: "78GB/256GB",
      cpu: "Snapdragon 8 Gen 2",
      ram: "16GB"
    },
    usageHistory: [
      { runId: "run-903", timestamp: "2024-01-15T15:30:00Z", duration: 298, result: "Pass", testSuite: "Regression Suite" },
    ],
  },
  {
    id: "dev-008",
    udid: "00008130-001678901234IJKL",
    name: "iPhone 13 mini",
    platform: "iOS",
    osVersion: "16.7",
    status: "Idle",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 5GHz",
      osBuild: "20H19",
      location: "Lab Rack A-3",
      battery: 88,
      storage: "67GB/128GB",
      cpu: "A15 Bionic",
      ram: "4GB"
    },
    usageHistory: [
      { runId: "run-756", timestamp: "2024-01-14T11:30:00Z", duration: 189, result: "Pass", testSuite: "Quick Tests" },
      { runId: "run-723", timestamp: "2024-01-13T15:45:00Z", duration: 456, result: "Aborted", testSuite: "Full Suite" },
    ],
  },
  {
    id: "dev-009",
    udid: "emulator-iphone-se",
    name: "iPhone SE Simulator",
    platform: "iOS",
    osVersion: "17.0",
    status: "Idle",
    type: "Emulator",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "Host Network",
      osBuild: "21A329",
      cpu: "Apple M1",
      ram: "2GB Allocated"
    },
    usageHistory: [
      { runId: "run-678", timestamp: "2024-01-13T09:00:00Z", duration: 234, result: "Pass", testSuite: "Compact Layout" },
    ],
  },
  {
    id: "dev-010",
    udid: "5d6e7f890123",
    name: "Google Pixel Tablet",
    platform: "Android",
    osVersion: "14",
    status: "Reserved",
    type: "Real",
    lastSeen: new Date().toISOString(),
    metadata: {
      network: "WiFi 6",
      osBuild: "UP1A.231105.003",
      location: "Lab Rack C-2",
      battery: 100,
      storage: "45GB/128GB",
      cpu: "Tensor G2",
      ram: "8GB"
    },
    usageHistory: [
      { runId: "run-902", timestamp: "2024-01-15T15:15:00Z", duration: 378, result: "Pass", testSuite: "Tablet Tests" },
    ],
  },
];

// Helper function to get device by ID
export function getDeviceById(id: string): DeviceRegistry | undefined {
  return deviceRegistryData.find(device => device.id === id);
}

// Helper function to filter devices
export function filterDevices(
  devices: DeviceRegistry[],
  filters: {
    search?: string;
    platform?: DevicePlatform | "all";
    status?: DeviceStatus | "all";
    type?: DeviceType | "all";
  }
): DeviceRegistry[] {
  let filtered = [...devices];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(device => 
      device.name.toLowerCase().includes(searchLower) ||
      device.udid.toLowerCase().includes(searchLower)
    );
  }

  if (filters.platform && filters.platform !== "all") {
    filtered = filtered.filter(device => device.platform === filters.platform);
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(device => device.status === filters.status);
  }

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter(device => device.type === filters.type);
  }

  return filtered;
}