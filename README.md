# FP Performance Engineering Academy (QPlay)

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

## 📉 Real-World Load Testing

Beyond the client-side simulator, you can run **real load tests** against the backend using [k6](https://k6.io/).

1.  **Install k6**:
    *   Mac: `brew install k6`
    *   Linux: `sudo snap install k6` or `apt install k6`
    *   Windows: `winget install k6`

2.  **Run the Load Test**:
    ```bash
    k6 run script/load-test.js
    ```

    This script targets the `/api/v1/kyc/verify` endpoint and uses the **Chaos Middleware** to simulate network conditions:
    *   `x-sim-latency`: random 0-50ms delay
    *   `x-sim-error-rate`: 0.5% failure rate

3.  **Monitor**:
    Open `http://localhost:5000/health/metrics` in your browser to see real-time CPU/Memory usage of the Node.js server during the test.

### 4. Interpreting Results
How to analyze the data from `/health/metrics`:

*   **Memory - RSS (Resident Set Size)**:
    *   **What it is:** Total memory allocated to the server process.
    *   **Bad Sign:** If this *steadily increases* during a load test and never drops, you likely have a **Memory Leak**.
    *   **Good Sign:** Fluctuation is normal, but it should stay relatively stable under constant load.
*   **Memory - HeapUsed**:
    *   **What it is:** Memory actually being used by your Javascript objects.
    *   **Analysis:** If `HeapUsed` is close to `HeapTotal`, the Garbage Collector (GC) will work harder, causing high CPU usage and latency spikes.
*   **CPU Usage**:
    *   **User Time:** High values mean your code (business logic) is heavy. (e.g., our `Math.sqrt` loop in the mock endpoint).
    *   **System Time:** High values usually indicate OS-level overhead (networking, file I/O).
*   **Uptime**:
    *   **Critical:** If this value resets to `0` during a test, your server **crashed** and restarted (likely via PM2 or custom logic).

## ☁️ Deployment (Ubuntu)

Guide to deploying the full-stack application (React + Express) on an Ubuntu server.

### 1. Database & Prerequisites
```bash
# Update and install utilities
sudo apt update && sudo apt install -y git curl

# Install Node.js (v20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Setup Application
```bash
# Clone repository
git clone https://github.com/rajeshpillai/qplay.git
cd qplay

# Install dependencies
npm ci

# Build frontend and backend
npm run build
```

### 3. Run with PM2
We use PM2 to keep the server running in the background.
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
# NODE_ENV=production tells it to serve the static frontend from dist/
NODE_ENV=production pm2 start dist/index.cjs --name "qplay"

# Save process list so it respawns on reboot
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy (Optional)
To serve on port 80 (HTTP):
```bash
sudo apt install -y nginx
```

Edit config: `/etc/nginx/sites-available/default`
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Restart Nginx:
```bash
sudo systemctl restart nginx
```

