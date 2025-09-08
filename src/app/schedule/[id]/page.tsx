"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Play,
  Pause,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Smartphone,
  Copy,
  MoreHorizontal,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RunHistory {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "success" | "failed" | "flaky" | "running";
  triggeredBy: string;
  devices: number;
  passRate: number;
}

const mockSchedule = {
  id: "1",
  name: "Daily Regression Suite",
  description: "Comprehensive regression testing for all critical user flows",
  testSuite: "Full Regression",
  cadence: "Daily at 09:00 UTC",
  timezone: "UTC",
  devices: ["iPhone 14 Pro", "Samsung Galaxy S23", "iPad Pro", "Pixel 7"],
  nextRun: "2024-01-15 09:00",
  lastRun: "2024-01-14 09:00",
  enabled: true,
  createdAt: "2024-01-01",
  createdBy: "John Doe",
  maxConcurrency: 5,
  timeout: 30,
  retryPolicy: 2,
  overlapHandling: "skip",
  notifications: {
    slack: true,
    email: false,
    webhook: true,
  },
  retentionDays: 30,
};

const mockHistory: RunHistory[] = [
  {
    id: "run-1",
    startTime: "2024-01-14 09:00",
    endTime: "2024-01-14 09:45",
    duration: "45m",
    status: "success",
    triggeredBy: "Schedule",
    devices: 4,
    passRate: 98,
  },
  {
    id: "run-2",
    startTime: "2024-01-13 09:00",
    endTime: "2024-01-13 09:42",
    duration: "42m",
    status: "flaky",
    triggeredBy: "Schedule",
    devices: 4,
    passRate: 92,
  },
  {
    id: "run-3",
    startTime: "2024-01-12 09:00",
    endTime: "2024-01-12 09:48",
    duration: "48m",
    status: "success",
    triggeredBy: "Schedule",
    devices: 4,
    passRate: 100,
  },
  {
    id: "run-4",
    startTime: "2024-01-11 09:00",
    endTime: "2024-01-11 09:38",
    duration: "38m",
    status: "failed",
    triggeredBy: "Schedule",
    devices: 3,
    passRate: 75,
  },
  {
    id: "run-5",
    startTime: "2024-01-10 09:00",
    endTime: "2024-01-10 09:44",
    duration: "44m",
    status: "success",
    triggeredBy: "Manual",
    devices: 4,
    passRate: 96,
  },
];

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState(mockSchedule);
  const [showJson, setShowJson] = useState(false);

  const toggleSchedule = () => {
    setSchedule({ ...schedule, enabled: !schedule.enabled });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      router.push("/schedule");
    }
  };

  const getStatusIcon = (status: RunHistory["status"]) => {
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
    }
  };

  const getStatusBadge = (status: RunHistory["status"]) => {
    const statusStyles = {
      success: "bg-green-50 text-green-700 border-green-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      flaky: "bg-yellow-50 text-yellow-700 border-yellow-200",
      running: "bg-blue-50 text-blue-700 border-blue-200",
    };

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

  const scheduleConfig = {
    name: schedule.name,
    testSuite: schedule.testSuite,
    cadence: schedule.cadence,
    timezone: schedule.timezone,
    devices: schedule.devices,
    constraints: {
      maxConcurrency: schedule.maxConcurrency,
      timeout: schedule.timeout,
      retryPolicy: schedule.retryPolicy,
      overlapHandling: schedule.overlapHandling,
    },
    notifications: schedule.notifications,
    artifacts: {
      retentionDays: schedule.retentionDays,
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="p-6">
        <Link href="/schedule">
          <Button variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedules
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-[var(--brand-ink)]">
                    {schedule.name}
                  </h1>
                  <p className="text-sm text-zinc-600 mt-1">
                    {schedule.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={toggleSchedule}
                    className="data-[state=checked]:bg-gradient-to-tr data-[state=checked]:from-[var(--brand-primary-500)] data-[state=checked]:to-[var(--brand-primary-600)]"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
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
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[var(--brand-danger)]"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Test Suite
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    {schedule.testSuite}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Schedule
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                    <p className="text-sm font-medium text-[var(--brand-ink)]">
                      {schedule.cadence}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Next Run
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    {schedule.nextRun}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Last Run
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    {schedule.lastRun}
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  Devices
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {schedule.devices.map((device, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-3 py-1 bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] text-sm"
                    >
                      <Smartphone className="h-3 w-3 inline mr-1" />
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[var(--brand-ink)]">
                  Run History
                </h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Run ID
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Start Time
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Duration
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Pass Rate
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Trigger
                      </th>
                      <th className="text-right py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {mockHistory.map((run) => (
                      <tr key={run.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            href={`/test-runs/${run.id}`}
                            className="text-sm font-medium text-[var(--brand-primary-500)] hover:text-[var(--brand-primary-600)]"
                          >
                            {run.id}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-zinc-800">{run.startTime}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-zinc-800">{run.duration}</span>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(run.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-zinc-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  run.passRate >= 95
                                    ? "bg-green-500"
                                    : run.passRate >= 80
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${run.passRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-zinc-800 tabular-nums">
                              {run.passRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-zinc-600">{run.triggeredBy}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/test-runs/${run.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">
                Configuration
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Max Concurrency
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {schedule.maxConcurrency} parallel runs
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Timeout
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {schedule.timeout} minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Retry Policy
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    Up to {schedule.retryPolicy} retries
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Overlap Handling
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1 capitalize">
                    {schedule.overlapHandling}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Artifact Retention
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {schedule.retentionDays} days
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Slack</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      schedule.notifications.slack
                        ? "bg-green-500"
                        : "bg-zinc-300"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Email</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      schedule.notifications.email
                        ? "bg-green-500"
                        : "bg-zinc-300"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Webhook</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      schedule.notifications.webhook
                        ? "bg-green-500"
                        : "bg-zinc-300"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[var(--brand-ink)]">
                  Definition
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJson(!showJson)}
                >
                  {showJson ? "Hide" : "Show"} JSON
                </Button>
              </div>
              {showJson && (
                <div className="bg-zinc-900 rounded-[var(--r-ctl)] p-3 text-zinc-100">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(scheduleConfig, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">
                Metadata
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Created By
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {schedule.createdBy}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Created At
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {schedule.createdAt}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Schedule ID
                  </dt>
                  <dd className="text-sm font-mono text-zinc-600 mt-1">
                    {params.id}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}