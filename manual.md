# Nexus OS: The Ultimate Technical & Visual Manual

Welcome to the definitive manual for **Nexus OS**, a world-class infrastructure management platform designed for the modern era. This document details every facet of the system, from the global shell to the deepest chaos engineering tools.

---

## 1. Global Shell & Onboarding

### The Navigation Shell (Rail & Tab Bar)
*   **A. Route/URL:** Global (Persistent across all `/` routes)
*   **B. Layout & Aesthetic:** 
    *   **Desktop:** A slim, collapsible navigation rail on the far left. `bg-white` with a subtle `border-r border-slate-200`. Icons are `lucide-react` in `slate-400`, turning `primary` (Indigo) on active state.
    *   **Mobile:** A fixed bottom tab bar (`h-16`) with a central "Omni-Menu" button that is slightly elevated and larger.
*   **C. UI Components:** 
    *   **Nav Items:** Vertical list of icons with tooltips.
    *   **Omni-Menu Button:** A high-contrast indigo button with a `Plus` or `Menu` icon.
    *   **Collapse Toggle:** A chevron at the bottom of the rail.
*   **D. Functionality & Data States:** 
    *   **Hover:** Icons scale 1.1x and show a text label tooltip.
    *   **Active:** A vertical "pill" indicator appears to the left of the icon.
    *   **Mobile Interaction:** Tapping the Omni-Menu triggers a `framer-motion` bottom sheet with a grid of all available apps.

### System Pulse & Global Search
*   **A. Route/URL:** Global Header
*   **B. Layout & Aesthetic:** A top bar (`h-16`) with a glassmorphism effect (`backdrop-blur-md bg-white/80`). 
*   **C. UI Components:** 
    *   **Search Input:** A wide, centered bar with `Cmd+K` hint.
    *   **Pulse Indicator:** A glowing green dot next to "System Healthy".
    *   **Notification Bell:** With a red dot for active alerts.
*   **D. Functionality & Data States:** 
    *   **Cmd+K:** Opens a modal overlay with fuzzy search for containers, logs, and settings.
    *   **Pulse Hover:** Shows a mini-popover with current CPU/RAM averages across the cluster.

### The Nexus Guide (Onboarding)
*   **A. Route/URL:** Triggered on first login or via `/help/tour`
*   **B. Layout & Aesthetic:** High-contrast spotlight effect (dimming the rest of the UI) with white floating tooltips.
*   **C. UI Components:** 
    *   **Step Indicator:** "Step 1 of 5".
    *   **Action Buttons:** "Next", "Skip", "Finish".
*   **D. Functionality & Data States:** 
    *   **Spotlight:** Smoothly animates from one UI element to the next using `layoutId`.
    *   **Completion:** Triggers a "Confetti" animation and sets `onboarding_complete: true` in the user profile database.

---

## 2. Command Center & FinOps

### Main Dashboard
*   **A. Route/URL:** `/dashboard`
*   **B. Layout & Aesthetic:** Bento-grid layout. `bg-slate-50`. Large white cards with `rounded-3xl` and `shadow-sm`.
*   **C. UI Components:** 
    *   **Vital Sparklines:** Real-time D3 line charts for CPU/RAM.
    *   **Quick Action Buttons:** "Deploy New", "Restart Cluster", "Flush Cache".
    *   **Active Incident Card:** Red-pulsing card if alerts are active.
*   **D. Functionality & Data States:** 
    *   **Real-time Updates:** Data streams via WebSockets; charts shift left every second.
    *   **Hover:** Bento cards lift slightly (`-y-1`) with a soft shadow increase.

### NOC Mode
*   **A. Route/URL:** `/noc`
*   **B. Layout & Aesthetic:** High-contrast dark mode override. Large, readable typography for distant viewing (TV screens).
*   **C. UI Components:** 
    *   **Full-screen Telemetry:** Massive percentage counters.
    *   **Scrolling Log Ticker:** A terminal-style feed at the bottom.
