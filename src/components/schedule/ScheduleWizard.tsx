"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Smartphone,
  Settings,
  Bell,
  Database,
  FileText,
  AlertCircle,
  PlayCircle,
  Calendar,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: WizardStep[] = [
  {
    id: "test-suite",
    title: "What to run",
    description: "Select test suite or configuration",
    icon: PlayCircle,
  },
  {
    id: "schedule",
    title: "When to run",
    description: "Set timing and recurrence",
    icon: Clock,
  },
  {
    id: "devices",
    title: "Devices",
    description: "Choose target devices",
    icon: Smartphone,
  },
  {
    id: "constraints",
    title: "Constraints",
    description: "Set limits and policies",
    icon: Settings,
  },
  {
    id: "windows",
    title: "Windows",
    description: "Define blackout periods",
    icon: Calendar,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configure alerts",
    icon: Bell,
  },
  {
    id: "artifacts",
    title: "Artifacts",
    description: "Retention policies",
    icon: Database,
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm settings",
    icon: FileText,
  },
];

export function ScheduleWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    testSuite: "",
    scheduleType: "recurring",
    cronExpression: "",
    timezone: "UTC",
    devices: [] as string[],
    deviceGroup: "",
    maxConcurrency: "5",
    timeout: "30",
    retryPolicy: "2",
    overlapHandling: "skip",
    blackoutStart: "",
    blackoutEnd: "",
    notifications: {
      slack: false,
      email: false,
      webhook: false,
    },
    notifyOn: {
      start: false,
      success: true,
      fail: true,
      flaky: true,
      skipped: false,
    },
    retentionDays: "30",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Schedule created:", formData);
    router.push("/schedule");
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "test-suite":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Schedule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Daily Regression Suite"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="test-suite">Test Suite</Label>
              <Select
                value={formData.testSuite}
                onValueChange={(value) => setFormData({ ...formData, testSuite: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a test suite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-regression">Full Regression</SelectItem>
                  <SelectItem value="smoke-tests">Smoke Tests</SelectItem>
                  <SelectItem value="performance">Performance Suite</SelectItem>
                  <SelectItem value="critical-path">Critical Path</SelectItem>
                  <SelectItem value="api-tests">API Tests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 rounded-[var(--r-ctl)] bg-blue-50 border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Test Suite Details</p>
                  <p className="text-xs text-blue-700 mt-1">
                    The selected test suite will run with its default configuration. 
                    You can override specific settings in the following steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div>
              <Label>Schedule Type</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="once"
                    checked={formData.scheduleType === "once"}
                    onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">One-time</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="recurring"
                    checked={formData.scheduleType === "recurring"}
                    onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Recurring</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="after-event"
                    checked={formData.scheduleType === "after-event"}
                    onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">After another schedule completes</span>
                </label>
              </div>
            </div>

            {formData.scheduleType === "recurring" && (
              <>
                <div>
                  <Label htmlFor="cron">Schedule Pattern</Label>
                  <Select
                    value={formData.cronExpression}
                    onValueChange={(value) => setFormData({ ...formData, cronExpression: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0 * * * *">Every hour</SelectItem>
                      <SelectItem value="0 9 * * *">Daily at 09:00</SelectItem>
                      <SelectItem value="0 9 * * 1">Weekly on Monday at 09:00</SelectItem>
                      <SelectItem value="0 0 1 * *">Monthly on 1st at 00:00</SelectItem>
                      <SelectItem value="custom">Custom CRON expression</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        );

      case "devices":
        return (
          <div className="space-y-6">
            <div>
              <Label>Device Selection Method</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="group"
                    checked={formData.deviceGroup !== ""}
                    onChange={() => setFormData({ ...formData, deviceGroup: "ios-devices" })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Device Group</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="explicit"
                    checked={formData.deviceGroup === ""}
                    onChange={() => setFormData({ ...formData, deviceGroup: "" })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Specific Devices</span>
                </label>
              </div>
            </div>

            {formData.deviceGroup ? (
              <div>
                <Label>Device Group</Label>
                <Select
                  value={formData.deviceGroup}
                  onValueChange={(value) => setFormData({ ...formData, deviceGroup: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-devices">All Devices</SelectItem>
                    <SelectItem value="ios-devices">All iOS Devices</SelectItem>
                    <SelectItem value="android-devices">All Android Devices</SelectItem>
                    <SelectItem value="flagship-phones">Flagship Phones</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>Select Devices</Label>
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {[
                    "iPhone 14 Pro",
                    "iPhone 15",
                    "Samsung Galaxy S23",
                    "Pixel 7 Pro",
                    "iPad Pro",
                    "Galaxy Tab S9",
                  ].map((device) => (
                    <label key={device} className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        checked={formData.devices.includes(device)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              devices: [...formData.devices, device],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              devices: formData.devices.filter((d) => d !== device),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{device}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-[var(--r-ctl)] bg-amber-50 border border-amber-200">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Fallback Rules</p>
                  <p className="text-xs text-amber-700 mt-1">
                    If selected devices are unavailable, the system will auto-allocate 
                    an idle device from the same platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "constraints":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="concurrency">Max Concurrent Runs</Label>
              <Input
                id="concurrency"
                type="number"
                value={formData.maxConcurrency}
                onChange={(e) => setFormData({ ...formData, maxConcurrency: e.target.value })}
                className="mt-2"
                min="1"
                max="20"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Maximum number of parallel test runs
              </p>
            </div>

            <div>
              <Label htmlFor="timeout">Run Timeout (minutes)</Label>
              <Input
                id="timeout"
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                className="mt-2"
                min="5"
                max="180"
              />
            </div>

            <div>
              <Label htmlFor="retry">Retry Policy</Label>
              <Select
                value={formData.retryPolicy}
                onValueChange={(value) => setFormData({ ...formData, retryPolicy: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No retries</SelectItem>
                  <SelectItem value="1">Retry once on failure</SelectItem>
                  <SelectItem value="2">Retry up to 2 times</SelectItem>
                  <SelectItem value="3">Retry up to 3 times</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Overlap Handling</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="allow"
                    checked={formData.overlapHandling === "allow"}
                    onChange={(e) => setFormData({ ...formData, overlapHandling: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Allow parallel runs</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="skip"
                    checked={formData.overlapHandling === "skip"}
                    onChange={(e) => setFormData({ ...formData, overlapHandling: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Skip if previous run is active</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="cancel"
                    checked={formData.overlapHandling === "cancel"}
                    onChange={(e) => setFormData({ ...formData, overlapHandling: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Cancel previous and start new</span>
                </label>
              </div>
            </div>
          </div>
        );

      case "windows":
        return (
          <div className="space-y-6">
            <div>
              <Label>Blackout Periods</Label>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">
                Define time periods when this schedule should not run
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="blackout-start">Start Time</Label>
                  <Input
                    id="blackout-start"
                    type="time"
                    value={formData.blackoutStart}
                    onChange={(e) => setFormData({ ...formData, blackoutStart: e.target.value })}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="blackout-end">End Time</Label>
                  <Input
                    id="blackout-end"
                    type="time"
                    value={formData.blackoutEnd}
                    onChange={(e) => setFormData({ ...formData, blackoutEnd: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[var(--r-ctl)] bg-blue-50 border border-blue-200">
              <div className="flex gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Maintenance Windows</p>
                  <p className="text-xs text-blue-700 mt-1">
                    You can also configure global maintenance windows in Settings 
                    that will apply to all schedules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <Label>Notification Channels</Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Slack</span>
                  <Switch
                    checked={formData.notifications.slack}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, slack: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <Switch
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, email: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Webhook</span>
                  <Switch
                    checked={formData.notifications.webhook}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, webhook: checked },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Notify On</Label>
              <div className="mt-3 space-y-3">
                {Object.entries(formData.notifyOn).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          notifyOn: { ...formData.notifyOn, [key]: checked as boolean },
                        })
                      }
                    />
                    <span className="text-sm capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "artifacts":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="retention">Artifact Retention (days)</Label>
              <Select
                value={formData.retentionDays}
                onValueChange={(value) => setFormData({ ...formData, retentionDays: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                How long to keep logs, screenshots, and videos
              </p>
            </div>

            <div className="p-4 rounded-[var(--r-ctl)] bg-blue-50 border border-blue-200">
              <div className="flex gap-2">
                <Database className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Storage Information</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Artifacts include test logs, screenshots, videos, and performance metrics. 
                    Older artifacts are automatically archived to reduce storage costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-[var(--r-ctl)] bg-green-50 border border-green-200">
              <div className="flex gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Ready to Create</p>
                  <p className="text-xs text-green-700 mt-1">
                    Review your configuration below and click Create to save the schedule.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 rounded-[var(--r-ctl)]">
                <h4 className="text-sm font-medium text-[var(--brand-ink)] mb-3">Configuration Summary</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Name</dt>
                    <dd className="text-sm text-zinc-800">{formData.name || "Not set"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Test Suite</dt>
                    <dd className="text-sm text-zinc-800">{formData.testSuite || "Not selected"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Schedule</dt>
                    <dd className="text-sm text-zinc-800">
                      {formData.scheduleType === "recurring" && formData.cronExpression
                        ? formData.cronExpression
                        : formData.scheduleType}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Devices</dt>
                    <dd className="text-sm text-zinc-800">
                      {formData.deviceGroup || `${formData.devices.length} selected`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Max Concurrency</dt>
                    <dd className="text-sm text-zinc-800">{formData.maxConcurrency}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Retention</dt>
                    <dd className="text-sm text-zinc-800">{formData.retentionDays} days</dd>
                  </div>
                </dl>
              </div>

              <div className="p-4 bg-zinc-900 rounded-[var(--r-ctl)] text-zinc-100">
                <h4 className="text-sm font-medium mb-3">JSON Preview</h4>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)]">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center h-10 w-10 rounded-full transition-all
                      ${
                        isActive
                          ? "bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-zinc-200 text-zinc-500"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-12 mx-2 transition-all ${
                        isCompleted ? "bg-green-500" : "bg-zinc-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="text-base font-semibold text-[var(--brand-ink)]">
              {steps[currentStep].title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        <div className="p-6">
          {renderStepContent()}
        </div>

        <div className="p-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="h-10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="h-10 px-6 bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
            >
              Create Schedule
              <Check className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="h-10 px-6 bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}