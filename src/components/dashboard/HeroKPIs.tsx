"use client";

import { Card } from "@/components/ui/card";
import { Activity, Clock, AlertTriangle } from "lucide-react";
import { kpis } from "@/lib/mock-data";

interface HeroKPIsProps {
  className?: string;
}

export function HeroKPIs({ className }: HeroKPIsProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className={`grid grid-cols-5 gap-6 ${className}`}>
      {/* Hero KPI - Pass Rate (2/5 width) */}
      <Card className="col-span-2 bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] rounded-[var(--r-card)] p-6 shadow-[0_8px_24px_rgba(41,94,236,0.25)] border-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-white/80 mb-2">Today</p>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-white tracking-tight tabular-nums">
                {(kpis.passRate * 100).toFixed(1)}%
              </span>
              <div className="flex flex-col">
                <span className="text-sm text-white/90">Pass rate</span>
              </div>
            </div>
          </div>
          
          {/* Sparkline SVG */}
          <svg width="80" height="40" className="opacity-60">
            <polyline
              fill="none"
              stroke="white"
              strokeWidth="2"
              points="0,35 15,30 30,32 45,20 60,15 80,18"
            />
          </svg>
        </div>
      </Card>

      {/* Test Runs (1/5 width) */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-[var(--r-chip)] bg-blue-100 flex items-center justify-center">
            <Activity className="h-5 w-5 text-[var(--brand-primary-500)]" />
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight tabular-nums text-[var(--brand-ink)]">
          {kpis.runsToday}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">Test runs</p>
      </Card>

      {/* Avg Speed (1/5 width) */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-[var(--r-chip)] bg-zinc-100 flex items-center justify-center">
            <Clock className="h-5 w-5 text-[var(--brand-ink)]" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Speed</span>
        </div>
        <div className="text-3xl font-bold tracking-tight tabular-nums text-[var(--brand-ink)]">
          {formatDuration(kpis.avgDurationSec)}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">Average time</p>
      </Card>

      {/* Flaky Rate (1/5 width) */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-[var(--r-chip)] bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Flaky Rate</span>
        </div>
        <div className="text-3xl font-bold tracking-tight tabular-nums text-[var(--brand-ink)]">
          26.0%
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">Tests showing intermittent failures requiring attention</p>
      </Card>
    </div>
  );
}