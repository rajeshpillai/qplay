import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimulationProvider } from "@/lib/SimulationContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import ModuleView from "@/pages/ModuleView";
import Module1 from "@/pages/Module1";
import Leaderboard from "@/pages/Leaderboard";
import Incidents from "@/pages/Incidents";
import IncidentDetail from "@/pages/IncidentDetail";
import Settings from "@/pages/Settings";
import K6Editor from "@/pages/K6Editor";
import LabList from "@/pages/LabList";
import CypressEditor from "@/pages/CypressEditor";
import CypressLabList from "@/pages/CypressLabList";
import PlaywrightEditor from "@/pages/PlaywrightEditor";
import PlaywrightLabList from "@/pages/PlaywrightLabList";
import KnowledgeBase from "@/pages/KnowledgeBase";
import PlaygroundHome from "@/pages/playground/PlaygroundHome";
import AuthZone from "@/pages/playground/AuthZone";
import InteractionsZone from "@/pages/playground/InteractionsZone";
import ApiZone from "@/pages/playground/ApiZone";
import DataZone from "@/pages/playground/DataZone";
import KycZone from "@/pages/playground/KycZone";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/modules/1" component={Module1} />
      <Route path="/modules/2" component={ModuleView} />
      <Route path="/modules" component={ModuleView} />
      <Route path="/modules/k6" component={LabList} />
      <Route path="/modules/k6/:labId" component={K6Editor} />
      <Route path="/modules/cypress" component={CypressLabList} />
      <Route path="/modules/cypress/:labId" component={CypressEditor} />
      <Route path="/modules/playwright" component={PlaywrightLabList} />
      <Route path="/modules/playwright/:labId" component={PlaywrightEditor} />
      <Route path="/playground" component={PlaygroundHome} />
      <Route path="/playground/auth" component={AuthZone} />
      <Route path="/playground/interactions" component={InteractionsZone} />
      <Route path="/playground/api" component={ApiZone} />
      <Route path="/playground/data" component={DataZone} />
      <Route path="/playground/kyc" component={KycZone} />
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
