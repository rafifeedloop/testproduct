"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  FileJson,
  Upload,
  Download,
  Copy,
  Edit,
  Trash2,
  GitBranch,
  PlayCircle,
  Clock,
  Tag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { scenarioTemplates } from "@/lib/scenario-templates";
import type { TestScenario } from "@/types/scenario";

// Mock data for existing scenarios
const mockScenarios: TestScenario[] = [
  {
    id: "scenario-001",
    name: "User Authentication Flow",
    description: "Complete login and registration flow",
    version: 3,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    createdBy: "john.doe@example.com",
    tags: ["authentication", "critical", "smoke-test"],
    parameters: [],
    variables: [],
    steps: [],
    status: "published"
  },
  {
    id: "scenario-002",
    name: "Product Purchase Flow",
    description: "End-to-end purchase workflow",
    version: 1,
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
    createdBy: "jane.smith@example.com",
    tags: ["e-commerce", "payment"],
    parameters: [],
    variables: [],
    steps: [],
    status: "published"
  },
  {
    id: "scenario-003",
    name: "Data Sync Test",
    description: "Test offline/online data synchronization",
    version: 2,
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    createdBy: "john.doe@example.com",
    tags: ["data", "sync", "backend"],
    parameters: [],
    variables: [],
    steps: [],
    status: "draft"
  }
];

export default function ScenariosPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [scenarios] = useState<TestScenario[]>(mockScenarios);

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "published") return matchesSearch && scenario.status === "published";
    if (selectedTab === "draft") return matchesSearch && scenario.status === "draft";
    return matchesSearch;
  });

  const handleCreateNew = () => {
    router.push("/scenarios/editor/new");
  };

  const handleEdit = (scenarioId: string) => {
    router.push(`/scenarios/editor/${scenarioId}`);
  };

  const handleDuplicate = (scenario: TestScenario) => {
    console.log("Duplicating scenario:", scenario.id);
  };

  const handleExport = (scenario: TestScenario) => {
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

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const data = JSON.parse(event.target.result);
            console.log("Imported scenarios:", data);
            // Handle import logic here
          } catch (error) {
            console.error("Invalid JSON file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default";
      case "draft": return "secondary";
      case "archived": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Scenarios</h1>
            <p className="text-muted-foreground">Create and manage reusable test scenarios</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scenarios by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Scenarios</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <FileJson className="h-5 w-5" />
                          {scenario.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {scenario.description}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(scenario.status)}>
                        {scenario.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          v{scenario.version}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Updated {new Date(scenario.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {scenario.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {scenario.tags.length > 3 && (
                            <span className="text-xs">+{scenario.tags.length - 3}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(scenario.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(scenario)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExport(scenario)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/test-runner?scenario=${scenario.id}`)}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="published" className="mt-6">
            <div className="grid gap-4">
              {filteredScenarios.filter(s => s.status === "published").map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      {scenario.name}
                    </CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {scenario.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(scenario.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExport(scenario)}
                        >
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="mt-6">
            <div className="grid gap-4">
              {filteredScenarios.filter(s => s.status === "draft").map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileJson className="h-5 w-5" />
                      {scenario.name}
                    </CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEdit(scenario.id)}
                    >
                      Continue Editing
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarioTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/scenarios/editor/new?template=${template.id}`)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      {template.name}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{template.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}