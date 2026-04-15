import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimulationProvider } from "@/lib/simulation-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ModuleView from "@/pages/module-view";
import Module1 from "@/pages/module-1";
import Leaderboard from "@/pages/leaderboard";
import Incidents from "@/pages/incidents";
import IncidentDetail from "@/pages/incident-detail";
import Settings from "@/pages/settings";
import K6Editor from "@/pages/k6-editor";
import LabList from "@/pages/lab-list";
import CypressEditor from "@/pages/cypress-editor";
import CypressLabList from "@/pages/cypress-lab-list";
import PlaywrightEditor from "@/pages/playwright-editor";
import PlaywrightLabList from "@/pages/playwright-lab-list";
import KnowledgeBase from "@/pages/knowledge-base";
import PlaygroundHome from "@/pages/playground/playground-home";
import AuthZone from "@/pages/playground/auth-zone";
import InteractionsZone from "@/pages/playground/interactions-zone";
import ApiZone from "@/pages/playground/api-zone";
import DataZone from "@/pages/playground/data-zone";
import KycZone from "@/pages/playground/kyc-zone";

// Vite sets BASE_URL from the `base` config (e.g. "/qplay/" for GitHub Pages, "/" for dev)
const base = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRouter() {
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
          <WouterRouter base={base}>
            <AppRouter />
          </WouterRouter>
        </SimulationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
