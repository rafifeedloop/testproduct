"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface HeaderBarProps {
  onFiltersChange?: (filters: any) => void;
  onRerun?: () => void;
}

export function HeaderBar({ onFiltersChange, onRerun }: HeaderBarProps) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
        Test Dashboard
      </h1>
      
      <div className="flex items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="h-10 w-[120px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)] focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:ring-opacity-20">
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
              className="h-10 w-[180px] justify-start text-sm font-normal rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)] hover:shadow-[var(--e-2)] focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:ring-opacity-20"
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
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select defaultValue="all">
          <SelectTrigger className="h-10 w-[160px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)] focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:ring-opacity-20">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="iphone15">iPhone 15 Pro</SelectItem>
            <SelectItem value="pixel8">Pixel 8 Pro</SelectItem>
            <SelectItem value="samsung24">Samsung S24</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={onRerun}
          className="h-10 text-sm rounded-[var(--r-ctl)] bg-[var(--surface)] text-[var(--brand-ink)] border border-[var(--border-subtle)] hover:bg-zinc-50 shadow-[var(--e-1)] hover:shadow-[var(--e-2)] transition-all"
          aria-label="Re-run filters"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Re-run filters
        </Button>
      </div>
    </header>
  );
}