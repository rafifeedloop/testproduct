"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Settings, Smartphone, FileJson, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { devices, devicePresets } from "@/lib/mock-data";
import { savedScenarios } from "@/lib/scenario-mock-data";

interface SelectedDevices {
  [key: string]: boolean;
}

export default function BulkTestConfigPage() {
  const router = useRouter();
  const [testName, setTestName] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("");
  const [iterationCount, setIterationCount] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevices>({});
  const [selectedPreset, setSelectedPreset] = useState("");

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = devicePresets.find(p => p.id === presetId);
    if (preset) {
      const newSelection: SelectedDevices = {};
      preset.deviceIds.forEach(deviceId => {
        newSelection[deviceId] = true;
      });
      setSelectedDevices(newSelection);
    }
  };

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
    setSelectedPreset("");
  };

  const getSelectedDeviceCount = () => {
    return Object.values(selectedDevices).filter(Boolean).length;
  };

  const getTotalRunsCount = () => {
    return getSelectedDeviceCount() * iterationCount;
  };

  const handleStartBulkTest = () => {
    const selectedDeviceIds = Object.keys(selectedDevices).filter(id => selectedDevices[id]);

    const config = {
      name: testName,
      scenarioId: selectedScenario,
      deviceIds: selectedDeviceIds,
      iterationCount: iterationCount
    };

    console.log("Starting bulk test with config:", config);
    router.push(`/bulk-test-results/bulk-run-${Date.now()}`);
  };

  const isConfigValid = testName && selectedScenario && getSelectedDeviceCount() > 0 && iterationCount > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bulk Test Configuration</h1>
            <p className="text-muted-foreground">Set up a test to run across multiple devices and iterations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Test Configuration
                </CardTitle>
                <CardDescription>
                  Define the basic parameters for your bulk test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input
                    id="test-name"
                    placeholder="e.g., iOS 17 Login Regression"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="scenario">Test Scenario</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a test scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                        <FileJson className="h-4 w-4" />
                        <span className="font-medium">Available Scenarios</span>
                      </div>
                      <Separator className="my-1" />
                      {savedScenarios.filter(s => s.status === "published").map(scenario => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span>{scenario.name}</span>
                              <Badge variant="outline" className="text-xs">v{scenario.version}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{scenario.description}</span>
                            <div className="flex gap-1 mt-1">
                              {scenario.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs py-0 px-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                      <Separator className="my-1" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => router.push("/scenarios/editor/new")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Scenario
                      </Button>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="iterations">Iterations per Device</Label>
                  <Input
                    id="iterations"
                    type="number"
                    min="1"
                    max="100"
                    value={iterationCount}
                    onChange={(e) => setIterationCount(parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of times to run the test on each selected device (1-100)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Device Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Selection
                </CardTitle>
                <CardDescription>
                  Choose devices to run your test on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preset">Quick Select Preset</Label>
                  <Select value={selectedPreset} onValueChange={handlePresetChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a device preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {devicePresets.map(preset => (
                        <SelectItem key={preset.id} value={preset.id}>
                          <div className="flex flex-col">
                            <span>{preset.name}</span>
                            <span className="text-xs text-muted-foreground">{preset.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label>Individual Device Selection</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {devices.map(device => (
                      <div key={device.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={device.id}
                          checked={selectedDevices[device.id] || false}
                          onCheckedChange={() => handleDeviceToggle(device.id)}
                        />
                        <Label htmlFor={device.id} className="flex items-center gap-2 cursor-pointer">
                          <span>{device.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {device.os} {device.version}
                          </Badge>
                          <Badge variant={device.state === "Idle" ? "secondary" : "default"} className="text-xs">
                            {device.state}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Test Summary</CardTitle>
                <CardDescription>Review your configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Test Name:</span>
                    <span className="text-sm font-medium">{testName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Scenario:</span>
                    <span className="text-sm font-medium">
                      {selectedScenario
                        ? savedScenarios.find(s => s.id === selectedScenario)?.name
                        : "Not selected"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Devices:</span>
                    <span className="text-sm font-medium">{getSelectedDeviceCount()} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Iterations:</span>
                    <span className="text-sm font-medium">{iterationCount} per device</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Runs:</span>
                    <span>{getTotalRunsCount()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!isConfigValid}
                  onClick={handleStartBulkTest}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Bulk Test
                </Button>

                {!isConfigValid && (
                  <p className="text-xs text-muted-foreground">
                    Please complete all required fields to start the test
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}