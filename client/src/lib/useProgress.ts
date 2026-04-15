import { useState, useEffect, useCallback } from "react";

// XP awarded per difficulty
const XP_TABLE: Record<string, number> = {
  Beginner: 100,
  Intermediate: 200,
  Advanced: 300,
};

// Level thresholds — level N requires LEVEL_THRESHOLDS[N] total XP
const LEVEL_THRESHOLDS = [
  0, 0, 200, 500, 1000, 1800, 2800, 4000, 5500, 7500, 10000,
  13000, 16500, 20500, 25000, 30000,
];

export interface LabCompletion {
  labId: string;
  module: "cypress" | "playwright" | "k6";
  difficulty: string;
  completedAt: string;
}

export interface ProgressData {
  completedLabs: LabCompletion[];
  totalXp: number;
}

const STORAGE_KEY = "qplay_progress";

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data — reset
  }
  return { completedLabs: [], totalXp: 0 };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 1;
}

export function getLevelProgress(xp: number): number {
  const level = getLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] || currentThreshold + 1000;
  const range = nextThreshold - currentThreshold;
  if (range <= 0) return 100;
  return Math.min(100, Math.round(((xp - currentThreshold) / range) * 100));
}

export function getXpForDifficulty(difficulty: string): number {
  return XP_TABLE[difficulty] || 100;
}

export function getBadges(data: ProgressData): string[] {
  const badges: string[] = [];
  const total = data.completedLabs.length;
  const cypress = data.completedLabs.filter(l => l.module === "cypress").length;
  const playwright = data.completedLabs.filter(l => l.module === "playwright").length;
  const advanced = data.completedLabs.filter(l => l.difficulty === "Advanced").length;

  if (total >= 1) badges.push("First Steps");
  if (total >= 10) badges.push("Quick Learner");
  if (total >= 25) badges.push("Lab Rat");
  if (total >= 50) badges.push("Completionist");
  if (cypress >= 10) badges.push("Cypress Pro");
  if (playwright >= 10) badges.push("Playwright Pro");
  if (advanced >= 5) badges.push("Advanced");
  if (advanced >= 15) badges.push("Elite");
  if (data.totalXp >= 10000) badges.push("10K Club");

  return badges;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProgress(loadProgress());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const completeLab = useCallback(
    (labId: string, module: "cypress" | "playwright" | "k6", difficulty: string) => {
      setProgress((prev) => {
        // Don't award XP twice for the same lab
        if (prev.completedLabs.some((l) => l.labId === labId && l.module === module)) {
          return prev;
        }
        const xp = getXpForDifficulty(difficulty);
        const updated: ProgressData = {
          completedLabs: [
            ...prev.completedLabs,
            { labId, module, difficulty, completedAt: new Date().toISOString() },
          ],
          totalXp: prev.totalXp + xp,
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const isLabCompleted = useCallback(
    (labId: string, module: "cypress" | "playwright" | "k6") => {
      return progress.completedLabs.some((l) => l.labId === labId && l.module === module);
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    const empty: ProgressData = { completedLabs: [], totalXp: 0 };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return {
    progress,
    completeLab,
    isLabCompleted,
    resetProgress,
    level: getLevel(progress.totalXp),
    levelProgress: getLevelProgress(progress.totalXp),
    badges: getBadges(progress),
  };
}
