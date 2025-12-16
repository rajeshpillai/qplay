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
  },
  {
    id: "drag-drop",
    title: "Drag and Drop",
    description: "Use the native `dragTo` method.",
    difficulty: "Intermediate",
    icon: MousePointerClick,
    initialCode: `test('Kanban Board', async ({ page }) => {
  await page.goto('/board');
  
  // TODO: Drag #task-1 to #column-done
  // await page.locator('#task-1').dragTo(page.locator('#column-done'));
});`,
    missionBrief: {
      context: "Playwright has a high-level API for drag and drop. No need to trigger events manually.",
      objectives: [
        { id: 1, text: "Use `locator.dragTo(targetLocator)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasDrag = /\.dragTo\(/.test(code);

      logs.push("✓ Test started");

      if (!hasDrag) {
        logs.push("✗ ERROR: dragTo command missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Drag operation simulated");
      return { passed: true, logs };
    }
  },
  {
    id: "keyboard",
    title: "Keyboard Shortcuts",
    description: "Simulate keyboard interactions like Enter, Escape, or Shortcuts.",
    difficulty: "Beginner",
    icon: Terminal,
    initialCode: `test('Search Shortcut', async ({ page }) => {
  await page.goto('/home');
  
  // TODO: Press 'Control+K' to open search
  // await page.keyboard.press('Control+K');
  
  // TODO: Type 'Settings'
  // await page.keyboard.type('Settings');
  
  // TODO: Press 'Enter'
});`,
    missionBrief: {
      context: "Test accessibility and power-user features by simulating real keyboard strokes.",
      objectives: [
        { id: 1, text: "Press `Control+K`" },
        { id: 2, text: "Type text" },
        { id: 3, text: "Press `Enter`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPress = /page\.keyboard\.press/.test(code);
      const hasType = /page\.keyboard\.type/.test(code);

      logs.push("✓ Test started");

      if (!hasPress || !hasType) {
        logs.push("✗ ERROR: Keyboard interactions missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Keyboard shortcuts fired");
      return { passed: true, logs };
    }
  },
  {
    id: "dialogs",
    title: "Alerts & Dialogs",
    description: "Handle native browser alerts.",
    difficulty: "Intermediate",
    icon: Activity,
    initialCode: `test('Confirm Delete', async ({ page }) => {
  await page.goto('/admin');
  
  // TODO: Setup dialog handler BEFORE the action
  // page.on('dialog', dialog => dialog.accept());
  
  await page.getByText('Delete All').click();
});`,
    missionBrief: {
      context: "Native alerts block the thread. You must set up a listener to handle them *before* they appear.",
      objectives: [
        { id: 1, text: "Listen to `dialog` event" },
        { id: 2, text: "Accept the dialog" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasListener = /page\.on\(['"]dialog['"]/.test(code);
      const hasAccept = /dialog\.accept\(\)/.test(code);

      logs.push("✓ Test started");

      if (!hasListener) {
        logs.push("✗ ERROR: Dialog listener missing.");
        logs.push("  ↳ Must be set up before the click!");
        return { passed: false, logs };
      }

      if (!hasAccept) {
        logs.push("✗ ERROR: Did not accept/dismiss dialog.");
        return { passed: false, logs };
      }

      logs.push("✓ Dialog handled gracefully");
      return { passed: true, logs };
    }
  },
  {
    id: "geolocation",
    title: "Geolocation",
    description: "Test location-based features by mocking coordinates.",
    difficulty: "Advanced",
    icon: Globe,
    initialCode: `test('Store Finder', async ({ context, page }) => {
  // TODO: Set geolocation to Times Square (40.758896, -73.985130)
  // await context.setGeolocation({ latitude: 40.758, longitude: -73.985 });
  
  // TODO: Grant permission
  // await context.grantPermissions(['geolocation']);
  
  await page.goto('/stores');
});`,
    missionBrief: {
      context: "Test how your app behaves in different cities without leaving your chair.",
      objectives: [
        { id: 1, text: "Set geolocation" },
        { id: 2, text: "Grant `geolocation` permission" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasGeo = /context\.setGeolocation/.test(code);
      const hasPerm = /grantPermissions/.test(code);

      logs.push("✓ Test started");

      if (!hasGeo) {
        logs.push("✗ ERROR: Geolocation not set.");
        return { passed: false, logs };
      }

      if (!hasPerm) {
        logs.push("✗ ERROR: Permission not granted.");
        logs.push("  ↳ Browser will block the location request without it.");
        return { passed: false, logs };
      }

      logs.push("✓ Location mocked successfully");
      return { passed: true, logs };
    }
  },
  {
    id: "request-headers",
    title: "Modifying Headers",
    description: "Inject custom headers (like Auth tokens) into requests.",
    difficulty: "Advanced",
    icon: Database,
    initialCode: `test('Authenticated API', async ({ page }) => {
  // TODO: Add 'Authorization' header to all requests
  // await page.setExtraHTTPHeaders({
  //   'Authorization': 'Bearer 123'
  // });
  
  await page.goto('/protected-route');
});`,
    missionBrief: {
      context: "Inject headers globally for the page to simulate authentication or other states.",
      objectives: [
        { id: 1, text: "Use `page.setExtraHTTPHeaders`" },
        { id: 2, text: "Add `Authorization` header" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasHeaders = /page\.setExtraHTTPHeaders/.test(code);
      const hasAuth = /Authorization/.test(code);

      logs.push("✓ Test started");

      if (!hasHeaders) {
        logs.push("✗ ERROR: Header injection missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Custom headers injected");
      return { passed: true, logs };
    }
  },
  {
    id: "tracing",
    title: "Trace Viewer",
    description: "Enable tracing for post-mortem debugging.",
    difficulty: "Beginner",
    icon: Search,
    initialCode: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // TODO: Enable tracing on failure
    // trace: 'on-first-retry',
  },
});`,
    missionBrief: {
      context: "The Trace Viewer is Playwright's superpower. It records DOM snapshots, console logs, and network for every step.",
      objectives: [
        { id: 1, text: "Set `trace: 'on-first-retry'` or `'retain-on-failure'`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasTrace = /trace:\s*['"](on|retain|on-first-retry)['"]/.test(code);

      logs.push("✓ Config loaded");

      if (!hasTrace) {
        logs.push("✗ ERROR: Trace config invalid.");
        return { passed: false, logs };
      }

      logs.push("✓ Tracing enabled");
      return { passed: true, logs };
    }
  },
  {
    id: "abort-request",
    title: "Abort Requests",
    description: "Block unwanted resources (like ads or analytics) to speed up tests.",
    difficulty: "Intermediate",
    icon: ShieldCheck,
    initialCode: `test('Block Ads', async ({ page }) => {
  // TODO: Block requests to google-analytics
  // await page.route('**/*google-analytics*', route => route.abort());
  
  await page.goto('/article');
});`,
    missionBrief: {
      context: "Speed up your tests and reduce noise by blocking 3rd party scripts.",
      objectives: [
        { id: 1, text: "Route analytics URL" },
        { id: 2, text: "Call `route.abort()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRoute = /page\.route/.test(code);
      const hasAbort = /route\.abort\(\)/.test(code);

      logs.push("✓ Test started");

      if (!hasRoute || !hasAbort) {
        logs.push("✗ ERROR: Route abort missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Resource blocked");
      return { passed: true, logs };
    }
  },
  {
    id: "console-logs",
    title: "Listen to Console",
    description: "Fail the test if the app throws a console error.",
    difficulty: "Intermediate",
    icon: Terminal,
    initialCode: `test('No Console Errors', async ({ page }) => {
  // TODO: Listen for console events
  // page.on('console', msg => {
  //   if (msg.type() === 'error') throw new Error(msg.text());
  // });
  
  await page.goto('/app');
});`,
    missionBrief: {
      context: "Ensure your app is clean. Fail the test instantly if any `console.error` occurs.",
      objectives: [
        { id: 1, text: "Listen to `console` event" },
        { id: 2, text: "Check `msg.type() === 'error'`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasListener = /page\.on\(['"]console['"]/.test(code);
      const hasErrorCheck = /msg\.type\(\)\s*===/.test(code);

      logs.push("✓ Test started");

      if (!hasListener) {
        logs.push("✗ ERROR: Console listener missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Console monitoring active");
      return { passed: true, logs };
    }
  },
  {
    id: "video",
    title: "Video Recording",
    description: "Record a video of the test execution.",
    difficulty: "Beginner",
    icon: Eye,
    initialCode: `// playwright.config.ts
export default defineConfig({
  use: {
    // TODO: Enable video recording
    // video: 'retain-on-failure',
  },
});`,
    missionBrief: {
      context: "See exactly what happened during the test execution.",
      objectives: [
        { id: 1, text: "Set `video: 'retain-on-failure'`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasVideo = /video:\s*['"]retain-on-failure['"]/.test(code);

      logs.push("✓ Config loaded");

      if (!hasVideo) {
        logs.push("✗ ERROR: Video config invalid.");
        return { passed: false, logs };
      }

      logs.push("✓ Video recording enabled");
      return { passed: true, logs };
    }
  },
  {
    id: "evaluate",
    title: "Evaluate JS",
    description: "Run JavaScript code inside the browser context.",
    difficulty: "Intermediate",
    icon: Code2,
    initialCode: `test('Read LocalStorage', async ({ page }) => {
  await page.goto('/app');
  
  // Playwright runs in Node. To access 'window' or 'document',
  // we must evaluate code in the browser page.
  
  // TODO: Get a value from localStorage
  // const token = await page.evaluate(() => window.localStorage.getItem('token'));
  
  // console.log(token);
});`,
    missionBrief: {
      context: "Access browser APIs (window, document, localStorage) using `page.evaluate()`.",
      objectives: [
        { id: 1, text: "Call `page.evaluate()`" },
        { id: 2, text: "Return localStorage item" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasEvaluate = /page\.evaluate\(/.test(code);
      const hasLocalStorage = /localStorage\.getItem/.test(code);

      logs.push("✓ Test started");

      if (!hasEvaluate) {
        logs.push("✗ ERROR: page.evaluate() missing.");
        return { passed: false, logs };
      }

      if (!hasLocalStorage) {
        logs.push("✗ ERROR: localStorage access missing.");
        return { passed: false, logs };
      }

      logs.push("✓ JS evaluated in browser context");
      return { passed: true, logs };
    }
  },
  {
    id: "full-screenshot",
    title: "Full Page Screenshot",
    description: "Capture the entire scrollable page.",
    difficulty: "Beginner",
    icon: Eye,
    initialCode: `test('Landing Page', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com');
  
  // TODO: Take a full page screenshot
  // await page.screenshot({ path: 'home.png', fullPage: true });
});`,
    missionBrief: {
      context: "Don't just capture the viewport. Get the whole page.",
      objectives: [
        { id: 1, text: "Set `fullPage: true`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFullPage = /fullPage:\s*true/.test(code);

      logs.push("✓ Test started");

      if (!hasFullPage) {
        logs.push("✗ ERROR: fullPage: true missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Full page captured");
      return { passed: true, logs };
    }
  },
  {
    id: "pdf",
    title: "Print to PDF",
    description: "Generate a PDF of the page (Headless Chrome only).",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `test('Invoice PDF', async ({ page }) => {
  await page.goto('/invoice/123');
  
  // TODO: Save page as PDF
  // await page.pdf({ path: 'invoice.pdf', format: 'A4' });
});`,
    missionBrief: {
      context: "Generate professional PDFs directly from your web pages.",
      objectives: [
        { id: 1, text: "Call `page.pdf(...)`" },
        { id: 2, text: "Set `format: 'A4'`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPdf = /page\.pdf\(/.test(code);
      const hasFormat = /format:\s*['"]A4['"]/.test(code);

      logs.push("✓ Test started");

      if (!hasPdf) {
        logs.push("✗ ERROR: page.pdf() missing.");
        return { passed: false, logs };
      }

      if (!hasFormat) {
        logs.push("✗ ERROR: Format A4 missing.");
        return { passed: false, logs };
      }

      logs.push("✓ PDF generated");
      return { passed: true, logs };
    }
  },
  {
    id: "locator-count",
    title: "Counting Elements",
    description: "Assert the number of matching elements.",
    difficulty: "Beginner",
    icon: List,
    initialCode: `test('Search Results', async ({ page }) => {
  await page.goto('/search?q=test');
  
  // TODO: Assert there are exactly 5 results
  // await expect(page.locator('.result-item')).toHaveCount(5);
});`,
    missionBrief: {
      context: "Verify list lengths using `toHaveCount()`.",
      objectives: [
        { id: 1, text: "Use `expect(...).toHaveCount(5)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasCount = /\.toHaveCount\(5\)/.test(code);

      logs.push("✓ Test started");

      if (!hasCount) {
        logs.push("✗ ERROR: toHaveCount(5) missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Element count verified");
      return { passed: true, logs };
    }
  },
  {
    id: "locator-all",
    title: "Iterating Locators",
    description: "Loop through all matching elements.",
    difficulty: "Intermediate",
    icon: Repeat,
    initialCode: `test('Checkbox Reset', async ({ page }) => {
  await page.goto('/settings');
  
  // TODO: Uncheck all checkboxes
  // const boxes = await page.locator('input[type="checkbox"]').all();
  // for (const box of boxes) {
  //   await box.uncheck();
  // }
});`,
    missionBrief: {
      context: "Use `locator.all()` to get an array of locators and loop through them.",
      objectives: [
        { id: 1, text: "Call `locator.all()`" },
        { id: 2, text: "Loop and uncheck" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasAll = /\.all\(\)/.test(code);
      const hasLoop = /for\s*\(.*of/.test(code);
      const hasUncheck = /\.uncheck\(\)/.test(code);

      logs.push("✓ Test started");

      if (!hasAll) {
        logs.push("✗ ERROR: locator.all() missing.");
        return { passed: false, logs };
      }

      if (!hasLoop) {
        logs.push("✗ ERROR: Loop missing.");
        return { passed: false, logs };
      }

      if (!hasUncheck) {
        logs.push("✗ ERROR: uncheck() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Iteration successful");
      return { passed: true, logs };
    }
  },
  {
    id: "bounding-box",
    title: "Bounding Box",
    description: "Get element coordinates and size.",
    difficulty: "Advanced",
    icon: Box,
    initialCode: `test('Canvas Size', async ({ page }) => {
  await page.goto('/paint');
  
  // TODO: Get bounding box of the canvas
  // const box = await page.locator('#canvas').boundingBox();
  
  // if (box) {
  //   console.log(box.width, box.height);
  // }
});`,
    missionBrief: {
      context: "Get x, y, width, and height of an element using `boundingBox()`.",
      objectives: [
        { id: 1, text: "Call `boundingBox()`" },
        { id: 2, text: "Log dimensions" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasBox = /\.boundingBox\(\)/.test(code);
      const hasLog = /console\.log/.test(code);

      logs.push("✓ Test started");

      if (!hasBox) {
        logs.push("✗ ERROR: boundingBox() missing.");
        return { passed: false, logs };
      }

      if (!hasLog) {
        logs.push("✗ ERROR: Logging missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Geometry retrieved");
      return { passed: true, logs };
    }
  },
  {
    id: "mouse",
    title: "Mouse Actions",
    description: "Simulate complex mouse movements (Drawing).",
    difficulty: "Advanced",
    icon: MousePointerClick,
    initialCode: `test('Draw Line', async ({ page }) => {
  await page.goto('/paint');
  
  // TODO: Draw a line from (100,100) to (200,200)
  // await page.mouse.move(100, 100);
  // await page.mouse.down();
  // await page.mouse.move(200, 200);
  // await page.mouse.up();
});`,
    missionBrief: {
      context: "Perform low-level mouse operations for canvas or drag-and-drop.",
      objectives: [
        { id: 1, text: "Move to start" },
        { id: 2, text: "Mouse down" },
        { id: 3, text: "Move to end" },
        { id: 4, text: "Mouse up" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasMove = /page\.mouse\.move/.test(code);
      const hasDown = /page\.mouse\.down/.test(code);
      const hasUp = /page\.mouse\.up/.test(code);

      logs.push("✓ Test started");

      if (!hasMove || !hasDown || !hasUp) {
        logs.push("✗ ERROR: Incomplete mouse sequence.");
        return { passed: false, logs };
      }

      logs.push("✓ Drawing simulated");
      return { passed: true, logs };
    }
  },
  {
    id: "soft-assertions",
    title: "Soft Assertions",
    description: "Don't fail the test immediately on error.",
    difficulty: "Intermediate",
    icon: ShieldCheck,
    initialCode: `test('Multiple Checks', async ({ page }) => {
  await page.goto('/form');
  
  // Standard expect fails immediately.
  // TODO: Use soft assertions to check multiple fields
  
  // await expect.soft(page.locator('#name')).toHaveText('John');
  // await expect.soft(page.locator('#age')).toHaveText('30');
});`,
    missionBrief: {
      context: "Collect multiple failures in one test run using `expect.soft()`.",
      objectives: [
        { id: 1, text: "Use `expect.soft(...)`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSoft = /expect\.soft\(/.test(code);

      logs.push("✓ Test started");

      if (!hasSoft) {
        logs.push("✗ ERROR: expect.soft() missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Soft assertions active");
      return { passed: true, logs };
    }
  }
];
