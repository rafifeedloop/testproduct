import { DashboardLayout } from "../dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";

export default function LogsPage() {
  const logs = [
    {
      id: "log-001",
      timestamp: "2024-01-15 10:23:45",
      level: "info",
      source: "test-runner",
      message: "Test suite 'Authentication' started on iPhone 15 Pro",
      details: { device: "iPhone 15 Pro", suite: "Authentication" }
    },
    {
      id: "log-002",
      timestamp: "2024-01-15 10:23:47",
      level: "success",
      source: "test-runner",
      message: "Test 'Login with valid credentials' passed",
      details: { test: "Login with valid credentials", duration: "2.3s" }
    },
    {
      id: "log-003",
      timestamp: "2024-01-15 10:23:50",
      level: "error",
      source: "test-runner",
      message: "Test 'Password reset flow' failed - Element not found",
      details: { test: "Password reset flow", error: "Element with ID 'reset-button' not found" }
    },
    {
      id: "log-004",
      timestamp: "2024-01-15 10:24:02",
      level: "warning",
      source: "device-manager",
      message: "Device 'Pixel 8 Pro' battery level low (15%)",
      details: { device: "Pixel 8 Pro", battery: "15%" }
    },
    {
      id: "log-005",
      timestamp: "2024-01-15 10:24:15",
      level: "info",
      source: "scheduler",
      message: "Scheduled test run 'Regression Suite' queued for execution",
      details: { suite: "Regression Suite", scheduled: "10:30 AM" }
    },
    {
      id: "log-006",
      timestamp: "2024-01-15 10:24:18",
      level: "success",
      source: "test-runner",
      message: "Test suite 'Authentication' completed - 8/10 tests passed",
      details: { suite: "Authentication", passed: 8, failed: 2, duration: "54s" }
    },
    {
      id: "log-007",
      timestamp: "2024-01-15 10:24:22",
      level: "error",
      source: "api",
      message: "Failed to connect to test orchestration API - timeout",
      details: { endpoint: "/api/v1/results", timeout: "30s" }
    },
    {
      id: "log-008",
      timestamp: "2024-01-15 10:24:25",
      level: "info",
      source: "device-manager",
      message: "Device 'iPad Pro' connected and ready",
      details: { device: "iPad Pro", os: "iOS 17.0" }
    },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-[var(--brand-success)]" />;
      case "error":
        return <XCircle className="h-4 w-4 text-[var(--brand-danger)]" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-[var(--brand-warn)]" />;
      default:
        return <Clock className="h-4 w-4 text-[var(--text-muted)]" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      success: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
      warning: "bg-amber-100 text-amber-700",
      info: "bg-blue-100 text-blue-700",
    };

    return (
      <Badge className={`${styles[level]} rounded-[var(--r-chip)] border-0 px-2 py-0.5 text-xs`}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--bg-page)]">
        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
              Logs
            </h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="h-10 text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)]"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                className="h-10 text-sm rounded-[var(--r-ctl)] bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] hover:shadow-[0_8px_24px_rgba(41,94,236,0.25)] transition-shadow"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10 h-10 rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-zinc-50"
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-[140px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)]">
                  <SelectValue placeholder="Log Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-[140px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="test-runner">Test Runner</SelectItem>
                  <SelectItem value="device-manager">Device Manager</SelectItem>
                  <SelectItem value="scheduler">Scheduler</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="1hour">
                <SelectTrigger className="h-10 w-[140px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">Last 15 minutes</SelectItem>
                  <SelectItem value="1hour">Last hour</SelectItem>
                  <SelectItem value="6hours">Last 6 hours</SelectItem>
                  <SelectItem value="24hours">Last 24 hours</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline"
                size="sm"
                className="h-10 text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)]"
              >
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Log Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[var(--r-chip)] bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">248</p>
                  <p className="text-xs text-[var(--text-muted)]">Info</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[var(--r-chip)] bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">186</p>
                  <p className="text-xs text-[var(--text-muted)]">Success</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[var(--r-chip)] bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">32</p>
                  <p className="text-xs text-[var(--text-muted)]">Warning</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[var(--r-chip)] bg-red-100 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--brand-ink)] tabular-nums">15</p>
                  <p className="text-xs text-[var(--text-muted)]">Error</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Logs List */}
          <Card className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] border-0 overflow-hidden">
            <div className="divide-y divide-[var(--border-subtle)]">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-start gap-3">
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-[var(--text-muted)] font-mono">{log.timestamp}</span>
                        {getLevelBadge(log.level)}
                        <Badge className="bg-zinc-100 text-zinc-700 rounded-[var(--r-chip)] border-0 px-2 py-0.5 text-xs">
                          {log.source}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--brand-ink)] mb-1">{log.message}</p>
                      {log.details && (
                        <div className="text-xs text-[var(--text-muted)] font-mono bg-zinc-50 rounded p-2 mt-2">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              Showing 1-8 of 481 logs
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}