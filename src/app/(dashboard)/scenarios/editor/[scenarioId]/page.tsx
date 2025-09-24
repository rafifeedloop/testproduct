"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Play,
  Code,
  Eye,
  Plus,
  Trash2,
  Copy,
  Upload,
  Download,
  GitBranch,
  Settings,
  Variable
} from "lucide-react";
import { scenarioTemplates } from "@/lib/scenario-templates";
import type { TestScenario, ScenarioStep, ScenarioParameter, ScenarioVariable } from "@/types/scenario";

export default function ScenarioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioId = params.scenarioId as string;
  const templateId = searchParams.get("template");

  const [scenario, setScenario] = useState<TestScenario>({
    id: scenarioId === "new" ? `scenario-${Date.now()}` : scenarioId,
    name: "",
    description: "",
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "current.user@example.com",
    tags: [],
    parameters: [],
    variables: [],
    steps: [],
    status: "draft"
  });

  const [jsonView, setJsonView] = useState(false);
  const [jsonError, setJsonError] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (templateId) {
      const template = scenarioTemplates.find(t => t.id === templateId);
      if (template && template.scenario) {
        setScenario(prev => ({
          ...prev,
          ...template.scenario,
          id: prev.id,
          createdAt: prev.createdAt,
          updatedAt: prev.updatedAt,
          createdBy: prev.createdBy
        }));
      }
    } else if (scenarioId !== "new") {
      // Load existing scenario (mock data for now)
      console.log("Loading scenario:", scenarioId);
    }
  }, [scenarioId, templateId]);

  const handleSave = () => {
    console.log("Saving scenario:", scenario);
    // In real app, this would save to API
    router.push("/scenarios");
  };

  const handlePublish = () => {
    setScenario(prev => ({ ...prev, status: "published" }));
    handleSave();
  };

  const handleJsonEdit = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setScenario(parsed);
      setJsonError("");
    } catch (error: any) {
      setJsonError(error.message);
    }
  };

  const addParameter = () => {
    const newParam: ScenarioParameter = {
      name: `param_${scenario.parameters.length + 1}`,
      type: "string",
      required: false,
      description: ""
    };
    setScenario(prev => ({
      ...prev,
      parameters: [...prev.parameters, newParam]
    }));
  };

  const addVariable = () => {
    const newVar: ScenarioVariable = {
      name: `var_${scenario.variables.length + 1}`,
      type: "string",
      scope: "local"
    };
    setScenario(prev => ({
      ...prev,
      variables: [...prev.variables, newVar]
    }));
  };

  const addStep = () => {
    const newStep: ScenarioStep = {
      id: `step-${scenario.steps.length + 1}`,
      name: "New Step",
      type: "tap",
      parameters: {
        selector: "",
        selectorType: "id"
      }
    };
    setScenario(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (index: number, updates: Partial<ScenarioStep>) => {
    setScenario(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, ...updates } : step
      )
    }));
  };

  const removeStep = (index: number) => {
    setScenario(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag && !scenario.tags.includes(newTag)) {
      setScenario(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setScenario(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const exportScenario = () => {
    const exportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      scenarios: [scenario]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scenario.name.replace(/\s+/g, "-").toLowerCase()}-v${scenario.version}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {scenarioId === "new" ? "Create New Scenario" : "Edit Scenario"}
              </h1>
              <p className="text-muted-foreground">
                Design and configure your test scenario
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportScenario}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setJsonView(!jsonView)}>
              {jsonView ? <Eye className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
              {jsonView ? "Visual Editor" : "JSON View"}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish}>
              <GitBranch className="h-4 w-4 mr-2" />
              Publish v{scenario.version}
            </Button>
          </div>
        </div>

        {jsonView ? (
          // JSON Editor View
          <Card>
            <CardHeader>
              <CardTitle>JSON Editor</CardTitle>
              <CardDescription>
                Edit the scenario configuration directly in JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jsonError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  JSON Error: {jsonError}
                </div>
              )}
              <Textarea
                className="font-mono text-sm min-h-[600px]"
                value={JSON.stringify(scenario, null, 2)}
                onChange={(e) => handleJsonEdit(e.target.value)}
              />
            </CardContent>
          </Card>
        ) : (
          // Visual Editor View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Scenario Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Scenario Name</Label>
                    <Input
                      id="name"
                      value={scenario.name}
                      onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
                      placeholder="e.g., User Login Flow"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={scenario.description}
                      onChange={(e) => setScenario({ ...scenario, description: e.target.value })}
                      placeholder="Describe what this scenario tests..."
                    />
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button onClick={addTag} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {scenario.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-xs hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Steps</CardTitle>
                  <CardDescription>
                    Define the sequence of actions for this scenario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenario.steps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Step {index + 1}
                          </span>
                          <Badge>{step.type}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const duplicate = { ...step, id: `step-${Date.now()}` };
                              setScenario(prev => ({
                                ...prev,
                                steps: [...prev.steps.slice(0, index + 1), duplicate, ...prev.steps.slice(index + 1)]
                              }));
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Step Name</Label>
                          <Input
                            value={step.name}
                            onChange={(e) => updateStep(index, { name: e.target.value })}
                            placeholder="Step name..."
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={step.type}
                            onValueChange={(value: any) => updateStep(index, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tap">Tap</SelectItem>
                              <SelectItem value="type">Type</SelectItem>
                              <SelectItem value="swipe">Swipe</SelectItem>
                              <SelectItem value="wait">Wait</SelectItem>
                              <SelectItem value="assert">Assert</SelectItem>
                              <SelectItem value="api_call">API Call</SelectItem>
                              <SelectItem value="condition">Condition</SelectItem>
                              <SelectItem value="loop">Loop</SelectItem>
                              <SelectItem value="sub_scenario">Sub-Scenario</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Parameters (JSON)</Label>
                        <Textarea
                          className="font-mono text-xs"
                          value={JSON.stringify(step.parameters, null, 2)}
                          onChange={(e) => {
                            try {
                              const params = JSON.parse(e.target.value);
                              updateStep(index, { parameters: params });
                            } catch {}
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  <Button onClick={addStep} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Variable className="h-4 w-4" />
                    Parameters
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define input parameters for this scenario
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scenario.parameters.map((param, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{param.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {param.type} {param.required && "• Required"}
                        </div>
                      </div>
                    ))}
                    <Button onClick={addParameter} variant="outline" size="sm" className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Parameter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Variables */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Variable className="h-4 w-4" />
                    Variables
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define variables used in this scenario
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scenario.variables.map((variable, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{variable.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {variable.type} • {variable.scope}
                        </div>
                      </div>
                    ))}
                    <Button onClick={addVariable} variant="outline" size="sm" className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Variable
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Version Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Version Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>v{scenario.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={scenario.status === "published" ? "default" : "secondary"}>
                      {scenario.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(scenario.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}