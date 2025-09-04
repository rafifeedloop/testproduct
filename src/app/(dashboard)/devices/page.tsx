"use client";

import { useState, useMemo } from "react";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { DeviceFilter } from "@/components/devices/DeviceFilter";
import { DeviceDetail } from "@/components/devices/DeviceDetail";
import { deviceRegistryData, filterDevices, DeviceRegistry, DevicePlatform, DeviceStatus, DeviceType } from "@/lib/device-registry-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function DevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceRegistry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<DevicePlatform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<DeviceType | "all">("all");

  const filteredDevices = useMemo(() => {
    return filterDevices(deviceRegistryData, {
      search: searchQuery,
      platform: platformFilter,
      status: statusFilter,
      type: typeFilter,
    });
  }, [searchQuery, platformFilter, statusFilter, typeFilter]);

  const deviceCounts = useMemo(() => {
    return {
      total: deviceRegistryData.length,
      idle: deviceRegistryData.filter(d => d.status === "Idle").length,
      busy: deviceRegistryData.filter(d => d.status === "Busy").length,
      reserved: deviceRegistryData.filter(d => d.status === "Reserved").length,
      offline: deviceRegistryData.filter(d => d.status === "Offline").length,
    };
  }, []);


  const handleViewDetails = (device: DeviceRegistry) => {
    setSelectedDevice(device);
    setDetailOpen(true);
  };

  const handleAllocate = (deviceId: string) => {
    console.log("Allocating device:", deviceId);
  };

  const handleRelease = (deviceId: string) => {
    console.log("Releasing device:", deviceId);
  };

  const handleRefresh = () => {
    console.log("Refreshing device list...");
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[var(--brand-ink)]">Device Registry</h1>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-[var(--r-ctl)] border-[var(--border-subtle)]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[var(--text-muted)]">Idle</span>
            </div>
            <Badge variant="secondary" className="rounded-[var(--r-chip)] px-2 py-0.5 text-xs">
              {deviceCounts.idle}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[var(--text-muted)]">Busy</span>
            </div>
            <Badge variant="secondary" className="rounded-[var(--r-chip)] px-2 py-0.5 text-xs">
              {deviceCounts.busy}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[var(--text-muted)]">Reserved</span>
            </div>
            <Badge variant="secondary" className="rounded-[var(--r-chip)] px-2 py-0.5 text-xs">
              {deviceCounts.reserved}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-[var(--text-muted)]">Offline</span>
            </div>
            <Badge variant="secondary" className="rounded-[var(--r-chip)] px-2 py-0.5 text-xs">
              {deviceCounts.offline}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 ml-auto text-[var(--text-muted)]">
            {deviceCounts.total - deviceCounts.offline > 0 ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span>{deviceCounts.total - deviceCounts.offline} Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-gray-400" />
                <span>All Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      <DeviceFilter
        onSearchChange={setSearchQuery}
        onPlatformChange={setPlatformFilter}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
      />

      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onViewDetails={handleViewDetails}
              onAllocate={handleAllocate}
              onRelease={handleRelease}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <WifiOff className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-[var(--brand-ink)] mb-2">No devices found</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      <DeviceDetail
        device={selectedDevice}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}