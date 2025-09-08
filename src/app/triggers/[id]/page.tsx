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
  Copy,
  MoreHorizontal,
  Download,
  ExternalLink,
  Zap,
  GitBranch,
  Webhook,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/app/dashboard-layout";

type TriggerType = 'ci_push' | 'ci_pipeline' | 'webhook' | 'after_run' | 'manual';

interface FireHistory {
  id: string;
  firedAt: string;
  status: "success" | "failed" | "flaky" | "running";
  runId: string;
  triggeredBy: string;
  duration: string;
  testResults?: {
    passed: number;
    failed: number;
    total: number;
  };
}

const mockTrigger = {
  id: "1",
  name: "Main Branch Push Trigger",
  type: "ci_push" as TriggerType,
  enabled: true,
  description: "Automatically run full regression tests when code is pushed to the main branch",
  
  conditions: {
    provider: "github",
    repo: "myorg/myapp",
    branchPattern: "main",
    event: "push",
  },
  
  testSuite: "Full Regression Suite",
  devices: ["All iOS Devices", "All Android Devices"],
  
  execution: {
    timeout: 30,
    retries: 2,
    overlapPolicy: "skip_new",
    priority: "normal",
    maxConcurrency: 5,
  },
  
  notifications: {
    slack: true,
    email: false,
    webhook: true,
    on: ["success", "fail", "flaky"],
  },
  
  webhookUrl: "https://api.testlab.io/webhooks/abc123def456ghi789",
  
  createdAt: "2024-01-01T10:00:00Z",
  createdBy: "john@testlab.io",
  lastFiredAt: "2024-01-15T14:30:00Z",
};

const mockFireHistory: FireHistory[] = [
  {
    id: "fire-1",
    firedAt: "2024-01-15T14:30:00Z",
    status: "success",
    runId: "run-12345",
    triggeredBy: "github push",
    duration: "12m 34s",
    testResults: { passed: 245, failed: 0, total: 245 },
  },
  {
    id: "fire-2", 
    firedAt: "2024-01-15T10:45:00Z",
    status: "flaky",
    runId: "run-12344",
    triggeredBy: "github push",
    duration: "14m 22s",
    testResults: { passed: 242, failed: 3, total: 245 },
  },
  {
    id: "fire-3",
    firedAt: "2024-01-14T16:20:00Z", 
    status: "failed",
    runId: "run-12343",
    triggeredBy: "github push",
    duration: "8m 15s",
    testResults: { passed: 200, failed: 45, total: 245 },
  },
  {
    id: "fire-4",
    firedAt: "2024-01-14T11:10:00Z",
    status: "success", 
    runId: "run-12342",
    triggeredBy: "github push",
    duration: "11m 48s",
    testResults: { passed: 245, failed: 0, total: 245 },
  },
];

