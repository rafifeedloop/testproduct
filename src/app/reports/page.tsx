import { DashboardLayout } from "../dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Activity, BarChart3, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--bg-page)]">
        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold leading-8 text-[var(--brand-ink)]">
              Reports
            </h1>
            <div className="flex items-center gap-3">
              <Select defaultValue="7days">
                <SelectTrigger className="h-10 w-[140px] text-sm rounded-[var(--r-ctl)] border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--e-1)]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 hours</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="h-10 text-sm rounded-[var(--r-ctl)] bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] hover:shadow-[0_8px_24px_rgba(41,94,236,0.25)] transition-shadow"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-[var(--r-chip)] bg-gradient-to-tr from-green-500 to-green-600 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-green-600 font-medium">+12%</span>
              </div>
              <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
                89.2%
              </div>
              <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Overall Pass Rate</p>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-[var(--r-chip)] bg-[var(--brand-warn)] flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-[var(--brand-danger)] font-medium">-5%</span>
              </div>
              <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
                1,247
              </div>
              <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Total Test Runs</p>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-[var(--r-chip)] bg-zinc-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-[var(--brand-ink)]" />
                </div>
                <span className="text-xs text-green-600 font-medium">-18%</span>
              </div>
              <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
                3m 24s
              </div>
              <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Avg Execution Time</p>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-[var(--r-chip)] bg-[var(--brand-danger)] flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-[var(--brand-warn)] font-medium">+2%</span>
              </div>
              <div className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--brand-ink)]">
                156
              </div>
              <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Failed Tests</p>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
              <h3 className="text-base font-semibold leading-6 text-[var(--brand-ink)] mb-4">
                Pass Rate Trend
              </h3>
              <div className="h-64 bg-zinc-50 rounded-[var(--r-ctl)] flex items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">Line chart placeholder</p>
              </div>
            </Card>

            <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
              <h3 className="text-base font-semibold leading-6 text-[var(--brand-ink)] mb-4">
                Test Distribution by Device
              </h3>
              <div className="h-64 bg-zinc-50 rounded-[var(--r-ctl)] flex items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">Pie chart placeholder</p>
              </div>
            </Card>
          </div>

          {/* Test Suite Performance */}
          <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0">
            <h3 className="text-base font-semibold leading-6 text-[var(--brand-ink)] mb-4">
              Test Suite Performance
            </h3>
            <div className="space-y-3">
              {[
                { name: "Authentication Suite", pass: 95, total: 100 },
                { name: "Payment Flow", pass: 87, total: 90 },
                { name: "User Dashboard", pass: 120, total: 125 },
                { name: "API Integration", pass: 45, total: 50 },
                { name: "Mobile Responsiveness", pass: 72, total: 80 },
              ].map((suite, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-48">
                    <p className="text-sm font-medium text-[var(--brand-ink)]">{suite.name}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--brand-primary-500)] to-[var(--brand-primary-600)]"
                        style={{ width: `${(suite.pass / suite.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-[var(--brand-ink)] tabular-nums">
                      {suite.pass}/{suite.total}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-green-600 tabular-nums">
                      {Math.round((suite.pass / suite.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}