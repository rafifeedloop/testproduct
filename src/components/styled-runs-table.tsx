"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TestRun } from "@/types";
import { format } from "date-fns";

interface StyledRunsTableProps {
  runs: TestRun[];
  onOpenDetails: (runId: string) => void;
}

export function StyledRunsTable({ runs, onOpenDetails }: StyledRunsTableProps) {
  const getStatusBadge = (status: TestRun["status"]) => {
    const styles: Record<TestRun["status"], string> = {
      pass: "bg-[var(--brand-success)] text-white",
      fail: "bg-[var(--brand-danger)] text-white",
      flaky: "bg-[var(--brand-warn)] text-white",
      running: "bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white",
    };

    return (
      <Badge className={`${styles[status]} rounded-[var(--r-chip)] border-0 px-3 py-1 text-xs font-medium`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] border-0 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-50 border-b border-[var(--border-subtle)]">
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
          {runs.slice(0, 10).map((run) => (
            <TableRow key={run.id} className="border-b border-[var(--border-subtle)]">
              <TableCell className="text-sm font-medium text-[var(--brand-ink)]">{run.id}</TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell className="text-sm text-zinc-800">{run.device}</TableCell>
              <TableCell className="text-sm text-zinc-800">{format(new Date(run.startedAt), "MMM d, h:mm a")}</TableCell>
              <TableCell className="text-sm text-zinc-800 tabular-nums">{formatDuration(run.durationSec)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenDetails(run.id)}
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