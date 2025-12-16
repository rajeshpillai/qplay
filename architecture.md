# Architecture & Simulation Mechanics

## Overview

The Algorisys Performance Engineering Academy is a React-based Single Page Application (SPA) designed to teach performance engineering concepts through interactive simulation. It uses a client-side simulation engine to mimic distributed system behavior without requiring a complex backend infrastructure.

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
├── pages/
│   ├── Dashboard.tsx          # Main landing page with gamification stats
│   ├── ModuleView.tsx         # Learning interface (Text content + Simulator tab)
│   ├── Leaderboard.tsx        # Gamified ranking page
│   └── Incidents.tsx          # Production incident scenarios
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
