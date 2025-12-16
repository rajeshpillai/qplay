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
             <Button>Next Lesson <ChevronRight className="ml-2 h-4 w-4" /></Button>
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
                 <div className="prose prose-invert max-w-none">
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
                 <div key={idx} className={cn("flex gap-3 relative", idx !== steps.length - 1 && "pb-6")}>
                   {idx !== steps.length - 1 && (
                     <div className="absolute left-[11px] top-7 bottom-0 w-px bg-white/10" />
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
