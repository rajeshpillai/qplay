import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity, MousePointerClick, Clock, Search, List, CheckSquare, Eye, Upload, Database, Globe, Layers, Repeat, Variable, Timer, Monitor, History, HardDrive, Box, Link, Play, Clipboard } from "lucide-react";

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
  }
];
