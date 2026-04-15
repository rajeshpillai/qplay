import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search, List, CheckSquare, Eye, Upload, Database, Globe, Layers, Repeat, Variable, Timer, Monitor, History, HardDrive, Box, Link, Download, Clipboard, Shield, FileCheck, MessageSquare, ScrollText, Phone, Camera, Workflow, Footprints, BarChart3, Accessibility, GitBranch, Palette, Settings, Bug, FileText, Network, Gauge, Filter, Tag, Wrench, MapPin, Smartphone, Ban, MessageCircle } from "lucide-react";

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
    initialCode: `describe('Authentication Zone', () => {
  it('should login successfully', () => {
    // We are testing the Practice Arena
    cy.visit('/playground/auth');
    
    // TODO: Replace these fragile selectors with resilient data-testid selectors.
    // Fragile selectors break when the design changes.
    
    // Fragile: relying on layout structure
    cy.get('form > div:nth-child(2) > input').type('admin');
    
    // Fragile: relying on placeholder text (better, but still fragile)
    cy.get('[placeholder="••••••••"]').type('password123');
    
    // Fragile: relying on button text
    cy.contains('Sign In').click();
    
    // Verify login success
    cy.get('.text-green-500').should('contain', 'Welcome back');
  });
});`,
    missionBrief: {
      context: "We are writing tests for the **Auth Zone**. The current test uses fragile selectors. Refactor it to use `data-testid` attributes.",
      objectives: [
        { id: 1, text: "Select username using `[data-testid='input-username']`" },
        { id: 2, text: "Select password using `[data-testid='input-password']`" },
        { id: 3, text: "Select login button using `[data-testid='btn-login']`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasUsername = code.includes("input-username");
      const hasPassword = code.includes("input-password");
      const hasSubmit = code.includes("btn-login");

      logs.push("✓ Test suite initialized");
      logs.push("✓ Visiting /playground/auth");

      if (!hasUsername) {
        logs.push("✗ ERROR: Fragile selector found for username.");
        logs.push("  ↳ Expected: cy.get(\"[data-testid='input-username']\")");
        return { passed: false, logs };
      }
      logs.push("✓ Username selector is resilient (data-testid)");

      if (!hasPassword) {
        logs.push("✗ ERROR: Fragile selector found for password.");
        logs.push("  ↳ Expected: cy.get(\"[data-testid='input-password']\")");
        return { passed: false, logs };
      }
      logs.push("✓ Password selector is resilient (data-testid)");

      if (!hasSubmit) {
        logs.push("✗ ERROR: Fragile selector found for login button.");
        logs.push("  ↳ Expected: cy.get(\"[data-testid='btn-login']\")");
        return { passed: false, logs };
      }
      logs.push("✓ Login button selector is resilient (data-testid)");

      return { passed: true, logs };
    }
  },
  {
    id: "waiting",
    title: "Smart Waiting",
    description: "Eliminate flaky tests by replacing fixed waits with assertions.",
    difficulty: "Intermediate",
    icon: Clock,
    initialCode: `describe('User API', () => {
  it('should show results after API loads', () => {
    cy.visit('/playground/api');
    
    // Click the 'GET /api/users' button to fetch data
    cy.get('[data-testid="btn-get-users"]').click();
    
    // TODO: This fixed wait is flaky (too short) or slow (too long). Remove it.
    cy.wait(5000); 
    
    // TODO: Add an assertion that implicitly waits for the results
    // The user row has data-testid="user-row-1"
    const result = cy.get('[data-testid="user-row-1"]');
    result.should('exist');
  });
});`,
    missionBrief: {
      context: "The API Zone has a simulated delay. The current test uses `cy.wait(5000)` which slows down CI. Replace it with a smart assertion.",
      objectives: [
        { id: 1, text: "Remove `cy.wait(5000)`" },
        { id: 2, text: "Wait for `[data-testid='user-row-1']` to be visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];

      const cleanCode = code
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');

      const hasFixedWait = /cy\.wait\(\s*\d+\s*\)/.test(cleanCode);
      const hasResultsWait = code.includes('user-row-1');
      const hasVisibleAssertion = code.includes('be.visible') || code.includes('exist');

      logs.push("✓ Test suite initialized");
      logs.push("✓ Visiting /playground/api");

      if (hasFixedWait) {
        logs.push("✗ ERROR: Fixed wait detected! cy.wait(5000) is an anti-pattern.");
        logs.push("  ↳ Remove explicit time waits.");
        return { passed: false, logs };
      }
      logs.push("✓ No fixed waits detected");

      if (!hasResultsWait) {
        logs.push("✗ ERROR: You are targeting the wrong element.");
        logs.push("  ↳ Use the stable selector: [data-testid='user-row-1']");
        return { passed: false, logs };
      }

      if (!hasVisibleAssertion) {
        logs.push("⚠ WARN: You selected the element but didn't assert visibility.");
        logs.push("  ↳ Best practice: .should('be.visible')");
      }

      logs.push("✓ Smart waiting implemented via assertions");
      return { passed: true, logs };
    }
  },
  {
    id: "variables-aliases",
    title: "Variables & Aliases",
    description: "Learn to handle asynchronous values using Cypress aliases.",
    difficulty: "Beginner",
    icon: Variable,
    initialCode: `describe('Data Grid', () => {
  it('should verify project budget', () => {
    cy.visit('/playground/data');
    
    // TODO: Capture the budget text from the first row and reuse it
    // 1. Get the element with data-testid="row-1" -> 5th cell
    // 2. Alias it as 'projectBudget'
    // 3. Reuse it later
    
    cy.get('[data-testid="row-1"] td:nth-child(5)').invoke('text').then((text) => {
      // Don't use let/const for sharing state in Cypress!
      // Use aliases instead.
      cy.wrap(text).as('budget');
    });

    // TODO: Access the alias here using @
    // cy.get('@budget').should(...)
  });
});`,
    missionBrief: {
      context: "Async values in Cypress can't be stored in standard variables. Use Aliases (`.as()`) to store and retrieve values.",
      objectives: [
        { id: 1, text: "Create an alias named `budget`" },
        { id: 2, text: "Access the alias using `cy.get('@budget')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasAliasDef = /\.as\(['"]budget['"]\)/.test(code);
      const hasAliasUsage = /cy\.get\(['"]@budget['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasAliasDef) {
        logs.push("✗ ERROR: Alias definition missing.");
        logs.push("  ↳ Use .as('budget')");
        return { passed: false, logs };
      }

      if (!hasAliasUsage) {
        logs.push("✗ ERROR: Alias not accessed correctly.");
        logs.push("  ↳ Use cy.get('@budget')");
        return { passed: false, logs };
      }

      logs.push("✓ Aliases used correctly for async state");
      return { passed: true, logs };
    }
  },
  {
    id: "dropdowns",
    title: "Handling Dropdowns",
    description: "Master the `.select()` command for standard HTML select elements.",
    difficulty: "Beginner",
    icon: List,
    initialCode: `describe('User API Form', () => {
  it('should select user role', () => {
    cy.visit('/playground/api');
    
    // Note: The UI library uses a custom select, but let's assume standard select for this lab
    // or use the Data Grid filter which is a standard select in some implementations.
    // For this lab, let's pretend we are testing a standard HTML select.
    
    // We'll target the imaginary standard select:
    // <select id="role-select"><option value="Admin">Admin</option>...</select>
    
    // cy.get('#role-select').select('Admin');
  });
});`,
    missionBrief: {
      context: "Standard `<select>` elements require the special `.select()` command, not clicks.",
      objectives: [
        { id: 1, text: "Use `cy.get('#role-select')`" },
        { id: 2, text: "Chain `.select('Admin')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      // Simplified validation for concept
      const hasSelect = /\.select\(['"]Admin['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasSelect) {
        logs.push("✗ ERROR: .select('Admin') command missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Dropdown interaction correct");
      return { passed: true, logs };
    }
  },
  {
    id: "checkboxes",
    title: "Checkboxes & Radios",
    description: "Use `.check()` and `.uncheck()` for form controls.",
    difficulty: "Beginner",
    icon: CheckSquare,
    initialCode: `describe('Interactions Zone', () => {
  it('should toggle airplane mode', () => {
    cy.visit('/playground/interactions');
    
    // TODO: Check the 'airplane-mode' checkbox
    // Element: <button role="switch"> (Shadcn switch acts like checkbox in tests sometimes, but let's assume standard input for learning)
    
    // Ideally:
    // cy.get('[data-testid="switch-airplane"]').click(); 
    // But for this lesson, let's learn .check() on a standard input
    
    // cy.get('input[type="checkbox"]').check();
  });
});`,
    missionBrief: {
      context: "While `.click()` works on checkboxes, `.check()` and `.uncheck()` are more semantic and enforce state.",
      objectives: [
        { id: 1, text: "Use `.click()` (Shadcn Switch) or `.check()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasCheck = /\.check\(\)/.test(code) || /\.click\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasCheck) {
        logs.push("✗ ERROR: Interaction missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Form controls handled correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "assertions-chain",
    title: "Chaining Assertions",
    description: "Verify multiple properties of a single element efficiently.",
    difficulty: "Beginner",
    icon: Link,
    initialCode: `describe('Auth Zone Title', () => {
  it('should have correct styling', () => {
    cy.visit('/playground/auth');
    
    // TODO: Assert that the title "Authentication Zone":
    // 1. Is visible
    // 2. Contains text 'Authentication'
    // 3. Has class 'font-bold'
    
    // Inefficient way:
    cy.get('h1').should('be.visible');
    cy.get('h1').should('contain', 'Authentication');
    cy.get('h1').should('have.class', 'font-bold');
    
    // TODO: Rewrite this as a single chain
  });
});`,
    missionBrief: {
      context: "Querying the DOM multiple times for the same element is inefficient. Chain your assertions.",
      objectives: [
        { id: 1, text: "Use a single `cy.get('h1')`" },
        { id: 2, text: "Chain `.should().and().and()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const matchCount = (code.match(/cy\.get/g) || []).length;
      const hasAnd = /\.and\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (matchCount > 1) {
        logs.push("⚠ WARN: Multiple cy.get() calls detected.");
        logs.push("  ↳ Try chaining with .and()");
      }

      if (!hasAnd) {
        logs.push("✗ ERROR: Method chaining missing.");
        logs.push("  ↳ Use .should(...).and(...)");
        return { passed: false, logs };
      }

      logs.push("✓ Assertions chained efficiently");
      return { passed: true, logs };
    }
  },
  {
    id: "network-stub",
    title: "Network Stubbing",
    description: "Intercept API calls and force specific responses.",
    difficulty: "Intermediate",
    icon: Database,
    initialCode: `describe('API Zone', () => {
  it('should handle API errors gracefully', () => {
    // TODO: Intercept the simulated GET request
    // The practice arena uses a simulated delay, but we can still intercept real XHR if it were real.
    // For this lab, let's assume we are testing a real backend.
    
    // cy.intercept('GET', '/api/users', {
    //   statusCode: 500,
    //   body: { error: "Server Explosion" }
    // }).as('getUsers');
    
    cy.visit('/playground/api');
    
    // Trigger the request
    cy.get('[data-testid="btn-get-users"]').click();
    
    // Verify appropriate message appears
  });
});`,
    missionBrief: {
      context: "We need to test how the UI handles a 500 error. Mock the API response.",
      objectives: [
        { id: 1, text: "Intercept `GET /api/users`" },
        { id: 2, text: "Return `statusCode: 500`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = /cy\.intercept/.test(code);
      const has500 = /500/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasIntercept) {
        logs.push("✗ ERROR: cy.intercept() missing.");
        return { passed: false, logs };
      }

      if (!has500) {
        logs.push("✗ ERROR: Mock status code 500 missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Network request intercepted and mocked");
      return { passed: true, logs };
    }
  },
  {
    id: "api-spy",
    title: "API Spying",
    description: "Wait for real network requests to complete before asserting.",
    difficulty: "Intermediate",
    icon: Eye,
    initialCode: `describe('Transfer Funds', () => {
  it('should wait for transfer to complete', () => {
    cy.visit('https://parabank.parasoft.com/parabank/transfer.htm');
    
    // TODO: Spy on the POST request to /transfer
    // alias it as 'transferCall'
    
    cy.get('input[type="submit"]').click();
    
    // TODO: Wait for '@transferCall' explicitly
    // This prevents flakiness if the server is slow
    
    cy.get('.title').should('contain', 'Transfer Complete');
  });
});`,
    missionBrief: {
      context: "The transfer operation takes time. Instead of `cy.wait(5000)`, spy on the network call and wait for it to finish.",
      objectives: [
        { id: 1, text: "Intercept `POST **/transfer`" },
        { id: 2, text: "Alias it as `transferCall`" },
        { id: 3, text: "Use `cy.wait('@transferCall')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = /cy\.intercept/.test(code);
      const hasAlias = /\.as\(['"]transferCall['"]\)/.test(code);
      const hasWait = /cy\.wait\(['"]@transferCall['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasIntercept || !hasAlias) {
        logs.push("✗ ERROR: Network spy alias missing.");
        return { passed: false, logs };
      }

      if (!hasWait) {
        logs.push("✗ ERROR: Not waiting for the network alias.");
        logs.push("  ↳ Add cy.wait('@transferCall') before asserting");
        return { passed: false, logs };
      }

      logs.push("✓ Correctly waiting for network response");
      return { passed: true, logs };
    }
  },
  {
    id: "hover-states",
    title: "Hover States",
    description: "Trigger hover events using `.trigger()`.",
    difficulty: "Intermediate",
    icon: MousePointerClick,
    initialCode: `describe('Navigation Menu', () => {
  it('should show tooltip on hover', () => {
    cy.visit('/playground/interactions');
    
    // The tooltip is hidden until we hover over 'Hover Me'
    // Element: <button data-testid="btn-hover">Hover Me</button>
    
    // TODO: Trigger a mouseover (or mouseenter) event on the button
    cy.get('[data-testid="btn-hover"]').trigger('mouseenter');
    
    // Then assert tooltip content is visible
    cy.get('[data-testid="tooltip-content"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Cypress doesn't have a native `.hover()` command because hover is a fragile state. Use `.trigger('mouseenter')` to simulate it.",
      objectives: [
        { id: 1, text: "Select `[data-testid='btn-hover']`" },
        { id: 2, text: "Chain `.trigger('mouseenter')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasTrigger = /\.trigger\(['"]mouseover['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasTrigger) {
        logs.push("✗ ERROR: Hover event not triggered.");
        logs.push("  ↳ Use .trigger('mouseover')");
        return { passed: false, logs };
      }

      logs.push("✓ Hover state simulated correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "iframe",
    title: "Working with iFrames",
    description: "Accessing content inside an iframe requires special handling.",
    difficulty: "Advanced",
    icon: Layers,
    initialCode: `describe('Third Party Widget', () => {
  it('should interact with iframe content', () => {
    cy.visit('/playground/interactions');
    
    // The payment widget is inside <iframe id="payment-frame">
    // We can't just do cy.get('[data-testid="input-card"]')
    
    // TODO: Get the iframe
    // TODO: Get its '0.contentDocument.body'
    // TODO: Wrap it with cy.wrap() to chain commands
    
    cy.get('#payment-frame')
      .its('0.contentDocument.body')
      // .should('not.be.empty') // Wait for it to load
      // .then(cy.wrap)
      // .find('[data-testid="input-card"]').type('1234');
  });
});`,
    missionBrief: {
      context: "Elements inside iFrames are hidden from the main Cypress runner. You need to 'drill down' into the iframe's document.",
      objectives: [
        { id: 1, text: "Get iframe body via `.its('0.contentDocument.body')`" },
        { id: 2, text: "Use `cy.wrap()` to make it queryable" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIts = /\.its\(['"]0\.contentDocument\.body['"]\)/.test(code);
      const hasWrap = /cy\.wrap/.test(code) || /\.then\(cy\.wrap\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasIts) {
        logs.push("✗ ERROR: Failed to access iframe document.");
        logs.push("  ↳ Use .its('0.contentDocument.body')");
        return { passed: false, logs };
      }

      if (!hasWrap) {
        logs.push("✗ ERROR: Failed to wrap iframe body.");
        logs.push("  ↳ Use cy.wrap() to enable chaining");
        return { passed: false, logs };
      }

      logs.push("✓ iFrame context accessed successfully");
      return { passed: true, logs };
    }
  },
  {
    id: "file-upload",
    title: "File Uploads",
    description: "Upload files using `.selectFile()`.",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `describe('Document Upload', () => {
  it('should upload a file', () => {
    cy.visit('/playground/data');
    
    // TODO: Upload a file to the input
    // Input: <input type="file" data-testid="input-upload" />
    
    // Cypress has a built-in command for this since v9.3.0
    // No plugins needed!
    
  });
});`,
    missionBrief: {
      context: "Testing file uploads used to require plugins. Now you can use the native `.selectFile()` command.",
      objectives: [
        { id: 1, text: "Select input `[data-testid='input-upload']`" },
        { id: 2, text: "Use `.selectFile('path/to/file')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSelectFile = /\.selectFile\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasSelectFile) {
        logs.push("✗ ERROR: .selectFile() command missing.");
        return { passed: false, logs };
      }

      logs.push("✓ File upload simulated");
      return { passed: true, logs };
    }
  },
  {
    id: "iteration",
    title: "Iterating Elements",
    description: "Loop through a list of elements using `.each()`.",
    difficulty: "Intermediate",
    icon: Repeat,
    initialCode: `describe('Transaction List', () => {
  it('should verify all projects are valid', () => {
    cy.visit('/playground/data');
    
    // We have a list of rows: <tr data-testid="row-1">...</tr>
    
    // TODO: Iterate over all rows with IDs starting with 'row-'
    // Check that each one contains 'Project'
    
    cy.get('[data-testid^="row-"]').each(($el, index, $list) => {
      // $el is a raw jQuery element
      // Wrap it to use Cypress commands
      
    });
  });
});`,
    missionBrief: {
      context: "Sometimes you need to validate every item in a list. Use `.each()` to loop through found elements.",
      objectives: [
        { id: 1, text: "Chain `.each()` to `cy.get()`" },
        { id: 2, text: "Wrap element with `cy.wrap($el)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasEach = /\.each\(/.test(code);
      const hasWrap = /cy\.wrap/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasEach) {
        logs.push("✗ ERROR: .each() loop missing.");
        return { passed: false, logs };
      }

      if (!hasWrap) {
        logs.push("✗ ERROR: Element not wrapped inside loop.");
        logs.push("  ↳ Use cy.wrap($el) to assert on it");
        return { passed: false, logs };
      }

      logs.push("✓ List iteration implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "cookies",
    title: "Cookies & Storage",
    description: "Manipulate Cookies and LocalStorage for authentication testing.",
    difficulty: "Intermediate",
    icon: HardDrive,
    initialCode: `describe('Remember Me', () => {
  it('should set auth local storage', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();
    
    // TODO: Verify LocalStorage has 'session_token'
    // cy.getAllLocalStorage(...) is valid, but we can also check window
    
    // cy.window().its('localStorage')...
  });
});`,
    missionBrief: {
      context: "Testing persistence often requires checking cookies or local storage directly.",
      objectives: [
        { id: 1, text: "Use `cy.window().its('localStorage')`" },
        { id: 2, text: "Invoke `.invoke('getItem', 'session_token')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasGetCookie = /cy\.getCookie\(['"]session_id['"]\)/.test(code);
      const hasShould = /\.should\(['"]exist['"]\)/.test(code) || /\.should\(['"]not\.be\.null['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasGetCookie) {
        logs.push("✗ ERROR: Not checking for session_id cookie.");
        return { passed: false, logs };
      }

      if (!hasShould) {
        logs.push("✗ ERROR: Assertion missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Cookie validation correct");
      return { passed: true, logs };
    }
  },
  {
    id: "viewport",
    title: "Responsive Testing",
    description: "Test your layout on different screen sizes.",
    difficulty: "Beginner",
    icon: Monitor,
    initialCode: `describe('Mobile Layout', () => {
  it('should show tabs on mobile', () => {
    // TODO: Set viewport to iPhone X size (375, 812)
    // cy.viewport(...)
    
    cy.visit('/playground/auth');
    
    // Verify tabs are visible
    // <div role="tablist">
    cy.get('[role="tablist"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Don't just test on desktop. Use `cy.viewport` to simulate mobile devices.",
      objectives: [
        { id: 1, text: "Use `cy.viewport(375, 812)`" },
        { id: 2, text: "Or use a preset like `cy.viewport('iphone-x')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasViewport = /cy\.viewport\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasViewport) {
        logs.push("✗ ERROR: Viewport not configured.");
        return { passed: false, logs };
      }

      logs.push("✓ Viewport set to mobile dimensions");
      return { passed: true, logs };
    }
  },
  {
    id: "env-vars",
    title: "Environment Variables",
    description: "Securely handle secrets using `Cypress.env`.",
    difficulty: "Intermediate",
    icon: Box,
    initialCode: `describe('Admin Login', () => {
  it('should login with secret credentials', () => {
    cy.visit('/playground/auth');
    
    // TODO: Do NOT hardcode passwords!
    // Access the 'admin_password' from environment variables
    
    const password = "HARDCODED_SECRET"; // BAD!
    
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type(password);
    cy.get('[data-testid="btn-login"]').click();
  });
});`,
    missionBrief: {
      context: "Never commit secrets to git. Access them via `Cypress.env()`.",
      objectives: [
        { id: 1, text: "Remove hardcoded string" },
        { id: 2, text: "Use `Cypress.env('admin_password')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasEnv = /Cypress\.env\(['"]admin_password['"]\)/.test(code);
      const hasHardcoded = /"HARDCODED_SECRET"/.test(code);

      logs.push("✓ Test suite initialized");

      if (hasHardcoded) {
        logs.push("✗ ERROR: Hardcoded secret detected!");
        return { passed: false, logs };
      }

      if (!hasEnv) {
        logs.push("✗ ERROR: Cypress.env() not used.");
        return { passed: false, logs };
      }

      logs.push("✓ Secrets handled securely");
      return { passed: true, logs };
    }
  },
  {
    id: "navigation",
    title: "Navigation & History",
    description: "Test browser navigation (Back, Forward, Reload).",
    difficulty: "Beginner",
    icon: History,
    initialCode: `describe('Browser Navigation', () => {
  it('should preserve state on reload', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('Alice');
    
    // TODO: Reload the page
    
    
    // TODO: Verify name is gone (or still there if we expected persistence, but standard input clears)
    // For this test, let's just check if the page reloaded successfully
    cy.get('[data-testid="input-username"]').should('be.visible');
    
    // TODO: Go back to previous page
    
  });
});`,
    missionBrief: {
      context: "Test how your app handles browser actions like Refresh and Back button.",
      objectives: [
        { id: 1, text: "Use `cy.reload()`" },
        { id: 2, text: "Use `cy.go('back')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasReload = /cy\.reload\(\)/.test(code);
      const hasBack = /cy\.go\(['"]back['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasReload) {
        logs.push("✗ ERROR: Page reload missing.");
        return { passed: false, logs };
      }

      if (!hasBack) {
        logs.push("✗ ERROR: Back navigation missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Navigation actions verified");
      return { passed: true, logs };
    }
  },
  {
    id: "shadow-dom",
    title: "Shadow DOM",
    description: "Piercing the Shadow DOM in Web Components.",
    difficulty: "Advanced",
    icon: Layers,
    initialCode: `describe('Web Component', () => {
  it('should click button inside shadow root', () => {
    cy.visit('/playground/interactions');
    
    // Element structure:
    // <div id="shadow-host">
    //   #shadow-root
    //     <button class="btn">Click Me</button>
    // </div>
    
    // Standard get fails because of shadow boundary
    cy.get('#shadow-host').find('.btn').click(); // Fails
    
    // TODO: Use .shadow() command
  });
});`,
    missionBrief: {
      context: "Standard selectors can't see inside Shadow DOM. Use `.shadow()` to traverse the boundary.",
      objectives: [
        { id: 1, text: "Get the host element `#shadow-host`" },
        { id: 2, text: "Chain `.shadow()`" },
        { id: 3, text: "Find `.btn`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasShadow = /\.shadow\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasShadow) {
        logs.push("✗ ERROR: Shadow DOM traversal missing.");
        logs.push("  ↳ Use .shadow() after getting the host element");
        return { passed: false, logs };
      }

      logs.push("✓ Shadow DOM pierced successfully");
      return { passed: true, logs };
    }
  },
  {
    id: "within",
    title: "Scoped Selection",
    description: "Scope your selectors using `.within()`.",
    difficulty: "Intermediate",
    icon: Search,
    initialCode: `describe('Validating Tabs', () => {
  it('should scope selection to active tab', () => {
    cy.visit('/playground/auth');
    
    // We have a login tab content.
    // Use .within() to scope commands to the login form container
    
    // TODO: Target ONLY the login form
    // Use .within() to scope commands
    
    cy.get('#login-form').within(() => {
      // commands here are scoped to #login-form
      // so cy.get('[data-testid="input-username"]') finds the right one
      
    });
  });
});`,
    missionBrief: {
      context: "When you have duplicate elements, scoping with `.within()` is cleaner than chaining long selectors.",
      objectives: [
        { id: 1, text: "Get `#login-form`" },
        { id: 2, text: "Call `.within(() => { ... })`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWithin = /\.within\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasWithin) {
        logs.push("✗ ERROR: .within() scope missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Selectors scoped correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "timer",
    title: "Time Travel",
    description: "Control time using `cy.clock()` and `cy.tick()`.",
    difficulty: "Advanced",
    icon: Timer,
    initialCode: `describe('Session Timeout', () => {
  it('should log out after 30 minutes', () => {
    // TODO: Freeze time before visiting
    // cy.clock()
    
    cy.visit('/playground/auth');
    
    // TODO: Fast forward time by 30 minutes (in ms)
    // 30 * 60 * 1000 = 1800000
    // cy.tick(...)
    
    // In our playground, we might not have a real timeout, 
    // but the concept remains the same for learning.
  });
});`,
    missionBrief: {
      context: "Don't wait 30 minutes for a test! Use `cy.clock()` to freeze time and `cy.tick()` to fast-forward.",
      objectives: [
        { id: 1, text: "Call `cy.clock()`" },
        { id: 2, text: "Call `cy.tick(1800000)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClock = /cy\.clock\(\)/.test(code);
      const hasTick = /cy\.tick\(\s*1800000\s*\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasClock) {
        logs.push("✗ ERROR: Time not frozen.");
        logs.push("  ↳ Call cy.clock() at the start");
        return { passed: false, logs };
      }

      if (!hasTick) {
        logs.push("✗ ERROR: Time not advanced.");
        logs.push("  ↳ Use cy.tick(1800000)");
        return { passed: false, logs };
      }

      logs.push("✓ Time travel successful");
      return { passed: true, logs };
    }
  },
  {
    id: "custom-commands",
    title: "Custom Commands",
    description: "Create reusable commands for common actions.",
    difficulty: "Advanced",
    icon: Code2,
    initialCode: `// In support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', '/api/login', { username, password });
});

// In spec.js
describe('Admin Dashboard', () => {
  it('should load for admin', () => {
    // TODO: Use the custom cy.login() command
    
    cy.visit('/playground/auth');
  });
});`,
    missionBrief: {
      context: "Don't repeat login code in every test. Use a custom command `cy.login()`.",
      objectives: [
        { id: 1, text: "Call `cy.login('user', 'pass')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasCustomCommand = /cy\.login\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasCustomCommand) {
        logs.push("✗ ERROR: Custom command usage not found.");
        return { passed: false, logs };
      }

      logs.push("✓ Custom command invoked");
      return { passed: true, logs };
    }
  },
  {
    id: "drag-drop",
    title: "Drag and Drop",
    description: "Simulate drag and drop events using .trigger()",
    difficulty: "Intermediate",
    icon: MousePointerClick,
    initialCode: `describe('Drag and Drop', () => {
  it('should move item to drop zone', () => {
    cy.visit('/playground/interactions');
    
    // We need to drag [data-testid="draggable-item"] to [data-testid="drop-zone"]
    
    const dataTransfer = new DataTransfer();
    
    // TODO: Trigger 'dragstart' on the task
    cy.get('[data-testid="draggable-item"]').trigger('dragstart', {
      dataTransfer
    });
    
    // TODO: Trigger 'drop' on the destination
    // cy.get('[data-testid="drop-zone"]').trigger(...)
  });
});`,
    missionBrief: {
      context: "Cypress simulates drag and drop by triggering events manually.",
      objectives: [
        { id: 1, text: "Trigger `drop` on `[data-testid='drop-zone']`" },
        { id: 2, text: "Pass `dataTransfer` object" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasDrop = /\.trigger\(['"]drop['"]/.test(code);
      const hasDataTransfer = /dataTransfer/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasDrop) {
        logs.push("✗ ERROR: Drop event not triggered.");
        return { passed: false, logs };
      }

      logs.push("✓ Drag and drop sequence valid");
      return { passed: true, logs };
    }
  },
  {
    id: "origin",
    title: "Cross-Origin (Multi-Domain)",
    description: "Test flows that span multiple domains using cy.origin()",
    difficulty: "Advanced",
    icon: Globe,
    initialCode: `describe('SSO Login', () => {
  it('should login via Auth0', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="btn-login"]').click();
    
    // Now we are redirected to auth0.com
    // We cannot access elements there normally
    
    // TODO: Use cy.origin to switch context to 'auth0.com'
    // cy.origin('https://auth0.com', () => {
    //   cy.get('#username').type(...)
    // })
  });
});`,
    missionBrief: {
      context: "Cypress runs in the browser. To test across domains (like SSO), use `cy.origin()`.",
      objectives: [
        { id: 1, text: "Use `cy.origin('https://auth0.com', ...)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasOrigin = /cy\.origin\(['"]https:\/\/auth0\.com['"]/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasOrigin) {
        logs.push("✗ ERROR: cy.origin() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Cross-origin context handled");
      return { passed: true, logs };
    }
  },
  {
    id: "accessibility",
    title: "Accessibility (a11y)",
    description: "Automated accessibility testing with cypress-axe.",
    difficulty: "Intermediate",
    icon: Eye,
    initialCode: `describe('Accessibility', () => {
  it('should have no violations', () => {
    cy.visit('/playground/auth');
    
    // TODO: Inject the axe-core library
    // cy.injectAxe();
    
    // TODO: Scan the page for a11y issues
    // cy.checkA11y();
  });
});`,
    missionBrief: {
      context: "Ensure your app is accessible. Use `cy.injectAxe()` and `cy.checkA11y()` to audit the page automatically.",
      objectives: [
        { id: 1, text: "Call `cy.injectAxe()`" },
        { id: 2, text: "Call `cy.checkA11y()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasInject = /cy\.injectAxe\(\)/.test(code);
      const hasCheck = /cy\.checkA11y\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasInject) {
        logs.push("✗ ERROR: Axe not injected.");
        return { passed: false, logs };
      }

      if (!hasCheck) {
        logs.push("✗ ERROR: A11y check not performed.");
        return { passed: false, logs };
      }

      logs.push("✓ Accessibility audit configured");
      return { passed: true, logs };
    }
  },
  {
    id: "clipboard",
    title: "Clipboard Testing",
    description: "Test copy-to-clipboard functionality.",
    difficulty: "Advanced",
    icon: HardDrive,
    initialCode: `describe('Copy Code', () => {
  it('should copy text to clipboard', () => {
    cy.visit('/playground/interactions');
    
    // We need to grant clipboard permissions first
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        origin: window.location.origin,
      },
    }));

    cy.get('[data-testid="btn-copy"]').click();
    
    // TODO: Assert clipboard content
    // cy.window().its('navigator.clipboard').invoke('readText')...
  });
});`,
    missionBrief: {
      context: "Reading the clipboard requires browser permissions and accessing the `navigator.clipboard` API.",
      objectives: [
        { id: 1, text: "Access `navigator.clipboard`" },
        { id: 2, text: "Invoke `readText`" },
        { id: 3, text: "Assert content" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClipboard = /navigator\.clipboard/.test(code);
      const hasRead = /readText/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasClipboard || !hasRead) {
        logs.push("✗ ERROR: Clipboard access incorrect.");
        logs.push("  ↳ Use cy.window().its('navigator.clipboard').invoke('readText')");
        return { passed: false, logs };
      }

      logs.push("✓ Clipboard content verified");
      return { passed: true, logs };
    }
  },
  {
    id: "local-storage-seed",
    title: "Seeding Local Storage",
    description: "Set up app state before visiting the page.",
    difficulty: "Intermediate",
    icon: Database,
    initialCode: `describe('Shopping Cart', () => {
  it('should use local storage', () => {
    // TODO: Seed Local Storage BEFORE visiting
    // We want to simulate a user who already added items
    
    cy.window().then((win) => {
       // win.localStorage.setItem(...)
    });
    
    cy.visit('/playground/auth');
    // Note: The Auth Zone doesn't automatically read from LS on mount for UI,
    // but we can verify the state exists.
  });
});`,
    missionBrief: {
      context: "Don't manually add items to the cart in every test. Seed `localStorage` directly to set the state instantly.",
      objectives: [
        { id: 1, text: "Set `session_token` in localStorage" },
        { id: 2, text: "Do this BEFORE `cy.visit`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSetItem = /localStorage\.setItem/.test(code);
      const visitIndex = code.indexOf('cy.visit');
      const setIndex = code.indexOf('setItem');

      logs.push("✓ Test suite initialized");

      if (!hasSetItem) {
        logs.push("✗ ERROR: localStorage.setItem missing.");
        return { passed: false, logs };
      }

      if (visitIndex > -1 && setIndex > visitIndex) {
        logs.push("⚠ WARN: You are visiting before seeding storage.");
        logs.push("  ↳ Seed first, then visit, or the app won't see the data.");
      }

      logs.push("✓ State seeded via LocalStorage");
      return { passed: true, logs };
    }
  },
  {
    id: "screenshots",
    title: "Screenshots",
    description: "Capture evidence of test failures or states.",
    difficulty: "Beginner",
    icon: Eye,
    initialCode: `describe('Visual Evidence', () => {
  it('should take a screenshot of the error', () => {
    cy.visit('/playground/auth');
    
    // TODO: Take a full page screenshot
    // cy.screenshot('error-state');
    
    // TODO: Take a screenshot of a specific element
    // cy.get('form').screenshot();
  });
});`,
    missionBrief: {
      context: "Screenshots are vital for debugging CI failures. Use `cy.screenshot()`.",
      objectives: [
        { id: 1, text: "Capture full page screenshot" },
        { id: 2, text: "Capture element screenshot" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasScreenshot = /cy\.screenshot/.test(code);
      const hasElementScreenshot = /\.screenshot\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasScreenshot) {
        logs.push("✗ ERROR: Screenshot command missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Screenshot captured");
      return { passed: true, logs };
    }
  },
  {
    id: "recursion",
    title: "Polling (Recursion)",
    description: "Wait for a condition by polling an API or UI element.",
    difficulty: "Advanced",
    icon: Repeat,
    initialCode: `// A custom function to poll for status
const checkStatus = () => {
  // TODO: Recursively check if status is 'COMPLETE'
  // If not, wait and check again.
  
  cy.get('[data-testid="btn-get-users"]').invoke('text').then((text) => {
    if (!text.includes('Loaded')) {
      cy.wait(500);
      checkStatus(); // Recurse
    }
  });
}

describe('Long Process', () => {
  it('should wait for completion', () => {
    cy.visit('/playground/api');
    checkStatus();
  });
});`,
    missionBrief: {
      context: "Sometimes `cy.wait` isn't enough. Use recursion to poll until a condition is met.",
      objectives: [
        { id: 1, text: "Check condition" },
        { id: 2, text: "Call function recursively if false" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRecursion = /checkStatus\(\)/.test(code);
      const hasWait = /cy\.wait/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasRecursion) {
        logs.push("✗ ERROR: Recursive call missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Polling logic implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "blur-focus",
    title: "Blur & Focus",
    description: "Trigger validation by blurring inputs.",
    difficulty: "Beginner",
    icon: MousePointerClick,
    initialCode: `describe('Form Validation', () => {
  it('should show error when field is left empty', () => {
    cy.visit('/playground/auth');
    
    // The error only appears when the user leaves the field (blur)
    cy.get('[data-testid="input-username"]').click();
    
    // TODO: Trigger blur event
    // cy.get('[data-testid="input-username"]').blur();
    
    // cy.get('input:invalid').should('have.length', 1);
  });
});`,
    missionBrief: {
      context: "Many forms validate on 'blur' (losing focus). Use `.blur()` to trigger this.",
      objectives: [
        { id: 1, text: "Select input" },
        { id: 2, text: "Call `.blur()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasBlur = /\.blur\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasBlur) {
        logs.push("✗ ERROR: .blur() command missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Focus management verified");
      return { passed: true, logs };
    }
  },
  {
    id: "fixture",
    title: "Using Fixtures",
    description: "Load static data from JSON files.",
    difficulty: "Beginner",
    icon: Database,
    initialCode: `describe('User Profile', () => {
  it('should fill form with fixture data', () => {
    // TODO: Load 'user.json' fixture
    // cy.fixture('user.json').then((user) => { ... })
    
    cy.visit('/playground/auth');
    // cy.get('[data-testid="input-username"]').type(user.name);
  });
});`,
    missionBrief: {
      context: "Keep your test data separate from test logic. Use `cy.fixture()` to load JSON data.",
      objectives: [
        { id: 1, text: "Load fixture" },
        { id: 2, text: "Use data in `.type()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFixture = /cy\.fixture/.test(code);
      const hasUsage = /\.then/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasFixture) {
        logs.push("✗ ERROR: cy.fixture() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Fixture data loaded");
      return { passed: true, logs };
    }
  },
  {
    id: "session",
    title: "Session Caching",
    description: "Cache login sessions to speed up tests.",
    difficulty: "Advanced",
    icon: Database,
    initialCode: `describe('Dashboard', () => {
  beforeEach(() => {
    // TODO: Wrap the login logic in cy.session()
    // This will cache cookies/localStorage automatically
    
    // cy.session('user-session', () => {
    //   cy.visit('/playground/auth');
    //   cy.get('[data-testid="input-username"]').type('admin');
    //   cy.get('[data-testid="input-password"]').type('password123');
    //   cy.get('[data-testid="btn-login"]').click();
    //   cy.get('[data-testid="alert-success"]').should('be.visible');
    // });
    
    // Original slow login:
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();
  });

  it('should show stats', () => {
    cy.visit('/playground/auth');
  });
});`,
    missionBrief: {
      context: "Logging in before every test is slow. Use `cy.session()` to cache the session state.",
      objectives: [
        { id: 1, text: "Wrap login steps in `cy.session()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSession = /cy\.session/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasSession) {
        logs.push("✗ ERROR: cy.session() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Session caching implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "task",
    title: "Node Tasks",
    description: "Execute code in Node.js backend using cy.task().",
    difficulty: "Advanced",
    icon: Terminal,
    initialCode: `describe('Database Cleanup', () => {
  it('should reset database before test', () => {
    // We cannot access the DB directly from the browser
    // We need to ask the Node backend to do it
    
    // TODO: Call the 'resetDb' task
    // cy.task(...)
    
    cy.visit('/playground/data');
  });
});`,
    missionBrief: {
      context: "Browser sandbox prevents direct DB access. Use `cy.task()` to run Node.js code on the server.",
      objectives: [
        { id: 1, text: "Call `cy.task('resetDb')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasTask = /cy\.task\(['"]resetDb['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasTask) {
        logs.push("✗ ERROR: cy.task() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Node task triggered");
      return { passed: true, logs };
    }
  },
  {
    id: "read-file",
    title: "Reading Files",
    description: "Verify downloaded files or config content.",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `describe('Config Check', () => {
  it('should have correct version in config.json', () => {
    // TODO: Read 'config.json' from the root
    // cy.readFile(...)
    
    // TODO: Assert that the version is '1.0.0'
    // .should('deep.equal', { version: '1.0.0' })
  });
});`,
    missionBrief: {
      context: "Verify file contents using `cy.readFile()`.",
      objectives: [
        { id: 1, text: "Use `cy.readFile('config.json')`" },
        { id: 2, text: "Assert content" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRead = /cy\.readFile\(['"]config\.json['"]\)/.test(code);
      const hasShould = /\.should/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasRead) {
        logs.push("✗ ERROR: cy.readFile() missing.");
        return { passed: false, logs };
      }

      if (!hasShould) {
        logs.push("✗ ERROR: Assertion missing.");
        return { passed: false, logs };
      }

      logs.push("✓ File read verified");
      return { passed: true, logs };
    }
  },
  {
    id: "location",
    title: "URL & Location",
    description: "Assert current URL, path, or query params.",
    difficulty: "Beginner",
    icon: Globe,
    initialCode: `describe('Redirects', () => {
  it('should redirect', () => {
    cy.visit('/playground/auth');
    
    // User is redirected to: /login?returnTo=/protected
    
    // TODO: Assert the URL contains '/auth'
    // cy.url()...
    
    // TODO: Assert the pathname is '/playground/auth'
    // cy.location('pathname')...
  });
});`,
    missionBrief: {
      context: "Verify that redirects happen correctly by checking the URL.",
      objectives: [
        { id: 1, text: "Check `cy.url()` contains '/auth'" },
        { id: 2, text: "Check `cy.location('pathname')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasUrl = /cy\.url\(\)/.test(code);
      const hasLocation = /cy\.location\(['"]pathname['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasUrl) {
        logs.push("✗ ERROR: cy.url() check missing.");
        return { passed: false, logs };
      }

      if (!hasLocation) {
        logs.push("✗ ERROR: cy.location() check missing.");
        return { passed: false, logs };
      }

      logs.push("✓ URL verification correct");
      return { passed: true, logs };
    }
  },
  {
    id: "wrap",
    title: "Wrapping Values",
    description: "Bring synchronous values into the Cypress chain.",
    difficulty: "Intermediate",
    icon: Box,
    initialCode: `describe('Calculations', () => {
  it('should calculate total correctly', () => {
    const items = [10, 20, 30];
    const total = items.reduce((a, b) => a + b, 0);
    
    // 'total' is just a number (60). It's not a Cypress subject.
    // We cannot do: total.should('eq', 60)
    
    // TODO: Wrap 'total' so we can use .should()
    // cy.wrap(total)...
  });
});`,
    missionBrief: {
      context: "To use Cypress assertions on plain JS objects/primitives, wrap them with `cy.wrap()`.",
      objectives: [
        { id: 1, text: "Use `cy.wrap(total)`" },
        { id: 2, text: "Assert `.should('eq', 60)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWrap = /cy\.wrap\(total\)/.test(code);
      const hasShould = /\.should\(['"]eq['"],\s*60\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasWrap) {
        logs.push("✗ ERROR: cy.wrap() missing.");
        return { passed: false, logs };
      }

      if (!hasShould) {
        logs.push("✗ ERROR: Assertion missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Synchronous value wrapped");
      return { passed: true, logs };
    }
  },
  {
    id: "viewport-orientation",
    title: "Viewport Orientation",
    description: "Test landscape vs portrait modes.",
    difficulty: "Beginner",
    icon: Monitor,
    initialCode: `describe('Tablet Layout', () => {
  it('should adjust layout in landscape', () => {
    // TODO: Set viewport to ipad-2 in landscape
    // cy.viewport('ipad-2', 'landscape');
    
    cy.visit('/playground/auth');
    cy.get('[role="tablist"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Test how your app responds to device orientation changes.",
      objectives: [
        { id: 1, text: "Set viewport to 'ipad-2', 'landscape'" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasViewport = /cy\.viewport\(['"]ipad-2['"],\s*['"]landscape['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasViewport) {
        logs.push("✗ ERROR: Viewport orientation incorrect.");
        return { passed: false, logs };
      }

      logs.push("✓ Landscape mode set");
      return { passed: true, logs };
    }
  },
  {
    id: "scroll-view",
    title: "Scrolling",
    description: "Scroll elements into view before interacting.",
    difficulty: "Beginner",
    icon: MousePointerClick,
    initialCode: `describe('Footer Links', () => {
  it('should check footer visibility', () => {
    cy.visit('/playground/data');
    
    // Footer is at the bottom.
    // Sometimes elements are lazy-loaded on scroll.
    
    // TODO: Scroll the footer into view
    // cy.get('footer').scrollIntoView();
    // Or scroll the next button into view
    
    cy.get('[data-testid="btn-next"]').scrollIntoView();
  });
});`,
    missionBrief: {
      context: "Ensure lazy-loaded elements appear by scrolling to them explicitly.",
      objectives: [
        { id: 1, text: "Use `.scrollIntoView()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasScroll = /\.scrollIntoView\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasScroll) {
        logs.push("✗ ERROR: .scrollIntoView() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Scroll action performed");
      return { passed: true, logs };
    }
  },
  {
    id: "pause",
    title: "Debugging with Pause",
    description: "Halt test execution to inspect the DOM.",
    difficulty: "Beginner",
    icon: Clock,
    initialCode: `describe('Complex Flow', () => {
  it('should stop for debugging', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('debug');
    
    // I want to see the state before continuing
    
    // TODO: Pause execution here
    // cy.pause();
    
    cy.get('[data-testid="btn-login"]').click();
  });
});`,
    missionBrief: {
      context: "Stop the test runner to manually inspect the DOM in the Chrome DevTools.",
      objectives: [
        { id: 1, text: "Call `cy.pause()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPause = /cy\.pause\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasPause) {
        logs.push("✗ ERROR: cy.pause() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Execution paused");
      return { passed: true, logs };
    }
  },
  {
    id: "drag-drop-advanced",
    title: "Drag and Drop (Advanced)",
    description: "Simulate drag events using `.trigger()` with DataTransfer.",
    difficulty: "Advanced",
    icon: MousePointerClick,
    initialCode: `describe('Drag and Drop', () => {
  it('should drag item to drop zone', () => {
    cy.visit('/playground/interactions');

    // Cypress doesn't have a native drag command.
    // We must manually trigger dragstart, dragover, and drop events.

    // TODO: Define a DataTransfer object
    const dataTransfer = new DataTransfer();

    // TODO: Trigger 'dragstart' on draggable item
    cy.get('[data-testid="draggable-item"]').trigger('dragstart', {
      dataTransfer
    });

    // TODO: Trigger 'drop' on drop zone
    cy.get('[data-testid="drop-zone"]').trigger('drop', {
      dataTransfer
    });

    // Assert success message
    cy.contains('Dropped!').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Drag and Drop is complex in Cypress. You need to simulate the `DataTransfer` object manually.",
      objectives: [
        { id: 1, text: "Create `new DataTransfer()`" },
        { id: 2, text: "Trigger `dragstart` with dataTransfer" },
        { id: 3, text: "Trigger `drop` with dataTransfer" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasDataTransfer = /new\s+DataTransfer\(\)/.test(code);
      const hasDragStart = /\.trigger\(['"]dragstart['"]/.test(code);
      const hasDrop = /\.trigger\(['"]drop['"]/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasDataTransfer) {
        logs.push("✗ ERROR: DataTransfer object missing.");
        return { passed: false, logs };
      }

      if (!hasDragStart || !hasDrop) {
        logs.push("✗ ERROR: Drag events missing.");
        logs.push("  ↳ Need both 'dragstart' and 'drop'");
        return { passed: false, logs };
      }

      logs.push("✓ Drag and Drop simulated");
      return { passed: true, logs };
    }
  },
  {
    id: "clipboard-advanced",
    title: "Clipboard Testing (Stub)",
    description: "Stub `navigator.clipboard` to test copy functionality.",
    difficulty: "Advanced",
    icon: Clipboard,
    initialCode: `describe('Copy to Clipboard', () => {
  it('should copy the secret code', () => {
    cy.visit('/playground/interactions');
    
    // Accessing real clipboard is flaky in CI.
    // Best Practice: Stub the browser API.
    
    // TODO: Stub navigator.clipboard.writeText
    // cy.window().then((win) => {
    //   cy.stub(win.navigator.clipboard, 'writeText').as('copy');
    // });
    
    cy.get('[data-testid="btn-copy"]').click();
    
    // TODO: Assert the stub was called with "AB-123"
    // cy.get('@copy').should(...)
  });
});`,
    missionBrief: {
      context: "Don't test the browser's clipboard implementation. Test that your app CALLED the clipboard API correctly.",
      objectives: [
        { id: 1, text: "Stub `navigator.clipboard.writeText`" },
        { id: 2, text: "Alias it as `copy`" },
        { id: 3, text: "Assert it was called with correct value" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasStub = /cy\.stub\([^,]+,\s*['"]writeText['"]\)/.test(code);
      const hasAlias = /\.as\(['"]copy['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasStub) {
        logs.push("✗ ERROR: Clipboard stub missing.");
        return { passed: false, logs };
      }

      if (!hasAlias) {
        logs.push("✗ ERROR: Alias for stub missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Clipboard API stubbed");
      return { passed: true, logs };
    }
  },
  {
    id: "keyboard",
    title: "Keyboard Shortcuts",
    description: "Simulate special key combinations like `Ctrl+K`.",
    difficulty: "Intermediate",
    icon: Terminal,
    initialCode: `describe('Power User Shortcuts', () => {
  it('should trigger shortcut', () => {
    cy.visit('/playground/interactions');
    
    // TODO: Type 'Ctrl+K' into the input
    // Syntax: .type('{ctrl}k')
    
    cy.get('[data-testid="input-keyboard"]').type('{ctrl}k');
    
    // Assert message appears
    cy.contains("Shortcut 'Ctrl+K' detected!").should('be.visible');
  });
});`,
    missionBrief: {
      context: "Use special character sequences like `{ctrl}`, `{shift}`, `{enter}` to simulate real keyboard use.",
      objectives: [
        { id: 1, text: "Use `.type('{ctrl}k')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasType = /\.type\(['"]\{ctrl\}k['"]\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasType) {
        logs.push("✗ ERROR: Keyboard shortcut missing.");
        logs.push("  ↳ Use .type('{ctrl}k')");
        return { passed: false, logs };
      }

      logs.push("✓ Keyboard event simulated");
      return { passed: true, logs };
    }
  },
  {
    id: "download",
    title: "File Downloads",
    description: "Verify file downloads without actually saving files.",
    difficulty: "Intermediate",
    icon: Download,
    initialCode: `describe('Export Data', () => {
  it('should trigger download', () => {
    cy.visit('/playground/data');
    
    // In Cypress, we verify the anchor tag attributes usually, 
    // or use a 'verifyDownload' plugin (not installed here).
    // For this lab, let's verify the button exists and is clickable.
    
    // Ideally, we intercept the request if it's an API call, 
    // or check the href if it's a link.
    
    cy.get('[data-testid="btn-export"]').click();
  });
});`,
    missionBrief: {
      context: "Native downloads are hard to verify in Cypress without plugins. We usually assert on the UI side effects or network calls.",
      objectives: [
        { id: 1, text: "Click export button" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClick = /\.click\(\)/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasClick) {
        logs.push("✗ ERROR: Export button not clicked.");
        return { passed: false, logs };
      }

      logs.push("✓ Download interaction verified");
      return { passed: true, logs };
    }
  },
  // ═══════════════════════════════════════════════════════════
  // Real-World KYC Scenarios
  // ═══════════════════════════════════════════════════════════
  {
    id: "kyc-onboarding",
    title: "KYC Onboarding Flow",
    description: "Test a multi-step KYC wizard from personal info to document upload.",
    difficulty: "Advanced",
    icon: Shield,
    initialCode: `describe('KYC Onboarding', () => {
  it('should complete the full KYC flow', () => {
    cy.visit('/playground/kyc');

    // Step 1: Personal Info
    // TODO: Fill in full name using data-testid="input-fullname"

    // TODO: Fill in date of birth using data-testid="input-dob"

    // TODO: Fill in phone using data-testid="input-phone"

    // TODO: Click "Next" button (data-testid="btn-next")

    // Step 2: Address
    // TODO: Fill in street using data-testid="input-street"

    // TODO: Fill in city using data-testid="input-city"

    // TODO: Select country from dropdown (data-testid="select-country")

    // TODO: Click "Next" again

    // Step 3: Document Upload (skip file for now)
    // TODO: Click "Next" to go to review

    // Step 4: Review & Submit
    // TODO: Click submit (data-testid="btn-submit-kyc")

    // TODO: Assert success message (data-testid="kyc-success")
    // cy.get('[data-testid="kyc-success"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "KYC (Know Your Customer) onboarding is a multi-step process common in fintech. You must navigate through each step, filling forms and asserting progress.",
      objectives: [
        { id: 1, text: "Fill personal info (fullname, dob, phone)" },
        { id: 2, text: "Navigate to address step and fill it" },
        { id: 3, text: "Select a country from the dropdown" },
        { id: 4, text: "Submit the KYC and assert success" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFullname = code.includes("input-fullname");
      const hasStreet = code.includes("input-street");
      const hasCountry = code.includes("select-country");
      const hasNext = code.includes("btn-next");
      const hasSubmit = code.includes("btn-submit-kyc");

      logs.push("✓ Test suite initialized");
      logs.push("✓ Visiting /playground/kyc");

      if (!hasFullname) {
        logs.push("✗ ERROR: Personal info not filled.");
        logs.push("  ↳ Use cy.get('[data-testid=\"input-fullname\"]')");
        return { passed: false, logs };
      }
      logs.push("✓ Step 1: Personal info filled");

      if (!hasStreet || !hasCountry) {
        logs.push("✗ ERROR: Address step incomplete.");
        logs.push("  ↳ Fill street and select country");
        return { passed: false, logs };
      }
      logs.push("✓ Step 2: Address filled");

      if (!hasNext) {
        logs.push("✗ ERROR: Navigation buttons not used.");
        return { passed: false, logs };
      }
      logs.push("✓ Step navigation working");

      if (!hasSubmit) {
        logs.push("✗ ERROR: KYC not submitted.");
        logs.push("  ↳ Click btn-submit-kyc on the review step");
        return { passed: false, logs };
      }
      logs.push("✓ KYC submitted successfully");

      return { passed: true, logs };
    }
  },
  {
    id: "otp-verification",
    title: "OTP Verification",
    description: "Test OTP input fields, auto-focus behavior, and resend countdown.",
    difficulty: "Intermediate",
    icon: Phone,
    initialCode: `describe('OTP Verification', () => {
  it('should verify OTP successfully', () => {
    cy.visit('/playground/kyc');

    // The OTP section has 4 digit inputs
    // Valid OTP is "1234"

    // TODO: Type '1' into the first OTP digit input
    // cy.get('[data-testid="otp-digit-1"]').type('1');

    // TODO: Type '2' into the second digit

    // TODO: Type '3' into the third digit

    // TODO: Type '4' into the fourth digit

    // TODO: Click the verify button (data-testid="btn-verify-otp")

    // TODO: Assert the success message is visible
    // data-testid="otp-success"
  });

  it('should show error for wrong OTP', () => {
    cy.visit('/playground/kyc');

    // TODO: Enter wrong OTP "0000"
    // TODO: Click verify
    // TODO: Assert error message (data-testid="otp-error")
  });
});`,
    missionBrief: {
      context: "OTP (One-Time Password) verification is standard in fintech apps. Each digit auto-focuses to the next input. Test both valid and invalid flows.",
      objectives: [
        { id: 1, text: "Fill all 4 OTP digits with '1234'" },
        { id: 2, text: "Click verify and assert success" },
        { id: 3, text: "Test invalid OTP and assert error" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasDigit1 = code.includes("otp-digit-1");
      const hasDigit4 = code.includes("otp-digit-4");
      const hasVerify = code.includes("btn-verify-otp");
      const hasSuccess = code.includes("otp-success");

      logs.push("✓ Test suite initialized");

      if (!hasDigit1 || !hasDigit4) {
        logs.push("✗ ERROR: Not all OTP digits filled.");
        logs.push("  ↳ Fill otp-digit-1 through otp-digit-4");
        return { passed: false, logs };
      }
      logs.push("✓ All OTP digits targeted");

      if (!hasVerify) {
        logs.push("✗ ERROR: Verify button not clicked.");
        return { passed: false, logs };
      }
      logs.push("✓ OTP submitted");

      if (!hasSuccess) {
        logs.push("✗ ERROR: Success assertion missing.");
        return { passed: false, logs };
      }
      logs.push("✓ OTP verification passed");

      return { passed: true, logs };
    }
  },
  {
    id: "video-kyc",
    title: "Video KYC Session",
    description: "Test a simulated Video KYC flow: start call, wait for agent, capture selfie.",
    difficulty: "Advanced",
    icon: Camera,
    initialCode: `describe('Video KYC', () => {
  it('should complete a video KYC session', () => {
    cy.visit('/playground/kyc');

    // The Video KYC card simulates a video call
    // Flow: Start → Connecting... → Agent Joined → Capture Selfie → Done

    // TODO: Click "Start Video KYC" (data-testid="btn-start-video")

    // TODO: Wait for "Agent Joined" text to appear
    // Hint: The status transitions through "Connecting..." first
    // cy.contains('Agent Joined').should('be.visible');

    // TODO: Click "Capture Selfie" (data-testid="btn-capture-selfie")

    // TODO: Assert selfie status shows captured (data-testid="selfie-status")

    // TODO: End the call (data-testid="btn-end-call")
  });
});`,
    missionBrief: {
      context: "Video KYC is a real-time identity verification process. The simulated flow has timed status transitions you must wait for correctly.",
      objectives: [
        { id: 1, text: "Start the video KYC call" },
        { id: 2, text: "Wait for 'Agent Joined' status" },
        { id: 3, text: "Capture a selfie" },
        { id: 4, text: "End the call" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasStart = code.includes("btn-start-video");
      const hasAgentWait = code.includes("Agent Joined");
      const hasCapture = code.includes("btn-capture-selfie");
      const hasSelfieStatus = code.includes("selfie-status");
      const hasEnd = code.includes("btn-end-call");

      logs.push("✓ Test suite initialized");

      if (!hasStart) {
        logs.push("✗ ERROR: Video call not started.");
        return { passed: false, logs };
      }
      logs.push("✓ Video call started");

      if (!hasAgentWait) {
        logs.push("✗ ERROR: Not waiting for agent to join.");
        logs.push("  ↳ Use cy.contains('Agent Joined')");
        return { passed: false, logs };
      }
      logs.push("✓ Waiting for agent status");

      if (!hasCapture) {
        logs.push("✗ ERROR: Selfie not captured.");
        return { passed: false, logs };
      }
      logs.push("✓ Selfie captured");

      if (!hasEnd) {
        logs.push("✗ ERROR: Call not ended.");
        return { passed: false, logs };
      }
      logs.push("✓ Video KYC session completed");

      return { passed: true, logs };
    }
  },
  {
    id: "iframe-communication",
    title: "iframe Widget Communication",
    description: "Test cross-frame communication using postMessage between parent and iframe.",
    difficulty: "Advanced",
    icon: MessageSquare,
    initialCode: `describe('iFrame Widget Communication', () => {
  it('should exchange data between parent and iframe widget', () => {
    cy.visit('/playground/kyc');

    // The KYC widget is inside an iframe (data-testid="kyc-widget-frame")
    // It communicates with the parent via postMessage

    // TODO: Access the iframe's body
    // cy.get('[data-testid="kyc-widget-frame"]')
    //   .its('0.contentDocument.body')
    //   .should('not.be.empty')
    //   .then(cy.wrap)

    // TODO: Inside the iframe, fill the name input (data-testid="widget-input-name")

    // TODO: Click "Send to Parent" (data-testid="widget-btn-send")

    // TODO: Back in parent, assert received data is visible
    // cy.get('[data-testid="received-data"]').should('contain', ...)
  });
});`,
    missionBrief: {
      context: "Many KYC solutions embed a third-party widget in an iframe that communicates via `postMessage`. In Cypress, access iframe content through `contentDocument.body`.",
      objectives: [
        { id: 1, text: "Access the iframe content document" },
        { id: 2, text: "Fill input inside the iframe" },
        { id: 3, text: "Trigger postMessage from iframe to parent" },
        { id: 4, text: "Assert parent received the data" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIframe = code.includes("kyc-widget-frame");
      const hasContentDoc = code.includes("contentDocument") || code.includes("contents()");
      const hasWidgetInput = code.includes("widget-input-name");
      const hasReceivedData = code.includes("received-data");

      logs.push("✓ Test suite initialized");

      if (!hasIframe) {
        logs.push("✗ ERROR: iframe not targeted.");
        return { passed: false, logs };
      }
      logs.push("✓ iframe element found");

      if (!hasContentDoc) {
        logs.push("✗ ERROR: iframe content not accessed.");
        logs.push("  ↳ Use .its('0.contentDocument.body') or .contents()");
        return { passed: false, logs };
      }
      logs.push("✓ iframe content accessed");

      if (!hasWidgetInput) {
        logs.push("✗ ERROR: Widget input not filled.");
        return { passed: false, logs };
      }
      logs.push("✓ Widget input interacted");

      if (!hasReceivedData) {
        logs.push("✗ ERROR: Parent received data not asserted.");
        return { passed: false, logs };
      }
      logs.push("✓ Cross-frame communication verified");

      return { passed: true, logs };
    }
  },
  {
    id: "doc-upload-status",
    title: "Document Upload & Status Polling",
    description: "Upload a document and poll for verification status changes.",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `describe('Document Upload', () => {
  it('should upload and verify document', () => {
    cy.visit('/playground/kyc');

    // Navigate to Step 3 of KYC (Document Upload)
    // First fill steps 1 & 2 or navigate directly

    // TODO: Attach a file to the upload input
    // cy.get('[data-testid="input-doc-upload"]').selectFile(...)
    // Hint: You can use cy.get(...).selectFile('cypress/fixtures/id-card.png')
    // Or create a fixture: selectFile({ contents: Cypress.Buffer.from('file'), fileName: 'id.png' })

    // TODO: Click the upload button (data-testid="btn-upload-doc")

    // TODO: Wait for status to change to "Verified"
    // The status goes: "Uploading..." → "Verifying..." → "Verified ✓"
    // cy.get('[data-testid="upload-status"]').should('contain', 'Verified');
  });
});`,
    missionBrief: {
      context: "Document upload in KYC involves async processing. The status transitions through multiple states. Use Cypress assertions to wait for the final state.",
      objectives: [
        { id: 1, text: "Attach a file using `selectFile`" },
        { id: 2, text: "Click the upload button" },
        { id: 3, text: "Wait for 'Verified' status" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFileInput = code.includes("input-doc-upload");
      const hasSelectFile = code.includes("selectFile");
      const hasStatus = code.includes("upload-status");
      const hasVerified = code.includes("Verified");

      logs.push("✓ Test suite initialized");

      if (!hasFileInput || !hasSelectFile) {
        logs.push("✗ ERROR: File not attached.");
        logs.push("  ↳ Use cy.get('[data-testid=\"input-doc-upload\"]').selectFile(...)");
        return { passed: false, logs };
      }
      logs.push("✓ File attached");

      if (!hasStatus || !hasVerified) {
        logs.push("✗ ERROR: Status polling missing.");
        logs.push("  ↳ Assert upload-status contains 'Verified'");
        return { passed: false, logs };
      }
      logs.push("✓ Document verified");

      return { passed: true, logs };
    }
  },
  {
    id: "consent-scroll",
    title: "Consent & Scroll Gating",
    description: "Scroll a terms box to the bottom to unlock a consent checkbox.",
    difficulty: "Intermediate",
    icon: ScrollText,
    initialCode: `describe('Terms & Consent', () => {
  it('should enable consent after scrolling to bottom', () => {
    cy.visit('/playground/kyc');

    // The terms box must be scrolled to the bottom before
    // the consent checkbox becomes enabled.

    // TODO: Scroll the terms box to the bottom
    // data-testid="terms-box"
    // Hint: Use .scrollTo('bottom') or set scrollTop via JS
    // cy.get('[data-testid="terms-box"]').scrollTo('bottom');

    // TODO: Check the consent checkbox (data-testid="checkbox-consent")
    // It should now be enabled after scrolling

    // TODO: Click accept button (data-testid="btn-accept-terms")

    // TODO: Assert consent recorded (data-testid="consent-success")
  });
});`,
    missionBrief: {
      context: "Many compliance flows require the user to scroll through terms before enabling the consent checkbox. Test the scroll-gating behavior.",
      objectives: [
        { id: 1, text: "Scroll the terms box to the bottom" },
        { id: 2, text: "Check the consent checkbox (now enabled)" },
        { id: 3, text: "Click accept and assert success" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasTermsBox = code.includes("terms-box");
      const hasScroll = code.includes("scrollTo") || code.includes("scrollTop") || code.includes("scroll");
      const hasCheckbox = code.includes("checkbox-consent");
      const hasAccept = code.includes("btn-accept-terms");

      logs.push("✓ Test suite initialized");

      if (!hasTermsBox || !hasScroll) {
        logs.push("✗ ERROR: Terms box not scrolled.");
        logs.push("  ↳ Use .scrollTo('bottom') on the terms box");
        return { passed: false, logs };
      }
      logs.push("✓ Terms scrolled to bottom");

      if (!hasCheckbox) {
        logs.push("✗ ERROR: Consent checkbox not checked.");
        return { passed: false, logs };
      }
      logs.push("✓ Consent checkbox checked");

      if (!hasAccept) {
        logs.push("✗ ERROR: Accept button not clicked.");
        return { passed: false, logs };
      }
      logs.push("✓ Consent recorded");

      return { passed: true, logs };
    }
  },
  // ═══════════════════════════════════════════════════════════
  // Architecture & Patterns
  // ═══════════════════════════════════════════════════════════
  {
    id: "page-object-model",
    title: "Page Object Model",
    description: "Refactor raw selectors into a structured Page Object class.",
    difficulty: "Advanced",
    icon: Workflow,
    initialCode: `// Page Object Model - Cypress Style
// In Cypress, POM is typically a plain class (no Cypress commands in constructor)

// TODO: Create a LoginPage class above the describe block
// class LoginPage {
//   visit() { ... }
//   fillUsername(name) { ... }
//   fillPassword(pass) { ... }
//   submit() { ... }
//   getSuccessMessage() { ... }
// }

describe('Login with Page Object', () => {
  it('should login using page object', () => {
    // Raw selectors — refactor these into the LoginPage class
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();
    cy.get('[data-testid="alert-success"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Page Object Model (POM) encapsulates page selectors and actions into reusable classes. This reduces duplication and makes tests resilient to UI changes.",
      objectives: [
        { id: 1, text: "Create a `LoginPage` class" },
        { id: 2, text: "Add methods: `visit()`, `fillUsername()`, `fillPassword()`, `submit()`" },
        { id: 3, text: "Use the page object in the test instead of raw selectors" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClass = /class\s+LoginPage/.test(code);
      const hasVisitMethod = /visit\s*\(/.test(code);
      const hasUsernameMethod = /fillUsername|typeUsername|enterUsername/.test(code);
      const hasSubmitMethod = /submit\s*\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasClass) {
        logs.push("✗ ERROR: LoginPage class not found.");
        logs.push("  ↳ Create: class LoginPage { ... }");
        return { passed: false, logs };
      }
      logs.push("✓ LoginPage class defined");

      if (!hasVisitMethod || !hasUsernameMethod || !hasSubmitMethod) {
        logs.push("✗ ERROR: Page object methods incomplete.");
        logs.push("  ↳ Need visit(), fillUsername(), submit() at minimum");
        return { passed: false, logs };
      }
      logs.push("✓ Page object methods defined");
      logs.push("✓ POM pattern implemented");

      return { passed: true, logs };
    }
  },
  {
    id: "custom-commands-advanced",
    title: "Reusable Custom Commands",
    description: "Build a cy.login() custom command to avoid repeating auth logic.",
    difficulty: "Advanced",
    icon: Wrench,
    initialCode: `// Custom Commands allow you to extend Cypress with reusable logic.

// TODO: Register a custom command 'login' that takes username and password
// Cypress.Commands.add('login', (username, password) => {
//   cy.visit('/playground/auth');
//   cy.get('[data-testid="input-username"]').type(username);
//   cy.get('[data-testid="input-password"]').type(password);
//   cy.get('[data-testid="btn-login"]').click();
// });

describe('Using Custom Commands', () => {
  it('should login with custom command', () => {
    // TODO: Replace the manual steps below with cy.login('admin', 'password123')
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();

    cy.get('[data-testid="alert-success"]').should('be.visible');
  });

  it('should also use the custom command', () => {
    // TODO: Use cy.login() here too
  });
});`,
    missionBrief: {
      context: "Custom commands DRY up repetitive test logic. `Cypress.Commands.add` registers new commands available as `cy.<name>()`.",
      objectives: [
        { id: 1, text: "Register a `login` custom command with `Cypress.Commands.add`" },
        { id: 2, text: "Use `cy.login()` in both test cases" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasCommandsAdd = /Cypress\.Commands\.add\(['"]login['"]/.test(code);
      const hasUsage = /cy\.login\(/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasCommandsAdd) {
        logs.push("✗ ERROR: Custom command not registered.");
        logs.push("  ↳ Use Cypress.Commands.add('login', ...)");
        return { passed: false, logs };
      }
      logs.push("✓ Custom command 'login' registered");

      if (!hasUsage) {
        logs.push("✗ ERROR: Custom command not used in tests.");
        logs.push("  ↳ Use cy.login('admin', 'password123')");
        return { passed: false, logs };
      }
      logs.push("✓ Custom command used in tests");

      return { passed: true, logs };
    }
  },
  {
    id: "data-driven",
    title: "Data-Driven Tests",
    description: "Run the same test with multiple data sets using array iteration.",
    difficulty: "Intermediate",
    icon: Database,
    initialCode: `describe('Data-Driven Login Tests', () => {
  // Currently testing only one credential set.
  // TODO: Create an array of test cases with different credentials and expected outcomes.
  // const testCases = [
  //   { user: 'admin', pass: 'password123', shouldPass: true },
  //   { user: 'wrong', pass: 'wrong', shouldPass: false },
  //   { user: '', pass: '', shouldPass: false },
  // ];

  // TODO: Iterate over testCases using forEach or for...of
  // testCases.forEach(({ user, pass, shouldPass }) => {
  //   it(\`should \${shouldPass ? 'succeed' : 'fail'} for \${user || 'empty'}\`, () => { ... });
  // });

  it('should login with admin', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();
    cy.get('[data-testid="alert-success"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Data-driven tests run the same logic across multiple inputs. This catches edge cases without duplicating test code.",
      objectives: [
        { id: 1, text: "Create a `testCases` array with at least 3 entries" },
        { id: 2, text: "Iterate with `forEach` to generate dynamic test names" },
        { id: 3, text: "Assert both success and failure scenarios" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasArray = /\[\s*\{/.test(code) && code.includes("testCases") || /const\s+\w+\s*=\s*\[/.test(code);
      const hasLoop = code.includes("forEach") || code.includes("for (") || code.includes("for(");
      const hasMultipleCreds = code.includes("admin") && (code.includes("wrong") || code.includes("invalid") || code.includes("empty"));

      logs.push("✓ Test suite initialized");

      if (!hasArray) {
        logs.push("✗ ERROR: Test data array not found.");
        logs.push("  ↳ Create: const testCases = [{ ... }, { ... }]");
        return { passed: false, logs };
      }
      logs.push("✓ Test data array defined");

      if (!hasLoop) {
        logs.push("✗ ERROR: No iteration over test cases.");
        logs.push("  ↳ Use testCases.forEach(...)");
        return { passed: false, logs };
      }
      logs.push("✓ Iterating over test cases");

      if (!hasMultipleCreds) {
        logs.push("⚠ WARN: Only one credential set found. Add failure cases too.");
      }
      logs.push("✓ Data-driven pattern implemented");

      return { passed: true, logs };
    }
  },
  {
    id: "accessibility-audit",
    title: "Accessibility (a11y) Audit",
    description: "Use cypress-axe to audit pages for accessibility violations.",
    difficulty: "Intermediate",
    icon: Accessibility,
    initialCode: `describe('Accessibility', () => {
  it('should have no a11y violations on the auth page', () => {
    cy.visit('/playground/auth');

    // TODO: Inject axe-core into the page
    // cy.injectAxe();

    // TODO: Run the accessibility check
    // cy.checkA11y();

    // For more granular checks:
    // cy.checkA11y('#login-form');
    // cy.checkA11y(null, { rules: { 'color-contrast': { enabled: false } } });
  });

  it('should check KYC form accessibility', () => {
    cy.visit('/playground/kyc');

    // TODO: Inject and check a11y on the KYC wizard
  });
});`,
    missionBrief: {
      context: "Accessibility testing ensures your app is usable by everyone. `cypress-axe` wraps the axe-core engine to audit pages for WCAG violations.",
      objectives: [
        { id: 1, text: "Inject axe with `cy.injectAxe()`" },
        { id: 2, text: "Run audit with `cy.checkA11y()`" },
        { id: 3, text: "Test multiple pages" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasInject = code.includes("injectAxe");
      const hasCheck = code.includes("checkA11y");

      logs.push("✓ Test suite initialized");

      if (!hasInject) {
        logs.push("✗ ERROR: axe not injected.");
        logs.push("  ↳ Use cy.injectAxe()");
        return { passed: false, logs };
      }
      logs.push("✓ axe-core injected");

      if (!hasCheck) {
        logs.push("✗ ERROR: a11y check not run.");
        logs.push("  ↳ Use cy.checkA11y()");
        return { passed: false, logs };
      }
      logs.push("✓ Accessibility audit passed");

      return { passed: true, logs };
    }
  },
  {
    id: "api-request-validation",
    title: "API Request Validation",
    description: "Intercept API requests and validate payloads and headers.",
    difficulty: "Advanced",
    icon: Network,
    initialCode: `describe('API Request Validation', () => {
  it('should validate the login request payload', () => {
    cy.visit('/playground/auth');

    // TODO: Intercept the login API call
    // cy.intercept('POST', '/api/login').as('loginRequest');

    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();

    // TODO: Wait for the intercepted request and validate its body
    // cy.wait('@loginRequest').then((interception) => {
    //   expect(interception.request.body).to.have.property('username', 'admin');
    //   expect(interception.request.headers).to.have.property('content-type');
    // });
  });
});`,
    missionBrief: {
      context: "API request validation ensures the frontend sends correct data. Use `cy.intercept` to capture requests and inspect their bodies and headers.",
      objectives: [
        { id: 1, text: "Intercept a POST request with `cy.intercept`" },
        { id: 2, text: "Use `.as()` to alias the intercept" },
        { id: 3, text: "Use `cy.wait('@alias')` to validate the request body" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = /cy\.intercept\(/.test(code);
      const hasAlias = /\.as\(/.test(code);
      const hasWait = /cy\.wait\(['"]@/.test(code);
      const hasBody = code.includes("request.body") || code.includes("request.headers");

      logs.push("✓ Test suite initialized");

      if (!hasIntercept) {
        logs.push("✗ ERROR: No intercept defined.");
        return { passed: false, logs };
      }
      logs.push("✓ Request intercepted");

      if (!hasAlias || !hasWait) {
        logs.push("✗ ERROR: Intercept not aliased or waited on.");
        logs.push("  ↳ Use .as('alias') then cy.wait('@alias')");
        return { passed: false, logs };
      }
      logs.push("✓ Intercept aliased and awaited");

      if (!hasBody) {
        logs.push("✗ ERROR: Request body/headers not validated.");
        return { passed: false, logs };
      }
      logs.push("✓ Request payload validated");

      return { passed: true, logs };
    }
  },
  {
    id: "test-tags",
    title: "Tagging & Filtering Tests",
    description: "Organize tests with tags like @smoke, @regression for selective execution.",
    difficulty: "Beginner",
    icon: Tag,
    initialCode: `// In Cypress, tags are added to test titles as conventions.
// Use --spec or grep plugin to filter at runtime.
// Example: cypress run --env grepTags="@smoke"

describe('Authentication', () => {
  // TODO: Add @smoke tag to this critical test
  it('should login with valid credentials', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').type('admin');
    cy.get('[data-testid="input-password"]').type('password123');
    cy.get('[data-testid="btn-login"]').click();
  });

  // TODO: Add @regression tag to this edge-case test
  it('should show error for empty fields', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="btn-login"]').click();
  });

  // TODO: Add both @smoke and @regression tags
  it('should show login form on page load', () => {
    cy.visit('/playground/auth');
    cy.get('[data-testid="input-username"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Tags let you run subsets of tests (smoke tests in CI, full regression nightly). The convention is to add `@tag` in the test title string.",
      objectives: [
        { id: 1, text: "Add `@smoke` tag to the login test" },
        { id: 2, text: "Add `@regression` tag to the edge-case test" },
        { id: 3, text: "Add both tags to the third test" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSmoke = code.includes("@smoke");
      const hasRegression = code.includes("@regression");

      logs.push("✓ Test suite initialized");

      if (!hasSmoke) {
        logs.push("✗ ERROR: @smoke tag not found.");
        logs.push("  ↳ Add @smoke to test titles: it('@smoke should ...')");
        return { passed: false, logs };
      }
      logs.push("✓ @smoke tag applied");

      if (!hasRegression) {
        logs.push("✗ ERROR: @regression tag not found.");
        return { passed: false, logs };
      }
      logs.push("✓ @regression tag applied");
      logs.push("✓ Tests tagged for selective execution");

      return { passed: true, logs };
    }
  },
  {
    id: "retry-strategy",
    title: "Retry & Flaky Test Strategy",
    description: "Configure test retries to handle intermittent failures gracefully.",
    difficulty: "Intermediate",
    icon: Repeat,
    initialCode: `// Cypress supports retries at the test or suite level.

describe('Flaky Network Test', {
  // TODO: Add retries configuration here
  // retries: { runMode: 2, openMode: 1 }
}, () => {
  it('should handle intermittent API failures', () => {
    cy.visit('/playground/api');

    // This test sometimes fails due to network timing
    cy.get('[data-testid="btn-get-users"]').click();
    cy.get('[data-testid="user-row-1"]').should('be.visible');
  });
});

// TODO: You can also configure retries globally in cypress.config.js
// module.exports = defineConfig({
//   retries: { runMode: 2, openMode: 0 }
// });`,
    missionBrief: {
      context: "Flaky tests waste CI time. Cypress retries re-run failed tests automatically. Configure wisely — retries mask real bugs if overused.",
      objectives: [
        { id: 1, text: "Add `retries` config to the describe block" },
        { id: 2, text: "Set `runMode: 2` for CI and `openMode: 1` for local" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRetries = code.includes("retries");
      const hasRunMode = code.includes("runMode");

      logs.push("✓ Test suite initialized");

      if (!hasRetries) {
        logs.push("✗ ERROR: Retry configuration missing.");
        logs.push("  ↳ Add retries: { runMode: 2, openMode: 1 }");
        return { passed: false, logs };
      }
      logs.push("✓ Retries configured");

      if (!hasRunMode) {
        logs.push("⚠ WARN: Consider separate runMode/openMode values.");
      }
      logs.push("✓ Retry strategy implemented");

      return { passed: true, logs };
    }
  },
  {
    id: "ci-cd",
    title: "CI/CD Integration",
    description: "Write a GitHub Actions workflow to run Cypress tests in CI.",
    difficulty: "Intermediate",
    icon: GitBranch,
    initialCode: `# .github/workflows/cypress.yml
# TODO: Complete this GitHub Actions workflow

name: Cypress Tests
on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # TODO: Add Node.js setup step
      # - name: Setup Node
      #   uses: actions/setup-node@v4

      # TODO: Install dependencies
      # - name: Install
      #   run: npm ci

      # TODO: Run Cypress tests
      # - name: Cypress run
      #   uses: cypress-io/github-action@v6
      #   with:
      #     start: npm start
      #     wait-on: 'http://localhost:5173'

      # TODO: Upload screenshots on failure
      # - name: Upload Artifacts
      #   uses: actions/upload-artifact@v4
      #   if: failure()
      #   with:
      #     name: cypress-screenshots
      #     path: cypress/screenshots`,
    missionBrief: {
      context: "CI/CD integration ensures tests run on every push. GitHub Actions with `cypress-io/github-action` is the standard approach.",
      objectives: [
        { id: 1, text: "Set up Node.js in the workflow" },
        { id: 2, text: "Run Cypress using the official GitHub Action" },
        { id: 3, text: "Upload screenshots as artifacts on failure" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasNodeSetup = code.includes("setup-node") || code.includes("npm ci") || code.includes("npm install");
      const hasCypressAction = code.includes("cypress-io/github-action") || code.includes("npx cypress run");
      const hasArtifact = code.includes("upload-artifact") || code.includes("artifact");

      logs.push("✓ Workflow initialized");

      if (!hasNodeSetup) {
        logs.push("✗ ERROR: Node.js setup missing.");
        return { passed: false, logs };
      }
      logs.push("✓ Node.js configured");

      if (!hasCypressAction) {
        logs.push("✗ ERROR: Cypress run step missing.");
        logs.push("  ↳ Use cypress-io/github-action@v6 or npx cypress run");
        return { passed: false, logs };
      }
      logs.push("✓ Cypress test step configured");

      if (!hasArtifact) {
        logs.push("⚠ WARN: No artifact upload for failure screenshots.");
      }
      logs.push("✓ CI/CD pipeline configured");

      return { passed: true, logs };
    }
  },
  {
    id: "reporters",
    title: "Reporter Configuration",
    description: "Configure mochawesome and JUnit reporters for test results.",
    difficulty: "Beginner",
    icon: BarChart3,
    initialCode: `// cypress.config.js — Reporter Configuration
// Cypress uses Mocha reporters by default.

// TODO: Configure the reporter in your cypress.config.js
// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   reporter: 'mochawesome',
//   reporterOptions: {
//     reportDir: 'cypress/reports',
//     overwrite: false,
//     html: true,
//     json: true,
//   },
//   e2e: {
//     baseUrl: 'http://localhost:5173',
//   }
// });

// For CI, you might want JUnit format:
// reporter: 'junit'
// reporterOptions: { mochaFile: 'results/output-[hash].xml' }`,
    missionBrief: {
      context: "Reporters format test output for humans (HTML) or machines (JUnit XML for CI). Configure them in `cypress.config.js`.",
      objectives: [
        { id: 1, text: "Set `reporter` to 'mochawesome'" },
        { id: 2, text: "Configure `reporterOptions` with HTML and JSON output" },
        { id: 3, text: "Add JUnit configuration as an alternative" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasReporter = code.includes("reporter");
      const hasHtml = code.includes("html") || code.includes("mochawesome");
      const hasJunit = code.includes("junit") || code.includes("JUnit") || code.includes("json");

      logs.push("✓ Config initialized");

      if (!hasReporter) {
        logs.push("✗ ERROR: reporter not configured.");
        return { passed: false, logs };
      }
      logs.push("✓ Reporter set");

      if (!hasHtml) {
        logs.push("✗ ERROR: HTML/mochawesome reporter missing.");
        return { passed: false, logs };
      }
      logs.push("✓ HTML reports configured");

      if (!hasJunit) {
        logs.push("⚠ WARN: Consider adding JUnit for CI.");
      }
      logs.push("✓ Reporter configuration complete");

      return { passed: true, logs };
    }
  },
  {
    id: "alerts-dialogs",
    title: "Alerts & Dialogs",
    description: "Handle native browser alerts, confirms, and prompts in Cypress.",
    difficulty: "Intermediate",
    icon: AlertTriangle,
    initialCode: `describe('Native Dialogs', () => {
  it('should handle alert', () => {
    cy.visit('/playground/interactions');

    // Cypress auto-accepts alerts. To assert on them:
    // TODO: Listen for the window:alert event
    // cy.on('window:alert', (text) => {
    //   expect(text).to.equal('This is a native browser alert!');
    // });

    // TODO: Click the alert trigger button (data-testid="btn-alert")
  });

  it('should handle confirm dialog', () => {
    cy.visit('/playground/interactions');

    // TODO: Stub window.confirm to return true
    // cy.on('window:confirm', () => true);

    // TODO: Click the confirm trigger (data-testid="btn-confirm")
  });
});`,
    missionBrief: {
      context: "Cypress automatically closes native dialogs. Use `cy.on('window:alert')` and `cy.on('window:confirm')` to intercept and control them.",
      objectives: [
        { id: 1, text: "Listen for `window:alert` and assert its text" },
        { id: 2, text: "Stub `window:confirm` to return true or false" },
        { id: 3, text: "Click trigger buttons for both dialogs" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasAlertListener = code.includes("window:alert");
      const hasConfirmListener = code.includes("window:confirm");
      const hasAlertBtn = code.includes("btn-alert");
      const hasConfirmBtn = code.includes("btn-confirm");

      logs.push("✓ Test suite initialized");

      if (!hasAlertListener) {
        logs.push("✗ ERROR: Alert listener missing.");
        logs.push("  ↳ Use cy.on('window:alert', ...)");
        return { passed: false, logs };
      }
      logs.push("✓ Alert listener registered");

      if (!hasConfirmListener) {
        logs.push("✗ ERROR: Confirm listener missing.");
        return { passed: false, logs };
      }
      logs.push("✓ Confirm handler registered");

      if (!hasAlertBtn || !hasConfirmBtn) {
        logs.push("✗ ERROR: Dialog trigger buttons not clicked.");
        return { passed: false, logs };
      }
      logs.push("✓ Native dialogs handled");

      return { passed: true, logs };
    }
  },
  {
    id: "multiple-tabs",
    title: "Multiple Tabs & Windows",
    description: "Handle links that open in new tabs using Cypress workarounds.",
    difficulty: "Advanced",
    icon: Layers,
    initialCode: `describe('Multiple Tabs', () => {
  it('should handle target=_blank links', () => {
    cy.visit('/playground/interactions');

    // Cypress runs in a single tab — it can't switch tabs.
    // Workaround: Remove the target attribute before clicking.

    // TODO: Find a link with target="_blank" and remove the attribute
    // cy.get('a[target="_blank"]')
    //   .invoke('removeAttr', 'target')
    //   .click();

    // TODO: Assert the navigation happened in the same tab
    // cy.url().should('include', '/some-path');

    // Alternative: Just verify the href
    // cy.get('a[target="_blank"]')
    //   .should('have.attr', 'href')
    //   .and('include', 'expected-url');
  });
});`,
    missionBrief: {
      context: "Cypress runs inside a single browser tab. For links with `target=\"_blank\"`, remove the attribute before clicking or assert the `href` directly.",
      objectives: [
        { id: 1, text: "Use `invoke('removeAttr', 'target')` to prevent new tab" },
        { id: 2, text: "Click the link and verify navigation" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRemoveAttr = code.includes("removeAttr") || code.includes("have.attr");
      const hasTarget = code.includes("target") || code.includes("_blank");

      logs.push("✓ Test suite initialized");

      if (!hasTarget) {
        logs.push("✗ ERROR: Not handling target=\"_blank\" links.");
        return { passed: false, logs };
      }

      if (!hasRemoveAttr) {
        logs.push("✗ ERROR: Attribute not removed or asserted.");
        logs.push("  ↳ Use .invoke('removeAttr', 'target') or .should('have.attr', 'href')");
        return { passed: false, logs };
      }
      logs.push("✓ Multi-tab workaround implemented");

      return { passed: true, logs };
    }
  },
  {
    id: "visual-regression",
    title: "Visual Regression",
    description: "Compare screenshots to detect unintended visual changes.",
    difficulty: "Advanced",
    icon: Eye,
    initialCode: `describe('Visual Regression', () => {
  it('should match login page snapshot', () => {
    cy.visit('/playground/auth');

    // Visual regression uses plugins like cypress-image-snapshot
    // or Percy for cloud-based comparison.

    // TODO: Take a snapshot of the full page
    // cy.matchImageSnapshot('auth-page');

    // TODO: Take a snapshot of a specific element
    // cy.get('[data-testid="login-form"]').matchImageSnapshot('login-form');

    // For this exercise, uncomment the matchImageSnapshot calls.
    // In a real project, run: npm install --save-dev cypress-image-snapshot
  });
});`,
    missionBrief: {
      context: "Visual regression testing compares screenshots against baselines. First run creates baselines; subsequent runs detect pixel differences.",
      objectives: [
        { id: 1, text: "Use `matchImageSnapshot` for full page" },
        { id: 2, text: "Use `matchImageSnapshot` for a specific element" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSnapshot = code.includes("matchImageSnapshot") || code.includes("imageSnapshot");

      logs.push("✓ Test suite initialized");

      if (!hasSnapshot) {
        logs.push("✗ ERROR: Image snapshot not taken.");
        logs.push("  ↳ Use .matchImageSnapshot('name')");
        return { passed: false, logs };
      }
      logs.push("✓ Visual regression configured");

      return { passed: true, logs };
    }
  },
  {
    id: "websocket-testing",
    title: "WebSocket Testing",
    description: "Intercept and test WebSocket connections in Cypress.",
    difficulty: "Advanced",
    icon: Network,
    initialCode: `describe('WebSocket', () => {
  it('should verify WebSocket messages', () => {
    // Cypress doesn't natively support WebSocket interception.
    // Use cy.intercept for HTTP fallbacks, or spy on the WebSocket constructor.

    // TODO: Spy on the WebSocket constructor
    // cy.visit('/playground/api', {
    //   onBeforeLoad(win) {
    //     cy.stub(win, 'WebSocket').as('ws');
    //   }
    // });

    // TODO: Assert WebSocket was called with the expected URL
    // cy.get('@ws').should('have.been.calledWith', 'ws://...');

    // Alternative: intercept the HTTP upgrade
    // cy.intercept('GET', '/ws/*', (req) => { ... });
  });
});`,
    missionBrief: {
      context: "WebSocket testing in Cypress requires stubbing the WebSocket constructor or intercepting the upgrade request. There's no built-in WebSocket API.",
      objectives: [
        { id: 1, text: "Stub `WebSocket` in `onBeforeLoad`" },
        { id: 2, text: "Assert WebSocket connection URL" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWebSocket = /WebSocket/i.test(code);
      const hasStub = code.includes("stub") || code.includes("intercept");

      logs.push("✓ Test suite initialized");

      if (!hasWebSocket) {
        logs.push("✗ ERROR: WebSocket not referenced.");
        return { passed: false, logs };
      }

      if (!hasStub) {
        logs.push("✗ ERROR: WebSocket not stubbed or intercepted.");
        logs.push("  ↳ Use cy.stub(win, 'WebSocket') in onBeforeLoad");
        return { passed: false, logs };
      }
      logs.push("✓ WebSocket testing configured");

      return { passed: true, logs };
    }
  },
  {
    id: "performance-testing",
    title: "Performance Assertions",
    description: "Measure page load time and assert performance thresholds.",
    difficulty: "Advanced",
    icon: Gauge,
    initialCode: `describe('Performance', () => {
  it('should load auth page within 3 seconds', () => {
    // TODO: Use the Performance API to measure load time

    cy.visit('/playground/auth');

    // TODO: Access window.performance.timing
    // cy.window().then((win) => {
    //   const loadTime = win.performance.timing.loadEventEnd
    //                   - win.performance.timing.navigationStart;
    //   expect(loadTime).to.be.lessThan(3000);
    // });

    // Modern approach with PerformanceObserver:
    // cy.window().its('performance').invoke('getEntriesByType', 'navigation')
    //   .then((entries) => {
    //     expect(entries[0].loadEventEnd).to.be.lessThan(3000);
    //   });
  });
});`,
    missionBrief: {
      context: "Performance testing ensures pages load within acceptable thresholds. Use the browser's Performance API via `cy.window()`.",
      objectives: [
        { id: 1, text: "Access `window.performance` via cy.window()" },
        { id: 2, text: "Calculate load time from timing data" },
        { id: 3, text: "Assert load time is under threshold" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPerformance = code.includes("performance");
      const hasThreshold = /lessThan|below|lt\(|< \d+/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasPerformance) {
        logs.push("✗ ERROR: Performance API not used.");
        logs.push("  ↳ Use cy.window().its('performance')");
        return { passed: false, logs };
      }
      logs.push("✓ Performance API accessed");

      if (!hasThreshold) {
        logs.push("✗ ERROR: No performance threshold asserted.");
        logs.push("  ↳ Use expect(loadTime).to.be.lessThan(3000)");
        return { passed: false, logs };
      }
      logs.push("✓ Performance threshold asserted");

      return { passed: true, logs };
    }
  },
  {
    id: "component-testing",
    title: "Component Testing",
    description: "Test individual React components in isolation with Cypress CT.",
    difficulty: "Advanced",
    icon: Box,
    initialCode: `// Cypress Component Testing (CT) lets you test components in isolation.
// Run with: npx cypress open --component

// TODO: Import the component to test
// import LoginForm from '../../src/components/LoginForm';

describe('LoginForm Component', () => {
  it('should render the login form', () => {
    // TODO: Mount the component
    // cy.mount(<LoginForm />);

    // TODO: Assert the form elements exist
    // cy.get('[data-testid="input-username"]').should('be.visible');
    // cy.get('[data-testid="input-password"]').should('be.visible');
    // cy.get('[data-testid="btn-login"]').should('be.visible');
  });

  it('should call onSubmit with credentials', () => {
    // TODO: Mount with a spy callback
    // const onSubmit = cy.spy().as('submitSpy');
    // cy.mount(<LoginForm onSubmit={onSubmit} />);

    // TODO: Fill and submit, then assert spy was called
  });
});`,
    missionBrief: {
      context: "Component Testing (CT) renders components without a full app. Use `cy.mount()` to render and `cy.spy()` to verify callbacks.",
      objectives: [
        { id: 1, text: "Import and mount a React component" },
        { id: 2, text: "Assert rendered elements" },
        { id: 3, text: "Use `cy.spy()` to verify callback invocation" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasMount = code.includes("cy.mount") || code.includes("mount(");
      const hasSpy = code.includes("cy.spy") || code.includes("spy()");
      const hasImport = code.includes("import") && (code.includes("Component") || code.includes("Form") || code.includes("from"));

      logs.push("✓ Component test initialized");

      if (!hasMount) {
        logs.push("✗ ERROR: Component not mounted.");
        logs.push("  ↳ Use cy.mount(<Component />)");
        return { passed: false, logs };
      }
      logs.push("✓ Component mounted");

      if (!hasSpy) {
        logs.push("⚠ WARN: No spy for callback verification.");
      }
      logs.push("✓ Component testing configured");

      return { passed: true, logs };
    }
  },
  {
    id: "cross-browser",
    title: "Cross-Browser Testing",
    description: "Configure Cypress to run tests across Chrome, Firefox, and Edge.",
    difficulty: "Intermediate",
    icon: Globe,
    initialCode: `// Cypress supports Chrome, Firefox, Edge, and Electron.
// Run with: npx cypress run --browser firefox

// cypress.config.js
// const { defineConfig } = require('cypress');

// TODO: Configure browser-specific settings
// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:5173',
//   }
// });

// TODO: In your CI config, add matrix strategy for browsers:
// strategy:
//   matrix:
//     browser: [chrome, firefox, edge]
// steps:
//   - run: npx cypress run --browser \${{ matrix.browser }}

describe('Cross-Browser Smoke Test', () => {
  it('should work across browsers', () => {
    cy.visit('/playground/auth');

    // TODO: Log the current browser name
    // Cypress.browser.name will give 'chrome', 'firefox', etc.
    cy.log('Browser: ' + Cypress.browser.name);

    // TODO: Add browser-specific conditional logic
    // if (Cypress.browser.name === 'firefox') {
    //   // Firefox-specific assertion
    // }

    cy.get('[data-testid="input-username"]').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Cross-browser testing ensures your app works consistently across Chrome, Firefox, and Edge. Cypress provides `Cypress.browser` for browser-specific logic.",
      objectives: [
        { id: 1, text: "Log `Cypress.browser.name` in the test" },
        { id: 2, text: "Add browser-specific conditional logic" },
        { id: 3, text: "Understand `--browser` CLI flag" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasBrowserRef = code.includes("Cypress.browser");
      const hasBrowserName = code.includes("browser.name") || code.includes("firefox") || code.includes("chrome");

      logs.push("✓ Test suite initialized");

      if (!hasBrowserRef) {
        logs.push("✗ ERROR: Cypress.browser not referenced.");
        return { passed: false, logs };
      }
      logs.push("✓ Browser detection used");

      if (!hasBrowserName) {
        logs.push("⚠ WARN: No browser-specific logic found.");
      }
      logs.push("✓ Cross-browser testing configured");

      return { passed: true, logs };
    }
  },
  {
    id: "geolocation",
    title: "Geolocation Mocking",
    description: "Learn to stub browser geolocation APIs to test location-aware features without real GPS.",
    difficulty: "Advanced",
    icon: MapPin,
    initialCode: `describe('Geolocation Mocking', () => {
  it('should mock the browser geolocation API', () => {
    const mockPosition = {
      coords: {
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 100
      }
    };

    cy.visit('/playground/auth');

    // TODO: Use cy.window() to access navigator.geolocation
    // TODO: Stub navigator.geolocation.getCurrentPosition using cy.stub()
    // TODO: Make the stub call the success callback with mockPosition
    // TODO: Trigger the app to request geolocation
    // TODO: Assert the app displays the mocked coordinates (Bangalore)
  });
});`,
    missionBrief: {
      context: "Location-aware apps rely on `navigator.geolocation`. In tests, we stub this API to provide deterministic coordinates (Bangalore: 12.9716, 77.5946) without requiring real GPS.",
      objectives: [
        { id: 1, text: "Stub navigator.geolocation.getCurrentPosition using cy.stub()" },
        { id: 2, text: "Provide mock coordinates (latitude: 12.9716, longitude: 77.5946)" },
        { id: 3, text: "Assert the application displays the mocked location" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasGeolocation = code.includes("geolocation");
      const hasStub = code.includes("stub") || code.includes("stub(");
      const hasCoords = code.includes("latitude") || code.includes("12.9716");

      logs.push("✓ Test suite initialized");

      if (!hasGeolocation) {
        logs.push("✗ ERROR: No reference to geolocation found.");
        return { passed: false, logs };
      }
      logs.push("✓ Geolocation API referenced");

      if (!hasStub) {
        logs.push("✗ ERROR: Must use cy.stub() to mock geolocation.");
        return { passed: false, logs };
      }
      logs.push("✓ Stub used for mocking");

      if (!hasCoords) {
        logs.push("✗ ERROR: Mock coordinates not found. Use latitude: 12.9716.");
        return { passed: false, logs };
      }
      logs.push("✓ Mock coordinates provided");

      return { passed: true, logs };
    }
  },
  {
    id: "emulation",
    title: "Mobile Emulation",
    description: "Test responsive layouts by emulating different device viewports in Cypress.",
    difficulty: "Intermediate",
    icon: Smartphone,
    initialCode: `describe('Mobile Emulation', () => {
  beforeEach(() => {
    cy.visit('/playground/auth');
  });

  it('should render correctly on mobile', () => {
    // TODO: Use cy.viewport('iphone-x') to emulate an iPhone X
    // TODO: Assert that mobile-specific elements are visible
    // TODO: Check that the layout adapts (e.g., navigation collapses)
  });

  it('should render correctly on desktop', () => {
    // TODO: Use cy.viewport('macbook-15') to emulate a MacBook
    // TODO: Assert desktop layout elements are visible
    // TODO: Compare behavior differences between mobile and desktop
  });
});`,
    missionBrief: {
      context: "Responsive design must be tested at multiple breakpoints. Cypress provides `cy.viewport()` with named device presets like `iphone-x` and `macbook-15` to simulate real device dimensions.",
      objectives: [
        { id: 1, text: "Use cy.viewport() with a mobile device preset (e.g., 'iphone-x')" },
        { id: 2, text: "Use cy.viewport() with a desktop preset (e.g., 'macbook-15')" },
        { id: 3, text: "Assert that element visibility changes across viewports" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasViewport = code.includes("cy.viewport(");
      const hasDevice = /iphone|macbook|\d{3,4}\s*,\s*\d{3,4}/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasViewport) {
        logs.push("✗ ERROR: cy.viewport() not found.");
        return { passed: false, logs };
      }
      logs.push("✓ cy.viewport() used");

      if (!hasDevice) {
        logs.push("✗ ERROR: No device preset or dimensions found. Use named presets like 'iphone-x'.");
        return { passed: false, logs };
      }
      logs.push("✓ Device preset or dimensions specified");

      return { passed: true, logs };
    }
  },
  {
    id: "request-headers",
    title: "Modifying Request Headers",
    description: "Intercept outgoing requests to add or modify HTTP headers before they reach the server.",
    difficulty: "Advanced",
    icon: Network,
    initialCode: `describe('Modifying Request Headers', () => {
  it('should add custom headers to API requests', () => {
    // TODO: Use cy.intercept() to intercept API requests
    // TODO: Modify the request headers — add an Authorization header
    //       or a custom X-Custom-Header
    // TODO: Use (req) => { req.headers['Authorization'] = 'Bearer token'; }
    // TODO: Visit a page that makes API calls
    // TODO: Verify the modified request was sent using cy.wait()
  });
});`,
    missionBrief: {
      context: "Sometimes you need to inject authentication tokens or custom headers into requests during testing. `cy.intercept()` lets you modify outgoing request headers before they leave the browser.",
      objectives: [
        { id: 1, text: "Use cy.intercept() to intercept outgoing requests" },
        { id: 2, text: "Modify request headers (e.g., add Authorization or X-Custom-Header)" },
        { id: 3, text: "Verify the modified request was sent" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = code.includes("cy.intercept");
      const hasHeaders = code.includes("headers") || code.includes("Authorization") || code.includes("X-");
      const hasReqHeaders = code.includes("req.headers") || code.includes("request.headers");

      logs.push("✓ Test suite initialized");

      if (!hasIntercept) {
        logs.push("✗ ERROR: cy.intercept() not found.");
        return { passed: false, logs };
      }
      logs.push("✓ cy.intercept() used");

      if (!hasHeaders) {
        logs.push("✗ ERROR: No header modification found. Add Authorization or X- header.");
        return { passed: false, logs };
      }
      logs.push("✓ Header reference found");

      if (!hasReqHeaders) {
        logs.push("⚠ WARN: Expected req.headers access pattern.");
      }
      logs.push("✓ Request headers modification configured");

      return { passed: true, logs };
    }
  },
  {
    id: "abort-request",
    title: "Abort Requests",
    description: "Block or abort specific API requests to test error handling and offline scenarios.",
    difficulty: "Intermediate",
    icon: Ban,
    initialCode: `describe('Abort Requests', () => {
  it('should handle aborted API requests gracefully', () => {
    // TODO: Use cy.intercept() to intercept a specific API endpoint
    // TODO: Abort the request using req.destroy() or forceNetworkError
    //       Example: cy.intercept('GET', '/api/users', { forceNetworkError: true })
    //       Or: cy.intercept('GET', '/api/users', (req) => { req.destroy(); })
    // TODO: Visit the page that depends on this API
    // TODO: Assert the app shows an error state or fallback UI
  });
});`,
    missionBrief: {
      context: "Robust apps handle network failures gracefully. Use `cy.intercept()` with `req.destroy()` or `forceNetworkError` to simulate request failures and verify your error handling UI.",
      objectives: [
        { id: 1, text: "Intercept a specific API request" },
        { id: 2, text: "Abort it using req.destroy() or forceNetworkError" },
        { id: 3, text: "Assert the app displays an error state or fallback UI" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = code.includes("cy.intercept");
      const hasAbort = code.includes("destroy()") || code.includes("forceNetworkError");
      const hasErrorAssert = /error|fail|fallback|alert|warning|not.*found/i.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasIntercept) {
        logs.push("✗ ERROR: cy.intercept() not found.");
        return { passed: false, logs };
      }
      logs.push("✓ cy.intercept() used");

      if (!hasAbort) {
        logs.push("✗ ERROR: No abort mechanism found. Use req.destroy() or forceNetworkError.");
        return { passed: false, logs };
      }
      logs.push("✓ Request abort mechanism used");

      if (!hasErrorAssert) {
        logs.push("⚠ WARN: No error-state assertion found.");
      }
      logs.push("✓ Abort request test configured");

      return { passed: true, logs };
    }
  },
  {
    id: "console-logs",
    title: "Listen to Console",
    description: "Capture and assert browser console messages during Cypress tests.",
    difficulty: "Intermediate",
    icon: MessageCircle,
    initialCode: `describe('Listen to Console', () => {
  it('should capture console.log messages', () => {
    // TODO: Use cy.on or cy.window to stub console.log before page loads
    //   cy.on('window:before:load', (win) => {
    //     cy.stub(win.console, 'log').as('consoleLog');
    //   });
    // TODO: Visit a page that logs to the console
    // TODO: Perform an action that triggers a console.log
    // TODO: Assert the stub was called: cy.get('@consoleLog').should('be.called')
    // TODO: Optionally check the message: .should('be.calledWith', 'expected message')
  });
});`,
    missionBrief: {
      context: "Monitoring console output helps catch warnings and verify logging. Stub `console.log` before the page loads, then assert it was called with expected messages after user actions.",
      objectives: [
        { id: 1, text: "Stub console.log using cy.stub(win.console, 'log')" },
        { id: 2, text: "Trigger an action that produces console output" },
        { id: 3, text: "Assert the stub was called with the expected message" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasConsole = code.includes("console");
      const hasStub = code.includes("stub") || code.includes("spy");
      const hasAlias = code.includes("consoleLog") || code.includes("console.log");

      logs.push("✓ Test suite initialized");

      if (!hasConsole) {
        logs.push("✗ ERROR: No reference to console found.");
        return { passed: false, logs };
      }
      logs.push("✓ Console referenced");

      if (!hasStub) {
        logs.push("✗ ERROR: Must use cy.stub() or cy.spy() to capture console.");
        return { passed: false, logs };
      }
      logs.push("✓ Stub/spy used for console");

      if (!hasAlias) {
        logs.push("⚠ WARN: No alias for consoleLog found.");
      }
      logs.push("✓ Console listener configured");

      return { passed: true, logs };
    }
  },
  {
    id: "evaluate-js",
    title: "Evaluate JavaScript",
    description: "Execute arbitrary JavaScript in the browser context using cy.window() and cy.document().",
    difficulty: "Intermediate",
    icon: Terminal,
    initialCode: `describe('Evaluate JavaScript', () => {
  it('should execute JS in the browser context', () => {
    cy.visit('/playground/auth');

    // TODO: Use cy.window() to access the browser window object
    // TODO: Use .then(win => { ... }) to run JavaScript
    //   Example: cy.window().then(win => win.document.title)
    // TODO: Use cy.document() to access DOM properties
    // TODO: Get computed styles or check DOM state
    //   Example: cy.document().then(doc => doc.querySelector('h1').textContent)
    // TODO: Use .invoke() to call methods on elements
    // TODO: Assert the returned values
  });
});`,
    missionBrief: {
      context: "Sometimes you need to evaluate JavaScript directly in the browser. `cy.window()` and `cy.document()` give you access to the browser context for reading properties, computing styles, or manipulating the DOM.",
      objectives: [
        { id: 1, text: "Use cy.window() or cy.document() to access browser context" },
        { id: 2, text: "Execute JavaScript using .then() or .invoke()" },
        { id: 3, text: "Assert values returned from browser evaluation" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWindowOrDoc = code.includes("cy.window()") || code.includes("cy.document()");
      const hasThenOrInvoke = code.includes(".then(") || code.includes("invoke(");

      logs.push("✓ Test suite initialized");

      if (!hasWindowOrDoc) {
        logs.push("✗ ERROR: cy.window() or cy.document() not found.");
        return { passed: false, logs };
      }
      logs.push("✓ Browser context accessed");

      if (!hasThenOrInvoke) {
        logs.push("✗ ERROR: Use .then() or .invoke() to evaluate JavaScript.");
        return { passed: false, logs };
      }
      logs.push("✓ JavaScript evaluation pattern used");

      return { passed: true, logs };
    }
  },
  {
    id: "bounding-box",
    title: "Bounding Box & Coordinates",
    description: "Get element positions and dimensions for layout testing using getBoundingClientRect.",
    difficulty: "Advanced",
    icon: Box,
    initialCode: `describe('Bounding Box & Coordinates', () => {
  it('should verify element position and dimensions', () => {
    cy.visit('/playground/auth');

    // TODO: Select an element (e.g., the login form)
    // TODO: Use .then($el => $el[0].getBoundingClientRect()) to get position
    // TODO: Assert width, height, x, y, or top/left values
    //   Example:
    //   cy.get('[data-testid="btn-login"]').then($el => {
    //     const rect = $el[0].getBoundingClientRect();
    //     expect(rect.width).to.be.greaterThan(0);
    //     expect(rect.height).to.be.greaterThan(0);
    //   });
    // TODO: Verify the element is within expected bounds
  });
});`,
    missionBrief: {
      context: "Layout testing sometimes requires verifying exact positions and dimensions. `getBoundingClientRect()` returns the element's size and position relative to the viewport.",
      objectives: [
        { id: 1, text: "Get an element's bounding rect using getBoundingClientRect()" },
        { id: 2, text: "Assert position properties (x, y, top, left)" },
        { id: 3, text: "Assert dimension properties (width, height)" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasBounding = code.includes("getBoundingClientRect") || code.includes("boundingClientRect") || code.includes("position");
      const hasDimension = /width|height|\.x|\.top/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasBounding) {
        logs.push("✗ ERROR: getBoundingClientRect() or position check not found.");
        return { passed: false, logs };
      }
      logs.push("✓ Bounding rect accessed");

      if (!hasDimension) {
        logs.push("✗ ERROR: No dimension or position assertion found (width, height, x, top).");
        return { passed: false, logs };
      }
      logs.push("✓ Position/dimension assertions present");

      return { passed: true, logs };
    }
  },
  {
    id: "mouse-actions",
    title: "Mouse Actions",
    description: "Perform complex mouse interactions like drag, draw, and right-click in Cypress.",
    difficulty: "Advanced",
    icon: MousePointerClick,
    initialCode: `describe('Mouse Actions', () => {
  it('should perform complex mouse interactions', () => {
    cy.visit('/playground/interactions');

    // TODO: Select the drawing canvas: cy.get('[data-testid="drawing-canvas"]')
    // TODO: Trigger mousedown to start drawing
    //   .trigger('mousedown', { clientX: 100, clientY: 100 })
    // TODO: Trigger mousemove to draw a line
    //   .trigger('mousemove', { clientX: 200, clientY: 200 })
    // TODO: Trigger mouseup to stop drawing
    //   .trigger('mouseup')
  });

  it('should open context menu with right-click', () => {
    cy.visit('/playground/interactions');

    // TODO: Use .rightclick() on an element
    // TODO: Assert that a context menu or action appears
  });
});`,
    missionBrief: {
      context: "Complex interactions like drawing and drag-and-drop require low-level mouse events. Use `.trigger()` for mousedown/mousemove/mouseup sequences and `.rightclick()` for context menus.",
      objectives: [
        { id: 1, text: "Use .trigger('mousedown'), .trigger('mousemove'), .trigger('mouseup')" },
        { id: 2, text: "Use .rightclick() to open a context menu" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasMouse = code.includes("mousedown") || code.includes("mousemove") || code.includes("rightclick");
      const hasTrigger = code.includes("trigger(") || code.includes(".rightclick()");

      logs.push("✓ Test suite initialized");

      if (!hasMouse) {
        logs.push("✗ ERROR: No mouse events found (mousedown, mousemove, rightclick).");
        return { passed: false, logs };
      }
      logs.push("✓ Mouse events referenced");

      if (!hasTrigger) {
        logs.push("✗ ERROR: Use .trigger() or .rightclick() to fire mouse events.");
        return { passed: false, logs };
      }
      logs.push("✓ Mouse action triggers configured");

      return { passed: true, logs };
    }
  },
  {
    id: "soft-assertions",
    title: "Soft Assertions",
    description: "Collect multiple assertion failures and report them all at once instead of failing on the first.",
    difficulty: "Intermediate",
    icon: CheckSquare,
    initialCode: `describe('Soft Assertions', () => {
  it('should collect all assertion failures', () => {
    cy.visit('/playground/auth');

    // Cypress does not have built-in soft assertions like Playwright.
    // TODO: Implement a soft assertion pattern:
    //   const errors = [];
    //   function softAssert(fn) {
    //     try { fn(); } catch (e) { errors.push(e.message); }
    //   }
    // TODO: Make multiple assertions using softAssert()
    //   softAssert(() => expect(true).to.equal(true));
    //   softAssert(() => expect(1 + 1).to.equal(2));
    // TODO: At the end, check if errors array has any failures
    //   if (errors.length > 0) {
    //     throw new Error('Soft assertion failures:\\n' + errors.join('\\n'));
    //   }
  });
});`,
    missionBrief: {
      context: "Unlike Playwright's `expect.soft()`, Cypress lacks built-in soft assertions. Implement a pattern that collects all failures and reports them at the end, so you see every issue in one run.",
      objectives: [
        { id: 1, text: "Implement a soft assertion helper function" },
        { id: 2, text: "Collect multiple assertion failures into an array" },
        { id: 3, text: "Report all failures at the end of the test" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSoftPattern = /softAssert|soft|errors|failures/.test(code);
      const hasCollection = code.includes("push") || code.includes("[]");

      logs.push("✓ Test suite initialized");

      if (!hasSoftPattern) {
        logs.push("✗ ERROR: No soft assertion pattern found. Define a softAssert helper or errors array.");
        return { passed: false, logs };
      }
      logs.push("✓ Soft assertion pattern detected");

      if (!hasCollection) {
        logs.push("⚠ WARN: No error collection pattern found (push or array literal).");
      }
      logs.push("✓ Soft assertion collection configured");

      return { passed: true, logs };
    }
  },
  {
    id: "custom-matchers",
    title: "Custom Chai Assertions",
    description: "Extend Chai with custom assertion methods for domain-specific testing.",
    difficulty: "Advanced",
    icon: Wrench,
    initialCode: `// Custom Chai assertion plugin
// TODO: Define a custom assertion using chai.use()
//   chai.use((_chai) => {
//     _chai.Assertion.addMethod('withinRange', function (min, max) {
//       const value = this._obj;
//       this.assert(
//         value >= min && value <= max,
//         'expected #{this} to be within range #{exp}',
//         'expected #{this} to not be within range #{exp}',
//         min + '..' + max
//       );
//     });
//   });

describe('Custom Chai Assertions', () => {
  it('should use a custom assertion', () => {
    // TODO: Register the custom assertion above
    // TODO: Use it in a test:
    //   expect(5).to.be.withinRange(1, 10);
    //   expect(100).to.not.be.withinRange(1, 10);
    // TODO: Create another custom assertion like toHaveDataTestId
  });
});`,
    missionBrief: {
      context: "Chai's plugin system lets you create custom assertions using `chai.Assertion.addMethod()`. This makes tests more readable and domain-specific.",
      objectives: [
        { id: 1, text: "Use chai.use() to register a plugin" },
        { id: 2, text: "Define a custom assertion with chai.Assertion.addMethod()" },
        { id: 3, text: "Use the custom assertion in a test" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasChai = code.includes("chai");
      const hasAddMethod = code.includes("addMethod") || code.includes("addProperty") || code.includes("chai.use");

      logs.push("✓ Test suite initialized");

      if (!hasChai) {
        logs.push("✗ ERROR: No reference to chai found.");
        return { passed: false, logs };
      }
      logs.push("✓ Chai referenced");

      if (!hasAddMethod) {
        logs.push("✗ ERROR: Use chai.Assertion.addMethod(), addProperty(), or chai.use() to extend Chai.");
        return { passed: false, logs };
      }
      logs.push("✓ Custom assertion method defined");

      return { passed: true, logs };
    }
  },
  {
    id: "parallel-work-queue",
    title: "Parallel Workers & Work Queue",
    description: "Test parallel work distribution using dynamic queue assignment and Cypress parallel concepts.",
    difficulty: "Advanced",
    icon: Workflow,
    initialCode: `// Cypress parallelism: cypress run --parallel --record --group "queue-tests"
// Specs are distributed across CI machines by Cypress Cloud.

describe('Work Queue Processing', () => {
  beforeEach(() => {
    cy.visit('/playground/queue');
  });

  it('should start 3 workers and process all queue items', () => {
    // Select 3 workers
    cy.get('[data-testid="select-worker-count"]').click();
    cy.get('[role="option"]').contains('3').click();

    // Start workers
    cy.get('[data-testid="btn-start-workers"]').click();

    // Assert at least one item shows "in-progress"
    cy.get('[data-testid^="queue-status-"]')
      .contains('in-progress')
      .should('exist');

    // Wait for queue completion (extended timeout for async simulation)
    cy.get('[data-testid="queue-complete"]', { timeout: 30000 })
      .should('be.visible');

    // Verify no pending items remain
    cy.get('[data-testid^="queue-status-"]')
      .contains('pending')
      .should('not.exist');
  });

  it('should distribute work across 2 workers', () => {
    // Start with 2 workers
    cy.get('[data-testid="select-worker-count"]').click();
    cy.get('[role="option"]').contains('2').click();
    cy.get('[data-testid="btn-start-workers"]').click();

    // Verify worker lanes are visible
    cy.get('[data-testid="worker-lane-1"]').should('be.visible');
    cy.get('[data-testid="worker-lane-2"]').should('be.visible');

    // Wait for completion, then verify total processed = 8
    cy.get('[data-testid="queue-complete"]', { timeout: 30000 })
      .should('be.visible');
    cy.get('[data-testid="worker-completed-1"]').invoke('text').then(t1 => {
      cy.get('[data-testid="worker-completed-2"]').invoke('text').then(t2 => {
        expect(Number(t1) + Number(t2)).to.eq(8);
      });
    });
  });

  it('should reset the queue back to pending', () => {
    // Start workers briefly
    cy.get('[data-testid="btn-start-workers"]').click();

    // Reset
    cy.get('[data-testid="btn-reset-queue"]').click();

    // Assert all items are back to pending
    cy.get('[data-testid^="queue-status-"]').each(($el) => {
      cy.wrap($el).should('contain', 'pending');
    });
  });

  // TRY: Change worker count to 1 or 4 and observe the difference.
  // TRY: Add a test that verifies each worker processes at least 1 item.
});`,
    missionBrief: {
      context: "Cypress parallelism uses `--parallel` flag with Cypress Cloud to distribute spec files across machines. This lab simulates a work queue where multiple workers process items concurrently. You'll practice asserting non-deterministic async behavior and using increased timeouts.",
      objectives: [
        { id: 1, text: "Configure worker count via `select-worker-count`" },
        { id: 2, text: "Start workers with `btn-start-workers`" },
        { id: 3, text: "Assert items transition through `in-progress` state" },
        { id: 4, text: "Wait for `queue-complete` with extended timeout" },
        { id: 5, text: "Verify no `pending` items remain after completion" },
        { id: 6, text: "Check worker lanes are visible during processing" },
        { id: 7, text: "Assert total completed items across workers equals 8" },
        { id: 8, text: "Test reset returns all items to `pending`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWorkerSelect = /select-worker-count/.test(code);
      const hasStartBtn = /btn-start-workers/.test(code);
      const hasInProgress = /in-progress/.test(code);
      const hasQueueComplete = /queue-complete/.test(code);
      const hasWorkerLane = /worker-lane/.test(code);
      const hasPendingCheck = /pending/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasWorkerSelect) {
        logs.push("✗ ERROR: Worker count not configured.");
        logs.push("  ↳ Use [data-testid='select-worker-count']");
        return { passed: false, logs };
      }
      logs.push("✓ Worker count selector used");

      if (!hasStartBtn) {
        logs.push("✗ ERROR: Workers not started.");
        logs.push("  ↳ Click [data-testid='btn-start-workers']");
        return { passed: false, logs };
      }
      logs.push("✓ Workers started");

      if (!hasInProgress) {
        logs.push("✗ ERROR: No check for in-progress state.");
        return { passed: false, logs };
      }
      logs.push("✓ In-progress transition checked");

      if (!hasQueueComplete) {
        logs.push("✗ ERROR: Queue completion not asserted.");
        logs.push("  ↳ Wait for [data-testid='queue-complete']");
        return { passed: false, logs };
      }
      logs.push("✓ Queue completion verified");

      if (!hasWorkerLane) {
        logs.push("✗ ERROR: Worker lanes not checked.");
        return { passed: false, logs };
      }
      logs.push("✓ Worker lanes verified");

      if (!hasPendingCheck) {
        logs.push("✗ ERROR: No assertion that pending items are cleared.");
        return { passed: false, logs };
      }
      logs.push("✓ All items processed");

      return { passed: true, logs };
    }
  },
  {
    id: "multi-tab-parallel",
    title: "Multi-Tab Parallel Workers",
    description: "Test shared queue coordination across browser tabs using localStorage and BroadcastChannel.",
    difficulty: "Advanced",
    icon: Workflow,
    initialCode: `// Cypress runs in a single tab, but we can test multi-tab coordination
// by verifying the localStorage-based queue and simulating the flow.

describe('Multi-Tab Work Queue', () => {
  beforeEach(() => {
    // Clear shared queue before each test
    cy.clearLocalStorage();
    cy.visit('/playground/queue');
  });

  it('should assign a unique worker ID in multi-tab mode', () => {
    // Switch to multi-tab mode
    cy.get('[data-testid="tab-multi-mode"]').click();

    // Verify this tab got a worker ID
    cy.get('[data-testid="my-worker-id"]')
      .should('contain', 'Worker #');
  });

  it('should process items and update shared queue in localStorage', () => {
    cy.get('[data-testid="tab-multi-mode"]').click();

    // Start processing
    cy.get('[data-testid="btn-start-processing"]').click();

    // Verify items transition to in-progress in the UI
    cy.get('[data-testid^="queue-status-"]')
      .contains('in-progress')
      .should('exist');

    // Wait for all items to complete
    cy.get('[data-testid="multi-queue-complete"]', { timeout: 30000 })
      .should('be.visible');

    // Verify completed count
    cy.get('[data-testid="my-completed"]')
      .should('not.contain', '0 items');

    // Verify localStorage has the updated queue
    cy.window().then((win) => {
      const raw = win.localStorage.getItem('qplay_multi_queue');
      const queue = JSON.parse(raw || '[]');
      const pending = queue.filter((i: any) => i.status === 'pending');
      expect(pending.length).to.eq(0);
    });
  });

  it('should reset the shared queue', () => {
    cy.get('[data-testid="tab-multi-mode"]').click();

    // Start, then reset
    cy.get('[data-testid="btn-start-processing"]').click();
    cy.wait(500);
    cy.get('[data-testid="btn-reset-multi-queue"]').click();

    // All items should be pending again
    cy.get('[data-testid^="queue-status-"]').each(($el) => {
      cy.wrap($el).should('contain', 'pending');
    });
  });

  // NOTE: True multi-tab testing in Cypress requires:
  // - cypress-multi-tab plugin, or
  // - Testing the shared state (localStorage) that tabs coordinate through
  // TRY: Open /playground/queue in another browser tab manually and watch.
});`,
    missionBrief: {
      context: "Cypress runs in a single tab, so true multi-tab testing requires plugins or testing the coordination layer (localStorage/BroadcastChannel). This lab verifies the shared queue state that multiple tabs coordinate through — the same approach used when testing distributed systems.",
      objectives: [
        { id: 1, text: "Switch to multi-tab mode via `tab-multi-mode`" },
        { id: 2, text: "Verify worker ID is assigned" },
        { id: 3, text: "Start processing and wait for `multi-queue-complete`" },
        { id: 4, text: "Verify localStorage contains the updated queue (no pending items)" },
        { id: 5, text: "Test reset clears shared state back to pending" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasMultiMode = /tab-multi-mode/.test(code);
      const hasWorkerId = /my-worker-id/.test(code);
      const hasStartProcessing = /btn-start-processing/.test(code);
      const hasComplete = /multi-queue-complete/.test(code);
      const hasLocalStorage = /localStorage/.test(code);
      const hasPendingCheck = /pending/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasMultiMode) {
        logs.push("✗ ERROR: Multi-tab mode not activated.");
        logs.push("  ↳ Click [data-testid='tab-multi-mode']");
        return { passed: false, logs };
      }
      logs.push("✓ Multi-tab mode activated");

      if (!hasWorkerId) {
        logs.push("✗ ERROR: Worker ID not checked.");
        return { passed: false, logs };
      }
      logs.push("✓ Worker ID verified");

      if (!hasStartProcessing) {
        logs.push("✗ ERROR: Processing not started.");
        return { passed: false, logs };
      }
      logs.push("✓ Processing started");

      if (!hasComplete) {
        logs.push("✗ ERROR: Queue completion not asserted.");
        return { passed: false, logs };
      }
      logs.push("✓ Queue completed");

      if (!hasLocalStorage) {
        logs.push("✗ ERROR: localStorage not verified.");
        logs.push("  ↳ Check localStorage for shared queue state");
        return { passed: false, logs };
      }
      logs.push("✓ Shared state verified via localStorage");

      if (!hasPendingCheck) {
        logs.push("✗ ERROR: Reset/pending not verified.");
        return { passed: false, logs };
      }
      logs.push("✓ Reset functionality verified");

      return { passed: true, logs };
    }
  },
  {
    id: "loop-parallel-tasks",
    title: "Loop Parallel — Each User Does Its Task",
    description: "Generate N test cases dynamically, each user processing a unique task from a queue.",
    difficulty: "Advanced",
    icon: Repeat,
    initialCode: `// In Cypress, dynamic test generation + --parallel flag distributes work.
// cypress run --parallel --record (requires Cypress Cloud or Sorry Cypress)

const users = [
  { id: 'User-01', task: 'KYC Verification' },
  { id: 'User-02', task: 'Address Proof Upload' },
  { id: 'User-03', task: 'Bank Statement Review' },
  { id: 'User-04', task: 'Selfie Capture' },
  { id: 'User-05', task: 'PAN Card Validation' },
  { id: 'User-06', task: 'Aadhaar eKYC' },
  { id: 'User-07', task: 'Video KYC Call' },
  { id: 'User-08', task: 'Document OCR Check' },
];

describe('Loop Parallel - Unique Tasks', () => {
  // Generate one test per user — when run with --parallel, Cypress
  // distributes these across CI machines automatically
  users.forEach((user, index) => {
    it(\`\${user.id} processes \${user.task}\`, () => {
      cy.visit('/playground/queue');

      // Switch to Loop Runner mode
      cy.get('[data-testid="tab-loop-mode"]').click();

      // Set iterations and concurrency
      cy.get('[data-testid="input-total-iterations"]').clear().type(String(users.length));
      cy.get('[data-testid="input-concurrency"]').clear().type('3');

      // Start the loop
      cy.get('[data-testid="btn-start-loop"]').click();

      // Verify this user's task appears
      cy.get('[data-testid="loop-user-' + (index + 1) + '"]')
        .should('contain', user.id);

      // Wait for all iterations to complete
      cy.get('[data-testid="loop-complete"]', { timeout: 30000 })
        .should('be.visible');

      // Verify elapsed time is displayed
      cy.get('[data-testid="loop-elapsed"]').should('be.visible');
    });
  });

  // TRY: Change concurrency to 1 vs 6 and compare total time.
  // TRY: Add more users and see how --parallel would distribute specs.
});`,
    missionBrief: {
      context: "In Cypress, you generate dynamic tests using `forEach` or `for` loops over a data array. Each iteration becomes a separate `it()` block. When run with `--parallel`, Cypress Cloud distributes these specs across CI machines. This is the production pattern for testing N users doing N different tasks concurrently.",
      objectives: [
        { id: 1, text: "Create a `users` data array with unique tasks" },
        { id: 2, text: "Use `forEach` to generate dynamic `it()` blocks" },
        { id: 3, text: "Switch to Loop Runner mode with `tab-loop-mode`" },
        { id: 4, text: "Set iterations and concurrency" },
        { id: 5, text: "Start the loop and wait for `loop-complete`" },
        { id: 6, text: "Verify elapsed time for performance comparison" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasParallel = /--parallel|parallel/.test(code);
      const hasLoop = /forEach|for\s*\(/.test(code);
      const hasUsersArray = /users/.test(code) && /\[\s*\{/.test(code);
      const hasLoopMode = /tab-loop-mode/.test(code);
      const hasIterations = /input-total-iterations/.test(code);
      const hasConcurrency = /input-concurrency/.test(code);
      const hasStartLoop = /btn-start-loop/.test(code);
      const hasComplete = /loop-complete/.test(code);

      logs.push("✓ Test suite initialized");

      if (!hasUsersArray) {
        logs.push("✗ ERROR: Users data array not found.");
        logs.push("  ↳ Create: const users = [{ id: ..., task: ... }, ...]");
        return { passed: false, logs };
      }
      logs.push("✓ Users data array defined");

      if (!hasLoop) {
        logs.push("✗ ERROR: No loop generating tests.");
        logs.push("  ↳ Use users.forEach((user) => { it(...) })");
        return { passed: false, logs };
      }
      logs.push("✓ Tests generated dynamically");

      if (!hasLoopMode) {
        logs.push("✗ ERROR: Loop Runner mode not activated.");
        return { passed: false, logs };
      }
      logs.push("✓ Loop Runner mode activated");

      if (!hasIterations || !hasConcurrency) {
        logs.push("✗ ERROR: Iterations or concurrency not set.");
        return { passed: false, logs };
      }
      logs.push("✓ Iterations and concurrency configured");

      if (!hasStartLoop) {
        logs.push("✗ ERROR: Loop not started.");
        return { passed: false, logs };
      }
      logs.push("✓ Loop started");

      if (!hasComplete) {
        logs.push("✗ ERROR: Loop completion not asserted.");
        return { passed: false, logs };
      }
      logs.push("✓ All iterations completed");

      return { passed: true, logs };
    }
  }
];
