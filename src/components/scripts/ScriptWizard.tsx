"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TestTube2,
  Smartphone,
  Settings,
  Activity,
  Terminal,
  Shield,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Download,
  GitBranch,
  GitlabIcon,
  CircleDot,
  Boxes,
  Code,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  // Step 1: What to run
  runConfigId: string;
  runConfigName: string;
  metadata: Record<string, string>;

  // Step 2: Devices
  deviceMode: "group" | "explicit";
  deviceGroup?: {
    platform?: "ios" | "android";
    osMin?: string;
    osMax?: string;
    tags?: string[];
  };
  deviceIds?: string[];
  maxConcurrency: number;
  fallback: "any_matching" | "none";

  // Step 3: Execution
  runTimeoutSec: number;
  retries: number;
  overlapPolicy: "allow_parallel" | "skip_new" | "cancel_old_and_start_new";
  priority: "low" | "normal" | "high";

  // Step 4: Streaming
  streamingMode: "sse" | "websocket" | "polling";
  waitForResult: boolean;
  successCodes: string[];

  // Step 5: CI Target
  language: "shell" | "node" | "powershell";
  ciTypes: string[];

  // Step 6: Secrets
  envVars: { name: string; value: string }[];

  // Step 7: Output
  tokenName: string;
  generatedScript: string;
  ciSnippets: Record<string, string>;
}

const initialData: FormData = {
  runConfigId: "",
  runConfigName: "",
  metadata: {},
  deviceMode: "group",
  deviceGroup: { platform: "ios" },
  deviceIds: [],
  maxConcurrency: 5,
  fallback: "any_matching",
  runTimeoutSec: 1800,
  retries: 2,
  overlapPolicy: "allow_parallel",
  priority: "normal",
  streamingMode: "sse",
  waitForResult: true,
  successCodes: ["success", "flaky"],
  language: "shell",
  ciTypes: [],
  envVars: [
    { name: "TESTLAB_URL", value: "https://api.testlab.io" },
    { name: "TESTLAB_TOKEN", value: "${{ secrets.TESTLAB_TOKEN }}" },
  ],
  tokenName: "",
  generatedScript: "",
  ciSnippets: {},
};

