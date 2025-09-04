"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { runs, Run } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

interface RunsTableProps {
  className?: string;
  onOpenDetails?: (runId: string) => void;
}

export function RunsTable({ className, onOpenDetails }: RunsTableProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getStatusBadge = (status: Run["status"]) => {
    const styles = {
      PASS: "bg-[var(--brand-success)] text-white",
      FAIL: "bg-[var(--brand-danger)] text-white",
      FLAKY: "bg-[var(--brand-warn)] text-white",
      RUNNING: "bg-gradient-to-r from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white",
    };

    return (
      <Badge className={`${styles[status]} rounded-[var(--r-chip)] border-0 px-3 py-1 text-xs font-medium`}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className={`bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] border-0 overflow-hidden ${className}`}>
      <div className="p-5 border-b border-[var(--border-subtle)]">
        <h3 className="text-base font-semibold text-[var(--brand-ink)]">Test Runs</h3>
      </div>
      
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead className="text-xs text-[var(--text-muted)] font-medium">Run ID</TableHead>
            <TableHead className="text-xs text-[var(--text-muted)] font-medium">Status</TableHead>
            <TableHead className="text-xs text-[var(--text-muted)] font-medium">Device</TableHead>
            <TableHead className="text-xs text-[var(--text-muted)] font-medium">Start</TableHead>
            <TableHead className="text-xs text-[var(--text-muted)] font-medium">Duration</TableHead>
            <TableHead className="text-xs text-[var(--text-muted)] font-medium text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.slice(0, 8).map((run) => (
            <TableRow key={run.id} className="border-b border-[var(--border-subtle)]">
              <TableCell className="text-sm font-medium text-[var(--brand-ink)]">{run.id}</TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell className="text-sm text-zinc-800">{run.device}</TableCell>
              <TableCell className="text-sm text-zinc-800">
                {formatDistanceToNow(new Date(run.startISO), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-sm text-zinc-800 tabular-nums">
                {formatDuration(run.durationSec)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenDetails?.(run.id)}
                  className="text-xs text-[var(--brand-primary-500)] hover:text-[var(--brand-primary-600)] hover:bg-blue-50"
                >
                  Open
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}