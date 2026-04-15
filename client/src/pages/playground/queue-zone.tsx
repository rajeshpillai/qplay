import React, { useState, useRef, useCallback, useEffect } from "react";
import Shell from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Workflow, Play, RotateCcw, User, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface WorkItem {
  id: string;
  applicant: string;
  type: string;
  status: "pending" | "in-progress" | "done";
  assignedTo: number | null;
}

interface WorkerState {
  id: number;
  currentItem: string | null;
  itemsCompleted: number;
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

export default function QueueZone() {
  const [items, setItems] = useState<WorkItem[]>(INITIAL_ITEMS.map(i => ({ ...i })));
  const [workers, setWorkers] = useState<WorkerState[]>([]);
  const [workerCount, setWorkerCount] = useState("3");
  const [running, setRunning] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const completedCount = items.filter(i => i.status === "done").length;
  const allDone = completedCount === items.length && running;

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const claimNextItem = useCallback((workerId: number): string | null => {
    let claimed: string | null = null;
    setItems(prev => {
      const idx = prev.findIndex(i => i.status === "pending");
      if (idx === -1) return prev;
      claimed = prev[idx].id;
      const next = [...prev];
      next[idx] = { ...next[idx], status: "in-progress", assignedTo: workerId };
      return next;
    });
    return claimed;
  }, []);

  const markDone = useCallback((itemId: string) => {
    setItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, status: "done" } : i)
    );
  }, []);

  const runWorker = useCallback((workerId: number) => {
    const processNext = () => {
      // Use a state-reading approach to claim
      let claimedId: string | null = null;

      setItems(prev => {
        const idx = prev.findIndex(i => i.status === "pending");
        if (idx === -1) return prev;
        claimedId = prev[idx].id;
        const next = [...prev];
        next[idx] = { ...next[idx], status: "in-progress", assignedTo: workerId };
        return next;
      });

      // We need to defer reading claimedId since setState is async
      // Use a timeout to let React batch the state update
      const checkAndProcess = setTimeout(() => {
        setItems(currentItems => {
          const myItem = currentItems.find(
            i => i.status === "in-progress" && i.assignedTo === workerId
          );
          if (!myItem) return currentItems; // nothing to do, worker is idle

          // Update worker's current item
          setWorkers(prev =>
            prev.map(w => w.id === workerId ? { ...w, currentItem: myItem.id } : w)
          );

          // Process the item after a random delay
          const delay = 1500 + Math.random() * 1500;
          const processTimeout = setTimeout(() => {
            // Mark done
            setItems(p =>
              p.map(i => i.id === myItem.id ? { ...i, status: "done" } : i)
            );
            setWorkers(prev =>
              prev.map(w =>
                w.id === workerId
                  ? { ...w, currentItem: null, itemsCompleted: w.itemsCompleted + 1 }
                  : w
              )
            );

            // Try to process next
            const nextTimeout = setTimeout(processNext, 200);
            timeoutRefs.current.push(nextTimeout);
          }, delay);
          timeoutRefs.current.push(processTimeout);

          return currentItems;
        });
      }, 50);
      timeoutRefs.current.push(checkAndProcess);
    };

    processNext();
  }, []);

  const handleStart = () => {
    const count = parseInt(workerCount);
    const newWorkers: WorkerState[] = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      currentItem: null,
      itemsCompleted: 0,
    }));
    setWorkers(newWorkers);
    setRunning(true);

    // Stagger worker starts slightly to avoid all claiming the same item
    newWorkers.forEach((w, i) => {
      const t = setTimeout(() => runWorker(w.id), i * 100);
      timeoutRefs.current.push(t);
    });
  };

  const handleReset = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setItems(INITIAL_ITEMS.map(i => ({ ...i })));
    setWorkers([]);
    setRunning(false);
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">Work Queue Zone</h1>
          <p className="text-muted-foreground">
            Simulates parallel work distribution. Multiple workers pick items from a shared queue and process them concurrently.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Parallel Work Queue Processor
            </CardTitle>
            <CardDescription>
              Configure the number of workers, start processing, and watch items get distributed dynamically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Workers:</span>
                <Select
                  value={workerCount}
                  onValueChange={setWorkerCount}
                  disabled={running}
                >
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

              <Button
                onClick={handleStart}
                disabled={running}
                data-testid="btn-start-workers"
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Start Workers
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                data-testid="btn-reset-queue"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <div className="ml-auto text-sm font-mono text-muted-foreground" data-testid="queue-progress">
                {completedCount}/{items.length} completed
              </div>
            </div>

            {/* Queue Items Grid */}
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
                      variant={
                        item.status === "done"
                          ? "secondary"
                          : item.status === "in-progress"
                          ? "default"
                          : "outline"
                      }
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

            {/* Worker Lanes */}
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
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Processing {worker.currentItem}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Idle
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono font-bold" data-testid={`worker-completed-${worker.id}`}>
                          {worker.itemsCompleted}
                        </p>
                        <p className="text-[10px] text-muted-foreground">done</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Message */}
            {allDone && (
              <div
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-3"
                data-testid="queue-complete"
              >
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-bold">Queue Complete</p>
                  <p className="text-xs text-green-400/80">
                    All {items.length} items processed by {workers.length} worker{workers.length > 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
