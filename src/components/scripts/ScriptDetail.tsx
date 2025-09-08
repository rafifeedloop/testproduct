"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Code,
  Copy,
  Download,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  FileText,
  Eye,
  EyeOff,
  Settings,
  Activity,
  RefreshCw,
  Trash2,
  MoreHorizontal,
  GitBranch,
  GitlabIcon,
  CircleDot,
  Boxes,
  Shield,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScriptUsage {
  id: string;
  timestamp: string;
  runId: string;
  status: "success" | "failed" | "running" | "skipped";
  duration?: string;
  triggeredBy: string;
  ciPlatform: string;
  branch?: string;
}

interface ScriptDetailProps {
  id: string;
}

const mockScript = {
  id: "1",
  name: "Production Smoke Tests",
  ciTypes: ["github", "gitlab"] as const,
  language: "shell" as const,
  runConfigId: "config_1",
  runConfigName: "Smoke Test Suite",
  deviceSelector: {
    mode: "group" as const,
    groupQuery: { platform: "ios" as const, osMin: "16.0", osMax: "17.0", tags: ["flagship"] },
    maxConcurrency: 5,
    fallback: "any_matching" as const,
  },
  streaming: {
    mode: "sse" as const,
    waitForResult: true,
    successCodes: ["success", "flaky"],
  },
  execution: {
    runTimeoutSec: 1800,
    retries: 2,
    overlapPolicy: "allow_parallel" as const,
    priority: "high" as const,
  },
  meta: {
    environment: "production",
    team: "mobile",
  },
  createdBy: "john@testlab.io",
  createdAt: "2024-01-10 09:00",
  lastUsedAt: "2024-01-15 14:30",
  usageCount: 42,
};

const mockUsageHistory: ScriptUsage[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30",
    runId: "run_123",
    status: "success",
    duration: "12m 34s",
    triggeredBy: "CI Pipeline",
    ciPlatform: "GitHub Actions",
    branch: "main",
  },
  {
    id: "2",
    timestamp: "2024-01-15 12:15",
    runId: "run_124",
    status: "failed",
    duration: "8m 45s",
    triggeredBy: "Pull Request #42",
    ciPlatform: "GitHub Actions",
    branch: "feature/auth",
  },
  {
    id: "3",
    timestamp: "2024-01-14 22:00",
    runId: "run_125",
    status: "running",
    triggeredBy: "Scheduled",
    ciPlatform: "GitLab CI",
    branch: "develop",
  },
  {
    id: "4",
    timestamp: "2024-01-14 16:20",
    runId: "run_126",
    status: "success",
    duration: "15m 12s",
    triggeredBy: "Manual",
    ciPlatform: "GitHub Actions",
    branch: "release/v2.1",
  },
  {
    id: "5",
    timestamp: "2024-01-13 10:45",
    runId: "run_127",
    status: "skipped",
    duration: "0s",
    triggeredBy: "CI Pipeline",
    ciPlatform: "GitLab CI",
    branch: "main",
  },
];

