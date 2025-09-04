"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { FilterOptions } from "@/types";

interface StyledHeaderProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onRerun: () => void;
  devices: string[];
}

export function StyledHeader({ onFiltersChange, onRerun, devices }: StyledHeaderProps) {
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
      <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
        Test Dashboard
      </h1>
      
      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={(value) => {
          setStatus(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="h-10 w-[140px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)]">
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
            <Button 
              variant="outline" 
              className="h-10 w-[180px] justify-start text-sm font-normal rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)] hover:shadow-[var(--e-2)]"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[var(--text-muted)]" />
              {dateRange.from ? (
                dateRange.to ? (
                  <span className="text-sm">
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                  </span>
                ) : (
                  <span className="text-sm">{format(dateRange.from, "MMM d, yyyy")}</span>
                )
              ) : (
                <span className="text-[var(--text-muted)]">Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 shadow-[var(--e-2)]" align="end">
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
          <SelectTrigger className="h-10 w-[160px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)]">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            {devices.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={onRerun}
          className="h-10 text-sm rounded-[var(--r-ctl)] bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] hover:shadow-[0_8px_24px_rgba(41,94,236,0.25)] transition-shadow"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-run filters
        </Button>
      </div>
    </header>
  );
}