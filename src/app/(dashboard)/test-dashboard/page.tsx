"use client";

import { useState } from "react";
import { DashboardLayout } from "@/app/dashboard-layout";
import { HeaderBar } from "@/components/dashboard/HeaderBar";
import { HeroKPIs } from "@/components/dashboard/HeroKPIs";
import { TrendsStrip } from "@/components/dashboard/TrendsStrip";
import { RunsTable } from "@/components/dashboard/RunsTable";
import { DevicesSidebar } from "@/components/dashboard/DevicesSidebar";
import { RunDetailDrawer } from "@/components/dashboard/RunDetailDrawer";

export default function TestDashboardPage() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDetails = (runId: string) => {
    setSelectedRunId(runId);
    setDrawerOpen(true);
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[var(--bg-page)]">
        <div className="p-6">
          <HeaderBar 
            onFiltersChange={(filters) => console.log("Filters:", filters)}
            onRerun={() => console.log("Re-running filters")}
          />
          
          <section className="grid grid-cols-12 gap-6">
            {/* Hero KPIs */}
            <HeroKPIs className="col-span-12" />
            
            {/* Trends Strip */}
            <TrendsStrip className="col-span-12" />
            
            {/* Two-column layout */}
            <div className="col-span-12 grid grid-cols-12 gap-6">
              {/* Left column - Runs Table */}
              <RunsTable 
                className="col-span-12 lg:col-span-8" 
                onOpenDetails={handleOpenDetails}
              />
              
              {/* Right column - Sidebar cards */}
              <div className="col-span-12 lg:col-span-4">
                <DevicesSidebar />
              </div>
            </div>
          </section>
        </div>
        
        {/* Run Detail Drawer */}
        <RunDetailDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          runId={selectedRunId}
        />
      </main>
    </DashboardLayout>
  );
}