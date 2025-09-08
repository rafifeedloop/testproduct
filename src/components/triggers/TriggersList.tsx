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
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  GitBranch,
  Webhook,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TriggerType = 'ci_push' | 'ci_pipeline' | 'webhook' | 'after_run' | 'manual';

interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  enabled: boolean;
  condition: string;
  testSuite: string;
  devices: string[];
  lastFiredAt?: string;
  lastFiredStatus: "success" | "failed" | "flaky" | null;
  createdBy: string;
}

const mockTriggers: Trigger[] = [
  {
    id: "1",
    name: "Main Branch Push",
    type: "ci_push",
    enabled: true,
    condition: "github/repo • branch: main • event: push",
    testSuite: "Full Regression",
    devices: ["All iOS Devices", "All Android Devices"],
    lastFiredAt: "2024-01-15 14:30",
    lastFiredStatus: "success",
    createdBy: "john@testlab.io",
  },
  {
    id: "2",
    name: "Release Pipeline Success",
    type: "ci_pipeline",
    enabled: true,
    condition: "gitlab/release • status: success",
    testSuite: "Release Validation",
    devices: ["iPhone 14 Pro", "Samsung Galaxy S23"],
    lastFiredAt: "2024-01-15 12:15",
    lastFiredStatus: "failed",
    createdBy: "sarah@testlab.io",
  },
  {
    id: "3",
    name: "Deploy Webhook",
    type: "webhook",
    enabled: true,
    condition: "$.environment == 'production'",
    testSuite: "Smoke Tests",
    devices: ["Critical Path Devices"],
    lastFiredAt: "2024-01-15 10:45",
    lastFiredStatus: "success",
    createdBy: "mike@testlab.io",
  },
  {
    id: "4",
    name: "After Smoke Tests",
    type: "after_run",
    enabled: false,
    condition: "Run after 'Smoke Tests' • status: success",
    testSuite: "Performance Tests",
    devices: ["Performance Test Devices"],
    lastFiredAt: "2024-01-14 16:20",
    lastFiredStatus: "flaky",
    createdBy: "jane@testlab.io",
  },
  {
    id: "5",
    name: "Manual QA Trigger",
    type: "manual",
    enabled: true,
    condition: "Manual execution only",
    testSuite: "QA Validation",
    devices: ["QA Test Devices"],
    lastFiredAt: null,
    lastFiredStatus: null,
    createdBy: "admin@testlab.io",
  },
];

export function TriggersList() {
  const [triggers, setTriggers] = useState(mockTriggers);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTrigger = (id: string) => {
    setTriggers((prev) =>
      prev.map((trigger) =>
        trigger.id === id
          ? { ...trigger, enabled: !trigger.enabled }
          : trigger
      )
    );
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
    switch (type) {
      case "ci_push":
        return "CI Push";
      case "ci_pipeline":
        return "CI Pipeline";
      case "webhook":
        return "Webhook";
      case "after_run":
        return "After Run";
      case "manual":
        return "Manual";
      default:
        return type;
    }
  };

  const getStatusIcon = (status: Trigger["lastFiredStatus"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-[var(--brand-danger)]" />;
      case "flaky":
        return <AlertCircle className="h-4 w-4 text-[var(--brand-warn)]" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Trigger["lastFiredStatus"]) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[var(--r-chip)] text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
          Never fired
        </span>
      );
    }

    const statusStyles = {
      success: "bg-green-50 text-green-700 border-green-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      flaky: "bg-yellow-50 text-yellow-700 border-yellow-200",
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

  const filteredTriggers = triggers.filter((trigger) =>
    trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trigger.condition.toLowerCase().includes(searchQuery.toLowerCase())
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
                placeholder="Search triggers..."
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
                  Trigger
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Condition
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Test Suite
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Devices
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Last Fired
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
              {filteredTriggers.map((trigger) => (
                <tr
                  key={trigger.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <Link
                        href={`/triggers/${trigger.id}`}
                        className="text-sm font-medium text-[var(--brand-ink)] hover:text-[var(--brand-primary-500)] transition-colors"
                      >
                        {trigger.name}
                      </Link>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        by {trigger.createdBy}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(trigger.type)}
                      <span className="text-sm text-zinc-800">
                        {getTypeLabel(trigger.type)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-600 max-w-xs truncate block">
                      {trigger.condition}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-800">
                      {trigger.testSuite}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {trigger.devices.slice(0, 2).map((device, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] text-xs"
                        >
                          {device}
                        </span>
                      ))}
                      {trigger.devices.length > 2 && (
                        <span className="inline-block px-2 py-1 bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] text-xs">
                          +{trigger.devices.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-600">
                      {trigger.lastFiredAt || "Never"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(trigger.lastFiredStatus)}
                      <Switch
                        checked={trigger.enabled}
                        onCheckedChange={() => toggleTrigger(trigger.id)}
                        className="data-[state=checked]:bg-gradient-to-tr data-[state=checked]:from-[var(--brand-primary-500)] data-[state=checked]:to-[var(--brand-primary-600)]"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Run Now"
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
                            {trigger.enabled ? "Disable" : "Enable"}
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
              Active Triggers
            </span>
            <Zap className="h-4 w-4 text-[var(--brand-primary-500)]" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            {triggers.filter((t) => t.enabled).length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Ready to fire on events
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Recent Fires
            </span>
            <Clock className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            {triggers.filter((t) => t.lastFiredAt).length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Last 24 hours
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Success Rate
            </span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            75%
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Recent trigger fires
          </p>
        </div>
      </div>
    </div>
  );
}