"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DeviceRegistry } from "@/lib/device-registry-data";
import { 
  Smartphone, Tablet, Wifi, WifiOff, Battery, HardDrive, 
  Cpu, MapPin, CheckCircle2, XCircle, AlertCircle, Clock,
  FileText, Camera
} from "lucide-react";

interface DeviceDetailProps {
  device: DeviceRegistry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeviceDetail({ device, open, onOpenChange }: DeviceDetailProps) {
  if (!device) return null;

  const getStatusColor = (status: DeviceRegistry["status"]) => {
    switch (status) {
      case "Idle":
        return "bg-green-100 text-green-700 border-green-300";
      case "Busy":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "Reserved":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Offline":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getDeviceIcon = () => {
    if (device.name.toLowerCase().includes("ipad") || device.name.toLowerCase().includes("tablet")) {
      return <Tablet className="h-6 w-6 text-white" />;
    }
    return <Smartphone className="h-6 w-6 text-white" />;
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "Pass":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Fail":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Aborted":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden bg-[var(--surface)] rounded-[var(--r-card)] border-0">
        <DialogHeader className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-[var(--r-chip)] flex items-center justify-center ${
                device.platform === "iOS" ? "bg-gradient-to-tr from-gray-800 to-gray-600" : "bg-gradient-to-tr from-green-600 to-green-500"
              }`}>
                {getDeviceIcon()}
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-[var(--brand-ink)]">
                  {device.name}
                </DialogTitle>
                <p className="text-sm text-[var(--text-muted)]">
                  {device.platform} {device.osVersion} • {device.type}
                </p>
              </div>
            </div>
            <Badge className={`rounded-[var(--r-chip)] border px-3 py-1 text-xs font-medium ${getStatusColor(device.status)}`}>
              {device.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="w-full justify-start px-6 h-12 bg-transparent border-b border-[var(--border-subtle)] rounded-none">
            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none">
              Usage History
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none">
              Device Logs
            </TabsTrigger>
            <TabsTrigger value="screenshot" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary-500)] rounded-none">
              Screenshot
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(85vh-140px)]">
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              <div>
                <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Device Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">Device ID</span>
                      <span className="text-sm font-mono text-[var(--brand-ink)]">{device.udid}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">OS Build</span>
                      <span className="text-sm text-[var(--brand-ink)]">{device.metadata.osBuild}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">Last Seen</span>
                      <span className="text-sm text-[var(--brand-ink)]">
                        {new Date(device.lastSeen).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">Network</span>
                      <div className="flex items-center gap-1">
                        {device.status === "Offline" ? (
                          <WifiOff className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Wifi className="h-3 w-3 text-green-600" />
                        )}
                        <span className="text-sm text-[var(--brand-ink)]">{device.metadata.network}</span>
                      </div>
                    </div>
                    {device.metadata.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-muted)]">Location</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[var(--text-muted)]" />
                          <span className="text-sm text-[var(--brand-ink)]">{device.metadata.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Hardware Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {device.metadata.cpu && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">Processor</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--brand-ink)]">{device.metadata.cpu}</span>
                    </div>
                  )}
                  {device.metadata.ram && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">Memory</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--brand-ink)]">{device.metadata.ram}</span>
                    </div>
                  )}
                  {device.metadata.storage && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">Storage</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--brand-ink)]">{device.metadata.storage}</span>
                    </div>
                  )}
                  {device.metadata.battery && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Battery className={`h-4 w-4 ${
                          device.metadata.battery > 50 ? "text-green-600" : 
                          device.metadata.battery > 20 ? "text-amber-600" : "text-red-600"
                        }`} />
                        <span className="text-sm text-[var(--text-muted)]">Battery</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--brand-ink)]">{device.metadata.battery}%</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--brand-ink)]">Recent Test Runs</h3>
                {device.usageHistory.length > 0 ? (
                  <div className="space-y-3">
                    {device.usageHistory.map((run, index) => (
                      <div key={index} className="bg-gray-50 rounded-[var(--r-card)] p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getResultIcon(run.result)}
                            <span className="text-sm font-medium text-[var(--brand-ink)]">
                              {run.testSuite}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--text-muted)] font-mono">
                            {run.runId}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(run.duration)}
                          </div>
                          <div>
                            {new Date(run.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No test runs recorded for this device</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="p-6 mt-0">
              <div className="text-center py-12 text-[var(--text-muted)]">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm mb-2">Device logs will appear here</p>
                <p className="text-xs">Connect to device to stream real-time logs</p>
              </div>
            </TabsContent>

            <TabsContent value="screenshot" className="p-6 mt-0">
              <div className="text-center py-12 text-[var(--text-muted)]">
                <Camera className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm mb-2">Screenshot preview unavailable</p>
                <p className="text-xs">Device must be online to capture screenshots</p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}