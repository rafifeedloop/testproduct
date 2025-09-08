"use client";

import { useState } from "react";
import { ScheduleList } from "@/components/schedule/ScheduleList";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, List } from "lucide-react";
import Link from "next/link";

export default function SchedulePage() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
                Schedule
              </h1>
              <p className="text-sm leading-6 text-zinc-600 mt-1">
                Automate test runs at specific times and intervals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-[var(--surface)] rounded-[var(--r-ctl)] shadow-[var(--e-1)]">
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className={`h-8 px-3 ${
                    view === "list"
                      ? "bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
                      : ""
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={view === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("calendar")}
                  className={`h-8 px-3 ${
                    view === "calendar"
                      ? "bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
                      : ""
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>
              <Link href="/schedule/new">
                <Button className="h-10 px-4 bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)] hover:shadow-[0_10px_28px_rgba(41,94,236,0.35)]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {view === "list" ? <ScheduleList /> : <ScheduleCalendar />}
      </div>
    </div>
  );
}