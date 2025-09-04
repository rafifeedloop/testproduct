# TestLab - Mobile Test Orchestration Dashboard

A modern, real-time dashboard for mobile test automation with AI-powered test execution insights. Built with Next.js 15, TypeScript, and shadcn/ui.

## 🚀 Features

### 📊 Executive Dashboard
- **Real-time KPIs**: Test runs, pass rate, execution speed, and flaky rate
- **Visual Trends**: 7-day trend visualization with pass/fail/flaky breakdown
- **Device Management**: Monitor device status and availability
- **Test History**: Comprehensive test run history with filtering

### 🤖 LLM Command Viewer
- **AI Test Automation Explainability**: Visualize AI decisions during test execution
- **Step-by-step Timeline**: Track each action taken by the AI agent
- **Screenshot Comparison**: Before/after screenshots with interactive slider
- **JSON Command Output**: Syntax-highlighted command details
- **AI Reasoning**: Understand why the AI made each decision

### 📱 Device Registry
- **Device Fleet Management**: Track iOS and Android devices
- **Real-time Status**: Monitor device availability and usage
- **Device Details**: Hardware specs, OS versions, battery levels
- **Usage History**: Track test execution history per device

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd blank-project

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🗂️ Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── (dashboard)/         # Dashboard route group
│   │   ├── test-dashboard/  # Main dashboard
│   │   ├── test-runs/       # Test runs management
│   │   └── devices/         # Device registry
├── components/              
│   ├── dashboard/           # Dashboard components
│   ├── devices/             # Device management components
│   ├── llm-viewer/          # LLM command viewer components
│   └── ui/                  # shadcn/ui components
└── lib/                     
    ├── mock-data.ts         # Mock data for development
    └── llm-command-data.ts  # LLM command types
```

## 🎯 Key Features

### Dashboard
- Pass rate with sparkline visualization
- Real-time device status monitoring
- Test execution history with filtering

### LLM Command Viewer
Navigate to: Test Runs → Select a run → Timeline tab
- 3-column layout with step timeline, screenshots, and command details
- AI reasoning for each test step
- Interactive before/after screenshot comparison

### Device Registry
- Search and filter devices by platform, status, and type
- Device allocation and release management
- Detailed device information with usage history

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT License

---

Built with Next.js and TypeScript
