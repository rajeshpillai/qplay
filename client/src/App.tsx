import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import ModuleView from "@/pages/ModuleView";
import Leaderboard from "@/pages/Leaderboard";
import Incidents from "@/pages/Incidents";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/modules" component={ModuleView} />
      <Route path="/simulator" component={() => (
        <ModuleView /> 
      )} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/incidents" component={Incidents} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