export default function TriggerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trigger, setTrigger] = useState(mockTrigger);
  const [showJson, setShowJson] = useState(false);

  const toggleTrigger = () => {
    setTrigger({ ...trigger, enabled: !trigger.enabled });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this trigger?")) {
      router.push("/triggers");
    }
  };

  const getTypeIcon = (type: TriggerType) => {
    switch (type) {
      case "ci_push":
        return <GitBranch className="h-4 w-4 text-blue-500" />;
      case "ci_pipeline":
        return <Zap className="h-4 w-4 text-purple-500" />;
      case "webhook":
        return <Webhook className="h-4 w-4 text-green-500" />;
      case "after_run":
        return <LinkIcon className="h-4 w-4 text-orange-500" />;
      case "manual":
        return <Play className="h-4 w-4 text-gray-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: TriggerType) => {
    const labels = {
      ci_push: "CI Push",
      ci_pipeline: "CI Pipeline", 
      webhook: "Webhook",
      after_run: "After Run",
      manual: "Manual",
    };
    return labels[type];
  };

  const getStatusIcon = (status: FireHistory["status"]) => {
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

  const getStatusBadge = (status: FireHistory["status"]) => {
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

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(trigger.webhookUrl);
  };

  const triggerDefinition = {
    id: trigger.id,
    name: trigger.name,
    type: trigger.type,
    enabled: trigger.enabled,
    conditions: trigger.conditions,
    testSuite: trigger.testSuite,
    devices: trigger.devices,
    execution: trigger.execution,
    notifications: trigger.notifications,
    webhookUrl: trigger.type === "webhook" ? trigger.webhookUrl : undefined,
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <Link href="/triggers">
          <Button variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Triggers
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getTypeIcon(trigger.type)}
                  <div>
                    <h1 className="text-2xl font-semibold text-[var(--brand-ink)]">
                      {trigger.name}
                    </h1>
                    <p className="text-sm text-zinc-600 mt-1">
                      {trigger.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={toggleTrigger}
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
                      <DropdownMenuItem className="text-[var(--brand-danger)]" onClick={handleDelete}>
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
                    Type
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    {getTypeLabel(trigger.type)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Test Suite
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    {trigger.testSuite}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Last Fired
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    2024-01-15 14:30 UTC
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Created By
                  </span>
                  <p className="text-sm font-medium text-[var(--brand-ink)] mt-1">
                    {trigger.createdBy}
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  Condition
                </span>
                <div className="mt-2 p-3 bg-zinc-50 rounded-[var(--r-ctl)]">
                  <code className="text-sm text-zinc-800">
                    {trigger.conditions.provider}/{trigger.conditions.repo} • 
                    branch: {trigger.conditions.branchPattern} • 
                    event: {trigger.conditions.event}
                  </code>
                </div>
              </div>
            </div>

            {trigger.type === "webhook" && (
              <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
                <h2 className="text-base font-semibold text-[var(--brand-ink)] mb-4">
                  Webhook URL
                </h2>
                <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-[var(--r-ctl)]">
                  <code className="flex-1 text-sm text-zinc-800 break-all">
                    {trigger.webhookUrl}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyWebhookUrl}
                    className="h-8 w-8 p-0"
                    title="Copy webhook URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Use this URL to send webhook calls from external systems. The URL includes authentication.
                </p>
              </div>
            )}

            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[var(--brand-ink)]">
                  Fire History
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
                        Fired At
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Run
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Duration
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Results
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Triggered By
                      </th>
                      <th className="text-right py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {mockFireHistory.map((fire) => (
                      <tr key={fire.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-sm text-zinc-800">
                            {new Date(fire.firedAt).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(fire.status)}</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/test-runs/${fire.runId}`}
                            className="text-sm font-medium text-[var(--brand-primary-500)] hover:text-[var(--brand-primary-600)]"
                          >
                            {fire.runId}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-zinc-800">{fire.duration}</span>
                        </td>
                        <td className="py-3 px-4">
                          {fire.testResults && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {fire.testResults.passed}
                              </span>
                              {fire.testResults.failed > 0 && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                  {fire.testResults.failed}
                                </span>
                              )}
                              <span className="text-xs text-[var(--text-muted)]">
                                / {fire.testResults.total}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-zinc-600">{fire.triggeredBy}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/test-runs/${fire.runId}`}>
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
                Execution Settings
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Timeout
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {trigger.execution.timeout} minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Retries
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    Up to {trigger.execution.retries}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Overlap Policy
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1 capitalize">
                    {trigger.execution.overlapPolicy.replace('_', ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Priority
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1 capitalize">
                    {trigger.execution.priority}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Max Concurrency
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {trigger.execution.maxConcurrency} devices
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
              <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">
                Target Devices
              </h3>
              <div className="space-y-2">
                {trigger.devices.map((device, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] text-sm mr-2 mb-2"
                  >
                    {device}
                  </span>
                ))}
              </div>
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
                      trigger.notifications.slack ? "bg-green-500" : "bg-zinc-300"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Email</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      trigger.notifications.email ? "bg-green-500" : "bg-zinc-300"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Webhook</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      trigger.notifications.webhook ? "bg-green-500" : "bg-zinc-300"
                    }`}
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  Notify On
                </span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {trigger.notifications.on.map((event) => (
                    <span
                      key={event}
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-[var(--r-chip)] text-xs"
                    >
                      {event}
                    </span>
                  ))}
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
                    {JSON.stringify(triggerDefinition, null, 2)}
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
                    Created At
                  </dt>
                  <dd className="text-sm font-medium text-zinc-800 mt-1">
                    {new Date(trigger.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Trigger ID
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
    </DashboardLayout>
  );
}