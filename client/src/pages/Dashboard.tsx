import React from "react";
import Shell from "@/components/layout/Shell";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Target, 
  Zap, 
  BookOpen, 
  AlertTriangle,
  PlayCircle,
  Lock,
  CheckCircle2
} from "lucide-react";

const ModuleCard = ({ title, description, level, progress, status, href = "/modules" }: any) => {
  return (
    <Card className="border-border/40 bg-card/40 hover:bg-card/60 transition-colors group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
      
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={status === "locked" ? "outline" : "default"} className={status === "locked" ? "opacity-50" : "bg-primary/20 text-primary hover:bg-primary/30"}>
            {level}
          </Badge>
          {status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {status === "locked" && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          
          {status === "locked" ? (
            <Button 
              className="w-full mt-4" 
              variant="outline"
              disabled
            >
              Locked
            </Button>
          ) : (
            <Link href={href}>
              <Button 
                className="w-full mt-4" 
                variant={status === "completed" ? "secondary" : "default"}
              >
                {status === "completed" ? "Review" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  return (
    <Shell>
      <div className="space-y-8">
        {/* Welcome Hero */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Mission Control
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Welcome back, Engineer. Your current objective is to stabilize the KYC Verification Pipeline under high load.
            </p>
          </div>
          <div className="flex gap-2">
             <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Role</p>
                <p className="text-lg font-mono font-bold text-primary">Performance Analyst</p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/40 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                 <Zap className="h-4 w-4 text-primary" />
                 <span className="text-sm font-medium">Active Streak</span>
              </div>
              <p className="text-2xl font-mono font-bold">5 Days</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                 <Target className="h-4 w-4 text-accent" />
                 <span className="text-sm font-medium">Simulations Run</span>
              </div>
              <p className="text-2xl font-mono font-bold">128</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                 <BookOpen className="h-4 w-4 text-green-500" />
                 <span className="text-sm font-medium">Modules Cleared</span>
              </div>
              <p className="text-2xl font-mono font-bold">3 / 8</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                 <AlertTriangle className="h-4 w-4 text-yellow-500" />
                 <span className="text-sm font-medium">Incidents Solved</span>
              </div>
              <p className="text-2xl font-mono font-bold">12</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Modules */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Active Training Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard 
              title="Performance Foundations" 
              description="Learn the core concepts of latency, throughput, and saturation in distributed KYC systems."
              level="Module 1"
              progress={100}
              status="completed"
            />
            <ModuleCard 
              title="Load Modeling for KYC"
              description="Design realistic load scenarios for OTP bursts and document upload spikes."
              level="Module 2"
              progress={45}
              status="active"
            />
            <ModuleCard 
              title="k6 Scripting Mastery"
              description="Translate Playwright flows into high-performance k6 load tests."
              level="Module 3"
              progress={0}
              status="active"
              href="/modules/k6"
            />
          </div>
        </div>

        {/* Recent Activity / Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">Recent System Alerts</h2>
              <div className="bg-black/20 rounded-lg border border-white/5 p-4 font-mono text-sm space-y-2">
                 <div className="flex gap-4 text-muted-foreground border-b border-white/5 pb-2">
                   <span className="w-24">10:42:01</span>
                   <span className="text-green-400">INFO</span>
                   <span>Module "Foundations" completed by User</span>
                 </div>
                 <div className="flex gap-4 text-muted-foreground border-b border-white/5 pb-2">
                   <span className="w-24">10:15:22</span>
                   <span className="text-yellow-400">WARN</span>
                   <span>High latency detected in "OTP-Burst" simulation</span>
                 </div>
                 <div className="flex gap-4 text-muted-foreground border-b border-white/5 pb-2">
                   <span className="w-24">09:30:00</span>
                   <span className="text-red-400">CRIT</span>
                   <span>Failed Scenario: "Bank Statement Upload" &gt; 500ms p99</span>
                 </div>
              </div>
           </div>
           
           <div>
             <h2 className="text-lg font-bold mb-4">Daily Challenge</h2>
             <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
               <CardHeader>
                 <CardTitle className="text-accent">Burst Traffic Survivor</CardTitle>
                 <CardDescription>Survive a 3x traffic spike without dropping &gt;1% of requests.</CardDescription>
               </CardHeader>
               <CardContent>
                 <Button className="w-full bg-accent hover:bg-accent/90 text-white">Start Challenge (+50 XP)</Button>
               </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </Shell>
  );
}
