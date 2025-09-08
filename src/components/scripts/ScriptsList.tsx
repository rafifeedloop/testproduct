"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Code,
  Copy,
  Trash2,
  MoreHorizontal,
  Filter,
  Search,
  FileText,
  Clock,
  Shield,
  Terminal,
  GitBranch,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Activity,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GeneratedScript {
  id: string;
  name: string;
  ciTypes: Array<"github" | "gitlab" | "jenkins" | "circleci" | "generic">;
  language: "shell" | "node" | "powershell";
  runConfigId: string;
  runConfigName: string;
  deviceSelector: {
    mode: "group" | "explicit";
    summary: string;
    maxConcurrency: number;
  };
  streaming: {
    mode: "sse" | "websocket" | "polling";
    waitForResult: boolean;
  };
  execution: {
    runTimeoutSec: number;
    retries: number;
    priority: "low" | "normal" | "high";
  };
  createdBy: string;
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
}

const mockScripts: GeneratedScript[] = [
  {
    id: "1",
    name: "Production Smoke Tests",
    ciTypes: ["github", "gitlab"],
    language: "shell",
    runConfigId: "config_1",
    runConfigName: "Smoke Test Suite",
    deviceSelector: {
      mode: "group",
      summary: "iOS 16+ and Android 13+",
      maxConcurrency: 5,
    },
    streaming: {
      mode: "sse",
      waitForResult: true,
    },
    execution: {
      runTimeoutSec: 1800,
      retries: 2,
      priority: "high",
    },
    createdBy: "john@testlab.io",
    createdAt: "2024-01-10 09:00",
    lastUsedAt: "2024-01-15 14:30",
    usageCount: 42,
  },
  {
    id: "2",
    name: "PR Validation Tests",
    ciTypes: ["github"],
    language: "node",
    runConfigId: "config_2",
    runConfigName: "Full Regression Suite",
    deviceSelector: {
      mode: "explicit",
      summary: "iPhone 14 Pro, Galaxy S23",
      maxConcurrency: 2,
    },
    streaming: {
      mode: "websocket",
      waitForResult: true,
    },
    execution: {
      runTimeoutSec: 3600,
      retries: 1,
      priority: "normal",
    },
    createdBy: "sarah@testlab.io",
    createdAt: "2024-01-08 16:30",
    lastUsedAt: "2024-01-15 12:15",
    usageCount: 28,
  },
  {
    id: "3",
    name: "Nightly Performance Tests",
    ciTypes: ["jenkins", "circleci"],
    language: "shell",
    runConfigId: "config_3",
    runConfigName: "Performance Test Suite",
    deviceSelector: {
      mode: "group",
      summary: "All flagship devices",
      maxConcurrency: 10,
    },
    streaming: {
      mode: "polling",
      waitForResult: false,
    },
    execution: {
      runTimeoutSec: 7200,
      retries: 0,
      priority: "low",
    },
    createdBy: "mike@testlab.io",
    createdAt: "2024-01-05 11:20",
    lastUsedAt: "2024-01-14 22:00",
    usageCount: 15,
  },
  {
    id: "4",
    name: "Release Validation",
    ciTypes: ["gitlab", "generic"],
    language: "powershell",
    runConfigId: "config_4",
    runConfigName: "Release Checklist",
    deviceSelector: {
      mode: "group",
      summary: "Critical path devices",
      maxConcurrency: 3,
    },
    streaming: {
      mode: "sse",
      waitForResult: true,
    },
    execution: {
      runTimeoutSec: 2400,
      retries: 3,
      priority: "high",
    },
    createdBy: "admin@testlab.io",
    createdAt: "2024-01-12 14:15",
    lastUsedAt: undefined,
    usageCount: 0,
  },
];

