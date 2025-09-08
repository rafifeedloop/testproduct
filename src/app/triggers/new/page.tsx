"use client";

import { TriggerWizard } from "@/components/triggers/TriggerWizard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/app/dashboard-layout";

export default function NewTriggerPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <Link href="/triggers">
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Triggers
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
            Create New Trigger
          </h1>
          <p className="text-sm leading-6 text-zinc-600 mt-1">
            Set up event-driven test automation with custom conditions and configurations
          </p>
        </div>

        <TriggerWizard />
      </div>
    </DashboardLayout>
  );
}