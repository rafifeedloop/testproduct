"use client";

import { DashboardLayout } from "@/app/dashboard-layout";
import { ScriptsList } from "@/components/scripts/ScriptsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ScriptsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
              Token
            </h1>
            <p className="text-sm leading-6 text-zinc-600 mt-1">
              Generate CI/CD tokens to integrate test runs into your pipelines
            </p>
          </div>
          <Link href="/scripts/new">
            <Button className="bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] hover:from-[var(--brand-primary-600)] hover:to-[var(--brand-primary-500)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]">
              <Plus className="h-4 w-4 mr-2" />
              Generate Token
            </Button>
          </Link>
        </div>

        <ScriptsList />
      </div>
    </DashboardLayout>
  );
}