# Claude Prompt Guide — Script Generator (CI-Driven Test Runner)

## 🎯 Objective
Build a **Script Generator** that outputs ready-to-commit scripts and CI snippets.  
Teams add the script to their repo and call it from any CI job; the script **starts a run**, **streams live progress**, and **exits with the correct code**.

---

## 📍 Placement in Product (UI)
- Sidebar: **Dashboard**, **Test Runs**, **Devices**, **Scripts**, Reports, Logs
- Routes:
  - `/scripts` → List of generated scripts
  - `/scripts/new` → Generate Script wizard
  - `/scripts/[id]` → Script detail (parameters, snippet, rotate token, last used)

> No “Schedule” or “Git Configuration” modules in this model.

---

## 📐 Core Features

### 1) Generate Script Wizard
**Step 1 — What to run**
- Select **Test Suite / Saved Run Config** (`runConfigId`)
- Optional metadata inputs (key/value) to embed (e.g., envName, buildNumber)

**Step 2 — Devices**
- Mode: `group` (filters: platform, osMin/osMax, tags) **or** `explicit` (deviceIds)
- `maxConcurrency` (parallel devices per fire)
- `fallback`: `any_matching` or `none`

**Step 3 — Execution Controls**
- `runTimeoutSec`
- `retries` (apply to failed/flaky)
- `overlapPolicy`: `allow_parallel` | `skip_new` | `cancel_old_and_start_new`
- `priority`: `low` | `normal` | `high`

**Step 4 — Streaming & Blocking**
- Streaming transport: `sse` | `websocket` | `polling`
- Blocking: `waitForResult = true|false`
- Exit policy: `successCodes = ["success","flaky"]` (configurable)

**Step 5 — CI Target**
- Choose output: **Shell** (bash), **Node**, **PowerShell**
- CI snippets: **GitHub Actions**, **GitLab CI**, **Jenkins**, **CircleCI** (select one or multiple)

**Step 6 — Secrets & Env**
- Instruct to use env vars: `TESTLAB_URL`, `TESTLAB_TOKEN`
- Show how to add secrets in each CI (no secrets in code)

**Step 7 — Output**
- Render **script file** content (e.g., `scripts/testlab-run.sh`)
- Render **CI snippet** calling the script
- Copy buttons and Download ZIP

---

### 2) Scripts List
- Columns: Name • CI type(s) • Suite/Config • Device filter summary • Streaming mode • Created • Last used
- Row Actions: **View/Copy**, **Rotate token hint** (points to secrets page), **Duplicate**, **Delete**

### 3) Script Detail
- Read-only script text (with copy + download)
- CI snippet(s)
- Parameters summary (suite, devices, execution controls)
- “How to use” checklist
- **Recent usage**: last N runs triggered by this script (timestamp, status, link to Run Detail)

---

## ⚙️ Interactivity & Validation
- Validate device filters (must match ≥1 device, or warn if dynamic pool unknown)
- Warn if `maxConcurrency` > likely device pool
- Validate `runTimeoutSec`, `retries`
- Ensure `TESTLAB_URL` and `TESTLAB_TOKEN` are referenced but not hard-coded

---

## 🧱 Minimal Data Model
```ts
interface GeneratedScript {
  id: string;
  name: string;
  ciTypes: Array<'github'|'gitlab'|'jenkins'|'circleci'|'generic'>;
  language: 'shell'|'node'|'powershell';
  runConfigId: string;
  deviceSelector: {
    mode: 'group'|'explicit';
    groupQuery?: { platform?: 'ios'|'android', osMin?: string, osMax?: string, tags?: string[] };
    deviceIds?: string[];
    maxConcurrency: number;
    fallback: 'any_matching'|'none';
  };
  execution: {
    runTimeoutSec: number;
    retries: number;
    overlapPolicy: 'allow_parallel'|'skip_new'|'cancel_old_and_start_new';
    priority: 'low'|'normal'|'high';
  };
  streaming: { mode: 'sse'|'websocket'|'polling'; waitForResult: boolean; successCodes: Array<'success'|'flaky'|'fail'|'skipped'> };
  meta?: Record<string,string>;
  createdBy: string;
  createdAt: string;
  lastUsedAt?: string;
}
