import React, { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Terminal, Code2, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

const INITIAL_CODE = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  // TODO: Fix the endpoint URL
  // The correct endpoint is: https://api.algorisys.com/v1/kyc/init
  const res = http.get('https://api.algorisys.com/v1/wrong-url');

  // TODO: Add a check to ensure status is 200
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // TODO: Simulate user think time (1 second)
  sleep(0.1); 
}`;

const CORRECT_ENDPOINT = "https://api.algorisys.com/v1/kyc/init";

export default function K6Editor() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [, setLocation] = useLocation();

  const runTest = () => {
    setIsRunning(true);
    setStatus("running");
    setOutput(["Initializing k6 runtime...", "Loading script...", "Starting test execution..."]);

    let logs: string[] = [];
    
    // Simulate execution steps
    setTimeout(() => {
      // Analysis
      const hasCorrectEndpoint = code.includes(CORRECT_ENDPOINT);
      const hasSleep = code.includes("sleep(1)");
      
      logs.push("✓ Virtual Users initialized: 10");
      
      if (!hasCorrectEndpoint) {
        logs.push("✗ ERROR: Request failed. 404 Not Found (https://api.algorisys.com/v1/wrong-url)");
        logs.push("  ↳ check 'is status 200' failed");
        completeTest(logs, "failed");
        return;
      }

      logs.push("✓ GET https://api.algorisys.com/v1/kyc/init 200 OK");
      logs.push("✓ check 'is status 200' passed");

      if (!hasSleep) {
        logs.push("⚠ WARN: 'sleep' duration is too low (0.1s). This creates unrealistic load.");
        logs.push("  ↳ Hint: Users typically pause for 1 second.");
        completeTest(logs, "failed");
        return;
      }

      logs.push("✓ User think time simulated: 1s");
      completeTest(logs, "success");

    }, 2000);
  };

  const completeTest = (finalLogs: string[], finalStatus: "success" | "failed") => {
    setOutput(prev => [...prev, ...finalLogs]);
    if (finalStatus === "success") {
      setOutput(prev => [...prev, "", "🎉 TEST PASSED! module completed."]);
    } else {
      setOutput(prev => [...prev, "", "❌ TEST FAILED. Please fix the script and try again."]);
    }
    setStatus(finalStatus);
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(INITIAL_CODE);
    setOutput([]);
    setStatus("idle");
  };

  return (
    <Shell>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-purple-400 border-purple-400/20">Module 3</Badge>
              <span className="text-muted-foreground text-sm">Scripting Mastery</span>
            </div>
            <h1 className="text-2xl font-bold font-mono">k6 Scripting Lab</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setLocation("/")}>Exit Lab</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Editor Pane */}
          <div className="flex flex-col gap-4 min-h-0">
            <Card className="flex-1 bg-[#1e1e1e] border-white/10 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCode className="h-4 w-4" />
                  <span>script.js</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleReset} title="Reset Code">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={runTest}
                    disabled={isRunning}
                  >
                    <Play className="h-4 w-4 mr-2 fill-current" /> Run Test
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </Card>
          </div>

          {/* Instructions & Output Pane */}
          <div className="flex flex-col gap-6 min-h-0">
            {/* Instructions */}
            <Card className="bg-card/40 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Mission Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <p>
                  We are migrating from Playwright to <strong>k6</strong> for high-concurrency load testing.
                  Your task is to fix the broken k6 script on the left.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs mt-0.5">1</div>
                    <p>The endpoint is incorrect. It should point to <code className="bg-white/10 px-1 rounded text-primary">/v1/kyc/init</code>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs mt-0.5">2</div>
                    <p>The <code className="bg-white/10 px-1 rounded text-primary">sleep()</code> duration is too short (0.1s). Realistic user think time is <strong>1 second</strong>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terminal Output */}
            <Card className="flex-1 bg-black/80 border-white/10 flex flex-col min-h-0">
              <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Terminal className="h-3 w-3" />
                <span>Console Output</span>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="font-mono text-xs space-y-1">
                  {output.length === 0 && (
                    <span className="text-muted-foreground opacity-50">Waiting for execution...</span>
                  )}
                  {output.map((line, i) => (
                    <div key={i} className={cn(
                      "break-words",
                      line.includes("✓") && "text-green-400",
                      line.includes("✗") && "text-red-400",
                      line.includes("⚠") && "text-yellow-400",
                      line.includes("ERROR") && "text-red-400 font-bold",
                      line.includes("PASSED") && "text-green-400 font-bold text-sm mt-2"
                    )}>
                      {line}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="animate-pulse text-primary">_</div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
