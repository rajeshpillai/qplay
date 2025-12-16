import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimulationProvider } from "@/lib/SimulationContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import ModuleView from "@/pages/ModuleView";
import Leaderboard from "@/pages/Leaderboard";
import Incidents from "@/pages/Incidents";
import IncidentDetail from "@/pages/IncidentDetail";
import Settings from "@/pages/Settings";
import K6Editor from "@/pages/K6Editor";
import LabList from "@/pages/LabList";
import KnowledgeBase from "@/pages/KnowledgeBase";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/modules" component={ModuleView} />
      <Route path="/modules/k6" component={LabList} />
      <Route path="/modules/k6/:labId" component={K6Editor} />
      <Route path="/simulator" component={() => (
        <ModuleView /> 
      )} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/incidents" component={Incidents} />
      <Route path="/incidents/:id" component={IncidentDetail} />
      <Route path="/settings" component={Settings} />
      <Route path="/knowledge" component={KnowledgeBase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimulationProvider>
          <Toaster />
          <Router />
        </SimulationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
