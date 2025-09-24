// Test Scenario Builder Types

export type StepType =
  | "tap"
  | "type"
  | "swipe"
  | "wait"
  | "assert"
  | "navigate"
  | "api_call"
  | "db_query"
  | "condition"
  | "loop"
  | "sub_scenario"
  | "screenshot"
  | "custom";

export type AssertionOperator = "equals" | "contains" | "exists" | "not_exists" | "greater_than" | "less_than";
export type SwipeDirection = "up" | "down" | "left" | "right";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Base step structure
export interface BaseStep {
  id: string;
  name: string;
  description?: string;
  type: StepType;
  parameters: Record<string, any>;
  timeout?: number; // in seconds
  retryCount?: number;
  continueOnError?: boolean;
}

// Specific step types with parameters
export interface TapStep extends BaseStep {
  type: "tap";
  parameters: {
    selector: string;
    selectorType: "id" | "class" | "xpath" | "text";
    position?: { x: number; y: number };
    longPress?: boolean;
    duration?: number; // for long press
  };
}

export interface TypeStep extends BaseStep {
  type: "type";
  parameters: {
    selector: string;
    selectorType: "id" | "class" | "xpath";
    text: string;
    clearBefore?: boolean;
    hideKeyboard?: boolean;
  };
}

export interface SwipeStep extends BaseStep {
  type: "swipe";
  parameters: {
    direction: SwipeDirection;
    distance?: number;
    startPosition?: { x: number; y: number };
    duration?: number;
  };
}

export interface WaitStep extends BaseStep {
  type: "wait";
  parameters: {
    duration?: number; // in seconds
    selector?: string; // wait for element
    selectorType?: "id" | "class" | "xpath" | "text";
    condition?: "visible" | "clickable" | "exists";
  };
}

export interface AssertStep extends BaseStep {
  type: "assert";
  parameters: {
    selector?: string;
    selectorType?: "id" | "class" | "xpath" | "text";
    property: "text" | "value" | "visible" | "enabled" | "exists" | "count";
    operator: AssertionOperator;
    expectedValue: any;
  };
}

export interface ApiCallStep extends BaseStep {
  type: "api_call";
  parameters: {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    expectedStatus?: number;
    saveResponse?: string; // variable name to save response
  };
}

export interface ConditionalStep extends BaseStep {
  type: "condition";
  parameters: {
    condition: {
      selector?: string;
      selectorType?: "id" | "class" | "xpath" | "text";
      property?: string;
      operator: AssertionOperator;
      value: any;
    };
    thenSteps: ScenarioStep[];
    elseSteps?: ScenarioStep[];
  };
}

export interface LoopStep extends BaseStep {
  type: "loop";
  parameters: {
    iterations?: number;
    whileCondition?: {
      selector: string;
      property: string;
      operator: AssertionOperator;
      value: any;
    };
    steps: ScenarioStep[];
    maxIterations?: number; // safety limit for while loops
  };
}

export interface SubScenarioStep extends BaseStep {
  type: "sub_scenario";
  parameters: {
    scenarioId: string;
    parameters?: Record<string, any>; // parameter overrides
  };
}

export type ScenarioStep =
  | TapStep
  | TypeStep
  | SwipeStep
  | WaitStep
  | AssertStep
  | ApiCallStep
  | ConditionalStep
  | LoopStep
  | SubScenarioStep
  | BaseStep;

// Main scenario structure
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  parameters: ScenarioParameter[];
  variables: ScenarioVariable[];
  steps: ScenarioStep[];
  isTemplate?: boolean;
  parentScenarioId?: string; // for versioning
  status: "draft" | "published" | "archived";
}

export interface ScenarioParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface ScenarioVariable {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  value?: any;
  scope: "local" | "global";
}

// Template library
export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: "authentication" | "navigation" | "commerce" | "forms" | "data" | "custom";
  icon: string;
  scenario: Partial<TestScenario>;
}

// Import/Export format
export interface ScenarioExport {
  version: string;
  exportedAt: string;
  scenarios: TestScenario[];
  templates?: ScenarioTemplate[];
}

// Scenario execution result
export interface ScenarioExecutionResult {
  scenarioId: string;
  scenarioVersion: number;
  executionId: string;
  startTime: string;
  endTime?: string;
  status: "pending" | "running" | "passed" | "failed" | "error";
  device: string;
  stepResults: StepExecutionResult[];
  parameters: Record<string, any>;
  variables: Record<string, any>;
}

export interface StepExecutionResult {
  stepId: string;
  stepName: string;
  status: "passed" | "failed" | "skipped" | "error";
  startTime: string;
  endTime: string;
  duration: number;
  error?: {
    message: string;
    stackTrace?: string;
  };
  screenshot?: string;
  logs?: string[];
  retryCount?: number;
}