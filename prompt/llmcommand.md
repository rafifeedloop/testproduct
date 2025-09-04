# Claude Prompt Guide – LLM Command Viewer (Explainability UI)

## 🎯 Objective
Generate a **Next.js React component** mockup for an **LLM Command Viewer**.  
This component is used to explain and visualize each step taken by the LLM agent during a mobile test run.

---

## 📍 Placement in Product
- **Sidebar navigation** includes: Dashboard / Test Runs / Devices / Schedule.  
- **LLM Command Viewer lives under:**
  - **Test Runs → [Run Detail] → Timeline tab**  
  - It appears on the right-hand side of the step timeline, tied to the selected step.  
- Layout for Run Detail (Timeline tab):
  1. **Left panel** → Step list (1, 2, 3…) with status indicators  
  2. **Center panel** → Screenshot comparison (Before/After)  
  3. **Right panel** → **LLM Command Viewer** (JSON command, reasoning notes, execution status)  

This ensures the LLM output is contextual to each step and not on the main dashboard.

---

## 📐 Core Features

### 1. Input & Context Panel
- Display **Test Goal** (plain text, e.g., "Login and verify home screen")
- Show **UI Snapshot** metadata:
  - Screen name / identifier
  - Timestamp
  - Optional JSON snippet of current UI tree (truncated)

### 2. LLM Decision Output
- **Command JSON** (full output of LLM per step):
  - Action type (tap, type, swipe, wait)
  - Target element (selector, coordinates, or label)
  - Parameters (e.g., text to type, swipe direction)
- Must be syntax-highlighted for readability
- Support collapsible/expandable JSON view

### 3. Step-by-Step Timeline
- For each step:
  - Step index (1, 2, 3…)
  - Command JSON
  - Execution result (success, fail, timeout)
  - Duration (ms/s)
- Execution result color-coded by status

### 4. Screenshot Comparison
- **Before** screenshot (state before action)
- **After** screenshot (state after action)
- Option to toggle or slide between before/after

### 5. Reasoning Notes (Optional)
- Short text explanation if available (e.g., “Tapped login button based on label match”)
- Displayed next to JSON command

---

## ⚙️ Interactivity
- Expand/collapse JSON blocks
- Step-by-step navigation (Previous / Next buttons)
- Toggle between before/after screenshots
- Search/filter steps by action type (e.g., show only `tap` actions)

---

## 🛠️ Implementation Guidelines
- Use **Next.js with React functional components**
- Modular components:
  - `CommandJsonViewer`
  - `StepTimeline`
  - `ScreenshotCompare`
  - `ReasoningNotes`
- Mock JSON data for steps with:
  - Action type, selector, parameters
  - Screenshots (use placeholder images)
  - Execution status

