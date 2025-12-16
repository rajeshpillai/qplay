import React from "react";
import Shell from "@/components/layout/Shell";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, MousePointerClick, Zap, Globe, Database, Terminal } from "lucide-react";

const ZONES = [
  {
    id: "auth",
    title: "Authentication Zone",
    description: "Practice login flows, form validation, and session management.",
    icon: Lock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/playground/auth"
  },
  {
    id: "interactions",
    title: "UI Interactions",
    description: "Master drag & drop, hover states, alerts, and complex inputs.",
    icon: MousePointerClick,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    href: "/playground/interactions"
  },
  {
    id: "api",
    title: "API Simulation",
    description: "Test network requests, intercept headers, and mock responses.",
    icon: Globe,
    color: "text-green-500",
    bg: "bg-green-500/10",
    href: "/playground/api",
    disabled: false
  },
  {
    id: "data",
    title: "Data Grid",
    description: "Handle large tables, sorting, filtering, and pagination.",
    icon: Database,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    href: "/playground/data",
    disabled: true
  }
];

export default function PlaygroundHome() {
  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-pink-400 border-pink-400/20">System Under Test</Badge>
            <span className="text-muted-foreground text-sm">Practice Arena</span>
          </div>
          <h1 className="text-3xl font-bold font-mono mb-2">Automation Playground</h1>
          <p className="text-muted-foreground">
            A safe environment to practice your Cypress and Playwright scripts. 
            These pages are designed with specific testability challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ZONES.map((zone) => {
            const Icon = zone.icon;
            
            return (
              <Link key={zone.id} href={zone.disabled ? "#" : zone.href}>
                <Card className={`
                  bg-card/40 border-white/10 transition-all duration-300
                  ${zone.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-card/60 hover:border-white/20 cursor-pointer group"}
                `}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`h-12 w-12 rounded-lg ${zone.bg} flex items-center justify-center ${zone.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {zone.disabled && <Badge variant="secondary" className="text-xs">Coming Soon</Badge>}
                    </div>
                    <CardTitle className="font-mono text-xl group-hover:text-primary transition-colors">
                      {zone.title}
                    </CardTitle>
                    <CardDescription>
                      {zone.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
