import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search, List, CheckSquare, Eye, Upload, Database, Globe, Layers, Repeat, Variable, Timer, Monitor, History, HardDrive, Box, Link, Play } from "lucide-react";

export interface PlaywrightLab {
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

export const PLAYWRIGHT_LABS: PlaywrightLab[] = [
  {
    id: "locators",
    title: "Resilient Locators",
    description: "Use user-facing locators like `getByRole` instead of CSS selectors.",
    difficulty: "Beginner",
    icon: Search,
    initialCode: `test('Parabank Login', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  
  // TODO: Replace CSS selectors with robust Playwright locators
  // Ideally use getByRole, getByLabel, or getByPlaceholder
  
  // Fragile: CSS class
  await page.locator('.input.field-1').fill('john');
  
  // Fragile: CSS structure
  await page.locator('form > div:nth-child(2) > input').fill('demo');
  
  // Fragile: Button class
  await page.locator('.button.login').click();
  
  // Assertion
  await expect(page.locator('.smallText')).toContainText('Welcome');
});`,
    missionBrief: {
      context: "Playwright encourages testing like a user. Use 'getBy...' locators that reflect accessibility roles and labels.",
      objectives: [
        { id: 1, text: "Use `page.locator('input[name=\"username\"]')` or similar" },
        { id: 2, text: "Use `page.locator('input[name=\"password\"]')`" },
        { id: 3, text: "Use `page.locator('input[type=\"submit\"]')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasUsername = code.includes("input[name='username']") || code.includes('input[name="username"]');
      const hasPassword = code.includes("input[name='password']") || code.includes('input[name="password"]');
      const hasSubmit = code.includes("input[type='submit']") || code.includes('input[type="submit"]');

      logs.push("✓ Test started");
      
      if (!hasUsername) {
        logs.push("✗ ERROR: Fragile locator for username.");
         logs.push("  ↳ Recommendation: page.locator('input[name=\"username\"]')");
        return { passed: false, logs };
      }

      if (!hasPassword) {
        logs.push("✗ ERROR: Fragile locator for password.");
        return { passed: false, logs };
      }

      if (!hasSubmit) {
        logs.push("✗ ERROR: Fragile locator for login button.");
        return { passed: false, logs };
      }

      logs.push("✓ Locators are resilient");
      return { passed: true, logs };
    }
  },
  {
    id: "auto-waiting",
    title: "Auto-waiting",
    description: "Understand Playwright's auto-waiting mechanism to avoid manual waits.",
    difficulty: "Beginner",
    icon: Clock,
    initialCode: `test('Find Transactions', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/findtrans.htm');
  
  await page.locator('#criteria\\.amount').fill('1000');
  await page.locator('button[ng-click="findTransactions()"]').click();
  
  // TODO: Playwright automatically waits for elements to be actionable.
  // Remove the manual wait.
  await page.waitForTimeout(5000); 
  
  // TODO: Assert visibility directly. 
  // Playwright assertions retry automatically.
  const table = page.locator('#transactionTable');
  if (await table.isVisible()) {
      console.log('Visible');
  }
});`,
    missionBrief: {
      context: "Playwright auto-waits for elements to be attached, visible, and stable. Explicit waits are rarely needed.",
      objectives: [
        { id: 1, text: "Remove `page.waitForTimeout(5000)`" },
        { id: 2, text: "Use `await expect(table).toBeVisible()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const hasFixedWait = /page\.waitForTimeout\(\s*\d+\s*\)/.test(cleanCode);
      const hasExpectVisible = /expect\([^)]+\)\.toBeVisible\(\)/.test(code);

      logs.push("✓ Test started");

      if (hasFixedWait) {
        logs.push("✗ ERROR: Manual wait detected.");
        return { passed: false, logs };
      }

      if (!hasExpectVisible) {
        logs.push("✗ ERROR: Missing web-first assertion.");
        logs.push("  ↳ Use await expect(locator).toBeVisible()");
        return { passed: false, logs };
      }

      logs.push("✓ Auto-waiting leveraged correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "variables",
    title: "Standard Variables",
    description: "In Playwright, just use standard JavaScript/TypeScript variables.",
    difficulty: "Beginner",
    icon: Variable,
    initialCode: `test('Account Overview', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/overview.htm');
  
  // Cypress needs aliases. Playwright uses const/let.
  
  // TODO: Get the text from '.balance'
  // Use locator.innerText()
  
  // TODO: Store it in a variable named 'balanceText'
  
  // TODO: Log it to console
});`,
    missionBrief: {
      context: "No need for special aliases or `.then()`. Playwright runs inside standard Node.js, so you can use standard variables.",
      objectives: [
        { id: 1, text: "Use `const balanceText = await ...innerText()`" },
        { id: 2, text: "Console log the variable" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasVar = /const\s+balanceText\s*=\s*await/.test(code);
      const hasLog = /console\.log\(.*balanceText.*\)/.test(code);

      logs.push("✓ Test started");
      
      if (!hasVar) {
        logs.push("✗ ERROR: Variable definition missing.");
        logs.push("  ↳ use: const balanceText = await page.locator(...).innerText()");
        return { passed: false, logs };
      }

      if (!hasLog) {
        logs.push("✗ ERROR: Console log missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Standard variables used correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "dropdowns",
    title: "Handling Dropdowns",
    description: "Use `locator.selectOption()` for select elements.",
    difficulty: "Beginner",
    icon: List,
    initialCode: `test('Open New Account', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/openaccount.htm');
  
  // TODO: Select '1' (SAVINGS) from the dropdown #type
  
  // Incorrect:
  await page.locator('#type').click();
  await page.locator('option').filter({ hasText: 'SAVINGS' }).click();
});`,
    missionBrief: {
      context: "For standard `<select>` elements, use the specialized `selectOption` method.",
      objectives: [
        { id: 1, text: "Identify the select element `#type`" },
        { id: 2, text: "Use `.selectOption('1')` or label" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSelect = /\.selectOption\(['"](1|SAVINGS)['"]\)/.test(code);
      const hasClick = /\.click\(\)/.test(code);

      logs.push("✓ Test started");

      if (hasClick) {
        logs.push("⚠ WARN: Don't use .click() on select elements.");
      }

      if (!hasSelect) {
        logs.push("✗ ERROR: selectOption missing.");
        logs.push("  ↳ Expected: await page.locator('#type').selectOption('1')");
        return { passed: false, logs };
      }

      logs.push("✓ Dropdown handled correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "codegen",
    title: "VS Code Codegen",
    description: "Learn about the Codegen tool (Simulation).",
    difficulty: "Beginner",
    icon: Code2,
    initialCode: `// Playwright has a powerful code generator.
// You can run: npx playwright codegen parbank.parasoft.com

test('Generated Test', async ({ page }) => {
  // TODO: Paste "generated" code here to simulate the experience
  // 1. Go to parabank
  // 2. Click "About Us"
  // 3. Assert header is visible
});`,
    missionBrief: {
      context: "While we can't run codegen in the browser, write the code that codegen WOULD generate for visiting 'About Us'.",
      objectives: [
        { id: 1, text: "Navigate to Parabank" },
        { id: 2, text: "Click 'About Us' link" },
        { id: 3, text: "Assert heading is visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClick = /click\(['"]About Us['"]\)/.test(code) || /getByRole\(['"]link['"],\s*{\s*name:\s*['"]About Us['"]\s*}\)\.click/.test(code);
      
      logs.push("✓ Test started");

      if (!hasClick) {
        logs.push("✗ ERROR: Click on 'About Us' missing.");
        return { passed: false, logs };
      }

      logs.push("✓ 'Codegen' script verified");
      return { passed: true, logs };
    }
  },
  {
    id: "multiple-tabs",
    title: "Multiple Tabs/Pages",
    description: "Handle new tabs using `context.waitForEvent('page')`.",
    difficulty: "Intermediate",
    icon: Layers,
    initialCode: `test('Open New Window', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');
  
  // TODO: Clicking this link opens a new tab
  // We need to wait for the 'page' event on the context
  
  const pagePromise = context.waitForEvent('page');
  await page.getByText('Click Here').click();
  
  // TODO: Await the new page
  // const newPage = ...
  
  // TODO: Assert title of new page
});`,
    missionBrief: {
      context: "Playwright handles multiple tabs/windows natively via the `BrowserContext`.",
      objectives: [
        { id: 1, text: "Await `pagePromise` to get `newPage`" },
        { id: 2, text: "Check title of `newPage`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasAwaitPage = /const\s+(\w+)\s*=\s*await\s+pagePromise/.test(code);
      const hasExpect = /expect\(\w+\)\.toHaveTitle/.test(code) || /expect\(await\s+\w+\.title\(\)\)/.test(code);

      logs.push("✓ Test started");

      if (!hasAwaitPage) {
        logs.push("✗ ERROR: Did not await the new page.");
        return { passed: false, logs };
      }

      if (!hasExpect) {
        logs.push("✗ ERROR: Assertion on new page missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Multi-tab handling correct");
      return { passed: true, logs };
    }
  },
  {
    id: "network-mock",
    title: "Network Mocking",
    description: "Intercept and modify network traffic with `page.route()`.",
    difficulty: "Intermediate",
    icon: Database,
    initialCode: `test('Mock Accounts', async ({ page }) => {
  // TODO: Intercept GET requests to **/accounts
  // Fulfill them with an empty array body: []
  
  // await page.route(...)
  
  await page.goto('https://parabank.parasoft.com/parabank/overview.htm');
});`,
    missionBrief: {
      context: "Mock backend responses to test edge cases (like empty states) without changing the database.",
      objectives: [
        { id: 1, text: "Use `page.route('**/accounts', ...)`" },
        { id: 2, text: "Fulfill with `body: JSON.stringify([])`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRoute = /page\.route\(['"]\*\*\/accounts['"]/.test(code);
      const hasFulfill = /route\.fulfill/.test(code);
      const hasBody = /body:\s*JSON\.stringify\(\[\]\)/.test(code) || /json:\s*\[\]/.test(code);

      logs.push("✓ Test started");

      if (!hasRoute) {
        logs.push("✗ ERROR: page.route missing.");
        return { passed: false, logs };
      }

      if (!hasFulfill || !hasBody) {
        logs.push("✗ ERROR: Route not fulfilled correctly.");
        logs.push("  ↳ Use route.fulfill({ json: [] })");
        return { passed: false, logs };
      }

      logs.push("✓ Network route mocked");
      return { passed: true, logs };
    }
  },
  {
    id: "api-testing",
    title: "API Testing",
    description: "Playwright can verify API endpoints directly using `request`.",
    difficulty: "Intermediate",
    icon: Globe,
    initialCode: `test('API Verification', async ({ request }) => {
  // TODO: Perform a POST request to create a new user (mocked endpoint)
  // URL: https://parabank.parasoft.com/api/create
  
  // const response = await request.post(...)
  
  // TODO: Assert status is 200
  // await expect(response).toBeOK();
});`,
    missionBrief: {
      context: "You can use Playwright as an API client! Pass `request` fixture to the test.",
      objectives: [
        { id: 1, text: "Call `request.post(...)`" },
        { id: 2, text: "Assert `expect(response).toBeOK()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPost = /request\.post\(/.test(code);
      const hasExpect = /expect\(response\)\.toBeOK\(\)/.test(code);

      logs.push("✓ Test started");

      if (!hasPost) {
        logs.push("✗ ERROR: API request missing.");
        return { passed: false, logs };
      }

      if (!hasExpect) {
        logs.push("✗ ERROR: Status assertion missing.");
        return { passed: false, logs };
      }

      logs.push("✓ API test implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "shadow-dom",
    title: "Shadow DOM",
    description: "Playwright pierces Shadow DOM automatically.",
    difficulty: "Advanced",
    icon: Layers,
    initialCode: `test('Web Component', async ({ page }) => {
  await page.goto('/components');
  
  // Element structure:
  // <custom-card>
  //   #shadow-root
  //     <button class="action-btn">Click Me</button>
  // </custom-card>
  
  // TODO: Click the button.
  // NOTE: Unlike Cypress, you DON'T need .shadow()
  // Playwright locators pierce shadow roots by default.
  
});`,
    missionBrief: {
      context: "Just select the element as if the Shadow DOM didn't exist. Playwright handles it.",
      objectives: [
        { id: 1, text: "Locator for `.action-btn`" },
        { id: 2, text: "Click it" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasLocator = /page\.locator\(['"]\.action-btn['"]\)/.test(code);
      const hasClick = /\.click\(\)/.test(code);
      const hasShadow = /\.shadow\(\)/.test(code);

      logs.push("✓ Test started");

      if (hasShadow) {
        logs.push("⚠ WARN: .shadow() is not needed in Playwright!");
      }

      if (!hasLocator || !hasClick) {
        logs.push("✗ ERROR: Locator or click missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Shadow DOM pierced (automatically)");
      return { passed: true, logs };
    }
  },
  {
    id: "iframe",
    title: "Frames",
    description: "Use `page.frameLocator()` to interact with iframes.",
    difficulty: "Intermediate",
    icon: Box,
    initialCode: `test('Payment Widget', async ({ page }) => {
  await page.goto('/dashboard');
  
  // The input is inside <iframe id="payment-frame">
  
  // TODO: Create a frame locator
  // const frame = page.frameLocator('#payment-frame');
  
  // TODO: Fill input '#card-number' inside the frame
});`,
    missionBrief: {
      context: "For iframes, create a strict `FrameLocator` to scope your queries.",
      objectives: [
        { id: 1, text: "Use `page.frameLocator(...)`" },
        { id: 2, text: "Find and fill `#card-number`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFrame = /page\.frameLocator\(['"]#payment-frame['"]\)/.test(code);
      const hasFill = /\.locator\(['"]#card-number['"]\)\.fill/.test(code);

      logs.push("✓ Test started");

      if (!hasFrame) {
        logs.push("✗ ERROR: frameLocator missing.");
        return { passed: false, logs };
      }

      if (!hasFill) {
        logs.push("✗ ERROR: Input interaction inside frame missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Frame interaction correct");
      return { passed: true, logs };
    }
  },
  {
    id: "global-setup",
    title: "Global Setup (Auth)",
    description: "Save authentication state to reuse across tests.",
    difficulty: "Advanced",
    icon: ShieldCheck,
    initialCode: `// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // TODO: Login
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').fill('john');
  await page.locator('input[name="password"]').fill('demo');
  await page.locator('input[type="submit"]').click();
  
  // TODO: Save storage state to 'storageState.json'
  // await page.context().storageState(...)
  
  await browser.close();
}`,
    missionBrief: {
      context: "Don't login in every test! Login once in Global Setup and save the storage state (cookies/LS).",
      objectives: [
        { id: 1, text: "Login successfully" },
        { id: 2, text: "Call `storageState({ path: 'storageState.json' })`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasStorage = /storageState\(\s*{\s*path:\s*['"]storageState\.json['"]\s*}\s*\)/.test(code);

      logs.push("✓ Setup started");

      if (!hasStorage) {
        logs.push("✗ ERROR: Storage state not saved.");
        logs.push("  ↳ Expected: page.context().storageState({ path: 'storageState.json' })");
        return { passed: false, logs };
      }

      logs.push("✓ Auth state persisted");
      return { passed: true, logs };
    }
  },
  {
    id: "visual-comparison",
    title: "Visual Regression",
    description: "Compare screenshots to detect UI regressions.",
    difficulty: "Advanced",
    icon: Eye,
    initialCode: `test('Visual Test', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  
  // TODO: Assert that the page matches the snapshot
  // Use expect(page).toHaveScreenshot()
  
});`,
    missionBrief: {
      context: "Pixel-perfect testing! Playwright can compare the current page against a baseline image.",
      objectives: [
        { id: 1, text: "Call `await expect(page).toHaveScreenshot()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasScreenshot = /expect\(page\)\.toHaveScreenshot\(\)/.test(code);

      logs.push("✓ Test started");

      if (!hasScreenshot) {
        logs.push("✗ ERROR: Visual assertion missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Visual comparison enabled");
      return { passed: true, logs };
    }
  },
  {
    id: "emulation",
    title: "Mobile Emulation",
    description: "Test on iPhone/Pixel via configuration or `page.setViewportSize`.",
    difficulty: "Intermediate",
    icon: Monitor,
    initialCode: `test('Mobile Layout', async ({ page }) => {
  // TODO: Resize viewport to iPhone 12 Pro (390 x 844)
  
  // await page.setViewportSize(...)
  
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
});`,
    missionBrief: {
      context: "Ideally set in `playwright.config.ts`, but you can also set viewport dynamically.",
      objectives: [
        { id: 1, text: "Set width: 390, height: 844" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasViewport = /setViewportSize\(\s*{\s*width:\s*390,\s*height:\s*844\s*}\s*\)/.test(code);

      logs.push("✓ Test started");

      if (!hasViewport) {
        logs.push("✗ ERROR: Incorrect viewport size.");
        return { passed: false, logs };
      }

      logs.push("✓ Mobile emulation active");
      return { passed: true, logs };
    }
  },
  {
    id: "clock",
    title: "Time Travel",
    description: "Manipulate time with `page.clock`.",
    difficulty: "Advanced",
    icon: Timer,
    initialCode: `test('Session Timeout', async ({ page }) => {
  // TODO: Install clock
  // await page.clock.install();
  
  await page.goto('/dashboard');
  
  // TODO: Fast forward 30 minutes (1800000 ms)
  // await page.clock.fastForward(...)
  
  await expect(page.locator('.alert')).toContainText('Session Expired');
});`,
    missionBrief: {
      context: "Control system time to test timeouts and intervals instantly.",
      objectives: [
        { id: 1, text: "Install clock" },
        { id: 2, text: "Fast forward 30 mins" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasInstall = /page\.clock\.install\(\)/.test(code);
      const hasForward = /page\.clock\.fastForward\(1800000\)/.test(code);

      logs.push("✓ Test started");

      if (!hasInstall) {
        logs.push("✗ ERROR: Clock not installed.");
        return { passed: false, logs };
      }

      if (!hasForward) {
        logs.push("✗ ERROR: Did not fast forward time.");
        return { passed: false, logs };
      }

      logs.push("✓ Time travel successful");
      return { passed: true, logs };
    }
  },
  {
    id: "download",
    title: "Downloads",
    description: "Handle file downloads using `waitForEvent('download')`.",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `test('Download Report', async ({ page }) => {
  await page.goto('/reports');
  
  // TODO: Start waiting for the download event
  // const downloadPromise = page.waitForEvent('download');
  
  // Perform the action that triggers download
  await page.getByText('Export PDF').click();
  
  // TODO: Await the download
  // const download = await downloadPromise;
  
  // TODO: Save it
  // await download.saveAs(...)
});`,
    missionBrief: {
      context: "Downloads are events. You must wait for the event while triggering the action.",
      objectives: [
        { id: 1, text: "Setup `waitForEvent('download')` promise" },
        { id: 2, text: "Await promise after click" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPromise = /const\s+downloadPromise\s*=\s*page\.waitForEvent\(['"]download['"]\)/.test(code);
      const hasAwait = /const\s+download\s*=\s*await\s+downloadPromise/.test(code);

      logs.push("✓ Test started");

      if (!hasPromise) {
        logs.push("✗ ERROR: Download listener missing.");
        return { passed: false, logs };
      }

      if (!hasAwait) {
        logs.push("✗ ERROR: Failed to await download.");
        return { passed: false, logs };
      }

      logs.push("✓ Download handled correctly");
      return { passed: true, logs };
    }
  }
];