*   **D. Functionality & Data States:** 
    *   **Read-Only:** All buttons are disabled to prevent accidental clicks on monitoring walls.
    *   **Auto-Refresh:** Page hard-refreshes every 24 hours to clear memory.

### FinOps & Analytics
*   **A. Route/URL:** `/finops`
*   **B. Layout & Aesthetic:** Financial-focused UI. Uses `emerald-500` for savings and `rose-500` for waste.
*   **C. UI Components:** 
    *   **Savings Calculator:** Interactive slider to compare Nexus vs. AWS costs.
    *   **Carbon Footprint Gauge:** A circular progress bar showing CO2 offset.
    *   **Right-sizing Table:** Lists containers with "Over-provisioned" status.
*   **D. Functionality & Data States:** 
    *   **Optimization Click:** Clicking "Right-size" triggers an automated container restart with lower resource limits.

---

## 3. Core Compute & Orchestration

### Container Orchestrator
*   **A. Route/URL:** `/compute/containers`
*   **B. Layout & Aesthetic:** Context-aware views. Spreadsheet view for databases; File-explorer view for apps.
*   **C. UI Components:** 
    *   **Spreadsheet Grid:** Sortable columns for Image, Status, Port, and Uptime.
    *   **Smart Explorer:** Folder-based view of microservices.
*   **D. Functionality & Data States:** 
    *   **Inline Editing:** Double-clicking a "Port" cell allows immediate modification.
    *   **Bulk Actions:** Checkbox selection triggers a floating "Batch Action" bar.

### The Hypervisor
*   **A. Route/URL:** `/compute/vms`
*   **B. Layout & Aesthetic:** Technical, hardware-inspired UI.
*   **C. UI Components:** 
    *   **Resource Sliders:** For CPU cores and RAM allocation.
    *   **noVNC Terminal:** An embedded `<canvas>` showing the VM's desktop.
*   **D. Functionality & Data States:** 
    *   **Live Migration:** Dragging a VM card from one "Host" card to another triggers a live migration event.

### The Hibernator
*   **A. Route/URL:** `/compute/hibernation`
*   **B. Layout & Aesthetic:** Calm, "sleepy" aesthetic with `indigo-50` accents.
*   **C. UI Components:** 
    *   **Schedule Calendar:** Drag-to-select "Sleep Hours".
    *   **Wake-on-Request Toggle:** Enables the proxy that wakes containers on incoming HTTP traffic.
*   **D. Functionality & Data States:** 
    *   **Sleep State:** Containers show a "Zzz" icon and 0% resource usage when hibernated.

---

## 4. Visual Topologies & Blueprints

### The Infinity Canvas
*   **A. Route/URL:** `/topology`
*   **B. Layout & Aesthetic:** Infinite grid background. Nodes are white cards with live sparklines inside them.
*   **C. UI Components:** 
    *   **2D/3D Toggle:** Switches between a flat map and a WebGL 3D perspective.
    *   **Node Connectors:** SVG lines showing traffic flow and latency.
*   **D. Functionality & Data States:** 
    *   **Drag-and-Drop:** Moving a node updates its `x,y` coordinates in the backend.
    *   **Live Embeds:** Zooming into a node reveals its internal logs.

### Blueprints Marketplace
*   **A. Route/URL:** `/blueprints`
*   **B. Layout & Aesthetic:** App-store style grid. Large preview images of the topology.
*   **C. UI Components:** 
    *   **"Deploy" Button:** 1-click execution.
    *   **Node-map Preview:** A mini-canvas showing the architecture.
*   **D. Functionality & Data States:** 
    *   **Deployment:** Triggers a multi-stage progress bar showing "Provisioning", "Networking", "Health Check".

---

## 5. Security, IAM & Identity

### The Gatekeeper (RBAC)
*   **A. Route/URL:** `/security/iam`
*   **B. Layout & Aesthetic:** Strict, organized grid.
*   **C. UI Components:** 
    *   **Permissions Matrix:** A table where rows are Users and columns are Roles.
    *   **User Table:** With "Last Login" and "MFA Status" columns.
