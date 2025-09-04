"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Smartphone, Tablet, Plus, Settings, Download, Upload,
  Activity, TrendingUp, AlertCircle, CheckCircle2,
  Clock, Zap, Server, Cloud
} from "lucide-react";

interface DevicesSidebarProps {
  stats?: {
    totalDevices: number;
    activeTests: number;
    avgUtilization: number;
    failureRate: number;
  };
}

export function DevicesSidebar({ stats = {
  totalDevices: 10,
  activeTests: 3,
  avgUtilization: 68,
  failureRate: 12
} }: DevicesSidebarProps) {
  
  const recentActivity = [
    { id: 1, device: "iPhone 15 Pro", action: "Allocated", time: "2 mins ago", user: "john.doe" },
    { id: 2, device: "Pixel 8 Pro", action: "Released", time: "5 mins ago", user: "jane.smith" },
    { id: 3, device: "Galaxy S24", action: "Reserved", time: "12 mins ago", user: "mike.wilson" },
    { id: 4, device: "iPad Pro", action: "Test Started", time: "18 mins ago", user: "sarah.chen" },
    { id: 5, device: "OnePlus 11", action: "Test Completed", time: "25 mins ago", user: "alex.kumar" },
  ];

  const deviceGroups = [
    { name: "iOS Devices", count: 4, available: 2, icon: <Smartphone className="h-4 w-4" /> },
    { name: "Android Devices", count: 5, available: 3, icon: <Smartphone className="h-4 w-4" /> },
    { name: "Tablets", count: 2, available: 1, icon: <Tablet className="h-4 w-4" /> },
    { name: "Emulators", count: 3, available: 2, icon: <Server className="h-4 w-4" /> },
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case "Allocated":
      case "Test Started":
        return "text-blue-600";
      case "Released":
      case "Test Completed":
        return "text-green-600";
      case "Reserved":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="w-80 space-y-4">
      {/* Quick Actions */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
        <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 text-xs rounded-[var(--r-ctl)] border-[var(--border-subtle)] hover:bg-blue-50 hover:border-blue-300"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Device
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 text-xs rounded-[var(--r-ctl)] border-[var(--border-subtle)] hover:bg-gray-50"
          >
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 text-xs rounded-[var(--r-ctl)] border-[var(--border-subtle)] hover:bg-gray-50"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 text-xs rounded-[var(--r-ctl)] border-[var(--border-subtle)] hover:bg-gray-50"
          >
            <Upload className="h-3 w-3 mr-1" />
            Import
          </Button>
        </div>
      </Card>

      {/* Device Stats */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
        <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Device Statistics</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Active Tests</span>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-0 rounded-[var(--r-chip)]">
              {stats.activeTests}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Utilization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${stats.avgUtilization}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--brand-ink)]">{stats.avgUtilization}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Failure Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                  style={{ width: `${stats.failureRate}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--brand-ink)]">{stats.failureRate}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Total Devices</span>
            </div>
            <Badge className="bg-gray-100 text-gray-700 border-0 rounded-[var(--r-chip)]">
              {stats.totalDevices}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Device Groups */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
        <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-3">Device Groups</h3>
        <div className="space-y-2">
          {deviceGroups.map((group, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--r-chip)] bg-gray-100 flex items-center justify-center">
                  {group.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--brand-ink)]">{group.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{group.count} devices</p>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-[var(--r-chip)] text-xs">
                {group.available}/{group.count}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-[var(--surface)] rounded-[var(--r-card)] p-4 shadow-[var(--e-1)] border-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--brand-ink)]">Recent Activity</h3>
          <Badge variant="secondary" className="rounded-[var(--r-chip)] text-xs">
            Live
          </Badge>
        </div>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[var(--brand-ink)]">
                      {activity.device}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">by {activity.user}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{activity.time}</span>
                </div>
                {activity.id < recentActivity.length && (
                  <Separator className="mt-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Cloud Status */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[var(--r-card)] p-4 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[var(--r-chip)] bg-white flex items-center justify-center shadow-sm">
            <Cloud className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[var(--brand-ink)] mb-1">Cloud Sync Active</h4>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              All devices synced with cloud infrastructure
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}