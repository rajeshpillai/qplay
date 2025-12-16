import React from "react";
import Shell from "@/components/layout/Shell";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Code2, CheckCircle2, Lock } from "lucide-react";
import { LABS } from "@/data/labs";
import { cn } from "@/lib/utils";

export default function LabList() {
  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-purple-400 border-purple-400/20">Module 3</Badge>
            <span className="text-muted-foreground text-sm">Scripting Mastery</span>
          </div>
          <h1 className="text-3xl font-bold font-mono mb-2">k6 Scripting Labs</h1>
          <p className="text-muted-foreground">
            Master the art of writing high-performance load tests. Complete these challenges to earn the "Script Kiddie" badge.
          </p>
        </div>

        <div className="grid gap-4">
          {LABS.map((lab, index) => {
            const Icon = lab.icon;
            // For prototype, let's unlock all labs. In real app, check progress.
            const isLocked = false; 
            
            return (
              <Card key={lab.id} className="bg-card/40 border-white/10 hover:bg-card/60 transition-colors group">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold font-mono group-hover:text-primary transition-colors">
                        {lab.title}
                      </h3>
                      <Badge variant="secondary" className={cn(
                        "text-[10px]",
                        lab.difficulty === "Beginner" && "text-green-400 bg-green-400/10 hover:bg-green-400/20",
                        lab.difficulty === "Intermediate" && "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20",
                        lab.difficulty === "Advanced" && "text-red-400 bg-red-400/10 hover:bg-red-400/20"
                      )}>
                        {lab.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lab.description}
                    </p>
                  </div>

                  <div>
                    {isLocked ? (
                      <Button variant="ghost" disabled>
                        <Lock className="h-4 w-4 mr-2" /> Locked
                      </Button>
                    ) : (
                      <Link href={`/modules/k6/${lab.id}`}>
                        <Button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50">
                          <Play className="h-4 w-4 mr-2 fill-current" /> Start Lab
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
