import React from "react";
import Shell from "@/components/layout/Shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Clock, ArrowRight, ServerCrash, Activity } from "lucide-react";

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
          <Card className="border-destructive/50 bg-destructive/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ServerCrash className="h-32 w-32" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                 <Badge variant="destructive" className="animate-pulse">CRITICAL</Badge>
                 <span className="font-mono text-destructive text-sm">INC-2024-001</span>
              </div>
              <CardTitle className="text-xl mt-2">KYC API Latency Spike &gt; 5s</CardTitle>
              <CardDescription className="text-destructive-foreground/70">
                Customers reporting timeouts during Aadhaar Verification step. Queue depth increasing rapidly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-destructive" />
                  <span>Started: 12 mins ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-destructive" />
                  <span>Impact: High</span>
                </div>
              </div>
              <Button variant="destructive" className="w-full md:w-auto">
                Investigate Incident <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <div className="flex justify-between items-start">
                 <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">WARNING</Badge>
                 <span className="font-mono text-yellow-500 text-sm">INC-2024-002</span>
              </div>
              <CardTitle className="text-xl mt-2">Database Connection Pool Exhaustion</CardTitle>
              <CardDescription>
                Read replicas are lagging. Connections are nearing max_limit on the primary instance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Started: 45 mins ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Impact: Medium</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full md:w-auto">
                View Telemetry <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
       </div>
    </Shell>
  );
}
