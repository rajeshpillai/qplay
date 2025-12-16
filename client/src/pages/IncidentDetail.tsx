import React, { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Server, Database, Activity, Terminal, Search, CheckCircle2, Clock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
}

const IncidentScenario = () => {
  const [activeTab, setActiveTab] = useState("logs");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isResolved, setIsResolved] = useState(false);
  const [selectedRCA, setSelectedRCA] = useState<string | null>(null);

  // Simulate streaming logs
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { timestamp: "10:14:22", level: "INFO", service: "api-gateway", message: "Incoming request: POST /api/v1/kyc/verify" },
      { timestamp: "10:14:22", level: "INFO", service: "auth-service", message: "Token validation successful for user_id: 8821" },
      { timestamp: "10:14:23", level: "INFO", service: "kyc-processor", message: "Processing Aadhaar OCR task..." },
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      if (isResolved) return;
      
      const newLog: LogEntry = Math.random() > 0.7 
        ? { timestamp: new Date().toLocaleTimeString(), level: "ERROR", service: "db-primary", message: "Connection pool exhausted (active: 100, idle: 0, waiting: 42)" }
        : { timestamp: new Date().toLocaleTimeString(), level: "WARN", service: "api-gateway", message: "Upstream timeout: kyc-processor (5000ms)" };
      
      setLogs(prev => [...prev, newLog].slice(-20)); // Keep last 20 logs
    }, 2000);

    return () => clearInterval(interval);
  }, [isResolved]);

  const handleSubmitRCA = () => {
    if (selectedRCA === "db-pool") {
      setIsResolved(true);
    } else {
      // Incorrect answer logic could go here
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Investigation Panel */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
        
        {/* Metric Graphs (Mock) */}
        <div className="grid grid-cols-2 gap-4 h-48 shrink-0">
          <Card className="bg-black/40 border-primary/20">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-mono text-muted-foreground">CPU Usage (Avg)</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-2">
               <div className="flex items-end h-24 gap-1">
                 {[40, 42, 45, 38, 41, 44, 42, 39, 41, 43, 40, 42].map((h, i) => (
                   <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                 ))}
               </div>
               <div className="text-right text-xs font-mono text-primary mt-1">42% (Healthy)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-destructive/20">
             <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-mono text-muted-foreground">DB Connections</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-2">
               <div className="flex items-end h-24 gap-1">
                 {[60, 65, 72, 80, 88, 95, 99, 100, 100, 100, 100, 100].map((h, i) => (
                   <div key={i} className={cn("flex-1 transition-colors rounded-t-sm", h > 90 ? "bg-destructive animate-pulse" : "bg-primary/20")} style={{ height: `${h}%` }} />
                 ))}
               </div>
               <div className="text-right text-xs font-mono text-destructive mt-1">100% (SATURATED)</div>
            </CardContent>
          </Card>
        </div>

        {/* Console / Logs */}
        <Card className="flex-1 border-white/10 bg-[#0c0c0c] flex flex-col min-h-0">
          <div className="flex items-center justify-between p-2 border-b border-white/5 bg-white/5">
            <div className="flex gap-2">
              <Button 
                variant={activeTab === "logs" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setActiveTab("logs")}
                className="h-7 text-xs"
              >
                <Terminal className="mr-2 h-3 w-3" /> Live Logs
              </Button>
              <Button 
                variant={activeTab === "traces" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setActiveTab("traces")}
                className="h-7 text-xs"
              >
                <Activity className="mr-2 h-3 w-3" /> Traces
              </Button>
            </div>
            <div className="flex items-center gap-2 px-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-red-400">LIVE</span>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4 font-mono text-xs">
            {activeTab === "logs" ? (
              <div className="space-y-1.5">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 hover:bg-white/5 p-1 rounded group">
                    <span className="text-muted-foreground w-16 shrink-0">{log.timestamp}</span>
                    <span className={cn(
                      "w-12 shrink-0 font-bold",
                      log.level === "INFO" && "text-blue-400",
                      log.level === "WARN" && "text-yellow-400",
                      log.level === "ERROR" && "text-red-400"
                    )}>{log.level}</span>
                    <span className="text-purple-400 w-24 shrink-0">[{log.service}]</span>
                    <span className="text-foreground/90">{log.message}</span>
                  </div>
                ))}
                <div className="h-4" /> {/* Spacer */}
              </div>
            ) : (
              <div className="space-y-4">
                 <div className="p-3 border border-white/10 rounded bg-white/5">
                   <div className="flex justify-between mb-2">
                     <span className="text-blue-400 font-bold">Trace ID: 8821a-99b</span>
                     <span className="text-destructive">5004ms</span>
                   </div>
                   <div className="space-y-1">
                     <div className="flex items-center gap-2">
                       <div className="w-16 text-right text-muted-foreground">0ms</div>
                       <div className="h-2 w-full bg-blue-500/20 rounded relative">
                         <div className="absolute h-full bg-blue-500 w-[5%]" />
                       </div>
                       <div className="w-32 text-xs">API Gateway</div>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-16 text-right text-muted-foreground">20ms</div>
                       <div className="h-2 w-full bg-purple-500/20 rounded relative ml-4">
                         <div className="absolute h-full bg-purple-500 w-[10%]" />
                       </div>
                       <div className="w-32 text-xs">Auth Service</div>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-16 text-right text-muted-foreground">150ms</div>
                       <div className="h-2 w-full bg-orange-500/20 rounded relative ml-8">
                         <div className="absolute h-full bg-orange-500 w-[85%]" />
                       </div>
                       <div className="w-32 text-xs text-destructive font-bold">DB Query (WAIT)</div>
                     </div>
                   </div>
                 </div>
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Decision Panel */}
      <div className="flex flex-col gap-4">
        <Card className="bg-card/40 border-destructive/20">
          <CardHeader>
            <div className="flex justify-between items-start">
               <Badge variant="destructive" className="animate-pulse">CRITICAL</Badge>
               <span className="font-mono text-destructive text-sm">INC-2024-001</span>
            </div>
            <CardTitle className="text-lg mt-2">KYC Latency Spike</CardTitle>
            <CardDescription>
              Customers reporting timeouts. Determine the root cause to restore service.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="flex-1 bg-card/20 border-white/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Root Cause Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
             {isResolved ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                 <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                   <CheckCircle2 className="h-8 w-8 text-green-500" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-green-500">Incident Resolved!</h3>
                   <p className="text-muted-foreground text-sm mt-2">
                     Correctly identified <strong>Database Connection Pool Exhaustion</strong>.
                   </p>
                   <p className="font-mono text-primary mt-4">+500 XP Awarded</p>
                 </div>
                 <Button className="w-full" variant="outline" onClick={() => window.location.href = '/incidents'}>
                   Return to Incident List
                 </Button>
               </div>
             ) : (
               <>
                 <div className="space-y-3">
                   <button 
                     onClick={() => setSelectedRCA("cpu")}
                     className={cn(
                       "w-full text-left p-3 rounded border transition-all text-sm",
                       selectedRCA === "cpu" 
                         ? "bg-primary/20 border-primary text-primary" 
                         : "bg-white/5 border-white/10 hover:bg-white/10"
                     )}
                   >
                     <span className="font-bold block mb-1">CPU Saturation</span>
                     <span className="text-xs opacity-70">Application logic is too heavy for current compute resources.</span>
                   </button>
                   
                   <button 
                     onClick={() => setSelectedRCA("db-pool")}
                     className={cn(
                       "w-full text-left p-3 rounded border transition-all text-sm",
                       selectedRCA === "db-pool" 
                         ? "bg-primary/20 border-primary text-primary" 
                         : "bg-white/5 border-white/10 hover:bg-white/10"
                     )}
                   >
                     <span className="font-bold block mb-1">DB Connection Pool</span>
                     <span className="text-xs opacity-70">Application cannot acquire database connections fast enough.</span>
                   </button>

                   <button 
                     onClick={() => setSelectedRCA("external")}
                     className={cn(
                       "w-full text-left p-3 rounded border transition-all text-sm",
                       selectedRCA === "external" 
                         ? "bg-primary/20 border-primary text-primary" 
                         : "bg-white/5 border-white/10 hover:bg-white/10"
                     )}
                   >
                     <span className="font-bold block mb-1">External API Timeout</span>
                     <span className="text-xs opacity-70">Aadhaar/PAN vendor API is unresponsive.</span>
                   </button>
                 </div>

                 <div className="mt-auto">
                   <Button 
                     className="w-full" 
                     disabled={!selectedRCA} 
                     onClick={handleSubmitRCA}
                   >
                     Submit Conclusion
                   </Button>
                 </div>
               </>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function IncidentDetail() {
  const [, setLocation] = useLocation();
  
  return (
    <Shell>
      <div className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setLocation('/incidents')}>
        <Server className="h-4 w-4" />
        <span className="text-sm">Back to Incidents</span>
      </div>
      <IncidentScenario />
    </Shell>
  );
}
