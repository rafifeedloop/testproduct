"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Activity, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface MinimalKPICardsProps {
  runsToday: number;
  passRate: number;
  avgDuration: number;
  flakyRate: number;
}

export function MinimalKPICards({ runsToday, passRate, avgDuration, flakyRate }: MinimalKPICardsProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex items-center gap-6">
      <div className="grid grid-cols-3 gap-6 flex-1">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Runs Today</span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold">{runsToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Pass Rate</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-semibold">{passRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Avg Duration</span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold">{formatDuration(avgDuration)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            More metrics
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Flaky Rate</span>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-semibold">{flakyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Tests showing intermittent failures</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}