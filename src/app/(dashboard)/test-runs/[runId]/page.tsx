"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepTimeline } from "@/components/llm-viewer/StepTimeline";
import { ScreenshotCompare } from "@/components/llm-viewer/ScreenshotCompare";
import { LLMCommandViewer } from "@/components/llm-viewer/LLMCommandViewer";
import { mockTestRunDetail, getStepByIndex } from "@/lib/llm-command-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, PlayCircle, CheckCircle2, XCircle, 
  Clock, Smartphone, Calendar, Activity
} from "lucide-react";
import Link from "next/link";

export default function TestRunDetailPage() {
  const params = useParams();
  const runId = params.runId as string;
  
  // For demo, we'll use mock data
  const testRun = mockTestRunDetail;
  const [selectedStep, setSelectedStep] = useState(testRun.steps[0]);

  const handleStepNavigate = (direction: "prev" | "next") => {
    const currentIndex = testRun.steps.findIndex(s => s.id === selectedStep.id);
    if (direction === "prev" && currentIndex > 0) {
      setSelectedStep(testRun.steps[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < testRun.steps.length - 1) {
      setSelectedStep(testRun.steps[currentIndex + 1]);
    }
  };

  const getStatusIcon = () => {
    switch (testRun.status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "aborted":
        return <XCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (testRun.status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-700 border-0">Passed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>;
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

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/test-runs">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Test Runs
            </Button>
          </Link>
        </div>

        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-6 shadow-[var(--e-1)] border-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {getStatusIcon()}
              <div>
                <h1 className="text-xl font-bold text-[var(--brand-ink)] mb-2">
                  Test Run {testRun.runId}
                </h1>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  {testRun.testGoal}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--brand-ink)]">{testRun.deviceInfo.name}</span>
                    <span className="text-[var(--text-muted)]">
                      {testRun.deviceInfo.platform} {testRun.deviceInfo.osVersion}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--brand-ink)]">
                      {formatDuration(testRun.totalDuration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--brand-ink)]">
                      {new Date(testRun.startTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="w-full justify-start h-12 bg-transparent border-b border-[var(--border-subtle)] rounded-none mb-6">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="logs" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none"
          >
            Logs
          </TabsTrigger>
          <TabsTrigger 
            value="artifacts" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none"
          >
            Artifacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
              <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Test Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Total Steps</span>
                  <span className="text-sm font-medium text-[var(--brand-ink)]">{testRun.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Successful</span>
                  <span className="text-sm font-medium text-green-600">
                    {testRun.steps.filter(s => s.executionStatus === "success").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Failed</span>
                  <span className="text-sm font-medium text-red-600">
                    {testRun.steps.filter(s => s.executionStatus === "fail").length}
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Additional cards can be added here */}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-320px)]">
            {/* Left: Step Timeline */}
            <div className="col-span-3">
              <StepTimeline 
                steps={testRun.steps}
                selectedStepIndex={selectedStep.index}
                onStepSelect={setSelectedStep}
              />
            </div>

            {/* Center: Screenshot Comparison */}
            <div className="col-span-4">
              <ScreenshotCompare
                screenshotBefore={selectedStep.screenshotBefore}
                screenshotAfter={selectedStep.screenshotAfter}
                stepIndex={selectedStep.index}
              />
            </div>

            {/* Right: LLM Command Viewer */}
            <div className="col-span-5 overflow-y-auto">
              <LLMCommandViewer
                step={selectedStep}
                testGoal={testRun.testGoal}
                onNavigate={handleStepNavigate}
                hasPrevious={selectedStep.index > 1}
                hasNext={selectedStep.index < testRun.steps.length}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-8 shadow-[var(--e-1)] border-0">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-[var(--brand-ink)] mb-2">Test Logs</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Detailed logs will be displayed here
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="artifacts" className="mt-0">
          <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-8 shadow-[var(--e-1)] border-0">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-[var(--brand-ink)] mb-2">Test Artifacts</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Videos, screenshots, and other artifacts will be displayed here
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}