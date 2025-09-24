import { ScenarioTemplate } from "@/types/scenario";

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: "template-login",
    name: "User Login Flow",
    description: "Standard login flow with username and password",
    category: "authentication",
    icon: "🔐",
    scenario: {
      name: "User Login",
      description: "Authenticate user with credentials",
      tags: ["authentication", "login"],
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
          name: "Tap login button",
          type: "tap",
          parameters: {
            selector: "login-button",
            selectorType: "id"
          }
        },
        {
          id: "step-5",
          name: "Verify login success",
          type: "assert",
          parameters: {
            selector: "dashboard",
            selectorType: "id",
            property: "exists",
            operator: "equals",
            expectedValue: true
          }
        }
      ]
    }
  },
  {
    id: "template-checkout",
    name: "E-commerce Checkout",
    description: "Complete purchase flow with payment",
    category: "commerce",
    icon: "🛒",
    scenario: {
      name: "Checkout Flow",
      description: "Complete purchase with payment processing",
      tags: ["e-commerce", "payment", "checkout"],
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
          description: "Payment method to use"
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
          name: "Go to cart",
          type: "tap",
          parameters: {
            selector: "cart-icon",
            selectorType: "id"
          }
        },
        {
          id: "step-4",
          name: "Proceed to checkout",
          type: "tap",
          parameters: {
            selector: "checkout-button",
            selectorType: "id"
          }
        },
        {
          id: "step-5",
          name: "Select payment method",
          type: "condition",
          parameters: {
            condition: {
              property: "paymentMethod",
              operator: "equals",
              value: "credit_card"
            },
            thenSteps: [
              {
                id: "step-5a",
                name: "Enter card details",
                type: "sub_scenario",
                parameters: {
                  scenarioId: "credit-card-entry",
                  parameters: {}
                }
              }
            ],
            elseSteps: [
              {
                id: "step-5b",
                name: "Select PayPal",
                type: "tap",
                parameters: {
                  selector: "paypal-option",
                  selectorType: "id"
                }
              }
            ]
          }
        },
        {
          id: "step-6",
          name: "Complete purchase",
          type: "tap",
          parameters: {
            selector: "complete-purchase",
            selectorType: "id"
          }
        },
        {
          id: "step-7",
          name: "Verify success",
          type: "assert",
          parameters: {
            selector: "order-confirmation",
            selectorType: "id",
            property: "exists",
            operator: "equals",
            expectedValue: true
          }
        }
      ]
    }
  },
  {
    id: "template-form-validation",
    name: "Form Validation Test",
    description: "Test form field validation and error handling",
    category: "forms",
    icon: "📝",
    scenario: {
      name: "Form Validation",
      description: "Validate form inputs and error messages",
      tags: ["forms", "validation", "error-handling"],
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
          name: "Check required field errors",
          type: "assert",
          parameters: {
            selector: ".error-message",
            selectorType: "class",
            property: "count",
            operator: "greater_than",
            expectedValue: 0
          }
        },
        {
          id: "step-3",
          name: "Test invalid email",
          type: "type",
          parameters: {
            selector: "email-field",
            selectorType: "id",
            text: "invalid-email",
            clearBefore: true
          }
        },
        {
          id: "step-4",
          name: "Verify email error",
          type: "assert",
          parameters: {
            selector: "email-error",
            selectorType: "id",
            property: "text",
            operator: "contains",
            expectedValue: "valid email"
          }
        }
      ]
    }
  },
  {
    id: "template-navigation-flow",
    name: "App Navigation Test",
    description: "Test main navigation paths through the app",
    category: "navigation",
    icon: "🧭",
    scenario: {
      name: "Navigation Flow",
      description: "Navigate through main app sections",
      tags: ["navigation", "smoke-test"],
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
          name: "Verify Home screen",
          type: "assert",
          parameters: {
            selector: "home-content",
            selectorType: "id",
            property: "visible",
            operator: "equals",
            expectedValue: true
          }
        },
        {
          id: "step-3",
          name: "Navigate to Profile",
          type: "tap",
          parameters: {
            selector: "tab-profile",
            selectorType: "id"
          }
        },
        {
          id: "step-4",
          name: "Verify Profile screen",
          type: "assert",
          parameters: {
            selector: "profile-content",
            selectorType: "id",
            property: "visible",
            operator: "equals",
            expectedValue: true
          }
        }
      ]
    }
  },
  {
    id: "template-api-integration",
    name: "API Integration Test",
    description: "Test API endpoints and data synchronization",
    category: "data",
    icon: "🔌",
    scenario: {
      name: "API Integration",
      description: "Verify API calls and data sync",
      tags: ["api", "backend", "integration"],
      parameters: [
        {
          name: "apiEndpoint",
          type: "string",
          required: true,
          description: "API endpoint to test"
        }
      ],
      variables: [
        {
          name: "apiResponse",
          type: "object",
          scope: "local"
        }
      ],
      steps: [
        {
          id: "step-1",
          name: "Call API endpoint",
          type: "api_call",
          parameters: {
            url: "{{apiEndpoint}}",
            method: "GET",
            expectedStatus: 200,
            saveResponse: "apiResponse"
          }
        },
        {
          id: "step-2",
          name: "Verify response structure",
          type: "assert",
          parameters: {
            property: "apiResponse.status",
            operator: "equals",
            expectedValue: "success"
          }
        },
        {
          id: "step-3",
          name: "Refresh UI",
          type: "swipe",
          parameters: {
            direction: "down",
            distance: 300
          }
        },
        {
          id: "step-4",
          name: "Verify data update",
          type: "wait",
          parameters: {
            selector: "data-loaded",
            selectorType: "id",
            condition: "visible",
            duration: 5
          }
        }
      ]
    }
  },
  {
    id: "template-loop-test",
    name: "List Iteration Test",
    description: "Iterate through list items and perform actions",
    category: "data",
    icon: "🔄",
    scenario: {
      name: "List Iteration",
      description: "Test operations on multiple list items",
      tags: ["loop", "list", "iteration"],
      parameters: [
        {
          name: "itemCount",
          type: "number",
          required: true,
          defaultValue: 5,
          description: "Number of items to test"
        }
      ],
      steps: [
        {
          id: "step-1",
          name: "Iterate through items",
          type: "loop",
          parameters: {
            iterations: "{{itemCount}}",
            steps: [
              {
                id: "loop-step-1",
                name: "Tap item",
                type: "tap",
                parameters: {
                  selector: "list-item-{{index}}",
                  selectorType: "id"
                }
              },
              {
                id: "loop-step-2",
                name: "Verify detail view",
                type: "assert",
                parameters: {
                  selector: "detail-view",
                  selectorType: "id",
                  property: "visible",
                  operator: "equals",
                  expectedValue: true
                }
              },
              {
                id: "loop-step-3",
                name: "Go back",
                type: "tap",
                parameters: {
                  selector: "back-button",
                  selectorType: "id"
                }
              }
            ]
          }
        }
      ]
    }
  }
];