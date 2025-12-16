import { Terminal, Code2, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

export interface Lab {
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

export const LABS: Lab[] = [
  {
    id: "basics",
    title: "k6 Scripting Basics",
    description: "Fix a broken load test script by correcting the endpoint and think time.",
    difficulty: "Beginner",
    icon: Code2,
    initialCode: `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  // TODO: Fix the endpoint URL
  // The correct endpoint is: https://api.algorisys.com/v1/kyc/init
  const res = http.get('https://api.algorisys.com/v1/wrong-url');

  // TODO: Add a check to ensure status is 200
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // TODO: Simulate user think time (1 second)
  sleep(0.1); 
}`,
    missionBrief: {
      context: "We are migrating from Playwright to k6 for high-concurrency load testing. Your task is to fix the broken k6 script.",
      objectives: [
        { id: 1, text: "The endpoint is incorrect. It should point to /v1/kyc/init." },
        { id: 2, text: "The sleep() duration is too short (0.1s). Realistic user think time is 1 second." }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      // Flexible matching for endpoint (allow http/https, trailing slash, quotes)
      const hasCorrectEndpoint = /['"]https?:\/\/api\.algorisys\.com\/v1\/kyc\/init\/?['"]/.test(code);
      // Flexible matching for sleep (allow sleep(1), sleep(1.0), sleep( 1 ))
      const hasSleep = /sleep\s*\(\s*1(\.0)?\s*\)/.test(code);
      
      logs.push("✓ Virtual Users initialized: 10");
      
      if (!hasCorrectEndpoint) {
        logs.push("✗ ERROR: Request failed. 404 Not Found (https://api.algorisys.com/v1/wrong-url)");
        logs.push("  ↳ check 'is status 200' failed");
        return { passed: false, logs };
      }

      logs.push("✓ GET https://api.algorisys.com/v1/kyc/init 200 OK");
      logs.push("✓ check 'is status 200' passed");

      if (!hasSleep) {
        logs.push("⚠ WARN: 'sleep' duration is too low. This creates unrealistic load.");
        logs.push("  ↳ Hint: Users typically pause for 1 second. Use sleep(1).");
        return { passed: false, logs };
      }

      logs.push("✓ User think time simulated: 1s");
      return { passed: true, logs };
    }
  },
  {
    id: "thresholds",
    title: "SLA Thresholds",
    description: "Define pass/fail criteria for your load test using Thresholds.",
    difficulty: "Intermediate",
    icon: ShieldCheck,
    initialCode: `import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '1m',
  // TODO: Add thresholds here
  // Requirement: 95% of requests must complete within 500ms
  // Requirement: Error rate must be less than 1%
  thresholds: {
    
  },
};

export default function () {
  http.get('https://api.algorisys.com/v1/kyc/ocr');
  sleep(1);
}`,
    missionBrief: {
      context: "Our SLA states that 95% of OCR requests must complete within 500ms, and errors must be < 1%. Configure k6 thresholds to enforce this.",
      objectives: [
        { id: 1, text: "Add a threshold for 'http_req_duration': ['p(95)<500']." },
        { id: 2, text: "Add a threshold for 'http_req_failed': ['rate<0.01']." }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      // Allow single/double quotes, whitespace
      const hasDurationThreshold = /['"]?http_req_duration['"]?\s*:\s*\[\s*['"]p\(95\)\s*<\s*500['"]\s*\]/.test(code);
      const hasErrorThreshold = /['"]?http_req_failed['"]?\s*:\s*\[\s*['"]rate\s*<\s*0\.01['"]\s*\]/.test(code);

      logs.push("✓ Virtual Users initialized: 50");
      logs.push("✓ Execution started...");

      if (!hasDurationThreshold) {
        logs.push("✗ ERROR: Missing or incorrect http_req_duration threshold.");
        logs.push("  ↳ Expected: 'p(95)<500'");
        return { passed: false, logs };
      }

      if (!hasErrorThreshold) {
        logs.push("✗ ERROR: Missing or incorrect http_req_failed threshold.");
        logs.push("  ↳ Expected: 'rate<0.01'");
        return { passed: false, logs };
      }

      logs.push("✓ Thresholds configured correctly.");
      logs.push("✓ http_req_duration ............: avg=120.42ms min=58.12ms med=118.34ms max=482.11ms p(90)=180.22ms p(95)=210.55ms");
      logs.push("✓ http_req_failed ..............: 0.00% ✓ 0 ✗ 500");
      return { passed: true, logs };
    }
  },
  {
    id: "scenarios",
    title: "Advanced Scenarios",
    description: "Model complex traffic patterns using k6 Scenarios (Ramping VUs).",
    difficulty: "Advanced",
    icon: Activity,
    initialCode: `import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // TODO: Replace simple 'vus' with 'scenarios'
  // We need a 'ramping-vus' executor
  // Stage 1: Ramp to 20 users over 30s
  // Stage 2: Stay at 20 users for 1m
  // Stage 3: Ramp down to 0 users over 30s
  vus: 1, 
  duration: '10s',
};

export default function () {
  http.get('https://api.algorisys.com/v1/search');
  sleep(1);
}`,
    missionBrief: {
      context: "A constant load is not realistic. We need to simulate a morning ramp-up. Configure a 'ramping-vus' scenario.",
      objectives: [
        { id: 1, text: "Define 'scenarios' in options." },
        { id: 2, text: "Use executor: 'ramping-vus'." },
        { id: 3, text: "Define the 3 stages (Ramp Up, Stay, Ramp Down)." }
      ]
    },
    validation: (code: string) => {
      const logs: string[] = [];
      const hasScenarios = /scenarios\s*:\s*\{/.test(code);
      const hasRampingExecutor = /executor\s*:\s*['"]ramping-vus['"]/.test(code);
      const hasStages = /stages\s*:\s*\[/.test(code);
      const hasTargets = /target\s*:\s*20/.test(code) && /target\s*:\s*0/.test(code);

      logs.push("✓ Configuration parsed.");

      if (!hasScenarios) {
        logs.push("✗ ERROR: 'scenarios' block missing in options.");
        return { passed: false, logs };
      }

      if (!hasRampingExecutor) {
        logs.push("✗ ERROR: Executor 'ramping-vus' not found.");
        return { passed: false, logs };
      }

      if (!hasStages || !hasTargets) {
        logs.push("✗ ERROR: Stages configuration incomplete. Check targets (20, 0).");
        return { passed: false, logs };
      }

      logs.push("✓ Scenario 'default' (ramping-vus) initialized.");
      logs.push("  ↳ [0s->30s] Ramping to 20 VUs");
      logs.push("  ↳ [30s->1m30s] Staying at 20 VUs");
      logs.push("  ↳ [1m30s->2m] Ramping down to 0 VUs");
      return { passed: true, logs };
    }
  }
];
