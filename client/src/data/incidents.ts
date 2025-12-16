export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "WARNING" | "RESOLVED";
  status: "active" | "resolved";
  startTime: string;
  impact: "High" | "Medium" | "Low";
  
  // Investigation Data
  logs: LogEntry[];
  metrics: {
    cpu: number[]; // Array of 12 values (0-100)
    memory: number[]; // Array of 12 values (0-100)
    dbConnections: number[]; // Array of 12 values (0-100)
    latency: number[]; // Array of 12 values (ms)
  };
  
  // RCA
  options: { id: string; label: string; description: string }[];
  correctOptionId: string;
  explanation: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "1",
    title: "KYC API Latency Spike > 5s",
    description: "Customers reporting timeouts during Aadhaar Verification step. Queue depth increasing rapidly.",
    severity: "CRITICAL",
    status: "active",
    startTime: "12 mins ago",
    impact: "High",
    logs: [
      { timestamp: "10:14:22", level: "INFO", service: "api-gateway", message: "Incoming request: POST /api/v1/kyc/verify" },
      { timestamp: "10:14:22", level: "INFO", service: "auth-service", message: "Token validation successful for user_id: 8821" },
      { timestamp: "10:14:23", level: "INFO", service: "kyc-processor", message: "Processing Aadhaar OCR task..." },
      { timestamp: "10:14:25", level: "WARN", service: "db-primary", message: "Connection acquisition took 2005ms" },
      { timestamp: "10:14:28", level: "ERROR", service: "api-gateway", message: "Upstream timeout: kyc-processor (5000ms)" }
    ],
    metrics: {
      cpu: [40, 42, 45, 38, 41, 44, 42, 39, 41, 43, 40, 42],
      memory: [60, 61, 60, 62, 61, 60, 61, 62, 60, 61, 60, 61],
      dbConnections: [60, 65, 72, 80, 88, 95, 99, 100, 100, 100, 100, 100],
      latency: [120, 130, 150, 400, 800, 1500, 3000, 5000, 5000, 5000, 5000, 5000]
    },
    options: [
      { id: "cpu", label: "CPU Saturation", description: "Application logic is too heavy for current compute resources." },
      { id: "db-pool", label: "DB Connection Pool", description: "Application cannot acquire database connections fast enough." },
      { id: "external", label: "External API Timeout", description: "Aadhaar/PAN vendor API is unresponsive." }
    ],
    correctOptionId: "db-pool",
    explanation: "The DB Connections graph shows 100% saturation, and logs indicate connection acquisition delays. This is a classic connection pool exhaustion issue."
  },
  {
    id: "2",
    title: "Memory Leak in Worker Nodes",
    description: "Worker nodes are crashing with OOM (Out of Memory) errors every 4 hours.",
    severity: "WARNING",
    status: "active",
    startTime: "2 hours ago",
    impact: "Medium",
    logs: [
      { timestamp: "14:00:01", level: "INFO", service: "worker-node-1", message: "Job processing started: batch_882" },
      { timestamp: "14:15:33", level: "WARN", service: "worker-node-1", message: "Garbage Collection took 1200ms (Stop-the-world)" },
      { timestamp: "14:30:12", level: "WARN", service: "worker-node-1", message: "Heap usage at 92%" },
      { timestamp: "14:45:00", level: "ERROR", service: "worker-node-1", message: "FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory" },
      { timestamp: "14:45:01", level: "INFO", service: "orchestrator", message: "Restarting worker-node-1..." }
    ],
    metrics: {
      cpu: [20, 25, 30, 40, 60, 80, 20, 25, 30, 40, 60, 80], // Spikes during GC
      memory: [30, 40, 50, 60, 70, 80, 90, 95, 100, 30, 40, 50], // Sawtooth pattern (leak -> crash -> restart)
      dbConnections: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
      latency: [50, 55, 60, 100, 200, 500, 50, 55, 60, 100, 200, 500]
    },
    options: [
      { id: "leak", label: "Memory Leak", description: "Objects are not being garbage collected, leading to OOM." },
      { id: "infinite-loop", label: "Infinite Loop", description: "Code is stuck in a loop consuming CPU." },
      { id: "disk-full", label: "Disk Space Exhaustion", description: "No space left on device for temporary files." }
    ],
    correctOptionId: "leak",
    explanation: "The memory graph shows a steady climb to 100% followed by a drop (restart). Logs confirm 'JavaScript heap out of memory'. This is a definitive memory leak."
  },
  {
    id: "3",
    title: "Slow Database Queries",
    description: "Search functionality is degrading. P99 latency has jumped from 200ms to 2.5s.",
    severity: "WARNING",
    status: "active",
    startTime: "45 mins ago",
    impact: "Medium",
    logs: [
      { timestamp: "09:30:05", level: "INFO", service: "search-service", message: "Querying user index for term 'ravi'" },
      { timestamp: "09:30:08", level: "WARN", service: "db-replica", message: "Slow query detected: SELECT * FROM users WHERE name LIKE '%ravi%' (Duration: 2800ms)" },
      { timestamp: "09:30:08", level: "WARN", service: "db-replica", message: "Query plan indicates FULL TABLE SCAN on 'users'" },
      { timestamp: "09:30:09", level: "INFO", service: "search-service", message: "Result returned: 154 matches" }
    ],
    metrics: {
      cpu: [30, 32, 31, 33, 30, 32, 31, 33, 30, 32, 31, 33],
      memory: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
      dbConnections: [40, 45, 50, 45, 40, 45, 50, 45, 40, 45, 50, 45], // Stable connections
      latency: [200, 2200, 2500, 2100, 2300, 2400, 2200, 2500, 2100, 2300, 2400, 2200] // High latency
    },
    options: [
      { id: "missing-index", label: "Missing DB Index", description: "Database is performing full table scans instead of using an index." },
      { id: "network-congestion", label: "Network Congestion", description: "Packets are being dropped between service and DB." },
      { id: "deadlock", label: "Database Deadlock", description: "Transactions are blocking each other." }
    ],
    correctOptionId: "missing-index",
    explanation: "Logs explicitly state 'FULL TABLE SCAN' and 'Slow query'. High latency with stable resources points to an unoptimized query or missing index."
  }
];
