"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { FilterOptions } from "@/types";

interface MinimalHeaderProps {
  onFiltersChange: (filters: FilterOptions) => void;
  devices: string[];
}

export function MinimalHeader({ onFiltersChange, devices }: MinimalHeaderProps) {
  const [status, setStatus] = useState<string>("all");
  const [device, setDevice] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});

  const handleFilterChange = () => {
    onFiltersChange({
      status: status as FilterOptions["status"],
      device: device === "all" ? undefined : device,
      dateFrom: dateRange.from?.toISOString(),
      dateTo: dateRange.to?.toISOString(),
    });
  };

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Test Dashboard</h1>
      
      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={(value) => {
          setStatus(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[120px] h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
            <SelectItem value="flaky">Flaky</SelectItem>
            <SelectItem value="running">Running</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[160px] justify-start text-sm font-normal">
              <CalendarIcon className="mr-2 h-3 w-3" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                  </>
                ) : (
                  format(dateRange.from, "MMM d")
                )
              ) : (
                "Date Range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => {
                if (!dateRange.from || (dateRange.from && dateRange.to)) {
                  setDateRange({ from: date });
                } else {
                  setDateRange({ from: dateRange.from, to: date });
                }
                handleFilterChange();
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={device} onValueChange={(value) => {
          setDevice(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            {devices.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="text-sm">
          <Download className="h-3 w-3 mr-2" />
          Export CSV
        </Button>
      </div>
    </header>
  );
}