*   **D. Functionality & Data States:** 
    *   **Toggle Change:** Clicking a checkbox in the matrix immediately updates the user's JWT permissions.

### Profile & Security
*   **A. Route/URL:** `/settings/profile`
*   **B. Layout & Aesthetic:** Personal, clean UI.
*   **C. UI Components:** 
    *   **Avatar Upload:** Drag-and-drop circle with preview.
    *   **Device Manager:** List of active sessions with "Revoke" buttons.
*   **D. Functionality & Data States:** 
    *   **WebAuthn Setup:** Triggers the browser's native biometric prompt.

### KMS Vault
*   **A. Route/URL:** `/security/vault`
*   **B. Layout & Aesthetic:** "Bank Vault" feel. Requires a master password to unlock.
*   **C. UI Components:** 
    *   **Masked Inputs:** Values are hidden by default (`••••••••`).
    *   **Injection Map:** Shows which containers are using which secrets.
*   **D. Functionality & Data States:** 
    *   **Reveal:** Clicking the "Eye" icon logs a "Secret Accessed" event in the Audit Blackbox.

### Ghost Protocol
*   **A. Route/URL:** `/security/ghost`
*   **B. Layout & Aesthetic:** Minimalist, high-security UI.
*   **C. UI Components:** 
    *   **Biometric Lock:** A large fingerprint icon.
    *   **Self-Destruct Button:** A red, guarded button.
*   **D. Functionality & Data States:** 
    *   **Cloak:** Toggling "Ghost Mode" blurs all sensitive data on the screen and requires re-authentication to unblur.

---

## 6. Edge Networking & API Gateway

### Tunnel Vision
*   **A. Route/URL:** `/network/tunnels`
*   **B. Layout & Aesthetic:** Terminal-centric UI.
*   **C. UI Components:** 
    *   **Tunnel List:** Cards showing Public URL vs. Local Port.
    *   **Live Traffic Inspector:** A scrolling list of incoming HTTP requests.
*   **D. Functionality & Data States:** 
    *   **Creation:** Clicking "New Tunnel" generates a unique `*.nexus.sh` subdomain.

### Aegis WAF
*   **A. Route/URL:** `/network/waf`
*   **B. Layout & Aesthetic:** Map-based security dashboard.
*   **C. UI Components:** 
    *   **Threat Map:** A world map with red arcs representing blocked attacks.
    *   **Rate Limit Slider:** Interactive control for "Requests per Second".
*   **D. Functionality & Data States:** 
    *   **Geo-blocking:** Clicking a country on the map adds it to the blacklist.

### The Planet (Edge Fleet)
*   **A. Route/URL:** `/network/planet`
*   **B. Layout & Aesthetic:** Immersive WebGL 3D Globe.
*   **C. UI Components:** 
    *   **Anycast Map:** Shows routing paths from users to the nearest edge node.
*   **D. Functionality & Data States:** 
    *   **Rotation:** Users can spin the globe to see node health in different regions.

### The Portal (API Gateway)
*   **A. Route/URL:** `/network/portal`
*   **B. Layout & Aesthetic:** Developer-portal style.
*   **C. UI Components:** 
    *   **Swagger UI:** Embedded API documentation.
    *   **Monetization Toggle:** Connects to Stripe to charge for API usage.
*   **D. Functionality & Data States:** 
    *   **Key Generation:** Clicking "New Key" generates a scoped API token.

---

## 7. CI/CD, GitOps & Compute Edge

### The Forge (Pipeline Builder)
*   **A. Route/URL:** `/cicd/forge`
*   **B. Layout & Aesthetic:** Visual flow-chart builder.
*   **C. UI Components:** 
    *   **Draggable Steps:** "Build", "Test", "Deploy", "Notify".
    *   **Runner Terminal:** A real-time log of the current build.
*   **D. Functionality & Data States:** 
    *   **Live Execution:** Nodes in the flowchart glow green/red as the build progresses.

