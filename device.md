# Claude Prompt Guide – Device Registry Mockup

## 🎯 Objective
Generate a **Next.js React component** mockup for a **Device Registry**.  
The registry should display all available devices (real and emulated), their current states, metadata, and allow allocation for test runs.

---

## 📐 Core Features

### 1. Device List / Grid
Each device entry must include:
- Device Name (e.g., Pixel 7 Pro, iPhone 14)
- Platform & OS version (Android 14, iOS 17)
- Status (Idle, Busy, Offline, Reserved)
- Device Type (Real / Emulator)
- Device ID (UDID or shortened version)

### 2. Filtering & Search
- Search by device name or ID
- Filter by:
  - Platform (iOS / Android)
  - Status (Idle / Busy / Offline / Reserved)
  - Type (Real / Emulator)

### 3. Actions
- **Allocate to Run** (enabled only if status = Idle)
- **Release Device** (if reserved/allocated)
- Disabled state with tooltip for unavailable actions

### 4. Device Detail (Expand/Modal)
When selecting a device:
- Show recent usage history (last runs, timestamps, result)
- Display logs (placeholder area)
- Screenshot preview (placeholder)
- Metadata (network, OS build, location if applicable)

---

## ⚙️ Interactivity
- Filters and search dynamically update the device list
- Clicking a device expands details or opens modal
- Allocation/release buttons simulate state changes

---

## 🛠️ Implementation Guidelines
- Use **Next.js with React functional components**
- Use **React hooks** for state and filtering
- Build modular components:
  - `DeviceCard` (displays summary info)
  - `DeviceFilter` (controls for search and filter)
  - `DeviceDetail` (modal or expandable panel)

---

## 📋 Sample Prompt
