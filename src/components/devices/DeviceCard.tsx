"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceRegistry } from "@/lib/device-registry-data";
import { Smartphone, Tablet, Wifi, WifiOff, Battery, HardDrive, Cpu, Play, Lock, Unlock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DeviceCardProps {
  device: DeviceRegistry;
  onViewDetails: (device: DeviceRegistry) => void;
  onAllocate?: (deviceId: string) => void;
  onRelease?: (deviceId: string) => void;
}

export function DeviceCard({ device, onViewDetails, onAllocate, onRelease }: DeviceCardProps) {
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
      return <Tablet className="h-5 w-5" />;
    }
    return <Smartphone className="h-5 w-5" />;
  };

  const canAllocate = device.status === "Idle";
  const canRelease = device.status === "Reserved" || device.status === "Busy";

  return (
    <Card 
      className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0 hover:shadow-[var(--e-2)] transition-all cursor-pointer"
      onClick={() => onViewDetails(device)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-[var(--r-chip)] flex items-center justify-center ${
            device.platform === "iOS" ? "bg-gradient-to-tr from-gray-800 to-gray-600" : "bg-gradient-to-tr from-green-600 to-green-500"
          }`}>
            {getDeviceIcon()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--brand-ink)]">{device.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {device.platform} {device.osVersion} • {device.type}
            </p>
          </div>
        </div>
        <Badge className={`rounded-[var(--r-chip)] border px-3 py-1 text-xs font-medium ${getStatusColor(device.status)}`}>
          {device.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Device ID</span>
          <span className="font-mono text-[var(--brand-ink)]">{device.udid.slice(0, 12)}...</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Network</span>
          <div className="flex items-center gap-1">
            {device.status === "Offline" ? (
              <WifiOff className="h-3 w-3 text-gray-400" />
            ) : (
              <Wifi className="h-3 w-3 text-green-600" />
            )}
            <span className="text-[var(--brand-ink)]">{device.metadata.network}</span>
          </div>
        </div>

        {device.metadata.battery && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Battery</span>
            <div className="flex items-center gap-1">
              <Battery className={`h-3 w-3 ${
                device.metadata.battery > 50 ? "text-green-600" : 
                device.metadata.battery > 20 ? "text-amber-600" : "text-red-600"
              }`} />
              <span className="text-[var(--brand-ink)]">{device.metadata.battery}%</span>
            </div>
          </div>
        )}

        {device.metadata.storage && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Storage</span>
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3 text-[var(--text-muted)]" />
              <span className="text-[var(--brand-ink)]">{device.metadata.storage}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={!canAllocate}
                onClick={() => canAllocate && onAllocate?.(device.id)}
                className={`flex-1 h-8 text-xs rounded-[var(--r-ctl)] ${
                  canAllocate 
                    ? "border-[var(--brand-primary-500)] text-[var(--brand-primary-500)] hover:bg-blue-50" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Play className="h-3 w-3 mr-1" />
                Allocate
              </Button>
            </TooltipTrigger>
            {!canAllocate && (
              <TooltipContent>
                <p className="text-xs">Device must be idle to allocate</p>
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={!canRelease}
                onClick={() => canRelease && onRelease?.(device.id)}
                className={`flex-1 h-8 text-xs rounded-[var(--r-ctl)] ${
                  canRelease 
                    ? "border-amber-500 text-amber-600 hover:bg-amber-50" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {device.status === "Reserved" ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                Release
              </Button>
            </TooltipTrigger>
            {!canRelease && (
              <TooltipContent>
                <p className="text-xs">Device must be reserved or busy to release</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}