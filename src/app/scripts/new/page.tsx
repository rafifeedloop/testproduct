"use client";

import { DashboardLayout } from "@/app/dashboard-layout";
import { ScriptWizard } from "@/components/scripts/ScriptWizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewScriptPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/scripts">
            <Button variant="ghost" size="sm" className="h-9 px-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
              Generate Script
            </h1>
            <p className="text-sm leading-6 text-zinc-600 mt-1">
              Create a CI/CD script to run tests from your pipeline
            </p>
          </div>
        </div>

        <ScriptWizard />
      </div>
    </DashboardLayout>
  );
}