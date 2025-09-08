# Claude Prompt Guide – Triggers (CI/CD Event-Driven Runs)

## 🎯 Objective
Build a **Triggers** module that automatically starts test runs when external **events** occur (e.g., CI/CD push, PR merge, build success, webhook). This replaces time-based scheduling.

---

## 📍 Placement in Product
- Sidebar: **Dashboard**, **Test Runs**, **Devices**, **Triggers**, Reports, Logs, …
- Routes:
  - `/triggers` → List of triggers
  - `/triggers/new` → Create Trigger wizard
  - `/triggers/[id]` → Trigger detail (definition + history + actions)

---

## 🧭 Core Concepts

### Trigger Types
1. **CI Push/Merge** (GitHub, GitLab, Bitbucket; via webhook or pipeline step)
2. **Pipeline Stage** (trigger when a pipeline job finishes with status = success/failure/always)
3. **Generic Webhook** (any external system POSTs to a signed URL)
4. **After-Run** (run B after run A completes; optional chain)
5. **Manual** (“Run now” from trigger detail; for debugging)

> No CRON / calendar. Everything is **event-based**.

---

## 🧱 Feature Set

### 1) Triggers List
Columns:
- Name
- Type (CI Push / Webhook / After-Run)
- Condition (e.g., `branch = main`, `status = success`)
- Mapped Suite/Config
- Devices (group filter or explicit list)
- Last fired (time + result)
- Enabled toggle
- Actions: Run now, Edit, Pause/Resume, Duplicate, Delete

### 2) Create/Edit Trigger Wizard
Steps & required fields:

**Step 1 — Definition**
- Name
- Type: `ci_push` | `ci_pipeline` | `webhook` | `after_run` | `manual`

**Step 2 — Conditions**
- For `ci_push`: provider (`github` | `gitlab` | `bitbucket`), repo, branch pattern (e.g., `main`, `release/*`), event (`push` | `pull_request_merged`)
- For `ci_pipeline`: provider, repo, pipeline status condition (`success` | `failed` | `always`)
- For `webhook`: generate signed URL; optional header match and payload JSONPath filters (e.g., `$.release.channel == "stable"`)
- For `after_run`: select **source run config** and result condition (`success` | `failed` | `always`)

**Step 3 — What to run**
- Select **Test Suite / Saved Run Config** (id/reference stored)

**Step 4 — Devices**
- Mode: `group` (filters: platform, OS range, tags) OR `explicit` (device IDs)
- Fallback: `any_matching` | `none`
- Capacity: `maxConcurrency` (parallel devices per fire)

**Step 5 — Execution Controls**
- `runTimeoutSec`
- `retries` (e.g., 2 on fail/flaky)
- Overlap policy if previous fired instance still running:  
  `allow_parallel` | `skip_new` | `cancel_old_and_start_new`
- Priority: `low` | `normal` | `high`

**Step 6 — Notifications**
- Slack channels, emails, webhooks
- On events: `start` | `success` | `fail` | `flaky` | `skipped`

**Step 7 — Review**
- JSON preview; Confirm & Create

### 3) Trigger Detail
- Read-only **definition JSON**
- **History** of firings → links to Run Detail
- Quick actions: **Run now**, **Pause/Resume**, **Edit**, **Delete**
- Show **signed webhook URL** (copy button) if type = webhook
- Show **recent errors** (e.g., signature mismatch, missing devices)

---

## ⚙️ Interactivity Rules
- Enabling/disabling applies immediately
- “Run now” fires exactly one instance with the stored mapping
- When fired:
  - Resolve devices using group/explicit rules
  - Enforce `maxConcurrency`, retries, timeout, and overlap policy
  - Create Run entities and stream status to the **Test Runs** list and **Run Detail** (LLM Command Viewer lives in Run Detail → Timeline)

---

## 🧩 Data Model (minimal)
```ts
type TriggerType = 'ci_push' | 'ci_pipeline' | 'webhook' | 'after_run' | 'manual';

interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  enabled: boolean;

  // Conditions (only fields relevant to the type are populated)
  conditions?: {
    provider?: 'github'|'gitlab'|'bitbucket';
    repo?: string;                // org/name
    branchPattern?: string;       // e.g., main, release/*
    event?: 'push'|'pull_request_merged';
    pipelineStatus?: 'success'|'failed'|'always';
    afterRunConfigId?: string;    // for after_run chain
    webhook:
      | null
      | {
          signingSecretId: string;   // reference to stored secret
          requiredHeaders?: Record<string,string>;
          jsonpathFilters?: Array<{ path: string; equals: string|number|boolean }>;
        };
  };

  runConfigId: string; // selected suite/config to execute

  deviceSelector: {
    mode: 'group'|'explicit';
    groupQuery?: { platform?: 'ios'|'android', osMin?: string, osMax?: string, tags?: string[] };
    deviceIds?: string[];
    fallback: 'any_matching'|'none';
    maxConcurrency: number;
  };

  execution: {
    runTimeoutSec: number;
    retries: number;
    overlapPolicy: 'allow_parallel'|'skip_new'|'cancel_old_and_start_new';
    priority: 'low'|'normal'|'high';
  };

  notifications?: {
    slack?: string[]; email?: string[]; webhooks?: string[];
    on: Array<'start'|'success'|'fail'|'flaky'|'skipped'>;
  };

  lastFiredAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
