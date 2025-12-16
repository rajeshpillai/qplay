import React, { useState, useEffect, useRef } from "react";
import Shell from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, CheckCircle2, Terminal, Code2, FileCode, ArrowLeft, BookOpen, ExternalLink, Play as PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useRoute } from "wouter";
import { PLAYWRIGHT_LABS } from "@/data/playwrightLabs";

export default function PlaywrightEditor() {
  const [, params] = useRoute("/modules/playwright/:labId");
  const [, setLocation] = useLocation();
  const labId = params?.labId || "locators";
  const lab = PLAYWRIGHT_LABS.find(l => l.id === labId) || PLAYWRIGHT_LABS[0];

  const [code, setCode] = useState(lab.initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [activeTab, setActiveTab] = useState("instructions");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(lab.initialCode);
    setOutput([]);
    setStatus("idle");
    setActiveTab("instructions");
  }, [lab.id]);

  const runTest = () => {
    setIsRunning(true);
    setStatus("running");
    setOutput(["> npx playwright test", "Running 1 test using 1 worker", ""]);
    setActiveTab("console");

    setTimeout(() => {
      const result = lab.validation(code);
      completeTest(result.logs, result.passed ? "success" : "failed");
    }, 2000);
  };

  const completeTest = (finalLogs: string[], finalStatus: "success" | "failed") => {
    setOutput(prev => [...prev, ...finalLogs]);
    if (finalStatus === "success") {
      setOutput(prev => [...prev, "", "  1 passed (1.5s)"]);
    } else {
      setOutput(prev => [...prev, "", "  1 failed"]);
    }
    setStatus(finalStatus);
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(lab.initialCode);
    setOutput([]);
    setStatus("idle");
  };

  const lineNumbers = code.split("\n").map((_, i) => i + 1);

  return (
    <Shell>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-orange-400 border-orange-400/20">Module 5</Badge>
              <span className="text-muted-foreground text-sm">Playwright Training</span>
            </div>
            <h1 className="text-2xl font-bold font-mono flex items-center gap-3">
              <span className="text-muted-foreground opacity-50 font-normal">/</span>
              {lab.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setLocation("/modules/playwright")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Labs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Editor Pane */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            <Card className="flex-1 bg-[#1e1e1e] border-white/10 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCode className="h-4 w-4" />
                  <span>example.spec.ts</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleReset} title="Reset Code">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={runTest}
                    disabled={isRunning}
                  >
                    <Play className="h-4 w-4 mr-2 fill-current" /> Run Test
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative flex overflow-hidden">
                <div className="w-12 bg-[#1e1e1e] border-r border-white/5 text-right font-mono text-sm text-muted-foreground opacity-50 select-none py-4 pr-3 leading-6">
                   {lineNumbers.map(n => (
                     <div key={n}>{n}</div>
                   ))}
                </div>
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 leading-6 resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Instructions & Output Pane */}
          <div className="flex flex-col gap-0 min-h-0 bg-card/20 rounded-lg border border-white/5 overflow-hidden">
             <div className="border-b border-white/5 bg-black/20">
               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                 <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto">
                   <TabsTrigger 
                     value="instructions" 
                     className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
                   >
                     Instructions
                   </TabsTrigger>
                   <TabsTrigger 
                     value="console" 
                     className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
                   >
                     Terminal {output.length > 0 && `(${output.length})`}
                   </TabsTrigger>
                   <TabsTrigger 
                     value="docs" 
                     className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
                   >
                     Docs
                   </TabsTrigger>
                 </TabsList>
               </Tabs>
             </div>

             <div className="flex-1 overflow-auto">
               {activeTab === "instructions" && (
                 <div className="p-4 space-y-6">
                   <div>
                     <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                       <Code2 className="h-5 w-5 text-primary" />
                       Mission Brief
                     </h3>
                     <p className="text-sm text-muted-foreground">
                       {lab.missionBrief.context}
                     </p>
                   </div>
                   
                   <div className="space-y-3">
                     <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Objectives</h4>
                     {lab.missionBrief.objectives.map((obj) => (
                       <div key={obj.id} className="flex items-start gap-3 p-3 rounded-md bg-white/5 border border-white/5">
                         <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0 font-mono font-bold">
                           {obj.id}
                         </div>
                         <p className="text-sm">{obj.text}</p>
                       </div>
                     ))}
                   </div>

                   {status === "success" && (
                     <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md animate-in zoom-in duration-300">
                       <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                         <CheckCircle2 className="h-5 w-5" /> Test Passed
                       </div>
                       <p className="text-xs text-green-400/80">
                         Excellent. Playwright skills +1.
                       </p>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="mt-3 w-full border-green-500/30 hover:bg-green-500/20 text-green-400"
                         onClick={() => setLocation("/modules/playwright")}
                       >
                         Return to Lab List
                       </Button>
                     </div>
                   )}
                 </div>
               )}

               {activeTab === "console" && (
                  <div className="flex flex-col h-full bg-[#0c0c0c]">
                    <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3" />
                        <span>Playwright CLI</span>
                      </div>
                      {isRunning && <span className="text-green-400 animate-pulse">● Running</span>}
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="font-mono text-xs space-y-1">
                        {output.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-50 gap-2">
                            <PlayIcon className="h-8 w-8" />
                            <span>Ready to execute</span>
                          </div>
                        )}
                        {output.map((line, i) => (
                          <div key={i} className={cn(
                            "break-words border-l-2 pl-2",
                            line.includes("✓") ? "border-green-500/50 text-green-400" :
                            line.includes("passed") ? "text-green-400 font-bold" :
                            line.includes("failed") ? "text-red-400 font-bold" :
                            line.includes("✗") ? "border-red-500/50 text-red-400" :
                            line.includes("⚠") ? "border-yellow-500/50 text-yellow-400" :
                            "border-transparent text-gray-300"
                          )}>
                            {line}
                          </div>
                        ))}
                        {isRunning && (
                          <div className="animate-pulse text-primary pl-2">_</div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
               )}

               {activeTab === "docs" && (
                 <div className="p-4 space-y-4">
                   <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                     <BookOpen className="h-4 w-4" />
                     <span>Quick Reference</span>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <h4 className="text-xs font-bold text-primary uppercase">Locators</h4>
                       <div className="bg-black/40 p-2 rounded border border-white/10 font-mono text-[10px] text-muted-foreground">
                         page.<span className="text-blue-400">getByRole</span>(<span className="text-green-400">'button'</span>, &#123; name: <span className="text-green-400">'Submit'</span> &#125;)<br/>
                         page.<span className="text-blue-400">locator</span>(<span className="text-green-400">'css-selector'</span>)
                       </div>
                     </div>

                     <div className="space-y-2">
                       <h4 className="text-xs font-bold text-primary uppercase">Assertions</h4>
                       <div className="bg-black/40 p-2 rounded border border-white/10 font-mono text-[10px] text-muted-foreground">
                         <span className="text-purple-400">await</span> expect(locator).<span className="text-yellow-400">toBeVisible</span>();<br/>
                         <span className="text-purple-400">await</span> expect(locator).<span className="text-yellow-400">toHaveText</span>(<span className="text-green-400">'Success'</span>);
                       </div>
                     </div>
                   </div>
                   
                   <Button variant="outline" className="w-full text-xs" onClick={() => window.open('https://playwright.dev/docs/intro', '_blank')}>
                     <ExternalLink className="mr-2 h-3 w-3" /> Playwright Docs
                   </Button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
