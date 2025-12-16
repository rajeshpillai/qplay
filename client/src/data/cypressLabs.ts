import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search, List, CheckSquare, Eye, Upload, Database, Globe, Layers, Repeat, Variable, Timer, Monitor, History, HardDrive, Box, Link } from "lucide-react";

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
      
      // Remove comments to allow commenting out code
      const cleanCode = code
        .replace(/\/\/.*$/gm, '') // Remove single line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
        
      const hasFixedWait = /cy\.wait\(\s*\d+\s*\)/.test(cleanCode);
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
  },
  {
    id: "variables-aliases",
    title: "Variables & Aliases",
    description: "Learn to handle asynchronous values using Cypress aliases.",
    difficulty: "Beginner",
    icon: Variable,
    initialCode: `describe('Account Overview', () => {
  it('should verify account balance', () => {
    cy.visit('https://parabank.parasoft.com/parabank/overview.htm');
    
    // TODO: Capture the balance text and reuse it
    // 1. Get the element with class 'balance'
    // 2. Alias it as 'accountBalance'
    // 3. Reuse it later
    
    cy.get('td.balance').first().invoke('text').then((text) => {
      // Don't use let/const for sharing state in Cypress!
      // Use aliases instead.
      cy.wrap(text).as('balanceText');
    });

    // TODO: Access the alias here using @
    // cy.get('@balanceText').should(...)
  });
});`,
    missionBrief: {
      context: "Async values in Cypress can't be stored in standard variables. Use Aliases (`.as()`) to store and retrieve values.",
      objectives: [
        { id: 1, text: "Create an alias named `balanceText`" },
        { id: 2, text: "Access the alias using `cy.get('@balanceText')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasAliasDef = /\.as\(['"]balanceText['"]\)/.test(code);
      const hasAliasUsage = /cy\.get\(['"]@balanceText['"]\)/.test(code);

      logs.push("✓ Test suite initialized");
      
      if (!hasAliasDef) {
        logs.push("✗ ERROR: Alias definition missing.");
        logs.push("  ↳ Use .as('balanceText')");
        return { passed: false, logs };
      }
      
      if (!hasAliasUsage) {
        logs.push("✗ ERROR: Alias not accessed correctly.");
        logs.push("  ↳ Use cy.get('@balanceText')");
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
    initialCode: `describe('Open New Account', () => {
  it('should select account type', () => {
    cy.visit('https://parabank.parasoft.com/parabank/openaccount.htm');
    
    // TODO: Select 'SAVINGS' from the account type dropdown
    // The select element has id="type"
    // Do NOT use .click() on options!
    
    cy.get('#type').click(); // Incorrect way for <select>
    cy.get('option').contains('SAVINGS').click(); // Incorrect
    
  });
});`,
    missionBrief: {
      context: "Standard `<select>` elements require the special `.select()` command, not clicks.",
      objectives: [
        { id: 1, text: "Use `cy.get('#type')`" },
        { id: 2, text: "Chain `.select('1')` (SAVINGS)" } // Parabank uses values 0 and 1
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSelect = /\.select\(['"](1|SAVINGS)['"]\)/.test(code);
      const hasClick = /\.click\(\)/.test(code);

      logs.push("✓ Test suite initialized");
      
      if (hasClick) {
         logs.push("⚠ WARN: You are using .click() on a select or option.");
         logs.push("  ↳ This often fails on standard HTML selects. Use .select()");
      }

      if (!hasSelect) {
        logs.push("✗ ERROR: .select() command missing.");
        logs.push("  ↳ Expected: .select('1') or .select('SAVINGS')");
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
    initialCode: `describe('Bill Pay Settings', () => {
  it('should toggle preferences', () => {
    // Imaginary settings page for learning
    cy.visit('/settings');
    
    // TODO: Check the 'email-notifications' checkbox
    // Element: <input type="checkbox" value="email" />
    cy.get('[value="email"]').click(); // Flaky
    
    // TODO: Uncheck the 'sms-notifications' checkbox
    // Element: <input type="checkbox" value="sms" />
    
    // TODO: Select 'weekly' radio button
    // Element: <input type="radio" value="weekly" />
  });
});`,
    missionBrief: {
      context: "While `.click()` works on checkboxes, `.check()` and `.uncheck()` are more semantic and enforce state.",
      objectives: [
        { id: 1, text: "Use `.check()` for email" },
        { id: 2, text: "Use `.uncheck()` for sms" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasCheck = /\.check\(\)/.test(code);
      const hasUncheck = /\.uncheck\(\)/.test(code);

      logs.push("✓ Test suite initialized");
      
      if (!hasCheck) {
        logs.push("✗ ERROR: .check() command missing.");
        return { passed: false, logs };
      }
      
      if (!hasUncheck) {
        logs.push("✗ ERROR: .uncheck() command missing.");
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
    initialCode: `describe('Welcome Message', () => {
  it('should have correct styling', () => {
    cy.visit('https://parabank.parasoft.com/parabank/index.htm');
    
    // TODO: Assert that the title:
    // 1. Is visible
    // 2. Contains text 'Experience the difference'
    // 3. Has class 'caption'
    
    // Inefficient way:
    cy.get('.caption').should('be.visible');
    cy.get('.caption').should('contain', 'Experience');
    cy.get('.caption').should('have.class', 'caption');
    
    // TODO: Rewrite this as a single chain
  });
});`,
    missionBrief: {
      context: "Querying the DOM multiple times for the same element is inefficient. Chain your assertions.",
      objectives: [
        { id: 1, text: "Use a single `cy.get()`" },
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
    initialCode: `describe('Account Activity', () => {
  it('should show empty state when API returns no data', () => {
    // TODO: Intercept the GET request to services/bank/customers/*/accounts
    // and force it to return an empty list []
    
    // cy.intercept(...)
    
    cy.visit('https://parabank.parasoft.com/parabank/overview.htm');
    
    // Verify appropriate message appears
  });
});`,
    missionBrief: {
      context: "We need to test how the UI handles an empty account list, but we can't delete real data. Mock the API response.",
      objectives: [
        { id: 1, text: "Intercept `GET **/accounts`" },
        { id: 2, text: "Return `body: []` (empty array)" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = /cy\.intercept/.test(code);
      const hasEmptyBody = /body\s*:\s*\[\]/.test(code);

      logs.push("✓ Test suite initialized");
      
      if (!hasIntercept) {
        logs.push("✗ ERROR: cy.intercept() missing.");
        return { passed: false, logs };
      }
      
      if (!hasEmptyBody) {
        logs.push("✗ ERROR: Mock response body is not an empty array.");
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
  }
];
