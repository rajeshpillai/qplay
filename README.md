# Algorisys Performance Engineering Academy (Route Forge)

A React-based interactive training platform for mastering performance engineering and test automation concepts (Cypress & Playwright).

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the client**:
    ```bash
    npm run dev:client
    ```
3.  **Open in browser**:
    Navigate to `http://localhost:5000` (or the port shown in your terminal).

## 🏗 Project Structure

This is a **Single Page Application (SPA)** that uses a client-side simulation engine to mimic real-world system behavior (latency, errors, spikes) without a complex backend.

*   `client/src/components/simulation`: Core load simulator engine.
*   `client/src/data`: Lab definitions for Cypress (`cypressLabs.ts`) and Playwright (`playwrightLabs.ts`).
*   `client/src/pages/playground`: The internal "Playground" application used as the target for all automation labs.

## 🧪 Testing Playground

To ensure labs are resilient and fast, they run against an internal **Playground** environment which mocks various real-world scenarios:

| Zone | Route | Purpose |
| :--- | :--- | :--- |
| **Auth Zone** | `/playground/auth` | Login forms, validation, `localStorage`, Cookies. |
| **Data Zone** | `/playground/data` | Complex tables, pagination, sorting, filtering, file uploads. |
| **Interactions** | `/playground/interactions` | Drag & Drop, iFrames (Payment), Shadow DOM, Canvas, Tooltips. |
| **API Zone** | `/playground/api` | Mock REST API with customizable status codes and delays. |

### 🛠 How to Add New Recipes

Labs are defined as data objects in `client/src/data/`. To add a new lab:

1.  Open `client/src/data/cypressLabs.ts` or `client/src/data/playwrightLabs.ts`.
2.  Add a new object to the array:
    ```typescript
    {
      id: "my-new-lab",
      title: "My New Lab",
      description: "Short description.",
      difficulty: "Beginner",
      icon: Icon, // Import from lucide-react
      initialCode: `describe('My Lab', () => { ... });`,
      missionBrief: {
        context: "Explain concept...",
        objectives: [{ id: 1, text: "Task 1" }]
      },
      validation: (code: string) => {
        // Return { passed: boolean, logs: string[] }
        return { passed: true, logs: ["✓ Check passed"] };
      }
    }
    ```
3.  **Validation**: Since labs run in the browser, validation is currently **Regex-based**. Ensure your regex checks for the correct API calls and selectors.

## 🤝 Contributing

*   **Selectors**: Always use `data-testid` attributes in the Playground and reference them in labs.
*   **New UI**: If a new lab requires a UI element that doesn't exist (e.g., a specific form input or a canvas element), add it to the relevant `*Zone.tsx` in `client/src/pages/playground/`.
