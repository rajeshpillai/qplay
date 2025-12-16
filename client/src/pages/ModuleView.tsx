import React, { useState } from "react";
import Shell from "@/components/layout/Shell";
import LoadSimulator from "@/components/simulation/LoadSimulator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModuleView() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { title: "Introduction to Burst Traffic", completed: true },
    { title: "Modeling the Spike", completed: false },
    { title: "Running the Simulation", completed: false },
    { title: "Analysis & Remediation", completed: false },
  ];

  return (
    <Shell>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-primary border-primary/20">Module 2</Badge>
              <span className="text-muted-foreground text-sm">Load Modeling</span>
            </div>
            <h1 className="text-2xl font-bold font-mono">Simulating OTP Bursts</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
               <p className="text-xs text-muted-foreground">Time Remaining</p>
               <p className="font-mono font-medium">14:20</p>
             </div>
             <Button 
               onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
               disabled={currentStep === steps.length - 1}
             >
               Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
             </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          {/* Main Learning Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-card/30 rounded-lg border border-white/5">
             <Tabs defaultValue="theory" className="flex flex-col h-full">
               <div className="border-b border-white/5 px-4 py-2 bg-black/20">
                 <TabsList className="bg-transparent p-0 h-auto">
                   <TabsTrigger value="theory" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">Briefing</TabsTrigger>
                   <TabsTrigger value="sim" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">Simulation Lab</TabsTrigger>
                   <TabsTrigger value="quiz" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2">Quiz</TabsTrigger>
                 </TabsList>
               </div>

               <TabsContent value="theory" className="flex-1 overflow-auto p-6 space-y-6">
                 {currentStep === 0 && (
                   <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
                     <h3>The "9:00 AM" Problem</h3>
                     <p>
                       In IDfy's KYC context, traffic is rarely flat. We see massive spikes at 9:00 AM when businesses open and start processing onboarding requests in bulk.
                       A system that handles 500 RPS (Requests Per Second) perfectly might collapse under a 2000 RPS spike, even if that spike only lasts 10 seconds.
                     </p>
                     
                     <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 my-4">
                       <h4 className="flex items-center gap-2 text-blue-400 m-0 mb-2">
                         <Info className="h-4 w-4" /> Key Concept: Queue Saturation
                       </h4>
                       <p className="m-0 text-sm">
                         When requests arrive faster than they can be processed, they queue up. If the queue fills up, requests are dropped immediately. 
                         If the queue is too long, latency spikes as requests sit waiting to be served.
                       </p>
                     </div>

                     <h3>Objective</h3>
                     <p>
                       Your task is to use the Load Simulator to find the <strong>Breaking Point</strong> of the OTP Service. 
                       Increase the RPS until the P95 latency exceeds 500ms or the Error Rate exceeds 1%.
                     </p>
                   </div>
                 )}
                 
                 {currentStep === 1 && (
                   <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
                     <h3>Modeling the Spike</h3>
                     <p>
                       To accurately test for the "9:00 AM" problem, we can't just run a constant load. We need to model the behavior of a sudden influx of users.
                     </p>
                     <p>
                       In this simulation, we will use a "Step Stress" pattern. This involves increasing the load in steps rather than all at once, allowing us to see exactly when performance degrades.
                     </p>
                     
                     <h3>Configuration Parameters</h3>
                     <ul className="list-disc pl-5 space-y-2">
                       <li><strong>Target RPS:</strong> The number of requests per second we want to simulate.</li>
                       <li><strong>Ramp-up Time:</strong> How quickly we reach the target RPS.</li>
                       <li><strong>Sustained Duration:</strong> How long we hold the target load.</li>
                     </ul>

                     <p className="mt-4">
                       Proceed to the <strong>Simulation Lab</strong> tab to configure your test parameters.
                     </p>
                   </div>
                 )}

                 {currentStep === 2 && (
                   <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
                     <h3>Running the Simulation</h3>
                     <p>
                       It's time to execute the load test. Watch the real-time telemetry carefully.
                     </p>
                     
                     <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-4">
                       <h4 className="flex items-center gap-2 text-yellow-400 m-0 mb-2">
                         <AlertTriangle className="h-4 w-4" /> Watch for Saturation
                       </h4>
                       <p className="m-0 text-sm">
                         As RPS increases, latency should increase linearly. If you see latency spike exponentially (the "Hockey Stick" curve), you have hit the saturation point.
                       </p>
                     </div>

                     <h3>Action Items</h3>
                     <ol className="list-decimal pl-5 space-y-2">
                       <li>Go to the <strong>Simulation Lab</strong> tab.</li>
                       <li>Set RPS to <strong>200</strong> and verify stability.</li>
                       <li>Increase RPS to <strong>800</strong> and observe the latency graph.</li>
                       <li>Push to <strong>1200 RPS</strong> to trigger failure conditions.</li>
                     </ol>
                   </div>
                 )}

                 {currentStep === 3 && (
                    <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
                      <h3>Analysis & Remediation</h3>
                      <p>
                        Congratulations on completing the simulation. You likely observed that at ~800 RPS, the system started throwing errors and latency degraded significantly.
                      </p>
                      
                      <h3>Root Cause Analysis</h3>
                      <p>
                        In this scenario, the bottleneck was the <strong>Database Connection Pool</strong>. The application could not open enough connections to the database to handle the incoming requests, causing them to queue up and eventually time out.
                      </p>

                      <h3>Recommended Fixes</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Increase the connection pool size.</li>
                        <li>Implement a read-replica for read-heavy operations.</li>
                        <li>Add a caching layer (Redis) for frequently accessed data.</li>
                      </ul>
                      
                      <p className="mt-6 text-green-400 font-bold">
                        Module Complete! (+500 XP)
                      </p>
                    </div>
                 )}
               </TabsContent>

               <TabsContent value="sim" className="flex-1 overflow-auto p-6 bg-black/40">
                 <LoadSimulator />
               </TabsContent>
               
               <TabsContent value="quiz" className="flex-1 p-6">
                 <div className="text-center text-muted-foreground mt-20">Quiz content to be implemented</div>
               </TabsContent>
             </Tabs>
          </div>

          {/* Steps Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 bg-card/20 rounded-lg border border-white/5 p-4 overflow-auto">
             <h3 className="font-mono text-sm font-bold mb-4 uppercase text-muted-foreground tracking-wider">Mission Steps</h3>
             <div className="space-y-4">
               {steps.map((step, idx) => (
                   <div 
                    key={idx} 
                    className={cn(
                      "flex gap-3 relative cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors", 
                      idx !== steps.length - 1 && "pb-6",
                      idx === currentStep && "bg-white/5"
                    )}
                    onClick={() => setCurrentStep(idx)}
                  >
                    {idx !== steps.length - 1 && (
                      <div className="absolute left-[19px] top-9 bottom-0 w-px bg-white/10" />
                    )}
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-xs border flex-shrink-0 z-10",
                      step.completed ? "bg-green-500/20 border-green-500 text-green-500" : 
                      idx === currentStep ? "bg-primary/20 border-primary text-primary" : "bg-card border-white/10 text-muted-foreground"
                    )}>
                      {step.completed ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium leading-none mb-1", idx === currentStep ? "text-foreground" : "text-muted-foreground")}>{step.title}</p>
                      <p className="text-xs text-muted-foreground">Est. 5 mins</p>
                    </div>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
