"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Smartphone, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { devices, testScenarios, bulkTestRuns, runs } from "@/lib/mock-data";
import type { BulkTestStats, DeviceStats } from "@/types";

export default function BulkTestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const bulkRunId = params.bulkRunId as string;

  const [bulkRun, setBulkRun] = useState<any>(null);
  const [stats, setStats] = useState<BulkTestStats | null>(null);
  const [deviceRuns, setDeviceRuns] = useState<{ [deviceId: string]: any[] }>({});

  useEffect(() => {
    // Find the bulk run (in real app, this would be an API call)
    const foundRun = bulkTestRuns.find(run => run.id === bulkRunId);
    if (foundRun) {
      setBulkRun(foundRun);

      // Generate mock bulk run data
      generateMockBulkRunData(foundRun);
    }
  }, [bulkRunId]);

  const generateMockBulkRunData = (bulkRun: any) => {
    // Generate mock runs for this bulk test
    const deviceIds = ["dev-001", "dev-004", "dev-005"]; // Mock device selection
    const iterationsPerDevice = 10;

    let totalRuns = 0;
    let passedRuns = 0;
    let failedRuns = 0;
    let flakyRuns = 0;
    let runningRuns = 0;
    let totalDuration = 0;
    const deviceStats: DeviceStats[] = [];
    const deviceRunsData: { [deviceId: string]: any[] } = {};

    deviceIds.forEach(deviceId => {
      const device = devices.find(d => d.id === deviceId);
      if (!device) return;

      let devicePassed = 0;
      let deviceFailed = 0;
      let deviceFlaky = 0;
      let deviceRunning = 0;
      let deviceDuration = 0;
      const deviceRunsList = [];

      for (let i = 1; i <= iterationsPerDevice; i++) {
        // Simulate different outcomes
        const rand = Math.random();
        let status: "PASS" | "FAIL" | "FLAKY" | "RUNNING";
        let duration: number;

        if (bulkRun.status === "running" && i > 6) {
          status = "RUNNING";
          duration = Math.floor(Math.random() * 180) + 120;
          deviceRunning++;
          runningRuns++;
        } else if (rand < 0.7) {
          status = "PASS";
          duration = Math.floor(Math.random() * 120) + 200;
          devicePassed++;
          passedRuns++;
        } else if (rand < 0.85) {
          status = "FAIL";
          duration = Math.floor(Math.random() * 200) + 300;
          deviceFailed++;
          failedRuns++;
        } else {
          status = "FLAKY";
          duration = Math.floor(Math.random() * 150) + 250;
          deviceFlaky++;
          flakyRuns++;
        }

        const run = {
          id: `${bulkRunId}-${deviceId}-${i}`,
          status,
          device: device.name,
          startISO: new Date(Date.now() - (iterationsPerDevice - i) * 300000).toISOString(),
          durationSec: duration,
          bulkTestId: bulkRunId,
          iterationNumber: i
        };

        deviceRunsList.push(run);
        deviceDuration += duration;
        totalRuns++;
        totalDuration += duration;
      }

      deviceRunsData[deviceId] = deviceRunsList;

      const deviceStat: DeviceStats = {
        deviceId,
        deviceName: device.name,
        totalRuns: iterationsPerDevice,
        passedRuns: devicePassed,
        failedRuns: deviceFailed,
        flakyRuns: deviceFlaky,
        runningRuns: deviceRunning,
        passRate: devicePassed / iterationsPerDevice,
        avgDuration: deviceDuration / iterationsPerDevice
      };

      deviceStats.push(deviceStat);
    });

    const bulkStats: BulkTestStats = {
      totalRuns,
      passedRuns,
      failedRuns,
      flakyRuns,
      runningRuns,
      passRate: passedRuns / totalRuns,
      flakyRate: flakyRuns / totalRuns,
      avgDuration: totalDuration / totalRuns,
      deviceStats
    };

    setStats(bulkStats);
    setDeviceRuns(deviceRunsData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS": return "bg-green-500";
      case "FAIL": return "bg-red-500";
      case "FLAKY": return "bg-yellow-500";
      case "RUNNING": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (passRate: number, prevPassRate?: number) => {
    if (!prevPassRate) return <Minus className="h-4 w-4" />;
    if (passRate > prevPassRate) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (passRate < prevPassRate) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4" />;
  };

  if (!bulkRun || !stats) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Loading Bulk Test Results...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = (bulkRun.completedRuns / bulkRun.totalRuns) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Bulk Test Results</h1>
            <p className="text-muted-foreground">{bulkRunId}</p>
          </div>
          <Badge variant={bulkRun.status === "completed" ? "secondary" : "default"} className="text-sm">
            {bulkRun.status.toUpperCase()}
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Test Progress
            </CardTitle>
            <CardDescription>
              {bulkRun.completedRuns} of {bulkRun.totalRuns} runs completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Started: {new Date(bulkRun.startedAt).toLocaleString()}</span>
              {bulkRun.completedAt && (
                <span>Completed: {new Date(bulkRun.completedAt).toLocaleString()}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Aggregate Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{(stats.passRate * 100).toFixed(1)}%</span>
                {getStatusIcon(stats.passRate)}
              </div>
              <p className="text-xs text-muted-foreground">{stats.passedRuns} / {stats.totalRuns} passed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Flaky Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{(stats.flakyRate * 100).toFixed(1)}%</span>
                {getStatusIcon(1 - stats.flakyRate)}
              </div>
              <p className="text-xs text-muted-foreground">{stats.flakyRuns} flaky runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{Math.round(stats.avgDuration)}s</span>
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-xs text-muted-foreground">Average test duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.deviceStats.length}</span>
                <Smartphone className="h-4 w-4" />
              </div>
              <p className="text-xs text-muted-foreground">Test devices used</p>
            </CardContent>
          </Card>
        </div>

        {/* Device-Grouped Results */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="by-device">By Device</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Performance Summary</CardTitle>
                <CardDescription>Performance metrics grouped by device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.deviceStats.map(device => (
                    <div key={device.deviceId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{device.deviceName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {device.totalRuns} runs • Avg: {Math.round(device.avgDuration)}s
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold">{(device.passRate * 100).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Pass Rate</div>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: device.totalRuns }, (_, i) => {
                            const run = deviceRuns[device.deviceId]?.[i];
                            return (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${run ? getStatusColor(run.status) : 'bg-gray-300'}`}
                                title={run ? `Iteration ${i + 1}: ${run.status}` : 'Not started'}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-device" className="space-y-4">
            {stats.deviceStats.map(device => (
              <Card key={device.deviceId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {device.deviceName}
                  </CardTitle>
                  <CardDescription>
                    {device.totalRuns} iterations • {device.passedRuns} passed • {device.failedRuns} failed • {device.flakyRuns} flaky
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 gap-2">
                    {deviceRuns[device.deviceId]?.map((run, index) => (
                      <div
                        key={run.id}
                        className={`aspect-square rounded-lg ${getStatusColor(run.status)} flex items-center justify-center text-white text-xs font-medium`}
                        title={`Iteration ${index + 1}: ${run.status} (${run.durationSec}s)`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}