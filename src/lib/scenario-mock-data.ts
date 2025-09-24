import type { TestScenario } from "@/types/scenario";

export const savedScenarios: TestScenario[] = [
  {
    id: "scenario-001",
    name: "User Authentication Flow",
    description: "Complete login and registration flow with error handling",
    version: 3,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    createdBy: "john.doe@example.com",
    tags: ["authentication", "critical", "smoke-test"],
    parameters: [
      {
        name: "username",
        type: "string",
        required: true,
        description: "User's email or username"
      },
      {
        name: "password",
        type: "string",
        required: true,
        description: "User's password"
      }
    ],
    variables: [],
    steps: [
      {
        id: "step-1",
        name: "Wait for login screen",
        type: "wait",
        parameters: {
          selector: "login-button",
          selectorType: "id",
          condition: "visible"
        }
      },
      {
        id: "step-2",
        name: "Enter username",
        type: "type",
        parameters: {
          selector: "username-field",
          selectorType: "id",
          text: "{{username}}",
          clearBefore: true
        }
      },
      {
        id: "step-3",
        name: "Enter password",
        type: "type",
        parameters: {
          selector: "password-field",
          selectorType: "id",
          text: "{{password}}",
          clearBefore: true
        }
      },
      {
        id: "step-4",
        name: "Submit login",
        type: "tap",
        parameters: {
          selector: "login-button",
          selectorType: "id"
        }
      }
    ],
    status: "published"
  },
  {
    id: "scenario-002",
    name: "Product Purchase Flow",
    description: "End-to-end purchase workflow with payment processing",
    version: 1,
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
    createdBy: "jane.smith@example.com",
    tags: ["e-commerce", "payment", "regression"],
    parameters: [
      {
        name: "productId",
        type: "string",
        required: true,
        description: "Product to purchase"
      },
      {
        name: "paymentMethod",
        type: "string",
        required: true,
        defaultValue: "credit_card",
        description: "Payment method"
      }
    ],
    variables: [
      {
        name: "cartTotal",
        type: "number",
        scope: "local"
      }
    ],
    steps: [
      {
        id: "step-1",
        name: "Navigate to product",
        type: "navigate",
        parameters: {
          screen: "product_detail",
          params: { id: "{{productId}}" }
        }
      },
      {
        id: "step-2",
        name: "Add to cart",
        type: "tap",
        parameters: {
          selector: "add-to-cart",
          selectorType: "id"
        }
      },
      {
        id: "step-3",
        name: "Checkout",
        type: "tap",
        parameters: {
          selector: "checkout-button",
          selectorType: "id"
        }
      }
    ],
    status: "published"
  },
  {
    id: "scenario-003",
    name: "Data Synchronization Test",
    description: "Test offline/online data synchronization across devices",
    version: 2,
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    createdBy: "john.doe@example.com",
    tags: ["data", "sync", "backend", "integration"],
    parameters: [],
    variables: [
      {
        name: "syncStatus",
        type: "string",
        scope: "global"
      }
    ],
    steps: [
      {
        id: "step-1",
        name: "Check online status",
        type: "api_call",
        parameters: {
          url: "/api/status",
          method: "GET",
          expectedStatus: 200
        }
      },
      {
        id: "step-2",
        name: "Trigger sync",
        type: "tap",
        parameters: {
          selector: "sync-button",
          selectorType: "id"
        }
      }
    ],
    status: "draft"
  },
  {
    id: "scenario-004",
    name: "Form Validation Suite",
    description: "Comprehensive form validation testing",
    version: 1,
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
    createdBy: "test.user@example.com",
    tags: ["forms", "validation", "ui-test"],
    parameters: [],
    variables: [],
    steps: [
      {
        id: "step-1",
        name: "Submit empty form",
        type: "tap",
        parameters: {
          selector: "submit-button",
          selectorType: "id"
        }
      },
      {
        id: "step-2",
        name: "Check validation errors",
        type: "assert",
        parameters: {
          selector: ".error-message",
          selectorType: "class",
          property: "count",
          operator: "greater_than",
          expectedValue: 0
        }
      }
    ],
    status: "published"
  },
  {
    id: "scenario-005",
    name: "Navigation Flow Test",
    description: "Test all major navigation paths",
    version: 1,
    createdAt: "2024-01-14T11:00:00Z",
    updatedAt: "2024-01-14T11:00:00Z",
    createdBy: "qa.team@example.com",
    tags: ["navigation", "smoke-test", "ui"],
    parameters: [],
    variables: [],
    steps: [
      {
        id: "step-1",
        name: "Navigate to Home",
        type: "tap",
        parameters: {
          selector: "tab-home",
          selectorType: "id"
        }
      },
      {
        id: "step-2",
        name: "Navigate to Profile",
        type: "tap",
        parameters: {
          selector: "tab-profile",
          selectorType: "id"
        }
      }
    ],
    status: "published"
  }
];