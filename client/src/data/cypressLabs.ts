import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search, List, CheckSquare, Eye, Upload, Database, Globe, Layers, Repeat, Variable, Timer, Monitor, History, HardDrive, Box, Link, Download, Clipboard } from "lucide-react";

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
  it('should show submenu on hover', () => {
    cy.visit('/home');
    
    // The menu is hidden until we hover over 'Products'
    // Element: <li class="menu-item">Products</li>
    
    // TODO: Trigger a mouseover event on the menu item
    cy.get('.menu-item').contains('Products');
    
    // Then assert submenu is visible
    cy.get('.submenu').should('be.visible');
  });
});`,
    missionBrief: {
      context: "Cypress doesn't have a native `.hover()` command because hover is a fragile state. Use `.trigger('mouseover')` to simulate it.",
      objectives: [
        { id: 1, text: "Select the menu item" },
        { id: 2, text: "Chain `.trigger('mouseover')`" }
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
    cy.visit('/dashboard');
    
    // The payment widget is inside <iframe id="payment-frame">
    // We can't just do cy.get('#card-number')
    
    // TODO: Get the iframe
    // TODO: Get its '0.contentDocument.body'
    // TODO: Wrap it with cy.wrap() to chain commands
    
    cy.get('#payment-frame')
      .its('0.contentDocument.body')
      // .should('not.be.empty') // Wait for it to load
      // .then(cy.wrap)
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
  it('should upload a PDF', () => {
    cy.visit('/kyc');
    
    // TODO: Upload a file to the input
    // Input: <input type="file" id="docs" />
    
    // Cypress has a built-in command for this since v9.3.0
    // No plugins needed!
    
  });
});`,
    missionBrief: {
      context: "Testing file uploads used to require plugins. Now you can use the native `.selectFile()` command.",
      objectives: [
        { id: 1, text: "Select input `input[type='file']`" },
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
  it('should verify all amounts are positive', () => {
    cy.visit('/transactions');
    
    // We have a list of amounts: <span class="amount">$50.00</span>
    
    // TODO: Iterate over all '.amount' elements
    // Check that each one contains a '$'
    
    cy.get('.amount').each(($el, index, $list) => {
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
  it('should set auth cookie', () => {
    cy.visit('/login');
    cy.get('#remember-me').check();
    cy.get('#login-btn').click();
    
    // TODO: Verify that a cookie named 'session_id' exists
    // cy.getCookie(...)
    
    // TODO: Verify LocalStorage has 'user_pref'
    // cy.getAllLocalStorage(...) is valid, but we can also check window
    // strict check:
    cy.window().its('localStorage').invoke('getItem', 'user_pref').should('exist');
  });
});`,
    missionBrief: {
      context: "Testing persistence often requires checking cookies or local storage directly.",
      objectives: [
        { id: 1, text: "Use `cy.getCookie('session_id')`" },
        { id: 2, text: "Assert it `.should('exist')`" }
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
  it('should show hamburger menu on mobile', () => {
    // TODO: Set viewport to iPhone X size (375, 812)
    // cy.viewport(...)
    
    cy.visit('/home');
    
    // Verify desktop menu is hidden
    cy.get('.desktop-menu').should('not.be.visible');
    
    // Verify hamburger icon is visible
    cy.get('.hamburger-icon').should('be.visible');
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
    cy.visit('/admin');
    
    // TODO: Do NOT hardcode passwords!
    // Access the 'admin_password' from environment variables
    
    const password = "HARDCODED_SECRET"; // BAD!
    
    cy.get('#password').type(password);
    cy.get('#submit').click();
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
    cy.visit('/form');
    cy.get('#name').type('Alice');
    
    // TODO: Reload the page
    
    
    // TODO: Verify name is still there (persistence test)
    cy.get('#name').should('have.value', 'Alice');
    
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
    cy.visit('/components');
    
    // Element structure:
    // <custom-card>
    //   #shadow-root
    //     <button class="action-btn">Click Me</button>
    // </custom-card>
    
    // Standard get fails because of shadow boundary
    cy.get('custom-card').find('.action-btn').click(); // Fails
    
    // TODO: Use .shadow() command
  });
});`,
    missionBrief: {
      context: "Standard selectors can't see inside Shadow DOM. Use `.shadow()` to traverse the boundary.",
      objectives: [
        { id: 1, text: "Get the host element `custom-card`" },
        { id: 2, text: "Chain `.shadow()`" },
        { id: 3, text: "Find `.action-btn`" }
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
    initialCode: `describe('Multiple Forms', () => {
  it('should submit the second form', () => {
    cy.visit('/register');
    
    // There are two forms: #login-form and #signup-form
    // Both have an input[name="email"]
    
    // TODO: Target ONLY the signup form
    // Use .within() to scope commands
    
    cy.get('#signup-form').within(() => {
      // commands here are scoped to #signup-form
      // so cy.get('input[name="email"]') finds the right one
      
    });
  });
});`,
    missionBrief: {
      context: "When you have duplicate elements, scoping with `.within()` is cleaner than chaining long selectors.",
      objectives: [
        { id: 1, text: "Get `#signup-form`" },
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
    
    cy.visit('/dashboard');
    
    // TODO: Fast forward time by 30 minutes (in ms)
    // 30 * 60 * 1000 = 1800000
    // cy.tick(...)
    
    cy.get('.alert').should('contain', 'Session Expired');
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
    
    cy.visit('/admin');
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
    initialCode: `describe('Kanban Board', () => {
  it('should move task to Done', () => {
    cy.visit('/board');
    
    // We need to drag #task-1 to #column-done
    
    const dataTransfer = new DataTransfer();
    
    // TODO: Trigger 'dragstart' on the task
    cy.get('#task-1').trigger('dragstart', {
      dataTransfer
    });
    
    // TODO: Trigger 'drop' on the destination
    // cy.get('#column-done').trigger(...)
  });
});`,
    missionBrief: {
      context: "Cypress simulates drag and drop by triggering events manually.",
      objectives: [
        { id: 1, text: "Trigger `drop` on `#column-done`" },
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
    cy.visit('/login');
    cy.get('#login-btn').click();
    
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
    cy.visit('/home');
    
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
    cy.visit('/snippets');
    
    // We need to grant clipboard permissions first
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        origin: window.location.origin,
      },
    }));

    cy.get('#copy-btn').click();
    
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
  it('should show saved items', () => {
    // TODO: Seed Local Storage BEFORE visiting
    // We want to simulate a user who already added items
    
    cy.window().then((win) => {
       // win.localStorage.setItem(...)
    });
    
    cy.visit('/cart');
    cy.get('.cart-item').should('have.length', 1);
  });
});`,
    missionBrief: {
      context: "Don't manually add items to the cart in every test. Seed `localStorage` directly to set the state instantly.",
      objectives: [
        { id: 1, text: "Set `cart_items` in localStorage" },
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
    cy.visit('/error-page');
    
    // TODO: Take a full page screenshot
    // cy.screenshot('error-state');
    
    // TODO: Take a screenshot of a specific element
    // cy.get('.error-box').screenshot();
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
  
  cy.get('#status').invoke('text').then((text) => {
    if (text !== 'COMPLETE') {
      cy.wait(1000);
      checkStatus(); // Recurse
    }
  });
}

describe('Long Process', () => {
  it('should wait for completion', () => {
    cy.visit('/processing');
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
    cy.visit('/signup');
    
    // The error only appears when the user leaves the field (blur)
    cy.get('#email').click();
    
    // TODO: Trigger blur event
    // cy.get('#email').blur();
    
    cy.get('.error').should('be.visible');
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
    
    cy.visit('/profile');
    // cy.get('#name').type(user.name);
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
    //   cy.visit('/login');
    //   cy.get('#user').type('admin');
    //   cy.get('#pass').type('123');
    //   cy.get('#btn').click();
    //   cy.url().should('contain', '/dashboard');
    // });
    
    // Original slow login:
    cy.visit('/login');
    cy.get('#user').type('admin');
    cy.get('#pass').type('123');
    cy.get('#btn').click();
  });

  it('should show stats', () => {
    cy.visit('/dashboard');
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
    
    cy.visit('/app');
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
  it('should redirect to login page', () => {
    cy.visit('/protected');
    
    // User is redirected to: /login?returnTo=/protected
    
    // TODO: Assert the URL contains '/login'
    // cy.url()...
    
    // TODO: Assert the pathname is '/login'
    // cy.location('pathname')...
  });
});`,
    missionBrief: {
      context: "Verify that redirects happen correctly by checking the URL.",
      objectives: [
        { id: 1, text: "Check `cy.url()` contains '/login'" },
        { id: 2, text: "Check `cy.location('pathname')` is '/login'" }
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
  it('should show sidebar in landscape', () => {
    // TODO: Set viewport to ipad-2 in landscape
    // cy.viewport('ipad-2', 'landscape');
    
    cy.visit('/dashboard');
    cy.get('.sidebar').should('be.visible');
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
    cy.visit('/long-page');
    
    // Footer is at the bottom.
    // Sometimes elements are lazy-loaded on scroll.
    
    // TODO: Scroll the footer into view
    // cy.get('footer').scrollIntoView();
    
    cy.get('footer').should('be.visible');
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
    cy.visit('/wizard/step-1');
    cy.get('#next').click();
    
    // I want to see the state of Step 2 before continuing
    
    // TODO: Pause execution here
    // cy.pause();
    
    cy.get('#finish').click();
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
    id: "drag-drop",
    title: "Drag and Drop",
    description: "Simulate drag events using `.trigger()`.",
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
    id: "clipboard",
    title: "Clipboard Testing",
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
  }
];
