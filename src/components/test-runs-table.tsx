"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestRun } from "@/types";
import { format } from "date-fns";
import { Eye } from "lucide-react";

interface TestRunsTableProps {
  runs: TestRun[];
  onViewDetails: (runId: string) => void;
}

export function TestRunsTable({ runs, onViewDetails }: TestRunsTableProps) {
  const getStatusBadge = (status: TestRun["status"]) => {
    const variants: Record<TestRun["status"], "default" | "destructive" | "secondary" | "outline"> = {
      pass: "default",
      fail: "destructive",
      flaky: "secondary",
      running: "outline",
    };
    
    const colors: Record<TestRun["status"], string> = {
      pass: "bg-green-500",
      fail: "bg-red-500",
      flaky: "bg-yellow-500",
      running: "bg-blue-500",
    };

    return (
      <Badge variant={variants[status]} className={status === "pass" ? "bg-green-500 hover:bg-green-600" : ""}>
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
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Run ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No test runs found
              </TableCell>
            </TableRow>
          ) : (
            runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell className="font-medium">{run.id}</TableCell>
                <TableCell>{getStatusBadge(run.status)}</TableCell>
                <TableCell>{run.device}</TableCell>
                <TableCell>{format(new Date(run.startedAt), "PPp")}</TableCell>
                <TableCell>{formatDuration(run.durationSec)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(run.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}