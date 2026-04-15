import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search, List, CheckSquare, Eye, Upload, Database, Globe, Layers, Repeat, Variable, Timer, Monitor, History, HardDrive, Box, Link, Play, Clipboard, Shield, FileCheck, MessageSquare, ScrollText, Phone, Camera, Workflow, Footprints, BarChart3, Accessibility, GitBranch, Palette, Settings, Bug, FileText, Network, Gauge, Filter, Tag, Wrench, Cookie, Navigation, Maximize, Focus, MapPin } from "lucide-react";

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
    initialCode: `test('Resilient Selectors', async ({ page }) => {
  await page.goto('/playground/auth');

  // TODO: Replace these fragile selectors with resilient data-testid selectors.
  // Fragile selectors break when the design changes.
  
  // Fragile: relying on layout structure
  await page.locator('form > div:nth-child(2) > input').fill('admin');
  
  // Fragile: relying on placeholder text (better, but still fragile)
  await page.locator('[placeholder="••••••••"]').fill('password123');
  
  // Fragile: relying on button text
  await page.getByText('Sign In').click();
});`,
    missionBrief: {
      context: "User-facing attributes like text can change. CSS classes are for styling. Use `data-testid` for stability.",
      objectives: [
        { id: 1, text: "Use `page.getByTestId('input-username')`" },
        { id: 2, text: "Use `page.getByTestId('input-password')`" },
        { id: 3, text: "Use `page.getByTestId('btn-login')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasUsername = code.includes("input-username");
      const hasPassword = code.includes("input-password");
      const hasSubmit = code.includes("btn-login");

      logs.push("✓ Test started");

      if (!hasUsername) {
        logs.push("✗ ERROR: Fragile locator for username.");
        logs.push("  ↳ Recommendation: page.getByTestId('input-username')");
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
    initialCode: `test('Auto-waiting', async ({ page }) => {
  await page.goto('/playground/api');
  
  await page.getByTestId('btn-get-users').click();

  // TODO: Playwright automatically waits for elements to be actionable.
  // Remove the manual wait.
  await page.waitForTimeout(5000); 
  
  // TODO: Assert visibility directly. 
  // Playwright assertions retry automatically.
  // The user row has data-testid="user-row-1"
  const row = page.getByTestId('user-row-1');
  if (await row.isVisible()) {
      console.log('Visible');
  }
});`,
    missionBrief: {
      context: "Don't hardcode waits (`waitForTimeout`). Playwright's web-first assertions invoke auto-waiting mechanism.",
      objectives: [
        { id: 1, text: "Remove `waitForTimeout`" },
        { id: 2, text: "Use `await expect(locator).toBeVisible()`" }
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
    initialCode: `test('Data Grid Budget', async ({ page }) => {
  await page.goto('/playground/data');
  
  // Cypress needs aliases. Playwright uses const/let.
  
  // TODO: Get the text from the budget cell of the first row
  // Use locator.innerText()
  // Selector: [data-testid="row-1"] td:nth-child(5)
  
  // TODO: Store it in a variable named 'budgetText'
  
  // TODO: Log it to console
});`,
    missionBrief: {
      context: "No need for special aliases or `.then()`. Playwright runs inside standard Node.js, so you can use standard variables.",
      objectives: [
        { id: 1, text: "Use `const budgetText = await ...innerText()`" },
        { id: 2, text: "Console log the variable" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasVar = /const\s+budgetText\s*=\s*await/.test(code);
      const hasLog = /console\.log\(.*budgetText.*\)/.test(code);

      logs.push("✓ Test started");

      if (!hasVar) {
        logs.push("✗ ERROR: Variable definition missing.");
        logs.push("  ↳ use: const budgetText = await page.locator(...).innerText()");
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
    initialCode: `test('Data Filter', async ({ page }) => {
  await page.goto('/playground/data');
  
  // TODO: Select 'Active' from the status filter dropdown
  // Note: The playground uses a custom select (Shadcn UI) which requires clicks.
  // But for this lesson, let's assume a standard <select> exists for 'Native Select' practice.
  // Or we can simulate selecting from the API zone's role selector which IS a select in some modes.
  
  // Let's pretend there is a standard select with id="#status-select"
  
  // Incorrect:
  await page.locator('#status-select').click();
  await page.locator('option').filter({ hasText: 'Active' }).click();
});`,
    missionBrief: {
      context: "For standard `<select>` elements, use the specialized `selectOption` method.",
      objectives: [
        { id: 1, text: "Use `.selectOption('Active')`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSelect = /\.selectOption\(['"](Active|Pending|Failed)['"]\)/.test(code);
      const hasClick = /\.click\(\)/.test(code);

      logs.push("✓ Test started");

      if (hasClick) {
        logs.push("⚠ WARN: Don't use .click() on select elements.");
      }

      if (!hasSelect) {
        logs.push("✗ ERROR: selectOption missing.");
        logs.push("  ↳ Expected: await page.locator('#status-select').selectOption('Active')");
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
// You can run: npx playwright codegen localhost:5000/playground

test('Generated Test', async ({ page }) => {
  // TODO: Paste "generated" code here to simulate the experience
  // 1. Go to /playground
  // 2. Click "Authentication Zone"
  // 3. Assert header "Authentication Zone" is visible
});`,
    missionBrief: {
      context: "While we can't run codegen in the browser, write the code that codegen WOULD generate for visiting the Auth Zone.",
      objectives: [
        { id: 1, text: "Navigate to `/playground`" },
        { id: 2, text: "Click 'Authentication Zone' link" },
        { id: 3, text: "Assert heading is visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClick = /click\(['"]Authentication Zone['"]\)/.test(code) || /getByRole\(['"]link['"],\s*{\s*name:\s*['"]Authentication Zone['"]\s*}\)\.click/.test(code);

      logs.push("✓ Test started");

      if (!hasClick) {
        logs.push("✗ ERROR: Click on 'Authentication Zone' missing.");
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
  // We can simulate a new window opening by using a target="_blank" link
  // Let's assume the "Export CSV" button in Data Zone opens a new tab (it doesn't really, but let's pretend for the lab)
  
  await page.goto('/playground/data');
  
  // TODO: Clicking this link opens a new tab
  // We need to wait for the 'page' event on the context
  
  const pagePromise = context.waitForEvent('page');
  
  // Let's pretend this button opens a new tab
  await page.getByTestId('btn-export').click(); 
  
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
    initialCode: `test('Mock API', async ({ page }) => {
  // TODO: Intercept the GET request to /api/users
  // and fulfill it with mock data
  
  // await page.route('**/api/users', route => {
  //   route.fulfill({
  //     status: 200,
  //     contentType: 'application/json',
  //     body: JSON.stringify([{ id: 1, name: "Mock User" }])
  //   });
  // });

  await page.goto('/playground/api');
  await page.getByTestId('btn-get-users').click();
  
  // Verify UI shows mock data
});`,
    missionBrief: {
      context: "Backend down? Test isolated components by mocking API responses with `page.route()`.",
      objectives: [
        { id: 1, text: "Call `page.route('**/api/users', ...)`" },
        { id: 2, text: "Call `route.fulfill()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRoute = /page\.route\(['"]\*\*\/api\/users['"]/.test(code);
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
  // URL: /api/users
  
  // const response = await request.post(...)
  
  // TODO: Assert status is 200/201
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
    initialCode: `test('Frames', async ({ page }) => {
  await page.goto('/playground/interactions');
  
  // TODO: Helper to frame
  // const frame = page.frameLocator('#payment-frame');
  
  // TODO: Type into input inside frame
  // await frame.getByTestId('input-card').fill('424242424242');
});`,
    missionBrief: {
      context: "Interact with elements inside iframes using `frameLocator`.",
      objectives: [
        { id: 1, text: "Create `frameLocator('#payment-frame')`" },
        { id: 2, text: "Interact with elements inside it" }
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
    initialCode: `test('Save Storage State', async ({ page }) => {
  // TODO: Perform login
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();
  
  // Verify login success
  await expect(page.getByTestId('alert-success')).toBeVisible();

  // TODO: Save storage state to 'auth.json'
  // await page.context().storageState(...)
});`,
    missionBrief: {
      context: "Login once, reuse everywhere. Save your authentication state (cookies, localStorage) to a file.",
      objectives: [
        { id: 1, text: "Login successfully" },
        { id: 2, text: "Call `storageState({ path: 'auth.json' })`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasStorage = /storageState\(\s*{\s*path:\s*['"]auth\.json['"]\s*}\s*\)/.test(code); // Updated to auth.json

      logs.push("✓ Setup started");

      if (!hasStorage) {
        logs.push("✗ ERROR: Storage state not saved.");
        logs.push("  ↳ Expected: page.context().storageState({ path: 'auth.json' })");
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
    initialCode: `test('Visual Regression', async ({ page }) => {
  await page.goto('/playground/auth');
  
  // TODO: Compare screenshot with baseline
  // await expect(page).toHaveScreenshot('landing-page.png');
});`,
    missionBrief: {
      context: "Catch UI regressions by comparing screenshots pixel-by-pixel against a baseline.",
      objectives: [
        { id: 1, text: "Call `expect(page).toHaveScreenshot()`" }
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
    initialCode: `test('Mobile View', async ({ page }) => {
  // TODO: Emulate iPhone 12 Pro
  // This is usually done in playwright.config.ts, 
  // but we can override viewport here.
  
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/playground/auth');
  
  // Check if tabs list is visible (it should be on mobile too)
  await expect(page.locator('[role="tablist"]')).toBeVisible();
});`,
    missionBrief: {
      context: "Test responsive designs by setting the viewport size.",
      objectives: [
        { id: 1, text: "Set viewport to mobile size" },
        { id: 2, text: "Verify mobile layout elements" }
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
    initialCode: `test('Download File', async ({ page }) => {
  await page.goto('/playground/data');
  
  // TODO: Wait for download event
  const downloadPromise = page.waitForEvent('download');
  
  // TODO: Click button that triggers download
  await page.getByTestId('btn-export').click();
  
  const download = await downloadPromise;
  
  // TODO: Save to disk or verify
  // await download.saveAs(...)
});`,
    missionBrief: {
      context: "Handle file downloads by waiting for the 'download' event.",
      objectives: [
        { id: 1, text: "Create `waitForEvent('download')` promise" },
        { id: 2, text: "Click download link" },
        { id: 3, text: "Await promise" }
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
    initialCode: `test('Keyboard Shortcuts', async ({ page }) => {
  await page.goto('/playground/interactions');
  
  // TODO: Focus the editor area
  await page.getByTestId('input-keyboard').focus();
  
  // TODO: Press Control+K to trigger command palette
  await page.keyboard.press('Control+K');
  
  // TODO: Type 'Hello'
  // await page.keyboard.type('Hello');
});`,
    missionBrief: {
      context: "Simulate real keyboard usage, including shortcuts and typing.",
      objectives: [
        { id: 1, text: "Focus element" },
        { id: 2, text: "Press 'Control+K'" },
        { id: 3, text: "Type text" }
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
    initialCode: `test('Dialog Handling', async ({ page }) => {
  await page.goto('/playground/interactions');
  
  // TODO: Setup a dialog handler BEFORE triggering it
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept();
  });
  
  // TODO: Trigger the confirm dialog
  await page.getByTestId('btn-confirm').click();
});`,
    missionBrief: {
      context: "Native dialogs (alert, confirm, prompt) block execution. Handle them with `page.on('dialog')`.",
      objectives: [
        { id: 1, text: "Register `page.on('dialog')` listener" },
        { id: 2, text: "Accept or dismiss the dialog" }
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
    initialCode: `test('Geolocation', async ({ page }) => {
  // TODO: Grant permissions
  await page.context().grantPermissions(['geolocation']);
  
  // TODO: Set Geolocation to London
  // await page.context().setGeolocation({ latitude: 51.5074, longitude: -0.1278 });
  
  await page.goto('/playground/interactions');
});`,
    missionBrief: {
      context: "Test location-based features by mocking the Geolocation API.",
      objectives: [
        { id: 1, text: "Grant 'geolocation' permission" },
        { id: 2, text: "Set specific coordinates" }
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
    initialCode: `test('Abort Request', async ({ page }) => {
  // TODO: Block requests to specific endpoints
  // await page.route('**/api/users', route => route.abort());
  
  await page.goto('/playground/api');
});`,
    missionBrief: {
      context: "Speed up tests or simulate network failures by aborting requests.",
      objectives: [
        { id: 1, text: "Route URL" },
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
    initialCode: `test('Record Video', async ({ page }) => {
  // Video recording is set in config
  // use: { video: 'on' }
  
  await page.goto('/playground/interactions');
  await page.getByTestId('draggable-item').hover();
  await page.getByTestId('btn-hover').hover();
  
  // Artifact is saved to test-results/
});`,
    missionBrief: {
      context: "See what the user saw. Record a video of the test execution.",
      objectives: [
        { id: 1, text: "Enable `video: 'on'` in config" },
        { id: 2, text: "Inspect the `.webm` file" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasVideo = /video:\s*['"]retain-on-failure['"]/.test(code); // This validation is for the config, not the test code.

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
    initialCode: `test('Evidence', async ({ page }) => {
  await page.goto('/playground/data');
  
  // TODO: Take a full page screenshot
  // await page.screenshot(...)
  
  // TODO: Element screenshot
  // await page.locator('.card').first().screenshot(...)
});`,
    missionBrief: {
      context: "Capture the moment of failure or verify visual layout with screenshots.",
      objectives: [
        { id: 1, text: "Full page: `screenshot({ path: 'full.png', fullPage: true })`" },
        { id: 2, text: "Element: `locator(...).screenshot({ path: 'el.png' })`" }
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
    initialCode: `test('PDF Export', async ({ page }) => {
  await page.goto('/playground/data');
  
  // TODO: Save page as PDF
  // await page.pdf({ path: 'invoice.pdf', format: 'A4' });
});`,
    missionBrief: {
      context: "Generate professional PDFs directly from your web pages (Headless mode only).",
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
        logs.push("✗ ERROR: Uncheck missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Iteration logic verified");
      return { passed: true, logs };
    }
  },
  {
    id: "bounding-box",
    title: "Bounding Box",
    description: "Get element coordinates and size.",
    difficulty: "Advanced",
    icon: Box,
    initialCode: `test('Bounding Box', async ({ page }) => {
  await page.goto('/playground/interactions');
  
  // TODO: Get bounding box of the canvas
  // const box = await page.locator('[data-testid="drawing-canvas"]').boundingBox();
  
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
    initialCode: `test('Mouse Actions', async ({ page }) => {
  await page.goto('/playground/interactions');
  
  // TODO: Locate the canvas
  // Element: [data-testid="drawing-canvas"]
  
  await page.getByTestId('drawing-canvas').click({
     position: { x: 50, y: 50 }
  });
  
  // TODO: Perform a mouse down, move, and up
  // await page.mouse.move(100, 100);
  // await page.mouse.down();
});`,
    missionBrief: {
      context: "Perform precise mouse movements, clicks, and drags using the Mouse API.",
      objectives: [
        { id: 1, text: "Click specific coordinates" },
        { id: 2, text: "Draw on canvas" }
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
  },
  {
    id: "file-upload",
    title: "File Uploads",
    description: "Upload files using `locator.setInputFiles()`.",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `test('File Upload', async ({ page }) => {
  await page.goto('/playground/data');
  
  // TODO: Set input files
  // Input: [data-testid="input-upload"]
  
  await page.setInputFiles('[data-testid="input-upload"]', {
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Hello World')
  });
});`,
    missionBrief: {
      context: "Upload files easily with `setInputFiles`. You can even create buffers on the fly.",
      objectives: [
        { id: 1, text: "Select input" },
        { id: 2, text: "Pass file object (path or buffer)" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSetInput = /\.setInputFiles\(/.test(code);

      logs.push("✓ Test started");

      if (!hasSetInput) {
        logs.push("✗ ERROR: setInputFiles missing.");
        return { passed: false, logs };
      }

      logs.push("✓ File upload simulated");
      return { passed: true, logs };
    }
  },
  {
    id: "clipboard",
    title: "Clipboard Access",
    description: "Read/Write clipboard content (requires permissions).",
    difficulty: "Advanced",
    icon: Clipboard,
    initialCode: `test('Copy Code', async ({ page, context }) => {
  // Clipboard access requires permission
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  await page.goto('/playground/interactions');
  
  // TODO: Click Copy button
  await page.getByTestId('btn-copy').click();
  
  // TODO: Verify clipboard content
  // const content = await page.evaluate(() => navigator.clipboard.readText());
  // expect(content).toBe('AB-123');
});`,
    missionBrief: {
      context: "Headless browsers restrict clipboard access. Grant permissions first.",
      objectives: [
        { id: 1, text: "Grant `clipboard-read`" },
        { id: 2, text: "Assert `navigator.clipboard.readText()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPerm = /grantPermissions/.test(code);
      const hasRead = /navigator\.clipboard\.readText/.test(code);

      logs.push("✓ Test started");

      if (!hasPerm) {
        logs.push("✗ ERROR: Permissions missing.");
        return { passed: false, logs };
      }

      if (!hasRead) {
        logs.push("✗ ERROR: Clipboard read verification missing.");
        return { passed: false, logs };
      }

      logs.push("✓ Clipboard verified");
      return { passed: true, logs };
    }
  },
  {
    id: "kyc-onboarding",
    title: "KYC Onboarding Flow",
    description: "Test a multi-step KYC wizard from personal info to document upload.",
    difficulty: "Advanced",
    icon: Shield,
    initialCode: `test('KYC Onboarding Flow', async ({ page }) => {
  await page.goto('/playground/kyc');

  // Step 1: Personal Info
  // TODO: Fill full name
  // await page.getByTestId('input-fullname').fill('Jane Doe');
  // TODO: Fill date of birth
  // await page.getByTestId('input-dob').fill('1990-05-15');
  // TODO: Fill phone number
  // await page.getByTestId('input-phone').fill('+1234567890');
  // TODO: Click Next
  // await page.getByTestId('btn-next').click();

  // Step 2: Address
  // TODO: Fill street address
  // await page.getByTestId('input-street').fill('123 Main St');
  // TODO: Fill city
  // await page.getByTestId('input-city').fill('Springfield');
  // TODO: Select country from dropdown
  // await page.getByTestId('select-country').selectOption('US');
  // TODO: Click Next
  // await page.getByTestId('btn-next').click();

  // Step 3: Document Upload
  // TODO: Upload a document file
  // await page.getByTestId('input-doc-upload').setInputFiles('path/to/doc.pdf');
  // TODO: Click Next
  // await page.getByTestId('btn-next').click();

  // Step 4: Review & Submit
  // TODO: Click Submit
  // await page.getByTestId('btn-submit-kyc').click();
});`,
    missionBrief: {
      context: "Multi-step wizards require navigating through each step sequentially. Each step must be completed before proceeding.",
      objectives: [
        { id: 1, text: "Fill personal info fields (fullname, dob, phone)" },
        { id: 2, text: "Navigate to address step using btn-next" },
        { id: 3, text: "Fill address fields and select country" },
        { id: 4, text: "Navigate to upload step and upload document" },
        { id: 5, text: "Submit the KYC form with btn-submit-kyc" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFullname = /input-fullname/.test(code);
      const hasStreet = /input-street/.test(code);
      const hasCountry = /select-country|selectOption/.test(code);
      const hasNext = /btn-next/.test(code);
      const hasSubmit = /btn-submit-kyc/.test(code);

      logs.push("✓ Test started");

      if (!hasFullname) {
        logs.push("✗ ERROR: Missing fullname field.");
        logs.push("  ↳ Use page.getByTestId('input-fullname')");
        return { passed: false, logs };
      }

      if (!hasStreet) {
        logs.push("✗ ERROR: Missing street address field.");
        logs.push("  ↳ Use page.getByTestId('input-street')");
        return { passed: false, logs };
      }

      if (!hasCountry) {
        logs.push("✗ ERROR: Missing country selection.");
        logs.push("  ↳ Use page.getByTestId('select-country').selectOption(...)");
        return { passed: false, logs };
      }

      if (!hasNext) {
        logs.push("✗ ERROR: Missing next button navigation.");
        logs.push("  ↳ Use page.getByTestId('btn-next').click()");
        return { passed: false, logs };
      }

      if (!hasSubmit) {
        logs.push("✗ ERROR: Missing KYC submit button.");
        logs.push("  ↳ Use page.getByTestId('btn-submit-kyc').click()");
        return { passed: false, logs };
      }

      logs.push("✓ All KYC steps completed");
      return { passed: true, logs };
    }
  },
  {
    id: "otp-verification",
    title: "OTP Verification",
    description: "Test OTP input fields, auto-focus behavior, and resend countdown.",
    difficulty: "Intermediate",
    icon: Phone,
    initialCode: `test('OTP Verification', async ({ page }) => {
  await page.goto('/playground/kyc');

  // TODO: Fill each OTP digit field (1-4)
  // The OTP code is "1234"
  // await page.getByTestId('otp-digit-1').fill('1');
  // await page.getByTestId('otp-digit-2').fill('2');
  // await page.getByTestId('otp-digit-3').fill('3');
  // await page.getByTestId('otp-digit-4').fill('4');

  // TODO: Click verify button
  // await page.getByTestId('btn-verify-otp').click();

  // TODO: Assert success message is visible
  // await expect(page.getByTestId('otp-success')).toBeVisible();
});`,
    missionBrief: {
      context: "OTP fields often auto-focus to the next input. Test each digit individually and verify the complete flow.",
      objectives: [
        { id: 1, text: "Fill each OTP digit (otp-digit-1 through otp-digit-4)" },
        { id: 2, text: "Click the verify button (btn-verify-otp)" },
        { id: 3, text: "Assert the success message (otp-success) is visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasDigit1 = /otp-digit-1/.test(code);
      const hasDigit4 = /otp-digit-4/.test(code);
      const hasVerify = /btn-verify-otp/.test(code);
      const hasSuccess = /otp-success/.test(code);

      logs.push("✓ Test started");

      if (!hasDigit1) {
        logs.push("✗ ERROR: Missing first OTP digit.");
        logs.push("  ↳ Use page.getByTestId('otp-digit-1').fill('1')");
        return { passed: false, logs };
      }

      if (!hasDigit4) {
        logs.push("✗ ERROR: Missing fourth OTP digit.");
        logs.push("  ↳ Use page.getByTestId('otp-digit-4').fill('4')");
        return { passed: false, logs };
      }

      if (!hasVerify) {
        logs.push("✗ ERROR: Missing verify button click.");
        logs.push("  ↳ Use page.getByTestId('btn-verify-otp').click()");
        return { passed: false, logs };
      }

      if (!hasSuccess) {
        logs.push("✗ ERROR: Missing success assertion.");
        logs.push("  ↳ Assert page.getByTestId('otp-success') is visible");
        return { passed: false, logs };
      }

      logs.push("✓ OTP verification complete");
      return { passed: true, logs };
    }
  },
  {
    id: "video-kyc",
    title: "Video KYC Session",
    description: "Test a simulated Video KYC flow: start call, wait for agent, capture selfie.",
    difficulty: "Advanced",
    icon: Camera,
    initialCode: `test('Video KYC Session', async ({ page }) => {
  await page.goto('/playground/kyc');

  // TODO: Click the start video call button
  // await page.getByTestId('btn-start-video').click();

  // TODO: Wait for the agent to join (text "Agent Joined" appears)
  // await expect(page.getByText('Agent Joined')).toBeVisible();

  // TODO: Capture a selfie
  // await page.getByTestId('btn-capture-selfie').click();

  // TODO: Assert selfie was captured
  // await expect(page.getByTestId('selfie-status')).toContainText('Captured');

  // TODO: End the call
  // await page.getByTestId('btn-end-call').click();
});`,
    missionBrief: {
      context: "Video KYC involves real-time interactions. Test the full flow from starting a call to ending it after verification.",
      objectives: [
        { id: 1, text: "Start the video call with btn-start-video" },
        { id: 2, text: "Wait for 'Agent Joined' status text" },
        { id: 3, text: "Capture selfie with btn-capture-selfie" },
        { id: 4, text: "End the call with btn-end-call" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasStartVideo = /btn-start-video/.test(code);
      const hasAgentJoined = /Agent Joined/.test(code);
      const hasCaptureSelfie = /btn-capture-selfie/.test(code);
      const hasSelfieStatus = /selfie-status/.test(code);
      const hasEndCall = /btn-end-call/.test(code);

      logs.push("✓ Test started");

      if (!hasStartVideo) {
        logs.push("✗ ERROR: Missing start video button.");
        logs.push("  ↳ Use page.getByTestId('btn-start-video').click()");
        return { passed: false, logs };
      }

      if (!hasAgentJoined) {
        logs.push("✗ ERROR: Missing agent joined check.");
        logs.push("  ↳ Wait for text 'Agent Joined' to appear");
        return { passed: false, logs };
      }

      if (!hasCaptureSelfie) {
        logs.push("✗ ERROR: Missing selfie capture.");
        logs.push("  ↳ Use page.getByTestId('btn-capture-selfie').click()");
        return { passed: false, logs };
      }

      if (!hasSelfieStatus) {
        logs.push("✗ ERROR: Missing selfie status assertion.");
        logs.push("  ↳ Assert page.getByTestId('selfie-status') contains 'Captured'");
        return { passed: false, logs };
      }

      if (!hasEndCall) {
        logs.push("✗ ERROR: Missing end call button.");
        logs.push("  ↳ Use page.getByTestId('btn-end-call').click()");
        return { passed: false, logs };
      }

      logs.push("✓ Video KYC session complete");
      return { passed: true, logs };
    }
  },
  {
    id: "iframe-communication",
    title: "iframe Widget Communication",
    description: "Test cross-frame communication using postMessage between parent and iframe.",
    difficulty: "Advanced",
    icon: MessageSquare,
    initialCode: `test('iframe Widget Communication', async ({ page }) => {
  await page.goto('/playground/kyc');

  // TODO: Access the iframe using frameLocator
  // const widget = page.frameLocator('#kyc-widget-frame');

  // TODO: Fill the widget input inside the iframe
  // await widget.getByTestId('widget-input-name').fill('Jane Doe');

  // TODO: Click send inside the iframe
  // await widget.getByTestId('btn-widget-send').click();

  // TODO: Assert parent page received the data
  // await expect(page.getByTestId('received-data')).toContainText('Jane Doe');

  // TODO: Send data from parent to widget
  // await page.getByTestId('btn-send-to-widget').click();
  // await expect(widget.getByTestId('widget-received')).toBeVisible();
});`,
    missionBrief: {
      context: "iframes create isolated browsing contexts. Use frameLocator to interact with elements inside an iframe and test postMessage communication.",
      objectives: [
        { id: 1, text: "Access the iframe using page.frameLocator()" },
        { id: 2, text: "Fill the widget input (widget-input-name) inside the iframe" },
        { id: 3, text: "Verify parent page receives data (received-data)" },
        { id: 4, text: "Send a message from parent to widget (btn-send-to-widget)" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFrameLocator = /frameLocator/.test(code);
      const hasWidgetInput = /widget-input-name/.test(code);
      const hasReceivedData = /received-data/.test(code);
      const hasSendToWidget = /btn-send-to-widget/.test(code);

      logs.push("✓ Test started");

      if (!hasFrameLocator) {
        logs.push("✗ ERROR: Missing frameLocator for iframe access.");
        logs.push("  ↳ Use page.frameLocator('#kyc-widget-frame')");
        return { passed: false, logs };
      }

      if (!hasWidgetInput) {
        logs.push("✗ ERROR: Missing widget input interaction.");
        logs.push("  ↳ Fill widget.getByTestId('widget-input-name')");
        return { passed: false, logs };
      }

      if (!hasReceivedData) {
        logs.push("✗ ERROR: Missing parent data verification.");
        logs.push("  ↳ Assert page.getByTestId('received-data') has expected text");
        return { passed: false, logs };
      }

      if (!hasSendToWidget) {
        logs.push("✗ ERROR: Missing parent-to-widget communication.");
        logs.push("  ↳ Use page.getByTestId('btn-send-to-widget').click()");
        return { passed: false, logs };
      }

      logs.push("✓ iframe communication verified");
      return { passed: true, logs };
    }
  },
  {
    id: "doc-upload-status",
    title: "Document Upload & Status Polling",
    description: "Upload a document and poll for verification status changes.",
    difficulty: "Intermediate",
    icon: Upload,
    initialCode: `test('Document Upload & Status Polling', async ({ page }) => {
  await page.goto('/playground/kyc');

  // TODO: Upload a document file
  // await page.getByTestId('input-doc-upload').setInputFiles('path/to/document.pdf');

  // TODO: Wait for status to change from "Uploading..." to "Verifying..."
  // await expect(page.getByTestId('upload-status')).toContainText('Verifying...');

  // TODO: Wait for final status "Verified ✓"
  // await expect(page.getByTestId('upload-status')).toContainText('Verified');
});`,
    missionBrief: {
      context: "File uploads often trigger async status changes. Use Playwright's auto-retrying assertions to poll for status transitions.",
      objectives: [
        { id: 1, text: "Upload a file using setInputFiles on input-doc-upload" },
        { id: 2, text: "Wait for the upload-status to show 'Verified'" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasUploadInput = /input-doc-upload/.test(code);
      const hasSetInputFiles = /setInputFiles/.test(code);
      const hasStatus = /upload-status/.test(code);
      const hasVerified = /Verified/.test(code);

      logs.push("✓ Test started");

      if (!hasUploadInput) {
        logs.push("✗ ERROR: Missing document upload input.");
        logs.push("  ↳ Use page.getByTestId('input-doc-upload')");
        return { passed: false, logs };
      }

      if (!hasSetInputFiles) {
        logs.push("✗ ERROR: Missing setInputFiles call.");
        logs.push("  ↳ Use .setInputFiles('path/to/file')");
        return { passed: false, logs };
      }

      if (!hasStatus) {
        logs.push("✗ ERROR: Missing upload status check.");
        logs.push("  ↳ Assert page.getByTestId('upload-status')");
        return { passed: false, logs };
      }

      if (!hasVerified) {
        logs.push("✗ ERROR: Missing verified status assertion.");
        logs.push("  ↳ Assert status contains 'Verified'");
        return { passed: false, logs };
      }

      logs.push("✓ Document upload and status verified");
      return { passed: true, logs };
    }
  },
  {
    id: "consent-scroll",
    title: "Consent & Scroll Gating",
    description: "Scroll a terms box to the bottom to unlock a consent checkbox.",
    difficulty: "Intermediate",
    icon: ScrollText,
    initialCode: `test('Consent & Scroll Gating', async ({ page }) => {
  await page.goto('/playground/kyc');

  // The consent checkbox is disabled until the terms box is scrolled to the bottom

  // TODO: Scroll the terms box to the bottom
  // await page.getByTestId('terms-box').evaluate(
  //   (el) => el.scrollTop = el.scrollHeight
  // );

  // TODO: Check the consent checkbox (now enabled)
  // await page.getByTestId('checkbox-consent').check();

  // TODO: Click accept terms button
  // await page.getByTestId('btn-accept-terms').click();
});`,
    missionBrief: {
      context: "Some forms require users to scroll through terms before enabling a checkbox. Use evaluate() to programmatically scroll an element.",
      objectives: [
        { id: 1, text: "Scroll the terms-box to the bottom using evaluate or scrollTop" },
        { id: 2, text: "Check the checkbox-consent checkbox" },
        { id: 3, text: "Click btn-accept-terms to submit" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasTermsBox = /terms-box/.test(code);
      const hasScroll = /evaluate|scrollTop/.test(code);
      const hasCheckbox = /checkbox-consent/.test(code);
      const hasAccept = /btn-accept-terms/.test(code);

      logs.push("✓ Test started");

      if (!hasTermsBox) {
        logs.push("✗ ERROR: Missing terms box locator.");
        logs.push("  ↳ Use page.getByTestId('terms-box')");
        return { passed: false, logs };
      }

      if (!hasScroll) {
        logs.push("✗ ERROR: Missing scroll logic.");
        logs.push("  ↳ Use .evaluate(el => el.scrollTop = el.scrollHeight)");
        return { passed: false, logs };
      }

      if (!hasCheckbox) {
        logs.push("✗ ERROR: Missing consent checkbox.");
        logs.push("  ↳ Use page.getByTestId('checkbox-consent').check()");
        return { passed: false, logs };
      }

      if (!hasAccept) {
        logs.push("✗ ERROR: Missing accept button.");
        logs.push("  ↳ Use page.getByTestId('btn-accept-terms').click()");
        return { passed: false, logs };
      }

      logs.push("✓ Consent flow completed");
      return { passed: true, logs };
    }
  },
  {
    id: "page-object-model",
    title: "Page Object Model",
    description: "Refactor raw locators into a structured Page Object class.",
    difficulty: "Advanced",
    icon: Workflow,
    initialCode: `// TODO: Extract this into a LoginPage class
// class LoginPage {
//   constructor(private page: Page) {}
//   async goto() { await this.page.goto('/playground/auth'); }
//   async login(user: string, pass: string) {
//     await this.page.getByTestId('input-username').fill(user);
//     await this.page.getByTestId('input-password').fill(pass);
//     await this.page.getByTestId('btn-login').click();
//   }
// }

test('Login with Page Object', async ({ page }) => {
  // Raw locators — refactor these into the LoginPage class above
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();

  // TODO: Replace the above with:
  // const loginPage = new LoginPage(page);
  // await loginPage.goto();
  // await loginPage.login('admin', 'password123');
});`,
    missionBrief: {
      context: "Page Object Model encapsulates page interactions in a class, making tests more readable and maintainable.",
      objectives: [
        { id: 1, text: "Create a LoginPage class with a page property" },
        { id: 2, text: "Add a goto() method that navigates to the auth page" },
        { id: 3, text: "Add an async login() method that fills credentials and clicks login" },
        { id: 4, text: "Use the LoginPage in the test instead of raw locators" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasClass = /class\s+LoginPage/.test(code);
      const hasThisPage = /this\.page/.test(code);
      const hasFill = /\.fill\(/.test(code);
      const hasAsyncLogin = /async\s+login/.test(code);

      logs.push("✓ Test started");

      if (!hasClass) {
        logs.push("✗ ERROR: Missing LoginPage class.");
        logs.push("  ↳ Define: class LoginPage { ... }");
        return { passed: false, logs };
      }

      if (!hasThisPage) {
        logs.push("✗ ERROR: Missing page reference in class.");
        logs.push("  ↳ Use this.page to reference the page object");
        return { passed: false, logs };
      }

      if (!hasFill) {
        logs.push("✗ ERROR: Missing fill interactions.");
        logs.push("  ↳ Use .fill() to enter credentials");
        return { passed: false, logs };
      }

      if (!hasAsyncLogin) {
        logs.push("✗ ERROR: Missing async login method.");
        logs.push("  ↳ Define: async login(user, pass) { ... }");
        return { passed: false, logs };
      }

      logs.push("✓ Page Object Model implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "test-fixtures",
    title: "Test Fixtures & Data Factories",
    description: "Use Playwright test fixtures to share setup and test data across tests.",
    difficulty: "Intermediate",
    icon: Wrench,
    initialCode: `// Both tests repeat the same login setup. Refactor using test.extend!

// TODO: Create a custom fixture using test.extend
// const test = base.extend<{ loggedInPage: Page }>({
//   loggedInPage: async ({ page }, use) => {
//     await page.goto('/playground/auth');
//     await page.getByTestId('input-username').fill('admin');
//     await page.getByTestId('input-password').fill('password123');
//     await page.getByTestId('btn-login').click();
//     await use(page);
//   },
// });

test('View dashboard', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();
  // Now test dashboard...
});

test('View profile', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();
  // Now test profile...
});`,
    missionBrief: {
      context: "Test fixtures eliminate repeated setup by sharing state across tests. Use test.extend to create reusable fixtures.",
      objectives: [
        { id: 1, text: "Use test.extend to create a custom fixture" },
        { id: 2, text: "Share authentication state across both tests" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasTestExtend = /test\.extend/.test(code);
      const hasFixtureUsage = /fixtures|use/.test(code);

      logs.push("✓ Test started");

      if (!hasTestExtend) {
        logs.push("✗ ERROR: Missing test.extend for fixtures.");
        logs.push("  ↳ Use test.extend<{ ... }>({ ... })");
        return { passed: false, logs };
      }

      if (!hasFixtureUsage) {
        logs.push("✗ ERROR: Missing fixture usage pattern.");
        logs.push("  ↳ Use the `use` callback in your fixture definition");
        return { passed: false, logs };
      }

      logs.push("✓ Fixtures configured correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "data-driven",
    title: "Data-Driven Tests",
    description: "Run the same test with multiple data sets using array iteration.",
    difficulty: "Intermediate",
    icon: Database,
    initialCode: `// This test only covers one credential. Make it data-driven!

// TODO: Create an array of test data
// const testData = [
//   { username: 'admin', password: 'password123', expected: 'Welcome' },
//   { username: 'user', password: 'pass456', expected: 'Welcome' },
//   { username: 'invalid', password: 'wrong', expected: 'Invalid' },
// ];

// TODO: Iterate over test data using for...of
// for (const data of testData) {
//   test(\`Login with \${data.username}\`, async ({ page }) => {
//     await page.goto('/playground/auth');
//     await page.getByTestId('input-username').fill(data.username);
//     await page.getByTestId('input-password').fill(data.password);
//     await page.getByTestId('btn-login').click();
//   });
// }

test('Login as admin', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();
});`,
    missionBrief: {
      context: "Data-driven testing runs the same logic with multiple inputs. Use arrays and loops to avoid duplicating test code.",
      objectives: [
        { id: 1, text: "Create an array of test data with multiple credentials" },
        { id: 2, text: "Use for...of or forEach to iterate over the data" },
        { id: 3, text: "Use template literals for dynamic test names" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasArray = /\[\s*\{|const\s+testData/.test(code);
      const hasLoop = /for\s*\(|\.forEach/.test(code);
      const hasMultipleCredentials = /admin[\s\S]*user|user[\s\S]*admin/.test(code);

      logs.push("✓ Test started");

      if (!hasArray) {
        logs.push("✗ ERROR: Missing test data array.");
        logs.push("  ↳ Create: const testData = [{ ... }, { ... }]");
        return { passed: false, logs };
      }

      if (!hasLoop) {
        logs.push("✗ ERROR: Missing iteration over test data.");
        logs.push("  ↳ Use: for (const data of testData) { ... }");
        return { passed: false, logs };
      }

      if (!hasMultipleCredentials) {
        logs.push("✗ ERROR: Need multiple credential sets.");
        logs.push("  ↳ Include at least admin and user credentials");
        return { passed: false, logs };
      }

      logs.push("✓ Data-driven tests configured");
      return { passed: true, logs };
    }
  },
  {
    id: "accessibility",
    title: "Accessibility (a11y)",
    description: "Use @axe-core/playwright to audit pages for accessibility violations.",
    difficulty: "Intermediate",
    icon: Accessibility,
    initialCode: `// TODO: Import AxeBuilder
// import AxeBuilder from '@axe-core/playwright';

test('Accessibility audit', async ({ page }) => {
  await page.goto('/playground/auth');

  // TODO: Run an accessibility scan using AxeBuilder
  // const results = await new AxeBuilder({ page }).analyze();

  // TODO: Assert there are no violations
  // expect(results.violations).toHaveLength(0);
});`,
    missionBrief: {
      context: "Accessibility testing ensures your app is usable by everyone. @axe-core/playwright integrates axe into Playwright tests.",
      objectives: [
        { id: 1, text: "Import AxeBuilder from @axe-core/playwright" },
        { id: 2, text: "Run an accessibility scan with .analyze()" },
        { id: 3, text: "Assert results.violations has length 0" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasAxe = /AxeBuilder|axe/.test(code);
      const hasViolations = /violations/.test(code);
      const hasLengthCheck = /toHaveLength\(0\)|length\s*===\s*0/.test(code);

      logs.push("✓ Test started");

      if (!hasAxe) {
        logs.push("✗ ERROR: Missing AxeBuilder import/usage.");
        logs.push("  ↳ Import and use: new AxeBuilder({ page }).analyze()");
        return { passed: false, logs };
      }

      if (!hasViolations) {
        logs.push("✗ ERROR: Missing violations check.");
        logs.push("  ↳ Access results.violations");
        return { passed: false, logs };
      }

      if (!hasLengthCheck) {
        logs.push("✗ ERROR: Missing length assertion.");
        logs.push("  ↳ Use: expect(results.violations).toHaveLength(0)");
        return { passed: false, logs };
      }

      logs.push("✓ Accessibility audit passed");
      return { passed: true, logs };
    }
  },
  {
    id: "api-request-validation",
    title: "API Request Validation",
    description: "Intercept API requests and validate request payloads and headers.",
    difficulty: "Advanced",
    icon: Network,
    initialCode: `test('API Request Validation', async ({ page }) => {
  await page.goto('/playground/kyc');

  // TODO: Intercept the KYC submission request
  // await page.route('**/api/kyc/submit', (route) => {
  //   const request = route.request();
  //   const postData = JSON.parse(request.postData() || '{}');
  //   expect(postData.fullname).toBeDefined();
  //   expect(request.headers()['content-type']).toContain('application/json');
  //   route.continue();
  // });

  // TODO: Or use waitForRequest to capture the request
  // const requestPromise = page.waitForRequest('**/api/kyc/submit');

  // Fill and submit the form
  await page.getByTestId('input-fullname').fill('Jane Doe');
  await page.getByTestId('btn-submit-kyc').click();

  // TODO: Validate the captured request
  // const request = await requestPromise;
  // const body = request.postData();
});`,
    missionBrief: {
      context: "Intercepting API requests lets you validate that your frontend sends the correct data. Use page.route or waitForRequest.",
      objectives: [
        { id: 1, text: "Use page.route or waitForRequest to intercept the API call" },
        { id: 2, text: "Validate the request body contains expected fields" },
        { id: 3, text: "Check request headers" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasIntercept = /route|waitForRequest/.test(code);
      const hasBody = /postData|request\(\)\.json|body/.test(code);

      logs.push("✓ Test started");

      if (!hasIntercept) {
        logs.push("✗ ERROR: Missing request interception.");
        logs.push("  ↳ Use page.route() or page.waitForRequest()");
        return { passed: false, logs };
      }

      if (!hasBody) {
        logs.push("✗ ERROR: Missing request body validation.");
        logs.push("  ↳ Use request.postData() to read the payload");
        return { passed: false, logs };
      }

      logs.push("✓ API request validated");
      return { passed: true, logs };
    }
  },
  {
    id: "performance",
    title: "Performance Assertions",
    description: "Measure page load time and assert it's within acceptable thresholds.",
    difficulty: "Advanced",
    icon: Gauge,
    initialCode: `test('Performance Assertions', async ({ page }) => {
  // TODO: Navigate and measure performance
  await page.goto('/playground/auth');

  // TODO: Use the Performance API to measure load time
  // const loadTime = await page.evaluate(() => {
  //   const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  //   return timing.loadEventEnd - timing.startTime;
  // });

  // TODO: Assert load time is under 3000ms
  // expect(loadTime).toBeLessThan(3000);

  // TODO: Measure LCP (Largest Contentful Paint)
  // const lcp = await page.evaluate(() => {
  //   return new Promise((resolve) => {
  //     new PerformanceObserver((list) => {
  //       const entries = list.getEntries();
  //       resolve(entries[entries.length - 1].startTime);
  //     }).observe({ type: 'largest-contentful-paint', buffered: true });
  //   });
  // });
});`,
    missionBrief: {
      context: "Performance testing ensures pages load within acceptable thresholds. Use the browser's Performance API inside evaluate().",
      objectives: [
        { id: 1, text: "Use page.evaluate with the Performance API" },
        { id: 2, text: "Measure navigation timing or LCP" },
        { id: 3, text: "Assert the metric is under a threshold" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasPerformance = /performance|evaluate/.test(code);
      const hasTiming = /timing|loadEvent|navigation|startTime|LCP|contentful/.test(code);
      const hasThreshold = /\d{3,4}/.test(code);

      logs.push("✓ Test started");

      if (!hasPerformance) {
        logs.push("✗ ERROR: Missing performance measurement.");
        logs.push("  ↳ Use page.evaluate() with the Performance API");
        return { passed: false, logs };
      }

      if (!hasTiming) {
        logs.push("✗ ERROR: Missing timing metric.");
        logs.push("  ↳ Access performance.getEntriesByType('navigation')");
        return { passed: false, logs };
      }

      if (!hasThreshold) {
        logs.push("✗ ERROR: Missing threshold assertion.");
        logs.push("  ↳ Assert: expect(loadTime).toBeLessThan(3000)");
        return { passed: false, logs };
      }

      logs.push("✓ Performance assertions configured");
      return { passed: true, logs };
    }
  },
  {
    id: "test-tags",
    title: "Tagging & Filtering Tests",
    description: "Organize tests with tags like @smoke, @regression for selective execution.",
    difficulty: "Beginner",
    icon: Tag,
    initialCode: `// TODO: Add tags to these test titles for selective execution
// Use @smoke for critical path tests and @regression for full suite
// Example: test('Login @smoke', ...)
// Run with: npx playwright test --grep @smoke

test('Login flow', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();
});

test('Form validation', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('btn-login').click();
  // Assert error messages
});

test('Password reset', async ({ page }) => {
  await page.goto('/playground/auth');
  // Test password reset flow
});`,
    missionBrief: {
      context: "Tags let you run subsets of tests. Add @smoke to critical tests and @regression to comprehensive tests. Use --grep to filter.",
      objectives: [
        { id: 1, text: "Add @smoke tag to the login test title" },
        { id: 2, text: "Add @regression tag to other test titles" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSmoke = /@smoke/.test(code);
      const hasRegression = /@regression/.test(code);

      logs.push("✓ Test started");

      if (!hasSmoke) {
        logs.push("✗ ERROR: Missing @smoke tag.");
        logs.push("  ↳ Add @smoke to critical test titles");
        return { passed: false, logs };
      }

      if (!hasRegression) {
        logs.push("✗ ERROR: Missing @regression tag.");
        logs.push("  ↳ Add @regression to comprehensive test titles");
        return { passed: false, logs };
      }

      logs.push("✓ Tests tagged correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "custom-matchers",
    title: "Custom Matchers",
    description: "Extend Playwright's expect with custom matcher functions.",
    difficulty: "Advanced",
    icon: Wrench,
    initialCode: `// TODO: Create a custom matcher using expect.extend
// expect.extend({
//   async toHaveTestId(page, testId) {
//     const locator = page.getByTestId(testId);
//     const isVisible = await locator.isVisible();
//     return {
//       pass: isVisible,
//       message: () => \`Expected element with testId "\${testId}" to be visible\`,
//     };
//   },
// });

test('Custom matcher example', async ({ page }) => {
  await page.goto('/playground/auth');

  // Without custom matcher (repetitive)
  await expect(page.getByTestId('input-username')).toBeVisible();
  await expect(page.getByTestId('input-password')).toBeVisible();
  await expect(page.getByTestId('btn-login')).toBeVisible();

  // TODO: Replace with custom matcher
  // await expect(page).toHaveTestId('input-username');
  // await expect(page).toHaveTestId('input-password');
  // await expect(page).toHaveTestId('btn-login');
});`,
    missionBrief: {
      context: "Custom matchers make assertions more expressive and reduce repetition. Use expect.extend to add new assertion methods.",
      objectives: [
        { id: 1, text: "Use expect.extend to define a custom matcher" },
        { id: 2, text: "Create a matcher function (e.g., toHaveTestId)" },
        { id: 3, text: "Use the custom matcher in your test" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasExpectExtend = /expect\.extend/.test(code);
      const hasCustomMatcher = /toHave|toBe/.test(code);
      const hasMatcherDef = /pass:|message:/.test(code);

      logs.push("✓ Test started");

      if (!hasExpectExtend) {
        logs.push("✗ ERROR: Missing expect.extend call.");
        logs.push("  ↳ Use: expect.extend({ matcherName: async (...) => { ... } })");
        return { passed: false, logs };
      }

      if (!hasCustomMatcher) {
        logs.push("✗ ERROR: Missing custom matcher usage.");
        return { passed: false, logs };
      }

      if (!hasMatcherDef) {
        logs.push("✗ ERROR: Missing matcher function definition.");
        logs.push("  ↳ Return { pass: boolean, message: () => string }");
        return { passed: false, logs };
      }

      logs.push("✓ Custom matcher implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "retry-strategy",
    title: "Retry & Flaky Test Strategy",
    description: "Configure test retries and understand flaky test handling.",
    difficulty: "Intermediate",
    icon: Repeat,
    initialCode: `// TODO: Configure retries in the test or config
// Option 1: In playwright.config.ts
// export default defineConfig({
//   retries: 2,
// });

// Option 2: Per-test retry
// test.describe.configure({ retries: 3 });

test('Flaky network test', async ({ page }) => {
  await page.goto('/playground/api');

  // This test might fail intermittently due to network timing
  await page.getByTestId('btn-get-users').click();
  await expect(page.getByTestId('user-row-1')).toBeVisible();

  // TODO: Access retry info
  // const retryCount = test.info().retry;
  // console.log('Current retry:', retryCount);
});`,
    missionBrief: {
      context: "Flaky tests fail intermittently. Configure retries to re-run failed tests automatically. Use test.info().retry to track attempts.",
      objectives: [
        { id: 1, text: "Configure retries (in config or per-test)" },
        { id: 2, text: "Use test.info().retry to check retry count" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasRetries = /retries/.test(code);
      const hasNumber = /retries:\s*\d/.test(code);

      logs.push("✓ Test started");

      if (!hasRetries) {
        logs.push("✗ ERROR: Missing retries configuration.");
        logs.push("  ↳ Add retries: 2 to config or test.describe.configure");
        return { passed: false, logs };
      }

      if (!hasNumber) {
        logs.push("✗ ERROR: Missing retry count value.");
        logs.push("  ↳ Specify a number: retries: 2");
        return { passed: false, logs };
      }

      logs.push("✓ Retry strategy configured");
      return { passed: true, logs };
    }
  },
  {
    id: "cross-browser",
    title: "Cross-Browser Testing",
    description: "Configure Playwright to run tests across Chromium, Firefox, and WebKit.",
    difficulty: "Intermediate",
    icon: Globe,
    initialCode: `// playwright.config.ts
// TODO: Add Firefox and WebKit projects alongside Chromium

// import { defineConfig, devices } from '@playwright/test';
// export default defineConfig({
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },
//     // TODO: Add Firefox project
//     // TODO: Add WebKit project
//   ],
// });

test('Cross-browser login', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('password123');
  await page.getByTestId('btn-login').click();
});`,
    missionBrief: {
      context: "Playwright supports Chromium, Firefox, and WebKit. Configure projects in the config to run tests across all browsers.",
      objectives: [
        { id: 1, text: "Add a Firefox project to the projects array" },
        { id: 2, text: "Add a WebKit project to the projects array" },
        { id: 3, text: "Keep the existing Chromium project" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFirefox = /firefox/i.test(code);
      const hasWebkit = /webkit/i.test(code);
      const hasChromium = /chromium/i.test(code);
      const hasProjects = /projects/.test(code);

      logs.push("✓ Test started");

      if (!hasProjects) {
        logs.push("✗ ERROR: Missing projects array.");
        logs.push("  ↳ Define projects: [...] in the config");
        return { passed: false, logs };
      }

      if (!hasChromium) {
        logs.push("✗ ERROR: Missing Chromium project.");
        return { passed: false, logs };
      }

      if (!hasFirefox) {
        logs.push("✗ ERROR: Missing Firefox project.");
        logs.push("  ↳ Add: { name: 'firefox', use: { ...devices['Desktop Firefox'] } }");
        return { passed: false, logs };
      }

      if (!hasWebkit) {
        logs.push("✗ ERROR: Missing WebKit project.");
        logs.push("  ↳ Add: { name: 'webkit', use: { ...devices['Desktop Safari'] } }");
        return { passed: false, logs };
      }

      logs.push("✓ Cross-browser configuration complete");
      return { passed: true, logs };
    }
  },
  {
    id: "ci-cd",
    title: "CI/CD Integration",
    description: "Write a GitHub Actions workflow to run Playwright tests in CI.",
    difficulty: "Intermediate",
    icon: GitBranch,
    initialCode: `// TODO: Complete this GitHub Actions workflow YAML
// .github/workflows/playwright.yml

// name: Playwright Tests
// on: [push, pull_request]
// jobs:
//   test:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with:
//           node-version: 18
//       - run: npm ci
//
//       # TODO: Install Playwright browsers
//       # - run: npx playwright install --with-deps
//
//       # TODO: Run the tests
//       # - run: npx playwright test
//
//       # TODO: Upload test report as artifact
//       # - uses: actions/upload-artifact@v4
//       #   if: always()
//       #   with:
//       #     name: playwright-report
//       #     path: playwright-report/

test('CI smoke test', async ({ page }) => {
  await page.goto('/playground/auth');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('btn-login').click();
});`,
    missionBrief: {
      context: "Running Playwright tests in CI ensures tests pass before merging. GitHub Actions is a popular CI/CD platform.",
      objectives: [
        { id: 1, text: "Add a step to install Playwright browsers" },
        { id: 2, text: "Add a step to run the Playwright tests" },
        { id: 3, text: "Upload the test report as an artifact" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasInstall = /npx playwright install|playwright install/.test(code);
      const hasTest = /npx playwright test/.test(code);
      const hasArtifact = /actions\/upload-artifact|artifact/.test(code);

      logs.push("✓ Test started");

      if (!hasInstall) {
        logs.push("✗ ERROR: Missing Playwright browser install step.");
        logs.push("  ↳ Add: npx playwright install --with-deps");
        return { passed: false, logs };
      }

      if (!hasTest) {
        logs.push("✗ ERROR: Missing test execution step.");
        logs.push("  ↳ Add: npx playwright test");
        return { passed: false, logs };
      }

      if (!hasArtifact) {
        logs.push("✗ ERROR: Missing artifact upload step.");
        logs.push("  ↳ Use actions/upload-artifact to save the report");
        return { passed: false, logs };
      }

      logs.push("✓ CI/CD pipeline configured");
      return { passed: true, logs };
    }
  },
  {
    id: "reporters",
    title: "Reporter Configuration",
    description: "Configure HTML, JSON, and JUnit reporters for test results.",
    difficulty: "Beginner",
    icon: BarChart3,
    initialCode: `// playwright.config.ts
// TODO: Add reporters to the configuration

// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//   reporter: [
//     // TODO: Add HTML reporter
//     // ['html', { open: 'never' }],
//     // TODO: Add JUnit reporter for CI
//     // ['junit', { outputFile: 'results.xml' }],
//     // TODO: Add JSON reporter
//     // ['json', { outputFile: 'results.json' }],
//   ],
// });

test('Reporter demo', async ({ page }) => {
  await page.goto('/playground/auth');
  await expect(page.getByTestId('input-username')).toBeVisible();
});`,
    missionBrief: {
      context: "Reporters generate test result files in various formats. HTML for human review, JUnit/JSON for CI integration.",
      objectives: [
        { id: 1, text: "Configure the HTML reporter" },
        { id: 2, text: "Add a JUnit or JSON reporter for CI" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasReporter = /reporter/.test(code);
      const hasHtml = /html/.test(code);
      const hasJunitOrJson = /junit|json/.test(code);

      logs.push("✓ Test started");

      if (!hasReporter) {
        logs.push("✗ ERROR: Missing reporter configuration.");
        logs.push("  ↳ Add reporter: [...] to the config");
        return { passed: false, logs };
      }

      if (!hasHtml) {
        logs.push("✗ ERROR: Missing HTML reporter.");
        logs.push("  ↳ Add: ['html', { open: 'never' }]");
        return { passed: false, logs };
      }

      if (!hasJunitOrJson) {
        logs.push("✗ ERROR: Missing JUnit or JSON reporter.");
        logs.push("  ↳ Add: ['junit', { outputFile: 'results.xml' }]");
        return { passed: false, logs };
      }

      logs.push("✓ Reporters configured");
      return { passed: true, logs };
    }
  },
  {
    id: "component-testing",
    title: "Component Testing",
    description: "Test individual React components in isolation using Playwright CT.",
    difficulty: "Advanced",
    icon: Box,
    initialCode: `// TODO: Import mount from @playwright/experimental-ct-react
// import { test, expect } from '@playwright/experimental-ct-react';
// import { LoginForm } from './components/LoginForm';

test('Component: LoginForm', async ({ mount }) => {
  // TODO: Mount the component in isolation
  // const component = await mount(<LoginForm onSubmit={() => {}} />);

  // TODO: Interact with the mounted component
  // await component.getByTestId('input-username').fill('admin');
  // await component.getByTestId('input-password').fill('password123');
  // await component.getByTestId('btn-login').click();

  // TODO: Assert component behavior
  // await expect(component).toContainText('Welcome');
});`,
    missionBrief: {
      context: "Component testing lets you test UI components in isolation without a full app. Use @playwright/experimental-ct-react for React components.",
      objectives: [
        { id: 1, text: "Use mount to render a component in isolation" },
        { id: 2, text: "Interact with the component (click, fill)" },
        { id: 3, text: "Assert the component output" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasMount = /mount/i.test(code);
      const hasComponent = /component/i.test(code);
      const hasInteraction = /\.click|\.fill/.test(code);

      logs.push("✓ Test started");

      if (!hasMount) {
        logs.push("✗ ERROR: Missing mount call.");
        logs.push("  ↳ Use: const component = await mount(<Component />)");
        return { passed: false, logs };
      }

      if (!hasComponent) {
        logs.push("✗ ERROR: Missing component reference.");
        logs.push("  ↳ Import and mount a React component");
        return { passed: false, logs };
      }

      if (!hasInteraction) {
        logs.push("✗ ERROR: Missing component interaction.");
        logs.push("  ↳ Use .click() or .fill() on the mounted component");
        return { passed: false, logs };
      }

      logs.push("✓ Component test implemented");
      return { passed: true, logs };
    }
  },
  {
    id: "websocket",
    title: "WebSocket Testing",
    description: "Intercept and test WebSocket connections and messages.",
    difficulty: "Advanced",
    icon: Network,
    initialCode: `test('WebSocket Testing', async ({ page }) => {
  // TODO: Listen for WebSocket connections
  // page.on('websocket', (ws) => {
  //   console.log('WebSocket opened:', ws.url());
  //
  //   ws.on('framesent', (frame) => {
  //     console.log('Sent:', frame.payload);
  //   });
  //
  //   ws.on('framereceived', (frame) => {
  //     console.log('Received:', frame.payload);
  //   });
  // });

  // TODO: Set up a promise to capture a specific message
  // const wsMessage = new Promise((resolve) => {
  //   page.on('websocket', (ws) => {
  //     ws.on('framereceived', (frame) => {
  //       if (frame.payload.includes('connected')) resolve(frame.payload);
  //     });
  //   });
  // });

  await page.goto('/playground/kyc');

  // TODO: Trigger WebSocket connection and assert message
  // const message = await wsMessage;
  // expect(message).toContain('connected');
});`,
    missionBrief: {
      context: "WebSocket connections persist between client and server. Use page.on('websocket') to intercept and validate messages.",
      objectives: [
        { id: 1, text: "Use page.on('websocket') to listen for connections" },
        { id: 2, text: "Capture sent or received frames" },
        { id: 3, text: "Assert message content" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWebsocket = /websocket/i.test(code);
      const hasOn = /on\(/.test(code);
      const hasMessage = /frame|payload|message/.test(code);

      logs.push("✓ Test started");

      if (!hasWebsocket) {
        logs.push("✗ ERROR: Missing WebSocket handling.");
        logs.push("  ↳ Use page.on('websocket', ...)");
        return { passed: false, logs };
      }

      if (!hasOn) {
        logs.push("✗ ERROR: Missing event listener.");
        logs.push("  ↳ Use ws.on('framereceived', ...) or ws.on('framesent', ...)");
        return { passed: false, logs };
      }

      if (!hasMessage) {
        logs.push("✗ ERROR: Missing message assertion.");
        logs.push("  ↳ Assert on frame.payload content");
        return { passed: false, logs };
      }

      logs.push("✓ WebSocket testing configured");
      return { passed: true, logs };
    }
  },
  {
    id: "checkboxes",
    title: "Checkboxes & Radios",
    description: "Test checkbox and switch toggle interactions with proper state assertions.",
    difficulty: "Beginner",
    icon: CheckSquare,
    initialCode: `test('Checkboxes & Radios', async ({ page }) => {
  await page.goto('/playground/interactions');

  const airplaneSwitch = page.getByTestId('switch-airplane');

  // TODO: Check the switch and assert it is checked
  // Use await airplaneSwitch.check();
  // Use await expect(airplaneSwitch).toBeChecked();

  // TODO: Uncheck the switch and assert it is not checked
  // Use await airplaneSwitch.uncheck();
  // Use await expect(airplaneSwitch).not.toBeChecked();
});`,
    missionBrief: {
      context: "Switches, checkboxes, and radios need state assertions after toggling. Playwright provides `.check()`, `.uncheck()`, and `.toBeChecked()`.",
      objectives: [
        { id: 1, text: "Check the airplane switch using `check()` or `click()`" },
        { id: 2, text: "Assert it is checked with `toBeChecked()`" },
        { id: 3, text: "Uncheck the switch and assert `not.toBeChecked()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSwitch = code.includes("switch-airplane");
      const hasCheckOrClick = /\.check\(\)|\.click\(\)/.test(code);
      const hasAssertion = /toBeChecked/.test(code);

      logs.push("✓ Test started");

      if (!hasSwitch) {
        logs.push("✗ ERROR: Missing switch locator.");
        logs.push("  ↳ Use getByTestId('switch-airplane')");
        return { passed: false, logs };
      }

      if (!hasCheckOrClick) {
        logs.push("✗ ERROR: Missing check/click action.");
        logs.push("  ↳ Use .check() or .click() to toggle the switch");
        return { passed: false, logs };
      }

      if (!hasAssertion) {
        logs.push("✗ ERROR: Missing checked assertion.");
        logs.push("  ↳ Use expect(locator).toBeChecked()");
        return { passed: false, logs };
      }

      logs.push("✓ Checkbox interactions verified");
      return { passed: true, logs };
    }
  },
  {
    id: "assertions-chain",
    title: "Chaining Assertions",
    description: "Chain multiple expect assertions on the same locator for thorough validation.",
    difficulty: "Beginner",
    icon: CheckSquare,
    initialCode: `test('Chaining Assertions', async ({ page }) => {
  await page.goto('/playground/auth');

  const usernameInput = page.getByTestId('input-username');

  // TODO: Chain multiple assertions on the same locator
  // 1. Assert the input is visible
  // await expect(usernameInput).toBeVisible();

  // 2. Assert it has the correct placeholder attribute
  // await expect(usernameInput).toHaveAttribute('placeholder', 'Enter username');

  // 3. Assert it is enabled
  // await expect(usernameInput).toBeEnabled();
});`,
    missionBrief: {
      context: "Multiple assertions on a single locator ensure the element is in the expected state. Chain `toBeVisible`, `toHaveAttribute`, and `toBeEnabled` for thorough checks.",
      objectives: [
        { id: 1, text: "Use `expect(locator).toBeVisible()`" },
        { id: 2, text: "Use `expect(locator).toHaveAttribute()`" },
        { id: 3, text: "Use `expect(locator).toBeEnabled()`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const expectCount = (code.match(/expect\(/g) || []).length;
      const hasVisible = /toBeVisible/.test(code);
      const hasAttrOrEnabled = /toHaveAttribute|toBeEnabled/.test(code);

      logs.push("✓ Test started");

      if (expectCount < 2) {
        logs.push("✗ ERROR: Need multiple expect() assertions.");
        logs.push("  ↳ Chain at least 2 expect() calls on the locator");
        return { passed: false, logs };
      }

      if (!hasVisible) {
        logs.push("✗ ERROR: Missing visibility assertion.");
        logs.push("  ↳ Use await expect(locator).toBeVisible()");
        return { passed: false, logs };
      }

      if (!hasAttrOrEnabled) {
        logs.push("✗ ERROR: Missing attribute or enabled assertion.");
        logs.push("  ↳ Use toHaveAttribute() or toBeEnabled()");
        return { passed: false, logs };
      }

      logs.push("✓ Assertions chained correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "hover-states",
    title: "Hover States",
    description: "Trigger hover events and assert tooltip or hover-dependent UI appears.",
    difficulty: "Intermediate",
    icon: MousePointerClick,
    initialCode: `test('Hover States', async ({ page }) => {
  await page.goto('/playground/interactions');

  const hoverButton = page.getByTestId('btn-hover');

  // TODO: Hover over the button
  // await hoverButton.hover();

  // TODO: Assert the tooltip content becomes visible
  // const tooltip = page.getByTestId('tooltip-content');
  // await expect(tooltip).toBeVisible();
});`,
    missionBrief: {
      context: "Some UI elements only appear on hover. Use `locator.hover()` to simulate mouse hover and then assert the dependent element.",
      objectives: [
        { id: 1, text: "Use `locator.hover()` on the hover button" },
        { id: 2, text: "Assert the tooltip content becomes visible" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasHoverBtn = code.includes("btn-hover");
      const hasHover = /\.hover\(\)/.test(code);
      const hasTooltip = code.includes("tooltip-content");

      logs.push("✓ Test started");

      if (!hasHoverBtn) {
        logs.push("✗ ERROR: Missing hover button locator.");
        logs.push("  ↳ Use getByTestId('btn-hover')");
        return { passed: false, logs };
      }

      if (!hasHover) {
        logs.push("✗ ERROR: Missing hover action.");
        logs.push("  ↳ Use await locator.hover()");
        return { passed: false, logs };
      }

      if (!hasTooltip) {
        logs.push("✗ ERROR: Missing tooltip assertion.");
        logs.push("  ↳ Assert getByTestId('tooltip-content') is visible");
        return { passed: false, logs };
      }

      logs.push("✓ Hover state tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "cookies",
    title: "Cookies & Storage",
    description: "Inspect and manipulate cookies and localStorage during tests.",
    difficulty: "Intermediate",
    icon: Database,
    initialCode: `test('Cookies & Storage', async ({ page, context }) => {
  await page.goto('/playground/auth');

  // TODO: Login first
  // await page.getByTestId('input-username').fill('admin');
  // await page.getByTestId('input-password').fill('password123');
  // await page.getByTestId('btn-login').click();

  // TODO: Check localStorage for session_token
  // const token = await page.evaluate(() => localStorage.getItem('session_token'));
  // expect(token).toBeTruthy();

  // TODO: Set a cookie via context
  // await context.addCookies([{ name: 'theme', value: 'dark', url: 'http://localhost' }]);
  // const cookies = await context.cookies();
  // expect(cookies.find(c => c.name === 'theme')).toBeTruthy();
});`,
    missionBrief: {
      context: "Tests often need to verify session tokens in localStorage or set cookies for pre-authenticated states. Use `page.evaluate` for storage and `context.addCookies` for cookies.",
      objectives: [
        { id: 1, text: "Login and check `localStorage` for `session_token` via `page.evaluate`" },
        { id: 2, text: "Use `context.addCookies` or `document.cookie` to set a cookie" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasEvaluate = /evaluate/.test(code);
      const hasStorage = /localStorage|sessionStorage/.test(code);
      const hasTokenOrCookie = /session_token|cookie/i.test(code);

      logs.push("✓ Test started");

      if (!hasEvaluate) {
        logs.push("✗ ERROR: Missing page.evaluate().");
        logs.push("  ↳ Use page.evaluate(() => localStorage.getItem(...))");
        return { passed: false, logs };
      }

      if (!hasStorage) {
        logs.push("✗ ERROR: Missing localStorage/sessionStorage access.");
        logs.push("  ↳ Access localStorage or sessionStorage inside evaluate");
        return { passed: false, logs };
      }

      if (!hasTokenOrCookie) {
        logs.push("✗ ERROR: Missing session_token or cookie handling.");
        logs.push("  ↳ Check for session_token or use addCookies");
        return { passed: false, logs };
      }

      logs.push("✓ Cookies & Storage tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "env-vars",
    title: "Environment Variables",
    description: "Use process.env to parameterize config and tests for different environments.",
    difficulty: "Intermediate",
    icon: Settings,
    initialCode: `// playwright.config.ts snippet
// import { defineConfig } from '@playwright/test';
// export default defineConfig({
//   use: {
//     baseURL: process.env.BASE_URL || 'http://localhost:3000',
//   },
// });

test('Environment Variables', async ({ page }) => {
  // TODO: Use environment variables for credentials
  // const username = process.env.TEST_USERNAME || 'admin';
  // const password = process.env.TEST_PASSWORD || 'password123';

  await page.goto('/playground/auth');

  // TODO: Fill in using env var values
  // await page.getByTestId('input-username').fill(username);
  // await page.getByTestId('input-password').fill(password);
  // await page.getByTestId('btn-login').click();
});`,
    missionBrief: {
      context: "Hardcoding URLs and credentials is fragile. Use `process.env` in `playwright.config.ts` and tests to support multiple environments.",
      objectives: [
        { id: 1, text: "Use `process.env` for `BASE_URL` in config" },
        { id: 2, text: "Reference env vars like `TEST_USERNAME` in the test" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasProcessEnv = /process\.env/.test(code);
      const hasEnvVar = /BASE_URL|USERNAME|PASSWORD/i.test(code);

      logs.push("✓ Test started");

      if (!hasProcessEnv) {
        logs.push("✗ ERROR: Missing process.env usage.");
        logs.push("  ↳ Use process.env.BASE_URL or process.env.TEST_USERNAME");
        return { passed: false, logs };
      }

      if (!hasEnvVar) {
        logs.push("✗ ERROR: Missing named environment variable.");
        logs.push("  ↳ Define variables like BASE_URL or TEST_USERNAME");
        return { passed: false, logs };
      }

      logs.push("✓ Environment variables configured correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "navigation",
    title: "Navigation & History",
    description: "Navigate between pages and use browser history with goBack and goForward.",
    difficulty: "Beginner",
    icon: Navigation,
    initialCode: `test('Navigation & History', async ({ page }) => {
  await page.goto('/playground');

  // TODO: Navigate to /playground/auth
  // await page.goto('/playground/auth');
  // await expect(page).toHaveURL(/auth/);

  // TODO: Go back and assert URL
  // await page.goBack();
  // await expect(page).toHaveURL(/playground$/);

  // TODO: Go forward and assert URL
  // await page.goForward();
  // await expect(page).toHaveURL(/auth/);
});`,
    missionBrief: {
      context: "Browser navigation history is important for testing user flows. Playwright provides `page.goBack()` and `page.goForward()` to traverse history.",
      objectives: [
        { id: 1, text: "Use `page.goBack()` to navigate back" },
        { id: 2, text: "Use `page.goForward()` to navigate forward" },
        { id: 3, text: "Assert URL with `toHaveURL`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasGoBack = /goBack\(\)/.test(code);
      const hasGoForward = /goForward\(\)/.test(code);
      const hasURL = /toHaveURL/.test(code);

      logs.push("✓ Test started");

      if (!hasGoBack) {
        logs.push("✗ ERROR: Missing page.goBack().");
        logs.push("  ↳ Use await page.goBack() to navigate back");
        return { passed: false, logs };
      }

      if (!hasGoForward) {
        logs.push("✗ ERROR: Missing page.goForward().");
        logs.push("  ↳ Use await page.goForward() to navigate forward");
        return { passed: false, logs };
      }

      if (!hasURL) {
        logs.push("✗ ERROR: Missing URL assertion.");
        logs.push("  ↳ Use expect(page).toHaveURL(...)");
        return { passed: false, logs };
      }

      logs.push("✓ Navigation & history tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "viewport",
    title: "Responsive Viewport",
    description: "Test responsive layouts by changing viewport size during the test.",
    difficulty: "Intermediate",
    icon: Maximize,
    initialCode: `test('Responsive Viewport', async ({ page }) => {
  // TODO: Set mobile viewport
  // await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/playground/auth');

  // TODO: Assert mobile layout (e.g. element visibility or size)
  // await expect(page.getByTestId('btn-login')).toBeVisible();

  // TODO: Switch to desktop viewport
  // await page.setViewportSize({ width: 1920, height: 1080 });

  // TODO: Assert desktop layout
  // await expect(page.getByTestId('btn-login')).toBeVisible();
});`,
    missionBrief: {
      context: "Responsive design must be tested at different viewport sizes. Use `page.setViewportSize()` to simulate mobile, tablet, and desktop screens.",
      objectives: [
        { id: 1, text: "Use `setViewportSize` with mobile dimensions (e.g. 375x667)" },
        { id: 2, text: "Use `setViewportSize` with desktop dimensions (e.g. 1920x1080)" },
        { id: 3, text: "Assert layout at each viewport size" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasSetViewport = /setViewportSize/.test(code);
      const hasDimensions = /375|667|1920/.test(code);
      const hasAssertion = /expect\(/.test(code);

      logs.push("✓ Test started");

      if (!hasSetViewport) {
        logs.push("✗ ERROR: Missing setViewportSize().");
        logs.push("  ↳ Use page.setViewportSize({ width: 375, height: 667 })");
        return { passed: false, logs };
      }

      if (!hasDimensions) {
        logs.push("✗ ERROR: Missing viewport dimensions.");
        logs.push("  ↳ Use mobile (375x667) and desktop (1920x1080) sizes");
        return { passed: false, logs };
      }

      if (!hasAssertion) {
        logs.push("✗ ERROR: Missing layout assertion.");
        logs.push("  ↳ Assert element visibility or layout at each viewport");
        return { passed: false, logs };
      }

      logs.push("✓ Responsive viewport tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "scrolling",
    title: "Scrolling",
    description: "Scroll elements into view and manipulate scroll position within containers.",
    difficulty: "Beginner",
    icon: ScrollText,
    initialCode: `test('Scrolling', async ({ page }) => {
  await page.goto('/playground/kyc');

  // TODO: Scroll the terms box into view
  // const termsBox = page.getByTestId('terms-box');
  // await termsBox.scrollIntoViewIfNeeded();

  // TODO: Scroll within the terms container using evaluate
  // await page.evaluate(() => {
  //   const el = document.querySelector('[data-testid="terms-box"]');
  //   if (el) el.scrollTop = el.scrollHeight;
  // });

  // TODO: Assert the element is now scrolled
  // const scrollTop = await page.evaluate(() => {
  //   const el = document.querySelector('[data-testid="terms-box"]');
  //   return el ? el.scrollTop : 0;
  // });
  // expect(scrollTop).toBeGreaterThan(0);
});`,
    missionBrief: {
      context: "Some elements require scrolling to become visible or interactive. Use `scrollIntoViewIfNeeded()` or manipulate `scrollTop` via `page.evaluate`.",
      objectives: [
        { id: 1, text: "Use `scrollIntoViewIfNeeded()` to scroll an element into view" },
        { id: 2, text: "Use `evaluate` to set or read `scrollTop`" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasScroll = /scrollIntoViewIfNeeded|scrollTop|scroll/.test(code);
      const hasElement = /terms|getByTestId|querySelector/.test(code);

      logs.push("✓ Test started");

      if (!hasScroll) {
        logs.push("✗ ERROR: Missing scroll action.");
        logs.push("  ↳ Use scrollIntoViewIfNeeded() or evaluate scrollTop");
        return { passed: false, logs };
      }

      if (!hasElement) {
        logs.push("✗ ERROR: Missing element reference.");
        logs.push("  ↳ Target a specific element to scroll");
        return { passed: false, logs };
      }

      logs.push("✓ Scrolling tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "blur-focus",
    title: "Blur & Focus",
    description: "Control input focus and blur to test validation and focus-dependent behavior.",
    difficulty: "Beginner",
    icon: Focus,
    initialCode: `test('Blur & Focus', async ({ page }) => {
  await page.goto('/playground/auth');

  const usernameInput = page.getByTestId('input-username');

  // TODO: Focus the input
  // await usernameInput.focus();

  // TODO: Assert it is focused
  // await expect(usernameInput).toBeFocused();

  // TODO: Blur the input
  // await usernameInput.blur();

  // TODO: Assert it is no longer focused
  // await expect(usernameInput).not.toBeFocused();
});`,
    missionBrief: {
      context: "Focus and blur events trigger validation, styling changes, and accessibility behavior. Playwright provides `focus()`, `blur()`, and `toBeFocused()` for testing.",
      objectives: [
        { id: 1, text: "Use `locator.focus()` to focus an input" },
        { id: 2, text: "Assert focus with `toBeFocused()`" },
        { id: 3, text: "Use `locator.blur()` to remove focus" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasFocus = /\.focus\(\)/.test(code);
      const hasToBeFocused = /toBeFocused/.test(code);
      const hasBlur = /\.blur\(\)/.test(code);

      logs.push("✓ Test started");

      if (!hasFocus) {
        logs.push("✗ ERROR: Missing focus() call.");
        logs.push("  ↳ Use await locator.focus()");
        return { passed: false, logs };
      }

      if (!hasToBeFocused) {
        logs.push("✗ ERROR: Missing toBeFocused() assertion.");
        logs.push("  ↳ Use expect(locator).toBeFocused()");
        return { passed: false, logs };
      }

      if (!hasBlur) {
        logs.push("✗ ERROR: Missing blur() call.");
        logs.push("  ↳ Use await locator.blur()");
        return { passed: false, logs };
      }

      logs.push("✓ Blur & Focus tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "url-location",
    title: "URL & Location",
    description: "Assert page URL and title using Playwright's web-first assertions.",
    difficulty: "Beginner",
    icon: Link,
    initialCode: `test('URL & Location', async ({ page }) => {
  await page.goto('/playground/auth');

  // TODO: Assert the URL contains 'auth'
  // await expect(page).toHaveURL(/auth/);

  // TODO: Store the current URL in a variable
  // const currentUrl = page.url();
  // console.log('Current URL:', currentUrl);

  // TODO: Assert the page title
  // await expect(page).toHaveTitle(/QPlay|Playground/i);
});`,
    missionBrief: {
      context: "Verifying the URL and page title ensures correct navigation. Use `toHaveURL` for URL assertions and `toHaveTitle` for title checks.",
      objectives: [
        { id: 1, text: "Use `expect(page).toHaveURL()` to assert URL" },
        { id: 2, text: "Use `page.url()` to read the current URL" },
        { id: 3, text: "Use `expect(page).toHaveTitle()` to assert title" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasToHaveURL = /toHaveURL/.test(code);
      const hasPageUrl = /page\.url\(\)|\.url\(\)/.test(code);
      const hasAssertion = /expect\(/.test(code);

      logs.push("✓ Test started");

      if (!hasToHaveURL) {
        logs.push("✗ ERROR: Missing toHaveURL assertion.");
        logs.push("  ↳ Use expect(page).toHaveURL(/auth/)");
        return { passed: false, logs };
      }

      if (!hasPageUrl) {
        logs.push("✗ ERROR: Missing page.url() usage.");
        logs.push("  ↳ Use page.url() to read the current URL");
        return { passed: false, logs };
      }

      if (!hasAssertion) {
        logs.push("✗ ERROR: Missing expect() assertion.");
        logs.push("  ↳ Add at least one expect() assertion");
        return { passed: false, logs };
      }

      logs.push("✓ URL & Location tested correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "local-storage-seed",
    title: "Seeding Local Storage",
    description: "Seed localStorage before navigation to skip login or set initial state.",
    difficulty: "Intermediate",
    icon: HardDrive,
    initialCode: `test('Seeding Local Storage', async ({ page }) => {
  // TODO: Seed localStorage BEFORE navigating
  // Option 1: Use addInitScript (runs before any page script)
  // await page.addInitScript(() => {
  //   localStorage.setItem('session_token', 'seeded-token-123');
  // });

  // Option 2: Navigate then evaluate
  // await page.goto('/playground/auth');
  // await page.evaluate(() => {
  //   localStorage.setItem('session_token', 'seeded-token-123');
  // });
  // await page.reload();

  await page.goto('/playground/auth');

  // TODO: Assert the user appears logged in due to seeded token
  // const token = await page.evaluate(() => localStorage.getItem('session_token'));
  // expect(token).toBe('seeded-token-123');
});`,
    missionBrief: {
      context: "Seeding localStorage lets you bypass login flows and set up test preconditions. Use `addInitScript` to set values before page scripts run, or `evaluate` after navigation.",
      objectives: [
        { id: 1, text: "Use `addInitScript` or `evaluate` to set localStorage" },
        { id: 2, text: "Set `session_token` or similar key with `setItem`" },
        { id: 3, text: "Verify the seeded state after navigation" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasInitOrEval = /addInitScript|evaluate/.test(code);
      const hasLocalStorage = /localStorage/.test(code);
      const hasSetItemOrToken = /setItem|session_token/.test(code);

      logs.push("✓ Test started");

      if (!hasInitOrEval) {
        logs.push("✗ ERROR: Missing addInitScript or evaluate.");
        logs.push("  ↳ Use page.addInitScript() or page.evaluate() to seed storage");
        return { passed: false, logs };
      }

      if (!hasLocalStorage) {
        logs.push("✗ ERROR: Missing localStorage reference.");
        logs.push("  ↳ Access localStorage inside the script");
        return { passed: false, logs };
      }

      if (!hasSetItemOrToken) {
        logs.push("✗ ERROR: Missing setItem or session_token.");
        logs.push("  ↳ Use localStorage.setItem('session_token', ...)");
        return { passed: false, logs };
      }

      logs.push("✓ Local storage seeding configured correctly");
      return { passed: true, logs };
    }
  },
  {
    id: "parallel-work-queue",
    title: "Parallel Workers & Work Queue",
    description: "Configure parallel workers and test dynamic work item assignment from a shared queue.",
    difficulty: "Advanced",
    icon: Workflow,
    initialCode: `// playwright.config.ts excerpt:
// export default defineConfig({ workers: 3 });

test.describe('Work Queue Processing', () => {
  test('should start 3 workers and process all items', async ({ page }) => {
    await page.goto('/playground/queue');

    // Select 3 workers
    await page.getByTestId('select-worker-count').click();
    await page.getByRole('option', { name: '3' }).click();

    // Start workers
    await page.getByTestId('btn-start-workers').click();

    // Assert at least one item transitions to in-progress
    await expect(
      page.locator('[data-testid^="queue-status-"]', { hasText: 'in-progress' })
    ).toBeVisible();

    // Verify all 3 worker lanes are active
    await expect(page.getByTestId('worker-lane-1')).toBeVisible();
    await expect(page.getByTestId('worker-lane-2')).toBeVisible();
    await expect(page.getByTestId('worker-lane-3')).toBeVisible();

    // Wait for queue to complete (up to 30s for all 8 items)
    await expect(page.getByTestId('queue-complete')).toBeVisible({ timeout: 30000 });

    // Verify no pending items remain
    await expect(
      page.locator('[data-testid^="queue-status-"]', { hasText: 'pending' })
    ).toHaveCount(0);
  });

  test('should distribute work across 2 workers evenly', async ({ page }) => {
    await page.goto('/playground/queue');

    // Start with 2 workers
    await page.getByTestId('select-worker-count').click();
    await page.getByRole('option', { name: '2' }).click();
    await page.getByTestId('btn-start-workers').click();

    // Wait for all items to finish
    await expect(page.getByTestId('queue-complete')).toBeVisible({ timeout: 30000 });

    // Verify total completed across both workers = 8
    const w1 = await page.getByTestId('worker-completed-1').textContent();
    const w2 = await page.getByTestId('worker-completed-2').textContent();
    expect(Number(w1) + Number(w2)).toBe(8);
  });

  // TRY: Change worker count to 1 or 4 and observe the difference.
  // TRY: Add a test that clicks Reset and verifies all items return to pending.
});`,
    missionBrief: {
      context: "Parallel testing distributes test execution across multiple workers. In Playwright, configure `workers` in playwright.config.ts. This lab simulates a shared work queue where N workers dynamically pick items. The key challenge: asserting async, non-deterministic parallel behavior.",
      objectives: [
        { id: 1, text: "Configure worker count using `select-worker-count`" },
        { id: 2, text: "Start workers with `btn-start-workers`" },
        { id: 3, text: "Assert items transition through `in-progress` state" },
        { id: 4, text: "Verify worker lanes are visible" },
        { id: 5, text: "Wait for `queue-complete` to confirm all items processed" },
        { id: 6, text: "Assert total completed items across workers equals 8" }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasWorkerConfig = /workers\s*:\s*\d/.test(code) || /select-worker-count/.test(code);
      const hasStartBtn = /btn-start-workers/.test(code);
      const hasInProgress = /in-progress/.test(code);
      const hasQueueComplete = /queue-complete/.test(code);
      const hasWorkerLane = /worker-lane/.test(code);
      const hasCountAssertion = /toHaveCount\(0\)|pending.*0|worker-completed/.test(code);

      logs.push("✓ Test started");

      if (!hasWorkerConfig) {
        logs.push("✗ ERROR: Worker count not configured.");
        logs.push("  ↳ Use select-worker-count or set workers in config");
        return { passed: false, logs };
      }
      logs.push("✓ Worker count configured");

      if (!hasStartBtn) {
        logs.push("✗ ERROR: Workers not started.");
        logs.push("  ↳ Click btn-start-workers");
        return { passed: false, logs };
      }
      logs.push("✓ Workers started");

      if (!hasInProgress) {
        logs.push("✗ ERROR: No assertion for in-progress state.");
        logs.push("  ↳ Check that items transition to in-progress");
        return { passed: false, logs };
      }
      logs.push("✓ In-progress state checked");

      if (!hasQueueComplete) {
        logs.push("✗ ERROR: Missing queue completion assertion.");
        logs.push("  ↳ Wait for queue-complete element");
        return { passed: false, logs };
      }
      logs.push("✓ Queue completion verified");

      if (!hasWorkerLane) {
        logs.push("✗ ERROR: Worker lanes not verified.");
        logs.push("  ↳ Assert worker-lane-N visibility");
        return { passed: false, logs };
      }
      logs.push("✓ Worker lanes checked");

      if (!hasCountAssertion) {
        logs.push("✗ ERROR: No assertion that all items completed.");
        logs.push("  ↳ Assert pending count is 0 or total completed = 8");
        return { passed: false, logs };
      }
      logs.push("✓ All items confirmed complete");

      return { passed: true, logs };
    }
  }
];
