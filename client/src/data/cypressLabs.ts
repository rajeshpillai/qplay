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
    initialCode: `describe('Parabank Login', () => {
  it('should login successfully', () => {
    // We are testing the Parabank demo site
    cy.visit('https://parabank.parasoft.com/parabank/index.htm');
    
    // TODO: Replace these fragile selectors with resilient data-testid selectors if available, 
    // or at least robust attributes (name, type) instead of CSS classes.
    // NOTE: Parabank is a legacy app, so we might not have data-testids. 
    // Let's use robust attributes like name="username" instead of classes.
    
    // Fragile: relying on layout classes
    cy.get('.input.field-1').type('john');
    
    // Fragile: relying on nth-child
    cy.get('form > div:nth-child(2) > input').type('demo');
    
    // Fragile: relying on button class
    cy.get('.button.login').click();
    
    // Verify login success
    cy.get('.smallText').should('contain', 'Welcome');
  });
});`,
    missionBrief: {
      context: "We are writing tests for the **Parabank** demo site. The current test uses fragile CSS selectors that break whenever the layout changes. Refactor it to use stable attributes.",
      objectives: [
        { id: 1, text: "Select username using `input[name='username']`" },
        { id: 2, text: "Select password using `input[name='password']`" },
        { id: 3, text: "Select login button using `input[type='submit']`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      // Parabank specific selectors
      const hasUsername = code.includes("input[name='username']") || code.includes('input[name="username"]');
      const hasPassword = code.includes("input[name='password']") || code.includes('input[name="password"]');
      const hasSubmit = code.includes("input[type='submit']") || code.includes('input[type="submit"]');

      logs.push("✓ Test suite initialized");
      logs.push("✓ Visiting https://parabank.parasoft.com/parabank/index.htm");
      
      if (!hasUsername) {
        logs.push("✗ ERROR: Fragile selector found for username.");
        logs.push("  ↳ Expected: cy.get(\"input[name='username']\")");
        return { passed: false, logs };
      }
      logs.push("✓ Username selector is resilient (by name attribute)");

      if (!hasPassword) {
        logs.push("✗ ERROR: Fragile selector found for password.");
        logs.push("  ↳ Expected: cy.get(\"input[name='password']\")");
        return { passed: false, logs };
      }
      logs.push("✓ Password selector is resilient (by name attribute)");

      if (!hasSubmit) {
        logs.push("✗ ERROR: Fragile selector found for login button.");
        logs.push("  ↳ Expected: cy.get(\"input[type='submit']\")");
        return { passed: false, logs };
      }
      logs.push("✓ Login button selector is resilient (by type attribute)");

      return { passed: true, logs };
    }
  },
  {
    id: "waiting",
    title: "Smart Waiting",
    description: "Eliminate flaky tests by replacing fixed waits with assertions.",
    difficulty: "Intermediate",
    icon: Clock,
    initialCode: `describe('Find Transactions', () => {
  it('should show results after API loads', () => {
    cy.visit('https://parabank.parasoft.com/parabank/findtrans.htm');
    
    // Fill out the search form
    cy.get("input[id='criteria.amount']").type('1000');
    cy.get("button[ng-click='findTransactions()']").click();
    
    // TODO: This fixed wait is flaky (too short) or slow (too long). Remove it.
    cy.wait(5000); 
    
    // TODO: Add an assertion that implicitly waits for the results table
    // The results table has ID #transactionTable
    const results = cy.get('#transactionTable');
    results.should('exist');
  });
});`,
    missionBrief: {
      context: "Parabank's 'Find Transactions' feature is slow. The current test uses `cy.wait(5000)` which slows down our CI. Replace it with a smart assertion.",
      objectives: [
        { id: 1, text: "Remove `cy.wait(5000)`" },
        { id: 2, text: "Wait for `#transactionTable` to be visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFixedWait = /cy\.wait\(\s*\d+\s*\)/.test(code);
      const hasResultsWait = code.includes('#transactionTable') || code.includes("id='transactionTable'");
      const hasVisibleAssertion = code.includes('be.visible') || code.includes('exist');

      logs.push("✓ Test suite initialized");
      logs.push("✓ Visiting https://parabank.parasoft.com/parabank/findtrans.htm");

      if (hasFixedWait) {
        logs.push("✗ ERROR: Fixed wait detected! cy.wait(5000) is an anti-pattern.");
        logs.push("  ↳ Remove explicit time waits.");
        return { passed: false, logs };
      }
      logs.push("✓ No fixed waits detected");

      if (!hasResultsWait) {
        logs.push("✗ ERROR: You are targeting the wrong element ID.");
        logs.push("  ↳ Use the stable selector: #transactionTable");
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
