import React from "react";
import Shell from "@/components/layout/Shell";
import { useSimulation } from "@/lib/SimulationContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RefreshCw, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSimulation();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Simulation parameters have been updated.",
    });
  };

  const handleReset = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "Simulation parameters restored to defaults.",
    });
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2">System Configuration</h1>
          <p className="text-muted-foreground">
            Adjust the global parameters for the simulation engine. Changes affect all modules immediately.
          </p>
        </div>

        <Card className="bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Load Simulation Model
            </CardTitle>
            <CardDescription>
              Configure the mathematical model used to generate synthetic telemetry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Breaking Point */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="breakingPoint">Breaking Point (RPS)</Label>
                <span className="font-mono text-primary">{settings.breakingPointRPS} RPS</span>
              </div>
              <Slider 
                id="breakingPoint"
                min={100} 
                max={2000} 
                step={50} 
                value={[settings.breakingPointRPS]}
                onValueChange={(val) => updateSettings({ breakingPointRPS: val[0], errorThresholdRPS: val[0] })}
              />
              <p className="text-xs text-muted-foreground">
                The Request Per Second threshold where the system begins to fail (errors > 0).
              </p>
            </div>

            {/* Base Latency */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="baseLatency">Base Latency (ms)</Label>
                <span className="font-mono text-primary">{settings.baseLatencyMs} ms</span>
              </div>
              <Slider 
                id="baseLatency"
                min={10} 
                max={200} 
                step={5} 
                value={[settings.baseLatencyMs]}
                onValueChange={(val) => updateSettings({ baseLatencyMs: val[0] })}
              />
              <p className="text-xs text-muted-foreground">
                The minimum latency of the system at 0 load.
              </p>
            </div>

            {/* Latency Multiplier */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="latencyMultiplier">Latency Multiplier (ms per RPS)</Label>
                <span className="font-mono text-primary">{settings.latencyMultiplier.toFixed(2)}</span>
              </div>
              <Slider 
                id="latencyMultiplier"
                min={0.01} 
                max={0.5} 
                step={0.01} 
                value={[settings.latencyMultiplier]}
                onValueChange={(val) => updateSettings({ latencyMultiplier: val[0] })}
              />
              <p className="text-xs text-muted-foreground">
                How much latency increases for each additional request per second (Little's Law factor).
              </p>
            </div>

            {/* Spike Probability */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="spikeProbability">Spike Probability</Label>
                <span className="font-mono text-primary">{(settings.spikeProbability * 100).toFixed(0)}%</span>
              </div>
              <Slider 
                id="spikeProbability"
                min={0} 
                max={0.2} 
                step={0.01} 
                value={[settings.spikeProbability]}
                onValueChange={(val) => updateSettings({ spikeProbability: val[0] })}
              />
              <p className="text-xs text-muted-foreground">
                Chance of a random latency spike occurring in any given second.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Defaults
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
