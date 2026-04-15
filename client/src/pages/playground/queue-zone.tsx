import React, { useState, useRef, useEffect, useCallback } from "react";
import Shell from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Workflow, Play, RotateCcw, User, CheckCircle2, Clock, Loader2, ExternalLink, Radio, Repeat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ═══════════════════════════════════════════════════════════════
// Shared types & constants
// ═══════════════════════════════════════════════════════════════

interface WorkItem {
  id: string;
  applicant: string;
  type: string;
  status: "pending" | "in-progress" | "done";
  assignedTo: number | null;
}

const INITIAL_ITEMS: WorkItem[] = [
  { id: "APP-001", applicant: "Alice Sharma", type: "ID Verification", status: "pending", assignedTo: null },
  { id: "APP-002", applicant: "Bob Chen", type: "Address Proof", status: "pending", assignedTo: null },
  { id: "APP-003", applicant: "Carol Davis", type: "ID Verification", status: "pending", assignedTo: null },
  { id: "APP-004", applicant: "David Kim", type: "Bank Statement", status: "pending", assignedTo: null },
  { id: "APP-005", applicant: "Eve Martinez", type: "ID Verification", status: "pending", assignedTo: null },
  { id: "APP-006", applicant: "Frank Patel", type: "Address Proof", status: "pending", assignedTo: null },
  { id: "APP-007", applicant: "Grace Lee", type: "Bank Statement", status: "pending", assignedTo: null },
  { id: "APP-008", applicant: "Hiro Tanaka", type: "ID Verification", status: "pending", assignedTo: null },
];

const WORKER_COLORS = ["text-blue-400", "text-green-400", "text-purple-400", "text-orange-400"];
const WORKER_BG = ["bg-blue-500/10", "bg-green-500/10", "bg-purple-500/10", "bg-orange-500/10"];

const STORAGE_KEY = "qplay_multi_queue";
const CHANNEL_NAME = "qplay_queue_channel";

// ═══════════════════════════════════════════════════════════════
// Shared UI: Queue Item Grid
// ═══════════════════════════════════════════════════════════════