export function ScriptsList() {
  const [scripts] = useState(mockScripts);
  const [searchQuery, setSearchQuery] = useState("");

  const getCIBadges = (ciTypes: GeneratedScript["ciTypes"]) => {
    const ciColors = {
      github: "bg-gray-900 text-white",
      gitlab: "bg-orange-500 text-white",
      jenkins: "bg-red-600 text-white",
      circleci: "bg-green-600 text-white",
      generic: "bg-zinc-600 text-white",
    };

    const ciLabels = {
      github: "GitHub",
      gitlab: "GitLab",
      jenkins: "Jenkins",
      circleci: "CircleCI",
      generic: "Generic",
    };

    return ciTypes.map((ci) => (
      <span
        key={ci}
        className={`inline-block px-2 py-1 rounded-[var(--r-chip)] text-xs font-medium ${ciColors[ci]}`}
      >
        {ciLabels[ci]}
      </span>
    ));
  };

  const getLanguageIcon = (language: GeneratedScript["language"]) => {
    switch (language) {
      case "shell":
        return <Terminal className="h-4 w-4 text-blue-500" />;
      case "node":
        return <Code className="h-4 w-4 text-green-500" />;
      case "powershell":
        return <Terminal className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStreamingBadge = (mode: GeneratedScript["streaming"]["mode"]) => {
    const streamingStyles = {
      sse: "bg-blue-50 text-blue-700 border-blue-200",
      websocket: "bg-green-50 text-green-700 border-green-200",
      polling: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };

    const streamingLabels = {
      sse: "SSE",
      websocket: "WebSocket",
      polling: "Polling",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-[var(--r-chip)] text-xs font-medium border ${
          streamingStyles[mode]
        }`}
      >
        {streamingLabels[mode]}
      </span>
    );
  };

  const getPriorityBadge = (priority: GeneratedScript["execution"]["priority"]) => {
    const priorityStyles = {
      high: "text-red-600",
      normal: "text-blue-600",
      low: "text-gray-600",
    };

    return (
      <span className={`text-xs font-medium ${priorityStyles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
      </span>
    );
  };

  const filteredScripts = scripts.filter((script) =>
    script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.runConfigName.toLowerCase().includes(searchQuery.toLowerCase())
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
                placeholder="Search scripts..."
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
                  Script
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  CI Types
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Test Suite
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Devices
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Streaming
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Last Used
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredScripts.map((script) => (
                <tr
                  key={script.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <Link
                        href={`/scripts/${script.id}`}
                        className="text-sm font-medium text-[var(--brand-ink)] hover:text-[var(--brand-primary-500)] transition-colors flex items-center gap-2"
                      >
                        {getLanguageIcon(script.language)}
                        {script.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[var(--text-muted)]">
                          by {script.createdBy}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {script.usageCount} runs
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {getCIBadges(script.ciTypes)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-sm text-zinc-800">
                        {script.runConfigName}
                      </span>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {getPriorityBadge(script.execution.priority)}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-sm text-zinc-700">
                        {script.deviceSelector.summary}
                      </span>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Max {script.deviceSelector.maxConcurrency} concurrent
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {getStreamingBadge(script.streaming.mode)}
                      <p className="text-xs text-[var(--text-muted)]">
                        {script.streaming.waitForResult ? "Blocking" : "Non-blocking"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-sm text-zinc-600">
                        {script.lastUsedAt || "Never"}
                      </span>
                      {script.execution.retries > 0 && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {script.execution.retries} retries
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View Script"
                      >
                        <Eye className="h-4 w-4" />
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
                            <Eye className="h-4 w-4 mr-2" />
                            View Script
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Script
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download ZIP
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Rotate Token
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
              Total Scripts
            </span>
            <Code className="h-4 w-4 text-[var(--brand-primary-500)]" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            {scripts.length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Generated scripts
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Total Runs
            </span>
            <Activity className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            {scripts.reduce((acc, s) => acc + s.usageCount, 0)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Script executions
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
              Active Today
            </span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
            {scripts.filter((s) => s.lastUsedAt).length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Recently used scripts
          </p>
        </div>
      </div>
    </div>
  );
}