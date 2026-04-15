import React from "react";
import Shell from "@/components/layout/shell";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, CheckCircle2, Target } from "lucide-react";
import { useProgress, getLevel, getLevelProgress } from "@/lib/use-progress";
import { CYPRESS_LABS } from "@/data/cypress-labs";
import { PLAYWRIGHT_LABS } from "@/data/playwright-labs";

export default function Leaderboard() {
  const { progress, badges, level, levelProgress } = useProgress();

  const totalCypress = CYPRESS_LABS.length;
  const totalPlaywright = PLAYWRIGHT_LABS.length;
  const totalLabs = totalCypress + totalPlaywright;
  const completedCypress = progress.completedLabs.filter(l => l.module === "cypress").length;
  const completedPlaywright = progress.completedLabs.filter(l => l.module === "playwright").length;
  const completedTotal = completedCypress + completedPlaywright;

  // Recent completions (last 10)
  const recentCompletions = [...progress.completedLabs]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 10);

  // Completion by difficulty
  const byDifficulty = {
    Beginner: progress.completedLabs.filter(l => l.difficulty === "Beginner").length,
    Intermediate: progress.completedLabs.filter(l => l.difficulty === "Intermediate").length,
    Advanced: progress.completedLabs.filter(l => l.difficulty === "Advanced").length,
  };

  const totalBeginner = [...CYPRESS_LABS, ...PLAYWRIGHT_LABS].filter(l => l.difficulty === "Beginner").length;
  const totalIntermediate = [...CYPRESS_LABS, ...PLAYWRIGHT_LABS].filter(l => l.difficulty === "Intermediate").length;
  const totalAdvanced = [...CYPRESS_LABS, ...PLAYWRIGHT_LABS].filter(l => l.difficulty === "Advanced").length;

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold font-mono">Your Progress</h1>
          <p className="text-muted-foreground">Track your journey to mastering E2E testing.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card/30 border border-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-mono font-bold text-primary">{progress.totalXp.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total XP</p>
          </div>
          <div className="bg-card/30 border border-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-mono font-bold text-yellow-400">{level}</p>
            <p className="text-xs text-muted-foreground mt-1">Level</p>
          </div>
          <div className="bg-card/30 border border-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-mono font-bold text-green-400">{completedCypress}<span className="text-sm text-muted-foreground">/{totalCypress}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Cypress Labs</p>
          </div>
          <div className="bg-card/30 border border-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-mono font-bold text-orange-400">{completedPlaywright}<span className="text-sm text-muted-foreground">/{totalPlaywright}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Playwright Labs</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-card/30 border border-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Level {level} Progress</span>
            <span className="text-sm text-muted-foreground font-mono">{levelProgress}%</span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        {/* Overall Completion */}
        <div className="bg-card/30 border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="ml-auto text-sm text-muted-foreground font-mono">{completedTotal}/{totalLabs}</span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${totalLabs > 0 ? (completedTotal / totalLabs) * 100 : 0}%` }}
            />
          </div>

          {/* By Difficulty */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Badge variant="secondary" className="text-green-400 bg-green-400/10">Beginner</Badge>
                <span className="text-muted-foreground font-mono">{byDifficulty.Beginner}/{totalBeginner}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalBeginner > 0 ? (byDifficulty.Beginner / totalBeginner) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Badge variant="secondary" className="text-yellow-400 bg-yellow-400/10">Intermediate</Badge>
                <span className="text-muted-foreground font-mono">{byDifficulty.Intermediate}/{totalIntermediate}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${totalIntermediate > 0 ? (byDifficulty.Intermediate / totalIntermediate) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Badge variant="secondary" className="text-red-400 bg-red-400/10">Advanced</Badge>
                <span className="text-muted-foreground font-mono">{byDifficulty.Advanced}/{totalAdvanced}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${totalAdvanced > 0 ? (byDifficulty.Advanced / totalAdvanced) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card/30 border border-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Badges</span>
          </div>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {badge}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Complete your first lab to earn a badge.</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card/30 rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center p-4 border-b border-white/5 bg-black/20 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="flex-1">Recent Completions</div>
            <div className="w-24 text-right">XP</div>
          </div>

          <div className="divide-y divide-white/5">
            {recentCompletions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No labs completed yet. Start with a Beginner lab!
              </div>
            )}
            {recentCompletions.map((lab) => {
              const allLabs = [...CYPRESS_LABS, ...PLAYWRIGHT_LABS];
              const labDef = allLabs.find(l => l.id === lab.labId);
              const xp = lab.difficulty === "Advanced" ? 300 : lab.difficulty === "Intermediate" ? 200 : 100;

              return (
                <div key={`${lab.module}-${lab.labId}`} className="flex items-center p-4 hover:bg-white/5 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{labDef?.title || lab.labId}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px]">
                        {lab.module}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(lab.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-24 text-right font-mono text-sm text-primary">+{xp} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
}
