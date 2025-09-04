"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Activity, TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface StyledKPICardsProps {
  runsToday: number;
  passRate: number;
  avgDuration: number;
  flakyRate: number;
}

export function StyledKPICards({ runsToday, passRate, avgDuration, flakyRate }: StyledKPICardsProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex items-center gap-6">
      <div className="grid grid-cols-3 gap-4 flex-1">
        {/* Runs Today */}
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-[var(--r-chip)] bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] flex items-center justify-center shadow-[0_8px_24px_rgba(41,94,236,0.25)]">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs leading-5 text-[var(--text-muted)] uppercase tracking-wide">Today</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
            {runsToday}
          </div>
          <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Test runs</p>
        </Card>

        {/* Pass Rate */}
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-[var(--r-chip)] bg-[var(--brand-success)] flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs leading-5 text-[var(--text-muted)] uppercase tracking-wide">Success</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
            {passRate.toFixed(1)}%
          </div>
          <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Pass rate</p>
        </Card>

        {/* Avg Duration */}
        <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-[var(--r-chip)] bg-zinc-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[var(--brand-ink)]" />
            </div>
            <span className="text-xs leading-5 text-[var(--text-muted)] uppercase tracking-wide">Speed</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
            {formatDuration(avgDuration)}
          </div>
          <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Average time</p>
        </Card>
      </div>
      
      {/* More metrics popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-[var(--text-muted)] hover:text-[var(--brand-primary-500)]"
          >
            More metrics
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 shadow-[var(--e-2)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[var(--r-chip)] bg-[var(--brand-warn)] flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs leading-5 text-[var(--text-muted)] uppercase tracking-wide">Flaky Rate</div>
                <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
                  {flakyRate.toFixed(1)}%
                </div>
              </div>
            </div>
            <p className="text-xs leading-5 text-[var(--text-muted)]">
              Tests showing intermittent failures requiring attention
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}