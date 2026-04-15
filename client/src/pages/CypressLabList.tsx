import React from "react";
import Shell from "@/components/layout/Shell";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lock, TestTube2, CheckCircle2 } from "lucide-react";
import { CYPRESS_LABS } from "@/data/cypressLabs";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/useProgress";

export default function CypressLabList() {
  const { isLabCompleted, progress } = useProgress();
  const completedCount = progress.completedLabs.filter(l => l.module === "cypress").length;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-green-400 border-green-400/20">Module 4</Badge>
            <span className="text-muted-foreground text-sm">E2E Testing</span>
          </div>
          <h1 className="text-3xl font-bold font-mono mb-2">
            Cypress Training
            <span className="text-sm font-normal text-muted-foreground ml-3">{completedCount}/{CYPRESS_LABS.length} completed</span>
          </h1>
          <p className="text-muted-foreground">
            Write reliable, flake-free End-to-End tests. Master selectors, waiting strategies, and network interception.
          </p>
        </div>

        <div className="grid gap-4">
          {CYPRESS_LABS.map((lab, index) => {
            const Icon = lab.icon;
            const isLocked = false;
            const completed = isLabCompleted(lab.id, "cypress");
            
            return (
              <Card key={lab.id} className="bg-card/40 border-white/10 hover:bg-card/60 transition-colors group">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2 mr-2">
                     <span className="text-xs font-mono text-muted-foreground/50">#{String(index + 1).padStart(3, '0')}</span>
                     <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                       <Icon className="h-6 w-6" />
                     </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold font-mono group-hover:text-green-400 transition-colors">
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
                      <Link href={`/modules/cypress/${lab.id}`}>
                        <Button className={cn(
                          completed
                            ? "bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/30"
                            : "bg-green-600/20 hover:bg-green-600/30 text-green-500 border border-green-600/50"
                        )}>
                          {completed
                            ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Completed</>
                            : <><Play className="h-4 w-4 mr-2 fill-current" /> Start Lab</>
                          }
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
