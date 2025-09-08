"use client";

import { ScheduleWizard } from "@/components/schedule/ScheduleWizard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewSchedulePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/schedule">
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schedules
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
            Create New Schedule
          </h1>
          <p className="text-sm leading-6 text-zinc-600 mt-1">
            Set up automated test runs with custom timing and configurations
          </p>
        </div>

        <ScheduleWizard />
      </div>
    </div>
  );
}