const bashScript = `#!/bin/bash
# TestLab CI Token - Production Smoke Tests
# Generated on 2024-01-10T09:00:00Z

# Configuration
export TESTLAB_URL="\${TESTLAB_URL:-https://api.testlab.io}"
export TESTLAB_TOKEN="\${TESTLAB_TOKEN}"

# Validate environment
if [ -z "$TESTLAB_TOKEN" ]; then
  echo "Error: TESTLAB_TOKEN environment variable is not set"
  exit 1
fi

# Start test run
echo "Starting test run..."
RUN_ID=$(curl -s -X POST \\
  "$TESTLAB_URL/runs" \\
  -H "Authorization: Bearer $TESTLAB_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "configId": "config_1",
    "devices": {
      "platform": "ios",
      "osMin": "16.0",
      "osMax": "17.0",
      "tags": ["flagship"]
    },
    "maxConcurrency": 5,
    "timeout": 1800,
    "retries": 2,
    "priority": "high",
    "meta": {
      "environment": "production",
      "team": "mobile"
    }
  }' | jq -r '.runId')

echo "Test run started with ID: $RUN_ID"

# Stream results via SSE
echo "Streaming test results..."
curl -N \\
  "$TESTLAB_URL/runs/$RUN_ID/stream" \\
  -H "Authorization: Bearer $TESTLAB_TOKEN" \\
  -H "Accept: text/event-stream"

# Wait for completion
while true; do
  STATUS=$(curl -s \\
    "$TESTLAB_URL/runs/$RUN_ID/status" \\
    -H "Authorization: Bearer $TESTLAB_TOKEN" | jq -r '.status')
  
  if [[ " success flaky " =~ " $STATUS " ]]; then
    echo "Test run completed successfully: $STATUS"
    exit 0
  elif [ "$STATUS" = "failed" ]; then
    echo "Test run failed"
    exit 1
  fi
  
  sleep 10
done`;

const githubSnippet = `name: TestLab Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run TestLab Tests
        env:
          TESTLAB_TOKEN: \${{ secrets.TESTLAB_TOKEN }}
        run: |
          chmod +x ./scripts/testlab-run.sh
          ./scripts/testlab-run.sh`;

const gitlabSnippet = `testlab:
  stage: test
  script:
    - chmod +x ./scripts/testlab-run.sh
    - ./scripts/testlab-run.sh
  variables:
    TESTLAB_TOKEN: \${TESTLAB_TOKEN}`;

