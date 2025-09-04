"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MinimalRunsTable } from "./minimal-runs-table";
import { TestRun, Device } from "@/types";
import { useState } from "react";

interface DashboardTabsProps {
  runs: TestRun[];
  devices: Device[];
  onOpenDetails: (runId: string) => void;
}

export function DashboardTabs({ runs, devices, onOpenDetails }: DashboardTabsProps) {
  const [showRuns, setShowRuns] = useState(false);

  const idleDevices = devices.filter(d => d.status === "idle").length;
  const busyDevices = devices.filter(d => d.status === "busy").length;

  return (
    <Tabs defaultValue="runs" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="runs" className="text-sm">Runs</TabsTrigger>
        <TabsTrigger value="devices" className="text-sm">Devices</TabsTrigger>
        <TabsTrigger value="trends" className="text-sm">Trends</TabsTrigger>
      </TabsList>

      <TabsContent value="runs" className="space-y-6">
        {!showRuns ? (
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                View recent test execution runs and their detailed results
              </p>
              <Button onClick={() => setShowRuns(true)}>
                View runs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <MinimalRunsTable runs={runs} onOpenDetails={onOpenDetails} />
        )}
      </TabsContent>

      <TabsContent value="devices" className="space-y-6">
        <div className="flex gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            Total: {devices.length}
          </Badge>
          <Badge variant="outline" className="text-xs text-green-600">
            Available: {idleDevices}
          </Badge>
          <Badge variant="outline" className="text-xs text-amber-600">
            In Use: {busyDevices}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-5">
            <div className="space-y-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.platform} {device.osVersion}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={device.status === "idle" ? "outline" : "default"}
                    className={device.status === "idle" ? "text-green-600" : "text-amber-600"}
                  >
                    {device.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="space-y-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium mb-4">Pass rate over time</h3>
            <div className="h-48 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
              Chart placeholder - Pass rate trends visualization
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}