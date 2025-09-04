"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestRun } from "@/types";
import { format } from "date-fns";

interface MinimalRunsTableProps {
  runs: TestRun[];
  onOpenDetails: (runId: string) => void;
}

export function MinimalRunsTable({ runs, onOpenDetails }: MinimalRunsTableProps) {
  const getStatusBadge = (status: TestRun["status"]) => {
    const colorClasses: Record<TestRun["status"], string> = {
      pass: "bg-green-500 hover:bg-green-600 text-white",
      fail: "bg-red-500 hover:bg-red-600 text-white",
      flaky: "bg-amber-500 hover:bg-amber-600 text-white",
      running: "bg-blue-500 hover:bg-blue-600 text-white",
    };

    return (
      <Badge className={`${colorClasses[status]} border-0`}>
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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Run ID</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Device</TableHead>
              <TableHead className="text-xs">Start</TableHead>
              <TableHead className="text-xs">Duration</TableHead>
              <TableHead className="text-xs text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.slice(0, 10).map((run) => (
              <TableRow key={run.id}>
                <TableCell className="text-sm font-medium">{run.id}</TableCell>
                <TableCell>{getStatusBadge(run.status)}</TableCell>
                <TableCell className="text-sm">{run.device}</TableCell>
                <TableCell className="text-sm">{format(new Date(run.startedAt), "MMM d, h:mm a")}</TableCell>
                <TableCell className="text-sm">{formatDuration(run.durationSec)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenDetails(run.id)}
                    className="text-xs"
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}