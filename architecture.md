# Architecture & Simulation Mechanics

## Overview

The FP Performance Engineering Academy is a React-based Single Page Application (SPA) designed to teach performance engineering concepts through interactive simulation. It uses a client-side simulation engine to mimic distributed system behavior without requiring a complex backend infrastructure.

## Tech Stack

*   **Frontend Framework:** React 19
*   **Routing:** Wouter (Lightweight router)
*   **Styling:** TailwindCSS v4 (Utility-first CSS) + ShadCN UI (Component Library)
*   **Visualization:** Recharts (Data visualization library)
*   **Icons:** Lucide React

## Simulation Architecture

The core simulation logic resides in `client/src/components/simulation/LoadSimulator.tsx`. It runs entirely in the browser using a `setInterval` loop to generate synthetic telemetry data.

### 1. The "Game Loop"

When the simulation is running (`isRunning` state is true), a `useEffect` hook triggers a data generation cycle every 1000ms (1 second).

```typescript
useEffect(() => {
  if (isRunning) {
    interval = setInterval(() => {
        // 1. Generate new data point
        // 2. Update state
        // 3. Recalculate metrics (P95, Error Rate)
    }, 1000);
  }
}, [isRunning, targetRPS]);
```

### 2. Load Generation Model

The simulator generates synthetic data based on the user-controlled **Target RPS (Requests Per Second)**. It does not actually make network requests; instead, it mathematically models how a system *would* behave under that load.

**Key Formulas:**

*   **RPS Jitter:** `actualRPS = targetRPS + (random() * 20 - 10)`
    *   Adds slight variance to make the graph look realistic.
*   **Base Latency:** `baseLatency = 50 + (targetRPS * 0.1)`
    *   Latency increases linearly with load (Little's Law approximation).
*   **Spike Simulation:** `spikeFactor = isSpike ? random() * 500 : 0`
    *   Randomly injects massive latency spikes (5% probability).
*   **Error Threshold:** `errors = targetRPS > 800 ? (targetRPS - 800) / 10 : 0`
    *   **The "Breaking Point":** The system is hardcoded to start failing at > 800 RPS.
    *   Below 800 RPS: 0 errors.
    *   Above 800 RPS: Errors increase proportionally to the excess load.

### 3. Metric Calculation

*   **P95 Latency:** Calculated from the last batch of simulated request latencies.
*   **Error Rate:** `(Total Errors / Total Requests) * 100`

## System Configuration (New)

The simulation engine is now configurable via the `/settings` page. Parameters are stored in a React Context and persisted to `localStorage`.

**Configurable Parameters:**
*   **Breaking Point (RPS):** The threshold where the system begins to fail (default: 800).
*   **Base Latency:** The minimum latency at 0 load (default: 50ms).
*   **Latency Multiplier:** How much latency increases per RPS (default: 0.1ms).
*   **Spike Probability:** Chance of a random latency spike (default: 5%).

## File Structure

```
client/src/
├── components/
│   ├── layout/
│   │   └── Shell.tsx          # Main application layout (Sidebar + Content Area)
│   ├── simulation/
│   │   └── LoadSimulator.tsx  # Core simulation engine & visualization
│   └── ui/                    # Reusable UI components (Buttons, Cards, Sliders)
├── data/
│   ├── cypressLabs.ts         # Cypress lab definitions & validation logic
│   ├── playwrightLabs.ts      # Playwright lab definitions & validation logic
│   └── incidents.ts           # Incident scenario data
├── pages/
│   ├── Dashboard.tsx          # Main landing page with gamification stats
│   ├── ModuleView.tsx         # Learning interface (Text content + Simulator tab)
│   ├── Leaderboard.tsx        # Gamified ranking page
│   ├── Incidents.tsx          # Production incident scenarios
│   └── playground/            # Internal mock application for testing labs
│       ├── AuthZone.tsx       # Login page mock
│       ├── DataZone.tsx       # Data grid/table mock
│       ├── ApiZone.tsx        # REST API mock
│       └── InteractionsZone.tsx # Drag & drop / events mock
├── App.tsx                    # Route definitions
└── main.tsx                   # Entry point
```

## Data Flow

1.  **User Action:** User drags the slider in `LoadSimulator.tsx` to increase `targetRPS`.
2.  **State Update:** `targetRPS` state updates.
3.  **Simulation Loop:** Next tick of the interval uses the new `targetRPS` value.
4.  **Math Model:**
    *   If `targetRPS` > 800, `generateData()` starts returning non-zero error counts.
    *   `latency` values increase.
5.  **Visualization:** `Recharts` receives the new `data` array and re-renders the area chart, showing the "cliff" where performance degrades.

## Lab & Cookbook Architecture

The platform includes interactive coding labs for Cypress and Playwright. These labs are self-contained and run against an internal "Playground" environment to ensure stability and speed.

### 1. Adding a New Lab

To add a new recipe or lab, you must modify either `client/src/data/cypressLabs.ts` or `client/src/data/playwrightLabs.ts`.

**Lab Structure:**

```typescript
{
  id: "unique-id",            // URL-safe identifier
  title: "Lab Title",         // Display title
  description: "Short desc",  // One-line summary
  difficulty: "Beginner",     // Beginner | Intermediate | Advanced
  icon: IconComponent,        // Lucide-React icon
  initialCode: `...`,         // Starting boilerplate code
  missionBrief: {
    context: "...",           // Explanation of the concept
    objectives: [             // Bullet points for the user
      { id: 1, text: "Do X" },
      { id: 2, text: "Do Y" }
    ]
  },
  validation: (code: string) => {
    // Return object
    return { passed: boolean, logs: string[] };
  }
}
```

### 2. Validation Logic

Validation is performed client-side by analyzing the student's code string. It does **not** execute the code against a real browser.

*   **Mechanism:** Regex pattern matching.
*   **Strategy:** Check for specific API calls, correct selectors, and required parameters.
*   **Output:** Returns a boolean `passed` status and an array of `logs` that act as feedback for the user (e.g., "✓ Selector is correct", "✗ Missing .click()").

### 3. Playground Environment

Labs run against simulated application routes defined in `client/src/pages/playground/`. This environment mimics a real-world application but is contained entirely within the client to enable fast, resilient testing.

*   **Auth Zone (`/playground/auth`):** 
    *   Login forms with validation.
    *   Simulated network delays.
    *   `localStorage` and Cookie persistence simulation.
*   **Data Zone (`/playground/data`):** 
    *   Complex data tables with pagination (`data-testid="btn-next"`).
    *   Client-side filtering and sorting.
    *   File upload (`input[type="file"]`) and download simulation.
*   **Interactions Zone (`/playground/interactions`):** 
    *   **Drag & Drop:** Native HTML5 drag and drop API.
    *   **Secure Payment (iFrame):** A nested iframe to practice `cy.wrap` and `page.frameLocator`.
    *   **Shadow DOM:** A simplified Shadow DOM component to practice piercing shadow roots.
    *   **Canvas:** An HTML5 canvas for testing mouse events (`mousedown`, `mousemove`) and coordinate systems.
    *   **Dialogs:** Native `alert`, `confirm`, and `prompt` triggers.
*   **API Zone (`/playground/api`):** 
    *   Mock REST API endpoints for User Management.
    *   Simulated HTTP status codes (200, 401, 404, 500).
    *   Network request interception practice.

**Extending the Playground:**
If a new lab requires a UI element that doesn't exist (e.g., a specific form input or a canvas element), add it to the relevant `*Zone.tsx` file. Ensure it has a stable `data-testid` attribute to facilitate robust testing in the lab.
