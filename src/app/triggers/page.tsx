"use client";

import { TriggersList } from "@/components/triggers/TriggersList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/app/dashboard-layout";

export default function TriggersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
                Triggers
              </h1>
              <p className="text-sm leading-6 text-zinc-600 mt-1">
                Automate test runs triggered by CI/CD events, webhooks, and other external events
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/triggers/new">
                <Button className="h-10 px-4 bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)] hover:shadow-[0_10px_28px_rgba(41,94,236,0.35)]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Trigger
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <TriggersList />
      </div>
    </DashboardLayout>
  );
}