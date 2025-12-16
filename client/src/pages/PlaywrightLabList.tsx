import React from "react";
import Shell from "@/components/layout/Shell";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lock, Terminal } from "lucide-react";
import { PLAYWRIGHT_LABS } from "@/data/playwrightLabs";
import { cn } from "@/lib/utils";

export default function PlaywrightLabList() {
  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-orange-400 border-orange-400/20">Module 5</Badge>
            <span className="text-muted-foreground text-sm">Modern E2E</span>
          </div>
          <h1 className="text-3xl font-bold font-mono mb-2">Playwright Mastery</h1>
          <p className="text-muted-foreground">
            Fast, reliable, and capable. Learn the next-generation automation tool.
          </p>
        </div>

        <div className="grid gap-4">
          {PLAYWRIGHT_LABS.map((lab, index) => {
            const Icon = lab.icon;
            const isLocked = false; 
            
            return (
              <Card key={lab.id} className="bg-card/40 border-white/10 hover:bg-card/60 transition-colors group">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2 mr-2">
                     <span className="text-xs font-mono text-muted-foreground/50">#{String(index + 1).padStart(3, '0')}</span>
                     <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                       <Icon className="h-6 w-6" />
                     </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold font-mono group-hover:text-orange-400 transition-colors">
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
                      <Link href={`/modules/playwright/${lab.id}`}>
                        <Button className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-500 border border-orange-600/50">
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