export function ScriptDetail({ id }: ScriptDetailProps) {
  const [script] = useState(mockScript);
  const [usageHistory] = useState(mockUsageHistory);
  const [showScript, setShowScript] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedCI, setSelectedCI] = useState<"github" | "gitlab">("github");

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getStatusIcon = (status: ScriptUsage["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-[var(--brand-danger)]" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "skipped":
        return <Clock className="h-4 w-4 text-[var(--text-muted)]" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ScriptUsage["status"]) => {
    const statusStyles = {
      success: "bg-green-50 text-green-700 border-green-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      running: "bg-blue-50 text-blue-700 border-blue-200",
      skipped: "bg-gray-50 text-gray-700 border-gray-200",
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

  const getLanguageIcon = (language: string) => {
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

  return (
    <div className="space-y-6">
      {/* Script Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getLanguageIcon(script.language)}
                <div>
                  <h2 className="text-base font-semibold text-[var(--brand-ink)]">
                    {script.name}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {script.runConfigName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {script.ciTypes.map((ci) => {
                  const ciColors = {
                    github: "bg-gray-900 text-white",
                    gitlab: "bg-orange-500 text-white",
                  };
                  return (
                    <span
                      key={ci}
                      className={`inline-block px-2 py-1 rounded-[var(--r-chip)] text-xs font-medium ${ciColors[ci]}`}
                    >
                      {ci === "github" ? "GitHub" : "GitLab"}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Device Selection</span>
                <p className="text-sm text-zinc-800 mt-1">
                  {script.deviceSelector.mode === "group" 
                    ? `${script.deviceSelector.groupQuery?.platform || "All"} ${script.deviceSelector.groupQuery?.osMin || ""}-${script.deviceSelector.groupQuery?.osMax || ""}`
                    : "Explicit device IDs"}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Max {script.deviceSelector.maxConcurrency} concurrent
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Execution</span>
                <p className="text-sm text-zinc-800 mt-1">
                  {script.execution.runTimeoutSec}s timeout, {script.execution.retries} retries
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {script.execution.priority} priority
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Streaming</span>
                <p className="text-sm text-zinc-800 mt-1">
                  {script.streaming.mode.toUpperCase()} mode
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {script.streaming.waitForResult ? "Blocking" : "Non-blocking"}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Success Codes</span>
                <div className="flex gap-1 mt-1">
                  {script.streaming.successCodes.map((code) => (
                    <span
                      key={code}
                      className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-[var(--r-chip)] text-xs"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
            <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Token
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download ZIP
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Rotate Token
              </Button>
              <Button className="w-full justify-start text-[var(--brand-danger)]" variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Token
              </Button>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
            <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-3">Usage Stats</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Total Runs</span>
                <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">
                  {script.usageCount}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Created</span>
                <p className="text-sm text-zinc-700">
                  {script.createdAt}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  by {script.createdBy}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase">Last Used</span>
                <p className="text-sm text-zinc-700">
                  {script.lastUsedAt || "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Script Code */}
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--brand-ink)]">Token Code</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bashScript, "token")}
              className="h-8 px-3"
            >
              {copied === "token" ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowScript(!showScript)}
              className="h-8 px-3"
            >
              {showScript ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {showScript && (
          <pre className="bg-zinc-900 text-zinc-100 rounded-[var(--r-ctl)] p-4 text-xs font-mono overflow-x-auto">
            {bashScript}
          </pre>
        )}
      </div>

      {/* CI Snippets */}
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--brand-ink)]">CI Configuration</h3>
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-[var(--r-ctl)]">
            {script.ciTypes.map((ci) => (
              <Button
                key={ci}
                variant={selectedCI === ci ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCI(ci as any)}
                className="h-7 px-3"
              >
                {ci === "github" ? "GitHub" : "GitLab"}
              </Button>
            ))}
          </div>
        </div>

        {selectedCI === "github" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-700">GitHub Actions Workflow</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(githubSnippet, "github")}
                className="h-7 px-2"
              >
                {copied === "github" ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <pre className="bg-zinc-50 rounded-[var(--r-ctl)] p-4 text-xs font-mono overflow-x-auto border">
              {githubSnippet}
            </pre>
          </div>
        )}

        {selectedCI === "gitlab" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-700">GitLab CI Configuration</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(gitlabSnippet, "gitlab")}
                className="h-7 px-2"
              >
                {copied === "gitlab" ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <pre className="bg-zinc-50 rounded-[var(--r-ctl)] p-4 text-xs font-mono overflow-x-auto border">
              {gitlabSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* How to Use */}
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
        <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">How to Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-[var(--r-ctl)] p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">1. Add Script to Repository</h4>
            </div>
            <p className="text-xs text-blue-800">
              Copy the script to <code className="bg-blue-100 px-1 rounded">scripts/testlab-run.sh</code>
            </p>
          </div>
          <div className="bg-blue-50 rounded-[var(--r-ctl)] p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">2. Configure CI Pipeline</h4>
            </div>
            <p className="text-xs text-blue-800">
              Add the CI configuration to your workflow file
            </p>
          </div>
          <div className="bg-blue-50 rounded-[var(--r-ctl)] p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">3. Set Up Secrets</h4>
            </div>
            <p className="text-xs text-blue-800">
              Add <code className="bg-blue-100 px-1 rounded">TESTLAB_TOKEN</code> to CI secrets
            </p>
          </div>
          <div className="bg-blue-50 rounded-[var(--r-ctl)] p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">4. Push and Run</h4>
            </div>
            <p className="text-xs text-blue-800">
              Commit and push to trigger your first test run
            </p>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--brand-ink)]">Recent Usage</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Last test runs triggered by this token
            </p>
          </div>
          <Activity className="h-5 w-5 text-[var(--brand-primary-500)]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Time
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Triggered By
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  CI Platform
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Branch
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Duration
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {usageHistory.map((usage) => (
                <tr
                  key={usage.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-700">
                      {usage.timestamp}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-800">
                      {usage.triggeredBy}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-700">
                      {usage.ciPlatform}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-mono text-zinc-700">
                      {usage.branch}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(usage.status)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-zinc-600 font-mono">
                      {usage.duration || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end">
                      <Link href={`/test-runs/${usage.runId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          View Run
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}