import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Chaos Middleware (Simulation Engine) ---
  app.use("/api", async (req, res, next) => {
    // 1. Simulate Latency
    const latency = parseInt(req.headers['x-sim-latency'] as string || "0", 10);
    if (latency > 0) {
      await new Promise(resolve => setTimeout(resolve, latency));
    }

    // 2. Simulate Random Failures
    const failRate = parseFloat(req.headers['x-sim-error-rate'] as string || "0");
    if (Math.random() < failRate) {
      res.status(500).json({ error: "Simulated Internal Server Error (Chaos)" });
      return;
    }

    next();
  });

  // --- Real-world Metrics Endpoint ---
  // Exposed for k6 or frontend to monitor server health
  app.get("/health/metrics", (_req, res) => {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    res.json({
      timestamp: new Date().toISOString(),
      cpu: cpuUsage,
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + "MB",
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
      },
      uptime: process.uptime()
    });
  });

  // --- Mock Business Logic ---
  // Matches the simulator's "POST /api/v1/kyc/verify" scenario
  app.post("/api/v1/kyc/verify", (req, res) => {
    // Simulate some CPU work
    let x = 0;
    for (let i = 0; i < 100000; i++) { x += Math.sqrt(i); }

    res.json({
      status: "verified",
      riskScore: Math.floor(Math.random() * 100),
      transactionId: `txn_${Date.now()}_${x.toFixed(0)}`
    });
  });

  return httpServer;
}
