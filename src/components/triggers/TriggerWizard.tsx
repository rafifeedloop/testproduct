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
  Zap,
  GitBranch,
  Webhook,
  Link as LinkIcon,
  Play,
  Smartphone,
  Settings,
  Bell,
  FileText,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";

type TriggerType = 'ci_push' | 'ci_pipeline' | 'webhook' | 'after_run' | 'manual';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: WizardStep[] = [
  {
    id: "definition",
    title: "Definition",
    description: "Name and trigger type",
    icon: Zap,
  },
  {
    id: "conditions",
    title: "Conditions",
    description: "When to trigger",
    icon: GitBranch,
  },
  {
    id: "test-suite",
    title: "What to run",
    description: "Select test configuration",
    icon: Play,
  },
  {
    id: "devices",
    title: "Devices",
    description: "Target devices",
    icon: Smartphone,
  },
  {
    id: "execution",
    title: "Execution",
    description: "Runtime controls",
    icon: Settings,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alert settings",
    icon: Bell,
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm settings",
    icon: FileText,
  },
];

export function TriggerWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    type: "" as TriggerType,
    
    // Conditions
    provider: "",
    repo: "",
    branchPattern: "",
    event: "",
    pipelineStatus: "",
    afterRunConfigId: "",
    webhookHeaders: "",
    webhookFilters: "",
    
    // What to run
    testSuite: "",
    
    // Devices
    deviceMode: "group",
    deviceGroup: "",
    deviceIds: [] as string[],
    fallback: "any_matching",
    maxConcurrency: "5",
    
    // Execution
    timeout: "30",
    retries: "2",
    overlapPolicy: "skip_new",
    priority: "normal",
    
    // Notifications
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
    console.log("Trigger created:", formData);
    router.push("/triggers");
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "definition":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Trigger Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Branch Push Trigger"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Trigger Type</Label>
              <div className="mt-3 space-y-3">
                {[
                  { value: 'ci_push', label: 'CI Push/Merge', desc: 'Trigger on git push or pull request merge', icon: GitBranch },
                  { value: 'ci_pipeline', label: 'Pipeline Stage', desc: 'Trigger when a CI pipeline completes', icon: Zap },
                  { value: 'webhook', label: 'Generic Webhook', desc: 'Trigger from external webhook calls', icon: Webhook },
                  { value: 'after_run', label: 'After Run', desc: 'Chain after another test run completes', icon: LinkIcon },
                  { value: 'manual', label: 'Manual', desc: 'Manual trigger for debugging', icon: Play },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <label key={type.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] hover:bg-zinc-50 transition-colors">
                      <input
                        type="radio"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as TriggerType })}
                        className="h-4 w-4 text-[var(--brand-primary-500)] mt-1"
                      />
                      <Icon className="h-5 w-5 text-[var(--brand-primary-500)] mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[var(--brand-ink)]">{type.label}</span>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{type.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "conditions":
        return (
          <div className="space-y-6">
            {formData.type === "ci_push" && (
              <>
                <div>
                  <Label>Git Provider</Label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value) => setFormData({ ...formData, provider: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="gitlab">GitLab</SelectItem>
                      <SelectItem value="bitbucket">Bitbucket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="repo">Repository</Label>
                  <Input
                    id="repo"
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    placeholder="e.g., myorg/myrepo"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="branch">Branch Pattern</Label>
                  <Input
                    id="branch"
                    value={formData.branchPattern}
                    onChange={(e) => setFormData({ ...formData, branchPattern: e.target.value })}
                    placeholder="e.g., main, release/*, feature/*"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Event Type</Label>
                  <Select
                    value={formData.event}
                    onValueChange={(value) => setFormData({ ...formData, event: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="pull_request_merged">Pull Request Merged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.type === "ci_pipeline" && (
              <>
                <div>
                  <Label>CI Provider</Label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value) => setFormData({ ...formData, provider: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">GitHub Actions</SelectItem>
                      <SelectItem value="gitlab">GitLab CI</SelectItem>
                      <SelectItem value="jenkins">Jenkins</SelectItem>
                      <SelectItem value="azure">Azure DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="repo">Repository</Label>
                  <Input
                    id="repo"
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    placeholder="e.g., myorg/myrepo"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Pipeline Status</Label>
                  <Select
                    value={formData.pipelineStatus}
                    onValueChange={(value) => setFormData({ ...formData, pipelineStatus: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select status condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="always">Always (any status)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.type === "webhook" && (
              <>
                <div className="p-4 rounded-[var(--r-ctl)] bg-blue-50 border border-blue-200">
                  <div className="flex gap-2">
                    <Webhook className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Webhook URL</p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-white px-2 py-1 rounded border text-blue-800">
                          https://api.testlab.io/webhooks/abc123def456
                        </code>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Use this URL to receive webhook calls from external systems
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="headers">Required Headers (optional)</Label>
                  <Textarea
                    id="headers"
                    value={formData.webhookHeaders}
                    onChange={(e) => setFormData({ ...formData, webhookHeaders: e.target.value })}
                    placeholder='{"X-Custom-Header": "expected-value"}'
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="filters">JSONPath Filters (optional)</Label>
                  <Textarea
                    id="filters"
                    value={formData.webhookFilters}
                    onChange={(e) => setFormData({ ...formData, webhookFilters: e.target.value })}
                    placeholder="$.environment == 'production' && $.event == 'deploy'"
                    className="mt-2"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Filter webhook payloads using JSONPath expressions
                  </p>
                </div>
              </>
            )}

            {formData.type === "after_run" && (
              <>
                <div>
                  <Label>Source Run Configuration</Label>
                  <Select
                    value={formData.afterRunConfigId}
                    onValueChange={(value) => setFormData({ ...formData, afterRunConfigId: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select run to chain after" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smoke-tests">Smoke Tests</SelectItem>
                      <SelectItem value="regression">Full Regression</SelectItem>
                      <SelectItem value="api-tests">API Tests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Result Condition</Label>
                  <Select
                    value={formData.pipelineStatus}
                    onValueChange={(value) => setFormData({ ...formData, pipelineStatus: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Trigger when source run..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Succeeds</SelectItem>
                      <SelectItem value="failed">Fails</SelectItem>
                      <SelectItem value="always">Completes (any result)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.type === "manual" && (
              <div className="p-4 rounded-[var(--r-ctl)] bg-gray-50 border border-gray-200">
                <div className="flex gap-2">
                  <Play className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Manual Trigger</p>
                    <p className="text-xs text-gray-600 mt-1">
                      This trigger can only be executed manually from the trigger detail page or via API call.
                      Perfect for debugging or ad-hoc test runs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "test-suite":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="test-suite">Test Suite / Configuration</Label>
              <Select
                value={formData.testSuite}
                onValueChange={(value) => setFormData({ ...formData, testSuite: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select what to run" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-regression">Full Regression Suite</SelectItem>
                  <SelectItem value="smoke-tests">Smoke Tests</SelectItem>
                  <SelectItem value="performance">Performance Suite</SelectItem>
                  <SelectItem value="critical-path">Critical Path Tests</SelectItem>
                  <SelectItem value="api-tests">API Tests</SelectItem>
                  <SelectItem value="custom-config-1">Custom Config #1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-[var(--r-ctl)] bg-blue-50 border border-blue-200">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Test Configuration</p>
                  <p className="text-xs text-blue-700 mt-1">
                    The selected test suite will run with its default configuration. 
                    Device selection and execution settings can be overridden in the next steps.
                  </p>
                </div>
              </div>
            </div>
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
                    checked={formData.deviceMode === "group"}
                    onChange={(e) => setFormData({ ...formData, deviceMode: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Device Group (filter by criteria)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="explicit"
                    checked={formData.deviceMode === "explicit"}
                    onChange={(e) => setFormData({ ...formData, deviceMode: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)]"
                  />
                  <span className="text-sm">Specific Devices</span>
                </label>
              </div>
            </div>

            {formData.deviceMode === "group" ? (
              <div>
                <Label>Device Group</Label>
                <Select
                  value={formData.deviceGroup}
                  onValueChange={(value) => setFormData({ ...formData, deviceGroup: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select device criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-devices">All Devices</SelectItem>
                    <SelectItem value="ios-devices">All iOS Devices</SelectItem>
                    <SelectItem value="android-devices">All Android Devices</SelectItem>
                    <SelectItem value="flagship-phones">Flagship Phones</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="performance-devices">Performance Test Devices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>Select Devices</Label>
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {[
                    "iPhone 14 Pro", "iPhone 15", "Samsung Galaxy S23", "Pixel 7 Pro",
                    "iPad Pro", "Galaxy Tab S9", "iPhone 13", "Galaxy S22"
                  ].map((device) => (
                    <label key={device} className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        checked={formData.deviceIds.includes(device)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              deviceIds: [...formData.deviceIds, device],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              deviceIds: formData.deviceIds.filter((d) => d !== device),
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

            <div>
              <Label>Fallback Strategy</Label>
              <Select
                value={formData.fallback}
                onValueChange={(value) => setFormData({ ...formData, fallback: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_matching">Use any matching available device</SelectItem>
                  <SelectItem value="none">Skip if selected devices unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="concurrency">Max Concurrent Devices</Label>
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
                Maximum number of devices to run in parallel
              </p>
            </div>
          </div>
        );

      case "execution":
        return (
          <div className="space-y-6">
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
              <Label>Retry Policy</Label>
              <Select
                value={formData.retries}
                onValueChange={(value) => setFormData({ ...formData, retries: value })}
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
              <Label>Overlap Policy</Label>
              <div className="mt-3 space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="allow_parallel"
                    checked={formData.overlapPolicy === "allow_parallel"}
                    onChange={(e) => setFormData({ ...formData, overlapPolicy: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)] mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium">Allow parallel runs</span>
                    <p className="text-xs text-[var(--text-muted)]">Multiple instances can run simultaneously</p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="skip_new"
                    checked={formData.overlapPolicy === "skip_new"}
                    onChange={(e) => setFormData({ ...formData, overlapPolicy: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)] mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium">Skip if running</span>
                    <p className="text-xs text-[var(--text-muted)]">Skip new trigger if previous run is still active</p>
                  </div>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="cancel_old_and_start_new"
                    checked={formData.overlapPolicy === "cancel_old_and_start_new"}
                    onChange={(e) => setFormData({ ...formData, overlapPolicy: e.target.value })}
                    className="h-4 w-4 text-[var(--brand-primary-500)] mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium">Cancel and restart</span>
                    <p className="text-xs text-[var(--text-muted)]">Cancel previous run and start new one</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
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
                  <div>
                    <span className="text-sm font-medium">Slack</span>
                    <p className="text-xs text-[var(--text-muted)]">Send notifications to Slack channels</p>
                  </div>
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
                  <div>
                    <span className="text-sm font-medium">Email</span>
                    <p className="text-xs text-[var(--text-muted)]">Send email notifications</p>
                  </div>
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
                  <div>
                    <span className="text-sm font-medium">Webhook</span>
                    <p className="text-xs text-[var(--text-muted)]">Send HTTP webhook notifications</p>
                  </div>
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
                    <span className="text-sm capitalize">{key === 'fail' ? 'Failure' : key}</span>
                  </label>
                ))}
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
                    Review your trigger configuration below and click Create to save.
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
                    <dt className="text-xs text-[var(--text-muted)]">Type</dt>
                    <dd className="text-sm text-zinc-800">{formData.type || "Not selected"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Test Suite</dt>
                    <dd className="text-sm text-zinc-800">{formData.testSuite || "Not selected"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Devices</dt>
                    <dd className="text-sm text-zinc-800">
                      {formData.deviceMode === "group" 
                        ? formData.deviceGroup || "Not selected"
                        : `${formData.deviceIds.length} selected`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Max Concurrency</dt>
                    <dd className="text-sm text-zinc-800">{formData.maxConcurrency}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-[var(--text-muted)]">Priority</dt>
                    <dd className="text-sm text-zinc-800">{formData.priority}</dd>
                  </div>
                </dl>
              </div>

              <div className="p-4 bg-zinc-900 rounded-[var(--r-ctl)] text-zinc-100">
                <h4 className="text-sm font-medium mb-3">JSON Definition</h4>
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
              Create Trigger
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