### GitOps Workspace
*   **A. Route/URL:** `/cicd/gitops`
*   **B. Layout & Aesthetic:** Split-screen code editor.
*   **C. UI Components:** 
    *   **Diff Viewer:** Highlights additions in green and deletions in red.
*   **D. Functionality & Data States:** 
    *   **Sync:** Clicking "Sync Now" pulls the latest commit and applies it to the cluster.

### The Time-Splitter (DB Branching)
*   **A. Route/URL:** `/cicd/database`
*   **B. Layout & Aesthetic:** Timeline-based UI.
*   **C. UI Components:** 
    *   **Branch Tree:** Visual representation of DB snapshots.
*   **D. Functionality & Data States:** 
    *   **Branching:** Creating a branch creates a copy-on-write staging database in seconds.

### The Spark (Serverless)
*   **A. Route/URL:** `/cicd/spark`
*   **B. Layout & Aesthetic:** Code-first UI.
*   **C. UI Components:** 
    *   **Monaco Editor:** Full VS Code-style editing experience.
    *   **Test Console:** For sending mock JSON payloads.
*   **D. Functionality & Data States:** 
    *   **Deploy:** 1-click deployment to global edge isolates.

### The Chronos (Cron Jobs)
*   **A. Route/URL:** `/cicd/chronos`
*   **B. Layout & Aesthetic:** Calendar/Timeline view.
*   **C. UI Components:** 
    *   **Visual Timeline:** Showing when jobs are scheduled to run.
*   **D. Functionality & Data States:** 
    *   **Manual Trigger:** Clicking "Run Now" executes the script immediately.

---

## 8. Observability & Chaos Engineering

### Deep Trace APM
*   **A. Route/URL:** `/obs/trace`
*   **B. Layout & Aesthetic:** Data-dense, professional UI.
*   **C. UI Components:** 
    *   **Flame Graphs:** Showing function call stacks.
    *   **Waterfall Charts:** For request latency breakdown.
*   **D. Functionality & Data States:** 
    *   **SQL Analyzer:** Clicking a slow trace reveals the exact SQL query and execution plan.

### Sentinel Security
*   **A. Route/URL:** `/obs/sentinel`
*   **B. Layout & Aesthetic:** Alert-driven UI.
*   **C. UI Components:** 
    *   **CVE Scanner:** List of vulnerabilities found in Docker images.
*   **D. Functionality & Data States:** 
    *   **Auto-Patch:** Toggling "Auto-rebuild" triggers a new build when a base image is patched.

### The Crucible (Chaos)
*   **A. Route/URL:** `/obs/chaos`
*   **B. Layout & Aesthetic:** High-energy, "experimental" UI.
*   **C. UI Components:** 
    *   **Blast Radius Selector:** A circular slider to define how many nodes are affected.
    *   **Injection Toggles:** "Latency", "Packet Loss", "OOM".
*   **D. Functionality & Data States:** 
    *   **Execution:** Starting a chaos experiment triggers a "Warning" siren across the dashboard.

### AI Doctor
*   **A. Route/URL:** `/obs/doctor`
*   **B. Layout & Aesthetic:** Split-screen "Diagnosis" UI.
*   **C. UI Components:** 
    *   **Log Feed:** Left side showing the error.
    *   **AI Treatment Plan:** Right side showing the suggested fix.
*   **D. Functionality & Data States:** 
    *   **Auto-Heal:** Clicking "Apply Fix" executes the AI's suggested remediation.

### Audit Blackbox
*   **A. Route/URL:** `/obs/audit`
*   **B. Layout & Aesthetic:** Immutable, ledger-style UI.
*   **C. UI Components:** 
    *   **Ledger Table:** Showing Actor, Action, Target, and Timestamp.
*   **D. Functionality & Data States:** 
    *   **Search:** Advanced filtering by severity and resource type.

---

## 9. Multiplayer Collaboration & Comms

### Team Ops Board
*   **A. Route/URL:** `/team/board`
*   **B. Layout & Aesthetic:** Kanban board.
*   **C. UI Components:** 
    *   **Task Cards:** With avatars, priority labels, and due dates.
    *   **Wiki Editor:** Rich-text editor with `/` slash commands.
