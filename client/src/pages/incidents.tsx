import React from "react";
import Shell from "@/components/layout/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Clock, ArrowRight, ServerCrash, Activity } from "lucide-react";
import { INCIDENTS } from "@/data/incidents";
import { Link } from "wouter";

export default function Incidents() {
  return (
    <Shell>
       <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-mono mb-2 text-destructive">Active Incidents</h1>
          <p className="text-muted-foreground">
            Solve these production-simulated outages to earn major XP and Badges.
          </p>
        </div>

        <div className="grid gap-6">
          {INCIDENTS.map((incident) => (
            <Card key={incident.id} className={`relative overflow-hidden ${
              incident.severity === "CRITICAL" 
                ? "border-destructive/50 bg-destructive/5" 
                : "border-yellow-500/30 bg-yellow-500/5"
            }`}>
              {incident.severity === "CRITICAL" && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ServerCrash className="h-32 w-32" />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                   <Badge 
                     variant={incident.severity === "CRITICAL" ? "destructive" : "outline"} 
                     className={incident.severity === "CRITICAL" ? "animate-pulse" : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-none"}
                   >
                     {incident.severity}
                   </Badge>
                   <span className={`font-mono text-sm ${
                     incident.severity === "CRITICAL" ? "text-destructive" : "text-yellow-500"
                   }`}>INC-2024-00{incident.id}</span>
                </div>
                <CardTitle className="text-xl mt-2">{incident.title}</CardTitle>
                <CardDescription className={incident.severity === "CRITICAL" ? "text-destructive-foreground/70" : ""}>
                  {incident.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${incident.severity === "CRITICAL" ? "text-destructive" : ""}`} />
                    <span>Started: {incident.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className={`h-4 w-4 ${incident.severity === "CRITICAL" ? "text-destructive" : ""}`} />
                    <span>Impact: {incident.impact}</span>
                  </div>
                </div>
                <Link href={`/incidents/${incident.id}`}>
                  <Button 
                    variant={incident.severity === "CRITICAL" ? "destructive" : "secondary"} 
                    className="w-full md:w-auto"
                  >
                    Investigate Incident <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
       </div>
    </Shell>
  );
}
