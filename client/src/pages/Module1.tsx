import React, { useState } from "react";
import Shell from "@/components/layout/Shell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, CheckCircle, Info, AlertTriangle, TrendingUp, BarChart4, Server, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Quiz = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What happens at the 'Knee Point' of the Hockey Stick Curve?",
      options: [
        { id: "a", text: "Latency drops significantly" },
        { id: "b", text: "Throughput continues to increase linearly" },
        { id: "c", text: "Latency increases exponentially with small load increase" },
        { id: "d", text: "The server crashes immediately" }
      ],
      correct: "c"
    },
    {
      id: 2,
      question: "According to Little's Law (L = λW), if latency (W) doubles and traffic (λ) stays the same, what happens to concurrency (L)?",
      options: [
        { id: "a", text: "Concurrency doubles" },
        { id: "b", text: "Concurrency is halved" },
        { id: "c", text: "Concurrency stays the same" },
        { id: "d", text: "It depends on the CPU usage" }
      ],
      correct: "a"
    },
    {
      id: 3,
      question: "Which metric best represents the user experience?",
      options: [
        { id: "a", text: "RPS (Requests Per Second)" },
        { id: "b", text: "CPU Usage" },
        { id: "c", text: "Throughput" },
        { id: "d", text: "Latency (Response Time)" }
      ],
      correct: "d"
    }
  ];

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = questions.filter(q => answers[q.id] === q.correct).length;

  return (
    <div className="space-y-8 max-w-2xl mx-auto mt-8">
      {questions.map((q) => (
        <Card key={q.id} className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">{q.question}</h3>
            <RadioGroup 
              value={answers[q.id]} 
              onValueChange={(val) => !showResults && setAnswers(prev => ({ ...prev, [q.id]: val }))}
              className="space-y-3"
            >
              {q.options.map((opt) => (
                <div key={opt.id} className={cn(
                  "flex items-center space-x-2 p-3 rounded border transition-colors",
                  showResults && opt.id === q.correct ? "bg-green-500/20 border-green-500" :
                  showResults && answers[q.id] === opt.id && opt.id !== q.correct ? "bg-red-500/20 border-red-500" :
                  answers[q.id] === opt.id ? "bg-primary/20 border-primary" : "border-white/5 hover:bg-white/5"
                )}>
                  <RadioGroupItem value={opt.id} id={`q${q.id}-${opt.id}`} disabled={showResults} />
                  <Label htmlFor={`q${q.id}-${opt.id}`} className="flex-1 cursor-pointer">{opt.text}</Label>
                  {showResults && opt.id === q.correct && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {!showResults ? (
        <Button onClick={handleSubmit} className="w-full" disabled={Object.keys(answers).length < questions.length}>
          Submit Quiz
        </Button>
      ) : (
        <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20 animate-in zoom-in">
          <h3 className="text-2xl font-bold mb-2">You scored {score}/{questions.length}</h3>
          <p className="text-muted-foreground mb-4">
            {score === questions.length ? "Perfect score! You have mastered the foundations." : "Good effort. Review the concepts and try again."}
          </p>
          <Button onClick={() => window.location.href = '/modules'} variant="outline">Return to Modules</Button>
        </div>
      )}
    </div>
  );
};

export default function Module1() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { title: "Core Metrics", completed: false },
    { title: "The Hockey Stick Curve", completed: false },
    { title: "Little's Law", completed: false },
    { title: "Knowledge Check", completed: false },
  ];

  return (
    <Shell>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-primary border-primary/20">Module 1</Badge>
              <span className="text-muted-foreground text-sm">Foundations</span>
            </div>
            <h1 className="text-2xl font-bold font-mono">Performance Engineering 101</h1>
          </div>
          <div className="flex items-center gap-4">
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
             <div className="flex-1 overflow-auto p-8">
               
               {currentStep === 0 && (
                 <div className="prose prose-invert max-w-3xl mx-auto animate-in fade-in duration-500">
                   <h2>The Holy Trinity of Metrics</h2>
                   <p className="lead">
                     Before we start breaking systems, we need to agree on how to measure them. Performance Engineering revolves around three key metrics.
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                     <Card className="bg-black/20 border-blue-500/20">
                       <CardContent className="p-6">
                         <div className="p-3 bg-blue-500/10 rounded-full w-fit mb-4"><TrendingUp className="h-6 w-6 text-blue-500" /></div>
                         <h3 className="font-bold text-lg mb-2">Throughput</h3>
                         <p className="text-sm text-muted-foreground">Requests processed per second.</p>
                         <p className="text-xs mt-2 text-blue-400 font-mono">"How much work are we doing?"</p>
                       </CardContent>
                     </Card>
                     <Card className="bg-black/20 border-yellow-500/20">
                       <CardContent className="p-6">
                         <div className="p-3 bg-yellow-500/10 rounded-full w-fit mb-4"><Info className="h-6 w-6 text-yellow-500" /></div>
                         <h3 className="font-bold text-lg mb-2">Latency</h3>
                         <p className="text-sm text-muted-foreground">Time taken to process a request.</p>
                         <p className="text-xs mt-2 text-yellow-400 font-mono">"How fast are we doing it?"</p>
                       </CardContent>
                     </Card>
                     <Card className="bg-black/20 border-red-500/20">
                       <CardContent className="p-6">
                         <div className="p-3 bg-red-500/10 rounded-full w-fit mb-4"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
                         <h3 className="font-bold text-lg mb-2">Error Rate</h3>
                         <p className="text-sm text-muted-foreground">% of failed requests.</p>
                         <p className="text-xs mt-2 text-red-400 font-mono">"Are we doing it correctly?"</p>
                       </CardContent>
                     </Card>
                   </div>

                   <h3>RPS vs. Throughput: The Trap</h3>
                   <p>
                     A common rookie mistake is to confuse <strong>RPS (Requests Per Second)</strong> with <strong>Throughput</strong>.
                   </p>
                   <ul>
                     <li><strong>RPS</strong> is what you send (Load).</li>
                     <li><strong>Throughput</strong> is what the server handles (Capacity).</li>
                   </ul>
                   <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-4 not-prose">
                     <p className="text-sm m-0">
                       If you send 1000 RPS but your server can only handle 500 RPS, your <strong>Throughput is 500</strong>. The other 500 requests are either queued (increasing latency) or dropped (increasing errors).
                     </p>
                   </div>
                 </div>
               )}

               {currentStep === 1 && (
                 <div className="prose prose-invert max-w-3xl mx-auto animate-in fade-in duration-500">
                   <h2>The Hockey Stick Curve</h2>
                   <p>
                     Systems don't degrade linearly. They hold up well until they don't. This non-linear behavior is visualized as the "Hockey Stick Curve".
                   </p>

                   <div className="my-8 p-6 bg-black/40 rounded-xl border border-white/5 not-prose flex flex-col items-center">
                      <svg viewBox="0 0 400 200" className="w-full max-w-lg overflow-visible">
                        {/* Axes */}
                        <line x1="50" y1="180" x2="380" y2="180" stroke="#666" strokeWidth="2" />
                        <line x1="50" y1="180" x2="50" y2="20" stroke="#666" strokeWidth="2" />
                        
                        {/* Labels */}
                        <text x="200" y="220" textAnchor="middle" fill="#888" fontSize="14">Load (RPS)</text>
                        <text x="20" y="100" textAnchor="middle" fill="#888" fontSize="14" transform="rotate(-90 20 100)">Latency</text>
                        
                        {/* Curve */}
                        <path d="M 50 170 C 150 170, 250 170, 300 120 S 350 20, 350 20" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" />
                        
                        {/* Knee Point */}
                        <circle cx="280" cy="150" r="6" fill="yellow" className="animate-pulse" />
                        <text x="290" y="150" fill="yellow" fontSize="14">Knee Point</text>
                        
                        {/* Zones */}
                        <text x="150" y="160" fill="#4ade80" fontSize="12">Linear Zone</text>
                        <text x="360" y="80" fill="#f87171" fontSize="12">Exponential Zone</text>
                      </svg>
                   </div>

                   <h3>What happens at the Knee Point?</h3>
                   <p>
                     The Knee Point is the exact moment where your system's resources (CPU, DB Connections, Thread Pool) become saturated.
                   </p>
                   <p>
                     Before this point, adding 1 request adds 1 unit of work. After this point, adding 1 request adds <strong>wait time</strong> for everyone else in the queue.
                   </p>
                 </div>
               )}

               {currentStep === 2 && (
                 <div className="prose prose-invert max-w-3xl mx-auto animate-in fade-in duration-500">
                   <h2>Little's Law</h2>
                   <p className="lead">
                     The most important equation in performance engineering.
                   </p>

                   <div className="text-center font-mono text-4xl font-bold bg-white/5 p-8 rounded-xl border border-white/10 my-8">
                     L = λ × W
                   </div>

                   <div className="grid grid-cols-3 gap-4 text-center mb-8">
                     <div>
                       <div className="text-2xl font-bold text-blue-400">L</div>
                       <div className="text-sm text-muted-foreground">Concurrency</div>
                       <div className="text-xs opacity-70">(Requests in flight)</div>
                     </div>
                     <div className="flex items-center justify-center text-xl text-muted-foreground">=</div>
                     <div>
                       <div className="text-2xl font-bold text-green-400">λ</div>
                       <div className="text-sm text-muted-foreground">Throughput</div>
                       <div className="text-xs opacity-70">(Requests / sec)</div>
                     </div>
                     <div className="flex items-center justify-center text-xl text-muted-foreground">×</div>
                     <div>
                       <div className="text-2xl font-bold text-yellow-400">W</div>
                       <div className="text-sm text-muted-foreground">Latency</div>
                       <div className="text-xs opacity-70">(Wait time)</div>
                     </div>
                   </div>

                   <h3>Why this matters</h3>
                   <p>
                     Imagine your database slows down slightly (W increases from 0.1s to 1.0s).
                     If you are handling 1000 RPS (λ), your concurrency (L) jumps from:
                   </p>
                   <ul>
                     <li><strong>Scenario A:</strong> 1000 * 0.1 = 100 active connections</li>
                     <li><strong>Scenario B:</strong> 1000 * 1.0 = 1000 active connections</li>
                   </ul>
                   <p>
                     A 10x increase in latency causes a 10x increase in memory usage and connection slots, likely crashing your server immediately. <strong>Latency kills capacity.</strong>
                   </p>
                 </div>
               )}

               {currentStep === 3 && (
                 <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
                   <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold mb-2">Knowledge Check</h2>
                     <p className="text-muted-foreground">Prove your mastery of the foundations to earn your badge.</p>
                   </div>
                   <Quiz />
                 </div>
               )}

             </div>
          </div>

          {/* Steps Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 bg-card/20 rounded-lg border border-white/5 p-4 overflow-auto hidden lg:block">
             <h3 className="font-mono text-sm font-bold mb-4 uppercase text-muted-foreground tracking-wider">Course Map</h3>
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
                      <p className="text-xs text-muted-foreground">Theory</p>
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