*   **D. Functionality & Data States:** 
    *   **Real-time Sync:** Moving a card is visible to all team members instantly via WebSockets.

### Contextual Sticky Notes
*   **A. Route/URL:** Global Overlay
*   **B. Layout & Aesthetic:** Floating yellow sticky notes.
*   **C. UI Components:** 
    *   **Note Card:** Draggable and resizable.
*   **D. Functionality & Data States:** 
    *   **URL Pinning:** Notes are only visible on the specific URL they were created on.

### Nexus Comms
*   **A. Route/URL:** `/team/chat`
*   **B. Layout & Aesthetic:** Slack-style real-time chat.
*   **C. UI Components:** 
    *   **Message Feed:** With thread replies and emoji reactions.
    *   **Status Embeds:** Interactive cards showing container health.
*   **D. Functionality & Data States:** 
    *   **Typing Indicators:** "Mohammed is typing..."

### The Siren (Incident Room)
*   **A. Route/URL:** `/team/incident`
*   **B. Layout & Aesthetic:** High-urgency "War Room" UI.
*   **C. UI Components:** 
    *   **Escalation Flowchart:** Visual builder for on-call rotations.
    *   **Active Incident Feed:** Real-time updates from PagerDuty/OpsGenie.
*   **D. Functionality & Data States:** 
    *   **Resolution:** Closing an incident triggers a "Post-Mortem" document generator.

---

## 10. The Control Node (Omni-Settings)

### AI Engine Config
*   **A. Route/URL:** `/settings/ai`
*   **B. Layout & Aesthetic:** Configuration-heavy UI.
*   **C. UI Components:** 
    *   **API Key Inputs:** For OpenAI, Anthropic, and Ollama.
    *   **System Prompt Editor:** Large text area for defining AI behavior.
*   **D. Functionality & Data States:** 
    *   **Test Connection:** Verifies the API key is valid.

### Omni-Credential Manager
*   **A. Route/URL:** `/settings/credentials`
*   **B. Layout & Aesthetic:** Secure, organized list.
*   **C. UI Components:** 
    *   **Credential Cards:** For GitHub, AWS, Docker, and SSH Keys.
*   **D. Functionality & Data States:** 
    *   **Validation:** Automatically checks if credentials have expired.

### Infrastructure Tuning
*   **A. Route/URL:** `/settings/infra`
*   **B. Layout & Aesthetic:** Low-level system UI.
*   **C. UI Components:** 
    *   **Garbage Collection Slider:** For Docker image cleanup.
    *   **Socket Path Input:** For custom Docker socket locations.
*   **D. Functionality & Data States:** 
    *   **Prune:** Clicking "Prune Now" immediately deletes unused images and volumes.

### Chameleon Theme Engine
*   **A. Route/URL:** `/settings/theme`
*   **B. Layout & Aesthetic:** Visual design tool.
*   **C. UI Components:** 
    *   **Color Pickers:** For primary, secondary, and background colors.
    *   **Font Selector:** Dropdown for Inter, Space Grotesk, etc.
*   **D. Functionality & Data States:** 
    *   **Live Preview:** Changes are applied to the entire UI instantly via CSS variables.

---

## 11. The Absolute Archive

### Extra Features & Interactions
*   **System-wide Toasts:** Non-intrusive notifications in the bottom-right corner for success/error events.
*   **Empty States:** Beautifully illustrated placeholders for pages with no data.
*   **Loading Skeletons:** Animated gray blocks that appear while data is being fetched.
*   **Context Menus:** Right-clicking any resource (container, VM, user) opens a custom menu with quick actions.
*   **Keyboard Shortcuts:** `G then D` for Dashboard, `G then C` for Compute, etc.
*   **Responsive Collapsing:** On mobile, all bento grids collapse into a single vertical column, and tables transform into cards.

---

**Nexus OS Manual v1.0** | *Crafted for Excellence.*
