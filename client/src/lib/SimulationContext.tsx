import React, { createContext, useContext, useState, useEffect } from "react";

interface SimulationSettings {
  breakingPointRPS: number;
  baseLatencyMs: number;
  latencyMultiplier: number;
  spikeProbability: number;
  errorThresholdRPS: number;
}

interface SimulationContextType {
  settings: SimulationSettings;
  updateSettings: (newSettings: Partial<SimulationSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: SimulationSettings = {
  breakingPointRPS: 800,
  baseLatencyMs: 50,
  latencyMultiplier: 0.1,
  spikeProbability: 0.05,
  errorThresholdRPS: 800,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage if available, otherwise defaults
  const [settings, setSettings] = useState<SimulationSettings>(() => {
    const saved = localStorage.getItem("sim_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("sim_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SimulationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SimulationContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
