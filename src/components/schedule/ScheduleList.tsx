"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Schedule {
  id: string;
  name: string;
  cadence: string;
  devices: string[];
  nextRun: string;
  lastRunStatus: "success" | "failed" | "flaky" | "running" | null;
  enabled: boolean;
  testSuite: string;
}

const mockSchedules: Schedule[] = [
  {
    id: "1",
    name: "Daily Regression Suite",
    cadence: "Daily at 09:00 UTC",
    devices: ["iPhone 14 Pro", "Samsung Galaxy S23"],
    nextRun: "2024-01-15 09:00",
    lastRunStatus: "success",
    enabled: true,
    testSuite: "Full Regression",
  },
  {
    id: "2",
    name: "Smoke Tests - Hourly",
    cadence: "Every hour",
    devices: ["All iOS Devices"],
    nextRun: "2024-01-14 16:00",
    lastRunStatus: "running",
    enabled: true,
    testSuite: "Smoke Tests",
  },
  {
    id: "3",
    name: "Weekly Performance Check",
    cadence: "Every Monday at 03:00 UTC",
    devices: ["Pixel 7 Pro", "iPhone 15"],
    nextRun: "2024-01-22 03:00",
    lastRunStatus: "flaky",
    enabled: true,
    testSuite: "Performance Suite",
  },
  {
    id: "4",
    name: "Release Branch Tests",
    cadence: "On demand",
    devices: ["All Android Devices"],
    nextRun: "-",
    lastRunStatus: "failed",
    enabled: false,
    testSuite: "Release Tests",
  },
  {
    id: "5",
    name: "Nightly Build Validation",
    cadence: "Daily at 02:00 UTC",
    devices: ["iPhone 13", "Galaxy S22"],
    nextRun: "2024-01-15 02:00",
    lastRunStatus: "success",
    enabled: true,
    testSuite: "Build Validation",
  },
];

export function ScheduleList() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const getStatusIcon = (status: Schedule["lastRunStatus"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-[var(--brand-danger)]" />;
      case "flaky":
        return <AlertCircle className="h-4 w-4 text-[var(--brand-warn)]" />;
      case "running":
        return (
          <div className="h-4 w-4 rounded-full border-2 border-[var(--brand-primary-500)] border-t-transparent animate-spin" />
        );
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Schedule["lastRunStatus"]) => {
    const statusStyles = {
      success: "bg-green-50 text-green-700 border-green-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      flaky: "bg-yellow-50 text-yellow-700 border-yellow-200",
      running: "bg-blue-50 text-blue-700 border-blue-200",
    };

    if (!status) return null;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-[var(--r-chip)] text-xs font-medium border ${
          statusStyles[status]
        }`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 border-[var(--border-subtle)]"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Schedule
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Cadence
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Devices
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Next Run
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Last Run
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredSchedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <Link
                        href={`/schedule/${schedule.id}`}
                        className="text-sm font-medium text-[var(--brand-ink)] hover:text-[var(--brand-primary-500)] transition-colors"
                      >
                        {schedule.name}
                      </Link>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {schedule.testSuite}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                      <span className="text-sm text-zinc-800">
                        {schedule.cadence}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {schedule.devices.slice(0, 2).map((device, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] text-xs"
                        >
                          {device}
                        </span>
                      ))}
                      {schedule.devices.length > 2 && (
                        <span className="inline-block px-2 py-1 bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] text-xs">
                          +{schedule.devices.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-800">
                      {schedule.nextRun}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(schedule.lastRunStatus)}
                  </td>
                  <td className="py-4 px-4">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                      className="data-[state=checked]:bg-gradient-to-tr data-[state=checked]:from-[var(--brand-primary-500)] data-[state=checked]:to-[var(--brand-primary-600)]"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[var(--brand-danger)]">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Active Schedules
            </span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            {schedules.filter((s) => s.enabled).length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Running automatically
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Next Run
            </span>
            <Clock className="h-4 w-4 text-[var(--brand-primary-500)]" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            15m
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Smoke Tests - Hourly
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Success Rate
            </span>
            <AlertCircle className="h-4 w-4 text-[var(--brand-warn)]" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            87%
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Last 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}