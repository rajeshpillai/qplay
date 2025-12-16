import React from "react";
import Shell from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  BarChart4, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Server, 
  ShieldCheck,
  BookOpen
} from "lucide-react";

export default function KnowledgeBase() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400/20">Reference</Badge>
            <span className="text-muted-foreground text-sm">Performance Engineering Academy</span>
          </div>
          <h1 className="text-3xl font-bold font-mono mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">
            The theoretical foundations of high-performance systems. Master these concepts to engineer resilient applications.
          </p>
        </div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="concepts">Core Concepts</TabsTrigger>
          </TabsList>

          {/* METRICS TAB */}
          <TabsContent value="metrics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/40 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Activity className="h-5 w-5" /> RPS (Requests Per Second)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The number of requests your system receives every second. This is the primary measure of "Load" or "Throughput" (in terms of transaction volume).
                  </p>
                  <div className="bg-black/20 p-3 rounded text-xs font-mono border border-white/5">
                    <span className="text-green-400">Target:</span> 1,000 RPS<br/>
                    <span className="text-yellow-400">Warning:</span> 800 RPS (Saturation begins)<br/>
                    <span className="text-red-400">Failure:</span> 1,200 RPS
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Clock className="h-5 w-5" /> Latency (Response Time)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    How long it takes for the server to process a request and return a response.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm border-b border-white/5 pb-1">
                      <span><strong>Avg:</strong> Mean response time. Can be skewed by outliers.</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-white/5 pb-1">
                      <span><strong>p95:</strong> 95% of requests are faster than this. (The "Gold Standard").</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span><strong>p99:</strong> 99% of requests are faster than this. Important for strict SLAs.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <AlertTriangle className="h-5 w-5" /> Error Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The percentage of requests that fail (non-2xx/3xx status codes).
                  </p>
                  <div className="bg-red-500/10 p-3 rounded text-sm border border-red-500/20 text-red-200">
                    <strong>Critical Rule:</strong> Any error rate &gt; 1% usually invalidates a load test. 
                    High latency often leads to timeouts (504 Errors), causing error rate spikes.
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-5 w-5" /> Throughput vs. Bandwidth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Throughput:</strong> Successful requests processed per second.<br/>
                    <strong>Bandwidth:</strong> Data transferred per second (KB/s, MB/s).
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <em>Tip:</em> If throughput drops but RPS stays high, your server is rejecting requests (queuing/timeout).
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SCENARIOS TAB */}
          <TabsContent value="scenarios" className="space-y-6 mt-6">
             <div className="space-y-4">
               <Card className="bg-card/40 border-white/10">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between">
                     <CardTitle className="text-lg text-blue-400">Smoke Test</CardTitle>
                     <Badge variant="secondary">Basics</Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-2">
                     Minimal load (2-5 VUs) for a short duration.
                   </p>
                   <p className="text-sm">
                     <strong>Purpose:</strong> Verify that the script works and the system doesn't crash immediately. Always run this first.
                   </p>
                 </CardContent>
               </Card>

               <Card className="bg-card/40 border-white/10">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between">
                     <CardTitle className="text-lg text-green-400">Load Test</CardTitle>
                     <Badge variant="secondary">Standard</Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-2">
                     Simulates expected peak traffic (e.g., 500 RPS) for a sustained period (e.g., 30 mins).
                   </p>
                   <p className="text-sm">
                     <strong>Purpose:</strong> Verify the system can handle normal peak operations within SLA limits.
                   </p>
                 </CardContent>
               </Card>

               <Card className="bg-card/40 border-white/10">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between">
                     <CardTitle className="text-lg text-yellow-400">Stress Test</CardTitle>
                     <Badge variant="secondary">Breaking Point</Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-2">
                     Load is increased beyond normal limits until the system breaks.
                   </p>
                   <p className="text-sm">
                     <strong>Purpose:</strong> Find the "Breaking Point" and understand failure modes (e.g., does it recover automatically?).
                   </p>
                 </CardContent>
               </Card>

               <Card className="bg-card/40 border-white/10">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between">
                     <CardTitle className="text-lg text-red-400">Spike Test</CardTitle>
                     <Badge variant="secondary">Resilience</Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-2">
                     Sudden, extreme increase in load for a short duration (e.g., 0 to 2000 RPS in 10s).
                   </p>
                   <p className="text-sm">
                     <strong>Purpose:</strong> Simulate "Black Friday" or "Viral Event" scenarios. Tests auto-scaling speed and queue depth.
                   </p>
                 </CardContent>
               </Card>

               <Card className="bg-card/40 border-white/10">
                 <CardHeader className="pb-2">
                   <div className="flex justify-between">
                     <CardTitle className="text-lg text-purple-400">Soak Test</CardTitle>
                     <Badge variant="secondary">Endurance</Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-2">
                     Sustained load (e.g., 80% of peak) for a long duration (hours or days).
                   </p>
                   <p className="text-sm">
                     <strong>Purpose:</strong> Detect memory leaks, disk space exhaustion, and gradual performance degradation.
                   </p>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>

          {/* CONCEPTS TAB */}
          <TabsContent value="concepts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="bg-card/40 border-white/10 col-span-2">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-primary">
                     <BarChart4 className="h-5 w-5" /> The Hockey Stick Curve (Knee Point)
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex-1 text-sm space-y-4">
                       <p>
                         In a healthy system, latency remains relatively flat as RPS increases. However, every system has a limit.
                       </p>
                       <p>
                         The <strong>Knee Point</strong> is where latency starts increasing exponentially with only a small increase in RPS.
                       </p>
                       <p className="text-muted-foreground">
                         <strong>Why?</strong> This is usually where queues start to fill up. Once queues are full, requests wait significantly longer, or are rejected.
                       </p>
                     </div>
                     <div className="flex-1 bg-black/40 rounded border border-white/5 h-40 flex items-end justify-center pb-4 relative overflow-hidden">
                        {/* Simple SVG diagram */}
                        <svg viewBox="0 0 100 50" className="w-full h-full p-4 overflow-visible">
                          <path d="M 0 45 L 60 45 Q 80 45 90 10" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                          <text x="50" y="48" fontSize="4" fill="gray">Throughput (RPS)</text>
                          <text x="-5" y="25" fontSize="4" fill="gray" transform="rotate(-90 -5 25)">Latency</text>
                          <circle cx="70" cy="45" r="2" fill="yellow" />
                          <text x="65" y="40" fontSize="3" fill="yellow">Knee Point</text>
                        </svg>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               <Card className="bg-card/40 border-white/10">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-primary">
                     <Server className="h-5 w-5" /> Little's Law
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-center font-mono text-xl bg-black/20 py-4 rounded border border-white/5 mb-4">
                     L = λ × W
                   </div>
                   <p className="text-sm text-muted-foreground">
                     The number of requests in the system (L) equals the arrival rate (λ) multiplied by the average time a request spends in the system (W).
                   </p>
                   <p className="text-sm mt-2 font-semibold">
                     Implication: If your database slows down (W increases), the number of concurrent requests (L) will explode, consuming all memory.
                   </p>
                 </CardContent>
               </Card>

               <Card className="bg-card/40 border-white/10">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-primary">
                     <ShieldCheck className="h-5 w-5" /> Open vs Closed Models
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm mb-2">
                     <strong>Closed Model:</strong> Users wait for a response before sending the next request. (e.g., clicking a link).
                   </p>
                   <p className="text-sm mb-2">
                     <strong>Open Model:</strong> Requests arrive independently of system response time. (e.g., Incoming API calls from another system).
                   </p>
                   <p className="text-xs text-yellow-400 mt-2">
                     ⚠️ Testing an Open system with a Closed model will hide failures!
                   </p>
                 </CardContent>
               </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
