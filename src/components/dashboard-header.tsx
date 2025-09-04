"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { FilterOptions } from "@/types";

interface DashboardHeaderProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onRerun: () => void;
  devices: string[];
}

export function DashboardHeader({ onFiltersChange, onRerun, devices }: DashboardHeaderProps) {
  const [status, setStatus] = useState<string>("all");
  const [device, setDevice] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleFilterChange = () => {
    onFiltersChange({
      status: status as FilterOptions["status"],
      device: device === "all" ? undefined : device,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
    });
  };

  return (
    <div className="border-b bg-white">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Test Dashboard</h1>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => {
              setStatus(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
                <SelectItem value="flaky">Flaky</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Device</Label>
            <Select value={device} onValueChange={(value) => {
              setDevice(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                {devices.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    setDateFrom(date);
                    handleFilterChange();
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    setDateTo(date);
                    handleFilterChange();
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={onRerun} className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-run filters
          </Button>
        </div>
      </div>
    </div>
  );
}