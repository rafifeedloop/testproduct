"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { devices } from "@/lib/mock-data";
import { Smartphone, Tablet } from "lucide-react";

interface DevicesSidebarProps {
  className?: string;
}

export function DevicesSidebar({ className }: DevicesSidebarProps) {
  const totalDevices = devices.length;
  const availableDevices = devices.filter(d => d.state === "Idle").length;
  const busyDevices = devices.filter(d => d.state === "Busy").length;

  return (
    <Card className={`bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0 ${className}`}>
      <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">Devices Registry</h3>
      
      {/* Summary chips */}
      <div className="flex gap-2 mb-4">
        <Badge className="rounded-[var(--r-chip)] bg-zinc-100 text-[var(--brand-ink)] border-0 px-3 py-1 text-xs">
          Total: {totalDevices}
        </Badge>
        <Badge className="rounded-[var(--r-chip)] bg-green-100 text-green-700 border-0 px-3 py-1 text-xs">
          Available: {availableDevices}
        </Badge>
        <Badge className="rounded-[var(--r-chip)] bg-amber-100 text-amber-700 border-0 px-3 py-1 text-xs">
          In Use: {busyDevices}
        </Badge>
      </div>
      
      {/* Device list */}
      <div className="space-y-2">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
            <div className="flex items-center gap-2">
              {device.os === "iOS" ? (
                <Smartphone className="h-4 w-4 text-[var(--text-muted)]" />
              ) : (
                <Tablet className="h-4 w-4 text-[var(--text-muted)]" />
              )}
              <div>
                <p className="text-sm font-medium text-[var(--brand-ink)]">{device.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {device.os} {device.version}
                </p>
              </div>
            </div>
            <Badge 
              className={`rounded-[var(--r-chip)] border-0 px-2 py-0.5 text-xs ${
                device.state === "Idle" 
                  ? "bg-zinc-100 text-zinc-700" 
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {device.state}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}