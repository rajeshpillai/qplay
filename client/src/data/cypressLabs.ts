import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search } from "lucide-react";

export interface CypressLab {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: any;
  initialCode: string;
  missionBrief: {
    context: string;
    objectives: { id: number; text: string }[];
  };
  validation: (code: string) => { passed: boolean; logs: string[] };
}

export const CYPRESS_LABS: CypressLab[] = [
  {
    id: "selectors",
    title: "Resilient Selectors",
    description: "Learn how to select elements that won't break when CSS classes change.",
    difficulty: "Beginner",
    icon: Search,
    initialCode: `describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    
    // TODO: Replace these fragile selectors with resilient data-testid selectors
    // The input has data-testid="input-email"
    cy.get('.form-control.input-lg.email-field').type('user@example.com');
    
    // The password input has data-testid="input-password"
    cy.get('#password-field-v2').type('password123');
    
    // The button has data-testid="btn-submit"
    cy.get('button[type="submit"]').click();
    
    // The success message has data-testid="alert-success"
    cy.get('.alert.alert-success').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Our frontend team refactors CSS classes weekly. Your tests keep breaking. Switch to using stable `data-testid` attributes.",
      objectives: [
        { id: 1, text: "Select email input using `[data-testid=input-email]`" },
        { id: 2, text: "Select password input using `[data-testid=input-password]`" },
        { id: 3, text: "Select submit button using `[data-testid=btn-submit]`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasEmailTestId = code.includes('[data-testid="input-email"]') || code.includes("[data-testid='input-email']") || code.includes('data-testid=input-email');
      const hasPassTestId = code.includes('[data-testid="input-password"]') || code.includes("[data-testid='input-password']") || code.includes('data-testid=input-password');
      const hasBtnTestId = code.includes('[data-testid="btn-submit"]') || code.includes("[data-testid='btn-submit']") || code.includes('data-testid=btn-submit');

      logs.push("✓ Test suite initialized");
      
      if (!hasEmailTestId) {
        logs.push("✗ ERROR: Fragile selector found for email field.");
        logs.push("  ↳ Expected: cy.get('[data-testid=\"input-email\"]')");
        return { passed: false, logs };
      }
      logs.push("✓ Email selector is resilient");

      if (!hasPassTestId) {
        logs.push("✗ ERROR: Fragile selector found for password field.");
        logs.push("  ↳ Expected: cy.get('[data-testid=\"input-password\"]')");
        return { passed: false, logs };
      }
      logs.push("✓ Password selector is resilient");

      if (!hasBtnTestId) {
        logs.push("✗ ERROR: Fragile selector found for submit button.");
        logs.push("  ↳ Expected: cy.get('[data-testid=\"btn-submit\"]')");
        return { passed: false, logs };
      }
      logs.push("✓ Submit button selector is resilient");

      return { passed: true, logs };
    }
  },
  {
    id: "waiting",
    title: "Smart Waiting",
    description: "Eliminate flaky tests by replacing fixed waits with assertions.",
    difficulty: "Intermediate",
    icon: Clock,
    initialCode: `describe('Search Results', () => {
  it('should show results after API loads', () => {
    cy.visit('/search');
    cy.get('[data-testid="input-search"]').type('React');
    cy.get('[data-testid="btn-search"]').click();
    
    // TODO: This fixed wait is flaky (too short) or slow (too long). Remove it.
    cy.wait(5000); 
    
    // TODO: Add an assertion that implicitly waits for the element to exist
    // The results container has data-testid="results-grid"
    const results = cy.get('.results-grid');
    results.should('have.length.gt', 0);
  });
});`,
    missionBrief: {
      context: "The CI pipeline is slow because everyone uses `cy.wait(5000)`. Replace hard waits with smart assertions.",
      objectives: [
        { id: 1, text: "Remove `cy.wait(5000)`" },
        { id: 2, text: "Wait for `[data-testid=\"results-grid\"]` to be visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFixedWait = /cy\.wait\(\s*\d+\s*\)/.test(code);
      const hasResultsWait = code.includes('[data-testid="results-grid"]') || code.includes("[data-testid='results-grid']");
      const hasVisibleAssertion = code.includes('be.visible') || code.includes('exist');

      logs.push("✓ Test suite initialized");

      if (hasFixedWait) {
        logs.push("✗ ERROR: Fixed wait detected! cy.wait(5000) is an anti-pattern.");
        logs.push("  ↳ Remove explicit time waits.");
        return { passed: false, logs };
      }
      logs.push("✓ No fixed waits detected");

      if (!hasResultsWait) {
        logs.push("✗ ERROR: You are targeting the wrong element class.");
        logs.push("  ↳ Use the stable selector: [data-testid=\"results-grid\"]");
        return { passed: false, logs };
      }
      
      if (!hasVisibleAssertion) {
         logs.push("⚠ WARN: You selected the element but didn't assert visibility.");
         logs.push("  ↳ Best practice: .should('be.visible')");
      }

      logs.push("✓ Smart waiting implemented via assertions");
      return { passed: true, logs };
    }
  }
];
