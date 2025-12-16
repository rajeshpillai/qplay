import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Play, Square, AlertTriangle, Zap, Server, Activity, Terminal, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/lib/SimulationContext";

const SCENARIOS = [
  {
    id: "default",
    name: "Standard Load",
    description: "Typical daily traffic. System should handle this comfortably.",
    settings: {
        breakingPointRPS: 800,
        baseLatencyMs: 50,
        latencyMultiplier: 0.1,
        spikeProbability: 0.05,
        errorThresholdRPS: 800,
    },
    targetRPS: 200
  },
  {
    id: "black_friday",
    name: "Black Friday Sale",
    description: "Massive influx of users. High breaking point but extreme load.",
    settings: {
        breakingPointRPS: 1200,
        baseLatencyMs: 40,
        latencyMultiplier: 0.08,
        spikeProbability: 0.1,
        errorThresholdRPS: 1200,
    },
    targetRPS: 1500
  },
  {
    id: "legacy_db",
    name: "Legacy DB Bottleneck",
    description: "Old database struggles with connections. Fails early.",
    settings: {
        breakingPointRPS: 400,
        baseLatencyMs: 150,
        latencyMultiplier: 0.5,
        spikeProbability: 0.02,
        errorThresholdRPS: 400,
    },
    targetRPS: 350
  },
  {
    id: "ddos",
    name: "DDoS Attack",
    description: "Malicious traffic flood. System will likely collapse.",
    settings: {
        breakingPointRPS: 1000,
        baseLatencyMs: 50,
        latencyMultiplier: 0.1,
        spikeProbability: 0.8,
        errorThresholdRPS: 1000,
    },
    targetRPS: 2000
  }
];

export default function LoadSimulator() {
  const { settings, updateSettings } = useSimulation();
  const [isRunning, setIsRunning] = useState(false);
  const [targetRPS, setTargetRPS] = useState([200]);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ p95: 0, errorRate: 0, currentRPS: 0 });
  const [selectedScenario, setSelectedScenario] = useState("default");

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      updateSettings(scenario.settings);
      setTargetRPS([scenario.targetRPS]);
      setIsRunning(false);
      setData([]); // Clear graph
    }
  };

  // Generate data based on current settings
  const generateData = (rps: number, isSpike: boolean) => {
    const baseLatency = settings.baseLatencyMs + (rps * settings.latencyMultiplier);
    const spikeFactor = isSpike ? Math.random() * 500 : 0;
    
    // Calculate errors based on the configurable threshold
    const errors = rps > settings.errorThresholdRPS 
      ? (rps - settings.errorThresholdRPS) / 10 
      : 0;

    return {
      time: new Date().toLocaleTimeString(),
      rps: rps + (Math.random() * 20 - 10),
      latency: baseLatency + spikeFactor + (Math.random() * 20),
      errors: errors
    };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setData(prev => {
          // Use the configurable spike probability
          const isSpike = Math.random() < settings.spikeProbability;
          const newData = [...prev, generateData(targetRPS[0], isSpike)];
          
          if (newData.length > 20) newData.shift();
          
          // Calculate stats
          const latencies = newData.map(d => d.latency).sort((a, b) => a - b);
          const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
          const totalErrors = newData.reduce((acc, curr) => acc + curr.errors, 0);
          const errorRate = (totalErrors / (newData.length * targetRPS[0])) * 100;

          setStats({
            p95: Math.round(p95),
            errorRate: Math.min(errorRate, 100),
            currentRPS: Math.round(newData[newData.length - 1].rps)
          });

          return newData;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, targetRPS, settings]); // Re-run if settings change

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Controls Panel */}
      <Card className="lg:col-span-1 border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Scenario Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Load Scenario
            </label>
            <Select value={selectedScenario} onValueChange={handleScenarioChange}>
              <SelectTrigger className="w-full bg-black/20 border-white/10">
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIOS.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {SCENARIOS.find(s => s.id === selectedScenario)?.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">Target RPS (Requests/sec)</label>
              <span className="text-xl font-mono text-primary font-bold">{targetRPS[0]}</span>
            </div>
            <Slider 
              value={targetRPS} 
              onValueChange={setTargetRPS} 
              max={2500} 
              step={50}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>0 RPS</span>
              <span>1250 RPS</span>
              <span>2500 RPS</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
              <AlertTriangle className="h-3 w-3" />
              <span>Current Breaking Point: {settings.breakingPointRPS} RPS</span>
            </div>
          </div>

          <div className="p-4 rounded-md bg-black/20 border border-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Endpoint:</span>
              <span className="font-mono text-xs text-blue-400">POST /api/v1/kyc/verify</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payload:</span>
              <span className="font-mono text-xs text-yellow-400">12kb (Images)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Auth:</span>
              <span className="font-mono text-xs text-green-400">Bearer Token</span>
            </div>
          </div>

          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            className={cn(
              "w-full h-12 text-lg font-mono tracking-wider transition-all",
              isRunning 
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            )}
          >
            {isRunning ? (
              <>
                <Square className="mr-2 h-5 w-5 fill-current" /> ABORT TEST
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5 fill-current" /> INITIATE LOAD
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Panel */}
      <div className="lg:col-span-2 space-y-6">

        {/* Heads Up Display */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-black/40 border-primary/20">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Throughput</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold text-white">{stats.currentRPS}</span>
                <span className="text-xs text-muted-foreground">req/s</span>
              </div>
            </CardContent>
          </Card>
          <Card className={cn("bg-black/40 border-primary/20", stats.p95 > 200 && "border-yellow-500/50 bg-yellow-950/10")}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">P95 Latency</span>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-3xl font-mono font-bold", stats.p95 > 200 ? "text-yellow-400" : "text-white")}>
                  {stats.p95}
                </span>
                <span className="text-xs text-muted-foreground">ms</span>
              </div>
            </CardContent>
          </Card>
          <Card className={cn("bg-black/40 border-primary/20", stats.errorRate > 1 && "border-destructive/50 bg-destructive/10")}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Error Rate</span>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-3xl font-mono font-bold", stats.errorRate > 1 ? "text-destructive" : "text-white")}>
                  {stats.errorRate.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphs */}
        <Card className="border-border/50 bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Real-time Telemetry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorLatency)" 
                    isAnimationActive={false}
                    name="Latency (ms)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="errors" 
                    stroke="hsl(var(--destructive))" 
                    fillOpacity={1} 
                    fill="url(#colorErrors)" 
                    isAnimationActive={false}
                    name="Errors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