function QueueGrid({ items }: { items: WorkItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(item => (
        <div
          key={item.id}
          className={`p-3 rounded-lg border transition-all duration-300 ${
            item.status === "done"
              ? "bg-green-500/5 border-green-500/20"
              : item.status === "in-progress"
              ? "bg-yellow-500/5 border-yellow-500/20 animate-pulse"
              : "bg-card/40 border-white/10"
          }`}
          data-testid={`queue-item-${item.id}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold">{item.id}</span>
            <Badge
              variant={item.status === "done" ? "secondary" : item.status === "in-progress" ? "default" : "outline"}
              className={`text-[10px] ${
                item.status === "done"
                  ? "bg-green-500/20 text-green-400"
                  : item.status === "in-progress"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : ""
              }`}
              data-testid={`queue-status-${item.id}`}
            >
              {item.status}
            </Badge>
          </div>
          <p className="text-sm truncate">{item.applicant}</p>
          <p className="text-xs text-muted-foreground">{item.type}</p>
          {item.assignedTo && (
            <p className={`text-xs mt-1 font-mono ${WORKER_COLORS[(item.assignedTo - 1) % WORKER_COLORS.length]}`}>
              Worker #{item.assignedTo}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Mode 1: Single-Tab Simulation (original)
// ═══════════════════════════════════════════════════════════════

interface WorkerState {
  id: number;
  currentItem: string | null;
  itemsCompleted: number;
}

function SingleTabMode() {
  const [items, setItems] = useState<WorkItem[]>(INITIAL_ITEMS.map(i => ({ ...i })));
  const [workers, setWorkers] = useState<WorkerState[]>([]);
  const [workerCount, setWorkerCount] = useState("3");
  const [running, setRunning] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stoppedRef = useRef(false);

  const completedCount = items.filter(i => i.status === "done").length;
  const allDone = completedCount === items.length && running;

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const runWorker = (workerId: number) => {
    const processNext = () => {
      if (stoppedRef.current) return;

      let claimedId: string | null = null;
      setItems(prev => {
        const idx = prev.findIndex(i => i.status === "pending");
        if (idx === -1) return prev;
        claimedId = prev[idx].id;
        const next = [...prev];
        next[idx] = { ...next[idx], status: "in-progress", assignedTo: workerId };
        return next;
      });

      const checkTimeout = setTimeout(() => {
        if (stoppedRef.current) return;
        if (!claimedId) {
          setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, currentItem: null } : w));
          return;
        }

        setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, currentItem: claimedId } : w));

        const delay = 1500 + Math.random() * 1500;
        const processTimeout = setTimeout(() => {
          if (stoppedRef.current) return;
          setItems(prev => prev.map(i => i.id === claimedId ? { ...i, status: "done" } : i));
          setWorkers(prev =>
            prev.map(w => w.id === workerId ? { ...w, currentItem: null, itemsCompleted: w.itemsCompleted + 1 } : w)
          );
          const nextTimeout = setTimeout(processNext, 200);
          timeoutRefs.current.push(nextTimeout);
        }, delay);
        timeoutRefs.current.push(processTimeout);
      }, 30);
      timeoutRefs.current.push(checkTimeout);
    };
    processNext();
  };

  const handleStart = () => {
    stoppedRef.current = false;
    const count = parseInt(workerCount);
    const newWorkers: WorkerState[] = Array.from({ length: count }, (_, i) => ({
      id: i + 1, currentItem: null, itemsCompleted: 0,
    }));
    setWorkers(newWorkers);
    setRunning(true);
    newWorkers.forEach((w, i) => {
      const t = setTimeout(() => runWorker(w.id), i * 150);
      timeoutRefs.current.push(t);
    });
  };

  const handleReset = () => {
    stoppedRef.current = true;
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setItems(INITIAL_ITEMS.map(i => ({ ...i })));
    setWorkers([]);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Workers:</span>
          <Select value={workerCount} onValueChange={setWorkerCount} disabled={running}>
            <SelectTrigger className="w-20" data-testid="select-worker-count">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleStart} disabled={running} data-testid="btn-start-workers">
          <Play className="h-4 w-4 mr-2 fill-current" /> Start Workers
        </Button>
        <Button variant="outline" onClick={handleReset} data-testid="btn-reset-queue">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <div className="ml-auto text-sm font-mono text-muted-foreground" data-testid="queue-progress">
          {completedCount}/{items.length} completed
        </div>
      </div>

      <QueueGrid items={items} />

      {workers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Workers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workers.map(worker => (
              <div
                key={worker.id}
                className={`flex items-center gap-3 p-3 rounded-lg border border-white/10 ${WORKER_BG[(worker.id - 1) % WORKER_BG.length]}`}
                data-testid={`worker-lane-${worker.id}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${WORKER_COLORS[(worker.id - 1) % WORKER_COLORS.length]} bg-white/5`}>
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Worker #{worker.id}</p>
                  <p className="text-xs text-muted-foreground" data-testid={`worker-current-${worker.id}`}>
                    {worker.currentItem ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Processing {worker.currentItem}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Idle
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-bold" data-testid={`worker-completed-${worker.id}`}>{worker.itemsCompleted}</p>
                  <p className="text-[10px] text-muted-foreground">done</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allDone && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-3" data-testid="queue-complete">
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-bold">Queue Complete</p>
            <p className="text-xs text-green-400/80">All {items.length} items processed by {workers.length} worker{workers.length > 1 ? "s" : ""}.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Mode 2: Multi-Tab (each browser tab = 1 worker)
// Uses localStorage for shared queue state + BroadcastChannel for sync
// ═══════════════════════════════════════════════════════════════

function getSharedQueue(): WorkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return INITIAL_ITEMS.map(i => ({ ...i }));
}

function setSharedQueue(items: WorkItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Simple atomic claim: read → find pending → write back with claim
// Uses a "lock" key in localStorage to prevent races between tabs
function atomicClaim(workerId: number): string | null {
  const lockKey = STORAGE_KEY + "_lock";

  // Spin-try to acquire lock (simple flag-based, good enough for demo)
  if (localStorage.getItem(lockKey)) return null; // another tab is claiming
  localStorage.setItem(lockKey, "1");

  try {
    const queue = getSharedQueue();
    const idx = queue.findIndex(i => i.status === "pending");
    if (idx === -1) {
      return null;
    }
    queue[idx] = { ...queue[idx], status: "in-progress", assignedTo: workerId };
    setSharedQueue(queue);
    return queue[idx].id;
  } finally {
    localStorage.removeItem(lockKey);
  }
}

function atomicComplete(itemId: string) {
  const queue = getSharedQueue();
  const idx = queue.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    queue[idx] = { ...queue[idx], status: "done" };
    setSharedQueue(queue);
  }
}

function MultiTabMode() {
  const [myWorkerId, setMyWorkerId] = useState<number | null>(null);
  const [items, setItems] = useState<WorkItem[]>(getSharedQueue());
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const [myCompleted, setMyCompleted] = useState(0);
  const [processing, setProcessing] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stoppedRef = useRef(false);

  const completedCount = items.filter(i => i.status === "done").length;
  const allDone = completedCount === items.length && myWorkerId !== null;

  // Assign a worker ID on mount (auto-increment from localStorage)
  useEffect(() => {
    const counterKey = STORAGE_KEY + "_counter";
    const current = parseInt(localStorage.getItem(counterKey) || "0");
    const id = current + 1;
    localStorage.setItem(counterKey, String(id));
    setMyWorkerId(id);

    // Set up BroadcastChannel to sync queue state across tabs
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === "queue-updated") {
        setItems(getSharedQueue());
      } else if (event.data.type === "reset") {
        stoppedRef.current = true;
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
        setItems(getSharedQueue());
        setCurrentItem(null);
        setMyCompleted(0);
        setProcessing(false);
      }
    };

    // Also listen to storage events for cross-tab sync
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setItems(getSharedQueue());
      }
    };
    window.addEventListener("storage", storageHandler);

    // Load current state
    setItems(getSharedQueue());

    return () => {
      stoppedRef.current = true;
      timeoutRefs.current.forEach(clearTimeout);
      channel.close();
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  const broadcast = useCallback(() => {
    channelRef.current?.postMessage({ type: "queue-updated" });
  }, []);

  const processNext = useCallback(() => {
    if (stoppedRef.current || !myWorkerId) return;

    const claimedId = atomicClaim(myWorkerId);
    if (!claimedId) {
      setCurrentItem(null);
      setProcessing(false);
      setItems(getSharedQueue());
      return;
    }

    setCurrentItem(claimedId);
    setItems(getSharedQueue());
    broadcast();

    const delay = 1500 + Math.random() * 1500;
    const t = setTimeout(() => {
      if (stoppedRef.current) return;
      atomicComplete(claimedId);
      setMyCompleted(prev => prev + 1);
      setCurrentItem(null);
      setItems(getSharedQueue());
      broadcast();

      // Grab next after short pause
      const t2 = setTimeout(() => processNext(), 200);
      timeoutRefs.current.push(t2);
    }, delay);
    timeoutRefs.current.push(t);
  }, [myWorkerId, broadcast]);

  const handleStartProcessing = () => {
    stoppedRef.current = false;
    setProcessing(true);
    processNext();
  };

  const handleReset = () => {
    stoppedRef.current = true;
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setSharedQueue(INITIAL_ITEMS.map(i => ({ ...i })));
    localStorage.removeItem(STORAGE_KEY + "_counter");
    setItems(INITIAL_ITEMS.map(i => ({ ...i })));
    setCurrentItem(null);
    setMyCompleted(0);
    setProcessing(false);
    // Tell other tabs to reset
    channelRef.current?.postMessage({ type: "reset" });
  };

  const handleOpenTab = () => {
    const base = import.meta.env.BASE_URL || "/";
    window.open(`${base}playground/queue`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* This tab's identity */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-green-400 animate-pulse" />
          <span className="text-sm font-mono" data-testid="my-worker-id">
            You are <span className={`font-bold ${WORKER_COLORS[((myWorkerId || 1) - 1) % WORKER_COLORS.length]}`}>Worker #{myWorkerId}</span>
          </span>
        </div>
        <Badge variant="secondary" className="text-xs" data-testid="my-completed">
          {myCompleted} items done
        </Badge>
        {currentItem && (
          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs animate-pulse" data-testid="my-current-item">
            Processing {currentItem}
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button onClick={handleOpenTab} variant="outline" data-testid="btn-open-worker-tab">
          <ExternalLink className="h-4 w-4 mr-2" /> Open Another Worker Tab
        </Button>
        <Button
          onClick={handleStartProcessing}
          disabled={processing || allDone}
          data-testid="btn-start-processing"
        >
          <Play className="h-4 w-4 mr-2 fill-current" /> Start Processing
        </Button>
        <Button variant="outline" onClick={handleReset} data-testid="btn-reset-multi-queue">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset All
        </Button>
        <div className="ml-auto text-sm font-mono text-muted-foreground" data-testid="multi-queue-progress">
          {completedCount}/{items.length} completed
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-muted/30 border border-white/5 rounded-md text-sm text-muted-foreground space-y-1">
        <p><strong>How it works:</strong> Each browser tab is an independent worker. All tabs share the same queue via localStorage.</p>
        <p>1. Click <strong>"Open Another Worker Tab"</strong> to spawn more workers (each tab gets a unique Worker ID).</p>
        <p>2. Click <strong>"Start Processing"</strong> in each tab. Workers atomically claim items — no duplicates.</p>
        <p>3. Watch items get distributed across tabs in real time.</p>
      </div>

      {/* Shared Queue */}
      <QueueGrid items={items} />

      {/* Completion */}
      {allDone && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-3" data-testid="multi-queue-complete">
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-bold">Queue Complete</p>
            <p className="text-xs text-green-400/80">All {items.length} items processed across all worker tabs.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Mode 3: Loop Runner (N iterations, M concurrency, unique tasks)
// Simulates: for (user of users) { pick task, process it }
// ═══════════════════════════════════════════════════════════════

interface LoopTask {
  id: number;
  userId: string;
  task: string;
  status: "queued" | "running" | "done";
  worker: number | null;
  duration: number | null;
}

const TASK_TYPES = [
  "KYC Verification",
  "Address Proof Upload",
  "Bank Statement Review",
  "Selfie Capture",
  "PAN Card Validation",
  "Aadhaar eKYC",
  "Video KYC Call",
  "Document OCR Check",
  "Risk Assessment",
  "Compliance Audit",
  "Liveness Detection",
  "Signature Verification",
];

function LoopRunnerMode() {
  const [totalIterations, setTotalIterations] = useState("8");
  const [concurrency, setConcurrency] = useState("3");
  const [tasks, setTasks] = useState<LoopTask[]>([]);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stoppedRef = useRef(false);

  const completedCount = tasks.filter(t => t.status === "done").length;
  const runningCount = tasks.filter(t => t.status === "running").length;
  const allDone = tasks.length > 0 && completedCount === tasks.length;

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleStart = () => {
    stoppedRef.current = false;
    const total = Math.max(1, Math.min(20, parseInt(totalIterations) || 8));
    const maxConcurrent = Math.max(1, Math.min(6, parseInt(concurrency) || 3));

    // Generate unique tasks for each iteration
    const newTasks: LoopTask[] = Array.from({ length: total }, (_, i) => ({
      id: i + 1,
      userId: `User-${String(i + 1).padStart(2, "0")}`,
      task: TASK_TYPES[i % TASK_TYPES.length],
      status: "queued" as const,
      worker: null,
      duration: null,
    }));

    setTasks(newTasks);
    setRunning(true);
    setStartTime(Date.now());
    setEndTime(null);

    // Semaphore-based concurrency: start up to maxConcurrent, then fill slots
    let nextIndex = 0;
    let activeCount = 0;

    const tryStartNext = () => {
      if (stoppedRef.current) return;

      while (activeCount < maxConcurrent && nextIndex < total) {
        const taskIdx = nextIndex;
        nextIndex++;
        activeCount++;

        const workerSlot = (taskIdx % maxConcurrent) + 1;

        // Mark as running
        setTasks(prev =>
          prev.map((t, i) => i === taskIdx ? { ...t, status: "running", worker: workerSlot } : t)
        );

        // Simulate processing (1-3s)
        const delay = 1000 + Math.random() * 2000;
        const t = setTimeout(() => {
          if (stoppedRef.current) return;

          // Mark as done
          setTasks(prev =>
            prev.map((t, i) =>
              i === taskIdx ? { ...t, status: "done", duration: Math.round(delay) } : t
            )
          );
          activeCount--;

          // Check if all done
          if (nextIndex >= total && activeCount === 0) {
            setEndTime(Date.now());
          }

          // Start next queued task
          tryStartNext();
        }, delay);
        timeoutRefs.current.push(t);
      }
    };

    tryStartNext();
  };

  const handleReset = () => {
    stoppedRef.current = true;
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setTasks([]);
    setRunning(false);
    setStartTime(null);
    setEndTime(null);
  };

  const elapsed = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(1) : null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Total Iterations</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={totalIterations}
            onChange={e => setTotalIterations(e.target.value)}
            className="w-24"
            disabled={running}
            data-testid="input-total-iterations"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Concurrency (max parallel)</Label>
          <Input
            type="number"
            min={1}
            max={6}
            value={concurrency}
            onChange={e => setConcurrency(e.target.value)}
            className="w-24"
            disabled={running}
            data-testid="input-concurrency"
          />
        </div>
        <div className="space-y-1 pt-4">
          <Button onClick={handleStart} disabled={running && !allDone} data-testid="btn-start-loop">
            <Play className="h-4 w-4 mr-2 fill-current" /> Run Loop
          </Button>
        </div>
        <div className="space-y-1 pt-4">
          <Button variant="outline" onClick={handleReset} data-testid="btn-reset-loop">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-6 text-sm font-mono">
          <span data-testid="loop-progress">
            <span className="text-muted-foreground">Progress:</span>{" "}
            <span className="text-primary font-bold">{completedCount}/{tasks.length}</span>
          </span>
          <span data-testid="loop-running-count">
            <span className="text-muted-foreground">Running:</span>{" "}
            <span className="text-yellow-400 font-bold">{runningCount}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Concurrency:</span>{" "}
            <span className="font-bold">{concurrency}</span>
          </span>
          {elapsed && (
            <span data-testid="loop-elapsed">
              <span className="text-muted-foreground">Total time:</span>{" "}
              <span className="text-green-400 font-bold">{elapsed}s</span>
            </span>
          )}
        </div>
      )}

      {/* Task Table */}
      {tasks.length > 0 && (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[60px_100px_1fr_100px_80px_80px] gap-2 p-3 bg-black/20 text-xs font-mono text-muted-foreground uppercase">
            <span>#</span>
            <span>User</span>
            <span>Task</span>
            <span>Status</span>
            <span>Worker</span>
            <span>Time</span>
          </div>
          <div className="max-h-[400px] overflow-auto">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`grid grid-cols-[60px_100px_1fr_100px_80px_80px] gap-2 p-3 border-t border-white/5 text-sm transition-colors ${
                  task.status === "running" ? "bg-yellow-500/5" : task.status === "done" ? "bg-green-500/5" : ""
                }`}
                data-testid={`loop-task-${task.id}`}
              >
                <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                <span className="font-mono text-xs" data-testid={`loop-user-${task.id}`}>{task.userId}</span>
                <span className="text-xs truncate">{task.task}</span>
                <Badge
                  variant={task.status === "done" ? "secondary" : task.status === "running" ? "default" : "outline"}
                  className={`text-[10px] w-fit ${
                    task.status === "done"
                      ? "bg-green-500/20 text-green-400"
                      : task.status === "running"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : ""
                  }`}
                  data-testid={`loop-status-${task.id}`}
                >
                  {task.status === "running" && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  {task.status}
                </Badge>
                <span className={`text-xs font-mono ${task.worker ? WORKER_COLORS[(task.worker - 1) % WORKER_COLORS.length] : "text-muted-foreground"}`}>
                  {task.worker ? `W#${task.worker}` : "—"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {task.duration ? `${(task.duration / 1000).toFixed(1)}s` : task.status === "running" ? "..." : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion */}
      {allDone && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-3" data-testid="loop-complete">
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-bold">All Iterations Complete</p>
            <p className="text-xs text-green-400/80">
              {tasks.length} tasks processed with concurrency {concurrency} in {elapsed}s.
            </p>
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="p-3 bg-muted/30 border border-white/5 rounded-md text-sm text-muted-foreground space-y-1">
          <p><strong>How it works:</strong> A loop spawns N user tasks. Up to M run concurrently (like a semaphore).</p>
          <p>Each iteration gets a <strong>unique task</strong> — no two users do the same work.</p>
          <p>In Playwright: this maps to <code>test.describe.configure(&#123; mode: 'parallel' &#125;)</code> with <code>workers: M</code>.</p>
          <p>In Cypress: this maps to dynamic <code>it()</code> generation with <code>--parallel</code>.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Component: Tabbed layout with all three modes
// ═══════════════════════════════════════════════════════════════

export default function QueueZone() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">Work Queue Zone</h1>
          <p className="text-muted-foreground">
            Test parallel work distribution — single-tab simulation or real multi-tab workers sharing a queue.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Parallel Work Queue Processor
            </CardTitle>
            <CardDescription>
              Three modes: simulated workers, real multi-tab workers, or a loop runner with controlled concurrency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="single" data-testid="tab-single-mode">Single-Tab</TabsTrigger>
                <TabsTrigger value="multi" data-testid="tab-multi-mode">Multi-Tab</TabsTrigger>
                <TabsTrigger value="loop" data-testid="tab-loop-mode">Loop Runner</TabsTrigger>
              </TabsList>
              <TabsContent value="single">
                <SingleTabMode />
              </TabsContent>
              <TabsContent value="multi">
                <MultiTabMode />
              </TabsContent>
              <TabsContent value="loop">
                <LoopRunnerMode />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
