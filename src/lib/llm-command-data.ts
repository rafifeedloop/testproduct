export type ActionType = "tap" | "type" | "swipe" | "wait" | "assert" | "scroll";
export type ExecutionStatus = "success" | "fail" | "timeout" | "pending";

export interface LLMCommand {
  action: ActionType;
  target: {
    selector?: string;
    coordinates?: { x: number; y: number };
    label?: string;
    elementId?: string;
  };
  parameters?: {
    text?: string;
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
    distance?: number;
  };
}

export interface TestStep {
  id: string;
  index: number;
  command: LLMCommand;
  reasoning?: string;
  executionStatus: ExecutionStatus;
  duration: number; // in milliseconds
  screenshotBefore?: string;
  screenshotAfter?: string;
  uiTreeSnapshot?: any;
  timestamp: string;
}

export interface TestRunDetail {
  id: string;
  runId: string;
  testGoal: string;
  deviceInfo: {
    name: string;
    platform: string;
    osVersion: string;
  };
  steps: TestStep[];
  startTime: string;
  endTime: string;
  totalDuration: number;
  status: "passed" | "failed" | "aborted";
}

// Mock data for LLM commands
export const mockTestRunDetail: TestRunDetail = {
  id: "run-detail-001",
  runId: "run-892",
  testGoal: "Login and verify home screen displays user profile",
  deviceInfo: {
    name: "iPhone 15 Pro",
    platform: "iOS",
    osVersion: "17.2"
  },
  startTime: "2024-01-15T14:30:00Z",
  endTime: "2024-01-15T14:34:45Z",
  totalDuration: 285000,
  status: "passed",
  steps: [
    {
      id: "step-001",
      index: 1,
      command: {
        action: "tap",
        target: {
          selector: "accessibility_id:login_button",
          label: "Sign In",
          elementId: "btn_login_main"
        },
        parameters: {}
      },
      reasoning: "Identified login button using accessibility ID. Button is clearly visible in the center of the screen.",
      executionStatus: "success",
      duration: 523,
      screenshotBefore: "/api/screenshot/before-1",
      screenshotAfter: "/api/screenshot/after-1",
      uiTreeSnapshot: {
        screen: "LoginScreen",
        elements: ["TextField:username", "TextField:password", "Button:login"]
      },
      timestamp: "2024-01-15T14:30:05Z"
    },
    {
      id: "step-002",
      index: 2,
      command: {
        action: "type",
        target: {
          selector: "xpath://XCUIElementTypeTextField[@name='username_field']",
          label: "Username",
          elementId: "input_username"
        },
        parameters: {
          text: "testuser@example.com"
        }
      },
      reasoning: "Located username input field by XPath. Field is active and ready for text input.",
      executionStatus: "success",
      duration: 1245,
      screenshotBefore: "/api/screenshot/before-2",
      screenshotAfter: "/api/screenshot/after-2",
      timestamp: "2024-01-15T14:30:07Z"
    },
    {
      id: "step-003",
      index: 3,
      command: {
        action: "type",
        target: {
          selector: "xpath://XCUIElementTypeSecureTextField[@name='password_field']",
          label: "Password",
          elementId: "input_password"
        },
        parameters: {
          text: "********"
        }
      },
      reasoning: "Found password field using secure text field type. Field accepts secure text input.",
      executionStatus: "success",
      duration: 987,
      screenshotBefore: "/api/screenshot/before-3",
      screenshotAfter: "/api/screenshot/after-3",
      timestamp: "2024-01-15T14:30:09Z"
    },
    {
      id: "step-004",
      index: 4,
      command: {
        action: "tap",
        target: {
          selector: "accessibility_id:submit_login",
          label: "Login",
          coordinates: { x: 195, y: 420 }
        },
        parameters: {}
      },
      reasoning: "Submit button is now enabled after filling credentials. Tapping to proceed with login.",
      executionStatus: "success",
      duration: 456,
      screenshotBefore: "/api/screenshot/before-4",
      screenshotAfter: "/api/screenshot/after-4",
      timestamp: "2024-01-15T14:30:11Z"
    },
    {
      id: "step-005",
      index: 5,
      command: {
        action: "wait",
        target: {},
        parameters: {
          duration: 2000
        }
      },
      reasoning: "Waiting for login API response and screen transition to complete.",
      executionStatus: "success",
      duration: 2000,
      timestamp: "2024-01-15T14:30:12Z"
    },
    {
      id: "step-006",
      index: 6,
      command: {
        action: "assert",
        target: {
          selector: "accessibility_id:user_profile_image",
          label: "Profile Picture"
        },
        parameters: {}
      },
      reasoning: "Verifying successful login by checking for user profile image presence on home screen.",
      executionStatus: "success",
      duration: 234,
      screenshotBefore: "/api/screenshot/before-6",
      screenshotAfter: "/api/screenshot/after-6",
      timestamp: "2024-01-15T14:30:14Z"
    },
    {
      id: "step-007",
      index: 7,
      command: {
        action: "swipe",
        target: {
          coordinates: { x: 200, y: 400 }
        },
        parameters: {
          direction: "down",
          distance: 300,
          duration: 500
        }
      },
      reasoning: "Performing swipe down gesture to reveal additional user information in profile section.",
      executionStatus: "success",
      duration: 567,
      screenshotBefore: "/api/screenshot/before-7",
      screenshotAfter: "/api/screenshot/after-7",
      timestamp: "2024-01-15T14:30:15Z"
    },
    {
      id: "step-008",
      index: 8,
      command: {
        action: "scroll",
        target: {
          selector: "class:UIScrollView",
          elementId: "main_scroll_view"
        },
        parameters: {
          direction: "up",
          distance: 200
        }
      },
      reasoning: "Scrolling to view more content in the main feed area.",
      executionStatus: "fail",
      duration: 789,
      screenshotBefore: "/api/screenshot/before-8",
      screenshotAfter: "/api/screenshot/after-8",
      timestamp: "2024-01-15T14:30:16Z"
    }
  ]
};

// Helper function to get step by index
export function getStepByIndex(steps: TestStep[], index: number): TestStep | undefined {
  return steps.find(step => step.index === index);
}

// Helper function to filter steps by action type
export function filterStepsByAction(steps: TestStep[], actionType: ActionType): TestStep[] {
  return steps.filter(step => step.command.action === actionType);
}

// Helper function to calculate success rate
export function calculateSuccessRate(steps: TestStep[]): number {
  const successfulSteps = steps.filter(step => step.executionStatus === "success").length;
  return steps.length > 0 ? Math.round((successfulSteps / steps.length) * 100) : 0;
}