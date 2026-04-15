import React from "react";
import Shell from "@/components/layout/Shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress, getLevel, getBadges } from "@/lib/useProgress";
import { CYPRESS_LABS } from "@/data/cypressLabs";
import { PLAYWRIGHT_LABS } from "@/data/playwrightLabs";

// NPC competitors — static rivals the user competes against
const NPC_USERS = [
  { user: "Sarah Jenkins", xp: 15420, badges: ["Completionist", "Cypress Pro"] },
  { user: "David Chen", xp: 14200, badges: ["Playwright Pro"] },
  { user: "Alex Kumar", xp: 12150, badges: ["Quick Learner"] },
  { user: "Maria Rodriguez", xp: 7200, badges: ["Lab Rat"] },
  { user: "James Wilson", xp: 6500, badges: [] },
  { user: "Priya Patel", xp: 5100, badges: ["First Steps"] },
];

const LeaderboardRow = ({ rank, user, xp, level, badges, isCurrentUser }: any) => {
  return (
    <div className={cn(
      "flex items-center p-4 border-b border-white/5 hover:bg-white/5 transition-colors",
      isCurrentUser && "bg-primary/10 hover:bg-primary/15 border-l-2 border-l-primary"
    )}>
      <div className="w-16 flex justify-center font-mono font-bold text-lg">
        {rank === 1 && <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400/20" />}
        {rank === 2 && <Medal className="h-6 w-6 text-gray-300 fill-gray-300/20" />}
        {rank === 3 && <Medal className="h-6 w-6 text-amber-600 fill-amber-600/20" />}
        {rank > 3 && <span className="text-muted-foreground">#{rank}</span>}
      </div>

      <div className="flex items-center gap-4 flex-1">
        <Avatar className={cn("h-10 w-10 border-2", rank <= 3 ? "border-yellow-500/50" : "border-transparent")}>
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} />
          <AvatarFallback>{user.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className={cn("font-medium", isCurrentUser && "text-primary")}>
            {user}
            {isCurrentUser && <span className="text-xs ml-2 text-muted-foreground">(you)</span>}
          </p>
          <p className="text-xs text-muted-foreground">Level {level} Performance Engineer</p>
        </div>
      </div>

      <div className="hidden md:flex gap-2 mr-8">
        {badges.slice(0, 3).map((badge: string, i: number) => (
          <Badge key={i} variant="secondary" className="text-[10px] bg-white/5 hover:bg-white/10">
            {badge}
          </Badge>
        ))}
        {badges.length > 3 && (
          <Badge variant="secondary" className="text-[10px] bg-white/5">+{badges.length - 3}</Badge>
        )}
      </div>

      <div className="w-24 text-right font-mono font-bold text-primary">
        {xp.toLocaleString()} XP
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const { progress, badges } = useProgress();
  const level = getLevel(progress.totalXp);

  const totalCypress = CYPRESS_LABS.length;
  const totalPlaywright = PLAYWRIGHT_LABS.length;
  const completedCypress = progress.completedLabs.filter(l => l.module === "cypress").length;
  const completedPlaywright = progress.completedLabs.filter(l => l.module === "playwright").length;

  // Merge user into NPC list, sort by XP
  const allEntries = [
    ...NPC_USERS.map(u => ({
      ...u,
      level: getLevel(u.xp),
      isCurrentUser: false,
    })),
    {
      user: "You",
      xp: progress.totalXp,
      level,
      badges,
      isCurrentUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold font-mono">Performance Elite</h1>
          <p className="text-muted-foreground">Top engineers keeping FP's systems stable.</p>
        </div>

        {/* User Stats Cards */}
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

        {/* Badges */}
        {badges.length > 0 && (
          <div className="bg-card/30 border border-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Your Badges</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-card/30 rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center p-4 border-b border-white/5 bg-black/20 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="w-16 text-center">Rank</div>
            <div className="flex-1">Engineer</div>
            <div className="hidden md:block mr-32">Badges</div>
            <div className="w-24 text-right">Total XP</div>
          </div>

          <div className="divide-y divide-white/5">
            {allEntries.map((u, i) => (
              <LeaderboardRow key={u.user} rank={i + 1} {...u} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
