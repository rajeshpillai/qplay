import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  Activity, 
  ShieldAlert, 
  Trophy, 
  Settings, 
  Menu,
  Server,
  Terminal,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = ({ className }: { className?: string }) => {
  const [location] = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Mission Control", href: "/" },
    { icon: BookOpen, label: "Training Modules", href: "/modules" },
    { icon: Activity, label: "Load Simulator", href: "/simulator" },
    { icon: ShieldAlert, label: "Incident Response", href: "/incidents" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-primary rounded-sm flex items-center justify-center">
            <Server className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg tracking-tighter text-sidebar-primary">Algorisys.PERF</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Academy v1.0</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-mono text-sm h-10 mb-1",
                  location === item.href 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary rounded-l-none" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-sidebar-border bg-black/20">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>QA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">QA Engineer</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Link href="/settings">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5">
           <div className="flex justify-between text-xs font-mono mb-1">
             <span className="text-muted-foreground">XP Progress</span>
             <span className="text-primary">Lvl 3</span>
           </div>
           <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
             <div className="h-full bg-primary w-[65%]" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <span className="font-mono font-bold">Algorisys.PERF</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r-border bg-sidebar">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-auto relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
          
          <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
