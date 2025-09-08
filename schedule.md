# Claude Prompt Guide – Schedule Feature

## 🎯 Objective
Generate a **Next.js React component** mockup for a **Schedule module**.  
This module allows users to **automate test runs** at specific times, on selected devices, with configurable rules and notifications.

---

## 📍 Placement in Product
- **Sidebar:** Add **Schedule** as a primary navigation item.  
- **Routes:**
  - `/schedule` → List & Calendar view of schedules
  - `/schedule/new` → Create Schedule wizard
  - `/schedule/[id]` → Schedule detail (definition, history, actions)

---

## 📐 Core Features

### 1. Schedule List View
Each row shows:
- Schedule name
- Cadence (e.g., “Daily at 09:00” / “Every Monday”)
- Devices (explicit list or group filter)
- Next run time
- Last run status
- Toggle (Enabled/Disabled)
- Actions: Run now, Edit, Pause/Resume, Duplicate, Delete

### 2. Calendar View
- Week/Month calendar showing scheduled runs
- Click entry → see quick info (name, cadence, devices, next run)
- Drag-to-create (optional for future)

### 3. Create/Edit Schedule Wizard
Steps:
1. **What to run**
   - Select test suite or saved run configuration
2. **When to run**
   - One-off: specific datetime
   - Recurring: Hourly / Daily / Weekly / Custom CRON
   - After-event: Run after another schedule completes
   - Timezone support
3. **Devices**
   - Pick device group (filters by platform, OS version, tags)
   - Pick explicit devices
   - Fallback rules: auto-allocate idle device, or skip if none available
4. **Constraints**
   - Max concurrency (number of parallel runs)
   - Run timeout (minutes/seconds)
   - Retry policy (e.g., retry up to 2 on fail/flaky)
   - Overlap handling:
     - Allow parallel
     - Skip new if old still running
     - Cancel old, start new
5. **Windows**
   - Blackout periods (do not run between certain hours)
   - Maintenance windows (optional)
6. **Notifications**
   - Slack, Email, Webhook
   - Triggered on: Start, Success, Fail, Flaky, Skipped
7. **Artifacts**
   - Retention policy (e.g., keep logs/screenshots/videos for N days)
8. **Review & Confirm**
   - JSON preview of schedule definition
   - Confirm and save

### 4. Schedule Detail Page
- Summary: name, cadence, devices, enabled toggle
- Definition JSON (read-only)
- Run history (list of instances with status, duration, result)
- Quick actions: Run now, Pause/Resume, Edit, Delete

---

## ⚙️ Interactivity
- Filters in list view (by cadence, status, device type)
- Calendar entries clickable → quick details
- Wizard validates inputs step-by-step
- Enable/disable toggle updates schedule status immediately
- Run history linked to Run Detail view (with LLM Command Viewer)

---

## 🛠️ Implementation Guidelines
- Use **Next.js with React functional components**
- Modular components:
  - `ScheduleList`
  - `ScheduleCalendar`
  - `ScheduleWizard`
  - `ScheduleDetail`
- Use **React hooks** for form state and filters
- Use mock JSON data for schedules so UI renders standalone

---

## 📋 Sample Prompt
