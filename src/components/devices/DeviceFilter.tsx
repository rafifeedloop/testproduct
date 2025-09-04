"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { DevicePlatform, DeviceStatus, DeviceType } from "@/lib/device-registry-data";

interface DeviceFilterProps {
  onSearchChange: (search: string) => void;
  onPlatformChange: (platform: DevicePlatform | "all") => void;
  onStatusChange: (status: DeviceStatus | "all") => void;
  onTypeChange: (type: DeviceType | "all") => void;
}

export function DeviceFilter({ 
  onSearchChange, 
  onPlatformChange, 
  onStatusChange, 
  onTypeChange 
}: DeviceFilterProps) {
  return (
    <div className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            placeholder="Search by device name or ID..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-white focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:ring-opacity-20"
          />
        </div>

        {/* Platform Filter */}
        <Select defaultValue="all" onValueChange={(value) => onPlatformChange(value as DevicePlatform | "all")}>
          <SelectTrigger className="w-[140px] h-10 rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-white">
            <Filter className="h-3 w-3 mr-2" />
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="iOS">iOS</SelectItem>
            <SelectItem value="Android">Android</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select defaultValue="all" onValueChange={(value) => onStatusChange(value as DeviceStatus | "all")}>
          <SelectTrigger className="w-[140px] h-10 rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Idle">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Idle
              </div>
            </SelectItem>
            <SelectItem value="Busy">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Busy
              </div>
            </SelectItem>
            <SelectItem value="Reserved">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Reserved
              </div>
            </SelectItem>
            <SelectItem value="Offline">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500" />
                Offline
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select defaultValue="all" onValueChange={(value) => onTypeChange(value as DeviceType | "all")}>
          <SelectTrigger className="w-[140px] h-10 rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Real">Real Device</SelectItem>
            <SelectItem value="Emulator">Emulator</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}