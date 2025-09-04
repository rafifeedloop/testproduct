"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, PlayCircle, CheckCircle2, XCircle, 
  AlertCircle, Clock, Smartphone, ChevronRight, Eye,
  Calendar, Activity, TrendingUp
} from "lucide-react";

interface TestRun {
  id: string;
  runId: string;
  testName: string;
  device: string;
  platform: string;
  status: "passed" | "failed" | "running" | "aborted";
  duration: number;
  steps: number;
  passedSteps: number;
  failedSteps: number;
  timestamp: string;
}

const mockTestRuns: TestRun[] = [
  {
    id: "1",
    runId: "run-892",
    testName: "Login and verify home screen",
    device: "iPhone 15 Pro",
    platform: "iOS",
    status: "passed",
    duration: 285000,
    steps: 8,
    passedSteps: 7,
    failedSteps: 1,
    timestamp: "2024-01-15T14:30:00Z"
  },
  {
    id: "2",
    runId: "run-891",
    testName: "Payment flow validation",
    device: "Pixel 8 Pro",
    platform: "Android",
    status: "failed",
    duration: 412000,
    steps: 12,
    passedSteps: 9,
    failedSteps: 3,
    timestamp: "2024-01-15T14:15:00Z"
  },
  {
    id: "3",
    runId: "run-890",
    testName: "User registration flow",
    device: "Samsung Galaxy S24",
    platform: "Android",
    status: "running",
    duration: 180000,
    steps: 10,
    passedSteps: 6,
    failedSteps: 0,
    timestamp: "2024-01-15T14:45:00Z"
  },
  {
    id: "4",
    runId: "run-889",
    testName: "Profile update test",
    device: "iPhone 14",
    platform: "iOS",
    status: "passed",
    duration: 156000,
    steps: 6,
    passedSteps: 6,
    failedSteps: 0,
    timestamp: "2024-01-15T13:50:00Z"
  },
  {
    id: "5",
    runId: "run-888",
    testName: "Search functionality",
    device: "OnePlus 11",
    platform: "Android",
    status: "aborted",
    duration: 89000,
    steps: 5,
    passedSteps: 3,
    failedSteps: 1,
    timestamp: "2024-01-15T13:30:00Z"
  },
];

export default function TestRunsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "running":
        return <PlayCircle className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "aborted":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-700 border-0">Passed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-700 border-0">Running</Badge>;
      case "aborted":
        return <Badge className="bg-amber-100 text-amber-700 border-0">Aborted</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-0">Unknown</Badge>;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const filteredRuns = mockTestRuns.filter(run => {
    const matchesSearch = run.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          run.runId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          run.device.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTestRuns.length,
    passed: mockTestRuns.filter(r => r.status === "passed").length,
    failed: mockTestRuns.filter(r => r.status === "failed").length,
    running: mockTestRuns.filter(r => r.status === "running").length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-ink)] mb-2">Test Runs</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Monitor and analyze your automated test executions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total Runs</p>
              <p className="text-2xl font-bold text-[var(--brand-ink)] mt-1">{stats.total}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-300" />
          </div>
        </Card>
        
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Passed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.passed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-200" />
          </div>
        </Card>
        
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-200" />
          </div>
        </Card>
        
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Running</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.running}</p>
            </div>
            <PlayCircle className="h-8 w-8 text-blue-200 animate-pulse" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              placeholder="Search test runs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-[var(--r-ctl)] border-[var(--border-subtle)]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="h-9 rounded-[var(--r-ctl)]"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "passed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("passed")}
              className="h-9 rounded-[var(--r-ctl)]"
            >
              Passed
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
              className="h-9 rounded-[var(--r-ctl)]"
            >
              Failed
            </Button>
            <Button
              variant={statusFilter === "running" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("running")}
              className="h-9 rounded-[var(--r-ctl)]"
            >
              Running
            </Button>
          </div>
        </div>
      </Card>

      {/* Test Runs List */}
      <div className="space-y-4">
        {filteredRuns.map((run) => (
          <Link href={`/test-runs/${run.runId}`} key={run.id}>
            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0 hover:shadow-[var(--e-2)] transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  {getStatusIcon(run.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-[var(--brand-ink)]">
                        {run.testName}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        {run.runId}
                      </span>
                      {getStatusBadge(run.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        <span>{run.device}</span>
                        <Badge variant="outline" className="rounded-[var(--r-chip)] px-1.5 py-0 text-xs">
                          {run.platform}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(run.duration)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{run.passedSteps}/{run.steps} steps passed</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimestamp(run.timestamp)}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 w-full max-w-md">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full flex">
                          <div 
                            className="bg-green-500"
                            style={{ width: `${(run.passedSteps / run.steps) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500"
                            style={{ width: `${(run.failedSteps / run.steps) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-3 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredRuns.length === 0 && (
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-12 shadow-[var(--e-1)] border-0">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-[var(--brand-ink)] mb-2">No test runs found</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}