export function ScriptWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [copied, setCopied] = useState(false);

  const steps = [
    { number: 1, title: "What to run", icon: TestTube2 },
    { number: 2, title: "Devices", icon: Smartphone },
    { number: 3, title: "Execution", icon: Settings },
    { number: 4, title: "Streaming", icon: Activity },
    { number: 5, title: "CI Target", icon: Terminal },
    { number: 6, title: "Secrets", icon: Shield },
    { number: 7, title: "Output", icon: FileText },
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      if (currentStep === 6) {
        // Generate script when moving to step 7
        generateScript();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateScript = () => {
    // Generate bash script
    const bashScript = `#!/bin/bash
# TestLab CI Token - ${formData.tokenName || "Test Runner"}
# Generated on ${new Date().toISOString()}

# Configuration
export TESTLAB_URL="\${TESTLAB_URL:-https://api.testlab.io}"
export TESTLAB_TOKEN="\${TESTLAB_TOKEN}"

# Validate environment
if [ -z "$TESTLAB_TOKEN" ]; then
  echo "Error: TESTLAB_TOKEN environment variable is not set"
  exit 1
fi

# Start test run
echo "Starting test run..."
RUN_ID=$(curl -s -X POST \\
  "$TESTLAB_URL/runs" \\
  -H "Authorization: Bearer $TESTLAB_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "configId": "${formData.runConfigId}",
    "devices": ${JSON.stringify(formData.deviceMode === "group" ? formData.deviceGroup : formData.deviceIds)},
    "maxConcurrency": ${formData.maxConcurrency},
    "timeout": ${formData.runTimeoutSec},
    "retries": ${formData.retries},
    "priority": "${formData.priority}"
  }' | jq -r '.runId')

echo "Test run started with ID: $RUN_ID"

${formData.waitForResult ? `# Wait for completion
while true; do
  STATUS=$(curl -s \\
    "$TESTLAB_URL/runs/$RUN_ID/status" \\
    -H "Authorization: Bearer $TESTLAB_TOKEN" | jq -r '.status')
  
  if [[ " ${formData.successCodes.join(" ")} " =~ " $STATUS " ]]; then
    echo "Test run completed successfully: $STATUS"
    exit 0
  elif [ "$STATUS" = "failed" ]; then
    echo "Test run failed"
    exit 1
  fi
  
  sleep 10
done` : "# Non-blocking mode - script completes immediately"}`;

    // Generate CI snippets
    const githubSnippet = `name: TestLab Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run TestLab Tests
        env:
          TESTLAB_TOKEN: \${{ secrets.TESTLAB_TOKEN }}
        run: |
          chmod +x ./scripts/testlab-run.sh
          ./scripts/testlab-run.sh`;

    const gitlabSnippet = `testlab:
  stage: test
  script:
    - chmod +x ./scripts/testlab-run.sh
    - ./scripts/testlab-run.sh
  variables:
    TESTLAB_TOKEN: \${TESTLAB_TOKEN}`;

    setFormData(prev => ({
      ...prev,
      generatedScript: bashScript,
      ciSnippets: {
        github: githubSnippet,
        gitlab: gitlabSnippet,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting script data:", formData);
    router.push("/scripts");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.runConfigId !== "";
      case 2:
        return formData.maxConcurrency > 0;
      case 3:
        return formData.runTimeoutSec > 0;
      case 4:
        return formData.successCodes.length > 0;
      case 5:
        return formData.ciTypes.length > 0;
      case 6:
        return true;
      case 7:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TestTube2 className="h-12 w-12 text-[var(--brand-primary-500)] mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">What to Run</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Select the test suite or configuration to execute
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  Test Suite / Run Configuration *
                </label>
                <select
                  value={formData.runConfigId}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    runConfigId: e.target.value,
                    runConfigName: e.target.options[e.target.selectedIndex].text
                  }))}
                  className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                >
                  <option value="">Select a test suite...</option>
                  <option value="config_1">Smoke Test Suite</option>
                  <option value="config_2">Full Regression Suite</option>
                  <option value="config_3">Performance Test Suite</option>
                  <option value="config_4">Release Checklist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  Token Name
                </label>
                <input
                  type="text"
                  value={formData.tokenName}
                  onChange={(e) => setFormData(prev => ({ ...prev, tokenName: e.target.value }))}
                  placeholder="e.g., Production Test Token"
                  className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  Metadata (Optional)
                </label>
                <textarea
                  placeholder="key1=value1&#10;key2=value2"
                  className="w-full h-20 px-4 py-2 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm font-mono"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Add custom metadata as key-value pairs (one per line)
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smartphone className="h-12 w-12 text-[var(--brand-primary-500)] mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">Device Selection</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Configure which devices should run the tests
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-3">
                  Selection Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deviceMode: "group" }))}
                    className={`p-3 rounded-[var(--r-ctl)] border-2 transition-all ${
                      formData.deviceMode === "group"
                        ? "border-[var(--brand-primary-500)] bg-blue-50"
                        : "border-[var(--border-subtle)]"
                    }`}
                  >
                    <div className="text-sm font-medium text-[var(--brand-ink)]">Group Filter</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Filter by criteria</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deviceMode: "explicit" }))}
                    className={`p-3 rounded-[var(--r-ctl)] border-2 transition-all ${
                      formData.deviceMode === "explicit"
                        ? "border-[var(--brand-primary-500)] bg-blue-50"
                        : "border-[var(--border-subtle)]"
                    }`}
                  >
                    <div className="text-sm font-medium text-[var(--brand-ink)]">Explicit IDs</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Specific devices</div>
                  </button>
                </div>
              </div>

              {formData.deviceMode === "group" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.deviceGroup?.platform || ""}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        deviceGroup: { ...prev.deviceGroup, platform: e.target.value as any }
                      }))}
                      className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                    >
                      <option value="">All platforms</option>
                      <option value="ios">iOS</option>
                      <option value="android">Android</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                        OS Min Version
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 16.0"
                        className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                        OS Max Version
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 17.0"
                        className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                    Max Concurrency *
                  </label>
                  <input
                    type="number"
                    value={formData.maxConcurrency}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxConcurrency: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="20"
                    className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                    Fallback
                  </label>
                  <select
                    value={formData.fallback}
                    onChange={(e) => setFormData(prev => ({ ...prev, fallback: e.target.value as any }))}
                    className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                  >
                    <option value="any_matching">Any matching device</option>
                    <option value="none">No fallback</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="h-12 w-12 text-[var(--brand-primary-500)] mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">Execution Controls</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Configure how the tests should be executed
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                    Timeout (seconds) *
                  </label>
                  <input
                    type="number"
                    value={formData.runTimeoutSec}
                    onChange={(e) => setFormData(prev => ({ ...prev, runTimeoutSec: parseInt(e.target.value) || 1800 }))}
                    min="60"
                    max="7200"
                    className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                    Retries
                  </label>
                  <input
                    type="number"
                    value={formData.retries}
                    onChange={(e) => setFormData(prev => ({ ...prev, retries: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="5"
                    className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  Overlap Policy
                </label>
                <select
                  value={formData.overlapPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlapPolicy: e.target.value as any }))}
                  className="w-full h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-500)] focus:border-transparent text-sm"
                >
                  <option value="allow_parallel">Allow parallel runs</option>
                  <option value="skip_new">Skip if already running</option>
                  <option value="cancel_old_and_start_new">Cancel old and start new</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["low", "normal", "high"].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority as any }))}
                      className={`p-2 rounded-[var(--r-ctl)] border-2 transition-all ${
                        formData.priority === priority
                          ? "border-[var(--brand-primary-500)] bg-blue-50"
                          : "border-[var(--border-subtle)]"
                      }`}
                    >
                      <div className="text-sm font-medium text-[var(--brand-ink)] capitalize">
                        {priority}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="h-12 w-12 text-[var(--brand-primary-500)] mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">Streaming & Blocking</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Configure how to receive test results
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-3">
                  Streaming Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "sse", label: "SSE", desc: "Server-Sent Events" },
                    { value: "websocket", label: "WebSocket", desc: "Real-time bidirectional" },
                    { value: "polling", label: "Polling", desc: "Regular status checks" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, streamingMode: mode.value as any }))}
                      className={`p-3 rounded-[var(--r-ctl)] border-2 transition-all ${
                        formData.streamingMode === mode.value
                          ? "border-[var(--brand-primary-500)] bg-blue-50"
                          : "border-[var(--border-subtle)]"
                      }`}
                    >
                      <div className="text-sm font-medium text-[var(--brand-ink)]">{mode.label}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="waitForResult"
                    checked={formData.waitForResult}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, waitForResult: checked as boolean }))}
                  />
                  <label htmlFor="waitForResult" className="text-sm font-medium text-[var(--brand-ink)]">
                    Wait for result (blocking mode)
                  </label>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2 ml-6">
                  Script will wait for test completion and exit with appropriate code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-3">
                  Success Exit Codes
                </label>
                <div className="space-y-2">
                  {["success", "flaky", "skipped"].map((code) => (
                    <div key={code} className="flex items-center space-x-3">
                      <Checkbox
                        id={code}
                        checked={formData.successCodes.includes(code)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              successCodes: [...prev.successCodes, code]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              successCodes: prev.successCodes.filter(c => c !== code)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={code} className="text-sm text-[var(--brand-ink)] capitalize">
                        {code}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Terminal className="h-12 w-12 text-[var(--brand-primary-500)] mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">CI Target</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Choose script language and CI platforms
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-3">
                  Script Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "shell", label: "Shell (Bash)", icon: Terminal },
                    { value: "node", label: "Node.js", icon: Code },
                    { value: "powershell", label: "PowerShell", icon: Terminal },
                  ].map((lang) => {
                    const Icon = lang.icon;
                    return (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, language: lang.value as any }))}
                        className={`p-3 rounded-[var(--r-ctl)] border-2 transition-all ${
                          formData.language === lang.value
                            ? "border-[var(--brand-primary-500)] bg-blue-50"
                            : "border-[var(--border-subtle)]"
                        }`}
                      >
                        <Icon className="h-4 w-4 mx-auto mb-1 text-[var(--brand-primary-500)]" />
                        <div className="text-sm font-medium text-[var(--brand-ink)]">{lang.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-3">
                  CI Platforms *
                </label>
                <div className="space-y-2">
                  {[
                    { value: "github", label: "GitHub Actions" },
                    { value: "gitlab", label: "GitLab CI" },
                    { value: "jenkins", label: "Jenkins" },
                    { value: "circleci", label: "CircleCI" },
                    { value: "generic", label: "Generic (any CI)" },
                  ].map((ci) => (
                    <div key={ci.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={ci.value}
                        checked={formData.ciTypes.includes(ci.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              ciTypes: [...prev.ciTypes, ci.value]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              ciTypes: prev.ciTypes.filter(c => c !== ci.value)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={ci.value} className="text-sm text-[var(--brand-ink)]">
                        {ci.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-[var(--brand-primary-500)] mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">Secrets & Environment</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Configure environment variables and secrets
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-[var(--r-ctl)] p-4 border border-yellow-200">
                <h3 className="text-sm font-medium text-yellow-900 mb-2">Important Security Note</h3>
                <p className="text-sm text-yellow-800">
                  Never hardcode secrets in your scripts. Always use environment variables or CI secret management.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
                  Required Environment Variables
                </label>
                <div className="space-y-2">
                  {formData.envVars.map((envVar, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={envVar.name}
                        readOnly
                        className="flex-1 h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] bg-zinc-50 text-sm font-mono"
                      />
                      <input
                        type="text"
                        value={envVar.value}
                        readOnly
                        className="flex-1 h-10 px-4 rounded-[var(--r-ctl)] border border-[var(--border-subtle)] bg-zinc-50 text-sm font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[var(--brand-ink)]">How to Add Secrets in CI</h3>
                
                {formData.ciTypes.includes("github") && (
                  <div className="bg-zinc-50 rounded-[var(--r-ctl)] p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="h-4 w-4" />
                      <span className="text-sm font-medium">GitHub Actions</span>
                    </div>
                    <ol className="text-xs text-zinc-700 space-y-1 list-decimal list-inside">
                      <li>Go to Settings → Secrets → Actions</li>
                      <li>Click "New repository secret"</li>
                      <li>Add TESTLAB_TOKEN with your API token</li>
                    </ol>
                  </div>
                )}

                {formData.ciTypes.includes("gitlab") && (
                  <div className="bg-zinc-50 rounded-[var(--r-ctl)] p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <GitlabIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">GitLab CI</span>
                    </div>
                    <ol className="text-xs text-zinc-700 space-y-1 list-decimal list-inside">
                      <li>Go to Settings → CI/CD → Variables</li>
                      <li>Click "Add variable"</li>
                      <li>Add TESTLAB_TOKEN as protected and masked</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">Generated Token</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Your CI/CD token is ready to use
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[var(--brand-ink)]">Token File</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(formData.generatedScript)}
                      className="h-8 px-3"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download ZIP
                    </Button>
                  </div>
                </div>
                <pre className="bg-zinc-900 text-zinc-100 rounded-[var(--r-ctl)] p-4 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
                  {formData.generatedScript}
                </pre>
              </div>

              {formData.ciTypes.includes("github") && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--brand-ink)] mb-2">GitHub Actions Workflow</h3>
                  <pre className="bg-zinc-50 rounded-[var(--r-ctl)] p-4 text-xs font-mono overflow-x-auto border">
                    {formData.ciSnippets.github}
                  </pre>
                </div>
              )}

              {formData.ciTypes.includes("gitlab") && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--brand-ink)] mb-2">GitLab CI Configuration</h3>
                  <pre className="bg-zinc-50 rounded-[var(--r-ctl)] p-4 text-xs font-mono overflow-x-auto border">
                    {formData.ciSnippets.gitlab}
                  </pre>
                </div>
              )}

              <div className="bg-blue-50 rounded-[var(--r-ctl)] p-4 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Next Steps</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy the token script to your repository (e.g., scripts/testlab-run.sh)</li>
                  <li>Add the CI configuration to your pipeline</li>
                  <li>Set up the required secrets (TESTLAB_TOKEN)</li>
                  <li>Commit and push to trigger your first test run</li>
                </ol>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[var(--surface)] rounded-[var(--r-card)] shadow-[var(--e-1)] p-6">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                      isActive
                        ? "bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="ml-3 hidden lg:block">
                    <p
                      className={`text-sm font-medium ${
                        isActive || isCompleted ? "text-[var(--brand-ink)]" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 lg:w-12 h-0.5 mx-2 lg:mx-4 ${
                      isCompleted ? "bg-green-500" : "bg-zinc-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-[var(--border-subtle)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 7 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-tr from-[var(--brand-primary-500)] to-[var(--brand-primary-600)] hover:from-[var(--brand-primary-600)] hover:to-[var(--brand-primary-500)] text-white shadow-[0_8px_24px_rgba(41,94,236,0.25)]"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-tr from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Token
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}