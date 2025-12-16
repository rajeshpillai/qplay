import React from "react";
import Shell from "@/components/layout/Shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <p className={cn("font-medium", isCurrentUser && "text-primary")}>{user}</p>
          <p className="text-xs text-muted-foreground">Level {level} Performance Engineer</p>
        </div>
      </div>

      <div className="hidden md:flex gap-2 mr-8">
        {badges.map((badge: string, i: number) => (
          <Badge key={i} variant="secondary" className="text-[10px] bg-white/5 hover:bg-white/10">
            {badge}
          </Badge>
        ))}
      </div>

      <div className="w-24 text-right font-mono font-bold text-primary">
        {xp.toLocaleString()} XP
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const users = [
    { user: "Sarah Jenkins", xp: 15420, level: 12, badges: ["Bug Hunter", "Load Master"] },
    { user: "David Chen", xp: 14200, level: 11, badges: ["First Responder"] },
    { user: "Alex Kumar", xp: 12150, level: 10, badges: ["Script Kiddie"] },
    { user: "You", xp: 8400, level: 8, badges: ["Rookie"], isCurrentUser: true },
    { user: "Maria Rodriguez", xp: 7200, level: 7, badges: [] },
    { user: "James Wilson", xp: 6500, level: 6, badges: [] },
    { user: "Priya Patel", xp: 5100, level: 5, badges: [] },
  ];

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold font-mono">Performance Elite</h1>
          <p className="text-muted-foreground">Top engineers keeping IDfy's systems stable.</p>
        </div>

        <div className="bg-card/30 rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center p-4 border-b border-white/5 bg-black/20 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="w-16 text-center">Rank</div>
            <div className="flex-1">Engineer</div>
            <div className="hidden md:block mr-32">Badges</div>
            <div className="w-24 text-right">Total XP</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {users.map((u, i) => (
              <LeaderboardRow key={i} rank={i + 1} {...u} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
